package com.hrms.repository;

import com.hrms.entity.Salary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SalaryRepository extends JpaRepository<Salary, Long> {
    Page<Salary> findByDeletedFalseOrderByYearDescMonthDesc(Pageable pageable);
    Page<Salary> findByEmployeeIdAndDeletedFalseOrderByYearDescMonthDesc(Long employeeId, Pageable pageable);
    Optional<Salary> findByEmployeeIdAndMonthAndYear(Long employeeId, Integer month, Integer year);
}
