package com.fooddelivery.service;

import com.fooddelivery.dto.StripeCheckoutSessionResponse;
import com.fooddelivery.entity.Order;
import com.fooddelivery.entity.OrderItem;
import com.fooddelivery.entity.Payment;
import com.fooddelivery.entity.PaymentMethod;
import com.fooddelivery.entity.PaymentStatus;
import com.fooddelivery.entity.User;
import com.fooddelivery.exception.InvalidPaymentException;
import com.fooddelivery.exception.OrderNotFoundException;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.exception.UnauthorizedOrderAccessException;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.repository.PaymentRepository;
import com.fooddelivery.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.fooddelivery.entity.OrderStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class StripeCheckoutService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    public StripeCheckoutService(OrderRepository orderRepository,
                                 PaymentRepository paymentRepository,
                                 UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }

    public StripeCheckoutSessionResponse createCheckoutSession(Long orderId) {
        User user = getAuthenticatedUser();

        // 1. Order must exist
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));

        // 2. User must own order
        if (!order.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedOrderAccessException("You do not have permission to pay for this order");
        }

        // 3. Order must not already be paid
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw new InvalidPaymentException("Order has already been paid: " + order.getOrderNumber());
        }

        // Configure Stripe API key
        Stripe.apiKey = stripeSecretKey;

        // Build Stripe line items from OrderItems
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
        for (OrderItem item : order.getOrderItems()) {
            SessionCreateParams.LineItem.PriceData.ProductData productData =
                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName(item.getFoodItem().getName())
                            .build();

            SessionCreateParams.LineItem.PriceData priceData =
                    SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("inr")
                            .setUnitAmount(item.getPrice().multiply(new BigDecimal("100")).longValue())
                            .setProductData(productData)
                            .build();

            SessionCreateParams.LineItem lineItem =
                    SessionCreateParams.LineItem.builder()
                            .setQuantity((long) item.getQuantity())
                            .setPriceData(priceData)
                            .build();

            lineItems.add(lineItem);
        }

        // In case there are no items (safety fallback)
        if (lineItems.isEmpty()) {
            SessionCreateParams.LineItem.PriceData.ProductData productData =
                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName("Order #" + order.getOrderNumber())
                            .build();

            SessionCreateParams.LineItem.PriceData priceData =
                    SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("inr")
                            .setUnitAmount(order.getTotalAmount().multiply(new BigDecimal("100")).longValue())
                            .setProductData(productData)
                            .build();

            SessionCreateParams.LineItem lineItem =
                    SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(priceData)
                            .build();

            lineItems.add(lineItem);
        }

        // Success and Cancel URLs
        String successUrl = "http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}";
        String cancelUrl = "http://localhost:5173/payment/cancel";

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addAllLineItem(lineItems)
                .putMetadata("orderId", String.valueOf(order.getId()))
                .putMetadata("orderNumber", order.getOrderNumber())
                .setPaymentIntentData(
                        SessionCreateParams.PaymentIntentData.builder()
                                .putMetadata("orderId", String.valueOf(order.getId()))
                                .putMetadata("orderNumber", order.getOrderNumber())
                                .build()
                )
                .build();

        try {
            Session session = Session.create(params);

            // Retrieve or build payment entity
            Payment payment = paymentRepository.findByOrderId(orderId)
                    .orElseGet(() -> Payment.builder()
                            .paymentId(generatePaymentId())
                            .order(order)
                            .paymentMethod(PaymentMethod.ONLINE_PAYMENT)
                            .amount(order.getTotalAmount())
                            .build());

            // Save the Stripe Session ID & update status to pending
            payment.setStripeSessionId(session.getId());
            payment.setPaymentStatus(PaymentStatus.PENDING);
            payment.setPaymentMethod(PaymentMethod.ONLINE_PAYMENT);
            paymentRepository.save(payment);

            return StripeCheckoutSessionResponse.builder()
                    .sessionId(session.getId())
                    .sessionUrl(session.getUrl())
                    .build();

        } catch (StripeException e) {
            throw new InvalidPaymentException("Stripe checkout session creation failed: " + e.getMessage());
        }
    }

    private String generatePaymentId() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uniquePart = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "PAY-" + datePart + "-" + uniquePart;
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new ResourceNotFoundException("No active authentication session");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    public void processWebhookEvent(Event event) {
        String eventType = event.getType();

        if ("checkout.session.completed".equals(eventType)) {
            Session session = (Session) event.getDataObjectDeserializer().getObject()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid session data in event"));

            String stripeSessionId = session.getId();
            Payment payment = paymentRepository.findByStripeSessionId(stripeSessionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found for session ID: " + stripeSessionId));

            payment.setPaymentStatus(PaymentStatus.PAID);
            payment.setStripePaymentIntentId(session.getPaymentIntent());
            payment.setStripeCustomerId(session.getCustomer());
            payment.setPaidAt(LocalDateTime.now());
            payment.setTransactionId(session.getPaymentIntent()); // Set payment intent ID as transaction ID
            paymentRepository.save(payment);

            Order order = payment.getOrder();
            order.setPaymentStatus(PaymentStatus.PAID);
            order.setOrderStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);

        } else if ("payment_intent.payment_failed".equals(eventType)) {
            PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid payment intent data in event"));

            String orderIdStr = paymentIntent.getMetadata().get("orderId");
            if (orderIdStr != null) {
                Long orderId = Long.parseLong(orderIdStr);
                Payment payment = paymentRepository.findByOrderId(orderId)
                        .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order ID: " + orderId));

                payment.setPaymentStatus(PaymentStatus.FAILED);
                payment.setStripePaymentIntentId(paymentIntent.getId());
                paymentRepository.save(payment);

                Order order = payment.getOrder();
                order.setPaymentStatus(PaymentStatus.FAILED);
                orderRepository.save(order);
            }
        }
    }
}
