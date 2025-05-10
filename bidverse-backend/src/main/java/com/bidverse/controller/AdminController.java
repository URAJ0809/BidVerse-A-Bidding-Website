package com.bidverse.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List; // Added import

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bidverse.model.Bid;
import com.bidverse.model.Product;
import com.bidverse.repository.BidRepository;
import com.bidverse.repository.ProductRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}) // Ensure this includes your admin frontend origin
public class AdminController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BidRepository bidRepository;

    // GET /api/admin/products?userId=123
    // -> returns only the products for that admin
    @GetMapping("/products")
    public List<Product> getAdminProducts(@RequestParam Long userId) {
        return productRepository.findByOwnerId(userId);
    }

    // POST /api/admin/products?userId=123 (multipart)
    // -> create a product for that admin, sets ownerId, etc.
    @PostMapping(path = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addOwnerProduct(
        @RequestParam Long userId,
        @RequestParam("name") String name,
        @RequestParam("price") Double price,
        @RequestParam("description") String description,
        @RequestParam(value = "image", required = false) MultipartFile imageFile,
        @RequestParam(value = "endTime", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime // Added endTime
    ) throws IOException {

        // Build product
        Product product = new Product();
        product.setOwnerId(userId);
        product.setName(name);
        product.setPrice(price);
        product.setDescription(description);
        product.setStatus("AVAILABLE"); // Default status
        if (endTime != null && endTime.isAfter(LocalDateTime.now())) { // Ensure endTime is in the future
            product.setEndTime(endTime);
        }

        // If an image was uploaded, store it
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path filePath = Paths.get("uploads", fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, imageFile.getBytes());
            product.setImageUrl("/uploads/" + fileName);
        }

        // Save product
        Product saved = productRepository.save(product);
        return ResponseEntity.ok(saved);
    }

    // Modified: Re-list product, ensuring ownership
    @PutMapping("/products/{id}/relist")
    public ResponseEntity<?> relistProduct(@RequestParam Long userId, @PathVariable Long id, @RequestBody Product newData) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found with ID: " + id);
        }

        // Check ownership
        if (product.getOwnerId() == null || !product.getOwnerId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: You do not own this product.");
        }

        // Delete old bids
        List<Bid> oldBids = bidRepository.findByProductIdOrderByAmountDesc(id);
        for (Bid b : oldBids) {
            bidRepository.delete(b);
        }

        // Set product as AVAILABLE again
        product.setStatus("AVAILABLE");
        // Update endTime from newData if provided and is in the future
        if (newData.getEndTime() != null && newData.getEndTime().isAfter(LocalDateTime.now())) {
            product.setEndTime(newData.getEndTime());
        } else {
             // If no valid new end time is provided for relist, clear the old one or set a default
            product.setEndTime(null); // Or set a default, e.g., now + 7 days
        }
        // You might want to update other fields from newData as well, if applicable
        // e.g., product.setName(newData.getName()); if relisting can change name/price etc.
        
        Product updatedProduct = productRepository.save(product);
        return ResponseEntity.ok(updatedProduct);
    }

    // New: Get bids for a product owned by the admin
    @GetMapping("/products/{productId}/bids")
    public ResponseEntity<?> getBidsForOwnedProduct(@RequestParam Long userId, @PathVariable Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found with ID: " + productId);
        }

        // Check ownership
        if (product.getOwnerId() == null || !product.getOwnerId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: You do not own this product.");
        }

        List<Bid> bids = bidRepository.findByProductIdOrderByAmountDesc(productId);
        return ResponseEntity.ok(bids);
    }

    // New: Pause auction for a product owned by the admin
    @PutMapping("/products/{id}/pause")
    public ResponseEntity<?> pauseProductAuction(@RequestParam Long userId, @PathVariable Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found with ID: " + id);
        }
        if (product.getOwnerId() == null || !product.getOwnerId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: You do not own this product.");
        }
        if (!"AVAILABLE".equals(product.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product is not in AVAILABLE status to be paused. Current status: " + product.getStatus());
        }
        product.setStatus("PAUSED");
        Product updatedProduct = productRepository.save(product);
        return ResponseEntity.ok(updatedProduct);
    }

    // New: Resume auction for a product owned by the admin
    @PutMapping("/products/{id}/resume")
    public ResponseEntity<?> resumeProductAuction(
        @RequestParam Long userId,
        @PathVariable Long id,
        @RequestParam(value = "newEndTime", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newEndTime
    ) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found with ID: " + id);
        }
        if (product.getOwnerId() == null || !product.getOwnerId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: You do not own this product.");
        }
        if (!"PAUSED".equals(product.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product is not in PAUSED status to be resumed. Current status: " + product.getStatus());
        }

        product.setStatus("AVAILABLE");
        if (newEndTime != null && newEndTime.isAfter(LocalDateTime.now())) {
            product.setEndTime(newEndTime);
        } else if (product.getEndTime() == null || product.getEndTime().isBefore(LocalDateTime.now())) {
            // If no new valid end time is provided and old one is past/null,
            // auction resumes without a specific end time or frontend should enforce setting one.
            // For now, we'll clear it if no valid newEndTime is given and old one is invalid.
            product.setEndTime(null); // Or set a default future time.
        }
        // If product.getEndTime() was already set and is in the future, it will continue with that.

        Product updatedProduct = productRepository.save(product);
        return ResponseEntity.ok(updatedProduct);
    }
}
