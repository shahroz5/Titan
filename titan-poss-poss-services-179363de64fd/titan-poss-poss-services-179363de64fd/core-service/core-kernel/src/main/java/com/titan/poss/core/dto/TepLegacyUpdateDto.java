package com.titan.poss.core.dto;

import java.util.List;

import lombok.Data;

@Data
public class TepLegacyUpdateDto {

	List<TepUpdateItemsDto> updateTEPCM;
	
	String boutiqueCode;
	
}
