package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class legacyPaymentDetails {
	
	@JsonProperty("refFiscalyear")
	private Short refFiscalyear;
	
	@JsonProperty("refDocNo")
	private Integer refDocNo;
	
	private String locationCode;
	
	private String docType;
	
	@JsonProperty("lineItemNo")
	private Integer lineItemNo;
	
	private String paymentCode;
	
	private Long instrumentNo;
	
	@JsonProperty("issuingBank")
	private String issuingBank;
	
	private BigDecimal amount;
	
	private BigDecimal exchangePrice;
	
	@JsonProperty("issueDate")
	private Date issueDate;
	
	private Boolean creditCardBanked;
	
	private BigDecimal creditCardCommission;
	
	private String remarks;
	
	@JsonProperty("branchName")
	private String branchName;
	
	@JsonProperty("loginID")
	private String loginID;
	
	@JsonProperty("createdDate")
	private Date createdDate;
	
	@JsonProperty("lastModifiedID")
	private String lastModifiedID;
	
	@JsonProperty("lastModifiedDate")
	private Date lastModifiedDate;
	
	private BigDecimal remainingAmount;
	
	private Integer confirmCCChqNo;
	
	private Short instrumentFiscalYear;
	
	private String status;
	
	private BigDecimal chequeBounceCharge;
	
	private Date chequeClearingDate;
	
	private Integer bonusPercentage;
	
	private Integer refOrderCNDocno;
	
	private Short refOrderCNFiscalyear;
	
	@JsonProperty("tcsAmountPaid")
	private BigDecimal tcsAmountPaid;
	
	private Boolean isEMI;
	
	private String terminalID;
	
	private String approvalCode;
	
	private String edcId;
	
	@JsonProperty("hostName")
	private String hostName;
	
	
	private String reference1;

	private String reference2;

	private String reference3;
	
	private String applicableCurrency;
	
	private BigDecimal conversionFactor;
	
	private BigDecimal amountInApplicableCurrency;
	
	private String baseCurrency;
	
	private BigDecimal balanceInBaseCurrency;
	
	private BigDecimal balanceInApplicableCurrency;
	
	private BigDecimal payableAmt;
	
	

}
