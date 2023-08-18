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

import com.titan.poss.sales.dao.CustomerVisitDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface CustomerVisitRepositoryExt extends JpaRepository<CustomerVisitDaoExt, String> {
	/**
	 * To get the Customer visit Details
	 * 
	 * @param locationCode
	 * @param locationCode
	 * @return CustomerVisitDao
	 */
	CustomerVisitDaoExt findByLocationCodeAndBusinessDate(String locationCode, Date businessDate);

	/**
	 * @param locationCode
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	@Query(nativeQuery = true, value = "select * from customer_visits where location_code = :locationCode and business_date between :startDate and :endDate")
	List<CustomerVisitDaoExt> findByLocationCodeAndBusinessDateRange(@Param("locationCode") String locationCode,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}
