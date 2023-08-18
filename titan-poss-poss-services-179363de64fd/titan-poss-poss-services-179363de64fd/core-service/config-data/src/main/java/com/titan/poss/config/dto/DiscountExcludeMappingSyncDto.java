/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountExcludeMappingDao;
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
public class DiscountExcludeMappingSyncDto extends MasterSyncableEntity {

	private String id;

	private String discount;

	private String itemCode;

	private String themeCode;

	private String excludeType;

	private Boolean isExcluded;

	private BigDecimal fromValue;

	private BigDecimal toValue;

	private String schemeCode;

	public DiscountExcludeMappingDao getDiscountExcludeMappingDao(DiscountExcludeMappingSyncDto discountExcludeDto) {
		DiscountExcludeMappingDao discountExcludeMapping = new DiscountExcludeMappingDao();
		discountExcludeMapping = (DiscountExcludeMappingDao) MapperUtil.getObjectMapping(discountExcludeDto,
				discountExcludeMapping);

		if (discountExcludeDto.getDiscount() != null) {
			DiscountDao discountDao = new DiscountDao();
			discountDao.setId(discountExcludeDto.getDiscount());

			discountExcludeMapping.setDiscount(discountDao);
		} else {
			discountExcludeMapping.setDiscount(null);
		}
		return discountExcludeMapping;
	}

	public DiscountExcludeMappingSyncDto() {

	}

	public DiscountExcludeMappingSyncDto(DiscountExcludeMappingDao discountExcludeMapping) {

		MapperUtil.getObjectMapping(discountExcludeMapping, this);

		if (discountExcludeMapping.getDiscount() != null) {
			this.setDiscount(discountExcludeMapping.getDiscount().getId());
		} else {
			this.setDiscount(null);
		}
	}

	public List<DiscountExcludeMappingDao> getDaoList(List<DiscountExcludeMappingSyncDto> syncDtos) {
		List<DiscountExcludeMappingDao> daoList = new ArrayList<>();
		syncDtos.forEach(sync -> {
			DiscountExcludeMappingSyncDto syncDto = new DiscountExcludeMappingSyncDto();
			daoList.add(syncDto.getDiscountExcludeMappingDao(sync));
		});
		return daoList;
	}

	/**
	 * @param discountItemMappingDaoList
	 * @return
	 */
	public List<DiscountExcludeMappingSyncDto> getSyncDtos(List<DiscountExcludeMappingDao> daoExts) {
		List<DiscountExcludeMappingSyncDto> syncDtoExts = new ArrayList<>();
		daoExts.forEach(dao -> {
			DiscountExcludeMappingSyncDto syncDtoExt = new DiscountExcludeMappingSyncDto(dao);
			syncDtoExts.add(syncDtoExt);
		});
		return syncDtoExts;

	}
}
