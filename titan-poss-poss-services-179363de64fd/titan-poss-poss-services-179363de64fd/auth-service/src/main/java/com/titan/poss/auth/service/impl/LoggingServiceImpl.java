/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.auth.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.auth.dto.request.ClientErrorDto;
import com.titan.poss.auth.dto.response.ClientResDto;
import com.titan.poss.auth.service.LoggingService;

import brave.Tracer;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("LoggingService")
public class LoggingServiceImpl implements LoggingService {


	private static final Logger CLIENT_LOGGER = LoggerFactory.getLogger("client-error-log");

	@Autowired
	private Tracer tracer;





	/**
	 * This method will save the client error log details.
	 * 
	 * @param clientErrorDto
	 * @return ClientResDto
	 */
	@Override
	public ClientResDto addClientLog(ClientErrorDto clientErrorDto) {

		String traceId = tracer.currentSpan().context().spanIdString();
		String details = clientErrorDto.toString();

		CLIENT_LOGGER.error("Client Error Details: \n{}", details);

		ClientResDto clientResDto = new ClientResDto();
		clientResDto.setTraceId(traceId);

		return clientResDto;
	}

}
