/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.DocNumberFailAuditDaoExt;

/**
 * Repository to handle operations on <b>doc_number_fail_audit</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesDocNumberFailAuditDaoRepositoryExt")
public interface DocNumberFailAuditDaoRepositoryExt extends JpaRepository<DocNumberFailAuditDaoExt, String> {

}
