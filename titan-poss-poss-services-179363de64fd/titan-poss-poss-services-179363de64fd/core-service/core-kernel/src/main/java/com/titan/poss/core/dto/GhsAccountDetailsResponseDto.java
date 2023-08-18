/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

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
public class GhsAccountDetailsResponseDto {

	private Integer accountNo;
	private String enrolledLocationCode;
	private String maturityLocationCode;
	private String scheme;
	private Integer noOfInstallmentPaid;
	private Date enrolledDate;
	private Date maturityDate;
	private BigDecimal goldRate;
	private BigDecimal totalGhsAdvance;
	private BigDecimal accumulatedGoldWeight;
	private BigDecimal balance; // same as totalGhsAdvance
	private Boolean isRedeemable;
	private Boolean isProofsAvailable;
	private String status;
	private BigDecimal discount;
	private BigDecimal minUtilizationPct;
	private Integer accountCustomerId;
	private String passbookNo;
	private String mobileNo;
	private String ulpId;
	private String emailId;
	private List<String> address;
	private Integer fiscalYear;
	private String schemeCode;
	private BigDecimal cashCollected;
	private List<String> cfaProductCodes;
	private BigDecimal installmentAmount;
	private Integer discountMcPct;
	private Integer discountUcpPct;
	private Integer requestStatus;
	private Boolean isCancelAccount;
	private Boolean isChequeRealisationReq;
	private Boolean isGetACHdetailAvailable;
	private Boolean isSIAutoDebitEnabled;
}
