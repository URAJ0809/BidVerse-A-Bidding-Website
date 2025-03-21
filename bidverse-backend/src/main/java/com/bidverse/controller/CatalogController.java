package com.bidverse.controller;

import com.bidverse.model.Bid;
import com.bidverse.model.Product;
import com.bidverse.repository.BidRepository;
import com.bidverse.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.time.LocalDateTime;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/catalog")
@CrossOrigin(origins = "http://localhost:5173") // or 3000
public class CatalogController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BidRepository bidRepository;

    // GET /api/catalog -> returns ALL products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
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
            return ResponseEntity.badRequest().body("Auction ended. No more bids allowed.");
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
        if (bids.isEmpty()) {
            product.setStatus("UNSOLD");
            productRepository.save(product);
            return ResponseEntity.ok("No bids found. Auction ended with no winner.");
        }

        // Highest is first
        Bid highest = bids.get(0);

        product.setStatus("SOLD");
        productRepository.save(product);

        // Optionally add to cart or store winner info
        return ResponseEntity.ok("Auction ended. Winner userId=" + highest.getUserId()
            + " at price=" + highest.getAmount());
    }
}
