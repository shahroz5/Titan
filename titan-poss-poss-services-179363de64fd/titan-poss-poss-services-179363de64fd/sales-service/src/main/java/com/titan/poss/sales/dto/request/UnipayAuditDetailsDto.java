/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.Date;

import lombok.Data;

/**
 * DTO for Unipay audit.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class UnipayAuditDetailsDto {

	private String id;

	private Object requestInput;

	private Object response;

	private String unipayUrl;

	private Date requestTime;

	private Date responseTime;

	private Integer totaltime;

	private Integer httpStatus;

	private Boolean transactionStatus;

	private String transactionType;

	private String cardNumber;

	private String invoiceNumber;

	private String referenceNumber;
}
