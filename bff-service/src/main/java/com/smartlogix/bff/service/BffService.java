package com.smartlogix.bff.service;

import com.smartlogix.bff.client.EnvioClient;
import com.smartlogix.bff.client.PedidoClient;
import com.smartlogix.bff.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BffService {

    private final PedidoClient pedidoClient;
    private final EnvioClient envioClient;

    public ResumenCompraDTO obtenerResumenCompleto(Long pedidoId) {
        PedidoDTO pedido = pedidoClient.obtenerPedidoPorId(pedidoId);
        EnvioDTO envio = envioClient.obtenerEnvioPorPedido(pedidoId);

        return ResumenCompraDTO.builder()
                .idPedido(pedido.getId())
                .estadoPedido(pedido.getEstado())
                .direccionEntrega(envio.getDireccionDestino())
                .estadoLogistico(envio.getEstado())
                .trackingCode(envio.getCodigoSeguimiento())
                .build();
    }
}