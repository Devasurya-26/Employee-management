package com.hrms.service;

import com.hrms.dto.EmployeeDto;
import com.hrms.entity.Department;
import com.hrms.entity.Designation;
import com.hrms.entity.Employee;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.DepartmentRepository;
import com.hrms.repository.DesignationRepository;
import com.hrms.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;

    public Page<EmployeeDto> getAll(Pageable pageable, String search) {
        Page<Employee> page = (search == null || search.isBlank())
                ? employeeRepository.findByDeletedFalse(pageable)
                : employeeRepository.findByDeletedFalseAndFirstNameContainingIgnoreCaseOrDeletedFalseAndLastNameContainingIgnoreCase(
                        search, search, pageable);
        return page.map(this::toDto);
    }

    public EmployeeDto getById(Long id) {
        return toDto(findOrThrow(id));
    }

    public EmployeeDto getByUsername(String username) {
        Employee employee = employeeRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for user: " + username));
        return toDto(employee);
    }

    @Transactional
    public EmployeeDto create(EmployeeDto dto) {
        Employee employee = new Employee();
        applyDto(employee, dto);
        return toDto(employeeRepository.save(employee));
    }

    @Transactional
    public EmployeeDto update(Long id, EmployeeDto dto) {
        Employee employee = findOrThrow(id);
        applyDto(employee, dto);
        return toDto(employeeRepository.save(employee));
    }

    @Transactional
    public void delete(Long id) {
        Employee employee = findOrThrow(id);
        employee.setDeleted(true); // soft delete
        employeeRepository.save(employee);
    }

    public EmployeeDto updateProfileImage(Long id, String imageUrl) {
        Employee employee = findOrThrow(id);
        employee.setProfileImageUrl(imageUrl);
        return toDto(employeeRepository.save(employee));
    }

    private void applyDto(Employee employee, EmployeeDto dto) {
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmployeeCode(dto.getEmployeeCode());
        employee.setPhone(dto.getPhone());
        employee.setAddress(dto.getAddress());
        employee.setDateOfBirth(dto.getDateOfBirth());
        employee.setDateOfJoining(dto.getDateOfJoining());
        employee.setGender(dto.getGender());

        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            employee.setDepartment(department);
        }
        if (dto.getDesignationId() != null) {
            Designation designation = designationRepository.findById(dto.getDesignationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Designation not found"));
            employee.setDesignation(designation);
        }
    }

    private Employee findOrThrow(Long id) {
        return employeeRepository.findById(id)
                .filter(e -> !e.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    private EmployeeDto toDto(Employee e) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(e.getId());
        dto.setFirstName(e.getFirstName());
        dto.setLastName(e.getLastName());
        dto.setEmployeeCode(e.getEmployeeCode());
        dto.setPhone(e.getPhone());
        dto.setAddress(e.getAddress());
        dto.setDateOfBirth(e.getDateOfBirth());
        dto.setDateOfJoining(e.getDateOfJoining());
        dto.setGender(e.getGender());
        dto.setProfileImageUrl(e.getProfileImageUrl());

        if (e.getDepartment() != null) {
            dto.setDepartmentId(e.getDepartment().getId());
            dto.setDepartmentName(e.getDepartment().getName());
        }
        if (e.getDesignation() != null) {
            dto.setDesignationId(e.getDesignation().getId());
            dto.setDesignationTitle(e.getDesignation().getTitle());
        }
        if (e.getUser() != null) {
            dto.setUsername(e.getUser().getUsername());
            dto.setEmail(e.getUser().getEmail());
        }
        return dto;
    }
}
