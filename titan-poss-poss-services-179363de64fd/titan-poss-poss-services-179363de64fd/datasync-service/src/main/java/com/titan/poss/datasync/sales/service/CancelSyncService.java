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
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;
import com.titan.poss.sales.dao.CancelDao;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.CustomerPaymentDao;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.PaymentReversalDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dto.CancelSyncDto;
import com.titan.poss.sales.dto.PaymentReversalSyncDto;
import com.titan.poss.sales.repository.CancellationRepository;
import com.titan.poss.sales.repository.CreditNoteRepository;
import com.titan.poss.sales.repository.CustomerPaymentRepository;
import com.titan.poss.sales.repository.CustomerTxnRepository;
import com.titan.poss.sales.repository.PaymentReversalRepository;
import com.titan.poss.sales.repository.SalesTxnRepository;

@Service
public class CancelSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private CancelSyncService canclSyncService;

	@Autowired
	private SalesTxnRepository salesTxnRepository;

	@Autowired
	private CreditNoteRepository creditRepository;

	@Autowired
	private CancellationRepository cancelRepository;

	@Autowired
	private CustomerPaymentRepository customerPaymentRepo;

	@Autowired
	private CustomerTxnRepository cusTxnDetailsRepository;

	@Autowired
	private InventoryDetailsRepository inventoryDetailsRepo;

	@Autowired
	private SalesCommonUtil salesCommon;

	@Autowired
	private PaymentReversalRepository reversalRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(CancelSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		try {
			if (operationCode.equals(SalesOperationCode.CANCEL_CONFIRM)) {
				Boolean flag = syncService(syncDataList);
				if (Boolean.TRUE.equals(flag)) {
					datasyncAuditService.updateDatasyncAuditStatusById(messageId,
							messageTransfer.getMessageTransferData().getDestination(),
							DatasyncStatusEnum.SYNCED.name());
				} else {
					datasyncAuditService.updateDatasyncAuditStatusById(messageId,
							messageTransfer.getMessageTransferData().getDestination(),
							DatasyncStatusEnum.DISCARDED.name());
				}
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

	private Boolean syncService(List<SyncData> syncDataList) {
		SalesTxnDao saveSalesTxnDao = null;
		CancelDao saveCancel = null;
		CustomerTxnDao customer = null;
		List<PaymentReversalDao> paymentReversalList = new ArrayList<>();
		List<CreditNoteDao> creditNoteList = new ArrayList<>();
		List<InventoryDetailsDao> inventoryDetailsList = new ArrayList<>();
		List<CustomerPaymentDao> customerpayement = new ArrayList<>();
		for (SyncData data : syncDataList) {
			ObjectMapper mapper = new ObjectMapper();
			if (data.getOrder() == 0) {
				saveSalesTxnDao = salesCommon.syncSalesTxn(data, mapper);
			} else if (data.getOrder() == 1) {
				saveCancel = syncCancel(data, mapper);
			} else if (data.getOrder() == 3) {
				syncPaymentReversal(data, paymentReversalList, mapper);
			} else if (data.getOrder() == 2) {
				salesCommon.syncCreditNote(data, creditNoteList, mapper);
			} else if (data.getOrder() == 4) {
				customer = salesCommon.syncCustomerDetails(data, mapper);
			} else if (data.getOrder() == 9) {
				salesCommon.syncInventoryDetails(data, inventoryDetailsList, mapper);
			} else if (data.getOrder() == 10) {
				salesCommon.syncCustomerPayement(data, customerpayement, mapper);
			}
		}
		return canclSyncService.dbOperation(saveSalesTxnDao, saveCancel, paymentReversalList, creditNoteList,
				inventoryDetailsList, customerpayement, customer);
	}

	private CancelDao syncCancel(SyncData data, ObjectMapper mapper) {
		CancelSyncDto syncDto = new CancelSyncDto();
		CancelDao srcCancel = syncDto
				.getCancelDao(mapper.convertValue(data.getData(), new TypeReference<CancelSyncDto>() {
				}));
		Optional<CancelDao> destCancel = cancelRepository.findById(srcCancel.getId());
		if (!destCancel.isPresent()) {
			int tempSrcDataSyncId = srcCancel.getSrcSyncId();
			srcCancel.setSrcSyncId(srcCancel.getDestSyncId());
			srcCancel.setDestSyncId(tempSrcDataSyncId);
			return srcCancel;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCancel.getSrcSyncId(), srcCancel.getDestSyncId(),
					destCancel.get().getSrcSyncId(), destCancel.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcCancel.getSrcSyncId();
				srcCancel.setSrcSyncId(srcCancel.getDestSyncId());
				srcCancel.setDestSyncId(tempSrcDataSyncId);
				return srcCancel;
			}
		}
		return null;

	}

	private void syncPaymentReversal(SyncData data, List<PaymentReversalDao> paymentReversalList, ObjectMapper mapper) {
		PaymentReversalSyncDto syncDto = new PaymentReversalSyncDto();
		List<PaymentReversalDao> srcList = syncDto.getPaymentReversalDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<PaymentReversalSyncDto>>() {
				}));
		srcList.forEach(srcPayment -> {
			Optional<PaymentReversalDao> destPayment = reversalRepository.findById(srcPayment.getId());
			if (!destPayment.isPresent()) {
				int tempSrcDataSyncId = srcPayment.getSrcSyncId();
				srcPayment.setSrcSyncId(srcPayment.getDestSyncId());
				srcPayment.setDestSyncId(tempSrcDataSyncId);
				paymentReversalList.add(srcPayment);
			}
			destPayment.ifPresent(dest -> {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcPayment.getSrcSyncId(),
						srcPayment.getDestSyncId(), dest.getSrcSyncId(), dest.getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcPayment.getSrcSyncId();
					srcPayment.setSrcSyncId(srcPayment.getDestSyncId());
					srcPayment.setDestSyncId(tempSrcDataSyncId);
					paymentReversalList.add(srcPayment);
				}
			});
		});
	}

	@Transactional(value = "chainedTransaction")
	public Boolean dbOperation(SalesTxnDao salesTxnDao, CancelDao cancel, List<PaymentReversalDao> paymentReversalList,
			List<CreditNoteDao> creditNoteList, List<InventoryDetailsDao> inventoryDetailsList,
			List<CustomerPaymentDao> customerpayement, CustomerTxnDao customer) {
		Boolean flag = false;
		if (salesTxnDao != null) {
			salesTxnRepository.save(salesTxnDao);
			flag = true;
		}
		if (cancel != null) {
			cancelRepository.save(cancel);
			flag = true;
		}
		if (customer != null) {
			cusTxnDetailsRepository.save(customer);
			flag = true;
		}
		if (!paymentReversalList.isEmpty()) {
			reversalRepository.saveAll(paymentReversalList);
			flag = true;
		}
		if (!creditNoteList.isEmpty()) {
			creditNoteList.forEach(cn -> {
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
				cn = creditRepository.save(cn);
				creditRepository.flush();
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
				creditRepository.save(cn);

			});
			flag = true;
		}
		if (!inventoryDetailsList.isEmpty()) {
			inventoryDetailsRepo.saveAll(inventoryDetailsList);
			flag = true;
		}
		if (customerpayement != null) {
			customerPaymentRepo.saveAll(customerpayement);
			flag = true;
		}
		return flag;
	}

}
