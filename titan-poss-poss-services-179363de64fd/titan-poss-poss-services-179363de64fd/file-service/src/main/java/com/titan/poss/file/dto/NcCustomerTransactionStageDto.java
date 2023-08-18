/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class NcCustomerTransactionStageDto {

	private String channel;

	private String storeCode;

	private String transactionDate;

	private String unifiedLoyaltyNo;

	private String gvCode;

	private String invoiceNumber;

	private String lineItemNo;

	private String itemCode;

	private String categoryCode;

	private String cluster;

	private Integer quantity;

	private BigDecimal grossAmount;

	private BigDecimal discount;

	private BigDecimal eligibleAmount;

	private String rrNumber;
	
	private String transactionType;

	private String reference;

	private String discountCode;

	private String cmDate;

	private String cmNo;

	private String brandName;

	private String cmLocationCode;

	private String cmLineItemNo;

}
