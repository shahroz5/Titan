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
public class GrnHistoryResponse {
	
	private Integer docNo;
	private Integer cnDocNo;
	private String creditNoteType;
	private String srcLocationCode;
	private Short fiscalYear;
	private String customerName;
	private BigDecimal netAmount;
	private String status;
	private String createdBy;
	private Date createdDate;
	private String id;
	private Date docDate;

}
