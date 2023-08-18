/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurityDto {

	private String id;

	private String itemTypeCode;

	private BigDecimal purity;

	private BigDecimal karat;

	private BigDecimal offset;

	private String description;

	private Boolean isActive;

	private Boolean isDisplayed;
}
