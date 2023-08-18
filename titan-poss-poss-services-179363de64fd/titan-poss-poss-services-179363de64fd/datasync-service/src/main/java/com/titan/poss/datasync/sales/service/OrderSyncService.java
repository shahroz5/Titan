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
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.CustomerPaymentDao;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.OrderDao;
import com.titan.poss.sales.dao.OrderDetailsDao;
import com.titan.poss.sales.dao.PaymentDetailsDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dto.OrderDetailsSyncDto;
import com.titan.poss.sales.dto.OrderSyncDto;
import com.titan.poss.sales.repository.CreditNoteRepository;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.repository.CustomerPaymentRepository;
import com.titan.poss.sales.repository.CustomerTxnRepository;
import com.titan.poss.sales.repository.OrderDetailsRepository;
import com.titan.poss.sales.repository.OrderRepository;
import com.titan.poss.sales.repository.PaymentDetailsRepository;
import com.titan.poss.sales.repository.SalesTxnRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class OrderSyncService implements SyncOperation {

	private static final Logger LOGGER = LoggerFactory.getLogger(OrderSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Autowired
	private OrderSyncService orderSynService;
	
	@Autowired
	private SalesCommonUtil salesCommon;

	@Autowired
	private SalesTxnRepository salesTxnRepository;

	@Autowired
	private CustomerTxnRepository cusTxnDetailsRepository;

	@Autowired
	private CreditNoteRepository creditRepository;

	@Autowired
	private PaymentDetailsRepository paymentDetailsRepository;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private OrderDetailsRepository orderDetailsRepository;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private InventoryDetailsRepository inventoryDetailsRepo;
	
	@Autowired
	private CustomerPaymentRepository customerPaymentRepo;
	
	@Autowired
	private CustomerDocumentsRepository customerDocRepo;

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		try {
			if (operationCode.equals(SalesOperationCode.ORDER_CONFIRM)
					|| operationCode.equals(SalesOperationCode.ORDER_CANCEL)
					|| operationCode.equals(SalesOperationCode.ORDER_ACTIVATE)
					|| operationCode.equals(SalesOperationCode.ORDER_ACTIVATE_RQ)
					|| operationCode.equals(SalesOperationCode.ORDER_CANCEL_RQ)
					|| operationCode.equals(SalesOperationCode.ORDER_RATE_FREEZE)
					|| operationCode.equals(SalesOperationCode.ORDER_APPROVAL_REQ)) {
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
		SalesTxnDao salesTxn = null;
		OrderDao order = null;
		CustomerTxnDao customer = null;
		List<OrderDetailsDao> orderDetailsList = new ArrayList<>();
		List<CustomerPaymentDao> customerpayement = new ArrayList<>();
		List<PaymentDetailsDao> paymentDetailsList = new ArrayList<>();
		List<CreditNoteDao> creditNoteList = new ArrayList<>();
		List<InventoryDetailsDao> inventoryDetailsList = new ArrayList<>();
		List<CustomerDocumentsDao> customerDocList = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		for (SyncData data : syncDataList) {
			if (data.getOrder() == 0) {
				salesTxn = salesCommon.syncSalesTxn(data, mapper);
			} else if (data.getOrder() == 1) {
				order = syncOrder(data, mapper);
			} else if (data.getOrder() == 2) {
				syncOrderDetails(data, orderDetailsList, mapper);
			} else if (data.getOrder() == 3) {
				salesCommon.syncPaymentDetails(data, paymentDetailsList, mapper);
			} else if (data.getOrder() == 4) {
				salesCommon.syncCreditNote(data, creditNoteList, mapper);
			} else if (data.getOrder() == 5) {
				customer = salesCommon.syncCustomerDetails(data, mapper);
			} else if (data.getOrder() == 6) {
				salesCommon.syncInventoryDetails(data, inventoryDetailsList, mapper);
			}else if (data.getOrder() == 7) {
				salesCommon.syncCustomerPayement(data, customerpayement, mapper);
			}else if (data.getOrder() == 8) {
				salesCommon.syncCustomerDocument(data, customerDocList, mapper);
			}
		}
		return orderSynService.dbOperation(salesTxn, order, orderDetailsList, paymentDetailsList, creditNoteList,
				customer, inventoryDetailsList,customerpayement,customerDocList);
	}

	private OrderDao syncOrder(SyncData data, ObjectMapper mapper) {
		OrderSyncDto syncDto = new OrderSyncDto();
		OrderDao srcOrder = syncDto.getOrderDao(mapper.convertValue(data.getData(), new TypeReference<OrderSyncDto>() {
		}));
		Optional<OrderDao> destOrder = orderRepository.findById(srcOrder.getId());
		if (!destOrder.isPresent()) {
			int tempSrcDataSyncId = srcOrder.getSrcSyncId();
			srcOrder.setSrcSyncId(srcOrder.getDestSyncId());
			srcOrder.setDestSyncId(tempSrcDataSyncId);
			return srcOrder;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcOrder.getSrcSyncId(), srcOrder.getDestSyncId(),
					destOrder.get().getSrcSyncId(), destOrder.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcOrder.getSrcSyncId();
				srcOrder.setSrcSyncId(srcOrder.getDestSyncId());
				srcOrder.setDestSyncId(tempSrcDataSyncId);
				return srcOrder;
			}
		}
		return null;
	}

	private void syncOrderDetails(SyncData data, List<OrderDetailsDao> orderDetailsList, ObjectMapper mapper) {
		OrderDetailsSyncDto syncDto = new OrderDetailsSyncDto();
		List<OrderDetailsDao> srcOrderDetailsList = syncDto.getOrderDetailsDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<OrderDetailsSyncDto>>() {
				}));
		srcOrderDetailsList.forEach(srcOrderDetails -> {
			Optional<OrderDetailsDao> destOrderDetails = orderDetailsRepository.findById(srcOrderDetails.getId());
			if (!destOrderDetails.isPresent()) {
				int tempSrcDataSyncId = srcOrderDetails.getSrcSyncId();
				srcOrderDetails.setSrcSyncId(srcOrderDetails.getDestSyncId());
				srcOrderDetails.setDestSyncId(tempSrcDataSyncId);
				orderDetailsList.add(srcOrderDetails);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcOrderDetails.getSrcSyncId(),
						srcOrderDetails.getDestSyncId(), destOrderDetails.get().getSrcSyncId(),
						destOrderDetails.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcOrderDetails.getSrcSyncId();
					srcOrderDetails.setSrcSyncId(srcOrderDetails.getDestSyncId());
					srcOrderDetails.setDestSyncId(tempSrcDataSyncId);
					orderDetailsList.add(srcOrderDetails);
				}
			}
		});

	}

	@Transactional(value="chainedTransaction")
	public Boolean dbOperation(SalesTxnDao salesTxn, OrderDao order, List<OrderDetailsDao> orderDetailsList,
			List<PaymentDetailsDao> paymentDetailsList, List<CreditNoteDao> creditNoteList, CustomerTxnDao customer,
			List<InventoryDetailsDao> inventoryDetailsList,List<CustomerPaymentDao> customerpayement, List<CustomerDocumentsDao> customerDocList) {
		Boolean flag = false;
		if (salesTxn != null) {
			salesTxnRepository.save(salesTxn);
			flag = true;
		}
		if (order != null) {
			orderRepository.save(order);
			flag = true;
		}
		if (!orderDetailsList.isEmpty()) {
			orderDetailsRepository.saveAll(orderDetailsList);
			flag = true;
		}
		if (customer != null) {
			cusTxnDetailsRepository.save(customer);
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
		if (!inventoryDetailsList.isEmpty()) {
			inventoryDetailsRepo.saveAll(inventoryDetailsList);
			flag = true;
		}
		if (customerpayement != null) {
			customerPaymentRepo.saveAll(customerpayement);
			flag = true;
		}
		if (!customerDocList.isEmpty()) {
			customerDocRepo.saveAll(customerDocList);
			flag = true;
		}
		return flag;
	}
}
