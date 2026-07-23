package com.hrms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SalaryDto {
    private Long id;

    @NotNull
    private Long employeeId;

    private String employeeName;
    private String employeeCode;

    @NotNull
    private Integer month;

    @NotNull
    private Integer year;

    @NotNull
    private BigDecimal basicSalary;

    private BigDecimal allowances;
    private BigDecimal deductions;
    private BigDecimal netSalary;
    private String status;
}
