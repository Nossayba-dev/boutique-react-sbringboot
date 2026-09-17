package E_commerce.fullStack.project_fullstack.controller;

import E_commerce.fullStack.project_fullstack.model.Product;
import E_commerce.fullStack.project_fullstack.repository.ProductRepository;
import E_commerce.fullStack.project_fullstack.service.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
@RestController
@CrossOrigin(originPatterns = "http://localhost:*")
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(){
        List<Product> products = productService.getAllProduct();

        if(products.isEmpty()){
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id){
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product>editProduct(
            @PathVariable long id,
            @RequestBody Product product
    ){
        return productService.editProduct(
                id,
                product.getName(),
                product.getDescription(),
                product.getImageUrl(),
                product.getPrice(),
                product.getQuantite(),
                product.getCategory()
        ).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product){

        Product savedProduct = productService.saveProduct(product);

        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @GetMapping("/totalQuantite")
    public Integer getTotalQuantite(){
        return productService.getTotalProductQuantity();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Product> deleteProductById(@PathVariable Long id){
        return productService.deleteProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}


