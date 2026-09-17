package E_commerce.fullStack.project_fullstack.repository;

import E_commerce.fullStack.project_fullstack.model.Role;
import E_commerce.fullStack.project_fullstack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
}
