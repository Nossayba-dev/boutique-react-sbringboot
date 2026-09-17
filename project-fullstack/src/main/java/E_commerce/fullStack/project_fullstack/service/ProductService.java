package E_commerce.fullStack.project_fullstack.service;

import E_commerce.fullStack.project_fullstack.model.Category;
import E_commerce.fullStack.project_fullstack.model.Product;
import E_commerce.fullStack.project_fullstack.repository.CategoryRepository;
import E_commerce.fullStack.project_fullstack.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public Optional<Product> getProductById(Long id){ // gett product By Id
        return productRepository.findById(id);
    }


    public List<Product> getAllProduct(){   // getAllProduct
        return productRepository.findAll();
    }
    public List<Product> getProductByName(String name){
        return productRepository.findProductsByName(name); // gett product By Name
    }

    public List<Product> getProductContainingWord(String word){
        return productRepository.findProductsByNameContaining(word);
    }

    public List<Product> getProductByPrice(BigDecimal price){
        return productRepository.findProductsByPrice(price);
    }

    public List<Product> getProductByPriceGreaterThan(BigDecimal price){
        return productRepository.findProductsByPriceGreaterThan(price);
    }

    public List<Product> getProductsByPriceLessThan(BigDecimal price){
        return  productRepository.findProductsByPriceLessThan(price);
    }
    public Integer getTotalProductQuantity() {
        return productRepository.findAll().stream()
                .mapToInt(Product::getQuantite)
                .sum();
    }

    public Optional<Product> deleteProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);

        if (product.isPresent()) {
            productRepository.deleteById(id);
            return product; // retourne le produit supprimé
        } else {
            return Optional.empty(); // pas trouvé
        }
    }

    public Optional<Product> editProduct(
            Long id,
            String name,
            String description,
            String imageUrl,
            BigDecimal price,
            Integer quantite,
            Category category
    ){
     return  productRepository.findById(id)
                .map(product-> {

                    if(name != null) product.setName(name);
                    if(description != null) product.setDescription(description);
                    if(imageUrl != null) product.setImageUrl(imageUrl);
                    if(price != null) product.setPrice(price);
                    if(quantite!=null) product.setQuantite(quantite);
                    if(category!=null) product.setCategory(category);
                    return productRepository.save(product);
                });
    }
    @Transactional
    public Product saveProduct(Product product) {
        Category category = categoryRepository.findById(product.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setCategory(category);

        return productRepository.save(product);
    }

}
