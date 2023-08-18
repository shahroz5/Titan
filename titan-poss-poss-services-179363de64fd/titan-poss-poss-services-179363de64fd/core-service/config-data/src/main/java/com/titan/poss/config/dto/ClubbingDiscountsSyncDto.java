/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.ClubbingDiscountsDao;
import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.core.dao.SyncTimeDao;
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
public class ClubbingDiscountsSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String discount1;

	private String discount2;

	private String discount3;

	public ClubbingDiscountsDao getClubbingDiscountsDao(ClubbingDiscountsSyncDto syncDto) {
		ClubbingDiscountsDao clubbingDiscountsDao = new ClubbingDiscountsDao();
		clubbingDiscountsDao = (ClubbingDiscountsDao) MapperUtil.getObjectMapping(syncDto, clubbingDiscountsDao);

		if (syncDto.getDiscount1() != null) {
			DiscountDao discountDao1 = new DiscountDao();
			discountDao1.setId(syncDto.getDiscount1());

			clubbingDiscountsDao.setDiscount1(discountDao1);
		} else {
			clubbingDiscountsDao.setDiscount1(null);
		}
		if (syncDto.getDiscount2() != null) {
			DiscountDao discountDao2 = new DiscountDao();
			discountDao2.setId(syncDto.getDiscount2());

			clubbingDiscountsDao.setDiscount2(discountDao2);
		} else {
			clubbingDiscountsDao.setDiscount2(null);
		}
		if (syncDto.getDiscount3() != null) {
			DiscountDao discountDao3 = new DiscountDao();
			discountDao3.setId(syncDto.getDiscount3());

			clubbingDiscountsDao.setDiscount3(discountDao3);
		} else {
			clubbingDiscountsDao.setDiscount3(null);
		}

		return clubbingDiscountsDao;
	}

	public List<ClubbingDiscountsDao> getDaoList(List<ClubbingDiscountsSyncDto> syncDtoList) {

		List<ClubbingDiscountsDao> daolist = new ArrayList<>();
		syncDtoList.forEach(sync -> {
			ClubbingDiscountsSyncDto syncDto = new ClubbingDiscountsSyncDto();
			daolist.add(syncDto.getClubbingDiscountsDao(sync));
		});
		return daolist;
	}
}
