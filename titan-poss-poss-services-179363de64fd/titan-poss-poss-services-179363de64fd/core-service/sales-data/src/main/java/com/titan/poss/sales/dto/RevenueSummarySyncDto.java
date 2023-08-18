/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.util.Date;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.BusinessDayDao;
import com.titan.poss.sales.dao.RevenueSummaryDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class RevenueSummarySyncDto extends SyncableEntity {

	private String id;

	private String businessDayDao;

	private String locationCode;

	private Date businessDate;

	private String revenueDetails;

	private String depositDetails;

	private String ghsRevenueDetails;
	
	private String serviceRevenueDetails;

	public RevenueSummaryDao getRevenueSummaryDao(RevenueSummarySyncDto syncDto) {
		RevenueSummaryDao doa = (RevenueSummaryDao) MapperUtil.getObjectMapping(syncDto, new RevenueSummaryDao());
		BusinessDayDao businessDay = new BusinessDayDao();
		businessDay.setId(syncDto.getBusinessDayDao());
		doa.setBusinessDayDao(businessDay);
		return doa;
	}
}
