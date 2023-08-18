/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.location.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.TaxConfigsDao;
import com.titan.poss.location.repository.TaxConfigsRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineTaxConfigsRepository")
public interface TaxConfigsRepositoryExt extends TaxConfigsRepository {

	/**
	 * 
	 * @param txnType
	 * @param srcLocationTaxType
	 * @param destLocationTaxType
	 * @param customerTaxType
	 * @param isSameState
	 * @param isActive
	 * @return TaxConfigsDao
	 */
	@Query(value = "select tc from TaxConfigsDao tc where tc.txnType = :txnType and tc.srcLocationTaxType = :srcLocationTaxType and "
			+ " (tc.destLocationTaxType IN (:destLocationTaxType) OR  nullif(CHOOSE(1,:destLocationTaxType),'') IS NULL) and "
			+ " (tc.customerTaxType IN (:customerTaxType) OR  nullif(CHOOSE(1,:customerTaxType),'') IS NULL) and "
			+ " tc.isSameState = :isSameState and tc.isActive = :isActive")
	TaxConfigsDao findByTxnTypeAndSrcLocationTaxTypeAndDestLocationTaxTypeAndIsSameStateAndIsActive(
			@Param("txnType") String txnType, @Param("srcLocationTaxType") String srcLocationTaxType,
			@Param("destLocationTaxType") String destLocationTaxType, @Param("customerTaxType") String customerTaxType,
			@Param("isSameState") boolean isSameState, @Param("isActive") boolean isActive);

}
