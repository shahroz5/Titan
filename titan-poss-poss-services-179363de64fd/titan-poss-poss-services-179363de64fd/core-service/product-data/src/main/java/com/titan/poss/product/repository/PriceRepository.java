/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.PriceDao;
import com.titan.poss.product.dao.PriceGroupDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface PriceRepository extends JpaRepository<PriceDao, String> {
	
	public Optional<PriceDao> findByItemAndPriceGroup(ItemDao item, PriceGroupDao priceGroup);

}
