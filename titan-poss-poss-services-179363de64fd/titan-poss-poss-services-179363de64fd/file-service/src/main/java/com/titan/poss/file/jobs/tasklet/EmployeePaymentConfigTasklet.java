package com.titan.poss.file.jobs.tasklet;

import java.util.ArrayList;
import java.util.List;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.file.dto.EmployeePaymentSyncDto;
import com.titan.poss.file.service.impl.DataSyncServiceImpl;
import com.titan.poss.integration.dao.SyncStaging;
import com.titan.poss.integration.repository.IntegrationSyncStagingRepository;
import com.titan.poss.payment.dao.EmployeePaymentConfigDao;
import com.titan.poss.payment.repository.PaymentMasterRepository;

public class EmployeePaymentConfigTasklet implements Tasklet {

	@Autowired
	private IntegrationSyncStagingRepository integrationSyncStagingRepository;

	@Autowired
	private DataSyncServiceImpl syncDataService;

	@Autowired
	private PaymentMasterRepository paymentMasterRepository;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileId = (String) chunkContext.getStepContext().getJobParameters().get("fileAuditId");
		List<EmployeePaymentConfigDao> paymentConfigs = paymentMasterRepository.findByCorrelationId(fileId);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		EmployeePaymentSyncDto paymentConfigDto = new EmployeePaymentSyncDto();
		List<SyncData> syncDatas = new ArrayList<>();
		syncDatas.add(DataSyncUtil.createSyncData(paymentConfigDto.getSyncDtoList(paymentConfigs), 0));
		List<String> destinations = new ArrayList<>();
//		destinations.add(paymentConfigs.get(0).get());
		MessageRequest messageRequest = DataSyncUtil.createMessageRequest(syncDatas,
				ProductOperationCodes.EMPLOYEE_PAYMENT_CONFIG_ADD, destinations, MessageType.GENERAL.toString(),
				DestinationType.SELECTIVE.toString());
		syncStagingDto.setMessageRequest(messageRequest);
		String requestBody = MapperUtil.getJsonString(messageRequest);
		// saving to staging table
		SyncStaging stagingMessage = new SyncStaging();
		stagingMessage.setMessage(requestBody);
		stagingMessage.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		syncStagingDto.setId(integrationSyncStagingRepository.save(stagingMessage).getId());
		syncDataService.publishProductMessagesToQueue(syncStagingDto, "integration.dbo.sync_staging");

		return RepeatStatus.FINISHED;
	}

}
