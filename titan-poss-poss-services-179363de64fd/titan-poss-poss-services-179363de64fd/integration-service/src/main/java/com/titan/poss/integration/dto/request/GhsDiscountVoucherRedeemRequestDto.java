/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto.request;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class GhsDiscountVoucherRedeemRequestDto {
	
	private String discountVoucherNo;
	
	private Integer accountNo;
	
	private String transactionId;

}
