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
public class ComplexityPriceGroupConfigReaderDto {
	
	private String id;
	
	private String complexitycode;
	
	private String pricegroup;
	
	private String makingChargesPerUnit;
	
	private String makingchargespergram;
	
    private Boolean isActive;
	
	private String wastagepercentage;
	
	private String makingChargePercentage;
	
	private String fileAuditId;
	
	private String createdBy;

	private Date createdDate;
	
	private String lastModifiedBy;

	private Date lastModifiedDate;
	
	private int srcSyncId;
	
	private int destSyncId;

}
