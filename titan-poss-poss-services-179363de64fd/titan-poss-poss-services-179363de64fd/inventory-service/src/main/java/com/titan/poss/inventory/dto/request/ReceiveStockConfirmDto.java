/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.request;

import java.util.Date;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.inventory.validator.StnConfirmDtoConstraint;

import lombok.Data;

/**
 * DTO class for Conforming Stn
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
//@StnConfirmDtoConstraint
public class ReceiveStockConfirmDto {

	// @NotNull(message = "courierReceivedDate cannot be null")
	// @Past(message = "courierReceivedDate cannot be future date")
	private Date courierReceivedDate;

	@PatternCheck(regexp = RegExConstants.REMARKS_REGEX)
	private String remarks;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255)
	private String reasonForDelay;

}
