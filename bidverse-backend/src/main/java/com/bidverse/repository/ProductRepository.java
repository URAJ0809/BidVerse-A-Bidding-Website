package com.bidverse.repository;

// src/main/java/com/bidverse/repository/ProductRepository.java

import com.bidverse.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // You can add custom queries if needed
}
