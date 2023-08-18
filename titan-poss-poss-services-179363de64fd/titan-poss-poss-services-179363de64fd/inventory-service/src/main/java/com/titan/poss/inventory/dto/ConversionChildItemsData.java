package com.titan.poss.inventory.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversionChildItemsData {
	
	String remarks;

	String itemCode;

	BigDecimal netWeight;

	BigDecimal stonePrice;

	String complexityCode;

	String sold;

	String itemType;

}
