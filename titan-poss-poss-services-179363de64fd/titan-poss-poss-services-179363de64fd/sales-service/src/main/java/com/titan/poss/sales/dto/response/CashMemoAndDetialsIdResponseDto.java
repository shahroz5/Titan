/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.response;

import java.util.List;

import javax.validation.Valid;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for cash memo and details id response.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CashMemoAndDetialsIdResponseDto extends CashMemoResponseDto {

	@Valid
	private List<String> itemIdList;

}
