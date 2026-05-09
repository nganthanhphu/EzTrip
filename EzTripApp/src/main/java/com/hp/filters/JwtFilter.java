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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.hp.services.UserService;
import com.hp.utils.JwtUtils;

/**
 *
 * @author Joon
 */
@Component("jwtFilter")
public class JwtFilter implements Filter {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public void doFilter(ServletRequest sr, ServletResponse sr1, FilterChain fc) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) sr;
        HttpServletResponse response = (HttpServletResponse) sr1;

        if (request.getRequestURI().startsWith(String.format("%s/api/secure", request.getContextPath()))) {

            String header = request.getHeader("Authorization");

            if (header == null || !header.startsWith("Bearer ")) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                        "Thiếu hoặc Header xác thực không hợp lệ!");
                return;
            } else {
                String token = header.substring(7);
                try {
                    String username = this.jwtUtils.validateTokenAndGetUsername(token);
                    if (username != null) {
                        UserDetails userDetails = this.userService.loadUserByUsername(username);
                        if (userDetails != null) {
                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                            SecurityContextHolder.getContext().setAuthentication(authentication);

                            fc.doFilter(request, response);
                            return;
                        }
                    }
                } catch (Exception e) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token không hợp lệ!");
                    return;
                }
            }
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token không hợp lệ!");
            return;
        }
        fc.doFilter(request, response);
    }

}
