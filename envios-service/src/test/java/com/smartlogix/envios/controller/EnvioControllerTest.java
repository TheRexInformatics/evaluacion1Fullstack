package com.smartlogix.envios.controller;

import com.smartlogix.envios.model.Envio;
import com.smartlogix.envios.model.EstadoEnvio;
import com.smartlogix.envios.service.EnvioService;
import com.smartlogix.envios.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EnvioControllerTest {

    @Mock
    private EnvioService envioService;

    @InjectMocks
    private EnvioController envioController;

    private Envio envioMock;

    @BeforeEach
    void setUp() {
        envioMock = new Envio();
    }

    // ==========================================
    // TESTS PARA: crearEnvio
    // ==========================================

    @Test
    void crearEnvio_DebeRetornarEnvioYStatus200() {
        when(envioService.crearEnvio(100L, "Direccion Test")).thenReturn(envioMock);

        ResponseEntity<Envio> response = envioController.crearEnvio(100L, "Direccion Test");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    // ==========================================
    // TESTS PARA: obtenerEnvioPorPedido
    // ==========================================

    @Test
    void obtenerEnvioPorPedido_DebeRetornarEnvioYStatus200() {
        when(envioService.obtenerPorPedidoId(100L)).thenReturn(envioMock);

        ResponseEntity<Envio> response = envioController.obtenerEnvioPorPedido(100L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void obtenerEnvioPorPedido_NoExiste_LanzaResourceNotFoundException() {
        // ✔️ Al retornar null obligamos al flujo a entrar al 'if (envio == null)' del controlador
        when(envioService.obtenerPorPedidoId(999L)).thenReturn(null);

        assertThrows(ResourceNotFoundException.class, () -> {
            envioController.obtenerEnvioPorPedido(999L);
        });
    }

    // ==========================================
    // TESTS PARA: actualizarEstado
    // ==========================================

    @Test
    void actualizarEstado_DebeRetornarEnvioYStatus200() {
        when(envioService.actualizarEstado(eq(1L), any(), eq("FedEx"))).thenReturn(envioMock);

        ResponseEntity<Envio> response = envioController.actualizarEstado(1L, (EstadoEnvio) null, "FedEx");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void actualizarEstado_EnvioNoExiste_LanzaResourceNotFoundException() {
        // ✔️ Al retornar null obligamos al flujo a entrar al 'if (envioActualizado == null)' del controlador
        when(envioService.actualizarEstado(eq(999L), any(), eq("FedEx"))).thenReturn(null);

        assertThrows(ResourceNotFoundException.class, () -> {
            envioController.actualizarEstado(999L, (EstadoEnvio) null, "FedEx");
        });
    }
}