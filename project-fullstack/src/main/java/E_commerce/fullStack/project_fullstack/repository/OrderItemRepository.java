package E_commerce.fullStack.project_fullstack.repository;

import E_commerce.fullStack.project_fullstack.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {
}
