/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.response;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GhsDiscountVoucherResponseDto {

	private Long voucherNo;

	private Integer accountNo;

	private String customerName;

	private Date issueDate;

	private Date redeemptionDate;

	private Boolean isGoldCoinAllowed;

	private Integer noOfInstallmentsPaid;

	private BigDecimal discountAmount;

	private String mobileNo;

	private Integer accountCustomerId;

	private BigDecimal installmentAmount;

	private String ghScheme;

	private Date validFrom;

	private Date validTill;

	private String status;

	private String redeemedCMId;

	private String title;

	private String emailID;

	private String ulpID;

	private List<String> address;

	private String city;

	private String state;

	private String pinCode;

}
