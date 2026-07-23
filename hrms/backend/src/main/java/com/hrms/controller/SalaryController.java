package com.hrms.controller;

import com.hrms.dto.SalaryDto;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.EmployeeRepository;
import com.hrms.service.SalaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/salaries")
@RequiredArgsConstructor
public class SalaryController {

    private final SalaryService salaryService;
    private final EmployeeRepository employeeRepository;

    @GetMapping
    public ResponseEntity<Page<SalaryDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(salaryService.getAll(PageRequest.of(page, size)));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<SalaryDto>> getMine(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long employeeId = employeeRepository.findByUserUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"))
                .getId();
        return ResponseEntity.ok(salaryService.getForEmployee(employeeId, PageRequest.of(page, size)));
    }

    @PostMapping("/generate")
    public ResponseEntity<SalaryDto> generate(@Valid @RequestBody SalaryDto dto) {
        return ResponseEntity.ok(salaryService.generate(dto));
    }

    @PutMapping("/{id}/mark-paid")
    public ResponseEntity<SalaryDto> markPaid(@PathVariable Long id) {
        return ResponseEntity.ok(salaryService.markPaid(id));
    }
}
