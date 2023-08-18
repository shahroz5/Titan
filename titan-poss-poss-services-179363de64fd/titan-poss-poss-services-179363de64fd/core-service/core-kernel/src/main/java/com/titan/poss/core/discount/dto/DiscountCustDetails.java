/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.discount.dto;

import java.util.Date;

import javax.validation.Valid;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@Valid
public class DiscountCustDetails {
	
	private String ulpId;
	private Date enrollmentDate;

}
