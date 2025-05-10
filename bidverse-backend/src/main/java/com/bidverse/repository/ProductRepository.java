package com.bidverse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bidverse.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Return only the products that belong to a specific owner
    List<Product> findByOwnerId(Long ownerId);
}
