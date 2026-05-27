package com.smartlogix.bff.controller;

import com.smartlogix.bff.dto.ResumenCompraDTO;
import com.smartlogix.bff.service.BffService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BffControllerTest {

    @Mock
    private BffService bffService;

    @InjectMocks
    private BffController bffController;

    @Test
    void getResumen_DebeRetornarStatus200_Y_Resumen() {
        // Simulamos la respuesta del servicio usando el Builder de tu DTO
        ResumenCompraDTO mockResumen = ResumenCompraDTO.builder()
                .idPedido(100L)
                .estadoPedido("CONFIRMADO")
                .direccionEntrega("Calle Luna 123")
                .estadoLogistico("EN_TRANSITO")
                .trackingCode("SLX-TEST")
                .build();

        when(bffService.obtenerResumenCompleto(100L)).thenReturn(mockResumen);
        // Ejecutamos el controlador
        ResponseEntity<ResumenCompraDTO> response = bffController.getResumen(100L);
        // Verificamos
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(100L, response.getBody().getIdPedido());
    }
}