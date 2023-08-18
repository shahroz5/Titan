/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ProdLovDaoExt;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("ProductLovRepositoryExt")
public interface LovRepositoryExt extends JpaRepository<ProdLovDaoExt, String> {

	/**
	 * This method will return the List of Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return List<ProdLovDaoExt>
	 */
	public List<ProdLovDaoExt> findByLovType(String lovType);

}
