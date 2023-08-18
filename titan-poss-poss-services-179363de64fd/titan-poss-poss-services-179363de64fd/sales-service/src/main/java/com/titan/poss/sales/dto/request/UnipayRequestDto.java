/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * DTO Unipay request DTO for third party.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class UnipayRequestDto {

	private Integer txnType;
	private Integer txnMode;
	private String txnId;
	private BigDecimal amount;
	private Date date;

}
