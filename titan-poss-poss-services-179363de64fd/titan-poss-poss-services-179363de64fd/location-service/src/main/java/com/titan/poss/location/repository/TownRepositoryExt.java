/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.TownDaoExt;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface TownRepositoryExt extends JpaRepository<TownDaoExt, String> {

	/**
	 * This method will return the State details based on the stateCode.
	 * 
	 * @param TownId
	 * @return Town
	 */
	public TownDaoExt findOneByTownId(String townId);

	/**
	 * This method will return the list of Town details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return Page<Town>
	 */
	public Page<TownDaoExt> findByIsActive(Boolean isActive, Pageable pageable);

	/**
	 * This method will return the Town details based on the townCode and
	 * description.
	 * 
	 * @param description
	 * @return Town
	 */
	public TownDaoExt findOneByDescription(String description);

	@Query("SELECT t from TownDaoExt t where t.state.id = :stateId AND t.description = :description")
	TownDaoExt findByStateIdAndDescription(@Param("stateId") String stateId, @Param("description") String description);
}
