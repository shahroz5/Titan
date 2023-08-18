/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerLocationMappingSyncDto extends SyncableEntity{
	
	private CustomerLocationMappingIdDao customerLocationMappingId;

	
	private String customer;
	
	public CustomerLocationMappingSyncDto() {
		
	}
	public CustomerLocationMappingSyncDto(CustomerLocationMappingDao dao) {
		MapperUtil.getObjectMapping(dao,this);
		CustomerLocationMappingIdDao idDao=new CustomerLocationMappingIdDao();
		idDao.setCustomerId(dao.getCustomerLocationMappingId().getCustomerId());
		idDao.setLocationCode(dao.getCustomerLocationMappingId().getLocationCode());
		this.setCustomer(dao.getCustomer().getId());
		this.setCustomerLocationMappingId(idDao);
	}
	
	public CustomerLocationMappingDao getCustomerLocationMappingDao(CustomerLocationMappingSyncDto syncDto) {
		CustomerLocationMappingDao dao=(CustomerLocationMappingDao)MapperUtil.getObjectMapping(syncDto,new CustomerLocationMappingDao());
		CustomerLocationMappingIdDao idDao=new CustomerLocationMappingIdDao();
		idDao.setCustomerId(syncDto.getCustomerLocationMappingId().getCustomerId());
		idDao.setLocationCode(syncDto.getCustomerLocationMappingId().getLocationCode());
		dao.setCustomerLocationMappingId(idDao);
		CustomerDao custDao=new CustomerDao();
		custDao.setId(syncDto.getCustomer());
		dao.setCustomer(custDao);
		return dao;
	}
}
