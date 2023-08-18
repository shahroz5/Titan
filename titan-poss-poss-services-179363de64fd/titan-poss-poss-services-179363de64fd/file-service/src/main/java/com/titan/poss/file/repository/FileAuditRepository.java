/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.file.dao.FileAuditDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("FileAuditRepository")
public interface FileAuditRepository extends JpaRepository<FileAuditDao, String> {

	List<FileAuditDao> findByStatusAndCreatedByAndFileMasterFileName(String status, String createdBy,
			String fileMasterName);

	List<FileAuditDao> findByFileNameAndStatus(String fileName, String status);

	@Modifying
	@Query("DELETE FileAuditDao fa WHERE fa.endTime <= :endTime")
	void clearFileAudit(@Param("endTime") Date endTime);

	@Query(value = "SELECT COALESCE(count(fa.file_name) ,0) from [file].dbo.file_audit fa"
			+ " where fa.file_name = :fileName and status = 'RETRY'", nativeQuery = true)
	Integer getRetryCount(@Param("fileName") String fileName);
}
