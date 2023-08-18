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
public class MaterialMasterFileStageDto {
	
	private String color;

	private String materialCode;

	private String weight;

	private String isActive;

	private String price;

	private String materialType;

	private String loginId;

	private String createdDate;

	private String lastModifiedId;

	private String lastModifiedDate;

	private String stoneQuality;

	private String stoneShape;

	private String stoneTepDiscount;

	private String ratePerGram;

}
