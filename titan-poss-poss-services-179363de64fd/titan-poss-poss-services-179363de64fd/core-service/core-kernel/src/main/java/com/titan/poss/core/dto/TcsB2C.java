package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TcsB2C {
	private Boolean tcsBasedOnUlpNumber;
	private Boolean tcsBasedOnMobileNumber;
	private List<ApplicableTcsRates> tcsApplicableRates;
	private BigDecimal tcsApplicableAmount;
	private GrnConfig grnConfig;

}
