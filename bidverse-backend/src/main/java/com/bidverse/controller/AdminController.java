package com.bidverse.controller;

import com.bidverse.model.Product;
import com.bidverse.repository.ProductRepository;
import com.bidverse.model.Bid;
import com.bidverse.repository.BidRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
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
        @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {

        // Build product
        Product product = new Product();
        product.setOwnerId(userId);
        product.setName(name);
        product.setPrice(price);
        product.setDescription(description);
        product.setStatus("AVAILABLE");

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

    // Example: re-list product
    @PutMapping("/products/{id}/relist")
    public Product relistProduct(@PathVariable Long id, @RequestBody Product newData) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        // Delete old bids
        List<Bid> oldBids = bidRepository.findByProductIdOrderByAmountDesc(id);
        for (Bid b : oldBids) {
            bidRepository.delete(b);
        }

        // Set product as AVAILABLE again
        product.setStatus("AVAILABLE");
        // Update endTime from newData if needed
        product.setEndTime(newData.getEndTime());
        productRepository.save(product);
        return product;
    }
}
