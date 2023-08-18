/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.math.BigDecimal;
import java.util.Date;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Handles repository operations for <b>Customer Ulp</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CustomerUlpRepositoryExt extends CustomerUlpRepository {
	/**
	 * this method will check for pulse customer based on ulpId.
	 * 
	 * @param ulpId
	 * @return Boolean
	 */
	Boolean existsByUlpIdAndIsPulseCustomerTrue(String ulpId);

	@Modifying
	// @formatter:off
	@Query("UPDATE CustomerUlpDao "
			+ " SET pointBalance = :pointBalance, currentTier = :currentTier, enrollmentDate = :enrollmentDate, \r\n"
			+ "     isMemberBlocked = :isMemberBlocked, isPulseCustomer = :isPulseCustomer, loyaltyDetails = :loyaltyDetails, \r\n"
			+ "     lastModifiedBy = :lastModifiedBy, lastModifiedDate = :lastModifiedDate \r\n"  
			+ " WHERE ulpId = :ulpId")
	// @formatter:on
	void updateUlp(@Param("pointBalance") BigDecimal pointBalance, @Param("currentTier") String currentTier,
			@Param("enrollmentDate") Date enrollmentDate, @Param("isMemberBlocked") Boolean isMemberBlocked,
			@Param("isPulseCustomer") Boolean isPulseCustomer, @Param("loyaltyDetails") String loyaltyDetails,
			@Param("lastModifiedBy") String lastModifiedBy, @Param("lastModifiedDate") Date lastModifiedDate,
			@Param("ulpId") String ulpId);

}
