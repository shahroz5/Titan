/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.file.dto;

import java.math.BigDecimal;
import java.util.Date;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ComplexityPriceGroupConfigWriterDto {
	
	private String id;
	
	private String complexityCode;
	
	private String priceGroup;
	
	private BigDecimal makingChargePunit;
	
	private BigDecimal makingChargePgram;
	
	private String isActive;
	
	private BigDecimal wastagePct;
	
	private BigDecimal makingChargePct;
	
	private String fileAuditId;
	
	private String createdBy;

	private Date createdDate;
	
	private String lastModifiedBy;

	private Date lastModifiedDate;
	
	private int srcSyncId;
	
	private int destSyncId;

	private String currencyCode;
}
