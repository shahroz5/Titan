/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CreateCustomerConfigDto {

	@NotNull
	@ValueOfEnum(enumClass = CustomerTypeEnum.class)
	private String customerType;

	@NotNull
	private String transactionType;

}
