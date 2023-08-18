/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.DiscountExcludeItemMappingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class DiscountExcludeItemMappingIngestionProcessor
		implements ItemProcessor<DiscountExcludeItemMappingDto, DiscountExcludeItemMappingDto> {

	@Override
	public DiscountExcludeItemMappingDto process(DiscountExcludeItemMappingDto item) throws Exception {
		item.setId(item.getId());
		item.setDiscountId(item.getDiscountId());
		item.setItemCode(item.getItemCode());
		item.setThemeCode(null);
		item.setIsExcluded(item.getIsExcluded());
		item.setExcludeType("ITEM_CODE");
		item.setFromValue(item.getFromValue());
		item.setToValue(item.getToValue());
		item.setCreatedBy(item.getCreatedBy());
		item.setCreatedDate(item.getCreatedDate());
		item.setLastModifiedBy(item.getLastModifiedBy());
		item.setLastModifiedDate(item.getLastModifiedDate());
		item.setSrcSyncId(0);
		item.setDestSyncId(0);
		return item;
	}

}
