/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.store.dao.CustomerTownDao;
import com.titan.poss.store.dao.CustomerTownId;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerTownSyncDto extends MasterSyncableEntity {

	private CustomerTownId customerTownId;

	private String stateCode;

	private String description;

	public CustomerTownSyncDto() {

	}

	public CustomerTownSyncDto(CustomerTownDao customerDao) {
		MapperUtil.getObjectMapping(customerDao, this);
		CustomerTownId cstomerTownId = new CustomerTownId();
		cstomerTownId.setLocationCode(customerDao.getCustomerTownId().getLocationCode());
		cstomerTownId.setTownCode(customerDao.getCustomerTownId().getTownCode());
		this.setCustomerTownId(cstomerTownId);
	}

	public CustomerTownDao getCustomerTownDao(CustomerTownSyncDto customerTownSyncDto) {
		CustomerTownDao cstomerTownDao = new CustomerTownDao();
		cstomerTownDao = (CustomerTownDao) MapperUtil.getObjectMapping(customerTownSyncDto, cstomerTownDao);
		CustomerTownId cstomerTownId = new CustomerTownId();
		cstomerTownId.setLocationCode(customerTownSyncDto.getCustomerTownId().getLocationCode());
		cstomerTownId.setTownCode(customerTownSyncDto.getCustomerTownId().getTownCode());
		cstomerTownDao.setCustomerTownId(cstomerTownId);
		return cstomerTownDao;
	}

}
