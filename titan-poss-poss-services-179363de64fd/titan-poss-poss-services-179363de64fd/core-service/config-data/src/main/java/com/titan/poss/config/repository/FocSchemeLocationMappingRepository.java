/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.FocSchemeLocationMappingDao;
import com.titan.poss.config.dao.FocSchemeMasterDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Repository
public interface FocSchemeLocationMappingRepository extends JpaRepository<FocSchemeLocationMappingDao, String> {

	/**
	 * @param id
	 * @return
	 */
	FocSchemeLocationMappingDao findOneById(String id);

	/**
	 * @param destFocDao
	 * @param locationCode
	 * @return
	 */
	List<FocSchemeLocationMappingDao> findByFocSchemeMasterDaoAndLocationCode(FocSchemeMasterDao destFocDao,
			String locationCode);

}
