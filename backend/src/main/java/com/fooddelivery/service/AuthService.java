package com.fooddelivery.service;

import com.fooddelivery.dto.AuthResponse;
import com.fooddelivery.dto.LoginRequest;
import com.fooddelivery.dto.RegisterRequest;
import com.fooddelivery.entity.User;
import com.fooddelivery.exception.InvalidCredentialsException;
import com.fooddelivery.exception.ResourceAlreadyExistsException;
import com.fooddelivery.repository.UserRepository;
import com.fooddelivery.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service handling user registration and login.
 *
 * <h3>Register flow:</h3>
 * <ol>
 *   <li>Check if email is already taken → throw 409 if so.</li>
 *   <li>Encode the raw password with BCrypt.</li>
 *   <li>Persist the new {@link User} entity.</li>
 *   <li>Generate a JWT for the new user.</li>
 *   <li>Return an {@link AuthResponse} containing the token and user info.</li>
 * </ol>
 *
 * <h3>Login flow:</h3>
 * <ol>
 *   <li>Authenticate credentials via Spring Security's {@link AuthenticationManager}.</li>
 *   <li>If authentication fails → throw 401.</li>
 *   <li>Load the user from the database.</li>
 *   <li>Generate a JWT.</li>
 *   <li>Return an {@link AuthResponse}.</li>
 * </ol>
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Register a new user.
     *
     * @param request the registration details
     * @return an AuthResponse with JWT token and user info
     */
    public AuthResponse register(RegisterRequest request) {
        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException(
                    "User with email '" + request.getEmail() + "' already exists");
        }

        // Build and save user
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        userRepository.save(user);

        // Generate JWT
        String token = jwtService.generateToken(user);

        return buildAuthResponse(token, user);
    }

    /**
     * Authenticate an existing user.
     *
     * @param request the login credentials
     * @return an AuthResponse with JWT token and user info
     */
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Fetch user (authentication already confirmed the user exists)
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        // Generate JWT
        String token = jwtService.generateToken(user);

        return buildAuthResponse(token, user);
    }

    // ---- Helper ----

    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
