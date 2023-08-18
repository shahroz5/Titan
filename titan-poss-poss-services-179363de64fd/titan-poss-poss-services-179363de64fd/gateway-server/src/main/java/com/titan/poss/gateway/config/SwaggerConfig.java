/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.gateway.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger.web.DocExpansion;
import springfox.documentation.swagger.web.ModelRendering;
import springfox.documentation.swagger.web.OperationsSorter;
import springfox.documentation.swagger.web.SwaggerResource;
import springfox.documentation.swagger.web.SwaggerResourcesProvider;
import springfox.documentation.swagger.web.TagsSorter;
import springfox.documentation.swagger.web.UiConfiguration;
import springfox.documentation.swagger.web.UiConfigurationBuilder;
import springfox.documentation.swagger2.annotations.EnableSwagger2WebFlux;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
@Primary
@EnableAutoConfiguration
@Configuration
@EnableSwagger2WebFlux
public class SwaggerConfig implements SwaggerResourcesProvider {

	@Value("${spring.application.name}")
	private String applicationName;

	@Value("${spring.profiles.active}")
	private String profile;

	@Value("${poss.version}")
	private String version;

	@Override
	public List<SwaggerResource> get() {

		profile = profile.toLowerCase();

		Set<String> services = new TreeSet<>();

		// if profile contain eposs string, it will be eposs, if no, then if poss
		// mentioned, else load all
		if (profile.contains("eposs")) {
			services = getEPOSSResource();
		} else if (profile.contains("poss")) {
			services = getPOSSResource();
		} else {
			services.addAll(getEPOSSResource());
			services.addAll(getPOSSResource());
		}

		return getSwaggerResourcesByServiceNames(services);
	}

	private List<SwaggerResource> getSwaggerResourcesByServiceNames(Set<String> serviceNames) {
		List<SwaggerResource> resources = new ArrayList<>();
		if (!CollectionUtils.isEmpty(serviceNames)) {
			// @formatter:off
			resources = serviceNames.stream()
					.map(serviceName -> swaggerResource(serviceName + "-service", "/api/" + serviceName + "/" + version + "/api-docs", "2.0"))
					.collect(Collectors.toList());
			// @formatter:on
		}
		return resources;
	}

	private Set<String> getEPOSSResource() {
		Set<String> serviceNames = new TreeSet<>();
		serviceNames.add("config");
		serviceNames.add("file");
		serviceNames.add("inventory");
		serviceNames.add("location");
		serviceNames.add("payment");
		serviceNames.add("product");
		serviceNames.add("report");
		serviceNames.add("user");
		serviceNames.add("workflow");
		serviceNames.addAll(getCommonResource());
		return serviceNames;
	}

	private Set<String> getPOSSResource() {
		Set<String> serviceNames = new TreeSet<>();
		serviceNames.addAll(getCommonResource());
		return serviceNames;

	}

	private List<String> getCommonResource() {
		List<String> commonServices = new ArrayList<>();
		commonServices.add("auth");
		commonServices.add("datasync");
		commonServices.add("engine");
		commonServices.add("integration");
		commonServices.add("sales");
		commonServices.add("store");
		return commonServices;
	}

	private SwaggerResource swaggerResource(String name, String location, String version) {
		SwaggerResource swaggerResource = new SwaggerResource();
		swaggerResource.setName(name);
		swaggerResource.setLocation(location);
		swaggerResource.setSwaggerVersion(version);
		return swaggerResource;
	}

	@Bean
	public Docket api() {
		return new Docket(DocumentationType.SWAGGER_2).select().apis(RequestHandlerSelectors.any())
				.paths(PathSelectors.any()).build().apiInfo(apiInfo());
	}

	private ApiInfo apiInfo() {
		return new ApiInfoBuilder().title(applicationName.toUpperCase())
				.description(applicationName.toLowerCase() + " service")
				.termsOfServiceUrl("http://www.mindtree.com/terms-use").license("Mindtree License Version 2.0")
				.licenseUrl("http://www.mindtree.com/").version("1.0").build();
	}

	@Bean
	UiConfiguration uiConfig() {
		return UiConfigurationBuilder.builder().deepLinking(true).displayOperationId(false).defaultModelsExpandDepth(1)
				.defaultModelExpandDepth(1).defaultModelRendering(ModelRendering.EXAMPLE).displayRequestDuration(true)
				.docExpansion(DocExpansion.NONE).filter(false).maxDisplayedTags(null)
				.operationsSorter(OperationsSorter.ALPHA).showExtensions(false).tagsSorter(TagsSorter.ALPHA)
				.supportedSubmitMethods(UiConfiguration.Constants.DEFAULT_SUBMIT_METHODS).validatorUrl(null).build();
	}

}