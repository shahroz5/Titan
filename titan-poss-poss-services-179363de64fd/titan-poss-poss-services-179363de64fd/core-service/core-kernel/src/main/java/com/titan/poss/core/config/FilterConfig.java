/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.config;

import javax.servlet.Filter;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.titan.poss.core.filter.CorsFilter;


/**
  * @author  Mindtree Ltd.
  * @version 1.0
  */
@Configuration
public class FilterConfig {

	
	@Bean
	public FilterRegistrationBean<Filter> registerCORSFilterBean() {
		FilterRegistrationBean<Filter> corsBean = new FilterRegistrationBean<>();
		corsBean.setFilter(registerCORSFilter());
		corsBean.setOrder(1);
		return corsBean;
	}





	@Bean
	public Filter registerCORSFilter() {
		return new CorsFilter();
	}


}
