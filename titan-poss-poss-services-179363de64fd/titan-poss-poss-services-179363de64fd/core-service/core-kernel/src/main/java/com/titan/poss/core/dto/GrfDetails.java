/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.io.Serializable;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GrfDetails extends BaseFieldsValidator implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String minimumUtilization;
	private Boolean isGRFAllowed;
	private Boolean isGRFAllowedInCM;
	private Boolean isGRFAllowedInAdvanceBooking;
	private Boolean isGRFAllowedInCustomerOrder;
	private Boolean isMergeCNAllowed;

}
