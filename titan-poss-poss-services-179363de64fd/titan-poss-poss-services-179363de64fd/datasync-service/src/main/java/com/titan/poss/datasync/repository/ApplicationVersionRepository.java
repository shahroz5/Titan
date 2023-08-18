/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.datasync.dao.ApplicationVersionDao;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface ApplicationVersionRepository extends JpaRepository<ApplicationVersionDao, String> {

	@Query("SELECT  a FROM ApplicationVersionDao a WHERE a.locationCode = :locationCode AND a.status IN (:status) order by a.lastModifiedDate desc")
	List<ApplicationVersionDao> findByLocationCodeStatus(@Param("locationCode") String locationCode,
														 @Param("status") List<String> status,Pageable pageable);

	/*
	 * @Query("SELECT new com.titan.poss.datasync.dto.ApplicationVersionDto (d.id,d.locationCode,d.status,d.epossUiVersion,d.possUiVersion,d.possServiceVersion,"
	 * +
	 * " d.databaseVersion, d.downloadUrl,d.isPublished) FROM ApplicationVersionDao d WHERE "
	 * +
	 * " ((d.epossUiVersion =:epossUiVersion OR nullif(CHOOSE(1,:epossUiVersion),'') IS NULL)"
	 * +
	 * " AND (d.possUiVersion =:possUiVersion OR nullif(CHOOSE(1,:possUiVersion),'') IS NULL)"
	 * +
	 * " AND (d.possServiceVersion =:possServiceVersion OR nullif(CHOOSE(1,:possServiceVersion),'') IS NULL)"
	 * +
	 * " AND (d.databaseVersion =:databaseVersion OR nullif(CHOOSE(1,:databaseVersion),'') IS NULL)"
	 * +
	 * " AND (d.locationCode =:locationCode OR nullif(CHOOSE(1,:locationCode),'') IS NULL) "
	 * + " AND (d.status =:status OR nullif(CHOOSE(1,:status),'') IS NULL)) ")
	 * Page<ApplicationVersionDao> findByStatusAndLocation(@Param("locationCode")
	 * String locationCode,
	 *
	 * @Param("status") String status, @Param("epossUiVersion") String
	 * epossUiVersion,
	 *
	 * @Param("possUiVersion") String possUiVersion, @Param("possServiceVersion")
	 * String possServiceVersion,
	 *
	 * @Param("databaseVersion") String databaseVersion, Pageable pageable);
	 */

	@Modifying
	@Query("UPDATE ApplicationVersionDao d SET d.status = :status WHERE d.status = ACTIVE AND d.locationCode = :locationCode  AND d.id NOT IN (:id) ")
	void updateStatus(@Param("locationCode") String locationCode, @Param("status") String status,
					  @Param("id") String id);

	/*
	 * @Query("SELECT  a FROM ApplicationVersionDao a WHERE a.isPublished = 0 ")
	 * List<ApplicationVersionDao> findByIsPublished();
	 */

	@Query("SELECT  DISTINCT a FROM ApplicationVersionDao a ")
	List<ApplicationVersionDao> listDistinctVersions();

}
