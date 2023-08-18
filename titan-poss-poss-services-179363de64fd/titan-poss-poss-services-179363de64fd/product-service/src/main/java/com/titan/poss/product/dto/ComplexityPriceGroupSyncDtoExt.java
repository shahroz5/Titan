/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ComplexityPriceGroupDaoExt;
import com.titan.poss.product.sync.dto.ComplexityPriceGroupSyncDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ComplexityPriceGroupSyncDtoExt extends ComplexityPriceGroupSyncDto{

public ComplexityPriceGroupSyncDtoExt() {
		
	}
	public ComplexityPriceGroupSyncDtoExt(ComplexityPriceGroupDaoExt complexityPriceGroupGroupSyncDto) {
		MapperUtil.getObjectMapping(complexityPriceGroupGroupSyncDto, this);
		this.setPriceGroup(complexityPriceGroupGroupSyncDto.getPriceGroup().getPriceGroup());
		this.setComplexityCode(complexityPriceGroupGroupSyncDto.getComplexity().getComplexityCode());
	}
	
	public List<ComplexityPriceGroupSyncDtoExt> getSyncDtoExtList(List<ComplexityPriceGroupDaoExt> complexityPriceGroupDaoExt) {
		List<ComplexityPriceGroupSyncDtoExt> dtoList = new ArrayList<>();
		complexityPriceGroupDaoExt.forEach(complexityPriceGroup -> {
			ComplexityPriceGroupSyncDtoExt syncDto = new ComplexityPriceGroupSyncDtoExt(complexityPriceGroup);
			dtoList.add(syncDto);
		});
		
		return dtoList;
	}
}
