/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.sales.dao.BusinessDayDao;
import com.titan.poss.sales.dao.BusinessDayDaoExt;
import com.titan.poss.sales.dto.PendingDayActivityDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class BusinessDayUtil {
	
	private BusinessDayUtil() {
		
	}
	

	public static final String BOD_BUSINESS_DAY = "No Business Day is Open Please Do BOD";

	public static final String EOD_BUSINESS_DAY = "No EOD is present for this location";
	
	public static final String ERR_SALE_113 = "ERR-SALE-113";

	public static BusinessDayDto getBusinessDays(List<BusinessDayDao> businessDayDaoList) {

		BusinessDayDto businessDate = new BusinessDayDto();

		if (businessDayDaoList.size() > 1) {
			getPendingDayActivityDetail(businessDayDaoList, BOD_BUSINESS_DAY);
		} else if (businessDayDaoList.isEmpty()) {
			throw new ServiceException(BOD_BUSINESS_DAY, ERR_SALE_113);
		}

		businessDate.setBusinessDate(businessDayDaoList.get(0).getBusinessDate());
		businessDate.setFiscalYear(businessDayDaoList.get(0).getFiscalYear());

		return businessDate;
	}

	public static BusinessDayDto getBusinessDayAfterEod(BusinessDayDao businessDayDao) {

		BusinessDayDto businessDate = new BusinessDayDto();

		if (businessDayDao == null) {
			getPendingDayActivityDetail(Arrays.asList(businessDayDao), EOD_BUSINESS_DAY);
			throw new ServiceException(BOD_BUSINESS_DAY, ERR_SALE_113);
		} else {
			businessDate.setBusinessDate(businessDayDao.getBusinessDate());
			businessDate.setFiscalYear(businessDayDao.getFiscalYear());
		}
		return businessDate;
	}

	/**
	 * This method will give the error response for pending day activity.
	 * 
	 * @param businessDayDaoList
	 * @param errorMessage
	 */
	public static void getPendingDayActivityDetail(List<BusinessDayDao> businessDayDaoList, String errorMessage) {

		List<PendingDayActivityDto> pendingDayActivityDto = new ArrayList<>();
		businessDayDaoList.forEach(businessDayDao -> {
			PendingDayActivityDto pendingDayActivity = new PendingDayActivityDto();
			pendingDayActivity.setBusinessDate(businessDayDao.getBusinessDate());
			pendingDayActivity.setStatus(businessDayDao.getStatus());
			pendingDayActivity.setErrorMessage(errorMessage);
			pendingDayActivityDto.add(pendingDayActivity);
		});

		throw new ServiceException("No Business Day is Open", "ERR-SALE-116", pendingDayActivityDto);
	}

	public static BusinessDayDto getBusinessDay(List<BusinessDayDaoExt> businessDayDaoList) {

		BusinessDayDto businessDate = new BusinessDayDto();

		if (businessDayDaoList.size() > 1) {
			getPendingDayActivityDetails(businessDayDaoList, BOD_BUSINESS_DAY);
		} else if (businessDayDaoList.isEmpty()) {
			throw new ServiceException(BOD_BUSINESS_DAY, ERR_SALE_113);
		}

		businessDate.setBusinessDate(businessDayDaoList.get(0).getBusinessDate());
		businessDate.setFiscalYear(businessDayDaoList.get(0).getFiscalYear());

		return businessDate;
	}

	/**
	 * This method will give the error response for pending day activity.
	 * 
	 * @param businessDayDaoList
	 * @param errorMessage
	 */
	public static void getPendingDayActivityDetails(List<BusinessDayDaoExt> businessDayDaoList, String errorMessage) {

		List<PendingDayActivityDto> pendingDayActivityDto = new ArrayList<>();
		businessDayDaoList.forEach(businessDayDao -> {
			PendingDayActivityDto pendingDayActivity = new PendingDayActivityDto();
			pendingDayActivity.setBusinessDate(businessDayDao.getBusinessDate());
			pendingDayActivity.setStatus(businessDayDao.getStatus());
			pendingDayActivity.setErrorMessage(errorMessage);
			pendingDayActivityDto.add(pendingDayActivity);
		});

		//change the error message
		throw new ServiceException(errorMessage, "ERR-SALE-116", pendingDayActivityDto);
	}

}
