/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss;

import java.util.Date;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.StandardEnvironment;

import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.core.utils.CalendarUtils;

/**
 * @author  Mindtree Ltd.
 * @version 1.0 
 */
@SpringBootApplication
@ComponentScan({ "com.titan.poss" })
@EntityScan(basePackages = { "com.titan.poss" })
@RefreshScope
public class MonolithicApplication {

	public static void main(String[] args) {
		
		//timestamp i.e application start time is used for log file name in application.properties
		System.setProperty("timestamp", CalendarUtils.formatDateToString(new Date(), "dd-MM-yyyy-HH-mm-ss"));
		
		SpringApplication application = new SpringApplication(MonolithicApplication.class);
		ConfigurableEnvironment env = new StandardEnvironment();
		application.setEnvironment(env);
		ApplicationPropertiesUtil.initApplicationProperties(env);
		application.run(args);
	}

}
