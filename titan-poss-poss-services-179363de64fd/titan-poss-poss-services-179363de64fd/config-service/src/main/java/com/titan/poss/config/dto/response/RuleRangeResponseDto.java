/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.config.dto.response;

import java.util.List;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RuleRangeResponseDto {

	private Integer ruleId;

	private String ruleType;

	private List<RuleRangeDetailsDto> rules;

}
