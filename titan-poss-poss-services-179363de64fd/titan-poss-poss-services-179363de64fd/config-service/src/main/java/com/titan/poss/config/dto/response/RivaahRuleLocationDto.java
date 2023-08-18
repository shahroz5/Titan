/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.response;

import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RivaahRuleLocationDto {

	private Integer ruleId;

	private String ruleType;

	private String locationCode;

	private String description;

	private String subBrandCode;

	private Date offerStartDate;

	private Date offerEndDate;

	private String ruleName;

}
