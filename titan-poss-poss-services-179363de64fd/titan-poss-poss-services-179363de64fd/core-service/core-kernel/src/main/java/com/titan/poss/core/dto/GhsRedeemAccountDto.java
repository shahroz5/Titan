/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class GhsRedeemAccountDto {

	private Integer accountNo;

	private BigDecimal redemptionAmount;

	private Date businessDate;

	private Integer fiscalYear;

}
