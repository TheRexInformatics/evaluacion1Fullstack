package com.smartlogix.bff.client;

import com.smartlogix.bff.dto.EnvioDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "envios-service", url = "http://envios-service:8083")
public interface EnvioClient {
    @GetMapping("/api/envios/pedido/{pedidoId}")
    EnvioDTO obtenerEnvioPorPedido(@PathVariable("pedidoId") Long pedidoId);
}