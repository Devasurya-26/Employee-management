package com.hrms.repository;

import com.hrms.entity.Designation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DesignationRepository extends JpaRepository<Designation, Long> {
    Page<Designation> findByDeletedFalseAndTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<Designation> findByDeletedFalse(Pageable pageable);
}
