/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.auth.service;

import org.springframework.stereotype.Service;

import com.titan.poss.auth.dto.request.ClientErrorDto;
import com.titan.poss.auth.dto.response.ClientResDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface LoggingService {


	/**
	 * This method will save the client error log details.
	 * 
	 * @param clientErrorDto
	 * @return ClientResDto
	 */
	ClientResDto addClientLog(ClientErrorDto clientErrorDto);

}
