/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpMethod;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.EinvoiceTransactionTypeEnum;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.constant.enums.WorkflowProcessStatusEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.BrandConfigDetails;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.ClientLoginDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.CreditNoteActivationDetailsDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.EinvoiceJobResponseDto;
import com.titan.poss.core.dto.GrnDetails;
import com.titan.poss.core.dto.InvoiceDocumentsUpdateDto;
import com.titan.poss.core.dto.LocationAdvanceBookingDetailsDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationCashMemoDetailsDto;
import com.titan.poss.core.dto.LocationCreditNoteDetails;
import com.titan.poss.core.dto.LocationPaymentDetails;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.VendorDto;
import com.titan.poss.core.dto.VendorUpdateDto;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.service.clients.AuthServiceClient;
import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.TokenValidatorUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.dao.InvDocMasterDao;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dao.StockTransactionDao;
import com.titan.poss.inventory.dao.StockTransactionDetailsDao;
import com.titan.poss.inventory.repository.BinRepository;
import com.titan.poss.inventory.repository.InvDocMasterRepository;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;
import com.titan.poss.inventory.repository.StockTransactionDetailsRepository;
import com.titan.poss.inventory.repository.StockTransactionRepository;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.BusinessDayDaoExt;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.OrderDao;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.PaymentRequestsDao;
import com.titan.poss.sales.dao.SalesDocDaoExt;
import com.titan.poss.sales.dao.SalesInvoiceDocumentsDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dao.StockTransactionDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.CreditNoteSyncDtoExt;
import com.titan.poss.sales.dto.CustomerDocumentSyncDto;
import com.titan.poss.sales.dto.OrderActivationDetails;
import com.titan.poss.sales.dto.OrderCancelDetails;
import com.titan.poss.sales.dto.OrderDetailsSyncDtoExt;
import com.titan.poss.sales.dto.OrderSyncDtoExt;
import com.titan.poss.sales.dto.PaymentRequestOtherDetails;
import com.titan.poss.sales.dto.SalesJobStaggingDto;
import com.titan.poss.sales.dto.SalesTxnSyncDtoExt;
import com.titan.poss.sales.dto.constants.PaymentRequestEnum;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.SalesTxnRequestTypeEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.constants.TxnStatusCancelEnum;
import com.titan.poss.sales.dto.constants.TxnTypeCancelEnum;
import com.titan.poss.sales.dto.request.CNPaymentDetailsDto;
import com.titan.poss.sales.dto.request.CreditNoteCreateDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.response.CreditNoteResponse;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.CancellationRepositoryExt;
import com.titan.poss.sales.repository.CashMemoRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerDigitalSignatureRepository;
import com.titan.poss.sales.repository.OrderRepository;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentItemMappingRepositoryExt;
import com.titan.poss.sales.repository.PaymentRequestsRepository;
import com.titan.poss.sales.repository.SalesInvoiceDocumentsRepository;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.repository.SalesTxnRepository;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.repository.StockTransactionRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CashMemoCancelService;
import com.titan.poss.sales.service.CashMemoGiftService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CustomerDocumentService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.PaymentService;
import com.titan.poss.sales.service.SalesDocService;
import com.titan.poss.sales.service.SalesInvoiceDocService;
import com.titan.poss.sales.service.SalesJobService;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import feign.Response;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesJobService")
public class SalesJobServiceImpl implements SalesJobService {

	@Autowired
	private SalesTxnRepository salesTxnRepository;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private CashMemoRepositoryExt cashMemoRepository;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private PaymentRequestsRepository paymentRequestsRepository;

	@Autowired
	private CreditNoteServiceImpl creditNoteServiceImpl;

	@Autowired
	private PaymentRequestServiceImpl paymentRequestServiceImpl;

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Autowired
	private InventoryDetailsRepository inventoryDetailsRepository;

	@Autowired
	private InvDocMasterRepository invDocMasterRepository;

	@Autowired
	private StockTransactionDetailsRepository stockTransactionDetailsRepository;

	@Autowired
	private StockTransactionRepository stockTransactionRepository;

	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Autowired
	private AuthServiceClient authServiceClient;

	@Autowired
	private SalesSyncStagingRepository salesSyncStagingRepository;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private SalesJobService salesJobService;

	@Autowired
	private CashMemoGiftService cashMemoGiftService;

	@Autowired
	private PaymentFactory paymentFactory;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Autowired
	private CashMemoCancelService cashMemoCancelService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepository;

	@Autowired
	private CancellationRepositoryExt cancellationRepositoryExt;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepositoryExt;

	@Autowired
	private SalesDocService salesDocService;

	@Autowired
	private PaymentItemMappingRepositoryExt paymentItemMappingRepository;

	@Autowired
	private CustomerDocumentService customerDocService;

	@Autowired
	private DiscoveryClient discoveryClient;

	@Autowired
	private BinRepository binRepository;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private SalesInvoiceDocumentsRepository salesInvoiceDocumentsRepository;

	@Autowired
	private SalesIntegrationServiceImpl salesIntegrationServiceImpl;

	@Autowired
	private StockTransactionRepositoryExt stockTransactionRepositoryExt;
	
	@Autowired
	private SalesInvoiceDocService salesInvoiceDocService;

	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	private String authorizationToken;

	private static final String STOCK_TRANSACTION_DOC_NO = "BINTOBIN";

	private static final String ERR_CORE_044 = "ERR-CORE-044";

	@Value("${app.name}")
	private String appType;

	@Autowired
	public CustomerDigitalSignatureRepository customerDigitalSignatureRepository;

	@Override
	public void updateInventoryDetails(List<InventoryDetailsDao> inventoryDetails, Integer docNo, String docType) {
		if (!CollectionUtil.isEmpty(inventoryDetails)) {

			inventoryDetails.forEach(inventory -> {
				inventory.setActionType("ADD");
				if (binRepository.findOneByBinCodeAndBinGroupBinGroupCode(inventory.getPreviousBinCode(),
						inventory.getBinGroupCode()) != null) {
					inventory.setBinCode(inventory.getPreviousBinCode());
					inventory.setBinGroupCode(inventory.getBinGroupCode());
					inventory.setDocNumber(docNo);
					inventory.setDocType(docType);
					inventory.setLastModifiedDate(new Date());
				}
			});
			inventoryDetailsRepository.saveAll(inventoryDetails);
		}
	}

	@Override
	public List<InventoryDetailsDao> getInventoryItems(String binCode, String locationCode, Date docDate) {
		LocationCacheDto locationCacheDto = engineServiceClient.getStoreLocation(locationCode);
		LocationAdvanceBookingDetailsDto locationAdvanceBookingDetailsDto = MapperUtil.getObjectMapperInstance()
				.convertValue(locationCacheDto.getAbDetails(), LocationAdvanceBookingDetailsDto.class);
		return inventoryDetailsRepository.getReserveBinItems(binCode, locationCode, docDate,
				locationAdvanceBookingDetailsDto.getValidityDaysforReleaseInvInAdvancebooking());

	}

	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public Integer getDocNumber(short fiscalYear, String locationCode, String docType) {
		Integer docNumber = null;
		InvDocMasterDao invDocMasterCriteria = new InvDocMasterDao();
		invDocMasterCriteria.setLocationCode(locationCode);
		invDocMasterCriteria.setFiscalYear(fiscalYear);
		invDocMasterCriteria.setDocType(docType);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<InvDocMasterDao> criteria = Example.of(invDocMasterCriteria, matcher);
		Optional<InvDocMasterDao> invDocMaster = invDocMasterRepository.findOne(criteria);
		if (!invDocMaster.isPresent()) {
			throw new ServiceException("Document number not defined for " + locationCode, "ERR-INV-001");
		}
		docNumber = invDocMaster.get().getDocNo() + 1;
		invDocMaster.get().setDocNo(docNumber);
		invDocMasterRepository.saveAndFlush(invDocMaster.get());
		return docNumber;
	}

	@Override
	public void updateStockTransaction(StockTransactionDao stockTransaction) {
		stockTransactionRepository.save(stockTransaction);

	}

	@Override
	@Transactional
	public void addStockTransactionDetails(List<StockTransactionDetailsDao> stockTransactionDetails) {
		stockTransactionDetailsRepository.saveAll(stockTransactionDetails);
	}

	@Override
	@Transactional
	public StockTransactionDao addStockTransaction(String status, String transactionType, String locationCode) {
		StockTransactionDao stockTransaction = new StockTransactionDao();
		BigDecimal totalValue = BigDecimal.ZERO;
		short totalQuantity = 0;
		CountryDetailsDto countryDetailsDto = engineServiceClient.getCountryDetails(locationCode);
		stockTransaction.setTransactionType(transactionType);
		stockTransaction.setIssuedDocNo(salesJobService.getDocNumber(countryDetailsDto.getFiscalYear().shortValue(),
				locationCode, STOCK_TRANSACTION_DOC_NO));
		stockTransaction.setReceivedDocNo(stockTransaction.getIssuedDocNo());
		stockTransaction.setIssuedFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
		stockTransaction.setReceivedFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
		stockTransaction.setIssuedDocDate(new Date());
		stockTransaction.setReceivedDocDate(new Date());
		stockTransaction.setStatus(status);
		stockTransaction.setTotalIssuedQuantity(totalQuantity);
		stockTransaction.setTotalReceivedQuantity(totalQuantity);
		stockTransaction.setTotalIssuedValue(totalValue);
		stockTransaction.setTotalReceivedValue(totalValue);
		stockTransaction.setLocationCode(locationCode);
		stockTransaction.setTotalReceivedWeight(totalValue);
		stockTransaction.setTotalIssuedWeight(totalValue);
		stockTransaction.setCurrencyCode(countryDetailsDto.getCurrencyCode());
		stockTransaction.setWeightUnit(countryDetailsDto.getWeightUnit());
		stockTransaction.setOrgCode(CommonConstants.ORG_CODE);

		return stockTransactionRepository.save(stockTransaction);
	}

	@Override
	@Scheduled(fixedDelay = 10000, initialDelay = 10000)
	public SchedulerResponseDto publishToDataSync() {
		System.out.println("*****Sales Data sync Job RUNNING ******");
		
		try {
			if (StringUtils.isEmpty(authorizationToken) || !TokenValidatorUtil.isValidExpVal(authorizationToken)
					|| !TokenValidatorUtil.isValidJWT(authorizationToken, jwtSecret)) {
				authorizationToken = getToken();
			}
			List<SyncStaging> syncStagingList = null;
			int i = -1;
			do {
				Pageable pageable = PageRequest.of(++i, 100, Sort.by("createdDate").ascending());
				syncStagingList = new ArrayList<>();
				syncStagingList = salesSyncStagingRepository.findSyncStagingDetails(pageable).getContent();
				if (!syncStagingList.isEmpty()) {
					List<String> syncIdList = new ArrayList<>();
					syncStagingList.forEach(syncStaging -> {
						Response response = dataSyncServiceClient.publishWithToken("Bearer " + authorizationToken,
								MapperUtil.getObjectMapperInstance().convertValue(
										MapperUtil.getJsonFromString(syncStaging.getMessage()), MessageRequest.class));
						if (response.status() == 200) {
							syncIdList.add(syncStaging.getId());
						}
					});
					if (!syncIdList.isEmpty())
						salesSyncStagingRepository.updateSyncStatus(syncIdList);
				}
			} while (!syncStagingList.isEmpty());
			salesSyncStagingRepository.deletePublishedMessage();
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), ERR_CORE_044);
		}
		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		schedulerResponseDto.setCode(SchedulerCodeEnum.SALES_DATA_SYNC.toString());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return schedulerResponseDto;
	}

	private String getToken() {
		VendorDto vendorDto = integrationServiceClient.getVendor(VendorCodeEnum.POSS_TITAN.toString());
		authorizationToken = getAuthHeaderToken(vendorDto);
		return authorizationToken;
	}

	private String getAuthHeaderToken(VendorDto vendorDto) {
		List<String> credentials = TokenValidatorUtil.verifyDetails(vendorDto.getVendorDetails().toString());
		String userName = credentials.get(0);
		String password = credentials.get(1);
		String token = credentials.get(2);
		String exp = credentials.get(3);
		boolean isNewTokenReq = false;
		if (!TokenValidatorUtil.isValidExpVal(exp) || !TokenValidatorUtil.isValidJWT(token, jwtSecret)) {
			isNewTokenReq = true;
		}
		if (isNewTokenReq) {
			OAuthToken oauthToken = null;
			ClientLoginDto clientLogin = new ClientLoginDto(userName, password);
			oauthToken = authServiceClient.generateToken(clientLogin);
			token = oauthToken.getAccessToken();
			exp = oauthToken.getExpiresAt();
			Map<String, String> vendorDetailsMap = TokenValidatorUtil
					.getMapFromJsonStr(vendorDto.getVendorDetails().toString());
			vendorDetailsMap.put("token", token);
			vendorDetailsMap.put("exp", exp);
			Map<String, Object> vendorMap = new LinkedHashMap<>();
			vendorMap.put("type", "TOKEN");
			vendorMap.put("data", vendorDetailsMap);
			VendorUpdateDto vendorUpdateDto = (VendorUpdateDto) MapperUtil.getObjectMapping(vendorDto,
					new VendorUpdateDto());
			vendorUpdateDto
					.setVendorDetails(MapperUtil.getObjectMapperInstance().convertValue(vendorMap, Object.class));
			integrationServiceClient.updateVendor(vendorDto.getVendorCode(), vendorUpdateDto);
		}
		return token;
	}

	@Override
	public SchedulerResponseDto clearStatus(String locationCode) {
		List<PaymentRequestsDao> paymentRequestListRo = paymentRequestsRepository
				.findByStatusInAndCustomerLocationMapCustomerLocationMappingIdLocationCodeAndPaymentCode(
						Arrays.asList(PaymentRequestEnum.PENDING.name(), PaymentRequestEnum.APPROVED.name()),
						locationCode, PaymentCodeEnum.RO_PAYMENT.getPaymentcode());
		List<PaymentRequestsDao> paymentRequestListAirPay = paymentRequestsRepository
				.findByStatusInAndCustomerLocationMapCustomerLocationMappingIdLocationCodeAndPaymentCode(
						Arrays.asList(PaymentRequestEnum.IN_PROGRESS.name(), PaymentRequestEnum.OPEN.name(),
								PaymentRequestEnum.COMPLETED.name()),
						locationCode, PaymentCodeEnum.AIRPAY.getPaymentcode());
		List<PaymentRequestsDao> paymentRequestListRazorPay = paymentRequestsRepository
				.findByStatusInAndCustomerLocationMapCustomerLocationMappingIdLocationCodeAndPaymentCode(
						Arrays.asList(PaymentRequestEnum.IN_PROGRESS.name(), PaymentRequestEnum.OPEN.name(),
								PaymentRequestEnum.COMPLETED.name()),
						locationCode, PaymentCodeEnum.RAZOR_PAY.getPaymentcode());
		List<PaymentRequestsDao> paymentRequestListToUpdate = new ArrayList<>();

		// get Date
		Date docDate = businessDayService.getBodBusinessDay().getBusinessDate();
		if (!CollectionUtil.isEmpty(paymentRequestListRo)) {
			clearRopaymentStatus(paymentRequestListToUpdate, paymentRequestListRo, docDate, locationCode);
		}
		if (!CollectionUtil.isEmpty(paymentRequestListAirPay)) {
			clearAirpaypaymentStatus(paymentRequestListToUpdate, paymentRequestListAirPay, docDate, locationCode);
		}
		if (!CollectionUtil.isEmpty(paymentRequestListRazorPay)) {
			clearRazorPaypaymentStatus(paymentRequestListToUpdate, paymentRequestListRazorPay, docDate, locationCode);
		}

		paymentRequestsRepository.saveAll(paymentRequestListToUpdate);
		log.info("Total no. of RO PAYMENT/AIRPAY requests closed for  the location {} for business date {} is {}",
				CommonUtil.getLocationCode(), docDate,
				CollectionUtil.isEmpty(paymentRequestListToUpdate) ? 0 : paymentRequestListToUpdate.size());

		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		schedulerResponseDto.setCode(SchedulerCodeEnum.SALES_RO_AIRPAY_PAYMENTS_DELETE.toString());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return schedulerResponseDto;
	}

	private void clearAirpaypaymentStatus(List<PaymentRequestsDao> paymentRequestListToUpdate,
			List<PaymentRequestsDao> paymentRequestListAirPay, Date docDate, String locationCode) {

		BrandDto brandDto = engineServiceClient.getBrand(null);
		JsonData jsonData = MapperUtil.mapObjToClass(brandDto.getConfigDetails(), JsonData.class);
		BrandConfigDetails brandConfigDetails = MapperUtil.mapObjToClass(jsonData.getData(), BrandConfigDetails.class);

		if (brandConfigDetails.getAirpayPaymentExpiry() == null) {
			log.info(
					"AIRPAY payment expiry configuration is not set at brand level. Hence, payment expiry step is skipped for business date {} at {} location",
					docDate, locationCode);
			return;
		}

		paymentRequestListAirPay.forEach(paymentRequest -> {

			if (paymentRequest.getRequestedDate() != null && CalendarUtils.getDayDiff(paymentRequest.getRequestedDate(),
					docDate) >= brandConfigDetails.getAirpayPaymentExpiry()) {
				if (paymentRequest.getStatus().equalsIgnoreCase(PaymentRequestEnum.COMPLETED.name())) {
					generateCreditNote(paymentRequest, docDate);
					paymentRequest.setDocDate(docDate);
					paymentRequest.setStatus(PaymentRequestEnum.CLOSED.name());
					paymentRequest.setIsCnGenerated(Boolean.TRUE);
					paymentRequestListToUpdate.add(paymentRequest);
				} else {
					PaymentRequestsDao paymentRequestsDao = paymentRequestServiceImpl.getPaymentStatus(paymentRequest,
							docDate);
					if (paymentRequestsDao.getStatus().equalsIgnoreCase(PaymentRequestEnum.COMPLETED.name())) {
						generateCreditNote(paymentRequestsDao, docDate);
						paymentRequestsDao.setDocDate(docDate);
						paymentRequest.setStatus(PaymentRequestEnum.CLOSED.name());
						paymentRequest.setIsCnGenerated(Boolean.TRUE);
						paymentRequestListToUpdate.add(paymentRequest);
					} else {
						paymentRequest.setStatus(PaymentRequestEnum.FAILED.name());
						paymentRequestListToUpdate.add(paymentRequest);
					}
				}
			}
		});
	}

	private void clearRazorPaypaymentStatus(List<PaymentRequestsDao> paymentRequestListToUpdate,
			List<PaymentRequestsDao> paymentRequestListRazorPay, Date docDate, String locationCode) {
		BrandDto brandDto = engineServiceClient.getBrand(null);
		JsonData jsonData = MapperUtil.mapObjToClass(brandDto.getConfigDetails(), JsonData.class);
		BrandConfigDetails brandConfigDetails = MapperUtil.mapObjToClass(jsonData.getData(), BrandConfigDetails.class);

		if (brandConfigDetails.getRazorpayPaymentExpiry() == null) {
			log.info(
					"RAZORPAY payment expiry configuration is not set at brand level. Hence, payment expiry step is skipped for business date {} at {} location",
					docDate, locationCode);
			return;
		}

		paymentRequestListRazorPay.forEach(paymentRequest -> {

			if (paymentRequest.getRequestedDate() != null && CalendarUtils.getDayDiff(paymentRequest.getRequestedDate(),
					docDate) >= brandConfigDetails.getRazorpayPaymentExpiry()) {
				if (paymentRequest.getStatus().equalsIgnoreCase(PaymentRequestEnum.COMPLETED.name())) {
					generateCreditNote(paymentRequest, docDate);
					paymentRequest.setDocDate(docDate);

					paymentRequest.setStatus(PaymentRequestEnum.CLOSED.name());
					paymentRequest.setIsCnGenerated(Boolean.TRUE);
					paymentRequestListToUpdate.add(paymentRequest);
				} else {
					PaymentRequestsDao paymentRequestsDao = paymentRequestServiceImpl.getPaymentStatus(paymentRequest,
							docDate);
					if (paymentRequestsDao.getStatus().equalsIgnoreCase(PaymentRequestEnum.COMPLETED.name())) {
						generateCreditNote(paymentRequestsDao, docDate);
						paymentRequestsDao.setDocDate(docDate);
						paymentRequest.setStatus(PaymentRequestEnum.CLOSED.name());
						paymentRequest.setIsCnGenerated(Boolean.TRUE);
						paymentRequestListToUpdate.add(paymentRequest);
					} else {
						paymentRequest.setStatus(PaymentRequestEnum.FAILED.name());
						paymentRequestListToUpdate.add(paymentRequest);
					}
				}
			}
		});

	}

	private void clearRopaymentStatus(List<PaymentRequestsDao> paymentRequestListToUpdate,
			List<PaymentRequestsDao> paymentRequestListRo, Date docDate, String locationCode) {
		LocationCacheDto locationCacheDto = engineServiceClient.getStoreLocation(locationCode);
		LocationPaymentDetails locationPaymentDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(locationCacheDto.getPaymentDetails(), LocationPaymentDetails.class);
		paymentRequestListRo.forEach(paymentRequest -> {

			if (paymentRequest.getApprovedDate() != null
					&& paymentRequest.getStatus().equalsIgnoreCase(PaymentRequestEnum.APPROVED.name())
					&& CalendarUtils.getDayDiff(paymentRequest.getApprovedDate(), docDate) >= locationPaymentDetails
							.getApprovedRORequestDeletion()) {

				closeRoRequest(paymentRequest);

				paymentRequest.setStatus(PaymentRequestEnum.EXPIRED.name());
				paymentRequestListToUpdate.add(paymentRequest);

			} else {
				PaymentRequestsDao paymentRequestsDao = paymentRequestServiceImpl.getPaymentStatus(paymentRequest,
						docDate);
				if (paymentRequest.getRequestedDate() != null
						&& (paymentRequest.getApprovedDate() != null
								&& PaymentRequestEnum.APPROVED.name().equalsIgnoreCase(paymentRequestsDao.getStatus())
								&& CalendarUtils.getDayDiff(paymentRequest.getApprovedDate(),
										docDate) >= locationPaymentDetails.getApprovedRORequestDeletion())
						|| (PaymentRequestEnum.PENDING.name().equalsIgnoreCase(paymentRequestsDao.getStatus())
								&& CalendarUtils.getDayDiff(paymentRequest.getRequestedDate(),
										docDate) >= locationPaymentDetails.getPendingRORequestDeletion())) {

					closeRoRequest(paymentRequest);

					paymentRequest.setStatus(PaymentRequestEnum.EXPIRED.name());
					paymentRequestListToUpdate.add(paymentRequest);
				}
			}

		});
	}

	/**
	 * @param paymentRequest
	 */
	private void closeRoRequest(PaymentRequestsDao paymentRequest) {
		PaymentRequestOtherDetails paymentRequestOtherDetails = paymentRequestServiceImpl
				.getOtherDetails(paymentRequest.getOtherDetails());
		if (!StringUtils.isEmpty(paymentRequestOtherDetails.getReferenceId())) {
			epossCallService.callEposs(HttpMethod.PATCH,
					SalesUtil.WORKFLOW_PROCESS_URL + "/" + paymentRequestOtherDetails.getReferenceId(),
					Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.APPROVE_RO_PAYMENT.name()), null, Object.class);

		}
	}

	private void generateCreditNote(PaymentRequestsDao paymentRequest, Date docDate) {
		CreditNoteCreateDto creditNoteCreateDto = new CreditNoteCreateDto();
		creditNoteCreateDto
				.setCustomerId(paymentRequest.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId());
		List<CreditNoteIndvCreateDto> creditNoteIndvCreateDtoList = new ArrayList<>();
		CreditNoteIndvCreateDto creditNoteIndvCreateDto = new CreditNoteIndvCreateDto();
		creditNoteIndvCreateDto.setCreditNoteType(CNType.ADV.toString());
		creditNoteIndvCreateDto.setAmount(paymentRequest.getAmount());
		// set payment details
		CNPaymentDetailsDto cNPaymentDetailsDto = new CNPaymentDetailsDto();
		Map<String, String> paymentCodes = new HashMap<>();
		cNPaymentDetailsDto.setIsGeneratedForUnipayDeletion(false);
		cNPaymentDetailsDto.setRTGS(false);
		cNPaymentDetailsDto.setCheque(false);
		paymentCodes.put(paymentRequest.getPaymentCode(), null);
		cNPaymentDetailsDto.setPaymentCodes(paymentCodes);
		creditNoteIndvCreateDto.setPaymentDetails(new JsonData("CN_PAYMENT_DETAILS", cNPaymentDetailsDto));

		creditNoteIndvCreateDtoList.add(creditNoteIndvCreateDto);
		creditNoteCreateDto.setCNIndividual(creditNoteIndvCreateDtoList);
		creditNoteCreateDto.setDocDate(docDate);
		List<CreditNoteResponse> cnDocNos = creditNoteServiceImpl.createNewCreditNote(creditNoteCreateDto);
		log.info("{} Credit note doc number for request id {} is : {}", paymentRequest.getPaymentCode(),
				paymentRequest.getId(), cnDocNos.toString());

		PaymentRequestOtherDetails paymentRequestOtherDetails = MapperUtil.mapObjToClass(
				MapperUtil.mapObjToClass(paymentRequest.getOtherDetails(), JsonData.class).getData(),
				PaymentRequestOtherDetails.class);
		paymentRequestOtherDetails.setCreditNoteDocNo(cnDocNos.get(0).getDocNo());
		paymentRequestOtherDetails.setCreditNoteFiscalYear(cnDocNos.get(0).getFiscalYear().intValue());
		paymentRequestOtherDetails.setCreditNoteId(cnDocNos.get(0).getId());

		// set other details to dao
		paymentRequest.setOtherDetails(MapperUtil
				.getStringFromJson(new JsonData(paymentRequest.getPaymentCode(), paymentRequestOtherDetails)));

	}

	@Override
	@Transactional
	public SchedulerResponseDto deleteOpenTasks() {
		List<String> locationCodes = engineServiceClient.getAppBasedLocations();
		log.info(" delete Open Tasks location Codes  {} ", locationCodes);
		if (!CollectionUtil.isEmpty(locationCodes)) {
			locationCodes.forEach(locationCode -> {
				LocationCacheDto locationCacheDto = engineServiceClient.getStoreLocation(locationCode);
				LocationCashMemoDetailsDto locationCashMemoDetailsDto = null;
				LocationAdvanceBookingDetailsDto locationAdvanceBookingDetailsDto = null;
				if (locationCacheDto != null) {
					log.info(" location Cache Dto  {} ", locationCacheDto);
					locationCashMemoDetailsDto = MapperUtil.getObjectMapperInstance()
							.convertValue(locationCacheDto.getCmDetails(), LocationCashMemoDetailsDto.class);
					locationAdvanceBookingDetailsDto = MapperUtil.getObjectMapperInstance()
							.convertValue(locationCacheDto.getAbDetails(), LocationAdvanceBookingDetailsDto.class);
				}
				log.info(" location CashMemo Details {} ", locationCashMemoDetailsDto);
				log.info(" location AdvanceBooking Details  {} ", locationAdvanceBookingDetailsDto);
				List<SalesTxnDao> salesTransactionToUpdate = new ArrayList<>();
				if (locationCashMemoDetailsDto != null)
					deleteOpenTasksForCm(locationCode, locationCashMemoDetailsDto, salesTransactionToUpdate);
				if (locationAdvanceBookingDetailsDto != null)
					deleteOpenTasksForAb(locationCode, locationAdvanceBookingDetailsDto, salesTransactionToUpdate);
				salesTxnRepository.saveAll(salesTransactionToUpdate);
			});
		}
		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		schedulerResponseDto.setCode(SchedulerCodeEnum.SALES_OPEN_TASK_DELETE.toString());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return schedulerResponseDto;

	}

	private void deleteOpenTasksForAb(String locationCode,
			LocationAdvanceBookingDetailsDto locationAdvanceBookingDetailsDto,
			List<SalesTxnDao> salesTransactionToUpdate) {
		List<SalesTxnDao> salesTransactionList = salesTxnRepository.getSalesTransactionDetailsAb(
				TransactionTypeEnum.AB.name(), TransactionStatusEnum.OPEN.name(),
				Arrays.asList(PaymentStatusEnum.OPEN.name(), PaymentStatusEnum.IN_PROGRESS.name(),
						PaymentStatusEnum.COMPLETED.name()),
				locationCode);
		log.info(" in delete Open Tasks For Ab  ");
		setTxnUpdate(salesTransactionToUpdate, salesTransactionList,
				locationAdvanceBookingDetailsDto.getNoOfHoursForOpenTaskDeletion());
	}

	private void setTxnUpdate(List<SalesTxnDao> salesTransactionToUpdate, List<SalesTxnDao> salesTransactionList,
			BigDecimal configuedHour) {
		log.info(" salesTransaction List  {} "+ salesTransactionList);
		if (!salesTransactionList.isEmpty()) {
			salesTransactionList.forEach(salesTxn -> {
				log.info(" sales Txn  {} "+ salesTxn);
				log.info(" configued Hour  {} "+ configuedHour);
				if (BigDecimal.valueOf(
						CalendarUtils.getHourDifference(salesTxn.getLastModifiedDate(), CalendarUtils.getCurrentDate()))
						.compareTo(configuedHour) >= 0) {
					SalesDocDaoExt salesDocDao = salesDocService.getDocNumber(SalesDocTypeEnum.CT_DELETE,
							salesTxn.getFiscalYear(), 1, salesTxn.getLocationCode());
					Integer lastDocNo = salesDocDao.getDocNo();
					salesTxn.setManualBillId(null);
					salesTxn.setDocNo(lastDocNo);
					salesTxn.setStatus(TransactionStatusEnum.DELETED.name());
					log.info(" sales Txn in if condition  {} "+ salesTxn);
					salesTransactionToUpdate.add(salesTxn);
					lastDocNo--;
				}
			});
		}
	}

	private void deleteOpenTasksForCm(String locationCode, LocationCashMemoDetailsDto locationCashMemoDetailsDto,
			List<SalesTxnDao> salesTransactionToUpdate) {
		List<SalesTxnDao> salesTransactionList = salesTxnRepository.getSalesTransactionDetailsCm(
				TransactionTypeEnum.CM.name(), TransactionStatusEnum.OPEN.name(),
				Arrays.asList(PaymentStatusEnum.OPEN.name(), PaymentStatusEnum.IN_PROGRESS.name(),
						PaymentStatusEnum.COMPLETED.name()),
				locationCode);
		setTxnUpdate(salesTransactionToUpdate, salesTransactionList,
				locationCashMemoDetailsDto.getNoOfHoursForOpenTaskDeletionCM());

	}

	/**
	 * This method will delete all the transactions in 'OPEN' and 'HOLD' status at
	 * EOD. It will also reverse or generate Credit notes for payments(if present).
	 * 
	 * has 3 tasks - 1. Cancel gift cards if present 2. Delete payments if present
	 * 3. Update transaction status to 'DELETED'
	 * 
	 * @return SchedulerResponseDto
	 */
	@Override
	public SchedulerResponseDto deleteOpenAndHoldTasksAtEOD() {

		String locationCode = CommonUtil.getLocationCode();
		log.info("OPEN & HOLD task deletion for location :- {} started ", locationCode);

		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.SALES_HOLD_TRANSACTIONS_DELETE.name());
		response.setStatus(JobProcessStatusEnum.COMPLETED.name());

		Date docDate = null;
		Short fiscalYear = null;

		try {
			BusinessDayDaoExt businessDateDao = businessDayService.getBusinessDayInProgress(locationCode);
			docDate = businessDateDao.getBusinessDate();
			fiscalYear = businessDateDao.getFiscalYear().shortValue();
		} catch (ServiceException e) {
			log.info("Skipping OPEN/HOLD txn deletion as no business date is valid for location - {}", locationCode);
			return response;
		}

		log.info("OPEN & HOLD task deletion for date:- " + docDate);

		List<SalesTxnDaoExt> txnList = salesTxnRepositoryExt.findByLocationCodeAndDocDateLessThanEqualAndStatusIn(
				locationCode, docDate, List.of(TransactionStatusEnum.OPEN.name(), TransactionStatusEnum.HOLD.name()));
		Integer stockTxnListCount = stockTransactionRepositoryExt.countByLocationCodeAndDocDateLessThanEqualAndStatusIn(
				locationCode, docDate, List.of(TransactionStatusEnum.OPEN.name(), TransactionStatusEnum.HOLD.name()));

		// if empty then return records updated as 0.
		if (CollectionUtil.isEmpty(txnList) && stockTxnListCount == 0) {
			log.info("No transaction is in OPEN/HOLD status for deletion, for the date:- " + docDate);
			return response;
		}
		Set<String> txnIdList = new HashSet<>();

		if (!CollectionUtil.isEmpty(txnList)) {
			Map<String, SalesTxnDaoExt> txnMap = txnList.stream()
					.collect(Collectors.toMap(SalesTxnDaoExt::getId, salesTxn -> salesTxn));

			// 1. Cancel gift cards if present
			checkAndReverseGiftCards(locationCode, docDate, txnList, txnMap);

			// 2. Delete payments if present
			txnIdList = txnMap.keySet();
			paymentDeletion(txnIdList, docDate, fiscalYear, locationCode);

		}

		// if txn list is empty, then return
		if (CollectionUtil.isEmpty(txnIdList) && stockTxnListCount == 0) {
			log.info("No transaction is in OPEN/HOLD status for deletion, for the date:- " + docDate);
			return response;
		}

		// on deleting payment, paid value to be updated.
		// update paid value to 0 in CM, AB and CO -- other txn are pending
		if (!CollectionUtil.isEmpty(txnIdList)) {
			salesJobService.updateCMAndAB(txnIdList);
		}

		// get stock transaction details
		List<StockTransactionDaoExt> stockTxnList = new ArrayList<>();
		if (stockTxnListCount != 0) {
			// get stock transaction delatils to delete
			stockTxnList = stockTransactionRepositoryExt.findByLocationCodeAndDocDateLessThanEqualAndStatusIn(
					locationCode, docDate,
					List.of(TransactionStatusEnum.OPEN.name(), TransactionStatusEnum.HOLD.name()));
			// if counts are not same, then ignore stock transaction deleting as doc number
			// generated will not be valid
			log.info("Count of stock transaction deletion to be deleted: {}", stockTxnList.size());
		}

		// get doc number.
		Integer lastDocNo = salesDocService.getDocNumber(SalesDocTypeEnum.CT_DELETE, fiscalYear,
				txnIdList.size() + stockTxnList.size());
		List<SalesTxnDaoExt> txnsToBeUpdated = salesTxnRepositoryExt.findAllById(txnIdList);

		for (SalesTxnDaoExt txnDao : txnsToBeUpdated) {
			txnDao.setStatus(TransactionStatusEnum.DELETED.name());
			// on deleting txn manual bill id should be cleared
			txnDao.setManualBillId(null);
			txnDao.setDocNo(lastDocNo);
			txnDao.setFiscalYear(fiscalYear);
			txnDao.setDocDate(docDate);

			// reduce docNo count
			lastDocNo--;
		}
		for (StockTransactionDaoExt stockTxnDao : stockTxnList) {
			stockTxnDao.setStatus(TransactionStatusEnum.DELETED.name());
			stockTxnDao.setDocNo(lastDocNo);
			stockTxnDao.setFiscalYear(fiscalYear);
			stockTxnDao.setDocDate(docDate);

			// reduce docNo count
			lastDocNo--;
		}

		// save updated txns.
		if (!CollectionUtil.isEmpty(txnsToBeUpdated)) {
			salesTxnRepositoryExt.saveAll(txnsToBeUpdated);
		}
		if (!CollectionUtil.isEmpty(stockTxnList)) {
			stockTransactionRepositoryExt.saveAll(stockTxnList);
		}
		// if updated records are not equal to txn list size, then log it.
		log.info("No. of taransactions to be updated - {}, no. of transaction that were updated - {} ",
				txnList.size() + stockTxnListCount, txnsToBeUpdated.size() + stockTxnList.size());
		log.info("Delete OPEN/HOLD txn scheduler job executed for date {} at location {}", docDate, locationCode);
		return response;
	}

	/**
	 * @param locationCode
	 * @param docDate
	 * @param txnList
	 * @param txnMap
	 */
	public void checkAndReverseGiftCards(String locationCode, Date docDate, List<SalesTxnDaoExt> txnList,
			Map<String, SalesTxnDaoExt> txnMap) {
		// if subTxnType is 'GIFT_SALE', then need to cancel it.
		List<String> giftSalesTxnIds = txnList.stream()
				.filter(salesTxnDao -> SubTxnTypeEnum.GIFT_SALE.name().equals(salesTxnDao.getSubTxnType()))
				.map(SalesTxnDaoExt::getId).collect(Collectors.toList());

		// get all Cash memos w.r.t gift sale
		List<CashMemoDaoExt> giftSaleCashMemoList = cashMemoRepository.findAllById(giftSalesTxnIds);

		// Cancel gift cards if present
		if (!CollectionUtil.isEmpty(giftSaleCashMemoList)) {

			for (CashMemoDaoExt cashMemoDao : giftSaleCashMemoList) {
				try {
					cashMemoGiftService.deactivateGifts(cashMemoDao);
				} catch (ServiceException e) {
					log.info(
							"Cancelling gift cards failed for Cash Memo id '{}' on date {} at location {}.\n Reason - error message: {}, error code: {}, error cause: {}, dynamic values - {}",
							cashMemoDao.getId(), docDate, locationCode, e.getMessage(), e.getErrorCode(),
							e.getErrorDetails(), e.getDynamicValues());
					// respective SalesTxn and CashMemo should not be updated.
					txnMap.remove(cashMemoDao.getId());
				} catch (Exception e) {
					log.info(
							"Cancelling gift cards failed for Cash Memo id '{}' on date {} at location {}.\n Reason - {} ",
							cashMemoDao.getId(), docDate, locationCode, e.getLocalizedMessage());
					// respective SalesTxn and CashMemo should not be updated.
					txnMap.remove(cashMemoDao.getId());
				}
			}

		}
	}

	/**
	 * This method will delete payments and generate CNs based on payment status and
	 * logic for CN generation.
	 * 
	 * Includes 4 steps:............................................................
	 * 1. Call delete payment for certain payments based on status and remove them
	 * from list(set reversed date).................................................
	 * 2. Update status to DELETED for 'OPEN' or 'FAILED' payments together and
	 * remove them from list........................................................
	 * 3. Generate CNs for 'COMPLETED' payments based on logic and update status to
	 * 'REVERSED_WITH_CN'(set reversed date)........................................
	 * 
	 * NOTE: reversed date to be set when payment status is 'REVERSED' or
	 * 'REVERSED_WITH_CN'.
	 * 
	 * @param paymentDetailsList
	 */
	public void paymentDeletion(Set<String> txnIdList, Date docDate, Short fiscalYear, String locationCode) {

		List<PaymentDetailsDaoExt> paymentDetailsList = paymentDetailsRepository.findBySalesTxnDaoIdInAndStatusIn(
				txnIdList, List.of(PaymentStatusEnum.OPEN.name(), PaymentStatusEnum.IN_PROGRESS.name(),
						PaymentStatusEnum.COMPLETED.name(), PaymentStatusEnum.FAILED.name()));

		if (CollectionUtil.isEmpty(paymentDetailsList)) {
			log.info("Total no. of payments:- " + 0);

			return;
		}

		List<String> paymentIdListForPaymentItemMapDelete = paymentDetailsList.stream().map(PaymentDetailsDaoExt::getId)
				.collect(Collectors.toList());
		log.info("Total no. of payments:- " + paymentDetailsList.size());

		// Get latest status of 'AIRPAY' or 'RAZOR PAY' payment where status is
		// 'OPEN' or 'IN_PROGRESS' -- removed. Not valid anymore

		// 2. Call delete payment for certain payments based on status.
		List<PaymentDetailsDaoExt> paymentDetailsToBeRemoved = deleteIndividualPayments(txnIdList, paymentDetailsList,
				docDate);
		// save payments that have been removed from original list.
		if (!CollectionUtil.isEmpty(paymentDetailsToBeRemoved)) {
			paymentDetailsRepository.saveAll(paymentDetailsToBeRemoved);
			paymentDetailsToBeRemoved.clear();
			log.info("Total no. of payments deleted individually:- " + paymentDetailsToBeRemoved.size());

		} else {
			log.info("Total no. of payments deleted individually:- " + 0);
		}

		// 3. Update status to 'DELETED' where status is 'OPEN' or 'COMPLETED' or
		// 'FAILED' payments
		// together and remove them from list
		paymentDetailsToBeRemoved = deleteOpenAndCompletedAndFailedPayment(paymentDetailsList);
		if (!CollectionUtil.isEmpty(paymentDetailsToBeRemoved)) {
			paymentDetailsRepository.saveAll(paymentDetailsToBeRemoved);
			log.info("Total no. of payments deleted together:- " + paymentDetailsToBeRemoved.size());
		} else {
			log.info("Total no. of payments deleted together:- " + 0);
		}

		// 4. Generate CNs for 'COMPLETED' payments based on logic and update status to
		// 'REVERSED_WITH_CN'
		// first group payments based on salesTxnDao
		// removed 4th point as client doesn't want CN generation if txn is not
		// confirmed for non-integrated payments

		// delete from payment item map, for payments which have following status -
		// [DELETED,REVERSED,CANCELLED]
		salesJobService.deletePaymentItemMap(paymentIdListForPaymentItemMapDelete);
	}

	/**
	 * @param paymentDetailsList
	 * @param docDate
	 */
	@Override
	public void cNForCompletedPayments(Set<String> txnIdList, List<PaymentDetailsDaoExt> paymentDetailsList,
			Date docDate, Short fiscalYear, String locationCode) {

		if (CollectionUtil.isEmpty(paymentDetailsList)) {
			return;
		}

		Map<SalesTxnDaoExt, List<PaymentDetailsDaoExt>> txnIdAndPaymentsMap = new HashMap<>();
		// collect all unique txn ids in payment list.
		Set<String> uniquePaymentTxnList = paymentDetailsList.stream()
				.map(paymentDetailsDao -> paymentDetailsDao.getSalesTxnDao().getId()).collect(Collectors.toSet());

		for (String txnId : uniquePaymentTxnList) {
			List<PaymentDetailsDaoExt> salesPaymentDetails = new ArrayList<>();
			for (PaymentDetailsDaoExt paymentDetails : paymentDetailsList) {

				if (txnId.equals(paymentDetails.getSalesTxnDao().getId())) {
					salesPaymentDetails.add(paymentDetails);
				}
			}

			// add list to map
			SalesTxnDaoExt salesTxnDao = salesTxnRepositoryExt.findByIdAndLocationCode(txnId, locationCode);
			txnIdAndPaymentsMap.put(salesTxnDao, salesPaymentDetails);
		}

		// for each item in map, if payment list is not empty then call cancel payments
		txnIdAndPaymentsMap.forEach((salesTxnDao, paymentList) -> {
			if (!CollectionUtil.isEmpty(paymentList)) {
				try {
					// for 'GHS ACCOUNT' payment, CN type is GHS.
					Map<String, Integer> docNoList = cashMemoCancelService.cancelPaymentWise(salesTxnDao, null,
							CancellationTypeEnum.CANCEL_WITH_CN, CNType.ADV, docDate);

					// save payment details
					paymentList.forEach(paymentDao -> {
						paymentDao.setStatus(PaymentStatusEnum.REVERSED_WITH_CN.name());
						paymentDao.setPaymentDate(docDate);
						paymentDao.setReversalDate(docDate);
						// make payment non-editable after deletion
						paymentDao.setIsEditable(false);
					});
					paymentDetailsRepository.saveAll(paymentList);

					log.info(
							"Total no. of CNs are generated for id {} are :- {}, doc numbers are - {}, fiscal year - {}, location code - {} ",
							salesTxnDao.getId(), docNoList.size(), docNoList.values(), fiscalYear,
							CommonUtil.getLocationCode());

				} catch (ServiceException e) {
					log.info(
							"CN generation for transaction id {} failed, hence skipping the update for the same at location {}.\n Reason - error message: {}, error code: {}, error cause: {}, dynamic values - {}",
							salesTxnDao.getId(), docDate, CommonUtil.getLocationCode(), e.getMessage(),
							e.getErrorCode(), e.getErrorDetails(), e.getDynamicValues());
					// remove update respective txn id.
					txnIdList.remove(salesTxnDao.getId());

				} catch (Exception e) {
					log.info(
							"CN generation for transaction id {} failed, hence skipping the update for the same. \n Reason - {} ",
							salesTxnDao.getId(), e.getLocalizedMessage());
					// remove update respective txn id.
					txnIdList.remove(salesTxnDao.getId());
				}
			}
		});

		// need to update status to 'REVERSED_WITH_CN' and set reversed date. -
		// doubt(should this be done as part of CN generation?)

	}

	/**
	 * @param paymentDetailsList
	 */
	private List<PaymentDetailsDaoExt> deleteOpenAndCompletedAndFailedPayment(
			List<PaymentDetailsDaoExt> paymentDetailsList) {

		if (CollectionUtil.isEmpty(paymentDetailsList)) {
			return new ArrayList<>();
		}

		List<PaymentDetailsDaoExt> paymentDetailsToBeRemoved = paymentDetailsList.stream()
				.filter(paymentDao -> (List.of(PaymentStatusEnum.OPEN.name(), PaymentStatusEnum.COMPLETED.name(),
						PaymentStatusEnum.FAILED.name()).contains(paymentDao.getStatus())))
				.collect(Collectors.toList());
		if (!CollectionUtil.isEmpty(paymentDetailsToBeRemoved)) {
			paymentDetailsToBeRemoved.forEach(paymentDao -> {
				paymentDao.setStatus(PaymentStatusEnum.DELETED.name());
				// make payment non-editable after deletion
				paymentDao.setIsEditable(false);
			});

			// remove from original list
			paymentDetailsList.removeAll(paymentDetailsToBeRemoved);
		}

		// return payments to be removed for saving
		return paymentDetailsToBeRemoved;
	}

	/**
	 * @param paymentDetailsList
	 * @param docDate
	 */
	private List<PaymentDetailsDaoExt> deleteIndividualPayments(Set<String> txnIdList,
			List<PaymentDetailsDaoExt> paymentDetailsList, Date docDate) {

		// @formatter:off
		// Conditions
		// i. payment code = 'RO PAYMENT' and status = 'COMPLETED'
		// ii. payment code = 'CREDIT NOTE' and status = 'COMPLETED'
		// iii. payment code = 'ENCIRCLE' and status = 'COMPLETED' or 'IN_PROGRESS'
		// iv. payment code = 'AIRPAY' and status ='COMPLETED'
		// v. payment code = 'CASHBACK'
		// vi. payment code = 'QCGC' and status = 'COMPLETED'
		// vii. payment code = 'GHS EVOUCHER' and status = 'COMPLETED'
		// viii.payment code = 'RAZOR PAY' and status ='COMPLETED'
		// ix. payment code = 'UNIPAY' and status ='COMPLETED'
		// x. payment code = 'GIFT VOUCHER' and status ='COMPLETED'
		// xi. payment code = 'GHS ACCOUNT' and status ='COMPLETED'
		// xii. payment code = 'DIGI GOLD TANISHQ' and status ='COMPLETED'
		// xiii. payment code = 'DIGI GOLD NON TANISHQ' and status ='COMPLETED'
		// xiv. payment code = 'GEP OFFER'
		// xv. payment code = 'EMPLOYEE LOAN' and status ='COMPLETED'
		// End: set reversed date and remove them from list
		// @formatter:on

		PaymentService paymentService;
		List<PaymentDetailsDaoExt> paymentDetailsToBeRemoved = new ArrayList<>();

		List<PaymentDetailsDaoExt> paymentsWithError = new ArrayList<>();

		// move 'GEP OFFER' & 'CASHBACK' to the beginning as they are dependent payments
		// on 'CREDIT NOTE' & 'CARD' respectively
		List<String> paymentCodeList = List.of(PaymentCodeEnum.GEP_OFFER.getPaymentcode(),
				PaymentCodeEnum.CASHBACK.getPaymentcode());
		List<PaymentDetailsDaoExt> paymentsToMove = paymentDetailsList.stream()
				.filter(payment -> paymentCodeList.contains(payment.getPaymentCode())).collect(Collectors.toList());

		// if list of required payments is not empty, then
		// 1. remove required payments from original list and
		// 2. append original list to valid items list
		if (!CollectionUtils.isEmpty(paymentsToMove)) {
			paymentDetailsList.removeAll(paymentsToMove);

			if (CollectionUtils.isEmpty(paymentDetailsList)) {
				paymentDetailsList = paymentsToMove;
			} else {
				paymentDetailsList.addAll(0, paymentsToMove);
			}
		}

		for (PaymentDetailsDaoExt paymentDetailsDao : paymentDetailsList) {
			if (checkIfPaymentEligibleForDirectDeletion(paymentDetailsDao.getPaymentCode(),
					paymentDetailsDao.getStatus())) {
				try {
					paymentService = paymentFactory.getPaymentService(paymentDetailsDao.getPaymentCode(),
							paymentDetailsDao.getPaymentGroup());
					paymentService.deletePayment(paymentDetailsDao);
					// add payment to remove list

					paymentDetailsToBeRemoved.add(paymentDetailsDao);
				} catch (ServiceException e) {
					log.info(
							"Delete individual payment failed for  id {} failed, hence skipping the update for the same and it's respective transaction id at location {}.\n Reason - error message: {}, error code: {}, error cause: {}, dynamic values - {}",
							paymentDetailsDao.getId(), docDate, CommonUtil.getLocationCode(), e.getMessage(),
							e.getErrorCode(), e.getErrorDetails(), e.getDynamicValues());
					// remove update for both payment and respective txn id.
					paymentsWithError.add(paymentDetailsDao);
					txnIdList.remove(paymentDetailsDao.getSalesTxnDao().getId());

				} catch (Exception e) {
					log.info(
							"Delete individual payment failed for id {} , hence skipping the update for the same and it's respective transaction id. \n Reason - {} ",
							paymentDetailsDao.getId(), e.getLocalizedMessage());
					// remove update for both payment and respective txn id.
					paymentsWithError.add(paymentDetailsDao);
					txnIdList.remove(paymentDetailsDao.getSalesTxnDao().getId());
				}
			}
		}

		// remove paymentWithError from list
		paymentDetailsList.removeAll(paymentsWithError);

		// if remove list is not empty, remove it from original list and then save with
		// reversal date
		if (!CollectionUtil.isEmpty(paymentDetailsToBeRemoved)) {
			paymentDetailsList.removeAll(paymentDetailsToBeRemoved);
			// set reversed date if status is 'REVERSED' or 'REVERSED_WITH_CN'
			paymentDetailsToBeRemoved.forEach(paymentDetailsDao -> {
				// make payment non-editable after deletion
				paymentDetailsDao.setIsEditable(false);
				if (PaymentStatusEnum.REVERSED.name().equals(paymentDetailsDao.getStatus())
						|| PaymentStatusEnum.REVERSED_WITH_CN.name().equals(paymentDetailsDao.getStatus())) {
					paymentDetailsDao.setPaymentDate(docDate);
					paymentDetailsDao.setReversalDate(docDate);
				}
			});

		}

		// return payments to be removed for saving
		return paymentDetailsToBeRemoved;
	}

	private boolean checkIfPaymentEligibleForDirectDeletion(String paymentCode, String status) {
		return (((PaymentCodeEnum.RO_PAYMENT.getPaymentcode().equals(paymentCode)
				|| PaymentCodeEnum.CREDIT_NOTE.getPaymentcode().equals(paymentCode)
				|| PaymentCodeEnum.QCGC.getPaymentcode().equals(paymentCode)
				|| PaymentCodeEnum.UNIPAY.getPaymentcode().equals(paymentCode)
				|| PaymentCodeEnum.AIRPAY.getPaymentcode().equals(paymentCode)
				|| PaymentCodeEnum.RAZOR_PAY.getPaymentcode().equals(paymentCode)
				|| PaymentCodeEnum.GHS_EVOUCHER.getPaymentcode().equals(paymentCode)
				|| PaymentCodeEnum.GIFT_VOUCHER.getPaymentcode().equals(paymentCode)
				|| PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(paymentCode)
				|| PaymentCodeEnum.DIGI_GOLD_TANISHQ.getPaymentcode().equals(paymentCode)
				|| PaymentCodeEnum.DIGI_GOLD_NON_TANISHQ.getPaymentcode().equals(paymentCode)
				|| PaymentCodeEnum.EMPLOYEE_LOAN.getPaymentcode().equals(paymentCode))
				&& PaymentStatusEnum.COMPLETED.name().equals(status))
				|| (PaymentCodeEnum.ENCIRCLE.getPaymentcode().equals(paymentCode) && List
						.of(PaymentStatusEnum.COMPLETED.name(), PaymentStatusEnum.IN_PROGRESS.name()).contains(status))
				|| (PaymentCodeEnum.CASHBACK.getPaymentcode().equals(paymentCode)
						|| PaymentCodeEnum.GEP_OFFER.getPaymentcode().equals(paymentCode)));
	}

	@Override
	public SchedulerResponseDto suspendCreditNote(String locationCode) {

		LocationCacheDto locationCacheDto = engineServiceClient.getStoreLocation(locationCode);
		Date businessDate = businessDayService.getBodBusinessDay().getBusinessDate();
		Map<String, Integer> configurationDaysDetails = new HashMap<>();
		LocationCreditNoteDetails locationCreditNoteDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(locationCacheDto.getCnDetails(), LocationCreditNoteDetails.class);
		configurationDaysDetails.put(locationCode, locationCreditNoteDetails.getSuspendingCNs());
		List<CreditNoteDaoExt> creditNoteListToUpdate = new ArrayList<>();
		List<CreditNoteDaoExt> creditNoteListAll = creditNoteRepository
				.findByStatusAndLocationCode(TransactionStatusEnum.OPEN.name(), locationCode);
		List<CreditNoteDaoExt> creditNoteList = new ArrayList<>();
		creditNoteListAll.forEach(cn -> {
			if (cn.getLinkedTxn() == null)
				creditNoteList.add(cn);
		});
		List<CreditNoteDaoExt> transferedCreditNoteListAll = creditNoteRepository.getTransferedCreditNoteDetails(
				TransactionStatusEnum.OPEN.name(), WorkflowProcessStatusEnum.PENDING.name(), locationCode);
		List<CreditNoteDaoExt> transferedCreditNoteList = new ArrayList<>();
		transferedCreditNoteListAll.forEach(cn -> {
			if (cn.getLinkedTxn() == null)
				transferedCreditNoteList.add(cn);
		});
		if (!CollectionUtil.isEmpty(creditNoteList)) {
			creditNoteList.forEach(creditNote -> {
				if (creditNote.getDocDate() != null && CalendarUtils.getDayDiff(creditNote.getDocDate(),
						businessDate) >= configurationDaysDetails.get(creditNote.getLocationCode())) {
					creditNote.setStatus(TransactionStatusEnum.SUSPENDED.name());
					creditNote.setSrcSyncId(creditNote.getSrcSyncId() + 1);
					updateActivationDetails(creditNote, businessDate);
					creditNoteListToUpdate.add(creditNote);
				}
			});

		}
		if (!CollectionUtil.isEmpty(transferedCreditNoteList)) {
			transferedCreditNoteList.forEach(creditNote -> {
				if (creditNote.getDocDate() != null && CalendarUtils.getDayDiff(creditNote.getDocDate(),
						businessDate) >= configurationDaysDetails.get(creditNote.getLocationCode())) {
					creditNote.setStatus(TransactionStatusEnum.SUSPENDED.name());
					creditNote.setWorkflowStatus(null);
					creditNote.setSrcSyncId(creditNote.getSrcSyncId() + 1);
					if (creditNote.getActivationDetails() != null) {
						updateActivationDetails(creditNote, businessDate);
					}
					creditNoteListToUpdate.add(creditNote);
				}
			});
		}
		creditNoteRepository.saveAll(creditNoteListToUpdate);
		if (!creditNoteListToUpdate.isEmpty()) {
			SalesJobStaggingDto jobStaggingDto = new SalesJobStaggingDto();
			jobStaggingDto.setCreditNoteList(transferedCreditNoteList);
			SyncStagingDto syncDto = jobSyncStaging(jobStaggingDto, SalesOperationCode.JOB_ORDER_SUSPEND);
			salesSyncDataService.publishSalesMessagesToQueue(syncDto);
		}
		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		schedulerResponseDto.setCode(SchedulerCodeEnum.SALES_CREDIT_NOTE_SUSPEND.toString());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return schedulerResponseDto;

	}

	private void updateActivationDetails(CreditNoteDaoExt creditNote, Date businessDate) {
		if (creditNote.getActivationDetails() != null) {
			JsonData jsonData = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(creditNote.getActivationDetails()), JsonData.class);
			CreditNoteActivationDetailsDto activationDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(jsonData.getData(), CreditNoteActivationDetailsDto.class);
			activationDetails.setLastSuspendedDate(businessDate);
			jsonData.setData(activationDetails);
			creditNote.setActivationDetails(MapperUtil.getJsonString(jsonData));
		} else {
			CreditNoteActivationDetailsDto creditNoteActivationDetailsDto = new CreditNoteActivationDetailsDto();
			creditNoteActivationDetailsDto.setLastSuspendedDate(businessDate);
			creditNoteActivationDetailsDto.setLastReactivatedDate(null);
			JsonData jsonData = new JsonData();
			jsonData.setType("ACTIVATION_DETAILS");
			jsonData.setData(creditNoteActivationDetailsDto);
			creditNote.setActivationDetails(MapperUtil.getJsonString(jsonData));
		}
	}

	@Override
	public SchedulerResponseDto advanceBookingApproval() {
		List<String> locationCodes = engineServiceClient.getAppBasedLocations();
		if (locationCodes != null) {
			locationCodes.forEach(locationCode -> {
				BusinessDayDto businessDate = engineServiceClient.getBusinessDayInProgress(locationCode);
				List<SalesTxnDao> saleTxnDaoToUpdate = new ArrayList<>();
				if (businessDate != null) {
					List<SalesTxnDao> salesTransactionListActivation = salesTxnRepository.getApprovalDetails(
							TransactionTypeEnum.AB.name(), SalesTxnRequestTypeEnum.ACTIVATION.name(),
							TransactionStatusEnum.ACTIVATION_PENDING.name(), businessDate.getBusinessDate(),
							CalendarUtils.addDate(businessDate.getBusinessDate(), -1), locationCodes);
					List<SalesTxnDao> salesTransactionListCancellation = salesTxnRepository.getApprovalDetails(
							TransactionTypeEnum.AB.name(), SalesTxnRequestTypeEnum.CANCELLATION.name(),
							TransactionStatusEnum.CANCELLATION_PENDING.name(), businessDate.getBusinessDate(),
							CalendarUtils.addDate(businessDate.getBusinessDate(), -1), locationCodes);
					if (salesTransactionListActivation != null) {
						salesTransactionListActivation.forEach(salesTxn -> {
							OrderActivationDetails orderActivationDetails = MapperUtil.getObjectMapperInstance()
									.convertValue(MapperUtil.getJsonFromString(
											orderRepository.findById(salesTxn.getId()).get().getActivationDetails()),
											OrderActivationDetails.class);
							WorkflowProcessGetResponseDto workflowProcessGetResponseDto = MapperUtil
									.getObjectMapperInstance()
									.convertValue(integrationService.callEpossAPI(HttpMethod.GET,
											SalesUtil.WORKFLOW_PROCESS_URL + "/"
													+ orderActivationDetails.getProcessId(),
											Map.of(SalesUtil.WORKFLOW_TYPE, orderActivationDetails.getRequestType()),
											null).getResponse(), WorkflowProcessGetResponseDto.class);
							if (workflowProcessGetResponseDto != null && workflowProcessGetResponseDto
									.getApprovalStatus().equals(WorkflowProcessStatusEnum.PENDING.name())) {
								integrationService.callEpossAPI(HttpMethod.PATCH,
										SalesUtil.WORKFLOW_PROCESS_URL + "/" + orderActivationDetails.getProcessId(),
										Map.of(SalesUtil.WORKFLOW_TYPE, orderActivationDetails.getRequestType()), null);
								salesTxn.setStatus(salesTxn.getPreviousStatus());
								salesTxn.setPreviousStatus(TransactionStatusEnum.CLOSED.name());
								salesTxn.setSrcSyncId(salesTxn.getSrcSyncId() + 1);
								saleTxnDaoToUpdate.add(salesTxn);
							}
						});
					}
					if (salesTransactionListCancellation != null) {
						salesTransactionListCancellation.forEach(salesTxn -> {
							OrderCancelDetails orderCancelDetails = MapperUtil.getObjectMapperInstance()
									.convertValue(MapperUtil.getJsonFromString(
											orderRepository.findById(salesTxn.getId()).get().getCancellationDetails()),
											OrderCancelDetails.class);
							WorkflowProcessGetResponseDto workflowProcessGetResponseDto = MapperUtil
									.getObjectMapperInstance()
									.convertValue(integrationService.callEpossAPI(HttpMethod.GET,
											SalesUtil.WORKFLOW_PROCESS_URL + "/" + orderCancelDetails.getProcessId(),
											Map.of(SalesUtil.WORKFLOW_TYPE, orderCancelDetails.getRequestType()), null)
											.getResponse(), WorkflowProcessGetResponseDto.class);
							if (workflowProcessGetResponseDto != null && workflowProcessGetResponseDto
									.getApprovalStatus().equals(WorkflowProcessStatusEnum.PENDING.name())) {
								integrationService.callEpossAPI(HttpMethod.PATCH,
										SalesUtil.WORKFLOW_PROCESS_URL + "/" + orderCancelDetails.getProcessId(),
										Map.of(SalesUtil.WORKFLOW_TYPE, orderCancelDetails.getRequestType()), null);
								salesTxn.setStatus(salesTxn.getPreviousStatus());
								salesTxn.setPreviousStatus(TransactionStatusEnum.CLOSED.name());
								salesTxn.setSrcSyncId(salesTxn.getSrcSyncId() + 1);
								saleTxnDaoToUpdate.add(salesTxn);

							}
						});
						if (!CollectionUtil.isEmpty(saleTxnDaoToUpdate)) {
							salesTxnRepository.saveAll(saleTxnDaoToUpdate);
						}

					}
				}

			});
		}

		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		schedulerResponseDto.setCode(SchedulerCodeEnum.SALES_AB_APPROVAL.toString());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return schedulerResponseDto;
	}

	@Override
	public SchedulerResponseDto suspendBooking(String locationCode) {
		List<String> salesTransactionIdList = new ArrayList<>();
		log.info("inside suspendBooking method");
		LocationCacheDto locationCacheDto = engineServiceClient.getStoreLocation(locationCode);
		Date businessDate = businessDayService.getBodBusinessDay().getBusinessDate();
		LocationAdvanceBookingDetailsDto locationAdvanceBookingDetailsDto = MapperUtil.getObjectMapperInstance()
				.convertValue(locationCacheDto.getAbDetails(), LocationAdvanceBookingDetailsDto.class);
		List<SalesTxnDao> salesTransactionList = salesTxnRepository.findByTxnTypeInAndStatusAndLocationCode(
				Arrays.asList(TransactionTypeEnum.AB.name()), TransactionStatusEnum.CONFIRMED.name(), locationCode);
		List<SalesTxnDao> salesTransactionListToBeUpdated = new ArrayList<>();
		List<OrderDao> orderDaoListToBeUpdated = new ArrayList<>();
		if (!CollectionUtil.isEmpty(salesTransactionList)) {
			for (SalesTxnDao salesTransaction : salesTransactionList) {
				if (salesTransaction.getDocDate() != null && CalendarUtils.getDayDiff(salesTransaction.getDocDate(),
						businessDate) >= locationAdvanceBookingDetailsDto
								.getValidityDaysforAutoClosureInAdvanceBooking()) {
					salesTransaction.setStatus(TransactionStatusEnum.SUSPENDED.name());
					Optional<OrderDao> order = orderRepository.findById(salesTransaction.getId());
					if (order.isPresent()) {
						order.get().setSuspendedDate(businessDate);
						order.get().setSrcSyncId(order.get().getSrcSyncId() + 1);
						orderDaoListToBeUpdated.add(order.get());
					}
					salesTransactionIdList.add(salesTransaction.getId());
					salesTransaction.setSrcSyncId(salesTransaction.getSrcSyncId() + 1);
					salesTransactionListToBeUpdated.add(salesTransaction);
				}
			}
		}
		if (!CollectionUtils.isEmpty(salesTransactionListToBeUpdated)) {
			salesTransactionListToBeUpdated = salesTxnRepository.saveAll(salesTransactionListToBeUpdated);
			salesTxnRepository.flush();
		}

		if (!CollectionUtils.isEmpty(orderDaoListToBeUpdated)) {
			orderDaoListToBeUpdated = orderRepository.saveAll(orderDaoListToBeUpdated);
			orderRepository.flush();
		}
		SalesJobStaggingDto jobStaggingDto = new SalesJobStaggingDto();
		jobStaggingDto.setOrderDaoList(orderDaoListToBeUpdated);
		jobStaggingDto.setSalesTransactionLisToBeUpdated(salesTransactionListToBeUpdated);
		SyncStagingDto syncDto = jobSyncStaging(jobStaggingDto, SalesOperationCode.JOB_ORDER_SUSPEND);
		salesSyncDataService.publishSalesMessagesToQueue(syncDto);
		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		schedulerResponseDto.setCode(SchedulerCodeEnum.SALES_AB_SUSPEND.toString());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return schedulerResponseDto;
	}

	@Transactional
	@Override
	public SchedulerResponseDto syncFileToOnlineStorage() {

		log.debug("{} triggered. ", SchedulerCodeEnum.SALES_FILE_SYNC_ONLINE.name());
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.SALES_FILE_SYNC_ONLINE.name());
		response.setStatus(JobProcessStatusEnum.COMPLETED.name());

		List<CustomerDocumentsDao> customerDocs = customerDocService.getActiveUnsyncedDocs();
		if (customerDocs.isEmpty()) {
			log.debug("No active unsynced files found.");
			return response;
		}

		// if integration-service not available send failed job
		String serviceId = "integration-service";
		List<ServiceInstance> intgInstances = discoveryClient.getInstances(serviceId);
		if (intgInstances.isEmpty()) {
			response.setStatus(JobProcessStatusEnum.FAILED.name());
			response.setFailureMessage(
					"Load balancer not available for the required service. (serviceId: " + serviceId + ")");
			return response;
		}

		List<CustomerDocumentsDao> customerDocsUpdated = new ArrayList<>();
		for (CustomerDocumentsDao cd : customerDocs) {

			// data sync require to update the status change

			Boolean onlineUploadStatus = null;
			try {
				integrationService.uploadFileToOnlineBucket(cd.getDocumentPath());
				onlineUploadStatus = true;
			} catch (Exception e) {
				log.error("Upload File to online bucket failed. Error Message:- " + e.getMessage());
				onlineUploadStatus = false;
			}

			if (onlineUploadStatus) {
				cd.setIsSynced(true);
				cd.setSrcSyncId(cd.getSrcSyncId() + 1);
				customerDocsUpdated.add(cd);
			}

		}

		if (!customerDocsUpdated.isEmpty()) {
			customerDocsUpdated = customerDocService.saveAll(customerDocsUpdated);
			SalesJobStaggingDto jobStaggingDto = new SalesJobStaggingDto();
			jobStaggingDto.setCustomerDocsUpdated(customerDocsUpdated);
			SyncStagingDto syncDto = jobSyncStaging(jobStaggingDto, SalesOperationCode.JOB_CUST_DOCUMENT);
			salesSyncDataService.publishSalesMessagesToQueue(syncDto);
		}
		return response;
	}

	@Transactional
	@Override
	public SchedulerResponseDto cancelPendingBillCancelRequests() {

		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.SALES_PENDING_BILL_CANCEL_DELETE.name());
		response.setStatus(JobProcessStatusEnum.COMPLETED.name());

		String locationCode = CommonUtil.getLocationCode();
		Date businessDate = null;

		try {
			businessDate = businessDayService.getBusinessDayInProgress(locationCode).getBusinessDate();
		} catch (ServiceException e) {
			log.info("Skipping PENDING bill cancellation request cancel as no business date is valid for location - {}",
					locationCode);
			return response;
		}

		log.info("Cancel PENDING bill cancellation requests for date :- {}", businessDate);

		List<CancelDaoExt> cancelTxnList = cancellationRepositoryExt
				.findByTxnTypeAndStatusAndDocDateLessThanEqualAndLocationCode(Set.of(TxnTypeCancelEnum.CMCAN.name()),
						TxnStatusCancelEnum.PENDING.name(), businessDate, locationCode);

		// doubt - is it necessary to update status in workflow?

		if (CollectionUtil.isEmpty(cancelTxnList)) {
			log.info("No request is PENDING for cancellation, for the date - {} at {} location", businessDate,
					locationCode);
			return response;
		}

		cancelTxnList.forEach(cancelTxnDao -> cancelTxnDao.setStatus(TxnStatusCancelEnum.CANCELLED.name()));
		cancellationRepositoryExt.saveAll(cancelTxnList);

		log.info("{} bill cancellation requests are cancelled for business date {} at {} location",
				cancelTxnList.size(), businessDate, locationCode);

		return response;
	}

	@Transactional
	@Override
	public void updateCMAndAB(Set<String> txnIdList) {
		Integer cmCount = cashMemoRepository.updatePaidValidByIdIn(txnIdList, BigDecimal.ZERO,
				CommonUtil.getEmployeeCode(), CalendarUtils.getCurrentDate());
		log.info("No. of CMs updated:- " + cmCount);

		Integer abCount = orderRepository.updatePaidValidByIdIn(txnIdList, BigDecimal.ZERO,
				CommonUtil.getEmployeeCode(), CalendarUtils.getCurrentDate());
		log.info("No. of ABs updated:- " + abCount);

	}

	@Transactional
	@Override
	public void deletePaymentItemMap(List<String> paymentIdListForPaymentItemMapDelete) {
		// if list is empty, the return
		if (CollectionUtil.isEmpty(paymentIdListForPaymentItemMapDelete)) {
			return;
		}

		// delete from payment item map, for payments which have following status -
		// [DELETED,REVERSED,CANCELLED]
		List<PaymentItemMappingDaoExt> paymentItemMap = paymentItemMappingRepository
				.getPaymentItemMap(paymentIdListForPaymentItemMapDelete, PaymentStatusEnum.getDeletedPaymentStatus());
		if (!CollectionUtil.isEmpty(paymentItemMap)) {
			paymentItemMappingRepository.deleteAll(paymentItemMap);
		}

	}

	private SyncStagingDto jobSyncStaging(SalesJobStaggingDto syncData, String operation) {
		SyncStagingDto jobStagingDto = new SyncStagingDto();
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add("EPOSS");
		if (syncData.getSalesTransactionLisToBeUpdated() != null
				&& !syncData.getSalesTransactionLisToBeUpdated().isEmpty()) {
			List<SalesTxnSyncDtoExt> salesSyncExtList = syncData.getSalesTransactionLisToBeUpdated().stream()
					.map(SalesTxnSyncDtoExt::new).collect(Collectors.toList());
			syncDataList.add(DataSyncUtil.createSyncData(salesSyncExtList, 0));
		}
		if (syncData.getOrderDaoList() != null && !syncData.getOrderDaoList().isEmpty()) {
			List<OrderSyncDtoExt> orderSyncExtList = syncData.getOrderDaoList().stream().map(OrderSyncDtoExt::new)
					.collect(Collectors.toList());
			syncDataList.add(DataSyncUtil.createSyncData(orderSyncExtList, 1));
		}
		if (syncData.getCustomerDocsUpdated() != null && !syncData.getCustomerDocsUpdated().isEmpty()) {
			List<CustomerDocumentSyncDto> customerDocSync = syncData.getCustomerDocsUpdated().stream()
					.map(CustomerDocumentSyncDto::new).collect(Collectors.toList());
			syncDataList.add(DataSyncUtil.createSyncData(customerDocSync, 2));
		}
		if (syncData.getCreditNoteList() != null && !syncData.getCreditNoteList().isEmpty()) {
			List<CreditNoteSyncDtoExt> creditNoteSync = syncData.getCreditNoteList().stream()
					.map(CreditNoteSyncDtoExt::new).collect(Collectors.toList());
			syncDataList.add(DataSyncUtil.createSyncData(creditNoteSync, 3));
		}
		if (syncData.getOrderDetailsDaoList() != null && !syncData.getOrderDetailsDaoList().isEmpty()) {
			List<OrderDetailsSyncDtoExt> orderDetailsSync = syncData.getOrderDetailsDaoList().stream()
					.map(OrderDetailsSyncDtoExt::new).collect(Collectors.toList());
			syncDataList.add(DataSyncUtil.createSyncData(orderDetailsSync, 4));
		}
		if (syncData.getInventoryDetailsList() != null && !syncData.getInventoryDetailsList().isEmpty()) {
			syncDataList.add(DataSyncUtil.createSyncData(syncData.getInventoryDetailsList(), 5));
		}
		MessageRequest jobMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.SELECTIVE.toString());
		jobStagingDto.setMessageRequest(jobMsgRequest);
		String jobMsgRqst = MapperUtil.getJsonString(jobMsgRequest);
		SyncStaging jobSyncStaging = new SyncStaging();
		jobSyncStaging.setMessage(jobMsgRqst);
		jobSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		jobSyncStaging = salesSyncStagingRepository.save(jobSyncStaging);
		jobStagingDto.setId(jobSyncStaging.getId());
		return jobStagingDto;
	}

	@Override
	public SchedulerResponseDto deleteDigitalSignatures(String locationCode) {
		customerDigitalSignatureRepository.deleteDigitalSignature(locationCode, null);
		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		schedulerResponseDto.setCode(SchedulerCodeEnum.CUSTOMER_DIGITAL_SIGNATURE_DELETION.name());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.name());
		return schedulerResponseDto;
	}

	@Override
	@Transactional
	public EinvoiceJobResponseDto updateInvoiceDocuments(InvoiceDocumentsUpdateDto invoiceDocumentsUpdateDto) {
		if (invoiceDocumentsUpdateDto != null
				&& !CollectionUtil.isEmpty(invoiceDocumentsUpdateDto.getInvoiceDocuments())) {
			List<SalesInvoiceDocumentsDao> invoiceDocumentDaosSave = new ArrayList<>();
			invoiceDocumentsUpdateDto.getInvoiceDocuments().forEach(invoiceDocument -> {
				invoiceDocumentDaosSave.add(MapperUtil.mapObjToClass(invoiceDocument, SalesInvoiceDocumentsDao.class));
			});
			salesInvoiceDocService.syncDataInvoiceDocs(invoiceDocumentDaosSave);
		}
		if (invoiceDocumentsUpdateDto != null
				&& !CollectionUtil.isEmpty(invoiceDocumentsUpdateDto.getCancelResponse())) {
			List<SalesInvoiceDocumentsDao> invoiceDocumentDaosCancel = new ArrayList<>();
			invoiceDocumentsUpdateDto.getCancelResponse().forEach(cancel -> {
				SalesInvoiceDocumentsDao salesInvoiceDocumentsDao = salesInvoiceDocumentsRepository
						.findByReferenceId(cancel.getSalesTxnId());
				if (salesInvoiceDocumentsDao != null && !salesInvoiceDocumentsDao.getTransactionType()
						.equalsIgnoreCase(EinvoiceTransactionTypeEnum.BILL_CANCELLATION.name())) {
					salesInvoiceDocumentsDao.setTransactionType(EinvoiceTransactionTypeEnum.BILL_CANCELLATION.name());
					salesInvoiceDocumentsDao.setReferenceId(cancel.getCancelTxnId());
					invoiceDocumentDaosCancel.add(salesInvoiceDocumentsDao);
				}
			});
			salesInvoiceDocService.syncDataInvoiceDocs(invoiceDocumentDaosCancel);
		}
		ApiResponseDto apiResponse = salesIntegrationServiceImpl.callIntegration(HttpMethod.GET,
				"api/integration/v2/jobs/eposs/einvoice-irn", null, null);
		EinvoiceJobResponseDto einvoiceJobResponseDto = MapperUtil.getObjectMapperInstance()
				.convertValue(apiResponse.getResponse(), EinvoiceJobResponseDto.class);
		return einvoiceJobResponseDto;
	}

	@Override
	public SchedulerResponseDto clearAbCoPayments() {

		String locationCode = CommonUtil.getLocationCode();
		log.info("SALES_AB_CO_PAYMENT_CLEAR for location :- {} started ", locationCode);

		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.SALES_AB_CO_PAYMENT_CLEAR.name());
		response.setStatus(JobProcessStatusEnum.COMPLETED.name());

		Date docDate = null;
		Short fiscalYear = null;

		try {
			BusinessDayDaoExt businessDateDao = businessDayService.getBusinessDayInProgress(locationCode);
			docDate = businessDateDao.getBusinessDate();
			fiscalYear = businessDateDao.getFiscalYear().shortValue();
		} catch (ServiceException e) {
			log.info("Skipping SALES_AB_CO_PAYMENT_CLEAR as no business date is valid for location - {}", locationCode);
			return response;
		}

		log.info("SALES_AB_CO_PAYMENT_CLEAR for date:- {} and fiscal year:- {}", docDate, fiscalYear);

		List<PaymentDetailsDaoExt> paymentList = paymentDetailsRepository.findAllPendingPayment(locationCode, docDate,
				List.of(TransactionTypeEnum.AB.name(), TransactionTypeEnum.CO.name()),
				TransactionStatusEnum.CONFIRMED.name(), true);

		// if empty then return records updated as 0.
		if (CollectionUtil.isEmpty(paymentList)) {
			log.info("No SALES_AB_CO_PAYMENT_CLEAR for deletion, for the date:- " + docDate);
			return response;
		}

		// filter payments to delete & group by sales_transaction
		Map<SalesTxnDaoExt, List<PaymentDetailsDaoExt>> salesTxnAndPaymentsGroup = paymentList.stream()
				.filter(paymentDetailsDao -> !PaymentStatusEnum.getStatusNotAllowedForDelete()
						.contains(paymentDetailsDao.getStatus()))
				.collect(Collectors.groupingBy(PaymentDetailsDaoExt::getSalesTxnDao));
		Map<String, BigDecimal> reducedAmountDetails = new HashMap<>();
		List<String> paymentIdList = new ArrayList<>();
		List<PaymentDetailsDaoExt> paymentListToUpdate = new ArrayList<>();
		// TODO: segregate few payments for different flow
		// TODO: handle errors

		for (Map.Entry<SalesTxnDaoExt, List<PaymentDetailsDaoExt>> salesTxnAndPayments : salesTxnAndPaymentsGroup
				.entrySet()) {
			BigDecimal totalAmountReduced = BigDecimal.ZERO;
			for (PaymentDetailsDaoExt paymentDetailsDao : salesTxnAndPayments.getValue()) {

				if (PaymentStatusEnum.getStatusNotAllowedForDelete().contains(paymentDetailsDao.getStatus())) {
					continue;
				}

				paymentDetailsDao.setIsEditable(false);
				totalAmountReduced = totalAmountReduced.add(paymentDetailsDao.getAmount());
				paymentIdList.add(paymentDetailsDao.getId());
				paymentListToUpdate.add(paymentDetailsDao);
				// have to release account from 'HOLD'
				if (PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(paymentDetailsDao.getPaymentCode())) {
					PaymentService paymentSerive = paymentFactory.getPaymentService(paymentDetailsDao.getPaymentCode(),
							paymentDetailsDao.getPaymentGroup());
					paymentSerive.deleteTempPayment(paymentDetailsDao);

				} else {
					paymentDetailsDao.setStatus(PaymentStatusEnum.DELETED.name());
				}

				// TODO: check payment status 'REVERSED' and 'REVERSED_WITH_CN' to set reversal
				// date
			}
			reducedAmountDetails.put(salesTxnAndPayments.getKey().getId(), totalAmountReduced);
		}

		log.info("No. of payments deleted for SALES_AB_CO_PAYMENT_CLEAR :- {} and fiscal year:- {}",
				paymentListToUpdate.size());

		if (CollectionUtil.isEmpty(paymentListToUpdate)) {
			return response;
		}

		// save payments
		paymentDetailsRepository.saveAll(paymentListToUpdate);

		// [DELETED,REVERSED,CANCELLED]
		salesJobService.deletePaymentItemMap(paymentIdList);

		// update paid amount
		List<OrderDao> orderList = orderRepository.findAllById(reducedAmountDetails.keySet());
		if (!CollectionUtil.isEmpty(orderList)) {
			orderList.forEach(orderDao -> orderDao
					.setPaidValue(orderDao.getPaidValue().subtract(reducedAmountDetails.get(orderDao.getId()))));
			orderRepository.saveAll(orderList);
		}

		log.info("End of SALES_AB_CO_PAYMENT_CLEAR");

		return response;
	}

	@Override
	public SchedulerResponseDto clearFrozenDetails(String locationCode) {
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.SALES_CLEAR_FROZEN_CREDIT_NOTE.name());
		response.setStatus(JobProcessStatusEnum.COMPLETED.name());
		LocationCacheDto locationCacheDto = engineServiceClient.getStoreLocation(locationCode);
		log.info("SALES_CLEAR_FROZEN_CREDIT_NOTE :- {} started ", locationCode);
		Date businessDate = businessDayService.getEodBusinessDay().getBusinessDate();
		GrnDetails grnDetails = locationCacheDto.getGrnDetails();
		// List<Object[]> creditNotes =
		// creditNoteRepository.listAllCreditNotes(0,(short)0,null,null,null,locationCode,0,null,null,TransactionStatusEnum.OPEN.name(),true,
		// 0,0);
		List<CreditNoteDaoExt> creditNotes = creditNoteRepository
				.findAllByStatusAndLocationCode(TransactionStatusEnum.OPEN.name(), locationCode);
		log.info("the number of creditNotes is {}", creditNotes.size());
		List<CreditNoteDaoExt> creditNotesList = new ArrayList<>();
		for (CreditNoteDaoExt creditNote : creditNotes) {
			Date docDate = creditNote.getOriginalDocDate() != null ? creditNote.getOriginalDocDate()
					: creditNote.getDocDate();
			if (docDate != null && CalendarUtils.getDayDiff(docDate, businessDate) >= grnDetails
					.getNoOfDaysToProtectGoldRateForGRN() && creditNote.getLinkedTxn() == null) {
				creditNote.setFrozenRateDetails(null);
				creditNotesList.add(creditNote);

			}
		}
		log.info("The no of creditNotes after SALES_CLEAR_FROZEN_CREDIT_NOTE is {}", creditNotesList.size());
		creditNoteRepository.saveAll(creditNotesList);
		log.info("End of SALES_CLEAR_FROZEN_CREDIT_NOTE");

		return response;
	}

}
