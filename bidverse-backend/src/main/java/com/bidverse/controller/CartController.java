package com.bidverse.controller;

import com.bidverse.model.Bid;
import com.bidverse.model.CartItem;
import com.bidverse.model.Product;
import com.bidverse.repository.BidRepository;
import com.bidverse.repository.CartItemRepository;
import com.bidverse.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private ProductRepository productRepository;

    // GET /api/cart?userId=5
    @GetMapping
    public List<CartItem> getCartItems(@RequestParam Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        List<Bid> userBids = bidRepository.findByUserId(userId);

        for (Bid bid : userBids) {
            boolean alreadyInCart = cartItems.stream()
                .anyMatch(item -> item.getProductId().equals(bid.getProductId()));

            if (!alreadyInCart) {
                CartItem cartItem = new CartItem();
                cartItem.setUserId(userId);
                cartItem.setProductId(bid.getProductId());

                Product product = productRepository.findById(bid.getProductId()).orElse(null);
                if (product != null) {
                    cartItem.setName(product.getName());
                    cartItem.setImageUrl(product.getImageUrl());
                    cartItem.setPrice(bid.getAmount());
                } else {
                    cartItem.setName("Unknown Product");
                    cartItem.setImageUrl("/placeholder.jpg");
                    cartItem.setPrice(bid.getAmount());
                }

                cartItem.setBidded(true); // Add a flag to indicate this item is associated with a bid
                cartItems.add(cartItem);
            }
        }

        return cartItems;
    }

    // POST /api/cart?userId=5 => if you want to add items to cart
    // or you might do a request body with item details
    @PostMapping
    public CartItem addCartItem(@RequestParam Long userId, @RequestBody CartItem item) {
        item.setUserId(userId);
        return cartItemRepository.save(item);
    }

    // DELETE /api/cart/123
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
        return ResponseEntity.ok("Item removed from cart");
    }

    @PostMapping("/add-bid-to-cart")
    public ResponseEntity<?> addBidToCart(@RequestParam Long userId, @RequestParam Long productId, @RequestBody CartItem cartItem) {
        // Check if the item is already in the cart
        List<CartItem> existingItems = cartItemRepository.findByUserId(userId);
        boolean alreadyInCart = existingItems.stream().anyMatch(item -> item.getId().equals(productId));

        if (alreadyInCart) {
            return ResponseEntity.badRequest().body("Item is already in the cart.");
        }

        // Add the item to the cart
        cartItem.setUserId(userId);
        cartItemRepository.save(cartItem);
        return ResponseEntity.ok("Item added to cart.");
    }

    @DeleteMapping("/remove-won-item")
    public ResponseEntity<?> removeWonItemFromCart(@RequestParam Long productId) {
        List<CartItem> itemsToRemove = cartItemRepository.findByProductId(productId);
        cartItemRepository.deleteAll(itemsToRemove);
        return ResponseEntity.ok("Won item removed from cart.");
    }

    // Remove items from cart and bids when auction ends
    @DeleteMapping("/remove-ended-auctions")
    public ResponseEntity<?> removeEndedAuctions() {
        // Fetch all products where the auction has ended
        List<Product> endedProducts = productRepository.findByAuctionEnded(true);

        for (Product product : endedProducts) {
            // Remove from cart
            List<CartItem> cartItemsToRemove = cartItemRepository.findByProductId(product.getId());
            cartItemRepository.deleteAll(cartItemsToRemove);

            // Remove from bids
            List<Bid> bidsToRemove = bidRepository.findByProductId(product.getId());
            bidRepository.deleteAll(bidsToRemove);
        }

        return ResponseEntity.ok("Ended auctions removed from cart and bids.");
    }
}
