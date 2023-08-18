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

import com.titan.poss.config.dao.RivaahProductMappingDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface RivaahProductGroupMappingRepository extends JpaRepository<RivaahProductMappingDao, String> {
	
	@Query("select rp from RivaahProductMappingDao rp where rp.ruleProductDao.id = :productId")
	List<RivaahProductMappingDao> findAllByProductMap(@Param("productId") String productId);
	
}
