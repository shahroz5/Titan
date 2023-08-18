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
public class LocationOtpDetails extends BaseFieldsValidator implements Serializable  {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Boolean isOTPallowedASSM;
	private Boolean isOTPallowedCM;
	private Boolean isOTPallowedAdvance;
	private Boolean isOTPallowedAB;
	private Boolean isOTPallowedGHS;
	private Boolean isOTPallowedGRF;
	private Boolean isOTPallowedCO;
	private Boolean isOTPrequiredforGHSRedemption;
	private Boolean isOTPrequiredforGC;
	@NotNull
	private String otpHelpDeskEmailId;
}
