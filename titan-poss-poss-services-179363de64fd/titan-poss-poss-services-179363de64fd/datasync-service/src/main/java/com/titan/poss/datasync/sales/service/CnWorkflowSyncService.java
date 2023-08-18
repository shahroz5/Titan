/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.sales.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.CustomerPaymentDao;
import com.titan.poss.sales.dao.PaymentReversalDao;
import com.titan.poss.sales.dto.CreditNoteSyncDto;
import com.titan.poss.sales.dto.CustomerPaymentSyncDto;
import com.titan.poss.sales.dto.PaymentReversalSyncDto;
import com.titan.poss.sales.repository.CreditNoteRepository;
import com.titan.poss.sales.repository.CustomerPaymentRepository;
import com.titan.poss.sales.repository.PaymentReversalRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class CnWorkflowSyncService implements SyncOperation {

	private static final Logger LOGGER = LoggerFactory.getLogger(CnWorkflowSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	CreditNoteRepository creditNoteRepository;

	@Autowired
	private PaymentReversalRepository paymentReversalRepo;

	@Autowired
	private CustomerPaymentRepository customerPaymentRepository;

	@Override
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		for (SyncData syncData : syncDataList) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(SalesOperationCode.CN_WORKFLOW)) {
				if (syncData.getOrder() == 2) {
					LOGGER.info("CREDIT NOTE RECEIVED "+ syncData.toString());
					updateCN(syncData.getData(), syncData.getOrder());
				} else if (syncData.getOrder() == 0) {
					addPaymentRefund(syncData.getData(), syncData.getOrder());
				} else if (syncData.getOrder() == 1) {
					addCustomerPayment(syncData.getData(), syncData.getOrder());
				}
			}
		}
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,
				messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param data
	 * @param order
	 */
	private void addCustomerPayment(Object data, int order) {
		ObjectMapper mapper = new ObjectMapper();
		CustomerPaymentSyncDto customerPaymentSyncDto = new CustomerPaymentSyncDto();
		//@formatter:off
		CustomerPaymentDao source = customerPaymentSyncDto.getCustomerPaymentDao(mapper.convertValue(data, new TypeReference<CustomerPaymentSyncDto>() {}));
		
		saveToDestinationDB(source, order);
	}

	/**
	 * @param data
	 * @param order
	 */
	private void addPaymentRefund(Object data, int order) {
		ObjectMapper mapper = new ObjectMapper();
		PaymentReversalSyncDto paymentReversalSyncDto = new PaymentReversalSyncDto();
		//@formatter:off
		PaymentReversalDao source = paymentReversalSyncDto.getPaymentReversalDao(mapper.convertValue(data, new TypeReference<PaymentReversalSyncDto>() {}));
		
		saveToDestinationDB(source, order);
	}

	/**
	 * @param data
	 * @param order
	 */
	private void updateCN(Object data, int order) {
		ObjectMapper mapper = new ObjectMapper();
		CreditNoteSyncDto creditNoteSyncDto = new CreditNoteSyncDto();
		//@formatter:off
		CreditNoteDao sourceCn = creditNoteSyncDto.getCreditNoteDao(mapper.convertValue(data, new TypeReference<CreditNoteSyncDto>() {}));
		// @formatter:on
		CreditNoteDao destCn = creditNoteRepository.findOneById(sourceCn.getId());
		if (destCn != null) {
//			LOGGER.info("CREDIT NOTE EXIST " + destCn.toString());
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(sourceCn.getSrcSyncId(), sourceCn.getDestSyncId(),
					destCn.getSrcSyncId(), destCn.getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
			} else {
				int tempSrcDataSyncId = sourceCn.getSrcSyncId();
				sourceCn.setSrcSyncId(sourceCn.getDestSyncId());
				sourceCn.setDestSyncId(tempSrcDataSyncId);
				saveToDestinationDB(sourceCn, order);
			}
	}
		else {
//			LOGGER.info("CREDIT NOTE DOES NOT EXIST,SENT MESSAGE IS :  " + sourceCn.toString());
			int tempSrcDataSyncId = sourceCn.getSrcSyncId();
			sourceCn.setSrcSyncId(sourceCn.getDestSyncId());
			sourceCn.setDestSyncId(tempSrcDataSyncId);
			saveToDestinationDB(sourceCn, order);
		}

}

	/**
	 * @param sourceCn
	 * @param order
	 */
	private void saveToDestinationDB(Object data, int order) {
		try {
		if (order == 0) {
			paymentReversalRepo.save((PaymentReversalDao) data);

		} else if (order == 1) {
			customerPaymentRepository.save((CustomerPaymentDao) data);
		} else if (order == 2) {
			LOGGER.info("CALLING SAVE CREDIT NOTE ");
			//creditNoteRepository.save((CreditNoteDao) data);
			cnSave((CreditNoteDao) data);
		}	
		ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}
	private void cnSave(CreditNoteDao cn) {
		LOGGER.info("SAVING A CREDIT NOTE");
		String parent = null;
		String oiginal = null;
		if (cn.getParentCn() != null) {
			parent = cn.getParentCn().getId();
			cn.setParentCn(null);
		}
		if (cn.getOriginalCn() != null) {
			oiginal = cn.getOriginalCn().getId();
			cn.setOriginalCn(null);
		}
		cn = creditNoteRepository.save(cn);
		creditNoteRepository.flush();
		if (parent != null) {
			CreditNoteDao cnParent = new CreditNoteDao();
			cnParent.setId(parent);
			cn.setParentCn(cnParent);
		}
		if (oiginal != null) {
			CreditNoteDao cnOiginal = new CreditNoteDao();
			cnOiginal.setId(oiginal);
			cn.setOriginalCn(cnOiginal);
		}
		creditNoteRepository.save(cn);
	}

}
