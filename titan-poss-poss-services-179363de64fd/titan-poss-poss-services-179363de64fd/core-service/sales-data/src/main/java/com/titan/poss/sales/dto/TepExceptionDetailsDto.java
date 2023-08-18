package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class TepExceptionDetailsDto {

	private BigDecimal deductionPercent;
	
	private BigDecimal flatExchangeValue;
	
	private String customerId;
	
	private String itemCode;
	
	private String approvedBy;
		
}
