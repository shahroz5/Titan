/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TepLegacyUpdateDto;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.DocNumberFailAuditDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeOffersDaoExt;
import com.titan.poss.sales.dao.PaymentReversalDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dao.StockTransactionDaoExt;
import com.titan.poss.sales.dao.StockTransactionDetailsDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.CreditNoteSyncDtoExt;
import com.titan.poss.sales.dto.CustomerDocumentSyncDto;
import com.titan.poss.sales.dto.CustomerTxnSyncDtoExt;
import com.titan.poss.sales.dto.GoodExchangeOffersyncDtoExt;
import com.titan.poss.sales.dto.GoodsExchangeDetailsSyncDtoExt;
import com.titan.poss.sales.dto.GoodsExchangeSyncDtoExt;
import com.titan.poss.sales.dto.GoodsExhangeDaoDto;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.PaymentReversalSyncDtoExt;
import com.titan.poss.sales.dto.SalesTxnSyncDtoExt;
import com.titan.poss.sales.dto.TaxDetailsListDto;
import com.titan.poss.sales.dto.TepCashRefundLimitResponseDto;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.GepConfirmOrHoldDto;
import com.titan.poss.sales.dto.request.GepUpdateDto;
import com.titan.poss.sales.dto.request.GoodExchangeRequestConfirmDto;
import com.titan.poss.sales.dto.response.CmDetailsResponseDto;
import com.titan.poss.sales.dto.response.CmForCustomerResponseDto;
import com.titan.poss.sales.dto.response.CoinOfferDiscountDto;
import com.titan.poss.sales.dto.response.GepAndItemIdDetailsResponseDto;
import com.titan.poss.sales.dto.response.GepPurityDiscountDto;
import com.titan.poss.sales.dto.response.GepResponseDto;
import com.titan.poss.sales.dto.response.GoodExchangeDiscountDetailsDto;
import com.titan.poss.sales.dto.response.GoodsExchangeDiscountResponseDto;
import com.titan.poss.sales.dto.response.KaratExchangeDiscountDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.dto.response.TransactionResponseDto;
import com.titan.poss.sales.inventory.service.StockTransactionService;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.repository.CustomerPaymentRepositoryExt;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.DocNumberFailAuditDaoRepositoryExt;
import com.titan.poss.sales.repository.GoodsExchangeDetailsRepositoryExt;
import com.titan.poss.sales.repository.GoodsExchangeOffersRepositoryExt;
import com.titan.poss.sales.repository.PaymentReversalRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CommonTxnSycnService;
import com.titan.poss.sales.service.GepService;
import com.titan.poss.sales.service.GoodsExchangeFacade;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.service.TepService;
import com.titan.poss.sales.utils.DocNoFailAuditThreadLocal;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Slf4j
@Service("goodsExchangeFacade")
public class GoodsExchangeFacadeImpl implements GoodsExchangeFacade {

	private static final String CONFIRM = "_CONFIRM";
	private static final String CUST_TAX_NO = "custTaxNo";
	private static final String MOBILE_NO = "mobileNo";
	private static final String EMAIL_ID =  "emailId";
	private static final String CUSTOMER_NAME ="customerName";
	private static final String INSTI_TAX_NO = "instiTaxNo";
	private static final String PASSPORT_ID = "passportId";
	private static final String CUST_TAX_NO_OLD = "custTaxNoOld";


	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private GoodsExchangeFacade goodsExcFacade;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private GepService gepService;

	@Autowired
	private CustomerDocumentsRepository customerDocumentRepo;

	@Autowired
	private TepService tepService;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private GoodsExchangeDetailsRepositoryExt goodsExchangeDetailsRepo;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepository;

	@Autowired
	private CustomerTxnRepositoryExt customerTxnRepo;

	@Autowired
	private GoodsExchangeOffersRepositoryExt goodsExhangeOfferRepo;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;
	
	@Autowired
	private StockTransactionService stockTransactionService;

	@Autowired
	private PaymentReversalRepositoryExt paymentReversalRepo;
	
	@Autowired
	private DocNumberFailAuditDaoRepositoryExt docNumberFailAuditDaoRepositoryExt;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired 
	private CustomerPaymentRepositoryExt customerPaymentRepositoryExt;

	@Value("${app.name}")
	private String appName;
	
	@Autowired
	private EngineServiceClient engineClient;
	
	@Autowired
	private CommonTxnSycnService commonTxnSycnService;
	
	@Override
	@Transactional
	public TransactionResponseDto openGoodsExchange(String txnType, String subTxnType,
			TransactionCreateDto transactionCreateDto) {
		SalesTxnDaoExt salesDaoExt = new SalesTxnDaoExt();
		// validation for txn type(GEP,TEP) & sub txn
		// type(NEW_GEP,MANUAL_GEP,NEW_TEP,MANUAL_TEP)
		commonTransactionService.txnTypeAndSubTxnTypeValidation(txnType, subTxnType);
		if (TransactionTypeEnum.GEP.toString().equals(txnType)) {
			salesDaoExt = gepService.createOpenGep(txnType, subTxnType, transactionCreateDto);
		} else if (TransactionTypeEnum.TEP.toString().equals(txnType)) {
			salesDaoExt = tepService.createOpenTep(txnType, subTxnType, transactionCreateDto);
		}
		TransactionResponseDto transactionResponseDto = (TransactionResponseDto) MapperUtil.getDtoMapping(salesDaoExt,
				TransactionResponseDto.class);
		if (SubTxnTypeEnum.allowedTxnTypeOfManualGoodsExchange().contains(subTxnType)) {
			transactionResponseDto.setManualBillDetails(
					commonTransactionService.mapJsonToManualBillDetails(salesDaoExt.getManualBillDetails()));
		}
		return transactionResponseDto;
	}

	@Override
	public GepAndItemIdDetailsResponseDto getGoodsExchange(String id, String txnType, String subTxnType,
			Boolean recalculationRequired,Boolean isTepException) {
		commonTransactionService.txnTypeAndSubTxnTypeValidation(txnType, subTxnType);
		GoodsExchangeDaoExt goodsExchangeDaoExt = new GoodsExchangeDaoExt();
		if (recalculationRequired == null)
			recalculationRequired = false;
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = new ArrayList<>();
		if (TransactionTypeEnum.GEP.toString().equals(txnType)) {
			goodsExchangeDaoExt = gepService.getGoodsExchangeByIdAndTxnTypeAndSubTxnType(id, txnType, subTxnType);
			goodsExchangeDetailsList = gepService.getGoodsExchangeDetails(goodsExchangeDaoExt);
		} else if (TransactionTypeEnum.TEP.toString().equals(txnType)) {
			if(SubTxnTypeEnum.CUT_PIECE_TEP.name().equals(subTxnType)) {
				StockTransactionDaoExt stockTransaction = stockTransactionService.getSalesStockTransaction(id, subTxnType,
						CommonUtil.getLocationCode());
				List<StockTransactionDetailsDaoExt> stockTxnList = stockTransactionService
						.getSalesListStockTransaction(stockTransaction);
				GepAndItemIdDetailsResponseDto cutPeiceTepResponse = commonTransactionService
						.getCutPeiceGoodsExchangeAndItemIdDetails(stockTransaction, stockTxnList);
				cutPeiceTepResponse.setIsRecalculated(recalculationRequired);
				return cutPeiceTepResponse;
			}
			goodsExchangeDaoExt = tepService.getGoodsExchangeByIdAndTxnTypeAndSubTxnType(id, txnType, subTxnType);
			goodsExchangeDetailsList = tepService.getGoodsExchangeDetails(goodsExchangeDaoExt);
			MetalRateListDto newMetalRateListDto = commonTransactionService.getMetalRate();
			if ((SubTxnTypeEnum.FULL_VALUE_TEP.name().equals(subTxnType)
					|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.name().equals(subTxnType)) && recalculationRequired) {
				tepService.validateAndRecalculateFullValueTep(goodsExchangeDaoExt, goodsExchangeDetailsList,
						newMetalRateListDto, recalculationRequired);
			}
			
			if (BooleanUtils.isTrue(isTepException) && recalculationRequired) {
				tepService.validateAndRecalculateTepException(goodsExchangeDaoExt, goodsExchangeDetailsList,
						newMetalRateListDto, recalculationRequired);
			}
			
		}
		GepAndItemIdDetailsResponseDto response = commonTransactionService
				.getGoodsExchangeAndItemIdDetails(goodsExchangeDaoExt, goodsExchangeDetailsList);
		response.setIsRecalculated(recalculationRequired);
		
		return response;
	}

	@Override
	@Transactional
	public GepResponseDto updateGoodsExchange(String id, String txnType, String subTxnType, GepUpdateDto gepUpdateDto) {
		commonTransactionService.txnTypeAndSubTxnTypeValidation(txnType, subTxnType);
		GoodsExchangeDaoExt goodsExchangeDao = new GoodsExchangeDaoExt();
		if (TransactionTypeEnum.GEP.toString().equals(txnType)) {
			goodsExchangeDao = gepService.updateGoodsExchange(id, txnType, subTxnType, gepUpdateDto);
		} else if (TransactionTypeEnum.TEP.toString().equals(txnType)) {
			goodsExchangeDao = tepService.updateGoodsExchange(id, txnType, subTxnType, gepUpdateDto);
		}
		return getGepResponseObj(goodsExchangeDao, null, null,null);
	}

	private GepResponseDto getGepResponseObj(GoodsExchangeDaoExt goodsExchangeDao, Integer cnDocNo, Date refDocDate,Integer ReqDocNo) {
		GepResponseDto gepResponseDto = (GepResponseDto) MapperUtil.getDtoMapping(goodsExchangeDao,
				GepResponseDto.class);
		MapperUtil.beanMapping(goodsExchangeDao.getSalesTxn(), gepResponseDto);
		if (goodsExchangeDao.getSalesTxn().getCustomerDocDetails() != null) {
			gepResponseDto.setApprovalDetails(
					MapperUtil.getJsonFromString(goodsExchangeDao.getSalesTxn().getCustomerDocDetails()));
		}
	    gepResponseDto.setReqDocNo(ReqDocNo);		
		MetalRateListDto metalRateList = null;
		if (!StringUtils.isEmpty(goodsExchangeDao.getSalesTxn().getMetalRateDetails())) {
			metalRateList = commonTransactionService
					.mapMetalRateJsonToDto(goodsExchangeDao.getSalesTxn().getMetalRateDetails());
		}
		gepResponseDto.setTaxDetails(MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(goodsExchangeDao.getTaxDetails()), TaxDetailsListDto.class));
		gepResponseDto.setMetalRateList(metalRateList);
		// manual bill details
		if (!StringUtils.isEmpty(goodsExchangeDao.getSalesTxn().getManualBillDetails())) {
			ManualBillTxnDetailsDto manualBillDetails = commonTransactionService
					.mapJsonToManualBillDetails(goodsExchangeDao.getSalesTxn().getManualBillDetails());
			gepResponseDto.setManualBillDetails(manualBillDetails);
		}
		gepResponseDto.setRefundDetails(MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(goodsExchangeDao.getRefundDetails()), JsonData.class));
		gepResponseDto.setCnDocNo(cnDocNo);
		gepResponseDto.setRefDocDate(refDocDate);
		gepResponseDto.setTepExceptionDetails(goodsExchangeDao.getTepExceptionDetails());
		return gepResponseDto;
	}

	@Override
	public PublishResponse confirmGoodsExchangeTransactional(String id, String status, String txnType,
			String subTxnType, GepConfirmOrHoldDto gepConfirmOrHoldDto) {
		GoodsExhangeDaoDto goodsDaoDto = new GoodsExhangeDaoDto();
		commonTransactionService.txnTypeAndSubTxnTypeValidation(txnType, subTxnType);
		commonTransactionService.checkInputStatus(status, subTxnType);
		if (TransactionTypeEnum.GEP.toString().equals(txnType)) {
			goodsDaoDto = gepService.confirmGep(id, status, txnType, subTxnType, gepConfirmOrHoldDto);
		} else if (TransactionTypeEnum.TEP.toString().equals(txnType)) {
			goodsDaoDto = tepService.confirmTep(id, status, txnType, subTxnType, gepConfirmOrHoldDto);
		}
		SyncStagingDto syncDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName) && TransactionStatusEnum.CONFIRMED.name().equals(status))
			syncDto = gepSyncStagging(goodsDaoDto.getGoodsExchange(), goodsDaoDto.getInventoryList(),
					txnType + CONFIRM);
		PublishResponse response = new PublishResponse();
		response.setApiResponse(getGepResponseObj(goodsDaoDto.getGoodsExchange(), goodsDaoDto.getCnDocNo(),
				goodsDaoDto.getRefDocDate(),goodsDaoDto.getReqDocNo()));
		response.setSyncStagingDto(syncDto);
		if (goodsDaoDto.getReqDocNo() != null && goodsDaoDto.getReqDocNo() <= 0)
			tepService.updateLegacyTepItems(goodsDaoDto.getGoodsExchange());
		return response;
	}

	@Override
	public ListResponse<CmDetailsResponseDto> getCashMemoDetails(String locationCode, Integer refDocNo,
			Short refFiscalYear, String txnType, String subTxnType) {
		validateTxnTypeAndSubTxnTypeForCMDetails(txnType, subTxnType);
		return tepService.getCashMemoDetails(locationCode, refDocNo, refFiscalYear, txnType,subTxnType);
	}

	private void validateTxnTypeAndSubTxnTypeForCMDetails(String txnType, String subTxnType) {
		// if txn type is not TEP then throw exception
		if (!TransactionTypeEnum.TEP.toString().equals(txnType)) {
			throw new ServiceException(SalesConstants.INVALID_TRANSACTION_TYPE, SalesConstants.ERR_SALE_060);
		}
		// if sub txn type is not NEW_TEP,MANUAL_TEP,FULL_VALUE_TEP,INTER_BRAND_TEP then
		// throw exception
		if (!SubTxnTypeEnum.getByTxnType(TransactionTypeEnum.valueOf(txnType)).contains(subTxnType)) {
			throw new ServiceException(SalesConstants.INVALID_SUB_TRANSACTION_TYPE, SalesConstants.ERR_SALE_059);
		}
	}

	@Override
	@Transactional
	public GepAndItemIdDetailsResponseDto updateGoodsExchangeItemsPrice(String id, String txnType, String subTxnType) {
		commonTransactionService.txnTypeAndSubTxnTypeValidation(txnType, subTxnType);
		if (SubTxnTypeEnum.allowedTxnTypeOfManualGoodsExchange().contains(subTxnType)) {
			throw new ServiceException(SalesConstants.INVALID_SUB_TRANSACTION_TYPE, SalesConstants.ERR_SALE_059,
					"price update in invalid for sub txn type : " + subTxnType);
		}
		GoodsExchangeDaoExt goodsExchange = null;
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = null;
		if (TransactionTypeEnum.GEP.toString().equals(txnType)) {
			goodsExchange = gepService.getGoodsExchangeByIdAndTxnTypeAndSubTxnType(id, txnType, subTxnType);
			goodsExchangeDetailsList = gepService.updateGepItemsPrice(goodsExchange);
			goodsExchange = gepService.updateGoodsExchangeHeader(goodsExchange);
		} else if (TransactionTypeEnum.TEP.toString().equals(txnType)) {
			goodsExchange = tepService.getGoodsExchangeByIdAndTxnTypeAndSubTxnType(id, txnType, subTxnType);
			goodsExchangeDetailsList = tepService.updateTepItemsPrice(goodsExchange);
			goodsExchange = tepService.updateGoodsExchangeHeader(goodsExchange);
		}
		return commonTransactionService.getGoodsExchangeAndItemIdDetails(goodsExchange, goodsExchangeDetailsList);
	}

	@Override
	@Transactional
	public void deleteGoodsExchange(String id, String txnType, String subTxnType, String remarks) {
		commonTransactionService.txnTypeAndSubTxnTypeValidation(txnType, subTxnType);
		GoodsExchangeDaoExt goodsExchange = null;
		if (TransactionTypeEnum.GEP.toString().equals(txnType)) {
			goodsExchange = gepService.getGoodsExchangeByIdAndTxnTypeAndSubTxnType(id, txnType, subTxnType);
			gepService.deleteGep(id, txnType, subTxnType, remarks, goodsExchange);
		} else if (TransactionTypeEnum.TEP.toString().equals(txnType)) {
			goodsExchange = tepService.getGoodsExchangeByIdAndTxnTypeAndSubTxnType(id, txnType, subTxnType);
			tepService.deleteTep(id, txnType, subTxnType, remarks, goodsExchange);
		}
	}

	@Override
	public GepResponseDto confirmGoodsExchangeRequest(String id, String txnType, String subTxnType,
			GoodExchangeRequestConfirmDto goodsExchangeRequestConfirmDto,String workflowType) {
		GoodsExhangeDaoDto goodsDaoDto = new GoodsExhangeDaoDto();
		// if subTxnType is INTER_BRAND_TEP then throw exception
		if (SubTxnTypeEnum.INTER_BRAND_TEP.toString().equals(subTxnType)) {
			throw new ServiceException(SalesConstants.INVALID_SUB_TRANSACTION_TYPE, SalesConstants.ERR_SALE_059);
		}
		commonTransactionService.txnTypeAndSubTxnTypeValidation(txnType, subTxnType);
		GoodsExchangeDaoExt goodsExchange = tepService.getGoodsExchangeByIdAndTxnTypeAndSubTxnType(id, txnType,
				subTxnType);
		// if status is other than APPROVAL_PENDING then throw exception
		if (!TransactionStatusEnum.APPROVAL_PENDING.toString().equals(goodsExchange.getSalesTxn().getStatus())) {
			throw new ServiceException("This transaction cannot be updated", "ERR-SALE-260",
					"transaction status : " + goodsExchange.getSalesTxn().getStatus());
		}
		if (TransactionTypeEnum.TEP.toString().equals(txnType)) {
			goodsDaoDto = tepService.confirmGoodsExchangeRequest(id, txnType, subTxnType,
					goodsExchangeRequestConfirmDto,workflowType);
		}
		// Close req
		if (TransactionStatusEnum.CONFIRMED.toString().equals(goodsExchange.getSalesTxn().getStatus())
				&& TransactionStatusEnum.APPROVAL_PENDING.name()
						.equals(goodsExchange.getSalesTxn().getPreviousStatus()))
			epossCallService.callEposs(HttpMethod.POST,
					SalesUtil.WORKFLOW_PROCESS_URL + "/" + goodsExchange.getProcessId(),
					Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.FULL_VALUE_TEP.name()), null, Object.class);
		
		
		SyncStagingDto syncDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName) && TransactionStatusEnum.CONFIRMED.name().equals(goodsExchange.getSalesTxn().getStatus()))
			syncDto = gepSyncStagging(goodsDaoDto.getGoodsExchange(), goodsDaoDto.getInventoryList(),
					txnType + CONFIRM);
		PublishResponse response = new PublishResponse();
		response.setApiResponse(getGepResponseObj(goodsDaoDto.getGoodsExchange(), goodsDaoDto.getCnDocNo(),
				goodsDaoDto.getRefDocDate(),goodsDaoDto.getReqDocNo()));
		response.setSyncStagingDto(syncDto);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			salesSyncDataService.publishSalesMessagesToQueue(response.getSyncStagingDto());
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(response.getApiResponse(), new TypeReference<GepResponseDto>() {
		});
	}
//===================================== Data Sync Implementation ======================================

	@Override
	public GepResponseDto confirmGoodsExchange(String id, String status, String txnType, String subTxnType,
			GepConfirmOrHoldDto goodsExchangeDto) {
		try {
			boolean isValid = commonTransactionService.validateCustomerFields(goodsExchangeDto.getCustomerId());
			if (!isValid) {
				throw new ServiceException(SalesConstants.MANDATORY_FIELDS_OF_CUSTOMER_DETAILS_ARE_MISSING,
						SalesConstants.ERR_CUST_001, "Mandatory fields of customer details are missing ");
			}
			PublishResponse gepResponse = goodsExcFacade.confirmGoodsExchangeTransactional(id, status, txnType,
					subTxnType, goodsExchangeDto);
			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
				salesSyncDataService.publishSalesMessagesToQueue(gepResponse.getSyncStagingDto());
			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			return mapper.convertValue(gepResponse.getApiResponse(), new TypeReference<GepResponseDto>() {
			});
		} catch (ServiceException e) {
			log.info("Error on {} {} for id {}. Reason: {}", txnType, status, id, ("Message: " + e.getMessage()
					+ " Cause: " + e.getErrorDetails() + " Dynamic Valuse: " + e.getDynamicValues()));

			// set error message to thread local (for audit)
			if (!CollectionUtil.isEmpty(DocNoFailAuditThreadLocal.getDocNoFailData())) {
				DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setFailReason("Message: " + e.getMessage()
						+ " Cause: " + e.getErrorDetails() + " Dynamic Valuse: " + e.getDynamicValues());
			}

			throw e;
		} catch (Exception e) {
			log.info("Error on {} {} for id {}. Localized message: {}, message: {}", txnType, status, id,
					e.getLocalizedMessage(), e.getMessage());

			// set error message to thread local (for audit)
			if (!CollectionUtil.isEmpty(DocNoFailAuditThreadLocal.getDocNoFailData())) {
				if (!StringUtils.isEmpty(e.getLocalizedMessage()))
					DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setFailReason(e.getLocalizedMessage());
				else if (!StringUtils.isEmpty(e.getMessage()))
					DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setFailReason(e.getMessage());
				else
					DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setFailReason("Unkown exception");
			}

			throw e;
		}

		finally {

			if (!CollectionUtil.isEmpty(DocNoFailAuditThreadLocal.getDocNoFailData())
					&& !StringUtils.isEmpty(DocNoFailAuditThreadLocal.getDocNoFailData().get(0).getFailReason())) {
				DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setSubTxnType(subTxnType);
				DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setStatus(status);
				log.info("Log for doc no audit: {}", DocNoFailAuditThreadLocal.getDocNoFailData().get(0).getDocNo());

				// save doc details audit on error
				DocNumberFailAuditDaoExt docNumberFailAuditDaoExt = MapperUtil.mapObjToClass(
						DocNoFailAuditThreadLocal.getDocNoFailData().get(0), DocNumberFailAuditDaoExt.class);
				docNumberFailAuditDaoExt=docNumberFailAuditDaoRepositoryExt.save(docNumberFailAuditDaoExt);
				//sync
				if(docNumberFailAuditDaoExt!=null) {
					commonTxnSycnService.syncDataDocNumberFailAudit(docNumberFailAuditDaoExt);
				}

			}

			// clear allocated thread resource
			DocNoFailAuditThreadLocal.unsetDocNoFailData();
		}
	}

	public SyncStagingDto gepSyncStagging(GoodsExchangeDaoExt goodsExchange, List<InventoryDetailsDao> inventoryList,
			String operation) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetails = goodsExchangeDetailsRepo
				.findByGoodsExchange(goodsExchange);
		List<CreditNoteDaoExt> cnList = creditNoteRepository.findBySalesTxnId(goodsExchange.getId());
		CustomerTxnDaoExt customerTxn = customerTxnRepo.findOneBySalesTxnDaoId(goodsExchange.getId());
//		customerTxn.setMobileNumber(CryptoUtil.decrypt(customerTxn.getMobileNumber(),MOBILE_NO,false));
//		customerTxn.setEmailId(CryptoUtil.decrypt(customerTxn.getEmailId(),EMAIL_ID,false));
//		customerTxn.setCustomerName(CryptoUtil.decrypt(customerTxn.getCustomerName(),CUSTOMER_NAME,false));
//		customerTxn.setCustTaxNo(CryptoUtil.decrypt(customerTxn.getCustTaxNo(),CUST_TAX_NO,false));
//		customerTxn.setCustTaxNoOld(CryptoUtil.decrypt(customerTxn.getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
//		customerTxn.setInstiTaxNo(CryptoUtil.decrypt(customerTxn.getInstiTaxNo(),INSTI_TAX_NO,false));
//		customerTxn.setPassportId(CryptoUtil.decrypt(customerTxn.getPassportId(),PASSPORT_ID,false));
		List<CustomerDocumentsDao> customerDocuments = customerDocumentRepo.findByTxnIdAndLocationCodeAndIsActiveTrue(
				goodsExchange.getId(), goodsExchange.getSalesTxn().getLocationCode());
		GoodsExchangeOffersDaoExt goodsExchangeOffer = goodsExhangeOfferRepo
				.findByGoodsExchangeDetailsId(goodsExchange.getId());
		
		syncDataList.add(DataSyncUtil.createSyncData(new SalesTxnSyncDtoExt(goodsExchange.getSalesTxn(),null), 0));
		syncDataList.add(DataSyncUtil.createSyncData(new GoodsExchangeSyncDtoExt(goodsExchange), 1));
		
		if (!goodsExchangeDetails.isEmpty()) {
			List<GoodsExchangeDetailsSyncDtoExt> goodsExchDetails = goodsExchangeDetails.stream()
					.map(GoodsExchangeDetailsSyncDtoExt::new).collect(Collectors.toList());
			syncDataList.add(DataSyncUtil.createSyncData(goodsExchDetails, 2));
		}
		if (goodsExchangeOffer != null) {
			goodsExchangeOffer.setSrcSyncId(goodsExchangeOffer.getSrcSyncId() + 1);
			goodsExhangeOfferRepo.save(goodsExchangeOffer);
			syncDataList.add(DataSyncUtil.createSyncData(new GoodExchangeOffersyncDtoExt(goodsExchangeOffer), 3));
		}
		if (!cnList.isEmpty()) {
			List<CreditNoteSyncDtoExt> dtoExtList = new ArrayList<>();
			cnList.forEach(daoExt -> {
				daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
				dtoExtList.add(new CreditNoteSyncDtoExt(daoExt));
			});
			creditNoteRepository.saveAll(cnList);
			syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 4));
		}
		if (customerTxn != null) {
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerTxnSyncDtoExt(customerTxn), 5));
		}
		if (inventoryList != null && !inventoryList.isEmpty()) {
			syncDataList.add(DataSyncUtil.createSyncData(inventoryList, 6));
		}
		if (customerDocuments != null && !customerDocuments.isEmpty()) {
			List<CustomerDocumentSyncDto> customerDocSync = customerDocuments.stream().map(CustomerDocumentSyncDto::new)
					.collect(Collectors.toList());
			syncDataList.add(DataSyncUtil.createSyncData(customerDocSync, 11));
		}
		List<PaymentReversalDaoExt> paymentReversalList = paymentReversalRepo.findBySalesTxnId(goodsExchange.getId());
		if(paymentReversalList!=null  && !CollectionUtil.isEmpty(paymentReversalList) ) {
			List<PaymentReversalSyncDtoExt> syncDto = new ArrayList<>();
			paymentReversalList.forEach(listExt -> {
				listExt.setSrcSyncId(listExt.getSrcSyncId() + 1);
				syncDto.add(new PaymentReversalSyncDtoExt(listExt));
			});
			paymentReversalRepo.saveAll(paymentReversalList);
			syncDataList.add(DataSyncUtil.createSyncData(syncDto, 12));
		}
		MessageRequest goodsExchangeMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation,
				destinations, MessageType.GENERAL.toString(), DestinationType.SELECTIVE.toString());
		SyncStagingDto goodsExchangeStagingDto = new SyncStagingDto();
		goodsExchangeStagingDto.setMessageRequest(goodsExchangeMsgRequest);
		String goodsExchangeMsgRqst = MapperUtil.getJsonString(goodsExchangeMsgRequest);
		SyncStaging goodsExchangeSyncStaging = new SyncStaging();
		goodsExchangeSyncStaging.setMessage(goodsExchangeMsgRqst);
		goodsExchangeSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		goodsExchangeSyncStaging = saleSyncStagingRepository.save(goodsExchangeSyncStaging);
		goodsExchangeStagingDto.setId(goodsExchangeSyncStaging.getId());
		return goodsExchangeStagingDto;
	}

	@Override
	public ListResponse<GoodsExchangeDiscountResponseDto> checkApplicableDiscounts(String id, String txnType,
			String subTxnType) {
		commonTransactionService.txnTypeAndSubTxnTypeValidation(txnType, subTxnType);
		GoodsExchangeDaoExt goodsExchangeDaoExt;
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList;
		GoodExchangeDiscountDetailsDto goodExchangeDiscountDetailsDto = null;

		if (TransactionTypeEnum.GEP.toString().equals(txnType)) {
			goodsExchangeDaoExt = gepService.getGoodsExchangeByIdAndTxnTypeAndSubTxnType(id, txnType, subTxnType);
			goodsExchangeDetailsList = gepService.getGoodsExchangeDetails(goodsExchangeDaoExt);
			goodExchangeDiscountDetailsDto = gepService.checkApplicableDiscounts(goodsExchangeDaoExt,
					goodsExchangeDetailsList);

		} else if (TransactionTypeEnum.TEP.toString().equals(txnType)) {
			goodsExchangeDaoExt = tepService.getGoodsExchangeByIdAndTxnTypeAndSubTxnType(id, txnType, subTxnType);
			goodsExchangeDetailsList = tepService.getGoodsExchangeDetails(goodsExchangeDaoExt);
			goodExchangeDiscountDetailsDto = tepService.checkApplicableDiscounts(goodsExchangeDaoExt,
					goodsExchangeDetailsList);
		}

		if (goodExchangeDiscountDetailsDto == null || goodExchangeDiscountDetailsDto.getDiscountObj().isEmpty()) {
			return new ListResponse<>();
		}

		return new ListResponse<>(getApplicableDiscounts(goodExchangeDiscountDetailsDto));
	}

	private List<GoodsExchangeDiscountResponseDto> getApplicableDiscounts(
			GoodExchangeDiscountDetailsDto goodExchangeDiscountDetailsDto) {
		return goodExchangeDiscountDetailsDto.getDiscountObj().entrySet().stream().map(discountObj -> {
			GoodsExchangeDiscountResponseDto goodsExchangeDiscountResponseDto = null;
			if (DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name().equals(discountObj.getKey())) {
				goodsExchangeDiscountResponseDto = getKaratageDiscount(discountObj, goodsExchangeDiscountResponseDto);
			}
			if (DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name().equals(discountObj.getKey())) {
				goodsExchangeDiscountResponseDto = getGepDiscount(discountObj, goodsExchangeDiscountResponseDto);
			}
			if (DiscountTypeEnum.COIN_OFFER_DISCOUNT.name().equals(discountObj.getKey())) {
				goodsExchangeDiscountResponseDto = getCoinDiscount(discountObj, goodsExchangeDiscountResponseDto);
			}

			return goodsExchangeDiscountResponseDto;
		}).collect(Collectors.toList());
	}

	private GoodsExchangeDiscountResponseDto getCoinDiscount(Entry<String, Object> discountObj,
			GoodsExchangeDiscountResponseDto goodsExchangeDiscountResponseDto) {
		@SuppressWarnings("unchecked")
		List<CoinOfferDiscountDto> coinDiscountList = MapperUtil.mapObjToClass(discountObj.getValue(), List.class);
		for (CoinOfferDiscountDto coinDiscount : coinDiscountList) {
			if (goodsExchangeDiscountResponseDto == null) {
				goodsExchangeDiscountResponseDto = MapperUtil.mapObjToClass(coinDiscount,
						GoodsExchangeDiscountResponseDto.class);
			} else {
				goodsExchangeDiscountResponseDto.setDiscountValue(
						goodsExchangeDiscountResponseDto.getDiscountValue().add(coinDiscount.getDiscountValue()));
			}
		}
		return goodsExchangeDiscountResponseDto;
	}

	private GoodsExchangeDiscountResponseDto getGepDiscount(Entry<String, Object> discountObj,
			GoodsExchangeDiscountResponseDto goodsExchangeDiscountResponseDto) {
		@SuppressWarnings("unchecked")
		List<GepPurityDiscountDto> gepDiscountList = MapperUtil.mapObjToClass(discountObj.getValue(), List.class);
		for (GepPurityDiscountDto gepDiscount : gepDiscountList) {
			if (goodsExchangeDiscountResponseDto == null) {
				goodsExchangeDiscountResponseDto = MapperUtil.mapObjToClass(gepDiscount,
						GoodsExchangeDiscountResponseDto.class);
			} else {
				goodsExchangeDiscountResponseDto.setDiscountValue(
						goodsExchangeDiscountResponseDto.getDiscountValue().add(gepDiscount.getDiscountValue()));
			}
		}
		return goodsExchangeDiscountResponseDto;
	}

	private GoodsExchangeDiscountResponseDto getKaratageDiscount(Entry<String, Object> discountObj,
			GoodsExchangeDiscountResponseDto goodsExchangeDiscountResponseDto) {
		@SuppressWarnings("unchecked")
		List<KaratExchangeDiscountDto> karatageDiscountlist = MapperUtil.mapObjToClass(discountObj.getValue(),
				List.class);
		for (KaratExchangeDiscountDto karatDiscount : karatageDiscountlist) {
			if (goodsExchangeDiscountResponseDto == null) {
				goodsExchangeDiscountResponseDto = MapperUtil.mapObjToClass(karatDiscount,
						GoodsExchangeDiscountResponseDto.class);
			} else {
				goodsExchangeDiscountResponseDto.setOneKTDiscountValue(goodsExchangeDiscountResponseDto
						.getOneKTDiscountValue().add(karatDiscount.getOneKTDiscountValue()));
				goodsExchangeDiscountResponseDto.setTwoKTDiscountValue(goodsExchangeDiscountResponseDto
						.getTwoKTDiscountValue().add(karatDiscount.getTwoKTDiscountValue()));
			}
		}
		return goodsExchangeDiscountResponseDto;
	}


	@Override
	public void updateTepFromLegacytoNap(TepLegacyUpdateDto tepLegacyUpdateDto) {
		GoodsExchangeDaoExt goodsExchange = tepService.updateTepFromLegacytoNap(tepLegacyUpdateDto);
		
//		SyncStagingDto syncDto = null;
//		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
//			syncDto = gepSyncStagging(goodsExchange, null, TransactionTypeEnum.TEP.name() + CONFIRM);
//			salesSyncDataService.publishSalesMessagesToQueue(syncDto);
//		}

	}
	
	@Override
	public ListResponse<CmForCustomerResponseDto> checkCmAvailable(String locationCode,String itemCode, String customerMobileNo, String customerId, Boolean isMigratedIgnored){
		if(StringUtils.isEmpty(customerId) && StringUtils.isEmpty(customerMobileNo)) {
			throw new ServiceException("customerId or CustomerMobile is Mandatory" , "ERR-SALE-477");
		}
		if(StringUtils.isEmpty(itemCode) ) {
			throw new ServiceException("ItemCode is Mandatory" , "ERR-SALE-478");
		}
		//List<CashMemoDao> cashMemoDaos= cashMemoDetailsRepository.getCashMemoByVarientCodeAndMobileNumber(itemCode, customerMobileNo,customerId,locationCode);
	
		
		return tepService.getCmDetails(locationCode, itemCode, customerMobileNo, customerId);
	}

	@Override
	public TepCashRefundLimitResponseDto checkTEPCashLimit(Integer customerId, String txnType,BigDecimal refundAmt) {
		BigDecimal cumRefundAmt =BigDecimal.ZERO;
		BigDecimal cashRefundLimit = engineClient.getRefundCashLimitConfig();
		TepCashRefundLimitResponseDto tepCashRefundLimitResponseDto = new TepCashRefundLimitResponseDto();
		tepCashRefundLimitResponseDto.setCashLimit(cashRefundLimit);
		
		cumRefundAmt = customerPaymentRepositoryExt.getPaidAmountByCustIDAndPaymentDateAndLocationCode(
				customerId,
				txnType, businessDayService.getBusinessDay().getBusinessDate() ,
				CommonUtil.getLocationCode()).getTotalCashPaid().abs();

		//'cumRefundAmt' will have old TEP transaction's total paid amount if done on the same business date
		cumRefundAmt = cumRefundAmt.add(refundAmt);
		if(cashRefundLimit!=null && cumRefundAmt.compareTo(cashRefundLimit)<0) {
			tepCashRefundLimitResponseDto.setIsCashPaymentAllowed(true);
		} else {
			tepCashRefundLimitResponseDto.setIsCashPaymentAllowed(false);
		}
		tepCashRefundLimitResponseDto.setTotalTxnAmt(cumRefundAmt);
		return tepCashRefundLimitResponseDto;
	}
	
	/*
	 * private CashMemoEntities getLegacyCmDetails(String varientCode, String
	 * mobileNumber) {
	 * 
	 * //boolean isCashMemoAvailable =
	 * legacyCallServiceImpl.callLegacyTepCashMemo(varientCode, mobileNumber);
	 * return null; }
	 */

	}
	
