/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CashMemoDto {
	
	private String locationCode;
	
	private Integer docNo;
	
	private Short fiscalYear;
	
	@JsonProperty("totalQty")
	private Short totalQuantity;
	
	private BigDecimal totalWeight;
	
	private BigDecimal totalDiscount;
	
	private Integer status;
	
	private Double otherCharges;
	
	@JsonProperty("totalAmount")
	private BigDecimal totalValue;
	
	@JsonProperty("netAmount")
	private BigDecimal finalValue;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date docDate;
	
	private String otherChargesRemarks;
	
	@JsonProperty("totalAmountPaid")
	private BigDecimal paidValue;
	
	
	private BigDecimal totalTax;
	

	private Double totalTax1;
	
	private Double totalTax2;
	
	private Double baseKaratage;
	
	@JsonProperty("customerNo")
	private Integer customerId;
	
	private Double goldRate;
	
	@JsonProperty("timeOfSale")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date confirmedTime;
	
	@JsonProperty("noOfTimesPrintedAnnexure")
	private Integer prints;
	
	private Integer printCmAnnexure;
	
	@JsonProperty("cmRoundingVariance")
	private BigDecimal roundingVariance;
	
	private Boolean isGCpurchase;
	
	private Boolean isQuickCashMemo;
	
	private Boolean isNewCM;
	
	private Double basePlatinumPurity;
	
	private Double baseSilverPurity;
	
	private Double platinumRate;
	
	private Double silverRate;
	
	@JsonProperty("purposeName")
	private  String occasion;
	
	private String refCmFocDocNo;
	
	private Double otherChargesTax1;
	
	private Double otherChargesTax2;
	
	private String otherChargesTaxType1;

	private String otherChargesTaxType2;
	
	private Short refCmFocFiscalYear;
	
	private String mobileNumber;
	
	private String cessName;

	private Double totalCess;
	
	private Double cessOnOtherCharges;
	
	private String refCmFocLocationCode;
	
	private Boolean isCOMOrder;
	
	private Boolean isMailSent;

	private String emailAddress;
	
	@JsonProperty("loginID")
	private String createdBy;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date createdDate;

	@JsonProperty("lastModifiedID")
	private String lastModifiedBy;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date lastModifiedDate;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	@JsonProperty("cmInitialHoldingTime")
	private Date firstHoldTime;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	@JsonProperty("cmHoldingTime")
	private Date lastHoldTime;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date lastInvokeTime;
	
	private String remarks;
	
	@JsonProperty("isBillLevelDiscountRecoveryAllowed")
	private Boolean legacyBillLevelDiscount;
	
	private BigDecimal tcsAmount;
	
	private BigDecimal totalGHSDiscount ;
	
	private BigDecimal totalGHSVoucherDiscount;
	
	private BigDecimal totalHMCharges ;
	
	private Integer totalHMQty;
	
	private BigDecimal totalHMGST ;
	
	private BigDecimal tcsPercentage;
	
	private BigDecimal tcsApplicableAmount;
	
	private String rrNo;
	
	private BigDecimal paymentByCash;
}
