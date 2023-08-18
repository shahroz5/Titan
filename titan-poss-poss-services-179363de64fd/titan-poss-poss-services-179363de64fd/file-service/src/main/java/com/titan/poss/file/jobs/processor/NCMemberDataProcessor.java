/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.NcMemberDataStageDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class NCMemberDataProcessor implements ItemProcessor<NcMemberDataStageDto, NcMemberDataStageDto>{

	@Override
	public NcMemberDataStageDto process(NcMemberDataStageDto item) throws Exception {
		
		return item;
	}
}
