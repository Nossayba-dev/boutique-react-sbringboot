package E_commerce.fullStack.project_fullstack.service;


import E_commerce.fullStack.project_fullstack.repository.OrderRepository;
import E_commerce.fullStack.project_fullstack.model.Order;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order>getAllOrders(){
        return orderRepository.findAll();
    }
    //
    public Order createOrder(Order order) {

        order.setOrderDate(LocalDateTime.now());

        return orderRepository.save(order);
    }
}
