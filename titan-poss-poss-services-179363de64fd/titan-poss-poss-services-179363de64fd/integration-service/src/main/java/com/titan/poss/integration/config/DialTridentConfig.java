/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.ws.client.support.interceptor.ClientInterceptor;

import com.titan.poss.integration.service.impl.DialTridentClient;
import com.titan.poss.integration.util.SoapClientInterceptor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class DialTridentConfig {
	@Bean
	public Jaxb2Marshaller marshallerDialSave() {
		Jaxb2Marshaller marshaller1 = new Jaxb2Marshaller();
		marshaller1.setContextPath("com.titan.poss.integration.dial.save.response.generated");
		return marshaller1;
	}

	@Bean
	public DialTridentClient soapClientDialSave(Jaxb2Marshaller marshallerDialSave) {
		DialTridentClient client = new DialTridentClient();
		client.setMarshaller(marshallerDialSave);
		client.setUnmarshaller(marshallerDialSave);
		ClientInterceptor[] clientInterceptors = { new SoapClientInterceptor() };
		client.setInterceptors(clientInterceptors);
		return client;
	}
}
