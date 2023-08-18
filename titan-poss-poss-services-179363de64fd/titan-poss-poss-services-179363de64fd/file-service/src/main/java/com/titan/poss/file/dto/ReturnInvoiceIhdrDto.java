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
public class ReturnInvoiceIhdrDto {

	private String type;

	private String constant1;

	private String l3BoutiqueCode;
	
	private String productGroup;

	private Integer constantValue;

	private String documentNumber;

	private String transactionDate;

	private String fy;

	private String constant2;

	private String sapCode;

	private Integer qty;

	private BigDecimal weight;

	private BigDecimal value;

	private BigDecimal billLevelDiscount;

	private BigDecimal tax;

	private BigDecimal otherCharges;

	private String fileId;

}
