/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.TaxConfigsDao;
import com.titan.poss.location.dao.TaxConfigsDaoExt;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("taxConfigRepositoryExt")
public interface TaxConfigsRepositoryExt extends JpaRepository<TaxConfigsDaoExt, String> {

	@Query("Select tc FROM TaxConfigsDao tc WHERE (tc.isActive = :isActive OR :isActive IS NULL) AND "
			+ "(tc.srcLocationTaxType = :srcLocationTaxType OR nullif(CHOOSE(1,:srcLocationTaxType),'') IS NULL) AND "
			+ "(tc.destLocationTaxType = :destLocationTaxType OR nullif(CHOOSE(1,:destLocationTaxType),'') IS NULL) AND "
			+ "(tc.customerTaxType = :customerTaxType OR nullif(CHOOSE(1,:customerTaxType),'') IS NULL) AND "
			+ "(tc.txnType = :txnType OR nullif(CHOOSE(1,:txnType),'') IS NULL)")
	Page<TaxConfigsDao> getConfiguration(@Param("isActive") Boolean isActive, @Param("srcLocationTaxType") String srcLocationTaxType,
			@Param("destLocationTaxType") String destLocationTaxType, @Param("customerTaxType") String customerTaxType, @Param("txnType") String txnType,
			Pageable pageable);

}
