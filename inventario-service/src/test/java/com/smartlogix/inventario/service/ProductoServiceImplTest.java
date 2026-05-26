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

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceImplTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private StockRepository stockRepository;

    @InjectMocks
    private ProductoServiceImpl productoService;

    private Producto productoMock;
    private Stock stockMock;

    @BeforeEach
    void setUp() {
        productoMock = new Producto();
        productoMock.setId(1L);
        productoMock.setSku("SKU-123");

        stockMock = new Stock();
        stockMock.setId(1L);
        stockMock.setProducto(productoMock);
        stockMock.setCantidad(50);
        stockMock.setBodegaId(1L);
    }

    @Test
    void save_GuardaProductoYCreaStockInicial() {
        when(productoRepository.save(any(Producto.class))).thenReturn(productoMock);
        when(stockRepository.save(any(Stock.class))).thenReturn(stockMock);

        Producto resultado = productoService.save(productoMock);

        assertNotNull(resultado);
        verify(productoRepository, times(1)).save(productoMock);
        verify(stockRepository, times(1)).save(any(Stock.class));
    }

    @Test
    void verificarStockTotal_Suficiente_DevuelveTrue() {
        when(productoRepository.findBySku("SKU-123")).thenReturn(Optional.of(productoMock));
        when(stockRepository.findByProductoId(1L)).thenReturn(Arrays.asList(stockMock));

        Boolean resultado = productoService.verificarStockTotal("SKU-123", 20);

        assertTrue(resultado);
    }

    @Test
    void verificarStockTotal_Insuficiente_DevuelveFalse() {
        when(productoRepository.findBySku("SKU-123")).thenReturn(Optional.of(productoMock));
        when(stockRepository.findByProductoId(1L)).thenReturn(Arrays.asList(stockMock)); // Stock es 50

        Boolean resultado = productoService.verificarStockTotal("SKU-123", 100);

        assertFalse(resultado);
    }

    @Test
    void verificarStockTotal_NoExiste_DevuelveFalse() {
        when(productoRepository.findBySku("SKU-NO")).thenReturn(Optional.empty());

        Boolean resultado = productoService.verificarStockTotal("SKU-NO", 10);

        assertFalse(resultado);
    }

    @Test
    void reducirStockGlobal_Exito() {
        Stock stock2 = new Stock();
        stock2.setCantidad(20);

        when(productoRepository.findBySku("SKU-123")).thenReturn(Optional.of(productoMock));
        when(stockRepository.findByProductoId(1L)).thenReturn(Arrays.asList(stockMock, stock2)); // 50 + 20

        productoService.reducirStockGlobal("SKU-123", 60);

        // stockMock (50) debería quedar en 0. stock2 (20) debería quedar en 10.
        assertEquals(0, stockMock.getCantidad());
        assertEquals(10, stock2.getCantidad());
        verify(stockRepository, times(2)).save(any(Stock.class));
    }

    @Test
    void reducirStockGlobal_ProductoNoEncontrado_LanzaExcepcion() {
        when(productoRepository.findBySku("SKU-NO")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> productoService.reducirStockGlobal("SKU-NO", 10));
    }

    @Test
    void crudBasico_FuncionaCorrectamente() {
        when(productoRepository.findAll()).thenReturn(Collections.singletonList(productoMock));
        when(productoRepository.findById(1L)).thenReturn(Optional.of(productoMock));
        when(productoRepository.findBySku("SKU-123")).thenReturn(Optional.of(productoMock));
        when(productoRepository.save(any(Producto.class))).thenReturn(productoMock);

        List<Producto> lista = productoService.findAll();
        Optional<Producto> porId = productoService.findById(1L);
        Optional<Producto> porSku = productoService.findBySku("SKU-123");
        Producto actualizado = productoService.update(1L, productoMock);

        productoService.deleteById(1L);

        assertEquals(1, lista.size());
        assertTrue(porId.isPresent());
        assertTrue(porSku.isPresent());
        assertNotNull(actualizado);
        verify(productoRepository, times(1)).deleteById(1L);
    }
}