/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.inventory.repository;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository()
public interface CustomInventoryDetailRepositoryExt {

	Page<Object[]> getDetails(Map<String, String> query, Pageable pageable);

}
