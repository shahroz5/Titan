/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.user.service.EngineService;

/**
 * Service class for engine.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("userEngineSrevice")
public class EngineServiceImpl implements EngineService {

	@Autowired
	private EngineServiceClient engineServiceClient;

	public static final String ERR_CORE_036 = "ERR-CORE-036";
	public static final String INCORRECT_DATA_DEFINED_IN_DATABASE = "Incorrect data defined in database";

	@Override
	public CountryDetailsDto getCountryDetails(String locationCode) {

		CountryDetailsDto countryDetails = engineServiceClient.getCountryDetails(null);
		JsonUtils.validateDto(countryDetails, ERR_CORE_036, INCORRECT_DATA_DEFINED_IN_DATABASE);
		return countryDetails;

	}

}
