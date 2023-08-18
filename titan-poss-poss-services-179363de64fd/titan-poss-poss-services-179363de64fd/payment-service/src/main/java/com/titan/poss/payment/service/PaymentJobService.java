/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.SchedulerResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface PaymentJobService {

	SchedulerResponseDto publishToDataSync();

}
