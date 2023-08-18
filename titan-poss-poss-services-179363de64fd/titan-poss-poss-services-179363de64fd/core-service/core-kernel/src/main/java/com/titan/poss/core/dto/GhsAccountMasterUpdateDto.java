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
public class GhsAccountMasterUpdateDto {

	private Integer accountNo;

	private BigDecimal redemptionAmount;

	private Boolean isNewCn;

	private Date businessDate;

	private Integer maturedDocNo;

	private String maturedDocType;

	private BigDecimal ghsBonus;

	private Integer cnDocNo;

	private Integer fiscalYear;

}
