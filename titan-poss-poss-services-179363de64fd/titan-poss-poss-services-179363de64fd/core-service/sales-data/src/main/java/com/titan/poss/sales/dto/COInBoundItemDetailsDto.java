/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.List;

import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.PriceDetailsDto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class COInBoundItemDetailsDto implements Comparable<COInBoundItemDetailsDto>{
	
	private String id;

	private String itemCode;

	private String locationCode;

	private String lotNumber;

	private BigDecimal totalWeight;
	
	private int quantity;

	private BigDecimal basicPrice;
	
	private BigDecimal goldWtCharges; 
	
	private BigDecimal platinumWtCharges; 
	
	private BigDecimal silverWtCharges;
	
	private BigDecimal wastageCharges; 
	
	private BigDecimal makingCharges;
	
	private BigDecimal totalStoneCharges;
	
	private BigDecimal cGST;
	
	private BigDecimal sGST;
	
	private BigDecimal utGST;

	private BigDecimal totalPrice;
	
	private BigDecimal discount;

	private BigDecimal finalPrice;
	
	private String bTQName;
	
	private String town;
	
	private String state;
	
	private Long age;
	
	private String binCode;
	
	private String contact;
	
	private String pincode;
	
	private Double distance;
	
	private BigDecimal f1DiscountPer;
	
	private BigDecimal f2DiscountPer;
	
	private BigDecimal uCPDiscountPer;
	
	private BigDecimal vDiscountPer;
	
	private String productGroupCode;
	
	private BigDecimal wastagePercentage;
	
	private BigDecimal goldRate;
	
	private BigDecimal platinumRate;
	
	private BigDecimal silverRate;
	
	@Override
	public int compareTo(COInBoundItemDetailsDto coItemDetails) {
		if (getDistance() == 0 || coItemDetails.getDistance() == 0) {
		      return 0;
		    }
		    return getDistance().compareTo(coItemDetails.getDistance());
	}

}
