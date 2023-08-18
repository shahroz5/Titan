/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.GepConfigExcludeMappingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class GepConfigExcludeMappingIngestionProcessor implements ItemProcessor<GepConfigExcludeMappingDto, GepConfigExcludeMappingDto> {

	@Override
	public GepConfigExcludeMappingDto process(GepConfigExcludeMappingDto item) throws Exception {
		item.setId(item.getId());
		item.setConfigId(item.getConfigId());
		item.setItemCode(item.getItemCode());
		item.setThemeCode(null);
		item.setIsExcluded(item.getIsExcluded());
		item.setCreatedBy(item.getCreatedBy());
		item.setCreatedDate(item.getCreatedDate());
		item.setLastModifiedBy(item.getLastModifiedBy());
		item.setLastModifiedDate(item.getLastModifiedDate());
		item.setSrcSyncId(0);
		item.setDestSyncId(0);
		return item;
	}

}
