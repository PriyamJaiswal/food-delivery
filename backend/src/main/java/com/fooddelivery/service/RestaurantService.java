package com.fooddelivery.service;

import com.fooddelivery.dto.RestaurantRequest;
import com.fooddelivery.dto.RestaurantResponse;
import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.entity.User;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.exception.UnauthorizedOperationException;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

/**
 * Service handling restaurant CRUD operations.
 *
 * <h3>Authorization logic:</h3>
 * <ul>
 *   <li><strong>Create</strong> — only RESTAURANT_OWNER (enforced by {@code @PreAuthorize} on the controller).</li>
 *   <li><strong>Update / Delete</strong> — only the owner of the specific restaurant.</li>
 *   <li><strong>Read</strong> — publicly accessible.</li>
 * </ul>
 */
@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public RestaurantService(RestaurantRepository restaurantRepository,
                             UserRepository userRepository) {
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    /**
     * Create a new restaurant. The currently authenticated user becomes the owner.
     */
    public RestaurantResponse createRestaurant(RestaurantRequest request) {
        User owner = getAuthenticatedUser();

        Restaurant restaurant = Restaurant.builder()
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .phone(request.getPhone())
                .imageUrl(request.getImageUrl())
                .openingTime(LocalTime.parse(request.getOpeningTime()))
                .closingTime(LocalTime.parse(request.getClosingTime()))
                .active(true)
                .owner(owner)
                .build();

        Restaurant saved = restaurantRepository.save(restaurant);
        return mapToResponse(saved);
    }

    /**
     * Get all restaurants.
     */
    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Get a single restaurant by ID.
     */
    public RestaurantResponse getRestaurantById(Long id) {
        Restaurant restaurant = findRestaurantOrThrow(id);
        return mapToResponse(restaurant);
    }

    /**
     * Update an existing restaurant. Only the owner can update.
     */
    public RestaurantResponse updateRestaurant(Long id, RestaurantRequest request) {
        Restaurant restaurant = findRestaurantOrThrow(id);
        verifyOwnership(restaurant);

        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setAddress(request.getAddress());
        restaurant.setPhone(request.getPhone());
        restaurant.setImageUrl(request.getImageUrl());
        restaurant.setOpeningTime(LocalTime.parse(request.getOpeningTime()));
        restaurant.setClosingTime(LocalTime.parse(request.getClosingTime()));

        Restaurant updated = restaurantRepository.save(restaurant);
        return mapToResponse(updated);
    }

    /**
     * Delete a restaurant. Only the owner can delete.
     */
    public void deleteRestaurant(Long id) {
        Restaurant restaurant = findRestaurantOrThrow(id);
        verifyOwnership(restaurant);
        restaurantRepository.delete(restaurant);
    }

    // ---- Internal helpers ----

    private Restaurant findRestaurantOrThrow(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Restaurant not found with id: " + id));
    }

    private void verifyOwnership(Restaurant restaurant) {
        User currentUser = getAuthenticatedUser();
        if (!restaurant.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedOperationException(
                    "You are not the owner of this restaurant");
        }
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated user not found"));
    }

    private RestaurantResponse mapToResponse(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .address(restaurant.getAddress())
                .phone(restaurant.getPhone())
                .imageUrl(restaurant.getImageUrl())
                .openingTime(restaurant.getOpeningTime())
                .closingTime(restaurant.getClosingTime())
                .active(restaurant.isActive())
                .ownerName(restaurant.getOwner().getFullName())
                .ownerEmail(restaurant.getOwner().getEmail())
                .averageRating(restaurant.getAverageRating())
                .totalReviews(restaurant.getTotalReviews())
                .createdAt(restaurant.getCreatedAt())
                .build();
    }
}
