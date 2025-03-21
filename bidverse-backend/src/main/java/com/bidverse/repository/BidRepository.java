package com.bidverse.repository;

import com.bidverse.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {

    // Return bids for a given product, sorted by amount descending
    List<Bid> findByProductIdOrderByAmountDesc(Long productId);
}
