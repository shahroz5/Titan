/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.io.Serializable;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class LocationPaymentDetails extends BaseFieldsValidator implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@NotNull
	private Integer chequeValidityDays;
	@NotNull
	private Integer ddValidityDays;
	private Integer realisationDays;
	private Boolean isUlpAllowed;
	private Boolean enableCNCancellationForGVPayment;
	private Boolean enableCNTarnsferForGVpayment;
	private Boolean isMultipleGVAllowed;
	private Boolean isRazorPayEnabled;
	@NotNull
	private Integer pendingRORequestDeletion;
	@NotNull
	private Integer approvedRORequestDeletion;
	@Valid
	private RtgsDetailsData rtgs;

}
