/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class PurchaseInvoiceConfirmDto {

	@NotNull(message = "ReceivedDate cannot be null")
	@Past(message = "ReceivedDate cannot be future date")
	private Date receivedDate;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_255)
	private String remarks;
}
