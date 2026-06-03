package com.smartlogix.pedidos.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartlogix.pedidos.model.Pedido;
import com.smartlogix.pedidos.service.PedidoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class PedidoControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PedidoService pedidoService;

    @InjectMocks
    private PedidoController pedidoController;

    private ObjectMapper objectMapper;
    private Pedido pedidoMock;

    // Estructura auxiliar para el truco genérico de Java que forzó el 500 con éxito
    @SuppressWarnings("unchecked")
    private <T extends Throwable> void lanzarExcepcionChequeada(Throwable t) throws T {
        throw (T) t;
    }

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(pedidoController).build();
        this.objectMapper = new ObjectMapper();

        this.pedidoMock = new Pedido();
        this.pedidoMock.setId(1L);
    }

    @Test
    void crearPedido_Exito_RetornaCreated() throws Exception {
        when(pedidoService.crearPedido(any(Pedido.class))).thenReturn(pedidoMock);

        mockMvc.perform(post("/api/pedidos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pedidoMock)))
                .andExpect(status().isCreated());
    }

    @Test
    void crearPedido_ErrorStock_RetornaConflict() throws Exception {
        when(pedidoService.crearPedido(any(Pedido.class)))
                .thenThrow(new RuntimeException("Error: No hay suficiente stock disponible"));

        mockMvc.perform(post("/api/pedidos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pedidoMock)))
                .andExpect(status().isConflict());
    }

    @Test
    void crearPedido_RuntimeExceptionComun_RetornaBadRequest() throws Exception {
        when(pedidoService.crearPedido(any(Pedido.class)))
                .thenThrow(new RuntimeException("Error de validacion general"));

        mockMvc.perform(post("/api/pedidos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pedidoMock)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void crearPedido_RuntimeExceptionMensajeNull_RetornaBadRequest() throws Exception {
        when(pedidoService.crearPedido(any(Pedido.class)))
                .thenThrow(new RuntimeException());

        mockMvc.perform(post("/api/pedidos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pedidoMock)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void crearPedido_ExceptionInesperada_RetornaInternalServerError() throws Exception {
        doAnswer(invocation -> {
            lanzarExcepcionChequeada(new Exception("Fallo general inesperado de SmartLogix"));
            return null;
        }).when(pedidoService).crearPedido(any(Pedido.class));

        mockMvc.perform(post("/api/pedidos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pedidoMock)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void listarPedidos_RetornaLista() throws Exception {
        when(pedidoService.findAll()).thenReturn(Collections.singletonList(pedidoMock));

        mockMvc.perform(get("/api/pedidos"))
                .andExpect(status().isOk());
    }

    @Test
    void obtenerPorId_Existe_RetornaPedido() throws Exception {
        when(pedidoService.findById(1L)).thenReturn(Optional.of(pedidoMock));

        mockMvc.perform(get("/api/pedidos/1"))
                .andExpect(status().isOk());
    }

    // 🎯 RE-ACTIVADO Y CORREGIDO: Pasa por el orElseThrow, da el 100% y no genera errores rojos
    @Test
    void obtenerPorId_NoExiste_LanzaResourceNotFoundException() throws Exception {
        // 1. Forzar al mock a retornar vacío para obligar a ejecutar el orElseThrow
        when(pedidoService.findById(99L)).thenReturn(Optional.empty());

        // 2. Verificar que MockMvc capture la excepción y responda limpiamente con un 404
        mockMvc.perform(get("/api/pedidos/99"))
                .andExpect(status().isNotFound());
    }
}