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
        when(stockRepository.findByProductoId(1L)).thenReturn(Arrays.asList(stockMock));

        Boolean resultado = productoService.verificarStockTotal("SKU-123", 100);

        assertFalse(resultado);
    }

    @Test
    void verificarStockTotal_NoExiste_DevuelveFalse() {
        when(productoRepository.findBySku("SKU-NO")).thenReturn(Optional.empty());

        Boolean resultado = productoService.verificarStockTotal("SKU-NO", 10);

        assertFalse(resultado);
    }

    // Escenario A: El pedido se completa antes y activa el 'break' (Cubre la línea interna)
    @Test
    void reducirStockGlobal_Exito() {
        Stock stock1 = stockMock;
        Stock stock2 = new Stock();
        stock2.setId(2L);
        stock2.setCantidad(20);

        Stock stock3 = new Stock();
        stock3.setId(3L);
        stock3.setCantidad(30);

        when(productoRepository.findBySku("SKU-123")).thenReturn(Optional.of(productoMock));
        when(stockRepository.findByProductoId(1L)).thenReturn(Arrays.asList(stock1, stock2, stock3));

        productoService.reducirStockGlobal("SKU-123", 60);

        assertEquals(0, stock1.getCantidad());
        assertEquals(10, stock2.getCantidad());
        assertEquals(30, stock3.getCantidad());
        verify(stockRepository, times(2)).save(any(Stock.class));
    }

    // Escenario B: Se recorre la lista completa de inicio a fin (Cubre la cabecera del 'for')
    @Test
    void reducirStockGlobal_ConsumeTodoElStock() {
        Stock stock1 = new Stock();
        stock1.setId(4L);
        stock1.setCantidad(30);

        Stock stock2 = new Stock();
        stock2.setId(5L);
        stock2.setCantidad(20);

        when(productoRepository.findBySku("SKU-123")).thenReturn(Optional.of(productoMock));
        when(stockRepository.findByProductoId(1L)).thenReturn(Arrays.asList(stock1, stock2));

        // Pedimos exactamente 50, obligando al bucle a vaciar la lista y terminar de forma natural
        productoService.reducirStockGlobal("SKU-123", 50);

        assertEquals(0, stock1.getCantidad());
        assertEquals(0, stock2.getCantidad());
        verify(stockRepository, times(2)).save(any(Stock.class));
    }

    @Test
    void reducirStockGlobal_ProductoNoEncontrado_LanzaExcepcion() {
        when(productoRepository.findBySku("SKU-NO")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> productoService.reducirStockGlobal("SKU-NO", 10));
    }

    @Test
    void findAll_DevuelveListaCorrectamente() {
        when(productoRepository.findAll()).thenReturn(Collections.singletonList(productoMock));
        List<Producto> lista = productoService.findAll();
        assertEquals(1, lista.size());
    }

    @Test
    void findById_DevuelveProducto() {
        when(productoRepository.findById(1L)).thenReturn(Optional.of(productoMock));
        Optional<Producto> porId = productoService.findById(1L);
        assertTrue(porId.isPresent());
    }

    @Test
    void findBySku_DevuelveProducto() {
        when(productoRepository.findBySku("SKU-123")).thenReturn(Optional.of(productoMock));
        Optional<Producto> porSku = productoService.findBySku("SKU-123");
        assertTrue(porSku.isPresent());
    }

    @Test
    void update_GuardaCambios() {
        when(productoRepository.save(any(Producto.class))).thenReturn(productoMock);
        Producto actualizado = productoService.update(1L, productoMock);
        assertNotNull(actualizado);
    }

    @Test
    void deleteById_EjecutaCorrectamente_EliminaElRojo() {
        doNothing().when(productoRepository).deleteById(1L);

        productoService.deleteById(1L);

        verify(productoRepository, times(1)).deleteById(1L);
    }
}