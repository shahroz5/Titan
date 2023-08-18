/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.ManualBillVerifyDto;
import com.titan.poss.sales.dto.constants.ManualBillValidationTypeEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Dto to create transaction.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class TransactionCreateDto extends BaseFieldsValidator {

	@Valid
	private ManualBillVerifyDto manualBillDetails;

	@NotNull(message = "Validation type must not be null")
	@ValueOfEnum(enumClass = ManualBillValidationTypeEnum.class)
	private String validationType;
	
	private List<String> cONumberList;
	
	private String fetchRequestType;
	
}
