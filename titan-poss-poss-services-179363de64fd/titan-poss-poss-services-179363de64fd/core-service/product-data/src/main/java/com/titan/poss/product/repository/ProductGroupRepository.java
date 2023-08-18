/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ProductGroupDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface ProductGroupRepository extends JpaRepository<ProductGroupDao, String> {

	/**
	 * This method will return the ProductGroup details based on the
	 * productGroupCode.
	 * 
	 * @param productGroupCode
	 * @return ProductGroup
	 */
	public ProductGroupDao findOneByProductGroupCode(String productGroupCode);
	
	public ProductGroupDao findByProductGroupCodeAndIsActive(String productGroupCode, boolean isActive);
	
}
