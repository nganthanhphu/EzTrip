/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import java.util.Date;

/**
 *
 * @author Joon
 */
@Component
@PropertySource("classpath:application.properties")
public class JwtUtils {

    private final String SECRET;
    private final long EXPIRATION_MS;

    @Autowired
    public JwtUtils(Environment env) {
        this.SECRET = env.getProperty("JWT_SECRET");
        this.EXPIRATION_MS = Long.parseLong(env.getProperty("JWT_EXPIRATION"));
    }

    public String generateToken(int id, String username, String role) throws Exception {
        JWSSigner signer = new MACSigner(SECRET);

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(username)
                .expirationTime(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .issueTime(new Date())
                .claim("id", id)
                .claim("role", role)
                .build();

        SignedJWT signedJWT = new SignedJWT(
                new JWSHeader(JWSAlgorithm.HS256),
                claimsSet
        );

        signedJWT.sign(signer);

        return signedJWT.serialize();
    }

    public JWTClaimsSet validateTokenAndGetClaimsSet(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SECRET);

        if (signedJWT.verify(verifier)) {
            Date expiration = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expiration.after(new Date())) {
                return signedJWT.getJWTClaimsSet();
            }
        }
        return null;
    }
}
