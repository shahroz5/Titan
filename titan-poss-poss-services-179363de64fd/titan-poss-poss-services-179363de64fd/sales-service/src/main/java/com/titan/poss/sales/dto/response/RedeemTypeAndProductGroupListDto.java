/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO to get redemption type and product group code list.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RedeemTypeAndProductGroupListDto {

	private String redemptionType;
	private List<String> productGroups;
	private String cPGName;
	private BigDecimal validAmount;
	private Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPgcDetails;
}
