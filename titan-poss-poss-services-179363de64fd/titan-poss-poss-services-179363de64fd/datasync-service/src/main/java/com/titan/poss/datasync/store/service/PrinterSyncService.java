/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.store.service;

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
import com.titan.poss.store.dao.PrinterConfigDao;
import com.titan.poss.store.dto.PrinterConfigSyncDto;
import com.titan.poss.store.repository.PrinterConfigRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PrinterSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private PrinterSyncService printerSynService;

	@Autowired
	private PrinterConfigRepository printerConfigRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(PrinterSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
			boolean flag = syncPrinterConfig(syncData);
			if (flag) {
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

	/**
	 * @param syncData
	 * @param messageId
	 * @return flag
	 */
	private boolean syncPrinterConfig(List<SyncData> syncData) {
		ObjectMapper mapper = new ObjectMapper();
		PrinterConfigDao savePrinterConfigDao = null;
		for (SyncData data : syncData) {
			if (data.getOrder() == 0) {
				savePrinterConfigDao = syncPrinter(data, mapper);
			}
		}
		return printerSynService.dbOperation(savePrinterConfigDao);
	}

	/**
	 * @param data
	 * @param mapper
	 * @return PrinterConfigDao
	 */
	private PrinterConfigDao syncPrinter(SyncData data, ObjectMapper mapper) {
		PrinterConfigSyncDto syncDto = new PrinterConfigSyncDto();
		PrinterConfigDao srcPrinterConfigDao = syncDto
				.getPrinterConfigDao(mapper.convertValue(data.getData(), new TypeReference<PrinterConfigSyncDto>() {
				}));
		Optional<PrinterConfigDao> destPrinterConfigDao = printerConfigRepository.findById(srcPrinterConfigDao.getId());
		if (!destPrinterConfigDao.isPresent()) {
			int tempSrcDataSyncId = srcPrinterConfigDao.getSrcSyncId();
			srcPrinterConfigDao.setSrcSyncId(srcPrinterConfigDao.getDestSyncId());
			srcPrinterConfigDao.setDestSyncId(tempSrcDataSyncId);
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcPrinterConfigDao.getSrcSyncId(),
					srcPrinterConfigDao.getDestSyncId(), destPrinterConfigDao.get().getSrcSyncId(),
					destPrinterConfigDao.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcPrinterConfigDao.getSrcSyncId();
				srcPrinterConfigDao.setSrcSyncId(srcPrinterConfigDao.getDestSyncId());
				srcPrinterConfigDao.setDestSyncId(tempSrcDataSyncId);
			} else {
				srcPrinterConfigDao = null;
			}
		}
		return srcPrinterConfigDao;
	}

	/**
	 * @param savePrinterConfigDao
	 * @return flag
	 */
	@Transactional
	public boolean dbOperation(PrinterConfigDao savePrinterConfigDao) {
		boolean flag = false;
		if (savePrinterConfigDao != null) {
			printerConfigRepository.save(savePrinterConfigDao);
			flag = true;
		}
		return flag;
	}

}
