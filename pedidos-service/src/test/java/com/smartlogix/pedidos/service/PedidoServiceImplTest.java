package com.smartlogix.pedidos.service;

import com.smartlogix.pedidos.client.InventarioClient;
import com.smartlogix.pedidos.model.Pedido;
import com.smartlogix.pedidos.model.ProductoDTO;
import com.smartlogix.pedidos.repository.PedidoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PedidoServiceImplTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private InventarioClient inventarioClient;

    @InjectMocks
    private PedidoServiceImpl pedidoService;

    private Pedido pedidoMock;
    private ProductoDTO productoMock;

    @BeforeEach
    void setUp() {
        pedidoMock = new Pedido();
        pedidoMock.setId(1L);
        pedidoMock.setProductoId(100L);
        pedidoMock.setCodigoProducto("SKU-123");
        pedidoMock.setCantidad(2);

        productoMock = new ProductoDTO();
        productoMock.setId(100L);
        productoMock.setPrecio(new BigDecimal("50.00"));
    }

    @Test
    void crearPedido_Exitoso() {
        // Simular que SI hay stock
        when(inventarioClient.checkStock("SKU-123", 2)).thenReturn(true);
        // Simular que el producto existe
        when(inventarioClient.getProductoById(100L)).thenReturn(productoMock);
        // Simular el guardado
        when(pedidoRepository.save(any(Pedido.class))).thenReturn(pedidoMock);

        Pedido resultado = pedidoService.crearPedido(pedidoMock);

        assertNotNull(resultado);
        assertEquals("PROCESADO", pedidoMock.getEstado());
        assertEquals(new BigDecimal("100.00"), pedidoMock.getTotal()); // 50 * 2

        // Verificar que se haya llamado a reducirStock
        verify(inventarioClient, times(1)).reducirStock("SKU-123", 2);
    }

    @Test
    void crearPedido_FallaPorSinStock() {
        // Simular que NO hay stock
        when(inventarioClient.checkStock("SKU-123", 2)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pedidoService.crearPedido(pedidoMock);
        });

        assertTrue(exception.getMessage().contains("Sin stock suficiente"));
        verify(pedidoRepository, never()).save(any(Pedido.class));
    }

    @Test
    void crearPedido_FallaPorStockNull() {
        // Simular que el servicio de inventario responde null
        when(inventarioClient.checkStock("SKU-123", 2)).thenReturn(null);

        assertThrows(RuntimeException.class, () -> pedidoService.crearPedido(pedidoMock));
    }

    @Test
    void crearPedido_FallaPorProductoNoExistente() {
        // Si hay stock, pero el producto no existe
        when(inventarioClient.checkStock("SKU-123", 2)).thenReturn(true);
        when(inventarioClient.getProductoById(100L)).thenReturn(null);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pedidoService.crearPedido(pedidoMock);
        });

        assertEquals("El producto no existe en el sistema de inventario.", exception.getMessage());
    }

    @Test
    void findAll_Exitoso() {
        when(pedidoRepository.findAll()).thenReturn(Arrays.asList(pedidoMock));

        List<Pedido> resultado = pedidoService.findAll();

        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
    }

    @Test
    void findById_Exitoso() {
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedidoMock));

        Optional<Pedido> resultado = pedidoService.findById(1L);

        assertTrue(resultado.isPresent());
        assertEquals("SKU-123", resultado.get().getCodigoProducto());
    }
}