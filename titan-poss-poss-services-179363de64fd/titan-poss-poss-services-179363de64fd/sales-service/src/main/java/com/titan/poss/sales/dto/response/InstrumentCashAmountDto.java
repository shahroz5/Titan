/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO to get cash amount paid for the instrument(gift card).
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InstrumentCashAmountDto {

	private BigDecimal totalCashAmount;
	private Date paymentDate;
	private BigDecimal totalPaidAmount;
	private BigDecimal totalPmlaCashAmount;
    public InstrumentCashAmountDto(BigDecimal totalCashAmount, Date paymentDate, BigDecimal totalPaidAmount,
			BigDecimal totalPmlaCashAmount) {
		this.totalCashAmount = totalCashAmount;
		this.paymentDate = paymentDate;
		this.totalPaidAmount = totalPaidAmount;
		this.totalPmlaCashAmount = totalPmlaCashAmount;
	}
	private String customerIdentifier1;
    private String customerType;

}
