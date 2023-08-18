package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class PaymentDetailsForUnipayDto {
	String paymentId;
	BigDecimal amount;
}
