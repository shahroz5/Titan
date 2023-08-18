/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.workflow.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.workflow.dao.WorkflowProcessDao;
import com.titan.poss.workflow.dto.request.DBQueryDto;
import com.titan.poss.workflow.dto.request.DBTaskQueryRequestDTO;
import com.titan.poss.workflow.dto.response.ProcessCountDto;

/**
 * Handles repository operations for <b>Workflow Process</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("workflowProcessRepository")
public interface WorkflowProcessRepository extends JpaRepository<WorkflowProcessDao, String> {

	public WorkflowProcessDao findByProcessId(String processId);
	
	
	/* ++++++++++++++++++  TASKS LIST +++++++++++++++++++++++++++++++++++++*/
	
	/**
	 * This method will return the Page Of WorkflowProcess Dao for PENDING Process Ids obtained from Camunda, for Logged In Approver User.
	 *  
	 * @param pendingProcessList with List of Pending Process Ids from Camunda
	 * @param pageable
	 * @return Page<WorkflowProcessDao>
	 */	 
	
	@Query("SELECT wfp FROM WorkflowProcessDao wfp WHERE process_id in (:pendingProcessList) OR nullif(CHOOSE(1,:pendingProcessList),'') IS NULL")
	Page<WorkflowProcessDao> findPendingListforApprover(@Param("pendingProcessList") List<String> pendingProcessList, Pageable pageable);
	

	/**
	 * This method will return the list of APPROVED OR REJECTED Records for Logged In Approver, Workflow Type, Source Location Code and Other Filters
	 * such as docNo, fiscalYear, approvalStatus etc.
	 * 
	 * @param approvalStatus
	 * @param locationCode
	 * @param workflowType
	 * @param filters
	 * @param sortParameter
	 * @param offset
	 * @param size
	 * @return List<Object[]>
	 */

	// @formatter:off
	@Query(nativeQuery = true, value = "DECLARE @history_FilterParams varchar(500) \r\n" 
			+ " SET @history_FilterParams = :#{#filters.historyFilterParams} \r\n"
			+ " (SELECT wft.task_id, wft.task_name, wfp.process_id, wfp.header_data, wfp.workflow_type, wfp.doc_no, wfp.created_date, wfp.fiscal_year, wfp.location_code, wfp.requestor_remarks, wfp.requestor_user_name, wfp.approver_name, wfp.approved_date_time, wfp.approval_status, wft.approver_remarks, wfp.requestor_code, wfp.approver_code, wfp.approved_data \r\n"
			+ " FROM workflow_process wfp INNER JOIN workflow_task wft ON wfp.process_id=wft.process_id \r\n"
			+ " WHERE wfp.approval_status = :approvalStatus \r\n"
			+ " AND wfp.workflow_type = :workflowType \r\n"
			+ " AND (:locationCode IS NULL OR wfp.location_code = :locationCode) \r\n"
			+ " AND (:#{#filters.docNo} IS NULL OR wfp.doc_no = :#{#filters.docNo}) \r\n"
			+ " AND (:#{#filters.fiscalYear} IS NULL OR wfp.fiscal_year = :#{#filters.fiscalYear}) \r\n"
			+ " AND (CONTAINS(wfp.filter_values, @history_FilterParams) OR :#{#filters.historyFilterParams}  = '\"\"' ) \r\n"
			+ " AND (wfp.created_date BETWEEN :#{#filters.startingDate} AND :#{#filters.endingDate}) \r\n"
			+ " AND (wft.approver_code = :#{#filters.approverCode} )) ORDER BY "
			+ " CASE WHEN  :sortParameter = 'docNo ASC'  THEN doc_no END ASC,"
			+ " CASE WHEN  :sortParameter = 'docNo DESC'  THEN doc_no END DESC,"
			+ " CASE WHEN  :sortParameter = 'createdDate ASC' THEN wfp.created_date END ASC, "
			+ " CASE WHEN  :sortParameter = 'createdDate DESC' THEN wfp.created_date END DESC, "
			+ " CASE WHEN  :sortParameter = 'NULL' THEN doc_no END OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY")	
	public List<Object[]> findRecordByProcessIdandOtherFilterParameters(
			@Param("approvalStatus") String approvalStatus,
			@Param("workflowType") String workflowType,
			@Param("locationCode") String locationCode,			
			@Param("filters") DBTaskQueryRequestDTO filters,
			@Param("sortParameter") String sortParameter,
			@Param("offset") int offset,
			@Param("size") int size);	
	
	
	/**
	 * This method will return the Total Count of list of APPROVED OR REJECTED Records for Logged In Approver, Workflow Type, Source Location Code and Other Filters
	 * such as docNo, fiscalYear, approvalStatus etc. This is required for Pagination with Custom Query
	 * 
	 * @param filters with approvalStatus
	 * @param filters with workflowType
	 * @param filters with locationCode
	 * @param filters with DBTaskQueryRequestDTO
	 * @return int
	 */
	@Query(nativeQuery = true, value = "DECLARE @history_FilterParams varchar(500) \r\n" 
			+ " SET @history_FilterParams = :#{#filters.historyFilterParams} \r\n"
			+ " SELECT COUNT(*) FROM (SELECT wft.task_id, wft.task_name, wfp.process_id, wfp.header_data, wfp.workflow_type, wfp.doc_no, wfp.created_date, wfp.fiscal_year, wfp.location_code, wfp.requestor_remarks, wfp.requestor_user_name, wfp.approver_name, wfp.approved_date_time, wfp.approval_status, wft.approver_remarks, wfp.requestor_code, wfp.approver_code \r\n"  
			+ " FROM workflow_process wfp INNER JOIN workflow_task wft ON wfp.process_id=wft.process_id \r\n"
			+ " WHERE wfp.approval_status = :approvalStatus \r\n" 
			+ " AND wfp.workflow_type = :workflowType \r\n"
			+ " AND (:locationCode IS NULL OR wfp.location_code = :locationCode) \r\n" 
			+ " AND (:#{#filters.docNo} IS NULL OR wfp.doc_no = :#{#filters.docNo}) \r\n" 
			+ " AND (:#{#filters.fiscalYear} IS NULL OR wfp.fiscal_year = :#{#filters.fiscalYear}) \r\n"
			+ " AND (CONTAINS(wfp.filter_values, @history_FilterParams) OR :#{#filters.historyFilterParams}  = '\"\"' ) \r\n"  
			+ " AND (wfp.created_date BETWEEN :#{#filters.startingDate} AND :#{#filters.endingDate}) \r\n" 
			+ " AND (wft.approver_code = :#{#filters.approverCode} )) result")
	int getPageSizeTaskApprRejList(@Param("approvalStatus") String approvalStatus,
			@Param("workflowType") String workflowType,
			@Param("locationCode") String locationCode,
			@Param("filters") DBTaskQueryRequestDTO filters);
	
	
	
	
	/* ++++++++++++++++++  PROCESS LIST +++++++++++++++++++++++++++++++++++++*/
	
	/**
	 * This method will return the list of Workflow Process based on Requestor 'locationCode', 'filters' like 'docNo', 'fiscalYear', etc.
	 * and 'offset','size'/
	 *  
	 * @param locationCode
	 * @param filters with DBQueryDto
	 * @param sortParameter
	 * @param offset
	 * @param size
	 * @return List<Object[]>
	 */
	@Query(nativeQuery = true, value = "DECLARE @filter_Params varchar(500) \r\n" 
			+ " SET @filter_Params = :#{#filters.filterParams} \r\n"
			+ " (SELECT wfp.process_id, wfp.workflow_type, wfp.header_data,wfp.approval_status, wfp.approval_level, wfp.doc_no, wfp.fiscal_year, wfp.requestor_remarks, wfp.created_by, wfp.created_date, wfp.last_modified_by, wfp.last_modified_date, wfp.approver_remarks FROM workflow_process wfp \r\n"
			+ " WHERE(wfp.location_code IS NULL OR wfp.location_code = :locationCode) \r\n"
			+ " AND (:#{#filters.approvalStatus} IS NULL OR wfp.approval_status = :#{#filters.approvalStatus}) \r\n"
			+ " AND wfp.workflow_type = :#{#filters.workflowType} \r\n"
			+ " AND (:#{#filters.docNo} IS NULL OR wfp.doc_no = :#{#filters.docNo}) \r\n"
			+ " AND (:#{#filters.fiscalYear} IS NULL OR wfp.fiscal_year = :#{#filters.fiscalYear}) \r\n"
			+ " AND (CONTAINS(wfp.filter_values, @filter_Params) OR :#{#filters.filterParams} = '\"\"' ) \r\n"
			+ " AND (wfp.created_date BETWEEN :#{#filters.startingDate} AND :#{#filters.endingDate})) ORDER BY "
			+ " CASE WHEN  :sortParameter = 'docNo ASC'  THEN doc_no END ASC,"
			+ " CASE WHEN  :sortParameter = 'docNo DESC'  THEN doc_no END DESC,"
			+ " CASE WHEN  :sortParameter = 'NULL' THEN doc_no END OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY")
	public List<Object[]> findAllDetailsByStatusWFTypeLocCode(
			@Param("locationCode") String locationCode,
			@Param("filters") DBQueryDto filters,
			@Param("sortParameter") String sortParameter,
			@Param("offset") int offset,
			@Param("size") int size);
	
	
	
	
	/* ++++++++++++++++++  PROCESS LIST COUNT w.r.t Approval Status and Workflow Type +++++++++++++++++++++++++++++++++++++*/	
	/**
	 * This method will return the Total Count of list of Workflow Process based on Requestor 'locationCode', 'approvalStatus' ,'Workflow Type' and FilterParams
	 *  
	 * @param locationCode
	 * @param filters with DBQueryDto
	 * @return int
	 */
	@Query(nativeQuery = true, value = "DECLARE @filter_Params varchar(500) \r\n" 
			+ " SET @filter_Params = :#{#filters.filterParams} \r\n"
			+ " SELECT COUNT(*) FROM (SELECT wfp.process_id, wfp.workflow_type, wfp.header_data,wfp.approval_status, wfp.approval_level, wfp.doc_no, wfp.fiscal_year, wfp.requestor_remarks, wfp.created_by, wfp.created_date, wfp.last_modified_by, wfp.last_modified_date, wfp.approver_remarks FROM workflow_process wfp \r\n"
			+ " WHERE wfp.location_code = :locationCode \r\n"
			+ " AND (:#{#filters.approvalStatus} IS NULL OR wfp.approval_status = :#{#filters.approvalStatus}) \r\n"
			+ " AND wfp.workflow_type = :#{#filters.workflowType} \r\n"
			+ " AND (:#{#filters.docNo} IS NULL OR wfp.doc_no = :#{#filters.docNo}) \r\n"
			+ " AND (:#{#filters.fiscalYear} IS NULL OR wfp.fiscal_year = :#{#filters.fiscalYear}) \r\n"
			+ " AND (CONTAINS(wfp.filter_values, @filter_Params) OR :#{#filters.filterParams} = '\"\"' ) \r\n"
			+ " AND (wfp.created_date BETWEEN :#{#filters.startingDate} AND :#{#filters.endingDate})) result")
	int getPageSizeProcessList(@Param("locationCode") String locationCode, @Param("filters") DBQueryDto filters);

		
	/**
	 * This method will return the COUNT of Workflow Processes based on Requestor 'locationCode', 'approvalStatus'  and  'locationCode'
	 *  
	 * @param locationCode
	 * @param approvalStatus
	 * @return List<ProcessCountDto>
	 */	
	
	@Query("SELECT new com.titan.poss.workflow.dto.response.ProcessCountDto(wfp.workflowType, wfp.approvalStatus, count(wfp.approvalStatus)) "
			+ " FROM WorkflowProcessDao wfp "
			+ " WHERE wfp.locationCode = :locationCode "
			+ " AND wfp.approvalStatus = :approvalStatus "
			+ " GROUP BY wfp.workflowType,wfp.approvalStatus ORDER BY wfp.workflowType")
				
	List<ProcessCountDto> listProcessCounts(@Param("locationCode") String locationCode, 
								@Param("approvalStatus") String approvalStatus);
	
	
	
	
	
	/**
	 * This method will return the list of Workflow Process based on Requestor 'locationCode', 'requestorUserName', 'processId'  and  'locationCode'
	 *  
	 * @param processId
	 * @param workflowType
	 * @param requestorUserName
	 * @param locationCode
	 * @return WorkflowProcessDao
	 */

	@Query("SELECT wfp FROM WorkflowProcessDao wfp "
			+ " WHERE wfp.processId = :processId "
			+ " AND wfp.workflowType = :workflowType "
			+ " AND wfp.locationCode = :locationCode") 
	WorkflowProcessDao findByProcessIdReqUserLoccode(
									@Param("processId") String processId,
									@Param("workflowType") String workflowType,
									@Param("locationCode") String locationCode);	
	
	/**
	 * This method will return the list of Workflow Process based on Requestor 'processId' and 'workflowType'
	 *  
	 * @param processId
	 * @param workflowType
	 * @return WorkflowProcessDao
	 */

	@Query("SELECT wfp FROM WorkflowProcessDao wfp "
			+ " WHERE wfp.processId = :processId "
			+ " AND wfp.workflowType = :workflowType")
	WorkflowProcessDao findByProcessIdWFType(
									@Param("processId") String processId,
									@Param("workflowType") String workflowType);
	
	
	// Repository Methods for Scheduler Calls Below
	/**
	 * This method will return the List of Requests which are older than configurable number of hours.
	 * 
	 * @param approvalStatus
	 * @param configuredExpirationTime
	 * @return
	 */
	@Query("SELECT wfp FROM WorkflowProcessDao wfp "
			+ " WHERE wfp.approvalStatus = :approvalStatus " 
			+ " AND DATEDIFF(HOUR,wfp.createdDate,CURRENT_TIMESTAMP) > :configuredExpirationTime ")
	List<WorkflowProcessDao> findPendingRequestsOlderThanConfiguredHours(@Param("approvalStatus") String approvalStatus, 
																		 @Param("configuredExpirationTime") Integer configuredExpirationTime);
	
	
	/**
	 * This Repository Method will Update the Status to EXPIRED for the Pending Requests for more than Configurable Number of Hours.
	 * 
	 * @param pendingProcessList
	 * @param approvalStatus
	 */
	
	@Modifying
	@Query("UPDATE WorkflowProcessDao wfp SET wfp.approvalStatus = :approvalStatus, wfp.approverRemarks = :approverRemarks,"
			+ " wfp.approverName = :approverName, wfp.approvedDateTime = :approvedDateTime, wfp.approverCode = :approverCode,"
			+ " wfp.lastModifiedBy = :approverName, wfp.lastModifiedDate = :approvedDateTime"
			+ " WHERE process_id IN (SELECT wfp.processId from WorkflowProcessDao wfp WHERE wfp.approvalStatus = 'PENDING' AND DATEDIFF(HOUR,wfp.createdDate,CURRENT_TIMESTAMP) > :configuredExpirationTime)")
	void updateStatustoExpiredForOlderRequests(@Param("approvalStatus") String approvalStatus,
									@Param("approverRemarks") String approverRemarks,
									@Param("approverName") String approverName,
									@Param("approvedDateTime") Date approvedDateTime,
									@Param("approverCode") String approverCode,
									@Param("configuredExpirationTime") Integer configuredExpirationTime);
	
	/**
	 * This Query will return Process Ids for PENDING status not actioned for more than configurable number of hours.
	 *  
	 */
	@Query("SELECT wfp.processId from WorkflowProcessDao wfp WHERE wfp.approvalStatus = 'PENDING' AND DATEDIFF(HOUR,wfp.createdDate,CURRENT_TIMESTAMP) > :configuredExpirationTime")
	List<String> findPendingRequestsOlderThanConfigurableHours(@Param("configuredExpirationTime") Integer configuredExpirationTime);
}
