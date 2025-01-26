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
@Table(name = "USER", schema = "PUBLIC")
@SecondaryTable(
        name = "PERSONAL_DATA",
        pkJoinColumns = @PrimaryKeyJoinColumn(name = "USER_ID"),
        schema = "PUBLIC")
@SecondaryTable(name = "GOOGLE_AUTH", pkJoinColumns = @PrimaryKeyJoinColumn(name = "USER_ID"))
@ToString(callSuper = true)
@Getter
@NoArgsConstructor
public class User extends AbstractEntity {

    @Setter
    @Column(name = "FIRST_NAME", table = "PERSONAL_DATA", nullable = false, length = 50)
    @ToString.Exclude
    private String firstName;
    @Setter
    @Column(name = "LAST_NAME", table = "PERSONAL_DATA", nullable = false, length = 50)
    @ToString.Exclude
    private String lastName;
    @Setter
    @Column(name = "EMAIL", table = "PERSONAL_DATA", nullable = false, unique = true, length = 50)
    @ToString.Exclude
    private String email;

    @Setter
    @Column(name = "GOOGLE_ID", table = "GOOGLE_AUTH", unique = true, length = 30)
    private String googleId;

    @Enumerated(EnumType.STRING)
    @Column(name = "LANGUAGE", nullable = false)
    private Language language = Language.PL;

    @Setter
    @Column(name = "PASSWORD", length = 64)
    @ToString.Exclude
    private String password;

    @Setter
    @Column(name = "LOGIN_ATTEMPTS", nullable = false)
    private int loginAttempts = 0;

    @Setter
    @Column(name = "LAST_SUCCESSFUL_LOGIN")
    private LocalDateTime lastSuccessfulLogin;

    @Setter
    @Column(name = "LAST_FAILED_LOGIN")
    private LocalDateTime lastFailedLogin;

    @Setter
    @Column(name = "LAST_SUCCESSFUL_LOGIN_IP")
    private String lastSuccessfulLoginIp;

    @Setter
    @Column(name = "LAST_FAILED_LOGIN_IP")
    private String lastFailedLoginIp;

    @Setter
    @Column(name = "BLOCKED", nullable = false)
    private boolean blocked = false;

    @Setter
    @Column(name = "VERIFIED", nullable = false)
    private boolean verified = false;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    @ToString.Exclude
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<AccessLevel> accessLevels = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<VerificationToken> tokens = new ArrayList<>();

    public void setLanguage(String language) {
        this.language = Language.valueOf(language.toUpperCase());
    }

    public String getLanguage() {
        return language.getValue().toLowerCase();
    }

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
    }



}
