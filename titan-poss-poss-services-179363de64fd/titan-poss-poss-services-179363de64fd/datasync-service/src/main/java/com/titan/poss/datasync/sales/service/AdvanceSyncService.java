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
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.sales.dao.AdvanceDao;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.CustomerPaymentDao;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.PaymentDetailsDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dto.AdvanceSyncDto;
import com.titan.poss.sales.repository.AdvanceRepository;
import com.titan.poss.sales.repository.CreditNoteRepository;
import com.titan.poss.sales.repository.CustomerPaymentRepository;
import com.titan.poss.sales.repository.CustomerTxnRepository;
import com.titan.poss.sales.repository.PaymentDetailsRepository;
import com.titan.poss.sales.repository.SalesTxnRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class AdvanceSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;
	
	@Autowired
	private SalesCommonUtil salesCommon;

	@Autowired
	private AdvanceRepository advRepository;

	@Autowired
	private SalesTxnRepository salesTxnRepository;

	@Autowired
	private AdvanceSyncService advSyncService;

	@Autowired
	private CreditNoteRepository creditRepository;

	@Autowired
	private CustomerTxnRepository cusTxnDetailsRepository;

	@Autowired
	private PaymentDetailsRepository paymentDetailsRepository;

	@Autowired
	private CustomerPaymentRepository customerPaymentRepo;

	private static final Logger LOGGER = LoggerFactory.getLogger(AdvanceSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		try {
			if (operationCode.equals(SalesOperationCode.ADVANCE_CONFIRM)
					|| operationCode.equals(SalesOperationCode.GRF_UPDATE) ||  operationCode.equals(SalesOperationCode.GRF_MERGE)) {
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
		SalesTxnDao saveSalesTxnDao = null;
		CustomerTxnDao customer = null;
		AdvanceDao saveAdvance = null;
		List<CustomerPaymentDao> customerpayement = new ArrayList<>();
		List<CreditNoteDao> creditNoteList = new ArrayList<>();
		List<PaymentDetailsDao> paymentDetailsList = new ArrayList<>();
		for (SyncData data : syncDataList) {
			if (data.getOrder() == 0) {
				saveSalesTxnDao = salesCommon.syncSalesTxn(data, mapper);
			} else if (data.getOrder() == 1) {
				saveAdvance = syncAdvance(data, mapper);
			} else if (data.getOrder() == 2) {
				salesCommon.syncCreditNote(data, creditNoteList, mapper);
			} else if (data.getOrder() == 3) {
				salesCommon.syncPaymentDetails(data, paymentDetailsList, mapper);
			} else if (data.getOrder() == 4) {
				customer = salesCommon.syncCustomerDetails(data, mapper);
			} else if (data.getOrder() == 5) {
				salesCommon.syncCustomerPayement(data, customerpayement, mapper);
			}
		}
		return advSyncService.dbOperation(saveSalesTxnDao, saveAdvance, creditNoteList, paymentDetailsList, customer,
				customerpayement);
	}

	private AdvanceDao syncAdvance(SyncData data, ObjectMapper mapper) {
		AdvanceSyncDto syncDto = new AdvanceSyncDto();
		AdvanceDao sourceAdv = syncDto
				.getAdvanceDao(mapper.convertValue(data.getData(), new TypeReference<AdvanceSyncDto>() {
				}));
		Optional<AdvanceDao> destAdv = advRepository.findById(sourceAdv.getId());
		if (!destAdv.isPresent()) {
			int tempSrcDataSyncId = sourceAdv.getSrcSyncId();
			sourceAdv.setSrcSyncId(sourceAdv.getDestSyncId());
			sourceAdv.setDestSyncId(tempSrcDataSyncId);
			return sourceAdv;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(sourceAdv.getSrcSyncId(), sourceAdv.getDestSyncId(),
					destAdv.get().getSrcSyncId(), destAdv.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = sourceAdv.getSrcSyncId();
				sourceAdv.setSrcSyncId(sourceAdv.getDestSyncId());
				sourceAdv.setDestSyncId(tempSrcDataSyncId);
				return sourceAdv;
			}
		}
		return null;
	}

	@Transactional(value = "chainedTransaction")
	public Boolean dbOperation(SalesTxnDao saveSalesTxnDao, AdvanceDao saveAdvance, List<CreditNoteDao> creditNoteList,
			List<PaymentDetailsDao> paymentDetailsList, CustomerTxnDao customer,
			List<CustomerPaymentDao> customerpayement) {
		Boolean flag = false;
		if (saveSalesTxnDao != null) {
			salesTxnRepository.save(saveSalesTxnDao);
			flag = true;
		}
		if (saveAdvance != null) {
			advRepository.save(saveAdvance);
			flag = true;
		}
		if (!creditNoteList.isEmpty()) {
			creditNoteList.forEach(cn->{
				String parent=null;
				String oiginal=null;
				if(cn.getParentCn()!=null) {
					 parent=cn.getParentCn().getId();
					 cn.setParentCn(null);
				}
				if(cn.getOriginalCn()!=null) {
					 oiginal=cn.getOriginalCn().getId();
					 cn.setOriginalCn(null);
				}
				cn=creditRepository.saveAndFlush(cn);
				if(parent!=null) {
					 CreditNoteDao cnParent =new CreditNoteDao();
					 cnParent.setId(parent);
					 cn.setParentCn(cnParent);
				}
				if(oiginal!=null) {
					 CreditNoteDao cnOiginal =new CreditNoteDao();
					 cnOiginal.setId(oiginal);
					 cn.setOriginalCn(cnOiginal);
				}
				creditRepository.save(cn);
				
			});
			flag = true;
		}
		if (!paymentDetailsList.isEmpty()) {
			paymentDetailsRepository.saveAll(paymentDetailsList);
			flag = true;
		}
		if (customer != null) {
			cusTxnDetailsRepository.save(customer);
			flag = true;
		}
		if (customerpayement != null) {
			customerPaymentRepo.saveAll(customerpayement);
			flag = true;
		}
		return flag;
	}
}
