/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CashMemoDetailsDto {
	
	private CMVariantDto cmVariantDetail;
	
	@JsonProperty("lotNumberMaster")
	private LotNumberMasterDto lotNumberMaster;
	
	@JsonProperty("lotNumberDetail")
	private List<LotNumberDetailsDto> lotNumberDetailsList;
	
	@JsonProperty("multimetalDetail")
	private List<MultiMetalDetailsDto> multiMetalDetailsList;
	
	@JsonProperty("itemMaster")
	private List<ItemMasterLegacyDto> itemMasterList;
	
	@JsonProperty("itemStoneMapping")
	private List<ItemStoneMappingDto> itemStoneMappingList;
	
	
	
	

}
