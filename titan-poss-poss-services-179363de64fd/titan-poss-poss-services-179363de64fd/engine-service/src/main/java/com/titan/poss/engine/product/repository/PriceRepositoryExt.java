/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.product.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.PriceDao;
import com.titan.poss.product.dao.PriceGroupDao;
import com.titan.poss.product.repository.PriceRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface PriceRepositoryExt extends PriceRepository {

	/**
	 * This method will return the PriceDao details based on the itemCode,
	 * priceGroup.
	 * 
	 * @param itemCode
	 * @param priceGroup
	 * @return PriceDao
	 */

	@Query("select p from PriceDao p where (p.item.itemCode=:itemCode and p.priceGroup.priceGroup=:priceGroup)")
	public PriceDao findByItemCodeAndPriceGroup(@Param("itemCode") String itemCode,
			@Param("priceGroup") String priceGroup);
	
	@Query("select p from PriceGroupDao p where (p.priceGroup= :priceGroup)")
	public PriceGroupDao findOneByPriceGroup(@Param("priceGroup") String priceGroup);

}
