/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import com.titan.poss.integration.dto.AirpayConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface AirpayConfigValidationService {

	boolean dataValidation(AirpayConfigDto airpayConfigDto);
}
