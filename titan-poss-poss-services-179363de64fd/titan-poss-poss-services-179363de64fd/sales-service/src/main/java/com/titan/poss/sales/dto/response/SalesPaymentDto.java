/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.sales.dto.PaymentCreateDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO class for payment dto.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class SalesPaymentDto extends PaymentCreateDto {

	private String id;

	private String paymentCode;

	private String paymentGroup;

	private Integer rowId;

	private String status;

	private String currencyCode;

	private Date paymentDate;

	private Date reversalDate;

	private Boolean isEditable;

	private BigDecimal cashCollected;

	private BigDecimal refundAmount;

	private String creditNoteId;

	private Boolean isTcsPayment;

	private String hostName;

	private Boolean isVoid;
	
	private String paymentDescription;
	
	private String paymentMode;
}
