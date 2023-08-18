/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.ws.client.support.interceptor.ClientInterceptor;

import com.titan.poss.integration.service.impl.DialMileStoneClient;
import com.titan.poss.integration.util.SoapClientInterceptor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class DialMileStoneConfig {

	@Bean
	public Jaxb2Marshaller marshaller1() {
		Jaxb2Marshaller marshaller1 = new Jaxb2Marshaller();
		marshaller1.setContextPath("com.titan.poss.integration.dial.cctv.generated");
		return marshaller1;
	}

	@Bean
	public DialMileStoneClient soapClient1(Jaxb2Marshaller marshaller1) {
		DialMileStoneClient client = new DialMileStoneClient();
		client.setMarshaller(marshaller1);
		client.setUnmarshaller(marshaller1);
		ClientInterceptor[] clientInterceptors = { new SoapClientInterceptor() };
		client.setInterceptors(clientInterceptors);
		return client;
	}

}
