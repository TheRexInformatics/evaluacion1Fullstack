package com.smartlogix.bff;

import com.smartlogix.bff.client.InventarioClient;
import com.smartlogix.bff.client.PedidosClient;
import com.smartlogix.bff.dto.StockDTO;
import com.smartlogix.bff.dto.PedidoDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.List;

import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BffServiceApplicationTests {

    @LocalServerPort
    private int port;

    @MockitoBean
    private PedidosClient pedidosClient;

    @MockitoBean
    private InventarioClient inventarioClient;

    private WebTestClient webTestClient;

    @BeforeEach
    void setUp() {
        webTestClient = WebTestClient.bindToServer()
            .baseUrl("http://localhost:" + port)
            .build();

        PedidoDTO pedido = new PedidoDTO();
        pedido.setId(1L);
        pedido.setTotal(java.math.BigDecimal.valueOf(100));
        pedido.setEstado("PROCESADO");
        pedido.setSagaStatus("COMPLETADO");

        when(pedidosClient.listarPedidos()).thenReturn(List.of(pedido));

        StockDTO stock = new StockDTO();
        com.smartlogix.bff.dto.ProductoDTO producto = new com.smartlogix.bff.dto.ProductoDTO();
        producto.setId(1L);
        producto.setNombre("Producto Test");
        stock.setProducto(producto);
        stock.setCantidad(20);

        when(inventarioClient.listarStocks()).thenReturn(List.of(stock));
    }

    @Test
    void testObtenerKpis() {
        webTestClient.get()
            .uri("/api/bff/kpis")
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.totalPedidos").isEqualTo(1)
            .jsonPath("$.ingresos").isEqualTo(100)
            .jsonPath("$.entregados").isEqualTo(1)
            .jsonPath("$.pendientes").isEqualTo(0);
    }

    @Test
    void testObtenerDashboard() {
        webTestClient.get()
            .uri("/api/bff/dashboard")
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.kpis").exists()
            .jsonPath("$.recentOrders").isArray()
            .jsonPath("$.stockAlerts").isArray()
            .jsonPath("$.activityFeed").isArray();
    }

}
