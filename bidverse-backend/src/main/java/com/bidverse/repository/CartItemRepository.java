package com.bidverse.repository;

import com.bidverse.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    List<CartItem> findByProductId(Long productId); // This will now work
}
