/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment;

import com.titan.poss.core.config.SpringSecurityAuditorAware;
import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.payment.constants.PaymentConstants;
import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.Date;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableEncryptableProperties
@ComponentScan({ "com.titan.poss" })
@EnableJpaAuditing
@EnableCaching
//@EnableCircuitBreaker
@RefreshScope
public class PaymentServiceApplication {

	public static void main(String[] args) {
		System.setProperty(PaymentConstants.TIMESTAMP,
				CalendarUtils.formatDateToString(new Date(), PaymentConstants.DATE_FORMAT));
		SpringApplication application = new SpringApplication(PaymentServiceApplication.class);
		ConfigurableEnvironment env = new StandardEnvironment();
		application.setEnvironment(env);
		ApplicationPropertiesUtil.initApplicationProperties(env);
		application.run(args);
	}

	@Bean
	AuditorAware<String> auditorProvider() {
		return new SpringSecurityAuditorAware();
	}
}
