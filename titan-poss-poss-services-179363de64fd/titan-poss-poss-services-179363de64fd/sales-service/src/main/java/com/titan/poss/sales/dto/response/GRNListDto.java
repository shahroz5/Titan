/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
public class GRNListDto {

	Integer docNo;
	Integer refDocNo;
	String locationCode;
	String refLocationCode;

	BigDecimal totalValue;

	@NotNull
	Short fiscalYear;

	String mobileNumber;
	Date docDate;
	String customerName;
	String status;
}
