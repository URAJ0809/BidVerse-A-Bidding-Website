package com.bidverse.controller;

import com.bidverse.model.Bid;
import com.bidverse.model.User;
import com.bidverse.model.WonItem;
import com.bidverse.repository.BidRepository;
import com.bidverse.repository.UserRepository;
import com.bidverse.repository.WonItemRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})  // or 3000 if CRA
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WonItemRepository wonItemRepository;

    @Autowired
    private BidRepository bidRepository;

    // POST /api/users/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // e.g. user.getRole() might be "admin" or "user"

        // 1. Check if email is already in use
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        // 2. Check if username is already in use
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username already in use");
        }

        // If user.role is not set from the frontend, it defaults to "user"
        // If you only want certain people to be admin, you can override or check logic here

        // 3. Save user
        User saved = userRepository.save(user);

        // Return the newly created user (including role)
        return ResponseEntity.ok(saved);
    }

    // POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        // 1. Look up user by username
        User user = userRepository.findByUsername(username);
        if (user == null) {
            // user doesn't exist
            return ResponseEntity.status(404).body("User not found");
        }

        // 2. Check password
        if (!user.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("Wrong password");
        }

        // 3. Return user (including role)
        return ResponseEntity.ok(user);
    }

    // POST /api/users/forgot-password
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        // 1. Look up user by email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("No user found with that email");
        }

        // 2. Generate a reset token or link (skipped)
        // 3. Possibly send an email with reset instructions (skipped)
        return ResponseEntity.ok("Reset link sent to " + email);
    }

    // GET /api/users/{userId}/won-items
    @GetMapping("/{userId}/won-items")
    public ResponseEntity<?> getWonItems(@PathVariable Long userId) {
        List<WonItem> wonItems = wonItemRepository.findByUserId(userId);
        return ResponseEntity.ok(wonItems); // Always return a list, even if empty
    }

    // GET /api/users/{userId}/my-bids
    @GetMapping("/{userId}/my-bids")
    public ResponseEntity<?> getUserBids(@PathVariable Long userId) {
        List<Bid> userBids = bidRepository.findByUserId(userId);
        return ResponseEntity.ok(userBids); // Always return a list, even if empty
    }

    // DELETE /api/users/{userId}/won-items
    @DeleteMapping("/{userId}/won-items")
    public ResponseEntity<?> clearWonItems(@PathVariable Long userId) {
        List<WonItem> wonItems = wonItemRepository.findByUserId(userId);
        if (wonItems.isEmpty()) {
            return ResponseEntity.badRequest().body("No won items found for the user.");
        }
        wonItemRepository.deleteAll(wonItems);
        return ResponseEntity.ok("Won items cleared successfully.");
    }
}
