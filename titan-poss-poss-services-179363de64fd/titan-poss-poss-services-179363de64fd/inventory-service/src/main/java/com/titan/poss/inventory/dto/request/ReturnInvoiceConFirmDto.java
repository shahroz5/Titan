/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class ReturnInvoiceConFirmDto {

	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = true)
	private String cfaLocationCode;

//	@NotNull(message = "Carrier Details can't be blank")
	private JsonData carrierDetails;

	@PatternCheck(regexp = RegExConstants.REMARKS_REGEX)
	private String remarks;
}
