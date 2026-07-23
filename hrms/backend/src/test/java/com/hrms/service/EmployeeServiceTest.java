package com.hrms.service;

import com.hrms.dto.EmployeeDto;
import com.hrms.entity.Department;
import com.hrms.entity.Employee;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.DepartmentRepository;
import com.hrms.repository.DesignationRepository;
import com.hrms.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock private EmployeeRepository employeeRepository;
    @Mock private DepartmentRepository departmentRepository;
    @Mock private DesignationRepository designationRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee employee;

    @BeforeEach
    void setUp() {
        employee = new Employee();
        employee.setId(1L);
        employee.setFirstName("Arun");
        employee.setLastName("Kumar");
        employee.setEmployeeCode("EMP001");
    }

    @Test
    void getById_returnsEmployeeDto_whenEmployeeExists() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        EmployeeDto result = employeeService.getById(1L);

        assertThat(result.getFirstName()).isEqualTo("Arun");
        assertThat(result.getEmployeeCode()).isEqualTo("EMP001");
    }

    @Test
    void getById_throwsResourceNotFoundException_whenEmployeeMissing() {
        when(employeeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void getById_throwsResourceNotFoundException_whenEmployeeIsSoftDeleted() {
        employee.setDeleted(true);
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        assertThatThrownBy(() -> employeeService.getById(1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void create_savesEmployeeWithDepartment_whenDepartmentIdProvided() {
        EmployeeDto dto = new EmployeeDto();
        dto.setFirstName("Priya");
        dto.setDepartmentId(5L);

        Department department = new Department();
        department.setId(5L);
        department.setName("Engineering");

        when(departmentRepository.findById(5L)).thenReturn(Optional.of(department));
        when(employeeRepository.save(any(Employee.class))).thenAnswer(inv -> inv.getArgument(0));

        EmployeeDto result = employeeService.create(dto);

        assertThat(result.getFirstName()).isEqualTo("Priya");
        assertThat(result.getDepartmentName()).isEqualTo("Engineering");
        verify(employeeRepository).save(any(Employee.class));
    }

    @Test
    void delete_softDeletesEmployee_ratherThanRemovingRow() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(employeeRepository.save(any(Employee.class))).thenAnswer(inv -> inv.getArgument(0));

        employeeService.delete(1L);

        assertThat(employee.isDeleted()).isTrue();
        verify(employeeRepository).save(employee);
        verify(employeeRepository, never()).delete(any());
    }
}
