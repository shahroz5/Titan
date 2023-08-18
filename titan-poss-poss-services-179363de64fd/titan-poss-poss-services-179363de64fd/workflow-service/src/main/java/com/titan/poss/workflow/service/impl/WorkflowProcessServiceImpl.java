/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.google.gson.Gson;
import com.titan.poss.core.domain.constant.NotificationConstants;
import com.titan.poss.core.dto.NotificationRequestDto;
import com.titan.poss.core.dto.WorkflowProcessCreateDto;
import com.titan.poss.core.dto.WorkflowProcessCreateResponseDto;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.CancelPendingRequestsResponseDto;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.workflow.camundabpm.CamundaCustomData;
import com.titan.poss.workflow.dao.WorkflowConfigDao;
import com.titan.poss.workflow.dao.WorkflowProcessDao;
import com.titan.poss.workflow.dao.WorkflowTaskDao;
import com.titan.poss.workflow.dto.constants.DateEnum;
import com.titan.poss.workflow.dto.request.ApproverRoleCodeandApproverEmailListDto;
import com.titan.poss.workflow.dto.request.DBQueryDto;
import com.titan.poss.workflow.dto.request.ProcessListFilterRequestDto;
import com.titan.poss.workflow.dto.response.DocNoAndFiscalYearDto;
import com.titan.poss.workflow.dto.response.ProcessCountDto;
import com.titan.poss.workflow.dto.response.WorkflowConfigProcessDto;
import com.titan.poss.workflow.dto.response.WorkflowProcessListDto;
import com.titan.poss.workflow.repository.WorkflowDecisionsRepository;
import com.titan.poss.workflow.repository.WorkflowMasterRepository;
import com.titan.poss.workflow.repository.WorkflowProcessRepository;
import com.titan.poss.workflow.repository.WorkflowTaskRepository;
import com.titan.poss.workflow.service.EngineService;
import com.titan.poss.workflow.service.WorkflowDocMasterService;
import com.titan.poss.workflow.service.WorkflowProcessService;
import com.titan.poss.workflow.util.CamundaDeleteProcessforUserCancellation;
import com.titan.poss.workflow.util.GetBPMNProcessNameUtil;
import com.titan.poss.workflow.util.GetStartDateBasedonInputUtil;
import com.titan.poss.workflow.util.ProcessTaskListUtil;

/**
 * Service Implementation class for Workflow Process.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("workflowProcessServiceImpl")
public class WorkflowProcessServiceImpl implements WorkflowProcessService {

	@Autowired
	private WorkflowMasterRepository workflowMasterRepository;

	@Autowired
	private WorkflowProcessRepository workflowProcessRepository;

	@Autowired
	private WorkflowTaskRepository workflowTaskRepository;

	@Autowired
	private WorkflowDocMasterService workflowDocMasterService;

	@Autowired
	private WorkflowDecisionsRepository workflowDecisionsRepository;

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private EngineServiceClient engineServiceClient;

	@PersistenceContext()
	private EntityManager entityManager;

	@Autowired
	private EngineService engineService;

	@Value("${camunda.rest.host:localhost}")
	private String camundaHostName;

	@Value("${env.name}")
	private String env;

	private static final String ERR_WRF_001 = "ERR-WRF-PROCESS-001";
	private static final String INVALID_PROCESS_ID = "No Records Found!!";
	private static final String INVALID_PID = "Please Try with a valid Workflow Type and its Corresponsing Process ID.";

	private static final String ERR_WRF_002 = "ERR-WRF-PROCESS-002";
	private static final String INVALID_WORKFLOW_TYPE = "The Provided Workflow Type is Invalid. Please Provide a Valid Workflow Type";
	private static final String INVALID_WF = "Please Request with a valid Workflow Type";

	private static final String ERR_WRF_003 = "ERR-WRF-PROCESS-003";
	private static final String CANNOT_UPDATE_DATA_IN_DB = "Cannot Update Data in Database";
	private static final String CANNOT_UPDATE_DATA_IN_DATABASE = "The Request may already be Approved, Rejected, Closed OR Cancelled. Please Try with a valid Request";

	private static final String ERR_WRF_004 = "ERR-WRF-PROCESS-004";
	private static final String MISSING_APPROVER_CONFIGURATIONS_MSG = "The Workflow Decisions Approver Role Code and Approver Email Missing for the Input Workflow. Please Create Relevant Approver Configurations(Role Code and Email) Details for the Input Workflow Type.";
	private static final String MISSING_APPROVER_CONFIGURATIONS_CAUSE = "The Workflow Decisions Approver Role Code and Approver Email Configurations is Missing for the Input Workflow.";

	private static final String APPROVED = "APPROVED";
	private static final String REJECTED = "REJECTED";
	private static final String PENDING = "PENDING";
	private static final String CLOSED = "CLOSED";

	private static final String APPRLOCATIONCODE = "approverLocationCode";

	Logger logger = LoggerFactory.getLogger(WorkflowProcessServiceImpl.class);

	/**
	 * This will Start the Process Instance and return Response to Requestor
	 * 
	 * @param workflowType
	 * @param workflowProcessCreateDto
	 * @return WorkflowProcessCreateResponseDto
	 */
	@Override
	public WorkflowProcessCreateResponseDto createWorkflowProcess(String workflowType,
			WorkflowProcessCreateDto workflowProcessCreateDto) {

		WorkflowConfigDao workflowConfigDao = workflowMasterRepository.findByWorkflowType(workflowType);

		if (workflowConfigDao == null) {
			throw new ServiceException(INVALID_WORKFLOW_TYPE, ERR_WRF_002, INVALID_WF);
		}

		// Create a HashMap to send variables to HashMap
		Map<String, Object> context = new HashMap<>();

		WorkflowConfigProcessDto wfConfigProcessDto = workflowMasterRepository.findRecordByWorkflowType(workflowType);
		int approvalLevel = wfConfigProcessDto.getApprovalLevel();
		Boolean isEditable = wfConfigProcessDto.getIsEditable();
		Boolean isActive = wfConfigProcessDto.getIsActive();

		// Check if the Approver Configuration is already created for input Workflow
		for (int i = 1; i <= approvalLevel; i++) {
			List<ApproverRoleCodeandApproverEmailListDto> list = workflowDecisionsRepository
					.findApproverListByWFTypeAndLevel(workflowType, i);
			if (CollectionUtils.isEmpty(list)) {
				throw new ServiceException(MISSING_APPROVER_CONFIGURATIONS_MSG, ERR_WRF_004,
						MISSING_APPROVER_CONFIGURATIONS_CAUSE);
			}
		}

		Integer docNo = null;
		Short fiscalYear = null;
		// Get Fiscal Year and Doc No below:
		DocNoAndFiscalYearDto docNoAndFiscalYearDto = new DocNoAndFiscalYearDto();
		if (CommonUtil.getStoreCode() != null) {
			docNoAndFiscalYearDto = workflowDocMasterService.getDocNumber(WorkflowTypeEnum.valueOf(workflowType),
					isActive);
			docNo = docNoAndFiscalYearDto.getDocNo();
			logger.info("docNo Generated: {}", docNo);

			fiscalYear = docNoAndFiscalYearDto.getFiscalYear();
			logger.info("fiscalYear: {}", fiscalYear);

			context.put("docNo", docNo.toString());
			context.put("fiscalYear", fiscalYear.toString());
		}

		GetBPMNProcessNameUtil getBPMNProcessNameUtil = new GetBPMNProcessNameUtil();
		String processName = getBPMNProcessNameUtil.getBPMNProcessNameUtilByWorkflowType(workflowType);

		context.put("workflowType", workflowType);
		context.put("requestor", CommonUtil.getAuthUser().getEmployeeName());
		context.put("approvalLevel", approvalLevel);
		context.put("isEditable", isEditable);

		Map<String, String> map = workflowProcessCreateDto.getFilterValues();

		if (!(map == null || map.isEmpty())) {
			for (Map.Entry<String, String> mp : map.entrySet()) {
				context.put(mp.getKey(), mp.getValue());
			}
		}

		JsonData jsonData = MapperUtil.mapObjToClass(workflowProcessCreateDto.getHeaderData(), JsonData.class);
		String approverLocationCode = JsonUtils.getValueFromJsonString(jsonData.getData(), APPRLOCATIONCODE);
		if (approverLocationCode != null && !(approverLocationCode.equals(""))) {
			context.put(APPRLOCATIONCODE, approverLocationCode);
		}

		// For now, we are using '62d8be11.mindtreeonline.onmicrosoft.com@apac.teams.ms'
		// for requestorEmail.
		// Similarly, approverEmail is same for now.
		context.put("requestorEmail", "62d8be11.mindtreeonline.onmicrosoft.com@apac.teams.ms");

		ProcessInstance processInstance = runtimeService.startProcessInstanceByKey(processName, context);
		String processInstanceId = processInstance.getProcessInstanceId();
		logger.info("started instance: {}", processInstanceId);

		// Start the Instance and Save the details in Workflow Process DB once the
		// Approval Request is raised.
		WorkflowProcessDao wfProcessDao = new WorkflowProcessDao();
		wfProcessDao.setProcessId(processInstanceId);
		wfProcessDao.setWorkflowType(workflowType);
		wfProcessDao.setProcessName(processName);
		wfProcessDao.setRequestData(MapperUtil.getStringFromJson(workflowProcessCreateDto.getRequestData()));
		wfProcessDao.setLocationCode(CommonUtil.getAuthUser().getLocationCode());
		wfProcessDao.setRequestorUserName(CommonUtil.getAuthUser().getEmployeeName());
		wfProcessDao.setRequestorRemarks(workflowProcessCreateDto.getRequestorRemarks());
		wfProcessDao.setApprovalStatus(PENDING);
		wfProcessDao.setApprovalLevel(approvalLevel);
		wfProcessDao.setApprovedData(MapperUtil.getStringFromJson(workflowProcessCreateDto.getRequestData()));

		wfProcessDao.setDocNo(docNo);
		wfProcessDao.setFiscalYear(fiscalYear);

		wfProcessDao.setHeaderData(MapperUtil.getStringFromJson(workflowProcessCreateDto.getHeaderData()));
		wfProcessDao.setFilterValues(MapperUtil.getStringFromJson(workflowProcessCreateDto.getFilterValues()));
		wfProcessDao.setRequestorCode(CommonUtil.getEmployeeCode());
		wfProcessDao.setEmailContent(MapperUtil.getStringFromJson(workflowProcessCreateDto.getEmailContent()));

		workflowProcessRepository.save(wfProcessDao);

		WorkflowProcessDao wfDao;
		wfDao = workflowProcessRepository.findByProcessId(processInstanceId);

		// Return Response to Requestor
		WorkflowProcessCreateResponseDto createWFProcessResponse = new WorkflowProcessCreateResponseDto();
		createWFProcessResponse.setProcessId(processInstanceId);
		createWFProcessResponse.setWorkflowType(workflowType);
		createWFProcessResponse.setRequestData(workflowProcessCreateDto.getRequestData());
		createWFProcessResponse.setLocationCode(CommonUtil.getAuthUser().getLocationCode());
		createWFProcessResponse.setApprovalStatus(PENDING);
		createWFProcessResponse.setApprovalLevel(approvalLevel);
		createWFProcessResponse.setRequestorUserName(CommonUtil.getAuthUser().getEmployeeName());
		createWFProcessResponse.setDocNo(wfDao.getDocNo());
		createWFProcessResponse.setFiscalYear(wfDao.getFiscalYear());
		createWFProcessResponse.setRequestedBy(CommonUtil.getAuthUser().getEmployeeName());
		createWFProcessResponse.setRequestedDate(wfDao.getCreatedDate());
		createWFProcessResponse.setRequestorRemarks(workflowProcessCreateDto.getRequestorRemarks());
		createWFProcessResponse.setRequestorCode(CommonUtil.getEmployeeCode());

		// Call to publish event through
		publishNotification(workflowType, wfProcessDao);

		return createWFProcessResponse;
	}

	/**
	 * This method will call publish event based on workflow type.
	 * 
	 * @param workflowType
	 */

	private void publishNotification(String workflowTypeStr, WorkflowProcessDao workflowProcess) {

		WorkflowTypeEnum workflowType = WorkflowTypeEnum.valueOf(workflowTypeStr);

		if (workflowType == WorkflowTypeEnum.APPROVE_RO_PAYMENT) {

			NotificationRequestDto nr = new NotificationRequestDto();
			nr.setNotificationCode(NotificationConstants.REQ_SENT_RO_PAYMENT);
			Map<String, String> prop = new HashMap<>();
			prop.put("REQ_NO", workflowProcess.getDocNo().toString());
			prop.put("REQ_BTQ", workflowProcess.getLocationCode());
			nr.setProperties(prop);
//			engineServiceClient.publishEvent(nr);
		}
	}

	/**
	 * This will fetch the List of Results on the basis of Workflow type, Approval
	 * Status and Requestor UserName and Location Code.
	 * 
	 * @param workflowType
	 * @param status
	 * @param docNo
	 * @param fiscalYear
	 * @param date
	 * @param endDate
	 * @param pageable
	 * @return PagedRestResponse<WorkflowProcessRequestDto>
	 */
	@Override
	public PagedRestResponse<List<WorkflowProcessListDto>> listWorkflowProcess(String workflowType,
			String approvalStatus, ProcessListFilterRequestDto processListFilterRequestDto, Pageable pageable) {

		if (approvalStatus == null)
			approvalStatus = "";
		String filterParams = null;

		if (!(processListFilterRequestDto.getFilterParams() == null
				|| processListFilterRequestDto.getFilterParams().isEmpty())) {

			logger.info("Before null values removal: {}", processListFilterRequestDto.getFilterParams());
			processListFilterRequestDto.getFilterParams().values().removeIf(Objects::isNull);
			logger.info("After null elements removal: {}", processListFilterRequestDto.getFilterParams());

			StringBuilder sb = new StringBuilder();
			processListFilterRequestDto.getFilterParams().forEach(
					(key, value) -> sb.append(" AND JSON_VALUE(filter_values, '$." + key + "') = '" + value + "'"));
			filterParams = sb.toString();
			logger.info("FilterParams: {}", filterParams);
		} else {
			filterParams = "";
		}

		String locationCode = CommonUtil.getAuthUser().getLocationCode();

		// Capture fields on which the records from the DB needs to be filtered.
		GetStartDateBasedonInputUtil getStartDateBasedonInputUtil = new GetStartDateBasedonInputUtil();

		Date startingDate = null;
		Date endingDate = new Date();
		if (processListFilterRequestDto.getDateRangeType() == null) {
			startingDate = getStartDateBasedonInputUtil.getStartDateBasedOnInput(DateEnum.TODAY.toString(),
					processListFilterRequestDto.getStartDate(), processListFilterRequestDto.getEndDate(), startingDate);
		} else {
			startingDate = getStartDateBasedonInputUtil.getStartDateBasedOnInput(
					processListFilterRequestDto.getDateRangeType(), processListFilterRequestDto.getStartDate(),
					processListFilterRequestDto.getEndDate(), startingDate);
		}
		if (DateEnum.CUSTOM.toString().equals(processListFilterRequestDto.getDateRangeType())) {
			endingDate = CalendarUtils.getEndOfDay(processListFilterRequestDto.getEndDate());
		}

		if (DateEnum.ALL.toString().equals(processListFilterRequestDto.getDateRangeType())) {
			startingDate = new Date(1451586600000L);
			endingDate = CalendarUtils.getEndOfDay(new Date());
		}

		String sortParameter = null;
		Optional<Order> order = pageable.getSort().get().findFirst();
		if (order.isPresent()) {
			sortParameter = order.get().getProperty();
			sortParameter += " " + order.get().getDirection().name();
		}
		logger.info("Input Sorting Parameters: {}", sortParameter);

		ProcessTaskListUtil processList = new ProcessTaskListUtil();

		DBQueryDto dbQueryRequestDto;
		dbQueryRequestDto = processList.setDbQueryDto(approvalStatus, workflowType,
				processListFilterRequestDto.getDocNo(), processListFilterRequestDto.getFiscalYear(), startingDate,
				endingDate, filterParams);

		List<String> prepareQueryforProcessList = new ArrayList<>();
		Boolean isCommercial = false;
		ListResponse<String> list = engineService.getRoleList();
		for (String lst : list.getResults()) {
			if (lst.equalsIgnoreCase("COMMERCIAL"))
				isCommercial = true;
		}
		// temporary fix
		if (workflowType.equals(WorkflowTypeEnum.DISCOUNT_CREATION.name()) && isCommercial) {

			prepareQueryforProcessList = processList.createProcessNativeQuery1(locationCode, dbQueryRequestDto,
					sortParameter == null ? "NULL" : sortParameter, pageable.getPageSize() * pageable.getPageNumber(),
					pageable.getPageSize());
		} else {
			prepareQueryforProcessList = processList.createProcessNativeQuery(locationCode, dbQueryRequestDto,
					sortParameter == null ? "NULL" : sortParameter, pageable.getPageSize() * pageable.getPageNumber(),
					pageable.getPageSize());
		}

		Page<Object[]> workflowProcessDaoList = getListDetailsforProcess(prepareQueryforProcessList, pageable);
		List<WorkflowProcessListDto> workflowProcessDtoList = processList.returnWFProcessList(workflowProcessDaoList);

		return new PagedRestResponse<>(workflowProcessDtoList, workflowProcessDaoList);
	}

	/**
	 * This will fetch Result for a given Process Instance Id
	 * 
	 * @param processId
	 * @return WorkflowProcessGetResponseDto
	 */
	@Override
	public WorkflowProcessGetResponseDto getWorkflowProcess(String processId, String workflowType) {

		String locationCode = CommonUtil.getAuthUser().getLocationCode();
		logger.info("Logged In User Location Code: {}", locationCode);

		WorkflowProcessDao workflowProcessDao = workflowProcessRepository.findByProcessIdWFType(processId,
				workflowType);
		if (workflowProcessDao == null) {
			throw new ServiceException(INVALID_PROCESS_ID, ERR_WRF_001, INVALID_PID);
		}

		WorkflowProcessGetResponseDto getWorkflowConfigonProcessId;
		getWorkflowConfigonProcessId = (WorkflowProcessGetResponseDto) MapperUtil.getDtoMapping(workflowProcessDao,
				WorkflowProcessGetResponseDto.class);

		Gson gson = new Gson();
		JsonData approvedData = gson.fromJson(workflowProcessDao.getApprovedData(), JsonData.class);
		JsonData headerData = gson.fromJson(workflowProcessDao.getHeaderData(), JsonData.class);

		String approverLocationCode = JsonUtils.getValueFromJsonString(headerData.getData(), APPRLOCATIONCODE);

		getWorkflowConfigonProcessId.setApprovedData(approvedData);
		getWorkflowConfigonProcessId.setHeaderData(headerData);
		getWorkflowConfigonProcessId.setRequestedDate(workflowProcessDao.getCreatedDate());

		if ((workflowProcessDao.getApprovalStatus().equals(APPROVED))
				|| (workflowProcessDao.getApprovalStatus().equals(REJECTED))
				|| (workflowProcessDao.getApprovalStatus().equals(CLOSED))) {
			getWorkflowConfigonProcessId.setApprovedby(workflowProcessDao.getApproverName());
			getWorkflowConfigonProcessId.setApprovedDate(workflowProcessDao.getApprovedDateTime());
			getWorkflowConfigonProcessId.setApproverRemarks(workflowProcessDao.getApproverRemarks());
			getWorkflowConfigonProcessId.setApproverCode(workflowProcessDao.getApproverCode());

			// Get Approver Location Code from header Data for a given Workflow Type
			getWorkflowConfigonProcessId.setApproverLocationCode(approverLocationCode);
		}

		return getWorkflowConfigonProcessId;
	}

	/**
	 * This will fetch the List of Count w.r.t Workflow type and Status from the
	 * Process DB.
	 * 
	 * @param status
	 * @return ListResponse<ProcessCountDto>
	 */
	@Override
	public ListResponse<ProcessCountDto> getWorkflowProcessCount(String approvalStatus) {

		List<ProcessCountDto> processCount;
		String locationCode = CommonUtil.getAuthUser().getLocationCode();

		processCount = workflowProcessRepository.listProcessCounts(locationCode, approvalStatus);
		return new ListResponse<>(processCount);

	}

	/**
	 * This will Cancel Pending Requests for a given Process Instance Id
	 * 
	 * @param processId
	 * @param workflowType
	 * @return CancelPendingRequestsResponseDto
	 */
	@Override
	public CancelPendingRequestsResponseDto cancelPendingOrCloseApprovedRequests(String processId, String workflowType,
			String approvalStatus) {

		WorkflowProcessDao workflowProcessDao = workflowProcessRepository.findByProcessId(processId);
		if (workflowProcessDao == null) {
			throw new ServiceException(INVALID_WORKFLOW_TYPE, ERR_WRF_002, INVALID_WF);
		}

		CancelPendingRequestsResponseDto cancelPendingRequestsResponseDto = new CancelPendingRequestsResponseDto();

		WorkflowTaskDao wfTask = workflowTaskRepository.findByProcessIdAndLevelAndTaskStatus(processId, 2, "APPROVED");
		// By passing camunda for commercial approver (temporary fix)
		if (workflowProcessDao.getWorkflowType().equalsIgnoreCase("DISCOUNT_CREATION") && wfTask != null) {

			workflowProcessDao.setApprovalStatus(approvalStatus);
			workflowProcessDao.setApproverRemarks("NA");
			workflowProcessDao.setApproverName(CommonUtil.getUserName());
			workflowProcessDao.setApprovedDateTime(new Date());
			workflowProcessDao.setApproverCode(CommonUtil.getEmployeeCode());

			workflowProcessRepository.save(workflowProcessDao);
			cancelPendingRequestsResponseDto.setApprovedby(workflowProcessDao.getApproverName());
			cancelPendingRequestsResponseDto
					.setMsg("The " + approvalStatus + " Request for " + workflowType + " is Completed Successfully!");

		} else {
			// Update the Status in Process and Task Tables to Cancelled for a PENDING
			// Approval Status
			if (workflowProcessDao.getApprovalStatus().equals(PENDING)) {
				try {
					CamundaCustomData camundaCustomData = new CamundaCustomData();
					List<String> taskList = camundaCustomData.returnTaskIdsForaGivenProcessId(processId);

					// Remove the Input Process ID from Camunda Active Processes.
					CamundaDeleteProcessforUserCancellation userCancellationTask = new CamundaDeleteProcessforUserCancellation();
					String status = userCancellationTask.deleteProcessInstanceonUserRequest(processId, camundaHostName);

					// Update the Status in Workflow Process Table to CANCELLED based on Process
					// Instance ID input.
					if (workflowProcessDao.getWorkflowType().equalsIgnoreCase("DISCOUNT_CREATION")) {
						workflowProcessDao.setApprovalStatus(approvalStatus);
					} else {
						workflowProcessDao.setApprovalStatus("CANCELLED");
					}
					workflowProcessDao.setApproverRemarks("NA");
					workflowProcessDao.setApproverName("NA");
					workflowProcessDao.setApprovedDateTime(new Date());
					workflowProcessDao.setApproverCode("NA");

					workflowProcessRepository.save(workflowProcessDao);

					WorkflowConfigDao workflowConfigDao = workflowMasterRepository.findByWorkflowType(workflowType);
					WorkflowTaskDao wfTaskDao = new WorkflowTaskDao();

					for (String taskId : taskList) {
						wfTaskDao.setTaskId(taskId);
						wfTaskDao.setProcessId(processId);
						wfTaskDao.setTaskStatus(status);
						wfTaskDao.setApproverRoleCode("NA");
						wfTaskDao.setApproverUserName("NA");
						wfTaskDao.setApproverRemarks("NA");
						wfTaskDao.setApprovedData("NA");
						wfTaskDao.setTaskName("NA");
						wfTaskDao.setWorkflowType(workflowType);
						wfTaskDao.setApprovalLevel(workflowConfigDao.getApprovalLevel());
						wfTaskDao.setApproverCode("NA");
						workflowTaskRepository.save(wfTaskDao);
					}

					cancelPendingRequestsResponseDto
							.setMsg("The CANCEL Request for " + workflowType + " is Completed Successfully!");
				} catch (Exception e) {
					throw new ServiceException(CANNOT_UPDATE_DATA_IN_DB, ERR_WRF_003, CANNOT_UPDATE_DATA_IN_DATABASE);
				}

			}

			// Update the Status in Process and Task Tables to CLOSED for a APPROVED
			// Approval Status
			// In case of workflow type CANCEL_ADVANCE_BOOKING,rejected state can also be
			// closed
			if (workflowProcessDao.getApprovalStatus().equals(APPROVED)
					|| (workflowProcessDao.getApprovalStatus().equals(REJECTED)
							&& WorkflowTypeEnum.CANCEL_ADVANCE_BOOKING.name().equals(workflowType))
					|| (workflowProcessDao.getApprovalStatus().equals(REJECTED)
							&& WorkflowTypeEnum.ACTIVATE_ADVANCE_BOOKING.name().equals(workflowType))) {
				workflowProcessDao.setApprovalStatus(CLOSED);
				workflowProcessRepository.save(workflowProcessDao);
				cancelPendingRequestsResponseDto
						.setMsg("The CLOSE Request for " + workflowType + " is Completed Successfully!");
			} else if (WorkflowTypeEnum.APPROVE_RO_PAYMENT.name().equals(workflowType)
					&& CLOSED.equals(workflowProcessDao.getApprovalStatus())) {
				// in case of APPROVE_RO_PAYMENT, if request is closed, have to change it back
				// to 'APPROVED' again.
				workflowProcessDao.setApprovalStatus(APPROVED);
				workflowProcessRepository.save(workflowProcessDao);

				cancelPendingRequestsResponseDto
						.setMsg("Reverse CLOSED Request to APPROVED for " + workflowType + " is Completed!");
			}
		}
		return cancelPendingRequestsResponseDto;
	}

	@SuppressWarnings("unchecked")
	public Page<Object[]> getListDetailsforProcess(List<String> query, Pageable pageable) {

		String finalQuery = query.get(0);
		String countQuery = query.get(1);

		List<Object[]> results = entityManager.createNativeQuery(finalQuery).getResultList();

		Query resultList = entityManager.createNativeQuery(countQuery);

		int count = ((Number) resultList.getSingleResult()).intValue();

		return new PageImpl<>(results, pageable, count);

	}

}
