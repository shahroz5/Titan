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
public class StuddedSplitDtlDto {

	private String detail;
	private String constant;
	private String locationCode;
	private String fiscalYear;
	private Integer serialNumber;
	private String currentDate;
	private Integer lineItemNumber;
	private String itemCode;
	private String value;
	private Integer quantity;
	private String weight;
	private String totalValue;
	private Integer constantValue1;
	private Integer constantValue2;
	private Integer constantValue3;
	private String lotNumber;
	private String actualF1;
	private String diamondWeight;
	private String otherStoneWeight;
	private Integer parentLineItemNumber;
	private String fileId;
}
