/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ProductCategoryDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategoryDao, String> {

	/**
	 * This method will return the ProductCategory details based on the
	 * productCategoryCode.
	 * 
	 * @param productCategoryCode
	 * @return ProductCategory
	 */
	public ProductCategoryDao findOneByProductCategoryCode(String productCategoryCode);
	
}
