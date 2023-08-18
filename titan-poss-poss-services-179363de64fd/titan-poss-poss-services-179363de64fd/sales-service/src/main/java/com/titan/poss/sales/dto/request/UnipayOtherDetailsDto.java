/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.Date;

import lombok.Data;

/**
 * DTO for Unipay audit details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class UnipayOtherDetailsDto {

	private String url;

	private Object request;

	private Object response;

	private Date requestTime;

	private Date responseTime;

	private Long totalTime;

	private Integer httpStatus;

	private Boolean transactionStatus;

	private String cardNumber;

	private String referenceNumber;

	private Integer creditNoteNo;

}
