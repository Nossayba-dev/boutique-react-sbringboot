package E_commerce.fullStack.project_fullstack.service;

import E_commerce.fullStack.project_fullstack.model.Cart;
import E_commerce.fullStack.project_fullstack.model.CartItem;
import E_commerce.fullStack.project_fullstack.model.Product;
import E_commerce.fullStack.project_fullstack.model.User;
import E_commerce.fullStack.project_fullstack.repository.CartRepository;
import E_commerce.fullStack.project_fullstack.repository.ProductRepository;
import E_commerce.fullStack.project_fullstack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Cart cart = new Cart(LocalDateTime.now(), user);
                    return cartRepository.save(cart);
                });
    }

    @Transactional
    public Optional<Cart> getCartByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            return Optional.empty();
        }
        return Optional.of(getOrCreateCart(userId));
    }

    @Transactional
    public Optional<Cart> addItem(Long userId, Long productId, Integer quantity) {
        if (!userRepository.existsById(userId)) {
            return Optional.empty();
        }

        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return Optional.empty();
        }
        Product product = productOpt.get();

        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            item.setUnitPrice(product.getPrice());
        } else {
            cart.getItems().add(new CartItem(cart, product, quantity, product.getPrice()));
        }

        return Optional.of(cartRepository.save(cart));
    }

    @Transactional
    public boolean removeItem(Long userId, Long productId) {
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        if (cartOpt.isEmpty()) {
            return false;
        }

        Cart cart = cartOpt.get();
        boolean removed = cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        if (removed) {
            cartRepository.save(cart);
        }
        return removed;
    }

    @Transactional
    public boolean clearCart(Long userId) {
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        if (cartOpt.isEmpty()) {
            return false;
        }

        Cart cart = cartOpt.get();
        cart.getItems().clear();
        cartRepository.save(cart);
        return true;
    }
}
