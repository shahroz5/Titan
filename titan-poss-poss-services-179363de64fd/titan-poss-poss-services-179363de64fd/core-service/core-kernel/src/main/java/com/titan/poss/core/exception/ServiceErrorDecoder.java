/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.exception;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.utils.MapperUtil;

import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
@Slf4j
public class ServiceErrorDecoder implements ErrorDecoder {

	@Override
	public Exception decode(String methodKey, Response response) {

		try {
			String responseStr = IOUtils.toString(response.body().asInputStream(),
					String.valueOf(StandardCharsets.UTF_8));
			JsonNode jsonResponse = new ObjectMapper().readTree(responseStr);
			log.debug("inter-service jsonResponse: << {} >>", jsonResponse);
			if (jsonResponse.get(CommonConstants.CODE) != null && jsonResponse.get(CommonConstants.MESSAGE) != null
					&& jsonResponse.has(CommonConstants.CODE) && jsonResponse.has(CommonConstants.MESSAGE)) {
				Object errorCause = null;
				if (jsonResponse.has(CommonConstants.ERROR_CAUSE)) {
					JsonNode errCauseJson = jsonResponse.get(CommonConstants.ERROR_CAUSE);
					errorCause = (errCauseJson != null) ? errCauseJson : null;
				}
				if (jsonResponse.has(CommonConstants.FIELD_ERROR)) {
					JsonNode fieldErrCause = jsonResponse.get(CommonConstants.FIELD_ERROR);
					errorCause = (fieldErrCause != null) ? Map.of(CommonConstants.FIELD_ERROR, fieldErrCause) : null;
				}
				Map<String, String> dynamicValues = setDynamicValueIfExist(jsonResponse);

				return new ServiceException(jsonResponse.get(CommonConstants.MESSAGE).asText(),
						jsonResponse.get(CommonConstants.CODE).asText(), errorCause, dynamicValues);
			} else {
				return new ServiceException("Some part of Error response is missing.", "ERR-CORE-026", responseStr);
			}
		} catch (Exception e) {
			return new ServiceException("Parsing error response failed.", "ERR-CORE-026", e);
		}
	}

	@SuppressWarnings("unchecked")
	private Map<String, String> setDynamicValueIfExist(JsonNode jsonResponse) {
		// for dynamic value
		Map<String, String> dynamicValues = null;
		if (jsonResponse.has(CommonConstants.DYNAMIC_VALUES)) {
			JsonNode dynamicValuesJson = jsonResponse.get(CommonConstants.DYNAMIC_VALUES);
			dynamicValues = MapperUtil.mapObjToClass(dynamicValuesJson, Map.class);
		}
		return dynamicValues;
	}
}
