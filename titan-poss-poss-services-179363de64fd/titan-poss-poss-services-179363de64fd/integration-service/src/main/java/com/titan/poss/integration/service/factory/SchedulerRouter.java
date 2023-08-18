/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.factory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.support.CronSequenceGenerator;
import org.springframework.stereotype.Component;

import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.EpossApiReqDto;
import com.titan.poss.core.dto.LaunchJobRequest;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.service.clients.FileServiceClient;
import com.titan.poss.core.service.clients.InventoryServiceClient;
import com.titan.poss.core.service.clients.LocationServiceClient;
import com.titan.poss.core.service.clients.ProductServiceClient;
import com.titan.poss.core.service.clients.SalesServiceClient;
import com.titan.poss.core.service.clients.UserServiceClient;
import com.titan.poss.core.service.clients.WorkflowServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.TokenValidatorUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.IntegrationOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.integration.dao.SyncStaging;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.intg.dao.SchedulerAuditDao;
import com.titan.poss.integration.intg.dao.SchedulerHistoryDao;
import com.titan.poss.integration.intg.dao.SchedulerMasterDao;
import com.titan.poss.integration.intg.repository.SchedulerAuditRepository;
import com.titan.poss.integration.intg.repository.SchedulerHistoryRepository;
import com.titan.poss.integration.intg.repository.SchedulerMasterRepository;
import com.titan.poss.integration.repository.IntegrationSyncStagingRepository;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.AuthService;
import com.titan.poss.integration.service.DocumentService;
import com.titan.poss.integration.service.IntegrationJobService;
import com.titan.poss.integration.service.IntegrationSyncDataService;
import com.titan.poss.integration.service.RestClientService;
import com.titan.poss.integration.service.SchedulerAuditService;

import lombok.extern.slf4j.Slf4j;



/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Component
public class SchedulerRouter {

	@Autowired
	private SchedulerMasterRepository schedulerMasterRepository;

	@Autowired
	private SchedulerHistoryRepository schedulerHistoryRepository;

	@Autowired
	private SchedulerAuditRepository schedulerAuditRepository;

	@Autowired
	private FileServiceClient fileServiceClient;

	@Autowired
	private InventoryServiceClient inventoryServiceClient;

	@Autowired
	private UserServiceClient userServiceClient;

	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	@Autowired
	private LocationServiceClient locationServiceClient;

	@Autowired
	private VendorRepository vendorRepository;

	@Autowired
	private AuthService authService;

	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	@Autowired
	private VendorRepository vendorRepo;

	@Autowired
	private SalesServiceClient salesServiceClient;

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Autowired
	private ProductServiceClient productServiceClient;

	@Autowired
	private RestClientService restClientService;

	@Autowired
	private WorkflowServiceClient workflowServiceClient;

	@Autowired
	private IntegrationSyncStagingRepository intergrationSyncRepo;

	@Autowired
	private IntegrationSyncDataService integrationSyncService;

	@Autowired
	private IntegrationJobService integrationJobService;

	@Autowired
	private SchedulerAuditService schedulerAuditService;

	@Value("${app.name}")
	private String appType;

	private String authorizationToken;

	@Autowired
	private DocumentService documentService;

	
	@Async
	public void triggerScheduledJob(String codeStr, String auditId, Date currentDate, boolean manualJob,
			String locationCode, String authorizationToken2, String authorizationCookie) {
		
		log.info("Inside triggerScheduledJob method {}",codeStr);
		if (manualJob) {
			authorizationToken = authorizationToken2;
		} else {
			// if token is not present then using POSS_TITAN token
			if (StringUtils.isEmpty(authorizationToken) || !TokenValidatorUtil.isValidExpVal(authorizationToken)
					|| !TokenValidatorUtil.isValidJWT(authorizationToken, jwtSecret)) {

				authorizationToken = "Bearer " + getToken();
			}
		}
		  log.info("Job code  {} ", codeStr);
		SchedulerCodeEnum code = SchedulerCodeEnum.valueOf(codeStr);
		log.info("code  {} ", code);
		if (codeStr.equalsIgnoreCase(SchedulerCodeEnum.SALES_AB_APPROVAL.name())) {
			authorizationToken = authorizationToken2;
		}
		switch (code) {

		case FILE_MASTER_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.MASTER_INGESTION_JOB,
					authorizationToken, locationCode, authorizationCookie);
			break;
		case FILE_STN_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.STN_JOB, authorizationToken,
					locationCode, authorizationCookie);
			break;
		case FILE_IBT_STN_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.IBT_STN_JOB, authorizationToken,
					locationCode, authorizationCookie);
			 break;
		case FILE_INVOICE_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.INVOICE_JOB, authorizationToken,
					locationCode, authorizationCookie);
			break;
		case FILE_NETCARROTS_JOB:
			log.info("Running FILE_NETCARROTS_JOB............................................{}");
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.NETCARROTS_JOB,
					authorizationToken, locationCode, authorizationCookie);
			break;
		case FILE_GIFT_MASTER_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.GV_INDENT_JOB,
					authorizationToken, locationCode, authorizationCookie);
			break;
		case FILE_GV_REDEMPTION_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.GV_REDEMPTION_JOB,
					authorizationToken, locationCode, authorizationCookie);
			break;
		case FILE_BOUTIQUE_SALES_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.BOUTIQUE_SALES_JOB,
					authorizationToken, locationCode, authorizationCookie);
			break;
		case FILE_BOUTIQUE_REVENUE_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.BOUTIQUE_REVENUE_JOB,
					authorizationToken, locationCode, authorizationCookie);
			break;
		case FILE_DEBIT_NOTE_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.DEBIT_NOTE_JOB,
					authorizationToken, locationCode, authorizationCookie);
			break;
		case FILE_DEBIT_NOTE_L3_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.DEBIT_NOTE_L3_JOB,
					authorizationToken, locationCode, authorizationCookie);
			break;
		case FILE_RETURN_INVOICE_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.RETURN_INVOICE_JOB,
					authorizationToken, locationCode, authorizationCookie);
			break;
		case FILE_TEP_AP_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.TEP_AP_JOB, authorizationToken,
					locationCode, authorizationCookie);
			break;
		case FILE_TEP_TRANSACTION_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.TEP_TRANSACTION_JOB,
					authorizationToken, locationCode, authorizationCookie);
			break;
		case INVENTORY_IBT_CLOSE:
			runInventoryCloseIbtJob(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case INVENTORY_DATA_SYNC:
			runInventoryDataSyncJob(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case CONFIG_DATA_SYNC:
			runConfigDataSyncJob(auditId, currentDate, manualJob, authorizationToken, locationCode);
			break;
		case PAYMENT_DATA_SYNC:
			runPaymentDataSyncJob(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case PRODUCT_DATA_SYNC:
			runProductDataSyncJob(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case USER_RESET_PASSWORD:
			runUserResetPassword(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case USER_DEACTIVATE_PASSWORD:
			runUserDeactivatePassword(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case USER_DEACTIVATE_LOGIN:
			runUserDeactivateLogin(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case USER_REMOVE_TEMP_ROLES:
			runUserRemoveTempRoles(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case USER_ASSIGN_MOBILE:
			runUserAssignMobileNo(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case USER_DATA_SYNC:
			runUserDataSyncJob(auditId, currentDate, manualJob, authorizationToken, locationCode, authorizationCookie);
			break;
		case DATASYNC_PUBLISH_FAILED:
			runDataSyncRetryPublish(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case DATAYSNC_RETRY_FAILED:
			runDataSyncRetryFailedToPersist(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case DATASYNC_HEARTBEAT_CHECK:
			runDataSyncCheckHeartbeat(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case DATASYNC_PUBLISH_RETRY:
			runDataSyncPublish(auditId, currentDate, manualJob, authorizationToken, locationCode, authorizationCookie);
			break;
		case LOCATION_DATA_SYNC:
			runLocationDataSync(auditId, currentDate, manualJob, authorizationToken, locationCode, authorizationCookie);
			break;
		case LOCATION_METAL_RATE_UPDATE:
			runLocationMetalRateUpdate(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case SALES_HOLD_TRANSACTIONS_DELETE:
			runSalesDeleteOpenOrHoldTasks(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case SALES_AB_SUSPEND:
			runSalesSuspendABJob(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case SALES_RO_AIRPAY_PAYMENTS_DELETE:
			runSalesRoAirpayJob(auditId, currentDate, manualJob, authorizationToken, locationCode, authorizationCookie);
			break;
		case SALES_OPEN_TASK_DELETE:
			runSalesClearOpenTasksJob(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case SALES_REMOVE_FROM_RESERVEBIN:
			runSalesRemoveFromReserveBinJob(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case SALES_CREDIT_NOTE_SUSPEND:
			runSalesCreditNoteSuspend(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case SALES_DATA_SYNC:
			runSalesDataSyncJob(auditId, currentDate, manualJob, authorizationToken, locationCode, authorizationCookie);
			break;
		case SALES_AB_APPROVAL:
			runSalesABApprovalJob(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case STORES_DATA_SYNC:
			runStoresDataSyncJob(auditId, currentDate, manualJob, authorizationToken, locationCode);
			break;
		case SALES_PENDING_BILL_CANCEL_DELETE:
			runSalesCancelPendingBillCancelRequests(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case INTEGRATION_EVENT_RETRY_PUBLISH_JOB:
			runIntegrationEventJob(auditId, currentDate, manualJob, authorizationToken, locationCode);
			break;
		case FILE_GENERAL_LEDGER_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.GENERAL_LEDGER_JOB,
					authorizationToken, locationCode, authorizationCookie);
			break;
		case WORKFLOW_EXPIRE_PENDING_REQUESTS_JOB:
			runWorkflowExpirePendingRequestsJob(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case SALES_FILE_SYNC_ONLINE:
			runSalesSyncFileToOnlineStorage(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case INTEGRATION_CLEAR_SCHEDULER_AUDIT:
			runIntegrationClearAuditJob(auditId, currentDate, manualJob, authorizationToken, locationCode);
			break;
		case FILE_CLEAR_FILE_AUDIT:
			runFileClearAuditJob(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;

		case FILE_STOCK_INTERFACE_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.STOCK_INTERFACE_JOB,
					authorizationToken, locationCode, authorizationCookie);
			break;

		case FILE_STUDDED_SPLIT_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.STUDDED_SPLIT_JOB,
					authorizationToken, locationCode, authorizationCookie);
			break;
		case FILE_RETRY_STUDDED_SPLIT_JOB:
			runFileServiceJob(auditId, currentDate, manualJob, FileIntegrationConstants.RETRY_STUDDED_SPLIT_JOB,
					authorizationToken, locationCode, authorizationCookie);
			break;
		case CUSTOMER_DIGITAL_SIGNATURE_DELETION:
			runSalesRemoveDigitalSignatureJob(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case GENERATE_INVOICE_DOCUMENTS:
			runEinvoiceDocumentsGeneration(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case SALES_AB_CO_PAYMENT_CLEAR:
			runSalesAbandCoPaymentClear(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case EA_STN_CONFIRM:
		    runEAStnConfirm(auditId, currentDate, manualJob, authorizationToken, locationCode,authorizationCookie);
		    break;
		case SALES_CLEAR_FROZEN_CREDIT_NOTE :
			clearFrozenDetails(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		case COPY_DB_BACKUP :
			copyBackUpFiles(auditId, currentDate, manualJob, authorizationToken, locationCode,
					authorizationCookie);
			break;
		default:
			throw new ServiceException("Invalid Scheduler code", "ERR-INT-063", codeStr);
		}
	}
	
	private void copyBackUpFiles(String auditId, Date currentDate, boolean manualJob, String authorizationToken2,
			String locationCode, String authorizationCookie) {
		try {
			log.info("in copy backup ");
			String response=documentService.uploadBackupFile();
			updateSchedulerAudit(auditId,JobProcessStatusEnum.COMPLETED.name(), null);
			upsertSchedulerHistory(SchedulerCodeEnum.GENERATE_INVOICE_DOCUMENTS.name(),
					JobProcessStatusEnum.COMPLETED.name(), currentDate, manualJob, locationCode, authorizationToken);
		
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
		
	}

	private void runEAStnConfirm(String auditId, Date currentDate, boolean manualJob, String authorizationToken2,
			String locationCode, String authorizationCookie) {
		 
		try {
			
			SchedulerResponseDto response=inventoryServiceClient.updateStatusStnConfirm(authorizationToken2, authorizationCookie);
			if(response.getStatus().equalsIgnoreCase(JobProcessStatusEnum.COMPLETED.name())) {
				updateSchedulerAudit(auditId, response.getStatus(), null);
				upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
						authorizationToken);
			}
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
		
	}

	private void runEinvoiceDocumentsGeneration(String auditId, Date currentDate, boolean manualJob,
			String authorizationToken, String locationCode, String authorizationCookie) {
		try {
			integrationJobService.eInvoiceRetry(authorizationToken, authorizationCookie);
			updateSchedulerAudit(auditId, JobProcessStatusEnum.COMPLETED.name(), null);
			upsertSchedulerHistory(SchedulerCodeEnum.GENERATE_INVOICE_DOCUMENTS.name(),
					JobProcessStatusEnum.COMPLETED.name(), currentDate, manualJob, locationCode, authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}

	}

	private void runIntegrationEventJob(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode) {
		try {
			SchedulerResponseDto response = integrationJobService.retryFailedEventTransactions();
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runStoresDataSyncJob(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode) {
		try {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.COMPLETED.toString(), null);
			upsertSchedulerHistory(SchedulerCodeEnum.STORES_DATA_SYNC.name(), JobProcessStatusEnum.COMPLETED.toString(),
					currentDate, manualJob, locationCode, authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runProductDataSyncJob(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {

		try {
			SchedulerResponseDto response = inventoryServiceClient.publishToDataSync(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runPaymentDataSyncJob(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {

		try {
			SchedulerResponseDto response = productServiceClient.publishToDataSync(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runSalesCreditNoteSuspend(String auditId, Date currentDate, boolean manualJob,
			String authorizationToken, String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = salesServiceClient.suspendCreditNote(authorizationToken, locationCode,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runConfigDataSyncJob(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode) {
		try {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.COMPLETED.toString(), null);
			upsertSchedulerHistory(SchedulerCodeEnum.CONFIG_DATA_SYNC.name(), JobProcessStatusEnum.COMPLETED.toString(),
					currentDate, manualJob, locationCode, authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runSalesRemoveDigitalSignatureJob(String auditId, Date currentDate, boolean manualJob,
			String authorizationToken, String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = salesServiceClient.deleteDigitalSignatureAtEod(authorizationToken,
					authorizationCookie, locationCode);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runSalesRemoveFromReserveBinJob(String auditId, Date currentDate, boolean manualJob,
			String authorizationToken, String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = salesServiceClient.moveItemsFromReserveBin(authorizationToken,
					authorizationCookie, locationCode);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runFileServiceJob(String auditId, Date currentDate, boolean manualJob, String jobName,
			String authorizationToken, String locationCode, String authorizationCookie) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(jobName);
		if (jobName.equalsIgnoreCase(FileIntegrationConstants.RETURN_INVOICE_JOB) || 
				jobName.equalsIgnoreCase(FileIntegrationConstants.IBT_STN_JOB)) {
			Map<String, String> jobParams = new HashMap<>();
			jobParams.put("scheduler", "true");
			jobRequest.setJobParams(jobParams);
		}
		try {
			log.info("File service call............................................................");
			SchedulerResponseDto response = fileServiceClient.runAJob(authorizationToken, authorizationCookie,
					jobRequest);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runInventoryCloseIbtJob(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {
		try {
			if (appType.equalsIgnoreCase("EPOSS")) {
				SchedulerResponseDto response = inventoryServiceClient.closeUnacceptedRequests(authorizationToken,
						authorizationCookie, locationCode);
				updateSchedulerAudit(auditId, response.getStatus(), null);
				upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
						authorizationToken);
			} else {

				EpossApiReqDto epossApiReqDto = new EpossApiReqDto();
				epossApiReqDto.setHttpMethod(HttpMethod.GET);
				Map<String, String> reqParams = Map.of("locationCode", locationCode);
				epossApiReqDto.setRelativeUrl("api/inventory/v2/jobs/close-open-ibt");
				epossApiReqDto.setRequestParams(reqParams);
				ApiResponseDto apiResponseDto = restClientService.runEPOSSAPIRequest(epossApiReqDto, authorizationToken,
						null);
				if (apiResponseDto.getHttpResponseCode() == 200) {
					updateSchedulerAudit(auditId, JobProcessStatusEnum.COMPLETED.toString(), null);
					upsertSchedulerHistory(SchedulerCodeEnum.INVENTORY_IBT_CLOSE.name(),
							JobProcessStatusEnum.COMPLETED.toString(), currentDate, manualJob, locationCode,
							authorizationToken);
				} else {
					SyncStagingDto syncDto = syncStaggingLocation(locationCode,
							IntegrationOperationCodes.INVENTORY_JOB_IBT);
					integrationSyncService.publishIntegrationMessagesToQueue(syncDto);
					updateSchedulerAudit(auditId, JobProcessStatusEnum.COMPLETED.toString(), null);
					upsertSchedulerHistory(SchedulerCodeEnum.INVENTORY_IBT_CLOSE.name(),
							JobProcessStatusEnum.COMPLETED.toString(), currentDate, manualJob, locationCode,
							authorizationToken);
				}
			}
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	public SyncStagingDto syncStaggingLocation(String locationCode, String operation) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());
		syncDataList.add(DataSyncUtil.createSyncData(locationCode, 0));
		MessageRequest locationMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.SELECTIVE.toString());
		SyncStagingDto locationStagingDto = new SyncStagingDto();
		locationStagingDto.setMessageRequest(locationMsgRequest);
		String locationMsg = MapperUtil.getJsonString(locationMsgRequest);
		SyncStaging locationSyncStaging = new SyncStaging();
		locationSyncStaging.setMessage(locationMsg);
		locationSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		locationSyncStaging = intergrationSyncRepo.save(locationSyncStaging);
		locationStagingDto.setId(locationSyncStaging.getId());
		return locationStagingDto;
	}

	private void runInventoryDataSyncJob(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = inventoryServiceClient.publishToDataSync(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runUserResetPassword(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = userServiceClient.resetUserPassword(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runUserDeactivatePassword(String auditId, Date currentDate, boolean manualJob,
			String authorizationToken, String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = userServiceClient
					.deactivateLoginUserBasedOnPasswordExpiryDate(authorizationToken, authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runUserDeactivateLogin(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = userServiceClient
					.deactivateLoginUserBasedOnlastLoginDate(authorizationToken, authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runUserRemoveTempRoles(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = userServiceClient.removeTempRoles(authorizationToken, authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runUserAssignMobileNo(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = userServiceClient.assignNewMobile(authorizationToken, authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runUserDataSyncJob(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = userServiceClient.publishToDataSync(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runDataSyncRetryPublish(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = dataSyncServiceClient.failedToPublishToQueue(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runDataSyncRetryFailedToPersist(String auditId, Date currentDate, boolean manualJob,
			String authorizationToken, String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = dataSyncServiceClient.retryFailToPersist(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runDataSyncPublish(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = dataSyncServiceClient.publishToDataSync(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runDataSyncCheckHeartbeat(String auditId, Date currentDate, boolean manualJob,
			String authorizationToken, String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = dataSyncServiceClient.checkHeartBeat(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runWorkflowExpirePendingRequestsJob(String auditId, Date currentDate, boolean manualJob,
			String authorizationToken, String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = workflowServiceClient.expirePendingWorkflowRequests(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runLocationDataSync(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = locationServiceClient.publishToDataSync(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runLocationMetalRateUpdate(String auditId, Date currentDate, boolean manualJob,
			String authorizationToken, String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = locationServiceClient.triggerUpdateMaterialRate(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runSalesDeleteOpenOrHoldTasks(String auditId, Date currentDate, boolean manualJob,
			String authorizationToken, String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = salesServiceClient.deleteTasksAtEOD(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runSalesCancelPendingBillCancelRequests(String auditId, Date currentDate, boolean manualJob,
			String authorizationToken, String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = salesServiceClient.cancelPendingBillCancelRequests(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runSalesSyncFileToOnlineStorage(String auditId, Date currentDate, boolean manualJob,
			String authorizationToken, String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = salesServiceClient.syncFileToOnlineStorage(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runSalesSuspendABJob(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = salesServiceClient.suspendBooking(authorizationToken, authorizationCookie,
					locationCode);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runSalesRoAirpayJob(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = salesServiceClient.clearStatus(authorizationToken, authorizationCookie,
					locationCode);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runSalesClearOpenTasksJob(String auditId, Date currentDate, boolean manualJob,
			String authorizationToken, String locationCode, String authorizationCookie) {
		   log.info(" in runSalesClearOpenTasksJob  location code {} ", locationCode);
		try {
			SchedulerResponseDto response = salesServiceClient.deleteOpenTasks(authorizationToken, authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runSalesABApprovalJob(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {

		try {
			SchedulerResponseDto response = salesServiceClient.advanceBookingApproval(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runSalesDataSyncJob(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {

		try {
			SchedulerResponseDto response = salesServiceClient.publishToDataSync(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runIntegrationClearAuditJob(String auditId, Date currentDate, boolean manualJob,
			String authorizationToken, String locationCode) {
		try {
			SchedulerResponseDto response = schedulerAuditService.deleteOldSchedulerAuditData();
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runFileClearAuditJob(String auditId, Date currentDate, boolean manualJob, String authorizationToken,
			String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = fileServiceClient.clearFileAuditData(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}

	private void runSalesAbandCoPaymentClear(String auditId, Date currentDate, boolean manualJob,
			String authorizationToken, String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = salesServiceClient.clearAbCoPayments(authorizationToken,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
	}
	
	private void clearFrozenDetails(String auditId, Date currentDate, boolean manualJob, String authorizationToken2,
			String locationCode, String authorizationCookie) {
		try {
			SchedulerResponseDto response = salesServiceClient.clearFrozenDetails(authorizationToken, locationCode,
					authorizationCookie);
			updateSchedulerAudit(auditId, response.getStatus(), null);
			upsertSchedulerHistory(response.getCode(), response.getStatus(), currentDate, manualJob, locationCode,
					authorizationToken);
		} catch (Exception exception) {
			updateSchedulerAudit(auditId, JobProcessStatusEnum.FAILED.toString(), exception.getMessage());
			if (manualJob) {
				throwScheduelerException(exception);
			}
		}
		
	}


	private void updateSchedulerAudit(String auditId, String response, String exception) {
		Optional<SchedulerAuditDao> schedulerAudit = schedulerAuditRepository.findById(auditId);
		if (!schedulerAudit.isPresent()) {
			throw new ServiceException("Scheduler audit not found", "ERR-INT-065");
		}
		schedulerAudit.get().setEndTime(CalendarUtils.getCurrentDate());
		long totalTime = (schedulerAudit.get().getEndTime().getTime() - schedulerAudit.get().getStartTime().getTime())
				/ 1000;
		schedulerAudit.get().setTotalTime(totalTime);
		schedulerAudit.get().setStatus(response);
		schedulerAudit.get().setException(exception);
		schedulerAuditRepository.save(schedulerAudit.get());
	}

	private void upsertSchedulerHistory(String code, String response, Date currentDate, boolean manualJob,
			String locationCode, String authorizationHeader) {
		if (response.equalsIgnoreCase(JobProcessStatusEnum.COMPLETED.toString())) {
			Optional<SchedulerMasterDao> schedulerMaster = schedulerMasterRepository.findById(code);
			if (!schedulerMaster.isPresent()) {
				throw new ServiceException("Scheduler Master not found", "ERR-INT-064");
			}
			upsertSchedulerHistory(code, currentDate, manualJob, schedulerMaster.get().getCronExpression(),
					locationCode, authorizationHeader);
		}
	}

	private void upsertSchedulerHistory(String code, Date currentDate, boolean manualJob, String cronExpression,
			String locationCode, String authorizationHeader) {

		try {
			// updating scheduler history for manual poss scheduler
			if (!StringUtils.isEmpty(locationCode) && !locationCode.equalsIgnoreCase(CommonConstants.ORG_CODE)) {
				BusinessDayDto businessDay = engineServiceClient.getBusinessDayInProgress(authorizationHeader,
						locationCode);
				Date businessDate = businessDay.getBusinessDate();
				List<SchedulerHistoryDao> schedulerHistories = schedulerHistoryRepository
						.findByCodeAndLocationCode(code, locationCode);
				if (!schedulerHistories.isEmpty()) {
					SchedulerHistoryDao schedulerHistory = schedulerHistories.get(0);
					upsertSchedulerHistory(schedulerHistory, currentDate, null, businessDate, manualJob);
				} else {
					saveNewSchedulerHistory(code, currentDate, null, locationCode, businessDate, manualJob);
				}
			} else {
				updateSchHistory(code, currentDate, manualJob, cronExpression);
			}
		} catch (NullPointerException ex) {
			// updating scheduler history for automatic scheduler
			updateSchHistory(code, currentDate, manualJob, cronExpression);
		}
	}

	private void updateSchHistory(String code, Date currentDate, boolean manualJob, String cronExpression) {
		if (!StringUtils.isEmpty(cronExpression)) {
			CronSequenceGenerator generator = new CronSequenceGenerator(cronExpression);
			Date nextDate = generator.next(currentDate);
			SchedulerHistoryDao schedulerHistory = schedulerHistoryRepository.findByCode(code);
			if (schedulerHistory == null) {
				saveNewSchedulerHistory(code, currentDate, nextDate, null, null, manualJob);
			} else {
				upsertSchedulerHistory(schedulerHistory, currentDate, nextDate, null, manualJob);
			}
		}
	}

	private void saveNewSchedulerHistory(String code, Date currentDate, Date nextDate, String locationCode,
			Date businessDate, boolean manualJob) {

		SchedulerHistoryDao newSchedulerHistory = new SchedulerHistoryDao();
		newSchedulerHistory.setCode(code);
		newSchedulerHistory.setLocationCode(locationCode);
		newSchedulerHistory.setBusinessDate(businessDate);
		newSchedulerHistory.setLastRunTime(currentDate);
		newSchedulerHistory.setNextRunTime(nextDate);
		newSchedulerHistory.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		newSchedulerHistory.setManualJob(manualJob);
		schedulerHistoryRepository.save(newSchedulerHistory);
	}

	private void upsertSchedulerHistory(SchedulerHistoryDao schedulerHistory, Date currentDate, Date nextDate,
			Date businessDate, boolean manualJob) {
		schedulerHistory.setLastRunTime(currentDate);
		schedulerHistory.setNextRunTime(nextDate);
		schedulerHistory.setBusinessDate(businessDate);
		schedulerHistory.setManualJob(manualJob);
		schedulerHistoryRepository.save(schedulerHistory);
	}

	private String getToken() {
		VendorDao vendor = vendorRepository.findByVendorCode(VendorCodeEnum.POSS_TITAN.toString());
		authorizationToken = getAuthHeaderToken(vendor);
		return authorizationToken;
	}

	public String getAuthHeaderToken(VendorDao vendor) {
		List<String> credentials = verifyConfigDetails(vendor);
		String userName = credentials.get(0);
		String password = credentials.get(1);
		String token = credentials.get(2);
		String exp = credentials.get(3);
		boolean isNewTokenReq = false;

		if (!TokenValidatorUtil.isValidExpVal(exp) || !TokenValidatorUtil.isValidJWT(token, jwtSecret)) {
			isNewTokenReq = true;
		}
		if (isNewTokenReq) {
			OAuthToken oauthToken = null;
			oauthToken = authService.getAuthToken(userName, password);
			token = oauthToken.getAccessToken();
			exp = oauthToken.getExpiresAt();

			// save the updated token, expire time
			JsonData jsonData = TokenValidatorUtil.updateApiUserToken(vendor.getVendorDetails(), token, exp);
			vendor.setVendorDetails(MapperUtil.getJsonString(jsonData));

			vendorRepo.save(vendor);
		}
		return token;
	}

	/**
	 * @param vendor
	 * @return
	 */
	private List<String> verifyConfigDetails(VendorDao vendor) {
		String configDetailStr = vendor.getVendorDetails();
		String userName = null;
		String password = null;
		String token = null;
		String exp = null;
		List<String> missingFields = new ArrayList<>();
		if (!StringUtils.isBlank(configDetailStr)) {
			// free space for new password & check last n password to not to match
			Map<String, String> map = TokenValidatorUtil.getMapFromJsonStr(configDetailStr);
			userName = map.get(CommonConstants.USER_NAME);
			password = map.get(CommonConstants.PSWD);
			token = map.get(CommonConstants.TOKEN);
			exp = map.get("exp");
			if (StringUtils.isBlank(userName))
				missingFields.add(CommonConstants.USER_NAME);
			if (StringUtils.isBlank(password))
				missingFields.add(CommonConstants.PSWD);
		} else {
			missingFields = List.of(CommonConstants.USER_NAME, CommonConstants.PSWD);
		}
		if (!missingFields.isEmpty()) {
			throw new ServiceException("Credentials missing for API call to EPOSS.", "ERR-INT-024", missingFields);
		}
		return new ArrayList<>(Arrays.asList(userName, password, token, exp));
	}

	private void throwScheduelerException(Exception exception) {

		if (exception instanceof ServiceException) {
			ServiceException ex = (ServiceException) exception;
			String errCode = ex.getErrorCode();
			String errMssg = ex.getMessage();
			// if code & message is there in response then show service exception
			if (StringUtils.isNotBlank(errCode) && StringUtils.isNotBlank(errMssg)) {
				throw new ServiceException(errMssg, errCode, ex.getErrorDetails());
			}
		}
		throw new ServiceException("Excception while running the scheduler", "ERR-INT-077", exception);
	}

}
