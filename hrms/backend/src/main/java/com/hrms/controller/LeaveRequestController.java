package com.hrms.controller;

import com.hrms.dto.ApiResponse;
import com.hrms.dto.LeaveRequestDto;
import com.hrms.entity.Employee;
import com.hrms.entity.LeaveRequest;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.LeaveRequestRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    @GetMapping
    public ResponseEntity<Page<LeaveRequest>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<LeaveRequest> result = (status == null || status.isBlank())
                ? leaveRequestRepository.findByDeletedFalse(pageable)
                : leaveRequestRepository.findByStatusAndDeletedFalse(LeaveRequest.LeaveStatus.valueOf(status.toUpperCase()), pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/my")
    public ResponseEntity<Page<LeaveRequest>> getMine(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Employee employee = employeeRepository.findByUserUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(leaveRequestRepository.findByEmployeeIdAndDeletedFalse(employee.getId(), pageable));
    }

    @PostMapping("/apply")
    public ResponseEntity<LeaveRequest> apply(Authentication authentication, @Valid @RequestBody LeaveRequestDto dto) {
        Employee employee = employeeRepository.findByUserUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        LeaveRequest leave = new LeaveRequest();
        leave.setEmployee(employee);
        leave.setStartDate(dto.getStartDate());
        leave.setEndDate(dto.getEndDate());
        leave.setLeaveType(dto.getLeaveType());
        leave.setReason(dto.getReason());
        leave.setStatus(LeaveRequest.LeaveStatus.PENDING);

        return ResponseEntity.ok(leaveRequestRepository.save(leave));
    }

    // Admin approves or rejects
    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveRequest> updateStatus(@PathVariable Long id,
                                                       @RequestParam String status,
                                                       @RequestParam(required = false) String remarks) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .filter(l -> !l.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        leave.setStatus(LeaveRequest.LeaveStatus.valueOf(status.toUpperCase()));
        leave.setAdminRemarks(remarks);
        return ResponseEntity.ok(leaveRequestRepository.save(leave));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> cancel(@PathVariable Long id) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));
        leave.setStatus(LeaveRequest.LeaveStatus.CANCELLED);
        leaveRequestRepository.save(leave);
        return ResponseEntity.ok(new ApiResponse(true, "Leave request cancelled"));
    }
}
