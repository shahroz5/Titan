/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.DiscountItemMappingDaoExt;
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
public class DiscountItemMappingSyncDtoExt extends DiscountItemMappingSyncDto {

	public DiscountItemMappingSyncDtoExt() {

	}

	public DiscountItemMappingSyncDtoExt(DiscountItemMappingDaoExt discountitem) {

		MapperUtil.getObjectMapping(discountitem, this);

		if (discountitem.getDiscount() != null) {
			this.setDiscount(discountitem.getDiscount().getId());
		} else {
			this.setDiscount(null);
		}
	}

	public List<DiscountItemMappingSyncDtoExt> getSyncDtoExtList(List<DiscountItemMappingDaoExt> daoExts) {
		List<DiscountItemMappingSyncDtoExt> syncDtoExts = new ArrayList<>();
		daoExts.forEach(dao -> {
			DiscountItemMappingSyncDtoExt syncDtoExt = new DiscountItemMappingSyncDtoExt(dao);
			syncDtoExts.add(syncDtoExt);
		});
		return syncDtoExts;

	}
}
