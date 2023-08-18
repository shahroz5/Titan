/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.service;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.CountryDetailsDto;

/**
 * Service interface for Engine.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("UserEngineService")
public interface EngineService {

	/**
	 * This method will be used to get fiscal year and currency code.
	 * 
	 * @param locationCode
	 * @return CountryDetailsDto
	 */
	CountryDetailsDto getCountryDetails(String locationCode);

}
