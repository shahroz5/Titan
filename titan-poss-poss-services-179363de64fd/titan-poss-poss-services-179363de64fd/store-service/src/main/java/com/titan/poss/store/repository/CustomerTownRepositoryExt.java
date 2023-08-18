/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.store.dao.CustomerTownDao;

/**
 * Handles repository operations for <b>Customer Town</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("storeCustomerTownRepository")
public interface CustomerTownRepositoryExt extends CustomerTownRepository {

	/**
	 * This method will return CustomerTown details based on the townCode.
	 * 
	 * @param townCode
	 * @param locationCode
	 * @return CustomerTown
	 */
	CustomerTownDao findOneByCustomerTownIdTownCodeAndCustomerTownIdLocationCode(Integer townCode, String locationCode);

	// @formatter:off
	@Query("SELECT COALESCE(MAX(ct.customerTownId.townCode), 0) + 1 "
			+ " FROM com.titan.poss.store.dao.CustomerTownDao ct " 
			+ " WHERE ct.customerTownId.locationCode = :locationCode")
	// @formatter:on
	Integer getNextTownId(@Param("locationCode") String locationCode);

	/**
	 * This method will return CustomerTown details based on the townCode and
	 * description.
	 * 
	 * @param description
	 * @param locationCode
	 * @param stateCode
	 * @return List<CustomerTownDao>
	 */
	// @formatter:off
	@Query("SELECT ct FROM CustomerTownDao ct \r\n" 
			+ "WHERE ct.description = :description \r\n"
			+ "AND ct.customerTownId.locationCode = :locationCode \r\n"
			+ "AND ct.stateCode = :stateCode")
	// @formatter:on
	List<CustomerTownDao> findByDescriptionLocationCodeStateCode(@Param("description") String description,
			@Param("locationCode") String locationCode, @Param("stateCode") String stateCode);

}
