/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.AccountDetailsDaoExt;

/**
 * Repository to handle operations on <b>account_detailas</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesAccountDetailsRepositoryExt")
public interface AccountDetailsRepositoryExt extends JpaRepository<AccountDetailsDaoExt, String> {

	//@formatter:off
	@Query("SELECT ad FROM com.titan.poss.sales.dao.AccountDetailsDaoExt ad \r\n" 
			+ " WHERE ad.accountNo = :accountNo \r\n"
			+ " AND ad.accountType = :accountType \r\n"
			+ " AND ad.customerLocationMap.customerLocationMappingId.locationCode = :locationCode ")
	//@formatter:on
	AccountDetailsDaoExt findOneByAccountnoAccountTypeLocationCode(@Param("accountNo") String accountNo,
			@Param("accountType") String accountType, @Param("locationCode") String locationCode);

	//@formatter:off
	@Query("SELECT ad FROM com.titan.poss.sales.dao.AccountDetailsDaoExt ad \r\n" 
			+ " WHERE ad.id = :id \r\n"
			+ " AND ad.customerLocationMap.customerLocationMappingId.locationCode = :locationCode")
	//@formatter:on
	AccountDetailsDaoExt getByIdAndLocation(@Param("id") String id, @Param("locationCode") String locationCode);

}
