/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import com.titan.poss.core.discount.dto.RivaahGhsDiscountDetailsDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for Rivaah GHS details with applicable detail.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RivaahGhsDiscountDetailsExtDto extends RivaahGhsDiscountDetailsDto {

	private Boolean isRivaahDiscountApplicable;

}
