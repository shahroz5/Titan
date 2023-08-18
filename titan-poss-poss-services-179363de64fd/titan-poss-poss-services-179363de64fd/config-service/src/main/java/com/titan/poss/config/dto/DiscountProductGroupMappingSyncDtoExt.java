/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.DiscountProductGroupMappingDaoExt;
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
public class DiscountProductGroupMappingSyncDtoExt extends DiscountProductGroupMappingSyncDto {

	public DiscountProductGroupMappingSyncDtoExt() {

	}

	public DiscountProductGroupMappingSyncDtoExt(DiscountProductGroupMappingDaoExt discountProductGroupMappingDaoExt) {
		MapperUtil.getObjectMapping(discountProductGroupMappingDaoExt, this);
		this.setDiscount(discountProductGroupMappingDaoExt.getDiscount().getId());
		if (discountProductGroupMappingDaoExt.getDiscountDetail() != null) {
			this.setDiscountDetail(discountProductGroupMappingDaoExt.getDiscountDetail().getId());
		} else {
			this.setDiscountDetail(null);
		}

	}

	public List<DiscountProductGroupMappingSyncDtoExt> getSyncDtoExtList(
			List<DiscountProductGroupMappingDaoExt> discountProductGroupMappingList) {
		List<DiscountProductGroupMappingSyncDtoExt> dtoList = new ArrayList<>();
		discountProductGroupMappingList.forEach(discountProductGroupMapping -> {
			DiscountProductGroupMappingSyncDtoExt syncDto = new DiscountProductGroupMappingSyncDtoExt(
					discountProductGroupMapping);
			dtoList.add(syncDto);
		});

		return dtoList;
	}
}
