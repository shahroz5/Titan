/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FocSchemeDetailsDto {

	private String id;

	private String schemeId;

	private String itemCode;

	private String itemType;

	private String category;

	private String focEligibility;

	private String offerType;

	private BigDecimal stdSaleValue;

	private BigDecimal fromSaleValue;

	private BigDecimal toSaleValue;

	private BigDecimal weight;

	private Integer quantity;

	private BigDecimal karat;

	private Boolean isSingle;

	private Boolean isMultiple = false;
	
	private BigDecimal actualWt = null;
	
	private BigDecimal intialWt = null;

}
