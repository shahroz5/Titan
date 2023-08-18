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
public class MaterialMasterStageDto {

	private String color;

	private String materialCode;

	private BigDecimal weight;

	private Boolean isActive;

	private BigDecimal price;

	private String materialType;

	private String loginId;

	private Date createdDate;

	private String lastModifiedId;

	private Date lastModifiedDate;

	private String stoneQuality;

	private String stoneShape;

	private BigDecimal stoneTepDiscount;

	private BigDecimal ratePerGram;
	
	private String fileAuditId;
	
	@JsonIgnore
	private String configDetails;
	
	private String transferType;

}
