/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.request;

import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;

import com.titan.poss.core.domain.constant.RegExConstants;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class LocationPriceGroupDto {
	
	private Set<@Valid PriceGroupMapCreateDto> addPriceGroup;

	private Set<@Pattern(regexp = RegExConstants.UUID_REGEX) String> removePriceGroup;

}
