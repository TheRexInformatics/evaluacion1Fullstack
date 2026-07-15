package com.smartlogix.bff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private KpisDTO kpis;
    private List<PedidoDTO> recentOrders;
    private List<StockAlertDTO> stockAlerts;
    private List<ActivityEventDTO> activityFeed;
}
