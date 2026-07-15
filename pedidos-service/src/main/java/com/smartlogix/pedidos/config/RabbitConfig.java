package com.smartlogix.pedidos.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String EXCHANGE = "smartlogix.events";
    public static final String PEDIDO_CREADO_QUEUE = "pedido.creado.queue";
    public static final String PEDIDO_CANCELADO_QUEUE = "pedido.cancelado.queue";
    public static final String PEDIDO_CREADO_ROUTING_KEY = "pedido.creado";
    public static final String PEDIDO_CANCELADO_ROUTING_KEY = "pedido.cancelado";

    @Bean
    public DirectExchange smartlogixExchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean
    public Queue pedidoCreadoQueue() {
        return new Queue(PEDIDO_CREADO_QUEUE, true);
    }

    @Bean
    public Queue pedidoCanceladoQueue() {
        return new Queue(PEDIDO_CANCELADO_QUEUE, true);
    }

    @Bean
    public Binding pedidoCreadoBinding(Queue pedidoCreadoQueue, DirectExchange smartlogixExchange) {
        return BindingBuilder.bind(pedidoCreadoQueue).to(smartlogixExchange).with(PEDIDO_CREADO_ROUTING_KEY);
    }

    @Bean
    public Binding pedidoCanceladoBinding(Queue pedidoCanceladoQueue, DirectExchange smartlogixExchange) {
        return BindingBuilder.bind(pedidoCanceladoQueue).to(smartlogixExchange).with(PEDIDO_CANCELADO_ROUTING_KEY);
    }
}
