/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.DiscountLocationMappingDaoExt;
import com.titan.poss.core.utils.MapperUtil;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class DiscountLocationMappingSyncDtoExt extends DiscountLocationMappingSyncDto {

	public DiscountLocationMappingSyncDtoExt() {

	}

	public DiscountLocationMappingSyncDtoExt(DiscountLocationMappingDaoExt discountLocationMappingDaoExt) {
		MapperUtil.getObjectMapping(discountLocationMappingDaoExt, this);
		this.setDiscount(discountLocationMappingDaoExt.getDiscount().getId());
	}

	public List<DiscountLocationMappingSyncDtoExt> getSyncDtoExtList(
			List<DiscountLocationMappingDaoExt> discountLocationMappingList) {
		List<DiscountLocationMappingSyncDtoExt> dtoList = new ArrayList<>();
		discountLocationMappingList.forEach(discountLocationMapping -> {
			DiscountLocationMappingSyncDtoExt syncDto = new DiscountLocationMappingSyncDtoExt(discountLocationMapping);
			dtoList.add(syncDto);
		});

		return dtoList;
	}
}
