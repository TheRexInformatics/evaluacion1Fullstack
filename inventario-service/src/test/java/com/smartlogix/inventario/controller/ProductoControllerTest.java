package com.smartlogix.inventario.controller;

import com.smartlogix.inventario.model.Producto;
import com.smartlogix.inventario.service.ProductoService;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoControllerTest {

    @Mock
    private ProductoService productoService;

    @InjectMocks
    private ProductoController productoController;

    private Producto productoMock;

    @BeforeEach
    void setUp() {
        productoMock = new Producto();
        productoMock.setId(1L);
        productoMock.setSku("SKU-123");
    }

    @Test
    void checkStock_DevuelveTrueY200() {
        when(productoService.verificarStockTotal("SKU-123", 5)).thenReturn(true);

        ResponseEntity<Boolean> response = productoController.checkStock("SKU-123", 5);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());
    }

    @Test
    void reducirStock_Exito_Devuelve200() {
        doNothing().when(productoService).reducirStockGlobal("SKU-123", 2);

        ResponseEntity<Void> response = productoController.reducirStock("SKU-123", 2);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void reducirStock_Error_Devuelve400() {
        doThrow(new RuntimeException("Stock insuficiente")).when(productoService).reducirStockGlobal("SKU-123", 100);

        assertThrows(RuntimeException.class, () -> {
            productoController.reducirStock("SKU-123", 100);
        });
    }

    @Test
    void findAll_DevuelveLista() {
        when(productoService.findAll()).thenReturn(Arrays.asList(productoMock));

        List<Producto> result = productoController.findAll();

        assertEquals(1, result.size());
        assertEquals("SKU-123", result.get(0).getSku());
    }

    @Test
    void findById_Existe_Devuelve200() {
        when(productoService.findById(1L)).thenReturn(Optional.of(productoMock));

        ResponseEntity<Producto> response = productoController.findById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(productoMock, response.getBody());
    }

    @Test
    void findById_NoExiste_Devuelve404() {
        when(productoService.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            productoController.findById(99L);
        });
    }

    @Test
    void findBySku_Existe_Devuelve200() {
        when(productoService.findBySku("SKU-123")).thenReturn(Optional.of(productoMock));

        ResponseEntity<Producto> response = productoController.findBySku("SKU-123");

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void findBySku_NoExiste_Devuelve404() {
        when(productoService.findBySku("NO-EXISTE")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            productoController.findBySku("NO-EXISTE");
        });
    }

    @Test
    void create_Exito_Devuelve201() {
        when(productoService.save(any(Producto.class))).thenReturn(productoMock);

        ResponseEntity<Producto> response = productoController.create(new Producto());

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void update_Exito_Devuelve200() {
        when(productoService.update(eq(1L), any(Producto.class))).thenReturn(productoMock);

        ResponseEntity<Producto> response = productoController.update(1L, new Producto());

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void update_Error_Devuelve404() {
        when(productoService.update(eq(99L), any(Producto.class))).thenThrow(new RuntimeException("Not found"));

        assertThrows(RuntimeException.class, () -> {
            productoController.update(99L, new Producto());
        });
    }

    @Test
    void delete_Exito_Devuelve204() {
        doNothing().when(productoService).deleteById(1L);

        ResponseEntity<Void> response = productoController.delete(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }
}