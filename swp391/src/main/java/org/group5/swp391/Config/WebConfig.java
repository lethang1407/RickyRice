package org.group5.swp391.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Cấu hình CORS cho tất cả các controller
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Áp dụng cho tất cả các endpoint
                .allowedOrigins("http://localhost:3000")  // Cho phép yêu cầu từ React app trên localhost:3000
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")  // Các phương thức HTTP cho phép
                .allowedHeaders("*")  // Cho phép tất cả các tiêu đề
                .allowCredentials(true);  // Cho phép cookie và thông tin xác thực khác
    }
}


