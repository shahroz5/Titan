/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.util;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.google.gson.Gson;
import com.titan.poss.core.dto.GETTaskListDTO;
import com.titan.poss.core.dto.WorkflowTaskListDto;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.workflow.dao.WorkflowProcessDao;
import com.titan.poss.workflow.dto.constants.DateEnum;
import com.titan.poss.workflow.dto.request.CamundaDateFormatDto;
import com.titan.poss.workflow.dto.response.CamundaGetLISTResponse;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class TaskServiceImplListUtil {

	public CamundaDateFormatDto getDateswithFormattingforCamunda(GETTaskListDTO getTaskListDTO) {

		CamundaDateFormatDto camundaDateFormatDto = new CamundaDateFormatDto();
		// Capture fields on which the records from the DB needs to be filtered.
		GetStartDateBasedonInputUtil getStartDateBasedonInputUtil = new GetStartDateBasedonInputUtil();

		Date startingDate = null;
		Date endingDate = CalendarUtils.getTodayEndDateAndTime();
		if (getTaskListDTO.getDateRangeType() == null) {
			startingDate = getStartDateBasedonInputUtil.getStartDateBasedOnInput(DateEnum.TODAY.toString(),
					getTaskListDTO.getStartDate(), getTaskListDTO.getEndDate(), startingDate);
		} else {
			startingDate = getStartDateBasedonInputUtil.getStartDateBasedOnInput(getTaskListDTO.getDateRangeType(),
					getTaskListDTO.getStartDate(), getTaskListDTO.getEndDate(), startingDate);
		}
		if (DateEnum.CUSTOM.toString().equals(getTaskListDTO.getDateRangeType())) {
			endingDate = CalendarUtils.getEndOfDay(getTaskListDTO.getEndDate());
		}

		if (DateEnum.ALL.toString().equals(getTaskListDTO.getDateRangeType())) {
			startingDate = new Date(1451586600000L);
			endingDate = CalendarUtils.getEndOfDay(new Date());
		}

		Date startDate = startingDate;
		Date endDate = endingDate;

		String createdAfter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(startDate);
		String createdBefore = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(endDate);

		camundaDateFormatDto.setStartingDate(startingDate);
		camundaDateFormatDto.setEndingDate(endingDate);
		camundaDateFormatDto.setCreatedAfter(createdAfter);
		camundaDateFormatDto.setCreatedBefore(createdBefore);

		return camundaDateFormatDto;
	}
	
	
	// Prepare a List of Paged List Dto for Tasks List API for APPROVED OR REJECTED Status
	public List<WorkflowTaskListDto> returnWFTaskListApprRej(List<Object[]> workflowTaskListDto) {

		Gson gson = new Gson();

		List<WorkflowTaskListDto> listTaskApprRejDetails = new ArrayList<>();

		for (Object[] obj : workflowTaskListDto) {
			WorkflowTaskListDto wfTaskListDto = new WorkflowTaskListDto();
			wfTaskListDto.setTaskId((String) (obj[0]));
			wfTaskListDto.setTaskName((String) (obj[1]));
			wfTaskListDto.setProcessId((String) (obj[2]));

			JsonData headerData = gson.fromJson((String) (obj[3]), JsonData.class);
			wfTaskListDto.setHeaderData(headerData);

			wfTaskListDto.setWorkflowType((String) (obj[4]));
			wfTaskListDto.setDocNo((Integer) (obj[5]));
			wfTaskListDto.setDocDate((Date) (obj[6]));
			wfTaskListDto.setFiscalYear((Short) (obj[7]));
			wfTaskListDto.setLocationCode((String) (obj[8]));
			wfTaskListDto.setRequestorRemarks((String) (obj[9]));
			wfTaskListDto.setRequestedBy((String) (obj[10]));
			wfTaskListDto.setRequestedDate((Date) (obj[6]));
			wfTaskListDto.setApprovedBy((String) (obj[11]));
			wfTaskListDto.setApprovedDate((Date) (obj[12]));
			wfTaskListDto.setApproverRemarks((String) (obj[14]));
			wfTaskListDto.setApprovalStatus((String) (obj[13]));
			wfTaskListDto.setRequestorCode((String) (obj[15]));
			wfTaskListDto.setApproverCode((String) (obj[16]));
			if (!StringUtil.isBlankJsonStr((String) (obj[17]))) {
				wfTaskListDto.setApprovedData(MapperUtil.mapObjToClass((String) (obj[17]), JsonData.class));
			}

			listTaskApprRejDetails.add(wfTaskListDto);
		}

		return listTaskApprRejDetails;

	}

	// Set the Task List for PENDING LIST
	public WorkflowTaskListDto getPendingTaskList(CamundaGetLISTResponse lst, WorkflowProcessDao wfDao) {
		WorkflowTaskListDto wfTaskDto = new WorkflowTaskListDto();
		wfTaskDto.setTaskId(lst.getId());
		wfTaskDto.setTaskName(lst.getName());
		wfTaskDto.setProcessId(wfDao.getProcessId());

		Gson gson = new Gson();

		JsonData headerData = gson.fromJson(wfDao.getHeaderData(), JsonData.class);

		wfTaskDto.setHeaderData(headerData);

		wfTaskDto.setWorkflowType(wfDao.getWorkflowType());
		wfTaskDto.setDocNo(wfDao.getDocNo());
		wfTaskDto.setDocDate(wfDao.getCreatedDate());
		wfTaskDto.setFiscalYear(wfDao.getFiscalYear());
		wfTaskDto.setLocationCode(wfDao.getLocationCode());
		wfTaskDto.setRequestorRemarks(wfDao.getRequestorRemarks());
		wfTaskDto.setRequestedBy(wfDao.getRequestorUserName());
		wfTaskDto.setRequestedDate(wfDao.getCreatedDate());
		wfTaskDto.setApprovalStatus(wfDao.getApprovalStatus());
		wfTaskDto.setRequestorCode(wfDao.getRequestorCode());

		return wfTaskDto;
	}
}
