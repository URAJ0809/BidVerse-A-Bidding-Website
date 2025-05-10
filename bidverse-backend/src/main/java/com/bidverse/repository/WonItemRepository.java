package com.bidverse.repository;

import com.bidverse.model.WonItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WonItemRepository extends JpaRepository<WonItem, Long> {
    List<WonItem> findByUserId(Long userId);
}