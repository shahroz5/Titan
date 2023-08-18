/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.util.List;

import javax.validation.Valid;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ServicePossRevenueDto {
	
	private String revenueType;

	private List<@Valid ServiceRevenueDto> revenues;

}




