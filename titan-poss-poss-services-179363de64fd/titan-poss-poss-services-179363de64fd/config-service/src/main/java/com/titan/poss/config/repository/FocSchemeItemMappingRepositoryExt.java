/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.FocSchemeItemMappingDaoExt;
import com.titan.poss.config.dao.FocSchemeMasterDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface FocSchemeItemMappingRepositoryExt extends JpaRepository<FocSchemeItemMappingDaoExt, String> {

	/**
	 * @param itemRemove
	 * @return
	 */
	@Query("SELECT c FROM FocSchemeItemMappingDaoExt c WHERE c.id in :itemRemove")
	List<FocSchemeItemMappingDaoExt> findAllByItemCodeIds(@Param("itemRemove") List<String> itemRemove);

	/**
	 * @param id
	 * @return
	 */
	@Query("SELECT c FROM FocSchemeItemMappingDaoExt c WHERE c.focSchemeMasterDao.id = :id")
	List<FocSchemeItemMappingDaoExt> findAllBySchemeId(@Param("id") String id);

	/**
	 * @param focSchemeMasterDaoExt
	 * @return
	 */
	List<FocSchemeItemMappingDaoExt> findAllByFocSchemeMasterDao(FocSchemeMasterDaoExt focSchemeMasterDaoExt);
}
