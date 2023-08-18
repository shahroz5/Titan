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
import com.titan.poss.sales.dao.DiscountConfigDetailsDao;
import com.titan.poss.sales.dao.DiscountDetailsDao;
import com.titan.poss.sales.dao.DiscountItemDetailsDao;
import com.titan.poss.sales.dao.PaymentDetailsDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dto.DiscountConfigDetailsSyncDto;
import com.titan.poss.sales.dto.DiscountDetailsSyncDto;
import com.titan.poss.sales.dto.DiscountItemDetailsSyncDto;
import com.titan.poss.sales.repository.DiscountConfigDetailsRepository;
import com.titan.poss.sales.repository.DiscountDetailsRepository;
import com.titan.poss.sales.repository.DiscountItemDetailsRepository;
import com.titan.poss.sales.repository.PaymentDetailsRepository;
import com.titan.poss.sales.repository.SalesTxnRepository;

/**
 * Service class to sync transaction discounts.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("dataSyncDiscountsSyncService")
public class SalesDiscountsSyncService implements SyncOperation {

	private static final Logger LOGGER = LoggerFactory.getLogger(SalesDiscountsSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private SalesCommonUtil salesCommon;

	@Autowired
	private SalesDiscountsSyncService sDSyncService;

	@Autowired
	private SalesTxnRepository salesTxnRepository;

	@Autowired
	private PaymentDetailsRepository paymentDetailsRepository;

	@Autowired
	private DiscountConfigDetailsRepository discountConfigDetailsRepository;

	@Autowired
	private DiscountDetailsRepository discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepository discountItemDetailsRepository;

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
			Boolean flag = syncData(syncData);
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

	private Boolean syncData(List<SyncData> syncData) {
		SalesTxnDao salesTxnDao = null;
		List<PaymentDetailsDao> paymentDetailsList = new ArrayList<>();
		List<DiscountConfigDetailsDao> discountConfigList = new ArrayList<>();
		List<DiscountDetailsDao> discountDetailsList = new ArrayList<>();
		List<DiscountItemDetailsDao> discountItemDetailsList = new ArrayList<>();

		ObjectMapper mapper = new ObjectMapper();
		for (SyncData data : syncData) {
			if (data.getOrder() == 0) {
				salesTxnDao = salesCommon.syncSalesTxn(data, mapper);
			} else if (data.getOrder() == 1) {
				salesCommon.syncPaymentDetails(data, paymentDetailsList, mapper);
			} else if (data.getOrder() == 2) {
				syncDiscountConfigDetails(data, discountConfigList, mapper);
			} else if (data.getOrder() == 3) {
				syncDiscountDetails(data, discountDetailsList, mapper);
			} else if (data.getOrder() == 4) {
				syncDiscountItemDetails(data, discountItemDetailsList, mapper);
			}
		}
		return sDSyncService.dbOperation(salesTxnDao, paymentDetailsList, discountConfigList, discountDetailsList,
				discountItemDetailsList);
	}

	@Transactional(value = "chainedTransaction")
	public Boolean dbOperation(SalesTxnDao salesTxnDao, List<PaymentDetailsDao> paymentDetailsList,
			List<DiscountConfigDetailsDao> discountConfigList, List<DiscountDetailsDao> discountDetailsList,
			List<DiscountItemDetailsDao> discountItemDetailsList) {
		boolean flag = false;
		if (salesTxnDao != null) {
			salesTxnRepository.save(salesTxnDao);
			flag = true;
		}
		if (!paymentDetailsList.isEmpty()) {
			paymentDetailsRepository.saveAll(paymentDetailsList);
			flag = true;
		}
		if (!discountConfigList.isEmpty()) {
			discountConfigDetailsRepository.saveAll(discountConfigList);
			flag = true;
		}
		if (!discountDetailsList.isEmpty()) {
			discountDetailsRepository.saveAll(discountDetailsList);
			flag = true;
		}
		if (!discountItemDetailsList.isEmpty()) {
			discountItemDetailsRepository.saveAll(discountItemDetailsList);
			flag = true;
		}

		return flag;
	}

	private void syncDiscountConfigDetails(SyncData data, List<DiscountConfigDetailsDao> discountConfigList,
			ObjectMapper mapper) {
		DiscountConfigDetailsSyncDto syncDto = new DiscountConfigDetailsSyncDto();
		List<DiscountConfigDetailsDao> srcDiscountConfigList = syncDto.getDiscountConfigDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<DiscountConfigDetailsSyncDto>>() {
				}));
		srcDiscountConfigList.forEach(srcDiscountConfig -> {
			Optional<DiscountConfigDetailsDao> destdiscountConfigDao = discountConfigDetailsRepository
					.findById(srcDiscountConfig.getId());
			if (!destdiscountConfigDao.isPresent()) {
				int tempSrcDataSyncId = srcDiscountConfig.getSrcSyncId();
				srcDiscountConfig.setSrcSyncId(srcDiscountConfig.getDestSyncId());
				srcDiscountConfig.setDestSyncId(tempSrcDataSyncId);
				discountConfigList.add(srcDiscountConfig);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDiscountConfig.getSrcSyncId(),
						srcDiscountConfig.getDestSyncId(), destdiscountConfigDao.get().getSrcSyncId(),
						destdiscountConfigDao.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcDiscountConfig.getSrcSyncId();
					srcDiscountConfig.setSrcSyncId(srcDiscountConfig.getDestSyncId());
					srcDiscountConfig.setDestSyncId(tempSrcDataSyncId);
					discountConfigList.add(srcDiscountConfig);
				}
			}
		});
	}

	private void syncDiscountDetails(SyncData data, List<DiscountDetailsDao> discountDetailsList, ObjectMapper mapper) {
		DiscountDetailsSyncDto syncDto = new DiscountDetailsSyncDto();
		List<DiscountDetailsDao> srcDiscountDetailsList = syncDto.getDiscountDetailsDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<DiscountDetailsSyncDto>>() {
				}));
		srcDiscountDetailsList.forEach(srcDiscountDao -> {
			Optional<DiscountDetailsDao> destdiscountDao = discountDetailsRepository.findById(srcDiscountDao.getId());
			if (!destdiscountDao.isPresent()) {
				int tempSrcDataSyncId = srcDiscountDao.getSrcSyncId();
				srcDiscountDao.setSrcSyncId(srcDiscountDao.getDestSyncId());
				srcDiscountDao.setDestSyncId(tempSrcDataSyncId);
				discountDetailsList.add(srcDiscountDao);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDiscountDao.getSrcSyncId(),
						srcDiscountDao.getDestSyncId(), destdiscountDao.get().getSrcSyncId(),
						destdiscountDao.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcDiscountDao.getSrcSyncId();
					srcDiscountDao.setSrcSyncId(srcDiscountDao.getDestSyncId());
					srcDiscountDao.setDestSyncId(tempSrcDataSyncId);
					discountDetailsList.add(srcDiscountDao);
				}
			}
		});
	}

	private void syncDiscountItemDetails(SyncData data, List<DiscountItemDetailsDao> discountItemDetailsList,
			ObjectMapper mapper) {
		DiscountItemDetailsSyncDto syncDto = new DiscountItemDetailsSyncDto();
		List<DiscountItemDetailsDao> srcDiscountItemDetailsList = syncDto.getDiscountItemDetailsDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<DiscountItemDetailsSyncDto>>() {
				}));
		srcDiscountItemDetailsList.forEach(srcDiscountItemDao -> {
			Optional<DiscountItemDetailsDao> destDiscountItemDao = discountItemDetailsRepository
					.findById(srcDiscountItemDao.getId());
			if (!destDiscountItemDao.isPresent()) {
				int tempSrcDataSyncId = srcDiscountItemDao.getSrcSyncId();
				srcDiscountItemDao.setSrcSyncId(srcDiscountItemDao.getDestSyncId());
				srcDiscountItemDao.setDestSyncId(tempSrcDataSyncId);
				discountItemDetailsList.add(srcDiscountItemDao);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDiscountItemDao.getSrcSyncId(),
						srcDiscountItemDao.getDestSyncId(), destDiscountItemDao.get().getSrcSyncId(),
						destDiscountItemDao.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcDiscountItemDao.getSrcSyncId();
					srcDiscountItemDao.setSrcSyncId(srcDiscountItemDao.getDestSyncId());
					srcDiscountItemDao.setDestSyncId(tempSrcDataSyncId);
					discountItemDetailsList.add(srcDiscountItemDao);
				}
			}
		});
	}

}
