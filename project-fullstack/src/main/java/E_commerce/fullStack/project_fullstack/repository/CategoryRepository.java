package E_commerce.fullStack.project_fullstack.repository;

import E_commerce.fullStack.project_fullstack.model.Category;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {
    Optional<Category> findByName(String name);
    @Query("SELECT c.name, COUNT(p) FROM Category c JOIN c.productList p GROUP BY c.name")
    List<Object[]> getProductCountByCategory();
}
