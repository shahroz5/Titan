/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.dto.response;

import java.math.BigDecimal;
import java.util.List;

import com.titan.poss.core.dto.ItemLotStoneBaseDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ItemLotStoneListDto {

	List<ItemLotStoneBaseDto> lotStoneDetails;
	
	private BigDecimal lowestStoneWeight;

}
