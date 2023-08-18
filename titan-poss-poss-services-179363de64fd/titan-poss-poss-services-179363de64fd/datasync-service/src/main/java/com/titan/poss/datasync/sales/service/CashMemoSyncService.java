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
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;
import com.titan.poss.sales.dao.CashMemoDao;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.CustomerCouponDao;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.CustomerPaymentDao;
import com.titan.poss.sales.dao.CustomerTcsDetailsDao;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.FocDetailsDao;
import com.titan.poss.sales.dao.FocSchemesDao;
import com.titan.poss.sales.dao.GiftDetailsDao;
import com.titan.poss.sales.dao.PaymentDetailsDao;
import com.titan.poss.sales.dao.PaymentItemMappingDao;
import com.titan.poss.sales.dao.PaymentReversalDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dto.CashMemoDetailsSyncDto;
import com.titan.poss.sales.dto.CashMemoSyncDto;
import com.titan.poss.sales.dto.FocDetailsSyncDto;
import com.titan.poss.sales.dto.FocSchemeSyncDto;
import com.titan.poss.sales.dto.GiftDetailsSyncDto;
import com.titan.poss.sales.dto.PaymentReversalSyncDto;
import com.titan.poss.sales.repository.CashMemoDetailsRepository;
import com.titan.poss.sales.repository.CashMemoRepository;
import com.titan.poss.sales.repository.CreditNoteRepository;
import com.titan.poss.sales.repository.CustomerCouponRepository;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.repository.CustomerPaymentRepository;
import com.titan.poss.sales.repository.CustomerTcsDetailsRepository;
import com.titan.poss.sales.repository.CustomerTxnRepository;
import com.titan.poss.sales.repository.FocDetailsRepository;
import com.titan.poss.sales.repository.FocSchemesRepository;
import com.titan.poss.sales.repository.GiftDetailsRepository;
import com.titan.poss.sales.repository.PaymentDetailsRepository;
import com.titan.poss.sales.repository.PaymentItemMappingRepository;
import com.titan.poss.sales.repository.PaymentReversalRepository;
import com.titan.poss.sales.repository.SalesTxnRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class CashMemoSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private CashMemoRepository cashMemoRepository;

	@Autowired
	private GiftDetailsRepository giftRepo;

	@Autowired
	private CashMemoDetailsRepository cmDetailsRepository;

	@Autowired
	private SalesTxnRepository salesTxnRepository;

	@Autowired
	private CustomerTxnRepository cusTxnDetailsRepository;

	@Autowired
	private CreditNoteRepository creditRepository;

	@Autowired
	private PaymentDetailsRepository paymentDetailsRepository;

	@Autowired
	private CashMemoSyncService csMemoSyncService;

	@Autowired
	private FocDetailsRepository focDetailsRepo;

	@Autowired
	private FocSchemesRepository focSchemesRepo;

	@Autowired
	private InventoryDetailsRepository inventoryDetailsRepo;

	@Autowired
	private CustomerPaymentRepository customerPaymentRepo;

	@Autowired
	private CustomerDocumentsRepository customerDocRepo;

	@Autowired
	private CustomerCouponRepository customerCouponRepo;

	@Autowired
	private SalesCommonUtil salesCommon;
	
	@Autowired
	private CustomerTcsDetailsRepository customerTcsDetailsRepository;

	@Autowired
	private PaymentItemMappingRepository paymentItemMappingRepository;
	
	@Autowired
	private PaymentReversalRepository reversalRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(CashMemoSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
			Boolean flag = syncConfirmData(syncData);
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

	private Boolean syncConfirmData(List<SyncData> syncData) {
		SalesTxnDao salesTxnDao = null;
		CashMemoDao cashMemo = null;
		List<GiftDetailsDao> giftList = new ArrayList<>();
		List<CashMemoDetailsDao> cmDetailsList = new ArrayList<>();
		CustomerTxnDao customer = null;
		List<PaymentDetailsDao> paymentDetailsList = new ArrayList<>();
		List<CustomerPaymentDao> customerpayement = new ArrayList<>();
		List<CreditNoteDao> creditNoteList = new ArrayList<>();
		List<FocDetailsDao> focDetailsList = new ArrayList<>();
		List<FocSchemesDao> focSchemesList = new ArrayList<>();
		List<InventoryDetailsDao> inventoryDetailsList = new ArrayList<>();
		List<CustomerDocumentsDao> customerDocList = new ArrayList<>();
		List<CustomerCouponDao> customerCoupons = new ArrayList<>();
		List<PaymentItemMappingDao> paymentItemMappingList = new ArrayList<>();
		List<CustomerTcsDetailsDao> customerTcsDetailsList = new ArrayList<>();
		List<PaymentReversalDao> paymentReversalList = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		for (SyncData data : syncData) {
			if (data.getOrder() == 0) {
				salesTxnDao = salesCommon.syncSalesTxn(data, mapper);
			} else if (data.getOrder() == 1) {
				cashMemo = syncCashMemo(data, mapper);
			} else if (data.getOrder() == 2) {
				syncGiftDetails(data, giftList, mapper);
			} else if (data.getOrder() == 3) {
				syncCashMemoDetails(data, cmDetailsList, mapper);
			} else if (data.getOrder() == 4) {
				customer = salesCommon.syncCustomerDetails(data, mapper);
			} else if (data.getOrder() == 5) {
				salesCommon.syncPaymentDetails(data, paymentDetailsList, mapper);
			} else if (data.getOrder() == 6) {
				salesCommon.syncCreditNote(data, creditNoteList, mapper);
			} else if (data.getOrder() == 7) {
				syncFocDetails(data, focDetailsList, mapper);
			} else if (data.getOrder() == 8) {
				syncFocSchemes(data, focSchemesList, mapper);
			} else if (data.getOrder() == 9) {
				salesCommon.syncInventoryDetails(data, inventoryDetailsList, mapper);
			} else if (data.getOrder() == 10) {
				salesCommon.syncCustomerPayement(data, customerpayement, mapper);
			} else if (data.getOrder() == 11) {
				salesCommon.syncCustomerDocument(data, customerDocList, mapper);
			} else if (data.getOrder() == 12) {
				salesCommon.syncCustomerCoupons(data, customerCoupons, mapper);
			} else if (data.getOrder() == 13) {
				salesCommon.syncPaymentItemMapping(data, paymentItemMappingList, mapper);
			} else if (data.getOrder() == 14) {
				salesCommon.syncCustomerTcsDetails(data, customerTcsDetailsList, mapper);
			} else if(data.getOrder() == 15) {
				syncPaymentReversal(data, paymentReversalList, mapper);
			}
		}
		return csMemoSyncService.dbOperation(salesTxnDao, cashMemo, giftList, cmDetailsList, customer,
				paymentDetailsList, creditNoteList, focDetailsList, focSchemesList, inventoryDetailsList,
				customerpayement, customerDocList, customerCoupons, paymentItemMappingList,customerTcsDetailsList,paymentReversalList);
	}
	
	private void syncPaymentReversal(SyncData data, List<PaymentReversalDao> paymentReversalList, ObjectMapper mapper) {
		PaymentReversalSyncDto syncDto = new PaymentReversalSyncDto();
		PaymentReversalDao srcPayment = syncDto.getPaymentReversalDao(
				mapper.convertValue(data.getData(), new TypeReference<PaymentReversalSyncDto>() {
				}));
		
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
		
	}

	private CashMemoDao syncCashMemo(SyncData data, ObjectMapper mapper) {
		CashMemoSyncDto syncDto = new CashMemoSyncDto();
		CashMemoDao srcCashMemo = syncDto
				.getCashMemoDao(mapper.convertValue(data.getData(), new TypeReference<CashMemoSyncDto>() {
				}));
		Optional<CashMemoDao> destCashMemo = cashMemoRepository.findById(srcCashMemo.getId());
		if (!destCashMemo.isPresent()) {
			int tempSrcDataSyncId = srcCashMemo.getSrcSyncId();
			srcCashMemo.setSrcSyncId(srcCashMemo.getDestSyncId());
			srcCashMemo.setDestSyncId(tempSrcDataSyncId);
			return srcCashMemo;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCashMemo.getSrcSyncId(), srcCashMemo.getDestSyncId(),
					destCashMemo.get().getSrcSyncId(), destCashMemo.get().getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				return null;
			} else {
				int tempSrcDataSyncId = srcCashMemo.getSrcSyncId();
				srcCashMemo.setSrcSyncId(srcCashMemo.getDestSyncId());
				srcCashMemo.setDestSyncId(tempSrcDataSyncId);
				return srcCashMemo;
			}
		}
	}

	private void syncGiftDetails(SyncData data, List<GiftDetailsDao> giftList, ObjectMapper mapper) {
		GiftDetailsSyncDto syncDto = new GiftDetailsSyncDto();
		List<GiftDetailsDao> srcGiftList = syncDto.getGiftDetailsDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<GiftDetailsSyncDto>>() {
				}));
		srcGiftList.forEach(srcgift -> {
			Optional<GiftDetailsDao> destGiftDao = giftRepo.findById(srcgift.getItemId());
			if (!destGiftDao.isPresent()) {
				int tempSrcDataSyncId = srcgift.getSrcSyncId();
				srcgift.setSrcSyncId(srcgift.getDestSyncId());
				srcgift.setDestSyncId(tempSrcDataSyncId);
				giftList.add(srcgift);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcgift.getSrcSyncId(), srcgift.getDestSyncId(),
						destGiftDao.get().getSrcSyncId(), destGiftDao.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcgift.getSrcSyncId();
					srcgift.setSrcSyncId(srcgift.getDestSyncId());
					srcgift.setDestSyncId(tempSrcDataSyncId);
					giftList.add(srcgift);
				}
			}
		});

	}

	private void syncCashMemoDetails(SyncData data, List<CashMemoDetailsDao> cmDetailsList, ObjectMapper mapper) {
		CashMemoDetailsSyncDto syncDto = new CashMemoDetailsSyncDto();
		List<CashMemoDetailsDao> srcDetailsList = syncDto.getCashMemoDetailsDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<CashMemoDetailsSyncDto>>() {
				}));
		srcDetailsList.forEach(srcDetails -> {
			Optional<CashMemoDetailsDao> destCashDetails = cmDetailsRepository.findById(srcDetails.getId());
			if (!destCashDetails.isPresent()) {
				int tempSrcDataSyncId = srcDetails.getSrcSyncId();
				srcDetails.setSrcSyncId(srcDetails.getDestSyncId());
				srcDetails.setDestSyncId(tempSrcDataSyncId);
				cmDetailsList.add(srcDetails);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDetails.getSrcSyncId(),
						srcDetails.getDestSyncId(), destCashDetails.get().getSrcSyncId(),
						destCashDetails.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcDetails.getSrcSyncId();
					srcDetails.setSrcSyncId(srcDetails.getDestSyncId());
					srcDetails.setDestSyncId(tempSrcDataSyncId);
					cmDetailsList.add(srcDetails);
				}
			}
		});
	}

	private void syncFocDetails(SyncData data, List<FocDetailsDao> focDetailsList, ObjectMapper mapper) {
		FocDetailsSyncDto syncDto = new FocDetailsSyncDto();
		List<FocDetailsDao> srcFocList = syncDto
				.getFocDetailsDaoList(mapper.convertValue(data.getData(), new TypeReference<List<FocDetailsSyncDto>>() {
				}));
		srcFocList.forEach(srcFoc -> {
			Optional<FocDetailsDao> destFoc = focDetailsRepo.findById(srcFoc.getId());
			if (!destFoc.isPresent()) {
				int tempSrcDataSyncId = srcFoc.getSrcSyncId();
				srcFoc.setSrcSyncId(srcFoc.getDestSyncId());
				srcFoc.setDestSyncId(tempSrcDataSyncId);
				focDetailsList.add(srcFoc);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcFoc.getSrcSyncId(), srcFoc.getDestSyncId(),
						destFoc.get().getSrcSyncId(), destFoc.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcFoc.getSrcSyncId();
					srcFoc.setSrcSyncId(srcFoc.getDestSyncId());
					srcFoc.setDestSyncId(tempSrcDataSyncId);
					focDetailsList.add(srcFoc);
				}
			}
		});

	}

	private void syncFocSchemes(SyncData data, List<FocSchemesDao> focSchemesList, ObjectMapper mapper) {
		FocSchemeSyncDto syncDto = new FocSchemeSyncDto();
		List<FocSchemesDao> srcFocList = syncDto
				.getFocSchemesList(mapper.convertValue(data.getData(), new TypeReference<List<FocSchemeSyncDto>>() {
				}));
		srcFocList.forEach(srcFoc -> {
			Optional<FocSchemesDao> destFoc = focSchemesRepo.findById(srcFoc.getId());
			if (!destFoc.isPresent()) {
				int tempSrcDataSyncId = srcFoc.getSrcSyncId();
				srcFoc.setSrcSyncId(srcFoc.getDestSyncId());
				srcFoc.setDestSyncId(tempSrcDataSyncId);
				focSchemesList.add(srcFoc);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcFoc.getSrcSyncId(), srcFoc.getDestSyncId(),
						destFoc.get().getSrcSyncId(), destFoc.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcFoc.getSrcSyncId();
					srcFoc.setSrcSyncId(srcFoc.getDestSyncId());
					srcFoc.setDestSyncId(tempSrcDataSyncId);
					focSchemesList.add(srcFoc);
				}
			}
		});

	}

	@Transactional(value = "chainedTransaction")
	public Boolean dbOperation(SalesTxnDao salesTxnDao, CashMemoDao cashMemo, List<GiftDetailsDao> giftList,
			List<CashMemoDetailsDao> cmDetailsList, CustomerTxnDao customer, List<PaymentDetailsDao> paymentDetailsList,
			List<CreditNoteDao> creditNoteList, List<FocDetailsDao> focDetailsList, List<FocSchemesDao> focSchemesList,
			List<InventoryDetailsDao> inventoryDetailsList, List<CustomerPaymentDao> customerpayement,
			List<CustomerDocumentsDao> customerDocList, List<CustomerCouponDao> customerCoupons,
			List<PaymentItemMappingDao> paymentItemMappingList, List<CustomerTcsDetailsDao> customerTcsDetailsList,List<PaymentReversalDao> paymentReversalList) {
		boolean flag = false;
		if (salesTxnDao != null) {
			String createdBy = salesTxnDao.getCreatedBy();
			salesTxnRepository.save(salesTxnDao);
			salesTxnRepository.updateSalesTxnCreatedBy(salesTxnDao.getId(), createdBy);
			flag = true;
		}
		if (cashMemo != null) {
			String createdBy = cashMemo.getCreatedBy();
			cashMemoRepository.save(cashMemo);cashMemoRepository.updateCashMemoCreatedBy(cashMemo.getId(), createdBy);
			
			flag = true;
		}
		if (!giftList.isEmpty()) {
			giftRepo.saveAll(giftList);
			flag = true;
		}
		if (!cmDetailsList.isEmpty()) {
			cmDetailsRepository.saveAll(cmDetailsList);
			flag = true;
		}
		if (customer != null) {
			cusTxnDetailsRepository.save(customer);
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
		if (!paymentDetailsList.isEmpty()) {
			paymentDetailsRepository.saveAll(paymentDetailsList);
			flag = true;
		}
		if (!focSchemesList.isEmpty()) {
			focSchemesRepo.saveAll(focSchemesList);
			flag = true;
		}
		if (!focDetailsList.isEmpty()) {
			focDetailsRepo.saveAll(focDetailsList);
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
		if (!CollectionUtil.isEmpty(customerCoupons)) {
			customerCouponRepo.saveAll(customerCoupons);
			flag = true;
		}

		if (!CollectionUtil.isEmpty(paymentItemMappingList)) {
			paymentItemMappingRepository.saveAll(paymentItemMappingList);
			flag = true;
		}
		if(!CollectionUtil.isEmpty(customerTcsDetailsList)) {
			customerTcsDetailsRepository.saveAll(customerTcsDetailsList);
			flag = true;
		}
		if(!CollectionUtil.isEmpty(paymentReversalList)) {
			reversalRepository.saveAll(paymentReversalList);
			flag = true;
		}
		return flag;
	}
}
