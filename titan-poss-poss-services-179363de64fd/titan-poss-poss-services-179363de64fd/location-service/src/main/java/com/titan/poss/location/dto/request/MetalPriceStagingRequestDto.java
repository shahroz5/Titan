/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto.request;

import java.util.Date;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class MetalPriceStagingRequestDto {

	@NotEmpty
	private List<@Valid MarketRate> marketRates;

	@NotNull(message = "approvalId can not be null")
	private String approvalId;

	@NotNull(message = "applicableDate can not be null")
	private Date applicableDate;

	@NotNull(message = "metalTypeCode can not be null")
	private String metalTypeCode;

}
