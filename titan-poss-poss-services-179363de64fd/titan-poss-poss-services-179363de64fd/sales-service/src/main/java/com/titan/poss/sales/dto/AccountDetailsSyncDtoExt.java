/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.AccountDetailsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class AccountDetailsSyncDtoExt extends AccountDetailsSyncDto {

	public AccountDetailsSyncDtoExt() {

	}

	public AccountDetailsSyncDtoExt(AccountDetailsDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		if (daoExt.getCustomerLocationMap() != null) {
			this.setCustomerId(daoExt.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId());
			this.setLocationCode(daoExt.getCustomerLocationMap().getCustomerLocationMappingId().getLocationCode());
		}
	}

}
