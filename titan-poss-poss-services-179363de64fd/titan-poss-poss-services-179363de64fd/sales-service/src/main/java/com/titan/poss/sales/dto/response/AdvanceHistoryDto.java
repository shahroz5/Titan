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
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdvanceHistoryDto {

	private String id;
	private Integer docNo;
	private Short fiscalYear;
	private String customerName;
	private Date docDate;
	private BigDecimal netAmount;
	private Integer cnDocNo;
	private String eghsPayment;
	private String frozenGoldWeight;
	private String createdBy;
	private Date createdDate;
}
