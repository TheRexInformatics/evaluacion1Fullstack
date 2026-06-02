package com.smartlogix.envios;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
		"spring.datasource.url=jdbc:postgresql://localhost:5435/smartlogix_envios",
		"spring.datasource.username=user_logix",
		"spring.datasource.password=password123"
})
class EnviosServiceApplicationTests {

	@Test
	void contextLoads() {
		// Verifica la carga del contexto usando tu base de datos de envíos
	}
}