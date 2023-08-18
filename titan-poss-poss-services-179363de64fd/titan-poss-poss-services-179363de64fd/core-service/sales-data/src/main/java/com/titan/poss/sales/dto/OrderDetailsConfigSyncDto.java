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
import com.titan.poss.sales.dao.OrderDetailsConfigDao;
import com.titan.poss.sales.dao.OrderDetailsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class to sync <b>sales_order_details_config</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class OrderDetailsConfigSyncDto extends SyncableEntity {

	private String pricingType;

	private BigDecimal priceFactor;

	private BigDecimal makingChargeMarkupFactor;

	private String makingChargeMarginDetails;

	private BigDecimal marketUcpMarkupFactor;

	private String id;

	private String orderItem;

	public OrderDetailsConfigDao getOrderDetailsConfigDao(OrderDetailsConfigSyncDto syncDto) {
		OrderDetailsConfigDao dao = (OrderDetailsConfigDao) MapperUtil.getObjectMapping(syncDto,
				new OrderDetailsConfigDao());

		OrderDetailsDao orderItemDao = null;
		if (syncDto.getOrderItem() != null) {
			orderItemDao = new OrderDetailsDao();
			orderItemDao.setId(syncDto.getOrderItem());
		}

		dao.setOrderItem(orderItemDao);
		return dao;
	}

	public List<OrderDetailsConfigDao> getOrderDetailsConfigDaoList(List<OrderDetailsConfigSyncDto> synList) {
		List<OrderDetailsConfigDao> daoList = new ArrayList<>();
		synList.forEach(sync -> daoList.add(getOrderDetailsConfigDao(sync)));
		return daoList;
	}

}
