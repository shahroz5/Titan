/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.titan.poss.report.dao.UserTemplatesDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface UserTemplatesRepositoryExt extends UserTemplatesRepository {

	/**
	 * @param templateId
	 * @param id
	 * @return
	 */
	@Query("SELECT c FROM UserTemplatesDao c WHERE c.reportMaster.id = :id AND c.id = :templateId")
	UserTemplatesDao findByIdAndReportMasterId(String templateId, String id);

}
