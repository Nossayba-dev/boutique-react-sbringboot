package E_commerce.fullStack.project_fullstack.repository;

import E_commerce.fullStack.project_fullstack.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile,Long> {
}
