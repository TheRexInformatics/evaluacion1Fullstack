package com.smartlogix.bff.client;

import com.smartlogix.bff.dto.StockDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "inventario-service", url = "${services.inventario.url}")
public interface InventarioClient {

    @GetMapping("/api/stocks")
    List<StockDTO> listarStocks();
}
