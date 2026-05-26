package com.smartlogix.inventario.service;

import com.smartlogix.inventario.model.Producto;
import com.smartlogix.inventario.model.Stock;
import com.smartlogix.inventario.repository.ProductoRepository;
import com.smartlogix.inventario.repository.StockRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StockServiceImplTest {

    @Mock
    private StockRepository stockRepository;

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private StockServiceImpl stockService;

    private Stock stockMock;
    private Producto productoMock;

    @BeforeEach
    void setUp() {
        productoMock = new Producto();
        productoMock.setId(1L);

        stockMock = new Stock();
        stockMock.setId(1L);
        stockMock.setProducto(productoMock);
        stockMock.setBodegaId(2L);
        stockMock.setCantidad(20);
    }

    @Test
    void consultasBasicas_DevuelvenDatos() {
        when(stockRepository.findAll()).thenReturn(Collections.singletonList(stockMock));
        when(stockRepository.findByBodegaId(2L)).thenReturn(Collections.singletonList(stockMock));
        when(stockRepository.findByProductoIdAndBodegaId(1L, 2L)).thenReturn(Optional.of(stockMock));

        List<Stock> todos = stockService.findAll();
        List<Stock> porBodega = stockService.findByBodega(2L);
        Optional<Stock> porProdYBodega = stockService.findByProductoAndBodega(1L, 2L);

        assertEquals(1, todos.size());
        assertEquals(1, porBodega.size());
        assertTrue(porProdYBodega.isPresent());
    }

    @Test
    void registrarEntrada_StockExistente_SumaCantidad() {
        when(stockRepository.findByProductoIdAndBodegaId(1L, 2L)).thenReturn(Optional.of(stockMock));
        when(stockRepository.save(any(Stock.class))).thenReturn(stockMock);

        Stock resultado = stockService.registrarEntrada(1L, 2L, 10);

        assertEquals(30, resultado.getCantidad()); // Tenía 20 + 10
        verify(stockRepository, times(1)).save(stockMock);
    }

    @Test
    void registrarEntrada_StockNuevo_CreaYSuma() {
        when(stockRepository.findByProductoIdAndBodegaId(1L, 2L)).thenReturn(Optional.empty());
        when(productoRepository.findById(1L)).thenReturn(Optional.of(productoMock));
        when(stockRepository.save(any(Stock.class))).thenAnswer(i -> i.getArguments()[0]);

        Stock resultado = stockService.registrarEntrada(1L, 2L, 15);

        assertEquals(15, resultado.getCantidad()); // Empieza en 0 + 15
        assertEquals(1L, resultado.getProducto().getId());
    }

    @Test
    void registrarEntrada_ProductoNoEncontrado_LanzaExcepcion() {
        when(stockRepository.findByProductoIdAndBodegaId(1L, 2L)).thenReturn(Optional.empty());
        when(productoRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> stockService.registrarEntrada(1L, 2L, 10));
    }

    @Test
    void registrarSalida_Exito_RestaCantidad() {
        when(stockRepository.findByProductoIdAndBodegaId(1L, 2L)).thenReturn(Optional.of(stockMock));
        when(stockRepository.save(any(Stock.class))).thenReturn(stockMock);

        Stock resultado = stockService.registrarSalida(1L, 2L, 5);

        assertEquals(15, resultado.getCantidad()); // Tenía 20 - 5
    }

    @Test
    void registrarSalida_StockInsuficiente_LanzaExcepcion() {
        when(stockRepository.findByProductoIdAndBodegaId(1L, 2L)).thenReturn(Optional.of(stockMock)); // Tiene 20

        assertThrows(RuntimeException.class, () -> stockService.registrarSalida(1L, 2L, 50));
    }

    @Test
    void actualizarStock_ReemplazaCantidad() {
        when(stockRepository.findByProductoIdAndBodegaId(1L, 2L)).thenReturn(Optional.of(stockMock));
        when(stockRepository.save(any(Stock.class))).thenReturn(stockMock);

        Stock resultado = stockService.actualizarStock(1L, 2L, 99);

        assertEquals(99, resultado.getCantidad());
    }
}