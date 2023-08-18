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
public class ItemDto implements Serializable {

	private static final long serialVersionUID = 1L;

	private String itemCode;

	private String description;

	private BigDecimal stdWeight;

	private BigDecimal stdValue;

	private String complexityCode;

	private String productGroupCode;

	private String productCategoryCode;

	private String brandCode;

	private String itemTypeCode;

	private Integer leadTime;

	private String orgCode;

	private String parentItemCode;

	private transient Object itemDetails;

	private transient Object configDetails;

	private Boolean isActive;

	private Boolean isEditable;

	private String taxClassCode;

	private BigDecimal priceFactor;

	private Boolean isSaleable;

	private Boolean isReturnable;

	private BigDecimal karat;

	private BigDecimal purity;

	private String imageUrl;

	private BigDecimal stoneCharges;

	private String pricingType;

	private String pricingGroupType;

	private Boolean isFocItem;

}
