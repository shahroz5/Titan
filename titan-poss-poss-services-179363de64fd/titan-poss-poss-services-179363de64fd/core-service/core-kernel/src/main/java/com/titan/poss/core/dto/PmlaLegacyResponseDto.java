package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PmlaLegacyResponseDto {

	private String ulpMembershipID;
	
	private String businessDate;
	
	private String customerMobileNo;
	
	private Short fiscalYear;
	
	private BigDecimal totalTransactedAmount;
}
