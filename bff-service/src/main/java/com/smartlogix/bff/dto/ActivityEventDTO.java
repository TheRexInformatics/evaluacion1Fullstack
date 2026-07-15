package com.smartlogix.bff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityEventDTO {
    private Long id;
    private String type;
    private String msg;
    private String time;
}
