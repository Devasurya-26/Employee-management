package com.hrms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EmployeeDto {
    private Long id;

    @NotBlank
    private String firstName;

    private String lastName;
    private String employeeCode;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private LocalDate dateOfJoining;
    private String gender;
    private String profileImageUrl;

    private Long departmentId;
    private String departmentName;

    private Long designationId;
    private String designationTitle;

    private String username;
    private String email;
}
