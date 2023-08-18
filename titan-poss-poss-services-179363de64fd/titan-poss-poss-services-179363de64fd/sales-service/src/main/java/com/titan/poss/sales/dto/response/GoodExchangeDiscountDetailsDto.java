/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.Map;

import com.titan.poss.sales.dao.GepConfigDetailsDaoExt;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO to get discounts applicable in TEP/GEP.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoodExchangeDiscountDetailsDto {

	private Map<String, Object> discountObj;
	private GepConfigDetailsDaoExt gepConfigDetailsDaoExt;

}
