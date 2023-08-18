/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class NcTransactionDataStageDto {

	@JsonFormat(pattern = "dd-MMM-yyyy")
	private String fileSharedDate;
	
	private String fileType;

	private String fileName;

	private String transactionType;

	private String type;

	private String storeRecords;

	private String epossRecords;

	private String encircleTdFileRecords;

	private Integer diffStoreVsEposs;

	private Integer diffEpossVsEncircle;

}
