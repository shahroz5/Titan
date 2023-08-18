package com.titan.poss.sales.dto;

import lombok.Data;

@Data
public class CashMemoDetailsResponseDto {

	private String id;
	private String locationCode;
	private Short fiscalYear;
	private Integer docNo;
	private Boolean isMigrated;
	private Short totalQuantity;
	

}
