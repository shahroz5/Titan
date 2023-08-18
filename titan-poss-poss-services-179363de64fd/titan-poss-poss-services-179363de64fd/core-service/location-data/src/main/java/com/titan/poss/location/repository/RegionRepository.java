/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.RegionDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface RegionRepository extends JpaRepository<RegionDao, String> {


	/**
	 * This method will return the Region details based on the regionCode.
	 * 
	 * @param regionCode
	 * @return Region
	 */
	public RegionDao findOneByRegionCode(String regionCode);
	
}
