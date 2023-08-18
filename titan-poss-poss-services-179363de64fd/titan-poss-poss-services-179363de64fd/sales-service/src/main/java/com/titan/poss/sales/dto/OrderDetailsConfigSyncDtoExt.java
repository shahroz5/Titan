/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.OrderDetailsConfigDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class OrderDetailsConfigSyncDtoExt extends OrderDetailsConfigSyncDto {

	public OrderDetailsConfigSyncDtoExt() {

	}

	public OrderDetailsConfigSyncDtoExt(OrderDetailsConfigDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		if (daoExt.getOrderItem() != null)
			this.setOrderItem(daoExt.getOrderItem().getId());
	}

}
