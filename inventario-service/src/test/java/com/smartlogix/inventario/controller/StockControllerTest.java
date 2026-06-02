package com.smartlogix.inventario.controller;

import com.smartlogix.inventario.model.Stock;
import com.smartlogix.inventario.service.StockService;
import com.smartlogix.inventario.exception.ResourceNotFoundException;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StockControllerTest {

    @Mock
    private StockService stockService;

    @InjectMocks
    private StockController stockController;

    private Stock stockMock;

    @BeforeEach
    void setUp() {
        stockMock = new Stock();
        stockMock.setId(1L);
        stockMock.setCantidad(10);
    }

    @Test
    void findAll_DevuelveLista() {
        when(stockService.findAll()).thenReturn(Arrays.asList(stockMock));

        List<Stock> result = stockController.findAll();

        assertEquals(1, result.size());
    }

    @Test
    void findByBodega_DevuelveLista() {
        when(stockService.findByBodega(1L)).thenReturn(Arrays.asList(stockMock));

        List<Stock> result = stockController.findByBodega(1L);

        assertEquals(1, result.size());
    }

    @Test
    void findByProductoAndBodega_Existe_Devuelve200() {
        when(stockService.findByProductoAndBodega(1L, 2L)).thenReturn(Optional.of(stockMock));

        ResponseEntity<Stock> response = stockController.findByProductoAndBodega(1L, 2L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void findByProductoAndBodega_NoExiste_Devuelve404() {
        when(stockService.findByProductoAndBodega(1L, 2L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            stockController.findByProductoAndBodega(1L, 2L);
        });
    }

    @Test
    void registrarEntrada_Devuelve200() {
        when(stockService.registrarEntrada(1L, 2L, 5)).thenReturn(stockMock);

        ResponseEntity<Stock> response = stockController.registrarEntrada(1L, 2L, 5);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void registrarSalida_Exito_Devuelve200() {
        when(stockService.registrarSalida(1L, 2L, 5)).thenReturn(stockMock);

        ResponseEntity<Stock> response = stockController.registrarSalida(1L, 2L, 5);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void registrarSalida_Error_Devuelve400() {
        when(stockService.registrarSalida(1L, 2L, 500)).thenThrow(new RuntimeException("No hay stock"));

        assertThrows(RuntimeException.class, () -> {
            stockController.registrarSalida(1L, 2L, 500);
        });
    }

    @Test
    void actualizarStock_Devuelve200() {
        when(stockService.actualizarStock(1L, 2L, 20)).thenReturn(stockMock);

        ResponseEntity<Stock> response = stockController.actualizarStock(1L, 2L, 20);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}