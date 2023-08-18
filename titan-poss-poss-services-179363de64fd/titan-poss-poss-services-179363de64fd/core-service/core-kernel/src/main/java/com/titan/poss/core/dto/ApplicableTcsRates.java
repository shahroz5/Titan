package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicableTcsRates {
	private String type;
	private Boolean isPanAvailable;
	private Boolean isForm60Available;
	private BigDecimal percent;

}
