/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.sales.dto.validators.BasePaymentFieldsDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for airpay other details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class AirpayOtherDetailsDto extends BasePaymentFieldsDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, message = "Please provide request id", nullCheck = true)
	private String paymentRequestId;

	private String paymentUrl;

	private Integer creditNoteNo;

}
