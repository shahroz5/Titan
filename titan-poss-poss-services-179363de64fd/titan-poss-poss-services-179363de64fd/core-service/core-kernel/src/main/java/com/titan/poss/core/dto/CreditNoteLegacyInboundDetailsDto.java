/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class CreditNoteLegacyInboundDetailsDto {
	
	@NotNull(message = "docNo cannot be null")
	private Integer docNo;

	@NotNull(message = "fiscalYear cannot be null")
	private Integer fiscalYear;

	@NotNull(message = "locationCode cannot be null")
	private String locationCode;

	private BigDecimal adjustedAmount;

	private Date docDate;

	private Integer refDocNo;

	private Integer status;

	private String creditNoteType;

	private Integer noOfTimesPrinted;

	private String loginId;

	private Date createdDate;

	private String lastModifiedId;

	private Date lastModifiedDate;

	private BigDecimal amount;

	private String refDocType;

	private Integer refFiscalYear;

	@NotNull(message = "customerNo cannot be null")
	private Integer customerNo;

	private String remarks;

	private BigDecimal ghsBonus;

	private Integer sourceCnNo;

	private String sourceCnType;

	private Integer sourceFiscalYear;

	private Date chequeClearingDate;

	private Date lastReactivatedDate;

	private Date lastSuspendedDate;

	private Boolean isGoldRateProtected;

	private Date goldRateProtectedExpiryDate;

	private BigDecimal goldRateProtected;

	private Integer originalCnDocNo;

	private Integer originalCnFiscalYear;

	private Boolean isNewCn;

	private BigDecimal grnWeight;

	private Integer instrumentNo;

	private String issuingBank;

	private Boolean isBehaviourActive;

	private String behaviour;

	private String behaviourParameters;

	private BigDecimal totalCashCollected;

	private Boolean isRtgs;

	private Integer eghsCnNo;

	private Integer ghsAccNo;

	private String eghsRemarks;

	private Boolean isGeneratedForUnipayDeletion;

	private BigDecimal silverRateProtected;

	private BigDecimal platinumRateProtected;

	private BigDecimal totalTax;

	private String focRecoveredValue;

	private String focCfa;

	private BigDecimal ghsVoucherDiscount;

	private String gepPurityConfigId;

	private BigDecimal gepPurity;

	private BigDecimal gepTotalDeductionValue;

	private Date gepExDiscountBillingValidity;

	private Date gepExDiscountRebillingValidity;

	private BigDecimal gepExDiscountUtilized;

	private Integer otp;

	private Boolean isQcgcInvolved;
	
	@NotNull(message = "destination locationCode cannot be null")
	private String destBtqCode;

}
