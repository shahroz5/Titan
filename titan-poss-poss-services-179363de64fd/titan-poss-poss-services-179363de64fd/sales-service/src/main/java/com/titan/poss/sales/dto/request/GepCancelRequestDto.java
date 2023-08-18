/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.request;

import java.util.Date;

import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class GepCancelRequestDto {

	@Positive(message = "ref doc no should be more than 0")
	private Integer refDocNo;

	@PatternCheck(regexp = RegExConstants.IND_MOBILE_REGEX)
	private String customerMobileNo;

	private Date docDate;

	@Positive(message = "fiscal Year should be more than 0")
	private Short fiscalYear;
}
