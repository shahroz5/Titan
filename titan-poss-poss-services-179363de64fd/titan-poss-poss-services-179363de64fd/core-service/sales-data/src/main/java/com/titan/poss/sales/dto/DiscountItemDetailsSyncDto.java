/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.DiscountDetailsDao;
import com.titan.poss.sales.dao.DiscountItemDetailsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class to sync <b>discount_item_details</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class DiscountItemDetailsSyncDto extends SyncableEntity {

	private String id;

	private String discountDetail;

	private String itemId;

	private BigDecimal discountValue;

	private BigDecimal preDiscountValue;

	private BigDecimal minPaymentPercent;

	private String discountValueDetails;

	private String productGroupCode;

	private String applicableKaratageType;

	private String itemCode;

	private String lotNumber;

	private Boolean isRivaahDiscount;

	public DiscountItemDetailsDao getDiscountItemDetailsDao(DiscountItemDetailsSyncDto discountItemDetailsSyncDto) {
		DiscountItemDetailsDao dao = (DiscountItemDetailsDao) MapperUtil.getObjectMapping(discountItemDetailsSyncDto,
				new DiscountItemDetailsDao());
		DiscountDetailsDao discountDetailsDao = new DiscountDetailsDao();
		discountDetailsDao.setId(discountItemDetailsSyncDto.getDiscountDetail());
		dao.setDiscountDetail(discountDetailsDao);

		return dao;
	}

	public List<DiscountItemDetailsDao> getDiscountItemDetailsDaoList(List<DiscountItemDetailsSyncDto> syncDtoList) {
		List<DiscountItemDetailsDao> daoList = new ArrayList<>();
		syncDtoList.forEach(sync -> daoList.add(getDiscountItemDetailsDao(sync)));
		return daoList;
	}
}
