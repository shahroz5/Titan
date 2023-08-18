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
public class NcStoreMasterStageDto {

	private String channel;

	private String storeCode;

	private String storeName;

	@JsonFormat(pattern = "dd-MM-yyyy")
	private String transactionDate;

	private String storeType;

	private String city;

	private String state;

	private String region;

	private Integer pinCode;

	private Integer isSmsEnabled;

	private Integer isActive;

}
