/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

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
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class BaseBasicCriteriaDetails extends BaseFieldsValidator {

	private Boolean isNarationMandatory;

	private BigDecimal maxDiscount;

	private Boolean isEditable;

	private Boolean isTepRecovery;

	private Boolean isBillValue;

	private BigDecimal ucpValue;

	private Boolean isFullValueTepDiscountRecovery;

	private Date coinPurchaseStartDate;

	private Date coinPurchaseEndDate;

	private Date tepPeriodStartDate;

	private Date tepPeriodEndDate;

	private BigDecimal tepCNUtilizationPercent;

	private BigDecimal mCPercent;

	private String startingSerialNo;

	private Boolean isUploadMandatory;

	private Boolean isNameMandatory;

	private Integer startingSerialNoTataEmpDiscountType;

	private Boolean isMultipleTrnsctnAllowedOnSameDay;

	private Integer maxNoOfTimes;

	private Integer maxCount;

	private Boolean isApplicableForAutomatedDiscount;

}
