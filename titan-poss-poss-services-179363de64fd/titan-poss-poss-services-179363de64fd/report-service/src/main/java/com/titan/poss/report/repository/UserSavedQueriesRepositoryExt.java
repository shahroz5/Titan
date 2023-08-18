/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.report.dao.UserSavedQueriesDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface UserSavedQueriesRepositoryExt extends UserSavedQueriesRepository {

	/**
	 * @param queryId
	 * @param id
	 * @return
	 */
	@Query("SELECT c FROM UserSavedQueriesDao c WHERE c.reportMaster.id = :id AND c.id = :queryId ")
	UserSavedQueriesDao findByIdAndReportMasterId(@Param("queryId") String queryId, @Param("id") String id);

}
