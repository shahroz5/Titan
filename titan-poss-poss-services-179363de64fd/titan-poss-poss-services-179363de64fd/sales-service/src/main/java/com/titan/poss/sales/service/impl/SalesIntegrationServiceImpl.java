/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.sales.service.IntegrationService;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Service
public class SalesIntegrationServiceImpl {

	@Autowired
	private IntegrationService integrationService;

	public ApiResponseDto callIntegration(HttpMethod httpMethod, String relativeUrl,
			Map<String, String> requestParamters, Object requestBody) {

		ApiResponseDto epossResponseDto = integrationService.callEpossAPI(httpMethod, relativeUrl, requestParamters,
				requestBody);

		// if 200, then return response
		if (epossResponseDto.getHttpResponseCode() == HttpStatus.OK.value()) {
			return epossResponseDto;

		} else if (epossResponseDto.getHttpResponseCode() == HttpStatus.BAD_REQUEST.value()) {
			// if 400, then throw error
			throw new ServiceException(
					JsonUtils.getValueFromJsonString(epossResponseDto.getResponse(), CommonConstants.MESSAGE),
					JsonUtils.getValueFromJsonString(epossResponseDto.getResponse(), CommonConstants.CODE),
					epossResponseDto.getResponse());
		}
		// if not 400, then throw generic error message
		throw new ServiceException("CALL_TO_EPOSS_FAILED", "ERR-INT-025", epossResponseDto.getResponse());
	}

}
