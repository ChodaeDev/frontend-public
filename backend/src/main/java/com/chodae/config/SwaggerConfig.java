package com.chodae.config;

import java.util.ArrayList;
import java.util.List;

import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.tags.Tag;

@OpenAPIDefinition(tags = {
        @Tag(name = "사용자 정보", description = "사용자 정보 관련 API")
})

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenApiCustomizer counselingBoardTagFirst() {
        return openApi -> {
            List<io.swagger.v3.oas.models.tags.Tag> tags = openApi.getTags();
            if (tags == null || tags.isEmpty()) {
                return;
            }
            int idx = -1;
            for (int i = 0; i < tags.size(); i++) {
                if ("사용자 정보".equals(tags.get(i).getName())) {
                    idx = i;
                    break;
                }
            }
            if (idx <= 0) {
                return;
            }
            List<io.swagger.v3.oas.models.tags.Tag> reordered = new ArrayList<>(tags);
            io.swagger.v3.oas.models.tags.Tag counseling = reordered.remove(idx);
            reordered.add(0, counseling);
            openApi.setTags(reordered);
        };
    }

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
