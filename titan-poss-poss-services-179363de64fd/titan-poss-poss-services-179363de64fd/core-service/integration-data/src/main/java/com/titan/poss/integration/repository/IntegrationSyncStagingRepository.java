/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.integration.dao.SyncStaging;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("IntegrationSyncStagingRepository")
public interface IntegrationSyncStagingRepository extends JpaRepository<SyncStaging, String> {

}
