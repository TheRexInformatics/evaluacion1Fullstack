package com.smartlogix.pedidos.service;

import com.smartlogix.pedidos.dto.PedidoDTO;
import java.util.List;

public interface PedidoService {
    // Recibe DTO y devuelve DTO
    PedidoDTO crearPedido(PedidoDTO pedidoDTO);

    // Devuelve lista de DTOs
    List<PedidoDTO> findAll();

    // Ya estaba correcto
    PedidoDTO compensarPedido(Long id);
}