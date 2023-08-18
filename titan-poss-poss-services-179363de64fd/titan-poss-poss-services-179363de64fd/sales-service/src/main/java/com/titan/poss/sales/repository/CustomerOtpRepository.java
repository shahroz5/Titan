/*  
/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CustomerOtpDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("salesCustomerOtpRepository")
public interface CustomerOtpRepository extends JpaRepository<CustomerOtpDaoExt, String> {

	CustomerOtpDaoExt findByRefIdAndLocationCodeAndOtpTypeAndIsActiveTrue(String refId, String locationCode,
			String otpType);

	CustomerOtpDaoExt findByRefIdAndLocationCodeAndOtpTypeAndIsActiveTrueAndExpiryDateGreaterThanEqual(String refId, String locationCode,
			String otpType,Date expiryDate);
	
	// @formatter:off
	@Modifying
	@Query("UPDATE com.titan.poss.sales.dao.CustomerOtpDaoExt \r\n"
			+ " SET isActive = 0 \r\n"
			+ " where refId = :refId AND locationCode = :locationCode AND otpType = :otpType AND isActive = 1 \r\n")
	// @formatter:on
	void deactivateOldOtpByCriteria(@Param("refId") String refId, @Param("locationCode") String locationCode,
			@Param("otpType") String otpType);

}
