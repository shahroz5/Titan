/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class CustomerOrderDetails extends BaseFieldsValidator implements Serializable  {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Boolean cancellationAllowedforCustomerOrder;

	@NotNull
	private Boolean activateAllowedforCustomerOrder;

	@Min(value = 1, message = "validityDaysforAutoClosureInCustomerOrder must be greater than 0")
	private Integer validityDaysforAutoClosureInCustomerOrder;
	
	@NotNull
	private Integer validityDaysforActivateInCustomerOrder;
	
	@NotNull
	private Integer numberOfDaysforAutoApproval;
	
	@NotNull
	private Integer numberOfDaysforReturnAutoApproval;
	
	@NotNull
	private boolean requestApprovalforNonFrozenOrderCancellation;
	
	@NotNull
	@Min(value = 0, message = "coHoldTime must be greater than 0, Please configure Hold Time for CO")
	private BigDecimal coHoldTime;
	
	@NotNull
	private Boolean isSmsAndEmailCommunicationEnable;
}
