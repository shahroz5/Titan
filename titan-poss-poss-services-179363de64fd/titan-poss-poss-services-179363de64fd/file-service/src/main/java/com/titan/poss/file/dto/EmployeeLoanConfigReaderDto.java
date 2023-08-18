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
public class EmployeeLoanConfigReaderDto {
	
	private String id;
	
	private String employeeName;
	
	private String employeeCode;
	
	private String mobileNo;
	
	private String amountEligibility;
	
	private String approvalDate;
	
	private String validaityDate;
	
	private String productGrpCodes;
	
	private String locationCodes;
	
	private String margin;
	
	private String otpRequired;
	
	private String redeemability;
	
//	private String emiCount;
	
	private String fileAuditId;
	
	private String createdBy;

	private Date createdDate;
	
	private String lastModifiedBy;

	private Date lastModifiedDate;
	
	private int srcSyncId;
	
	private int destSyncId;

}
