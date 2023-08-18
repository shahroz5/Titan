package com.titan.poss.core.dto;

import javax.validation.Valid;

import lombok.Data;

@Data
public class PMLASettings {

	private String cashAmountMaxCap;
	private Boolean l3Stores;
	private Boolean l1l2Stores;
	@Valid
	private ApplicableL1L2StoresData applicableL1L2Stores;
	@Valid
	private ApplicableL3StoresData applicableL3Stores;
	
	

}
