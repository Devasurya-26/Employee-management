package com.hrms.controller;

import com.hrms.dto.ApiResponse;
import com.hrms.entity.Department;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.DepartmentRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<Page<Department>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        Page<Department> result = (search == null || search.isBlank())
                ? departmentRepository.findByDeletedFalse(pageable)
                : departmentRepository.findByDeletedFalseAndNameContainingIgnoreCase(search, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getById(@PathVariable Long id) {
        return ResponseEntity.ok(findOrThrow(id));
    }

    @PostMapping
    public ResponseEntity<Department> create(@Valid @RequestBody Department department) {
        return ResponseEntity.ok(departmentRepository.save(department));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> update(@PathVariable Long id, @Valid @RequestBody Department payload) {
        Department existing = findOrThrow(id);
        existing.setName(payload.getName());
        existing.setDescription(payload.getDescription());
        return ResponseEntity.ok(departmentRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        Department existing = findOrThrow(id);
        existing.setDeleted(true); // soft delete
        departmentRepository.save(existing);
        return ResponseEntity.ok(new ApiResponse(true, "Department deleted"));
    }

    private Department findOrThrow(Long id) {
        return departmentRepository.findById(id)
                .filter(d -> !d.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }
}
