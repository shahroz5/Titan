package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerTcsData {
	private String customerMobileNo;
	private Short fiscalYear;
	private String btqPanCard;
	private String customerPanCard;
	private String ulpMembershipID;
	private BigDecimal netAmountforFiscalyear;
}
