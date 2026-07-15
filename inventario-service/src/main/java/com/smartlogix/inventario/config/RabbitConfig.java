package com.smartlogix.inventario.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    private static final String EXCHANGE = "smartlogix.events";
    private static final String PEDIDO_CANCELADO_QUEUE = "pedido.cancelado.queue";
    private static final String PEDIDO_CANCELADO_ROUTING_KEY = "pedido.cancelado";

    @Bean
    public DirectExchange smartlogixExchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean
    public Queue pedidoCanceladoQueue() {
        return new Queue(PEDIDO_CANCELADO_QUEUE, true);
    }

    @Bean
    public Binding pedidoCanceladoBinding(Queue pedidoCanceladoQueue, DirectExchange smartlogixExchange) {
        return BindingBuilder.bind(pedidoCanceladoQueue).to(smartlogixExchange).with(PEDIDO_CANCELADO_ROUTING_KEY);
    }
}
