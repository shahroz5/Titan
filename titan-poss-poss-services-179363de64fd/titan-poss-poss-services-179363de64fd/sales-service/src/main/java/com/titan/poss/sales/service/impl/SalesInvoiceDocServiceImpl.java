/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.sales.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.sales.dao.SalesInvoiceDocumentsDao;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.SalesInvoiceDocsSyncDto;
import com.titan.poss.sales.repository.SalesInvoiceDocumentsRepository;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.service.SalesInvoiceDocService;
import com.titan.poss.sales.service.SalesSyncDataService;

/**
 * Service class for Sales Invoice Doc.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesInvoiceDocService")
public class SalesInvoiceDocServiceImpl implements SalesInvoiceDocService {

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private SalesSyncDataService salesSyncDataService;
	
	@Autowired
	private SalesInvoiceDocumentsRepository salesInvoiceDocumentsRepository;

	@Value("${app.name}")
	private String appName;

	public void syncDataInvoiceDocs(SalesInvoiceDocumentsDao salesInvoiceDocuments) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			SalesInvoiceDocumentsDao salesInvoiceDocDao = salesInvoiceDocumentsRepository.save(salesInvoiceDocuments);
			List<SalesInvoiceDocsSyncDto> syncDtoList = new ArrayList<>();
			syncDtoList.add(new SalesInvoiceDocsSyncDto(salesInvoiceDocDao));
			syncDataList.add(DataSyncUtil.createSyncData(syncDtoList, 0));
			MessageRequest invoiceDocsMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
					SalesOperationCode.SALES_INVOICE_DOCUMENTS, destinations, MessageType.FIFO.toString(),
					DestinationType.SELECTIVE.toString());
			SyncStagingDto stagingDto = new SyncStagingDto();
			stagingDto.setMessageRequest(invoiceDocsMsgRequest);
			String msgRequest = MapperUtil.getJsonString(invoiceDocsMsgRequest);
			SyncStaging syncStaging = new SyncStaging();
			syncStaging.setMessage(msgRequest);
			syncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			syncStaging = saleSyncStagingRepository.save(syncStaging);
			stagingDto.setId(syncStaging.getId());	
			salesSyncDataService.publishSalesMessagesToQueue(stagingDto);
		}
    }
	
	public void syncDataInvoiceDocs(List<SalesInvoiceDocumentsDao> salesInvoiceDocuments) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			List<SalesInvoiceDocumentsDao> salesInvoiceDocDaos = salesInvoiceDocumentsRepository.saveAll(salesInvoiceDocuments);
			List<SalesInvoiceDocsSyncDto> syncDtoList = new ArrayList<>();
			salesInvoiceDocDaos.stream().forEach(salesInvoiceDocDao->syncDtoList.add(new SalesInvoiceDocsSyncDto(salesInvoiceDocDao)));
			syncDataList.add(DataSyncUtil.createSyncData(syncDtoList, 0));
			MessageRequest invoiceDocsMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
					SalesOperationCode.SALES_INVOICE_DOCUMENTS, destinations, MessageType.FIFO.toString(),
					DestinationType.SELECTIVE.toString());
			SyncStagingDto stagingDto = new SyncStagingDto();
			stagingDto.setMessageRequest(invoiceDocsMsgRequest);
			String msgRequest = MapperUtil.getJsonString(invoiceDocsMsgRequest);
			SyncStaging syncStaging = new SyncStaging();
			syncStaging.setMessage(msgRequest);
			syncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			syncStaging = saleSyncStagingRepository.save(syncStaging);
			stagingDto.setId(syncStaging.getId());	
			salesSyncDataService.publishSalesMessagesToQueue(stagingDto);
		}
    }
}
