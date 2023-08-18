/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.OrderDao;
import com.titan.poss.sales.dao.OrderDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class OrderSyncDtoExt extends OrderSyncDto {
	public OrderSyncDtoExt() {

	}

	public OrderSyncDtoExt(OrderDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		this.setSalesTxn(daoExt.getSalesTxn().getId());
	}
	public OrderSyncDtoExt(OrderDao daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		this.setSalesTxn(daoExt.getSalesTxn().getId());
	}
}
