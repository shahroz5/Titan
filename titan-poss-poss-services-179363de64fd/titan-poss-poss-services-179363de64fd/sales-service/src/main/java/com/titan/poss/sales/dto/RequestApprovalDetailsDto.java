/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.Date;

import lombok.Data;

/**
 * DTO class for details of transaction like cancellation ,activation, approval
 * details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class RequestApprovalDetailsDto {

	private String processId;

	private Date actionDate;

	private String remarks;

	private String employeeCode;

	private Integer requestDocNo;

	private Date requestedDate;

	private String requestType;

	private String approver;

}
