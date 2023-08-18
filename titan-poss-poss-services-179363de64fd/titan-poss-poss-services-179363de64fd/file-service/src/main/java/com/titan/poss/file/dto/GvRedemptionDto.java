/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GvRedemptionDto {

	private String dateAndTime;
	private String docType;
	private Integer cmNumber;
	private String gvItemCode;
	private String gvGc;
	private Integer gvSerialNumber;
	private BigDecimal amount;
	private String locationCode;
	private String ownerInfo;
	private String type;
	private String remarks;
	private String fileId;

}
