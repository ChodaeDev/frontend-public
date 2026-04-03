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
        @Tag(name = "사용자 정보", description = "사용자 정보 관련 API"),
        @Tag(name = "상담게시판", description = "상담게시판 페이지 관련 API")
})

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenApiCustomizer userInfoThenCounselingBoardTagOrder() {
        return openApi -> {
            List<io.swagger.v3.oas.models.tags.Tag> tags = openApi.getTags();
            if (tags == null || tags.isEmpty()) {
                return;
            }
            io.swagger.v3.oas.models.tags.Tag userInfo = null;
            io.swagger.v3.oas.models.tags.Tag counseling = null;
            List<io.swagger.v3.oas.models.tags.Tag> rest = new ArrayList<>();
            for (io.swagger.v3.oas.models.tags.Tag t : tags) {
                String name = t.getName();
                if ("사용자 정보".equals(name)) {
                    userInfo = t;
                } else if ("상담게시판".equals(name)) {
                    counseling = t;
                } else {
                    rest.add(t);
                }
            }
            List<io.swagger.v3.oas.models.tags.Tag> reordered = new ArrayList<>();
            if (userInfo != null) {
                reordered.add(userInfo);
            }
            if (counseling != null) {
                reordered.add(counseling);
            }
            reordered.addAll(rest);
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
