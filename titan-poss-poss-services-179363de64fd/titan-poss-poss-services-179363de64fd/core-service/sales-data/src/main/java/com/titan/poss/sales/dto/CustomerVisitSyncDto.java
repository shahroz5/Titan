/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.Date;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerVisitDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerVisitSyncDto extends SyncableEntity {

	private String locationCode;

	private String id;

	private Date businessDate;

	private Integer walkins;

	private Integer noOfInvoice;
	
	private Integer purchaserCount;

	private Integer nonPurchaserCount;

	public CustomerVisitDao getCustomerVisitDao(CustomerVisitSyncDto syncDto) {
		return (CustomerVisitDao) MapperUtil.getObjectMapping(syncDto, new CustomerVisitDao());
	}
}
