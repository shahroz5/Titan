/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto.response;

import java.util.List;

import javax.validation.Valid;

import com.titan.poss.core.dto.RevenueDto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class GhsTodayRevenueDto {
	
	private String revenueType;

	private List<@Valid RevenueDto> revenues;
}
