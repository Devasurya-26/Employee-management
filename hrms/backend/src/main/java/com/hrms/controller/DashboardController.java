package com.hrms.controller;

import com.hrms.repository.*;
import com.hrms.entity.LeaveRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> summary() {
        Map<String, Object> summary = new LinkedHashMap<>();

        long totalEmployees = employeeRepository.findByDeletedFalse(PageRequest.of(0, 1)).getTotalElements();
        long totalDepartments = departmentRepository.findByDeletedFalse(PageRequest.of(0, 1)).getTotalElements();
        long presentToday = attendanceRepository.findByDateAndDeletedFalse(LocalDate.now()).size();
        long pendingLeaves = leaveRequestRepository
                .findByStatusAndDeletedFalse(LeaveRequest.LeaveStatus.PENDING, PageRequest.of(0, 1))
                .getTotalElements();

        summary.put("totalEmployees", totalEmployees);
        summary.put("totalDepartments", totalDepartments);
        summary.put("presentToday", presentToday);
        summary.put("pendingLeaves", pendingLeaves);

        return ResponseEntity.ok(summary);
    }
}
