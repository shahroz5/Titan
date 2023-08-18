/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import com.titan.poss.file.dto.GiftVoucherStatusUpdateIngestionDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface GiftVoucherStatusUpdateValidationService {

	/**
	 * @param giftVoucherStatusUpdateDto
	 * @return
	 */
	boolean dataValidation(GiftVoucherStatusUpdateIngestionDto giftVoucherStatusUpdateIngestionDto);

}
