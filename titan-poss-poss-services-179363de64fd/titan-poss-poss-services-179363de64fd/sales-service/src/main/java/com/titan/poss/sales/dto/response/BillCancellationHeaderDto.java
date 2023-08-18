/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

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
public class BillCancellationHeaderDto {

	private Integer invoiceNo;
	private String refTxnId;
	private String refTxnType;
	private String refSubTxnType;

	private BigDecimal totalValue;
	private Date confirmedTime;
	private String id;
	private String employeeCode;
	private Short totalQuantity;
	private BigDecimal totalWeight;
	private String reasonForCancellation;

	// customer details
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
