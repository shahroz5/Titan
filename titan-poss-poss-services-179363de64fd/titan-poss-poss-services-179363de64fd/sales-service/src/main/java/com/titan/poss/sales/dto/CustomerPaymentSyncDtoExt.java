/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerPaymentDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerPaymentSyncDtoExt extends CustomerPaymentSyncDto {
	public CustomerPaymentSyncDtoExt() {

	}

	public CustomerPaymentSyncDtoExt(CustomerPaymentDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		if(daoExt.getCustomer()!=null)
			this.setCustomer(daoExt.getCustomer().getId());
		if(daoExt.getCustomerLocationMap()!=null) {
			this.setLocationCode(daoExt.getCustomerLocationMap().getCustomerLocationMappingId().getLocationCode());
			this.setCustomerId(daoExt.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId());
		}
		if(daoExt.getPaymentDetailsDao()!=null) 
			this.setPaymentDetailsDao(daoExt.getPaymentDetailsDao().getId());
	}
}
