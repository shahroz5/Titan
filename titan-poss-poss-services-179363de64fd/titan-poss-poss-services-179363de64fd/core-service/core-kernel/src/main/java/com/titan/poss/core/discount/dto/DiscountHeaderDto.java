/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountHeaderDto {

	private String id;

	private String discountCode;

	private String occasion;

	private String createdBy;

	private String discountType;

	private String requestRemarks;

	private String typeOfRequest;

	private String fileId;
	
	private String fileName;
}
