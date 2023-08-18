/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.io.Serializable;
import java.math.BigDecimal;

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
public class GrnDetails extends BaseFieldsValidator implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private BigDecimal minUtilizationPercentForGRN;

	private Integer noOfDaysGRNAllowed;

	private Integer maximumNoOfDaysForApprovedGRN;

	private Integer noOfDaysToProtectGoldRateForGRN;

	private Boolean isInterBoutiqueGRNAllowed;

	private Boolean isGrnAllowedInCm;
	private Boolean isGrnAllowedInAdvanceBooking;
	private Boolean isGrnAllowedInCustomerOrder;

}
