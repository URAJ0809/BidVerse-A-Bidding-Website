package com.bidverse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class PasswordController {

    // POST /api/forgot-password
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        // 1. Look up user by email in the database (UserRepository, etc.)
        // 2. Generate a reset token or link
        // 3. Possibly send an email with the reset instructions
        // 4. Return a response
        return ResponseEntity.ok("Reset link sent to " + email);
    }
}
