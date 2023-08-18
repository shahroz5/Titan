/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.gateway.config;

import org.springframework.context.annotation.Bean;

import com.netflix.client.config.IClientConfig;
import com.netflix.loadbalancer.AvailabilityFilteringRule;
import com.netflix.loadbalancer.IPing;
import com.netflix.loadbalancer.IRule;
import com.netflix.loadbalancer.PingUrl;

/**
  * @author  Mindtree Ltd.
  * @version 1.0
  */
public class RibbonConfiguration {

	@Bean
	public IPing ribbonPing(final IClientConfig config) {
		return new PingUrl(false, "/health");
	}





	@Bean
	public IRule ribbonRule(final IClientConfig config) {
		return new AvailabilityFilteringRule();
	}

}