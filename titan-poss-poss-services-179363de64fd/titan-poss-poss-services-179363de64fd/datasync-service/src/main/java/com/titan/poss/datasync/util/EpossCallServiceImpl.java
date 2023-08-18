/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.util;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.datasync.service.IntegrationService;
import com.titan.poss.sales.constants.SalesConstants;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("ApplicationVersionEpossCallUtil")
public class EpossCallServiceImpl {

	@Autowired
	private IntegrationService integrationService;
	
	@Autowired
	ObjectMapper mapper;
	
	List<Map<String,String>> dtos;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(EpossCallServiceImpl.class);

	public <T> T callEposs(HttpMethod httpMethod, String relativeUrl, Map<String, String> requestParamters,
			Object requestBody, Class<T> className) {

		ApiResponseDto epossResponseDto = integrationService.callEpossAPI(httpMethod, relativeUrl, requestParamters,
				requestBody);
		LOGGER.info("Response : "+epossResponseDto);
		System.out.println(epossResponseDto.getResponse());
		System.out.println(epossResponseDto.getHttpResponseCode());
		// if 200, then return response
		if (epossResponseDto.getHttpResponseCode() == HttpStatus.OK.value()) {
			
			try {
				dtos=mapper.readValue(""+epossResponseDto.getResponse(), List.class);
			} catch (IOException e) {
				e.printStackTrace();
			}

			return (T) dtos;
		} else {
			// re-throw the error

			String errCode = JsonUtils.getValueFromJsonString(epossResponseDto.getResponse(), CommonConstants.CODE);
			String errMssg = JsonUtils.getValueFromJsonString(epossResponseDto.getResponse(), CommonConstants.MESSAGE);

			// if code & message is there in response then show service exception
			if (StringUtils.isNotBlank(errCode) && StringUtils.isNotBlank(errMssg)) {
				Object errCause = null;
				Map<String, String> dynamicValue = null;
				if (epossResponseDto.getResponse() != null) {
					errCause = JsonUtils.getValueFromJson(epossResponseDto.getResponse(), CommonConstants.ERROR_CAUSE,
							Object.class);
					dynamicValue = JsonUtils.getValueFromJson(epossResponseDto.getResponse(),
							CommonConstants.DYNAMIC_VALUES, Map.class);
				}
				throw new ServiceException(errMssg, errCode, errCause,dynamicValue);

			} else {
				// if code & message not there, then throw generic error message

				throw new ServiceException(SalesConstants.CALL_TO_EPOSS_FAILED, SalesConstants.ERR_INT_025,
						epossResponseDto.getResponse());
			}
		}
	}

	/*
	 * public CashMemoEntities callLegacyTepCashMemo(String locationCode,Integer
	 * docNo,Short fiscalYear,Boolean isInterBrand) { return
	 * integrationService.callLegacyTepCashMemo(locationCode, docNo,
	 * fiscalYear,isInterBrand); }
	 */
}
