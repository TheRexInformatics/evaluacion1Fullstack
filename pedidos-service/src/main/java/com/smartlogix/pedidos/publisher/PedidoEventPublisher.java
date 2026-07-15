package com.smartlogix.pedidos.publisher;

import com.smartlogix.pedidos.config.RabbitConfig;
import com.smartlogix.pedidos.dto.PedidoEventoDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PedidoEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publicarPedidoCreado(PedidoEventoDTO evento) {
        log.info("Publicando evento pedido.creado:Pedido#{}", evento.getId());
        rabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE, RabbitConfig.PEDIDO_CREADO_ROUTING_KEY, evento);
    }

    public void publicarPedidoCancelado(PedidoEventoDTO evento) {
        log.info("Publicando evento pedido.cancelado:Pedido#{}", evento.getId());
        rabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE, RabbitConfig.PEDIDO_CANCELADO_ROUTING_KEY, evento);
    }
}
