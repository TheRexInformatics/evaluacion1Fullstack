package com.smartlogix.pedidos.model;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class ProductoDTOTest {

    @Test
    void verificarCreacionDeProducto() {
        // Creamos un producto de prueba
        ProductoDTO producto = new ProductoDTO(1L, "SKU-123", "Notebook", new BigDecimal("1000"));

        // Verificamos que el nombre se guardó correctamente
        assertEquals("Notebook", producto.getNombre());
    }
}