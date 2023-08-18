/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.dto;

import com.titan.poss.core.dto.TepItemResponseDto;
import com.titan.poss.core.dto.TepStoneResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.engine.dto.response.ItemLotStoneListDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class TepConfigurations {
	ListResponse<TepStoneResponseDto> stoneLeveLConfig;

	TepItemResponseDto itemLevelConfig;

	// object to store available stones in EPOSS
	ItemLotStoneListDto stoneList;

}
