/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.product.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ProductPriceMappingDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface ProductPriceMappingRepository extends JpaRepository<ProductPriceMappingDao, String> {

	/**
	 * @param correlationId
	 * @return
	 */
	List<ProductPriceMappingDao> findAllByCorrelationId(String correlationId);

}
