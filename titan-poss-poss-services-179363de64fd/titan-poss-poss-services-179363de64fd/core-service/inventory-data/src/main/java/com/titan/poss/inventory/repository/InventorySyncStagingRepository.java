/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.inventory.dao.SyncStaging;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("inventorySyncStagingRepository")
public interface InventorySyncStagingRepository extends JpaRepository<SyncStaging, String> {
	
	@Query("SELECT s FROM InventorySyncStaging s WHERE s.status = 'IN_PROGRESS'")
	List<SyncStaging> findSyncStagingDetails(Pageable pageable);

	@Modifying
	@Transactional
	@Query(nativeQuery = true, value = "UPDATE sync_staging SET status = 'PUBLISHED' where id IN (:syncIdList)")
	void updateSyncStatus(@Param("syncIdList")List<String> syncIdList);

	@Modifying
	@Transactional
	@Query(nativeQuery = true, value = "DELETE FROM sync_staging where status = 'PUBLISHED'")
	void deletePublishedMessage();



}
