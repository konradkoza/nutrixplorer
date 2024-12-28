package pl.lodz.p.it.nutrixplorer.model.mok;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "USERS", schema = "PUBLIC")
@SecondaryTable(
        name = "PERSONAL_DATA",
        pkJoinColumns = @PrimaryKeyJoinColumn(name = "user_id"),
        schema = "PUBLIC")
@SecondaryTable(name = "GOOGLE_AUTH", pkJoinColumns = @PrimaryKeyJoinColumn(name = "user_id"))
@ToString
@Getter
@NoArgsConstructor
public class User extends AbstractEntity {

    @Setter
    @Column(name = "first_name", table = "PERSONAL_DATA", nullable = false, length = 50)
    private String firstName;
    @Setter
    @Column(name = "last_name", table = "PERSONAL_DATA", nullable = false, length = 50)
    private String lastName;
    @Setter
    @Column(name = "email", table = "PERSONAL_DATA", nullable = false, unique = true, length = 50)
    private String email;

    @Setter
    @Column(name = "google_id", table = "GOOGLE_AUTH", unique = true, length = 30)
    private String googleId;

////    @Setter
//    @Column(name = "login", nullable = false, updatable = false, unique = true, length = 50)
//    private String login;


    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false)
    private Language language = Language.PL;

    @Setter
    @Column(name = "password", length = 64)
    @ToString.Exclude
    private String password;

    @Setter
    @Column(name = "login_attempts", nullable = false)
    private int loginAttempts = 0;

    @Setter
    @Column(name = "last_successful_login")
    private LocalDateTime lastSuccessfulLogin;

    @Setter
    @Column(name = "last_failed_login")
    private LocalDateTime lastFailedLogin;

    @Setter
    @Column(name = "last_successful_login_ip")
    private String lastSuccessfulLoginIp;

    @Setter
    @Column(name = "last_failed_login_ip")
    private String lastFailedLoginIp;

    @Setter
    @Column(name = "blocked", nullable = false)
    private boolean blocked = false;

    @Setter
    @Column(name = "verified", nullable = false)
    private boolean verified = false;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AccessLevel> accessLevels = new ArrayList<>();

    public void setLanguage(String language) {
        this.language = Language.valueOf(language.toUpperCase());
    }

    public String getLanguage() {
        return language.getValue().toLowerCase();
    }

}
