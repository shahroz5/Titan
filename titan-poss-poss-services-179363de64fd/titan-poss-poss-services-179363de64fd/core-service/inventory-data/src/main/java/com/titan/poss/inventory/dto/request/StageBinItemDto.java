package com.titan.poss.inventory.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

@Data
public class StageBinItemDto {

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX)
	private String itemCode;
	
	@PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX)
	private String lotNumber;
	
	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String inventoryId;

	@PatternCheck(regexp = RegExConstants.BIN_REGEX, nullCheck = true)
	private String binCode;

	@PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX)
	private String binGroupCode;
	
	private Short quantity;
	
	private String defectTypeDesc;
	
	private String defectCodeDesc;
}
