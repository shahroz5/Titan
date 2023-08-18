/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class MetalPriceMappingBaseDto {
	@NotNull(message = "Please provide the countryCode")
	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid marketCode")
	private String marketCode;

	private String marketDescription;

	private String locationDescription;

	private String locationCode;

	private String metalTypeCode;

	private Date applicableDate; // date created (ui input date)

	private BigDecimal metalRate;// computed price
}
