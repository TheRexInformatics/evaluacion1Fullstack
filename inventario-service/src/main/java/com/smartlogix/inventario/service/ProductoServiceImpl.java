package com.smartlogix.inventario.service;

import com.smartlogix.inventario.model.Producto;
import com.smartlogix.inventario.model.Stock;
import com.smartlogix.inventario.repository.ProductoRepository;
import com.smartlogix.inventario.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final StockRepository stockRepository;

    @Override
    @Transactional
    public Producto save(Producto producto) {
        // 1. Guardar el producto
        Producto nuevo = productoRepository.save(producto);

        // 2. CORRECCIÓN: Crear stock inicial automático
        Stock stockInicial = new Stock();
        stockInicial.setProducto(nuevo);
        stockInicial.setCantidad(100); // 100 unidades de regalo para pruebas
        stockInicial.setBodegaId(1L);
        stockRepository.save(stockInicial);

        System.out.println("LOG: Producto " + nuevo.getSku() + " creado con 100 de stock.");
        return nuevo;
    }

    @Override
    public Boolean verificarStockTotal(String sku, Integer cantidad) {
        return productoRepository.findBySku(sku)
                .map(p -> {
                    List<Stock> stocks = stockRepository.findByProductoId(p.getId());
                    int total = stocks.stream().mapToInt(Stock::getCantidad).sum();
                    System.out.println("CHECK: SKU=" + sku + " | Stock=" + total + " | Pedido=" + cantidad);
                    return total >= cantidad;
                }).orElse(false);
    }

    @Override
    @Transactional
    public void reducirStockGlobal(String sku, Integer cantidad) {
        Producto prod = productoRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        List<Stock> stocks = stockRepository.findByProductoId(prod.getId());
        int pendiente = cantidad;
        for (Stock s : stocks) {
            if (pendiente <= 0) break;
            if (s.getCantidad() >= pendiente) {
                s.setCantidad(s.getCantidad() - pendiente);
                pendiente = 0;
            } else {
                pendiente -= s.getCantidad();
                s.setCantidad(0);
            }
            stockRepository.save(s);
        }
    }

    @Override public List<Producto> findAll() { return productoRepository.findAll(); }
    @Override public Optional<Producto> findById(Long id) { return productoRepository.findById(id); }
    @Override public Optional<Producto> findBySku(String sku) { return productoRepository.findBySku(sku); }
    @Override @Transactional public void deleteById(Long id) { productoRepository.deleteById(id); }
    @Override @Transactional public Producto update(Long id, Producto p) { return productoRepository.save(p); }
}