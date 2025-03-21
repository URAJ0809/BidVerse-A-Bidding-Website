package com.bidverse.controller;

// src/main/java/com/bidverse/controller/CatalogController.java

import com.bidverse.model.Bid;
import com.bidverse.model.Product;
import com.bidverse.repository.BidRepository;
import com.bidverse.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.io.IOException;

@RestController
@RequestMapping("/api/catalog")
@CrossOrigin(origins = "http://localhost:5173") // or 3000
public class CatalogController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BidRepository bidRepository;

    // GET /api/catalog
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // GET /api/catalog/{id}
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @GetMapping("/{productId}/bids")
    public List<Bid> getBids(@PathVariable Long productId) {
        // Return all bids for the product, sorted by amount desc if you want:
        return bidRepository.findByProductIdOrderByAmountDesc(productId);
    }

    // POST /api/catalog with multipart data
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product addProduct(
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {

        // 1. Create a Product entity
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setDescription(description);

        // 2. If an image file was uploaded, save it locally
        if (imageFile != null && !imageFile.isEmpty()) {
            // e.g., store in "uploads/" folder in your project
            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path filePath = Paths.get("uploads", fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, imageFile.getBytes());

            // store the local path in product.imageUrl
            product.setImageUrl("/uploads/" + fileName);
        }

        // 3. Save product in DB
        return productRepository.save(product);
    }

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
        // If current time is after endTime, no more bids
        if (product.getEndTime() != null && LocalDateTime.now().isAfter(product.getEndTime())) {
            return ResponseEntity.badRequest().body("Auction ended. No more bids allowed.");
        }

        // existing min increment logic
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
        Bid newBid = new Bid();
        newBid.setUserId(bidData.getUserId());
        newBid.setProductId(productId);
        newBid.setAmount(bidData.getAmount());
        bidRepository.save(newBid);

        return ResponseEntity.ok("Bid placed successfully");
    }

    // 2. End Auction: pick highest bid, mark product as SOLD
    @PostMapping("/{productId}/end-auction")
    public ResponseEntity<?> endAuction(@PathVariable Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body("Product not found");
        }

        if (!"AVAILABLE".equals(product.getStatus())) {
            return ResponseEntity.badRequest().body("Auction already ended or product is sold");
        }

        // find all bids desc
        List<Bid> bids = bidRepository.findByProductIdOrderByAmountDesc(productId);
        if (bids.isEmpty()) {
            // no bids, mark product as unsold or remain available
            product.setStatus("UNSOLD");
            productRepository.save(product);
            return ResponseEntity.ok("No bids found. Auction ended with no winner.");
        }

        // highest is first
        Bid highest = bids.get(0);

        // mark product as SOLD
        product.setStatus("SOLD");
        productRepository.save(product);

        // If you want to add to cart or store the winning info, do so here

        return ResponseEntity.ok("Auction ended. Winner userId=" + highest.getUserId()
                + " at price=" + highest.getAmount());
    }
}
