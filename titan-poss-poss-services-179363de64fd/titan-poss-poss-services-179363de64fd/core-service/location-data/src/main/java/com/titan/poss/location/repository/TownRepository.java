/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.TownDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface TownRepository extends JpaRepository<TownDao, String> {


	/**
	 * This method will return the Town details based on the townCode.
	 * 
	 * @param townCode
	 * @return Town
	 */
	public TownDao findOneByTownId(String townCode);
}
