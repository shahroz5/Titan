/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ClubDiscountResponseDto {

	private String id;

	private String type1DiscountCode;

	private String type2DiscountCode;

	private String type3DiscountCode;
}
