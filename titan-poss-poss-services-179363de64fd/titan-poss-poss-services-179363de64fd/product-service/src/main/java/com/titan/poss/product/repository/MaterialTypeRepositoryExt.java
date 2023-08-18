/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.MaterialTypeDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("ProductMaterialTypeRepositoryExt")
public interface MaterialTypeRepositoryExt extends MaterialTypeRepository {

	/**
	 * This method will return the Material details based on the materialTypeCode.
	 * 
	 * @param materialTypeCode
	 * @return Material
	 */
	@Override
	public MaterialTypeDao findOneByMaterialTypeCode(String materialTypeCode);

}
