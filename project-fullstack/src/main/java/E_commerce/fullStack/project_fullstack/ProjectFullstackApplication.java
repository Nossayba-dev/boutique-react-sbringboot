package E_commerce.fullStack.project_fullstack;

import E_commerce.fullStack.project_fullstack.model.*;
import E_commerce.fullStack.project_fullstack.repository.CategoryRepository;
import E_commerce.fullStack.project_fullstack.repository.ProductRepository;

import E_commerce.fullStack.project_fullstack.repository.UserRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class ProjectFullstackApplication {

	public static void main(String[] args) {

		// Démarrage de Spring Boot et récupération du contexte
		ApplicationContext ioc = SpringApplication.run(ProjectFullstackApplication.class, args);
		UserRepository userRepository = ioc.getBean(UserRepository.class);
		ProductRepository productRepository = ioc.getBean(ProductRepository.class);
		CategoryRepository categoryRepository = ioc.getBean(CategoryRepository.class);
		Profile profile1 = new Profile("casa-merssultan", "casablanca", "0712234567");
		User user1 = new User("aaaaaaa@gmail.com", "aymen", "abdessami", "2222222", profile1, Role.USER);

// Sauvegarde (profile est sauvegardé automatiquement grâce à CascadeType.ALL)
		userRepository.save(user1);

// Deuxième utilisateur
		Profile profile2 = new Profile("rue xyz", "rabat", "0661234567");
		User user2 = new User("asgzsswu@gmail.com", "ahmed", "kamali", "12345678", profile2, Role.ADMIN);
		userRepository.save(user2);

		System.out.println("Utilisateur ajouté : " + user1.getEmail());
		System.out.println("Utilisateur ajouté : " + user2.getEmail());

// ==============================================================================================
		List<Product> products = new ArrayList<>();
		Category electronics = new Category("Electronics",products); // pas besoin de créer la liste

// créer les produits et ils s'ajoutent automatiquement à la catégorie
		Product p1 = new Product(electronics, "Smartphone", "https://commons.wikimedia.org/wiki/Special:FilePath/Apple-iphone-smartphone-technology-1%20(24218252052).jpg?width=500", "iPhone", new BigDecimal("999.99"),11);
		Product p2 = new Product(electronics, "Laptop", "https://commons.wikimedia.org/wiki/Special:FilePath/Macbook.JPG?width=500", "MacBook", new BigDecimal("1999.99"),45);

		products.add(p1);
		products.add(p2);

// sauvegarder les produits et la catégorie
		categoryRepository.save(electronics);
		productRepository.saveAll(products);


		System.out.println(electronics.getProductList());
	}
	}


