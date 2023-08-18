package com.titan.poss.auth;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.web.client.RestTemplate;

import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;

@EnableDiscoveryClient
@EnableEncryptableProperties
@SpringBootApplication
@ComponentScan({ "com.titan.poss" })
@EntityScan(basePackages = { "com.titan.poss" })
@RefreshScope
@EnableCaching
public class AuthApplication {

	public static void main(String[] args) {
		SpringApplication application = new SpringApplication(AuthApplication.class);
		ConfigurableEnvironment env = new StandardEnvironment();
		application.setEnvironment(env);
		ApplicationPropertiesUtil.initApplicationProperties(env);
		application.run(args);
	}

	@Bean
	public CommandLineRunner commandLineRunner() {
		return args -> CommonUtil.printAppInfo();
	}

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

//	@Bean
//	AuditorAware bean to be added?

}
