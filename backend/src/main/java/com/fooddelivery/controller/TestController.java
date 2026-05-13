package com.fooddelivery.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Test controller to verify role-based authorization.
 * Each endpoint is restricted to a specific role via {@code @PreAuthorize}.
 */
@RestController
@RequestMapping("/api/test")
public class TestController {

    /**
     * Public endpoint — accessible without authentication.
     */
    @GetMapping("/public")
    public ResponseEntity<String> publicEndpoint() {
        return ResponseEntity.ok("✅ This is a public endpoint. No authentication required.");
    }

    /**
     * Customer-only endpoint.
     */
    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<String> customerEndpoint() {
        return ResponseEntity.ok("🛒 Welcome, Customer! You have CUSTOMER access.");
    }

    /**
     * Admin-only endpoint.
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminEndpoint() {
        return ResponseEntity.ok("🔧 Welcome, Admin! You have ADMIN access.");
    }

    /**
     * Restaurant-owner-only endpoint.
     */
    @GetMapping("/owner")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    public ResponseEntity<String> ownerEndpoint() {
        return ResponseEntity.ok("🍽️ Welcome, Restaurant Owner! You have RESTAURANT_OWNER access.");
    }
}
