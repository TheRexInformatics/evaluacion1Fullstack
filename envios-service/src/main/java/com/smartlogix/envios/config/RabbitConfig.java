package com.smartlogix.envios.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    private static final String EXCHANGE = "smartlogix.events";
    private static final String PEDIDO_CREADO_QUEUE = "pedido.creado.queue";
    private static final String PEDIDO_CREADO_ROUTING_KEY = "pedido.creado";

    @Bean
    public DirectExchange smartlogixExchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean
    public Queue pedidoCreadoQueue() {
        return new Queue(PEDIDO_CREADO_QUEUE, true);
    }

    @Bean
    public Binding pedidoCreadoBinding(Queue pedidoCreadoQueue, DirectExchange smartlogixExchange) {
        return BindingBuilder.bind(pedidoCreadoQueue).to(smartlogixExchange).with(PEDIDO_CREADO_ROUTING_KEY);
    }
}
