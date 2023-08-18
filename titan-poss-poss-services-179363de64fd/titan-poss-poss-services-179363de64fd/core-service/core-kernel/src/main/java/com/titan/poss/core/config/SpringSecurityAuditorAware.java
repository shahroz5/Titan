/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.config;

import java.util.Optional;

import org.springframework.data.domain.AuditorAware;

import com.titan.poss.core.utils.CustomSecurityPrincipal;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class SpringSecurityAuditorAware implements AuditorAware<String> {

	@Override
	public Optional<String> getCurrentAuditor() {
		try {
			String username = CustomSecurityPrincipal.getSecurityPrincipal().getUsername();
			return Optional.of(username);
		} catch (Exception e) {
			return Optional.of("System");
		}
	}
}