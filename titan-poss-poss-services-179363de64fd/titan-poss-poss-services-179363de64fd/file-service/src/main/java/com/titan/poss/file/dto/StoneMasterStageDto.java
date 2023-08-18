/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class StoneMasterStageDto {

	private String color;

	private String stoneCode;

	private BigDecimal weight;

	private Boolean isActive;

	private BigDecimal price;

	private String stoneTypeCode;

	private String loginId;

	private Date createdDate;

	private String lastModifiedId;

	private Date lastModifiedDate;

	private String stoneQuality;

	private String stoneShape;

	private BigDecimal stoneTepDiscount;

	private BigDecimal ratePerCarat;
	
	private String fileAuditId;
	
	@JsonIgnore
	private String configDetails;
	
	private String transferType;


}
