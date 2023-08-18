/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.sales.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.CustomerCouponDao;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.CustomerPaymentDao;
import com.titan.poss.sales.dao.CustomerTcsDetailsDao;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.DocNumberFailAuditDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDao;
import com.titan.poss.sales.dao.PaymentItemMappingDao;
import com.titan.poss.sales.dao.PaymentRequestsDao;
import com.titan.poss.sales.dao.SalesInvoiceDocumentsDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dto.CreditNoteSyncDto;
import com.titan.poss.sales.dto.CustomerCouponSyncDto;
import com.titan.poss.sales.dto.CustomerDocumentSyncDto;
import com.titan.poss.sales.dto.CustomerPaymentSyncDto;
import com.titan.poss.sales.dto.CustomerTcsDetailsSyncDto;
import com.titan.poss.sales.dto.CustomerTxnSyncDto;
import com.titan.poss.sales.dto.DocNumberFailAuditSyncDtoExt;
import com.titan.poss.sales.dto.PaymentDetailsSyncDto;
import com.titan.poss.sales.dto.PaymentItemMappingSyncDto;
import com.titan.poss.sales.dto.PaymentRequestSyncDto;
import com.titan.poss.sales.dto.SalesInvoiceDocsSyncDto;
import com.titan.poss.sales.dto.SalesTxnSyncDto;
import com.titan.poss.sales.repository.CreditNoteRepository;
import com.titan.poss.sales.repository.CustomerCouponRepository;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.repository.CustomerPaymentRepository;
import com.titan.poss.sales.repository.CustomerTcsDetailsRepository;
import com.titan.poss.sales.repository.CustomerTxnRepository;
import com.titan.poss.sales.repository.DocNumberFailAuditDaoRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepository;
import com.titan.poss.sales.repository.PaymentItemMappingRepository;
import com.titan.poss.sales.repository.PaymentRequestsRepository;
import com.titan.poss.sales.repository.SalesInvoiceDocumentsRepository;
import com.titan.poss.sales.repository.SalesTxnRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class SalesCommonUtil {

	@Autowired
	private SalesTxnRepository salesTxnRepository;

	@Autowired
	private CustomerCouponRepository customerCouponRepo;

	@Autowired
	private InventoryDetailsRepository inventoryDetailsRepo;

	@Autowired
	private PaymentDetailsRepository paymentDetailsRepository;

	@Autowired
	private CreditNoteRepository creditRepository;

	@Autowired
	private CustomerTxnRepository cusTxnDetailsRepository;

	@Autowired
	private CustomerDocumentsRepository customerDocRepo;

	@Autowired
	private CustomerPaymentRepository customerPaymentRepo;

	@Autowired
	private PaymentItemMappingRepository paymentItemMappingRepository;
	
	@Autowired
	private PaymentRequestsRepository paymentRequestsRepository;
	
	@Autowired
	private CustomerTcsDetailsRepository customerTcsDetailsRepository;
	
	@Autowired
	private DocNumberFailAuditDaoRepositoryExt docNumberFailAuditRepository;
	
	@Autowired
	private SalesInvoiceDocumentsRepository salesInvoiceDocumentsRepository;

	protected SalesTxnDao syncSalesTxn(SyncData data, ObjectMapper mapper) {
		SalesTxnSyncDto syncDto = new SalesTxnSyncDto();
		SalesTxnDao srcSalesTxnDao = syncDto
				.getSalesDao(mapper.convertValue(data.getData(), new TypeReference<SalesTxnSyncDto>() {
				}));
		Optional<SalesTxnDao> destSalesTxnDao = salesTxnRepository.findById(srcSalesTxnDao.getId());
		if (!destSalesTxnDao.isPresent()) {
			int tempSrcDataSyncId = srcSalesTxnDao.getSrcSyncId();
			srcSalesTxnDao.setSrcSyncId(srcSalesTxnDao.getDestSyncId());
			srcSalesTxnDao.setDestSyncId(tempSrcDataSyncId);
			return srcSalesTxnDao;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcSalesTxnDao.getSrcSyncId(),
					srcSalesTxnDao.getDestSyncId(), destSalesTxnDao.get().getSrcSyncId(),
					destSalesTxnDao.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcSalesTxnDao.getSrcSyncId();
				srcSalesTxnDao.setSrcSyncId(srcSalesTxnDao.getDestSyncId());
				srcSalesTxnDao.setDestSyncId(tempSrcDataSyncId);
				return srcSalesTxnDao;
			}
		}
		return null;
	}

	protected void syncInventoryDetails(SyncData data, List<InventoryDetailsDao> inventoryDetailsList,
			ObjectMapper mapper) {

		List<InventoryDetailsDao> srcInventroyDaoList = mapper.convertValue(data.getData(),
				new TypeReference<List<InventoryDetailsDao>>() {
				});
		srcInventroyDaoList.forEach(srcInventroyDao -> {
			Optional<InventoryDetailsDao> destInventroyDao = inventoryDetailsRepo.findById(srcInventroyDao.getId());
			if (!destInventroyDao.isPresent()) {
				int tempSrcDataSyncId = srcInventroyDao.getSrcSyncId();
				srcInventroyDao.setSrcSyncId(srcInventroyDao.getDestSyncId());
				srcInventroyDao.setDestSyncId(tempSrcDataSyncId);
				inventoryDetailsList.add(srcInventroyDao);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcInventroyDao.getSrcSyncId(),
						srcInventroyDao.getDestSyncId(), destInventroyDao.get().getSrcSyncId(),
						destInventroyDao.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcInventroyDao.getSrcSyncId();
					srcInventroyDao.setSrcSyncId(srcInventroyDao.getDestSyncId());
					srcInventroyDao.setDestSyncId(tempSrcDataSyncId);
					srcInventroyDao.setIssuedQuantity(
							(short) (destInventroyDao.get().getIssuedQuantity() - srcInventroyDao.getIssuedQuantity()));
					inventoryDetailsList.add(srcInventroyDao);
				}
			}
		});
	}

	protected void syncPaymentDetails(SyncData data, List<PaymentDetailsDao> paymentDetailsList, ObjectMapper mapper) {
		PaymentDetailsSyncDto syncDto = new PaymentDetailsSyncDto();
		List<PaymentDetailsDao> srcPaymentList = syncDto.getPaymentDetailsDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<PaymentDetailsSyncDto>>() {
				}));
		srcPaymentList.forEach(srcPayment -> {
			Optional<PaymentDetailsDao> destPayment = paymentDetailsRepository.findById(srcPayment.getId());
			if (!destPayment.isPresent()) {
				int tempSrcDataSyncId = srcPayment.getSrcSyncId();
				srcPayment.setSrcSyncId(srcPayment.getDestSyncId());
				srcPayment.setDestSyncId(tempSrcDataSyncId);
				paymentDetailsList.add(srcPayment);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcPayment.getSrcSyncId(),
						srcPayment.getDestSyncId(), destPayment.get().getSrcSyncId(),
						destPayment.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcPayment.getSrcSyncId();
					srcPayment.setSrcSyncId(srcPayment.getDestSyncId());
					srcPayment.setDestSyncId(tempSrcDataSyncId);
					paymentDetailsList.add(srcPayment);
				}
			}
		});
	}

	public void syncCreditNote(SyncData data, List<CreditNoteDao> creditNoteList, ObjectMapper mapper) {
		CreditNoteSyncDto syncDto = new CreditNoteSyncDto();
		List<CreditNoteDao> srcCreditList = syncDto
				.getCreditNoteDaoList(mapper.convertValue(data.getData(), new TypeReference<List<CreditNoteSyncDto>>() {
				}));
		srcCreditList.forEach(srcCredit -> {
			Optional<CreditNoteDao> destCredit = creditRepository.findById(srcCredit.getId());
			if (!destCredit.isPresent()) {
				int tempSrcDataSyncId = srcCredit.getSrcSyncId();
				srcCredit.setSrcSyncId(srcCredit.getDestSyncId());
				srcCredit.setDestSyncId(tempSrcDataSyncId);
				creditNoteList.add(srcCredit);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCredit.getSrcSyncId(), srcCredit.getDestSyncId(),
						destCredit.get().getSrcSyncId(), destCredit.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcCredit.getSrcSyncId();
					srcCredit.setSrcSyncId(srcCredit.getDestSyncId());
					srcCredit.setDestSyncId(tempSrcDataSyncId);
					creditNoteList.add(srcCredit);
				}
			}
		});
	}

	protected CustomerTxnDao syncCustomerDetails(SyncData data, ObjectMapper mapper) {
		CustomerTxnSyncDto syncDto = new CustomerTxnSyncDto();
		CustomerTxnDao srcCustomer = syncDto
				.getCustomerTxnDao(mapper.convertValue(data.getData(), new TypeReference<CustomerTxnSyncDto>() {
				}));
		Optional<CustomerTxnDao> destCustomerTx = cusTxnDetailsRepository.findById(srcCustomer.getId());
		if (!destCustomerTx.isPresent()) {
			int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
			srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
			srcCustomer.setDestSyncId(tempSrcDataSyncId);
			return srcCustomer;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCustomer.getSrcSyncId(), srcCustomer.getDestSyncId(),
					destCustomerTx.get().getSrcSyncId(), destCustomerTx.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
				srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
				srcCustomer.setDestSyncId(tempSrcDataSyncId);
				return srcCustomer;
			} else {
				return null;
			}
		}

	}

	protected void syncCustomerPayement(SyncData data, List<CustomerPaymentDao> customerpayement, ObjectMapper mapper) {
		CustomerPaymentSyncDto syncDto = new CustomerPaymentSyncDto();
		List<CustomerPaymentDao> srcCustomerPayment = syncDto.getCustomerPaymentDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<CustomerPaymentSyncDto>>() {
				}));
		srcCustomerPayment.forEach(srcCustomer -> {
			Optional<CustomerPaymentDao> destCustomer = customerPaymentRepo.findById(srcCustomer.getId());
			if (!destCustomer.isPresent()) {
				int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
				srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
				srcCustomer.setDestSyncId(tempSrcDataSyncId);
				customerpayement.add(srcCustomer);
			}
			destCustomer.ifPresent(dest -> {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCustomer.getSrcSyncId(),
						srcCustomer.getDestSyncId(), dest.getSrcSyncId(), dest.getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
					srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
					srcCustomer.setDestSyncId(tempSrcDataSyncId);
					customerpayement.add(srcCustomer);
				}
			});
		});

	}

	public void syncCustomerDocument(SyncData data, List<CustomerDocumentsDao> customerDocList, ObjectMapper mapper) {
		CustomerDocumentSyncDto syncDto = new CustomerDocumentSyncDto();
		List<CustomerDocumentsDao> srcCustomerList = syncDto.getCustomerDocumentsDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<CustomerDocumentSyncDto>>() {
				}));
		srcCustomerList.forEach(srcCustomer -> {
			Optional<CustomerDocumentsDao> destCustomer = customerDocRepo.findById(srcCustomer.getId());
			if (!destCustomer.isPresent()) {
				int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
				srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
				srcCustomer.setDestSyncId(tempSrcDataSyncId);
				customerDocList.add(srcCustomer);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCustomer.getSrcSyncId(),
						srcCustomer.getDestSyncId(), destCustomer.get().getSrcSyncId(),
						destCustomer.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
					srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
					srcCustomer.setDestSyncId(tempSrcDataSyncId);
					customerDocList.add(srcCustomer);
				}
			}
		});

	}

	public void syncCustomerCoupons(SyncData data, List<CustomerCouponDao> customerCoupons, ObjectMapper mapper) {
		CustomerCouponSyncDto syncDto = new CustomerCouponSyncDto();
		List<CustomerCouponDao> srcCustomerList = syncDto.getCustomerCouponsDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<CustomerCouponSyncDto>>() {
				}));
		srcCustomerList.forEach(srcCustomer -> {
			Optional<CustomerCouponDao> destCustomer = customerCouponRepo.findById(srcCustomer.getId());
			if (!destCustomer.isPresent()) {
				int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
				srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
				srcCustomer.setDestSyncId(tempSrcDataSyncId);
				customerCoupons.add(srcCustomer);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCustomer.getSrcSyncId(),
						srcCustomer.getDestSyncId(), destCustomer.get().getSrcSyncId(),
						destCustomer.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
					srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
					srcCustomer.setDestSyncId(tempSrcDataSyncId);
					customerCoupons.add(srcCustomer);
				}
			}
		});
	}

	public void syncPaymentItemMapping(SyncData data, List<PaymentItemMappingDao> paymentItemMappingList,
			ObjectMapper mapper) {
		PaymentItemMappingSyncDto syncDto = new PaymentItemMappingSyncDto();
		List<PaymentItemMappingDao> srcCustomerPayment = syncDto.getPaymentItemMappingDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<PaymentItemMappingSyncDto>>() {
				}));
		srcCustomerPayment.forEach(srcPaymentItemMapping -> {
			Optional<PaymentItemMappingDao> destPaymentItemMapping = paymentItemMappingRepository
					.findById(srcPaymentItemMapping.getId());
			if (!destPaymentItemMapping.isPresent()) {
				int tempSrcDataSyncId = srcPaymentItemMapping.getSrcSyncId();
				srcPaymentItemMapping.setSrcSyncId(srcPaymentItemMapping.getDestSyncId());
				srcPaymentItemMapping.setDestSyncId(tempSrcDataSyncId);
				paymentItemMappingList.add(srcPaymentItemMapping);
			}
			destPaymentItemMapping.ifPresent(dest -> {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcPaymentItemMapping.getSrcSyncId(),
						srcPaymentItemMapping.getDestSyncId(), dest.getSrcSyncId(), dest.getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcPaymentItemMapping.getSrcSyncId();
					srcPaymentItemMapping.setSrcSyncId(srcPaymentItemMapping.getDestSyncId());
					srcPaymentItemMapping.setDestSyncId(tempSrcDataSyncId);
					paymentItemMappingList.add(srcPaymentItemMapping);
				}
			});
		});
	}
	
	public void syncPaymentRequest(SyncData data, List<PaymentRequestsDao> paymentRequestDao, ObjectMapper mapper) {
		PaymentRequestSyncDto syncDto= new PaymentRequestSyncDto();
		PaymentRequestsDao srcPayment = syncDto.getPaymentRequestDao(
				mapper.convertValue(data.getData(), new TypeReference<PaymentRequestSyncDto>() {
				}));
	
		Optional<PaymentRequestsDao> destPayment = paymentRequestsRepository.findById(srcPayment.getId());
			if (!destPayment.isPresent()) {
				int tempSrcDataSyncId = srcPayment.getSrcSyncId();
				srcPayment.setSrcSyncId(srcPayment.getDestSyncId());
				srcPayment.setDestSyncId(tempSrcDataSyncId);
				paymentRequestDao.add(srcPayment);
			}
			destPayment.ifPresent(dest -> {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcPayment.getSrcSyncId(),
						srcPayment.getDestSyncId(), dest.getSrcSyncId(), dest.getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcPayment.getSrcSyncId();
					srcPayment.setSrcSyncId(srcPayment.getDestSyncId());
					srcPayment.setDestSyncId(tempSrcDataSyncId);
					paymentRequestDao.add(srcPayment);
				}
			});
		

		
	}
	
	protected void syncCustomerTcsDetails(SyncData data, List<CustomerTcsDetailsDao> customerTcsDetailsDao, ObjectMapper mapper) {
		CustomerTcsDetailsSyncDto syncDto = new CustomerTcsDetailsSyncDto();
		CustomerTcsDetailsDao srcCustomerTcs = syncDto.getCustomerTcsDetailsDao(

				mapper.convertValue(data.getData(), new TypeReference<CustomerTcsDetailsSyncDto>() {
				}));
			Optional<CustomerTcsDetailsDao> destCustomer = customerTcsDetailsRepository.findById(srcCustomerTcs.getId());
			if (!destCustomer.isPresent()) {
				int tempSrcDataSyncId = srcCustomerTcs.getSrcSyncId();
				srcCustomerTcs.setSrcSyncId(srcCustomerTcs.getDestSyncId());
				srcCustomerTcs.setDestSyncId(tempSrcDataSyncId);
				customerTcsDetailsDao.add(srcCustomerTcs);
			}
			destCustomer.ifPresent(dest -> {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCustomerTcs.getSrcSyncId(),
						srcCustomerTcs.getDestSyncId(), dest.getSrcSyncId(), dest.getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcCustomerTcs.getSrcSyncId();
					srcCustomerTcs.setSrcSyncId(srcCustomerTcs.getDestSyncId());
					srcCustomerTcs.setDestSyncId(tempSrcDataSyncId);
					customerTcsDetailsDao.add(srcCustomerTcs);
				}
			});
	}

	public void syncDocNumberFailAudit(SyncData data, List<DocNumberFailAuditDaoExt> docNumberFailAudit,
			ObjectMapper mapper) {
		DocNumberFailAuditSyncDtoExt syncDto = new DocNumberFailAuditSyncDtoExt();
		List<DocNumberFailAuditDaoExt> srcDocNumberFailAudit = syncDto.getDocNumberFailAudit(
				mapper.convertValue(data.getData(), new TypeReference<List<DocNumberFailAuditSyncDtoExt>>() {
				}));
		srcDocNumberFailAudit.forEach(srcDocNumber -> {
			Optional<DocNumberFailAuditDaoExt> destDocNumber = docNumberFailAuditRepository.findById(srcDocNumber.getId());
			if (!destDocNumber.isPresent()) {
				int tempSrcDataSyncId = srcDocNumber.getSrcSyncId();
				srcDocNumber.setSrcSyncId(srcDocNumber.getDestSyncId());
				srcDocNumber.setDestSyncId(tempSrcDataSyncId);
				docNumberFailAudit.add(srcDocNumber);
			}
			destDocNumber.ifPresent(dest -> {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDocNumber.getSrcSyncId(),
						srcDocNumber.getDestSyncId(), dest.getSrcSyncId(), dest.getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcDocNumber.getSrcSyncId();
					srcDocNumber.setSrcSyncId(srcDocNumber.getDestSyncId());
					srcDocNumber.setDestSyncId(tempSrcDataSyncId);
					docNumberFailAudit.add(srcDocNumber);
				}
			});
		});
		
	}
	
	
	protected void syncInvoiceDocs(SyncData data, List<SalesInvoiceDocumentsDao> invoiceDocs, ObjectMapper mapper) {
		SalesInvoiceDocsSyncDto syncDto = new SalesInvoiceDocsSyncDto();
		List<SalesInvoiceDocumentsDao> srcInvoiceDocs = syncDto.getInvoiceDocsDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<SalesInvoiceDocsSyncDto>>() {
				}));
		srcInvoiceDocs.forEach(srcInvoiceDoc -> {
			SalesInvoiceDocumentsDao invoieDocs = salesInvoiceDocumentsRepository.findByReferenceIdAndTransactionType(srcInvoiceDoc.getReferenceId(), srcInvoiceDoc.getTransactionType());
			if (null==invoieDocs) {
				int tempSrcDataSyncId = srcInvoiceDoc.getSrcSyncId();
				srcInvoiceDoc.setSrcSyncId(srcInvoiceDoc.getDestSyncId());
				srcInvoiceDoc.setDestSyncId(tempSrcDataSyncId);
				invoiceDocs.add(srcInvoiceDoc);
			}
		});

	}

	

}
