/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO class for Advance Booking related config details at location master
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class LocationAdvanceBookingDetailsDto extends BaseFieldsValidator implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Boolean cancellationAllowedforAdvanceBooking;

	private Boolean activateAllowedforAdvanceBooking;

	@NotNull
	@Min(value = 0, message = "validityDaysforAutoClosureInAdvanceBooking must be greater than 0")
	private Integer validityDaysforAutoClosureInAdvanceBooking;

	@NotNull
	@Min(value = 0, message = "validityDaysforActivateInAdvanceBooking must be greater than 0")
	private Integer validityDaysforActivateInAdvanceBooking;

	@NotNull
	private Integer validityDaysforReleaseInvInAdvancebooking;

	@NotNull
	private BigDecimal minPercentToBePaidForFrozenOrder;

	@NotNull
	private BigDecimal minPercentToBePaidForNonFrozenOrder;

	@NotNull
	private BigDecimal abHoldTime;

	@NotNull
	private Boolean requestApprovalForNonFrozenOrderCancel;

	@NotNull
	private BigDecimal noOfHoursForOpenTaskDeletion;
	
	@NotNull
	private Boolean isSmsAndEmailCommunicationEnable;

}
