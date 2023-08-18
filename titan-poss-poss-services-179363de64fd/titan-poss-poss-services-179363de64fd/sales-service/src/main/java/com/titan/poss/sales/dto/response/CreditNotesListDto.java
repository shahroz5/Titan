package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CreditNotesListDto {

	private String orderNo;
	private String cnType;
	private BigDecimal amount;
}
