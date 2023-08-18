/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.product.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ItemTypeDao;
import com.titan.poss.product.repository.ItemTypeRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("EngineItemTypeRepositoryExt")
public interface ItemTypeRepositoryExt extends ItemTypeRepository {

	List<ItemTypeDao> findByItemGroupIn(Collection<String> itemGroups);

}
