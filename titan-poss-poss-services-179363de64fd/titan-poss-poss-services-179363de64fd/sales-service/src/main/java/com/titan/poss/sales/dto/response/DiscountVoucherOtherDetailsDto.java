/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Other details DTo for discount voucher.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscountVoucherOtherDetailsDto {

	private Date issueDate;
	private Integer noOfInstallmentsPaid;
	private String ghScheme;
	private Date redeemptionDate;
	private Integer redeemedCmNo;
	private String redeemedLocation;

}
