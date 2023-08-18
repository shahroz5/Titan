/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.DiscountProductCategoryMappingDaoExt;
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
public class DiscountProductCategorySyncDtoExt extends DiscountProductCategorySyncDto {

	public DiscountProductCategorySyncDtoExt() {

	}

	public DiscountProductCategorySyncDtoExt(DiscountProductCategoryMappingDaoExt discountPrdCategoryDaoExt) {
		MapperUtil.getObjectMapping(discountPrdCategoryDaoExt, this);
		this.setDiscount(discountPrdCategoryDaoExt.getDiscount().getId());
	}

	public List<DiscountProductCategorySyncDtoExt> getSyncDtoExtList(
			List<DiscountProductCategoryMappingDaoExt> discountPrdCategoryList) {
		List<DiscountProductCategorySyncDtoExt> dtoList = new ArrayList<>();
		discountPrdCategoryList.forEach(discountLocationMapping -> {
			DiscountProductCategorySyncDtoExt syncDto = new DiscountProductCategorySyncDtoExt(discountLocationMapping);
			dtoList.add(syncDto);
		});

		return dtoList;
	}
}
