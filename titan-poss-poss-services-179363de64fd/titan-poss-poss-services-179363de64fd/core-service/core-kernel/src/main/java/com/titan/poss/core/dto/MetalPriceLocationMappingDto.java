/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data

public class MetalPriceLocationMappingDto {

	private String id;

	private String metalPriceConfigId;

	private String metalTypeCode; // will be populated from Code material_master

	private BigDecimal metalRate; // will be computed price

	private String locationCode; // FK of location master

	private Date applicableDate;

	private String marketCode;

	private String currencyCode;

	private String createdBy;

	private Date createdDate;

	private String lastModifiedBy;

	private Date lastModifiedDate;

	private BigDecimal basePrice;

	private String priceType;

	private String remarks;

}