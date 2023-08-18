package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerTcsDetailsDto {

	private String customerTcsDetailsId;

	private String salesTxnId;

	private String brandCode;

	private String ownerType;

	private String locationCode;

	private String customerMasterId;

	private String mobileNumber;

	private String ulpId;

	private String storePan;

	private Integer docNo;

	private Short fiscalYear;

	private Date transactionDate;
	
	private BigDecimal tcsEligibleAmount;
	
	private BigDecimal tcsApplicableAmount;
	
	private BigDecimal tcsPercentage;
	
	private BigDecimal tcsToBeCollected;
	
	private BigDecimal netInvoiceAmount;
	
	private boolean currentTransaction;
	
	private BigDecimal tcsCollected;
}
