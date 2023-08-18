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
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.OrderDao;
import com.titan.poss.sales.dao.OrderDetailsDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dto.CreditNoteSyncDto;
import com.titan.poss.sales.dto.OrderDetailsSyncDto;
import com.titan.poss.sales.dto.OrderSyncDto;
import com.titan.poss.sales.dto.SalesTxnSyncDto;
import com.titan.poss.sales.repository.CreditNoteRepository;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.repository.OrderDetailsRepository;
import com.titan.poss.sales.repository.OrderRepository;
import com.titan.poss.sales.repository.SalesTxnRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class SalesJobSyncService implements SyncOperation {

	private static final Logger LOGGER = LoggerFactory.getLogger(SalesJobSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private SalesJobSyncService jobSyncService;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private SalesTxnRepository salesTxnRepository;

	@Autowired
	private CustomerDocumentsRepository customerDocRepo;

	@Autowired
	private SalesCommonUtil salesCommon;

	@Autowired
	private CreditNoteRepository creditNoteRepository;

	@Autowired
	private OrderDetailsRepository orderDetailsRepository;

	@Autowired
	private InventoryDetailsRepository inventoryDetailsRepo;

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
			Boolean flag = syncService(syncDataList);
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

	private Boolean syncService(List<SyncData> syncDataList) {
		ObjectMapper mapper = new ObjectMapper();
		List<SalesTxnDao> salesTxnList = new ArrayList<>();
		List<OrderDao> orderList = new ArrayList<>();
		List<CustomerDocumentsDao> customerDocList = new ArrayList<>();
		List<CreditNoteDao> creditNoteDaoList = new ArrayList<>();
		List<OrderDetailsDao> orderDetailsList = new ArrayList<>();
		List<InventoryDetailsDao> inventoryDetailsList = new ArrayList<>();
		for (SyncData data : syncDataList) {
			if (data.getOrder() == 0) {
				syncSalesTxnList(data, salesTxnList, mapper);
			} else if (data.getOrder() == 1) {
				syncOrderList(data, orderList, mapper);
			} else if (data.getOrder() == 2) {
				salesCommon.syncCustomerDocument(data, customerDocList, mapper);
			} else if (data.getOrder() == 3) {
				syncCreditNoteList(data, creditNoteDaoList, mapper);
			} else if (data.getOrder() == 4) {
				syncOrderDetails(data, orderDetailsList, mapper);
			} else if (data.getOrder() == 5) {
				salesCommon.syncInventoryDetails(data, inventoryDetailsList, mapper);
			}
		}
		return jobSyncService.dbOperation(salesTxnList, customerDocList, orderList, creditNoteDaoList, orderDetailsList,
				inventoryDetailsList);
	}

	/**
	 * @param data
	 * @param creditNoteDaoList
	 * @param mapper
	 */
	private void syncCreditNoteList(SyncData data, List<CreditNoteDao> creditNoteDaoList, ObjectMapper mapper) {

		CreditNoteSyncDto syncDto = new CreditNoteSyncDto();
		List<CreditNoteDao> srCreditNoteDaos = syncDto
				.getCreditNoteDaoList(mapper.convertValue(data.getData(), new TypeReference<List<SalesTxnSyncDto>>() {
				}));
		srCreditNoteDaos.forEach(srcCredit -> {
			Optional<CreditNoteDao> destCredit = creditNoteRepository.findById(srcCredit.getId());
			if (destCredit.isPresent()) {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCredit.getSrcSyncId(), srcCredit.getDestSyncId(),
						destCredit.get().getSrcSyncId(), destCredit.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcCredit.getSrcSyncId();
					srcCredit.setSrcSyncId(srcCredit.getDestSyncId());
					srcCredit.setDestSyncId(tempSrcDataSyncId);
					creditNoteDaoList.add(srcCredit);
				}
			}
		});
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

	private void syncSalesTxnList(SyncData data, List<SalesTxnDao> salesTxnList, ObjectMapper mapper) {
		SalesTxnSyncDto syncDto = new SalesTxnSyncDto();
		List<SalesTxnDao> srcSalesDaoList = syncDto
				.getSalesDaoList(mapper.convertValue(data.getData(), new TypeReference<List<SalesTxnSyncDto>>() {
				}));
		srcSalesDaoList.forEach(srcSalesDao -> {
			Optional<SalesTxnDao> destSalesDao = salesTxnRepository.findById(srcSalesDao.getId());
			if (!destSalesDao.isPresent()) {
				int tempSrcDataSyncId = srcSalesDao.getSrcSyncId();
				srcSalesDao.setSrcSyncId(srcSalesDao.getDestSyncId());
				srcSalesDao.setDestSyncId(tempSrcDataSyncId);
				salesTxnList.add(srcSalesDao);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcSalesDao.getSrcSyncId(),
						srcSalesDao.getDestSyncId(), destSalesDao.get().getSrcSyncId(),
						destSalesDao.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcSalesDao.getSrcSyncId();
					srcSalesDao.setSrcSyncId(srcSalesDao.getDestSyncId());
					srcSalesDao.setDestSyncId(tempSrcDataSyncId);
					salesTxnList.add(srcSalesDao);
				}
			}
		});

	}

	private void syncOrderList(SyncData data, List<OrderDao> orderList, ObjectMapper mapper) {
		OrderSyncDto syncDto = new OrderSyncDto();
		List<OrderDao> srcOrderDaoList = syncDto
				.getOrderDaoList(mapper.convertValue(data.getData(), new TypeReference<List<OrderSyncDto>>() {
				}));
		srcOrderDaoList.forEach(srcOrderDao -> {
			Optional<OrderDao> destOrderDao = orderRepository.findById(srcOrderDao.getId());
			if (!destOrderDao.isPresent()) {
				int tempSrcDataSyncId = srcOrderDao.getSrcSyncId();
				srcOrderDao.setSrcSyncId(srcOrderDao.getDestSyncId());
				srcOrderDao.setDestSyncId(tempSrcDataSyncId);
				orderList.add(srcOrderDao);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcOrderDao.getSrcSyncId(),
						srcOrderDao.getDestSyncId(), destOrderDao.get().getSrcSyncId(),
						destOrderDao.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcOrderDao.getSrcSyncId();
					srcOrderDao.setSrcSyncId(srcOrderDao.getDestSyncId());
					srcOrderDao.setDestSyncId(tempSrcDataSyncId);
					orderList.add(srcOrderDao);
				}
			}
		});

	}

	@Transactional(value = "chainedTransaction")
	public Boolean dbOperation(List<SalesTxnDao> salesTxnList, List<CustomerDocumentsDao> customerDocList,
			List<OrderDao> orderList, List<CreditNoteDao> creditNoteDaoList, List<OrderDetailsDao> orderDetailsList,
			List<InventoryDetailsDao> inventoryDetailsList) {
		Boolean flag = false;
		if (salesTxnList != null && !salesTxnList.isEmpty()) {
			salesTxnRepository.saveAll(salesTxnList);
			flag = true;
		}
		if (orderList != null && !orderList.isEmpty()) {
			orderRepository.saveAll(orderList);
			flag = true;
		}
		if (customerDocList != null && !customerDocList.isEmpty()) {
			customerDocRepo.saveAll(customerDocList);
			flag = true;
		}
		if (creditNoteDaoList != null && !creditNoteDaoList.isEmpty()) {
			creditNoteRepository.saveAll(creditNoteDaoList);
			flag = true;
		}
		if (orderDetailsList != null && !orderDetailsList.isEmpty()) {
			orderDetailsRepository.saveAll(orderDetailsList);
			flag = true;
		}
		if (inventoryDetailsList != null && !inventoryDetailsList.isEmpty()) {
			inventoryDetailsRepo.saveAll(inventoryDetailsList);
			flag = true;
		}
		return flag;
	}

}
