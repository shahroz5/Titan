/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;


import java.math.BigDecimal;

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
@EqualsAndHashCode
public class ItemDetailsDto {
	
	private String hsnCode;
	
	private String description;
	
	private BigDecimal stoneWeight;
	
	private BigDecimal diamondCaratage;
	
	private String diamondColor;
	
	private String diamondClarity;
	
	private String stoneCombination;
	
	private String ProductType;
	
	private String pricingGroupType;
	
	private BigDecimal purity;
	
	private BigDecimal karat;
	
	private ItemsDto itemType;
	
	private String totCategory;

}
