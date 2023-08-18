/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.response.JsonData;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomerDetailsDto extends CustomerResDto {

	private BigDecimal pointBalance;

	private String currentTier;

	private Date enrollmentDate;

	private Boolean isMemberBlocked;

	private Boolean isPulseCustomer;

	private JsonData loyaltyDetails;

}
