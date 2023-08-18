/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Unipay other details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnipayResponseDto {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true, message = "Please provide request input")
	private String requestInput;

	@NotNull(message = "Please provide response code")
	private Integer responseCode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true, message = "Please provide request message")
	private String responseMessage;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true, message = "Please provide request message")
	private String approvalCode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true, message = "Please provide request message")
	private String rRN;

	private BigDecimal amount;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true, message = "Please provide card or voucher number")
	private String cardNumber;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true, message = "Please provide card or voucher number")
	private String cardType;

	@PatternCheck(regexp = RegExConstants.NAME_REGEX, nullCheck = true, message = "Please provide card holder name")
	private String cardHolderName;

	@PatternCheck(regexp = RegExConstants.NAME_REGEX, nullCheck = true, message = "Please provide card holder name")
	private String acquirerBank;

	private Date txnDate;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true, message = "Please provide transaction type")
	private String txnType;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true, message = "Please provide bank invoice number")
	private String bankInvoiceNumber;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true, message = "Please provide batch number")
	private String batchNumber;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true, message = "Please provide terminal id")
	private String terminalId;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true, message = "Please provide merchant id")
	private String merchantId;
	
	//@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true, message = "Please provide unipay id")
	private String unipayId;

}
