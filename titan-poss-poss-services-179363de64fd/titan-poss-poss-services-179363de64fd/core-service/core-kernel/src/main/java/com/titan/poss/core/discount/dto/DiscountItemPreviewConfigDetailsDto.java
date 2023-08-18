/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountItemPreviewConfigDetailsDto {

	private Boolean previewF2IsPercent;

	private Boolean previewUcpIsPercent;

	private Boolean previewVIsPercent;

	private Boolean previewF1IsPercent;

	private BigDecimal previewF2Value;

	private BigDecimal previewUcpValue;

	private BigDecimal previewVValue;

	private BigDecimal previewF1Value;

	private BigDecimal previewWeightValue;

	private Boolean previewIsGrossWeight;

}
