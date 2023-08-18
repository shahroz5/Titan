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
import com.titan.poss.location.dao.CurrencyDao;
import com.titan.poss.location.dto.CurrencySyncDto;
import com.titan.poss.location.repository.CurrencyRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class CurrencySyncService implements SyncOperation {

	@Autowired
	private CurrencyRepository currencyRepository;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(CurrencySyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			ObjectMapper mapper = new ObjectMapper();
			CurrencySyncDto currencySyncDto = new CurrencySyncDto();
			CurrencyDao sourceCurrency = currencySyncDto
					.getCurrencyDao(mapper.convertValue(data.getData(), new TypeReference<CurrencySyncDto>() {
					}));
			CurrencyDao destinationCurrency = currencyRepository
					.findOneByCurrencyCode(sourceCurrency.getCurrencyCode());

			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(LocationOperationCodes.CURRENCY_ADD)
					|| operationCode.equals(LocationOperationCodes.CURRENCY_UPDATE)) {

				if (destinationCurrency == null) {
					saveToDestinationDB(sourceCurrency, messageId,messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceCurrency, destinationCurrency);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {

						datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), status.name());

					} else {

						saveToDestinationDB(sourceCurrency, messageId,messageTransfer.getMessageTransferData().getDestination());

					}
				}

			}
		});
	}

	@Transactional
	public void saveToDestinationDB(CurrencyDao sourceCurrency, String messageId, String dest) {

		int tempSrcDataSyncId = sourceCurrency.getSrcSyncId();
		sourceCurrency.setSrcSyncId(sourceCurrency.getDestSyncId());
		sourceCurrency.setDestSyncId(tempSrcDataSyncId);
		try {
			currencyRepository.save(sourceCurrency);
			datasyncAuditService.updateDatasyncAuditStatusById(messageId,dest, DatasyncStatusEnum.SYNCED.name());
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest,
					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest,
					DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private DatasyncStatusEnum compareSyncIdVersions(CurrencyDao src, CurrencyDao dest) {

		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());
	}

}
