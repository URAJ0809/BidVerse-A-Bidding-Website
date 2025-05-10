package com.bidverse.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bidverse.model.WonItem;

public interface WonItemRepository extends JpaRepository<WonItem, Long> {
    // Add custom query methods if needed
}