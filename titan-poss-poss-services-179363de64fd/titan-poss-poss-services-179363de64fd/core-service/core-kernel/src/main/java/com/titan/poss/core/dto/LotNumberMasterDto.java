/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class LotNumberMasterDto {
	
	private String lotNumber;
	private String itemCode;
	private BigDecimal stoneWeight;
	private BigDecimal diamondWeight;
	private Double f1;
	private String loginId;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date createdDate;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date lastModifiedDate;
	private String lastModifiedId;
	private String locationCode;
	private Boolean statusChanged;
}
