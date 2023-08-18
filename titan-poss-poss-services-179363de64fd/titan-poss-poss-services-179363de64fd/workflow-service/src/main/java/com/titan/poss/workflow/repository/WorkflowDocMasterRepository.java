/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.workflow.dao.WorkflowDocMasterDao;

/**
 * 
 * Handles repository operations for <b>Workflow Doc Master</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("workflowDocMasterRepository")
public interface WorkflowDocMasterRepository extends JpaRepository<WorkflowDocMasterDao, Integer> {
	
	WorkflowDocMasterDao findOneByLocationCodeAndFiscalYearAndDocType(String locationCode, short fiscalYear, String docType);
}
