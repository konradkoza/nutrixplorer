package pl.lodz.p.it.nutrixplorer.mok.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Transactional(propagation = Propagation.MANDATORY, isolation = Isolation.READ_COMMITTED, transactionManager = "mokTransactionManager")
@LoggingInterceptor
public class JwtService {
    private final JwtEncoder jwtEncoder;


    @Value("${nutrixplorer.jwt.expiration}")
    private long jwtExpiration;


    public Jwt generateToken(UUID id, List<String> roles) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("NutriXplorer")
                .issuedAt(now)
                .expiresAt(now.plus(jwtExpiration, ChronoUnit.HOURS))
                .subject(id.toString())
                .claim("authorities", roles)
                .build();
        var encoderParameters = JwtEncoderParameters.from(JwsHeader.with(SignatureAlgorithm.RS256).build(), claims);
        return jwtEncoder.encode(encoderParameters);
    }
}
