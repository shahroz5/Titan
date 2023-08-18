/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ConfirmCustomerOrderDetailsDto {

	private String possCustomerOrderDocNo;

	private Date possCustomerOrderDateTime;

	private String possCusotmerOrderFiscalYear;

	private String possCustomerOrderLocationCode;

	private BigDecimal possCustomerOrderTotalValue;

	private BigDecimal possCustomerOrderAmountCollected;

	private List<String> comOrderNo;

	private String status;

	private Boolean goldRateFrozenFlag;

	private BigDecimal goldRate;

	private String posLoginId;
}
