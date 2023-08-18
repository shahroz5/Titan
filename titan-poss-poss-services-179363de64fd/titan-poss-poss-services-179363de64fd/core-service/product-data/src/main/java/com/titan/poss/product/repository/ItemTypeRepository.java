/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ItemTypeDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface ItemTypeRepository extends JpaRepository<ItemTypeDao, String> {

	/**
	 * This method will return the ItemType details based on the item Type Code.
	 * 
	 * @param itemTypeCode
	 * @return ItemType
	 */
	public ItemTypeDao findOneByItemTypeCode(String itemTypeCode);
}
