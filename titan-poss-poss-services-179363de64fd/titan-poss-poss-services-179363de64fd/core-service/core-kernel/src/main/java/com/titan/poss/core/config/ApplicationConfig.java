/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.config;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
@ComponentScan(basePackages = { "com.titan.poss.*" })
@PropertySource({ "classpath:error-messages.properties", "classpath:common.properties" })
@EnableFeignClients(basePackages = { "com.titan.poss.*" })
public class ApplicationConfig {

}
