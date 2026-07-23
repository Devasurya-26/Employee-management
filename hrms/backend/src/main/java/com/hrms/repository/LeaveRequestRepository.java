package com.hrms.repository;

import com.hrms.entity.LeaveRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    Page<LeaveRequest> findByDeletedFalse(Pageable pageable);
    Page<LeaveRequest> findByEmployeeIdAndDeletedFalse(Long employeeId, Pageable pageable);
    Page<LeaveRequest> findByStatusAndDeletedFalse(LeaveRequest.LeaveStatus status, Pageable pageable);
}
