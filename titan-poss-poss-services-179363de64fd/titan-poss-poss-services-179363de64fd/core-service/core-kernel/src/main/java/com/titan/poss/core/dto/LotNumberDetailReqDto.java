package com.titan.poss.core.dto;

import java.util.List;

import lombok.Data;

@Data
public class LotNumberDetailReqDto {

	private List<LotNumberDetailsDto> lotDetails;
	private List<MultiMetalDetailsDto> multiMetalDetailsList; 
	private List<ItemStoneMappingDto> itemStoneMappingList;
	
}
