/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.transaction.Transactional;

import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.titan.poss.core.dto.GETTaskListDTO;
import com.titan.poss.core.dto.WorkflowTaskApproveDto;
import com.titan.poss.core.dto.WorkflowTaskDetailsDto;
import com.titan.poss.core.dto.WorkflowTaskListDto;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.workflow.camundabpm.TaskAssignmentListenerEmailApprL1;
import com.titan.poss.workflow.camundabpm.TaskAssignmentListenerEmailApprL2;
import com.titan.poss.workflow.dao.WorkflowProcessDao;
import com.titan.poss.workflow.dao.WorkflowTaskDao;
import com.titan.poss.workflow.dto.constants.WorkflowTaskStatusEnum;
import com.titan.poss.workflow.dto.request.BulkApproverRequestObjectDto;
import com.titan.poss.workflow.dto.request.CamundaDateFormatDto;
import com.titan.poss.workflow.dto.request.CompleteBulkTasksServiceRequestDto;
import com.titan.poss.workflow.dto.request.DBTaskQueryRequestDTO;
import com.titan.poss.workflow.dto.request.ListBulkApprovalsDto;
import com.titan.poss.workflow.dto.response.CamundaGetLISTResponse;
import com.titan.poss.workflow.dto.response.CompleteTaskAllLevelsResponseDto;
import com.titan.poss.workflow.dto.response.ResendEmailResponse;
import com.titan.poss.workflow.dto.response.WorkflowTaskApproveCountDto;
import com.titan.poss.workflow.dto.response.WorkflowTaskIndividualResponse;
import com.titan.poss.workflow.repository.WorkflowProcessRepository;
import com.titan.poss.workflow.repository.WorkflowTaskRepository;
import com.titan.poss.workflow.service.EngineService;
import com.titan.poss.workflow.service.WorkflowTaskService;
import com.titan.poss.workflow.util.CamundaOtherUtils;
import com.titan.poss.workflow.util.CamundaProcessVarFilters;
import com.titan.poss.workflow.util.CamundaRestAPICallforListAndCount;
import com.titan.poss.workflow.util.CompleteTaskAllLevels;
import com.titan.poss.workflow.util.ProcessTaskListUtil;
import com.titan.poss.workflow.util.TaskServiceImplListUtil;

import io.micrometer.core.instrument.util.StringUtils;

/**
 * Service Implementation class for Workflow Task.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("workflowTaskServiceImpl")
public class WorkflowTaskServiceImpl implements WorkflowTaskService {

	@Autowired
	private WorkflowTaskRepository wfTaskRepo;

	@Autowired
	private WorkflowProcessRepository wfProcessRepo;

	@Autowired
	private EngineService engineService;
	
	@Autowired
	TaskAssignmentListenerEmailApprL2 taskAssignmentListenerEmailApprL2;
	
	@Autowired
	TaskAssignmentListenerEmailApprL1 taskAssignmentListenerEmailApprL1;

	@Value("${camunda.rest.host:localhost}")
	private String camundaHostName;

	private static final String ERR_WRF_001 = "ERR-WRF-PROCESS-001";
	private static final String INVALID_PROCESS_ID = "Invalid Process ID";
	private static final String NO_RESULT_FOUND = "NO Records Found with the Input Provided. Please Provide a valid Input.";

	private static final String ERR_WRF_002 = "ERR-WRF-PROCESS-002";
	private static final String CANNOT_UPDATE_DATA_IN_DB = "Cannot Update Data in Process DB. The Process Instance ID is Invalid";
	private static final String DB_CONSTR_VIOLATION = "Database Constraint Violation!! Entry Cannot be Inserted in Few Columns of Database due to Database Constraints.";
	
	private static final Logger LOGGER = Logger.getLogger(WorkflowTaskServiceImpl.class.getName());
	
	/**
	 * This method will Update the Approval Status in both Task and Process Tables
	 * 
	 * @param workflowTaskApproveDto
	 * @param approved
	 * @param taskId
	 * @param processInstanceId
	 * @param taskName
	 * @return WorkflowTaskDetailsDto
	 */

	@Transactional
	@Override
	public WorkflowTaskDetailsDto approveWorkflowTask(WorkflowTaskApproveDto workflowTaskApproveDto, Boolean approved,
			String taskId, String processInstanceId, String taskName) {
		
		if(!approved && StringUtils.isBlank(workflowTaskApproveDto.getApproverRemarks())) {
			throw new ServiceException("Please Provide Remarks. Rejection Remarks is Mandatory!!", "ERR-WRFTASK-008", "Remarks is Mandatory for Request Rejection.");
		}
				
		// Get the Roles for the Logged In User/Approver
		ListResponse<String> list = engineService.getRoleList();
		List<String> approverRoleCodeList = new ArrayList<>();
		for (String lst : list.getResults()) {
			approverRoleCodeList.add(lst);
		}
		
		String approverName =  (CommonUtil.getAuthUser().getEmployeeName().isEmpty() || CommonUtil.getAuthUser().getEmployeeName().isBlank() || CommonUtil.getAuthUser().getEmployeeName() == null) ? "NA" : CommonUtil.getAuthUser().getEmployeeName();
		LOGGER.log(Level.INFO, () -> "'Approver Name': '" + approverName + "'.");
		
		CompleteTaskAllLevelsResponseDto completeTaskAllLevels;

		CompleteTaskAllLevels completeTasks = new CompleteTaskAllLevels();

		completeTaskAllLevels = completeTasks.completeTask(workflowTaskApproveDto.getApproverRemarks(), approved, approverName,
				taskId, processInstanceId, taskName, camundaHostName);

		// Save the details to Task DB
		WorkflowTaskDao wfTaskDao = new WorkflowTaskDao();
		wfTaskDao.setTaskId(taskId);
		wfTaskDao.setProcessId(processInstanceId);
		wfTaskDao.setTaskStatus(completeTaskAllLevels.getStatus());
		wfTaskDao.setLevel(completeTaskAllLevels.getLevel());
		wfTaskDao.setApproverRoleCode(approverRoleCodeList.toString());
		wfTaskDao.setApproverUserName(CommonUtil.getAuthUser().getEmployeeName());
		wfTaskDao.setApproverRemarks(workflowTaskApproveDto.getApproverRemarks());

		wfTaskDao.setApprovedData(MapperUtil.getStringFromJson(workflowTaskApproveDto.getApprovedData()));
		wfTaskDao.setTaskName(taskName);
		wfTaskDao.setWorkflowType(completeTaskAllLevels.getWorkflowType());
		wfTaskDao.setApprovalLevel(completeTaskAllLevels.getApprovalLevel());
		wfTaskDao.setApproverCode(CommonUtil.getEmployeeCode());
		wfTaskRepo.save(wfTaskDao);

		// Update the Status in Workflow Process Table to either APPROVED or REJECTED
		// based on Process Instance ID input.
		WorkflowProcessDao workflowProcessDao = wfProcessRepo.findByProcessId(processInstanceId);
		if (workflowProcessDao != null) {
			if (completeTaskAllLevels.getApprovalLevel() == completeTaskAllLevels.getLevel()) {
				workflowProcessDao.setApprovalStatus(completeTaskAllLevels.getStatus());
				workflowProcessDao.setApproverRemarks(workflowTaskApproveDto.getApproverRemarks());
				workflowProcessDao.setApproverName(CommonUtil.getAuthUser().getEmployeeName());
				workflowProcessDao.setApprovedDateTime(new Date());
				workflowProcessDao.setApproverCode(CommonUtil.getEmployeeCode());
			}
			if ((completeTaskAllLevels.getIsEditable())) {
				workflowProcessDao
						.setApprovedData(MapperUtil.getStringFromJson(workflowTaskApproveDto.getApprovedData()));
			}
			wfProcessRepo.save(workflowProcessDao);
		} else {
			throw new ServiceException(CANNOT_UPDATE_DATA_IN_DB, ERR_WRF_002,DB_CONSTR_VIOLATION );
		}

		// Send The response back to the Approver
		WorkflowTaskDetailsDto wfTaskDetailsDto = new WorkflowTaskDetailsDto();
		wfTaskDetailsDto.setTaskId(taskId);
		wfTaskDetailsDto.setProcessId(processInstanceId);
		wfTaskDetailsDto.setRequestorUserName(completeTaskAllLevels.getRequestor());
		wfTaskDetailsDto.setTaskStatus(completeTaskAllLevels.getStatus());
		wfTaskDetailsDto.setTotalApproverLevels(completeTaskAllLevels.getApprovalLevel());
		wfTaskDetailsDto.setLevel(completeTaskAllLevels.getLevel());
		wfTaskDetailsDto.setApproverRoleCode(approverRoleCodeList.toString());
		wfTaskDetailsDto.setApproverUserName(CommonUtil.getAuthUser().getEmployeeName());
		wfTaskDetailsDto.setApproverRemarks(workflowTaskApproveDto.getApproverRemarks());
		wfTaskDetailsDto.setApproverCode(CommonUtil.getEmployeeCode());
		return wfTaskDetailsDto;

	}

	/**
	 * This method will Return the Paged Response from the Task DB and for APPROVAL
	 * and REJECTED Status. For PENDING status it will fetch from the Camunda DB.
	 * 
	 * @param workflowTaskApproveDto
	 * @param approvalStatus
	 * @param pageable
	 * @return PagedRestResponse<List<WorkflowTaskListDto>>
	 */
	@Override
	public PagedRestResponse<List<WorkflowTaskListDto>> listWorkflowTask(String approvalStatus, String workflowType,
			GETTaskListDTO getTaskListDTO, Pageable pageable) {
		PagedRestResponse<List<WorkflowTaskListDto>> pagedRestResponse = new PagedRestResponse<>();
		
		String apprLocationCode = CommonUtil.getAuthUser().getLocationCode();
		LOGGER.log(Level.INFO, () -> "'Approver: '" + CommonUtil.getAuthUser().getEmployeeCode() + ",'Approver Location Code: '" + apprLocationCode + ".");
		
		// Get the Boutique Location Code from the input FilterParams Map
		String locationCodeInput = null;
		if (!(getTaskListDTO.getFilterParams() == null || getTaskListDTO.getFilterParams().isEmpty())) {
			for (Map.Entry<String, String> mp : getTaskListDTO.getFilterParams().entrySet()) {
				if (mp.getKey().equals("locationCode")) {
					locationCodeInput = mp.getValue();
				}
			}
		}

		TaskServiceImplListUtil taskServiceImplListUtil = new TaskServiceImplListUtil();
		CamundaDateFormatDto camundaDateFormatDto = taskServiceImplListUtil
				.getDateswithFormattingforCamunda(getTaskListDTO);

		// GET LIST for APPROVED or REJECTED Status
		if ((approvalStatus.equals("APPROVED")) || (approvalStatus.equals("REJECTED"))
				|| WorkflowTaskStatusEnum.CLOSED.name().equals(approvalStatus)) {

			String histFilterParams = null;
			
			if(!(getTaskListDTO.getFilterParams() == null || getTaskListDTO.getFilterParams().isEmpty())) {
				StringBuilder sb = new StringBuilder();
				getTaskListDTO.getFilterParams().forEach((key, value) -> {
					sb.append("*");
					sb.append(key);
					sb.append("*");
					sb.append(value);
					sb.append("*");
				});
				histFilterParams = sb.toString();
			} else {
				histFilterParams = "\"\"";
			}
			
			String sortParameter = null;
			Optional<Order> order = pageable.getSort().get().findFirst();
			if (order.isPresent()) {
				sortParameter = order.get().getProperty();
				sortParameter += " " + order.get().getDirection().name();
			}
			
			LOGGER.log(Level.INFO,"Sorting Parameters: {0} ", sortParameter);
				
			DBTaskQueryRequestDTO dBTaskQueryRequestDTO;
			ProcessTaskListUtil processList = new ProcessTaskListUtil();
			dBTaskQueryRequestDTO = processList.setDBTaskQueryRequestDTO(getTaskListDTO.getDocNo(), histFilterParams,
					getTaskListDTO.getFiscalYear(), camundaDateFormatDto.getStartingDate(), camundaDateFormatDto.getEndingDate(), CommonUtil.getEmployeeCode());

			List<Object[]> listJoinRecords = wfProcessRepo.findRecordByProcessIdandOtherFilterParameters(approvalStatus,workflowType,locationCodeInput,
					dBTaskQueryRequestDTO, sortParameter == null ? "NULL" : sortParameter, pageable.getPageSize() * pageable.getPageNumber(),
							pageable.getPageSize());
			int totalPages = wfProcessRepo.getPageSizeTaskApprRejList(approvalStatus,workflowType,locationCodeInput, dBTaskQueryRequestDTO);
			
			LOGGER.log(Level.INFO, () -> "'Total Pages in Records: '," + " " + totalPages + ".");
			
			List<WorkflowTaskListDto> workflowTaskDtoList1;
			workflowTaskDtoList1 = taskServiceImplListUtil.returnWFTaskListApprRej(listJoinRecords);
									
			Page<WorkflowTaskListDto> pagedData = new PageImpl<>(workflowTaskDtoList1,
					PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort()), totalPages);
			pagedRestResponse = new PagedRestResponse<>(workflowTaskDtoList1, pagedData);
			
		}
		

		// GET LIST for PENDING Status
		if ((approvalStatus.equals("PENDING"))) {
						
			List<String> candidateGroups = engineService.getRoleList().getResults();
			LOGGER.log(Level.INFO, () -> "'candidateGroups: '," + " " + candidateGroups + ".");
			List<CamundaGetLISTResponse> camundaGetList;
			
			CamundaOtherUtils camundaOtherUtils = new CamundaOtherUtils();
			CamundaProcessVarFilters camundaProcessVarFilters = camundaOtherUtils.returnApprListFilters(pageable, getTaskListDTO, workflowType, candidateGroups, camundaDateFormatDto, apprLocationCode, camundaHostName);
			
			CamundaRestAPICallforListAndCount camundaAPIListResponse = new CamundaRestAPICallforListAndCount();
			camundaGetList = camundaAPIListResponse.pendingTaskLists(camundaProcessVarFilters);
			List<WorkflowTaskListDto> workflowTaskDtoListFinal = new ArrayList<>();
			
			List<String> pendingProcessList = new ArrayList<>();
			for(CamundaGetLISTResponse pendingPIDs: camundaGetList) {
				pendingProcessList.add(pendingPIDs.getProcessInstanceId());
			}			
			if(!pendingProcessList.isEmpty()) {
				LOGGER.log(Level.INFO, () -> "'Pending Process Lists: '," + " " + pendingProcessList + ".");
				Page<WorkflowProcessDao> listOnPendingProcessIds = wfProcessRepo.findPendingListforApprover(pendingProcessList, pageable);
				
				int totalElements = (int) listOnPendingProcessIds.getTotalElements();
				LOGGER.log(Level.INFO, () -> "'Total No. of Elements from Repository: '," + " " + totalElements + ".");
				for(WorkflowProcessDao wfPDAO : listOnPendingProcessIds.getContent()) {
					for(CamundaGetLISTResponse lst : camundaGetList) {
						if(wfPDAO.getProcessId().equalsIgnoreCase(lst.getProcessInstanceId())) {
							WorkflowTaskListDto wfTaskDto = taskServiceImplListUtil.getPendingTaskList(lst, wfPDAO);
							workflowTaskDtoListFinal.add(wfTaskDto);
						}
					}
				}
				LOGGER.log(Level.INFO, () -> "Pending Consolidated LIST Retrieved: " + " " + workflowTaskDtoListFinal + ".");
				
				Page<WorkflowTaskListDto> pagedData = new PageImpl<>(workflowTaskDtoListFinal,
						PageRequest.of(pageable.getPageNumber(), pageable.getPageSize()), totalElements);
				
				pagedRestResponse = (new PagedRestResponse<>(workflowTaskDtoListFinal, pagedData));
			}
			else {
				int totalElements = 0;
				Page<WorkflowTaskListDto> pagedData = new PageImpl<>(workflowTaskDtoListFinal,
						PageRequest.of(pageable.getPageNumber(), pageable.getPageSize()), totalElements);
				
				pagedRestResponse = (new PagedRestResponse<>(workflowTaskDtoListFinal, pagedData));
			}
						
		}

		return pagedRestResponse;
	}

	/**
	 * This method will Return the Individual Response from the DB.
	 * 
	 * @param taskId
	 * @param processId
	 * @param workflowType
	 * @param taskName
	 * @return WorkflowTaskIndividualResponse
	 */
	@Override
	public WorkflowTaskIndividualResponse getWorkflowTask(String taskId, String processId, String taskName,
			String workflowType) {

		WorkflowProcessDao workflowProcessDao = wfProcessRepo.findByProcessId(processId);
		if (workflowProcessDao == null) {
			throw new ServiceException(INVALID_PROCESS_ID, ERR_WRF_001,NO_RESULT_FOUND);
		}
		
		WorkflowTaskIndividualResponse wfIndividualTask;

		wfIndividualTask = (WorkflowTaskIndividualResponse) MapperUtil.getDtoMapping(workflowProcessDao,
				WorkflowTaskIndividualResponse.class);
		wfIndividualTask.setTaskId(taskId);
		wfIndividualTask.setTaskName(taskName);

		Gson gson = new Gson();
		JsonData headerData = gson.fromJson(workflowProcessDao.getHeaderData(), JsonData.class);
		JsonData approvedData = gson.fromJson(workflowProcessDao.getApprovedData(), JsonData.class);
		wfIndividualTask.setHeaderData(headerData);
		wfIndividualTask.setApprovedData(approvedData);
		wfIndividualTask.setDocNo(workflowProcessDao.getDocNo());
		wfIndividualTask.setLocationCode(workflowProcessDao.getLocationCode());
		wfIndividualTask.setRequestorCode(workflowProcessDao.getRequestorCode());
		wfIndividualTask.setApprovedBy(workflowProcessDao.getApproverName());
		wfIndividualTask.setApproverCode(workflowProcessDao.getApproverCode());
		wfIndividualTask.setRequestedDate(workflowProcessDao.getCreatedDate());
		wfIndividualTask.setApprovedDate(workflowProcessDao.getApprovedDateTime());

		return wfIndividualTask;
	}
	
	

	/**
	 * This method will Return the COUNT from the Task DB and for APPROVAL and
	 * REJECTED Status. For PENDING status it will fetch from the Camunda DB.
	 * 
	 * @param approvalStatus
	 * @param workflowTypeList
	 * @return ListResponse<WorkflowTaskApproveCountDto>
	 */
	@Override
	public ListResponse<WorkflowTaskApproveCountDto> getWorkflowTaskCount(String approvalStatus,
			List<String> workflowTypeList) {

		List<WorkflowTaskApproveCountDto> wfTaskApproverCount = new ArrayList<>();

		if ((approvalStatus.equals("APPROVED")) || (approvalStatus.equals("REJECTED"))) {
			String approverUserName = CommonUtil.getEmployeeCode();
			wfTaskApproverCount = wfTaskRepo.listTaskCounts(approvalStatus, approverUserName);
		}

		if ((approvalStatus.equals("PENDING"))) {

			ListResponse<String> list = engineService.getRoleList();
			List<String> candidateGroups = new ArrayList<>();
			for (String lst : list.getResults()) {
				candidateGroups.add(lst);
			}

			CamundaRestAPICallforListAndCount camundaAPIResponse = new CamundaRestAPICallforListAndCount();

			for (String wfTypeList : workflowTypeList) {
				wfTaskApproverCount.add(camundaAPIResponse.pendingCount(wfTypeList, candidateGroups, camundaHostName));
			}
		}

		return new ListResponse<>(wfTaskApproverCount);
	}

	
	
	/**
	 * This method will Complete the Approvals in Bulk and will update the
	 * Corresponding Status in Process and Task Tables.
	 * 
	 * @param approverRemarks
	 * @param listBulkApprovalsDto
	 * @return List<WorkflowTaskDetailsDto>
	 */
	@Transactional
	@Override
	public List<WorkflowTaskDetailsDto> approveWorkflowTasks(ListBulkApprovalsDto listBulkApprovalsDto) {

		List<WorkflowTaskDetailsDto> listBulkApprovalResponse = new ArrayList<>();

		for (BulkApproverRequestObjectDto taskListBulk : listBulkApprovalsDto.getBulkApproverRequestObjectDto()) {

			// Get the Roles for the Logged In User/Approver
			ListResponse<String> list = engineService.getRoleList();
			List<String> approverRoleCodeList = new ArrayList<>();
			for (String lst : list.getResults()) {
				approverRoleCodeList.add(lst);
			}
			
			String approverName =  (CommonUtil.getAuthUser().getEmployeeName().isEmpty() || CommonUtil.getAuthUser().getEmployeeName().isBlank() || CommonUtil.getAuthUser().getEmployeeName() == null) ? "NA" : CommonUtil.getAuthUser().getEmployeeName();
			LOGGER.log(Level.INFO, () -> "'Approver Name': '" + approverName + "'.");
			
			CompleteBulkTasksServiceRequestDto completeBulkTasksServiceRequestDto = new CompleteBulkTasksServiceRequestDto();
			CompleteTaskAllLevelsResponseDto completeTaskAllLevelsResponseDto = completeBulkTasksServiceRequestDto
					.completeBulkTasks(taskListBulk.getApproverRemarks(), taskListBulk.getApproved(), approverName,
							taskListBulk.getProcessId(), taskListBulk.getTaskId(), taskListBulk.getTaskName(),
							camundaHostName);

			// Save the details to Task DB
			WorkflowTaskDao wfTaskDao = new WorkflowTaskDao();
			wfTaskDao.setTaskId(taskListBulk.getTaskId());
			wfTaskDao.setProcessId(taskListBulk.getProcessId());
			wfTaskDao.setTaskStatus(completeTaskAllLevelsResponseDto.getStatus());
			wfTaskDao.setLevel(completeTaskAllLevelsResponseDto.getLevel());
			wfTaskDao.setApproverRoleCode(approverRoleCodeList.toString());
			wfTaskDao.setApproverUserName(CommonUtil.getAuthUser().getEmployeeCode());
			wfTaskDao.setApproverRemarks(taskListBulk.getApproverRemarks());
			wfTaskDao.setTaskName(taskListBulk.getTaskName());
			wfTaskDao.setWorkflowType(completeTaskAllLevelsResponseDto.getWorkflowType());
			wfTaskDao.setApprovalLevel(completeTaskAllLevelsResponseDto.getApprovalLevel());
			wfTaskDao.setApproverCode(CommonUtil.getEmployeeCode());
			wfTaskRepo.save(wfTaskDao);

			// Update the Status in Workflow Process Table to either APPROVED or REJECTED
			// based on Process Instance ID input List.
			WorkflowProcessDao workflowProcessDao = wfProcessRepo.findByProcessId(taskListBulk.getProcessId());
			if (workflowProcessDao != null) {
				if (completeTaskAllLevelsResponseDto.getApprovalLevel() == completeTaskAllLevelsResponseDto
						.getLevel()) {
					workflowProcessDao.setApprovalStatus(completeTaskAllLevelsResponseDto.getStatus());
					workflowProcessDao.setApproverRemarks(taskListBulk.getApproverRemarks());
					workflowProcessDao.setApproverName(CommonUtil.getAuthUser().getEmployeeName());					
					workflowProcessDao.setApprovedDateTime(new Date());
					workflowProcessDao.setApproverCode(CommonUtil.getEmployeeCode());
				}

				wfProcessRepo.save(workflowProcessDao);
			} else {
				throw new ServiceException(CANNOT_UPDATE_DATA_IN_DB, ERR_WRF_002,DB_CONSTR_VIOLATION);
			}

			// Send The response back to the Approver
			WorkflowTaskDetailsDto wfTaskDetailsDto = new WorkflowTaskDetailsDto();
			wfTaskDetailsDto.setTaskId(taskListBulk.getTaskId());
			wfTaskDetailsDto.setProcessId(taskListBulk.getProcessId());
			wfTaskDetailsDto.setRequestorUserName(completeTaskAllLevelsResponseDto.getRequestor());
			wfTaskDetailsDto.setTaskStatus(completeTaskAllLevelsResponseDto.getStatus());
			wfTaskDetailsDto.setTotalApproverLevels(completeTaskAllLevelsResponseDto.getApprovalLevel());
			wfTaskDetailsDto.setLevel(completeTaskAllLevelsResponseDto.getLevel());
			wfTaskDetailsDto.setApproverRoleCode(approverRoleCodeList.toString());
			wfTaskDetailsDto.setApproverUserName(CommonUtil.getAuthUser().getEmployeeName());
			wfTaskDetailsDto.setApproverRemarks(taskListBulk.getApproverRemarks());
			wfTaskDetailsDto.setApproverCode(CommonUtil.getEmployeeCode());
			// Add the Response Object for Bulk Approval to the Response List
			listBulkApprovalResponse.add(wfTaskDetailsDto);
		}

		return listBulkApprovalResponse;

	}

	@Override
	public List<WorkflowTaskDetailsDto> getWorkflowTasks(String processId, String workflowType) {
		List<WorkflowTaskDao> taskList = wfTaskRepo.findAllByProcessIdAndWorkflowTypeAndTaskStatus(processId,workflowType,"REJECTED");
		List<WorkflowTaskDetailsDto> taskListResponce = new ArrayList<>();
		if(!taskList.isEmpty()) {
			taskList.forEach(task->{
				WorkflowTaskDetailsDto wfTaskDto = new WorkflowTaskDetailsDto();
				wfTaskDto.setTaskId(task.getTaskId());
				wfTaskDto.setProcessId(task.getProcessId());
				wfTaskDto.setTaskStatus(task.getTaskStatus());
				wfTaskDto.setTotalApproverLevels(task.getApprovalLevel());
				wfTaskDto.setLevel(task.getLevel());
				wfTaskDto.setApproverRoleCode(task.getApproverRoleCode());
				wfTaskDto.setApproverUserName(task.getApproverUserName());
				wfTaskDto.setApproverRemarks(task.getApproverRemarks());
				wfTaskDto.setApproverCode(task.getApproverCode());
				taskListResponce.add(wfTaskDto);
			});
			
		}
		return taskListResponce;
	}
	
	@Override
	public ResendEmailResponse resendEmailLinkForDiscount(String processId,Pageable pageable) {
		
		String response = null;
		
		TaskServiceImplListUtil taskServiceImplListUtil = new TaskServiceImplListUtil();
		
		List<String> candidateGroups = new ArrayList<>();
		candidateGroups.add("CATEGORY-MANAGER");
		candidateGroups.add("HEAD-MERCHANDISING");
		
		List<CamundaGetLISTResponse> camundaGetList;
		
		CamundaOtherUtils camundaOtherUtils = new CamundaOtherUtils();
		CamundaProcessVarFilters camundaProcessVarFilters = camundaOtherUtils.returnApprListFilters(pageable, null, WorkflowTypeEnum.DISCOUNT_CREATION.name(), candidateGroups, null, null, camundaHostName);
		
		CamundaRestAPICallforListAndCount camundaAPIListResponse = new CamundaRestAPICallforListAndCount();
		camundaGetList = camundaAPIListResponse.pendingTaskLists(camundaProcessVarFilters);
		List<WorkflowTaskListDto> workflowTaskDtoListFinal = new ArrayList<>();
		
		List<String> pendingProcessList = new ArrayList<>();
		for(CamundaGetLISTResponse pendingPIDs: camundaGetList) {
			pendingProcessList.add(pendingPIDs.getProcessInstanceId());
		}	
		
		if(!pendingProcessList.isEmpty()) {
			LOGGER.log(Level.INFO, () -> "'Pending Process Lists: '," + " " + pendingProcessList + ".");
			WorkflowProcessDao processDao = wfProcessRepo.findByProcessId(processId);
			
				for(CamundaGetLISTResponse lst : camundaGetList) {
					if(lst.getProcessInstanceId().equalsIgnoreCase(processId)) {
						WorkflowTaskListDto wfTaskDto = taskServiceImplListUtil.getPendingTaskList(lst, processDao);
						workflowTaskDtoListFinal.add(wfTaskDto);
					}
				}
			LOGGER.log(Level.INFO, () -> "Pending Consolidated LIST Retrieved: " + " " + workflowTaskDtoListFinal + ".");
			
			if(!workflowTaskDtoListFinal.isEmpty()) {
				if(workflowTaskDtoListFinal.size()==2) {
					for(WorkflowTaskListDto task :workflowTaskDtoListFinal) {
						if(task.getTaskName().equalsIgnoreCase("REQUEST_APPROVER_L1")) {
							response = sendMailToL1Approval(task);
						}
					}					
				}else if(workflowTaskDtoListFinal.size() ==1) {
					if(workflowTaskDtoListFinal.get(0).getTaskName().equalsIgnoreCase("REQUEST_APPROVER_L1")) {
						response = sendMailToL1Approval(workflowTaskDtoListFinal.get(0));
					}else {
						response = sendMailToL2Approval(workflowTaskDtoListFinal.get(0));
					}
				}
			}else {
				response = "There are no pending Email approvals for this request";
			}
			
		}
		else {
			response = "No Pending Email approvals";
		}
		ResendEmailResponse resendEmailResponse = new ResendEmailResponse();
		resendEmailResponse.setResponse(response);
		
		return resendEmailResponse;
	}



	private String sendMailToL2Approval(WorkflowTaskListDto workflowTaskListDto) {
	taskAssignmentListenerEmailApprL2.sendEmaillToApprL2(WorkflowTypeEnum.DISCOUNT_CREATION.name(), workflowTaskListDto.getTaskId(), workflowTaskListDto.getTaskName(), workflowTaskListDto.getProcessId(), null,null);
		return "Email successfully sent to Approver 2";
	}



	private String sendMailToL1Approval(WorkflowTaskListDto workflowTaskListDto) {
		taskAssignmentListenerEmailApprL1.sendEmaillToApprL1(WorkflowTypeEnum.DISCOUNT_CREATION.name(), workflowTaskListDto.getTaskId(), workflowTaskListDto.getTaskName(), workflowTaskListDto.getProcessId(), null,null);
		return "Email successfully sent to Approver 1";
	}

}
