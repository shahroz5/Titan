package com.titan.poss.sales.dto.response;


import lombok.Data;

@Data
public class CmForCustomerResponseDto {
	
	private Integer docNo;
	private String locationCode;
	private short fiscalYear;
	private Boolean isMigrated;

}
