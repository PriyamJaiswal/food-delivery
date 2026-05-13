package com.fooddelivery.controller;

import com.fooddelivery.dto.PaymentRequest;
import com.fooddelivery.dto.PaymentResponse;
import com.fooddelivery.dto.PaymentVerificationRequest;
import com.fooddelivery.dto.StripeCheckoutSessionResponse;
import com.fooddelivery.service.PaymentService;
import com.fooddelivery.service.StripeCheckoutService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for payment operations.
 *
 * <h3>Authorization:</h3>
 * <ul>
 *   <li><strong>Create / Verify</strong> — CUSTOMER only.</li>
 *   <li><strong>Get by ID</strong> — CUSTOMER or ADMIN.</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final StripeCheckoutService stripeCheckoutService;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    public PaymentController(PaymentService paymentService,
                             StripeCheckoutService stripeCheckoutService) {
        this.paymentService = paymentService;
        this.stripeCheckoutService = stripeCheckoutService;
    }

    /**
     * Create a payment record for an order.
     */
    @PostMapping("/create/{orderId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PaymentResponse> createPayment(
            @PathVariable Long orderId,
            @Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.createPayment(orderId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Verify/confirm a simulated online payment.
     */
    @PostMapping("/verify")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PaymentResponse> verifyPayment(
            @Valid @RequestBody PaymentVerificationRequest request) {
        PaymentResponse response = paymentService.verifyPayment(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get payment details by payment ID.
     */
    @GetMapping("/{paymentId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable String paymentId) {
        PaymentResponse response = paymentService.getPaymentByPaymentId(paymentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get payment details by Stripe Session ID.
     */
    @GetMapping("/session/{sessionId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<PaymentResponse> getPaymentBySessionId(@PathVariable String sessionId) {
        PaymentResponse response = paymentService.getPaymentByStripeSessionId(sessionId);
        return ResponseEntity.ok(response);
    }

    /**
     * Create a Stripe Checkout Session for an order.
     */
    @PostMapping("/checkout/{orderId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<StripeCheckoutSessionResponse> createStripeCheckoutSession(
            @PathVariable Long orderId) {
        StripeCheckoutSessionResponse response = stripeCheckoutService.createCheckoutSession(orderId);
        return ResponseEntity.ok(response);
    }

    /**
     * Stripe webhook handler to receive events asynchronously.
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
            stripeCheckoutService.processWebhookEvent(event);
            return ResponseEntity.ok("Success");
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Signature verification failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Webhook handling error: " + e.getMessage());
        }
    }
}
