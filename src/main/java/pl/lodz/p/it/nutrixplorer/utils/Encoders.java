package pl.lodz.p.it.nutrixplorer.utils;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import java.io.IOException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.util.UUID;

@Configuration
public class Encoders {
    private PrivateKey privateJwtKey;
    private PublicKey publicJwtKey;

    @Value("${nutrixplorer.jwt.private-key-path}")
    private String privateJwtKeyFilePath;
    @Value("${nutrixplorer.jwt.public-key-path}")
    private String publicJwtKeyFilePath;

    @PostConstruct
    public void readKeys() throws IOException {
        this.privateJwtKey = KeyReader.readPrivateJwtKey(privateJwtKeyFilePath);
        this.publicJwtKey = KeyReader.readPublicJwtKey(publicJwtKeyFilePath);
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder((RSAPublicKey) publicJwtKey)
                .privateKey(privateJwtKey)
                .keyID(UUID.randomUUID().toString())
                .build();
        JWKSource<SecurityContext> jwkSource = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwkSource);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
