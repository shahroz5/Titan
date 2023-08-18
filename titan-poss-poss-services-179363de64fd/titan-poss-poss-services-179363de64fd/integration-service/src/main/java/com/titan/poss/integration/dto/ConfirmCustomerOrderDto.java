/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ConfirmCustomerOrderDto {

	private String PossCustomerOrderDocNo;

	private Date PossCustomerOrderDateTime;

	private String PossCusotmerOrderFiscalYear;

	private String PossCustomerOrderLocationCode;

	private BigDecimal PossCustomerOrderTotalValue;

	private BigDecimal PossCustomerOrderAmountCollected;

	private String COMOrderNo;

	private String Status;

	private Boolean GoldRateFrozenFlag;

	private BigDecimal GoldRate;

	private String POSLoginId;
}
