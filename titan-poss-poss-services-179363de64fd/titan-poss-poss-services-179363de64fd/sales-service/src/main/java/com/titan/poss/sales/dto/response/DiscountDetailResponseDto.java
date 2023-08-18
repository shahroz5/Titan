/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import javax.persistence.Column;

import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.DiscountDetailDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class DiscountDetailResponseDto extends DiscountDetailDto {

	private String discountTxnId;

	private String itemId;

	private JsonData basicCriteriaDetails;

	private JsonData discountAttributes;

	private JsonData orderConfigDetails;

	private String status;

	private Object txnLevelDiscountValueDetails;
	
	private String applicableLevel;

}
