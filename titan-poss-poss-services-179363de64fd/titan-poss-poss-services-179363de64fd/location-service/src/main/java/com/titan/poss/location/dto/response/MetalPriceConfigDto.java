/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class MetalPriceConfigDto {

	private String id;

	private String metalTypeCode;

	private BigDecimal basePrice;

	private String priceType;

	private Date applicableDate;

	private String remarks;

	private Date createdDate;

	private Date lastModifiedDate;
}
