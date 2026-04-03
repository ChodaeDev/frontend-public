package com.chodae.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class SwaggerConfig {
 
    @Bean
    public OpenAPI openAPI() {
        Server devServer = new Server();
        devServer.setUrl("/");
        devServer.setDescription("로컬 개발 서버");

        Info info = new Info()
                .title("Chodae API")
                .version("1.0.0")
                .description("Chodae Recovery API 문서");

        // Swagger UI에서 JWT를 입력하면, Try it out 호출 시
        // `Authorization: Bearer <token>` 헤더가 자동으로 붙도록 설정합니다.
        SecurityScheme bearerAuth = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT");

        Components components = new Components()
                .addSecuritySchemes("bearerAuth", bearerAuth);

        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList("bearerAuth");

        OpenAPI openAPI = new OpenAPI();
        openAPI.setInfo(info);
        openAPI.setServers(List.of(devServer));
        openAPI.setComponents(components);
        openAPI.setSecurity(List.of(securityRequirement));
        return openAPI;
    }
}