/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.ws.client.support.interceptor.ClientInterceptor;

import com.titan.poss.integration.service.impl.GhsClient;
import com.titan.poss.integration.util.SoapClientInterceptor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class GhsClientConfig {
	  // @Value("${service.uri}")
	
	@Bean
    public Jaxb2Marshaller marshaller() {
        Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
        marshaller.setContextPath("com.titan.poss.integration.eghs.generated");
        return marshaller;
    }
	
	 @Bean
	public GhsClient soapClient(Jaxb2Marshaller marshaller) {
		 GhsClient client = new GhsClient();
	       client.setMarshaller(marshaller);
	       client.setUnmarshaller(marshaller);
	       ClientInterceptor[] clientInterceptors = {new SoapClientInterceptor()};
	       client.setInterceptors(clientInterceptors);
	       return client;
	}
}
