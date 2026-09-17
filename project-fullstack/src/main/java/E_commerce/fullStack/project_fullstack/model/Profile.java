package E_commerce.fullStack.project_fullstack.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Profile {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false)
    private String adresse;

    @Column(nullable = false)
    private String city;
    @OneToOne(mappedBy = "profile")
    @JsonBackReference
    private User usr;

    public Profile() {
    }

    public Profile(String adresse, String city, String phone) {
        this.adresse = adresse;
        this.city = city;
        this.phone = phone;

    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public User getUsr() {
        return usr;
    }

    public void setUsr(User usr) {
        this.usr = usr;
    }
}
