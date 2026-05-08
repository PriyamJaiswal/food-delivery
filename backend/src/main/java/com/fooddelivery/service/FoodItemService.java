package com.fooddelivery.service;

import com.fooddelivery.dto.FoodItemRequest;
import com.fooddelivery.dto.FoodItemResponse;
import com.fooddelivery.entity.FoodItem;
import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.entity.User;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.exception.UnauthorizedOperationException;
import com.fooddelivery.repository.FoodItemRepository;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service handling food item CRUD operations.
 *
 * <h3>Authorization logic:</h3>
 * <ul>
 *   <li><strong>Create / Update / Delete</strong> — only the owner of the parent restaurant.</li>
 *   <li><strong>Read</strong> — publicly accessible.</li>
 * </ul>
 */
@Service
public class FoodItemService {

    private final FoodItemRepository foodItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public FoodItemService(FoodItemRepository foodItemRepository,
                           RestaurantRepository restaurantRepository,
                           UserRepository userRepository) {
        this.foodItemRepository = foodItemRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    /**
     * Create a new food item. The authenticated user must own the restaurant.
     */
    public FoodItemResponse createFoodItem(FoodItemRequest request) {
        Restaurant restaurant = findRestaurantOrThrow(request.getRestaurantId());
        verifyRestaurantOwnership(restaurant);

        FoodItem foodItem = FoodItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .available(request.isAvailable())
                .veg(request.isVeg())
                .category(request.getCategory())
                .restaurant(restaurant)
                .build();

        FoodItem saved = foodItemRepository.save(foodItem);
        return mapToResponse(saved);
    }

    /**
     * Get all food items.
     */
    public List<FoodItemResponse> getAllFoodItems() {
        return foodItemRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Get a single food item by ID.
     */
    public FoodItemResponse getFoodItemById(Long id) {
        FoodItem foodItem = findFoodItemOrThrow(id);
        return mapToResponse(foodItem);
    }

    /**
     * Get all food items belonging to a specific restaurant.
     */
    public List<FoodItemResponse> getFoodItemsByRestaurantId(Long restaurantId) {
        // Verify the restaurant exists
        findRestaurantOrThrow(restaurantId);

        return foodItemRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Update a food item. Only the owner of the parent restaurant can update.
     */
    public FoodItemResponse updateFoodItem(Long id, FoodItemRequest request) {
        FoodItem foodItem = findFoodItemOrThrow(id);
        verifyRestaurantOwnership(foodItem.getRestaurant());

        // If the restaurantId changed, verify ownership of the new restaurant too
        if (!foodItem.getRestaurant().getId().equals(request.getRestaurantId())) {
            Restaurant newRestaurant = findRestaurantOrThrow(request.getRestaurantId());
            verifyRestaurantOwnership(newRestaurant);
            foodItem.setRestaurant(newRestaurant);
        }

        foodItem.setName(request.getName());
        foodItem.setDescription(request.getDescription());
        foodItem.setPrice(request.getPrice());
        foodItem.setImageUrl(request.getImageUrl());
        foodItem.setAvailable(request.isAvailable());
        foodItem.setVeg(request.isVeg());
        foodItem.setCategory(request.getCategory());

        FoodItem updated = foodItemRepository.save(foodItem);
        return mapToResponse(updated);
    }

    /**
     * Delete a food item. Only the owner of the parent restaurant can delete.
     */
    public void deleteFoodItem(Long id) {
        FoodItem foodItem = findFoodItemOrThrow(id);
        verifyRestaurantOwnership(foodItem.getRestaurant());
        foodItemRepository.delete(foodItem);
    }

    // ---- Internal helpers ----

    private FoodItem findFoodItemOrThrow(Long id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Food item not found with id: " + id));
    }

    private Restaurant findRestaurantOrThrow(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Restaurant not found with id: " + id));
    }

    private void verifyRestaurantOwnership(Restaurant restaurant) {
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

    private FoodItemResponse mapToResponse(FoodItem foodItem) {
        return FoodItemResponse.builder()
                .id(foodItem.getId())
                .name(foodItem.getName())
                .description(foodItem.getDescription())
                .price(foodItem.getPrice())
                .imageUrl(foodItem.getImageUrl())
                .available(foodItem.isAvailable())
                .veg(foodItem.isVeg())
                .category(foodItem.getCategory().name())
                .restaurantId(foodItem.getRestaurant().getId())
                .restaurantName(foodItem.getRestaurant().getName())
                .createdAt(foodItem.getCreatedAt())
                .build();
    }
}
