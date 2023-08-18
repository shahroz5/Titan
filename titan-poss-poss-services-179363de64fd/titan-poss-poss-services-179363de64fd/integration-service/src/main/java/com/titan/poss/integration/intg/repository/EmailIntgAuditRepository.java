/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.intg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.integration.intg.dao.EmailIntgAudit;

/**
 * Handles repository operations for <b>SMSIntgAudit</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0s
 */
@Repository("IntegrationEmailIntgAuditRepository")
public interface EmailIntgAuditRepository extends JpaRepository<EmailIntgAudit, Integer> {

}
