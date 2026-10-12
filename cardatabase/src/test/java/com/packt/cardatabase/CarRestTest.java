package com.packt.cardatabase;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.packt.cardatabase.domain.User;
import com.packt.cardatabase.domain.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class CarRestTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository urepository;

    // The app's seeded users have private passwords, so create a known one for the test
    @BeforeEach
    void createTestUser() {
        if (urepository.findByUsername("admin").isEmpty()) {
            urepository.save(
                new User("admin", new BCryptPasswordEncoder().encode("admin"), "ADMIN")
            );
        }
    }

    @Test
    public void testAuthentication() throws Exception {
        // Testing authentication with correct credentials
        this.mockMvc
            .perform(
                post("/login")
                    .content("{\"username\":\"admin\",\"password\":\"admin\"}")
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
            )
            .andDo(print())
            .andExpect(status().isOk());
    }
}
