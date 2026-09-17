package E_commerce.fullStack.project_fullstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
public class OrderItem {
    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private Integer quantite;
    @NotNull
    private BigDecimal unitPrice;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    public OrderItem() {
    }

    public OrderItem( Product product, Integer quantite, BigDecimal unitPrice) {
        this.product = product;
        this.quantite = quantite;
        this.unitPrice = unitPrice;
    }
// Getters and setters

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantite() {
        return quantite;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }
}
