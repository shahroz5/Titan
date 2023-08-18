/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.dto.request.json;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class BrandCashMemoDetails extends BaseFieldsValidator {

	@NotNull
	private BigDecimal residualAmountForeGHSTransfer;
	private String smsUserName;
	private String smsPassword;

}
