/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.utils;

import java.lang.reflect.Type;

import org.apache.commons.io.IOUtils;
import org.springframework.cloud.openfeign.support.ResponseEntityDecoder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.exception.ServiceException;

import feign.Response;
import feign.codec.Decoder;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class ServiceResponseDecoder extends ResponseEntityDecoder {

	public ServiceResponseDecoder(Decoder decoder) {
		super(decoder);
	}

	@Override
	public Object decode(final Response response, Type type) {
		ObjectMapper mapper = new ObjectMapper();
		if (response.status() >= 200 && response.status() < 300) {
			try {
				if (type.getTypeName().equalsIgnoreCase("Integer"))
					return response.status();
				else
					return mapper.readValue(IOUtils.toString(response.body().asReader()),
							mapper.getTypeFactory().constructType(type));
			} catch (Exception e) {
				throw new ServiceException("Runtime Error in inter-service call", "ERR-CORE-026", e);
			}
		} else {
			throw new ServiceException("Runtime Error in inter-service call", "ERR-CORE-026", response);
		}
	}

}
