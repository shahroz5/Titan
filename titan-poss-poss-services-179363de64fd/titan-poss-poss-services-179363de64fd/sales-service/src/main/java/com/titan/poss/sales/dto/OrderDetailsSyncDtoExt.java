/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class OrderDetailsSyncDtoExt extends OrderDetailsSyncDto {
	public OrderDetailsSyncDtoExt() {

	}

	public OrderDetailsSyncDtoExt(OrderDetailsDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		this.setOrder(daoExt.getOrder().getId());
	}
	
	public List<OrderDetailsSyncDtoExt> getSyncDtoExtList(List<OrderDetailsDaoExt> daoExtList) {
		List<OrderDetailsSyncDtoExt> dtoExtList = new ArrayList<>();
		for (OrderDetailsDaoExt daoExt : daoExtList) {
			OrderDetailsSyncDtoExt dtoExt = new OrderDetailsSyncDtoExt(daoExt);
			dtoExtList.add(dtoExt);
		}
		return dtoExtList;
	}
	
}
