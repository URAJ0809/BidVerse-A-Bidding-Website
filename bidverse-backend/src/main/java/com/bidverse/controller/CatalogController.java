package com.bidverse.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;  // Add this import
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bidverse.model.Bid;
import com.bidverse.model.Product;
import com.bidverse.model.WonItem;
import com.bidverse.repository.BidRepository;
import com.bidverse.repository.ProductRepository;
import com.bidverse.repository.WonItemRepository;

@RestController
@RequestMapping("/api/catalog")
@CrossOrigin(origins = "http://localhost:5174")
public class CatalogController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BidRepository bidRepository;

    // GET /api/catalog -> returns ALL products
    @GetMapping
    public List<Product> getAllProducts() {
        List<Product> allProducts = productRepository.findAll();
        // Filter out sold items
        return allProducts.stream()
            .filter(product -> "AVAILABLE".equals(product.getStatus()))
            .collect(Collectors.toList());
    }

    // GET /api/catalog/{id} -> get single product
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productRepository.findById(id).orElse(null);
    }

    // GET /api/catalog/{productId}/bids -> fetch bids for a product
    @GetMapping("/{productId}/bids")
    public List<Bid> getBids(@PathVariable Long productId) {
        return bidRepository.findByProductIdOrderByAmountDesc(productId);
    }

    // POST /api/catalog (multipart) -> Add a product w/o ownerId
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product addProduct(
        @RequestParam("name") String name,
        @RequestParam("price") Double price,
        @RequestParam("description") String description,
        @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {

        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setDescription(description);

        // If an image file was uploaded, save it
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path filePath = Paths.get("uploads", fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, imageFile.getBytes());

            product.setImageUrl("/uploads/" + fileName);
        }

        // By default, status = "AVAILABLE"
        return productRepository.save(product);
    }

    // POST /api/catalog/{productId}/bids -> place a bid
    @PostMapping("/{productId}/bids")
    public ResponseEntity<?> placeBid(@PathVariable Long productId, @RequestBody Bid bidData) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body("Product not found");
        }

        // Check if product is sold or expired
        if (!"AVAILABLE".equals(product.getStatus())) {
            return ResponseEntity.badRequest().body("Bidding is closed for this product");
        }
        if (product.getEndTime() != null && LocalDateTime.now().isAfter(product.getEndTime())) {
            // Auction has ended, clear all bids and update product status
            List<Bid> existingBids = bidRepository.findByProductIdOrderByAmountDesc(productId);
            if (!existingBids.isEmpty()) {
                // Get the highest bid
                Bid highestBid = existingBids.get(0);
                // Clear all bids
                bidRepository.deleteAll(existingBids);
                // Update product status
                product.setStatus("SOLD");
                productRepository.save(product);
                return ResponseEntity.ok("Auction ended. Winner userId=" + highestBid.getUserId() 
                    + " at price=" + highestBid.getAmount());
            } else {
                // No bids were placed
                product.setStatus("UNSOLD");
                productRepository.save(product);
                return ResponseEntity.ok("Auction ended with no bids.");
            }
        }

        // Enforce min increment
        double highestSoFar = product.getPrice();
        List<Bid> existingBids = bidRepository.findByProductIdOrderByAmountDesc(productId);
        if (!existingBids.isEmpty()) {
            highestSoFar = existingBids.get(0).getAmount();
        }
        double minRequired = highestSoFar + 10;
        if (bidData.getAmount() < minRequired) {
            return ResponseEntity.badRequest().body("Your bid must be at least " + minRequired);
        }

        // Save the bid
        bidData.setProductId(productId);
        bidRepository.save(bidData);

        return ResponseEntity.ok("Bid placed successfully");
    }

    // POST /api/catalog/{productId}/end-auction -> end the auction
    // Add to existing CatalogController class
    @Autowired
    private WonItemRepository wonItemRepository;
    
    private void handleAuctionEnd(Product product, List<Bid> bids) {
        if (!bids.isEmpty()) {
            Bid winningBid = bids.get(0); // Highest bid
            
            // Create won item record
            WonItem wonItem = new WonItem();
            wonItem.setProductId(product.getId());
            wonItem.setUserId(winningBid.getUserId());
            wonItem.setWinningBid(winningBid.getAmount());
            wonItem.setWonAt(LocalDateTime.now());
            wonItem.setProductName(product.getName());
            wonItem.setProductImage(product.getImageUrl());
            
            wonItemRepository.save(wonItem);
        }
        
        // Update product status
        product.setStatus(bids.isEmpty() ? "UNSOLD" : "SOLD");
        productRepository.save(product);
    }
    
    // Update the existing end-auction endpoint
    @PostMapping("/{productId}/end-auction")
    public ResponseEntity<?> endAuction(@PathVariable Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body("Product not found");
        }
        if (!"AVAILABLE".equals(product.getStatus())) {
            return ResponseEntity.badRequest().body("Auction already ended or product is sold");
        }
    
        List<Bid> bids = bidRepository.findByProductIdOrderByAmountDesc(productId);
        handleAuctionEnd(product, bids);
    
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("status", product.getStatus());
        if (!bids.isEmpty()) {
            Bid highest = bids.get(0);
            response.put("winnerId", highest.getUserId());
            response.put("winningBid", highest.getAmount());
        }
    
        return ResponseEntity.ok(response);
    }
}
