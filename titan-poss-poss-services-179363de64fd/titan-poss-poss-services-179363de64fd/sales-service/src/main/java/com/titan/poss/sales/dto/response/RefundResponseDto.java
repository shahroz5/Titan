/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class RefundResponseDto extends BaseRefundDto {

	private Object headerData;
	private Object approvedData;
	private Integer docNo;
	private Date docDate;
	private String remarks;
	private String requestorName;
	private String subTxnType;
	private String employeeCode;
}
