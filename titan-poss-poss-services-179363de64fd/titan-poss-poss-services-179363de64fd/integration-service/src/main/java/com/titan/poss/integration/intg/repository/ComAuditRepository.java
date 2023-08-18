/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.intg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.integration.intg.dao.ComAuditDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface ComAuditRepository extends JpaRepository<ComAuditDao, String> {

}
