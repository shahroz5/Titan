/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.location.service;

import java.util.List;

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
import com.titan.poss.location.dao.TaxClassDao;
import com.titan.poss.location.dto.TaxClassSyncDto;
import com.titan.poss.location.repository.TaxClassRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class TaxClassSyncService implements SyncOperation {
	
	@Autowired
	private TaxClassRepository taxClassRepository;
	
	@Autowired
	private DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(TaxClassSyncService.class);
	private static final String EXCEPTION = "exception : ";
	
	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			ObjectMapper mapper = new ObjectMapper();
			TaxClassSyncDto taxClassSyncDto = new TaxClassSyncDto();
			TaxClassDao sourceTaxClass = taxClassSyncDto.getTaxClassDao(mapper.convertValue(data.getData(), new TypeReference<TaxClassSyncDto>() {}));
			TaxClassDao destinationTaxClass = taxClassRepository.findOneByTaxClassCode(sourceTaxClass.getTaxClassCode());
			
			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(LocationOperationCodes.TAXCLASS_ADD) || operationCode.equals(LocationOperationCodes.TAXCLASS_UPDATE)) {

				if (destinationTaxClass == null) {
					saveToDestinationDB(sourceTaxClass, messageId,messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceTaxClass, destinationTaxClass);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						datasyncAuditService.updateDatasyncAuditStatusById(messageId, messageTransfer.getMessageTransferData().getDestination(), status.name());
					} else {
						saveToDestinationDB(sourceTaxClass, messageId,messageTransfer.getMessageTransferData().getDestination());
					}
				}

			}
			
		});
		
	}

	@Transactional
	public void saveToDestinationDB(TaxClassDao sourceTaxClass, String messageId, String dest) {
		int tempSrcDataSyncId = sourceTaxClass.getSrcSyncId();
		sourceTaxClass.setSrcSyncId(sourceTaxClass.getDestSyncId());
		sourceTaxClass.setDestSyncId(tempSrcDataSyncId);
		try {
			taxClassRepository.save(sourceTaxClass);
			datasyncAuditService.updateDatasyncAuditStatusById(messageId,dest, DatasyncStatusEnum.SYNCED.name());
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest, DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest, DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private DatasyncStatusEnum compareSyncIdVersions(TaxClassDao src, TaxClassDao dest) {
		
		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());

	}
	
}
