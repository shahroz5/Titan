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
public class StuddedSplitHdrDto {

	private String header;
	private String constant;
	private String locationCode;
	private Integer fiscalYear;
	private Integer serialNumber;
	private String currentDate;
	private Integer noOfLineItems;
	private String fileId;

}
