/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.SalesDocDaoExt;

/**
 * Handles repository operations for <b>sales_doc_master</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesDocRepositoryExt")
public interface SalesDocRepositoryExt extends JpaRepository<SalesDocDaoExt, String> {

	Optional<SalesDocDaoExt> findOneByLocationCodeAndDocTypeAndFiscalYear(String locationCode, String docType,
			Short fiscalYear);
	
	@Query("SELECT DISTINCT s.docType FROM SalesDocDaoExt s")
	List<String> findBydocTypeIn();

	@Modifying
	@Transactional
	@Query(nativeQuery = true, value = "UPDATE sales_doc_master SET is_active = 0 WHERE location_code IN (:locationCodeList)")
	void inactiveStatusForLocations(@Param("locationCodeList")List<String> locationCodeList);
}
