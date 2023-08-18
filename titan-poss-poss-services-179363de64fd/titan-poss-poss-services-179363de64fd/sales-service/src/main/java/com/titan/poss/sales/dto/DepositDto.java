package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
//@AllArgsConstructor
@NoArgsConstructor
public class DepositDto {
	
	private Date date;
	private String paymentCode;
	private BigDecimal depositAmount;
	public DepositDto(Date date, String paymentCode, BigDecimal depositAmount) {
		super();
		this.date = date;
		this.paymentCode = paymentCode;
		this.depositAmount = depositAmount;
	}
	
	
}
