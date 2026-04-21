package com.smartlogix.pedidos.service;

import com.smartlogix.pedidos.model.Pedido;
import java.util.List;
import java.util.Optional; // ¡No olvides el import!

public interface PedidoService {
    Pedido crearPedido(Pedido pedido);
    List<Pedido> findAll();
    Optional<Pedido> findById(Long id); // <--- AGREGAR ESTO
}