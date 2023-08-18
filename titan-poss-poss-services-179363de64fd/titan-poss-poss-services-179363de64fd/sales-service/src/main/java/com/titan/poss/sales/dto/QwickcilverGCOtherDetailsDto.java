/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.sales.dto.validators.BasePaymentFieldsDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for QCGC other details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class QwickcilverGCOtherDetailsDto extends BasePaymentFieldsDto {

	private Date cardExpiryDate;
	private String approvalCode;
	private String transactionId;
	private String cardName;
	private BigDecimal billAmount;
	private Integer creditNoteNo;
	private Integer qcgcOwnerId;
}
