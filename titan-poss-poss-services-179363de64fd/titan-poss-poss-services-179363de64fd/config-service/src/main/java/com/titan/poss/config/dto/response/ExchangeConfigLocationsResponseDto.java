/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.response;

import com.titan.poss.config.dto.ExtendsConfigLocationsDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class ExchangeConfigLocationsResponseDto extends ExtendsConfigLocationsDto {
	private String configId;
}
