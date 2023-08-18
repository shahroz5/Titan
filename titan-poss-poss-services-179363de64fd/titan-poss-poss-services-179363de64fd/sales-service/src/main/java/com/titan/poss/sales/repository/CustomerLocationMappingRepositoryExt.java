/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;

/**
 * Handles repository operations for <b>customer_location_mapping</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesCustomerLocationMappingRepository")
public interface CustomerLocationMappingRepositoryExt extends CustomerLocationMappingRepository {

	/**
	 * This method will return new id to be inserted to the record.
	 * 
	 * @return Integer
	 */
	// @formatter:off
	@Query("SELECT COALESCE(MAX(clm.customerLocationMappingId.customerId), 0) + 1 " 
			+ " FROM com.titan.poss.sales.dao.CustomerLocationMappingDao clm " 
			+ " WHERE clm.customerLocationMappingId.locationCode = :locationCode")
	// @formatter:on
	Integer getNewCustomerIdForLocationMapping(@Param("locationCode") String locationCode);

	/**
	 * This method will return CustomerLocationMapping based on customer and
	 * locationCode.
	 * 
	 * @param customer
	 * @param locationCode
	 * @param ulpId
	 * @return CustomerLocationMapping
	 */
	CustomerLocationMappingDao findOneByCustomerAndCustomerLocationMappingIdLocationCode(CustomerDao customer,
			String locationCode);

	/**
	 * This method will get CustomerLocationMapping by customer id & location code.
	 * 
	 * @param customerId
	 * @param locationCode
	 * @return CustomerLocationMappingDao
	 */
	// @formatter:off
	@Query("SELECT clm FROM com.titan.poss.sales.dao.CustomerLocationMappingDao clm \r\n"
			+ " WHERE  clm.customerLocationMappingId.customerId = :customerId \r\n"
			+ " AND  clm.customerLocationMappingId.locationCode = :locationCode \r\n")
	// @formatter:off
	CustomerLocationMappingDao findByCustomerIdAndLocationCode(@Param("customerId") Integer customerId,
			@Param("locationCode") String locationCode);
	
	/**
	 * This method will get CustomerLocationMapping by customer master id & location code.
	 * 
	 * @param customerMasterId
	 * @param locationCode
	 * @return CustomerLocationMappingDao
	 */
	// @formatter:off
	@Query("SELECT clm FROM com.titan.poss.sales.dao.CustomerLocationMappingDao clm \r\n"
			+ " WHERE  clm.customer.id = :customerMasterId \r\n"
			+ " AND  clm.customerLocationMappingId.locationCode = :locationCode \r\n")
	// @formatter:off
	CustomerLocationMappingDao findByCustomerMasterIdIdAndLocationCode(@Param("customerMasterId") String customerMasterId,
			@Param("locationCode") String locationCode);

}
