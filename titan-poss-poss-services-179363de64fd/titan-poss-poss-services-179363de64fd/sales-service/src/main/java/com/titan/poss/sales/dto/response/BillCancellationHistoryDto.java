package com.titan.poss.sales.dto.response;
/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
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
public class BillCancellationHistoryDto {

	private Integer docNo;
	private String cmId;
	private Date docDate;
	private Short fiscalYear;
	private String customerName;
	private BigDecimal netAmount;
	private String createdBy;
	private Date createdDate;
	private String cancelReason;
	private String cancellationType;
	private String txnType;
	private String subTxnType;
}
