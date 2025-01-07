package pl.lodz.p.it.nutrixplorer.utils;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import pl.lodz.p.it.nutrixplorer.exceptions.InvalidHeaderException;
import pl.lodz.p.it.nutrixplorer.exceptions.ErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.ExceptionMessages;

import java.text.ParseException;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Configuration
public class ETagSigner {

    @Value("${nutrixplorer.jws.secret}")
    private String secretValue;

    private boolean verifySignature(String token) throws ParseException, JOSEException {
        JWSObject jwsObject = JWSObject.parse(token);
        JWSVerifier verifier = new MACVerifier(Base64.getEncoder().encodeToString(secretValue.getBytes()));
        return jwsObject.verify(verifier);
    }

    public boolean verifySignature(UUID id, Long version, String token) throws InvalidHeaderException {
        try {
            if (!verifySignature(token)) return false;
            JWSObject jwsObject = JWSObject.parse(token);
            Map<String, Object> claims = jwsObject.getPayload().toJSONObject();
            return id.equals(UUID.fromString((String) claims.get("id"))) && version.equals(claims.get("version"));
        } catch (ParseException | JOSEException e) {
            throw new InvalidHeaderException(ExceptionMessages.INVALID_IF_MATCH, ErrorCodes.INVALID_IF_MATCH, e);
        }
    }

    public String generateSignature(UUID id, Long version) throws InvalidHeaderException {
        try {
            Map<String, Object> claims = Map.of("id", id, "version", version);
            JWSObject jwsObject = new JWSObject(new JWSHeader(JWSAlgorithm.HS256), new Payload(claims));
            JWSSigner signer = new MACSigner(Base64.getEncoder().encodeToString(secretValue.getBytes()));
            jwsObject.sign(signer);
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new InvalidHeaderException(ExceptionMessages.ETAG_HEADER_ERROR, ErrorCodes.ETAG_HEADER_ERROR, e);
        }
    }
}
