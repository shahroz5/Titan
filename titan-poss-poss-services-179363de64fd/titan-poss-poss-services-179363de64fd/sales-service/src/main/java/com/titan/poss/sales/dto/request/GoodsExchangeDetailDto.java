/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.List;

import com.titan.poss.core.dto.ItemLotStoneDto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GoodsExchangeDetailDto {

	private List<ItemLotStoneDto> stones;

}
