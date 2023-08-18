/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.LinkingDiscountsDao;
import com.titan.poss.core.dao.SyncableEntity;
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
public class LinkingDiscountsSyncDto extends SyncableEntity {

	private String id;

	private String srcDiscountId;

	private String destDiscountId;

	public LinkingDiscountsDao getLinkingDiscountsDao(LinkingDiscountsSyncDto syncDto) {
		LinkingDiscountsDao linkingDiscountsDao = new LinkingDiscountsDao();
		linkingDiscountsDao = (LinkingDiscountsDao) MapperUtil.getObjectMapping(syncDto, linkingDiscountsDao);

		if (syncDto.getSrcDiscountId() != null) {
			DiscountDao srcDiscount = new DiscountDao();
			srcDiscount.setId(syncDto.getSrcDiscountId());

			linkingDiscountsDao.setSrcDiscountId(srcDiscount);
		} else {
			linkingDiscountsDao.setSrcDiscountId(null);
		}
		if (syncDto.getDestDiscountId() != null) {
			DiscountDao destDiscount = new DiscountDao();
			destDiscount.setId(syncDto.getDestDiscountId());

			linkingDiscountsDao.setDestDiscountId(destDiscount);
		} else {
			linkingDiscountsDao.setDestDiscountId(null);
		}

		return linkingDiscountsDao;
	}

	public List<LinkingDiscountsDao> getDaoList(List<LinkingDiscountsSyncDto> syncDtoList) {

		List<LinkingDiscountsDao> daolist = new ArrayList<>();
		syncDtoList.forEach(sync -> {
			LinkingDiscountsSyncDto syncDto = new LinkingDiscountsSyncDto();
			daolist.add(syncDto.getLinkingDiscountsDao(sync));
		});
		return daolist;
	}
}
