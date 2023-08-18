/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

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
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class BrandPanCardDetails extends BaseFieldsValidator {
	private Boolean isPanCardMandatoryforAdvance;
	private Boolean isPanCardMandatoryforCashMemo;
	private Boolean isPanCardMandatoryforGHS;
	private Boolean isPanCardMandatoryforGEP;
	private Boolean isPanCardOnSingleInvoice;
	private Boolean isPanCardOnCumulativeInvoice;
	
	@NotNull(message = "configurationAmountForCashMemo value cannot be null ")
	@Positive(message = "configurationAmountForCashMemo value must be positive")
	private BigDecimal configurationAmountForCashMemo;
	
	@NotNull(message = "configurationAmountForAdvance value cannot be null ")
	@Positive(message = "configurationAmountForAdvance value must be positive")
	private BigDecimal configurationAmountForAdvance;
	
	@NotNull(message = "configurationAmountForGHS value cannot be null ")
	@Positive(message = "configurationAmountForGHS value must be positive")
	private BigDecimal configurationAmountForGHS;
	
	@NotNull(message = "configurationAmountForGEP value cannot be null ")
	@Positive(message = "configurationAmountForGEP value must be positive")
	private BigDecimal configurationAmountForGEP;
	
	@NotNull
	private Integer editPanDetailsNumber;

}
