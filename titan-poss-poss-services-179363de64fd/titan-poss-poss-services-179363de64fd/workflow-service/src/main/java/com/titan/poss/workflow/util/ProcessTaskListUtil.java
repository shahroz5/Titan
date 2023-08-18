/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.util;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;

import com.google.gson.Gson;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.workflow.dto.request.DBQueryDto;
import com.titan.poss.workflow.dto.request.DBTaskQueryRequestDTO;
import com.titan.poss.workflow.dto.response.WorkflowProcessListDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class ProcessTaskListUtil {

	private static final String APPROVED = "APPROVED";
	private static final String REJECTED = "REJECTED";
	
	//Below String 'AND" is added for SONAR ISSUE Fix. This is a Part of Query
	private static final String AND = "AND ('";
	
	public List<String> createProcessNativeQuery(String locationCode, DBQueryDto dBQueryDto,
			String sortParameter, int pageNumber,int pageSize) {
		

		String startingDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(CalendarUtils.getStartOfDay(dBQueryDto.getStartingDate()));
		String endingDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(CalendarUtils.getEndOfDay(dBQueryDto.getEndingDate()));
		
		StringBuilder subQuery1 = new StringBuilder("DECLARE @docNoDirection varchar(500) SET @docNoDirection=" + "'" + sortParameter + "'");
		
		StringBuilder subQuery = new StringBuilder(" (SELECT wfp.process_id, wfp.workflow_type, wfp.header_data,wfp.approval_status, wfp.approval_level, wfp.doc_no, wfp.fiscal_year, wfp.requestor_remarks, wfp.requestor_user_name, wfp.created_date, wfp.approver_name, wfp.approved_date_time, wfp.approver_remarks, wfp.requestor_code, wfp.approver_code FROM workflow_process wfp"
						+ " WHERE (wfp.location_code IS NULL OR wfp.location_code = '" + locationCode + "') "
						+ " AND (wfp.approval_status ='" + dBQueryDto.getApprovalStatus() + "' OR '"
						+ dBQueryDto.getApprovalStatus() + "' = '')"
				+ " AND wfp.workflow_type = '" + dBQueryDto.getWorkflowType() + "' "
						+ AND + dBQueryDto.getDocNo() + "' = 'null' OR wfp.doc_no IS NULL OR wfp.doc_no = '"
						+ dBQueryDto.getDocNo() + "' )" + AND + dBQueryDto.getFiscalYear()
						+ "' = 'null' OR wfp.fiscal_year IS NULL OR wfp.fiscal_year = '" + dBQueryDto.getFiscalYear()
						+ "')"
				+ " AND (wfp.created_date BETWEEN '" + startingDate + "' AND '" + endingDate + "')");

		if (!(dBQueryDto.getFilterParams().equalsIgnoreCase(""))) {
			subQuery.append(dBQueryDto.getFilterParams() + ")");
		} else {
			subQuery.append(")");
		}
		
		String countQuery = "SELECT COUNT(*) FROM " + subQuery.toString() + " result";		
		
		
		subQuery.append(" ORDER BY CASE WHEN @docNoDirection = 'docNo ASC' THEN doc_no END ASC,CASE WHEN "
				+ "@docNoDirection = 'docNo DESC ' THEN doc_no END DESC,CASE WHEN @docNoDirection='NULL'"
				+ " THEN doc_no END OFFSET " + pageNumber + " ROWS FETCH NEXT " + pageSize + " ROWS ONLY");
		
		String resultQuery = subQuery1.append(subQuery).toString();
		
		List<String> list = new ArrayList<>();
		list.add(0, resultQuery);
		list.add(1,countQuery);
		
		
		return list;
	}

	public List<WorkflowProcessListDto> returnWFProcessList(Page<Object[]> workflowProcessDaoList) {

		Gson gson = new Gson();

		List<WorkflowProcessListDto> listProcessDetails = new ArrayList<>();

		for (Object[] obj : workflowProcessDaoList) {
			WorkflowProcessListDto wfProcessDto = new WorkflowProcessListDto();
			wfProcessDto.setProcessId((String) obj[0]);
			wfProcessDto.setWorkflowType((String) obj[1]);
			JsonData headerData = gson.fromJson((String) obj[2], JsonData.class);
			wfProcessDto.setHeaderData(headerData);
			wfProcessDto.setApprovalStatus((String) obj[3]);
			wfProcessDto.setApprovalLevel((Integer) obj[4]);
			wfProcessDto.setDocNo((Integer) obj[5]);
			wfProcessDto.setFiscalYear((Short) obj[6]);
			wfProcessDto.setRequestorRemarks((String) obj[7]);
			wfProcessDto.setRequestedBy((String) obj[8]);
			wfProcessDto.setRequestedDate((Date) obj[9]);
			wfProcessDto.setRequestorCode((String) obj[13]);
			if (((String) obj[3]).equals(APPROVED) || (((String) obj[3]).equals(REJECTED))) {
				wfProcessDto.setApprovedBy((String) obj[10]);
				wfProcessDto.setApprovedDate((Date) obj[11]);
				wfProcessDto.setApproverRemarks((String) obj[12]);
				wfProcessDto.setApproverCode((String) obj[14]);
			}			

			listProcessDetails.add(wfProcessDto);
		}

		return listProcessDetails;

	}

	public DBQueryDto setDbQueryDto(String approvalStatus, String  workflowType, Integer docNo,
			Short fiscalYear, Date startingDate, Date endingDate, String filterParams) {
		DBQueryDto setDBQueryDto = new DBQueryDto();

		setDBQueryDto.setApprovalStatus(approvalStatus);
		setDBQueryDto.setWorkflowType(workflowType);
		setDBQueryDto.setDocNo(docNo);
		setDBQueryDto.setFiscalYear(fiscalYear);
		setDBQueryDto.setStartingDate(startingDate);
		setDBQueryDto.setEndingDate(endingDate);
		setDBQueryDto.setFilterParams(filterParams);		

		return setDBQueryDto;
	}
	
	
	public DBTaskQueryRequestDTO setDBTaskQueryRequestDTO(Integer docNo,
			String historyFilterParams, Short fiscalYear, Date startingDate, Date endingDate, String approverCode) {
		DBTaskQueryRequestDTO setDBTaskQueryRequestDTO = new DBTaskQueryRequestDTO();
		setDBTaskQueryRequestDTO.setDocNo(docNo);
		setDBTaskQueryRequestDTO.setHistoryFilterParams(historyFilterParams);
		setDBTaskQueryRequestDTO.setFiscalYear(fiscalYear);
		setDBTaskQueryRequestDTO.setStartingDate(startingDate);
		setDBTaskQueryRequestDTO.setEndingDate(endingDate);
		setDBTaskQueryRequestDTO.setApproverCode(approverCode);		
		
		return setDBTaskQueryRequestDTO;
	}

	/**
	 * @param locationCode
	 * @param dbQueryRequestDto
	 * @param object
	 * @param i
	 * @param pageSize
	 * @return
	 */
	public List<String> createProcessNativeQuery1(String locationCode, DBQueryDto dBQueryDto, String sortParameter,
			int pageNumber, int pageSize) {

		String startingDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
				.format(CalendarUtils.getStartOfDay(dBQueryDto.getStartingDate()));
		String endingDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
				.format(CalendarUtils.getEndOfDay(dBQueryDto.getEndingDate()));

		StringBuilder subQuery1 = new StringBuilder(
				"DECLARE @docNoDirection varchar(500) SET @docNoDirection=" + "'" + sortParameter + "'");

		StringBuilder subQuery = new StringBuilder(
				" (SELECT wfp.process_id, wfp.workflow_type, wfp.header_data,wfp.approval_status, wfp.approval_level, wfp.doc_no, wfp.fiscal_year, wfp.requestor_remarks, wfp.requestor_user_name, wfp.created_date, wfp.approver_name, wfp.approved_date_time, wfp.approver_remarks, wfp.requestor_code, wfp.approver_code FROM workflow_process wfp,"
						+ " workflow_task wt WHERE wt.process_id = wfp.process_id AND wt.level = 2 AND"
						+ "  (wfp.location_code IS NULL OR wfp.location_code = '" + locationCode + "') "
						+ " AND (wfp.approval_status ='" + dBQueryDto.getApprovalStatus() + "' OR '"
						+ dBQueryDto.getApprovalStatus() + "' = '')"
						+ " AND wfp.workflow_type = '" + dBQueryDto.getWorkflowType() + "' " + AND
						+ dBQueryDto.getDocNo() + "' = 'null' OR wfp.doc_no IS NULL OR wfp.doc_no = '"
						+ dBQueryDto.getDocNo() + "' )" + AND + dBQueryDto.getFiscalYear()
						+ "' = 'null' OR wfp.fiscal_year IS NULL OR wfp.fiscal_year = '" + dBQueryDto.getFiscalYear()
						+ "')" + " AND (wfp.created_date BETWEEN '" + startingDate + "' AND '" + endingDate + "')");

		if (!(dBQueryDto.getFilterParams().equalsIgnoreCase(""))) {
			subQuery.append(dBQueryDto.getFilterParams() + ")");
		} else {
			subQuery.append(")");
		}

		String countQuery = "SELECT COUNT(*) FROM " + subQuery.toString() + " result";

		subQuery.append(" ORDER BY CASE WHEN @docNoDirection = 'docNo ASC' THEN doc_no END ASC,CASE WHEN "
				+ "@docNoDirection = 'docNo DESC ' THEN doc_no END DESC,CASE WHEN @docNoDirection='NULL'"
				+ " THEN doc_no END OFFSET " + pageNumber + " ROWS FETCH NEXT " + pageSize + " ROWS ONLY");

		String resultQuery = subQuery1.append(subQuery).toString();

		List<String> list = new ArrayList<>();
		list.add(0, resultQuery);
		list.add(1, countQuery);

		return list;
	}
}
