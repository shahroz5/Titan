/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.GiftVoucherStatusUpdateIngestionDto;
import com.titan.poss.file.service.GiftVoucherStatusUpdateValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class GiftVoucherStatusUpdateValidationServiceImpl implements GiftVoucherStatusUpdateValidationService {

	@Override
	public boolean dataValidation(GiftVoucherStatusUpdateIngestionDto item) {
		return true;
	}
}