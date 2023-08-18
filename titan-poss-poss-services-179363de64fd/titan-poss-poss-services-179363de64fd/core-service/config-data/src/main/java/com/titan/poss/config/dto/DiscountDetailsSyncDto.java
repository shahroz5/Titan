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
public class DiscountDetailsSyncDto extends MasterSyncableEntity {

	private String id;

	private String discount;

	private BigDecimal minValue;

	private BigDecimal maxValue;

	private String slabName;

	private String discountCategory;

	private String eligibility;

	private String regularConfigDetails;

	private String previewConfigDetails;

	private String abConfigDetails;

	private String coConfigDetails;

	private Integer rowId;

	private Boolean isSingle;

	private String discountPercent;

	private String configDetails;

	private String rivaahConfigDetails;

	public DiscountDetailsDao getDiscountDetailsDao(DiscountDetailsSyncDto discountDetailsSyncDto) {
		DiscountDetailsDao discountDetailsDao = new DiscountDetailsDao();
		discountDetailsDao = (DiscountDetailsDao) MapperUtil.getObjectMapping(discountDetailsSyncDto,
				discountDetailsDao);

		if (discountDetailsSyncDto.getDiscount() != null) {
			DiscountDao discountDao1 = new DiscountDao();
			discountDao1.setId(discountDetailsSyncDto.getDiscount());

			discountDetailsDao.setDiscount(discountDao1);
		} else {
			discountDetailsDao.setDiscount(null);
		}
		return discountDetailsDao;
	}

	public List<DiscountDetailsDao> getDaoList(List<DiscountDetailsSyncDto> syncDtos) {
		List<DiscountDetailsDao> daoList = new ArrayList<>();
		syncDtos.forEach(dto -> {
			DiscountDetailsSyncDto syncDto = new DiscountDetailsSyncDto();
			daoList.add(syncDto.getDiscountDetailsDao(dto));
		});
		return daoList;
	}
}
