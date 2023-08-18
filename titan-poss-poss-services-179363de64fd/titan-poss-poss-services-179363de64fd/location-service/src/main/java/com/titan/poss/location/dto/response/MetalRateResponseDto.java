/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.dto.response;

import com.titan.poss.core.dto.MetalRateCreateRequestDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class MetalRateResponseDto extends MetalRateCreateRequestDto {
	private String id;
	private String password;
}
