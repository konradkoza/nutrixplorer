package pl.lodz.p.it.nutrixplorer.utils;

import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemReader;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

public class KeyReader {

    public static PrivateKey readPrivateJwtKey(String privateKeyPath) throws IOException {
        ResourceLoader resourceLoader = new DefaultResourceLoader();
        Resource resource = resourceLoader.getResource(privateKeyPath);
        InputStream inputStream = resource.getInputStream();
        try (InputStreamReader reader = new InputStreamReader(inputStream);
             PemReader pemReader = new PemReader(reader)) {
            KeyFactory factory = KeyFactory.getInstance("RSA");
            PKCS8EncodedKeySpec privKeySpec = new PKCS8EncodedKeySpec(pemReader.readPemObject().getContent());
            return factory.generatePrivate(privKeySpec);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException(e);
        }
    }

    public static PublicKey readPublicJwtKey(String publicKeyPath) throws IOException {
        ResourceLoader resourceLoader = new DefaultResourceLoader();
        Resource resource = resourceLoader.getResource(publicKeyPath);
        InputStream inputStream = resource.getInputStream();
        try (InputStreamReader reader = new InputStreamReader(inputStream);
             PemReader pemReader = new PemReader(reader)) {
            KeyFactory factory = KeyFactory.getInstance("RSA");
            X509EncodedKeySpec privKeySpec = new X509EncodedKeySpec(pemReader.readPemObject().getContent());
            return factory.generatePublic(privKeySpec);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException(e);
        }
    }
}
