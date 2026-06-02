package com.smartlogix.pedidos;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
		"spring.datasource.url=jdbc:postgresql://localhost:5434/smartlogix_pedidos",
		"spring.datasource.username=user_logix",
		"spring.datasource.password=password123"
})
class PedidosServiceApplicationTests {

	@Test
	void contextLoads() {
		// Verifica que el contexto de Spring cargue correctamente usando tu Docker
	}
}