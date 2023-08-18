/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.dto.ClientLoginDto;
import com.titan.poss.core.filter.FeignClientInterceptor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@FeignClient(contextId = "authContextId", name = "auth-service", configuration = FeignClientInterceptor.class)
public interface AuthServiceClient {

	@PostMapping(value = "auth/v2/token")
	OAuthToken generateToken(@RequestBody(required = false) ClientLoginDto clientLoginDto);

}
