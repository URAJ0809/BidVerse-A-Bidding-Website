package com.bidverse.repository;

import com.bidverse.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByUserId(Long userId);
    List<Bid> findByProductIdOrderByAmountDesc(Long productId);
}
