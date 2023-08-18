/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.config.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineRuleMasterRepositoryCustom")
public interface RuleMasterRepositoryCustom {

	List<Object[]> getValueListBasedOnFilters(String query);
}
