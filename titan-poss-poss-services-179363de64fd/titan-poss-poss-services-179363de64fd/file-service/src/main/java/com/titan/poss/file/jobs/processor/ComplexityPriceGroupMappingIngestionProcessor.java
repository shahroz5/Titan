/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.ComplexityPriceGroupConfigWriterDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class ComplexityPriceGroupMappingIngestionProcessor implements ItemProcessor<ComplexityPriceGroupConfigWriterDto, ComplexityPriceGroupConfigWriterDto> {

	@Override
	public ComplexityPriceGroupConfigWriterDto process(ComplexityPriceGroupConfigWriterDto item) throws Exception {
		item.setId(item.getId());
		item.setComplexityCode(item.getComplexityCode());
		item.setPriceGroup(item.getPriceGroup());
		item.setMakingChargePunit(item.getMakingChargePunit());
		item.setMakingChargePgram(item.getMakingChargePgram());
		item.setWastagePct(item.getWastagePct());
		item.setMakingChargePct(item.getMakingChargePct());
		item.setIsActive(item.getIsActive());
		item.setCreatedBy(item.getCreatedBy());
		item.setCreatedDate(item.getCreatedDate());
		item.setLastModifiedBy(item.getLastModifiedBy());
		item.setLastModifiedDate(item.getLastModifiedDate());
		item.setSrcSyncId(item.getSrcSyncId());
		item.setDestSyncId(item.getDestSyncId());
		return item;
	}

}
