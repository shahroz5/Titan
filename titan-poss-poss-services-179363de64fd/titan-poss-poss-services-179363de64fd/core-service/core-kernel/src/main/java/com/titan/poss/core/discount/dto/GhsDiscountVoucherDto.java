/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for GHS Discount Voucher details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GhsDiscountVoucherDto {

	@PatternCheck(regexp = RegExConstants.NUMERIC_REGEX)
	private String voucherNo;

	@PatternCheck(regexp = RegExConstants.NUMERIC_REGEX)
	private String accountNo;

	// REDEEMED or REVERSED
	private String redeemStatus;

	private String discountTxnId;

	private Boolean isSameCustomer;

	public GhsDiscountVoucherDto(String voucherNo, String accountNo, String redeemStatus, String discountTxnId) {
		super();
		this.voucherNo = voucherNo;
		this.accountNo = accountNo;
		this.redeemStatus = redeemStatus;
		this.discountTxnId = discountTxnId;
	}
}
