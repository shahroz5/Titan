/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.service;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.SchedulerResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public interface LocationJobService {

	SchedulerResponseDto publishToDataSync();

	SchedulerResponseDto triggerUpdateMaterialRate();

	SchedulerResponseDto updateFiscalYear();

}
