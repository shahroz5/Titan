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
public class PaymentHostnameMappingDto {
	
	private String locationCode;
	
	private String hostName;
	
    private String deviceId;
    
    private String paymentCode;
    
    private Boolean isActive;
    
    private String id;
    
    private String fileAuditId;
    
    private String createdBy;

	private Date createdDate;

	private String lastModifiedBy;

	private Date lastModifiedDate;
	
	private int srcSyncId;
	
	private int destSyncId;
}
