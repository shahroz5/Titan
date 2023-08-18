/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.sales.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.sales.dao.SalesDocDao;
import com.titan.poss.sales.dto.SalesDocSyncDto;
import com.titan.poss.sales.repository.SalesDocRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class SalesDocSyncService implements SyncOperation {
	
	@Autowired
	private DatasyncAuditService datasyncAuditService;
	
	@Autowired
	private SalesDocSyncService salesDocService;
	
	@Autowired
	private SalesDocRepository salesDocRepository;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SalesDocSyncService.class);
	private static final String EXCEPTION = "exception : ";
	
	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
				Boolean flag=syncService(syncDataList);
				if (Boolean.TRUE.equals(flag)) {
					datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.SYNCED.name());
				} else {
					datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.DISCARDED.name());
				}
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private Boolean syncService(List<SyncData> syncDataList) {
		ObjectMapper mapper = new ObjectMapper();
		SalesDocDao salesDoc=null;
		for (SyncData data : syncDataList) {
			if (data.getOrder() == 0) {
				salesDoc = syncSalesDoc(data, mapper);
			}
		}
		return salesDocService.dbOperation(salesDoc);
	}

	

	private SalesDocDao syncSalesDoc(SyncData data, ObjectMapper mapper) {
		SalesDocSyncDto syncDto=new SalesDocSyncDto();
		SalesDocDao srcSalesDoc=syncDto.getSalesDocDao(mapper.convertValue(data.getData(), new TypeReference<SalesDocSyncDto>() {
		}));
		Optional<SalesDocDao> destSalesDoc=salesDocRepository.findOneByLocationCodeAndDocTypeAndFiscalYear(srcSalesDoc.getLocationCode(),srcSalesDoc.getDocType(),srcSalesDoc.getFiscalYear());
		if (!destSalesDoc.isPresent()) {
			int tempSrcDataSyncId = srcSalesDoc.getSrcSyncId();
			srcSalesDoc.setSrcSyncId(srcSalesDoc.getDestSyncId());
			srcSalesDoc.setDestSyncId(tempSrcDataSyncId);
			return srcSalesDoc;
		}else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcSalesDoc.getSrcSyncId(), srcSalesDoc.getDestSyncId(),
					destSalesDoc.get().getSrcSyncId(), destSalesDoc.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcSalesDoc.getSrcSyncId();
				srcSalesDoc.setSrcSyncId(srcSalesDoc.getDestSyncId());
				srcSalesDoc.setDestSyncId(tempSrcDataSyncId);
				return srcSalesDoc;
			}
		}
		return null;
	}
	
	@Transactional(value="chainedTransaction")
	public Boolean dbOperation(SalesDocDao salesDoc) {
		Boolean flag = false;
		if (salesDoc != null) {
			salesDocRepository.save(salesDoc);
			flag = true;
		}
		return flag;
	}

}
