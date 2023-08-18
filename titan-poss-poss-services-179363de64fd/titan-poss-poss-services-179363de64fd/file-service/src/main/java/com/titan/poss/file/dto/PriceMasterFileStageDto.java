/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class PriceMasterFileStageDto {

	private String itemCode;

	private String makingCharges;

	private String priceGroup;

	private String loginId;
		
	private String createdDate;
		
	private String lastModifiedId;
		
	private String lastModifiedDate;

}
