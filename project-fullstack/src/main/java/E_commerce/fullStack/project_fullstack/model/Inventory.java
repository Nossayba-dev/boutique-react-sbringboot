package E_commerce.fullStack.project_fullstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;


@Entity
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private Integer quantity;
    @OneToOne
    @JoinColumn(name = "product_id")
    private Product product;

    public Inventory() {
    }

    public Inventory( Product product, Integer quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
