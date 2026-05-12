package com.smartlogix.auth.controller;

import com.smartlogix.auth.security.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtProvider jwtProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        // ⚠️ MOCK: Simulando una consulta a la base de datos
        // Más adelante, aquí validaremos contra PostgreSQL (Neon)

        if ("diego".equals(username) && "admin123".equals(password)) {
            // Si el usuario es diego, le damos rol de Administrador
            String token = jwtProvider.generateToken(username, "ROLE_ADMIN");
            return ResponseEntity.ok(Map.of("token", token));

        } else if ("cliente".equals(username) && "1234".equals(password)) {
            // Si es un cliente normal, le damos rol de Cliente
            String token = jwtProvider.generateToken(username, "ROLE_CLIENTE");
            return ResponseEntity.ok(Map.of("token", token));
        }

        // Si falla, devolvemos un 401 Unauthorized
        return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas en SmartLogix"));
    }
}