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

import com.titan.poss.location.dao.StateTaxMappingDaoExt;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("LocationStateTaxMappingRepository")
public interface StateTaxMappingRepositoryExt extends JpaRepository<StateTaxMappingDaoExt, String> {

	/**
	 * This method will return the list of StateTax details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return Page<StateTax>
	 */
	Page<StateTaxMappingDaoExt> findByIsActive(Boolean isActive, Pageable pageable);

	/**
	 * This method will return the StateTax details based on the id.
	 * 
	 * @param id
	 * @return StateTax
	 */
	StateTaxMappingDaoExt findOneById(String id);

	@Query("SELECT stm FROM StateTaxMappingDaoExt stm WHERE (:stateName IS NULL OR stm.state.description LIKE '%'+:stateName +'%') AND (:isActive IS NULL OR stm.isActive = :isActive)")
	Page<StateTaxMappingDaoExt> findAllStates(@Param("stateName")String stateName, @Param("isActive")Boolean isActive, Pageable pageable);

}
