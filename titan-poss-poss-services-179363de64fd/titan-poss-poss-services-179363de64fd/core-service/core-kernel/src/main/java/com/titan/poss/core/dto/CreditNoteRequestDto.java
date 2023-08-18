/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class CreditNoteRequestDto {
	
	private String ulpId;

	private String mobileNumber;

	private String customerType;

	private String title;

	private String customerName;

	private String emailId;

	private String customerDetails;

	private Boolean isEncrypted;

	private String instiTaxNo;

	private String custTaxNo;

	private String passportId;

	private String emailValidationDetails;

	private String creditNoteType;

	private String srcLocationCode;

	private String destLocationCode;

	private Short fiscalYear;

	private Integer docNo;

	private Date docDate;

	private Integer customerId;

	private BigDecimal amount;

	private BigDecimal utilisedAmount;

	private String paymentDetails;

	private String eghsDetails;

	private String frozenRateDetails;

	private String gepDetails;

	private String activationDetails;
	
	private String discountDetails;

	private BigDecimal totalTax;

	private String taxDetails;

	private String tepDetails;

	private String grnDetails;

	private String remarks;

	private String status;

	private Integer prints;

	private BigDecimal cashCollected;

	private BigDecimal pointBalance;

	private String currentTier;

	private Date enrollmentDate;

	private Boolean isMemberBlocked;

	private Boolean isPulseCustomer;

	private String loyaltyDetails;
	
	private Boolean isUlpCustomer;

}