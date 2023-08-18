/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class SlabItemDetailsDto {

	private String itemCode;

	private String itemId;

	private String lotNumber;

	private BigDecimal discountValue;

	private List<DiscountValueDetails> discountValueDetails;

	private Boolean isExclude;

	private Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExcludeDetails;// discount id is key
																									// and respective
																									// cumulative
																									// details is the
																									// value
}
