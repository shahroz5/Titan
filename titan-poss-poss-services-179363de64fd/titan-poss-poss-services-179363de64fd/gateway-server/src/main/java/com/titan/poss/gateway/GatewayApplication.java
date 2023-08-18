/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.gateway;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.context.config.annotation.RefreshScope;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@SpringBootApplication
@EnableDiscoveryClient
@RefreshScope
public class GatewayApplication {

	public static void main(String[] args) {
		// timestamp i.e application start time is used for log file name in
		// application.properties
		System.setProperty("timestamp", GatewayApplication.formatDateToString(new Date(), "dd-MM-yyyy-HH-mm-ss"));
		SpringApplication.run(GatewayApplication.class, args);
	}

	public static String formatDateToString(Date date, String format) {
		return new SimpleDateFormat(format).format(date);
	}
}
