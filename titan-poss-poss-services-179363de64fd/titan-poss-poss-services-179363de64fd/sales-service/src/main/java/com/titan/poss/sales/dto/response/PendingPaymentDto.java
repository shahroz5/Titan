/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.PaymentRequestCommonDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for payment request response.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PendingPaymentDto extends PaymentRequestCommonDto {

	private String id;

	private String status;

	private BigDecimal utilizedAmount;

	private String locationCode;

	private String requestedBy;

	private Date requestedDate;

	private Date approvedDate;

	private String approvedReason;

	private JsonData otherDetails;

	private Short fiscalYear;

	private String currencyCode;

	private Date docDate;

	private String referenceId;
	
	private String loginId;
}
