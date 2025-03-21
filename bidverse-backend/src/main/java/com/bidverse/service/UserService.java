// src/main/java/com/bidverse/backend/service/UserService.java
package com.bidverse.service;

import com.bidverse.model.User;
import com.bidverse.repository.UserRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> findAll() {
        // This calls the repository's built-in .findAll()
        return userRepository.findAll();
    }

    public User registerUser(User user) {
        // e.g. check if user already exists by email or username
        // hash password if needed
        return userRepository.save(user);
    }

    public User login(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
