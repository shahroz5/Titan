/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerUploadApprovalHeaderDto {

	private Integer customerId;
	private String title;
	private String customerName;
	private String customerType;
	private String ulpId;
	private String mobileNumber;
	private String instiTaxNo;
	private String custTaxNo;
	private String passportId;
	private BigDecimal pointBalance;
	private String currentTier;
	private Date enrollmentDate;
	private Boolean isMemberBlocked;
	private Boolean isPulseCustomer;

}
