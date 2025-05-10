package com.bidverse.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // If you want to serve from "uploads/" in the current working dir:
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./uploads/");  // note the "./"
    }
}

