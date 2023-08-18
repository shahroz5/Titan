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
public class StuddedSplitLdtlDto {

	private String lineDetail;
	private Integer lineItemNo;
	private Integer subLineItemNo;
	private String stoneCode;
	private String stoneWeight;
	private Integer stoneQuantity;
	private Integer parentLineItemNo;
	private String fileId;

}
