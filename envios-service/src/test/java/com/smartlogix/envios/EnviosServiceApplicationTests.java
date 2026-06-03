package com.smartlogix.envios;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

// LE INYECTAMOS LA RUTA QUE SÍ FUNCIONA PARA QUE EL CONTEXTO LEVANTE
@SpringBootTest(properties = {
		"spring.datasource.url=jdbc:postgresql://localhost:5433/postgres",
		"spring.datasource.username=user_logix",
		"spring.datasource.password=password123"
})
class EnviosServiceApplicationTests {

	@Test
	void contextLoads() {
		// Este test solo verifica que Spring Boot pueda arrancar correctamente
	}

}