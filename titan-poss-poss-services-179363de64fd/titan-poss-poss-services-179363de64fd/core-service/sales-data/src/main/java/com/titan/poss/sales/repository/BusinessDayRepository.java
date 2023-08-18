/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.BusinessDayDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("BusinessDayRepository")
public interface BusinessDayRepository extends JpaRepository<BusinessDayDao, String> {

	/**
	 * To get the maximum business Date
	 * 
	 * @return Date
	 * @param locationCode
	 * @param status
	 */
	@Query("SELECT max(businessDate) FROM BusinessDayDao where locationCode =:locationCode AND status =:status")
	Date getMaximumBusinessDate(@Param("locationCode") String locationCode, @Param("status") String status);

	/**
	 * 
	 * @param businessDate
	 * @param status
	 * @param locationCode
	 * @return BusinessDayDao
	 */
	BusinessDayDao findByBusinessDateAndStatusInAndLocationCode(Date businessDate, List<String> status,
			String locationCode);

	/**
	 *
	 * @param statusList
	 * @param locationCode
	 * @return List<BusinessDayDao>
	 */
	List<BusinessDayDao> findByStatusInAndLocationCode(List<String> statusList, String locationCode);

	/**
	 * 
	 * @param locationCode
	 * @param businessDate
	 * @return
	 */
	BusinessDayDao findByLocationCodeAndBusinessDate(String locationCode, Date businessDate);

	/**
	 * 
	 * @param status
	 * @param locationCode
	 * @param maxBusinessDate
	 * @return
	 */
	BusinessDayDao findByStatusAndLocationCodeAndBusinessDate(String status, String locationCode, Date maxBusinessDate);

	/**
	 * Find business day data for the location.
	 *
	 * @param status       the status
	 * @param locationCode the location code
	 * @return the business day dao
	 */
	BusinessDayDao findOneByStatusAndLocationCodeOrderByBusinessDateDesc(String status, String locationCode);

	/**
	 * Find first business day data for the location.
	 *
	 * @param status       the status
	 * @param locationCode the location code
	 * @return the business day dao
	 */
	BusinessDayDao findFirstByStatusAndLocationCodeOrderByBusinessDateDesc(String status, String locationCode);

	BusinessDayDao findTopByLocationCodeAndStatusInOrderByBusinessDateDesc(@Param("locationCode") String locationCode,
			@Param("status") List<String> status);
	
	@Query(nativeQuery = true, value ="select * from sales.dbo.business_day_master bd where bd.location_code = :locationCode and bd.status = :status and business_date in (SELECT max(business_date) from sales.dbo.business_day_master bdm2 where bdm2.status =:status and location_code =:locationCode )")
	List<BusinessDayDao> getMaxBusinessDayForClosedState(@Param("locationCode") String locationCode,
			@Param("status") String status);
}
