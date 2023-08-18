/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountProductCategoryMappingDao;
import com.titan.poss.core.dao.MasterSyncableEntity;
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
public class DiscountProductCategorySyncDto extends MasterSyncableEntity {

	private String id;

	private String discount;

	private String productCategoryCode;

	public DiscountProductCategoryMappingDao getDiscountPrdCategoryDao(
			DiscountProductCategorySyncDto discountPrdCategorySyncDto) {
		DiscountProductCategoryMappingDao discountProductCategory = new DiscountProductCategoryMappingDao();
		discountProductCategory = (DiscountProductCategoryMappingDao) MapperUtil
				.getObjectMapping(discountPrdCategorySyncDto, discountProductCategory);

		if (discountPrdCategorySyncDto.getDiscount() != null) {
			DiscountDao discountDao1 = new DiscountDao();
			discountDao1.setId(discountPrdCategorySyncDto.getDiscount());

			discountProductCategory.setDiscount(discountDao1);
		} else {
			discountProductCategory.setDiscount(null);
		}
		return discountProductCategory;
	}

	public List<DiscountProductCategoryMappingDao> getDaoList(List<DiscountProductCategorySyncDto> syncDtoList) {
		List<DiscountProductCategoryMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			DiscountProductCategorySyncDto dto = new DiscountProductCategorySyncDto();
			daoList.add(dto.getDiscountPrdCategoryDao(syncDto));
		});
		return daoList;

	}
}
