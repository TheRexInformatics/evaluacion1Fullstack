package com.smartlogix.bff.client;

import com.smartlogix.bff.dto.PedidoDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "pedidos-service", url = "${services.pedidos.url}")
public interface PedidosClient {

    @GetMapping("/api/pedidos")
    List<PedidoDTO> listarPedidos();

    @GetMapping("/api/pedidos/{id}")
    PedidoDTO obtenerPedido(@PathVariable("id") Long id);
}
