package com.hrms.controller;

import com.hrms.entity.Attendance;
import com.hrms.entity.Employee;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.AttendanceRepository;
import com.hrms.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<Page<Attendance>> getForEmployee(
            @PathVariable Long employeeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return ResponseEntity.ok(attendanceRepository.findByEmployeeIdAndDeletedFalse(employeeId, pageable));
    }

    // Self check-in - resolves employee from the logged in user
    @PostMapping("/check-in")
    public ResponseEntity<Attendance> checkIn(Authentication authentication) {
        Employee employee = employeeRepository.findByUserUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for current user"));

        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), today)
                .orElseGet(Attendance::new);

        attendance.setEmployee(employee);
        attendance.setDate(today);
        attendance.setCheckIn(LocalTime.now());
        attendance.setStatus(Attendance.AttendanceStatus.PRESENT);

        return ResponseEntity.ok(attendanceRepository.save(attendance));
    }

    @PostMapping("/check-out")
    public ResponseEntity<Attendance> checkOut(Authentication authentication) {
        Employee employee = employeeRepository.findByUserUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for current user"));

        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), today)
                .orElseThrow(() -> new ResourceNotFoundException("You have not checked in today"));

        attendance.setCheckOut(LocalTime.now());
        return ResponseEntity.ok(attendanceRepository.save(attendance));
    }

    // Admin: mark attendance manually for any employee
    @PostMapping("/mark")
    public ResponseEntity<Attendance> mark(@RequestBody Attendance payload) {
        Attendance attendance = attendanceRepository
                .findByEmployeeIdAndDate(payload.getEmployee().getId(), payload.getDate())
                .orElse(new Attendance());
        attendance.setEmployee(payload.getEmployee());
        attendance.setDate(payload.getDate());
        attendance.setStatus(payload.getStatus());
        attendance.setCheckIn(payload.getCheckIn());
        attendance.setCheckOut(payload.getCheckOut());
        return ResponseEntity.ok(attendanceRepository.save(attendance));
    }
}
