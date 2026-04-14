package com.smartlogix.pedidos.service;

import com.smartlogix.pedidos.model.Pedido;
import java.util.List;

public interface PedidoService {
    Pedido crearPedido(Pedido pedido);
    List<Pedido> findAll();
}