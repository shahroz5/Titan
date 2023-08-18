/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import com.titan.poss.config.dto.response.FileUploadResponseDto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountRaiseRequestDto {


	private String remarks;
	
	FileUploadResponseDto fileDetils;

}
