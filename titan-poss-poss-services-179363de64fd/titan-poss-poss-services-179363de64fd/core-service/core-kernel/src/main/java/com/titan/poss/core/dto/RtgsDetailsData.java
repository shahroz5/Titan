/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RtgsDetailsData implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Boolean enableRtgsPayment;
	private Boolean isRRNumberValidation;
	private Double maximumAmount;
	private Double minimumAmount;
	@NotNull
	private Integer noOfDaysForChequeOrDDAcceptance;
	@NotNull
	private Boolean isEnableAirpayForIntegration;
	@NotNull
	private Boolean isEnableUnipayForIntegration;
	@NotNull
	private Boolean isROApprovedByWorkflow;

}
