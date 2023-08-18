package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerCouponDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerCouponSyncDtoExt extends CustomerCouponSyncDto{

	public CustomerCouponSyncDtoExt() {
		
	}
	
    public CustomerCouponSyncDtoExt(CustomerCouponDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		if (daoExt.getCustomer() != null)
			this.setCustomer(daoExt.getCustomer().getId());
	}
}
