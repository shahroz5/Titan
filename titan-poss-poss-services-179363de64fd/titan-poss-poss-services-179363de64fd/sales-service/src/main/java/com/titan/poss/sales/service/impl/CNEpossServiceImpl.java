/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.core.domain.constant.enums.WorkflowProcessStatusEnum;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.CreditNoteRequestDto;
import com.titan.poss.core.dto.CreditNoteTransferDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationDropDownDto;
import com.titan.poss.core.dto.LocationFilterDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.enums.CNPublishStatus;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.LocationServiceClient;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CreditNoteTempSearchDao;
import com.titan.poss.sales.dao.CreditNoteTransferDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.CreditNoteEpossDto;
import com.titan.poss.sales.dto.CreditNoteSyncDtoExt;
import com.titan.poss.sales.dto.constants.CNOperationsEnum;
import com.titan.poss.sales.dto.constants.CNTransferStatus;
import com.titan.poss.sales.dto.constants.CNWorkflowStatus;
import com.titan.poss.sales.dto.request.SalesHistoryReqDtoExt;
import com.titan.poss.sales.dto.response.CNResponeDtoExt;
import com.titan.poss.sales.dto.response.CNResponseDto;
import com.titan.poss.sales.dto.response.CNResponseLegacyDto;
import com.titan.poss.sales.dto.response.CnEpossErrorResponse;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteTempSearchRepository;
import com.titan.poss.sales.repository.CreditNoteTransferRepositoryExt;
import com.titan.poss.sales.repository.CustomerRepositoryExt;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CNEpossService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.SalesDocService;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.service.WorkflowService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesCNEpossServiceImpl")
public class CNEpossServiceImpl implements CNEpossService {

	private static final String ERR_SALE_154 = "ERR-SALE-154";
	private static final String CREDIT_NOTE_NOT_FOUND = "No credit note found";

	@Autowired
	private CreditNoteTransferRepositoryExt cnTransferRepo;

	@Autowired
	private CreditNoteService creditNoteService;

	@Autowired
	private CreditNoteFacadeImpl cnFacade;

	@Autowired
	private CustomerTxnRepositoryExt customerTxnRepo;

	@Autowired
	private WorkflowService workflowService;

	@Autowired
	CustomerService customerService;

	@Autowired
	CreditNoteRepositoryExt creditNoteRepo;

	@Autowired
	private LocationServiceClient locationServiceClient;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private CreditNoteTempSearchRepository cnTempSearchRepo;

	@Autowired
	private EngineService engineService;

	@Autowired
	private SalesSyncDataService salesSyncService;
	
	@Autowired
	SalesDocService salesDocService;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;
	
	@Autowired
	private BusinessDayService businessDayService;

	@Value("${app.name}")
	private String appName;

	@Autowired
	private CustomerRepositoryExt customerRepo;
	
    private static final String CUST_TAX_NO = "custTaxNo";
    private static final String MOBILE_NO = "mobileNo";
    private static final String EMAIL_ID =  "emailId";
    private static final String CUSTOMER_NAME ="customerName";
    private static final String INSTI_TAX_NO = "instiTaxNo";
    private static final String PASSPORT_ID = "passportId";
    private static final String CUST_TAX_NO_OLD = "custTaxNoOld";

	@Override
	public PagedRestResponse<List<CNResponseDto>> listCN(Integer docNo, Short fiscalYear, String mobileNo,
			String locationCode, Integer customerId, Pageable pageable) {
		// this search should happen on srccno, src docno, src fiscalyear.
		return cnFacade.listCNUsingLocation(docNo, fiscalYear, mobileNo, locationCode,null, null, null, customerId, null,
				null, null, null, null, null, null, pageable);
	}

	@Override
	public CreditNoteTransferDto transferCN(String id, String creditNoteWorkFlowType, String locationCode) {

		CreditNoteDaoExt cn = getCreditNoteBySrcLocation(id, locationCode);
		CreditNoteEpossDto epossDto = getCreditNoteDto(cn);

		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = workflowService
				.getWorkflowProcess(epossDto.getProcessId(), creditNoteWorkFlowType);

		// cn need to be pushed for pending status only

		CreditNoteTransferDao cnTransfer = saveToCreditNoteTransfer(epossDto, workflowProcessGetResponseDto);
		cn.setCnTransferId(cnTransfer.getId());
		creditNoteService.saveCNWithoutLocationChange(cn);
		return MapperUtil.getObjectMapperInstance().convertValue(cnTransfer, CreditNoteTransferDto.class);

	}

	private CreditNoteTransferDao saveToCreditNoteTransfer(CreditNoteEpossDto creditNote,
			WorkflowProcessGetResponseDto workflowProcessGetResponseDto) {
		

		CreditNoteTransferDao creditNoteTransfer = new CreditNoteTransferDao();

		creditNoteTransfer.setAmount(creditNote.getAmount());

		String cnDetails = MapperUtil.getStringFromJson(creditNote);

		creditNoteTransfer.setCnDetails(cnDetails);
		creditNoteTransfer.setSrcCnId(creditNote.getId());
		creditNoteTransfer.setDestLocationCode(workflowProcessGetResponseDto.getLocationCode());
		creditNoteTransfer.setStatus(CNTransferStatus.PENDING.toString());
		creditNoteTransfer.setSrcLocationCode(creditNote.getLocationCode());
		creditNoteTransfer.setId(UUID.randomUUID().toString());
		creditNoteTransfer.setRequestDocDate(businessDayService.getBusinessDay().getBusinessDate());
		
		
		//set doc no.
		creditNoteTransfer.setDocNo(salesDocService.getDocNumber(SalesDocTypeEnum.CN_IBT, workflowProcessGetResponseDto.getFiscalYear().shortValue()));
		//set fiscal yr
		creditNoteTransfer.setFiscalYear(workflowProcessGetResponseDto.getFiscalYear().shortValue());

		creditNoteTransfer = cnTransferRepo.save(creditNoteTransfer);
		return creditNoteTransfer;
	}

	@Override
	public CreditNoteTransferDto updateCNTransfer(String id, String creditNoteWorkFlowType, String srcBtqCode,
			String cnStatus) {
		CreditNoteTransferDao cnTransfer = getCNTransfer(id, srcBtqCode, CNTransferStatus.PENDING.toString());

		updateCNTransferStatus(cnTransfer, cnStatus, null);

		CreditNoteDaoExt cn = getCreditNoteBySrcLocation(id, CommonUtil.getLocationCode());
		
		if(cnStatus.equals(CNTransferStatus.REJECTED.toString())) {
			cn.setWorkflowStatus(null);
			cn.setProcessId(null);
		}
		cnTransfer.setTransferDocDate(businessDayService.getBusinessDay().getBusinessDate());
		cn.setStatus(CNTransferStatus.ISSUED.toString().equals(cnStatus) ? CNStatus.TRANSFER_IBT.toString()
				: CNStatus.OPEN.toString());
		
		creditNoteService.saveCN(cn);
		return MapperUtil.getObjectMapperInstance().convertValue(cnTransfer, CreditNoteTransferDto.class);

	}

	/**
	 * @param cnTransfer
	 * @param cnStatus
	 */
	private CreditNoteTransferDao updateCNTransferStatus(CreditNoteTransferDao cnTransfer, String cnStatus,
			String destCnId) {
		cnTransfer.setStatus(cnStatus);
		cnTransfer.setDestCnId(destCnId);
		return cnTransferRepo.save(cnTransfer);

	}

	@Override
	public CreditNoteTransferDto receiveCN(String id, String creditNoteWorkFlowType, String destBtqCode,
			String cnStatus, String destCnId) {
		CreditNoteTransferDao cnTransfer = getCNForDestBtq(id, destBtqCode, CNTransferStatus.ISSUED.toString(),null);
		// cn no, fis
		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = workflowService
				.getWorkflowProcess(getProcessID(cnTransfer), creditNoteWorkFlowType);

		if (!WorkflowProcessStatusEnum.APPROVED.name().equals(workflowProcessGetResponseDto.getApprovalStatus())) {
			throw new ServiceException("REQUEST_IS_NOT_APPROVED", "ERR-SALE-098",
					"Request status should be: " + WorkflowProcessStatusEnum.APPROVED.name() + ", found: "
							+ workflowProcessGetResponseDto.getApprovalStatus());
		}

		updateCNTransferStatus(cnTransfer, cnStatus, destCnId);

		return MapperUtil.getObjectMapperInstance().convertValue(cnTransfer, CreditNoteTransferDto.class);

	}

	/**
	 * @param id
	 * @param destBtqCode
	 * @param cnTransferId
	 * @param string
	 * @return
	 */
	private CreditNoteTransferDao getCNForDestBtq(String id, String destBtqCode, String status, String cnTransferId) {
		CreditNoteTransferDao cnTransfer = null;
		if (StringUtils.isEmpty(cnTransferId)) {
			cnTransfer = cnTransferRepo.findBySrcCnIdAndDestLocationCodeAndStatus(id, destBtqCode, status);
		} else {
			Optional<CreditNoteTransferDao> cnTransferOpt = cnTransferRepo.findById(cnTransferId);
			if (cnTransferOpt.isPresent())
				cnTransfer = cnTransferOpt.get();
		}

		if (cnTransfer == null) {
			throw new ServiceException("No CreditNote Found in :" + status + " status", "ERR-SALE-169");
		}

		return cnTransfer;
	}

	public CreditNoteTransferDao getCNTransfer(String id, String locationCode, String status) {
		CreditNoteTransferDao cnTransfer = cnTransferRepo.findBySrcCnIdAndSrcLocationCodeAndStatus(id, locationCode,
				status);

		if (cnTransfer == null) {
			throw new ServiceException("No CreditNote Found in :" + status + " status", "ERR-SALE-169");
		}

		return cnTransfer;
	}

	public String getProcessID(CreditNoteTransferDao cnTransfer) {
		try {
			ObjectMapper mapper = MapperUtil.getObjectMapperInstance();
			JsonNode root = mapper.readTree(cnTransfer.getCnDetails());
			return root.path("processId").asText();

		} catch (IOException e) {
			throw new ServiceException("Error while parsing Json to DAO", "ERR-CORE-045");
		}

	}

	@Override
	public CNResponeDtoExt getCN(String id, String srcBtqCode) {

		CreditNoteDaoExt creditNote = creditNoteService.findByIdAndSrcLocationCode(id, srcBtqCode);
		if (creditNote == null) {
			throw new ServiceException("CREDIT_NOTE_NOT_FOUND", ERR_SALE_154);
		}
		Boolean isEpossCn = true;
		return cnFacade.mapToResponseDto(creditNote, srcBtqCode, null, isEpossCn, null);

	}

	@Override
	public CNResponeDtoExt updateCN(String id, String creditNoteWorkFlowType, String srcBtqCode, String processID) {
		// update the CN status at src btq (pending) from destination boutique
		CreditNoteDaoExt creditNote = creditNoteService.findByIdAndSrcLocationCode(id, srcBtqCode);
		if (creditNote == null) {
			throw new ServiceException("CREDIT NOTE NOT FOUND", ERR_SALE_154);
		}

		creditNote.setWorkflowStatus(CNWorkflowStatus.PENDING_FOR_TRANSFER.toString());
		creditNote.setProcessId(processID);
		creditNote = creditNoteService.saveCNWithoutLocationChange(creditNote);
		return cnFacade.mapToResponseDto(creditNote, srcBtqCode, null, true, null);

	}

	@Override
	@Transactional
	public CreditNoteEpossDto getCreditNote(String id, String srcBtqCode) {
		CreditNoteDaoExt cn = getCreditNoteBySrcLocation(id, srcBtqCode);

		return getCreditNoteDto(cn);

	}

	private CreditNoteEpossDto getCreditNoteDto(CreditNoteDaoExt cn) {
		CreditNoteEpossDto epossDto = (CreditNoteEpossDto) MapperUtil.getDtoMapping(cn, CreditNoteEpossDto.class);

		Gson gg = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ").create();
		epossDto.setParentCn(gg.toJson(cn.getParentCn()));
		epossDto.setOriginalCn(gg.toJson(cn.getOriginalCn()));
		// get cust_transaction based on cn sales Txn

		if (epossDto.getSalesTxn() != null && epossDto.getSalesTxn().getId() != null) {
			Optional<CustomerTxnDaoExt> custmTxn = customerTxnRepo.findById(epossDto.getSalesTxn().getId());
			custmTxn.get().setMobileNumber(CryptoUtil.decrypt(custmTxn.get().getMobileNumber(),MOBILE_NO,false));
			custmTxn.get().setEmailId(CryptoUtil.decrypt(custmTxn.get().getEmailId(),EMAIL_ID,false));
			custmTxn.get().setCustomerName(CryptoUtil.decrypt(custmTxn.get().getCustomerName(),CUSTOMER_NAME,false));
			custmTxn.get().setCustTaxNo(CryptoUtil.decrypt(custmTxn.get().getCustTaxNo(),CUST_TAX_NO,false));
			custmTxn.get().setCustTaxNoOld(CryptoUtil.decrypt(custmTxn.get().getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
			custmTxn.get().setInstiTaxNo(CryptoUtil.decrypt(custmTxn.get().getInstiTaxNo(),INSTI_TAX_NO,false));
			custmTxn.get().setPassportId(CryptoUtil.decrypt(custmTxn.get().getPassportId(),PASSPORT_ID,false));

			if (!custmTxn.isPresent()) {
				throw new ServiceException("No customer found for the transaction", "ERR-SALE-075");
			}
			epossDto.setCustomerTxn(custmTxn.get());
		}

		epossDto.setGepConfigDetailsDao(cn.getGepConfigDetailsDao());
		epossDto.setAccountDetailsDao(cn.getAccountDetailsDao());
		if (cn.getCnTransferId() != null) {

			Optional<CreditNoteTransferDao> cnTransfer = cnTransferRepo.findById(cn.getCnTransferId());
			epossDto.setCreditNoteTransfer(cnTransfer.isPresent() ? cnTransfer.get() : null);
		}
		return epossDto;
	}

	private CreditNoteDaoExt getCreditNoteBySrcLocation(String id, String srcBtqCode) {
		CreditNoteDaoExt cn = creditNoteService.findByIdAndSrcLocationCode(id, srcBtqCode);

		if (cn == null) {
			throw new ServiceException("Credit note not found", "ERR_SALE_154");
		}
		return cn;
	}

	@Override
	public CreditNoteTransferDto getCNTransferResponse(String id, String destBtqCode, String cnTransferId) {
		CreditNoteTransferDao cnTransfer = getCNForDestBtq(id, destBtqCode, CNTransferStatus.ISSUED.toString(),
				cnTransferId);

		return MapperUtil.getObjectMapperInstance().convertValue(cnTransfer, CreditNoteTransferDto.class);
	}

	@Override
	@Transactional
	public CreditNoteTransferDto transferCNToEPOSS(CreditNoteRequestDto cnRequestDto) {
		CreditNoteDaoExt creditnote = MapperUtil.getObjectMapperInstance().convertValue(cnRequestDto,
				CreditNoteDaoExt.class);
		LocationFilterDto locationFilterDto = new LocationFilterDto();
		locationFilterDto.setIsMigartedFromLegacy(Boolean.TRUE);
		PagedRestResponse<List<LocationDropDownDto>> legacyLocations = locationServiceClient
				.listLocationsDropDown(locationFilterDto, Boolean.FALSE);
		Integer locationCheck = 0;
		if (!CollectionUtil.isEmpty(legacyLocations.getResults())) {
			for (LocationDropDownDto location : legacyLocations.getResults()) {
				if (location.getLocationCode().equalsIgnoreCase(cnRequestDto.getSrcLocationCode()))
					throw new ServiceException("The Source Location is already migrated to NAP", "ERR-SALE-329");
				if (location.getLocationCode().equalsIgnoreCase(cnRequestDto.getDestLocationCode()))
					locationCheck = locationCheck + 1;
			}
		}
		if (locationCheck == 0)
			throw new ServiceException("The Destination Location is not Migrated to NAP", "ERR-SALE-330");
		Integer customerId = customerService.getCustomerByIdAndLocationForLegacy(cnRequestDto);
		creditnote.setLocationCode(cnRequestDto.getSrcLocationCode());
		creditnote.setCustomerId(customerId);
		creditnote.setSrcSyncId(1);
		creditnote.setDestSyncId(1);
		creditnote.setOriginalDocDate(cnRequestDto.getDocDate());
		creditnote.setCashCollected(cnRequestDto.getCashCollected());
		creditnote.setDiscountDetails(cnRequestDto.getDiscountDetails());
		log.info("doc no.........{}",cnRequestDto.getDocNo());
		log.info("fiscal year.........{}",cnRequestDto.getFiscalYear());
		log.info("location code.........{}",cnRequestDto.getSrcLocationCode());
		CreditNoteDaoExt cn = creditNoteRepo.findByDocNoAndFiscalYearAndLocationCode(cnRequestDto.getDocNo(),
				cnRequestDto.getFiscalYear(), cnRequestDto.getSrcLocationCode());
		log.info("cn transfer........{}",cn);
		if (cn == null) {
			creditnote = creditNoteService.saveCN(creditnote);
		} else {
			throw new ServiceException("Same creditNote details are already avaialble", "ERR-SALE-066");
		}
		
		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails(cnRequestDto.getDestLocationCode());
		CreditNoteTransferDao creditNoteTransfer = new CreditNoteTransferDao();
		creditNoteTransfer.setSrcCnId(creditnote.getId());
		creditNoteTransfer.setAmount(cnRequestDto.getAmount());
		String cnDetails = MapperUtil.getStringFromJson(creditnote);
		creditNoteTransfer.setCnDetails(cnDetails);
		creditNoteTransfer.setDestLocationCode(cnRequestDto.getDestLocationCode());
		creditNoteTransfer.setStatus(CNTransferStatus.ISSUED.toString());
		creditNoteTransfer.setSrcLocationCode(cnRequestDto.getSrcLocationCode());
		//set doc no.
		creditNoteTransfer.setDocNo(salesDocService.getDocNumber(SalesDocTypeEnum.CN_IBT,countryDetailsDto.getFiscalYear().shortValue(),cnRequestDto.getDestLocationCode()));
		//set fiscal yr
		creditNoteTransfer.setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
		creditNoteTransfer.setId(UUID.randomUUID().toString());
		creditNoteTransfer = cnTransferRepo.save(creditNoteTransfer);
		creditnote.setCnTransferId(creditNoteTransfer.getId());
		creditNoteService.saveCN(creditnote);
		log.info("creditnoteDetails......{}",creditnote );
		return MapperUtil.getObjectMapperInstance().convertValue(creditNoteTransfer, CreditNoteTransferDto.class);

	}

	@Override
	public PagedRestResponse<List<CreditNoteTransferDto>> getCNTransferHistory(String searchField, String searchType,
			String status, String cnType, String destLocation, String srcLocation,
			SalesHistoryReqDtoExt creditNoteHistoryDto, Pageable pageable) {
		Page<CreditNoteTransferDto> creditNoteTransferDtoList = cnTransferRepo.listCNTransferHistory(searchField,
				searchType, status, cnType, destLocation, srcLocation, creditNoteHistoryDto, pageable);
		return new PagedRestResponse<>(creditNoteTransferDtoList);
	}

	@Override
	public CNResponseLegacyDto getCreditNoteLegacy(String id, String srcBtqCode) {
		CreditNoteDaoExt cn = getCreditNoteBySrcLocation(id, srcBtqCode);
		return getCreditNoteWithCustomer(cn);
	}

	private CNResponseLegacyDto getCreditNoteWithCustomer(CreditNoteDaoExt cn) {
		CNResponseLegacyDto cnResponse = (CNResponseLegacyDto) MapperUtil.getDtoMapping(cn,
				CNResponseLegacyDto.class,"eghsDetails","discountDetails");
		if(cn.getEghsDetails()!=null) {
			JsonData eghsDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(cn.getEghsDetails()), JsonData.class);
			cnResponse.setEghsDetails(eghsDetails);
		}
		if(cn.getDiscountDetails()!=null) {
			JsonData discountDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(cn.getDiscountDetails()), JsonData.class);
			cnResponse.setDiscountDetails(discountDetails);
		}
	
		CreditNoteTransferDao cnTransfer = cnTransferRepo.findBySrcCnId(cn.getId());
		if (cnTransfer != null)
		{
			cnResponse.setDestLocationCode(cnTransfer.getDestLocationCode());
		    cnResponse.setIbtDocNo(cnTransfer.getDocNo());
		    cnResponse.setIbtFiscalYear(cnTransfer.getFiscalYear());
		}
		Set<Integer> customerSet = new HashSet<>();
		customerSet.add(cn.getCustomerId());
		List<Object[]> customerDetailsRes = customerRepo.getCustomerNamesByIds(cn.getLocationCode(), customerSet);
		cnResponse.setCustomerName(CryptoUtil.decrypt((String) customerDetailsRes.get(0)[1], "customerName", false));
		return cnResponse;
	}

	@Override
	public BooleanResponse updateCreditNoteLegacy(String id, String srcBtqCode, String destCnId,String destLocationCode) {
		BooleanResponse cnResponse = new BooleanResponse();
		CreditNoteDaoExt cn = creditNoteService.findByIdAndSrcLocationCode(id, srcBtqCode);
		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails(destLocationCode);
		if (cn != null) {
			cn.setStatus(CNStatus.TRANSFER_IBT.name());
			cn.setIbtLocation(destLocationCode);
			creditNoteService.saveCN(cn);
			if (cn.getCnTransferId() != null) {
				
				Optional<CreditNoteTransferDao> cnTransferOptional = cnTransferRepo.findById(cn.getCnTransferId());
				if (cnTransferOptional.isPresent()) {
					cnTransferOptional.get().setStatus(CNTransferStatus.RECEIVED.name());
					cnTransferOptional.get().setDocNo(salesDocService.getDocNumber(SalesDocTypeEnum.CN_IBT,countryDetailsDto.getFiscalYear().shortValue(),destLocationCode));
					cnTransferOptional.get().setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
					cnTransferOptional.get().setTransferDocDate(businessDayService.getBusinessDay().getBusinessDate());
					cnTransferOptional.get().setRequestDocDate(businessDayService.getBusinessDay().getBusinessDate());					
					cnTransferRepo.save(cnTransferOptional.get());
					
				}
			}else {
				CreditNoteTransferDao cnTransfer =	insertCnTransfer(cn, destLocationCode);
				cnTransfer.setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
				cnTransfer.setDocNo(salesDocService.getDocNumber(SalesDocTypeEnum.CN_IBT,countryDetailsDto.getFiscalYear().shortValue(),destLocationCode));
				cnTransfer.setTransferDocDate(businessDayService.getBusinessDay().getBusinessDate());
				cnTransfer.setRequestDocDate(businessDayService.getBusinessDay().getBusinessDate());	
				cnTransfer.setStatus(CNTransferStatus.RECEIVED.name());
				cnTransferRepo.save(cnTransfer);
			}
		}
		cnResponse.setStatus(Boolean.TRUE);
		return cnResponse;
	}

	@org.springframework.transaction.annotation.Transactional
	@Override
	public CNResponeDtoExt cancelCNTransfer(String id) {
		String destLocationCode = CommonUtil.getStoreCode();
		// get transfer table details and credit note details
		CreditNoteTransferDao cnTransferDao = getCNForDestBtq(id, destLocationCode,
				CNTransferStatus.PENDING.toString(),null);

		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = workflowService
				.getWorkflowProcess(getProcessID(cnTransferDao), WorkflowTypeEnum.CREDIT_NOTE_TRANSFER.name());

		// if status is still not pending, then cannot cancel
		if (!WorkflowProcessStatusEnum.PENDING.name().equals(workflowProcessGetResponseDto.getApprovalStatus())) {
			throw new ServiceException("Request is already processed.", "ERR-SALE-106",
					"Request status should be: " + WorkflowProcessStatusEnum.PENDING.name() + ", found: "
							+ workflowProcessGetResponseDto.getApprovalStatus());
		}

		// update credit note
		CreditNoteDaoExt srcCreditNote = getCreditNoteBySrcLocation(id, cnTransferDao.getSrcLocationCode());
		String processId = srcCreditNote.getProcessId();// need process Id to close workflow

		srcCreditNote.setCnTransferId(null);
		srcCreditNote.setProcessId(null);
		srcCreditNote.setWorkflowStatus(null);
		srcCreditNote = creditNoteService.saveCNWithoutLocationChange(srcCreditNote);

		// delete cn transfer data
		cnTransferRepo.delete(cnTransferDao);

		// cancel workflow request
		// using EPOSS call as PATCH not working with feign
		epossCallService.callEposs(HttpMethod.POST, SalesUtil.WORKFLOW_PROCESS_URL + "/" + processId,
				Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.CREDIT_NOTE_TRANSFER.name()), null, Object.class);

		// doubt: datasync to destination POSS required?

		return cnFacade.mapToResponseDto(srcCreditNote, srcCreditNote.getLocationCode(), null, true, null);
	}

	@Override
	public PagedRestResponse<List<CNResponseDto>> listEPOSSCN(Integer docNo, Short fiscalYear, String locationCode,
			Pageable pageable) {
		if (docNo == null && locationCode == null) {
			throw new ServiceException("Please provide either cnNumber or locationCode", "ERR-SALE-367");
		}
		List<Integer> docNos = null;
		List<String> locationCodes = null;
		if (docNo != null) {
			List<Integer> docNosNotNull = new ArrayList<>();
			docNosNotNull.add(docNo);
			docNos = docNosNotNull;
		}
		if (locationCode != null) {
			List<String> locationCodesNotNull = new ArrayList<>();
			locationCodesNotNull.add(locationCode);
			locationCodes = locationCodesNotNull;
		}
		List<Short> fiscalYears = Arrays.asList(fiscalYear);
		return creditNoteService.getAllCNsForDirectOperations(docNos, fiscalYears, locationCodes, pageable);
	}

	@Override
	public PagedRestResponse<List<CNResponseDto>> searchCNEPOSSFile(MultipartFile reqFile, Pageable pageable) {
		List<String> locationCodes = new ArrayList<>();
		List<Integer> docNos = new ArrayList<>();
		List<Short> fiscalYears = new ArrayList<>();
		List<CreditNoteTempSearchDao> cnTempList = new ArrayList<>();
		if (reqFile != null) {
			cnTempSearchRepo.deleteAll();
			List<String[]> cnDetailsList = FileUtil.readCSVFile(reqFile, DelimiterEnum.CSV.getValue().charAt(0));
			if (CollectionUtils.isEmpty(cnDetailsList))
				throw new ServiceException("Empty file :- Please upload the file with valid data", "ERR-SALE-368");
			for (String[] record : cnDetailsList) {
				if (record.length != 3 || !Pattern.matches(RegExConstants.LOCATION_CODE_REGEX, record[0]))
					throw new ServiceException(
							"Incorrect data :- Please upload the details in the mentioned format [LocationCode,CNNumber,FiscalYear]",
							"ERR-SALE-369", Arrays.asList(record).toString());
				CreditNoteTempSearchDao cnTemp = new CreditNoteTempSearchDao();
				locationCodes.add(record[0]);
				cnTemp.setLocationCode(record[0]);
				try {
					docNos.add(Integer.parseInt(record[1]));
					cnTemp.setDocNo(Integer.parseInt(record[1]));
					fiscalYears.add(Short.parseShort(record[2]));
					cnTemp.setFiscalYear(Short.parseShort(record[2]));
				} catch (Exception e) {
					throw new ServiceException(
							"Incorrect data :- Please upload the details in the mentioned format [LocationCode,CNNumber,FiscalYear]",
							"ERR-SALE-369", Arrays.asList(record).toString());
				}
				cnTempList.add(cnTemp);
			}
			cnTempList = cnTempSearchRepo.saveAll(cnTempList);
		} else {
			cnTempList = cnTempSearchRepo.findAll();
			if (!CollectionUtil.isEmpty(cnTempList)) {
				for (CreditNoteTempSearchDao cnTemp : cnTempList) {
					locationCodes.add(cnTemp.getLocationCode());
					docNos.add(cnTemp.getDocNo());
					fiscalYears.add(cnTemp.getFiscalYear());
				}
			}
		}
		if (!CollectionUtils.isEmpty(cnTempList)) {
			return creditNoteService.getAllCNsForDirectOperations(docNos, fiscalYears, locationCodes, pageable);
		} else {
			return new PagedRestResponse<>();
		}
	}

	@Override
	public List<CNResponseDto> cnEPOSSOperation(String operation, List<String> cnIds, String destLocationCode) {

		CNOperationsEnum code = CNOperationsEnum.valueOf(operation);
		List<CNResponseDto> cnToReturn = new ArrayList<>();

		if (CollectionUtil.isEmpty(cnIds))
			throw new ServiceException("Please select at least one creditNote", "ERR-SALE-371");

		switch (code) {
		case ACTIVATE:
			cnToReturn = activateCreditNotesEposs(cnIds);
			break;
		case SUSPEND:
			cnToReturn = suspendCreditNotesEposs(cnIds);
			break;
		case TRANSFER:
			cnToReturn = transferCreditNoteEposs(cnIds, destLocationCode);
			break;
		case REMOVE_GOLD_RATE:
			cnToReturn = removeGoldRateFromCreditNotesEposs(cnIds);
			break;
		case ACTIVATE_TRANSFERRED_CNS:
			cnToReturn = activateTransferredCreditNotesEposs(cnIds);
			break;
		default:
			throw new ServiceException("Invalid creditNote Operation", "ERR-SALE-372", code);
		}
		return cnToReturn;
	}

	private List<CNResponseDto> activateCreditNotesEposs(List<String> cnIds) {
		List<CreditNoteDaoExt> creditNoteDaos = creditNoteRepo.findByIdIn(cnIds);
		if (!CollectionUtil.isEmpty(creditNoteDaos)) {
			cnStatusCheck(creditNoteDaos, CNStatus.SUSPENDED.name());
			List<CreditNoteDaoExt> cnDaoSToSavePoss = new ArrayList<>();
			List<CreditNoteDaoExt> cnDaoSToSaveEposs = new ArrayList<>();
			creditNoteDaos.forEach(cnDao -> {
				cnDao.setPublishStatus(CNPublishStatus.PUBLISH_PENDING.name());
				cnDao.setSrcSyncId(cnDao.getSrcSyncId() + 1);
				CreditNoteDaoExt cnEposs = (CreditNoteDaoExt) MapperUtil.getObjectMapping(cnDao,
						new CreditNoteDaoExt());
				cnDaoSToSaveEposs.add(cnEposs);
				cnDao.setStatus(CNStatus.OPEN.name());
				cnDaoSToSavePoss.add(cnDao);
			});
			return cnResponse(cnDaoSToSavePoss, cnDaoSToSaveEposs);
		} else {
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
		}
	}

	private List<CNResponseDto> suspendCreditNotesEposs(List<String> cnIds) {
		List<CreditNoteDaoExt> creditNoteDaos = creditNoteRepo.findByIdIn(cnIds);
		if (!CollectionUtil.isEmpty(creditNoteDaos)) {
			cnStatusCheck(creditNoteDaos, CNStatus.OPEN.name());
			cnlinkedstatusCheck(creditNoteDaos);
			cnApprovalCheck(creditNoteDaos);
			List<CreditNoteDaoExt> cnDaoSToSavePoss = new ArrayList<>();
			List<CreditNoteDaoExt> cnDaoSToSaveEposs = new ArrayList<>();
			creditNoteDaos.forEach(cnDao -> {
				cnDao.setPublishStatus(CNPublishStatus.PUBLISH_PENDING.name());
				cnDao.setSrcSyncId(cnDao.getSrcSyncId() + 1);
				CreditNoteDaoExt cnEposs = (CreditNoteDaoExt) MapperUtil.getObjectMapping(cnDao,
						new CreditNoteDaoExt());
				cnDaoSToSaveEposs.add(cnEposs);
				cnDao.setStatus(CNStatus.SUSPENDED.name());
				cnDaoSToSavePoss.add(cnDao);
			});
			return cnResponse(cnDaoSToSavePoss, cnDaoSToSaveEposs);
		} else {
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
		}
	}

	private void cnApprovalCheck(List<CreditNoteDaoExt> creditNoteDaos) {
		List<CnEpossErrorResponse> cnErrorResponse = new ArrayList<>();
		creditNoteDaos.forEach(cn -> {
			if (cn.getWorkflowStatus() != null) {
				CnEpossErrorResponse cnResponse = new CnEpossErrorResponse();
				cnResponse.setDocNo(cn.getDocNo());
				cnResponse.setLocationCode(cn.getLocationCode());
				cnResponse.setFiscalYear(cn.getFiscalYear());
				cnErrorResponse.add(cnResponse);
			}
		});
		if (!cnErrorResponse.isEmpty()) {
			throw new ServiceException(SalesConstants.ALL_CN_LINKED_APPR, SalesConstants.ERR_SALE_404, cnErrorResponse);
		}
	}

	private List<CNResponseDto> removeGoldRateFromCreditNotesEposs(List<String> cnIds) {
		List<CreditNoteDaoExt> creditNoteDaos = creditNoteRepo.findByIdIn(cnIds);
		if (!CollectionUtil.isEmpty(creditNoteDaos)) {
			cnStatusCheck(creditNoteDaos, CNStatus.OPEN.name());
			goldRateProtectedCheck(creditNoteDaos);
			cnlinkedstatusCheck(creditNoteDaos);
			cnApprovalCheck(creditNoteDaos);
			List<CreditNoteDaoExt> cnDaoSToSavePoss = new ArrayList<>();
			List<CreditNoteDaoExt> cnDaoSToSaveEposs = new ArrayList<>();
			creditNoteDaos.forEach(cnDao -> {
				cnDao.setPublishStatus(CNPublishStatus.PUBLISH_PENDING.name());
				cnDao.setSrcSyncId(cnDao.getSrcSyncId() + 1);
				CreditNoteDaoExt cnEposs = (CreditNoteDaoExt) MapperUtil.getObjectMapping(cnDao,
						new CreditNoteDaoExt());
				cnDaoSToSaveEposs.add(cnEposs);
				cnDao.setFrozenRateDetails(null);
				cnDaoSToSavePoss.add(cnDao);
			});
			return cnResponse(cnDaoSToSavePoss, cnDaoSToSaveEposs);
		} else {
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
		}
	}

	private List<CNResponseDto> activateTransferredCreditNotesEposs(List<String> cnIds) {
		List<CreditNoteDaoExt> creditNoteDaos = creditNoteRepo.findByIdIn(cnIds);
		if (!CollectionUtil.isEmpty(creditNoteDaos)) {
			cnStatusCheck(creditNoteDaos, CNStatus.SUSPENDED.name());
			cnInwardStatusCheck(creditNoteDaos);
			List<CreditNoteDaoExt> cnDaoSToSavePoss = new ArrayList<>();
			List<CreditNoteDaoExt> cnDaoSToSaveEposs = new ArrayList<>();
			creditNoteDaos.forEach(cnDao -> {
				cnDao.setPublishStatus(CNPublishStatus.PUBLISH_PENDING.name());
				cnDao.setSrcSyncId(cnDao.getSrcSyncId() + 1);
				CreditNoteDaoExt cnEposs = (CreditNoteDaoExt) MapperUtil.getObjectMapping(cnDao,
						new CreditNoteDaoExt());
				cnDaoSToSaveEposs.add(cnEposs);
				cnDao.setStatus(CNStatus.OPEN.name());
				workflowService.cancelPendingRequests(cnDao.getProcessId(),
						WorkflowTypeEnum.CREDIT_NOTE_TRANSFER.name());
				cnDaoSToSavePoss.add(cnDao);
			});
			return cnResponse(cnDaoSToSavePoss, cnDaoSToSaveEposs);
		} else {
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
		}
	}

	private void cnInwardStatusCheck(List<CreditNoteDaoExt> creditNoteDaos) {
		List<CnEpossErrorResponse> cnErrorResponse = new ArrayList<>();
		creditNoteDaos.forEach(cn -> {
			if (cn.getWorkflowStatus() == null) {
				CnEpossErrorResponse cnResponse = new CnEpossErrorResponse();
				cnResponse.setDocNo(cn.getDocNo());
				cnResponse.setLocationCode(cn.getLocationCode());
				cnResponse.setFiscalYear(cn.getFiscalYear());
				cnErrorResponse.add(cnResponse);
			}
		});
		if (!cnErrorResponse.isEmpty()) {
			throw new ServiceException(SalesConstants.ALL_CN_WORKFLOW_EXP, SalesConstants.ERR_SALE_379,
					cnErrorResponse);
		}
	}

	private void checkIfLegacyLocationAvailable(Set<String> locationSet) {
		List<String> legacyLocations = new ArrayList<>();
		locationSet.forEach(location -> {
			LocationCacheDto locationCache = engineService.getStoreLocation(location);
			if (locationCache.getIsMigratedFromLegacy() != null && !locationCache.getIsMigratedFromLegacy())
				legacyLocations.add(location);
		});
		if (!CollectionUtil.isEmpty(legacyLocations))
			throw new ServiceException("CN EPOSS operations are not allowed for legacy locations", "ERR-SALE-381");
	}

	private void cnStatusCheck(List<CreditNoteDaoExt> creditNoteDaos, String status) {
		List<CnEpossErrorResponse> cnErrorResponse = new ArrayList<>();
		creditNoteDaos.forEach(cn -> {
			if (!cn.getStatus().equals(status) || cn.getPublishStatus() != null) {
				CnEpossErrorResponse cnResponse = new CnEpossErrorResponse();
				cnResponse.setDocNo(cn.getDocNo());
				cnResponse.setLocationCode(cn.getLocationCode());
				cnResponse.setFiscalYear(cn.getFiscalYear());
				cnErrorResponse.add(cnResponse);
			}
		});
		Map<String, String> cnStatusMap = new HashMap<>();
		cnStatusMap.put("status", status);
		if (!cnErrorResponse.isEmpty()) {
			throw new ServiceException(SalesConstants.ALL_CN_STATUS, SalesConstants.ERR_SALE_376, cnErrorResponse,
					cnStatusMap);
		}
	}

	private void cnlinkedstatusCheck(List<CreditNoteDaoExt> creditNoteDaos) {
		List<CnEpossErrorResponse> cnErrorResponse = new ArrayList<>();
		creditNoteDaos.forEach(cn -> {
			if (cn.getLinkedTxn() != null && cn.getLinkedTxn().getTxnType().equals(TransactionTypeEnum.AB.toString())) {
				CnEpossErrorResponse cnResponse = new CnEpossErrorResponse();
				cnResponse.setDocNo(cn.getDocNo());
				cnResponse.setLocationCode(cn.getLocationCode());
				cnResponse.setFiscalYear(cn.getFiscalYear());
				cnErrorResponse.add(cnResponse);
			}
		});
		if (!cnErrorResponse.isEmpty()) {
			throw new ServiceException(SalesConstants.ALL_CN_LINKED_EXP, SalesConstants.ERR_SALE_378, cnErrorResponse);
		}
	}

	private void goldRateProtectedCheck(List<CreditNoteDaoExt> creditNoteDaos) {
		List<CnEpossErrorResponse> cnErrorResponse = new ArrayList<>();
		creditNoteDaos.forEach(cn -> {
			if (cn.getFrozenRateDetails() == null) {
				CnEpossErrorResponse cnResponse = new CnEpossErrorResponse();
				cnResponse.setDocNo(cn.getDocNo());
				cnResponse.setLocationCode(cn.getLocationCode());
				cnResponse.setFiscalYear(cn.getFiscalYear());
				cnErrorResponse.add(cnResponse);
			}
		});
		if (!cnErrorResponse.isEmpty()) {
			throw new ServiceException(SalesConstants.ALL_CN_GOLD_RATE, SalesConstants.ERR_SALE_377, cnErrorResponse);
		}
	}

	private List<CNResponseDto> transferCreditNoteEposs(List<String> cnIds, String destLocationCode) {
		CreditNoteDaoExt cn = cnTransferValidations(cnIds, destLocationCode);
		cn.setStatus(CNStatus.TRANSFER_IBT.name());
		cn.setSrcSyncId(cn.getSrcSyncId() + 1);
		return cnResponseForTransfer(destLocationCode, cn);
	}

	private List<CNResponseDto> cnResponseForTransfer(String destLocationCode, CreditNoteDaoExt cn) {
		Set<String> locationCodes = new HashSet<>();
		locationCodes.add(cn.getLocationCode());
		checkIfLegacyLocationAvailable(locationCodes);
		CreditNoteTransferDao cnTransfer = insertCnTransfer(cn, destLocationCode);
		cn.setCnTransferId(cnTransfer.getId());
		List<CreditNoteDaoExt> cnList = new ArrayList<>();
		cnList.add(cn);
		Map<String, List<CreditNoteDaoExt>> cnSrcMap = new HashMap<>();
		cnSrcMap.put(cn.getLocationCode(), cnList);
		try {
			if (AppTypeEnum.EPOSS.name().equalsIgnoreCase(appName)) {
				cnOperationsDataSync(cnSrcMap, cnSrcMap, SalesOperationCode.CREDIT_NOTE_EPOSS_SRC);
			}
		} catch (Exception e) {
			log.info(e.getMessage());
		}
		cnList.get(0).setPublishStatus(CNPublishStatus.PUBLISH_PENDING.name());
		cnList.get(0).setSrcSyncId(cn.getSrcSyncId() + 1);
		CreditNoteDaoExt cnDest = (CreditNoteDaoExt) MapperUtil.getObjectMapping(cnList.get(0), new CreditNoteDaoExt());
		cnDest.setLocationCode(destLocationCode);
		List<CreditNoteDaoExt> cnListDest = new ArrayList<>();
		cnListDest.add(cnDest);
		Map<String, List<CreditNoteDaoExt>> cnDestMap = new HashMap<>();
		cnDestMap.put(destLocationCode, cnListDest);
		cnSrcMap.put(destLocationCode, cnList);
		if (AppTypeEnum.EPOSS.name().equalsIgnoreCase(appName)) {
			cnOperationsDataSync(cnDestMap, cnSrcMap, SalesOperationCode.CREDIT_NOTE_EPOSS_DEST);
		}
		try {
			TimeUnit.SECONDS.sleep(3);
		} catch (Exception e) {
			log.info(e.getMessage());
		}
		List<CreditNoteDaoExt> cnAfterSave = creditNoteRepo
				.findByIdIn(Arrays.asList(cnDestMap.get(destLocationCode).get(0).getId()));
		List<CNResponseDto> cnResponseList = cnAfterSave.stream().map(cnDao -> {
			CNResponseDto cnResponse = (CNResponseDto) MapperUtil.getObjectMapping(cnDao, new CNResponseDto());
			cnCustomerNameSet(cnResponse, cnDao);
			return cnResponse;
		}).collect(Collectors.toList());
		return cnResponseList;
	}

	private CreditNoteTransferDao insertCnTransfer(CreditNoteDaoExt cn, String destLocationCode) {
		CreditNoteTransferDao creditNoteTransfer = new CreditNoteTransferDao();
		creditNoteTransfer.setAmount(cn.getAmount());
		creditNoteTransfer.setSrcCnId(cn.getId());
		creditNoteTransfer.setDestLocationCode(destLocationCode);
		creditNoteTransfer.setStatus(CNTransferStatus.ISSUED.toString());
		creditNoteTransfer.setSrcLocationCode(cn.getLocationCode());
		creditNoteTransfer.setId(UUID.randomUUID().toString());
		return cnTransferRepo.save(creditNoteTransfer);

	}

	private void cnCustomerNameSet(CNResponseDto cnResponse, CreditNoteDaoExt cnDao) {
		CustomerLocationMappingDao customerLocation = customerService.checkIfCustomerExists(cnDao.getCustomerId(),
				cnDao.getLocationCode());
		try {
			Set<Integer> customerSet = new HashSet<>();
			customerSet.add(cnDao.getCustomerId());
			List<Object[]> object = customerRepo.getCustomerNamesByIds(CommonUtil.getLocationCode(), customerSet);
			cnResponse.setCustomerName(CryptoUtil.decrypt((String) object.get(0)[1], "customerName", false));
		} catch (Exception e) {
			cnResponse.setCustomerName(customerLocation.getCustomer().getCustomerName());
			log.info(e.getMessage());
		}
	}

	private CreditNoteDaoExt cnTransferValidations(List<String> cnIds, String destLocationCode) {
		if (cnIds.size() > 1)
			throw new ServiceException("Transfer operation is allowed only for one creditNote at a time",
					"ERR-SALE-373");
		if (destLocationCode == null)
			throw new ServiceException("Please provide the destination location code", "ERR-SALE-374");
		LocationCacheDto location = engineService.getStoreLocation(destLocationCode);
		if (location.getIsMigratedFromLegacy() != null && !location.getIsMigratedFromLegacy())
			throw new ServiceException("CreditNote can't be transferred to a legacy location", "ERR-SALE-375");
		List<CreditNoteDaoExt> creditNoteDaos = creditNoteRepo.findByIdIn(cnIds);
		if (CollectionUtil.isEmpty(creditNoteDaos))
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
		if (!creditNoteDaos.get(0).getStatus().equals(CNStatus.OPEN.name())
				|| creditNoteDaos.get(0).getPublishStatus() != null)
			throw new ServiceException(SalesConstants.CREDIT_NOTE_DYNAMIC_NUMBER_SHOULD_BE_IN_OPEN_STATUS,
					SalesConstants.ERR_SALE_157,
					Map.of(SalesConstants.DOC_NO, creditNoteDaos.get(0).getDocNo().toString()));
		if (creditNoteDaos.get(0).getLinkedTxn() != null
				&& (creditNoteDaos.get(0).getLinkedTxn().getTxnType().equals(TransactionTypeEnum.AB.toString()))) {
			throw new ServiceException("Credit note linked to other transaction", "ERR-SALE-176");
		}
		return creditNoteDaos.get(0);
	}

	private List<CNResponseDto> cnResponse(List<CreditNoteDaoExt> cnDaoSToSavePoss,
			List<CreditNoteDaoExt> cnDaoSToSaveEposs) {
		Set<String> locationCodes = cnDaoSToSavePoss.stream().map(CreditNoteDaoExt::getLocationCode)
				.collect(Collectors.toSet());
		checkIfLegacyLocationAvailable(locationCodes);
		Map<String, List<CreditNoteDaoExt>> cnSyncMap = new HashMap<>();
		Map<String, List<CreditNoteDaoExt>> cnSyncMapEposs = new HashMap<>();
		locationCodes.forEach(location -> {
			List<CreditNoteDaoExt> cnLocationDaos = cnDaoSToSavePoss.stream()
					.filter(cn -> cn.getLocationCode().equalsIgnoreCase(location)).collect(Collectors.toList());
			List<CreditNoteDaoExt> cnLocationDaosEposs = cnDaoSToSaveEposs.stream()
					.filter(cn -> cn.getLocationCode().equalsIgnoreCase(location)).collect(Collectors.toList());
			cnSyncMap.put(location, cnLocationDaos);
			cnSyncMapEposs.put(location, cnLocationDaosEposs);
		});
		if (AppTypeEnum.EPOSS.name().equalsIgnoreCase(appName)) {
			cnOperationsDataSync(cnSyncMap, cnSyncMapEposs, SalesOperationCode.CREDIT_NOTE_EPOSS_OTHER);
		}
		List<CNResponseDto> cnResponseList = cnDaoSToSavePoss.stream().map(cnDao -> {
			CNResponseDto cnResponse = (CNResponseDto) MapperUtil.getObjectMapping(cnDao, new CNResponseDto());
			cnCustomerNameSet(cnResponse, cnDao);
			return cnResponse;
		}).collect(Collectors.toList());
		try {
			TimeUnit.SECONDS.sleep(3);
		} catch (Exception e) {
			log.info(e.getMessage());
		}
		return cnResponseList;
	}

	@Transactional
	private void cnOperationsDataSync(Map<String, List<CreditNoteDaoExt>> cnSyncMap,
			Map<String, List<CreditNoteDaoExt>> cnSyncMapEposs, String operation) {
		cnSyncMap.entrySet().stream().forEach(cnMap -> {
			LocationCacheDto location = engineService.getStoreLocation(cnMap.getKey());
			if (BooleanUtils.isTrue(location.getIsOffline())) {
				SyncStagingDto syncStagingDto = syncStaggingCreditNote(null, null, cnMap.getValue(), cnMap.getKey(),
						operation);
				salesSyncService.publishSalesMessagesToQueue(syncStagingDto);
				creditNoteRepo.saveAll(cnSyncMapEposs.get(cnMap.getKey()));
			} else {
				cnMap.getValue().forEach(cn -> {
					cn.setPublishStatus(null);
					if (operation.equalsIgnoreCase(SalesOperationCode.CREDIT_NOTE_EPOSS_DEST)) {
						creditNoteGenerationEposs(cn);
					}
				});
				creditNoteRepo.saveAll(cnMap.getValue());
			}
		});
	}

	private void creditNoteGenerationEposs(CreditNoteDaoExt cn) {
		// To Generate Cn in Eposs

	}

	@Transactional
	public SyncStagingDto syncStaggingCreditNote(CreditNoteDao creditNote, CreditNoteDaoExt creditNoteExt,
			List<CreditNoteDaoExt> creditNoteList, String destination, String operation) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(destination);
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
			syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 0));
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
}
