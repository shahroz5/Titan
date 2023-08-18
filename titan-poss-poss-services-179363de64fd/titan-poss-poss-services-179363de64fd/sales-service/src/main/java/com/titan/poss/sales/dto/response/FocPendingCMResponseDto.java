/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for cash memo with foc pending
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FocPendingCMResponseDto {

	private String id;

	private Integer docNo;

	private Short fiscalYear;

	private Integer customerId;

	private Date docDate;

	private BigDecimal finalValue;

}
