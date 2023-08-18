/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.RegionDao;

/**
 * @author  Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface RegionRepositoryExt extends RegionRepository {

	/**
	 * This method will return the parent Region list based on the isActiveList.
	 * @param isActiveList
	 * @param pageable
	 * @return Page<Region>
	 */
	@Query("select r from RegionDao r where isActive in(:isActiveList) and r.parentRegion.regionCode = r.regionCode")
	public Page<RegionDao> findParentRegions(@Param("isActiveList") List<Boolean> isActiveList, Pageable pageable);

}
