/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto.response;

import java.util.Map;

import com.titan.poss.core.dto.ManualBillCreateDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for manual bill password details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManualBillPasswordDetailsDto {

	private ManualBillCreateDto manualBillDetails;
	private Map<String, StandardPriceResponseDto> metalDetails;

}
