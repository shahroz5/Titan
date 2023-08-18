/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.io.Serializable;
import java.math.BigDecimal;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ItemLiteDto implements Serializable {

	private static final long serialVersionUID = 1L;

	private String itemCode;

	private String productGroupCode;

	private String productCategoryCode;

	private BigDecimal stdValue;

	private BigDecimal stdWeight;

	private String complexityCode;

	private String productGroupDesc;

	private String productCategoryDesc;

	private String brandCode;

	private String itemTypeCode;

	private BigDecimal karat;
	
	private String imageURL;

}
