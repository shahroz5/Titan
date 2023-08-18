package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class TepCashRefundLimitResponseDto {

	private BigDecimal cashLimit;
	private Boolean isCashPaymentAllowed;
	private BigDecimal totalTxnAmt;
	
}
