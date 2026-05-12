package com.smartlogix.pedidos.service;

import com.smartlogix.pedidos.dto.PedidoDTO;
import com.smartlogix.pedidos.model.Pedido;
import java.util.List;

public interface PedidoService {
    Pedido crearPedido(Pedido pedido);

    List<Pedido> findAll();

    PedidoDTO compensarPedido(Long id);
}