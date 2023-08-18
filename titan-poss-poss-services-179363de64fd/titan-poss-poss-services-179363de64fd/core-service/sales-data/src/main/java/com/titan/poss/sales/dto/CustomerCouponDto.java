/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerCouponDto {

	private String customerMasterId;

	private String couponType;

	private String couponCode;

	private Date docDate;

	private String refId;

	private String status;

	private Date expiryDate;

	private Integer attempts;
	
	private Integer totalCount;

}
