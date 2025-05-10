import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Card, CardContent, Button, Grid, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, TextField, Stack } from '@mui/material'; // Added TextField, Stack
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CountdownTimer from '../CountdownTimer';

function ManageBids() {
  const { user, isAdmin } = useAuth();
  const [adminProducts, setAdminProducts] = useState([]);
  const [productBids, setProductBids] = useState({});
  const [editingRelistFor, setEditingRelistFor] = useState(null);
  const [relistEndTime, setRelistEndTime] = useState('');
  const [editingResumeFor, setEditingResumeFor] = useState(null);
  const [resumeEndTime, setResumeEndTime] = useState('');
  const [winningUsers, setWinningUsers] = useState({}); // Add this state

  const fetchAdminProductsCallback = useCallback(async () => {
    if (user && user.id && isAdmin()) {
      try {
        const res = await axios.get(`http://localhost:8080/api/admin/products?userId=${user.id}`);
        setAdminProducts(res.data);
      } catch (err) {
        console.error('Error fetching admin products:', err);
      }
    }
  }, [user, isAdmin]); // user.id is not needed if user object reference is stable

  useEffect(() => {
    fetchAdminProductsCallback();
  }, [fetchAdminProductsCallback]);

  const fetchBidsForProduct = async (productId) => {
    if (productBids[productId]) {
      setProductBids(prev => ({ ...prev, [productId]: null }));
      return;
    }
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/products/${productId}/bids?userId=${user.id}`);
      setProductBids(prev => ({ ...prev, [productId]: res.data }));
      
      // If the product is sold, fetch the winning user's information
      const product = adminProducts.find(p => p.id === productId);
      if (product?.status === 'SOLD' && res.data.length > 0) {
        const winningBid = res.data[0]; // Assuming bids are sorted by amount desc
        try {
          const userRes = await axios.get(`http://localhost:8080/api/users/${winningBid.userId}`);
          setWinningUsers(prev => ({ ...prev, [productId]: userRes.data }));
        } catch (err) {
          console.error('Error fetching winning user:', err);
        }
      }
    } catch (err) {
      console.error(`Error fetching bids for product ${productId}:`, err);
      alert(`Failed to fetch bids: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleAuctionAction = async (productId, action, newEndTimeValue = null) => {
    if (!user || !isAdmin()) return;

    let url;
    let method = 'put'; // Default method for admin actions like pause, resume, relist
    let payload = {};
    let queryParams = `?userId=${user.id}`; // userId always as query param for these admin actions

    switch (action) {
      case 'pause':
        url = `http://localhost:8080/api/admin/products/${productId}/pause`;
        break;
      case 'resume':
        url = `http://localhost:8080/api/admin/products/${productId}/resume`;
        if (newEndTimeValue) {
          const resumeDate = new Date(newEndTimeValue);
          if (resumeDate <= new Date()) {
            alert("Resume end time must be in the future.");
            return;
          }
          // Backend expects newEndTime as a query parameter for resume
          queryParams += `&newEndTime=${resumeDate.toISOString()}`;
        } else {
           // If backend requires newEndTime for resume, this path might lead to an error.
           // The backend logic now handles this: if old endTime passed, it will ask for new one.
           // Frontend can proactively ask if old endTime is invalid.
           const productToResume = adminProducts.find(p => p.id === productId);
           if (productToResume && (!productToResume.endTime || new Date(productToResume.endTime) <= new Date())) {
             alert("The auction's end time has passed or was not set. Please set a new end time to resume.");
             setEditingResumeFor(productId);
             setResumeEndTime(''); // Clear previous input
             return;
           }
           // If old endTime is still valid, backend will use it if newEndTime query param is not sent.
        }
        break;
      case 'relist':
        url = `http://localhost:8080/api/admin/products/${productId}/relist`;
        if (newEndTimeValue) {
          const relistDate = new Date(newEndTimeValue);
          if (relistDate <= new Date()) {
            alert("Relist end time must be in the future.");
            return;
          }
          payload = { endTime: relistDate.toISOString() }; // Relist expects endTime in body
        } else {
          alert("Please set an end time for relisting.");
          setEditingRelistFor(productId); // Show input for relist end time
          setRelistEndTime(''); // Clear previous input
          return;
        }
        break;
      case 'end-auction-now': // This uses the CatalogController endpoint
        url = `http://localhost:8080/api/catalog/${productId}/end-auction`;
        method = 'post'; // No userId needed for this public endpoint
        queryParams = ''; // Clear queryParams for this specific call
        break;
      default:
        console.error("Unknown auction action:", action);
        return;
    }

    try {
      // For PUT, queryParams are part of the URL. For POST, payload is the second arg.
      if (method === 'put') {
        await axios.put(`${url}${queryParams}`, payload);
      } else if (method === 'post') {
        await axios.post(url, payload);
      }
      alert(`Product auction ${action.replace(/-/g, ' ')} successful!`);
      fetchAdminProductsCallback();
      setProductBids(prev => ({ ...prev, [productId]: null }));
      if (action === 'relist') {
        setEditingRelistFor(null);
        setRelistEndTime('');
      }
      if (action === 'resume') {
        setEditingResumeFor(null);
        setResumeEndTime('');
      }
    } catch (err) {
      console.error(`Error performing action ${action} on product ${productId}:`, err);
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || "An unknown error occurred.";
      alert(`Failed to ${action.replace(/-/g, ' ')} auction: ${errorMsg}`);
    }
  };

  if (!user || !isAdmin()) {
    return <Typography sx={{ p: 3 }}>You must be an admin to view this page.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage My Product Bids & Auctions
      </Typography>

      {adminProducts.length === 0 ? (
        <Typography>You have not listed any products yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {adminProducts.map((product) => (
            <Grid item xs={12} md={6} lg={4} key={product.id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{product.name}</Typography>
                  <Typography variant="body1">Initial Price: ₹{product.price}</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>Status: <Typography component="span" sx={{ fontWeight: 'bold', color: product.status === 'AVAILABLE' ? 'green' : product.status === 'PAUSED' ? 'orange' : 'red' }}>{product.status}</Typography></Typography>
                  
                  {/* Add winning user display */}
                  {product.status === 'SOLD' && winningUsers[product.id] && (
                    <Typography variant="body2" sx={{ mb: 1, color: 'success.main' }}>
                      Won by: {winningUsers[product.id].username || winningUsers[product.id].email || `User #${winningUsers[product.id].id}`}
                    </Typography>
                  )}

                  {product.endTime && (
                    <Typography variant="body2" sx={{ mb: product.status === 'AVAILABLE' ? 0 : 1 }}>
                      Auction End: {new Date(product.endTime).toLocaleString()}
                    </Typography>
                  )}

                  {product.status === 'AVAILABLE' && product.endTime && (
                    <CountdownTimer
                      endTime={product.endTime}
                      status={product.status}
                      onEnd={() => {
                        console.log(`Auction for ${product.name} (ID: ${product.id}) ended naturally.`);
                        fetchAdminProductsCallback(); // Refresh products as status might change
                      }}
                    />
                  )}
                  
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    {product.status === 'AVAILABLE' && (
                      <>
                        <Button size="small" variant="outlined" color="secondary" onClick={() => handleAuctionAction(product.id, 'pause')}>Pause Auction</Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => handleAuctionAction(product.id, 'end-auction-now')}>End Auction Now</Button>
                      </>
                    )}
                    {product.status === 'PAUSED' && (
                      <>
                        <Button size="small" variant="outlined" color="primary" onClick={() => {
                            const productToResume = adminProducts.find(p => p.id === product.id);
                            if (productToResume && (!productToResume.endTime || new Date(productToResume.endTime) <= new Date())) {
                                setEditingResumeFor(product.id); // Show input if old time invalid
                                setResumeEndTime(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().substring(0, 16)); // Default to 3 days from now
                            } else {
                                handleAuctionAction(product.id, 'resume'); // Try resuming with old time if valid
                            }
                        }}>
                            Resume Auction
                        </Button>
                        {editingResumeFor === product.id && (
                            <Stack spacing={1} sx={{mt:1}}>
                                <TextField
                                    label="New Resume End Time"
                                    type="datetime-local"
                                    value={resumeEndTime}
                                    onChange={(e) => setResumeEndTime(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    size="small"
                                />
                                <Button size="small" variant="contained" onClick={() => handleAuctionAction(product.id, 'resume', resumeEndTime)}>Confirm Resume</Button>
                            </Stack>
                        )}
                      </>
                    )}
                    {(product.status === 'SOLD' || product.status === 'UNSOLD') && (
                      <>
                        <Button size="small" variant="outlined" color="success" onClick={() => {
                            setEditingRelistFor(product.id);
                            setRelistEndTime(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 16)); // Default to 7 days
                        }}>
                            Relist Product
                        </Button>
                        {editingRelistFor === product.id && (
                            <Stack spacing={1} sx={{mt:1}}>
                                <TextField
                                    label="Relist End Time"
                                    type="datetime-local"
                                    value={relistEndTime}
                                    onChange={(e) => setRelistEndTime(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    size="small"
                                />
                                <Button size="small" variant="contained" onClick={() => handleAuctionAction(product.id, 'relist', relistEndTime)}>Confirm Relist</Button>
                            </Stack>
                        )}
                      </>
                    )}
                  </Stack>
                </CardContent>
                <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    onClick={() => fetchBidsForProduct(product.id)}
                    aria-controls={`panel-${product.id}-content`}
                    id={`panel-${product.id}-header`}
                  >
                    <Typography>
                      {productBids[product.id] ? 'Hide Bids' : `View Bids (${productBids[product.id]?.length || '...'})`}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {productBids[product.id] && productBids[product.id].length > 0 ? (
                      <List dense>
                        {productBids[product.id].map(bid => (
                          <ListItem key={bid.id}>
                            <ListItemText 
                              primary={`Bidder ID: ${bid.userId} - Amount: ₹${bid.amount}`}
                              secondary={`Time: ${new Date(bid.timestamp).toLocaleString()}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : productBids[product.id] ? (
                      <Typography>No bids found for this product.</Typography>
                    ) : (
                      <Typography>Click to load bids.</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default ManageBids;
