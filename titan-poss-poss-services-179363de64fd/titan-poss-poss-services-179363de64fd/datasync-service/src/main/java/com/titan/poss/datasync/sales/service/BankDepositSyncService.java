/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.sales.service;

import java.util.ArrayList;
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
import com.titan.poss.sales.dao.BankDepositDao;
import com.titan.poss.sales.dao.BankDepositSummaryDao;
import com.titan.poss.sales.dto.BankDepositSummarySyncDto;
import com.titan.poss.sales.dto.BankDepositSyncDto;
import com.titan.poss.sales.repository.BankDepositRepository;
import com.titan.poss.sales.repository.BankDepositsSummaryRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class BankDepositSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private BankDepositRepository bankDepositeRepo;
	
	@Autowired
	private BankDepositsSummaryRepository bankDepositSummaryRepo;

	@Autowired
	BankDepositSyncService bankDepositeSyncService;

	private static final Logger LOGGER = LoggerFactory.getLogger(BankDepositSyncService.class);
	private static final String EXCEPTION = "exception";

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
		List<BankDepositDao> bankDepositList = new ArrayList<>();
		BankDepositSummaryDao bankdepositSummary=null;
		for (SyncData data : syncDataList) {
			if (data.getOrder() == 0) {
				syncBankDeposit(data, bankDepositList, mapper);
			}else if(data.getOrder() == 1) {
				bankdepositSummary=syncBankDepositeSymmary(data,mapper);
			}
		}
		return bankDepositeSyncService.dbOperation(bankDepositList,bankdepositSummary);
	}

	private void syncBankDeposit(SyncData data, List<BankDepositDao> bankDepositList, ObjectMapper mapper) {
		BankDepositSyncDto syncDto = new BankDepositSyncDto();
		List<BankDepositDao> srcBankDepstList = syncDto.getBankDepositDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<BankDepositSyncDto>>() {
				}));
		srcBankDepstList.forEach(srcBank -> {
			Optional<BankDepositDao> destBank = bankDepositeRepo.findById(srcBank.getId());
			if (destBank.isPresent()) {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcBank.getSrcSyncId(), srcBank.getDestSyncId(),
						destBank.get().getSrcSyncId(), destBank.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcBank.getSrcSyncId();
					srcBank.setSrcSyncId(srcBank.getDestSyncId());
					srcBank.setDestSyncId(tempSrcDataSyncId);
					bankDepositList.add(srcBank);
				}
			} else {
				int tempSrcDataSyncId = srcBank.getSrcSyncId();
				srcBank.setSrcSyncId(srcBank.getDestSyncId());
				srcBank.setDestSyncId(tempSrcDataSyncId);
				bankDepositList.add(srcBank);
			}
		});

	}
	
	private BankDepositSummaryDao syncBankDepositeSymmary(SyncData data, ObjectMapper mapper) {
		BankDepositSummarySyncDto syncDto=new BankDepositSummarySyncDto();
		BankDepositSummaryDao srcDao=syncDto.getBankingDepositSummary(
				mapper.convertValue(data.getData(), new TypeReference<BankDepositSummarySyncDto>() {
				}));
		Optional<BankDepositSummaryDao> destDao = bankDepositSummaryRepo.findById(srcDao.getId());
		if (destDao.isPresent()) {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDao.getSrcSyncId(), srcDao.getDestSyncId(),
					destDao.get().getSrcSyncId(), destDao.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcDao.getSrcSyncId();
				srcDao.setSrcSyncId(srcDao.getDestSyncId());
				srcDao.setDestSyncId(tempSrcDataSyncId);
				return srcDao;
			}
		} else {
			int tempSrcDataSyncId = srcDao.getSrcSyncId();
			srcDao.setSrcSyncId(srcDao.getDestSyncId());
			srcDao.setDestSyncId(tempSrcDataSyncId);
			return srcDao;
		}
		return null;
	}

	@Transactional(value="chainedTransaction")
	public Boolean dbOperation(List<BankDepositDao> bankDepositList, BankDepositSummaryDao bankdepositSummary) {
		Boolean flag = false;
		if(bankdepositSummary!=null) {
			bankDepositSummaryRepo.save(bankdepositSummary);
			flag = true;
		}
		if (!bankDepositList.isEmpty()) {
			bankDepositeRepo.saveAll(bankDepositList);
			flag = true;
		}
		return flag;
	}
}
