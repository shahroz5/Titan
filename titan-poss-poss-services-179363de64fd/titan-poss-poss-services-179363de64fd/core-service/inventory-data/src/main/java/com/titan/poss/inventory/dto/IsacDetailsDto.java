package com.titan.poss.inventory.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IsacDetailsDto {

	private Integer lineDtlCount;
	
	private String glKey;
	
	private String dcInd;
	
	private BigDecimal percentage;
	
	private BigDecimal amount;

}
