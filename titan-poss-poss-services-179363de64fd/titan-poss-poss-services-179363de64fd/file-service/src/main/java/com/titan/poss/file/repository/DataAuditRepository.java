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

import com.titan.poss.file.dao.DataAuditDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("DataAuditRepository")
public interface DataAuditRepository extends JpaRepository<DataAuditDao, String> {

	List<DataAuditDao> findByFileAuditFileId(String fileAuditId);

	List<DataAuditDao> findByFileAuditFileIdAndErrorType(String fileAuditId, String errorType);

	@Modifying
	@Query(nativeQuery = true, value = "DELETE from [file].dbo.data_audit where file_id in (SELECT file_id from [file].dbo.file_audit fa WHERE fa.end_time <= :endTime)")
	void clearDataAudit(@Param("endTime") Date endTime);
}
