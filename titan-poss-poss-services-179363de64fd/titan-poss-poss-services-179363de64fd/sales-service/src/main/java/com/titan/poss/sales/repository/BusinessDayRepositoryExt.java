/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.BusinessDayDaoExt;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface BusinessDayRepositoryExt extends JpaRepository<BusinessDayDaoExt, String>{

	/**
	 * To get the maximum business Date
	 * 
	 * @return Date
	 * @param locationCode
	 * @param status
	 */
	@Query("SELECT max(businessDate) FROM BusinessDayDao where locationCode =:locationCode AND status =:status")
	Date getMaximumBusinessDate(@Param("locationCode") String locationCode,@Param("status") String status);

	/**
	 * 
	 * @param businessDate
	 * @param status
	 * @param locationCode
	 * @return BusinessDayDao
	 */
	BusinessDayDaoExt findByBusinessDateAndStatusInAndLocationCode(Date businessDate, List<String> status,
			String locationCode);

	/**
	 *
	 * @param statusList
	 * @param locationCode
	 * @return List<BusinessDayDao>
	 */
	List<BusinessDayDaoExt> findByStatusInAndLocationCode(List<String> statusList, String locationCode);

	/**
	 * 
	 * @param locationCode
	 * @param businessDate
	 * @return
	 */
	BusinessDayDaoExt findByLocationCodeAndBusinessDate(String locationCode, Date businessDate);

	/**
	 * 
	 * @param status
	 * @param locationCode
	 * @param maxBusinessDate
	 * @return
	 */
	BusinessDayDaoExt findByStatusAndLocationCodeAndBusinessDate(String status, String locationCode, Date maxBusinessDate);

	/**
	 * 
	 * @param locationCode
	 * @param status 
	 * @return
	 */
	@Query(nativeQuery = true ,value = "SELECT TOP 1 bdm.* FROM sales.dbo.business_day_master bdm where bdm.location_code = :locationCode and bdm.status = :status ORDER BY bdm.business_date DESC")
	BusinessDayDaoExt getFiscalYearForBusinessDay(@Param("locationCode") String locationCode,@Param("status") String status);

	/**
	 * @param false1
	 * @param locationCode
	 * @return
	 */
	List<BusinessDayDaoExt> findByIsGHSFileUploadedAndLocationCode(Boolean false1, String locationCode);

	/**
	 * @param false1
	 * @param locationCode
	 * @param addDate
	 * @return
	 */
	List<BusinessDayDaoExt> findByIsGHSFileUploadedAndLocationCodeAndBusinessDate(Boolean false1, String locationCode,
			Date addDate);
	
	/**
	 * @param false1
	 * @param locationCode
	 * @return
	 */
	List<BusinessDayDaoExt> findByIsServiceFileUploadedAndLocationCode(Boolean false1, String locationCode);
	
}
