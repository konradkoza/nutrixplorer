package pl.lodz.p.it.nutrixplorer.model.mok;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "USERS", schema = "PUBLIC")
@SecondaryTable(
        name = "PERSONAL_DATA",
        pkJoinColumns = @PrimaryKeyJoinColumn(name = "user_id"),
        schema = "PUBLIC")
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

////    @Setter
//    @Column(name = "login", nullable = false, updatable = false, unique = true, length = 50)
//    private String login;

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

    @Setter
    @Column(name = "active", nullable = false)
    private boolean active = true;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private AccessLevel accessLevel;
}
