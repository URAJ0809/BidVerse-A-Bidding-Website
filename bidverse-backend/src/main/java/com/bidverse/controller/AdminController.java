package com.bidverse.controller;

import com.bidverse.model.Bid;
import com.bidverse.model.Product;
import com.bidverse.repository.BidRepository;
import com.bidverse.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    // POST /api/admin/products
    // Allows admin to add product with an endTime
    @PostMapping("/products")
    public Product addProduct(@RequestBody Product productData) {
        // e.g. productData has name, price, description, endTime, imageUrl
        productData.setStatus("AVAILABLE");
        return productRepository.save(productData);
    }

    // PUT /api/admin/products/{id}/relist
    // Clears old bids, sets status=AVAILABLE, sets new endTime
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

        // Set product as AVAILABLE
        product.setStatus("AVAILABLE");
        // Update endTime from the newData (e.g. 24 hours from now)
        product.setEndTime(newData.getEndTime());
        productRepository.save(product);
        return product;
    }
}
