package com.bidverse.controller;

import com.bidverse.model.CartItem;
import com.bidverse.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    // GET /api/cart?userId=5
    @GetMapping
    public List<CartItem> getCartItems(@RequestParam Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    // POST /api/cart?userId=5 => if you want to add items to cart
    // or you might do a request body with item details
    @PostMapping
    public CartItem addCartItem(@RequestParam Long userId, @RequestBody CartItem item) {
        item.setUserId(userId);
        return cartItemRepository.save(item);
    }

    // DELETE /api/cart/123
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
        return ResponseEntity.ok("Item removed from cart");
    }

    @PostMapping("/add-bid-to-cart")
    public ResponseEntity<?> addBidToCart(@RequestParam Long userId, @RequestParam Long productId, @RequestBody CartItem cartItem) {
        // Check if the item is already in the cart
        List<CartItem> existingItems = cartItemRepository.findByUserId(userId);
        boolean alreadyInCart = existingItems.stream().anyMatch(item -> item.getId().equals(productId));

        if (alreadyInCart) {
            return ResponseEntity.badRequest().body("Item is already in the cart.");
        }

        // Add the item to the cart
        cartItem.setUserId(userId);
        cartItemRepository.save(cartItem);
        return ResponseEntity.ok("Item added to cart.");
    }

    @DeleteMapping("/remove-won-item")
    public ResponseEntity<?> removeWonItemFromCart(@RequestParam Long productId) {
        List<CartItem> itemsToRemove = cartItemRepository.findByProductId(productId);
        cartItemRepository.deleteAll(itemsToRemove);
        return ResponseEntity.ok("Won item removed from cart.");
    }
}
