/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.PriceDao;
import com.titan.poss.product.dao.PriceDaoExt;
import com.titan.poss.product.dao.PriceGroupDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("ProductPriceRepositoryExt")
public interface PriceRepositoryExt extends JpaRepository<PriceDaoExt, String> {

	/**
	 * This method will return the list of Price details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return Page<Price>
	 */
	public Page<PriceDao> findByIsActive(Boolean isActive, Pageable pageable);
	
	public Optional<PriceDaoExt> findByItemAndPriceGroup(ItemDao item, PriceGroupDao priceGroup);

}
