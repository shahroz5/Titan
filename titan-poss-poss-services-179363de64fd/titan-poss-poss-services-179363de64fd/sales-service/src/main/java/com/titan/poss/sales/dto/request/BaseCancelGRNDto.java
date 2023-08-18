/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.HashSet;
import java.util.Set;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.sales.dto.constants.GRNCancellationTypeEnum;
import com.titan.poss.sales.validator.CancelDtoValidation;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@CancelDtoValidation
@EqualsAndHashCode(callSuper = false)
public class BaseCancelGRNDto extends BaseGrnItemDto {

	@NotNull
	@ValueOfEnum(enumClass = GRNCancellationTypeEnum.class)
	private String cancelType;

	private String reasonForCancellation;

	private Set<ItemQuantityDto> focItems = new HashSet<>();

}
