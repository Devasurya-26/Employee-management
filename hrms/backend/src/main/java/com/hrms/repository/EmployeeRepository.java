package com.hrms.repository;

import com.hrms.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Page<Employee> findByDeletedFalse(Pageable pageable);

    Page<Employee> findByDeletedFalseAndFirstNameContainingIgnoreCaseOrDeletedFalseAndLastNameContainingIgnoreCase(
            String firstName, String lastName, Pageable pageable);

    Page<Employee> findByDeletedFalseAndDepartmentId(Long departmentId, Pageable pageable);

    Optional<Employee> findByUserUsername(String username);
}
