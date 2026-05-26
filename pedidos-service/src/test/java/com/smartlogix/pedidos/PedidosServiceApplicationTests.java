package com.smartlogix.pedidos;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles; // Importante

@SpringBootTest
@ActiveProfiles("test") // <-- Si falta esto, Spring Boot usará el perfil por defecto
class PedidosServiceApplicationTests {

	@Test
	void contextLoads() {
	}
}