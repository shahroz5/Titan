/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.Min;

import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.GepConfigDetailsDaoExt;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditNoteIndvCreateDto {

	private String creditNoteType;
	@Min(value = 0, message = "minCN amount should be greater than 0")
	private BigDecimal amount;
	private String remarks;

	private CreditNoteDaoExt parentCn;
	private CreditNoteDaoExt originalCn;
	private String frozenRateDetails;
	private Boolean isFrozenRateCnToBeClosed;
	private String eghsDetails;
	private BigDecimal cashCollected;

	private JsonData paymentDetails;
	private JsonData grnDetails;
	private JsonData grnFocDetails;
	private JsonData discountDetails; // DTO for 'data' field is - CreditNoteDiscountDetailsDto

	private GepConfigDetailsDaoExt gepConfigDetailsDao;
	private Date originalDocDate;// used only on CN redemption(in CN service)
	private Boolean isUnipay;

    private BigDecimal refundValue;
    
	public CreditNoteIndvCreateDto(BigDecimal amount, BigDecimal cashCollected) {
		this.amount = amount;
		this.cashCollected = cashCollected;
	}

	public CreditNoteIndvCreateDto(BigDecimal amount, BigDecimal cashCollected,JsonData paymentDetails) {
		this.amount = amount;
		this.cashCollected = cashCollected;
		this.paymentDetails = paymentDetails;
	}
}
