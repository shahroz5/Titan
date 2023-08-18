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
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.sales.dao.AccountDetailsDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dto.AccountDetailsSyncDto;
import com.titan.poss.sales.dto.CustomerLocationMappingSyncDto;
import com.titan.poss.sales.repository.AccountDetailsRepository;
import com.titan.poss.sales.repository.CustomerLocationMappingRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class AccountDetailsSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private AccountDetailsSyncService accountDetailsService;

	@Autowired
	private AccountDetailsRepository accountDetailsRepo;

	@Autowired
	private CustomerLocationMappingRepository customerLocationRepo;

	private static final Logger LOGGER = LoggerFactory.getLogger(AccountDetailsSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		try {
			if (operationCode.equals(SalesOperationCode.ACCOUNT_DETAILS)) {
				Boolean flag = syncService(syncDataList);
				if (Boolean.TRUE.equals(flag)) {
					datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.SYNCED.name());
				} else {
					datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.DISCARDED.name());
				}
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
		AccountDetailsDao accountDetails = null;
		CustomerLocationMappingDao customerLocation = null;
		for (SyncData data : syncDataList) {
			if (data.getOrder() == 0) {
				customerLocation = syncCustomerLocation(data, mapper);
			} else if (data.getOrder() == 1) {
				accountDetails = syncAccountDetails(data, mapper);
			}
		}
		return accountDetailsService.dbOperation(accountDetails, customerLocation);
	}

	private CustomerLocationMappingDao syncCustomerLocation(SyncData data, ObjectMapper mapper) {
		CustomerLocationMappingSyncDto syncDto = new CustomerLocationMappingSyncDto();
		CustomerLocationMappingDao srcDao = syncDto.getCustomerLocationMappingDao(
				mapper.convertValue(data.getData(), new TypeReference<CustomerLocationMappingSyncDto>() {
				}));

		Optional<CustomerLocationMappingDao> destDao = customerLocationRepo
				.findById(srcDao.getCustomerLocationMappingId());
		if (!destDao.isPresent()) {
			int tempSrcDataSyncId = srcDao.getSrcSyncId();
			srcDao.setSrcSyncId(srcDao.getDestSyncId());
			srcDao.setDestSyncId(tempSrcDataSyncId);
			return srcDao;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDao.getSrcSyncId(), srcDao.getDestSyncId(),
					destDao.get().getSrcSyncId(), destDao.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcDao.getSrcSyncId();
				srcDao.setSrcSyncId(srcDao.getDestSyncId());
				srcDao.setDestSyncId(tempSrcDataSyncId);
				return srcDao;
			}
		}
		return null;
	}

	private AccountDetailsDao syncAccountDetails(SyncData data, ObjectMapper mapper) {
		AccountDetailsSyncDto syncDto = new AccountDetailsSyncDto();
		AccountDetailsDao srcDao = syncDto
				.getAccountDetailsDao(mapper.convertValue(data.getData(), new TypeReference<AccountDetailsSyncDto>() {
				}));
		Optional<AccountDetailsDao> destDao = accountDetailsRepo.findById(srcDao.getId());
		if (!destDao.isPresent()) {
			int tempSrcDataSyncId = srcDao.getSrcSyncId();
			srcDao.setSrcSyncId(srcDao.getDestSyncId());
			srcDao.setDestSyncId(tempSrcDataSyncId);
			return srcDao;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDao.getSrcSyncId(), srcDao.getDestSyncId(),
					destDao.get().getSrcSyncId(), destDao.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcDao.getSrcSyncId();
				srcDao.setSrcSyncId(srcDao.getDestSyncId());
				srcDao.setDestSyncId(tempSrcDataSyncId);
				return srcDao;
			}
		}
		return null;
	}

	@Transactional(value = "chainedTransaction")
	public Boolean dbOperation(AccountDetailsDao accountDetails, CustomerLocationMappingDao customerLocation) {
		Boolean flag = false;
		if (customerLocation != null) {
			customerLocationRepo.save(customerLocation);
			flag = true;
		}
		if (accountDetails != null) {
			accountDetailsRepo.save(accountDetails);
			flag = true;
		}
		return flag;
	}
}
