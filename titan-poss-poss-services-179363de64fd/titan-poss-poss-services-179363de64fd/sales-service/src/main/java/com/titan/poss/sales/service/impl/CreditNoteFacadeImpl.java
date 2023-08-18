/*  

 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.titan.poss.config.dto.request.json.AdvanceCNRuleDetails;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.OwnerTypeEnum;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.domain.constant.enums.PaymentGroupEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.constant.enums.WorkflowProcessStatusEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.BankingDetails;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CashPaymentRuleDetails;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.CreditNoteStatusUpdateDto;
import com.titan.poss.core.dto.CreditNoteTransferDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.DigigoldDetails;
import com.titan.poss.core.dto.GETTaskListDTO;
import com.titan.poss.core.dto.GhsAccountDetailsResponseDto;
import com.titan.poss.core.dto.GhsCreditNoteTransferDto;
import com.titan.poss.core.dto.GhsCreditNoteUpdateResponseDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.WorkflowProcessCreateDto;
import com.titan.poss.core.dto.WorkflowProcessCreateResponseDto;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.dto.WorkflowTaskApproveDto;
import com.titan.poss.core.dto.WorkflowTaskDetailsDto;
import com.titan.poss.core.dto.WorkflowTaskListDto;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.DateEnum;
import com.titan.poss.core.enums.GhsConstantsEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.response.StringResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.dao.AccountDetailsDao;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CreditNoteTransferDao;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerPaymentDao;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.GepConfigDetailsDao;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentReversalDaoExt;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.CnRefundPaymentDetails;
import com.titan.poss.sales.dto.CreditNoteEntitiesDto;
import com.titan.poss.sales.dto.CreditNoteEpossDto;
import com.titan.poss.sales.dto.CreditNoteSyncDtoExt;
import com.titan.poss.sales.dto.CustomerPaymentSyncDto;
import com.titan.poss.sales.dto.EghsCNDetails;
import com.titan.poss.sales.dto.PaymentReversalSyncDtoExt;
import com.titan.poss.sales.dto.constants.BoutiqueApproverStatus;
import com.titan.poss.sales.dto.constants.CNTransferStatus;
import com.titan.poss.sales.dto.constants.CNWorkFlowType;
import com.titan.poss.sales.dto.constants.CNWorkflowStatus;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.constants.UploadFileDocTypeEnum;
import com.titan.poss.sales.dto.request.CNPaymentDetailsDto;
import com.titan.poss.sales.dto.request.ConfirmEGHSRequestDto;
import com.titan.poss.sales.dto.request.ConfirmRequestDto;
import com.titan.poss.sales.dto.request.CreditNoteHeaderDto;
import com.titan.poss.sales.dto.request.FrozenRatesDetails;
import com.titan.poss.sales.dto.request.RemarksBaseDto;
import com.titan.poss.sales.dto.request.RequestWorkflowCNDto;
import com.titan.poss.sales.dto.response.CNRefundResponeDto;
import com.titan.poss.sales.dto.response.CNResponeDtoExt;
import com.titan.poss.sales.dto.response.CNResponseDto;
import com.titan.poss.sales.dto.response.CNResponseLegacyDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.dto.response.WorkflowBaseResponse;
import com.titan.poss.sales.repository.AccountDetailsRepository;
import com.titan.poss.sales.repository.CreditNoteRepository;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteTransferRepositoryExt;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.CustomerPaymentRepository;
import com.titan.poss.sales.repository.CustomerTxnRepository;
import com.titan.poss.sales.repository.GepConfigDetailsRepository;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentReversalRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.repository.SalesTxnRepository;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CreditNoteFacade;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.FileService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.PaymentFacadeService;
import com.titan.poss.sales.service.SalesDocService;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesCNServiceImpl")
public class CreditNoteFacadeImpl implements CreditNoteFacade {

	private static final String ERR_INT_219 = "ERR-SALE-219";

	private static final String CALL_TO_EPOSS_FAILED = "Call to EPOSS Failed";

	private static final String ERR_SALE_175 = "ERR-SALE-175";

	private static final String ERR_SALE_098 = "ERR-SALE-098";
	private static final String REQUEST_IS_NOT_APPROVED = "Request is not approved.";

	private static final String CREDIT_NOTE_NOT_FOUND = "No credit note found";
	private static final String ERR_SALE_154 = "ERR-SALE-154";

	private static final String ERROR_IN_PARSNG_JSON = "ERROR IN PARSNG JSON";
	private static final String ERR_CORE_003 = "ERR-CORE-003";

	private static final String CREDIT_NOTE_NOT_FOUND_IN_EPOSS = "No credit note found in EPOSS";
	private static final String ERR_SALE_169 = "ERR-SALE-169";

	private static final String DOC_NUMBER_FISCALYEAR_VALIDATION = "provide either (docNumber and fiscalyear) or mobileNumber or txnId";
	private static final String ERR_SALE_155 = "ERR-SALE-155";

	private static final String CREDIT_NOTE_WORKFLOW_VALIDATION_ERROR_1 = "Credit note should be in suspended status for activation";
	private static final String ERR_SALE_156 = "ERR-SALE-156";

	private static final String CN_ALREADY_SENT_FOR_APPROVAL = "Credit note already requested for approval";
	private static final String ERR_SALE_158 = "ERR-SALE-158";

	private static final String CREDIT_NOTE_IS_CLOSED = "Credit note is CLOSED";
	private static final String ERR_SALE_160 = "ERR-SALE-160";

	private static final String ERR_SALE_202 = "ERR-SALE-202";

	private static final String ERR_SALE_195 = "ERR-SALE-195";

	private static final String ERR_SALE_402 = "ERR-SALE-402";

	private static final String INVALID_REQUEST = "CreditNote of type {creditNoteType} cannot be transferred to EGHS";
	private static final String ERR_SALE_414 = "ERR-SALE-414";

	private static final String ERR_SALE_415 = "ERR-SALE-415";

	private static final String ERR_SALE_424 = "ERR-SALE-424";

	private static final String CUSTOMER_NAME = "customerName";

	private static final String DOC_NUMBER_FISCALYEAR_DATE_VALIDATION = "provide either (docNumber and fiscalyear) or mobileNumber or (FromDate and ToDate) or txnId";
	private static final String ERR_SALE_433 = "ERR-SALE-433";

	private static final String INVALID_RANGE = "Please provide From Date and To Date";
	private static final String ERR_SALE_434 = "ERR-SALE-434";

	private static final String INVALID_DATE_DATA = "From Date can't be after To Date";
	private static final String ERR_SALE_435 = "ERR-SALE-435";
	
	@Autowired
	private CreditNoteTransferRepositoryExt cnTransferRepo;

	@Autowired
	private SalesIntegrationServiceImpl salesIntegrationServiceImpl;

	@Autowired
	private CreditNoteService creditNoteService;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationRepo;

	@Autowired
	private EngineServiceClient engineClient;

	@Autowired
	private CustomerService customerService;

	@Autowired
	EngineService engineService;

	@Autowired
	private CreditNoteFacade creditNoteFacad;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepositoryExt;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private FileService fileService;

	@Autowired
	CreditNoteRepositoryExt creditNoteRepo;
	
	@Autowired
	CreditNoteRepository creditNoteDaoRepo;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationMappingRepositoryExt;

	@Autowired
	private GepConfigDetailsRepository gepConfigDetailsRepository;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private PaymentReversalRepositoryExt paymentReversalRepo;

	@Autowired
	private CustomerPaymentRepository customerPaymentRepository;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationMappingRepository;

	@Value("${app.name}")
	private String appName;

	@Autowired
	private AccountDetailsRepository accountDetailsRepository;
	

	@Autowired
	private CustomerTxnRepository customerTxnRepo;
	
	@Autowired
	private PaymentFacadeService paymentFacadeService;
	
	@Autowired
	private CommonPaymentService commonPaymentService;
	
    @Autowired
    SalesDocService salesDocService;

    @Autowired
    private CommonTransactionServiceImpl commonTransactionService;
    
    @Autowired
	private SalesTxnRepository salesTxnRepository;
    
	@Override
	public PagedRestResponse<List<CNResponseDto>> listCN(Integer docNo, Short fiscalYear, String mobileNo,
			String locationCode, Boolean isUnipay, String cnType, String linkedTxnId, Integer customerId,
			Boolean isPageable, List<String> statusList, Set<String> idList, Boolean isFrozenRateCnRequired,
			String transactionId, Long fromDateInLong, Long toDateInLong, Pageable pageable) {

		Date fromDate = null;
		if (fromDateInLong != null && fromDateInLong != 0) {
			fromDate = CalendarUtils.getStartOfDay(new Date(fromDateInLong));
			log.info("date in epoch format - {}, converted date value - {}", fromDateInLong, fromDate);
		}

		Date toDate = null;
		if (toDateInLong != null && toDateInLong != 0) {
			toDate = CalendarUtils.getStartOfDay(new Date(toDateInLong));
			log.info("date in epoch format - {}, converted date value - {}", toDateInLong, toDate);
		}

		// docNo, fiscalYear, mobileNo, locationCode, linkedTxnId, customerId,
		// isPageable,
		// statusList, idList, pageable

		log.info("from date: {} ", fromDate);
		log.info("to date: {} ", toDate);

		if (locationCode == null || locationCode.equals(CommonUtil.getLocationCode())) {
			return listCNUsingLocation(docNo, fiscalYear, mobileNo, locationCode, isUnipay, cnType, linkedTxnId, customerId,
					isPageable, statusList, idList, isFrozenRateCnRequired, transactionId, fromDate, toDate, pageable);
		} else {
			// call integration
			return callEPOSSforListingCN(docNo, fiscalYear, mobileNo, locationCode, customerId, fromDate, toDate,
					pageable);
		}

	}

	@Override
	public PagedRestResponse<List<CNResponseDto>> listCNUsingLocation(Integer docNo, Short fiscalYear, String mobileNo,
			String locationCode, Boolean isUnipay,String cnType, String linkedTxnId, Integer customerId, Boolean isPageable,
			List<String> statusList, Set<String> idList, Boolean isFrozenRateCnRequired, String transactionId,
			Date fromDate, Date toDate, Pageable pageable) {
		if (isPageable == null || !isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		// if customer id is passed then search should happen on the passed id and
		// location
		if (customerId == null) {
			validateInputFeilds(docNo, fiscalYear, mobileNo, linkedTxnId, idList, transactionId, fromDate, toDate);
		}

		List<Object[]> creditNoteList = creditNoteService.listAllCreditNotes(docNo, fiscalYear,
				CryptoUtil.encrypt(mobileNo, SalesConstants.MOBILE_NO), locationCode, isUnipay, cnType, linkedTxnId, customerId,
				statusList, idList, isFrozenRateCnRequired, transactionId, fromDate, toDate, pageable);

		int total = creditNoteService.getTotalCount(docNo, fiscalYear,
				CryptoUtil.encrypt(mobileNo, SalesConstants.MOBILE_NO), locationCode, isUnipay,cnType, linkedTxnId, customerId,
				statusList, transactionId, isFrozenRateCnRequired, fromDate, toDate);
		if (StringUtils.isEmpty(customerId) && total == 0) {
			throw new ServiceException("No credit note found for input parameters", ERR_SALE_402);
		}
		// Sets the dto values from response
		List<CNResponseDto> creditNoteResponseList = setCreditNoteResponeList(creditNoteList, linkedTxnId != null);
		Page<CNResponseDto> pagedData = new PageImpl<>(creditNoteResponseList,
				PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort()), total);
		return new PagedRestResponse<>(creditNoteResponseList, pagedData);
	}

	@SuppressWarnings("unchecked")
	private PagedRestResponse<List<CNResponseDto>> callEPOSSforListingCN(Integer docNo, Short fiscalYear,
			String mobileNo, String locationCode, Integer customerId, Date fromDate, Date toDate, Pageable pageable) {

		Map<String, String> reqParams = new HashMap<>();

		reqParams.put("page", String.valueOf(pageable.getPageNumber()));
		reqParams.put("size", String.valueOf(pageable.getPageSize()));
		reqParams.put(SalesConstants.SRC_BTQ_CODE, String.valueOf(locationCode));
		if (docNo != null) {
			reqParams.put(SalesConstants.DOC_NO, String.valueOf(docNo));
		}
		if (customerId != null) {
			reqParams.put(SalesConstants.CUSTOMER_ID, String.valueOf(customerId));
		}
		if (fiscalYear != null) {
			reqParams.put(SalesConstants.FISCAL_YEAR, String.valueOf(fiscalYear));
		}
		if (mobileNo != null) {
			reqParams.put(SalesConstants.MOBILE_NO, String.valueOf(mobileNo));
		}
		if (fromDate != null) {
			reqParams.put(SalesConstants.FROM_DATE, String.valueOf(fromDate));
		}
		if (toDate != null) {
			reqParams.put(SalesConstants.TO_DATE, String.valueOf(toDate));
		}

		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.GET,
				SalesUtil.CREDITNOTE_EPOSS_URL, reqParams, null);

		return MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
				PagedRestResponse.class);
	}

	/**
	 * @param creditNoteList
	 * @return
	 */
	private List<CNResponseDto> setCreditNoteResponeList(List<Object[]> creditNoteList, Boolean isLinkedTxnIdList) {

		List<CNResponseDto> creditNotResponseList = new ArrayList<>();
		Map<String, CNResponseDto> creditNotResponseMap = new HashMap<>();
		Map<String, String> creditNoteWithParentCnMap = new HashMap<>();
		List<CreditNoteDaoExt> creditNotes = new ArrayList<>();
		List<SyncData> syncDatas = new ArrayList<>();
		Boolean statusUpdate = Boolean.FALSE;
		for (Object[] l : creditNoteList) {
			CNResponseDto is = new CNResponseDto();
//			CreditNoteDaoExt creditNote = creditNoteRepo.findOneById(l[10].toString());

			// cn.doc_no, cn.fiscal_year, cm.customer_name, cn.location_code,
			// cn.credit_note_type, cn.amount, cn.status, linkedTxn.txn_type,
			// cm.mobile_number, stxn.id

			is.setDocNo((Integer) l[0]);
			is.setFiscalYear((Short) l[1]);
			is.setCustomerName(CryptoUtil.decrypt((String) l[2], SalesConstants.CUSTOMER_NAME, false));
			is.setLocationCode((String) l[3]);
			is.setCreditNoteType((String) l[4]);
			is.setDocDate((Date) l[5]);
			is.setAmount((BigDecimal) l[6]);
			if (CNStatus.TRANSFER_GHS.name().equals((String) l[7])) {
				short fiscalYear = (Short) l[1];
				int fiscal = fiscalYear;
				StringResponse status = integrationService.checkCNStatus((Integer) l[0], fiscal,
						VendorCodeEnum.GHS.name());
				if (GhsConstantsEnum.CANCELLED.name().equalsIgnoreCase(status.getStatus())) {
					is.setStatus(CNStatus.CANCELLED.name());
					statusUpdate = Boolean.TRUE;
				} else if (GhsConstantsEnum.CLOSED.name().equalsIgnoreCase(status.getStatus())) {
					is.setStatus(CNStatus.REDEEMED.name());
					statusUpdate = Boolean.TRUE;
				} else if (GhsConstantsEnum.SUSPENDED.name().equalsIgnoreCase(status.getStatus())) {
					is.setStatus(CNStatus.SUSPENDED.name());
					statusUpdate = Boolean.TRUE;
				} else {
					is.setStatus(CNStatus.TRANSFER_GHS.name());
				}
			} else {
				is.setStatus((String) l[7]);
			}
			if (Boolean.TRUE.equals(statusUpdate)) {
				CreditNoteDaoExt creditNote = creditNoteRepo.findOneById(l[10].toString());
				creditNote.setStatus(is.getStatus());
				creditNote.setSrcSyncId(creditNote.getSrcSyncId() + 1);
				creditNotes.add(creditNote);
				CreditNoteSyncDtoExt creditNoteSyncDtoExt = new CreditNoteSyncDtoExt(creditNote);
				syncDatas.add(DataSyncUtil.createSyncData(creditNoteSyncDtoExt, 2));
			}
//			is.setStatus((String) l[7]);
//			creditNote.setStatus(is.getStatus());
//			creditNote.setSrcSyncId(creditNote.getSrcSyncId() + 1);
//			creditNote = creditNoteRepo.save(creditNote);
//			List<SyncData> syncDatas = new ArrayList<>();
//			CreditNoteSyncDtoExt creditNoteSyncDtoExt = new CreditNoteSyncDtoExt(creditNote);
//			syncDatas.add(DataSyncUtil.createSyncData(creditNoteSyncDtoExt, 2));
//			SyncStagingDto syncData = syncStaggingCreditNote(null, null, null, SalesOperationCode.CN_WORKFLOW,
//					syncDatas);
//			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
//				salesSyncDataService.publishSalesMessagesToQueue(syncData);
			is.setLinkedTxnType((String) l[8]);
			is.setMobileNumber(CryptoUtil.decrypt((String) l[9], SalesConstants.MOBILE_NO, false));

			is.setId((String) l[10]);
			is.setLinkedTxnId((String) l[11]);
			is.setCustomerId((Integer) l[12]);
			is.setWorkflowStatus((String) l[13]);
			is.setCashCollected((BigDecimal) l[14]);

			String discountDetials = (String) l[15];
			if (!StringUtil.isBlankJsonStr(discountDetials)) {
				is.setDiscountDetails(MapperUtil.mapObjToClass(discountDetials, JsonData.class));
			}
			String frozenRateDetails = (String) l[16];
			if (frozenRateDetails != null) {
				is.setFrozenRateDetails(MapperUtil.getJsonFromString(frozenRateDetails));
			}

			String eghsDetials = (String) l[17];
			if (!StringUtil.isBlankJsonStr(eghsDetials)) {
				is.setEghsDetails(MapperUtil.mapObjToClass(eghsDetials, JsonData.class));
			}

			is.setGepConfigDetailsId((String) l[18]);
			is.setIsCancleAllowed(getCNCancleFlag(frozenRateDetails, (String) l[7], (String) l[13]));
			is.setUtilisedAmount((BigDecimal) l[19]);
			is.setParentCnId((String) l[20]);
			is.setIsUnipay((Boolean) l[21]);

			creditNotResponseMap.put(is.getId(), is);
			if (is.getParentCnId() != null) {
				creditNoteWithParentCnMap.put(is.getId(), is.getParentCnId());
			}

			creditNotResponseList.add(is);
			if (BooleanUtils.isTrue(isLinkedTxnIdList)) {
				removeChildCnFromResponse(creditNotResponseList, creditNotResponseMap, creditNoteWithParentCnMap, is);
			}

		}
		if (!CollectionUtil.isEmpty(creditNotes)) {
			creditNoteRepo.saveAll(creditNotes);
			SyncStagingDto syncData = syncStaggingCreditNote(null, null, null, SalesOperationCode.CN_WORKFLOW,
					syncDatas);
			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
				salesSyncDataService.publishSalesMessagesToQueue(syncData);
		}

		return creditNotResponseList;
	}

	private void removeChildCnFromResponse(List<CNResponseDto> creditNotResponseList,
			Map<String, CNResponseDto> creditNotResponseMap, Map<String, String> creditNoteWithParentCnMap,
			CNResponseDto is) {
		// if current CN is parent for other CN then other CN should be removed from
		// list.
		if (creditNoteWithParentCnMap.containsValue(is.getId())) {
			creditNotResponseList.removeAll(creditNotResponseList.stream()
					.filter(cnRes -> is.getId().equals(cnRes.getParentCnId()) && !is.getId().equals(cnRes.getId()))
					.collect(Collectors.toList()));
		} // if current CN is child of other CN, then current CN should be removed from
			// list
		else if (!is.getId().equals(is.getParentCnId()) && creditNoteWithParentCnMap.containsKey(is.getId())
				&& creditNotResponseMap.containsKey(creditNoteWithParentCnMap.get(is.getId()))) {
			creditNotResponseList.remove(is);
		}
	}

	/**
	 * @param frozenRateDetails
	 * @param string
	 * @return
	 */
	private Boolean getCNCancleFlag(String frozenRateDetails, String status, String workFlowStatus) {

		Boolean isCancle = true;
		if (!CNStatus.OPEN.name().equalsIgnoreCase(status))
			isCancle = false;

		if (frozenRateDetails != null)
			isCancle = false;

		if (workFlowStatus != null && workFlowStatus.equals(CNWorkflowStatus.PENDING_FOR_CANCEL.name()))
			isCancle = false;

		return isCancle;
	}

	private void validateInputFeilds(Integer docNo, Short fiscalYear, String mobileNo, String linkedTxn,
			Set<String> idList, String transactionId, Date fromDate, Date toDate) {

		// either docnumber, fiscalyear
		// or mobileNumber
		// or fromDate, toDate

		// if list of ids are not provided, then do the check.
		if (CollectionUtil.isEmpty(idList)) {
			if (linkedTxn == null && docNo == null && mobileNo == null && transactionId == null && fromDate == null
					&& toDate == null) {
				throw new ServiceException(DOC_NUMBER_FISCALYEAR_DATE_VALIDATION, ERR_SALE_433);
			}

			if (fiscalYear == null && mobileNo == null && linkedTxn == null && transactionId == null && fromDate == null
					&& toDate == null) {
				throw new ServiceException(DOC_NUMBER_FISCALYEAR_DATE_VALIDATION, ERR_SALE_433);
			}

			if ((fromDate != null && toDate == null) || (fromDate == null && toDate != null)) {
				throw new ServiceException(INVALID_RANGE, ERR_SALE_434);
			}

			if ((fromDate != null && toDate != null) && toDate.before(fromDate)) {
				throw new ServiceException(INVALID_DATE_DATA, ERR_SALE_435);
			}

		}

	}

	@Override
	public CNResponeDtoExt getCN(String id, String locationCode) {

		CreditNoteDaoExt creditNote = null;
			if (locationCode == null || locationCode.equals(CommonUtil.getLocationCode())) {
			locationCode = CommonUtil.getLocationCode();
			creditNote = creditNoteService.findByIdAndLocationCode(id, CommonUtil.getLocationCode());
			if (creditNote == null) {
				throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
			}

		}

		else {
			// call integration
			CNResponeDtoExt cNResponeDtoExt = callEPOSSforGetCN(id, locationCode);
			// check if destination customer id is saved in POSS, if not have to save it.
			Integer destCustomerId = customerService.getCustomerByIdAndLocation(cNResponeDtoExt.getCustomerId(),
					locationCode);
			cNResponeDtoExt.setDestCustomerId(destCustomerId);

			return cNResponeDtoExt;
		}
		String destLocation = null;
		destLocation = creditNote.getIbtLocation();

		AdvanceCNRuleDetails cnAdvRuleDetails = getCNConfigurations(creditNote, CommonUtil.getLocationCode());

		return mapToResponseDto(creditNote, locationCode, cnAdvRuleDetails, false, destLocation);

	}

	/**
	 * @param id
	 * @return
	 */
	private CNResponeDtoExt callEPOSSforGetCN(String id, String locationCode) {

		Map<String, String> reqParams = new HashMap<>();

		reqParams.put(SalesConstants.SRC_BTQ_CODE, String.valueOf(locationCode));

		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.GET,
				SalesUtil.CREDITNOTE_EPOSS_URL + "/" + id, reqParams, null);
		epossApiResponseDto.getResponse();
		return MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
				CNResponeDtoExt.class);
	}

	public CNResponeDtoExt mapToResponseDto(CreditNoteDaoExt creditNote, String locationCode,
			AdvanceCNRuleDetails cnAdvRuleDetails, Boolean isEpossCn, String destLocation) {
		CNResponeDtoExt creditNoteDto = (CNResponeDtoExt) MapperUtil.getObjectMapping(creditNote,
				new CNResponeDtoExt());
		creditNoteDto.setDestLocation(destLocation);
		creditNoteDto.setAmount(BigDecimal.valueOf(Math.round(creditNote.getAmount().doubleValue())));
		if (creditNote.getLinkedTxn() == null) {
			creditNoteDto.setLinkedTxnType(null);
		} else {
			creditNoteDto.setLinkedTxnType(creditNote.getLinkedTxn().getTxnType());
		}

		getCnReferences(creditNote, creditNoteDto);

		creditNoteDto.setFrozenRateDetails(MapperUtil.getJsonFromString(creditNote.getFrozenRateDetails()));
		creditNoteDto.setPaymentDetails(MapperUtil.getJsonFromString(creditNote.getPaymentDetails()));
		// methode is used commonly for eposs and poss
		// if poss cns then only foollowing checks is needed.
		if (!isEpossCn) {
			if (creditNote.getCreditNoteType().equals(CNType.ADV.toString())
					&& (cnAdvRuleDetails == null || StringUtils.isEmpty(cnAdvRuleDetails.getGHSMaxAmountTransfer()))) {

				throw new ServiceException("No configuration Available ", "ERR-SALE-023",
						"ghs max amount configuration not set");
			}
			if (cnAdvRuleDetails != null && !StringUtils.isEmpty(cnAdvRuleDetails.getGHSMaxAmountTransfer())
					&& StringUtils.isEmpty(cnAdvRuleDetails.getGHSUtilizationTransferPercent())) {
				creditNoteDto.setMaxGhsAmount(new BigDecimal(cnAdvRuleDetails.getGHSMaxAmountTransfer()));
			} else if (cnAdvRuleDetails != null && !StringUtils.isEmpty(cnAdvRuleDetails.getGHSMaxAmountTransfer())
					&& !StringUtils.isEmpty(cnAdvRuleDetails.getGHSUtilizationTransferPercent())) {
				BigDecimal amount = BigDecimal.ZERO;
				amount = creditNote.getAmount()
						.multiply(new BigDecimal(cnAdvRuleDetails.getGHSUtilizationTransferPercent())
								.divide(BigDecimal.valueOf(100)));
				if (amount.compareTo(new BigDecimal(cnAdvRuleDetails.getGHSMaxAmountTransfer())) < 0) {
					creditNoteDto.setMaxGhsAmount(BigDecimal.valueOf(Math.round(amount.doubleValue())));
				} else {
					creditNoteDto.setMaxGhsAmount(new BigDecimal(cnAdvRuleDetails.getGHSMaxAmountTransfer()));
				}
			} else if (cnAdvRuleDetails != null && StringUtils.isEmpty(cnAdvRuleDetails.getGHSMaxAmountTransfer())
					&& !StringUtils.isEmpty(cnAdvRuleDetails.getGHSUtilizationTransferPercent())) {
				BigDecimal amount = BigDecimal.ZERO;
				amount = creditNote.getAmount()
						.multiply(new BigDecimal(cnAdvRuleDetails.getGHSUtilizationTransferPercent())
								.divide(BigDecimal.valueOf(100)));
				creditNoteDto.setMaxGhsAmount(BigDecimal.valueOf(Math.round(amount.doubleValue())));
			}
		}
		if (cnAdvRuleDetails != null && cnAdvRuleDetails.getIsCancellationAllowed() != null) {
			creditNoteDto.setIsAutoApproved(cnAdvRuleDetails.getIsCancellationAllowed());
		} else {
			creditNoteDto.setIsAutoApproved(false);
		}
		if (creditNote.getCreditNoteType().equalsIgnoreCase(CNType.DIGI_GOLD_TANISHQ.name())
				|| creditNote.getCreditNoteType().equalsIgnoreCase(CNType.DIGI_GOLD_NON_TANISHQ.name()))
			ValidateDigiGoldCancellation(creditNoteDto, creditNote, locationCode);

		setCustomerDetails(creditNote, creditNoteDto, locationCode);

		// set source customer Id
		Integer destCustomerId = customerService.getCustomerByIdAndLocation(creditNote.getCustomerId(), locationCode);
		creditNoteDto.setDestCustomerId(destCustomerId);

		if (!StringUtil.isBlankJsonStr(creditNote.getDiscountDetails())) {
			creditNoteDto.setDiscountDetails(MapperUtil.mapObjToClass(creditNote.getDiscountDetails(), JsonData.class));
		}
		if (!StringUtil.isBlankJsonStr(creditNote.getPaymentDetails())) {
			creditNoteDto.setPaymentDetails(MapperUtil.mapObjToClass(creditNote.getPaymentDetails(), JsonData.class));
		}

		if (!StringUtil.isBlankJsonStr(creditNote.getEghsDetails())) {

			creditNoteDto.setEghsDetails(MapperUtil.mapObjToClass(creditNote.getEghsDetails(), JsonData.class));
//			JsonData jsonData = MapperUtil.mapObjToClass(creditNote.getEghsDetails(), JsonData.class);
//			EghsCNDetails eghsCNDetails = MapperUtil.mapObjToClass(jsonData.getData(), EghsCNDetails.class);
//			

			try {

				ObjectMapper mapper = new ObjectMapper();
				JsonNode root = mapper.readTree(creditNote.getEghsDetails());
				JsonNode dataNode = root.path("data");
				if (!dataNode.isMissingNode() && dataNode.hasNonNull("isPaymentForEGHS")) {
					Boolean isPaymentForEGHS = dataNode.path("isPaymentForEGHS").asBoolean();
					if (isPaymentForEGHS) {
						creditNoteDto.setMaxGhsAmount(creditNote.getAmount());
					}
				}
			} catch (IOException e) {
				throw new ServiceException("UNABLE_TO_PARSE_JSON", ERR_CORE_003);
			}
		}
		if (creditNote.getGepConfigDetailsDao() != null) {
			creditNoteDto.setGepConfigDetailsId(creditNote.getGepConfigDetailsDao().getId());
		}

		creditNoteDto.setIsRefundDetailsApplicable(false);
		creditNoteDto.setCancelRemarks(creditNote.getCancelRemarks());
		PaymentReversalDaoExt paymentRefunds = paymentReversalRepo.findByCreditNoteId(creditNote.getId());

		if (creditNote.getStatus().equals(CNStatus.CANCELLED.name())) {
			creditNoteDto.setBalanceAmount(BigDecimal.ZERO);
			creditNoteDto.setCancelDate(creditNote.getCancelDate());
		} else {
			BigDecimal balance = creditNote.getAmount().subtract(creditNoteDto.getUtilisedAmount());
			creditNoteDto.setBalanceAmount(balance);
		}

		if (paymentRefunds != null) {

			creditNoteDto.setRefundAmount(paymentRefunds.getAmount());
			creditNoteDto.setPaymentCode(paymentRefunds.getPaymentCode());
			creditNoteDto.setPaymentInstrumentNo(paymentRefunds.getInstrumentNo());
			creditNoteDto.setPaymentInstrumentType(paymentRefunds.getInstrumentType());
			if (paymentRefunds.getOtherDetails() != null && !paymentRefunds.getOtherDetails().equalsIgnoreCase("{}")) {
				creditNoteDto.setBankDetails(MapperUtil.getJsonFromString(paymentRefunds.getOtherDetails()));
				creditNoteDto.setIsRefundDetailsApplicable(true);

			}

			if (creditNote.getProcessId() != null) {
				WorkflowProcessGetResponseDto workflowProcessGetResponseDto = checkRequestWorkflowStatus(
						creditNote.getProcessId(), CNWorkFlowType.CREDIT_NOTE_CANCELLATION.name());
				if (workflowProcessGetResponseDto != null) {
					creditNoteDto.setApproverBy(workflowProcessGetResponseDto.getApprovedby());
					creditNoteDto.setApproverRemarks(workflowProcessGetResponseDto.getApproverRemarks());
				}
			}
		}

		return creditNoteDto;
	}

	private void getCnReferences(CreditNoteDaoExt creditNote, CNResponeDtoExt creditNoteDto) {

		if (creditNote.getParentCn() != creditNote && creditNote.getMergedCN() == null
				&& CNType.ADV.name().equals(creditNote.getCreditNoteType())) {
			List<CreditNoteDaoExt> refCreditNotes = creditNoteService
					.findAllByMergedCNIdAndLocationCode(creditNote.getId(), CommonUtil.getLocationCode());
			List<Integer> refDocList = new ArrayList<>();
			refCreditNotes.forEach(cNote -> refDocList.add(cNote.getDocNo()));
			creditNoteDto.setRefDocNos(refDocList);
		}

		if (CollectionUtils.isEmpty(creditNoteDto.getRefDocNos()) && creditNoteDto.getRefDocNo() != null) {
			List<Integer> refDocList = new ArrayList<>();
			refDocList.add(creditNoteDto.getRefDocNo());
			creditNoteDto.setRefDocNos(refDocList);
		}
	}

	private void ValidateDigiGoldCancellation(CNResponeDtoExt creditNoteDto, CreditNoteDaoExt creditNote,
			String locationCode) {
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(locationCode);
		DigigoldDetails digiGoldDetails = locationCacheDto.getDigigoldDetails();
		if (digiGoldDetails != null) {
			if (creditNote.getCreditNoteType().equalsIgnoreCase(CNType.DIGI_GOLD_TANISHQ.name())
					&& BooleanUtils.isFalse(digiGoldDetails.getIsCNCancelAllowedForDigiGold()))
				creditNoteDto.setIsAutoApproved(false);
			if (creditNote.getCreditNoteType().equalsIgnoreCase(CNType.DIGI_GOLD_NON_TANISHQ.name())
					&& BooleanUtils.isFalse(digiGoldDetails.getIsCNCancelAllowedForNonDigiGold()))
				creditNoteDto.setIsAutoApproved(false);
		}

	}

	/**
	 * @param creditNote
	 */
	private void setCustomerDetails(CreditNoteDaoExt creditNote, CNResponeDtoExt creditNoteDto, String locationCode) {
		CustomerLocationMappingDao customerLocation = getCustomerLocation(creditNote, locationCode);
		CustomerDao customer = getCustomerDetails(customerLocation);

		creditNoteDto.setCustomerId(creditNote.getCustomerId());
		creditNoteDto
				.setCustomerName(CryptoUtil.decrypt(customer.getCustomerName(), SalesConstants.CUSTOMER_NAME, false));
		creditNoteDto.setMobileNumber(CryptoUtil.decrypt(customer.getMobileNumber(), SalesConstants.MOBILE_NO, false));

	}

	private CustomerLocationMappingDao getCustomerLocation(CreditNoteDaoExt creditNote, String locationCode) {
		// get customer location details of whose credtnote is
		CustomerLocationMappingDao customerLocation = customerLocationRepo
				.findByCustomerIdAndLocationCode(creditNote.getCustomerId(), locationCode);

		if (customerLocation == null) {
			throw new ServiceException("Customer Location Mapping not found", "ERR-SALE-075");
		}
		return customerLocation;
	}

	private CustomerDao getCustomerDetails(CustomerLocationMappingDao customerLocation) {

		CustomerDao customer = customerLocation.getCustomer();

		if (customer == null) {
			throw new ServiceException("Customer Details not found or inactive", "ERR-SALE-075");
		}
		return customer;
	}

	@Override
	@Transactional
	public WorkflowBaseResponse requestCN(String id, RequestWorkflowCNDto requestDto, String cNWrokflowType) {
		WorkflowBaseResponse workflowBaseReponse = null;
		// add a check w.r.t cn-master configuration isAllowedGHS

		if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_TRANSFER.toString())) {
			workflowBaseReponse = requestCNTransfer(id, requestDto, cNWrokflowType);
		} else {

			CreditNoteDaoExt creditNoteDao = creditNoteService.findByIdAndLocationCode(id,
					CommonUtil.getLocationCode());

			// check status
			if (creditNoteDao == null) {
				throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
			}
			if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_CANCELLATION.toString())) {
				if (creditNoteDao.getLinkedTxn() != null
						&& (creditNoteDao.getLinkedTxn().getTxnType().equals(TransactionTypeEnum.AB.toString()))) {

					throw new ServiceException(
							"Credit note cannot be cancelled as same as being utilized in Advance Booking",
							"ERR-SALE-407");
				}
				// check Employee Loan Cancel configuration with location master in eposs
				checkLocationForCancel(creditNoteDao);
				
				cNValidationConfigCheck(cNWrokflowType, creditNoteDao, CommonUtil.getLocationCode(), null);

			}

			// check if CN is added in any transaction
			checkIfCNIsUsedAsPayment(creditNoteDao);

			validateRequestForFrozenRate(creditNoteDao, cNWrokflowType);
			// check if request is raised already
			validateCreditNoteWithWorkFlowType(creditNoteDao, cNWrokflowType, null);

			WorkflowProcessCreateResponseDto workflowProcessCreateResponseDto = callWorkflowForCreateProcess(requestDto,
					cNWrokflowType, creditNoteDao, creditNoteDao.getLocationCode());

			creditNoteDao.setProcessId(workflowProcessCreateResponseDto.getProcessId());

			if (requestDto.getTempFileIds() != null) {

				log.debug("converting temp file to permanent files");

				String newId;
				for (Map.Entry<String, List<String>> entry : requestDto.getTempFileIds().entrySet()) {
					for (String tempId : entry.getValue()) {
						newId = fileService.updateTempFile(workflowProcessCreateResponseDto.getProcessId(),
								creditNoteDao.getCustomerId(), UploadFileDocTypeEnum.CN_WORKFLOW.name(), entry.getKey(),
								tempId);
						log.debug("Updated temp file to permanent one. tempId: {}, Id: {}", entry.getValue(), newId);
					}
				}
			}

			updateRequestCNWorkflowStatus(creditNoteDao, cNWrokflowType);
			creditNoteService.saveCN(creditNoteDao);

			workflowBaseReponse = new WorkflowBaseResponse(String.valueOf(workflowProcessCreateResponseDto.getDocNo()));
		}
		return workflowBaseReponse;

	}

	private void checkLocationForCancellationGhs(CreditNoteDaoExt creditNoteDao) {
		JsonData jsonData = MapperUtil.mapObjToClass(creditNoteDao.getPaymentDetails(), JsonData.class);
		if (jsonData != null) {
			CNPaymentDetailsDto cnPaymentDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
					CNPaymentDetailsDto.class);
			if (cnPaymentDetailsDto.getPaymentCodes().containsKey(PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode())) {
				LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
				if (BooleanUtils.isNotTrue(locationCacheDto.getCnDetails().getIsGhsCnCancellationAllowed())) {
					throw new ServiceException(
							"GHS CN is not allowed to cancel because configuration is not enabled in Location Master",
							"ERR-SALE-194");
				}
			}

		}
	}

	private void checkIfCNIsUsedAsPayment(CreditNoteDaoExt creditNoteDao) {
		// check if CN is already added in any transaction
		List<PaymentDetailsDaoExt> paymentDetailsList = paymentDetailsRepositoryExt
				.findByPaymentCodeAndSalesTxnDaoLocationCodeAndStatusAndReference3(
						PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), CommonUtil.getLocationCode(),
						PaymentStatusEnum.OPEN.name(), creditNoteDao.getId());
		if (!CollectionUtil.isEmpty(paymentDetailsList)) {
			throw new ServiceException(
					SalesConstants.DYNAMIC_PAYMENT_CODE_IS_ALREADY_ADDED_IN_DYNAMIC_TRANSACTIONTYPE_DYNAMIC_TASKTYPE_TASK_NUMBER_DYNAMIC_DOCNO,
					SalesConstants.ERR_SALE_409, "Credit Note is already added as payment.",
					Map.of(SalesConstants.PAYMENT_CODE, PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), "transactionType",
							paymentDetailsList.get(0).getSalesTxnDao().getTxnType(), "taskType",
							paymentDetailsList.get(0).getSalesTxnDao().getStatus(), "docNo",
							paymentDetailsList.get(0).getSalesTxnDao().getDocNo().toString()));
		}
	}

	private void cNValidationConfigCheck(String cNWrokflowType, CreditNoteDaoExt creditNoteDao, String locationcode,
			BigDecimal eghsTransferAmount) {
		AdvanceCNRuleDetails cnAdvRuleDetails = getCNConfigurations(creditNoteDao, locationcode);

		if (cNWrokflowType == null) {
			// for EGHS CN workflow type will not be there..
			if (cnAdvRuleDetails.getGHSMaxAmountTransfer() == null) {
				throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
						SalesConstants.ERR_SALE_023,
						"Max amount for GHS transfer is not found for location " + CommonUtil.getStoreCode());
			}
			
			BigDecimal amount = BigDecimal.ZERO;
			if(cnAdvRuleDetails.getGHSUtilizationTransferPercent() !=null ) {
			amount = creditNoteDao.getAmount()
					.multiply(new BigDecimal(cnAdvRuleDetails.getGHSUtilizationTransferPercent())
							.divide(BigDecimal.valueOf(100)));
			}
			BigDecimal amountCheck=BigDecimal.ZERO;
			if(amount.compareTo(new BigDecimal(cnAdvRuleDetails.getGHSMaxAmountTransfer())) < 0) 
				amountCheck=BigDecimal.valueOf(Math.round(amount.doubleValue()));
			else
				amountCheck=new BigDecimal(cnAdvRuleDetails.getGHSMaxAmountTransfer());
			
			if (eghsTransferAmount.compareTo(amountCheck) > 0)
					throw new ServiceException("EGHS configuration amount is less than the transfered amount",
							"ERR-SALE-193");
			
//			if (eghsTransferAmount.compareTo(new BigDecimal(cnAdvRuleDetails.getGHSMaxAmountTransfer())) > 0)
//				throw new ServiceException("EGHS configuration amount is less than the transfered amount",
//						"ERR-SALE-193");
		} else {
			// validate on based on workflow type
			if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_CANCELLATION.toString())) {
				// location fieds check (eVoucher, qc, digigold, employee loan, GV, GHS
				// cancelation allowed)
				// If enabled then only, credit note should be allowed to cancel. Otherwise
				// should throw error should not be allowed to cancel or raise request.

				if (cnAdvRuleDetails.getIsCancellationAllowed()==null ||cnAdvRuleDetails.getIsCancellationAllowed()) {
					throw new ServiceException(
							"Cancellation is not allowed for " + creditNoteDao.getCreditNoteType() + ": CNs",
							"ERR-SALE-194", "Cancellation is not Allowed for CN: " + creditNoteDao.getCreditNoteType(),
							Map.of("creditNoteType", creditNoteDao.getCreditNoteType()));
				}
				
				//configuration for cancellation , when isCancellationAllowed is enabled, then only below methods are allowing to cancel.
				//if (cnAdvRuleDetails.getIsCancellationAllowed()) {
				//commenting the condition  as getIsCancellationAllowed() is false for workflow cancellation.
				checkLocationForCancellationGhs(creditNoteDao);

				// configuration for GHS EVOUCHER
				checkLocationForCancelGhsEvoucher(creditNoteDao);
				
				// configuration for Gift voucher
				checkLocationForCancelGiftVoucher(creditNoteDao);

				// configuration for QCGC
				checkLocationForCancelQCGC(creditNoteDao);
				//}

			} else if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_TRANSFER.toString())) {
				if (cnAdvRuleDetails != null && (!cnAdvRuleDetails.getIsBoutiqueWiseTransferAllowed()
						|| !cnAdvRuleDetails.getIsBrandWiseTransferAllowed())) {

					throw new ServiceException(
							"IBT Transfer is not allowed for " + creditNoteDao.getCreditNoteType() + ": CN",
							ERR_SALE_195,
							"btq wise allowed? " + cnAdvRuleDetails.getIsBoutiqueWiseTransferAllowed()
									+ ", brand wise allowed? " + cnAdvRuleDetails.getIsBrandWiseTransferAllowed(),
							Map.of("creditNoteType", creditNoteDao.getCreditNoteType()));
				}
				log.info(" cnValidation detail........{}",cnAdvRuleDetails.getIsBoutiqueWiseTransferAllowed());
				log.info(" cnValidation brand detail........{}",cnAdvRuleDetails.getIsBrandWiseTransferAllowed());
				if (cnAdvRuleDetails.getIsBoutiqueWiseTransferAllowed()
						|| cnAdvRuleDetails.getIsBrandWiseTransferAllowed()) {
					// GIFT VOUCHER tRANSFER ALLOWED
					checkLocationForTransferGiftVoucher(creditNoteDao);

					// GHS CN TRANSFER ALLOWED
					checkLocationForTransferGhs(creditNoteDao);

					// If Ghs Evoucher Transfer Configuration Allowed
					checkLocationForTransferGhsEvoucher(creditNoteDao);
					
					// configuration for QCGC Transfer
					checkLocationForTransferQCGC(creditNoteDao);

				}
				

				if (creditNoteDao.getCreditNoteType().equalsIgnoreCase(CNType.DIGI_GOLD_TANISHQ.name())
						|| creditNoteDao.getCreditNoteType().equalsIgnoreCase(CNType.DIGI_GOLD_NON_TANISHQ.name()))
					validateDigiGoldCNTransfer(creditNoteDao, locationcode);

			}
		}

	}
	
	private void checkLocationForTransferQCGC(CreditNoteDaoExt creditNoteDao) {
		JsonData jsonData = MapperUtil.mapObjToClass(creditNoteDao.getPaymentDetails(), JsonData.class);
		if (jsonData != null) {
			CNPaymentDetailsDto cnPaymentDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
					CNPaymentDetailsDto.class);
			if (cnPaymentDetailsDto.getPaymentCodes().containsKey(PaymentCodeEnum.QCGC.getPaymentcode())) {
				LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
				if (BooleanUtils.isNotTrue(locationCacheDto.getCnDetails().getIsQcgcCnTransferAllowed())) {
					throw new ServiceException(
							"QCGC CN is not allowed to transfer because configuration is not enabled in Location Master",
							"ERR-SALE-448");
				}
			}

		}
	}

	private void checkLocationForCancelQCGC(CreditNoteDaoExt creditNoteDao) {
		JsonData jsonData = MapperUtil.mapObjToClass(creditNoteDao.getPaymentDetails(), JsonData.class);
		if (jsonData != null) {
			CNPaymentDetailsDto cnPaymentDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
					CNPaymentDetailsDto.class);
			if (cnPaymentDetailsDto.getPaymentCodes().containsKey(PaymentCodeEnum.QCGC.getPaymentcode())) {
				LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
				if (BooleanUtils.isNotTrue(locationCacheDto.getCnDetails().getIsQcgcCnCancellationAllowed())) {
					throw new ServiceException(
							"QCGC CN is not allowed to cancel because configuration is not enabled in Location Master",
							"ERR-SALE-431");
				}
			}

		}
	}
	
	private void checkLocationForCancelGiftVoucher(CreditNoteDaoExt creditNoteDao) {
		JsonData jsonData = MapperUtil.mapObjToClass(creditNoteDao.getPaymentDetails(), JsonData.class);
		if (jsonData != null) {
			CNPaymentDetailsDto cnPaymentDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
					CNPaymentDetailsDto.class);
			if (cnPaymentDetailsDto.getPaymentCodes().containsKey(PaymentCodeEnum.GIFT_VOUCHER.getPaymentcode())) {
				LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
				if (BooleanUtils.isNotTrue(locationCacheDto.getCnDetails().getIsGvCnCancellationAllowed())) {
					throw new ServiceException(" Gift Voucher CN is not allowed to cancel", "ERR-SALE-423");
				}
			}

		}
	}

	private void checkLocationForCancelGhsEvoucher(CreditNoteDaoExt creditNoteDao) {
		JsonData jsonData = MapperUtil.mapObjToClass(creditNoteDao.getPaymentDetails(), JsonData.class);
		if (jsonData != null) {
			CNPaymentDetailsDto cnPaymentDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
					CNPaymentDetailsDto.class);
			if (cnPaymentDetailsDto.getPaymentCodes().containsKey(PaymentCodeEnum.GHS_EVOUCHER.getPaymentcode())) {
				LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
				if (BooleanUtils.isNotTrue(locationCacheDto.getCnDetails().getIsEVoucherCnCancellationAllowed())) {
					throw new ServiceException(
							"GHS EVoucher CN is not allowed to cancel because configuration is not enabled in Location Master",
							"ERR-SALE-429");
				}
			}

		}
	}

	private void checkLocationForTransferGhsEvoucher(CreditNoteDaoExt creditNoteDao) {
		JsonData jsonData = MapperUtil.mapObjToClass(creditNoteDao.getPaymentDetails(), JsonData.class);
		if (jsonData != null) {
			CNPaymentDetailsDto cnPaymentDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
					CNPaymentDetailsDto.class);
			if (cnPaymentDetailsDto.getPaymentCodes().containsKey(PaymentCodeEnum.GHS_EVOUCHER.getPaymentcode())) {
				LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
				if (BooleanUtils.isNotTrue(locationCacheDto.getCnDetails().getIsEVoucherCnTransferAllowed())) {
					throw new ServiceException(
							"GHS EVoucher CN is not allowed to transfer because configuration is not enabled in Location Master",
							"ERR-SALE-430");
				}
			}

		}
	}

	private void checkLocationForTransferGiftVoucher(CreditNoteDaoExt creditNoteDao) {
		JsonData jsonData = MapperUtil.mapObjToClass(creditNoteDao.getPaymentDetails(), JsonData.class);
		if (jsonData != null) {
			CNPaymentDetailsDto cnPaymentDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
					CNPaymentDetailsDto.class);
			if (cnPaymentDetailsDto.getPaymentCodes().containsKey(PaymentCodeEnum.GIFT_VOUCHER.getPaymentcode())) {
				LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
				if (BooleanUtils.isNotTrue(locationCacheDto.getCnDetails().getIsGvCnTransferAllowed())) {
					throw new ServiceException(
							"Gift Voucher CN is not allowed to transfer because configuration is not enabled in Location Master",
							"ERR-SALE-423");
				}
			}

		}
	}

	private void checkLocationForTransferGhs(CreditNoteDaoExt creditNoteDao) {
		JsonData jsonData = MapperUtil.mapObjToClass(creditNoteDao.getPaymentDetails(), JsonData.class);
		if (jsonData != null) {
			CNPaymentDetailsDto cnPaymentDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
					CNPaymentDetailsDto.class);
			if (cnPaymentDetailsDto.getPaymentCodes().containsKey(PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode())) {
				LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
				if (BooleanUtils.isNotTrue(locationCacheDto.getCnDetails().getIsGhsCnTransferAllowed())) {
					throw new ServiceException(
							"GHS CN is not allowed to transfer because configuration is not enabled in Location Master",
							"ERR-SALE-427");
				}
			}

		}
	}

	private void validateDigiGoldCNTransfer(CreditNoteDaoExt creditNoteDao, String locationcode) {
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(locationcode);
		DigigoldDetails digiGoldDetails = locationCacheDto.getDigigoldDetails();
		if (digiGoldDetails != null) {
			if (creditNoteDao.getCreditNoteType().equalsIgnoreCase(CNType.DIGI_GOLD_TANISHQ.name())
					&& BooleanUtils.isFalse(digiGoldDetails.getIsCNTransferAllowedForDigiGold())) {
				throw new ServiceException(
						"IBT Transfer is not allowed for " + creditNoteDao.getCreditNoteType() + ": CN", ERR_SALE_195,
						Map.of("creditNoteType", creditNoteDao.getCreditNoteType()));
			}
			if (creditNoteDao.getCreditNoteType().equalsIgnoreCase(CNType.DIGI_GOLD_NON_TANISHQ.name())
					&& BooleanUtils.isFalse(digiGoldDetails.getIsCNTransferAllowedForNonDigiGold())) {
				throw new ServiceException(
						"IBT Transfer is not allowed for " + creditNoteDao.getCreditNoteType() + ": CN", ERR_SALE_195,
						Map.of("creditNoteType", creditNoteDao.getCreditNoteType()));
			}
		}
	}

	private AdvanceCNRuleDetails getCNConfigurations(CreditNoteDaoExt creditNoteDao, String locationcode) {
		Object result = getConfigurartion(creditNoteDao.getCreditNoteType(), locationcode);

		AdvanceCNRuleDetails advUtil = MapperUtil.getObjectMapperInstance().convertValue(result,
				AdvanceCNRuleDetails.class);

		String string = MapperUtil.getStringFromJson(result);
		try {
			JsonNode dataNode = MapperUtil.getObjectMapperInstance().readTree(string);
			if (!dataNode.isMissingNode()) {
				advUtil.setGHSMaxAmountTransfer(dataNode.path("gHSMaxAmountTransfer").asText());
				advUtil.setGHSUtilizationTransferPercent(dataNode.path("gHSUtilizationTransferPercent").asText());
				;
			}
		} catch (IOException e) {
			throw new ServiceException("UNABLE TO PARSE JSON", ERR_CORE_003);
		}

		return advUtil;
	}

	private WorkflowBaseResponse requestCNTransfer(String id, RequestWorkflowCNDto requestDto, String cNWrokflowType) {
		if (requestDto.getApproverLocationCode().equals(CommonUtil.getLocationCode())) {
			throw new ServiceException("Cannot transfer cn for same/own location", "ERR-SALE-222");
		}

		WorkflowBaseResponse workflowBaseReponse;
		CreditNoteDaoExt creditnote = new CreditNoteDaoExt();
		Map<String, String> requestParams = null;
		// -internally calls eposs api to get cn
		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.GET,
				SalesUtil.CREDITNOTE_EPOSS_URL + "/" + id + "/ibt",
				Map.of(SalesUtil.SRC_BTQ_LOCATION, requestDto.getApproverLocationCode()), null);

		CreditNoteEpossDto creditNoteDto = MapperUtil.getObjectMapperInstance()
				.convertValue(epossApiResponseDto.getResponse(), CreditNoteEpossDto.class);

		creditnote = (CreditNoteDaoExt) MapperUtil.getObjectMapping(creditNoteDto, creditnote);
		if (creditNoteDto == null) {
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND_IN_EPOSS, ERR_SALE_169);
		}
		CreditNoteTransferDao creditNoteTransfer = creditNoteDto.getCreditNoteTransfer();

		// cancel transfer cn when payement type is employee loan
		checkLocationForTransfer(creditnote.getPaymentDetails());

		cNValidationConfigCheck(cNWrokflowType, creditnote, requestDto.getApproverLocationCode(), null);
		// check if request is raised already
		validateCreditNoteWithWorkFlowType(creditnote, cNWrokflowType, creditNoteTransfer);
		// -call workflow api for request
		WorkflowProcessCreateResponseDto workflowProcessCreateResponseDto = callWorkflowForCreateProcess(requestDto,
				cNWrokflowType, creditnote, requestDto.getApproverLocationCode());

		// api call to update processId in EPOSS DB
		// this call is needed as i cannot pass dao in request to update api.

		// -call update api and set processID, status to eposs db
		// patch api to update CN (may not be needed.)
		requestParams = Map.of(SalesUtil.SRC_BTQ_LOCATION, String.valueOf(requestDto.getApproverLocationCode()),
				SalesUtil.CREDIT_NOTE_WORKFLOW_TYPE, String.valueOf(cNWrokflowType), SalesUtil.PROCESS_ID,
				String.valueOf(workflowProcessCreateResponseDto.getProcessId()));

		epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.PATCH,
				SalesUtil.CREDITNOTE_EPOSS_URL + "/" + id + "/ibt", requestParams, null);
		checkResponseStatus(epossApiResponseDto);
		// -call eposs api to push CN to cntransfer with pending status.

		// call cn/ibt eposs api to make entry in cn_transfer with "PENDING"
		// call integration eposs transferAPI
		Map<String, String> requestParam = Map.of(SalesUtil.CREDIT_NOTE_WORKFLOW_TYPE, cNWrokflowType,
				SalesUtil.SRC_BTQ_LOCATION, String.valueOf(requestDto.getApproverLocationCode()));

		salesIntegrationServiceImpl.callIntegration(HttpMethod.POST, SalesUtil.CREDITNOTE_EPOSS_URL + "/" + id + "/ibt",
				requestParam, null);

		if (requestDto.getTempFileIds() != null) {

			log.debug("converting temp file to permanent files");

			String newId;
			for (Map.Entry<String, List<String>> entry : requestDto.getTempFileIds().entrySet()) {
				for (String tempId : entry.getValue()) {
					newId = fileService.updateTempFile(workflowProcessCreateResponseDto.getProcessId(),
							customerService.getCustomerByIdAndLocation(creditNoteDto.getCustomerId(),
									requestDto.getApproverLocationCode()),
							UploadFileDocTypeEnum.CN_WORKFLOW.name(), entry.getKey(), tempId);
					log.debug("Updated temp file to permanent one. tempId: {}, Id: {}", entry.getValue(), newId);
				}
			}
		}

		workflowBaseReponse = new WorkflowBaseResponse(String.valueOf(workflowProcessCreateResponseDto.getDocNo()));
		return workflowBaseReponse;
	}

	private void checkResponseStatus(ApiResponseDto epossApiResponseDto) {
		if (epossApiResponseDto.getHttpResponseCode() != HttpStatus.OK.value()) {
			throw new ServiceException(
					"API didn't send 200 Response, Received status:" + epossApiResponseDto.getHttpResponseCode(),
					CALL_TO_EPOSS_FAILED);
		}
	}

	private WorkflowProcessCreateResponseDto callWorkflowForCreateProcess(RequestWorkflowCNDto requestDto,
			String cNWrokflowType, CreditNoteDaoExt creditNoteDao, String locationCode) {
		CustomerLocationMappingDao customerLocation = getCustomerLocation(creditNoteDao, locationCode);
		CustomerDao customer = getCustomerDetails(customerLocation);
		CreditNoteHeaderDto creditNoteHeaderDto = createCreditNoteHeaderDto(creditNoteDao, requestDto, cNWrokflowType,
				customer);
		// filter values
		Map<String, String> filterValues = Map.of(SalesConstants.DOC_NO, String.valueOf(creditNoteHeaderDto.getDocNo()),
				SalesUtil.FISCAL_YEAR, String.valueOf(creditNoteHeaderDto.getFiscalYear()), "locationCode",
				locationCode, SalesUtil.CREDIT_NOTE_TYPE, creditNoteHeaderDto.getCreditNoteType());

		// workFlowType CREDIT_NOTE_ACTIVATION
		WorkflowProcessCreateDto workflowProcessCreateDto = new WorkflowProcessCreateDto();
		workflowProcessCreateDto.setRequestorRemarks(requestDto.getRemarks());
		workflowProcessCreateDto.setHeaderData(new JsonData(cNWrokflowType + "_HEADER", creditNoteHeaderDto));
		workflowProcessCreateDto.setRequestData(new JsonData(cNWrokflowType + "_DETAILS", null));
		workflowProcessCreateDto.setFilterValues(filterValues);

		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, cNWrokflowType);
		// calling eposs integration service
		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.POST,
				SalesUtil.WORKFLOW_PROCESS_URL, reqParams, workflowProcessCreateDto);

		return MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
				WorkflowProcessCreateResponseDto.class);

	}

	/**
	 * @param requestDto
	 * @param cNWrokflowType
	 */
	private void validateRequestForFrozenRate(CreditNoteDaoExt creditnote, String cNWrokflowType) {
		if (CNWorkFlowType.CREDIT_NOTE_GOLD_RATE_REMOVE.toString().equals(cNWrokflowType)
				&& creditnote.getFrozenRateDetails() == null) {
			throw new ServiceException("for rate removal, frozen details are mandatory", ERR_SALE_175);
		}

	}

	/**
	 * @param creditNoteDao
	 * @param cNWrokflowType
	 * @return
	 */
	private void updateRequestCNWorkflowStatus(CreditNoteDaoExt creditNoteDao, String cNWrokflowType) {
		if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_ACTIVATE.toString())) {
			creditNoteDao.setWorkflowStatus(CNWorkflowStatus.PENDING_FOR_ACTIVATE.toString());
		} else if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_CANCELLATION.toString())) {
			creditNoteDao.setWorkflowStatus(CNWorkflowStatus.PENDING_FOR_CANCEL.toString());
		} else if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_GOLD_RATE_REMOVE.toString())) {
			creditNoteDao.setWorkflowStatus(CNWorkflowStatus.PENDING_FOR_RATE_REMOVAL.toString());
		}
	}

	/**
	 * @param creditNoteDao
	 * @param cNWrokflowType
	 */
	private void validateCreditNoteWithWorkFlowType(CreditNoteDaoExt creditNoteDao, String cNWrokflowType,
			CreditNoteTransferDao creditNoteTransfer) {

		if (CNWorkflowStatus.getOnlyWorkFlowStatus().contains(creditNoteDao.getWorkflowStatus())) {
			if (creditNoteTransfer == null) {
				throw new ServiceException(CN_ALREADY_SENT_FOR_APPROVAL, ERR_SALE_158,
						Map.of(SalesConstants.DOC_NO, creditNoteDao.getDocNo().toString()));
			}

			Map<String, String> errorMap = new HashMap<>();
			errorMap.put("docNo", creditNoteDao.getDocNo().toString());
			errorMap.put("srcBtq", creditNoteTransfer.getSrcLocationCode());
			errorMap.put("destBtq", creditNoteTransfer.getDestLocationCode());
			throw new ServiceException(
					"The Credit Note number {docNo} transfer request is already raised by btq {srcBtq} to btq {destBtq}",
					"ERR-SALE-396", errorMap);
		}

		if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_ACTIVATE.toString())) {
			if (!CNStatus.SUSPENDED.toString().equals(creditNoteDao.getStatus())) {
				throw new ServiceException(CREDIT_NOTE_WORKFLOW_VALIDATION_ERROR_1, ERR_SALE_156);
			}
		} else if ((!cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_ACTIVATE.toString()))
				&& (!CNStatus.OPEN.toString().equals(creditNoteDao.getStatus()))) {
			// for workflow type-- cn cancellation, grf, transfer cn should be in open
			// status
			// other than activate cn's, all should be come as open status
			throw new ServiceException(SalesConstants.CREDIT_NOTE_DYNAMIC_NUMBER_SHOULD_BE_IN_OPEN_STATUS,
					SalesConstants.ERR_SALE_157, Map.of(SalesConstants.DOC_NO, creditNoteDao.getDocNo().toString()));

		}
		// will be moved to specific if of transfer only AB should not be transfered.
		if (creditNoteDao.getLinkedTxn() != null
				&& (creditNoteDao.getLinkedTxn().getTxnType().equals(TransactionTypeEnum.AB.toString()))) {

			throw new ServiceException("Credit note cannot be transferd as it is liked with Txn", "ERR-SALE-176");
		}

		// if CN is for eGHS payment, then should not be used.
		if (CNWorkFlowType.CREDIT_NOTE_TRANSFER.toString().equals(cNWrokflowType)
				&& !StringUtil.isBlankJsonStr(creditNoteDao.getEghsDetails())) {
			JsonData jsonData = MapperUtil.mapObjToClass(creditNoteDao.getEghsDetails(), JsonData.class);
			EghsCNDetails eghsCNDetails = MapperUtil.mapObjToClass(jsonData.getData(), EghsCNDetails.class);
			if (eghsCNDetails != null && BooleanUtils.isTrue(eghsCNDetails.getIsPaymentForEGHS())) {
				throw new ServiceException(SalesConstants.CREDIT_NOTE_IS_GENERATED_FOR_EGHS,
						SalesConstants.ERR_SALE_233,
						"Credit note is generated for EGHS. Cannot be used as payment in current transaction.");
			}
		}

	}

	private CreditNoteHeaderDto createCreditNoteHeaderDto(CreditNoteDaoExt creditNoteDao,
			RequestWorkflowCNDto requestDto, String cNWrokflowType, CustomerDao customer) {

		// header data
		CreditNoteHeaderDto creditNoteHeaderDto = (CreditNoteHeaderDto) MapperUtil.getObjectMapping(creditNoteDao,
				new CreditNoteHeaderDto());

		if (creditNoteDao.getSalesTxn() == null) {
			creditNoteHeaderDto.setSalesTxnId(null);
		} else {
			creditNoteHeaderDto.setSalesTxnId(creditNoteDao.getSalesTxn().getId());
		}
		if (creditNoteDao.getLinkedTxn() == null) {
			creditNoteHeaderDto.setLinkedTxnId(null);
		} else {
			creditNoteHeaderDto.setLinkedTxnId(creditNoteDao.getLinkedTxn().getId());
		}
		if (creditNoteDao.getCancelTxn() == null) {
			creditNoteHeaderDto.setCancelTxnId(null);
		} else {
			creditNoteHeaderDto.setCancelTxnId(creditNoteDao.getCancelTxn().getId());
		}
		if (creditNoteDao.getParentCn() == null) {
			creditNoteHeaderDto.setParentCnId(null);
		} else {
			creditNoteHeaderDto.setParentCnId(creditNoteDao.getParentCn().getId());
		}
		if (creditNoteDao.getOriginalCn() == null) {
			creditNoteHeaderDto.setOriginalCnId(null);
		} else {
			creditNoteHeaderDto.setOriginalCnId(creditNoteDao.getOriginalCn().getId());
		}
		creditNoteHeaderDto
				.setCustomerName(CryptoUtil.decrypt(customer.getCustomerName(), SalesConstants.CUSTOMER_NAME, false));
		creditNoteHeaderDto
				.setMobileNumber(CryptoUtil.decrypt(customer.getMobileNumber(), SalesConstants.MOBILE_NO, false));
		creditNoteHeaderDto.setActivationDetails(creditNoteDao.getActivationDetails());

		creditNoteHeaderDto.setApproverLocationCode(requestDto.getApproverLocationCode());
		if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_TRANSFER.toString()))
			creditNoteHeaderDto.setFrozenRateDetails(creditNoteDao.getFrozenRateDetails());

		// set source customer Id
		Integer destCustomerId = customerService.getCustomerByIdAndLocation(creditNoteDao.getCustomerId(),
				creditNoteDao.getLocationCode());
		creditNoteHeaderDto.setDestCustomerId(destCustomerId);
		creditNoteHeaderDto.setRequestedDocDate(businessDayService.getBusinessDay().getBusinessDate());

		return creditNoteHeaderDto;
	}

	@Override
	@Transactional
	public CNResponeDtoExt confirmCN(String id, ConfirmRequestDto confirmRequestDto, String cNWrokflowType) {

		if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_TRANSFER.toString())) {
			throw new ServiceException("API not applicable for the followinng type use /request/ibt API",
					"ERR-SALE-177");
		}
		List<SyncData> syncDatas = new ArrayList<>();
		// validate coming status
		CreditNoteDaoExt creditNote = creditNoteService.findByIdAndLocationCode(id, CommonUtil.getLocationCode());

		if (creditNote == null) {
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
		}

		// need to hit workflow and test everytime
		validateDBWorkflowStatusBasedOnType(creditNote, cNWrokflowType);

		validateWorkflowStatus(cNWrokflowType, creditNote, WorkflowProcessStatusEnum.APPROVED.name());

		upDateStatusAndWorkflowStatus(creditNote, cNWrokflowType, confirmRequestDto, syncDatas);

		SyncStagingDto syncData = syncStaggingCreditNote(null, null, null, SalesOperationCode.CN_WORKFLOW, syncDatas);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			salesSyncDataService.publishSalesMessagesToQueue(syncData);
		closeWorkflowProcess(cNWrokflowType, creditNote.getProcessId());

		return (CNResponeDtoExt) MapperUtil.getDtoMapping(creditNote, CNResponeDtoExt.class);
	}

	private void closeWorkflowProcess(String cNWrokflowType, String processId) {
		log.info("Process id: " + processId);
		// CLOSE request
		salesIntegrationServiceImpl.callIntegration(HttpMethod.POST, SalesUtil.WORKFLOW_PROCESS_URL + "/" + processId,
				Map.of(SalesUtil.WORKFLOW_TYPE, cNWrokflowType), null);
	}

	private void validateWorkflowStatus(String cNWrokflowType, CreditNoteDaoExt creditNote, String status) {
		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = checkRequestWorkflowStatus(
				creditNote.getProcessId(), cNWrokflowType);

		if (!status.equals(workflowProcessGetResponseDto.getApprovalStatus())) {
			throw new ServiceException(REQUEST_IS_NOT_APPROVED, ERR_SALE_098, "Request status should be: " + status
					+ ", found: " + workflowProcessGetResponseDto.getApprovalStatus());
		}
	}

	/**
	 * @param creditNote
	 */
	private void validateCommonStatus(CreditNoteDaoExt creditNote) {
		// if workflowstatus field is used
		if (!(CNStatus.OPEN.toString().equals(creditNote.getStatus())
				|| CNStatus.SUSPENDED.toString().equals(creditNote.getStatus()))) {
			throw new ServiceException(CREDIT_NOTE_IS_CLOSED, ERR_SALE_160);
		}

	}

	/**
	 * @param creditNote
	 * @param cNWrokflowType
	 * @param confirmRequestDto
	 * @param syncDatas
	 */
	// should we set all workflow to null instead of approved..?
	private void upDateStatusAndWorkflowStatus(CreditNoteDaoExt creditNote, String cNWrokflowType,
			ConfirmRequestDto confirmRequestDto, List<SyncData> syncDatas) {
		if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_ACTIVATE.toString())) {
			creditNote.setWorkflowStatus(null);
			creditNote.setStatus(CNStatus.OPEN.toString());
			// default cn will be in open status only so no update
		} else if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_CANCELLATION.toString())) {
			creditNote.setWorkflowStatus(null);
			creditNote.setStatus(CNStatus.CANCELLED.toString());
			creditNote.setCancelDate(businessDayService.getBusinessDay().getBusinessDate());
			CountryDetailsDto countryDetailsDto = engineService.getCountryDetails(CommonUtil.getLocationCode());
			creditNote.setDebitNoteDocNo(salesDocService.getDocNumber(SalesDocTypeEnum.DEBIT_NOTE,countryDetailsDto.getFiscalYear().shortValue()));
			creditNote.setDebitNoteFiscalYear(countryDetailsDto.getFiscalYear());
			updateRefundDetails(creditNote, confirmRequestDto, syncDatas);
			if(confirmRequestDto.getPaymentDetails()!=null) 
			{
			CnRefundPaymentDetails paymentDetails = MapperUtil
					.mapObjToClass(confirmRequestDto.getPaymentDetails().getData(), CnRefundPaymentDetails.class);
			BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(paymentDetails.getRefundAmount());
			BigDecimal refundValue = paymentDetails.getRefundAmount().add(roundingVariance);
			creditNote.setRefundValue(refundValue);
			
			}

		} else if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_GOLD_RATE_REMOVE.toString())) {
			creditNote.setWorkflowStatus(null);
			creditNote.setFrozenRateDetails(null); // removing frozen rate details
			// default cn will be in open status only so no update
		}
		// update creditNote DAO
		creditNote.setRemarks(confirmRequestDto.getRemarks());
		creditNote.setSrcSyncId(creditNote.getSrcSyncId() + 1);
		creditNote = creditNoteService.saveCN(creditNote);

		CreditNoteSyncDtoExt creditNoteSyncDtoExt = new CreditNoteSyncDtoExt(creditNote);
		syncDatas.add(DataSyncUtil.createSyncData(creditNoteSyncDtoExt, 2));
	}

	/**
	 * @param creditNote
	 * @param confirmRequestDto
	 * @param syncDatas
	 */
	private void updateRefundDetails(CreditNoteDaoExt creditNote, ConfirmRequestDto confirmRequestDto,
			List<SyncData> syncDatas) {

		// insert to payment_refund
		// insert into customer payment with negative amount (if cash collected >0 )
		PaymentReversalDaoExt paymentReversal = new PaymentReversalDaoExt();
		if (confirmRequestDto.getPaymentDetails() != null) {
			CnRefundPaymentDetails paymentDetails = MapperUtil
					.mapObjToClass(confirmRequestDto.getPaymentDetails().getData(), CnRefundPaymentDetails.class);

			paymentReversal = (PaymentReversalDaoExt) MapperUtil.getObjectMapping(paymentDetails, paymentReversal);
			BigDecimal refundValue = paymentDetails.getRefundAmount();
			BigDecimal roundingVariannce = commonTransactionService.getRoundingVariance(refundValue);
			paymentReversal.setAmount(refundValue.add(roundingVariannce));

			paymentReversal.setReversalDate(businessDayService.getBusinessDay().getBusinessDate());
			paymentReversal.setHostName(CommonUtil.getAuthUser().getHostName());
			paymentReversal.setOtherDetails(MapperUtil.getJsonString(paymentDetails.getOtherDetails()));
			paymentReversal.setCreditNote(creditNote);
			if (paymentReversal.getPaymentCode().equals(PaymentCodeEnum.CARD.name())
					&& paymentReversal.getCreditNote() != null) {
				try {

					ObjectMapper mapper = new ObjectMapper();
					JsonNode root = mapper.readTree(paymentReversal.getOtherDetails());
					JsonNode dataNode = root.path("acquiredBank");
					if (!dataNode.isMissingNode() && !dataNode.isNull()) {
						paymentReversal.setBankName(dataNode.asText());
					}
				} catch (IOException e) {
					throw new ServiceException("UNABLE_TO_PARSE_JSON", ERR_CORE_003);
				}

			} else if ((paymentReversal.getPaymentCode().equals(PaymentCodeEnum.CHEQUE.name()))
					|| (paymentReversal.getPaymentCode().equals(PaymentCodeEnum.DD.name()))
							&& paymentReversal.getCreditNote() != null) {
					if (creditNote.getPaymentDetails() != null && !creditNote.getPaymentDetails().isEmpty() 
							&& !StringUtil.isBlankJsonStr(creditNote.getPaymentDetails().toString())) {
						try {

							ObjectMapper mapper = new ObjectMapper();
							JsonNode root = mapper.readTree(creditNote.getPaymentDetails());
							JsonNode dataNode = root.path("data");
							if (!dataNode.path("instrumentNumber").isMissingNode() && !dataNode.path("instrumentNumber").isNull()) {
								paymentReversal.setInstrumentNo(dataNode.path("instrumentNumber").asText());
							}
							if (!dataNode.path("bankName").isMissingNode() && !dataNode.path("bankName").isNull()) {
								paymentReversal.setBankName(dataNode.path("bankName").asText());
							}
							
						} catch (IOException e) {
							throw new ServiceException("UNABLE_TO_PARSE_JSON", ERR_CORE_003);
						}
					}
						if(paymentReversal.getInstrumentNo()==null ) {
							PaymentDetailsDaoExt payment =  paymentDetailsRepositoryExt.findByCreditNoteDaoId(creditNote.getId());
							if(payment!=null) {
								paymentReversal.setInstrumentNo(payment.getInstrumentNo());
								paymentReversal.setBankName(payment.getBankName());
							}
							
						}
					
					//paymentReversal.setBankName(paymentDetails.getBankName());
//					try {
//
//						ObjectMapper mapper = new ObjectMapper();
//						JsonNode root = mapper.readTree(paymentReversal.getOtherDetails());
//						JsonNode dataNode = root.path("bankName");
//						if (!dataNode.isMissingNode() && !dataNode.isNull()) {
//							paymentReversal.setBankName(dataNode.asText());
//						}
//					} catch (IOException e) {
//						throw new ServiceException("UNABLE_TO_PARSE_JSON", ERR_CORE_003);
//					}
			}
			paymentReversalRepo.save(paymentReversal);

			PaymentReversalSyncDtoExt paymentSync = new PaymentReversalSyncDtoExt(paymentReversal);
			syncDatas.add(DataSyncUtil.createSyncData(paymentSync, 0));

			Calendar cal1 = Calendar.getInstance();
			Calendar cal2 = Calendar.getInstance();
			cal1.setTime(businessDayService.getBusinessDay().getBusinessDate());
			cal2.setTime(creditNote.getOriginalDocDate());

			if (creditNote.getCashCollected() != null && creditNote.getCashCollected().compareTo(BigDecimal.ZERO) > 0
					&& cal1.get(Calendar.MONTH) == cal2.get(Calendar.MONTH)) {

				CustomerPaymentDao customerPayment = new CustomerPaymentDao();
				CustomerLocationMappingDao customerLocMappingDao = customerLocationMappingRepository
						.findByCustomerIdAndLocationCode(creditNote.getCustomerId(), CommonUtil.getLocationCode());

				if (customerLocMappingDao != null) {
					customerPayment.setId(UUID.randomUUID().toString());
					customerPayment.setCustomer(customerLocMappingDao.getCustomer());
					customerPayment.setCustomerLocationMap(customerLocMappingDao);
					customerPayment.setCustomerType(customerLocMappingDao.getCustomer().getCustomerType());
					String uniqueIdentifier1 = getCustomerUniqueIdentifier(customerLocMappingDao.getCustomer());
					String uniqueIdentifier2 = customerLocMappingDao.getCustomer().getUlpId();
					customerPayment.setCustomerIdentifier1(uniqueIdentifier1);
					customerPayment.setCustomerIdentifier2(uniqueIdentifier2);
					customerPayment.setPaymentCode(paymentReversal.getPaymentCode());
					customerPayment.setInstrumentNo(paymentReversal.getInstrumentNo());
					customerPayment.setInstrumentDate(creditNote.getOriginalDocDate());
					customerPayment.setPaidAmount(creditNote.getCashCollected());
					if (creditNote.getCashCollected() == creditNote.getAmount())
						customerPayment.setCashAmount(BigDecimal.ZERO.subtract(paymentDetails.getRefundAmount()));
					else {
						customerPayment.setCashAmount(BigDecimal.ZERO.subtract(creditNote.getCashCollected()));
					}
					customerPayment.setTxnType("CN_CANCEL");
					customerPayment.setPaymentDate(businessDayService.getBusinessDay().getBusinessDate());

					LocationCacheDto storeDetails = engineService.getStoreLocation(CommonUtil.getLocationCode());

					if (StringUtils.isEmpty(storeDetails.getStoreDetails())
							|| StringUtils.isEmpty(storeDetails.getStoreDetails().getCompanyName())) {
						throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
								SalesConstants.ERR_SALE_023,
								"Store details or 'companyName' is not present for the location "
										+ CommonUtil.getLocationCode());
					}
					customerPayment.setStoreType(storeDetails.getOwnerTypeCode());
					customerPayment.setStateCode(storeDetails.getStateCode());
					customerPayment.setCountryCode(storeDetails.getCountryCode());
					customerPayment.setCompanyName(storeDetails.getStoreDetails().getCompanyName());
					customerPayment.setLocationPanNumber(storeDetails.getTcsDetails().getLocationPanNumber());
					customerPaymentRepository.save(customerPayment);

					CustomerPaymentSyncDto customerPaymentSync = new CustomerPaymentSyncDto(customerPayment);

					syncDatas.add(DataSyncUtil.createSyncData(customerPaymentSync, 1));

				}
			}

		}

	}

	/**
	 * @param customer
	 * @return
	 */
	private String getCustomerUniqueIdentifier(CustomerDao customerDao) {
		String customerType = customerDao.getCustomerType();
		String uniqueIdentifier1 = null;

		if (CustomerTypeEnum.REGULAR.name().equals(customerType)) {
			uniqueIdentifier1 = CryptoUtil.decrypt(customerDao.getMobileNumber(), SalesConstants.MOBILE_NO);
		} else if (CustomerTypeEnum.INSTITUTIONAL.name().equals(customerType)
				&& !StringUtils.isEmpty(customerDao.getInstiTaxNo())) {
			uniqueIdentifier1 = CryptoUtil.decrypt(customerDao.getInstiTaxNo(), SalesConstants.INSTI_TAX_NO);
		} else if (CustomerTypeEnum.INTERNATIONAL.name().equals(customerType)) {
			uniqueIdentifier1 = CryptoUtil.decrypt(customerDao.getPassportId(), SalesConstants.PASSPORT_ID);
		} else if (CustomerTypeEnum.ONETIME.name().equals(customerType)) {

			if (!StringUtils.isEmpty(customerDao.getMobileNumber())
					&& (!SalesConstants.MOB_NO_TEN_NINES.equals(customerDao.getMobileNumber())
							&& !SalesConstants.MOB_NO_TEN_ZEROS.equals(customerDao.getMobileNumber()))) {
				uniqueIdentifier1 = CryptoUtil.decrypt(customerDao.getMobileNumber(), SalesConstants.MOBILE_NO);
			} else {
				uniqueIdentifier1 = String.valueOf(customerDao.getId());
			}

		}

		return uniqueIdentifier1;
	}

	/**
	 * @param creditNote
	 * @param cNWrokflowType
	 */
	private void validateDBWorkflowStatusBasedOnType(CreditNoteDaoExt creditNote, String cNWrokflowType) {

		// specific status check for the available CN's
		if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_ACTIVATE.toString())
				&& (!(CNStatus.SUSPENDED.toString().equals(creditNote.getStatus())
						&& creditNote.getWorkflowStatus().equals(CNWorkflowStatus.PENDING_FOR_ACTIVATE.toString())))) {
			throw new ServiceException("Credit note is " + creditNote.getStatus(), ERR_SALE_202,
					Map.of("status", creditNote.getStatus()));

		}

		if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_GOLD_RATE_REMOVE.toString())
				&& (!(CNStatus.OPEN.toString().equals(creditNote.getStatus()) && creditNote.getWorkflowStatus()
						.equals(CNWorkflowStatus.PENDING_FOR_RATE_REMOVAL.toString())))) {
			throw new ServiceException("Creditnote is not in pending for rate removal status", ERR_SALE_202,
					Map.of("status", creditNote.getStatus()));
		}

		if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_CANCELLATION.toString())
				&& (!(CNStatus.OPEN.toString().equals(creditNote.getStatus())
						&& creditNote.getWorkflowStatus().equals(CNWorkflowStatus.PENDING_FOR_CANCEL.toString())))) {
			throw new ServiceException("Creditnote is not in pending for cancel status", ERR_SALE_202,
					Map.of("status", creditNote.getStatus()));
		}
		if (cNWrokflowType.equals(CNWorkFlowType.CREDIT_NOTE_TRANSFER.toString())
				&& (!(CNStatus.OPEN.toString().equals(creditNote.getStatus())
						&& creditNote.getWorkflowStatus().equals(CNWorkflowStatus.PENDING_FOR_TRANSFER.toString())))) {
			throw new ServiceException("Creditnote is not in pending for transfer status", ERR_SALE_202,
					Map.of("status", creditNote.getStatus()));
		}

	}

	@Override
	public CNResponeDtoExt cancelRequest(String id, RemarksBaseDto remarksDto, String creditNoteWorkFlowType) {

		if (CNWorkFlowType.CREDIT_NOTE_TRANSFER.name().equals(creditNoteWorkFlowType)) {
			// cancellation to be done at EPOSS
			ApiResponseDto apiResponse = salesIntegrationServiceImpl.callIntegration(HttpMethod.PATCH,
					SalesUtil.CREDITNOTE_EPOSS_URL + "/" + id + "/ibt/cancel", Map.of(), null);

			return MapperUtil.mapObjToClass(apiResponse.getResponse(), CNResponeDtoExt.class);
		}

		CreditNoteDaoExt creditNote = creditNoteService.findByIdAndLocationCode(id, CommonUtil.getLocationCode());
		if (creditNote == null) {
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
		}

		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = checkRequestWorkflowStatus(
				creditNote.getProcessId(), creditNoteWorkFlowType);

		if (!WorkflowProcessStatusEnum.PENDING.name().equals(workflowProcessGetResponseDto.getApprovalStatus())) {
			throw new ServiceException("REQUEST_IS_ALREADY_PROCESSED", "ERR-SALE-106");
		}

		closeWorkflowProcess(creditNoteWorkFlowType, creditNote.getProcessId());

		creditNote.setCancelRemarks(remarksDto.getRemarks());
		// set workflow status as request_cancel
		creditNote.setWorkflowStatus(CNWorkflowStatus.REQUEST_CANCEL.toString());
		// status should retain for old status

		
		
		creditNote = creditNoteService.saveCN(creditNote);

		// update payment details...
		return (CNResponeDtoExt) MapperUtil.getDtoMapping(creditNote, CNResponeDtoExt.class);
	}

	/**
	 * @param id
	 * @param creditNoteWorkFlowType
	 */
	private void valdateEpossCNStatus(String id, String creditNoteWorkFlowType) {

		CreditNoteDaoExt creditNote = getEpossCN(id);
		validateDBWorkflowStatusBasedOnType(creditNote, creditNoteWorkFlowType);

	}

	@Override
	@Transactional
	// this api will be accessed by logged in btq (CN-boutique).
	public void updateSrcCN(String id, RemarksBaseDto remarksDto, String creditNoteWorkFlowType, String status) {
		valdateEpossCNStatus(id, creditNoteWorkFlowType);

		CreditNoteDaoExt creditNote = creditNoteService.findByIdAndLocationCode(id, CommonUtil.getLocationCode());
		// check if cn exist in src location
		if (creditNote == null) {
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
		} else if (!CNStatus.OPEN.toString().equals(creditNote.getStatus())) {
			throw new ServiceException("Creditnote is not in pending for " + creditNoteWorkFlowType, ERR_SALE_202,
					Map.of("status", creditNote.getStatus()));
		}

		String isApproved = "true";

		creditNote = getEpossCN(id);

		if (status.equals(BoutiqueApproverStatus.APPROVED.toString())) {
			
			//check cn validation
			cNValidationConfigCheck(creditNoteWorkFlowType, creditNote,CommonUtil.getLocationCode(), null);
			// check if CN is added in any transaction
			checkIfCNIsUsedAsPayment(creditNote);

			workflowCallApproveORRejectCN(remarksDto, creditNoteWorkFlowType, creditNote, isApproved);

			// this api will update the status to approved/issued in cntransfer table
			salesIntegrationServiceImpl.callIntegration(HttpMethod.PATCH,
					SalesUtil.CREDITNOTE_EPOSS_URL + "/" + creditNote.getId() + "/ibt" + "/transfer",
					Map.of(SalesUtil.CREDIT_NOTE_WORKFLOW_TYPE, creditNoteWorkFlowType, SalesUtil.SRC_BTQ_LOCATION,
							String.valueOf(CommonUtil.getLocationCode()), SalesUtil.CN_STATUS,
							CNTransferStatus.ISSUED.toString()),
					null);

			// update cn to transferred
			updateCreditNote(creditNote, CNStatus.TRANSFER_IBT.toString());
		}
		if (status.equals(BoutiqueApproverStatus.REJECTED.toString())) {
			isApproved = "false";
			// back to same status and same source.
			// CN will not get transferred It will be there in source boutique only
			workflowCallApproveORRejectCN(remarksDto, creditNoteWorkFlowType, creditNote, isApproved);
			// delete or update the cn transfer record which is in pending status
			// this api will update the status to approved/issued in cntransfer table
			salesIntegrationServiceImpl.callIntegration(HttpMethod.PATCH,
					SalesUtil.CREDITNOTE_EPOSS_URL + "/" + creditNote.getId() + "/ibt" + "/transfer",
					Map.of(SalesUtil.CREDIT_NOTE_WORKFLOW_TYPE, creditNoteWorkFlowType, SalesUtil.SRC_BTQ_LOCATION,
							String.valueOf(CommonUtil.getLocationCode()), SalesUtil.CN_STATUS,
							CNTransferStatus.REJECTED.toString()),
					null);

			creditNote.setStatus(CNStatus.OPEN.toString());
			creditNote.setWorkflowStatus(null);
			creditNote.setProcessId(null);

		}
	}

	private CreditNoteDaoExt getEpossCN(String id) {
		CreditNoteDaoExt creditNote = new CreditNoteDaoExt();
		// -internally calls eposs api to get cn
		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.GET,
				SalesUtil.CREDITNOTE_EPOSS_URL + "/" + id + "/ibt",
				Map.of(SalesUtil.SRC_BTQ_LOCATION, CommonUtil.getLocationCode()), null);

		CreditNoteEpossDto creditNoteDto = MapperUtil.getObjectMapperInstance()
				.convertValue(epossApiResponseDto.getResponse(), CreditNoteEpossDto.class);
		log.info("full dto --------------------------{}",creditNoteDto);	
		log.info("original CN----------{}",creditNoteDto.getOriginalCn());
		log.info("original parent id -----------{}",creditNoteDto.getParentCn());		
		creditNote = (CreditNoteDaoExt) MapperUtil.getObjectMapping(creditNoteDto, creditNote);
		if (creditNoteDto == null) {
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND_IN_EPOSS, ERR_SALE_169);
		}
		return creditNote;
	}

	private void workflowCallApproveORRejectCN(RemarksBaseDto remarksDto, String creditNoteWorkFlowType,
			CreditNoteDaoExt creditNote, String isApproved) {

		validateCommonStatus(creditNote);

		// check if it is pending status in db
		validateDBWorkflowStatusBasedOnType(creditNote, creditNoteWorkFlowType);

		// call workflow api to get taskID.
		WorkflowTaskListDto workflowTaskListDto = callWorkflowListTaskService(creditNote, creditNoteWorkFlowType,
				WorkflowProcessStatusEnum.PENDING.toString());

		// call workflow api to Approve
		callWorkflowTaskServiceToApprove(creditNote, creditNoteWorkFlowType, remarksDto.getRemarks(),
				workflowTaskListDto.getTaskId(), isApproved);
		if (isApproved.equals("true")) {
			creditNote.setIbtLocation(workflowTaskListDto.getLocationCode());
		}
	}

	private WorkflowTaskListDto callWorkflowListTaskService(CreditNoteDaoExt creditNote, String creditNoteWorkFlowType,
			String status) {

		GETTaskListDTO workflowTaskRequest = new GETTaskListDTO();
		workflowTaskRequest.setDateRangeType(DateEnum.LAST_MONTH.toString());
		Map<String, String> filterMap = Map.of(SalesConstants.DOC_NO, String.valueOf(creditNote.getDocNo()),
				"locationCode", CommonUtil.getLocationCode(), SalesUtil.CREDIT_NOTE_TYPE,
				creditNote.getCreditNoteType());
		workflowTaskRequest.setFilterParams(filterMap);

		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, String.valueOf(creditNoteWorkFlowType),
				SalesUtil.WORKFLOW_APPROVAL_STATUS, String.valueOf(status));

		ApiResponseDto apiResponseDto = callWorkflowTaskService(workflowTaskRequest, SalesUtil.WORKFLOW_TASK_URL,
				HttpMethod.POST, reqParams);

		String jsonResponse = MapperUtil.getJsonString(apiResponseDto);

		ObjectMapper mapper = new ObjectMapper();
		JsonNode root;
		try {
			root = mapper.readTree(jsonResponse);
			JsonNode dataNode1 = root.path("response");
			JsonNode dataNode = dataNode1.path("results");

			ObjectReader reader = mapper.readerFor(new TypeReference<List<WorkflowTaskListDto>>() {
			});
			List<WorkflowTaskListDto> list = reader.readValue(dataNode);
			if (list.isEmpty()) {
				throw new ServiceException("No tasks available in Workflow-service", "ERR-SALE-239");
			}

			return list.get(0);
		} catch (IOException e) {
			throw new ServiceException("Error while parsing", ERR_CORE_003);
		}

	}

	private WorkflowTaskDetailsDto callWorkflowTaskServiceToApprove(CreditNoteDaoExt creditNote,
			String creditNoteWorkFlowType, String remarks, String taskId, String isApproved) {
		WorkflowTaskApproveDto workflowApproveTaskRequest = new WorkflowTaskApproveDto();

		workflowApproveTaskRequest.setApprovedData(null);
		workflowApproveTaskRequest.setApproverRemarks(remarks);

		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, String.valueOf(creditNoteWorkFlowType),
				SalesUtil.IS_APPROVING, isApproved, SalesUtil.PROCESS_ID, String.valueOf(creditNote.getProcessId()),
				SalesUtil.TASK_ID, String.valueOf(taskId), SalesUtil.TASK_NAME,
				String.valueOf(SalesUtil.REQUEST_APPROVER_L1));

		// calling eposs integration service
		ApiResponseDto epossApiResponseDto = callWorkflowTaskService(workflowApproveTaskRequest,
				SalesUtil.WORKFLOW_TASK_URL + "/" + "approval", HttpMethod.PUT, reqParams);

		return MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
				WorkflowTaskDetailsDto.class);

	}

	/**
	 * @param workflowTaskRequest
	 * 
	 */
	private ApiResponseDto callWorkflowTaskService(Object workflowTaskRequest, String relativeUrl,
			HttpMethod httpMethod, Map<String, String> reqParams) {

		return salesIntegrationServiceImpl.callIntegration(httpMethod, relativeUrl, reqParams, workflowTaskRequest);

	}

	/**
	 * @param creditNote to cancel current credit note before doing cn transfer
	 */
	private void updateCreditNote(CreditNoteDaoExt creditNote, String status) {
		creditNote.setWorkflowStatus(CNWorkflowStatus.APPROVED.toString());
		creditNote.setStatus(status);

		creditNoteService.saveCN(creditNote);

	}

	@Override
	@Transactional
	// this api will be accessed by destination btq.
	public PublishResponse updateDestCNTransactional(String srcCNId, RemarksBaseDto remarksDto,
			String creditNoteWorkFlowType) {
		CNResponeDtoExt cnResponse;

		// call EPOSS api to update the status to received

		// call integration eposs receiveCN API, to do cn transfer to btq from eposs.
		// w.r.t srcCNID, destLocationCode(logged in user ).
		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.GET,
				SalesUtil.CREDITNOTE_EPOSS_URL + "/" + srcCNId + "/ibt/transfer",
				Map.of(SalesUtil.DEST_BTQ_LOCATION, String.valueOf(CommonUtil.getLocationCode())), null);

		ObjectMapper mapper = MapperUtil.getObjectMapperInstance();
		CreditNoteTransferDto cnTransferDto = mapper.convertValue(epossApiResponseDto.getResponse(),
				CreditNoteTransferDto.class);

		// get sales txn
		SalesTxnDao salesTxn = getSalesTxn(mapper, cnTransferDto);
		// checkSalexTxn if exist
		// else
		// saveoriginalCN
		// get customer txn
//		if (salesTxn != null) {
//			salesTxn = salesTxnRepository.save(salesTxn);
//			CustomerTxnDao customertxn = getCustomerTxn(mapper, cnTransferDto);
//
//			customertxn.setSalesTxnDao(salesTxn);
//			customerTxnRepo.save(customertxn);
//		}
		// is customerTxn saved? is salesTxn saved?

		// get linkedtxn
		CreditNoteDao creditNote = new CreditNoteDao();

		creditNote = getUpdatedCn(creditNote, mapper, cnTransferDto);
		// cancel transfer cn when payement type is employee loan
		checkLocationForTransfer(creditNote.getPaymentDetails());

		Integer srcCustomerId = creditNote.getCustomerId();
		log.info("Src customer id: " + srcCustomerId);

		// Get destination customer id
		Integer customerId = customerService.getCustomerByIdAndLocation(srcCustomerId,
				cnTransferDto.getSrcLocationCode());
		log.info("dest customer id: " + customerId);
		creditNote.setCustomerId(null);// clear out src customer id

		// get parentcn
		CreditNoteDao parentCN = getParentCn(mapper, cnTransferDto);

		// get original cn
		CreditNoteDao originalCN = getOriginalCn(mapper, cnTransferDto);
		// checkOriginalCn if exist
		// else
		// saveoriginalCN

		// checkParentCn if exist
		// else
		// saveparentCn

		if (salesTxn != null) {
		creditNote.setSalesTxn(salesTxn);
		}
//		if (parentCN != null) {
//			if (parentCN.getId().equals(creditNote.getId())) {
//				creditNote.setParentCn(creditNote);
//			} else {
//				parentCN = creditNoteService.saveCNDaoWithOutLocationChange(creditNote);
//				creditNote.setParentCn(parentCN);
//			}
//		}
//		if (originalCN != null) {
//			if (originalCN.getId().equals(creditNote.getId())) {
//				creditNote.setOriginalCn(creditNote);
//			} else {
//				originalCN = creditNoteService.saveCNDaoWithOutLocationChange(originalCN);
//				creditNote.setOriginalCn(originalCN);
//			}
//		}
		if(originalCN!=null && !creditNote.getId().equalsIgnoreCase(originalCN.getId())) {
			creditNote.setRefundValue(BigDecimal.ZERO);
			}
		creditNote.setLinkedTxn(null);

		// get GEP config details
		GepConfigDetailsDao gepConfigDetailsDao = getGepConfigDetails(mapper, cnTransferDto);
		if (gepConfigDetailsDao != null) {
			Optional<GepConfigDetailsDao> gepConfigOptional = gepConfigDetailsRepository
					.findById(gepConfigDetailsDao.getId());
			// if config not present then save
			if (!gepConfigOptional.isPresent()) {
				gepConfigDetailsDao = gepConfigDetailsRepository.save(gepConfigDetailsDao);
			} else {
				gepConfigDetailsDao = gepConfigOptional.get();
			}
			// set config to CN
			creditNote.setGepConfigDetailsDao(gepConfigDetailsDao);
		}

		AccountDetailsDao accountDetailsDao = getAccountDetails(mapper, cnTransferDto);
		if (accountDetailsDao != null) {
			Optional<AccountDetailsDao> accountDetailsOptional = accountDetailsRepository
					.findById(accountDetailsDao.getId());
			if (!accountDetailsOptional.isPresent()) {
				accountDetailsDao = accountDetailsRepository.save(accountDetailsDao);
			} else {
				accountDetailsDao = accountDetailsOptional.get();
			}
			creditNote.setAccountDetailsDao(accountDetailsDao);
		}

		String processId = creditNote.getProcessId();
		
		// create a new creditNote
		CreditNoteDao newCreditNote = null;
		newCreditNote = (CreditNoteDao) MapperUtil.getDtoMapping(creditNote, CreditNoteDao.class);
		// generate uuid for new creditNote
		newCreditNote.setId(UUID.randomUUID().toString());
		// generate doc no.
		// overriding the docnumbers of src location
		newCreditNote = creditNoteService.generateCNDetailForDao(newCreditNote, SalesDocTypeEnum.CN);
		newCreditNote.setStatus(CNStatus.OPEN.toString());
		newCreditNote.setCnTransferId(null);
		newCreditNote.setCustomerId(customerId);
		// save cn
		newCreditNote.setWorkflowStatus(null);
		newCreditNote.setParentCn(newCreditNote);
		newCreditNote.setOriginalCn(newCreditNote);
		newCreditNote.setProcessId(null);
		newCreditNote.setRefDocNo(cnTransferDto.getDocNo());
		newCreditNote.setRefDocType(SalesDocTypeEnum.CN_IBT.toString());
		newCreditNote.setRefFiscalYear(cnTransferDto.getFiscalYear());
		// save original and parent cn first?
		newCreditNote.setSrcSyncId(0);
		newCreditNote.setDestSyncId(0);
		
		newCreditNote = creditNoteService.saveCNDao(newCreditNote);

		// save this cn number to cn transfer of eposs for destination location.

		// update the eposs transfer table
		salesIntegrationServiceImpl.callIntegration(HttpMethod.PUT,
				SalesUtil.CREDITNOTE_EPOSS_URL + "/" + srcCNId + "/ibt/transfer",
				Map.of(SalesUtil.CN_STATUS, CNTransferStatus.RECEIVED.toString(), SalesUtil.CREDIT_NOTE_WORKFLOW_TYPE,
						creditNoteWorkFlowType, SalesUtil.DEST_BTQ_LOCATION,
						String.valueOf(CommonUtil.getLocationCode()),SalesUtil.DEST_CN_ID,newCreditNote.getId()),null);

		// close workflow process.
		closeWorkflowProcess(creditNoteWorkFlowType, processId);

		cnResponse = (CNResponeDtoExt) MapperUtil.getDtoMapping(newCreditNote, CNResponeDtoExt.class);
		SyncStagingDto syncDto = null;
		PublishResponse response = new PublishResponse();
		List<SyncData> syncDatas = new ArrayList<>();
		CreditNoteSyncDtoExt creditNoteSyncDtoExt = new CreditNoteSyncDtoExt(newCreditNote);
		syncDatas.add(DataSyncUtil.createSyncData(creditNoteSyncDtoExt, 2));
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			syncDto = syncStaggingCreditNote(null, null, null, SalesOperationCode.CN_WORKFLOW, syncDatas);
		response.setApiResponse(cnResponse);
		response.setSyncStagingDto(syncDto);
		return response;
//		CNResponeDtoExt apiResponse = (CNResponeDtoExt) MapperUtil.getDtoMapping(newCreditNote, CNResponeDtoExt.class);
//		SyncStagingDto syncDto = null;
//		PublishResponse response = new PublishResponse();
//
//		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
//			syncDto = syncStaggingCreditNote(newCreditNote, null, null,SalesOperationCode.CN_WORKFLOW, null);
//		response.setSyncStagingDto(syncDto);
//		response.setApiResponse(apiResponse);
//		return response;
	}

	private void checkLocationForTransfer(String paymentDetails) {
		JsonData jsonData = MapperUtil.mapObjToClass(paymentDetails, JsonData.class);
		if (jsonData != null) {
			CNPaymentDetailsDto cnPaymentDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
					CNPaymentDetailsDto.class);
			if (cnPaymentDetailsDto.getPaymentCodes().containsKey(PaymentCodeEnum.EMPLOYEE_LOAN.getPaymentcode())) {
				LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
				if (BooleanUtils.isNotTrue(locationCacheDto.getCnDetails().getIsEmployeeLoanCNTransfer())) {
					throw new ServiceException(" Employee loan CN transfer is not  allowed", "ERR-SALE-424");
				}

			}
		}
	}

	/**
	 * @param creditNote
	 * @param cnTransferDto
	 * @return
	 */
	private CreditNoteDao getUpdatedCn(CreditNoteDao creditNote, ObjectMapper mapper,
			CreditNoteTransferDto cnTransferDto) {

		try {
			JsonNode salesTnx = mapper.readTree(cnTransferDto.getCnDetails());
			// set cn values...
			return getCreditNote(creditNote, salesTnx);

		} catch (IOException e) {
			throw new ServiceException(ERROR_IN_PARSNG_JSON, ERR_CORE_003);
		}

	}

	/**
	 * @param creditNote
	 * @param salesTnx
	 * @return
	 */
	private CreditNoteDao getCreditNote(CreditNoteDao creditNote, JsonNode creditNoteJson) {

		creditNote.setAmount(bigDecimalNull(stringNullCheck(creditNoteJson, "amount")));
		creditNote.setCancelRemarks(stringNullCheck(creditNoteJson, "remarks"));
		creditNote.setCashCollected(bigDecimalNull(stringNullCheck(creditNoteJson, "cashCollected")));
		creditNote.setCnTransferId(stringNullCheck(creditNoteJson, "cnTransferId"));
		creditNote.setCreditNoteType(stringNullCheck(creditNoteJson, SalesUtil.CREDIT_NOTE_TYPE));
		creditNote.setDestSyncId(creditNoteJson.path("destSyncId").asInt());
		creditNote.setEghsDetails(stringNullCheck(creditNoteJson, "eghsDetails"));
		creditNote.setProcessId(stringNullCheck(creditNoteJson, "processId"));
		creditNote.setFrozenRateDetails(stringNullCheck(creditNoteJson, "frozenRateDetails"));
		creditNote.setGepDetails(stringNullCheck(creditNoteJson, "gepDetails"));
		creditNote.setGrnDetails(stringNullCheck(creditNoteJson, "grnDetails"));
		creditNote.setId(stringNullCheck(creditNoteJson, "id"));
		creditNote.setPaymentDetails(stringNullCheck(creditNoteJson, "paymentDetails"));
		creditNote.setPrints(creditNoteJson.path("prints").asInt());
		creditNote.setRemarks(stringNullCheck(creditNoteJson, "remarks"));
		creditNote.setSrcSyncId(creditNoteJson.path("srcSyncId").asInt());
		creditNote.setStatus(stringNullCheck(creditNoteJson, "status"));
		creditNote.setTaxDetails(stringNullCheck(creditNoteJson, "taxDetails"));
		creditNote.setTepDetails(stringNullCheck(creditNoteJson, "tepDetails"));
		creditNote.setTotalTax(bigDecimalNull(stringNullCheck(creditNoteJson, "totalTax")));
		creditNote.setUtilisedAmount(bigDecimalNull(stringNullCheck(creditNoteJson, "utilisedAmount")));
		creditNote.setCreatedBy(stringNullCheck(creditNoteJson, "createdBy"));
		creditNote.setCreatedDate(dateNullCheck(creditNoteJson, "createdDate"));
		creditNote.setDiscountDetails(stringNullCheck(creditNoteJson, "discountDetails"));
		creditNote.setIsTransferEghsAllowed(booleanNullCheck(creditNoteJson, "isTransferEghsAllowed"));
		creditNote.setOriginalDocDate(originalDocDateNullCheck(creditNoteJson, "originalDocDate"));
		creditNote.setRefundValue(bigDecimalNull(stringNullCheck(creditNoteJson, "refundValue")));
		creditNote.setRefundDeduction(bigDecimalNull(stringNullCheck(creditNoteJson, "refundDeduction")));		;
		creditNote.setWorkflowStatus(null);

		// src customer id
		creditNote.setCustomerId(creditNoteJson.path("customerId").asInt());

		return creditNote;
	}

	private String stringNullCheck(JsonNode creditNoteJson, String field) {
		if (creditNoteJson.hasNonNull(field)) {
			return creditNoteJson.path(field).asText();
		} else {
			return null;
		}
	}

	private BigDecimal bigDecimalNull(String stringValue) {
		if (stringValue == null) {
			return BigDecimal.ZERO;
		} else {
			return new BigDecimal(stringValue);
		}

	}

	private Date dateNullCheck(JsonNode creditNoteJson, String field) {
		if (creditNoteJson.hasNonNull(field)) {
			return CalendarUtils.getCurrentDate();
		} else {

			return JsonUtils.getValueFromJson(creditNoteJson, field, Date.class);
		}

	}

	private Date originalDocDateNullCheck(JsonNode creditNoteJson, String field) {
		if (creditNoteJson.hasNonNull(field)) {

			return JsonUtils.getValueFromJson(creditNoteJson, field, Date.class);
		} else {

			return CalendarUtils.getCurrentDate();
		}

	}

	private Boolean booleanNullCheck(JsonNode creditNoteJson, String field) {
		if (creditNoteJson.hasNonNull(field)) {
			return Boolean.TRUE;
		} else {

			return JsonUtils.getValueFromJson(creditNoteJson, field, Boolean.class);
		}

	}

	/**
	 * @param mapper
	 * @param cnTransferDto
	 * @return
	 */
	private CreditNoteDao getOriginalCn(ObjectMapper mapper, CreditNoteTransferDto cnTransferDto) {

		CreditNoteDao creditNote = new CreditNoteDao();

		try {
			JsonNode root = mapper.readTree(cnTransferDto.getCnDetails());
			JsonNode salesTnx = root.path("originalCn");

			if (salesTnx.textValue().equals("null")) {
				return null;
			}
			creditNote = MapperUtil.mapObjToClass(salesTnx.textValue(), CreditNoteDao.class);
			return creditNote;

		} catch (IOException e) {
			throw new ServiceException(ERROR_IN_PARSNG_JSON, ERR_CORE_003);
		}

	}

	/**
	 * @param mapper
	 * @param cnTransferDto
	 * @return
	 */
	private CreditNoteDao getParentCn(ObjectMapper mapper, CreditNoteTransferDto cnTransferDto) {

		CreditNoteDao creditNote = new CreditNoteDao();

		try {
			JsonNode root = mapper.readTree(cnTransferDto.getCnDetails());
			JsonNode salesTnx = root.path("parentCn");

			if (salesTnx.textValue().equals("null")) {
				return null;
			}

			creditNote = MapperUtil.mapObjToClass(salesTnx.textValue(), CreditNoteDao.class);
			return creditNote;

		} catch (IOException e) {
			throw new ServiceException(ERROR_IN_PARSNG_JSON, ERR_CORE_003);
		}

	}

	/**
	 * @param cnTransferDto
	 * @return
	 */
	private CustomerTxnDao getCustomerTxn(ObjectMapper mapper, CreditNoteTransferDto cnTransferDto) {

		CustomerTxnDao txnDao = new CustomerTxnDao();

		try {
			JsonNode root = mapper.readTree(cnTransferDto.getCnDetails());
			JsonNode customerTxn = root.path("customerTxn");
			txnDao = MapperUtil.getObjectMapperInstance().convertValue(customerTxn, CustomerTxnDao.class);
			return txnDao;

		} catch (IOException e) {
			throw new ServiceException("Error while parsing Json to DAO", ERR_CORE_003);
		}

	}

	/**
	 * @param cnTransferDto
	 * @return
	 */
	private SalesTxnDao getSalesTxn(ObjectMapper mapper, CreditNoteTransferDto cnTransferDto) {
		SalesTxnDao txnDao = new SalesTxnDao();

		try {
			JsonNode root = mapper.readTree(cnTransferDto.getCnDetails());
			JsonNode dataNode = root.path("salesTxn");

			txnDao = MapperUtil.getObjectMapperInstance().convertValue(dataNode, SalesTxnDao.class);
			return txnDao;

		} catch (IOException e) {
			throw new ServiceException("Error while parsing Json to DAO", ERR_CORE_003);
		}

	}

	private GepConfigDetailsDao getGepConfigDetails(ObjectMapper mapper, CreditNoteTransferDto cnTransferDto) {

		GepConfigDetailsDao gepConfigDetailsDao = new GepConfigDetailsDao();

		try {
			JsonNode root = mapper.readTree(cnTransferDto.getCnDetails());

			if (!root.hasNonNull("gepConfigDetailsDao")) {
				return null;
			}

			JsonNode gepConfigDetails = root.path("gepConfigDetailsDao");
			gepConfigDetailsDao = MapperUtil.getObjectMapperInstance().convertValue(gepConfigDetails,
					GepConfigDetailsDao.class);

			return gepConfigDetailsDao;

		} catch (IOException e) {
			throw new ServiceException("Error while parsing Json to DAO", ERR_CORE_003);
		}

	}

	private AccountDetailsDao getAccountDetails(ObjectMapper mapper, CreditNoteTransferDto cnTransferDto) {

		AccountDetailsDao accountDetailsDao = new AccountDetailsDao();

		try {
			JsonNode root = mapper.readTree(cnTransferDto.getCnDetails());

			if (!root.hasNonNull("accountDetailsDao")) {
				return null;
			}

			JsonNode gepConfigDetails = root.path("accountDetailsDao");
			accountDetailsDao = MapperUtil.getObjectMapperInstance().convertValue(gepConfigDetails,
					AccountDetailsDao.class);

			return accountDetailsDao;

		} catch (IOException e) {
			throw new ServiceException("Error while parsing Json to DAO", ERR_CORE_003);
		}

	}

	private WorkflowProcessGetResponseDto checkRequestWorkflowStatus(String processId, String cNWrokflowType) {
		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, cNWrokflowType);
		ApiResponseDto epossApiResponseDtoToGet = salesIntegrationServiceImpl.callIntegration(HttpMethod.GET,
				SalesUtil.WORKFLOW_PROCESS_URL + "/" + processId, reqParams, null);

		return MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDtoToGet.getResponse(),
				WorkflowProcessGetResponseDto.class);
	}

	@Override
	@Transactional
	public PublishResponse transferToEghsTransactional(String id, ConfirmEGHSRequestDto raiseRequestDto) {
		// validate w.r.t configuration max amount to transfer
		// get cn
		Boolean isPaymentForEGHS = false;
		CreditNoteDaoExt creditNote = creditNoteService.findByIdAndLocationCode(id, CommonUtil.getLocationCode());
		if (creditNote == null) {
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
		}
		if (!creditNote.getStatus().equals(CNStatus.OPEN.toString())) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_DYNAMIC_NUMBER_SHOULD_BE_IN_OPEN_STATUS,
					SalesConstants.ERR_SALE_157, Map.of(SalesConstants.DOC_NO, creditNote.getDocNo().toString()));
		}

		Object configDetails = engineClient.getCreditNote(creditNote.getCreditNoteType());
		String string = MapperUtil.getStringFromJson(configDetails);
		try {
			JsonNode dataNode = MapperUtil.getObjectMapperInstance().readTree(string);

			if (!dataNode.path("data").path("IsAllowedforEghs").asBoolean()) {

				throw new ServiceException(INVALID_REQUEST, ERR_SALE_414,
						Map.of("creditNoteType", creditNote.getCreditNoteType()));
			}
		} catch (IOException e) {
			throw new ServiceException("UNABLE TO PARSE JSON", ERR_CORE_003);
		}
		if (creditNote.getFrozenRateDetails() != null) {
			throw new ServiceException("Cannot transfer GRF CN's to EGHS", "ERR-SALE-241");
		}
		// if linked txn is present(means CN is linked to AB or CO), then transfer to
		// EGHS is not allowed.
		if (creditNote.getLinkedTxn() != null) {
			throw new ServiceException(SalesConstants.CANNOT_TRANSFER_CREDIT_NOTE_LINKED_TO_ADVANCE_BOOKING,
					SalesConstants.ERR_SALE_318,
					SalesConstants.CANNOT_TRANSFER_CREDIT_NOTE_LINKED_TO_ADVANCE_BOOKING + " - " + creditNote.getId());
		}
		// check if CN is added in any transaction
		checkIfCNIsUsedAsPayment(creditNote);

		if (Boolean.FALSE.equals(creditNote.getIsTransferEghsAllowed())) {
			throw new ServiceException("INVALID_REQUESTS", ERR_SALE_415);
		}
		if (creditNote.getEghsDetails() != null && !creditNote.getEghsDetails().isEmpty()) {

			try {

				ObjectMapper mapper = new ObjectMapper();
				JsonNode root = mapper.readTree(creditNote.getEghsDetails());
				JsonNode dataNode = root.path("data");
				if (!dataNode.isMissingNode() && dataNode.hasNonNull("isPaymentForEGHS")) {
					isPaymentForEGHS = dataNode.path("isPaymentForEGHS").asBoolean();
				}
			} catch (IOException e) {
				throw new ServiceException("UNABLE_TO_PARSE_JSON", ERR_CORE_003);
			}

		}
		if (BooleanUtils.isTrue(isPaymentForEGHS)
				&& creditNote.getAmount().compareTo(raiseRequestDto.getTransferAmount()) != 0) {
			// UAT 3420
			throw new ServiceException(SalesConstants.CREDIT_NOTE_GENERATED_FOR_EGHS_CANNOT_BE_TRANSFERRED_PARTIALLY,
					SalesConstants.ERR_SALE_440,
					"Credit note is generated for EGHS. Hence full amount of CN should be utilized.");
		}
		// call this function based on the flag of creditnote dao of eghsdetails
		// when true should not validate
		else if (BooleanUtils.isNotTrue(isPaymentForEGHS)) {
			cNValidationConfigCheck(null, creditNote, CommonUtil.getLocationCode(),
					raiseRequestDto.getTransferAmount());
		}
		JsonData jsonData = MapperUtil.mapObjToClass(creditNote.getEghsDetails(), JsonData.class);
		if (jsonData == null) {
			EghsCNDetails eghsCNDetails = new EghsCNDetails();
			JsonData json = new JsonData();
			json.setType("EGHS_DETAILS");

			eghsCNDetails.setAccountNumber(raiseRequestDto.getAccountNumber());
			json.setData(eghsCNDetails);
			String eghsDetails = MapperUtil.getStringFromJson(json);
			creditNote.setEghsDetails(eghsDetails);
			creditNoteRepo.save(creditNote);
		} else {
			EghsCNDetails eghsCNDetails = MapperUtil.mapObjToClass(jsonData.getData(), EghsCNDetails.class);
			eghsCNDetails.setAccountNumber(raiseRequestDto.getAccountNumber());
			jsonData.setData(eghsCNDetails);
			String eghsDetails = MapperUtil.getStringFromJson(jsonData);
			creditNote.setEghsDetails(eghsDetails);
			creditNoteRepo.save(creditNote);
		}

		// create new CN's
		// call cn serviceIMPL to create cn's in response getting new CreditNote for
		// eghs transfer amount
		// in a response get CN with Transfer_EGHS status
		CreditNoteEntitiesDto cnEntities = getCreditNoteEntities(creditNote.getId());
		Map<String, CreditNoteDaoExt> cnMap = creditNoteService.transferGHSCN(creditNote,
				raiseRequestDto.getTransferAmount());

		CreditNoteDaoExt newCreditNote = cnMap.get("newCreditNote");
		CreditNoteDaoExt balanceAmtCn = cnMap.get("balanceAmtCn");

		callCnTransferEGHSService(cnEntities, newCreditNote, raiseRequestDto.getRemarks(),
				raiseRequestDto.getAccountNumber());

		// update cn to transfered_ghs
		newCreditNote.setStatus(CNStatus.TRANSFER_GHS.toString());
		creditNoteService.saveCN(newCreditNote);
		CNResponeDtoExt apiResponse = (CNResponeDtoExt) MapperUtil.getDtoMapping(newCreditNote, CNResponeDtoExt.class);
		List<CreditNoteDaoExt> cnListToSync = new ArrayList<>();
		cnListToSync.add(newCreditNote);
		if (balanceAmtCn != null) {
			apiResponse.setBalanceAmtCnDocNo(balanceAmtCn.getDocNo());
			cnListToSync.add(balanceAmtCn);
			cnListToSync.add(creditNoteRepo.findById(id).get());// original CN in 'REDEEMED' status should also be
																// synced
		}

		SyncStagingDto syncDto = null;
		PublishResponse response = new PublishResponse();

		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			syncDto = syncStaggingCreditNote(null, null, cnListToSync, SalesOperationCode.CREDIT_NOTE_EGHS, null);
		response.setSyncStagingDto(syncDto);
		response.setApiResponse(apiResponse);
		return response;
	}

	@Override
	@Transactional
	public PublishResponse downloadCNfromEGHSTransactional(String id, int ghsDocNo) {
		CreditNoteDaoExt creditNote = creditNoteService.findByIdAndLocationCode(id, CommonUtil.getLocationCode());
		if (creditNote == null) {
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
		}
		creditNote = downloadAndUpdateCN(creditNote, ghsDocNo);
		CNResponeDtoExt apiResponse = new CNResponeDtoExt();
		SyncStagingDto syncDto = null;
		PublishResponse response = new PublishResponse();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			syncDto = syncStaggingCreditNote(null, creditNote, null, SalesOperationCode.CREDIT_NOTE_EGHS, null);
		response.setSyncStagingDto(syncDto);
		response.setApiResponse(apiResponse);
		return response;
	}

	private CreditNoteDaoExt downloadAndUpdateCN(CreditNoteDaoExt creditNote, int ghsDocNo) {

		callEPOSSupdateEGHSService(creditNote.getFiscalYear(), ghsDocNo);

		// download cn from eghs (update cn status back to OPEN from TRANSFER_GHS)
		creditNote.setStatus(CNStatus.OPEN.name());
		creditNote.setUtilisedAmount(BigDecimal.ZERO);

		// removed as per UAT 3422
		creditNote.setEghsDetails(null);

		return creditNoteService.saveCN(creditNote);

	}

	private GhsCreditNoteTransferDto callCnTransferEGHSService(CreditNoteEntitiesDto cnEntities,
			CreditNoteDaoExt creditNote, String remarks, Integer accNum) {

		GhsCreditNoteTransferDto ghsCreditNoteRequest = (GhsCreditNoteTransferDto) MapperUtil.getDtoMapping(creditNote,
				GhsCreditNoteTransferDto.class);
		ghsCreditNoteRequest.setStatus(GhsConstantsEnum.OPEN.toString());
		ghsCreditNoteRequest.setRemarks(remarks);
		ghsCreditNoteRequest.setCustomer(cnEntities);
		ghsCreditNoteRequest.setTotalCashCollected(creditNote.getCashCollected());
		GhsAccountDetailsResponseDto ghsAccountDetailsResponseDto = null;
        if(accNum != null)
        {
        	try
        	{
			  ghsAccountDetailsResponseDto = integrationService
					.getGhsAccountDetails(VendorCodeEnum.GHS.name(), accNum);
        	}
			catch (Exception e) {
				throw new ServiceException("Account information not available for : {accountNo}", "ERR-SALE-345",
						Map.of("accountNo", accNum.toString()));
			}
			
        	if (ghsAccountDetailsResponseDto!=null && accNum.equals(ghsAccountDetailsResponseDto.getAccountNo())) {
				ghsCreditNoteRequest.setAccountNumber(accNum);
			}
        	
        	
        }
		
		return integrationService.cnTransferEghs(ghsCreditNoteRequest);

	}

	private GhsCreditNoteUpdateResponseDto callEPOSSupdateEGHSService(Short fiscalYear, int ghsDocNo) {

		Map<String, String> reqParams = Map.of(SalesUtil.VENDOR_CODE, String.valueOf("GHS"), "ghsDocNo",
				String.valueOf(ghsDocNo), "fiscalYear", String.valueOf(fiscalYear));

		// calling eposs integration service
		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.PATCH,
				SalesUtil.INTEGRATION_EGHS_CREDITNOTE_URL, reqParams, null);

		return MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
				GhsCreditNoteUpdateResponseDto.class);

	}

	// get cn configurations based on type
	private Object getConfigurartion(String ruleType, String locationCode) {
		RuleRequestListDto ruleRequestListDto = new RuleRequestListDto();
		ruleRequestListDto.setLocationCode(locationCode);

		return engineClient.getRuleValues(ruleType, ruleRequestListDto);

	}

	private CashPaymentRuleDetails getCashConfig() {

		RuleRequestListDto filter = new RuleRequestListDto();
		filter.setLocationCode(CommonUtil.getStoreCode());
		Object ruleFieldValues = engineService.getRuleFieldValues(RuleTypeEnum.CASH_CONFIGURATION, filter);
		return MapperUtil.mapObjToClass(ruleFieldValues, CashPaymentRuleDetails.class);
	}

	@Override
	@Transactional
	public CNResponeDtoExt mergeCNForGRF(List<String> ids, SalesTxnDaoExt salesTxn, Integer customerId, String remarks,
			int docCount) {

		log.debug("search CN from database");
		List<CreditNoteDaoExt> creditNotes = creditNoteService.findByIdInAndLocationCode(ids,
				CommonUtil.getLocationCode());

		log.debug("validate configs");
		validateMergeGrfCn(creditNotes, ids);

		validateCustomerInMergeGrf(creditNotes, customerId);

		log.debug("max cash limit check");
		maxCashLimitCheckForMergeGRF(creditNotes);

		// is of different customer & docCount 0, throw error
		// @formatter:off
		boolean isOfDiffCustomer = creditNotes.stream().anyMatch(cn -> !cn.getCustomerId().equals(customerId));

		if (isOfDiffCustomer && docCount == 0) {
			Set<Integer> cnCustomerIds = creditNotes.stream().map(CreditNoteDaoExt::getCustomerId)
					.collect(Collectors.toSet());
			throw new ServiceException("The customer should have submitted a consent form and a photo identity proof.",
					"ERR-SALE-313",
					"CN Customer ids: " + Arrays.toString(cnCustomerIds.toArray()) + " & customer: " + customerId);
		}
		// @formatter:on

		log.debug("merge CN");
		// merge and returns new CN
		CreditNoteDaoExt creditNote = mergeCNs(creditNotes, salesTxn, customerId, remarks);

		// set all statuses to redeemed and save all cn's
		// need to use dao's instead ext because new uuid should not be generated.
		creditNotes.forEach(cn -> {
			cn.setStatus(CNStatus.REDEEMED.toString());
			creditNote.setRedeemDate(new Date());
			cn.setMergedCN(creditNote);
			cn.setUtilisedAmount(cn.getAmount());

		});

		log.debug("save new CNs'");
		creditNoteService.saveAllCNs(creditNotes);
		return (CNResponeDtoExt) MapperUtil.getDtoMapping(creditNote, CNResponeDtoExt.class);
	}

	private void maxCashLimitCheckForMergeGRF(List<CreditNoteDaoExt> creditNotes) {

		// sum Cash collected & check if it is more than configured limit
		BigDecimal sumOfCashCollected = creditNotes.stream().filter(cn -> cn.getCashCollected() != null)
				.map(CreditNoteDaoExt::getCashCollected).reduce(BigDecimal.ZERO, BigDecimal::add);
		CashPaymentRuleDetails cashConfig = getCashConfig();
		if (sumOfCashCollected.compareTo(new BigDecimal(cashConfig.getCashAmountMaxCap())) > 0)
			throw new ServiceException("Cash collected amount sum is more than configured", "ERR-SALE-293",
					"CNs' cash collected sum: " + sumOfCashCollected + ", cashAmountMaxCap: "
							+ cashConfig.getCashAmountMaxCap());
	}

	private void validateCustomerInMergeGrf(List<CreditNoteDaoExt> creditNotes, Integer customerId) {

		// if multiple customers' CN going to be merged check CN config validation
		Set<Integer> cnCustomerIds = creditNotes.stream().map(CreditNoteDaoExt::getCustomerId)
				.collect(Collectors.toSet());

		AdvanceCNRuleDetails advConfig = null;

		// multiple CN customer
		if (cnCustomerIds.size() > 1) {

			advConfig = getAdvCnConfig();

			if (!BooleanUtils.isTrue(advConfig.getIsMergingGRFCNAllowed()))
				throw new ServiceException("CN Cannot be merged as Customers are not the same", "ERR-SALE-221",
						"isMergingGRFCNAllowed? " + advConfig.getIsMergingGRFCNAllowed());
		}

		// @formatter:off
		// if third party cust there, then only check if
		// isOnlyCNCustomerAllowedForMergeGrf is true, throw error
		// @formatter:on
		// third party customer
		if (!cnCustomerIds.contains(customerId)) {

			if (advConfig == null)
				advConfig = getAdvCnConfig();

			if (BooleanUtils.isTrue(advConfig.getIsOnlyCNCustomerAllowedForMergeGRF()))
				throw new ServiceException("Third party customer is not allowed in Merge GRF based on configuration.",
						"ERR-SALE-289",
						"isOnlyCNCustomerAllowedForMergeGrf? " + advConfig.getIsOnlyCNCustomerAllowedForMergeGRF());

		}
	}

	/**
	 * @return
	 */
	private AdvanceCNRuleDetails getAdvCnConfig() {

		RuleRequestListDto filter = new RuleRequestListDto();
		filter.setLocationCode(CommonUtil.getStoreCode());
		Object ruleFieldValues = engineService.getRuleFieldValues(RuleTypeEnum.ADV, filter);
		return MapperUtil.mapObjToClass(ruleFieldValues, AdvanceCNRuleDetails.class);
	}

	private void validateMergeGrfCn(List<CreditNoteDaoExt> creditNotes, List<String> ids) {

		String remarks = null;
		if (creditNotes == null || creditNotes.isEmpty()) {
			remarks = "None of the credit note information available.";
		} else if (creditNotes.size() < ids.size()) {
			List<String> idsAvailable = creditNotes.stream().map(CreditNoteDaoExt::getId).collect(Collectors.toList());
			ids.removeAll(idsAvailable);
			remarks = "Some CN(s) data not available: " + ids;
		}

		if (remarks != null)
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);

		// if merged already
		List<CreditNoteDaoExt> mergedCN = creditNotes.stream().filter(cn -> cn.getMergedCN() != null)
				.collect(Collectors.toList());
		if (!mergedCN.isEmpty()) {
			throw new ServiceException("Merged Credit Note(s) are not allowed.", ERR_INT_219,
					"Merged CN(s): " + mergedCN.stream().map(CreditNoteDaoExt::getId).collect(Collectors.toList()),
					null);
		}

		// if CN is not in OPEN status
		List<CreditNoteDaoExt> nonAllowedCN = creditNotes.stream()
				.filter(cn -> !cn.getStatus().equals(CNStatus.OPEN.name())).collect(Collectors.toList());
		if (!nonAllowedCN.isEmpty()) {
			throw new ServiceException("Only Open Credit Note(s) not allowed.", ERR_INT_219, nonAllowedCN.stream()
					.collect(Collectors.toMap(CreditNoteDaoExt::getId, CreditNoteDaoExt::getStatus)), null);
		}

		// if frozen rate details info not available
		List<CreditNoteDaoExt> nonFrozenCN = creditNotes.stream().filter(cn -> cn.getFrozenRateDetails() == null)
				.collect(Collectors.toList());
		if (!mergedCN.isEmpty()) {
			throw new ServiceException("Some Credit Note(s) are not have frozen details.", ERR_INT_219,
					"CN(s): " + nonFrozenCN.stream().map(CreditNoteDaoExt::getId).collect(Collectors.toList()), null);
		}

	}

	/**
	 * @param ids
	 * @return
	 */
	private CreditNoteDaoExt mergeCNs(List<CreditNoteDaoExt> creditNoteList, SalesTxnDaoExt salesTxn,
			Integer customerId, String remarks) {
		BigDecimal finalAmount = BigDecimal.ZERO;
		BigDecimal actualAmount;

		BigDecimal cashCollected = BigDecimal.ZERO;

		// will have gold platinum silver final frozen rate
		JsonNode root;
		JsonNode dataNode = null;
		FrozenRatesDetails existingfrozenDetails = null;
		FrozenRatesDetails newFrozenRateDetails = null;

		CreditNoteDaoExt newCreditNote = null;

		for (CreditNoteDaoExt creditNote : creditNoteList) {
			newCreditNote = (CreditNoteDaoExt) MapperUtil.getDtoMapping(creditNote, CreditNoteDaoExt.class);
			newCreditNote.setCustomerId(customerId);
			actualAmount = creditNote.getAmount().subtract(creditNote.getUtilisedAmount());
			log.debug("amt: {}, utlized:{}, balance: {}", creditNote.getAmount(), creditNote.getUtilisedAmount(),
					actualAmount);
			finalAmount = finalAmount.add(actualAmount);

			if (creditNote.getCashCollected() != null)
				cashCollected = cashCollected.add(creditNote.getCashCollected());

			try {
				root = MapperUtil.getObjectMapperInstance().readTree(creditNote.getFrozenRateDetails());
				dataNode = root.path("data");
				existingfrozenDetails = MapperUtil.getObjectMapperInstance().convertValue(dataNode,
						FrozenRatesDetails.class);

			} catch (IOException e) {
				throw new ServiceException("UNABLE_TO_PARSE_JSON", "ERR_CORE_003");
			}

			newFrozenRateDetails = getUpdatedFrozenRateDetails(existingfrozenDetails, newFrozenRateDetails);
		}
		if (newCreditNote != null) {
			newCreditNote.setCustomerId(customerId);
			newCreditNote.setRemarks(remarks);
			newCreditNote.setCashCollected(cashCollected);
			newCreditNote.setParentCn(newCreditNote);
			newCreditNote.setOriginalCn(newCreditNote);
			newCreditNote.setRefDocNo(salesTxn.getDocNo());
			newCreditNote.setRefFiscalYear(salesTxn.getFiscalYear());
			if (TransactionTypeEnum.ADV.name().equals(salesTxn.getTxnType())
					&& SubTxnTypeEnum.FROZEN_RATES.name().equals(salesTxn.getSubTxnType())) {

				newCreditNote.setRefDocType(TransactionTypeEnum.GRF.name());
			} else {
				newCreditNote.setRefDocType(salesTxn.getTxnType());
			}
		}

		// get average gold rate finalRate divide creditNoteMap size
		// finalAmount= sum of actualAmount
		// finalWeight=sum of actualWeight
		if (newFrozenRateDetails != null) {
			BigDecimal ratePerUnit = finalAmount.divide(newFrozenRateDetails.getWeight(), DomainConstants.PRICE_SCALE,
					DomainConstants.ROUNDIND_MODE);
			newFrozenRateDetails.setRatePerUnit(ratePerUnit);
			log.debug("final amount: {}, final weight:{}", finalAmount, newFrozenRateDetails.getWeight());
			log.debug("Avg gold Rate/unit: {}", ratePerUnit);
			log.debug("Final: {}", newFrozenRateDetails);
		}

		// create new cn with updated final amount and metal rate
		return updateAndSaveCreditNote(newCreditNote, newFrozenRateDetails, finalAmount, salesTxn);
		// insert the mergedCNid's for all the cn's

	}

	/**
	 * @param newCreditNote
	 * @param newFrozenRateDetails
	 * @param finalAmount
	 */
	private CreditNoteDaoExt updateAndSaveCreditNote(CreditNoteDaoExt newCreditNote,
			FrozenRatesDetails newFrozenRateDetails, BigDecimal finalAmount, SalesTxnDaoExt salesTxn) {
		newCreditNote = creditNoteService.generateCNDetails(newCreditNote, SalesDocTypeEnum.CN, null);
		newCreditNote.setSalesTxn(salesTxn);

		Map<String, Object> frozenRate = new LinkedHashMap<>();
		frozenRate.put("type", SalesConstants.FROZEN_RATE_DETAILS);
		frozenRate.put("data", newFrozenRateDetails);

		newCreditNote.setFrozenRateDetails(MapperUtil.getStringFromJson(frozenRate));
		newCreditNote.setPrints(0);
		newCreditNote.setUtilisedAmount(BigDecimal.ZERO);
		newCreditNote.setStatus(CNStatus.OPEN.toString());
		newCreditNote.setSrcSyncId(0);
		newCreditNote.setDestSyncId(0);
		newCreditNote.setAmount(finalAmount);
		newCreditNote.setId(UUID.randomUUID().toString());
		// sales transaction id need to be updated by the ADV call once after a new
		// transaction is generated.

		return creditNoteService.saveCN(newCreditNote);
	}

	/**
	 * @param frozenRateDetails
	 * @param frozenRateDetails2
	 */
	private FrozenRatesDetails getUpdatedFrozenRateDetails(FrozenRatesDetails frozenRateDetails,
			FrozenRatesDetails newFrozenRateDetails) {
		// coming for the first time
		if (newFrozenRateDetails == null) {
			FrozenRatesDetails frozenDetails = new FrozenRatesDetails();
			frozenDetails.setMetal(frozenRateDetails.getMetal());
			frozenDetails.setWeight(BigDecimal.ZERO);
			newFrozenRateDetails = frozenDetails;
		}

		newFrozenRateDetails.setWeight(frozenRateDetails.getWeight().add(newFrozenRateDetails.getWeight()));
		return newFrozenRateDetails;
	}

	@Override
	public PagedRestResponse<List<CNResponseDto>> listCNforPayments(Integer docNo, Short fiscalYear, String mobileNo,
			String linkedTxnId, Integer customerId, Boolean isPageable, Pageable pageable) {
		return listCreditNotesforPayments(docNo, fiscalYear, mobileNo, customerId, isPageable, pageable);

	}

	public PagedRestResponse<List<CNResponseDto>> listCreditNotesforPayments(Integer docNo, Short fiscalYear,
			String mobileNo, Integer customerId, Boolean isPageable, Pageable pageable) {
		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		List<Object[]> creditNoteList = creditNoteService.listOpenCreditNotes(docNo, fiscalYear,
				CryptoUtil.encrypt(mobileNo, SalesConstants.MOBILE_NO), customerId, pageable, false);

		int total = creditNoteService.getOpenCNCount(docNo, fiscalYear,
				CryptoUtil.encrypt(mobileNo, SalesConstants.MOBILE_NO), customerId,null);
		// Sets the dto values from response
		List<CNResponseDto> creditNoteResponseList = setCreditNoteResponeList(creditNoteList, null);
		Page<CNResponseDto> pagedData = new PageImpl<>(creditNoteResponseList,
				PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort()), total);
		return new PagedRestResponse<>(creditNoteResponseList, pagedData);
	}

	@Override
	public CNResponseDto getGrfCN(Integer docNo, Short fiscalYear) {
		return creditNoteService.getGrfCN(docNo, fiscalYear, CommonUtil.getLocationCode());
	}

	@Override
	@Transactional
	public PublishResponse downloadCNfromEGHSTransactional(List<CreditNoteStatusUpdateDto> creditNoteStatusUpdateList) {
		List<CreditNoteDaoExt> creditNoteList = new ArrayList<>();
		creditNoteStatusUpdateList.forEach(creditNote -> {
			CreditNoteDaoExt creditNoteDao = creditNoteService.findByDocNoAndFiscalYearAndLocationCode(creditNote);
			try {
				if (creditNote != null) {
					creditNoteDao = downloadAndUpdateCN(creditNoteDao, creditNote.getGhsDocNo());
					creditNoteList.add(creditNoteDao);
				} else {
					throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
				}
			} catch (Exception e) {
				log.info("Error while downloading credit Notes from GHS");
			}
		});
		CNResponeDtoExt apiResponse = new CNResponeDtoExt();
		SyncStagingDto syncDto = null;
		PublishResponse response = new PublishResponse();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			syncDto = syncStaggingCreditNote(null, null, creditNoteList, SalesOperationCode.CREDIT_NOTE_EGHS, null);
		response.setSyncStagingDto(syncDto);
		response.setApiResponse(apiResponse);
		return response;
	}

	// ==================================== Data Sync Implementation
	// ==========================================

	@Override
	public CNResponeDtoExt updateDestCN(String id, RemarksBaseDto remarksDto, String creditNoteWorkFlowType) {
		PublishResponse cnResponse = creditNoteFacad.updateDestCNTransactional(id, remarksDto, creditNoteWorkFlowType);
		return publishSalesMsg(cnResponse);
	}

	@Override
	public CNResponeDtoExt downloadCNfromEGHS(String id, int ghsDocNo) {
		PublishResponse cnResponse = creditNoteFacad.downloadCNfromEGHSTransactional(id, ghsDocNo);
		return publishSalesMsg(cnResponse);
	}

	@Override
	public CNResponeDtoExt downloadCNfromEGHS(List<CreditNoteStatusUpdateDto> creditNoteStatusUpdateDtoList) {
		PublishResponse cnResponse = creditNoteFacad.downloadCNfromEGHSTransactional(creditNoteStatusUpdateDtoList);
		return publishSalesMsg(cnResponse);
	}

	@Override
	public CNResponeDtoExt transferToEghs(String id, ConfirmEGHSRequestDto raiseRequestDto) {
		PublishResponse cnResponse = creditNoteFacad.transferToEghsTransactional(id, raiseRequestDto);
		return publishSalesMsg(cnResponse);
	}

	public SyncStagingDto syncStaggingCreditNote(CreditNoteDao creditNote, CreditNoteDaoExt creditNoteExt,
			List<CreditNoteDaoExt> creditNoteList, String operation, List<SyncData> syncDatas) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());
		List<CreditNoteSyncDtoExt> dtoExtList = new ArrayList<>();
		if (creditNote != null) {
			List<CreditNoteDao> cnList = List.of(creditNote);
			cnList.forEach(dao -> dtoExtList.add(new CreditNoteSyncDtoExt(dao)));
		}
		if (creditNoteExt != null) {
			List<CreditNoteDaoExt> cnList = List.of(creditNoteExt);
			cnList.forEach(dao -> dtoExtList.add(new CreditNoteSyncDtoExt(dao)));
		}
		if (creditNoteList != null && !creditNoteList.isEmpty())
			creditNoteList.forEach(dao -> dtoExtList.add(new CreditNoteSyncDtoExt(dao)));
		if (!dtoExtList.isEmpty())
			syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 6));
		if (syncDatas != null && !syncDatas.isEmpty())
			syncDataList.addAll(syncDatas);
		MessageRequest cnMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
		SyncStagingDto cnStagingDto = new SyncStagingDto();
		cnStagingDto.setMessageRequest(cnMsgRequest);
		String cnMsgRqst = MapperUtil.getJsonString(cnMsgRequest);
		SyncStaging cnSyncStaging = new SyncStaging();
		cnSyncStaging.setMessage(cnMsgRqst);
		cnSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		cnSyncStaging = saleSyncStagingRepository.save(cnSyncStaging);
		cnStagingDto.setId(cnSyncStaging.getId());
		return cnStagingDto;
	}

	private CNResponeDtoExt publishSalesMsg(PublishResponse cnResponse) {
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			salesSyncDataService.publishSalesMessagesToQueue(cnResponse.getSyncStagingDto());
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(cnResponse.getApiResponse(), new TypeReference<CNResponeDtoExt>() {
		});
	}

	@Override
	public CNResponeDtoExt cancelCreditNote(String id, ConfirmRequestDto raiseRequestDto) {

		CreditNoteDaoExt creditNoteDao = creditNoteService.findByIdAndLocationCode(id, CommonUtil.getLocationCode());

		if (creditNoteDao != null && !(CNStatus.OPEN.name().equals(creditNoteDao.getStatus())||CNStatus.VOIDED.name().equals(creditNoteDao.getStatus()))) {
			throw new ServiceException("Credit note is " + creditNoteDao.getStatus(), ERR_SALE_202,
					Map.of("status", creditNoteDao.getStatus()));
		}
		List<SyncData> syncDatas = new ArrayList<>();
		if (creditNoteDao != null) {
			if (creditNoteDao.getLinkedTxn() != null
					&& (creditNoteDao.getLinkedTxn().getTxnType().equals(TransactionTypeEnum.AB.toString()))) {

				throw new ServiceException(
						"Credit note cannot be cancelled as same as being utilized in Advance Booking", "ERR-SALE-407");
			}
			// check Employee CN cancel configuration
			checkLocationForCancel(creditNoteDao);

			// check if CN is added in any transaction
			checkIfCNIsUsedAsPayment(creditNoteDao);

			// configuration for QCGC
			checkLocationForCancelQCGC(creditNoteDao);

			log.info("Credit note status.....before setting to cancelled....................{}",creditNoteDao.getStatus());
			//payment_refund update shouldn't happen again incase of unipay and CN status is voided,
			//as not to repeat refund for the particular payment.
			if(!(creditNoteDao.getStatus().equals(CNStatus.VOIDED.name()) && BooleanUtils.isTrue(creditNoteDao.getIsUnipay())))
			{
				updateRefundDetails(creditNoteDao, raiseRequestDto, syncDatas);
			}
			
			creditNoteDao.setStatus(CNStatus.CANCELLED.toString());
			creditNoteDao.setCancelDate(businessDayService.getBusinessDay().getBusinessDate());
			creditNoteDao.setRemarks(raiseRequestDto.getRemarks());

			creditNoteDao.setSrcSyncId(creditNoteDao.getSrcSyncId() + 1);
			if(raiseRequestDto.getPaymentDetails() != null) 
			{
			CnRefundPaymentDetails paymentDetails = MapperUtil
					.mapObjToClass(raiseRequestDto.getPaymentDetails().getData(), CnRefundPaymentDetails.class);
			BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(paymentDetails.getRefundAmount());
			BigDecimal refundValue = paymentDetails.getRefundAmount().add(roundingVariance);
			creditNoteDao.setRefundValue(refundValue);
			
			}
			CountryDetailsDto countryDetailsDto = engineService.getCountryDetails(CommonUtil.getLocationCode());
			creditNoteDao.setDebitNoteDocNo(salesDocService.getDocNumber(SalesDocTypeEnum.DEBIT_NOTE,countryDetailsDto.getFiscalYear().shortValue()));
			creditNoteDao.setDebitNoteFiscalYear(countryDetailsDto.getFiscalYear());	
			creditNoteDao = creditNoteService.saveCN(creditNoteDao);
			CreditNoteSyncDtoExt creditNoteSyncDtoExt = new CreditNoteSyncDtoExt(creditNoteDao);
			syncDatas.add(DataSyncUtil.createSyncData(creditNoteSyncDtoExt, 2));
			SyncStagingDto syncData = syncStaggingCreditNote(null, null, null, SalesOperationCode.CN_WORKFLOW,
					syncDatas);
			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
				salesSyncDataService.publishSalesMessagesToQueue(syncData);
		}

		return (CNResponeDtoExt) MapperUtil.getDtoMapping(creditNoteDao, CNResponeDtoExt.class); 
	}

	private void checkLocationForCancel(CreditNoteDaoExt creditNoteDao) {
		JsonData jsonData = MapperUtil.mapObjToClass(creditNoteDao.getPaymentDetails(), JsonData.class);
		if (jsonData != null) {
			CNPaymentDetailsDto cnPaymentDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
					CNPaymentDetailsDto.class);
			if (cnPaymentDetailsDto.getPaymentCodes().containsKey(PaymentCodeEnum.EMPLOYEE_LOAN.getPaymentcode())) {
				LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
				if (BooleanUtils.isNotTrue(locationCacheDto.getCnDetails().getIsEmployeeLoanCNCancel())) {
					throw new ServiceException(" Employee Loan CN is not allowing to cancel", "ERR-SALE-408");
				}
			}
			if (cnPaymentDetailsDto.getPaymentCodes().containsKey(PaymentCodeEnum.GIFT_VOUCHER.getPaymentcode())) {
				LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
				if (BooleanUtils.isNotTrue(locationCacheDto.getCnDetails().getIsGvCnCancellationAllowed())) {
					throw new ServiceException(" Gift Voucher CN is not allowed to cancel", "ERR-SALE-423");
				}
			}
			if (cnPaymentDetailsDto.getPaymentCodes().containsKey(PaymentCodeEnum.QCGC.getPaymentcode())) {
				LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
				if (BooleanUtils.isNotTrue(locationCacheDto.getCnDetails().getIsQcgcCnCancellationAllowed())) {
					throw new ServiceException(
							"QCGC CN is not allowed to cancel because configuration is not enabled in Location Master",
							"ERR-SALE-431");
				}
			}

		}
	}

	@Override
	public CNResponeDtoExt inwardLegacyCN(String id, String srcLocationCode) {
		Map<String, String> reqParams = new HashMap<>();
		reqParams.put(SalesConstants.SRC_BTQ_CODE, String.valueOf(srcLocationCode));
		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.GET,
				SalesUtil.CREDITNOTE_EPOSS_URL + "/" + id + "/legacy/ibt", reqParams, null);
		CNResponseLegacyDto cNResponseLegacyDto = MapperUtil.getObjectMapperInstance()
				.convertValue(epossApiResponseDto.getResponse(), CNResponseLegacyDto.class);
		if (cNResponseLegacyDto.getDestLocationCode() != null && !cNResponseLegacyDto.getDestLocationCode().equalsIgnoreCase(CommonUtil.getLocationCode()))
			throw new ServiceException("Credit note can't be inwarded in the logged in location", "ERR-SALE-331",
					cNResponseLegacyDto.getDestLocationCode());
		CreditNoteDao creditNoteDao = (CreditNoteDao) MapperUtil.getDtoMapping(cNResponseLegacyDto, CreditNoteDao.class,
				"discountDetails","eghsDetails", "frozenRateDetails");
		if (cNResponseLegacyDto.getFrozenRateDetails() != null) {
			creditNoteDao.setFrozenRateDetails(MapperUtil.getStringFromJson(creditNoteDao.getFrozenRateDetails()));
		}
		if (cNResponseLegacyDto.getEghsDetails() != null) {
			creditNoteDao.setEghsDetails(MapperUtil.getStringFromJson(creditNoteDao.getEghsDetails()));
		}
		log.info("cNResponseLegacyDto..........{}", cNResponseLegacyDto.getDiscountDetails());
		if (cNResponseLegacyDto.getDiscountDetails() != null) {
			creditNoteDao.setDiscountDetails(MapperUtil.getStringFromJson(cNResponseLegacyDto.getDiscountDetails()));
			log.info("creditnote discount details..........{}", creditNoteDao.getDiscountDetails());

		}

		if (!CNStatus.OPEN.name().equals(creditNoteDao.getStatus())) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_DYNAMIC_NUMBER_SHOULD_BE_IN_OPEN_STATUS,
					SalesConstants.ERR_SALE_157, "Status: " + creditNoteDao.getStatus(),
					Map.of(SalesConstants.DOC_NO, creditNoteDao.getDocNo().toString()));
		}
		CreditNoteDaoExt cnToSave = new CreditNoteDaoExt();
		cnToSave.setOriginalDocDate(creditNoteDao.getDocDate());
		CreditNoteDao cnDao = creditNoteService.generateCNDetailForDao(creditNoteDao, SalesDocTypeEnum.CN);
		Integer destCustomerId = customerService.getCustomerByIdAndLocation(cNResponseLegacyDto.getCustomerId(),
				srcLocationCode);
		cnDao.setCustomerId(destCustomerId);
		cnToSave = MapperUtil.getObjectMapperInstance().convertValue(cnDao, CreditNoteDaoExt.class);
		cnToSave.setLocationCode(CommonUtil.getLocationCode());
		cnToSave.setParentCn(cnToSave);
		cnToSave.setOriginalCn(cnToSave);
		cnToSave.setSrcSyncId(0);
		cnToSave.setDestSyncId(0);
		cnToSave.setRefDocType(SalesDocTypeEnum.CN_IBT.toString());
		cnToSave.setRefDocNo(cNResponseLegacyDto.getIbtDocNo());
		cnToSave.setRefFiscalYear(cNResponseLegacyDto.getIbtFiscalYear());
		
		log.info("cNResponseLegacyDto..........{}", cNResponseLegacyDto.getDiscountDetails());
		if (cNResponseLegacyDto.getDiscountDetails() != null) {
			cnToSave.setDiscountDetails(MapperUtil.getStringFromJson(cNResponseLegacyDto.getDiscountDetails()));
			log.info("creditnote discount details..........{}", cnToSave.getDiscountDetails());

		}
		//cash collected from legacy to nap
		cnToSave.setCashCollected(cNResponseLegacyDto.getCashCollected());
		
		cnToSave.setUtilisedAmount(BigDecimal.ZERO);
		CreditNoteDaoExt cnSaved = creditNoteService.saveCN(cnToSave);
		SyncStagingDto syncData = syncStaggingCreditNote(null, cnSaved, null, SalesOperationCode.CREDIT_NOTE_IBT, null);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			salesSyncDataService.publishSalesMessagesToQueue(syncData);
		reqParams.put("destCnId", cnSaved.getId());
		reqParams.put("destLocationCode", cnSaved.getLocationCode());
		CNResponeDtoExt cnResponse = new CNResponeDtoExt();
		cnResponse = (CNResponeDtoExt) MapperUtil.getDtoMapping(cnSaved, CNResponeDtoExt.class, "parentCn",
				"originalCn");
		salesIntegrationServiceImpl.callIntegration(HttpMethod.PUT,
				SalesUtil.CREDITNOTE_EPOSS_URL + "/" + id + "/legacy/ibt", reqParams, null);
		return cnResponse;
		// return MapperUtil.getObjectMapperInstance().convertValue(cnSaved,
		// CNResponeDtoExt.class);

	}

	@Override
	public BooleanResponse updateCreditNoteLegacy(String id, String srcBtqCode, String destLocationCode) {
		CreditNoteDaoExt cn = creditNoteService.findByIdAndSrcLocationCode(id, srcBtqCode);
		Map<String, String> reqParams = new HashMap<>();
		reqParams.put(SalesConstants.SRC_BTQ_CODE, String.valueOf(srcBtqCode));
		cn.setStatus(CNStatus.TRANSFER_IBT.name());
		cn.setIbtLocation(destLocationCode);
		creditNoteService.saveCN(cn);
		reqParams.put("destCnId", id);
		reqParams.put("destLocationCode", destLocationCode);
		salesIntegrationServiceImpl.callIntegration(HttpMethod.PUT,
				SalesUtil.CREDITNOTE_EPOSS_URL + "/" + id + "/legacy/ibt", reqParams, null);
		BooleanResponse response = new BooleanResponse();
		response.setStatus(Boolean.TRUE);
		return response;
	}

	@Override
	public CreditNoteEntitiesDto getCreditNoteEntities(String id) {
		CreditNoteEntitiesDto creditNoteEntitiesDto = new CreditNoteEntitiesDto();
		Optional<CreditNoteDaoExt> creditNoteOptional = creditNoteRepo.findById(id);
		if (creditNoteOptional.isPresent()) {
			CreditNoteDaoExt creditNote = creditNoteOptional.get();
			if (!CNStatus.OPEN.name().equals(creditNote.getStatus())) {
				throw new ServiceException(SalesConstants.CREDIT_NOTE_DYNAMIC_NUMBER_SHOULD_BE_IN_OPEN_STATUS,
						SalesConstants.ERR_SALE_157, "Status: " + creditNote.getStatus(),
						Map.of(SalesConstants.DOC_NO, creditNote.getDocNo().toString()));
			}
			creditNoteEntitiesDto.setCreditNote(creditNote);
			CustomerLocationMappingDao customerLocationMappping = customerLocationMappingRepositoryExt
					.findByCustomerIdAndLocationCode(creditNote.getCustomerId(), creditNote.getLocationCode());
			creditNoteEntitiesDto.setCustomerLocationMapping(customerLocationMappping);
			CustomerDao customerDao = customerService.getCustomer(customerLocationMappping.getCustomer().getId());
			creditNoteEntitiesDto.setCustomer(customerDao);
			if (creditNote.getSalesTxn() != null) {
				creditNoteEntitiesDto.setSalesTxn(creditNote.getSalesTxn());
				creditNoteEntitiesDto.setPaymentDetails(
						paymentDetailsRepositoryExt.findBySalesTxnDaoId(creditNote.getSalesTxn().getId()));
			}
			return creditNoteEntitiesDto;
		} else {
			throw new ServiceException("No credit note found", "ERR-SALE-154");
		}
	}

	@Override
	public CNRefundResponeDto calculateCNRefundAmount(String id) {

		CreditNoteDaoExt creditNote = creditNoteService.findByIdAndLocationCode(id, CommonUtil.getLocationCode());
		
		if (creditNote == null) {
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
		}
		//Check in case of CNRefund for UNIPAY
		if(creditNote.getStatus().equals(CNStatus.VOIDED.name()) && BooleanUtils.isTrue(creditNote.getIsUnipay()))
		{
			// check if CN is added in any transaction
			checkIfCNIsUsedAsPayment(creditNote);
			
			if (creditNote.getLinkedTxn() != null
					&& (creditNote.getLinkedTxn().getTxnType().equals(TransactionTypeEnum.AB.toString())||creditNote.getLinkedTxn().getTxnType().equals(TransactionTypeEnum.CO.toString()))) {

				throw new ServiceException(
						"Credit note cannot be cancelled as same as being utilized in Advance Booking", "ERR-SALE-407");
			}
		}
		
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		BankingDetails bankingDetails = locationCacheDto.getBankingDetails();
		String locRefundPaymentMode = null;
		if (bankingDetails != null) {
			locRefundPaymentMode = bankingDetails.getPaymentMode();
		}
		CNRefundResponeDto creditNoteDto = (CNRefundResponeDto) MapperUtil.getObjectMapping(creditNote,
				new CNRefundResponeDto());

		AdvanceCNRuleDetails cnAdvRuleDetails = getCNConfigurations(creditNote, CommonUtil.getLocationCode());

		BigDecimal totalAmount = BigDecimal.ZERO;

		if (creditNote.getAmount() != null)
			totalAmount = totalAmount.add(creditNote.getAmount());
		if (creditNote.getUtilisedAmount() != null)
			totalAmount = totalAmount.subtract(creditNote.getUtilisedAmount());

		if (cnAdvRuleDetails != null && cnAdvRuleDetails.getDeductionRate() != null) {

			try {
				creditNoteDto.setDeductionPercentage(cnAdvRuleDetails.getDeductionRate());
				BigDecimal refundDeductionAmount = totalAmount
						.multiply(new BigDecimal(cnAdvRuleDetails.getDeductionRate()).divide(new BigDecimal(100)));
				creditNoteDto.setRefundDeductionAmount(refundDeductionAmount);
			    creditNote.setRefundDeduction(refundDeductionAmount);
			    //creditNote = creditNoteService.saveCN(creditNote);
			    BigDecimal netRefundAmount = totalAmount.subtract(refundDeductionAmount);
			    BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(netRefundAmount);
				creditNoteDto.setNetRefundAmount(netRefundAmount.add(roundingVariance));
			} catch (Exception e) {
				
				
				creditNoteDto.setDeductionPercentage("0");
				creditNoteDto.setRefundDeductionAmount(BigDecimal.ZERO);
				BigDecimal netRefundAmount = totalAmount;
				BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(netRefundAmount);
			   creditNoteDto.setNetRefundAmount(netRefundAmount.add(roundingVariance));
			}

		} else {
			creditNoteDto.setRefundDeductionAmount(BigDecimal.ZERO);
			BigDecimal netRefundAmount = totalAmount;
			BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(netRefundAmount);
		   creditNoteDto.setNetRefundAmount(netRefundAmount.add(roundingVariance));
			
		}
		if (!creditNote.getRefDocType().equals(TransactionTypeEnum.AB.name())
				|| (creditNote.getRefDocType().equals(CNType.CN_IBT.name()))
						&& creditNote.getRefundValue()!= null && creditNote.getRefundValue().compareTo(BigDecimal.ZERO) > 0){
			if (creditNote.getOriginalCn()!= null && creditNote.getOriginalCn().getId()!= null && creditNote.getId().equals(creditNote.getOriginalCn().getId())
					&& creditNote.getCreditNoteType().equals(CNType.TEP.name())) {
				creditNoteDto.setRefundDeductionAmount(creditNote.getRefundValue());
				creditNote.setRefundDeduction(creditNote.getRefundValue());
			   // creditNote = creditNoteService.saveCN(creditNote);
				creditNoteDto.setNetRefundAmount(creditNote.getAmount().subtract(creditNote.getRefundValue()));
			}
		}

		
		 creditNote = creditNoteService.saveCN(creditNote);
		getDefaultPaymentMode(creditNote, creditNoteDto, locRefundPaymentMode, locationCacheDto.getOwnerTypeCode());

		return creditNoteDto;

	}

	/**
	 * @param creditNote
	 * @param creditNoteDto
	 * @param refundPaymentMode
	 * @param string
	 * @return
	 */
	private void getDefaultPaymentMode(CreditNoteDaoExt creditNote, CNRefundResponeDto creditNoteDto,
			String locRefundPaymentMode, String ownerType) {
		Map<String, String> paymentCodes = null;

		// considering refund payment mode config in location (refundPaymentMode) is not
		// implemented

		if (creditNote.getPaymentDetails() != null) {
			JsonData paymentDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(creditNote.getPaymentDetails()), JsonData.class);

			CNPaymentDetailsDto cNPaymentDetailsDto = MapperUtil.mapObjToClass(paymentDetails.getData(),
					CNPaymentDetailsDto.class);

			if (cNPaymentDetailsDto != null)
				paymentCodes = cNPaymentDetailsDto.getPaymentCodes();
		}
		List<String> paymentModeList = new ArrayList<>();
		String refundPayment = null;
		BusinessDayDto businessDayDto = businessDayService.getBusinessDay();
		String paymentCode = null;
		BigDecimal cashRefundLimit = engineClient.getRefundCashLimitConfig();
		if (creditNote.getCreditNoteType().equalsIgnoreCase(CNType.ADV.name()) || creditNote.getCreditNoteType().equalsIgnoreCase(CNType.BILL_CANCELLATION.name())) {
			// single payment & full CN
			if (paymentCodes != null && paymentCodes.size() == 1
					&& creditNote.getUtilisedAmount()!= null && creditNote.getUtilisedAmount().compareTo(BigDecimal.ZERO) == 0) {
				String code = paymentCodes.keySet().stream().findFirst().get();
				if (code.equals(PaymentCodeEnum.CASH.name())) {

					if (creditNoteDto.getNetRefundAmount().compareTo(cashRefundLimit) <= 0)
						refundPayment = PaymentCodeEnum.CASH.name();
					else
						refundPayment = PaymentCodeEnum.RO_PAYMENT.name();

				} else if (code.equals(PaymentCodeEnum.CHEQUE.name())) {
					if (isSameDay(creditNote.getDocDate(), businessDayDto.getBusinessDate())) {
						refundPayment = PaymentCodeEnum.CHEQUE.name();
						if (!creditNote.getPaymentDetails().isEmpty() && creditNote.getPaymentDetails() != null
								&& !StringUtil.isBlankJsonStr(creditNote.getPaymentDetails().toString())) {
							try {
								ObjectMapper mapper = new ObjectMapper();
								JsonNode root = mapper.readTree(creditNote.getPaymentDetails());
								JsonNode dataNode = root.path("data");
								
								if (!dataNode.path("bankName").isMissingNode() && !dataNode.path("bankName").isNull()) {
									creditNoteDto.setAcquiredBank(dataNode.path("bankName").asText());
								}
							} catch (IOException e) {
								throw new ServiceException("UNABLE_TO_PARSE_JSON", ERR_CORE_003);
							}
						}
						
					}
					else
						refundPayment = PaymentCodeEnum.RO_PAYMENT.name();
				} else if (code.equals(PaymentCodeEnum.WALLET.name())) {
					refundPayment = PaymentCodeEnum.WALLET.name();

				} else if (code.equals(PaymentCodeEnum.UNIPAY.name())) {
					refundPayment = PaymentCodeEnum.CARD.name();

				}else if (code.equals(PaymentCodeEnum.RTGS.name())) {
					refundPayment = PaymentCodeEnum.RO_PAYMENT.name();

				} else if (paymentCodes.get(code).equals(PaymentCodeEnum.AIRPAY.name())) {
					refundPayment = PaymentCodeEnum.AIRPAY.name();

				} else if (paymentCodes.get(code).equals(PaymentCodeEnum.RAZOR_PAY.getPaymentcode())) {
					refundPayment = PaymentCodeEnum.RAZOR_PAY.getPaymentcode();

				} else if (paymentCodes.get(code).equals(PaymentCodeEnum.DD.name())) {
					if (isSameDay(creditNote.getDocDate(), businessDayDto.getBusinessDate())) {
						refundPayment = PaymentCodeEnum.DD.name();
						if (!creditNote.getPaymentDetails().isEmpty() && creditNote.getPaymentDetails() != null
								&& !StringUtil.isBlankJsonStr(creditNote.getPaymentDetails().toString())) {
							try {
								ObjectMapper mapper = new ObjectMapper();
								JsonNode root = mapper.readTree(creditNote.getPaymentDetails());
								JsonNode dataNode = root.path("data");
								
								if (!dataNode.path("bankName").isMissingNode() && !dataNode.path("bankName").isNull()) {
									creditNoteDto.setAcquiredBank(dataNode.path("bankName").asText());
								}
							} catch (IOException e) {
								throw new ServiceException("UNABLE_TO_PARSE_JSON", ERR_CORE_003);
							}
						}
					}
					else
						refundPayment = PaymentCodeEnum.RO_PAYMENT.name();
				} else if (code.equalsIgnoreCase(PaymentCodeEnum.CARD.name())) {
					refundPayment = PaymentCodeEnum.CARD.name();
					List<PaymentDetailsDaoExt> paymentDetails = paymentDetailsRepositoryExt.findBySalesTxnDaoIdAndPaymentCode(creditNote.getSalesTxn().getId(),PaymentCodeEnum.CARD.getPaymentcode());
					if(paymentDetails.size()>1) {
						if (creditNoteDto.getNetRefundAmount().compareTo(cashRefundLimit) <= 0)
							refundPayment = PaymentCodeEnum.CASH.name();

						else
							refundPayment = PaymentCodeEnum.RO_PAYMENT.name();
					}
					else {
						creditNoteDto.setAcquiredBank(paymentDetails.get(0).getBankName());
					}
				} else if (code.equalsIgnoreCase(PaymentCodeEnum.RO_PAYMENT.getPaymentcode())) {
					refundPayment = PaymentCodeEnum.RO_PAYMENT.name();
				} else if (code.equalsIgnoreCase(PaymentCodeEnum.UNIPAY.getPaymentcode())) {
					if (!isSameDay(creditNote.getDocDate(), businessDayDto.getBusinessDate())) {
						refundPayment = PaymentCodeEnum.CARD.name();
						List<PaymentDetailsDaoExt> paymentDetails = paymentDetailsRepositoryExt.findBySalesTxnDaoIdAndPaymentCode(creditNote.getSalesTxn().getId(),PaymentCodeEnum.UNIPAY.getPaymentcode());
						if(paymentDetails.size()>1) {
							if (creditNoteDto.getNetRefundAmount().compareTo(cashRefundLimit) <= 0)
								refundPayment = PaymentCodeEnum.CASH.name();

							else
								refundPayment = PaymentCodeEnum.RO_PAYMENT.name();
						}
						else {
							creditNoteDto.setAcquiredBank(paymentDetails.get(0).getBankName());
						}
					}
				} else {
					if (creditNoteDto.getNetRefundAmount().compareTo(cashRefundLimit) <= 0)
						refundPayment = PaymentCodeEnum.CASH.name();
					else
						refundPayment = PaymentCodeEnum.RO_PAYMENT.name();
				}

			} else {
				if (creditNoteDto.getNetRefundAmount().compareTo(cashRefundLimit) <= 0)
					refundPayment = PaymentCodeEnum.CASH.name();

				else
					refundPayment = PaymentCodeEnum.RO_PAYMENT.name();

			}
		} else {
			if (creditNoteDto.getNetRefundAmount().compareTo(cashRefundLimit) <= 0)
				refundPayment = PaymentCodeEnum.CASH.name();
			else
				refundPayment = PaymentCodeEnum.RO_PAYMENT.name();
//				refundPayment = locRefundPaymentMode;
		}
		if (refundPayment != null) {

			// Wherever RO is there, its RO RTGS/cheque/RO payment
			if (refundPayment.equals(PaymentCodeEnum.RO_PAYMENT.name())) {
				paymentCode = PaymentCodeEnum.RO_PAYMENT.getPaymentcode();
				paymentModeList.add(PaymentCodeEnum.RTGS.getPaymentcode());
				paymentModeList.add(PaymentCodeEnum.CHEQUE.getPaymentcode());
				paymentModeList.add(PaymentCodeEnum.RO_PAYMENT.getPaymentcode());

				// Payment option if cheque (L3) payment selected
			} else if (ownerType.equalsIgnoreCase(OwnerTypeEnum.L3.name())
					&& refundPayment.equals(PaymentCodeEnum.CHEQUE.name())) {
				paymentModeList.add(PaymentCodeEnum.RTGS.getPaymentcode());
				paymentModeList.add(PaymentCodeEnum.CHEQUE.getPaymentcode());
			} else {
				paymentModeList.add(refundPayment);
			}
			// If less than cash refund limit by default cash will be selected. But if user
			// wants he can change to RTGS/cheque/RO (based on location master refund mode
			// configurations)
			if (refundPayment.equals(PaymentCodeEnum.CASH.name())
					&& creditNoteDto.getNetRefundAmount().compareTo(cashRefundLimit) <= 0) {
				paymentModeList.add(locRefundPaymentMode);
			}

		}
		creditNoteDto.setPaymentCode(paymentCode);
		creditNoteDto.setPaymentModeList(paymentModeList);

	}

	/**
	 * @param createdDate
	 * @param date
	 * @return
	 */
	private boolean isSameDay(Date createdDate, Date currentDate) {
		long days = CalendarUtils.getDayDiff(CalendarUtils.getStartOfDay(createdDate),
				CalendarUtils.getStartOfDay(currentDate));
		return days > 0 ? false : true;
	}

	/**
	 * This API is for CN status update to 'VOIDED' and adding an entry to payment_refunds table
	 */
	@Override
	public void voidedCNAndPaymentUpdate(String creditNoteId) {
		
		CreditNoteDaoExt creditNote = creditNoteService.findByIdAndLocationCode(creditNoteId, CommonUtil.getLocationCode());
		
		if (creditNote == null) {
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
		}
		if(BooleanUtils.isTrue(creditNote.getIsUnipay()))
		{
			//update CN status to 'VOIDED'
			creditNote.setStatus(CNStatus.VOIDED.name());

			//update refund payment table with unipay entry

			PaymentReversalDaoExt reversePayment = new PaymentReversalDaoExt();
			reversePayment.setAmount(creditNote.getAmount());
			reversePayment.setSalesTxn(creditNote.getSalesTxn());
			reversePayment.setCreditNote(creditNote);
			reversePayment.setPaymentCode(PaymentCodeEnum.UNIPAY.name());
			reversePayment.setPaymentGroup(PaymentGroupEnum.REGULAR.name());
			reversePayment.setReversalDate(businessDayService.getBusinessDay().getBusinessDate());
			reversePayment.setHostName(CommonUtil.getAuthUser().getHostName());
			paymentReversalRepo.save(reversePayment);
			
		}
		
	}

}
