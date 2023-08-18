package com.titan.poss.datasync.sales.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;
import com.titan.poss.sales.dao.StockTransactionDao;
import com.titan.poss.sales.dao.StockTransactionDetailsDao;
import com.titan.poss.sales.dto.StockTransactionDetailsSyncDto;
import com.titan.poss.sales.dto.StockTransactionSyncDto;
import com.titan.poss.sales.repository.StockTransactionDetailsRepository;
import com.titan.poss.sales.repository.StockTransactionRepository;

@Service
public class CutPieceTepSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;
	
	@Autowired
	private InventoryDetailsRepository inventoryDetailsRepo;
	
	@Autowired
	private SalesCommonUtil salesCommon;
	
	@Autowired
	private StockTransactionRepository stockTxnRepo;
	
	@Autowired
	private StockTransactionDetailsRepository stockTxnDetailsRepo;
	
	@Autowired
	CutPieceTepSyncService cutPieceTepSyncService;

	private static final Logger LOGGER = LoggerFactory.getLogger(CashMemoSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
			Boolean flag = syncCutPieceTepData(syncData);
			if (Boolean.TRUE.equals(flag)) {
				datasyncAuditService.updateDatasyncAuditStatusById(messageId,
						messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.SYNCED.name());
			} else {
				datasyncAuditService.updateDatasyncAuditStatusById(messageId,
						messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.DISCARDED.name());
			}
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,
					messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,
					messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.FAILED_PERSIST.name(),
					ex.getMessage());
		}
	}

	private Boolean syncCutPieceTepData(List<SyncData> syncData) {
		ObjectMapper mapper = new ObjectMapper();
		StockTransactionDao stockTransactionDao = null;
		List<StockTransactionDetailsDao> stockTxnDetailsList = new ArrayList<>();
		List<InventoryDetailsDao> invDetailsList = new ArrayList<>();
		
		for (SyncData data : syncData) {
			if (data.getOrder() == 0) {
				mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
				salesCommon.syncInventoryDetails(data, invDetailsList, mapper);
			} else if (data.getOrder() == 2) {
				stockTransactionDao = syncStockTxn(data,mapper);
			} else if (data.getOrder() == 3) {
				syncStockTxnDetails(data, stockTxnDetailsList, mapper);
			}
		}
		return cutPieceTepSyncService.dbOperation(stockTransactionDao,stockTxnDetailsList,invDetailsList);
	}

	
	private Boolean dbOperation(StockTransactionDao stockTransactionDao,
			List<StockTransactionDetailsDao> stockTxnDetailsList, List<InventoryDetailsDao> invDetailsList) {
		boolean flag = false;
		if (stockTransactionDao != null) {
			stockTxnRepo.save(stockTransactionDao);
			flag = true;
		}
		if (!stockTxnDetailsList.isEmpty()) {
			stockTxnDetailsRepo.saveAll(stockTxnDetailsList);
			flag = true;
		}
		if (!invDetailsList.isEmpty()) {
			inventoryDetailsRepo.saveAll(invDetailsList);
			flag = true;
		}
		return flag;
	}

	private void syncStockTxnDetails(SyncData data, List<StockTransactionDetailsDao> stockTxnDetailsList, ObjectMapper mapper) {
		StockTransactionDetailsSyncDto syncDto = new StockTransactionDetailsSyncDto();
		List<StockTransactionDetailsDao> srcGiftList = syncDto.getStockTransactionDetailsDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<StockTransactionDetailsSyncDto>>() {
				}));
		srcGiftList.forEach(srcgift -> {
			Optional<StockTransactionDetailsDao> destGiftDao = stockTxnDetailsRepo.findById(srcgift.getId());
			if (!destGiftDao.isPresent()) {
				int tempSrcDataSyncId = srcgift.getSrcSyncId();
				srcgift.setSrcSyncId(srcgift.getDestSyncId());
				srcgift.setDestSyncId(tempSrcDataSyncId);
				stockTxnDetailsList.add(srcgift);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcgift.getSrcSyncId(), srcgift.getDestSyncId(),
						destGiftDao.get().getSrcSyncId(), destGiftDao.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcgift.getSrcSyncId();
					srcgift.setSrcSyncId(srcgift.getDestSyncId());
					srcgift.setDestSyncId(tempSrcDataSyncId);
					stockTxnDetailsList.add(srcgift);
				}
			}
		});

	}
	
	
	private StockTransactionDao syncStockTxn(SyncData data, ObjectMapper mapper) {
		StockTransactionSyncDto syncDto = new StockTransactionSyncDto();
		StockTransactionDao srcgift = syncDto.getStockTransactionDao(
				mapper.convertValue(data.getData(), new TypeReference<StockTransactionSyncDto>() {
				}));
		
			Optional<StockTransactionDetailsDao> destGiftDao = stockTxnDetailsRepo.findById(srcgift.getId());
			if (!destGiftDao.isPresent()) {
				int tempSrcDataSyncId = srcgift.getSrcSyncId();
				srcgift.setSrcSyncId(srcgift.getDestSyncId());
				srcgift.setDestSyncId(tempSrcDataSyncId);
				return srcgift;
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcgift.getSrcSyncId(), srcgift.getDestSyncId(),
						destGiftDao.get().getSrcSyncId(), destGiftDao.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcgift.getSrcSyncId();
					srcgift.setSrcSyncId(srcgift.getDestSyncId());
					srcgift.setDestSyncId(tempSrcDataSyncId);
					return srcgift;
				}
			}
	return null;

	}
}
