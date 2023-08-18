/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.request;

import com.titan.poss.core.response.JsonData;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GepConfirmOrHoldDto extends BaseGoodsConfirmDto {

	private JsonData exchangeDetails;
	
	private JsonData approvalDetails;
	
	private JsonData tepExceptionDetails;
}
