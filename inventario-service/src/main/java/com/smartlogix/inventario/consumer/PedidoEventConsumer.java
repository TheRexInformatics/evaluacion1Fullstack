package com.smartlogix.inventario.consumer;

import com.smartlogix.inventario.dto.PedidoEventoDTO;
import com.smartlogix.inventario.service.ProductoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PedidoEventConsumer {

    private final ProductoService productoService;

    @RabbitListener(queues = "pedido.cancelado.queue")
    public void onPedidoCancelado(PedidoEventoDTO evento) {
        log.info("Evento pedido.cancelado recibido: Pedido#{} - Restaurando stock de {} unidades del producto {}",
                evento.getId(), evento.getCantidad(), evento.getCodigoProducto());
        try {
            productoService.aumentarStockGlobal(evento.getCodigoProducto(), evento.getCantidad());
            log.info("Stock restaurado exitosamente para Pedido#{}", evento.getId());
        } catch (Exception e) {
            log.error("Error restaurando stock para Pedido#{}: {}", evento.getId(), e.getMessage());
        }
    }
}
