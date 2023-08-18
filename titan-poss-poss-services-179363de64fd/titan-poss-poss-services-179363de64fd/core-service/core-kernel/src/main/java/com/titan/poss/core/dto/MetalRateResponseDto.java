/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.util.Date;
import java.util.Map;

import javax.validation.Valid;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class MetalRateResponseDto {

	private Map<String, @Valid BoutiqueMetalRateDto> metalRates;

	private Date applicableDate;
}
