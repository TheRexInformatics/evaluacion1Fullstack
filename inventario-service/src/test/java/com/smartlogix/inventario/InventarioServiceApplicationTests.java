package com.smartlogix.inventario;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
		"spring.datasource.url=jdbc:postgresql://localhost:5433/smartlogix_inventario",
		"spring.datasource.username=user_logix",
		"spring.datasource.password=password123"
})
class InventarioServiceApplicationTests {

	@Test
	void contextLoads() {
		// Verifica que el contexto cargue correctamente usando el Docker de Inventario
	}
}