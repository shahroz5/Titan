/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto.request;

import java.io.Serializable;
import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.payment.constants.PaymentConstants;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class CashbackUpdateDto implements Serializable {

	private static final long serialVersionUID = 1L;

	@PatternCheck(regexp = RegExConstants.CASHBACK_NAME_REGEX)
	private String cashbackName;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, message = PaymentConstants.INVALID_BANK_NAME, nullCheck = true)
	private String bankName;

	@PatternCheck(regexp = RegExConstants.CARD_DIGITS_REGEX)
	private String cardNoLength;

	private Date startDate;

	private Date endDate;

	private String firstCardDigits;

	private String lastCardDigits;

	private Boolean mobileFlag;

	@Positive
	private Integer maxUsageCount;

	@PatternCheck(message = PaymentConstants.INVALID_DESCRIPTION, regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String cmRemarks;

	@PatternCheck(message = PaymentConstants.INVALID_DESCRIPTION, regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String offerRemarks;

	@NotNull
	private Boolean isActive;
	
	@NotNull
	private Boolean excludeCashback;
}
