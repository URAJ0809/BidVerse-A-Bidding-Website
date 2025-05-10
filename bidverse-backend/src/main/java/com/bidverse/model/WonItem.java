package com.bidverse.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "won_items")
public class WonItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long productId;
    private Long userId;
    private Double winningBid;
    private LocalDateTime wonAt;
    private String productName;
    private String productImage;
    
    // Default constructor
    public WonItem() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Double getWinningBid() { return winningBid; }
    public void setWinningBid(Double winningBid) { this.winningBid = winningBid; }
    
    public LocalDateTime getWonAt() { return wonAt; }
    public void setWonAt(LocalDateTime wonAt) { this.wonAt = wonAt; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }
}