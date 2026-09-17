package E_commerce.fullStack.project_fullstack.service;

import E_commerce.fullStack.project_fullstack.model.Profile;
import E_commerce.fullStack.project_fullstack.model.Role;
import E_commerce.fullStack.project_fullstack.model.User;
import E_commerce.fullStack.project_fullstack.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================
    // REGISTER
    // =========================
    public Optional<User> register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return Optional.empty();
        }



        user.setRole(Role.USER);

        if (user.getProfile() != null) {
            Profile profile = user.getProfile();
            profile.setUsr(user);   // relation inverse
            user.setProfile(profile);
        }
         System.out.println(user.getPassword());
        User savedUser = userRepository.save(user);

        return Optional.of(savedUser);
    }

    // =========================
    // LOGIN
    // =========================
    public Optional<User> login(String email, String password){

        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password));
    }

    // =========================
    // GET ALL USERS
    // =========================
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    // =========================
    // GET USER BY ID
    // =========================
    public Optional<User> getUserById(Long id){
        return userRepository.findById(id);
    }

    // =========================
    // GET USER BY EMAIL
    // =========================
    public Optional<User> getUserByEmail(String email){
        return userRepository.findByEmail(email);
    }

    // =========================
    // GET USERS BY ROLE
    // =========================
    public List<User> getUsersByRole(Role role){
        return userRepository.findByRole(role);
    }

    // =========================
    // CHECK ADMIN
    // =========================
    public boolean isAdmin(Long id){

        return userRepository.findById(id)
                .map(user -> user.getRole() == Role.ADMIN)
                .orElse(false);
    }

    // =========================
    // CHANGE ROLE
    // =========================
    public Optional<User> changeRole(Long id, Role newRole){

        return userRepository.findById(id)
                .map(user -> {
                    user.setRole(newRole);
                    return userRepository.save(user);
                });
    }

    // =========================
    // UPDATE USER
    // =========================
    public Optional<User> updateUser(
            Long id,
            String firstName,
            String lastName,
            String email,
            String password,
            Role role
    ){

        return userRepository.findById(id)
                .map(user -> {

                    if(firstName != null) user.setFirstName(firstName);
                    if(lastName != null) user.setLastName(lastName);
                    if(email != null) user.setEmail(email);
                    if(password != null) user.setPassword(password);
                    if(role!=null)user.setRole(role);

                    return userRepository.save(user);
                });
    }

    // =========================
    // UPDATE PROFILE
    // =========================
    public Optional<Profile> updateProfile(Long id, Profile profile){

        return userRepository.findById(id)
                .map(user -> {
                    user.setProfile(profile);
                    userRepository.save(user);
                    return profile;
                });
    }

    // =========================
    // DELETE USER
    // =========================
    public boolean deleteUser(Long id){

        if(userRepository.existsById(id)){
            userRepository.deleteById(id);
            return true;
        }

        return false;
    }

}