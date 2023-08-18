/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto;

import javax.validation.Valid;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for cash memo update request.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CashMemoUpdateDto extends BaseCashMemoDto {

	@Valid
	private MetalRateListDto metalRateList; // expect metal rates where offset is one
}
