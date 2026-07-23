package com.hrms.service;

import com.hrms.entity.Employee;
import com.hrms.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelExportService {

    private final EmployeeRepository employeeRepository;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    private static final String[] HEADERS = {
        "Employee Code", "First Name", "Last Name", "Department", "Designation",
        "Phone", "Email", "Gender", "Date of Joining"
    };

    public byte[] exportEmployeesToExcel() throws IOException {
        List<Employee> employees = employeeRepository.findByDeletedFalse(Pageable.unpaged()).getContent();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Employees");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.INDIGO.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < HEADERS.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(HEADERS[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Employee e : employees) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(nullSafe(e.getEmployeeCode()));
                row.createCell(1).setCellValue(nullSafe(e.getFirstName()));
                row.createCell(2).setCellValue(nullSafe(e.getLastName()));
                row.createCell(3).setCellValue(e.getDepartment() != null ? e.getDepartment().getName() : "");
                row.createCell(4).setCellValue(e.getDesignation() != null ? e.getDesignation().getTitle() : "");
                row.createCell(5).setCellValue(nullSafe(e.getPhone()));
                row.createCell(6).setCellValue(e.getUser() != null ? e.getUser().getEmail() : "");
                row.createCell(7).setCellValue(nullSafe(e.getGender()));
                row.createCell(8).setCellValue(e.getDateOfJoining() != null ? e.getDateOfJoining().format(DATE_FMT) : "");
            }

            for (int i = 0; i < HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private String nullSafe(String value) {
        return value == null ? "" : value;
    }
}
