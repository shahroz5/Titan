/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.print;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ReturnDto {

	private String id;
	private Integer docNo;
	private Short fiscalYear;
	private Date docDate;
	private String docDateStr;
	private BigDecimal totalValue;
	private String remarks;
	private Integer customerId;
	private String salesTxnId;
	private String locationCode;
}
