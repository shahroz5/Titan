/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountDetailsDao;
import com.titan.poss.config.dao.DiscountProductGroupMappingDao;
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
public class DiscountProductGroupMappingSyncDto extends MasterSyncableEntity {

	private String id;

	private String discount;

	private String discountDetail;

	private String productGroupCode;

	private BigDecimal eligibleKarat;

	private String karatType;

	private String productType;

	public DiscountProductGroupMappingDao getDiscountPgrpMappingDao(DiscountProductGroupMappingSyncDto syncDto) {
		DiscountProductGroupMappingDao discountPgrpMapping = new DiscountProductGroupMappingDao();
		discountPgrpMapping = (DiscountProductGroupMappingDao) MapperUtil.getObjectMapping(syncDto,
				discountPgrpMapping);

		DiscountDao discountDao = new DiscountDao();
		discountDao.setId(syncDto.getDiscount());

		discountPgrpMapping.setDiscount(discountDao);

		if (syncDto.getDiscountDetail() != null) {
			DiscountDetailsDao discountDetailsDao = new DiscountDetailsDao();
			discountDetailsDao.setId(syncDto.getDiscountDetail());
			discountPgrpMapping.setDiscountDetail(discountDetailsDao);
		} else {
			discountPgrpMapping.setDiscountDetail(null);
		}

		return discountPgrpMapping;
	}

	public List<DiscountProductGroupMappingDao> getDaoList(List<DiscountProductGroupMappingSyncDto> syncDtoList) {
		List<DiscountProductGroupMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			DiscountProductGroupMappingSyncDto dto = new DiscountProductGroupMappingSyncDto();
			daoList.add(dto.getDiscountPgrpMappingDao(syncDto));
		});

		return daoList;
	}
}
