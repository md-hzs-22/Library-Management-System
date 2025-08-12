package com.example.library.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.example.library.repository.UserRepository;
import com.example.library.model.User;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
  private final UserRepository repo;
  public UserController(UserRepository repo){ this.repo = repo; }

  @PostMapping
  public ResponseEntity<?> create(@RequestBody User u) {
    try {
      System.out.println("Creating/finding user: " + u.getName() + ", " + u.getPhone() + ", " + u.getEmail());
      
      // Validate input
      if (u.getName() == null || u.getName().trim().isEmpty()) {
        return ResponseEntity.badRequest().body("Name is required");
      }
      if (u.getPhone() == null || u.getPhone().trim().isEmpty()) {
        return ResponseEntity.badRequest().body("Phone is required");
      }

      // Clean input
      u.setName(u.getName().trim());
      u.setPhone(u.getPhone().trim());
      if (u.getEmail() != null) {
        u.setEmail(u.getEmail().trim());
      }

      // Check for existing user
      var existing = repo.findByNameAndPhone(u.getName(), u.getPhone());
      if (existing.isPresent()) {
        User existingUser = existing.get();
        System.out.println("Found existing user with ID: " + existingUser.getId());
        // Update email if changed
        if (u.getEmail() != null && !u.getEmail().equals(existingUser.getEmail())) {
          existingUser.setEmail(u.getEmail());
          return ResponseEntity.ok(repo.save(existingUser));
        }
        return ResponseEntity.ok(existingUser);
      }

      // Create new user
      System.out.println("Creating new user");
      User savedUser = repo.save(u);
      System.out.println("Created user with ID: " + savedUser.getId());
      return ResponseEntity.ok(savedUser);

    } catch (Exception e) {
      System.err.println("Error creating/finding user: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
    }
  }

  @GetMapping("/search")
  public ResponseEntity<?> search(@RequestParam String name, @RequestParam String phone, @RequestParam String email) {
    try {
      System.out.println("Searching for user: " + name + ", " + phone);
      if (name == null || name.trim().isEmpty() || phone == null || phone.trim().isEmpty()) {
        return ResponseEntity.badRequest().body("Name and phone are required");
      }
      
      var user = repo.findByNameAndPhone(name.trim(), phone.trim()).orElse(null);
      if (user != null) {
        System.out.println("Found user with ID: " + user.getId());
      } else {
        System.out.println("No user found, hence creating new one");
        User u = new User(name,email,phone);
        return create(u);
      }
      return ResponseEntity.ok(user);
    } catch (Exception e) {
      System.err.println("Error searching for user: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
    }
  }
}
