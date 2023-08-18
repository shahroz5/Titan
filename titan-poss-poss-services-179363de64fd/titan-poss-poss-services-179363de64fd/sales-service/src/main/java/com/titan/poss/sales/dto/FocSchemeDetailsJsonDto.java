/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

/**
 * DTO class for Foc scheme details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FocSchemeDetailsJsonDto {

	private String schemeId;

	private List<String> schemeDetailIds;

	private String schemeCategory;

	private String schemeName;

	private BigDecimal weight;

}
