package com.titan.poss.payment.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InstrumentNumberDto {

	private String instrumentNo;
	private Boolean isGhsVoucherEnabled;
}
