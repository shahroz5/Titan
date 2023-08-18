/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.FocSchemeMasterDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface FocSchemeMasterRepositoryExt extends JpaRepository<FocSchemeMasterDaoExt, String> {

	/**
	 * @param schemeName
	 * @return
	 */
	FocSchemeMasterDaoExt findByName(String schemeName);

	/**
	 * @param id
	 * @param schemeName
	 * @return
	 */
	@Query("SELECT c FROM FocSchemeMasterDaoExt c WHERE (c.id = :id AND c.manualFoc = FALSE) OR (c.name = :schemeName AND c.manualFoc = TRUE)")
	FocSchemeMasterDaoExt findByIdOrSchemeName(@Param("id") String id, @Param("schemeName") String schemeName);

	/**
	 * @param focSchemeId
	 * @return FocSchemeMasterDaoExt
	 */
	FocSchemeMasterDaoExt findOneById(String focSchemeId);

	/**
	 * @param schemeName
	 * @param pageable
	 * @return
	 */
	@Query("SELECT c FROM FocSchemeMasterDaoExt c WHERE (:schemeName IS NULL OR c.name LIKE '%'+:schemeName +'%') AND c.manualFoc = false ")
	Page<FocSchemeMasterDaoExt> getFocList(@Param("schemeName") String schemeName, Pageable pageable);
}
