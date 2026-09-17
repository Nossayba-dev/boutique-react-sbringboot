package E_commerce.fullStack.project_fullstack.controller;

import E_commerce.fullStack.project_fullstack.model.Profile;
import E_commerce.fullStack.project_fullstack.model.Role;
import E_commerce.fullStack.project_fullstack.model.User;
import E_commerce.fullStack.project_fullstack.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Tag(name = "User Controller", description = "Gestion des utilisateurs")
@CrossOrigin(originPatterns = "http://localhost:*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // GET USER BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id){
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================
    // GET ALL USERS
    // =========================
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user){

        return userService.register(user)
                .map(u -> new ResponseEntity<>(u, HttpStatus.CREATED))
                .orElse(ResponseEntity.status(HttpStatus.CONFLICT).build());
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestParam String email,
                                      @RequestParam String password){

        return userService.login(email, password)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    // =========================
    // DELETE USER
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id){

        boolean deleted = userService.deleteUser(id);

        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    // =========================
    // CHANGE ROLE
    // =========================
    @PutMapping("/{id}/role")
    public ResponseEntity<User> changeRole(@PathVariable Long id,
                                           @RequestParam Role role){

        return userService.changeRole(id, role)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================
    // CHECK ADMIN
    // =========================
    @GetMapping("/{id}/is-admin")
    public ResponseEntity<Boolean> isAdmin(@PathVariable Long id){
        return ResponseEntity.ok(userService.isAdmin(id));
    }

    // =========================
    // UPDATE USER (PARTIAL)
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User user
    ){

        return userService.updateUser(
                        id,
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getPassword(),
                        user.getRole()
                )
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================
    // UPDATE PROFILE
    // =========================
    @PutMapping("/{id}/profile")
    public ResponseEntity<Profile> updateProfile(
            @PathVariable Long id,
            @RequestBody Profile profile
    ){

        return userService.updateProfile(id, profile)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================
    // GET USER BY EMAIL
    // =========================
    @GetMapping("/email")
    public ResponseEntity<User> getByEmail(@RequestParam String email){

        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================
    // GET USERS BY ROLE
    // =========================
    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getByRole(@PathVariable Role role){
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }
}