/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.product.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ItemStoneMappingDao;
import com.titan.poss.product.repository.ItemStoneMappingRepository;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("EngineItemStoneMappingRepository")
public interface ItemStoneMappingRepositoryExt extends ItemStoneMappingRepository {

	List<ItemStoneMappingDao> findByItem(ItemDao itemDao);
}
