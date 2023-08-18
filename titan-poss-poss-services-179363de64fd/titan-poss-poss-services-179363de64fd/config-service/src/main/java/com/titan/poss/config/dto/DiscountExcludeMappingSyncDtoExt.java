/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.DiscountExcludeMappingDaoExt;
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
public class DiscountExcludeMappingSyncDtoExt extends DiscountExcludeMappingSyncDto {

	public DiscountExcludeMappingSyncDtoExt() {

	}

	public DiscountExcludeMappingSyncDtoExt(DiscountExcludeMappingDaoExt discountExcludeMapping) {

		MapperUtil.getObjectMapping(discountExcludeMapping, this);

		if (discountExcludeMapping.getDiscount() != null) {
			this.setDiscount(discountExcludeMapping.getDiscount().getId());
		} else {
			this.setDiscount(null);
		}
	}

	public List<DiscountExcludeMappingSyncDtoExt> getSyncDtoExts(List<DiscountExcludeMappingDaoExt> daoExts) {
		List<DiscountExcludeMappingSyncDtoExt> syncDtoExts = new ArrayList<>();
		daoExts.forEach(dao -> {
			DiscountExcludeMappingSyncDtoExt dtoExt = new DiscountExcludeMappingSyncDtoExt(dao);
			syncDtoExts.add(dtoExt);
		});
		return syncDtoExts;

	}

}
