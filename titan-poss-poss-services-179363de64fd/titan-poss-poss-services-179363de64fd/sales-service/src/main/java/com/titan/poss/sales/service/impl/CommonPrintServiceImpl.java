/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.CreditNoteSyncDtoExt;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.CustomerDocumentSyncDto;
import com.titan.poss.sales.dto.OrderDetailsSyncDtoExt;
import com.titan.poss.sales.dto.OrderSyncDtoExt;
import com.titan.poss.sales.dto.SalesJobStaggingDto;
import com.titan.poss.sales.dto.SalesTxnSyncDtoExt;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.service.CommonPrintService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.SalesSyncDataService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
@Slf4j
public class CommonPrintServiceImpl implements CommonPrintService {

	@Autowired
	private CustomerDocumentsRepository customerDocumentRepo;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private SalesSyncStagingRepository salesSyncStagingRepository;

	/**
	 * @param customerDocuments
	 */
	@Override
	@Transactional
	public void uploadFileToOnlineBucketAndSaveToDb(CustomerDocumentDto customerDocuments) {

		Boolean onlineUploadStatus = true;
		try {
			uploadFileToOnlineBucket(customerDocuments.getDocumentPath());
		} catch (Exception e) {
			log.debug("Upload File to online bucket failed. Error Message:- " + e.getMessage());
			onlineUploadStatus = false;
		}

		// this method will be used to save the data into DB.
		saveToDB(customerDocuments, onlineUploadStatus);
	}
	
	@Override
	public void uploadFileToOnlineBucket(String documentPath) {
		integrationService.uploadFileToOnlineBucket(documentPath);
	}

	/**
	 * 
	 * @param customerDocuments
	 * @param onlineUploadStatus
	 */
	public void saveToDB(CustomerDocumentDto customerDocuments, Boolean onlineUploadStatus) {

		CustomerDocumentsDao cd = (CustomerDocumentsDao) MapperUtil.getObjectMapping(customerDocuments,
				new CustomerDocumentsDao());

		cd.setId(UUID.randomUUID().toString());
		if (customerDocuments.getCustomerMasterId() != null) {
			CustomerDao customer = new CustomerDao();
			customer.setId(customerDocuments.getCustomerMasterId());
			cd.setCustomer(customer);
		}
		cd.setLocationCode(customerDocuments.getLocationCode());
		cd.setIsSynced(onlineUploadStatus);
		cd.setFileType(customerDocuments.getFileType());
		cd = customerDocumentRepo.save(cd);

		if (onlineUploadStatus) {
			cd.setSrcSyncId(cd.getSrcSyncId() + 1);
			/* cd = customerDocumentRepo.save(cd); */
			List<CustomerDocumentsDao> customerDocsUpdated = new ArrayList<>();
			customerDocsUpdated.add(cd);
			SalesJobStaggingDto jobStaggingDto = new SalesJobStaggingDto();
			jobStaggingDto.setCustomerDocsUpdated(customerDocsUpdated);
			SyncStagingDto syncDto = jobSyncStaging(jobStaggingDto, SalesOperationCode.JOB_CUST_DOCUMENT);
			salesSyncDataService.publishSalesMessagesToQueue(syncDto);
		}

	}

	private SyncStagingDto jobSyncStaging(SalesJobStaggingDto syncData, String operation) {
		SyncStagingDto jobStagingDto = new SyncStagingDto();
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add("EPOSS");

		if (syncData.getCustomerDocsUpdated() != null && !syncData.getCustomerDocsUpdated().isEmpty()) {
			List<CustomerDocumentSyncDto> customerDocSync = syncData.getCustomerDocsUpdated().stream()
					.map(CustomerDocumentSyncDto::new).collect(Collectors.toList());
			syncDataList.add(DataSyncUtil.createSyncData(customerDocSync, 2));
		}

		MessageRequest jobMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.SELECTIVE.toString());
		jobStagingDto.setMessageRequest(jobMsgRequest);
		String jobMsgRqst = MapperUtil.getJsonString(jobMsgRequest);
		SyncStaging jobSyncStaging = new SyncStaging();
		jobSyncStaging.setMessage(jobMsgRqst);
		jobSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		jobSyncStaging = salesSyncStagingRepository.save(jobSyncStaging);
		jobStagingDto.setId(jobSyncStaging.getId());
		return jobStagingDto;
	}
}
