/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

import java.io.Serializable;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.payment.constants.PaymentConstants;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ConfigDetailDto implements Serializable {

	private static final long serialVersionUID = 1L;

	@ValueOfEnum(enumClass = TransactionTypeEnum.class, message = PaymentConstants.INVALID_TRANSACTION_TYPE)
	private String transactionType;

	@PatternCheck(message = PaymentConstants.INVALID_PAYMENT_CODE, regexp = RegExConstants.PAYMENT_CODE_REGEX, nullCheck = true)
	private String paymentCode;

	private transient Object configDetails;

}
