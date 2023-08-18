/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class TepCutPieceConfigDto {

	private BigDecimal weightTolerancePercent;

	private String cutPieceItemCode;

	private BigDecimal l3DeductionPercent;
}
