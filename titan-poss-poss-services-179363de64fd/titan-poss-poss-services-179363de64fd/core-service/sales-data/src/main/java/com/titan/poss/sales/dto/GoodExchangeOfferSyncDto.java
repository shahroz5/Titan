/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.util.Date;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDao;
import com.titan.poss.sales.dao.GoodsExchangeOffersDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GoodExchangeOfferSyncDto extends SyncableEntity {

	private String id;

	private String goodsExchangeDetails;

	private String locationCode;

	private Date startDate;

	private Date endDate;

	private String offerDetails;

	private String customerMobileNo;

	private String exchangeConfigId;

	private String itemCode;

	public GoodsExchangeOffersDao getGoodsExchangeOffer(GoodExchangeOfferSyncDto syncDto) {
		GoodsExchangeOffersDao goodOfferDao = (GoodsExchangeOffersDao) MapperUtil.getObjectMapping(syncDto,
				new GoodsExchangeOffersDao());
		if (syncDto.getGoodsExchangeDetails() != null) {
			GoodsExchangeDetailsDao goodsDao = new GoodsExchangeDetailsDao();
			goodsDao.setId(syncDto.getGoodsExchangeDetails());
			goodOfferDao.setGoodsExchangeDetails(goodsDao);
		}
		return goodOfferDao;
	}

}
