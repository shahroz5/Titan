/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.repository;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.RuleMasterDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface RuleMasterRepositoryCustom {

	
	Page<RuleMasterDao> getRuleDetailsBasedOnFilters(Map<String, String> query,Pageable pageable);
	
}


