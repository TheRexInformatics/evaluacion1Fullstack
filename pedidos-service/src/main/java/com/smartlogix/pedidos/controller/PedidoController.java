package com.smartlogix.pedidos.controller;

import com.smartlogix.pedidos.model.Pedido;
import com.smartlogix.pedidos.service.PedidoService;
import com.smartlogix.pedidos.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {
    private final PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody Pedido pedido) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.crearPedido(pedido));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> listarPedidos() {
        return ResponseEntity.ok(pedidoService.findAll());
    }

    @PutMapping("/{id}/compensar")
    public ResponseEntity<PedidoDTO> compensarPedido(@PathVariable Long id) {
        // Servicio para cancelar el pedido
        PedidoDTO pedidoCompensado = pedidoService.compensarPedido(id);
        return ResponseEntity.ok(pedidoCompensado);
    }
}