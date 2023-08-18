/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import java.util.List;

import javax.validation.Valid;

import com.titan.poss.config.dto.ExchangeConfigItemDto;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class GepConfigItemRequestDto {

	private List<@Valid ExchangeConfigItemDto> updateItems;
}
