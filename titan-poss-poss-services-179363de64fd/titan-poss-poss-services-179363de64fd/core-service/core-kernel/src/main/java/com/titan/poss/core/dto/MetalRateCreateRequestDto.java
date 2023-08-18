/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.util.Date;
import java.util.Map;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class MetalRateCreateRequestDto {

	@NotEmpty(message = "Please provide Metal Details")
	private Map<String, @Valid BoutiqueMetalRateDto> metalRates;

	@NotNull(message = "Please provide applicable date")
	@PastOrPresent(message = "applicable date should be past or present date")
	private Date applicableDate;

}
