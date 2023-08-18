/*  
* Copyright 2019. Titan Company Limited
* All rights reserved.
*/

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
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
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.config.dto.request.json.AdvanceCNRuleDetails;
import com.titan.poss.config.dto.request.json.CNRuleDetails;
import com.titan.poss.core.discount.dto.DigiGoldTanishqDiscountDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.PaymentGroupEnum;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.CreditNoteStatusUpdateDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerPaymentDao;
import com.titan.poss.sales.dao.PaymentReversalDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.CustomerPaymentSyncDto;
import com.titan.poss.sales.dto.request.CreditNoteCreateDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.request.CreditNoteLinkDto;
import com.titan.poss.sales.dto.request.CreditNoteRedeemDto;
import com.titan.poss.sales.dto.request.FrozenRatesDetails;
import com.titan.poss.sales.dto.response.CNResponseDto;
import com.titan.poss.sales.dto.response.CreditNoteDiscountDetailsDto;
import com.titan.poss.sales.dto.response.CreditNoteResponse;
import com.titan.poss.sales.dto.response.GepPurityDiscountDto;
import com.titan.poss.sales.repository.CreditNoteRepository;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.CustomerPaymentRepository;
import com.titan.poss.sales.repository.CustomerRepositoryExt;
import com.titan.poss.sales.repository.PaymentReversalRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerPaymentService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.EngineService;
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
@Service("SalesCreditNoteService")
public class CreditNoteServiceImpl implements CreditNoteService {

	private static final String CREDIT_NOTE_NOT_FOUND = "No credit note found";
	private static final String ERR_SALE_154 = "ERR-SALE-154";

	private static final String ERR_SALE_174 = "ERR-SALE-174";

	private static final String VALIDATE_TXN_ERROR = "credit note linked to other transaction, can't be redeemed";

	@Autowired
	CreditNoteRepositoryExt creditNoteRepo;

	@Autowired
	CreditNoteRepository creditNoteDaoRepo;

	@Autowired
	SalesDocService salesDocService;

	@Autowired
	SalesTxnRepositoryExt salesRepoExt;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private EngineServiceClient engineClient;


	@Autowired
	private CustomerService customerService;

	@Autowired
	private CustomerRepositoryExt customerRepo;

	@Autowired
	private PaymentReversalRepositoryExt paymentReversalRepo;
	
	@Autowired
	private CustomerPaymentRepository customerPaymentRepository;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationMappingRepository;
	
	@Autowired
	private CustomerPaymentService customerPaymentService;
	
	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;
	
	@Autowired
	private SalesSyncDataService salesSyncDataService;
	
	@Value("${app.name}")
	private String appName;


	private void checkFiscalYear(Integer fiscalYear) {
		if (StringUtils.isEmpty(fiscalYear)) {
			throw new ServiceException(SalesConstants.INCORRECT_DATA_DEFINED_IN_DATABASE, SalesConstants.ERR_CORE_036,
					"Fiscal year is not defined for the current location");
		}
	}

	/**
	 * This will be called to create new CNs' from it's old CNs'
	 *
	 */
	@Override
	@Transactional
	public List<CreditNoteResponse> createNewCNFromOld(List<String> ids, CancelDaoExt cancel, Date docDate,
			Map<String, BigDecimal> utilizatedWeightMap) {

		if (CollectionUtils.isEmpty(ids))
			return List.of();

		List<CreditNoteDaoExt> cnOld = creditNoteRepo.findByIdIn(ids);
		int noOfCN = cnOld.size();

		if (noOfCN != ids.size())
			throw new ServiceException("Some credit notes are not available.", "ERR-SALE-180",
					ids.removeAll(cnOld.stream().map(CreditNoteDaoExt::getId).collect(Collectors.toList())));

		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails();
		short fiscalYear = countryDetailsDto.getFiscalYear().shortValue();

		Integer lastDocNo = salesDocService.getDocNumber(SalesDocTypeEnum.CN, fiscalYear, noOfCN);

		int startDocNo = (lastDocNo - noOfCN + 1);
		Date businessDay = null;
		if (docDate == null) {
			businessDay = businessDayService.getBusinessDay().getBusinessDate();
		} else {
			businessDay = docDate;
		}

		List<CreditNoteDaoExt> cns = new ArrayList<>();

		for (CreditNoteDaoExt cn : cnOld) {

			CreditNoteDaoExt cnNew = (CreditNoteDaoExt) MapperUtil.getDtoMapping(cn, CreditNoteDaoExt.class, "id");
			cnNew.setCancelTxn(cancel);
			cnNew.setSalesTxn(cancel.getRefSalesTxn());
			cnNew.setRefDocNo(cancel.getRefSalesTxn().getDocNo());
			cnNew.setRefDocType(cancel.getRefSalesTxn().getTxnType());
			cnNew.setFiscalYear(cancel.getRefSalesTxn().getFiscalYear());
			cnNew.setParentCn(cn);
			cnNew.setOriginalCn(cn);
			cnNew.setStatus(CNStatus.OPEN.name());
			// covers partially utilized CN
			cnNew.setAmount(cn.getUtilisedAmount());

			cnNew.setUtilisedAmount(BigDecimal.ZERO);// for new CN utilized amount is 0
			if (cn.getCashCollected() != null && cn.getCashCollected().compareTo(cn.getUtilisedAmount()) > 0) {
				cnNew.setCashCollected(cn.getUtilisedAmount());

			}

			// set frozen details if oldCN is utilized partially
			if (utilizatedWeightMap != null && utilizatedWeightMap.containsKey(cn.getId())
					&& cn.getUtilisedAmount().compareTo(cn.getAmount()) != 0
					&& StringUtil.isBlankJsonStr(cn.getFrozenRateDetails())) {
				BigDecimal utilizatedWeight = utilizatedWeightMap.get(cn.getId());
				FrozenRatesDetails frozenRateDetails = MapperUtil.mapObjToClass(
						MapperUtil.mapObjToClass(cn.getFrozenRateDetails(), JsonData.class).getData(),
						FrozenRatesDetails.class);
				// set utilized weight if only old CN weight is more than incoming weight
				if (frozenRateDetails.getWeight() != null
						&& frozenRateDetails.getWeight().compareTo(utilizatedWeight) < 0) {
					frozenRateDetails.setWeight(utilizatedWeight);
				}
				cnNew.setFrozenRateDetails(MapperUtil
						.getStringFromJson(new JsonData(SalesConstants.FROZEN_RATE_DETAILS, frozenRateDetails)));
			}

			// clear linked_txn_id
			cnNew.setLinkedTxn(null);

			cnNew.setFiscalYear(fiscalYear);
			cnNew.setDocNo(startDocNo);
			cnNew.setDocDate(businessDay);
			// for cash collected check
			cnNew.setOriginalDocDate(CancellationTypeEnum.CANCEL_WITH_RETURN.name().equals(cancel.getCancellationType())
					? cn.getOriginalDocDate()
					: businessDay);

			startDocNo++;

			cns.add(cnNew);
		}

		// saveAll
		cns = creditNoteRepo.saveAll(cns);

		// CANCEL old CN -- removed cancel of OLD CN as per UAT defect 1480

		List<CreditNoteResponse> listCNResponse = new ArrayList<>();
		cns.forEach(cn -> {
			CreditNoteResponse cnResponse = new CreditNoteResponse();

			cnResponse.setId(cn.getId());
			cnResponse.setDocNo(cn.getDocNo());
			cnResponse.setStatus(cn.getStatus());
			cnResponse.setAmount(cn.getAmount());

			listCNResponse.add(cnResponse);
		});
		return listCNResponse;
	}

	@Override
	@Transactional
	public List<CreditNoteResponse> createNewCreditNote(CreditNoteCreateDto cnCreateDto) {

		if (CollectionUtils.isEmpty(cnCreateDto.getCNIndividual()))
			return List.of();

		List<CreditNoteResponse> listCNResponse = new ArrayList<>();

		List<CreditNoteDaoExt> cns = cnCreateDto.getCNIndividual().stream().map(cnIndv -> {

			/*
			 * parentcnId,cnId, originalCNId = status= open
			 */
			// copy global fields like customerId, status, refTxnType, refTxn
			CreditNoteDaoExt cn = (CreditNoteDaoExt) MapperUtil.getDtoMapping(cnCreateDto, CreditNoteDaoExt.class);

			// adv is not needed
			if (BooleanUtils.isTrue(cnCreateDto.getIsLinkTxn()) && cnCreateDto.getSalesTxn() != null) {
				cn.setLinkedTxn(cnCreateDto.getSalesTxn());
			} else if (!StringUtils.isEmpty(cnCreateDto.getLinkedTxnDao())
					&& !StringUtils.isEmpty(cnCreateDto.getLinkedTxnDao().getId())) {
				// to link the child CN to linked txn, on partial redemption for parent CN
				cn.setLinkedTxn(cnCreateDto.getLinkedTxnDao());
			}
			// if bill cancellation set cancelDao.ref_txn_id ---to be set to cancel txn?
			if (cnCreateDto.getCancelTxn() != null) {
				cn.setCancelTxn(cnCreateDto.getCancelTxn());
				cn.setSalesTxn(cnCreateDto.getCancelTxn().getRefSalesTxn());
			}
			cn.setCreditNoteType(cnIndv.getCreditNoteType());

			cn.setParentCn(cn);
			cn.setOriginalCn(cn);

			if (!StringUtil.isBlankJsonData(cnIndv.getPaymentDetails())) {
				cn.setPaymentDetails(MapperUtil.getStringFromJson(cnIndv.getPaymentDetails()));
			} 
			log.info("payment details for unipay in create new cn-------------------------{}", cn.getPaymentDetails());
			if(BooleanUtils.isTrue(cnIndv.getIsUnipay()))
			{
				cn.setIsUnipay(true);
			}
			if (!StringUtil.isBlankJsonData(cnIndv.getGrnDetails())) {
				cn.setGrnDetails(MapperUtil.getStringFromJson(cnIndv.getGrnDetails()));
			}
			if (cnIndv.getDiscountDetails() != null)
				cn.setDiscountDetails(MapperUtil.getStringFromJson(cnIndv.getDiscountDetails()));
			cn.setGepConfigDetailsDao(cnIndv.getGepConfigDetailsDao());// GEP config details
			// copy individual field like CNType, Value
			cn = (CreditNoteDaoExt) MapperUtil.getObjectMapping(cnIndv, cn);
			// to generate doc no and fiscal year
			generateCNDetails(cn, SalesDocTypeEnum.CN, cnCreateDto.getDocDate());
			// set original docDate for new CN
			cn.setOriginalDocDate(cnIndv.getOriginalDocDate() == null ? cn.getDocDate() : cnIndv.getOriginalDocDate());

			CreditNoteDaoExt cnToReturn = setCNDetails(cn);
			if (BooleanUtils.isTrue(cnCreateDto.getIsRedemption())) {
				residualAmountCheck(cn, cnIndv.getIsFrozenRateCnToBeClosed());
			}
			cnToReturn.setStatus(cn.getStatus());
			// if child CN status is CANCELLED, then detach linked CN
			if (CNStatus.CANCELLED.name().equals(cnToReturn.getStatus())) {
				cnToReturn.setLinkedTxn(null);
			}

			return cnToReturn;

		}).collect(Collectors.toList());

		// saveAll
		creditNoteRepo.saveAll(cns);

		// change response to.
		// id
		// docno

		cns.forEach(cn -> {

			log.debug("CN Id: {}", cn.getId());

			CreditNoteResponse cnResponse = new CreditNoteResponse();

			cnResponse.setId(cn.getId());
			cnResponse.setDocNo(cn.getDocNo());
			cnResponse.setFiscalYear(cn.getFiscalYear());
			cnResponse.setStatus(cn.getStatus());
			cnResponse.setAmount(cn.getAmount());

			listCNResponse.add(cnResponse);
		});

		return listCNResponse;
	}

	private void residualAmountCheck(CreditNoteDaoExt cn, Boolean isFrozenRateCnToBeClosed) {
		RuleRequestListDto ruleRequestListDto = new RuleRequestListDto();
		ruleRequestListDto.setLocationCode(cn.getLocationCode());
		Object ruleFieldValues = engineClient.getRuleValues(cn.getCreditNoteType(), ruleRequestListDto);
		if (ruleFieldValues != null) {
			CNRuleDetails cnRule = MapperUtil.mapObjToClass(ruleFieldValues, CNRuleDetails.class);
			if (cnRule != null && !StringUtils.isEmpty(cnRule.getResidentialValueAmount())
					&& cn.getAmount().doubleValue() < Double.parseDouble(cnRule.getResidentialValueAmount())) {
				PaymentReversalDaoExt paymentReversal = new PaymentReversalDaoExt();
				paymentReversal.setAmount(cn.getAmount());
				paymentReversal.setPaymentGroup(PaymentGroupEnum.REGULAR.name());
				paymentReversal.setPaymentCode(PaymentCodeEnum.CASH.getPaymentcode());
				paymentReversal.setReversalDate(businessDayService.getBusinessDay().getBusinessDate());
				paymentReversal.setHostName(CommonUtil.getAuthUser().getHostName());
				paymentReversal.setIsResidualRefund(true);
				creditNoteRepo.save(cn);
				paymentReversal.setCreditNote(cn);
				paymentReversalRepo.save(paymentReversal);
				cn.setStatus(CNStatus.CANCELLED.name());
				setRefundAmount(cn,paymentReversal);
				
			}
		}
		// as per NAP-6396
		if (BooleanUtils.isTrue(isFrozenRateCnToBeClosed)) {
			cn.setStatus(CNStatus.CANCELLED.name());
		}
	}
	
   private void setRefundAmount(CreditNoteDaoExt creditNote,PaymentReversalDaoExt paymentReversal ) {
	   
	    CustomerPaymentDao customerPayment = new CustomerPaymentDao();
	    
		CustomerLocationMappingDao customerLocMappingDao = customerLocationMappingRepository
				.findByCustomerIdAndLocationCode(creditNote.getCustomerId(), CommonUtil.getLocationCode());
		
		if (customerLocMappingDao != null) {
			customerPayment.setId(UUID.randomUUID().toString());
			customerPayment.setCustomer(customerLocMappingDao.getCustomer());
			customerPayment.setCustomerLocationMap(customerLocMappingDao);
			customerPayment.setCustomerType(customerLocMappingDao.getCustomer().getCustomerType());
			
			String uniqueIdentifier1 = customerPaymentService.getCustomerUniqueIdentifier(customerLocMappingDao.getCustomer());
			
			String uniqueIdentifier2 = customerLocMappingDao.getCustomer().getUlpId();
			customerPayment.setCustomerIdentifier1(uniqueIdentifier1);
			customerPayment.setCustomerIdentifier2(uniqueIdentifier2);
			customerPayment.setPaymentCode(paymentReversal.getPaymentCode());
			customerPayment.setInstrumentNo(paymentReversal.getInstrumentNo());
			
			customerPayment.setInstrumentDate(creditNote.getOriginalDocDate());
			
			customerPayment.setPaidAmount(BigDecimal.ZERO.subtract(creditNote.getAmount()));
			
			customerPayment.setCashAmount(BigDecimal.ZERO.subtract(creditNote.getAmount()));
			
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
			
			if (StringUtils.isEmpty(storeDetails.getTcsDetails())
					|| StringUtils.isEmpty(storeDetails.getTcsDetails().getLocationPanNumber())) {
				throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
						SalesConstants.ERR_SALE_023,
						"Tcs details or 'locationPanNumber' is not present for the location " + CommonUtil.getLocationCode());
			}
			customerPayment.setStoreType(storeDetails.getOwnerTypeCode());
			customerPayment.setStateCode(storeDetails.getStateCode());
			customerPayment.setCountryCode(storeDetails.getCountryCode());
			customerPayment.setCompanyName(storeDetails.getStoreDetails().getCompanyName());
			customerPayment.setLocationPanNumber(storeDetails.getTcsDetails().getLocationPanNumber());		
			customerPayment=customerPaymentRepository.save(customerPayment);
		    if(customerPayment !=null) {
		    	 syncDataCustomerPayment(customerPayment);
		    }
		   
		}
   }


	private void syncDataCustomerPayment(CustomerPaymentDao customerPayment) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			List<CustomerPaymentSyncDto> syncDtoList = new ArrayList<>();
			customerPayment.setSrcSyncId(customerPayment.getSrcSyncId()==null?1:customerPayment.getSrcSyncId() + 1);
			syncDtoList.add(new CustomerPaymentSyncDto(customerPayment));
			syncDataList.add(DataSyncUtil.createSyncData(syncDtoList, 0));
			customerPaymentRepository.save(customerPayment);
			MessageRequest customerPaymentMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
					SalesOperationCode.CUSTOMER_PAYMENT_DETAILS, destinations, MessageType.FIFO.toString(),
					DestinationType.SELECTIVE.toString());
			SyncStagingDto cpStagingDto = new SyncStagingDto();
			cpStagingDto.setMessageRequest(customerPaymentMsgRequest);
			String cpMsgRequest = MapperUtil.getJsonString(customerPaymentMsgRequest);
			SyncStaging cpSyncStaging = new SyncStaging();
			cpSyncStaging.setMessage(cpMsgRequest);
			cpSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			cpSyncStaging = saleSyncStagingRepository.save(cpSyncStaging);
			cpStagingDto.setId(cpSyncStaging.getId());	
			salesSyncDataService.publishSalesMessagesToQueue(cpStagingDto);
		}
    }

	@Override
	public CreditNoteDaoExt generateCNDetails(CreditNoteDaoExt cn, SalesDocTypeEnum cnDocType, Date docDate) {
		// get fiscal year, currency code, weight unit from engine service
		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails(CommonUtil.getLocationCode());
		checkFiscalYear(countryDetailsDto.getFiscalYear());
		// doc date, location, fiscal year is generated at
		cn.setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
		cn.setDocNo(salesDocService.getDocNumber(cnDocType, countryDetailsDto.getFiscalYear().shortValue()));
		// get doc date from businessDayService
		if (docDate == null) {
			cn.setDocDate(businessDayService.getBusinessDay().getBusinessDate());
		} else {
			cn.setDocDate(docDate);
		}

		return cn;
	}

	@Override
	public CreditNoteDao generateCNDetailForDao(CreditNoteDao cn, SalesDocTypeEnum cnDocType) {
		// get fiscal year, currency code, weight unit from engine service
		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails(CommonUtil.getLocationCode());
		checkFiscalYear(countryDetailsDto.getFiscalYear());
		// doc date, location, fiscal year is generated at
		cn.setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
		cn.setDocNo(salesDocService.getDocNumber(cnDocType, countryDetailsDto.getFiscalYear().shortValue()));
		// get doc date from businessDayService
		cn.setDocDate(businessDayService.getBusinessDay().getBusinessDate());
		return cn;
	}

	/**
	 * 
	 */
	public static CreditNoteDaoExt setCNDetails(CreditNoteDaoExt cn) {
		cn.setSrcSyncId(0);
		cn.setDestSyncId(0);
		cn.setLocationCode(CommonUtil.getLocationCode());
		// Json feilds
		cn.setActivationDetails(null);
		cn.setGepDetails(null);
		cn.setGrnDetails(null);
		if (cn.getPaymentDetails() == null)
			cn.setPaymentDetails(null);
		cn.setTaxDetails(null);
		cn.setTepDetails(null);

		cn.setPrints(0);
		cn.setProcessId(null);
		cn.setStatus(CNStatus.OPEN.toString());

		cn.setUtilisedAmount(BigDecimal.ZERO);
		return cn;

	}

	@Override
	@Transactional
	public CreditNoteResponse redeemCreditNote(CreditNoteRedeemDto cnRedeemDto) {

		// for balance amount a new cn will be created.
		// if utilized amount is less than amount

		Optional<CreditNoteDaoExt> creditNoteDao = creditNoteRepo.findById(cnRedeemDto.getId());
		Map<String, List<String>> statusMap = SalesUtil.getCreditNoteStatusMap();
		if (creditNoteDao.isPresent()) {// check for open status
			CreditNoteDaoExt creditNote = creditNoteDao.get();

			if (statusMap.get(CNStatus.REDEEMED.toString()).contains(creditNote.getStatus())
					&& validateTxn(cnRedeemDto, creditNote)) {

				if (cnRedeemDto.getUtilizedAmount()
						.compareTo(creditNote.getAmount().subtract(creditNote.getUtilisedAmount())) < 0) {
					// if cn.frozenrateDetails !=null throw exception cannot be redeemed
					// update exisitng cn with utilized amount
					// update status,
					// create a new cn with

					// if cash amount > 0, then CN cash amount - cnRedeemDto.getUtilizedAmount()

					creditNote.setStatus(CNStatus.REDEEMED.toString());
					creditNote.setUtilisedAmount(creditNote.getUtilisedAmount().add(cnRedeemDto.getUtilizedAmount()));
					// Linked txn will be set only in case of AB or CO while creation of CN.
					creditNote.setRedeemDate(new Date());
					creditNoteRepo.save(creditNote); // updating existing cn

					return createCreditNoteForNewAmount(cnRedeemDto, creditNote);

				} else if (cnRedeemDto.getUtilizedAmount()
						.compareTo(creditNote.getAmount().subtract(creditNote.getUtilisedAmount())) == 0) {
					// if equals to utilized amount, redeem the cn (no new cn creation)
					// if cn.frozenrateDetails !=null throw exception cannot be redeemed.
					// update existing cn with utilized amount
					// update status,
					// create a new cn with
					creditNote.setStatus(CNStatus.REDEEMED.toString());
					creditNote.setUtilisedAmount(cnRedeemDto.getUtilizedAmount());
					creditNote.setRedeemDate(new Date());
					creditNoteRepo.save(creditNote); // updating existing cn
					return null;

				} else {
					throw new ServiceException(SalesConstants.CREDIT_NOTE_AMOUNT_IS_LESS_THAN_THE_UTILIZED_AMOUNT,
							SalesConstants.ERR_SALE_161);
				}
				// if input redeem amount, greater than then throw error.
			}
		} else {
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
		}

		return null;
	}

	/**
	 * @param cnRedeemDto
	 * @param creditNote
	 */
	private boolean validateTxn(CreditNoteRedeemDto cnRedeemDto, CreditNoteDaoExt creditNote) {
		// salesTxn.getReferenceTxn()=null && creditNote.linkedTxn() != null failure

		// salesTxn.getReferenceTxn() == creditNote.linkedTxn() success

		// salesTxn.getReferenceTxn() != creditNote.linkedTxn() failure

		// creditNote.linkedTxn() = null : success (can be redeemed in any transaction)

		// need to add null checks
		boolean flag = false;
		if ((cnRedeemDto.getSalesTxn().getRefTxnId() == null) && (creditNote.getLinkedTxn() != null)) {
			throw new ServiceException(VALIDATE_TXN_ERROR, ERR_SALE_174);
		}

		if (creditNote.getLinkedTxn() != null && cnRedeemDto.getSalesTxn().getRefTxnId() != null
				&& cnRedeemDto.getSalesTxn().getRefTxnId().getId().equals(creditNote.getLinkedTxn().getId())) {
			flag = true;
		}

		if (creditNote.getLinkedTxn() != null && cnRedeemDto.getSalesTxn().getRefTxnId() != null
				&& (!cnRedeemDto.getSalesTxn().getRefTxnId().getId().equals(creditNote.getLinkedTxn().getId()))) {
			throw new ServiceException(VALIDATE_TXN_ERROR, ERR_SALE_174);
		}

		if (creditNote.getLinkedTxn() == null) {
			flag = true;
		}

		return flag;
	}

	private CreditNoteResponse createCreditNoteForNewAmount(CreditNoteRedeemDto cnRedeemDto,
			CreditNoteDaoExt oldCreditNote) {

		// calculate cash collected for new Credit note.
		BigDecimal newCashcollected = null;
		CreditNoteResponse newCNResponse = null;
		if (oldCreditNote.getCashCollected() != null) {
			if (cnRedeemDto.getUtilizedAmount().compareTo(oldCreditNote.getCashCollected()) < 0) {
				newCashcollected = oldCreditNote.getCashCollected().subtract(cnRedeemDto.getUtilizedAmount());
			} else {
				newCashcollected = BigDecimal.ZERO;
			}
		}

		BigDecimal newCnAmount = oldCreditNote.getAmount().subtract(oldCreditNote.getUtilisedAmount());

		// TODO residual amount-- configured for a location
		// if newCnAmount is less than ResidualValue, then generate CN
		// else return cash and do enter into payment details

		// if amount is 0 no new cn should be generated

		if (newCnAmount.compareTo(BigDecimal.ZERO) != 0) {
			CreditNoteCreateDto cn = new CreditNoteCreateDto();
			cn.setSalesTxn(oldCreditNote.getSalesTxn());
			cn.setCustomerId(cnRedeemDto.getCustomerId());// doubt
			cn.setCancelTxn(oldCreditNote.getCancelTxn());

			List<CreditNoteIndvCreateDto> cnList = new ArrayList<>();

			CreditNoteIndvCreateDto creditNoteDetail = new CreditNoteIndvCreateDto();
			creditNoteDetail.setAmount(newCnAmount);
			creditNoteDetail.setCashCollected(newCashcollected);
			creditNoteDetail.setCreditNoteType(oldCreditNote.getCreditNoteType());
			// ref_doc_type is CreditNote for new credit note

			creditNoteDetail.setRemarks(cnRedeemDto.getRemarks());
			creditNoteDetail.setParentCn(oldCreditNote);
			if (oldCreditNote.getOriginalCn() == null) {
				creditNoteDetail.setOriginalCn(oldCreditNote);
			} else {
				creditNoteDetail.setOriginalCn(oldCreditNote.getOriginalCn());
			}

			// if discount is present in parent CN, then remaining discount to be carried in
			// child CN.
			checkIfDiscountToBeCarried(cnRedeemDto, oldCreditNote, creditNoteDetail);
			// frozen rate details if exists
			checkAndSetFrozenRateDetailsforCN(cnRedeemDto, oldCreditNote, newCnAmount, creditNoteDetail);
			creditNoteDetail.setOriginalDocDate(oldCreditNote.getOriginalDocDate());
			cnList.add(creditNoteDetail);
			cn.setCNIndividual(cnList);
			// linked
			cn.setLinkedTxnDao(oldCreditNote.getLinkedTxn());
			cn.setRefDocNo(oldCreditNote.getDocNo());
			cn.setRefFiscalYear(oldCreditNote.getFiscalYear());
			cn.setRefDocType("CreditNote");
			// getcndocnumber
			// call createCN with DAO instead of below.

			cn.setIsRedemption(Boolean.TRUE);
			newCNResponse = createNewCreditNote(cn).get(0);
		}
		return newCNResponse;
	}

	private void checkAndSetFrozenRateDetailsforCN(CreditNoteRedeemDto cnRedeemDto, CreditNoteDaoExt oldCreditNote,
			BigDecimal newCnAmount, CreditNoteIndvCreateDto creditNoteDetail) {
		if (cnRedeemDto.getFrozenRatesDetails() == null
				|| StringUtil.isBlankJsonStr(oldCreditNote.getFrozenRateDetails())) {
			return;
		}

		creditNoteDetail.setFrozenRateDetails(MapperUtil.getStringFromJson(
				new JsonData(SalesConstants.FROZEN_RATE_DETAILS, cnRedeemDto.getFrozenRatesDetails())));

		// residual check not mentioned for other CNs except GRF
		if (!CNType.ADV.name().equals(oldCreditNote.getCreditNoteType())) {
			return;
		}

		// if partial redemption, check for 'GRF Residual Forced Closure' and 'GRF
		// Residual Amount'
		RuleRequestListDto ruleRequestListDto = new RuleRequestListDto();
		ruleRequestListDto.setLocationCode(oldCreditNote.getLocationCode());
		Object response = engineService.getRuleFieldValues(
				RuleTypeEnum.valueOf(oldCreditNote.getCreditNoteType().toUpperCase()), ruleRequestListDto);
		// call in redemption for child CN generation.
		// pending: to handle in GRN CN
		AdvanceCNRuleDetails advanceCNRuleDetails = MapperUtil.mapObjToClass(response, AdvanceCNRuleDetails.class);
		if (StringUtils.isEmpty(advanceCNRuleDetails.getGrfResidentialClosure())
				|| advanceCNRuleDetails.getIsPercent() == null
				|| StringUtils.isEmpty(advanceCNRuleDetails.getGrfResidualValueAmount())) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"'GRF residential closure' or 'GRF residual value amount' or 'Is Percentage?' details is not present for location "
							+ oldCreditNote.getLocationCode());
		}

		// NAP-6396
		// if new CN weight is less than GRF residential closure, then child
		// CN will not be rate protected
		if (cnRedeemDto.getFrozenRatesDetails().getWeight()
				.compareTo(new BigDecimal(advanceCNRuleDetails.getGrfResidentialClosure())) <= 0) {
			creditNoteDetail.setFrozenRateDetails(null);
		}

		// if new CN amount is less than GRF residual value, then child CN will be
		// closed
		if ((BooleanUtils.isTrue(advanceCNRuleDetails.getIsPercent()) && newCnAmount.compareTo(oldCreditNote.getAmount()
				.multiply(new BigDecimal(advanceCNRuleDetails.getGrfResidualValueAmount()).divide(new BigDecimal(100)))
				.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE)) <= 0)
				|| (BooleanUtils.isFalse(advanceCNRuleDetails.getIsPercent()) && newCnAmount
						.compareTo(new BigDecimal(advanceCNRuleDetails.getGrfResidualValueAmount())) <= 0)) {
			creditNoteDetail.setIsFrozenRateCnToBeClosed(true);
		}

	}

	private void checkIfDiscountToBeCarried(CreditNoteRedeemDto cnRedeemDto, CreditNoteDaoExt oldCreditNote,
			CreditNoteIndvCreateDto creditNoteDetail) {
		// below point from NAP-8580:
		// In Case of Partial Redemption- remaining deduction amount to be carry
		// forwarded as new credit note(Child Credit note)
		// If above Child Credit note is partially utilized in next upcoming
		// transaction, the new Credit note generated won�t be eligible for any offer.
		if (StringUtil.isBlankJsonStr(oldCreditNote.getDiscountDetails())
				|| oldCreditNote.getId().equals(oldCreditNote.getParentCn().getId())) {
			return;
		}
		CreditNoteDiscountDetailsDto cnDiscounts = MapperUtil.mapObjToClass(oldCreditNote.getDiscountDetails(),
				CreditNoteDiscountDetailsDto.class);
		// carry discount only for GEP Exchange Offer
		if (!CollectionUtils.isEmpty(cnDiscounts.getGepPurityDiscount()) && BigDecimal.ZERO.compareTo(cnDiscounts.getGepPurityDiscount().get(0).getGepItemPurity())!=0) {
			BigDecimal utilzationFactor = cnRedeemDto.getUtilizedAmount().divide(oldCreditNote.getAmount(),
					DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);
			for (GepPurityDiscountDto gepDiscount : cnDiscounts.getGepPurityDiscount()) {
				// discountValue = discountValue - (discountValue*utlzFactor)
				gepDiscount.setDiscountValue(gepDiscount.getDiscountValue()
						.subtract(gepDiscount.getDiscountValue().multiply(utilzationFactor)
								.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE)));
			}

			// set discount json to new CN - carry GEP discount only
			creditNoteDetail.setDiscountDetails(new JsonData("CN_DISCOUNT_DETAILS",
					Map.of("gepPurityDiscount", cnDiscounts.getGepPurityDiscount())));
			creditNoteDetail.setGepConfigDetailsDao(oldCreditNote.getGepConfigDetailsDao());
		}
		if (cnDiscounts.getDigiGoldDiscount() != null) {
			DigiGoldTanishqDiscountDto digiGoldDiscount = cnDiscounts.getDigiGoldDiscount();
			BigDecimal utilzationFactor = cnRedeemDto.getUtilizedAmount().divide(oldCreditNote.getAmount(),
					DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);
			digiGoldDiscount.setDiscountValue(digiGoldDiscount.getDiscountValue()
					.subtract(digiGoldDiscount.getDiscountValue().multiply(utilzationFactor)
							.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE)));
			creditNoteDetail.setDiscountDetails(
					new JsonData("CN_DISCOUNT_DETAILS", Map.of("digiGoldDiscount", digiGoldDiscount)));
		}

		// carry GHS(Rivaah discount only) to child CN
		if (cnDiscounts.getGhsAccountDiscount() != null && DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name()
				.equals(cnDiscounts.getGhsAccountDiscount().getDiscountType())) {
			creditNoteDetail.setDiscountDetails(new JsonData("CN_DISCOUNT_DETAILS",
					Map.of("ghsAccountDiscount", cnDiscounts.getGhsAccountDiscount())));
		}

	}

	@Override
	@org.springframework.transaction.annotation.Transactional
	public Map<String, Integer> linkCreditNote(CreditNoteLinkDto cnLinkDto) {
		Map<String, Integer> docNumberMap = new HashMap<>();
		// bulk update to credit-notes
		List<CreditNoteDaoExt> creditNotes = creditNoteRepo.findByLinkedTxnIdAndStatus(cnLinkDto.getLinkedTxn().getId(),
				CNStatus.OPEN.name());
		for (CreditNoteDaoExt creditNote : creditNotes) {
			creditNote.setLinkedTxn(null);
		}
		creditNoteRepo.saveAll(creditNotes);
		return docNumberMap;
	}

	@Override
	public void cancelCreditNotes(List<CreditNoteDaoExt> cns) {

		if (CollectionUtils.isEmpty(cns))
			return;

		for (CreditNoteDaoExt cn : cns) {
			cn.setStatus(CNStatus.CANCELLED.name());
		}
		creditNoteRepo.saveAll(cns);
	}

	@Override
	public List<CreditNoteDaoExt> getCreditNotesByTxnId(String txnId) {
		Optional<SalesTxnDaoExt> salesTnx = salesRepoExt.findById(txnId);
		if (salesTnx.isPresent()) {
			return creditNoteRepo.findByLinkedTxn(salesTnx.get().getId());
		} else {
			throw new ServiceException("Sales transaction not found", "Invalid Transaction");
		}

	}

	@Override
	public List<CreditNoteDaoExt> getCreditNotesBySalesTxn(SalesTxnDaoExt salesTxn) {
		return creditNoteRepo.findBySalesTxnId(salesTxn.getId());
	}

	@Override
	public void cancelCnByTxnId(String txnId) {

		List<CreditNoteDaoExt> cns = getCreditNotesByTxnId(txnId);
		List<Integer> cnsNotInOpenState = cns.stream().filter(cn -> !cn.getStatus().equals(CNStatus.OPEN.name()))
				.map(CreditNoteDaoExt::getDocNo).collect(Collectors.toList());
		if (!cnsNotInOpenState.isEmpty()) {
			throw new ServiceException("Some credit note(s) for this transaction are not in OPEN state", "ERR-SALE-087",
					cnsNotInOpenState);
		}
		cancelCreditNotes(cns);
	}

	@Override
	public List<Object[]> listAllCreditNotes(Integer docNo, Short fiscalYear, String mobileNo, String locationCode,Boolean isUnipay,
			String cnType, String linkedTxnId, Integer customerId, List<String> statusList, Set<String> idList,
			Boolean isFrozenRateCnRequired, String transactionId, Date fromDate, Date toDate, Pageable pageable) {
		if (locationCode == null) {
			locationCode = CommonUtil.getLocationCode();
		}
		return creditNoteRepo.listAllCreditNotes(docNo, fiscalYear, mobileNo, locationCode, isUnipay,cnType, linkedTxnId,
				customerId, statusList, idList, transactionId, isFrozenRateCnRequired, fromDate, toDate,
				pageable.getPageSize() * pageable.getPageNumber(), pageable.getPageSize());
	}

	@Override
	public CreditNoteDaoExt findByIdAndLocationCode(String id, String locationCode) {
		return creditNoteRepo.findByIdAndLocationCode(id, locationCode);
	}

	@Override
	public List<CreditNoteDaoExt> findAllByMergedCNIdAndLocationCode(String mergedCN, String locationCode) {
		return creditNoteRepo.findAllByMergedCNIdAndLocationCode(mergedCN, locationCode);
	}

	@Override
	public CreditNoteDaoExt getByIdAndLocationCode(String id, String locationCode) {
		CreditNoteDaoExt cn = findByIdAndLocationCode(id, locationCode);
		if (cn == null)
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
		return cn;
	}

	@Override
	public CreditNoteDaoExt saveCN(CreditNoteDaoExt creditNoteDao) {
		return creditNoteRepo.save(creditNoteDao);
	}

	@Override
	public Map<String, CreditNoteDaoExt> transferGHSCN(CreditNoteDaoExt creditNote, BigDecimal transferAmount) {
		CreditNoteDaoExt newCreditNote = null;
		CreditNoteDaoExt balanceAmtCn = null;
		Map<String, CreditNoteDaoExt> cnMap = new HashMap<>();
		if (transferAmount.compareTo(creditNote.getAmount().subtract(creditNote.getUtilisedAmount())) < 0) {

			BigDecimal balanceAmount = creditNote.getAmount().subtract(creditNote.getUtilisedAmount())
					.subtract(transferAmount);
			BigDecimal utilizedAmount = creditNote.getAmount().subtract(creditNote.getUtilisedAmount());

			// create new cn with eghs amount
			newCreditNote = (CreditNoteDaoExt) MapperUtil.getDtoMapping(creditNote, CreditNoteDaoExt.class);

			newCreditNote.setAmount(transferAmount);
			newCreditNote.setId(null);
			newCreditNote.setStatus(CNStatus.OPEN.toString());
			generateCNDetails(newCreditNote, SalesDocTypeEnum.CN, null);
			newCreditNote = creditNoteRepo.save(newCreditNote);

			// create new cn for remaining amount, with new doc number.
			if (balanceAmount.compareTo(BigDecimal.ZERO) > 0) {
				balanceAmtCn = createCNforEghsTransferBalanceAmount(creditNote, balanceAmount);
				cnMap.put("balanceAmtCn", balanceAmtCn);
			}

			// set current cn to REDEEMED.
			creditNote.setStatus(CNStatus.REDEEMED.toString());
			creditNote.setUtilisedAmount(utilizedAmount);
			creditNote.setRedeemDate(new Date());
			creditNoteRepo.save(creditNote);
		} else if (transferAmount.compareTo(creditNote.getAmount().subtract(creditNote.getUtilisedAmount())) == 0) {
			// update cn to transfercn
			creditNote.setUtilisedAmount(creditNote.getAmount().subtract(creditNote.getUtilisedAmount()));
			newCreditNote = creditNoteRepo.save(creditNote);
		} else {
			throw new ServiceException("Credit note amount is less than the eghsTransfer amount",
					SalesConstants.ERR_SALE_161);
		}
		cnMap.put("newCreditNote", newCreditNote);

		return cnMap;
	}

	private CreditNoteDaoExt createCNforEghsTransferBalanceAmount(CreditNoteDaoExt creditNote,
			BigDecimal balanceAmount) {
		CreditNoteDaoExt balanceAmtCreditNote;
		balanceAmtCreditNote = (CreditNoteDaoExt) MapperUtil.getDtoMapping(creditNote, CreditNoteDaoExt.class);

		balanceAmtCreditNote.setAmount(balanceAmount);
		balanceAmtCreditNote.setId(UUID.randomUUID().toString());
		balanceAmtCreditNote.setStatus(CNStatus.OPEN.toString());
		generateCNDetails(balanceAmtCreditNote, SalesDocTypeEnum.CN, null);
		balanceAmtCreditNote.setIsTransferEghsAllowed(Boolean.FALSE);
		return creditNoteRepo.save(balanceAmtCreditNote);
	}

	@Override
	public CreditNoteDaoExt findByIdAndSrcLocationCode(String id, String srcBtqCode) {
		return creditNoteRepo.findByIdAndLocationCode(id, srcBtqCode);
	}

	@Override
	public Integer getTotalCount(Integer docNo, Short fiscalYear, String mobileNo, String locationCode, Boolean isUnipay, String cnType,
			String linkedTxnId, Integer customerId, List<String> statusList, String transactionId,
			Boolean isFrozenRateCnRequired, Date fromDate, Date toDate) {
		if (locationCode == null) {
			locationCode = CommonUtil.getLocationCode();
		}
		return creditNoteRepo.countCNList(docNo, fiscalYear, mobileNo, locationCode,isUnipay, cnType, linkedTxnId, customerId,
				statusList, transactionId, isFrozenRateCnRequired, fromDate, toDate);
	}

	@Override
	public CreditNoteDaoExt saveCNWithoutLocationChange(CreditNoteDaoExt creditNote) {
		return creditNoteRepo.save(creditNote);
	}

	@Override
	public List<CreditNoteDaoExt> findByIdInAndLocationCode(List<String> ids, String locationCode) {
		return creditNoteRepo.findByIdInAndLocationCode(ids, locationCode);
	}

	@Override
	public CreditNoteDao saveCNDao(CreditNoteDao creditNote) {

		creditNote.setLocationCode(CommonUtil.getLocationCode());
		return creditNoteDaoRepo.save(creditNote);

	}

	@Override
	public List<Object[]> listOpenCreditNotes(Integer docNo, Short fiscalYear, String mobileNo, Integer customerId,
			Pageable pageable,Boolean isUnipay) {

		List<String> statusList = new ArrayList<>();
		statusList.add(CNStatus.OPEN.toString());
//		return creditNoteRepo.listAllCreditNotes(docNo, fiscalYear, mobileNo, CommonUtil.getLocationCode(),isUnipay, null, null,
//				customerId, statusList, null, null, true, pageable.getPageSize() * pageable.getPageNumber(),
		return creditNoteRepo.listAllCreditNotes(docNo, fiscalYear, mobileNo, CommonUtil.getLocationCode(),isUnipay, null, null,
				customerId, statusList, null, null, true, null, null, pageable.getPageSize() * pageable.getPageNumber(),
				pageable.getPageSize());

	}

	@Override
	public int getOpenCNCount(Integer docNo, Short fiscalYear, String mobileNo, Integer customerId, Boolean isUnipay) {
		List<String> statusList = new ArrayList<>();
		statusList.add(CNStatus.OPEN.toString());
		return creditNoteRepo.countCNList(docNo, fiscalYear, mobileNo, CommonUtil.getLocationCode(), isUnipay, null,null,
				customerId, statusList, null, null, null, null);
	}

	@Override
	public CNResponseDto getGrfCN(Integer docNo, Short fiscalYear, String locationCode) {
		// grf doc number, grf fiscal year, location code

		List<Object[]> result = creditNoteRepo.getGrfCN(docNo, fiscalYear, locationCode);

		return mapToReponse(result);
	}

	/**
	 * @param reponse
	 * @return
	 */
	private CNResponseDto mapToReponse(List<Object[]> results) {

		List<CNResponseDto> creditNotResponseList = new ArrayList<>();
		for (Object[] result : results) {
			CNResponseDto creditNote = new CNResponseDto();
			creditNote.setId((String) result[0]);
			creditNote.setDocNo((Integer) result[1]);
			creditNote.setFiscalYear((Short) result[2]);
			creditNote.setCustomerName(CryptoUtil.decrypt((String) result[3], "customerName", false));
			creditNote.setCustomerId((Integer) result[4]);
			creditNote.setLocationCode((String) result[5]);
			creditNote.setCreditNoteType((String) result[6]);
			creditNote.setDocDate((Date) result[7]);
			creditNote.setAmount((BigDecimal) result[8]);
			creditNote.setStatus((String) result[9]);
			creditNote.setLinkedTxnType((String) result[10]);
			creditNote.setMobileNumber(CryptoUtil.decrypt((String) result[11], "mobileNo", false));
			creditNote.setLinkedTxnId((String) result[12]);
			creditNote.setWorkflowStatus((String) result[13]);
			creditNote.setFrozenRateDetails(MapperUtil.getJsonFromString((String) result[14]));
			creditNote.setUtilisedAmount((BigDecimal) result[15]);
			creditNote.setCashCollected((BigDecimal) result[16]);
			creditNote.setMergedCNId((String) result[17]);

			creditNotResponseList.add(creditNote);
		}
		if (creditNotResponseList.isEmpty()) {
			throw new ServiceException("No Creditnote found for the grf docnumber", ERR_SALE_154);
		}

		return creditNotResponseList.get(0);
	}

	@Override
	public void saveAllCNs(List<CreditNoteDaoExt> creditNotes) {
		creditNoteRepo.saveAll(creditNotes);
	}

	@Override
	public CreditNoteDaoExt findByDocNoAndFiscalYearAndLocationCode(CreditNoteStatusUpdateDto creditNote) {

		return creditNoteRepo.findByDocNoAndFiscalYearAndLocationCode(creditNote.getDocNo(), creditNote.getFiscalYear(),
				CommonUtil.getLocationCode());
	}

	@Override
	public CreditNoteDao saveCNDaoWithOutLocationChange(CreditNoteDao creditNote) {
		return creditNoteDaoRepo.save(creditNote);
	}

	@Override
	public PagedRestResponse<List<CNResponseDto>> getAllCNsForDirectOperations(List<Integer> docNos,
			List<Short> fiscalYears, List<String> locationCodes, Pageable pageable) {
		Page<CreditNoteDaoExt> cnDaos = creditNoteRepo.getAllCNsForDirectOperations(docNos, fiscalYears, locationCodes,
				pageable);
		if (cnDaos != null && !cnDaos.isEmpty()) {
			List<CNResponseDto> cnResponseList = cnDaos.getContent().stream().map(cnDao -> {
				CNResponseDto cnResponse = (CNResponseDto) MapperUtil.getObjectMapping(cnDao, new CNResponseDto());
				CustomerLocationMappingDao customerLocation = customerService
						.checkIfCustomerExists(cnDao.getCustomerId(), cnDao.getLocationCode());
				if (cnDao.getLinkedTxn() != null
						&& cnDao.getLinkedTxn().getTxnType().equals(TransactionTypeEnum.AB.toString())) {
					cnResponse.setLinkedTxnId(cnDao.getLinkedTxn().getId());
					cnResponse.setLinkedTxnType(cnDao.getLinkedTxn().getTxnType());
				}
				if (cnDao.getPublishStatus() != null)
					cnResponse.setStatus(cnDao.getPublishStatus());
				try {
					Set<Integer> customerSet = new HashSet<>();
					customerSet.add(customerLocation.getCustomerLocationMappingId().getCustomerId());
					List<Object[]> customerDetailsRes = customerRepo.getCustomerNamesByIds(
							customerLocation.getCustomerLocationMappingId().getLocationCode(), customerSet);
					cnResponse.setCustomerName(
							CryptoUtil.decrypt((String) customerDetailsRes.get(0)[1], "customerName", false));
				} catch (Exception e) {
					cnResponse.setCustomerName(customerLocation.getCustomer().getCustomerName());
					log.info(e.getMessage());
				}
				return cnResponse;
			}).collect(Collectors.toList());
			return new PagedRestResponse<>(cnResponseList, cnDaos);
		} else {
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154);
		}
	}
}
