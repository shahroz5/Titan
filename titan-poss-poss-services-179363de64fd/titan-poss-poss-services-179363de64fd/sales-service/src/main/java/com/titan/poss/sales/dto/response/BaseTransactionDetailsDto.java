/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Base DTO to get transactions details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BaseTransactionDetailsDto {

	private String id;
	private String transactionType;
	private Integer docNo;
	private Short fiscalYear;
	private String status;
	private String locationCode;
	private Date docDate;

}
