package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CashPaymentDetailsDto {
	
	private BigDecimal totalCashPaid;

	private BigDecimal totalPmlaCashAmount;
}
