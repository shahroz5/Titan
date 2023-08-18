/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import com.titan.poss.core.dto.GhsAccountDetailsResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for account details with customer id.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class AccountDetailsDto extends GhsAccountDetailsResponseDto {

	private String id;
	private Integer customerId;
	private String currentTier;
	private Boolean isMemberBlocked;
	private Boolean isPulseCustomer;

}
