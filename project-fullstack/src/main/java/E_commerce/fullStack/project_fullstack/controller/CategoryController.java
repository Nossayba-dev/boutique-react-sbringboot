package E_commerce.fullStack.project_fullstack.controller;

import E_commerce.fullStack.project_fullstack.model.Category;
import E_commerce.fullStack.project_fullstack.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/category")
@CrossOrigin(originPatterns = "http://localhost:*")
public class CategoryController {
     private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    @GetMapping("/")
    public List<Category>getCategory(){
        return categoryRepository.findAll();
    }

    @GetMapping("/product-count-by-category")
    public List<Map<String, Object>> getStats() {

        return categoryRepository.findAll().stream()
                .map(c -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("category", c.getName());
                    map.put("count", c.getProductList() == null ? 0 : c.getProductList().size());
                    return map;
                })
                .toList();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {

        if (!categoryRepository.existsById(id)) {
            return ResponseEntity
                    .status(404)
                    .body("Category not found");
        }

        categoryRepository.deleteById(id);

        return ResponseEntity.ok("Category deleted successfully");
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryRepository.save(category);
    }


}
