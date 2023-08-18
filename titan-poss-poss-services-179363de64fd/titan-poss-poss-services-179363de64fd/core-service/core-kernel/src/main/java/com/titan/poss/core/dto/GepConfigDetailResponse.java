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
public class GepConfigDetailResponse {

	private String rangeId;

	private BigDecimal deductionPercent;

	private BigDecimal schemePercent;

	private Date startDate;

	private Date endDate;

	private String metalType;

	private String itemType;

	private Integer holdTime;

	private String configId;

	private String configName;

	private String configType;

}
