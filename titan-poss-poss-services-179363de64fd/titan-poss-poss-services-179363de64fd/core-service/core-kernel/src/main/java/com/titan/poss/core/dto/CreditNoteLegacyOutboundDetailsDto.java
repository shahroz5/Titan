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
public class CreditNoteLegacyOutboundDetailsDto {

	private Integer docNo;

	private Integer fiscalYear;

	private String locationCode;
	
	private Integer adjustedAmount;

	private String docDate;

	private Integer refDocNo;

	private Integer status;

	private String creditNoteType;

	private Integer noOfTimesPrinted;

	private String loginId;

	private String createdDate;

	private String lastModifiedId;

	private String lastModifiedDate;

	private BigDecimal amount;

	private String refDocType;

	private Integer refFiscalYear;

	private Integer seqNo;

	private Integer customerNo;

	private Integer holdCmDocNo;

	private Integer isGrammage;

	private String cfaProductCode;

	private Integer interBtqGhDocNo;

	private Integer interBtqGhFiscalYear;

	private String remarks;

	private Boolean isInterBtqGhs;

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

	private Integer holdAdvanceDocNo;

	private Integer holdCustomerDocNo;

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

	private Boolean isBlocked;

	private Integer possCnNo;

	private Integer eghsCnNo;

	private Boolean isFromReversal;

	private Integer ghsAccNo;

	private String eghsRemarks;

	private Boolean isGeneratedForUnipayDeletion;

	private BigDecimal silverRateProtected;

	private BigDecimal platinumRateProtected;

	private Boolean isMixedModeGrn;

	private BigDecimal totalTax;

	private BigDecimal totalTax1;

	private BigDecimal totalTax2;

	private String focRecoveredValue;

	private String focCfa;

	private BigDecimal ghsVoucherDiscount;

	private String gepPurityConfigId;

	private BigDecimal gepPurity;

	private BigDecimal gepTotalDeductionValue;

	private Date gepExDiscountBillingValidity;

	private Date gepExDiscountRebillingValidity;

	private BigDecimal gepExDiscountUtilized;

	private String frozenRateDetails;

	private Integer otp;

	private Boolean isQcgcInvolved;

	// mark1
	private Boolean isForGHSPayment;

	// mark2
	private BigDecimal digiGoldDiscount;

}
