package com.hrms.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        // 256-bit test secret; production uses a real value from application.yml
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret",
                "c2VjdXJlLWhybXMtc2VjcmV0LWtleS1jaGFuZ2UtdGhpcy1pbi1wcm9kdWN0aW9uLTEyMzQ1Ng==");
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationMs", 3600000L);
        ReflectionTestUtils.setField(tokenProvider, "refreshExpirationMs", 604800000L);
    }

    @Test
    void generateRefreshToken_producesTokenThatValidatesAndResolvesUsername() {
        String token = tokenProvider.generateRefreshToken("admin");

        assertThat(tokenProvider.validateToken(token)).isTrue();
        assertThat(tokenProvider.getUsernameFromToken(token)).isEqualTo("admin");
    }

    @Test
    void validateToken_returnsFalse_forGarbageInput() {
        assertThat(tokenProvider.validateToken("not-a-real-jwt")).isFalse();
    }
}
