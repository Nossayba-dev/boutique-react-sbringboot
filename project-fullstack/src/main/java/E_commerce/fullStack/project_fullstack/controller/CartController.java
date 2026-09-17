package E_commerce.fullStack.project_fullstack.controller;

import E_commerce.fullStack.project_fullstack.model.Cart;
import E_commerce.fullStack.project_fullstack.service.CartService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Cart Controller", description = "Gestion du panier")
@CrossOrigin(originPatterns = "http://localhost:*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    public record AddToCartRequest(Long userId, Long productId, Integer quantity) {}

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {
        return cartService.getCartByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody AddToCartRequest request) {
        return cartService.addItem(request.userId(), request.productId(), request.quantity())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/remove/{userId}/{productId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long userId, @PathVariable Long productId) {
        boolean removed = cartService.removeItem(userId, productId);
        return removed
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        boolean cleared = cartService.clearCart(userId);
        return cleared
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
