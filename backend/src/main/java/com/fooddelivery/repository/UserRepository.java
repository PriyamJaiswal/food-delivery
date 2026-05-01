package com.fooddelivery.repository;

import com.fooddelivery.entity.Role;
import com.fooddelivery.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link User} entities.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their email address.
     *
     * @param email the email to search for
     * @return an Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check whether a user with the given email already exists.
     *
     * @param email the email to check
     * @return true if a user with this email exists
     */
    boolean existsByEmail(String email);

    // ---- Admin queries ----

    /**
     * Search users by name or email (case-insensitive) with pagination.
     */
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<User> searchUsers(@Param("search") String search, Pageable pageable);

    /**
     * Find users by role with pagination.
     */
    Page<User> findByRole(Role role, Pageable pageable);

    // ---- Analytics queries ----

    long countByRole(Role role);

    long countByCreatedAtAfter(LocalDateTime since);

    /**
     * Count distinct customers who have placed at least one order.
     */
    @Query("SELECT COUNT(DISTINCT o.user.id) FROM Order o")
    long countActiveCustomers();
}
