package com.smartlogix.bff.service;

import com.smartlogix.bff.client.EnvioClient;
import com.smartlogix.bff.client.PedidoClient;
import com.smartlogix.bff.dto.EnvioDTO;
import com.smartlogix.bff.dto.PedidoDTO;
import com.smartlogix.bff.dto.ResumenCompraDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BffServiceTest {

    @Mock
    private PedidoClient pedidoClient;

    @Mock
    private EnvioClient envioClient;

    @InjectMocks
    private BffService bffService;

    @Test
    void obtenerResumenCompleto_Exito_UnificaDatosDeAmbosClientes() {
        // 1. Mockeamos los DTOs usando mock() para no depender de sus constructores directos
        PedidoDTO pedidoMock = mock(PedidoDTO.class);
        when(pedidoMock.getId()).thenReturn(100L);
        when(pedidoMock.getEstado()).thenReturn("APROBADO"); // <-- Texto limpio para Mockito

        EnvioDTO envioMock = mock(EnvioDTO.class);
        when(envioMock.getDireccionDestino()).thenReturn("Av. Siempre Viva");
        when(envioMock.getEstado()).thenReturn("EN_TRANSITO"); // <-- Texto limpio para Mockito
        when(envioMock.getCodigoSeguimiento()).thenReturn("SLX-999");

        // 2. Simulamos las llamadas de los clientes Feign
        when(pedidoClient.obtenerPedidoPorId(100L)).thenReturn(pedidoMock);
        when(envioClient.obtenerEnvioPorPedido(100L)).thenReturn(envioMock);

        // 3. Ejecutamos el método del BFF
        ResumenCompraDTO resultado = bffService.obtenerResumenCompleto(100L);

        // 4. Verificaciones
        assertNotNull(resultado);
        assertEquals(100L, resultado.getIdPedido());
        assertEquals("APROBADO", resultado.getEstadoPedido());
        assertEquals("Av. Siempre Viva", resultado.getDireccionEntrega());
        assertEquals("EN_TRANSITO", resultado.getEstadoLogistico());
        assertEquals("SLX-999", resultado.getTrackingCode());
    }
}