    package com.smartlogix.pedidos.client;

    import com.smartlogix.pedidos.model.ProductoDTO;
    import org.springframework.cloud.openfeign.FeignClient;
    import org.springframework.web.bind.annotation.*;

    @FeignClient(name = "inventario-service", url = "http://inventario-service:8081")
    public interface InventarioClient {

        @GetMapping("/api/productos/check-stock")
        Boolean checkStock(@RequestParam("sku") String sku, @RequestParam("cantidad") Integer cantidad);

        @PutMapping("/api/productos/reducir-stock")
        void reducirStock(@RequestParam("sku") String sku, @RequestParam("cantidad") Integer cantidad);

        @GetMapping("/api/productos/{id}")
        ProductoDTO getProductoById(@PathVariable("id") Long id);
    }