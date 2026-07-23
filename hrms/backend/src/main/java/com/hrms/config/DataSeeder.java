package com.hrms.config;

import com.hrms.entity.Role;
import com.hrms.entity.User;
import com.hrms.repository.RoleRepository;
import com.hrms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Seeds default roles (ROLE_ADMIN, ROLE_EMPLOYEE) and a default admin account
 * on first startup so you can log in immediately.
 *
 * Default admin login: admin / Admin@123
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(null, Role.RoleName.ROLE_ADMIN)));
        Role employeeRole = roleRepository.findByName(Role.RoleName.ROLE_EMPLOYEE)
                .orElseGet(() -> roleRepository.save(new Role(null, Role.RoleName.ROLE_EMPLOYEE)));

        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@hrms.local");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setEnabled(true);
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
            System.out.println(">>> Default admin created: username=admin password=Admin@123");
        }
    }
}
