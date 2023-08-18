/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.inventory.dao.InvDocMasterDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Repository
public interface InvDocMasterRepository extends JpaRepository<InvDocMasterDao, Integer> {
	
	@Query("SELECT DISTINCT i.docType FROM InvDocMasterDao i")
	List<String> findBydocTypeIn();

	@Modifying
	@Transactional
	@Query(nativeQuery = true, value = "UPDATE inv_doc_master SET is_active = 0 WHERE location_code IN (:locationCodeList)")
	void inactiveStatusForLocations(@Param("locationCodeList") List<String> locationCodeList);

}
