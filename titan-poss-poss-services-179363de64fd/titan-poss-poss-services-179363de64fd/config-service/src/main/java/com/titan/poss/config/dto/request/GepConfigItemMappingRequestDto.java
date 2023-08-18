/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import java.util.Set;

import javax.validation.Valid;

import com.titan.poss.config.dto.ExchangeConfigItemDto;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class GepConfigItemMappingRequestDto {

	private Set<@Valid ExchangeConfigItemDto> updateItems;
}
