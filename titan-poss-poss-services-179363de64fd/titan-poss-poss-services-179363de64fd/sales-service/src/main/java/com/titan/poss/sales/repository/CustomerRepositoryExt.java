/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CustomerDaoExt;

/**
 * Handles repository operations for <b>customer_master</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesCustomerRepositoryExt")
public interface CustomerRepositoryExt extends JpaRepository<CustomerDaoExt, String> {

	/**
	 * @param id
	 * @param isActive
	 * @return
	 */
	@Query("SELECT cm FROM com.titan.poss.sales.dao.CustomerDaoExt cm WHERE  cm.id = :id AND  cm.isActive = :isActive ")
	Optional<CustomerDaoExt> findByIdAndIsActive(@Param("id") String id, @Param("isActive") Boolean isActive);

	// @formatter:off
	@Query(nativeQuery = true, value =  "\r\n" +   
			  " SELECT clm.customer_id, cm.customer_name,cm.id FROM customer_location_mapping clm, customer_master cm \r\n" + 
			  "	WHERE clm.customer_master_id = cm.id AND location_code = :locationCode AND clm.customer_id IN (:customerIds)")
	// @formatter:on
	List<Object[]> getCustomerNamesByIds(@Param("locationCode") String locationCode,
			@Param("customerIds") Set<Integer> customerIds);
	@Query(nativeQuery = true, value ="SELECT top 1 * FROM customer_master  WHERE customer_type = :customerType  \r\n" + 
	"  AND ((:searchType = 'MOBILE_NO' AND mobile_number = :searchValue) "
	+ "		OR (:searchType = 'ULP_ID' AND ulp_id = :searchValue) "
	+ "		OR (:searchType = 'INSTITUTIONAL' AND insti_tax_no = :searchValue) "
	+ "		OR (:searchType = 'PASSPORT_ID' AND passport_id = :searchValue)"
	+ ") \r\n")
	Optional<CustomerDaoExt> getCustomerByCustomerTypeAndUlpIdOrMobileNumberOrInstiTaxNoOrPassPortId(@Param("customerType") String customerType,@Param("searchType") String searchType, @Param("searchValue") String searchValue);
}
