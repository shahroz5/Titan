/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.inventory.dao.BinGroupDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface BinGroupRepository extends JpaRepository<BinGroupDao, String> {

	/**
	 * This method will return the BinGroup details based on binGroupCode.
	 * 
	 * @param binGroupCode
	 * @return BinGroup
	 */
	public BinGroupDao findOneByBinGroupCode(String binGroupCode);
}
