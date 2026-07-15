package com.smartlogix.envios.consumer;

import com.smartlogix.envios.dto.PedidoEventoDTO;
import com.smartlogix.envios.service.EnvioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PedidoEventConsumer {

    private final EnvioService envioService;

    @RabbitListener(queues = "pedido.creado.queue")
    public void onPedidoCreado(PedidoEventoDTO evento) {
        log.info("Evento pedido.creado recibido: Pedido#{}", evento.getId());
        try {
            envioService.crearEnvio(evento.getId(), "Dirección por defecto");
            log.info("Envío creado automáticamente para Pedido#{}", evento.getId());
        } catch (Exception e) {
            log.error("Error creando envío automático para Pedido#{}: {}", evento.getId(), e.getMessage());
        }
    }
}
