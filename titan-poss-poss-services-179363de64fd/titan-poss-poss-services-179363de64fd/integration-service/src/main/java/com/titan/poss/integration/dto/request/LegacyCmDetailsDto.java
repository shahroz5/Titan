package com.titan.poss.integration.dto.request;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class LegacyCmDetailsDto {
	
	@JsonProperty("discount")
	private BigDecimal totalDiscount;
	
	private BigDecimal billLevelDiscount;
	
	private BigDecimal ghsDiscount;
	
	private BigDecimal ghsVoucherDiscount;
	
	private BigDecimal gepExchangeDiscount;
	
	private BigDecimal digiGoldDiscount;
	
	private Boolean isUCPDiscountPercentage;
	
	private Boolean isF1DiscountPercentage;
	
	private Boolean isF2DiscountPercentage;
	
	private Boolean isTEPDiscountRecoveryAllowed;
	
	private Integer encirclePoints;

}
