/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service.impl.documents;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.titan.poss.core.domain.constant.EinvoiceTransactionTypeEnum;
import com.titan.poss.core.dto.EinvoiceDto;
import com.titan.poss.core.dto.StorePrintDetailsDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.QRCodeGenerator;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CancelDao;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CustomerDigitalSignatureDaoExt;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesInvoiceDocumentsDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dto.AddressDetails;
import com.titan.poss.sales.dto.ApplicableTransactionTypesDto;
import com.titan.poss.sales.dto.InstitutionalCustomerCreateDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.dto.response.CustomerPrintDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.repository.CancellationRepository;
import com.titan.poss.sales.repository.CashMemoRepositoryExt;
import com.titan.poss.sales.repository.CustomerDigitalSignatureRepository;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesInvoiceDocumentsRepository;
import com.titan.poss.sales.repository.SalesTxnRepository;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.impl.CustomerServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public abstract class SalesDocumentGenerator {

	@Autowired
	private EngineService engineService;

	@Autowired
	private CustomerTxnRepositoryExt customerTxnRepository;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationRepo;

	@Autowired
	private SalesTxnRepository salesTxnRepo;

	@Autowired
	private CancellationRepository cancelRepo;

	@Autowired
	private CashMemoRepositoryExt cashMemoRepository;

	@Autowired
	private CommonCashMemoService cashMemoCommonService;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepo;

	@Autowired
	private SalesInvoiceDocumentsRepository invoiceDocumentsRepository;

	@Autowired
	private CustomerDigitalSignatureRepository customerDigitalSignatureRepository;

	@Autowired
	private EngineServiceClient engineServiceClient;
	
	@Autowired
	private CustomerServiceImpl customerService;

	private static final String RECORD_NOT_FOUND = "Record(s) Not found";
	private static final String ERR_CORE_039 = "ERR-CORE-039";
	private static final String CUST_TAX_NO = "custTaxNo";
	private static final String CUSTOMER_NAME = "customerName";
	private static final String MOBILE = "mobileNo";
	private static final String INSTI_TAX_NO = "instiTaxNo";
	private static final String PASSPORT_ID = "passportId";
	private static final String CUST_TAX_NO_OLD = "custTaxNoOld";
	private static final String EMAIL_ID =  "emailId";
	private static final String ULP_ID = "ulpId";

	protected StorePrintDetailsDto getStoreDetails() {

		return engineService.getStorePrintInformation();
	}

	protected EinvoiceDto setEinvoiceByTxnId(String txnId, EinvoiceTransactionTypeEnum txnType) {

		SalesInvoiceDocumentsDao id = invoiceDocumentsRepository.findByReferenceIdAndTransactionType(txnId,
				txnType.name());
		if (id == null)
			return null;

		EinvoiceDto einvoice = (EinvoiceDto) MapperUtil.getObjectMapping(id, new EinvoiceDto());
		einvoice.setQrCode(QRCodeGenerator.getQrCodeBase64(einvoice.getQrCodeValue(), 1000, 1000));

		return einvoice;
	}

	protected String setCashierDigitalSignature(String employeeCode) {
		employeeCode = CommonUtil.getEmployeeCode();
		String cashierSignature = "";
		if (cashierSignature != null) {
			Map<String, String> signature = engineServiceClient.getEmployeeSignature(employeeCode);
			if (signature != null && signature.containsKey("emp_signature")) {
				cashierSignature = parseString(signature.get("emp_signature"));
			}
		}
		return cashierSignature;
	}

	protected String setCustDigitalSignature(String mobileNumber, ApplicableTransactionTypes applicableTransactionTypes,
			String customerType) {

		String custSignature = null;
		CustomerDigitalSignatureDaoExt customerDigitalSignatureDao = customerDigitalSignatureRepository
				.findByMobileNumberAndCustomerTypeAndLocationCode(CryptoUtil.encrypt(mobileNumber, "MOBILENUMBER"), customerType,CommonUtil.getLocationCode());

		if (customerDigitalSignatureDao != null) {
			if (customerDigitalSignatureDao.getApplicableTransactionTypes() != null) {
				ApplicableTransactionTypesDto applicableTransactionTypesDto = MapperUtil.mapObjToClass(
						customerDigitalSignatureDao.getApplicableTransactionTypes(),
						ApplicableTransactionTypesDto.class);

				switch (applicableTransactionTypes) {
				case ADVANCEORDERORBOOKING:
					if (applicableTransactionTypesDto != null
							&& applicableTransactionTypesDto.getData().isAdvanceOrderOrBooking) {
						custSignature = parseString(customerDigitalSignatureDao.getDigitalSignature());
					}
					break;
				case CASHMEMO:
					if (applicableTransactionTypesDto != null && applicableTransactionTypesDto.getData().isCashMemo) {
						custSignature = parseString(customerDigitalSignatureDao.getDigitalSignature());
					}
					break;
				case GHS:
					break;
				case ACCEPTADVANCE:
					if (applicableTransactionTypesDto != null
							&& applicableTransactionTypesDto.getData().isAcceptAdvance) {
						custSignature = parseString(customerDigitalSignatureDao.getDigitalSignature());
					}
					break;
				case GRN:
					if (applicableTransactionTypesDto != null && applicableTransactionTypesDto.getData().isGRN) {
						custSignature = parseString(customerDigitalSignatureDao.getDigitalSignature());
					}
					break;
				case GRF:
					if (applicableTransactionTypesDto != null && applicableTransactionTypesDto.getData().isGRF) {
						custSignature = parseString(customerDigitalSignatureDao.getDigitalSignature());
					}
					break;
				case GIFTCARD:
					if (applicableTransactionTypesDto != null && applicableTransactionTypesDto.getData().isGiftCard) {
						custSignature = parseString(customerDigitalSignatureDao.getDigitalSignature());
					}
					break;
				case CNCANCELLATION:
					if (applicableTransactionTypesDto != null
							&& applicableTransactionTypesDto.getData().isCNCancellation) {
						custSignature = parseString(customerDigitalSignatureDao.getDigitalSignature());
					}
					break;
				case TEPDECLARATION:
					if (applicableTransactionTypesDto != null
							&& applicableTransactionTypesDto.getData().isTEPDeclarationAndExchangeForm) {
						custSignature = parseString(customerDigitalSignatureDao.getDigitalSignature());
					}
					break;
				case GEPDECLARATION:
					if (applicableTransactionTypesDto != null
							&& applicableTransactionTypesDto.getData().isGEPDeclarationAndExchangeForm) {
						custSignature = parseString(customerDigitalSignatureDao.getDigitalSignature());
					}
					break;
				case CCAF:
					break;
				case BILLCANCELLATION:
					break;
				default:
					break;
				}

			}
		}

		return custSignature;
	}

	protected String parseString(String signature) {
		if (signature != null && !signature.isEmpty()) {
			if (signature.startsWith("\"")) {
				signature = signature.substring(1, signature.length());
			}

			if (signature.endsWith("\"")) {
				signature = signature.substring(0, signature.length() - 1);
			}
		}
		return signature;
	}

	/**
	 * 
	 * @param txnId
	 * @param locationCode
	 * @return CustomerPrintDto
	 */
	protected CustomerPrintDto getCustomerDetails(String txnId, String locationCode) {

		// @formatter:off
		CustomerTxnDaoExt customerTxnDao = customerTxnRepository.findByIdAndSalesTxnDaoLocationCode(txnId,
				locationCode);

		CustomerPrintDto customerPrint = (CustomerPrintDto) MapperUtil.getObjectMapping(customerTxnDao,
				new CustomerPrintDto());
		// @formatter:on

		JsonData jsonData = MapperUtil.mapObjToClass(customerTxnDao.getCustomerDetails(), JsonData.class);

		customerPrint.setAddress(MapperUtil.mapObjToClass(jsonData.getData(), AddressDetails.class));
		InstitutionalCustomerCreateDto instCustomer = MapperUtil.mapObjToClass(jsonData.getData(), InstitutionalCustomerCreateDto.class);
		if (null!=instCustomer && !StringUtils.isEmpty(instCustomer.getIdNumber()))
			customerPrint.setPassPortId(instCustomer.getIdNumber());
		else if (!StringUtils.isEmpty(customerTxnDao.getPassportId()))
			customerPrint.setPassPortId(CryptoUtil.decrypt(customerTxnDao.getPassportId(), PASSPORT_ID,false));

		customerPrint.setCustomerType(customerTxnDao.getCustomerType());
		if (customerTxnDao.getInstiTaxNo() != null)
			customerPrint.setInstiTaxNo(CryptoUtil.decrypt(customerTxnDao.getInstiTaxNo(),INSTI_TAX_NO, false));
		if (customerTxnDao.getUlpId() != null)
			customerPrint.setUlpId(CryptoUtil.decrypt(customerTxnDao.getUlpId(), ULP_ID, false));
		if (!StringUtils.isEmpty(customerTxnDao.getCustTaxNo()))
			customerPrint.setCustTaxNo(CryptoUtil.decrypt(customerTxnDao.getCustTaxNo(), CUST_TAX_NO,false));
		if (!StringUtils.isEmpty(customerTxnDao.getCustomerName()))
			customerPrint.setCustomerName(CryptoUtil.decrypt(customerTxnDao.getCustomerName(), CUSTOMER_NAME,false));
		if (!StringUtils.isEmpty(customerTxnDao.getMobileNumber()))
			customerPrint.setMobileNumber(CryptoUtil.decrypt(customerTxnDao.getMobileNumber(), MOBILE,false));
		if (!StringUtils.isEmpty(customerTxnDao.getCustTaxNoOld()))
			customerPrint.setCustTaxNoOld(CryptoUtil.decrypt(customerTxnDao.getCustTaxNoOld(), CUST_TAX_NO_OLD,false));
		if (!StringUtils.isEmpty(customerTxnDao.getEmailId()))
			customerPrint.setEmailId(CryptoUtil.decrypt(customerTxnDao.getMobileNumber(), EMAIL_ID,false));
		if (!StringUtils.isEmpty(customerTxnDao.getTitle()))
			customerPrint.setTitle(customerTxnDao.getTitle());
		return customerPrint;
	}
	
	protected CustomerPrintDto getCustomerDetailsByCustomerId(Integer customerId) {

		// @formatter:off		
		CustomerDetailsDto customerDetails = customerService.getCustomer(customerId);

		CustomerPrintDto customerPrint = (CustomerPrintDto) MapperUtil.getObjectMapping(customerDetails,
				new CustomerPrintDto());
		// @formatter:on

		JsonData jsonData = MapperUtil.mapObjToClass(customerDetails.getCustomerDetails(), JsonData.class);

		customerPrint.setAddress(MapperUtil.mapObjToClass(jsonData.getData(), AddressDetails.class));

		customerPrint.setCustomerType(customerDetails.getCustomerType());
		if (customerDetails.getInstiTaxNo() != null)
			customerPrint.setInstiTaxNo(CryptoUtil.decrypt(customerDetails.getInstiTaxNo(), INSTI_TAX_NO, false));
		if (customerDetails.getUlpId() != null)
			customerPrint.setUlpId(CryptoUtil.decrypt(customerDetails.getUlpId(), ULP_ID, false));
		if (!StringUtils.isEmpty(customerDetails.getCustTaxNo()))
			customerPrint.setCustTaxNo(CryptoUtil.decrypt(customerDetails.getCustTaxNo(), CUST_TAX_NO, false));
		if (!StringUtils.isEmpty(customerDetails.getCustomerName()))
			customerPrint.setCustomerName(CryptoUtil.decrypt(customerDetails.getCustomerName(), CUSTOMER_NAME, false));
		if (!StringUtils.isEmpty(customerDetails.getMobileNumber()))
			customerPrint.setMobileNumber(CryptoUtil.decrypt(customerDetails.getMobileNumber(), MOBILE, false));
		if (!StringUtils.isEmpty(customerDetails.getPassportId()))
			customerPrint.setPassPortId(CryptoUtil.decrypt(customerDetails.getPassportId(), PASSPORT_ID, false));
//		if (!StringUtils.isEmpty(customerDetails.getCustTaxNoOld()))
//			customerPrint.setCustTaxNoOld(CryptoUtil.decrypt(customerDetails.getCustTaxNoOld(), CUST_TAX_NO_OLD,false));
		if (!StringUtils.isEmpty(customerDetails.getEmailId()))
			customerPrint.setEmailId(CryptoUtil.decrypt(customerDetails.getMobileNumber(), EMAIL_ID, false));
		return customerPrint;
	}


	/**
	 * 
	 * @param customerId
	 * @return String
	 */
	protected String getCustomerId(Integer customerId, String locationCode) {

		CustomerLocationMappingIdDao customerObj = new CustomerLocationMappingIdDao();

		customerObj.setCustomerId(customerId);
		if(locationCode != null && !locationCode.isEmpty()) {
			customerObj.setLocationCode(locationCode);
		}else {
		customerObj.setLocationCode(CommonUtil.getLocationCode());
		}

		Optional<CustomerLocationMappingDao> customerLocMappingId = customerLocationRepo.findById(customerObj);
		if (customerLocMappingId.isPresent())
			return customerLocMappingId.get().getCustomer().getId();
		else
			throw new ServiceException("No mapping found for passed customer:", "ERR-SALE-109");
   	}
 
	protected String getCustomerIdBySalesTxn(String txnId) {
		SalesTxnDao st = getSalesTxn(txnId, CommonUtil.getStoreCode());
		return getCustomerId(st.getCustomerId(), null);
	}

	protected String getCustomerIdByCancelTxn(String txnId) {
		CancelDao cncl = getCancel(txnId);
		return getCustomerId(cncl.getCustomerId(), null);
	}

	protected SalesTxnDao getSalesTxn(String txnId, String locationCode) {
		SalesTxnDao st = salesTxnRepo.findByIdAndLocationCodeAndStatus(txnId, locationCode,
				TransactionStatusEnum.CONFIRMED.name());
		if (st == null)
			throw new ServiceException(RECORD_NOT_FOUND, ERR_CORE_039);
		return st;
	}

	protected SalesTxnDao getSalesTxnOnSubTxn(String txnId, String locationCode) {
		SalesTxnDao st = salesTxnRepo.findByIdAndLocationCodeAndStatusAndSubTxnType(txnId, locationCode,
				TransactionStatusEnum.CONFIRMED.name(), "NON_FROZEN_RATES");
		if (st == null)
			throw new ServiceException(RECORD_NOT_FOUND, ERR_CORE_039);
		return st;
	}

	protected CancelDao getCancel(String cancelId) {
		CancelDao cncl = cancelRepo.findByIdAndLocationCodeAndStatus(cancelId, CommonUtil.getStoreCode(),
				TransactionStatusEnum.CONFIRMED.name());
		if (cncl == null)
			throw new ServiceException(RECORD_NOT_FOUND, ERR_CORE_039);
		return cncl;
	}

	protected CashMemoResponseDto getCashMemo(String txnId, String locationCode) {

		CashMemoDaoExt cashMemoDao = cashMemoRepository.findByIdAndSalesTxnDaoLocationCodeAndSalesTxnDaoStatus(txnId,
				locationCode, TransactionStatusEnum.CONFIRMED.name());

		if (cashMemoDao == null)
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					"Invalid cash memo id", Map.of("type", "cash memo"));

		return cashMemoCommonService.cashMemoResponse(cashMemoDao);
	}

	protected List<SalesPaymentDto> listConfirmedPayments(String txnId, String locationCode) {

		List<PaymentDetailsDaoExt> paymentDaos = paymentDetailsRepo
				.findBySalesTxnDaoIdAndSalesTxnDaoLocationCodeAndStatusIn(txnId, locationCode,
						List.of(PaymentStatusEnum.COMPLETED.name()), null);
		List<SalesPaymentDto> payments = new ArrayList<>();
		if (CollectionUtil.isNotEmpty(paymentDaos)) {
			for (PaymentDetailsDaoExt payment : paymentDaos) {
				SalesPaymentDto paymentDto = (SalesPaymentDto) MapperUtil.getDtoMapping(payment, SalesPaymentDto.class);
				SalesUtil.setPaymentDescription(paymentDto);
				payments.add(paymentDto);
			}
		}
		return payments;
	}

	protected void increaseSalesPrintCount(String txnId) {
		Optional<SalesTxnDao> salesTxns = salesTxnRepo.findById(txnId);
		if (salesTxns.isPresent()) {
			SalesTxnDao salesTxn = salesTxns.get();
			salesTxn.setPrints(salesTxn.getPrints() + 1);
			salesTxnRepo.save(salesTxn);
		}
	}

	protected void increaseCancelPrintCount(String txnId) {
		Optional<CancelDao> cancels = cancelRepo.findById(txnId);
		if (cancels.isPresent()) {
			CancelDao cancel = cancels.get();
			cancel.setPrints((short) (cancel.getPrints() + 1));
			cancelRepo.save(cancel);
		}
	}

}
