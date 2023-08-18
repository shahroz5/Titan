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
public class ResponseBodyMarketMetalMapping {
	// if any other fields are in need in future from materialMapping so this class
	// is created
	private String marketCode;
	private BigDecimal computedPrice;

	private BigDecimal addAmount;

	private BigDecimal deductAmount;
	private BigDecimal markupFactor;
	private String metalTypeCode;
	private Date applicableDate; // date created (ui input date)

}
