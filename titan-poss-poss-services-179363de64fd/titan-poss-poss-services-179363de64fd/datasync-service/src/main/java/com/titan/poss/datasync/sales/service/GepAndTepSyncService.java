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
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.GoodsExchangeDao;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDao;
import com.titan.poss.sales.dao.GoodsExchangeOffersDao;
import com.titan.poss.sales.dao.PaymentReversalDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dto.GoodExchangeOfferSyncDto;
import com.titan.poss.sales.dto.GoodsExchangeDetailsSyncDto;
import com.titan.poss.sales.dto.GoodsExchangeSyncDto;
import com.titan.poss.sales.dto.PaymentReversalSyncDto;
import com.titan.poss.sales.repository.CreditNoteRepository;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.repository.CustomerTxnRepository;
import com.titan.poss.sales.repository.GoodsExchangeDetailsRepository;
import com.titan.poss.sales.repository.GoodsExchangeOffersRepository;
import com.titan.poss.sales.repository.GoodsExchangeRepository;
import com.titan.poss.sales.repository.PaymentReversalRepository;
import com.titan.poss.sales.repository.SalesTxnRepository;

@Service
public class GepAndTepSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private SalesTxnRepository salesTxnRepository;

	@Autowired
	private CreditNoteRepository creditRepository;

	@Autowired
	private CustomerTxnRepository cusTxnDetailsRepository;
	
	@Autowired
	private CustomerDocumentsRepository customerDocumentRepo;

	@Autowired
	private SalesCommonUtil salesCommon;

	@Autowired
	private GoodsExchangeRepository goodsExchangeRepo;

	@Autowired
	private GoodsExchangeDetailsRepository goodsExchangeDetailsRepo;

	@Autowired
	private GoodsExchangeOffersRepository goodsExchangeOfferRepo;

	@Autowired
	private InventoryDetailsRepository inventoryDetailsRepo;

	@Autowired
	private GepAndTepSyncService gpSyncService;
	
	@Autowired
	private PaymentReversalRepository reversalRepository;


	private static final Logger LOGGER = LoggerFactory.getLogger(GepAndTepSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		try {
			if (operationCode.equals(SalesOperationCode.GEP_CONFIRM)
					|| operationCode.equals(SalesOperationCode.TEP_CONFIRM)) {
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
		List<PaymentReversalDao> paymentReversalList = new ArrayList<>();
		SalesTxnDao saveSalesTxnDao = null;
		GoodsExchangeDao goodsExcDao = null;
		List<GoodsExchangeDetailsDao> saveGoodsDetails = new ArrayList<>();
		List<InventoryDetailsDao> inventoryDetailsList = new ArrayList<>();
		List<CustomerDocumentsDao> customerDoctumentsList = new ArrayList<>();
		GoodsExchangeOffersDao goodsOfferDao = null;
		CustomerTxnDao customer = null;
		List<CreditNoteDao> creditNoteList = new ArrayList<>();
		for (SyncData data : syncDataList) {
			if (data.getOrder() == 0) {
				saveSalesTxnDao = salesCommon.syncSalesTxn(data, mapper);
			} else if (data.getOrder() == 1) {
				goodsExcDao = syncGoodsExchange(data, mapper);
			} else if (data.getOrder() == 2) {
				syncGoodExchangeDetails(data, saveGoodsDetails, mapper);
			} else if (data.getOrder() == 3) {
				goodsOfferDao = syncGoodsOffer(data, mapper);
			} else if (data.getOrder() == 4) {
				salesCommon.syncCreditNote(data, creditNoteList, mapper);
			} else if (data.getOrder() == 5) {
				customer = salesCommon.syncCustomerDetails(data, mapper);
			} else if (data.getOrder() == 6) {
				salesCommon.syncInventoryDetails(data, inventoryDetailsList, mapper);
			}else if (data.getOrder() == 11) {
				salesCommon.syncCustomerDocument(data, customerDoctumentsList, mapper);
			}else if(data.getOrder()==12) {
				syncPaymentReversal(data, paymentReversalList, mapper);
				
			}
		}
		return gpSyncService.dbOperation(saveSalesTxnDao, goodsExcDao, saveGoodsDetails, inventoryDetailsList,
				goodsOfferDao, creditNoteList, customer,customerDoctumentsList,paymentReversalList);

	}

	private GoodsExchangeOffersDao syncGoodsOffer(SyncData data, ObjectMapper mapper) {
		GoodExchangeOfferSyncDto syncDto = new GoodExchangeOfferSyncDto();
		GoodsExchangeOffersDao srcGoodsOffer = syncDto.getGoodsExchangeOffer(
				mapper.convertValue(data.getData(), new TypeReference<GoodExchangeOfferSyncDto>() {
				}));
		Optional<GoodsExchangeOffersDao> destGoodsOffer = goodsExchangeOfferRepo.findById(srcGoodsOffer.getId());
		if (!destGoodsOffer.isPresent()) {
			int tempSrcDataSyncId = srcGoodsOffer.getSrcSyncId();
			srcGoodsOffer.setSrcSyncId(srcGoodsOffer.getDestSyncId());
			srcGoodsOffer.setDestSyncId(tempSrcDataSyncId);
			return srcGoodsOffer;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcGoodsOffer.getSrcSyncId(),
					srcGoodsOffer.getDestSyncId(), destGoodsOffer.get().getSrcSyncId(),
					destGoodsOffer.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcGoodsOffer.getSrcSyncId();
				srcGoodsOffer.setSrcSyncId(srcGoodsOffer.getDestSyncId());
				srcGoodsOffer.setDestSyncId(tempSrcDataSyncId);
				return srcGoodsOffer;
			}
		}
		return null;
	}

	private GoodsExchangeDao syncGoodsExchange(SyncData data, ObjectMapper mapper) {
		GoodsExchangeSyncDto syncDto = new GoodsExchangeSyncDto();
		GoodsExchangeDao srcGoods = syncDto
				.getGoodsExchangeDao(mapper.convertValue(data.getData(), new TypeReference<GoodsExchangeSyncDto>() {
				}));
		Optional<GoodsExchangeDao> destGoods = goodsExchangeRepo.findById(srcGoods.getId());
		if (!destGoods.isPresent()) {
			int tempSrcDataSyncId = srcGoods.getSrcSyncId();
			srcGoods.setSrcSyncId(srcGoods.getDestSyncId());
			srcGoods.setDestSyncId(tempSrcDataSyncId);
			return srcGoods;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcGoods.getSrcSyncId(), srcGoods.getDestSyncId(),
					destGoods.get().getSrcSyncId(), destGoods.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcGoods.getSrcSyncId();
				srcGoods.setSrcSyncId(srcGoods.getDestSyncId());
				srcGoods.setDestSyncId(tempSrcDataSyncId);
				return srcGoods;
			}
		}
		return null;
	}

	private void syncGoodExchangeDetails(SyncData data, List<GoodsExchangeDetailsDao> saveGepDetails,
			ObjectMapper mapper) {
		GoodsExchangeDetailsSyncDto syncDto = new GoodsExchangeDetailsSyncDto();
		List<GoodsExchangeDetailsDao> srcGoodsDetailsList = syncDto.getGoodsExchangeDetailsDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<GoodsExchangeDetailsSyncDto>>() {
				}));
		for (GoodsExchangeDetailsDao srcGoodsDetail : srcGoodsDetailsList) {
			Optional<GoodsExchangeDetailsDao> destGoodsDetail = goodsExchangeDetailsRepo
					.findById(srcGoodsDetail.getId());
			if (!destGoodsDetail.isPresent()) {
				int tempSrcDataSyncId = srcGoodsDetail.getSrcSyncId();
				srcGoodsDetail.setSrcSyncId(srcGoodsDetail.getDestSyncId());
				srcGoodsDetail.setDestSyncId(tempSrcDataSyncId);
				saveGepDetails.add(srcGoodsDetail);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcGoodsDetail.getSrcSyncId(),
						srcGoodsDetail.getDestSyncId(), destGoodsDetail.get().getSrcSyncId(),
						destGoodsDetail.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcGoodsDetail.getSrcSyncId();
					srcGoodsDetail.setSrcSyncId(srcGoodsDetail.getDestSyncId());
					srcGoodsDetail.setDestSyncId(tempSrcDataSyncId);
					saveGepDetails.add(srcGoodsDetail);
				}
			}

		}
	}

	@Transactional(value = "chainedTransaction")
	public Boolean dbOperation(SalesTxnDao saveSalesTxnDao, GoodsExchangeDao goodsExcDao,
			List<GoodsExchangeDetailsDao> saveGoodsDetails, List<InventoryDetailsDao> inventoryDetailsList,
			GoodsExchangeOffersDao goodsOfferDao, List<CreditNoteDao> creditNoteList, CustomerTxnDao customer, List<CustomerDocumentsDao> customerDoctumentsList,List<PaymentReversalDao> paymentReversalList) {
		Boolean flag = false;
		if (saveSalesTxnDao != null) {
			salesTxnRepository.save(saveSalesTxnDao);
			flag = true;
		}
		if (goodsExcDao != null) {
			goodsExchangeRepo.save(goodsExcDao);
			flag = true;
		}
		if (!saveGoodsDetails.isEmpty()) {
			goodsExchangeDetailsRepo.saveAll(saveGoodsDetails);
			flag = true;
		}
		if (goodsOfferDao != null) {
			goodsExchangeOfferRepo.save(goodsOfferDao);
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
				cn = creditRepository.saveAndFlush(cn);
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
				creditRepository.saveAndFlush(cn);
			});
			flag = true;
		}
		if(!customerDoctumentsList.isEmpty()) {
			customerDocumentRepo.saveAll(customerDoctumentsList);
			flag = true;
		}
		if (!inventoryDetailsList.isEmpty()) {
			inventoryDetailsRepo.saveAll(inventoryDetailsList);
			flag = true;
		}
		if (!paymentReversalList.isEmpty()) {
			reversalRepository.saveAll(paymentReversalList);
			flag = true;
		}
		return flag;
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

}
