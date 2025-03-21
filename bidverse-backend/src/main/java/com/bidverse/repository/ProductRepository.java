package com.bidverse.repository;

import com.bidverse.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Return only the products that belong to a specific owner
    List<Product> findByOwnerId(Long ownerId);
}
