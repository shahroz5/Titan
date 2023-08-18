/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.engine.dto.response.LovTypeDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface LovService {

	ListResponse<LovTypeDto> getLocationLovTypes();

}
