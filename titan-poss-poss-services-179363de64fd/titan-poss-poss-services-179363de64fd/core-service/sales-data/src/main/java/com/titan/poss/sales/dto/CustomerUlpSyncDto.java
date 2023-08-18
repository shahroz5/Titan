/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerUlpDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerUlpSyncDto extends SyncableEntity{
	private String ulpId;

	private BigDecimal pointBalance;

	private String currentTier;

	private Date enrollmentDate;

	private Boolean isMemberBlocked;

	private Boolean isPulseCustomer;

	public CustomerUlpSyncDto() {
		
	}
	
	public CustomerUlpSyncDto(CustomerUlpDao ulpDao) {
		MapperUtil.getObjectMapping(ulpDao,this);
	}
	
	public CustomerUlpDao getCustomerUlp(CustomerUlpSyncDto syncDto) {
		return (CustomerUlpDao)MapperUtil.getObjectMapping(syncDto,new CustomerUlpDao());
	}
	
}
