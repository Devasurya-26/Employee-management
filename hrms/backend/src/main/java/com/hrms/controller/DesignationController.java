package com.hrms.controller;

import com.hrms.dto.ApiResponse;
import com.hrms.entity.Designation;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.DesignationRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/designations")
@RequiredArgsConstructor
public class DesignationController {

    private final DesignationRepository designationRepository;

    @GetMapping
    public ResponseEntity<Page<Designation>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        Page<Designation> result = (search == null || search.isBlank())
                ? designationRepository.findByDeletedFalse(pageable)
                : designationRepository.findByDeletedFalseAndTitleContainingIgnoreCase(search, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Designation> getById(@PathVariable Long id) {
        return ResponseEntity.ok(findOrThrow(id));
    }

    @PostMapping
    public ResponseEntity<Designation> create(@Valid @RequestBody Designation designation) {
        return ResponseEntity.ok(designationRepository.save(designation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Designation> update(@PathVariable Long id, @Valid @RequestBody Designation payload) {
        Designation existing = findOrThrow(id);
        existing.setTitle(payload.getTitle());
        return ResponseEntity.ok(designationRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        Designation existing = findOrThrow(id);
        existing.setDeleted(true);
        designationRepository.save(existing);
        return ResponseEntity.ok(new ApiResponse(true, "Designation deleted"));
    }

    private Designation findOrThrow(Long id) {
        return designationRepository.findById(id)
                .filter(d -> !d.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Designation not found with id: " + id));
    }
}
