/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

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
public class PrintDetails extends BaseFieldsValidator implements Serializable  {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Boolean printWastageComponent;

	private Boolean printWastagePercent;

	private Boolean printWastageCharge;

	private Boolean printStoneValue;

	private Boolean printGoldValue;

	private Boolean printPrice;

	private Boolean isMCAndWastage;

	private String mcOrWastageExpense;

	private String freeTextForGrams;

	private Integer noOfInvoicecopiesforRegularOrQuickCM;

	private Boolean isDisplayWastagePercent;

	private Boolean isVariablePrice;

	private Boolean printMakingCharges;

	private Boolean printCustomerNumberinReport;

	private Boolean printCashMemo;

	private Boolean printGuaranteeCard;

	private Boolean printOtherStoneWtinGuaranteeCard;

	private Boolean printOtherStoneWeightinAnnexure;

	@NotNull
	private String invoiceType;

	private Boolean printImage;


}
