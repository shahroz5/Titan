/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class LocationOfferDetails {

	private Date offerStartDate;
	private Date offerEndDate;
	private String configDetails;
	private BigDecimal empowermentQuarterMaxDiscountValue;
	private Date previewOfferStartDate;
	private Date previewOfferEndDate;
	
}
