package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetailsDto {
	
	private BigDecimal amount;

	private String paymentCode;
	
	private String instrumentNo;
}
