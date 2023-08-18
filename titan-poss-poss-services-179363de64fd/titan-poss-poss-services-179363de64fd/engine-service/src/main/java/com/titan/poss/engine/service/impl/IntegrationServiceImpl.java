/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.EpossApiReqDto;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.engine.service.IntegrationService;

import feign.Response;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("engineIntegrationServiceImpl")
public class IntegrationServiceImpl implements IntegrationService {
	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Override
	public Response getMetalPriceLocationList(HttpMethod httpMethod, String relativeUrl,
			Map<String, String> requestParams, Object reqBody) {

		EpossApiReqDto epossApiReqDto = new EpossApiReqDto();
		epossApiReqDto.setHttpMethod(httpMethod);
		epossApiReqDto.setRelativeUrl(relativeUrl);
		epossApiReqDto.setRequestParams(requestParams);
		epossApiReqDto.setReqBody(reqBody);

		return integrationServiceClient.getMetalPriceLocationList(epossApiReqDto);

	}

	@Override
	public ApiResponseDto callEpossAPI(HttpMethod httpMethod, String relativeUrl, Map<String, String> requestParams,
			Object reqBody) {

		EpossApiReqDto epossApiReqDto = new EpossApiReqDto();
		epossApiReqDto.setHttpMethod(httpMethod);
		epossApiReqDto.setRelativeUrl(relativeUrl);
		epossApiReqDto.setRequestParams(requestParams);
		epossApiReqDto.setReqBody(reqBody);
		JsonUtils.prettyPrintJson(reqBody);
		return integrationServiceClient.callEpossAPI(epossApiReqDto);
	}

}
