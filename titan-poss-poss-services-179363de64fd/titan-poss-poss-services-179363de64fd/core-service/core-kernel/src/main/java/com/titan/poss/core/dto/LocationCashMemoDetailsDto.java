/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class LocationCashMemoDetailsDto extends BaseFieldsValidator implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Boolean isBillCancelApprovalRequired;
	@NotNull
	private BigDecimal maxNoOfHoursForBillCancel;

	@NotNull
	private Boolean isTitle;
	private Boolean isMobileAndEmail;
	@NotNull
	private Boolean isEditWeightAllowed;
	private Boolean isMobileAndEmailMandatoryForCorrection;
	@NotNull
	private Integer cmHoldTimeInMinutes;

	@NotNull
	private BigDecimal noOfHoursForOpenTaskDeletionCM;

}
