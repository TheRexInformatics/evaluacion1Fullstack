package com.smartlogix.pedidos.model;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class ProductoDTOTest {

    @Test
    void verificarCreacionDeProducto() {
        ProductoDTO producto = new ProductoDTO(1L, "SKU-123", "Notebook", new BigDecimal("1000"));

        assertEquals("Notebook", producto.getNombre());
    }
}