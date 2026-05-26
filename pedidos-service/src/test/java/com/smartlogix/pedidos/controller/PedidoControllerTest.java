package com.smartlogix.pedidos.controller;

import com.smartlogix.pedidos.model.Pedido;
import com.smartlogix.pedidos.service.PedidoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PedidoControllerTest {

    @Mock
    private PedidoService pedidoService;

    @InjectMocks
    private PedidoController pedidoController;

    private Pedido pedidoMock;

    @BeforeEach
    void setUp() {
        pedidoMock = new Pedido();
        pedidoMock.setId(1L);
        pedidoMock.setCodigoProducto("SKU-123");
    }

    @Test
    void crearPedido_Exito_Devuelve201() {
        when(pedidoService.crearPedido(any(Pedido.class))).thenReturn(pedidoMock);

        ResponseEntity<?> response = pedidoController.crearPedido(pedidoMock);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(pedidoMock, response.getBody());
    }

    @Test
    void crearPedido_Conflicto_Devuelve409() {
        when(pedidoService.crearPedido(any(Pedido.class)))
                .thenThrow(new RuntimeException("Sin stock suficiente"));

        ResponseEntity<?> response = pedidoController.crearPedido(pedidoMock);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("stock"));
    }

    @Test
    void crearPedido_BadRequest_Devuelve400() {
        when(pedidoService.crearPedido(any(Pedido.class)))
                .thenThrow(new RuntimeException("Producto inválido"));

        ResponseEntity<?> response = pedidoController.crearPedido(pedidoMock);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Producto inválido", response.getBody());
    }

    @Test
    void listarPedidos_DevuelveListaY200() {
        when(pedidoService.findAll()).thenReturn(Arrays.asList(pedidoMock));

        ResponseEntity<List<Pedido>> response = pedidoController.listarPedidos();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void obtenerPorId_Existe_Devuelve200() {
        when(pedidoService.findById(1L)).thenReturn(Optional.of(pedidoMock));

        ResponseEntity<Pedido> response = pedidoController.obtenerPorId(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(pedidoMock, response.getBody());
    }

    @Test
    void obtenerPorId_NoExiste_Devuelve404() {
        when(pedidoService.findById(99L)).thenReturn(Optional.empty());

        ResponseEntity<Pedido> response = pedidoController.obtenerPorId(99L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}