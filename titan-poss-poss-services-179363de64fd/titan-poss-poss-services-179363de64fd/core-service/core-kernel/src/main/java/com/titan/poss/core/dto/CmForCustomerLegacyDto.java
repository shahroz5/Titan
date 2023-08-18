package com.titan.poss.core.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CmForCustomerLegacyDto {

	@JsonProperty("docNo")
	private Integer docNo;
	@JsonProperty("locationCode")
	private String locationCode;
	@JsonProperty("fiscalYear")
	private Short fiscalYear;
	
	private Boolean isMigrated;
}
