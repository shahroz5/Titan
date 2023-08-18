/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.List;

import javax.validation.Valid;

import com.titan.poss.config.dto.PurchaseItemDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO class list the purchased items against which foc offer is applicable
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseItemListDto {

	private List<@Valid PurchaseItemDto> purchaseItems;

}
