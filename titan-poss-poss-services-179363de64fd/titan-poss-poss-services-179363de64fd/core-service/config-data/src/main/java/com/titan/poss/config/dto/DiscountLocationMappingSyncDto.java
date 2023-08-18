/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountLocationMappingDao;
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
public class DiscountLocationMappingSyncDto extends MasterSyncableEntity {

	private String id;

	private String discount;

	private String locationCode;

	private Date offerStartDate;

	private Date offerEndDate;

	private Date previewStartDate;

	private Date previewEndDate;

	private String configDetails;

	public DiscountLocationMappingDao getDiscountLocationMappingDao(DiscountLocationMappingSyncDto syncDto) {
		DiscountLocationMappingDao discountLocMapping = new DiscountLocationMappingDao();
		discountLocMapping = (DiscountLocationMappingDao) MapperUtil.getObjectMapping(syncDto, discountLocMapping);

		DiscountDao discountDao = new DiscountDao();
		discountDao.setId(syncDto.getDiscount());

		discountLocMapping.setDiscount(discountDao);

		return discountLocMapping;
	}

	public List<DiscountLocationMappingDao> getDaoList(List<DiscountLocationMappingSyncDto> syncDtoList) {
		List<DiscountLocationMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			DiscountLocationMappingSyncDto dto = new DiscountLocationMappingSyncDto();
			daoList.add(dto.getDiscountLocationMappingDao(syncDto));
		});

		return daoList;
	}
}
