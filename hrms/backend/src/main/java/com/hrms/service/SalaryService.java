package com.hrms.service;

import com.hrms.dto.SalaryDto;
import com.hrms.entity.Employee;
import com.hrms.entity.Salary;
import com.hrms.exception.BadRequestException;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.SalaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class SalaryService {

    private final SalaryRepository salaryRepository;
    private final EmployeeRepository employeeRepository;

    public Page<SalaryDto> getAll(Pageable pageable) {
        return salaryRepository.findByDeletedFalseOrderByYearDescMonthDesc(pageable).map(this::toDto);
    }

    public Page<SalaryDto> getForEmployee(Long employeeId, Pageable pageable) {
        return salaryRepository.findByEmployeeIdAndDeletedFalseOrderByYearDescMonthDesc(employeeId, pageable)
                .map(this::toDto);
    }

    @Transactional
    public SalaryDto generate(SalaryDto dto) {
        if (salaryRepository.findByEmployeeIdAndMonthAndYear(dto.getEmployeeId(), dto.getMonth(), dto.getYear()).isPresent()) {
            throw new BadRequestException("Salary for this employee and month already exists");
        }

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        Salary salary = new Salary();
        salary.setEmployee(employee);
        salary.setMonth(dto.getMonth());
        salary.setYear(dto.getYear());
        salary.setBasicSalary(dto.getBasicSalary());
        salary.setAllowances(dto.getAllowances() != null ? dto.getAllowances() : BigDecimal.ZERO);
        salary.setDeductions(dto.getDeductions() != null ? dto.getDeductions() : BigDecimal.ZERO);
        salary.setNetSalary(computeNet(salary.getBasicSalary(), salary.getAllowances(), salary.getDeductions()));
        salary.setStatus(Salary.PaymentStatus.PENDING);

        return toDto(salaryRepository.save(salary));
    }

    @Transactional
    public SalaryDto markPaid(Long id) {
        Salary salary = salaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salary record not found"));
        salary.setStatus(Salary.PaymentStatus.PAID);
        return toDto(salaryRepository.save(salary));
    }

    private BigDecimal computeNet(BigDecimal basic, BigDecimal allowances, BigDecimal deductions) {
        return basic.add(allowances).subtract(deductions);
    }

    private SalaryDto toDto(Salary s) {
        SalaryDto dto = new SalaryDto();
        dto.setId(s.getId());
        dto.setEmployeeId(s.getEmployee().getId());
        dto.setEmployeeName(s.getEmployee().getFirstName() + " " +
                (s.getEmployee().getLastName() != null ? s.getEmployee().getLastName() : ""));
        dto.setEmployeeCode(s.getEmployee().getEmployeeCode());
        dto.setMonth(s.getMonth());
        dto.setYear(s.getYear());
        dto.setBasicSalary(s.getBasicSalary());
        dto.setAllowances(s.getAllowances());
        dto.setDeductions(s.getDeductions());
        dto.setNetSalary(s.getNetSalary());
        dto.setStatus(s.getStatus().name());
        return dto;
    }
}
