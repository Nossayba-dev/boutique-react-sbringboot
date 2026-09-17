package E_commerce.fullStack.project_fullstack.repository;

import E_commerce.fullStack.project_fullstack.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {
    List<Product> findProductsByName(String name);
    List<Product> findProductsByNameContaining(String word );
    List<Product> findProductsByPrice(BigDecimal price);
    List<Product> findProductsByPriceGreaterThan(BigDecimal price);
    List<Product> findProductsByPriceLessThan(BigDecimal price);
}
