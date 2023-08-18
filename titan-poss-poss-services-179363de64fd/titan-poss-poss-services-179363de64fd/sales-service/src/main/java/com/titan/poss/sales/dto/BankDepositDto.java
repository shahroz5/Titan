/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankDepositDto {

	private Date collectionDate;

	@PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX)
	private String paymentCode;

	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX)
	private String locationCode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String payerBankName;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String payeeBankName;

	private Date instrumentDate;

	private Date depositDate;

	private Date businessDate;

	@PatternCheck(regexp = RegExConstants.NUMERIC_REGEX)
	private String instrumentNo;

	@Positive(message = "Amount must be positive")
	private BigDecimal amount;

	@Positive(message = "Amount must be positive")
	private BigDecimal openingBalance;

	@Positive(message = "Amount must be positive")
	private BigDecimal depositAmount;

	private String pifNo;

	private String midCode;

	private JsonData depositDetails;

	private Boolean isGhsIncluded;

	private String depositSlipNo;

	private JsonData approvalDetails;

	private Boolean isBankingCompleted;
}
