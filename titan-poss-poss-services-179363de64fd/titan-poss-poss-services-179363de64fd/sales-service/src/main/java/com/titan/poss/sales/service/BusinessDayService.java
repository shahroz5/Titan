/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.GhsOfflineEODRequestDto;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.sales.dao.BusinessDayDaoExt;
import com.titan.poss.sales.dto.response.DayMasterDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface BusinessDayService {

	/**
	 * This method will perform the EOD (End of the day) activity.
	 *
	 * @param eodRequest
	 */
	DayMasterDto performEODActivity(BusinessDateDto eodRequest);

	/**
	 * This method will perform the BOD (Beginning of the day) activity.
	 * 
	 * @param businessDateDto
	 */
	DayMasterDto performBODActivity(BusinessDateDto businessDateDto);

	/**
	 * This method will be called to get the business day for which BOD needs to be
	 * done. If there are any pending EOD in the System this API will throw error.
	 */
	DayMasterDto getBodBusinessDay();

	/**
	 * This method will be called to get the business day for which EOD needs to be
	 * done. If there are any pending BOD in the System this API will throw error.
	 */
	DayMasterDto getEodBusinessDay();

	/**
	 * This method will be called to get the business day.
	 */
	BusinessDayDto getBusinessDay();

	/**
	 * This method will perform the BOD (Beginning of the day) activity for GHS.
	 * 
	 * @param businessDateDto
	 */
	DayMasterDto performGHSBODActivity(BusinessDateDto businessDateDto);

	/**
	 * This method will perform the EOD (End of the day) activity GHS.
	 * 
	 * @param eodRequest
	 */
	DayMasterDto performGHSEODActivity(BusinessDateDto eodRequest);

	/**
	 * 
	 * @param businessDate
	 * @return BusinessDateDto
	 */
	BooleanResponse performRevenueCollection(BusinessDateDto businessDate);

	/**
	 * 
	 * @param businessDate
	 * @return BusinessDateDto
	 */
	BooleanResponse performGHSRevenueCollection(BusinessDateDto businessDate);

	/**
	 * 
	 * @param ghsOfflineEOD
	 * @return
	 */
	BooleanResponse performOfflineGHSRevenueCollection(GhsOfflineEODRequestDto ghsOfflineEOD);

	/**
	 * Get Business day in progress.
	 * 
	 * @param locationCode
	 * @return BusinessDayDaoExt
	 */
	BusinessDayDaoExt getBusinessDayInProgress(String locationCode);

	/**
	 * @return
	 */
	DayMasterDto startEodActivity();

	/**
	 * @return
	 */
	DayMasterDto startBodActivity();
	
	/**
	 * 
	 * @param businessDate
	 * @return BusinessDateDto
	 */
	BooleanResponse performServiceRevenueCollection(BusinessDateDto businessDate);

}
