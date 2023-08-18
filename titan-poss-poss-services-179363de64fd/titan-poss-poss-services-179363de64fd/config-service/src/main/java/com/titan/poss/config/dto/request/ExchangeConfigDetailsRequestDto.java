/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import java.util.Set;

import javax.validation.Valid;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class ExchangeConfigDetailsRequestDto {
	private Set<@Valid AddExchangeConfigDetailsDto> addConfigDetails;
	private Set<String> removeConfigDetails;
	private Set<@Valid UpdateExchangeConfigDetailsRequestDto> updateConfigDetails;

}
