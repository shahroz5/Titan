/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.MaterialTypeDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("materialTypeRepository")
public interface MaterialTypeRepository extends JpaRepository<MaterialTypeDao, String> {

	/**
	 * This method will return the Material details based on the materil Type Code.
	 * 
	 * @param materialTypeCode
	 * @return Material
	 */
	public MaterialTypeDao findOneByMaterialTypeCode(String materialTypeCode);
}
