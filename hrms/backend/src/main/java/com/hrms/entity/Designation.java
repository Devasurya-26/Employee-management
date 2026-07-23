package com.hrms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "designations")
@Getter
@Setter
public class Designation extends BaseEntity {

    @NotBlank
    @Column(nullable = false, unique = true, length = 100)
    private String title;

    @OneToMany(mappedBy = "designation")
    @JsonIgnore
    private List<Employee> employees;
}
