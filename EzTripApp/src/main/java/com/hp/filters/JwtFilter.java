/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.filters;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.text.ParseException;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.hp.security.MyUserDetails;
import com.hp.utils.JwtUtils;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.JWTClaimsSet;

/**
 *
 * @author Joon
 */
@Component("jwtFilter")
public class JwtFilter implements Filter {

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public void doFilter(ServletRequest sr, ServletResponse sr1, FilterChain fc) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) sr;
        HttpServletResponse response = (HttpServletResponse) sr1;

        String header = request.getHeader("Authorization");

        if (request.getRequestURI().startsWith(String.format("%s/api/secure", request.getContextPath()))) {
            if (header == null || !header.startsWith("Bearer ")) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                        "Thiếu hoặc Header xác thực không hợp lệ!");
                return;
            }
        }

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                JWTClaimsSet claimsSet = this.jwtUtils.validateTokenAndGetClaimsSet(token);
                if (claimsSet != null) {
                    String username = claimsSet.getSubject();
                    Integer id = Integer.parseInt(claimsSet.getClaimAsString("id"));
                    Integer customerId = null;
                    if (claimsSet.getClaim("customerId") != null) {
                        customerId = Integer.parseInt(claimsSet.getClaimAsString("customerId"));
                    }
                    Integer providerId = null;
                    if (claimsSet.getClaim("providerId") != null) {
                        providerId = Integer.parseInt(claimsSet.getClaimAsString("providerId"));
                    }
                    String role = claimsSet.getClaimAsString("role");
                    Set<GrantedAuthority> authorities = new HashSet<>();
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
                    UserDetails userDetails = new MyUserDetails(id, customerId, providerId, username, "", authorities);
                    if (userDetails != null) {
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authentication);

                        fc.doFilter(request, response);
                        return;
                    }
                }
            } catch (ParseException | JOSEException ex) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token không hợp lệ!");
                return;
            }

            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token không hợp lệ!");
            return;
        }

        fc.doFilter(request, response);
    }

}
