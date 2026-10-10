package com.packt.cardatabase.service;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
public class JwtService {

    static final long EXPIRATIONTIME = 86400000; // 1 day in ms
    static final String PREFIX = "Bearer";

    // Generate secret key. Only for the demonstration
    // You should read it from the application configuration
    static final SecretKey key = Jwts.SIG.HS256.key().build();

    // Generate signed JWT token
    public String getToken(String username) {
        String token = Jwts.builder()
            .subject(username)
            .expiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME))
            .signWith(key)
            .compact();

        return token;
    }

    // Get a token from request Authorization header,
    // verify a token and get username
    public String getAuthUser(HttpServletRequest request) {
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (token != null) {
            String user = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token.replace(PREFIX, "").trim())
                .getPayload()
                .getSubject();

            if (user != null) return user;
        }
        return null;
    }
}
