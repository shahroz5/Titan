/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.repository;

import com.titan.poss.report.dao.ReportFieldsDao;
import com.titan.poss.report.dao.ReportMasterDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("ReportReportFieldsRepository")
public interface ReportFieldsRepositoryExt extends ReportFieldsRepository {

	/**
	 * @param fieldId
	 * @param id
	 * @return
	 */
	@Query("SELECT rfd FROM ReportFieldsDao rfd WHERE rfd.reportMaster.id = :id AND rfd.id = :fieldId")
	ReportFieldsDao findByIdAndReportMasterId(@Param("fieldId") String fieldId, @Param("id") String id);

	/**
	 * @return List of ReportFieldsDao
	 */
	List<ReportFieldsDao> findByIdIn(Collection<String> fieldIds);

	public List<ReportFieldsDao> findByReportMaster(ReportMasterDao reportMasterDao);

	@Query("SELECT rf FROM ReportFieldsDao rf WHERE rf.reportMaster.id =:reportId  AND rf.id NOT IN (select rfrm.reportField.id  from ReportFieldsRoleMappingDao rfrm where rfrm.roleCode in (:roleCodes))"
			+ " Order by rf.columnOrder")
	List<ReportFieldsDao> findReportFields(@Param("reportId") String reportId, @Param("roleCodes") List<String> roleCodes);

	/**
	 * @param roleCode
	 * @param reportId
	 * @return
	 */
	@Query("SELECT rfd FROM ReportFieldsDao rfd WHERE rfd.reportMaster.id =:reportId AND rfd.id NOT IN "
			+ "(SELECT rfrm.reportField.id FROM ReportFieldsRoleMappingDao rfrm WHERE rfrm.reportMaster.id =:reportId AND rfrm.roleCode in (:roleCodes) )"
			+ "AND rfd.isOptional = 1 ")
	Page<ReportFieldsDao> findOptionalAndExcludedColumnById(@Param("roleCodes") List<String> roleCodes,
			@Param("reportId") String reportId, Pageable pageable);
}
