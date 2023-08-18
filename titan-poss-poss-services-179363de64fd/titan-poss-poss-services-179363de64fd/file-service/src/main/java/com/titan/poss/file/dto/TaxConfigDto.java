/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class TaxConfigDto {
	
	private String transactionType;
	
	private String sourceBtqType;
	
	private String destinationBtqType;
	
	private String customerType;
	
	private String srcLocationApplicableTax;
	
	private String destLocationApplicableTax;
	
	private String customerApplicableTax;
	
	private Boolean isSameState;
	
	private Boolean isSourceBtqTaxApplicable;
	
	private String applicableTax;
	
	private String id;
	
	private Boolean isActive;
	
	private String fileAuditId;
	
	private String createdBy;
	
	private Date createdDate;
	
	private String lastModifiedBy;
	
	private Date lastModifiedDate;
	
	private Integer srcSyncId;
	
	private Integer destSyncId;

}
