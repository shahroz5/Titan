/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service;

import java.util.Map;

import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.ApiResponseDto;

import feign.Response;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("engineIntegrationService")
public interface IntegrationService {

	/**
	 * @param httpMethod
	 * @param relativeUrl
	 * @param requestParams
	 * @param reqBody
	 * @return EpossApiResponseDto
	 */
	Response getMetalPriceLocationList(HttpMethod httpMethod, String relativeUrl, Map<String, String> requestParams,
			Object reqBody);

	/**
	 * @param httpMethod
	 * @param relativeUrl
	 * @param requestParamters
	 * @param requestBody
	 * @return
	 */
	ApiResponseDto callEpossAPI(HttpMethod httpMethod, String relativeUrl, Map<String, String> requestParamters,
			Object requestBody);
}
