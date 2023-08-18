/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

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
public class GepPurityScemeValidationRequest {

	private String gepConfigDetailsId;

	private Date businessDate;
	
	private String gepConfigId;

	private String txnType;

	private BigDecimal gepPurity;

	private List<GepPurityItemsDto> itemDetails;

}
