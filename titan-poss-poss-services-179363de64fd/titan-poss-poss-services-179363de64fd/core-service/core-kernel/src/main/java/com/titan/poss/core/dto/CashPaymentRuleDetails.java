/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.util.Date;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class CashPaymentRuleDetails extends BaseFieldsValidator {

	private String cashAmountMaxCap;

	@NotNull(message = "ValidFrom Date cannot be null")
	@PastOrPresent
	private Date validFrom;

	@Valid
	private ApplicableDaysData applicableDays;

	@Valid
	private ApplicablePaymentTypeData applicablePaymentType;

	@Valid
	private ApplicableTransactionData applicableTransaction;

	@NotNull(message = "CummulativeCashValue cannot be null")
	Boolean cummulativeCashValue;

	@Valid
	private ApplicableL1L2StoresData applicableL1L2Stores;

	@Valid
	private ApplicableL3StoresData applicableL3Stores;

	private Boolean l3Stores;

	private Boolean l1l2Stores;
	@Valid
	private PMLASettings pmlaSettings;

}
