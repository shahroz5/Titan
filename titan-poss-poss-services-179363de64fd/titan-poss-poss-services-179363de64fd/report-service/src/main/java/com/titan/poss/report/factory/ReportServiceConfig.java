/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.factory;

import org.springframework.beans.factory.config.ServiceLocatorFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class ReportServiceConfig {

	@Bean
	public ServiceLocatorFactoryBean getBean() {
		ServiceLocatorFactoryBean bean = new ServiceLocatorFactoryBean();
		bean.setServiceLocatorInterface(ReportRegistry.class);
		return bean;
	}

}
