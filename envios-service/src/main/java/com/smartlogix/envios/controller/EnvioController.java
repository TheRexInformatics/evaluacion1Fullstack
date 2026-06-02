package com.smartlogix.envios.controller;

import com.smartlogix.envios.model.Envio;
import com.smartlogix.envios.model.EstadoEnvio;
import com.smartlogix.envios.service.EnvioService;
import com.smartlogix.envios.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/envios")
public class EnvioController {

    @Autowired
    private EnvioService envioService;

    // Crear un envío
    @PostMapping("/pedido/{pedidoId}")
    public ResponseEntity<Envio> crearEnvio(@PathVariable Long pedidoId, @RequestParam String direccion) {
        return ResponseEntity.ok(envioService.crearEnvio(pedidoId, direccion));
    }

    // Consultar el estado de un envío por ID de pedido
    @GetMapping("/pedido/{pedidoId}")
    public ResponseEntity<Envio> obtenerEnvioPorPedido(@PathVariable Long pedidoId) {
        Envio envio = envioService.obtenerPorPedidoId(pedidoId);
        if (envio == null) {
            throw new ResourceNotFoundException("No se encontró ningún envío asociado al pedido con ID " + pedidoId);
        }
        return ResponseEntity.ok(envio);
    }

    // Actualizar el estado del envío
    @PutMapping("/{id}/estado")
    public ResponseEntity<Envio> actualizarEstado(
            @PathVariable Long id,
            @RequestParam EstadoEnvio estado,
            @RequestParam(required = false) String transportista) {

        Envio envioActualizado = envioService.actualizarEstado(id, estado, transportista);
        if (envioActualizado == null) {
            throw new ResourceNotFoundException("No se pudo actualizar: El envío con ID " + id + " no existe.");
        }
        return ResponseEntity.ok(envioActualizado);
    }
}