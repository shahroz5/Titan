/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.location.service;

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
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.location.dao.TaxConfigsDao;
import com.titan.poss.location.dto.TaxConfigsSyncDto;
import com.titan.poss.location.repository.TaxConfigsRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class TaxConfigsSyncService implements SyncOperation {
	
	@Autowired 
	private TaxConfigsRepository taxConfigsRepository;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(TaxConfigsSyncService.class);
	private static final String EXCEPTION = "exception : ";
	
	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			ObjectMapper mapper = new ObjectMapper();
			TaxConfigsSyncDto taxConfigsSyncDto = new TaxConfigsSyncDto();
			TaxConfigsDao sourceTaxConfig = taxConfigsSyncDto.getTaxConfigsDao(mapper.convertValue(data.getData(), new TypeReference<TaxConfigsSyncDto>() {}));
			Optional<TaxConfigsDao> destinationTaxConfig = taxConfigsRepository.findById(sourceTaxConfig.getId());
			
			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(LocationOperationCodes.TAXCONFIGS_ADD) || operationCode.equals(LocationOperationCodes.TAXCONFIGS_UPDATE)) {

				if (!destinationTaxConfig.isPresent()) {
					saveToDestinationDB(sourceTaxConfig, messageId,messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceTaxConfig, destinationTaxConfig.get());
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						datasyncAuditService.updateDatasyncAuditStatusById(messageId, messageTransfer.getMessageTransferData().getDestination(), status.name());
					} else {
						saveToDestinationDB(sourceTaxConfig, messageId,messageTransfer.getMessageTransferData().getDestination());
					}
				}

			}
			
		});
	}

	@Transactional
	public void saveToDestinationDB(TaxConfigsDao sourceTaxConfig, String messageId, String dest) {
		int tempSrcDataSyncId = sourceTaxConfig.getSrcSyncId();
		sourceTaxConfig.setSrcSyncId(sourceTaxConfig.getDestSyncId());
		sourceTaxConfig.setDestSyncId(tempSrcDataSyncId);
		try {
			taxConfigsRepository.save(sourceTaxConfig);
			datasyncAuditService.updateDatasyncAuditStatusById(messageId,dest, DatasyncStatusEnum.SYNCED.name());
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest, DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest, DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private DatasyncStatusEnum compareSyncIdVersions(TaxConfigsDao src, TaxConfigsDao dest) {
		
		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());

	}
	
}
