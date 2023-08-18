/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Map;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO to generate password for manual bill.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ManualBillCreateDto extends ManualBillDto {

	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = true)
	private String locationCode;

	@NotNull(message = "Please provide transaction type")
	@ValueOfEnum(enumClass = TransactionTypeEnum.class) // doubt: should do inter-service call?
	private String txnType;

	@NotEmpty(message = "Please provide Metal Details")
	private Map<String, @Valid MetalRateWithWeightDto> metalRates;

	private Boolean isOld;// if password is already generated for the details, then field will be 'true'

}
