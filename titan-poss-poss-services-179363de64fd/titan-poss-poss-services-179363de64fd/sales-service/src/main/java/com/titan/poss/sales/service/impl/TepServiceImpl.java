/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.EinvoiceTransactionTypeEnum;
import com.titan.poss.core.domain.constant.TepTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.domain.constant.enums.PaymentGroupEnum;
import com.titan.poss.core.domain.constant.enums.WorkflowProcessStatusEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.BaseStoneDetails;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CmForCustomerLegacyDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsResponseDto;
import com.titan.poss.core.dto.GepPriceResponseDto;
import com.titan.poss.core.dto.GrnItemDetials;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.ItemLotStoneDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MakingChargeDetailsDto;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.RoleAclConfigDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TepItemResponseDto;
import com.titan.poss.core.dto.TepLegacyUpdateDto;
import com.titan.poss.core.dto.TepPriceRequest;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.dto.TepUpdateItemsDto;
import com.titan.poss.core.dto.TepValidationConfigDetails;
import com.titan.poss.core.dto.WorkflowProcessCreateDto;
import com.titan.poss.core.dto.WorkflowProcessCreateResponseDto;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.PlainStuddedEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.constants.TepPaymentTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CashMemoDao;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.CmForEpossResponseDto;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentReversalDaoExt;
import com.titan.poss.sales.dao.SalesInvoiceDocumentsDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.CashMemoDetailsResponseDto;
import com.titan.poss.sales.dto.CashMemoEntities;
import com.titan.poss.sales.dto.GoodsExchangeApprovalDetailsDto;
import com.titan.poss.sales.dto.GoodsExhangeDaoDto;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.TepCashRefundDto;
import com.titan.poss.sales.dto.TepChequeRefundDto;
import com.titan.poss.sales.dto.TepExceptionDetailsDto;
import com.titan.poss.sales.dto.TepRefundHeaderDto;
import com.titan.poss.sales.dto.TepRefundHeaderItemDetailsDto;
import com.titan.poss.sales.dto.TepRtgsRefundDto;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.WeightDetailsDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.constants.UploadFileDocTypeEnum;
import com.titan.poss.sales.dto.constants.UploadFileTypeEnum;
import com.titan.poss.sales.dto.request.FullValueTepDetailsDto;
import com.titan.poss.sales.dto.request.FullValueTepHeaderDto;
import com.titan.poss.sales.dto.request.GepConfirmOrHoldDto;
import com.titan.poss.sales.dto.request.GepUpdateDto;
import com.titan.poss.sales.dto.request.GoodExchangeRequestConfirmDto;
import com.titan.poss.sales.dto.request.GoodsExchangeDetailDto;
import com.titan.poss.sales.dto.request.GoodsExchangeHeaderDto;
import com.titan.poss.sales.dto.request.HallmarkGstRequestDto;
import com.titan.poss.sales.dto.request.RefundRequestCreateDto;
import com.titan.poss.sales.dto.response.CmDetailsResponseDto;
import com.titan.poss.sales.dto.response.CmForCustomerResponseDto;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.dto.response.FileDetailsDto;
import com.titan.poss.sales.dto.response.GoodExchangeDiscountDetailsDto;
import com.titan.poss.sales.dto.response.TotalTaxAndTaxDetailsDto;
import com.titan.poss.sales.repository.BusinessDayRepositoryExt;
import com.titan.poss.sales.repository.CashMemoDetailsRepository;
import com.titan.poss.sales.repository.CashMemoRepository;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.PaymentReversalRepositoryExt;
import com.titan.poss.sales.repository.RevenueSummaryRepositoryExt;
import com.titan.poss.sales.repository.SalesInvoiceDocumentsRepository;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CustomerPaymentService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.FileService;
import com.titan.poss.sales.service.RefundService;
import com.titan.poss.sales.service.SalesDocService;
import com.titan.poss.sales.service.SalesInvoiceDocService;
import com.titan.poss.sales.service.TepService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Slf4j
@Service("tepService")
public class TepServiceImpl extends BaseGoodsServiceImpl implements TepService {

	private static final String ERR_CORE_003 = "ERR-CORE-003";
	private static final String UNABLE_TO_PARSE_JSON = "Unable to parse Json Data";

	private static final String ERR_CORE_342 = "ERR-SALE-342";
	private static final String TEP_DONE = "TEP has already been done for {itemCode}";

	private static final String ERR_CORE_343 = "ERR-SALE-343";
	private static final String GRN_DONE = "GRN has already been done for {itemCode}";

	private static final String GRN_TEP_DONE = "{itemCode} is returned via GRN or TEP";
	private static final String ERR_CORE_344 = "ERR-CORE-344";

	private static final String TEP_CONFIRM = SalesAccessControls.TEP_CONFIRM;

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private CustomerPaymentService customerPaymentService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private SalesIntegrationServiceImpl salesIntegrationServiceImpl;

	@Autowired
	private RefundService refundService;

	@Autowired
	private CustomerTxnRepositoryExt cusTxnDetailsRepository;

	@Autowired
	private SalesInvoiceDocumentsRepository salesInvoiceDocumentsRepository;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private FileService fileService;

	@Autowired
	private EpossCallServiceImpl legacyCallServiceImpl;

	@Autowired
	private PaymentReversalRepositoryExt paymentReversalRepo;

	@Autowired
	private RevenueSummaryRepositoryExt revenue;

	@Autowired
	IntegrationServiceClient integrationServiceClient;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepositoryExt;

	@Autowired
	private CashMemoRepository cashMemoRepo;

	@Autowired
	private CashMemoDetailsRepository cashMemoDetailsRepo;

	@Autowired
	private SalesDocService salesDocService;

	@Autowired
	BusinessDayRepositoryExt businessDayRepository;

	@Autowired
	EngineServiceClient engineServiceClient;
	
	@Autowired
	private SalesInvoiceDocService salesInvoiceDocService;

	private static final String ERR_SALE_070 = "ERR-SALE-070";
	private static final String RECORD_NOT_FOUND = "Record not found.";

	private static final String CUST_TAX_NO = "custTaxNo";
	private static final String MOBILE_NO = "mobileNo";
	private static final String EMAIL_ID = "emailId";
	private static final String CUSTOMER_NAME = "customerName";
	private static final String INSTI_TAX_NO = "instiTaxNo";
	private static final String PASSPORT_ID = "passportId";
	private static final String CUST_TAX_NO_OLD = "custTaxNoOld";

	@Override
	public SalesTxnDaoExt createOpenTep(String txnType, String subTxnType, TransactionCreateDto transactionCreateDto) {
		SalesTxnDaoExt salesDao = super.createGoodsExchange(null, txnType, subTxnType, SalesDocTypeEnum.TEP_OPEN,
				TransactionStatusEnum.OPEN);
		if (SubTxnTypeEnum.MANUAL_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_INTER_BRAND_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(subTxnType)) {
			commonTransactionService.validateManualBillDetails(transactionCreateDto, salesDao);
		}
		// gepConfirmOrHoldDto
		salesDao.setSrcSyncId(0);
		salesDao.setDestSyncId(0);
		saveTepObject(salesDao);
		return super.saveSalesObject(salesDao);
	}

	private GoodsExchangeDaoExt saveTepObject(SalesTxnDaoExt salesTxnDao) {
		GoodsExchangeDaoExt goodsExchangeDao = new GoodsExchangeDaoExt();
		goodsExchangeDao.setSalesTxn(salesTxnDao);
		goodsExchangeDao.setTotalQuantity((short) 0);
		goodsExchangeDao.setTotalTax(BigDecimal.ZERO);
		goodsExchangeDao.setTotalValue(BigDecimal.ZERO);
		goodsExchangeDao.setTotalWeight(BigDecimal.ZERO);
		goodsExchangeDao.setSrcSyncId(0);
		goodsExchangeDao.setDestSyncId(0);
		goodsExchangeDao.setRoundingVariance(BigDecimal.ZERO);
		goodsExchangeDao.setFinalValue(BigDecimal.ZERO);
		return super.saveGoodsExchangeObject(goodsExchangeDao);
	}

	@Override
	public GoodsExchangeDaoExt getGoodsExchangeByIdAndTxnTypeAndSubTxnType(String id, String txnType,
			String subTxnType) {
		return super.getGoodsExchangeObjectByIdAndTxnTypeAndSubTxnType(id, txnType, subTxnType);
	}

	@Override
	public List<GoodsExchangeDetailsDaoExt> getGoodsExchangeDetails(GoodsExchangeDaoExt goodsExchangeDaoExt) {
		return super.findGoodsExchangeDetailsByGoodsExchange(goodsExchangeDaoExt);
	}

	@Override
	public GoodsExchangeDaoExt updateGoodsExchange(String id, String txnType, String subTxnType,
			GepUpdateDto gepUpdateDto) {
		GoodsExchangeDaoExt goodsExchangeDao = super.getGoodsExchangeObjectByIdAndTxnTypeAndSubTxnType(id, txnType,
				subTxnType);
		// if status is CONFIRMED/CANCELLED then TEP cannot be updated
		commonTransactionService.checkTranscationStatusForUpdate(goodsExchangeDao.getSalesTxn().getStatus());
		if (!StringUtils.isEmpty(gepUpdateDto.getCustomerId())) {
			commonTransactionService.updateCustomerDetails(gepUpdateDto.getCustomerId(),
					goodsExchangeDao.getSalesTxn());
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = super.findGoodsExchangeDetailsByGoodsExchange(
					goodsExchangeDao);
			updatePriceOrTax(goodsExchangeDao, goodsExchangeDetailsList, null);
			updateGoodsExchangeHeader(goodsExchangeDao);
		}
		if (!StringUtils.isEmpty(gepUpdateDto.getEmployeeCode())) {
			goodsExchangeDao.getSalesTxn().setEmployeeCode(gepUpdateDto.getEmployeeCode());
		}
		goodsExchangeDao.setSrcSyncId(goodsExchangeDao.getSrcSyncId() + 1);
		return super.saveGoodsExchangeObject(goodsExchangeDao);
	}

	@Override
	@Transactional
	public ListResponse<CmDetailsResponseDto> getCashMemoDetails(String locationCode, Integer refDocNo,
			Short refFiscalYear, String txnType, String subTxnType) {

		List<CashMemoDetailsDao> cmDetailsList = new ArrayList<>();
		boolean isDiffStore = true;
		boolean isLegacyCM = false;
		if (StringUtils.isEmpty(locationCode) || CommonUtil.getStoreCode().equals(locationCode)) {
			locationCode = CommonUtil.getStoreCode();
			isDiffStore = false;
		}
		log.debug("isDiffStore {}", isDiffStore);
		boolean isEpossApp = CommonUtil.isEpossApp();
		log.debug("isEpossApp {}", isEpossApp);
		// if same store or application is EPOSS, don't get all cash memo from other DB
		if (isDiffStore || isEpossApp) {
			log.debug("------------Fetching CM details from eposs db----------------");
			cmDetailsList = getEpossCmDetails(locationCode, refDocNo, refFiscalYear, cmDetailsList);
			log.debug("------------cmDetails---------------->" + cmDetailsList);
			if (cmDetailsList != null && !cmDetailsList.isEmpty()) {
				isLegacyCM = cmDetailsList.get(0).getCashMemoDao().getIsMigrated();
			}
		} else {
			log.debug("------------Fetching CM details from same db----------------");
			List<CashMemoDetailsDao> epossCmDetailsList = getEpossCmDetails(locationCode, refDocNo, refFiscalYear,
					cmDetailsList);
			
			cmDetailsList = super.findCashMemoDetailsByDocNoAndLocationCodeAndFiscalYearAndTxnType(refDocNo,
					refFiscalYear, locationCode, TransactionTypeEnum.CM.toString());
			if (epossCmDetailsList != null && !epossCmDetailsList.isEmpty()) {
				if (cmDetailsList != null && !cmDetailsList.isEmpty())
					for (CashMemoDetailsDao epossCMDetails : epossCmDetailsList) {
						for (CashMemoDetailsDao cmDetails : cmDetailsList) {
							if(cmDetails.getItemCode().equals(epossCMDetails.getItemCode())) {
								cmDetails.setNoOfItemsReturned(epossCMDetails.getNoOfItemsReturned());
								isLegacyCM = cmDetailsList.get(0).getCashMemoDao().getIsMigrated();
							}
							
						}
					}
			}
			cmDetailsList = super.saveCashMemoDetailsListObject(cmDetailsList);
		}
		if (cmDetailsList == null || cmDetailsList.isEmpty() || isLegacyCM) {
			cmDetailsList = getLegacyCmDetails(locationCode, refDocNo, refFiscalYear, subTxnType, cmDetailsList);
		}
		verifyIfCashMemoAndConfirmed(cmDetailsList.get(0).getCashMemoDao().getSalesTxnDao());
		return new ListResponse<>(prepareCmDetailsResponse(cmDetailsList, subTxnType));
	}

	@Override
	@Transactional
	public ListResponse<CmForCustomerResponseDto> getCmDetails(String locationCode, String itemCode,
			String customerMobileNo, String customerId) {

		List<CashMemoDetailsResponseDto> cmDetailsResponseList = new ArrayList<>();
		boolean isDiffStore = true;
		if (StringUtils.isEmpty(locationCode) || CommonUtil.getStoreCode().equals(locationCode)) {
			locationCode = CommonUtil.getStoreCode();
			isDiffStore = false;
		}

		cmDetailsResponseList = super.findCashMemoDetailsByLocationCodeItemCodeAndCustomerMobileNoOrCustomerId(itemCode,
				customerMobileNo, customerId, locationCode);
		List<CmForCustomerResponseDto> cmForCustomerResponseDtos = checkCmDetailsResponse(cmDetailsResponseList);
		// if same store or application is EPOSS, don't get all cash memo from other DB
		if (cmForCustomerResponseDtos == null || cmForCustomerResponseDtos.size() == 0) {
			log.debug("------------Fetching CM details from eposs db----------------");
			List<CashMemoDetailsDao> cmDetailsList = new ArrayList<>();
			if(cmDetailsResponseList != null && !cmDetailsResponseList.isEmpty()) {
				cmDetailsList = getEpossCheckCmDetails(locationCode, itemCode, customerMobileNo, customerId, cmDetailsList);
			}else {
				cmDetailsList = new ArrayList<>();
			}
			//cmDetailsList = getEpossCheckCmDetails(locationCode, itemCode, customerMobileNo, customerId, cmDetailsList);
			if (cmDetailsList.size() > 0) {
				Optional<CashMemoDetailsResponseDto> cmDetail = cmDetailsList.stream().findFirst().map(cmd -> {
					CashMemoDetailsResponseDto cashMemoDetailsResponseDto = new CashMemoDetailsResponseDto();
					cashMemoDetailsResponseDto.setId(cmd.getId());
					cashMemoDetailsResponseDto.setLocationCode(cmd.getCashMemoDao().getSalesTxnDao().getLocationCode());
					cashMemoDetailsResponseDto.setFiscalYear(cmd.getCashMemoDao().getSalesTxnDao().getFiscalYear());
					cashMemoDetailsResponseDto.setDocNo(cmd.getCashMemoDao().getSalesTxnDao().getDocNo());
					cashMemoDetailsResponseDto.setIsMigrated(cmd.getCashMemoDao().getIsMigrated());
					cashMemoDetailsResponseDto.setTotalQuantity(cmd.getTotalQuantity());
					return cashMemoDetailsResponseDto;
				});
				cmDetailsResponseList.add(cmDetail.get());
			}
		}

		List<CmForCustomerLegacyDto> cmDetailsList = null;

		if (cmDetailsResponseList == null || cmDetailsResponseList.size() == 0) {
			cmDetailsList = getLegacyCMforCustomer(locationCode, itemCode, customerMobileNo, customerId);
		}
		if (cmDetailsList != null && cmDetailsList.size() > 0) {
			Optional<CashMemoDetailsResponseDto> cmDetail = cmDetailsList.stream().findFirst().map(cmd -> {
				CashMemoDetailsResponseDto cashMemoDetailsResponseDto = new CashMemoDetailsResponseDto();
//					cashMemoDetailsResponseDto.setId(cmd.getId());
				cashMemoDetailsResponseDto.setLocationCode(cmd.getLocationCode());
				cashMemoDetailsResponseDto.setFiscalYear(cmd.getFiscalYear());
				cashMemoDetailsResponseDto.setDocNo(cmd.getDocNo());
				cashMemoDetailsResponseDto.setIsMigrated(cmd.getIsMigrated());
//					cashMemoDetailsResponseDto.setTotalQuantity(cmd.getTotalQuantity());
				return cashMemoDetailsResponseDto;
			});
			cmDetailsResponseList.add(cmDetail.get());
		}

		return new ListResponse<>(
				cmForCustomerResponseDtos == null || cmForCustomerResponseDtos.size() == 0 ? cmForCustomerResponseDtos
						: checkCmDetailsResponse(cmDetailsResponseList));
	}

	private List<CmForCustomerLegacyDto> getLegacyCMforCustomer(String locationCode, String itemCode,
			String customerMobileNo, String customerId) {
		Boolean isInterBrand = false;
//		if(SubTxnTypeEnum.INTER_BRAND_TEP.toString().equals(subTxnType) || SubTxnTypeEnum.MANUAL_INTER_BRAND_TEP.toString().equals(subTxnType)) {
//			isInterBrand = true;
//		}
		List<CmForCustomerLegacyDto> cashMemoEntities = legacyCallServiceImpl.callLegacyGetCmForCustomer(locationCode,
				itemCode, customerMobileNo, customerId, true);
		if (cashMemoEntities != null)
			return cashMemoEntities;
		else
			return new ArrayList<>();
	}

	private void verifyIfCashMemoAndConfirmed(SalesTxnDao salesTxn) {
		if (!salesTxn.getTxnType().equals(TransactionTypeEnum.CM.name())
				|| salesTxn.getSubTxnType().equals(SubTxnTypeEnum.GIFT_SALE.name())
				|| !salesTxn.getStatus().equals(TransactionStatusEnum.CONFIRMED.name())) {
			if (!salesTxn.getStatus().equals(TransactionStatusEnum.CONFIRMED.name())) {
				throw new ServiceException(" Bill cancellation done, cash memo is {status}", "ERR-SALE-421",
						Map.of("status", salesTxn.getStatus()));
			}
			throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070,
					salesTxn.getTxnType() + " : " + salesTxn.getSubTxnType() + " : " + salesTxn.getStatus());
		}
	}

	private List<CashMemoDetailsDao> getLegacyCmDetails(String locationCode, Integer refDocNo, Short refFiscalYear,
			String subTxnType, List<CashMemoDetailsDao> cmDetailsList) {
		Boolean isInterBrand = false;
		Boolean isFTEP = false;
		if (SubTxnTypeEnum.INTER_BRAND_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_INTER_BRAND_TEP.toString().equals(subTxnType)) {
			isInterBrand = true;
		} else if (SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(subTxnType)) {
			isFTEP = true;
		}
		CashMemoEntities cashMemoEntities = legacyCallServiceImpl.callLegacyTepCashMemo(locationCode, refDocNo,
				refFiscalYear, isInterBrand, isFTEP, cmDetailsList);
		if ((cashMemoEntities.getOriginalTxn() != null
				&& cashMemoEntities.getOriginalTxn().getCashMemoDetails() != null))
			return cashMemoEntities.getOriginalTxn().getCashMemoDetails();
		else
			return new ArrayList<>();
	}

	private List<CashMemoDetailsDao> getEpossCmDetails(String locationCode, Integer refDocNo, Short refFiscalYear,
			List<CashMemoDetailsDao> cmDetailsList) {
		Map<String, String> reqParams = Map.of(SalesConstants.LOC_CODE, locationCode, "refDocNo",
				String.valueOf(refDocNo), "refFiscalYear", String.valueOf(refFiscalYear), "isMigratedIgnored", "true");
		CashMemoEntities cashMemoEntities = epossCallService.callEposs(HttpMethod.GET,
				SalesUtil.SALES_BASE_SERVICE_URL + SalesConstants.EPOSS_CM_BASE_URL, reqParams, null,
				CashMemoEntities.class);
		if (cashMemoEntities == null || (cashMemoEntities != null && cashMemoEntities.getOriginalTxn() == null)) {
			return null;
		}
		CashMemoDao cmDao = cashMemoEntities.getOriginalTxn().getCashMemo();
		SalesTxnDao salesObj = super.getSalesObjectByIdAndLocationCodeAndTxnType(cmDao.getSalesTxnDao().getId(),
				cmDao.getSalesTxnDao().getLocationCode(), cmDao.getSalesTxnDao().getTxnType());
		if (salesObj == null) {
			salesObj = cmDao.getSalesTxnDao();
			List<CashMemoDetailsDao> cashMemoDetailsList = new ArrayList<>();
			for (CashMemoDetailsDao cashMemoDetailsDao : cashMemoEntities.getOriginalTxn().getCashMemoDetails()) {
				cashMemoDetailsDao.setCashMemoDao(cmDao);
				cmDetailsList.add(cashMemoDetailsDao);
			}
			CustomerDao customer = cashMemoEntities.getCustomer().getCustomer();
			// save customer info as it is not EPOSS
			if (!CommonUtil.isEpossApp()) {
				customerService.saveCustomerAndUp(customer, cashMemoEntities.getCustomer().getCustomerUlp());
				customerService.saveCustomerLocationMapping(salesObj.getCustomerId(), salesObj.getLocationCode(),
						customer);
			}
			super.saveSalesObject(salesObj);
			super.saveCashMemoObject(cmDao);
			cmDetailsList = super.saveCashMemoDetailsListObject(cashMemoDetailsList);
		} else {
			for (CashMemoDetailsDao cashMemoDetailsDao : cashMemoEntities.getOriginalTxn().getCashMemoDetails()) {
				cashMemoDetailsDao.setCashMemoDao(cmDao);

				cmDetailsList.add(cashMemoDetailsDao);
			}
		}
		return cmDetailsList;
	}

	private List<CmDetailsResponseDto> prepareCmDetailsResponse(List<CashMemoDetailsDao> cmDetailsList,
			String subTxnType) {
		List<CmDetailsResponseDto> cmDetailsResponseList = new ArrayList<>();
		cmDetailsList.forEach(record -> {

			CmDetailsResponseDto cmDetailsResponse = (CmDetailsResponseDto) MapperUtil.getDtoMapping(record,
					CmDetailsResponseDto.class);
			if (cmDetailsResponse.getLotNumber() != null && "null".equalsIgnoreCase(cmDetailsResponse.getLotNumber())) {
				cmDetailsResponse.setLotNumber(null);
			}
			cmDetailsResponse.setTotalValue(record.getFinalValue());
			cmDetailsResponse.setCashMemoDetailsId(record.getId());
			short totalTepQuantity = (short) super.getSumOfTotalQuantityInGoodsExchangeDetailsByCashMemoDetails(
					record.getId());
			short totalGrnQuantity = (short) super.getSumOfTotalQuantityInGRNDetailsByCashMemoDetails(record.getId());
			short totalLegacyReturnQty = (record.getNoOfItemsReturned() == null) ? 0 : record.getNoOfItemsReturned();
			short totalQty = record.getTotalQuantity();
			log.debug("totalQuantity : {}", totalQty);
			log.debug("totalQuantity available in Legacy : {}", totalLegacyReturnQty);
			log.debug("totalQuantity available in TEP : {}", totalTepQuantity);
			log.debug("totalQuantity available in GRN : {}", totalGrnQuantity);
			short totalPendingQuantity = 0;
			if (totalQty == totalLegacyReturnQty || totalQty == totalTepQuantity || totalQty == totalGrnQuantity) {
				totalPendingQuantity = 0;
			} else {
				totalPendingQuantity = (short) (record.getTotalQuantity()
						- (totalTepQuantity + totalGrnQuantity + totalLegacyReturnQty));
			}
			log.debug("totalPendingQuantity available in TEP : {}", totalPendingQuantity);
			cmDetailsResponse.setTotalPendingQuantity(totalPendingQuantity);
			if (record.getTotalDiscount() != null) {
				cmDetailsResponse.setDiscountRecovered(record.getTotalDiscount());
			} else {
				cmDetailsResponse.setDiscountRecovered(BigDecimal.ZERO);
			}

			if (SubTxnTypeEnum.FULL_VALUE_TEP.name().equalsIgnoreCase(subTxnType)
					|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.name().equalsIgnoreCase(subTxnType)) {
				cmDetailsResponse.setIsCmAllowed(Boolean.TRUE);
			}

			else if (SubTxnTypeEnum.INTER_BRAND_TEP.name().equalsIgnoreCase(subTxnType)
					|| SubTxnTypeEnum.MANUAL_INTER_BRAND_TEP.name().equalsIgnoreCase(subTxnType)) {
				TepItemResponseDto tepItemResponseDto = engineService.getTepItems(record.getItemCode(), null,
						subTxnType);
				if (tepItemResponseDto != null) {
					if (tepItemResponseDto.getTepGeneralCodeConfig() != null) {
						cmDetailsResponse
								.setIsCmAllowed(tepItemResponseDto.getTepGeneralCodeConfig().getIsCMMandatory());
					} else {
						cmDetailsResponse.setIsCmAllowed(Boolean.TRUE);
					}
				} else {
					cmDetailsResponse.setIsCmAllowed(Boolean.TRUE);
				}
			} else {
				TepItemResponseDto tepItemResponseDto = engineService.getTepItems(record.getItemCode(), null,
						subTxnType);
				cmDetailsResponse
						.setIsCmAllowed(tepItemResponseDto != null ? tepItemResponseDto.getIsCMMandatory() : false);
			}
			// lot number for gold coins with qty>1
			if (record.getTotalQuantity() > 1
					&& SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(record.getProductGroupCode())
					&& record.getItemDetails() != null) {
				cmDetailsResponse.setIsTepAllowed(Boolean.TRUE);
				ObjectMapper mapper = new ObjectMapper();

				try {

					JsonNode root = mapper.readTree(record.getItemDetails());
					JsonNode dataNode = root.path("data");
					for (JsonNode data : dataNode) {
						String lotNumber = data.path("lotNumber").textValue();
						cmDetailsResponse.setLotNumber(lotNumber);
						break;
					}

				} catch (IOException e) {
					throw new ServiceException("Error while parsing", ERR_CORE_003);
				}

			}

			cmDetailsResponseList.add(cmDetailsResponse);

		});
		return cmDetailsResponseList;
	}

	private List<CmForCustomerResponseDto> checkCmDetailsResponse(List<CashMemoDetailsResponseDto> cmDetailsList) {
		List<CmForCustomerResponseDto> cmDetailsResponseList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(cmDetailsList)) {
			cmDetailsList.forEach(record -> {

				CmForCustomerResponseDto cmDetailsResponse = (CmForCustomerResponseDto) MapperUtil.getDtoMapping(record,
						CmForCustomerResponseDto.class);

				// cmDetailsResponse.setCashMemoDetailsId(record.getId());
				short totalTepQuantity = (short) super.getSumOfTotalQuantityInGoodsExchangeDetailsByCashMemoDetails(
						record.getId());
				short totalGrnQuantity = (short) super.getSumOfTotalQuantityInGRNDetailsByCashMemoDetails(
						record.getId());
				log.debug("totalQuantity available in TEP : {}", totalTepQuantity);
				log.debug("totalQuantity available in GRN : {}", totalGrnQuantity);
				short totalPendingQuantity = (short) (record.getTotalQuantity()
						- (totalTepQuantity + totalGrnQuantity));
				log.debug("totalPendingQuantity available in TEP : {}", totalPendingQuantity);
				// cmDetailsResponse.setTotalPendingQuantity(totalPendingQuantity);
				if (totalPendingQuantity > 0) {
					cmDetailsResponseList.add(cmDetailsResponse);
				}
			});
		}

		return cmDetailsResponseList;
	}

	private List<CashMemoDetailsDao> getEpossCheckCmDetails(String locationCode, String itemCode,
			String customerMobileNo, String customerId, List<CashMemoDetailsDao> cmDetailsList) {

		Map<String, String> reqParams = Map.of(SalesConstants.LOC_CODE, locationCode, "itemCode",
				String.valueOf(itemCode), "customerMobileNo", String.valueOf(customerMobileNo), "customerId",
				String.valueOf(customerId), "isMigratedIgnored", "true");

		CmForEpossResponseDto cmList = epossCallService.callEposs(HttpMethod.GET,
				SalesUtil.SALES_BASE_SERVICE_URL + SalesConstants.EPOSS_CHECK_CM_BASE_URL, reqParams, null,
				CmForEpossResponseDto.class);

		if (cmList != null && cmList.getCmList() != null && !cmList.getCmList().isEmpty()) {
			cmDetailsList.addAll(cmList.getCmList());
		}

		return cmDetailsList;
	}

	@Override
	// @Transactional(value = "chainedTransaction")
	public GoodsExhangeDaoDto confirmTep(String id, String status, String txnType, String subTxnType,
			GepConfirmOrHoldDto gepConfirmOrHoldDto) {
		GoodsExhangeDaoDto goodsExhangeDaoDto = new GoodsExhangeDaoDto();
//		boolean isValid = commonTransactionService.validateCustomerFields(gepConfirmOrHoldDto.getCustomerId());
//		if (!isValid) {
//			throw new ServiceException(SalesConstants.MANDATORY_FIELDS_OF_CUSTOMER_DETAILS_ARE_MISSING,
//					SalesConstants.ERR_CUST_001, "Mandatory fields of customer details are missing ");
//		}
		GoodsExchangeDaoExt goodsExchange = validateConfirmTep(id, status, txnType, subTxnType, gepConfirmOrHoldDto);
		goodsExhangeDaoDto.setGoodsExchange(goodsExchange);
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = super.findGoodsExchangeDetailsByGoodsExchange(
				goodsExchange);
		if (goodsExchange.getSalesTxn().getRefTxnId() != null) {
			goodsExhangeDaoDto.setRefDocDate(goodsExchange.getSalesTxn().getRefTxnId().getDocDate());
		}
		InventoryItemDto inventoryDto = validateCutPieceTep(subTxnType, goodsExchangeDetailsList);
		List<InventoryDetailsDao> inventoryList = new ArrayList<>();
		if (!StringUtils.isEmpty(gepConfirmOrHoldDto.getApprovalDetails())) {
			goodsExchange = setApprovalDetails(goodsExchange, gepConfirmOrHoldDto.getApprovalDetails());
		}
		SalesTxnDaoExt salesTxn = goodsExchange.getSalesTxn();
		if (TransactionStatusEnum.HOLD.toString().equals(status)) {

			// UAT 3130: if within hold time then return
			if (TransactionStatusEnum.HOLD.name().equals(goodsExchange.getSalesTxn().getStatus())
					&& commonTransactionService.holdTimeCheck(goodsExchange.getSalesTxn(),
							super.getHoldTimeInMinutesForTep(goodsExchange.getSalesTxn().getLocationCode()))) {
				goodsExhangeDaoDto.setGoodsExchange(goodsExchange);
				return goodsExhangeDaoDto;
			}

			commonTransactionService.setHoldTime(goodsExchange.getSalesTxn());
			// doc no generation for HOLD status
			super.docNoGeneration(status, txnType, subTxnType, goodsExchange, SalesDocTypeEnum.TEP_HOLD);
			salesTxn.setEmployeeCode(gepConfirmOrHoldDto.getEmployeeCode());
			salesTxn.setStatus(status);
		} else if (TransactionStatusEnum.CONFIRMED.name().equals(status)) {
			validateTepAndGepDone(goodsExchangeDetailsList);
			inventoryList = confirmOrApprovalTep(status, txnType, subTxnType, gepConfirmOrHoldDto, goodsExhangeDaoDto,
					goodsExchangeDetailsList, salesTxn, inventoryDto);
		}
		salesTxn.setRemarks(gepConfirmOrHoldDto.getRemarks());
		goodsExchange.setRefundDetails(MapperUtil.getStringFromJson(gepConfirmOrHoldDto.getRefundDetails()));
		goodsExchange.setPaymentType(gepConfirmOrHoldDto.getPaymentType());
		goodsExchange.setReason(gepConfirmOrHoldDto.getReason());
		goodsExchange.setSrcSyncId(goodsExchange.getSrcSyncId() + 1);
		goodsExchange.setTepExceptionDetails(MapperUtil.getJsonString(gepConfirmOrHoldDto.getTepExceptionDetails()));
		log.debug("src sync id {}", goodsExchange.getSalesTxn().getSrcSyncId());
		salesTxn.setSrcSyncId(goodsExchange.getSalesTxn().getSrcSyncId() + 1);
		goodsExchange.setSalesTxn(salesTxn);
		goodsExhangeDaoDto.setGoodsExchange(super.saveGoodsExchangeObject(goodsExchange));
		// add refund details to customer_payment if refund is made by CASH
		if (TepPaymentTypeEnum.REFUND.name().equalsIgnoreCase(gepConfirmOrHoldDto.getPaymentType())
				&& !StringUtil.isBlankJsonData(gepConfirmOrHoldDto.getRefundDetails())
				&& PaymentCodeEnum.CASH.getPaymentcode().equals(JsonUtils.getValueFromJson(
						gepConfirmOrHoldDto.getRefundDetails().getData(), "refundMode", String.class))) {
			customerPaymentService.addCustomerPayment(salesTxn, null, null, goodsExchange.getFinalValue(),
					goodsExchange.getRoundingVariance(), true, BigDecimal.valueOf(1));
		}
		goodsExhangeDaoDto.setInventoryList(inventoryList);
		// if (TransactionStatusEnum.CONFIRMED.name().equals(status))
		// eInvoiceCheck(txnType, goodsExchange, goodsExchangeDetailsList, salesTxn);
		commonTransactionService.customerDetailsCheckForFinalValue(goodsExchange.getFinalValue(),
				goodsExchange.getSalesTxn());
		return goodsExhangeDaoDto;
	}

	private void validateTepAndGepDone(List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList) {
		goodsExchangeDetailsList.forEach(record -> {
			if (record.getCashMemoDetails() != null && record.getCashMemoDetails().getId() != null) {
				short totalTepQuantity = (short) super.getSumOfTotalQuantityInGoodsExchangeDetailsByCashMemoDetails(
						record.getCashMemoDetails().getId());
				short totalGrnQuantity = (short) super.getSumOfTotalQuantityInGRNDetailsByCashMemoDetails(
						record.getCashMemoDetails().getId());
				short totalLegacyReturnQty = (record.getCashMemoDetails().getNoOfItemsReturned() == null) ? 0
						: record.getCashMemoDetails().getNoOfItemsReturned();
				if (record.getCashMemoDetails().getTotalQuantity() - totalTepQuantity <= 0) {
					throw new ServiceException(TEP_DONE, ERR_CORE_342, Map.of("itemCode", record.getItemCode()));
				}
				if (record.getCashMemoDetails().getTotalQuantity() - totalGrnQuantity <= 0) {
					throw new ServiceException(GRN_DONE, ERR_CORE_343, Map.of("itemCode", record.getItemCode()));
				}
				if (record.getCashMemoDetails().getTotalQuantity()
						- (totalTepQuantity + totalGrnQuantity + totalLegacyReturnQty) <= 0) {
					throw new ServiceException(GRN_TEP_DONE, ERR_CORE_344, Map.of("itemCode", record.getItemCode()));
				}
			}
		});
	}

	private GoodsExchangeDaoExt setApprovalDetails(GoodsExchangeDaoExt goodsExchangeDao, JsonData approvalDetails) {
		if (SalesUtil.FTEP_APPROVAL_DETAILS.equals(approvalDetails.getType())) {
			GoodsExchangeApprovalDetailsDto approvalDetail = (GoodsExchangeApprovalDetailsDto) MapperUtil
					.getObjectMapperInstance()
					.convertValue(approvalDetails.getData(), GoodsExchangeApprovalDetailsDto.class);
			if (approvalDetail.getApprovalDate() == null) {
				approvalDetail.setApprovalDate(businessDayService.getBusinessDay().getBusinessDate());
			}
			if (approvalDetail == null) {
				throw new ServiceException(SalesConstants.NO_APPROVAL_DATE, SalesConstants.ERR_SALE_394,
						Map.of("approverType", "ApproverDate/ApproverCode"));
			}
			if (approvalDetail.getApprovedBy() == null) {
				throw new ServiceException(SalesConstants.NO_APPROVAL_DATE, SalesConstants.ERR_SALE_394,
						Map.of("approverType", "ApprovedBy"));
			}
			if ("EMAIL".equals(approvalDetail.getProcessType()) && approvalDetail.getApprovalDate() == null) {
				throw new ServiceException(SalesConstants.NO_APPROVAL_DATE, SalesConstants.ERR_SALE_394,
						Map.of("approverType", "ApproverDate"));
			}
			if ("CODE".equals(approvalDetail.getProcessType()) && approvalDetail.getApprovalCode() == null) {
				throw new ServiceException(SalesConstants.NO_APPROVAL_DATE, SalesConstants.ERR_SALE_394,
						Map.of("approverType", "ApproverCode"));
			}
			ListResponse<FileDetailsDto> fileList = fileService.listFileIds(goodsExchangeDao.getId(),
					goodsExchangeDao.getSalesTxn().getCustomerId(), UploadFileDocTypeEnum.TEP.name(),
					UploadFileTypeEnum.OTHERS.name(), goodsExchangeDao.getSalesTxn().getLocationCode());
			approvalDetail.setFileList(fileList);
			goodsExchangeDao.getSalesTxn().setCustomerDocDetails(
					MapperUtil.getStringFromJson(new JsonData(SalesUtil.FTEP_APPROVAL_DETAILS, approvalDetail)));
		}
		return goodsExchangeDao;
	}

	private void eInvoiceCheck(String txnType, GoodsExchangeDaoExt goodsExchangeDaoExt,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, SalesTxnDaoExt salesTxn) {
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(salesTxn.getLocationCode());
		StoreDetails storeDetails = locationCacheDto.getStoreDetails();
		if (BooleanUtils.isTrue(storeDetails.getIsEinvoiceEnabled())) {
			CustomerTxnDaoExt customerTxnDaoExt = cusTxnDetailsRepository.findOneBySalesTxnDaoId(salesTxn.getId());
			customerTxnDaoExt
					.setMobileNumber(CryptoUtil.decrypt(customerTxnDaoExt.getMobileNumber(), MOBILE_NO, false));
			customerTxnDaoExt.setEmailId(CryptoUtil.decrypt(customerTxnDaoExt.getEmailId(), EMAIL_ID, false));
			customerTxnDaoExt
					.setCustomerName(CryptoUtil.decrypt(customerTxnDaoExt.getCustomerName(), CUSTOMER_NAME, false));
			customerTxnDaoExt.setCustTaxNo(CryptoUtil.decrypt(customerTxnDaoExt.getCustTaxNo(), CUST_TAX_NO, false));
			customerTxnDaoExt
					.setCustTaxNoOld(CryptoUtil.decrypt(customerTxnDaoExt.getCustTaxNoOld(), CUST_TAX_NO_OLD, false));
			customerTxnDaoExt.setInstiTaxNo(CryptoUtil.decrypt(customerTxnDaoExt.getInstiTaxNo(), INSTI_TAX_NO, false));
			customerTxnDaoExt.setPassportId(CryptoUtil.decrypt(customerTxnDaoExt.getPassportId(), PASSPORT_ID, false));
			SalesInvoiceDocumentsDao salesInvoiceDocumentsDao = salesInvoiceDocumentsRepository
					.findByReferenceIdAndTransactionType(salesTxn.getId(), EinvoiceTransactionTypeEnum.TEP.name());
			if (salesInvoiceDocumentsDao == null) {
				EinvoiceIrnDetailsResponseDto einvoiceIrnDetailsResponseDto = commonTransactionService.generateInvoice(
						txnType, goodsExchangeDetailsList, salesTxn, goodsExchangeDaoExt, customerTxnDaoExt);
				if (BooleanUtils.isTrue(einvoiceIrnDetailsResponseDto.getStatus())) {
					salesInvoiceDocumentsDao = MapperUtil.mapObjToClass(einvoiceIrnDetailsResponseDto,
							SalesInvoiceDocumentsDao.class);
					salesInvoiceDocumentsDao.setReferenceId(salesTxn.getId());
					salesInvoiceDocumentsDao.setTransactionType(EinvoiceTransactionTypeEnum.TEP.name());
					salesInvoiceDocService.syncDataInvoiceDocs(salesInvoiceDocumentsDao);
				}
			}
		}
	}

	private InventoryItemDto validateCutPieceTep(String subTxnType,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList) {
		InventoryItemDto inventoryItemDto = new InventoryItemDto();
		if (SubTxnTypeEnum.CUT_PIECE_TEP.toString().equals(subTxnType)) {
			GoodsExchangeDetailsDaoExt goodsExchangeDetailsDao = goodsExchangeDetailsList.get(0);
			String inventoryId = goodsExchangeDetailsDao.getInventoryId();
			inventoryItemDto = engineService.validateInventoryItem(inventoryId, null);
			if (inventoryItemDto == null) {
				throw new ServiceException("This item is not available in the inventory", "ERR-SALE-279");
			}
			if (!BinGroupEnum.STN.toString().equals(inventoryItemDto.getBinGroupCode())) {
				throw new ServiceException("This item is not in STN bin group and the item is not available for sale",
						"ERR-SALE-285", "bin group code : " + inventoryItemDto.getBinGroupCode());
			}
			if (inventoryItemDto.getTotalQuantity() == 0) {
				throw new ServiceException("This item is not available in the inventory", "ERR-SALE-279",
						"total quantity" + inventoryItemDto.getTotalQuantity());
			}
			if (inventoryItemDto.getLotNumber().substring(inventoryItemDto.getLotNumber().length() - 2).equals("CP")) {
				throw new ServiceException("Cut piece is already done for the item code", "ERR-SALE-282");
			}
		}
		return inventoryItemDto;
	}

	private List<InventoryDetailsDao> confirmOrApprovalTep(String status, String txnType, String subTxnType,
			GepConfirmOrHoldDto gepConfirmOrHoldDto, GoodsExhangeDaoDto goodsExhangeDaoDto,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, SalesTxnDaoExt salesTxn,
			InventoryItemDto inventoryDto) {
		if (SubTxnTypeEnum.MANUAL_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_INTER_BRAND_TEP.toString().equals(subTxnType)) {
			validateManualTepWeight(goodsExhangeDaoDto.getGoodsExchange(), subTxnType);
		}
		CustomerDetailsDto customerDetails = customerService
				.getCustomer(goodsExhangeDaoDto.getGoodsExchange().getSalesTxn().getCustomerId());
		// send for approval if studded and cm available no lotnumber
		Integer reqDocNo = raiseRequest(gepConfirmOrHoldDto, goodsExhangeDaoDto.getGoodsExchange(),
				goodsExchangeDetailsList, customerDetails);
		if (reqDocNo > 0) {
			status = TransactionStatusEnum.APPROVAL_PENDING.toString();
		}
		// doc no generation for CONFIRMED status
		super.docNoGeneration(status, txnType, subTxnType, goodsExhangeDaoDto.getGoodsExchange(), SalesDocTypeEnum.TEP);
		goodsExhangeDaoDto.getGoodsExchange().getSalesTxn().setEmployeeCode(gepConfirmOrHoldDto.getEmployeeCode());
		goodsExhangeDaoDto.setReqDocNo(reqDocNo);
		goodsExhangeDaoDto.getGoodsExchange().getSalesTxn().setConfirmedTime(CalendarUtils.getCurrentDate());

		goodsExchangeDetailsList = updateTotalValueForRefund(goodsExchangeDetailsList, goodsExhangeDaoDto,
				gepConfirmOrHoldDto.getPaymentType(), status);

		Set<InventoryDetailsDao> inventoryList = new HashSet<>();
		if (TransactionStatusEnum.CONFIRMED.toString().equals(salesTxn.getStatus())) {
			if (SubTxnTypeEnum.NEW_TEP.toString().equals(subTxnType)
					|| SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(subTxnType)
					|| SubTxnTypeEnum.INTER_BRAND_TEP.toString().equals(subTxnType)
					|| SubTxnTypeEnum.MANUAL_TEP.toString().equals(subTxnType)
					|| SubTxnTypeEnum.MANUAL_INTER_BRAND_TEP.toString().equals(subTxnType)
					|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(subTxnType)) {
				if (TepPaymentTypeEnum.REFUND.toString().equals(gepConfirmOrHoldDto.getPaymentType())) {
					validateRefundInterBrandTep(subTxnType);
					addRefundDetails(customerDetails, goodsExchangeDetailsList, goodsExhangeDaoDto.getGoodsExchange(),
							gepConfirmOrHoldDto);
				}
				List<InventoryDetailsDao> invList = addItemDetailsInInventory(goodsExhangeDaoDto.getGoodsExchange(),
						goodsExchangeDetailsList);
				inventoryList.addAll(invList);
			} else if (SubTxnTypeEnum.CUT_PIECE_TEP.toString().equals(subTxnType)) {
				List<InventoryDetailsDao> remInvList = super.removeItemFromInventory(
						goodsExhangeDaoDto.getGoodsExchange(), goodsExchangeDetailsList.get(0));
				List<InventoryDetailsDao> invList = addItemsInInventoryForCutPiece(
						goodsExhangeDaoDto.getGoodsExchange(), goodsExchangeDetailsList.get(0), inventoryDto);
				inventoryList.addAll(remInvList);
				inventoryList.addAll(invList);
			}

			// get applicable discounts
			GoodExchangeDiscountDetailsDto discountDetails = super.getApplicableDiscounts(
					goodsExhangeDaoDto.getGoodsExchange(), goodsExchangeDetailsList);

			JsonData discountJsonData = getValidTepDiscount(gepConfirmOrHoldDto.getDiscountTypeSelected(),
					discountDetails);
			if (TepPaymentTypeEnum.CN.toString().equals(gepConfirmOrHoldDto.getPaymentType())) {
				Integer cnDocNo = super.generateCN(CNType.TEP.toString(), goodsExhangeDaoDto.getGoodsExchange(),
						gepConfirmOrHoldDto.getRemarks(), discountJsonData, null);
				goodsExhangeDaoDto.setCnDocNo(cnDocNo);
			}

			// Update CashMemo Pulled Reason for GRN Type
			for (GoodsExchangeDetailsDaoExt goodsExchangeDetails : goodsExchangeDetailsList) {
				if (goodsExchangeDetails.getCashMemoDetails() != null) {

					commonTransactionService.saveSalesTxnForLegacyPulledCM(
							goodsExchangeDetails.getCashMemoDetails().getCashMemoDao().getSalesTxnDao(),
							TransactionTypeEnum.TEP.name());
				}
			}
		}
		super.saveGoodsExchangeDetailsListObject(goodsExchangeDetailsList);
		return new ArrayList<>(inventoryList);
	}

	private void validateRefundInterBrandTep(String subTxnType) {
		if (SubTxnTypeEnum.MANUAL_INTER_BRAND_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.INTER_BRAND_TEP.toString().equals(subTxnType)) {
			TepValidationConfigDetails tepValidation = engineService
					.getTepCancelDetails(TepTypeEnum.CANCEL_TEP.toString());
			if (tepValidation != null && Boolean.FALSE.equals(tepValidation.getIsInterBrandCashRefundAllowed())) {
				throw new ServiceException(SalesConstants.ERR_SALE_405,
						SalesConstants.REFUND_NOT_ALLOWED_FOR_INTERBRAND,
						Map.of("IsInterBrandCashRefundAllowed", tepValidation.getIsInterBrandCashRefundAllowed(),
								"locationCode", CommonUtil.getLocationCode()));
			}
		}
	}

	private JsonData getValidTepDiscount(String discountType, GoodExchangeDiscountDetailsDto discountDetails) {

		JsonData discountJsonData = new JsonData();

		if (discountDetails.getDiscountObj().isEmpty()) {
			return null;// have to return null if not applicable
		}
		super.checkDiscount(discountType, discountDetails);

		Map<String, Object> discounts = new HashMap<>();
		discountJsonData.setType("CN_DISCOUNT_DETAILS");
		for (Map.Entry<String, Object> mapObj : discountDetails.getDiscountObj().entrySet()) {
			if ((discountType != null && discountType.equals(mapObj.getKey())) || (discountType == null)) {
				if (DiscountTypeEnum.COIN_OFFER_DISCOUNT.name().equals(mapObj.getKey())) {
					discounts.put("coinOfferDiscount", mapObj.getValue());
				} else if (DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name().equals(mapObj.getKey())) {
					discounts.put("karatageExchangeDiscount", mapObj.getValue());
				}

				if (discountType != null)
					break;
			}

		}
		discountJsonData.setData(discounts);

		return discountJsonData;
	}

	private List<GoodsExchangeDetailsDaoExt> updateTotalValueForRefund(
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, GoodsExhangeDaoDto goodsExhangeDaoDto,
			String paymentType, String status) {
		List<GoodsExchangeDetailsDaoExt> itemDetails = new ArrayList<>();
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal refundValue = BigDecimal.ZERO;

		if (TepPaymentTypeEnum.REFUND.toString().equals(paymentType)
				&& !status.equalsIgnoreCase(TransactionStatusEnum.APPROVAL_PENDING.toString())) {
			for (GoodsExchangeDetailsDaoExt record : goodsExchangeDetailsList) {
				
				try {
					JsonNode root = MapperUtil.getObjectMapperInstance().readTree(record.getPriceDetails());
					JsonNode arrNode = root.path("refundDeductionAmount");
					BigDecimal itemRefundAmt = arrNode.decimalValue();
					refundValue = refundValue.add(itemRefundAmt);
					BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(refundValue);
					refundValue = refundValue.add(roundingVariance);
					roundingVariance = commonTransactionService.getRoundingVariance(record.getFinalValue());
					BigDecimal itemFinalAmt = record.getFinalValue().add(roundingVariance).subtract(itemRefundAmt);
					totalValue = totalValue.add(itemFinalAmt);
//					record.setTotalValue(itemFinalAmt);
					record.setFinalValue(itemFinalAmt);
					BigDecimal unitValue = record.getFinalValue().divide(
									BigDecimal.valueOf(record.getQuantity()), DomainConstants.PRICE_SCALE,
									RoundingMode.HALF_UP);
					record.setUnitValue(unitValue);
					record.setValueOnRefund(itemFinalAmt);
					//record.setUnitValue(itemFinalAmt);
					itemDetails.add(record);
				} catch (IOException e) {
					throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
				}
			}
			BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(totalValue);
			totalValue = totalValue.add(roundingVariance);
			log.debug("rounding variance {}", roundingVariance);
			log.debug("totalValue {}", totalValue);
			
//			goodsExhangeDaoDto.getGoodsExchange().setTotalValue(totalValue);
			goodsExhangeDaoDto.getGoodsExchange().setFinalValue(totalValue);
		}
		
		//If Its a Credit note, store the refund amt in header table for cn details 
		//cancellation 
		if (refundValue.compareTo(BigDecimal.ZERO) == 0) {
			refundValue = BigDecimal.ZERO;
			for (GoodsExchangeDetailsDaoExt record : goodsExchangeDetailsList) {
				try {
					JsonNode root = MapperUtil.getObjectMapperInstance().readTree(record.getPriceDetails());
					JsonNode arrNode = root.path("refundDeductionAmount");
					BigDecimal itemRefundAmt = arrNode.decimalValue();
					BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(itemRefundAmt);
					itemRefundAmt = itemRefundAmt.add(roundingVariance);
					BigDecimal itemFinalAmt = record.getFinalValue().add(roundingVariance).subtract(itemRefundAmt);
					record.setValueOnRefund(itemFinalAmt);
					itemDetails.add(record);;
					refundValue = refundValue.add(itemRefundAmt);
				} catch (IOException e) {
					throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
				}
			}
		}
		
		if (!TepPaymentTypeEnum.REFUND.toString().equals(paymentType)) {
			for (GoodsExchangeDetailsDaoExt record : goodsExchangeDetailsList) {
				TepPriceResponseDto tepPrice = getPriceDetails(record);
				tepPrice.setRefundDeductionPercent(BigDecimal.ZERO);
				tepPrice.setRefundDeductionAmount(BigDecimal.ZERO);
				record.setPriceDetails(MapperUtil.getStringFromJson(tepPrice));
			}
		}

		BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(totalValue);
		totalValue = totalValue.add(roundingVariance);
		log.debug("rounding variance {}", roundingVariance);
		log.debug("refundValue {}", refundValue);
		
		goodsExhangeDaoDto.getGoodsExchange().setRefundValue(refundValue);
		if (!itemDetails.isEmpty()) {
			return super.saveGoodsExchangeDetailsListObject(itemDetails);
		}
		return goodsExchangeDetailsList;
	}

	private void addRefundDetails(CustomerDetailsDto customerDetails,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, GoodsExchangeDaoExt goodsExchange,
			GepConfirmOrHoldDto gepConfirmOrHoldDto) {
		JsonData jsonData = gepConfirmOrHoldDto.getRefundDetails();
		boolean isRequestRaised = false;
		if ("TEP_CHEQUE_REFUND".equals(jsonData.getType()) || "TEP_RTGS_REFUND".equals(jsonData.getType())) {
			RefundRequestCreateDto refundRequestDto = getRefundRequestHeaderObject(customerDetails,
					goodsExchangeDetailsList, goodsExchange, gepConfirmOrHoldDto);
			refundService.createRefundRequest(goodsExchange.getSalesTxn().getTxnType(), refundRequestDto);
			isRequestRaised = true;
		}

		if (!isRequestRaised) {
			PaymentReversalDaoExt paymentReversal = new PaymentReversalDaoExt();
			paymentReversal.setSalesTxn(goodsExchange.getSalesTxn());
			paymentReversal.setAmount(goodsExchange.getFinalValue());
			paymentReversal.setPaymentGroup(PaymentGroupEnum.REGULAR.name());
			paymentReversal.setPaymentCode(PaymentCodeEnum.CASH.getPaymentcode());
			paymentReversal.setReversalDate(businessDayService.getBusinessDay().getBusinessDate());
			paymentReversal.setHostName(CommonUtil.getAuthUser().getHostName());
			paymentReversalRepo.save(paymentReversal);
		} else if (isRequestRaised
				&& ("TEP_RTGS_REFUND".equals(jsonData.getType()) || "TEP_CHEQUE_REFUND".equals(jsonData.getType()))) {
			PaymentReversalDaoExt paymentReversal = new PaymentReversalDaoExt();
			paymentReversal.setSalesTxn(goodsExchange.getSalesTxn());
			paymentReversal.setAmount(goodsExchange.getFinalValue());
			paymentReversal.setPaymentGroup(PaymentGroupEnum.REGULAR.name());
			paymentReversal.setPaymentCode(PaymentCodeEnum.RO_PAYMENT.getPaymentcode());
			paymentReversal.setReversalDate(businessDayService.getBusinessDay().getBusinessDate());
			paymentReversal.setHostName(CommonUtil.getAuthUser().getHostName());
			paymentReversalRepo.save(paymentReversal);
		}

	}

	private RefundRequestCreateDto getRefundRequestHeaderObject(CustomerDetailsDto customerDetails,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, GoodsExchangeDaoExt goodsExchange,
			GepConfirmOrHoldDto gepConfirmOrHoldDto) {
		List<TepRefundHeaderItemDetailsDto> itemDetailsList = new ArrayList<>();
		RefundRequestCreateDto refundRequestDto = (RefundRequestCreateDto) MapperUtil
				.getDtoMapping(goodsExchange.getSalesTxn(), RefundRequestCreateDto.class);
		refundRequestDto.setRemarks(gepConfirmOrHoldDto.getRemarks());
		TepRefundHeaderDto tepRefundHeaderDto = (TepRefundHeaderDto) MapperUtil.getDtoMapping(goodsExchange,
				TepRefundHeaderDto.class);
		tepRefundHeaderDto.setCustomerId(goodsExchange.getSalesTxn().getCustomerId());
		tepRefundHeaderDto.setCustomerName(customerDetails.getCustomerName());
		if (!StringUtils.isEmpty(goodsExchange.getSalesTxn().getManualBillDetails())) {
			ManualBillTxnDetailsDto manualBillDetails = commonTransactionService
					.mapJsonToManualBillDetails(goodsExchange.getSalesTxn().getManualBillDetails());
			tepRefundHeaderDto.setManualDetails(manualBillDetails);
		}
		goodsExchangeDetailsList.forEach(record -> {
			TepRefundHeaderItemDetailsDto itemDetails = (TepRefundHeaderItemDetailsDto) MapperUtil.getDtoMapping(record,
					TepRefundHeaderItemDetailsDto.class);
			boolean isCmAvailable = true;
			boolean isSaleable = true;
			if (record.getCashMemoDetails() == null) {
				isCmAvailable = false;
			}
			if (!record.getBinCode().equals("TEPSALE")) {
				isSaleable = false;
			}

			itemDetails.setTotalTax(record.getTotalTax());
			itemDetails.setIsSaleable(isSaleable);
			itemDetails.setIsCmAvailable(isCmAvailable);
			TepPriceResponseDto tepPrice = getPriceDetails(record);
			BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(tepPrice.getRefundDeductionAmount());
			tepPrice.setRefundDeductionAmount(tepPrice.getRefundDeductionAmount().add(roundingVariance));		
			itemDetails.setPriceDetails(tepPrice);
			itemDetails.setTaxDetails(MapperUtil.getJsonFromString(record.getTaxDetails()));
			itemDetails.setFinalValue(record.getTotalValue().add(record.getTotalTax()));
			itemDetailsList.add(itemDetails);
			tepRefundHeaderDto.setItemDetails(itemDetailsList);
		});

		tepRefundHeaderDto.setTotalRefundAmount(goodsExchange.getFinalValue());
		JsonData headerJsonData = new JsonData();
		headerJsonData.setType("TEP_REFUND_HEADER");
		headerJsonData.setData(tepRefundHeaderDto);
		refundRequestDto.setHeaderData(headerJsonData);
		refundRequestDto.setRefTxnId(goodsExchange.getId());
		refundRequestDto.setRequestorName(goodsExchange.getSalesTxn().getEmployeeCode());
		try {
			JsonData detailsJsonData = new JsonData();
			JsonNode jsonNodeObj = MapperUtil.getObjectMapperInstance()
					.readTree(MapperUtil.getStringFromJson(gepConfirmOrHoldDto.getRefundDetails().getData()));
			detailsJsonData.setType("TEP_REFUND_DETAILS");
			detailsJsonData.setData(gepConfirmOrHoldDto.getRefundDetails().getData());
			String refundMode = JsonUtils.getValueFromJsonString(jsonNodeObj, "refundMode");
			refundRequestDto.setRefundType(refundMode);
			refundRequestDto.setRequestData(detailsJsonData);
		} catch (IOException e) {
			throw new ServiceException("UNABLE TO PARSE JSON", ERR_CORE_003);
		}
		return refundRequestDto;
	}

	private List<InventoryDetailsDao> addItemsInInventoryForCutPiece(GoodsExchangeDaoExt goodsExchangeDaoExt,
			GoodsExchangeDetailsDaoExt goodsExchangeDetails, InventoryItemDto inventoryDto) {
		List<InventoryDetailsDao> inventoryDetails = new ArrayList<>();
		BusinessDayDto businessDayDto = engineService.getBusinessDay(CommonUtil.getLocationCode());
		updateOriginalInventoryItemForCutPiece(businessDayDto.getBusinessDate(), inventoryDetails, inventoryDto,
				goodsExchangeDetails, goodsExchangeDaoExt);
		super.addItemsInInventory(businessDayDto.getBusinessDate(), goodsExchangeDaoExt.getSalesTxn().getDocNo(),
				SalesDocTypeEnum.TEP, List.of(goodsExchangeDetails), inventoryDetails,
				goodsExchangeDaoExt.getSalesTxn().getFiscalYear());
		return inventoryDetails;
	}

	private void updateOriginalInventoryItemForCutPiece(Date docDate, List<InventoryDetailsDao> inventoryDetails,
			InventoryItemDto inventoryDto, GoodsExchangeDetailsDaoExt goodsExchangeDetails,
			GoodsExchangeDaoExt goodsExchangeDaoExt) {
		BigDecimal initalValue = BigDecimal.ZERO;
		InventoryDetailsDao invDetails = (InventoryDetailsDao) MapperUtil.getDtoMapping(inventoryDto,
				InventoryDetailsDao.class, "id");
		BigDecimal updatedWeight = invDetails.getStdWeight().subtract(goodsExchangeDetails.getUnitWeight());
		BigDecimal updatedValue = invDetails.getStdValue().subtract(goodsExchangeDetails.getUnitValue());
		invDetails.setId(UUID.randomUUID().toString());
		invDetails.setBinCode(inventoryDto.getBinCode());
		invDetails.setBinGroupCode(inventoryDto.getBinGroupCode());
		invDetails.setBinModifiedDate(CalendarUtils.getCurrentDate());
		invDetails.setLotNumber(goodsExchangeDetails.getLotNumber());
		invDetails.setDocNumber(goodsExchangeDaoExt.getSalesTxn().getDocNo());
		invDetails.setDocType(SalesDocTypeEnum.TEP.toString());
		invDetails.setProductCategory(inventoryDto.getProductCategoryCode());
		invDetails.setMfgDate(docDate);
		invDetails.setProductGroup(inventoryDto.getProductGroupCode());
		// need to change hardcoded value
		invDetails.setCurrencyCode("INR");
		invDetails.setOrgCode("TJEW");
		invDetails.setWeightUnit("gms");
		log.debug("updated weight {}", updatedWeight);
		invDetails.setSerialNumber(String.valueOf(updatedWeight));
		invDetails.setIssuedQuantity((short) 0);
		invDetails.setTotalQuantity((short) 1);
		invDetails.setTotalWeight(updatedWeight);
		invDetails.setStdWeight(updatedWeight);
		invDetails.setTotalValue(updatedValue);
		invDetails.setStdValue(updatedValue);
		invDetails.setLocationCode(CommonUtil.getLocationCode());
		WeightDetailsDto weightDetailsDto = new WeightDetailsDto(initalValue, initalValue, initalValue, initalValue,
				initalValue, initalValue);
		weightDetailsDto.setGoldWeight(updatedWeight);
		JsonData inventoryWeightDetails = new JsonData();
		inventoryWeightDetails.setType("WEIGHT_DETAILS");
		inventoryWeightDetails.setData(weightDetailsDto);
		invDetails.setTotalWeightDetails(MapperUtil.getStringFromJson(inventoryWeightDetails));
		inventoryDetails.add(invDetails);
	}

	private Integer validateAndRequestWorkflowForNewTep(GepConfirmOrHoldDto gepConfirmOrHoldDto,
			GoodsExchangeDaoExt goodsExchange, List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsDaoExt,
			CustomerDetailsDto customerDetails) {
		Integer reqDoNo = 0;
		boolean isTEPException = false;
		Map<String, String> studdedProductCodes = engineService.getProductGroupList(PlainStuddedEnum.S.toString(),
				TransactionTypeEnum.TEP.toString());
		TepItemResponseDto tepItemConfig = engineService.getTepItem(goodsExchangeDetailsDaoExt.get(0).getItemCode(),
				customerDetails.getMobileNumber(), goodsExchange.getSalesTxn().getSubTxnType());

		if (gepConfirmOrHoldDto.getTepExceptionDetails() != null) {
			TepExceptionDetailsDto reqTepExceptionDtls = MapperUtil.getObjectMapperInstance()
					.convertValue(gepConfirmOrHoldDto.getTepExceptionDetails().getData(), TepExceptionDetailsDto.class);
			if (reqTepExceptionDtls.getFlatExchangeValue().compareTo(BigDecimal.ZERO) <= 0
					&& reqTepExceptionDtls.getDeductionPercent().compareTo(BigDecimal.ZERO) <= 0) {
				throw new ServiceException("Provide Flat Exchange value or Deduction value for TEP Exception",
						"ERR-SALE-439");
			} else if (reqTepExceptionDtls.getFlatExchangeValue() != null) {
				if (reqTepExceptionDtls.getDeductionPercent().compareTo(BigDecimal.ZERO) <= 0 && reqTepExceptionDtls
						.getFlatExchangeValue().compareTo(tepItemConfig.getMaxFlatTepException()) > 0) {
					throw new ServiceException("Flat exchange value cannot be greater than configured value",
							"ERR-SALE-438");
				}
				isTEPException = true;
			} else if (reqTepExceptionDtls.getDeductionPercent() != null) {
				isTEPException = true;
			}
		}

//			if(tepException.getFlatTepExchangeValue()!= null && !tepException.getFlatTepExchangeValue().equals("0")) {
//				isApprovalRequired = false;
//			}
		if (isTEPException) {
			WorkflowProcessCreateResponseDto workflowProcessCreateResponseDto = callWorkflowForNewTepException(
					goodsExchangeDetailsDaoExt.get(0), gepConfirmOrHoldDto);

			// workflowProcessCreateResponseDto.setRequestorUserName(gepConfirmOrHoldDto.getEmployeeCode());

			goodsExchange.setProcessId(workflowProcessCreateResponseDto.getProcessId());
			reqDoNo = workflowProcessCreateResponseDto.getDocNo();
		} else if (!CollectionUtils.isEmpty(goodsExchangeDetailsDaoExt)
				&& (goodsExchangeDetailsDaoExt.get(0).getCashMemoDetails() != null
						&& goodsExchangeDetailsDaoExt.get(0).getCashMemoDetails().getLotNumber() == null
						&& studdedProductCodes.containsKey(
								goodsExchangeDetailsDaoExt.get(0).getCashMemoDetails().getProductGroupCode()))) {
			// always one item will be having in case of tep workflow approval
			// if studded item and lot number is null
			// calling for workflow service
			// -call workflow api for request
			WorkflowProcessCreateResponseDto workflowProcessCreateResponseDto = callWorkflowForNewTep(
					goodsExchangeDetailsDaoExt.get(0), gepConfirmOrHoldDto);

			goodsExchange.setProcessId(workflowProcessCreateResponseDto.getProcessId());
			reqDoNo = workflowProcessCreateResponseDto.getDocNo();
		}
		return reqDoNo;
	}

	private Integer raiseRequest(GepConfirmOrHoldDto gepConfirmOrHoldDto, GoodsExchangeDaoExt goodsExchange,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsDaoExt, CustomerDetailsDto customerDetails) {
		Integer reqDoNo = 0;
		if (SubTxnTypeEnum.NEW_TEP.toString().equals(goodsExchange.getSalesTxn().getSubTxnType())
				|| SubTxnTypeEnum.MANUAL_TEP.toString().equals(goodsExchange.getSalesTxn().getSubTxnType())) {
			reqDoNo = validateAndRequestWorkflowForNewTep(gepConfirmOrHoldDto, goodsExchange,
					goodsExchangeDetailsDaoExt, customerDetails);
		} else if (SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(goodsExchange.getSalesTxn().getSubTxnType())
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString()
						.equals(goodsExchange.getSalesTxn().getSubTxnType())) {
			reqDoNo = validateAndRequestWorkflowForFullValueTep(gepConfirmOrHoldDto, goodsExchange,
					goodsExchangeDetailsDaoExt, customerDetails);
		}
		log.debug("request doc no from workflow {}", reqDoNo);
		return reqDoNo;
	}

	private Integer validateAndRequestWorkflowForFullValueTep(GepConfirmOrHoldDto gepConfirmOrHoldDto,
			GoodsExchangeDaoExt goodsExchange, List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsDaoExt,
			CustomerDetailsDto customerDetails) {
		Integer reqDoNo = 0;
		if (!CollectionUtils.isEmpty(goodsExchangeDetailsDaoExt)) {
			WorkflowProcessCreateResponseDto workFlowProcessResponse = callWorkflowForFullValueTep(
					goodsExchangeDetailsDaoExt.get(0), goodsExchange, gepConfirmOrHoldDto, customerDetails);
			goodsExchange.setProcessId(workFlowProcessResponse.getProcessId());
			reqDoNo = workFlowProcessResponse.getDocNo();
		}
		return reqDoNo;
	}

	private WorkflowProcessCreateResponseDto callWorkflowForFullValueTep(
			GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt, GoodsExchangeDaoExt goodsExchange,
			GepConfirmOrHoldDto gepConfirmOrHoldDto, CustomerDetailsDto customerDetails) {
		SalesTxnDaoExt salesObj = goodsExchange.getSalesTxn();
		FullValueTepHeaderDto fullValueTepHeader = createFullValueTepWorkflowHeaderObject(goodsExchangeDetailsDaoExt,
				gepConfirmOrHoldDto, salesObj, customerDetails);
		FullValueTepDetailsDto fullValueTepDetails = createFullValueTepWorkflowDetailsObject();
		// filter values
		Map<String, String> filterValues = Map.of("mobileNo", String.valueOf(fullValueTepHeader.getCustomerMobileNo()),
				SalesConstants.LOC_CODE, salesObj.getLocationCode());
		WorkflowProcessCreateDto workflowProcessCreateDto = new WorkflowProcessCreateDto();
		workflowProcessCreateDto.setRequestorRemarks(salesObj.getRemarks());
		workflowProcessCreateDto.setFilterValues(filterValues);
		workflowProcessCreateDto
				.setHeaderData(new JsonData(SalesUtil.FULL_VALUE_TEP_WORKFLOW + "_HEADER", fullValueTepHeader));
		workflowProcessCreateDto
				.setRequestData(new JsonData(SalesUtil.FULL_VALUE_TEP_WORKFLOW + "_DETAILS", fullValueTepDetails));
		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, goodsExchange.getSalesTxn().getSubTxnType());
		// calling eposs integration service
		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.POST,
				SalesUtil.WORKFLOW_PROCESS_URL, reqParams, workflowProcessCreateDto);
		return MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
				WorkflowProcessCreateResponseDto.class);
	}

	private FullValueTepDetailsDto createFullValueTepWorkflowDetailsObject() {
		FullValueTepDetailsDto fullValueTepDetails = new FullValueTepDetailsDto();
		fullValueTepDetails.setApproverRemarks(null);
		fullValueTepDetails.setOverrideValue(BigDecimal.ZERO);
		fullValueTepDetails.setPaymentValue(Arrays.asList("Full Value", "Propotioned Value"));
		fullValueTepDetails.setTepValue(Arrays.asList("Current Value", "Overriding Value"));
		return fullValueTepDetails;
	}

	/**
	 * @param goodsExchangeDetailsDaoExt
	 * @param gepConfirmOrHoldDto
	 * @param salesObj
	 * @param customer
	 */
	private FullValueTepHeaderDto createFullValueTepWorkflowHeaderObject(
			GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt, GepConfirmOrHoldDto gepConfirmOrHoldDto,
			SalesTxnDaoExt salesObj, CustomerDetailsDto customerDetails) {
		BusinessDayDto businessDayDto = engineService.getBusinessDay(CommonUtil.getLocationCode());
		LocationCacheDto locationDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		FullValueTepHeaderDto fullValueTepHeader = new FullValueTepHeaderDto();
		fullValueTepHeader.setFvtLocationType(locationDto.getOwnerTypeCode());
		fullValueTepHeader.setCmDocNo(
				goodsExchangeDetailsDaoExt.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getDocNo());
		fullValueTepHeader.setCmDocDate(
				goodsExchangeDetailsDaoExt.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getDocDate());
		fullValueTepHeader.setBilledWeight(goodsExchangeDetailsDaoExt.getCashMemoDetails().getTotalWeight());
		fullValueTepHeader.setCmLocationCode(
				goodsExchangeDetailsDaoExt.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getLocationCode());
		fullValueTepHeader.setCustomerMobileNo(customerDetails.getMobileNumber());
		fullValueTepHeader.setCustomerName(customerDetails.getCustomerName());
		fullValueTepHeader.setFvtLocationCode(salesObj.getLocationCode());
		fullValueTepHeader.setItemCode(goodsExchangeDetailsDaoExt.getItemCode());
		fullValueTepHeader.setLotNumber(goodsExchangeDetailsDaoExt.getLotNumber());
		fullValueTepHeader.setMeasuredWeight(goodsExchangeDetailsDaoExt.getTotalWeight());
		fullValueTepHeader.setTotalQuantity(goodsExchangeDetailsDaoExt.getQuantity());
		fullValueTepHeader.setReasonForFullValueTep(gepConfirmOrHoldDto.getReason());

		Integer noOfDaysFromCm = (int) CalendarUtils.getDayDiff(
				goodsExchangeDetailsDaoExt.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getDocDate(),
				businessDayDto.getBusinessDate());
		fullValueTepHeader.setNoOfDaysFromCm(noOfDaysFromCm);
		if (goodsExchangeDetailsDaoExt.getCashMemoDetails() != null) {
			fullValueTepHeader.setCashMemoDetailsId(goodsExchangeDetailsDaoExt.getCashMemoDetails().getId());
		}
		List<ItemLotStoneDto> itemStones = getStoneDetails(goodsExchangeDetailsDaoExt);
		Short totalNoOfStones = 0;
		Short returnNoOfStones = 0;
		BigDecimal finalStoneValue = BigDecimal.ZERO;
		for (ItemLotStoneDto itemStoneObject : itemStones) {
			if (!StringUtils.isEmpty(itemStoneObject.getStoneCode())) {
				totalNoOfStones = (short) (totalNoOfStones + itemStoneObject.getNoOfStones());
				returnNoOfStones = (short) (returnNoOfStones + itemStoneObject.getMeasuredNoOfStones());
				finalStoneValue = finalStoneValue.add(itemStoneObject.getFinalStoneValue())
						.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);
			}
		}
		fullValueTepHeader.setStoneValue(finalStoneValue);
		fullValueTepHeader.setSalesTxnId(salesObj.getId());
		fullValueTepHeader.setTotalNoOfStones(totalNoOfStones);
		fullValueTepHeader.setMeasuredNoOfStones(returnNoOfStones);
		if (TepPaymentTypeEnum.CN.toString().equals(gepConfirmOrHoldDto.getPaymentType())) {
			fullValueTepHeader.setPaymentMode("CN");
		} else if (TepPaymentTypeEnum.REFUND.toString().equals(gepConfirmOrHoldDto.getPaymentType())) {
			fullValueTepHeader.setPaymentMode("Refund");
		}
		if (!StringUtils.isEmpty(salesObj.getManualBillDetails())) {
			ManualBillTxnDetailsDto manualBillDetails = commonTransactionService
					.mapJsonToManualBillDetails(salesObj.getManualBillDetails());
			fullValueTepHeader.setManualDetails(manualBillDetails);
		}
		BigDecimal metalValue = getMetalValue(goodsExchangeDetailsDaoExt.getPriceDetails());
		fullValueTepHeader.setMetalValue(metalValue);
		fullValueTepHeader.setApprovalDetails(MapperUtil.getJsonFromString(salesObj.getCustomerDocDetails()));
		fullValueTepHeader.setPriceDetails(MapperUtil.getJsonFromString(goodsExchangeDetailsDaoExt.getPriceDetails()));
		fullValueTepHeader.setEmployeeCode(gepConfirmOrHoldDto.getEmployeeCode());
		return fullValueTepHeader;
	}

	private BigDecimal getMetalValue(String priceDetails) {
		BigDecimal metalValue = BigDecimal.ZERO;
		try {
			JsonNode root = MapperUtil.getObjectMapperInstance().readTree(priceDetails);
			JsonNode metalPrice = root.path("metalPriceDetails");
			JsonNode arrNode = metalPrice.path("metalPrices");
			if (arrNode.isArray()) {
				for (final JsonNode objNode : arrNode) {
					String value = objNode.get("metalValue").asText();
					if (!value.equalsIgnoreCase("null")) {
						metalValue = metalValue.add(new BigDecimal(value));
					} else {

						metalValue = metalValue.add(new BigDecimal(0));
					}
				}
			}
		} catch (IOException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}
		return metalValue;
	}

	private WorkflowProcessCreateResponseDto callWorkflowForNewTepException(
			GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt, GepConfirmOrHoldDto gepConfirmOrHoldDto) {
		GoodsExchangeDaoExt goodsExchange = goodsExchangeDetailsDaoExt.getGoodsExchange();
		CustomerDetailsDto customerDetailsDto = customerService
				.getCustomer(goodsExchange.getSalesTxn().getCustomerId());
		GoodsExchangeHeaderDto goodsExchangeDto = createGoodsExchangeHeaderDto(goodsExchangeDetailsDaoExt,
				goodsExchange, customerDetailsDto);
		GoodsExchangeDetailDto goodsExchangeDetailDto = createGoodsExchangeDetailDto(goodsExchangeDetailsDaoExt);
		// filter values
		Map<String, String> filterValues = Map.of("itemCode", String.valueOf(goodsExchangeDto.getItemCode()),
				SalesConstants.LOC_CODE, goodsExchangeDto.getLocationCode(), "mobileNumber",
				customerDetailsDto.getMobileNumber());
		if (gepConfirmOrHoldDto.getTepExceptionDetails() != null) {
			goodsExchangeDto.setTepExceptionDetails(gepConfirmOrHoldDto.getTepExceptionDetails());
		}
		goodsExchangeDto.setEmployeeCode(gepConfirmOrHoldDto.getEmployeeCode());
		goodsExchangeDto.setPaymentType(gepConfirmOrHoldDto.getPaymentType());
		// workFlowType TEP_WORKFLOW_TYPE
		WorkflowProcessCreateDto workflowProcessCreateDto = new WorkflowProcessCreateDto();
		workflowProcessCreateDto.setRequestorRemarks(gepConfirmOrHoldDto.getRemarks());
		workflowProcessCreateDto
				.setHeaderData(new JsonData(SalesUtil.TEP_EXCEPTION_WORKFLOW_TYPE + "_HEADER", goodsExchangeDto));
		workflowProcessCreateDto.setRequestData(
				new JsonData(SalesUtil.TEP_EXCEPTION_WORKFLOW_TYPE + "_DETAILS", goodsExchangeDetailDto));
		workflowProcessCreateDto.setFilterValues(filterValues);

		Map<String, String> reqParams = null;
		if (SubTxnTypeEnum.NEW_TEP.toString().equals(goodsExchange.getSalesTxn().getSubTxnType()))
			reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, SalesUtil.TEP_EXCEPTION_WORKFLOW_TYPE);
//		else if (SubTxnTypeEnum.MANUAL_TEP.toString().equals(goodsExchange.getSalesTxn().getSubTxnType()))
//			reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, SalesUtil.MANUAL_TEP_WORKFLOW);
		// calling eposs integration service
		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.POST,
				SalesUtil.WORKFLOW_PROCESS_URL, reqParams, workflowProcessCreateDto);
		return MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
				WorkflowProcessCreateResponseDto.class);
	}

	private WorkflowProcessCreateResponseDto callWorkflowForNewTep(
			GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt, GepConfirmOrHoldDto gepConfirmOrHoldDto) {
		GoodsExchangeDaoExt goodsExchange = goodsExchangeDetailsDaoExt.getGoodsExchange();
		CustomerDetailsDto customerDetailsDto = customerService
				.getCustomer(goodsExchange.getSalesTxn().getCustomerId());
		GoodsExchangeHeaderDto goodsExchangeDto = createGoodsExchangeHeaderDto(goodsExchangeDetailsDaoExt,
				goodsExchange, customerDetailsDto);
		goodsExchangeDto.setEmployeeCode(gepConfirmOrHoldDto.getEmployeeCode());
		GoodsExchangeDetailDto goodsExchangeDetailDto = createGoodsExchangeDetailDto(goodsExchangeDetailsDaoExt);
		// filter values
		Map<String, String> filterValues = Map.of("itemCode", String.valueOf(goodsExchangeDto.getItemCode()),
				SalesConstants.LOC_CODE, goodsExchangeDto.getLocationCode());
		// workFlowType TEP_WORKFLOW_TYPE
		WorkflowProcessCreateDto workflowProcessCreateDto = new WorkflowProcessCreateDto();
		workflowProcessCreateDto.setRequestorRemarks(gepConfirmOrHoldDto.getRemarks());
		workflowProcessCreateDto.setHeaderData(new JsonData(SalesUtil.TEP_WORKFLOW_TYPE + "_HEADER", goodsExchangeDto));
		workflowProcessCreateDto
				.setRequestData(new JsonData(SalesUtil.TEP_WORKFLOW_TYPE + "_DETAILS", goodsExchangeDetailDto));
		workflowProcessCreateDto.setFilterValues(filterValues);

		Map<String, String> reqParams = null;
		if (SubTxnTypeEnum.NEW_TEP.toString().equals(goodsExchange.getSalesTxn().getSubTxnType()))
			reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, SalesUtil.TEP_WORKFLOW_TYPE);
		else if (SubTxnTypeEnum.MANUAL_TEP.toString().equals(goodsExchange.getSalesTxn().getSubTxnType()))
			reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, SalesUtil.MANUAL_TEP_WORKFLOW);
		// calling eposs integration service
		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.POST,
				SalesUtil.WORKFLOW_PROCESS_URL, reqParams, workflowProcessCreateDto);
		return MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
				WorkflowProcessCreateResponseDto.class);
	}

	/**
	 * @param goodsExchangeDetailsDaoExt
	 * @return
	 */
	private GoodsExchangeDetailDto createGoodsExchangeDetailDto(GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt) {
		GoodsExchangeDetailDto detailDto = new GoodsExchangeDetailDto();
		detailDto.setStones(getStoneDetails(goodsExchangeDetailsDaoExt));
		return detailDto;
	}

	private List<ItemLotStoneDto> getStoneDetails(GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt) {
		List<ItemLotStoneDto> stonedetails = new ArrayList<>();
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode root = mapper.readTree(goodsExchangeDetailsDaoExt.getPriceDetails());
			JsonNode arrNode = root.path("stones");
			if (arrNode.isArray()) {
				for (final JsonNode objNode : arrNode) {
					ItemLotStoneDto itemStone;
					itemStone = MapperUtil.getObjectMapperInstance().convertValue(objNode, ItemLotStoneDto.class);
					stonedetails.add(itemStone);
				}
			}
			return stonedetails;
		} catch (IOException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}

	}

	public TepPriceResponseDto getPriceDetails(GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt) {

		TepPriceResponseDto priceResponse = new TepPriceResponseDto();
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode root = mapper.readTree(goodsExchangeDetailsDaoExt.getPriceDetails());

			priceResponse = MapperUtil.getObjectMapperInstance().convertValue(root, TepPriceResponseDto.class);
			return priceResponse;

		} catch (IOException e) {
			throw new ServiceException("UNABLE TO PARSE JSON", ERR_CORE_003);
		}

	}

	/**
	 * @param goodsExchangeDetailsDaoExt
	 * @param goodsExchange
	 * @return
	 */
	private GoodsExchangeHeaderDto createGoodsExchangeHeaderDto(GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt,
			GoodsExchangeDaoExt goodsExchange, CustomerDetailsDto customerDetailsDto) {
		GoodsExchangeHeaderDto headerDto = new GoodsExchangeHeaderDto();

		headerDto.setCustomerName(customerDetailsDto.getCustomerName());
		headerDto.setFinalValue(goodsExchange.getFinalValue());
		headerDto.setFiscalYear(goodsExchange.getSalesTxn().getFiscalYear());
		headerDto.setItemCode(goodsExchangeDetailsDaoExt.getItemCode());
		headerDto.setLocationCode(goodsExchange.getSalesTxn().getLocationCode());
		headerDto.setMeasuredWeight(goodsExchangeDetailsDaoExt.getTotalWeight());
		headerDto.setStdWeight(goodsExchangeDetailsDaoExt.getUnitWeight());
		headerDto.setTotalQuantity(Short.valueOf((short) 1));
		headerDto.setSalesTxnId(goodsExchangeDetailsDaoExt.getGoodsExchange().getId());
		headerDto.setCustomerMobileNo(customerDetailsDto.getMobileNumber());
		if (!StringUtils.isEmpty(goodsExchangeDetailsDaoExt.getCashMemoDetails())) {
			headerDto.setCashMemoDetailsId(goodsExchangeDetailsDaoExt.getCashMemoDetails().getId());
			headerDto.setCmDocNo(
					goodsExchangeDetailsDaoExt.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getDocNo());
		}
		if (!StringUtils.isEmpty(goodsExchange.getSalesTxn().getManualBillDetails())) {
			ManualBillTxnDetailsDto manualBillDetails = commonTransactionService
					.mapJsonToManualBillDetails(goodsExchange.getSalesTxn().getManualBillDetails());
			headerDto.setManualDetails(manualBillDetails);
		}
		log.info("The paymentType is", goodsExchange.getPaymentType());
		headerDto.setPaymentType(goodsExchange.getPaymentType());
		try {
			JsonNode root = MapperUtil.getObjectMapperInstance().readTree(goodsExchangeDetailsDaoExt.getPriceDetails());
			JsonNode arrNode = root.path("refundDeductionAmount");
			BigDecimal itemRefundAmt = arrNode.decimalValue();
			BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(itemRefundAmt);
			itemRefundAmt = itemRefundAmt.add(roundingVariance);
			headerDto.setTotalRefundValue(goodsExchange.getFinalValue().subtract(itemRefundAmt));
		} catch (IOException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}

		return headerDto;
	}

	private void validateManualTepWeight(GoodsExchangeDaoExt goodsExchangeDaoExt, String subTxnType) {
		// to check total weight and final value for manual bill.
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = super.findGoodsExchangeDetailsByGoodsExchange(
				goodsExchangeDaoExt);

		WeightDetailsDto weightDetailsDto;

		weightDetailsDto = super.getGoodsExchangeWeightDetails(goodsExchangeDetailsList);

		commonTransactionService.manualBillValuesWithHeader(goodsExchangeDaoExt.getTotalWeight(),
				goodsExchangeDaoExt.getTotalValue(), goodsExchangeDaoExt.getSalesTxn(), true, weightDetailsDto);
	}

	private GoodsExchangeDaoExt validateConfirmTep(String id, String status, String txnType, String subTxnType,
			GepConfirmOrHoldDto gepConfirmOrHoldDto) {

		RoleAclConfigDto roleAclConfig = engineServiceClient.getEmpRoleConfig(CommonUtil.getUserName(), TEP_CONFIRM);
		if (!roleAclConfig.getIsAclActive()) {
			throw new ServiceException(SalesConstants.CONFIGURATION_NOT_PRESENT_FOR_THE_ROLE + "{role}",
					SalesConstants.ERR_SALE_425, "Configuration not present to confirm TEP for the Role",
					Map.of("role", roleAclConfig.getRoleCode()));
		}
		if (TepPaymentTypeEnum.REFUND.toString().equals(gepConfirmOrHoldDto.getPaymentType())
				&& !TransactionStatusEnum.HOLD.toString().equals(status)) {
			validateRefundJson(gepConfirmOrHoldDto.getRefundDetails());
		}
		// if the subTxnType is FULL_VALUE_TEP and reasonForFullValueTep is empty or
		// null then throw exception
		if ((SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(subTxnType))
				&& StringUtils.isEmpty(gepConfirmOrHoldDto.getReason())) {
			throw new ServiceException("Enter reason for full value tep", "");
		}

		GoodsExchangeDaoExt goodsExchange = super.getGoodsExchangeObjectByIdAndTxnTypeAndSubTxnType(id, txnType,
				subTxnType);

		// pending : If one request is raised, till the time flow is not completed,
		// system should not allow to raise another request for the same variant code
		// for the same customer in the same location
		if (TransactionStatusEnum.CONFIRMED.name().equals(status)) {
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = super.findGoodsExchangeDetailsByGoodsExchange(
					goodsExchange);
			List<String> itemCodeList = goodsExchangeDetailsList.stream()
					.filter(goodExg -> goodExg.getCashMemoDetails() != null).map(goodExg -> goodExg.getItemCode())
					.collect(Collectors.toList());
			List<String> cashMemoIdList = goodsExchangeDetailsList.stream()
					.filter(goodExg -> goodExg.getCashMemoDetails() != null)
					.map(goodExg -> goodExg.getCashMemoDetails().getId()).collect(Collectors.toList());
			if (!itemCodeList.isEmpty() && !cashMemoIdList.isEmpty()) {
				List<GoodsExchangeDetailsDaoExt> itemInApprovalFlow = super.getGoodsExchangeObjectByVariantCodeAndLocationCodeAndStatusAndCustomer(
						txnType, itemCodeList,
						cashMemoIdList);
				for (GoodsExchangeDetailsDaoExt goodsExchangeDetails : itemInApprovalFlow) {
					if (goodsExchangeDetails.getGoodsExchange().getProcessId() != null) {
						WorkflowProcessGetResponseDto workflowProcessGetResponseDto = validateAndGetWorkflowResponse(
								goodsExchangeDetails.getGoodsExchange().getSalesTxn().getSubTxnType(),
								goodsExchangeDetails.getGoodsExchange().getProcessId(), true);
						if (!WorkflowProcessStatusEnum.REJECTED.name()
								.equals(workflowProcessGetResponseDto.getApprovalStatus())) {
							throw new ServiceException(SalesConstants.ITEM_IN_TEP_FLOW, SalesConstants.ERR_SALE_400,
									Map.of("itemList",goodsExchangeDetails.getItemCode(),"locationCode",goodsExchangeDetails.getGoodsExchange().getSalesTxn().getLocationCode()));
						}

					}
				}
			}

		}

		commonTransactionService.checkTranscationStatusForUpdate(goodsExchange.getSalesTxn().getStatus()); // metal rate

		// TEP hold time?
		LocationCacheDto locationConfig = engineService.getStoreLocation(CommonUtil.getLocationCode());
		if (locationConfig.getTepDetails() == null || locationConfig.getTepDetails().getTepHoldTime() == null
				|| locationConfig.getTepDetails().getTepHoldTime().compareTo(BigDecimal.ZERO) <= 0)
			throw new ServiceException(
					SalesConstants.CONFIGURATION_NOT_PRESENT_FOR_TEP_HOLD_TIME_IN_MINUTES_FIELD_UNDER_TEP_DETAILS_FOR_LOCATION,
					SalesConstants.ERR_SALE_401,
					"Configuration not present for 'tepHoldTimeInMinutes' field under TEP details for location: "
							+ CommonUtil.getLocationCode());
		if (!TransactionStatusEnum.HOLD.name().equalsIgnoreCase(goodsExchange.getSalesTxn().getStatus())) {
			commonTransactionService.checkMetalRate(goodsExchange.getSalesTxn(), gepConfirmOrHoldDto.getMetalRateList(),
					TransactionStatusEnum.valueOf(status), true, locationConfig.getTepDetails().getTepHoldTime(), false,
					Set.of());
		}

		// validate UI input with goods_exchange table
		validateGoodsExchangeTotals(gepConfirmOrHoldDto, goodsExchange); // UI //customer_id input & db customer_id //
		// check if customer is added
		if (StringUtils.isEmpty(goodsExchange.getSalesTxn().getCustomerId())
				&& StringUtils.isEmpty(gepConfirmOrHoldDto.getCustomerId())) {
			throw new ServiceException(SalesConstants.ADD_CUSTOMER_DETAILS, SalesConstants.ERR_SALE_080);
		}
		if (!goodsExchange.getSalesTxn().getCustomerId().equals(gepConfirmOrHoldDto.getCustomerId())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Customer id in db : " + goodsExchange.getSalesTxn().getCustomerId() + " & customer id from UI : "
							+ gepConfirmOrHoldDto.getCustomerId());
		}
		return goodsExchange;
	}

	/**
	 * @param gepConfirmOrHoldDto
	 */
	private void validateRefundJson(JsonData refundDetails) {
		if (StringUtils.isEmpty(refundDetails)) {
			throw new ServiceException("Enter refund details", "ERR-SALE-295");
		}
		if ("TEP_CHEQUE_REFUND".equals(refundDetails.getType())) {
			TepChequeRefundDto tepCheck = new TepChequeRefundDto();
			tepCheck.validate(refundDetails.getData());
		} else if ("TEP_RTGS_REFUND".equals(refundDetails.getType())) {
			TepRtgsRefundDto tepRtgs = new TepRtgsRefundDto();
			tepRtgs.validate(refundDetails.getData());
		} else if ("TEP_CASH_REFUND".equals(refundDetails.getType())) {
			TepCashRefundDto tepCash = new TepCashRefundDto();
			tepCash.validate(refundDetails.getData());
		} else {
			throw new ServiceException(SalesConstants.JSON_TYPE_MISMATCH, SalesConstants.ERR_CORE_014);
		}
	}

	private void validateGoodsExchangeTotals(GepConfirmOrHoldDto gepConfirmOrHoldDto,
			GoodsExchangeDaoExt goodsExchange) {
		log.debug("total quantity in db ---- " + goodsExchange.getTotalQuantity() + " and UI total quantity ---- "
				+ gepConfirmOrHoldDto.getTotalQuantity());
		if (!goodsExchange.getTotalQuantity().equals(gepConfirmOrHoldDto.getTotalQuantity())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"DB total quantity : " + goodsExchange.getTotalQuantity() + " and UI total quantity : "
							+ gepConfirmOrHoldDto.getTotalQuantity());
		}
		log.debug("total weight in db ---- " + goodsExchange.getTotalWeight() + " and UI total weight ---- "
				+ gepConfirmOrHoldDto.getTotalWeight());
		if (goodsExchange.getTotalWeight().compareTo(gepConfirmOrHoldDto.getTotalWeight()) != 0) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"DB total weight : " + goodsExchange.getTotalWeight() + " and UI total weight : "
							+ gepConfirmOrHoldDto.getTotalWeight());
		}
		log.debug("total tax in db ---- " + goodsExchange.getTotalTax() + " and UI total tax ---- "
				+ gepConfirmOrHoldDto.getTotalTax());
		if (goodsExchange.getTotalTax().compareTo(gepConfirmOrHoldDto.getTotalTax()) != 0) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048, "DB total tax : "
					+ goodsExchange.getTotalTax() + " and UI total tax : " + gepConfirmOrHoldDto.getTotalTax());
		}
		if (TepPaymentTypeEnum.CN.toString().equals(gepConfirmOrHoldDto.getPaymentType())) {
			log.debug("total value in db ---- " + goodsExchange.getTotalValue() + " and UI total value ---- "
					+ gepConfirmOrHoldDto.getTotalValue());
			if (goodsExchange.getTotalValue().compareTo(gepConfirmOrHoldDto.getTotalValue()) != 0) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						"DB total value : " + goodsExchange.getTotalValue() + " and UI total value : "
								+ gepConfirmOrHoldDto.getTotalValue());
			}
		}
	}

	@Override
	public void deleteTep(String id, String txnType, String subTxnType, String remarks,
			GoodsExchangeDaoExt goodsExchange) {
		commonTransactionService.checkTranscationStatusForUpdate(goodsExchange.getSalesTxn().getStatus());
		// if remarks not empty, then set remarks
		if (!StringUtils.isEmpty(remarks)) {
			goodsExchange.getSalesTxn().setRemarks(remarks);
		}
		goodsExchange.setSalesTxn(commonTransactionService.getSalesTxnDao(goodsExchange.getSalesTxn(),
				TransactionTypeEnum.TEP.name(), goodsExchange.getSalesTxn().getSubTxnType(), SalesDocTypeEnum.CT_DELETE,
				TransactionStatusEnum.DELETED));
		super.saveSalesObject(goodsExchange.getSalesTxn());
	}

	@Override
	public List<GoodsExchangeDetailsDaoExt> updateTepItemsPrice(GoodsExchangeDaoExt goodsExchangeDao) {
		commonTransactionService.checkTranscationStatusForUpdate(goodsExchangeDao.getSalesTxn().getStatus());

		// if within hold time, then do not update metal rate
		// TEP hold time?
		LocationCacheDto locationResponseDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		BigDecimal holdTime = locationResponseDto.getTepDetails().getTepHoldTime();
		// Boolean a =
		// commonTransactionService.holdTimeCheck(goodsExchangeDao.getSalesTxn(), new
		// BigDecimal(3));

		if (TransactionStatusEnum.HOLD.name().equals(goodsExchangeDao.getSalesTxn().getStatus())
				&& commonTransactionService.holdTimeCheck(goodsExchangeDao.getSalesTxn(), holdTime)) {
			return super.findGoodsExchangeDetailsByGoodsExchange(goodsExchangeDao);
		}

		MetalRateListDto metalRateList = commonTransactionService.getMetalRate();
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = super.findGoodsExchangeDetailsByGoodsExchange(
				goodsExchangeDao);
		goodsExchangeDetailsList = updatePriceOrTax(goodsExchangeDao, goodsExchangeDetailsList, metalRateList);
		return super.saveGoodsExchangeDetailsListObject(goodsExchangeDetailsList);
	}

	private List<GoodsExchangeDetailsDaoExt> updatePriceOrTax(GoodsExchangeDaoExt goodsExchangeDao,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, MetalRateListDto metalRateList) {
		List<GoodsExchangeDetailsDaoExt> detailsList = new ArrayList<>();
		String customerMobileNo = customerService.getCustomer(goodsExchangeDao.getSalesTxn().getCustomerId())
				.getMobileNumber();
		log.debug("customer mobile no : {}", customerMobileNo);
		for (GoodsExchangeDetailsDaoExt goodsExchangeDetails : goodsExchangeDetailsList) {
			String lotNumber = null;
			String cashMemoDetailsId = null;
			if (!StringUtils.isEmpty(goodsExchangeDetails.getCashMemoDetails())) {
				lotNumber = goodsExchangeDetails.getCashMemoDetails().getLotNumber();
				cashMemoDetailsId = goodsExchangeDetails.getCashMemoDetails().getId();
			}
			BigDecimal priceValue;
			TepPriceResponseDto tepPriceResponse = null;
			if (metalRateList != null) {
				tepPriceResponse = getItemPrice(goodsExchangeDetails.getItemCode(), lotNumber,
						cashMemoDetailsId, goodsExchangeDetails.getQuantity(), goodsExchangeDetails.getTotalWeight(),
						customerMobileNo, metalRateList, goodsExchangeDetails.getPriceDetails(),
						goodsExchangeDao.getSalesTxn().getSubTxnType(), false);
				priceValue = tepPriceResponse.getFinalValue();
			} else {
			 tepPriceResponse = MapperUtil.mapObjToClass(goodsExchangeDetails.getPriceDetails(),
						TepPriceResponseDto.class);
				priceValue = goodsExchangeDetails.getTotalValue();
			}
			// price calculation as per updated metal rate
			tepPriceResponse.setFinalValue(priceValue);
			updateItemDetailsObjectTax(goodsExchangeDao, goodsExchangeDetails, tepPriceResponse, null);
			detailsList.add(goodsExchangeDetails);
		}
		if(metalRateList!=null) {
			goodsExchangeDao.getSalesTxn().setMetalRateDetails(MapperUtil.getStringFromJson(metalRateList));
		}
		
		super.saveSalesObject(goodsExchangeDao.getSalesTxn());
		return detailsList;
	}

	/**
	 * @param goodsExchangeDao
	 * @param goodsExchangeDetails
	 * @param tepPriceResponse
	 * @param workflowProcessGetResponseDto
	 */
	
	private void updateItemDetailsObjectTax(GoodsExchangeDaoExt goodsExchangeDao,
			GoodsExchangeDetailsDaoExt goodsExchangeDetails, TepPriceResponseDto tepPriceResponse,
			WorkflowProcessGetResponseDto workflowProcessGetResponseDto) {
		Boolean isfullvalueTep = false;
		if (SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(tepPriceResponse.getTepType())
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(tepPriceResponse.getTepType())) {
			isfullvalueTep = true;
		}
		TaxCalculationResponseDto taxDetails = engineService.getTaxDetails(CommonUtil.getLocationCode(),
				goodsExchangeDao.getSalesTxn().getCustomerId(), TxnTaxTypeEnum.TEP_GEP_TANISHQ_EXCHANGE.name(),
				goodsExchangeDetails.getItemCode(), isfullvalueTep, null);
		BigDecimal itemTotalTax = BigDecimal.ZERO;
		
		itemTotalTax = commonTransactionService.getTaxDetails(tepPriceResponse.getFinalValue(), null, taxDetails);
		BigDecimal unitWeight = BigDecimal.ZERO;
		if(tepPriceResponse.getMeasuredWeight()!=null) {
			goodsExchangeDetails.setTotalWeight(tepPriceResponse.getMeasuredWeight());
			unitWeight = tepPriceResponse.getMeasuredWeight()
					.divide(BigDecimal.valueOf(goodsExchangeDetails.getQuantity()));
		} else {
			goodsExchangeDetails.setTotalWeight(
					tepPriceResponse.getStdWeight());
			unitWeight = tepPriceResponse.getStdWeight()
					.divide(BigDecimal.valueOf(goodsExchangeDetails.getQuantity()));
		}
		
		
		goodsExchangeDetails.setTaxDetails(MapperUtil.getStringFromJson(taxDetails));
		goodsExchangeDetails.setTotalTax(itemTotalTax);
		goodsExchangeDetails.setTotalValue(tepPriceResponse.getFinalValue());
		BigDecimal finalValue = tepPriceResponse.getFinalValue().add(itemTotalTax);
		BigDecimal roundingVariance = commonTransactionService
				.getRoundingVariance(finalValue);
		goodsExchangeDetails.setFinalValue(finalValue.add(roundingVariance));
		BigDecimal unitValue = tepPriceResponse.getFinalValue().divide(
				BigDecimal.valueOf(goodsExchangeDetails.getQuantity()), DomainConstants.PRICE_SCALE,
				RoundingMode.HALF_UP);
		
		goodsExchangeDetails.setUnitValue(unitValue);
		goodsExchangeDetails.setUnitWeight(unitWeight);
		if(tepPriceResponse!=null) {
			goodsExchangeDetails.setPriceDetails(MapperUtil.getStringFromJson(tepPriceResponse));
		}
		
		log.debug("total value ---- {}", goodsExchangeDetails.getTotalValue());
		log.debug("final value ---- {}", goodsExchangeDetails.getFinalValue());
		log.debug("unit value ---- {}", goodsExchangeDetails.getUnitValue());
		log.debug("unit value ---- {}", goodsExchangeDetails.getUnitWeight());
		log.debug("quantity ---- {}", goodsExchangeDetails.getQuantity());
	}
	
	private void updateItemDetailsObject(GoodsExchangeDaoExt goodsExchangeDao,
			GoodsExchangeDetailsDaoExt goodsExchangeDetails, TepPriceResponseDto tepPriceResponse,
			WorkflowProcessGetResponseDto workflowProcessGetResponseDto) {

		Boolean isfullvalueTep = false;
		if (SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(tepPriceResponse.getTepType())
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(tepPriceResponse.getTepType())) {
			isfullvalueTep = true;
		}
		TaxCalculationResponseDto taxDetails = engineService.getTaxDetails(CommonUtil.getLocationCode(),
				goodsExchangeDao.getSalesTxn().getCustomerId(), TxnTaxTypeEnum.TEP_GEP_TANISHQ_EXCHANGE.name(),
				goodsExchangeDetails.getItemCode(), isfullvalueTep, null);
		BigDecimal itemTotalTax = BigDecimal.ZERO;
		if (workflowProcessGetResponseDto != null) {
			FullValueTepDetailsDto fullValueTepDetails = MapperUtil.getObjectMapperInstance().convertValue(
					workflowProcessGetResponseDto.getApprovedData().getData(), FullValueTepDetailsDto.class);
			// current value final value should have calculated Tax
			if ("Current value".equalsIgnoreCase(fullValueTepDetails.getTepValue().get(0))) {
				itemTotalTax = commonTransactionService.getTaxDetails(tepPriceResponse.getFinalValue(), null,
						taxDetails);
				tepPriceResponse.setFinalValue(tepPriceResponse.getFinalValue().add(itemTotalTax));
				// fvt deduction
				tepPriceResponse.setDeductionAmount(tepPriceResponse.getFinalValue()
						.multiply(tepPriceResponse.getFvtDeductionPercent().divide(BigDecimal.valueOf(100))));
				tepPriceResponse.setFinalValue(
						tepPriceResponse.getFinalValue().subtract(tepPriceResponse.getDeductionAmount()));
				// refund deduction
				if ("REFUND".equalsIgnoreCase(goodsExchangeDetails.getGoodsExchange().getPaymentType())) {
					tepPriceResponse.setRefundDeductionAmount(tepPriceResponse.getFinalValue()
							.multiply(tepPriceResponse.getRefundDeductionPercent().divide(BigDecimal.valueOf(100))));
				}
				BigDecimal roundingVariance = commonTransactionService
						.getRoundingVariance(tepPriceResponse.getFinalValue());
				tepPriceResponse.setFinalValue(tepPriceResponse.getFinalValue().add(roundingVariance));
			}
		} else {
			itemTotalTax = commonTransactionService.getTaxDetails(tepPriceResponse.getFinalValue(), null, taxDetails);
			goodsExchangeDetails.setTotalWeight(
					tepPriceResponse.getStdWeight().multiply(BigDecimal.valueOf(goodsExchangeDetails.getQuantity())));
		}
//		BigDecimal totalValue = tepPriceResponse.getFinalValue().subtract(itemTotalTax);
		goodsExchangeDetails.setTaxDetails(MapperUtil.getStringFromJson(taxDetails));
		goodsExchangeDetails.setTotalTax(itemTotalTax);
		goodsExchangeDetails.setTotalValue(tepPriceResponse.getFinalValue());
		goodsExchangeDetails.setFinalValue(tepPriceResponse.getFinalValue().add(itemTotalTax));
		BigDecimal unitValue = tepPriceResponse.getFinalValue().divide(
				BigDecimal.valueOf(goodsExchangeDetails.getQuantity()), DomainConstants.PRICE_SCALE,
				RoundingMode.HALF_UP);
		BigDecimal unitWeight = tepPriceResponse.getStdWeight()
				.divide(BigDecimal.valueOf(goodsExchangeDetails.getQuantity()));
		goodsExchangeDetails.setUnitValue(unitValue);
		goodsExchangeDetails.setUnitWeight(unitWeight);
		if(tepPriceResponse!=null) {
			goodsExchangeDetails.setPriceDetails(MapperUtil.getStringFromJson(tepPriceResponse));
		}
		
		log.debug("total value ---- {}", goodsExchangeDetails.getTotalValue());
		log.debug("final value ---- {}", goodsExchangeDetails.getFinalValue());
		log.debug("unit value ---- {}", goodsExchangeDetails.getUnitValue());
		log.debug("unit value ---- {}", goodsExchangeDetails.getUnitWeight());
		log.debug("quantity ---- {}", goodsExchangeDetails.getQuantity());
	}

	private TepPriceResponseDto getItemPrice(String itemCode, String lotNumber, String cashMemoDetailsId,
			Short measuredQuantity, BigDecimal measuredWeight, String customerMobileNo,
			MetalRateListDto metalRateListDto, String priceDetails, String subTxnType, Boolean isRecalculatePrice) {
		List<BaseStoneDetails> stoneDetailsList = getStoneDetailsFromPriceDetailsJson(priceDetails, subTxnType,
				isRecalculatePrice);
		TepPriceRequest tepPriceRequest = new TepPriceRequest();
		tepPriceRequest.setStandardPrice(metalRateListDto.getMetalRates());
		tepPriceRequest.setCustomerMobileNo(customerMobileNo);
		tepPriceRequest.setItemCode(itemCode);
		tepPriceRequest.setLotNumber(lotNumber);
		tepPriceRequest.setMeasuredQuantity(measuredQuantity);
		tepPriceRequest.setMeasuredWeight(measuredWeight);
		tepPriceRequest.setCashMemoDetailsId(cashMemoDetailsId);
		tepPriceRequest.setStones(stoneDetailsList);
		tepPriceRequest.setTepType(subTxnType);
		log.info("tepPriceRequest" + MapperUtil.getJsonString(tepPriceRequest));
		return engineService.getTepPriceDetails(tepPriceRequest);
	}

	private List<BaseStoneDetails> getStoneDetailsFromPriceDetailsJson(String priceDetails, String subTxnType,
			Boolean isRecalculatePrice) {
		List<BaseStoneDetails> stoneDetailsList = new ArrayList<>();
		if (!StringUtils.isEmpty(priceDetails)) {
			log.info("priceDetails>>>>>" + priceDetails);
			TepPriceResponseDto tepPriceResponse = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(priceDetails), TepPriceResponseDto.class);
			if (!CollectionUtils.isEmpty(tepPriceResponse.getStones())) {
				tepPriceResponse.getStones().forEach(record -> {
					// need to change this if block. this should be handled by pricing API
					// if no stones are available then stones object should be empty or null
					if (!StringUtils.isEmpty(record.getStoneCode())) {
						BaseStoneDetails baseStoneDetails = (BaseStoneDetails) MapperUtil.getDtoMapping(record,
								BaseStoneDetails.class);
						baseStoneDetails.setMeasuredStoneWeight(record.getStoneWeight());
						if (!isRecalculatePrice) {
							if (record.getMeasuredNoOfStones() == 0
									&& !(TepTypeEnum.FULL_VALUE_TEP.name().equals(subTxnType)
											|| TepTypeEnum.MANUAL_FULL_VALUE_TEP.name().equals(subTxnType))) {
								baseStoneDetails.setMeasuredNoOfStones(record.getNoOfStones());
							}
						}
						stoneDetailsList.add(baseStoneDetails);
					}
				});
			}
		}
		log.info("stoneDetailsList>>>>>" + MapperUtil.getJsonString(stoneDetailsList));
		return stoneDetailsList;
	}

	@Override
	public GoodsExchangeDaoExt updateGoodsExchangeHeader(GoodsExchangeDaoExt goodsExchangeDao) {
		return super.updateGoodsExchangeHeaderDetails(goodsExchangeDao);
	}

	private List<InventoryDetailsDao> addItemDetailsInInventory(GoodsExchangeDaoExt goodsExchangeDaoExt,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList) {
		List<GoodsExchangeDetailsDaoExt> itemList = new ArrayList<>();
		Map<String, String> goodsExchangeDetailsMap;
		List<InventoryDetailsDao> inventoryDetailsList = new ArrayList<>();
		goodsExchangeDetailsMap = super.addItemsInInventory(goodsExchangeDaoExt.getSalesTxn().getDocDate(),
				goodsExchangeDaoExt.getSalesTxn().getDocNo(), SalesDocTypeEnum.TEP, goodsExchangeDetailsList,
				inventoryDetailsList, goodsExchangeDaoExt.getSalesTxn().getFiscalYear());
		log.info("goods Exchange details Map : {}",goodsExchangeDetailsMap);
		for (GoodsExchangeDetailsDaoExt record : goodsExchangeDetailsList) {
			for (InventoryDetailsDao invItem : inventoryDetailsList) {
				if (record.getItemCode().equals(invItem.getItemCode())) {
					Boolean isMatchAndBlankLot = null;

					if (record.getLotNumber() == null) {
						isMatchAndBlankLot = true;						
					} else if (record.getLotNumber().equals(invItem.getLotNumber())) {
						isMatchAndBlankLot = false;
					}
					
					// lot no null or same
					if (isMatchAndBlankLot != null) {
						record.setBinCode(invItem.getBinCode());
						record.setInventoryId(invItem.getId());

						// if blank lot, set inventory one
						updateLotNoIfBlank(record, invItem, isMatchAndBlankLot);

					}
				}
			}


			String inventoryId = goodsExchangeDetailsMap.get(record.getId());
			log.debug("inventoryId ---- {}", inventoryId);
			record.setInventoryId(inventoryId);
			itemList.add(record);
		}

		super.saveGoodsExchangeDetailsListObject(itemList);
		return inventoryDetailsList;
	}

	private void updateLotNoIfBlank(GoodsExchangeDetailsDaoExt record, InventoryDetailsDao invItem,
			Boolean isMatchAndBlankLot) {
		// if lot no empty, override lot no also
		if (isMatchAndBlankLot)
			record.setLotNumber(invItem.getLotNumber());
	}

	@Override
	@Transactional(value = "chainedTransaction")
	public GoodsExhangeDaoDto confirmGoodsExchangeRequest(String id, String txnType, String subTxnType,
			GoodExchangeRequestConfirmDto goodsExchangeRequestConfirmDto, String workFlowType) {
		GoodsExhangeDaoDto goodsExhangeDaoDto = new GoodsExhangeDaoDto();
		GoodsExchangeDaoExt goodsExchange = super.getGoodsExchangeObjectByIdAndTxnTypeAndSubTxnType(id, txnType,
				subTxnType);
		SalesTxnDaoExt salesTxn = goodsExchange.getSalesTxn();
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = super.findGoodsExchangeDetailsByGoodsExchange(
				goodsExchange);
		validateTepAndGepDone(goodsExchangeDetailsList);
		if (goodsExchange.getSalesTxn().getRefTxnId() != null) {
			goodsExhangeDaoDto.setRefDocDate(goodsExchange.getSalesTxn().getRefTxnId().getDocDate());
		}
		
		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = validateAndGetWorkflowResponse(
				workFlowType, goodsExchange.getProcessId(), false);
		
		//If Full value Tep is Overriding or TEP Exception is Flat Exchange it will be true
		Boolean isOverriding = getTepRequestApprovedType(workflowProcessGetResponseDto,workFlowType);
		
		if (SubTxnTypeEnum.NEW_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_TEP.toString().equals(subTxnType)) {
//			validateAndGetFromWorkflow(goodsExchange.getProcessId(), goodsExchangeDetailsList,
//					goodsExchangeRequestConfirmDto, workFlowType);


			TepPriceResponseDto priceResponseDto = getPriceDetails(goodsExchangeDetailsList.get(0));
			if (goodsExchangeRequestConfirmDto.getTotalValue().compareTo(priceResponseDto.getFinalValue()) != 0) {
				throw new ServiceException(SalesConstants.PRICE_MISMATCH, SalesConstants.ERR_SALE_044,
						"Total value from UI : " + goodsExchangeRequestConfirmDto.getTotalValue()
								+ " & final value from price API : " + priceResponseDto.getFinalValue());
			}
			
		} else if (SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(subTxnType)) {
			MetalRateListDto metalRateListDto = commonTransactionService.getMetalRate();
			// TEP recalculation based on workflow approved data
//			TepPriceResponseDto tepPrice = validateAndRecalculateFullValueTep(goodsExchange, goodsExchangeDetailsList,
//					metalRateListDto, false);
			TepPriceResponseDto tepPrice = getPriceDetails(goodsExchangeDetailsList.get(0));
			
			validateFullValueTepInput(goodsExchangeRequestConfirmDto.getTotalValue(),
					goodsExchangeRequestConfirmDto.getTotalWeight(), tepPrice,
					goodsExchangeDetailsList.get(0).getQuantity());
			salesTxn.setMetalRateDetails(MapperUtil.getStringFromJson(metalRateListDto));
		}

		salesTxn.setPreviousStatus(salesTxn.getStatus());
		salesTxn.setStatus(TransactionStatusEnum.CONFIRMED.toString());
		super.docNoGeneration(TransactionStatusEnum.CONFIRMED.toString(), txnType, subTxnType, goodsExchange,
				SalesDocTypeEnum.TEP);

		// get applicable discounts
		GoodExchangeDiscountDetailsDto discountDetails = super.getApplicableDiscounts(goodsExchange,
				goodsExchangeDetailsList);

		JsonData discountJsonData = getValidTepDiscount(goodsExchangeRequestConfirmDto.getDiscountTypeSelected(),
				discountDetails);
		

		// Update CashMemo Pulled Reason for GRN Type
		for (GoodsExchangeDetailsDaoExt goodsExchangeDetails : goodsExchangeDetailsList) {
			if (goodsExchangeDetails.getCashMemoDetails() != null) {

				commonTransactionService.saveSalesTxnForLegacyPulledCM(
						goodsExchangeDetails.getCashMemoDetails().getCashMemoDao().getSalesTxnDao(),
						TransactionTypeEnum.TEP.name());
			}
		}
		salesTxn.setConfirmedTime(CalendarUtils.getCurrentDate());
		salesTxn.setRemarks(goodsExchangeRequestConfirmDto.getRemarks());
		goodsExchange.setIsOverriding(isOverriding);
		goodsExchange.setSrcSyncId(goodsExchange.getSrcSyncId() + 1);
		log.debug("src sync id {}", goodsExchange.getSalesTxn().getSrcSyncId());
		salesTxn.setSrcSyncId(goodsExchange.getSalesTxn().getSrcSyncId() + 1);
		goodsExchange.setSalesTxn(salesTxn);
		
		goodsExchange = super.updateGoodsExchangeHeaderDetails(goodsExchange);
		goodsExhangeDaoDto.setGoodsExchange(goodsExchange);
		updateTotalValueForRefund(goodsExchangeDetailsList, goodsExhangeDaoDto, goodsExchange.getPaymentType(), salesTxn.getStatus());
		if (TepPaymentTypeEnum.CN.toString().equals(goodsExchange.getPaymentType())) {
			Integer cnDocNo = super.generateCN(CNType.TEP.toString(), goodsExchange,
					goodsExchangeRequestConfirmDto.getRemarks(), discountJsonData, null);
			goodsExhangeDaoDto.setCnDocNo(cnDocNo);
		
		}
		List<InventoryDetailsDao> invList = addItemDetailsInInventory(goodsExchange, goodsExchangeDetailsList);
		goodsExhangeDaoDto.setInventoryList(invList);
		if (TepPaymentTypeEnum.REFUND.toString().equals(goodsExchange.getPaymentType())) {
			CustomerDetailsDto customerDetails = customerService
					.getCustomer(goodsExchange.getSalesTxn().getCustomerId());
			GepConfirmOrHoldDto gepConfirmOrHoldDto = new GepConfirmOrHoldDto();
			gepConfirmOrHoldDto.setRemarks(goodsExchangeRequestConfirmDto.getRemarks());
			gepConfirmOrHoldDto.setRefundDetails(goodsExchangeRequestConfirmDto.getRefundDetails());
			addRefundDetails(customerDetails, goodsExchangeDetailsList, goodsExchange, gepConfirmOrHoldDto);
		}
		
		// update TEP return Items to legacy
		updateLegacyTepItems(goodsExchange);
		return goodsExhangeDaoDto;
	}

	private Boolean getTepRequestApprovedType(WorkflowProcessGetResponseDto workflowProcessGetResponseDto,
			String workFlowType) {
		Boolean isOverriding = false;
		if (workFlowType.equals(SalesUtil.FULL_VALUE_TEP_WORKFLOW)
				|| workFlowType.equals(SalesUtil.MANUAL_FULL_VALUE_TEP_WORKFLOW)) {
			FullValueTepDetailsDto fullValueTepDetails = MapperUtil.getObjectMapperInstance().convertValue(
					workflowProcessGetResponseDto.getApprovedData().getData(), FullValueTepDetailsDto.class);
			if (SalesConstants.OVERRIDING_VALUE.equalsIgnoreCase(fullValueTepDetails.getTepValue().get(0)))
				isOverriding = true;
		} else if (workFlowType.equals(SalesUtil.TEP_EXCEPTION_WORKFLOW_TYPE)) {
			JsonData tepExceptionDetails = workflowProcessGetResponseDto.getApprovedData();
			if (tepExceptionDetails != null) {
				TepExceptionDetailsDto reqTepExceptionDtls = MapperUtil.getObjectMapperInstance()
						.convertValue(tepExceptionDetails.getData(), TepExceptionDetailsDto.class);
				if (reqTepExceptionDtls.getFlatExchangeValue().compareTo(BigDecimal.ZERO) > 0) {
					isOverriding = true;
				}
			}
		}
		return isOverriding;
	}

	@Override
	public TepPriceResponseDto validateAndRecalculateFullValueTep(GoodsExchangeDaoExt goodsExchange,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, MetalRateListDto metalRateListDto,
			Boolean toRecalculate) {
		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = validateAndGetWorkflowResponse(
				goodsExchange.getSalesTxn().getSubTxnType(), goodsExchange.getProcessId(), toRecalculate);
		TepPriceResponseDto tepPrice = new TepPriceResponseDto();
		if (WorkflowProcessStatusEnum.APPROVED.toString().equals(workflowProcessGetResponseDto.getApprovalStatus())) {
			tepPrice = saveItemDetails(goodsExchange, goodsExchangeDetailsList, workflowProcessGetResponseDto,
					metalRateListDto);
			goodsExchange = super.updateGoodsExchangeHeaderDetails(goodsExchange);
		}
		
		return tepPrice;
	}

	@Override
	public TepPriceResponseDto validateAndRecalculateTepException(GoodsExchangeDaoExt goodsExchange,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, MetalRateListDto metalRateListDto,
			Boolean toRecalculate) {
		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = validateAndGetWorkflowResponse(
				SalesUtil.TEP_EXCEPTION_WORKFLOW_TYPE, goodsExchange.getProcessId(), toRecalculate);
		TepPriceResponseDto tepPrice = new TepPriceResponseDto();
		if (WorkflowProcessStatusEnum.APPROVED.toString().equals(workflowProcessGetResponseDto.getApprovalStatus())) {
			tepPrice = saveExceptionItemDetails(goodsExchange, goodsExchangeDetailsList, workflowProcessGetResponseDto,
					metalRateListDto);
			goodsExchange = super.updateGoodsExchangeHeaderDetails(goodsExchange);
		}
		return tepPrice;
	}

	/**
	 * @param goodsExchangeRequestConfirmDto
	 * @param goodsExchange
	 * @param goodsExchangeDetailsList
	 * @param workflowProcessGetResponseDto
	 * @param metalRateListDto
	 */
	private TepPriceResponseDto saveItemDetails(GoodsExchangeDaoExt goodsExchange,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList,
			WorkflowProcessGetResponseDto workflowProcessGetResponseDto, MetalRateListDto metalRateListDto) {
		TepPriceResponseDto tepPrice = null;
		for (GoodsExchangeDetailsDaoExt tepDetail : goodsExchangeDetailsList) {
			tepPrice = updatedPriceCalculationForFullValueTep(tepDetail, workflowProcessGetResponseDto,
					metalRateListDto);
//			updateItemDetailsObject(goodsExchange, tepDetail, tepPrice, workflowProcessGetResponseDto);
			super.saveGoodsExchangeDetailsObj(tepDetail);
		}
		return tepPrice;
	}

	private TepPriceResponseDto saveExceptionItemDetails(GoodsExchangeDaoExt goodsExchange,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList,
			WorkflowProcessGetResponseDto workflowProcessGetResponseDto, MetalRateListDto metalRateListDto) {
		TepPriceResponseDto tepPrice = null;
		for (GoodsExchangeDetailsDaoExt tepDetail : goodsExchangeDetailsList) {
			tepPrice = updatedPriceCalculationForTepException(tepDetail, workflowProcessGetResponseDto,
					metalRateListDto);
//			updateItemDetailsObject(goodsExchange, tepDetail, tepPrice, workflowProcessGetResponseDto);
			super.saveGoodsExchangeDetailsObj(tepDetail);
		}
		return tepPrice;
	}

	private TepPriceResponseDto updatedPriceCalculationForTepException(GoodsExchangeDetailsDaoExt goodsExchangeDetails,
			WorkflowProcessGetResponseDto workflowProcessGetResponseDto, MetalRateListDto metalRateListDto) {

		JsonData tepExceptionDetails = null;
		TepPriceResponseDto priceData = getPriceDetails(goodsExchangeDetails);
		List<ItemLotStoneDto> stones = priceData.getStones();
		boolean flatTepException = false;
		BigDecimal flatExchangeValue = BigDecimal.ZERO;
		log.info("workflowProcessGetResponseDto " + MapperUtil.getJsonString(workflowProcessGetResponseDto));
		if (workflowProcessGetResponseDto.getWorkflowType().equals(SalesUtil.TEP_WORKFLOW_TYPE)) {
			stones = getApprovedDetails(workflowProcessGetResponseDto);
		} else if (workflowProcessGetResponseDto.getWorkflowType().equals(SalesUtil.TEP_EXCEPTION_WORKFLOW_TYPE)) {
			tepExceptionDetails = workflowProcessGetResponseDto.getApprovedData();
			if (tepExceptionDetails != null) {
				TepExceptionDetailsDto reqTepExceptionDtls = MapperUtil.getObjectMapperInstance()
						.convertValue(tepExceptionDetails.getData(), TepExceptionDetailsDto.class);
				if (reqTepExceptionDtls.getFlatExchangeValue().compareTo(BigDecimal.ZERO) > 0) {
					flatTepException = true;
					flatExchangeValue = reqTepExceptionDtls.getFlatExchangeValue();
				}
			}
		}
		BigDecimal itemTotalTax = BigDecimal.ZERO;
		BigDecimal measuredWeight = goodsExchangeDetails.getTotalWeight();
		String pricedetails = goodsExchangeDetails.getPriceDetails();
		TaxCalculationResponseDto taxDetails = engineService.getTaxDetails(CommonUtil.getLocationCode(),
				goodsExchangeDetails.getGoodsExchange().getSalesTxn().getCustomerId(),
				TxnTaxTypeEnum.TEP_GEP_TANISHQ_EXCHANGE.name(), goodsExchangeDetails.getItemCode(), true, false);

		CustomerDetailsDto customerDetails = customerService
				.getCustomer(goodsExchangeDetails.getGoodsExchange().getSalesTxn().getCustomerId());
//		= getItemPrice(,
//				,
//				, , measuredWeight,
//				customerMobileNo, metalRateListDto, pricedetails,
//				, true);
		List<BaseStoneDetails> stoneDetailsList = new ArrayList<>();
		stones.forEach(record -> {
			if (!StringUtils.isEmpty(record.getStoneCode())) {
				BaseStoneDetails baseStoneDetails = (BaseStoneDetails) MapperUtil.getDtoMapping(record,
						BaseStoneDetails.class);
				baseStoneDetails.setMeasuredStoneWeight(record.getStoneWeight());
				stoneDetailsList.add(baseStoneDetails);
			}
		});

		TepPriceRequest tepPriceRequest = new TepPriceRequest();
		tepPriceRequest.setStandardPrice(metalRateListDto.getMetalRates());
		tepPriceRequest.setCustomerMobileNo(customerDetails.getMobileNumber());
		tepPriceRequest.setItemCode(goodsExchangeDetails.getItemCode());
		if (goodsExchangeDetails.getCashMemoDetails() != null) {
			tepPriceRequest.setLotNumber(goodsExchangeDetails.getCashMemoDetails().getLotNumber());
			tepPriceRequest.setCashMemoDetailsId(goodsExchangeDetails.getCashMemoDetails().getId());
		}
		tepPriceRequest.setMeasuredQuantity(goodsExchangeDetails.getQuantity());
		tepPriceRequest.setMeasuredWeight(measuredWeight);

		tepPriceRequest.setStones(stoneDetailsList);
		tepPriceRequest.setTepType(goodsExchangeDetails.getGoodsExchange().getSalesTxn().getSubTxnType());
		tepPriceRequest.setTepExceptionDetails(tepExceptionDetails);

		log.info("tepPriceRequest" + MapperUtil.getJsonString(tepPriceRequest));
		TepPriceResponseDto tepPriceRecalculation = engineService.getTepPriceDetails(tepPriceRequest);
		log.info("tepPriceRecalculation" + MapperUtil.getJsonString(tepPriceRecalculation));
		if (customerDetails.getCustomerType().equals(CustomerTypeEnum.INSTITUTIONAL.name())) {
			TotalTaxAndTaxDetailsDto totalTaxAndTaxDetailsDto = commonTransactionService.getTotalTaxDetails(
					goodsExchangeDetails.getGoodsExchange().getSalesTxn().getCustomerId(),
					tepPriceRecalculation.getItemCode(), tepPriceRecalculation.getFinalValue(), BigDecimal.ZERO,
					TxnTaxTypeEnum.TEP_GEP_TANISHQ_EXCHANGE, taxDetails, null);
			itemTotalTax = totalTaxAndTaxDetailsDto.getTotalTax();
			goodsExchangeDetails.setTaxDetails(MapperUtil.getStringFromJson(taxDetails));
			goodsExchangeDetails.setTotalTax(itemTotalTax);
		}

		goodsExchangeDetails.setTotalValue(tepPriceRecalculation.getFinalValue());
		BigDecimal unitValue = tepPriceRecalculation.getFinalValue().divide(
				BigDecimal.valueOf(goodsExchangeDetails.getQuantity()), DomainConstants.PRICE_SCALE,
				RoundingMode.HALF_UP);
		BigDecimal unitWeight = tepPriceRecalculation.getStdWeight()
				.divide(BigDecimal.valueOf(goodsExchangeDetails.getQuantity()));
		goodsExchangeDetails.setUnitValue(unitValue);
		goodsExchangeDetails.setFinalValue(tepPriceRecalculation.getFinalValue().add(itemTotalTax));
		goodsExchangeDetails.setUnitWeight(unitWeight);
		goodsExchangeDetails.setFinalValue(goodsExchangeDetails.getFinalValue());
		if ("REFUND".equalsIgnoreCase(goodsExchangeDetails.getGoodsExchange().getPaymentType())) {
			tepPriceRecalculation.setRefundDeductionAmount(goodsExchangeDetails.getFinalValue()
					.multiply(tepPriceRecalculation.getRefundDeductionPercent().divide(BigDecimal.valueOf(100))));
//			goodsExchangeDetails.setFinalValue(goodsExchangeDetails.getFinalValue().subtract(tepPriceRecalculation.getRefundDeductionAmount()));
		}

		// flat tep exception
		if (flatTepException) {
			itemTotalTax = BigDecimal.ZERO;
			tepPriceRecalculation.setFinalValue(flatExchangeValue);
			goodsExchangeDetails.setTotalTax(BigDecimal.ZERO);
			goodsExchangeDetails.setFinalValue(flatExchangeValue);
			goodsExchangeDetails.setTotalValue(flatExchangeValue);
			goodsExchangeDetails.setTaxDetails(null);
			goodsExchangeDetails.setUnitValue(flatExchangeValue);
			tepPriceRecalculation.setRefundDeductionAmount(BigDecimal.ZERO);
			tepPriceRecalculation.setDeductionAmount(BigDecimal.ZERO);
			tepPriceRecalculation.setDiscountRecovered(BigDecimal.ZERO);
			tepPriceRecalculation.getMetalPriceDetails().setPreDiscountValue(BigDecimal.ZERO);
			List<MetalPriceDto> metalPrices = tepPriceRecalculation.getMetalPriceDetails().getMetalPrices();
			for (MetalPriceDto goldPrice : metalPrices) {
				goldPrice.setMetalValue(BigDecimal.ZERO);
			}
			tepPriceRecalculation.getMetalPriceDetails().setMetalPrices(metalPrices);
			tepPriceRecalculation.getMakingChargeDetails().setPreDiscountValue(BigDecimal.ZERO);
			tepPriceRecalculation.getMakingChargeDetails().setMakingChargePgram(BigDecimal.ZERO);
			tepPriceRecalculation.getStonePriceDetails().setPreDiscountValue(BigDecimal.ZERO);
			// tepPriceRecalculation.setStones(new ArrayList<>());
		}
		goodsExchangeDetails.setPriceDetails(MapperUtil.getStringFromJson(tepPriceRecalculation));
		BigDecimal roundingVariance = commonTransactionService
				.getRoundingVariance(goodsExchangeDetails.getFinalValue());
		goodsExchangeDetails.setFinalValue(goodsExchangeDetails.getFinalValue().add(roundingVariance));
		log.debug("total value ---- {}", goodsExchangeDetails.getTotalValue());
		log.debug("final value ---- {}", goodsExchangeDetails.getFinalValue());
		log.debug("unit value ---- {}", goodsExchangeDetails.getUnitValue());
		log.debug("unit value ---- {}", goodsExchangeDetails.getUnitWeight());
		log.debug("quantity ---- {}", goodsExchangeDetails.getQuantity());
		log.debug("price Details ----- {}",goodsExchangeDetails.getPriceDetails());		
		return tepPriceRecalculation;
	}

	/**
	 * @param processId
	 * @param id
	 * @param status
	 * @param txnType
	 * @param subTxnType
	 * @param gepConfirmOrHoldDto
	 */
	private void validateAndGetFromWorkflow(String processId,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsDaoExt,
			GoodExchangeRequestConfirmDto goodsExchangeRequestConfirmDto, String workFlowType) {
		if (!goodsExchangeDetailsDaoExt.isEmpty()) {
			// always one item will be having in case of tep workflow approval
			// if studded item and lot number is null
			WorkflowProcessGetResponseDto workflowProcessGetResponseDto = validateAndGetWorkflowResponse(workFlowType,
					processId, false);
			validateItemPrice(goodsExchangeDetailsDaoExt.get(0), goodsExchangeRequestConfirmDto, workFlowType,
					workflowProcessGetResponseDto);
		}
	}

	/**
	 * @param goodsExchangeDetails
	 * @param fullValueTepDetails
	 * @return
	 */
	private TepPriceResponseDto updatedPriceCalculationForFullValueTep(GoodsExchangeDetailsDaoExt goodsExchangeDetails,
			WorkflowProcessGetResponseDto workflowProcessGetResponseDto, MetalRateListDto metalRateListDto) {
		FullValueTepDetailsDto fullValueTepDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(workflowProcessGetResponseDto.getApprovedData().getData(), FullValueTepDetailsDto.class);
		BigDecimal measuredWeight = goodsExchangeDetails.getTotalWeight();
		String pricedetails = goodsExchangeDetails.getPriceDetails();
		BigDecimal hallMarkingCharges = BigDecimal.ZERO;
		HallmarkGstRequestDto hallmarkGstRequestDto = null;
		TaxCalculationResponseDto taxDetails = engineService.getTaxDetails(CommonUtil.getLocationCode(),
				goodsExchangeDetails.getGoodsExchange().getSalesTxn().getCustomerId(),
				TxnTaxTypeEnum.TEP_GEP_TANISHQ_EXCHANGE.name(), goodsExchangeDetails.getItemCode(), true, false);
		// if approver chooses payment value as Full Value then measured weight should
		// be billed weight i.e cm item weight
		// if approver chooses payment value as Propotioned Value then measured weight
		// should be updated weight
		// i.e at the time of TEP input weight
		// if approver chooses invoice and full value combination then gold/stone value
		// is cashmemo values
		if (SalesConstants.INVOICE_VALUE.equalsIgnoreCase(fullValueTepDetails.getTepValue().get(0))) {
			measuredWeight = goodsExchangeDetails.getCashMemoDetails().getTotalWeight();
			metalRateListDto = MapperUtil.getObjectMapperInstance().convertValue(MapperUtil.getJsonFromString(
					goodsExchangeDetails.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getMetalRateDetails()),
					MetalRateListDto.class);
			metalRateListDto = MapperUtil.getObjectMapperInstance().convertValue(MapperUtil.getJsonFromString(
					goodsExchangeDetails.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getMetalRateDetails()),
					MetalRateListDto.class);
			pricedetails = goodsExchangeDetails.getCashMemoDetails().getPriceDetails();

		} else if (SalesConstants.OVERRIDING_VALUE.equalsIgnoreCase(fullValueTepDetails.getTepValue().get(0))) {
			measuredWeight = goodsExchangeDetails.getTotalWeight();
		}

		if (SalesConstants.INVOICE_VALUE.equalsIgnoreCase(fullValueTepDetails.getTepValue().get(0))
				&& SalesConstants.PROPOTIONED_VALUE.equalsIgnoreCase(fullValueTepDetails.getPaymentValue().get(0))) {

			measuredWeight = goodsExchangeDetails.getGoodsExchange().getTotalWeight();
			metalRateListDto = MapperUtil.getObjectMapperInstance().convertValue(MapperUtil.getJsonFromString(
					goodsExchangeDetails.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getMetalRateDetails()),
					MetalRateListDto.class);
			pricedetails = goodsExchangeDetails.getPriceDetails();
		}

		log.debug("payment value: {}", fullValueTepDetails.getPaymentValue().get(0));
		String customerMobileNo = customerService
				.getCustomer(goodsExchangeDetails.getGoodsExchange().getSalesTxn().getCustomerId()).getMobileNumber();
		TepPriceResponseDto tepPriceRecalculation = getItemPrice(goodsExchangeDetails.getItemCode(),
				goodsExchangeDetails.getCashMemoDetails().getLotNumber(),
				goodsExchangeDetails.getCashMemoDetails().getId(), goodsExchangeDetails.getQuantity(), measuredWeight,
				customerMobileNo, metalRateListDto, pricedetails,
				goodsExchangeDetails.getGoodsExchange().getSalesTxn().getSubTxnType(), true);
		log.info("tepPriceRecalculation" + MapperUtil.getJsonString(tepPriceRecalculation));
		// Invoice value
		if (SalesConstants.INVOICE_VALUE.equalsIgnoreCase(fullValueTepDetails.getTepValue().get(0))
				&& SalesConstants.FULL_VALUE.equalsIgnoreCase(fullValueTepDetails.getPaymentValue().get(0))) {
			PriceDetailsDto cmDetailsPriceDetails = MapperUtil
					.mapObjToClass(goodsExchangeDetails.getCashMemoDetails().getPriceDetails(), PriceDetailsDto.class);
			tepPriceRecalculation.setMakingChargeDetails(cmDetailsPriceDetails.getMakingChargeDetails());

			tepPriceRecalculation.setDiscountRecovered(goodsExchangeDetails.getCashMemoDetails().getTotalDiscount());

			tepPriceRecalculation.setFinalValue(
					tepPriceRecalculation.getFinalValue().subtract(tepPriceRecalculation.getDiscountRecovered()));

			// }
			tepPriceRecalculation.setDeductionAmount(BigDecimal.ZERO);
			tepPriceRecalculation.setFinalValue(
					tepPriceRecalculation.getFinalValue().subtract(tepPriceRecalculation.getDeductionAmount()));

			List<ItemLotStoneDto> stones = new ArrayList<>();
			BigDecimal stoneDeductionValue = BigDecimal.ZERO;
			for (ItemLotStoneDto itemLotStoneDto : tepPriceRecalculation.getStones()) {
				stoneDeductionValue = stoneDeductionValue
						.add(itemLotStoneDto.getDeductionValue() == null ? BigDecimal.ZERO
								: itemLotStoneDto.getDeductionValue());
				itemLotStoneDto.setDeductionValue(BigDecimal.ZERO);
				itemLotStoneDto.setFinalStoneValue(itemLotStoneDto.getMeasuredValue() == null ? BigDecimal.ZERO
						: itemLotStoneDto.getMeasuredValue());
				itemLotStoneDto.setStoneDeductionPercentage(BigDecimal.ZERO);
				stones.add(itemLotStoneDto);
			}

			if (tepPriceRecalculation.getMakingChargeDetails() == null) {
				MakingChargeDetailsDto makingChargeDetails = new MakingChargeDetailsDto();
				makingChargeDetails.setPreDiscountValue(BigDecimal.ZERO);
				tepPriceRecalculation.setMakingChargeDetails(makingChargeDetails);
			}

			tepPriceRecalculation.setStones(stones);
			if(cmDetailsPriceDetails.getStonePriceDetails()!=null) {
				tepPriceRecalculation.getStonePriceDetails()
				.setPreDiscountValue(cmDetailsPriceDetails.getStonePriceDetails().getPreDiscountValue()!=null?
						cmDetailsPriceDetails.getStonePriceDetails().getPreDiscountValue():BigDecimal.ZERO);	
			} else {
				tepPriceRecalculation.getStonePriceDetails().setPreDiscountValue(BigDecimal.ZERO);
			}
			
//			tepPriceRecalculation.getStonePriceDetails().setPreDiscountValue(
//					tepPriceRecalculation.getStonePriceDetails().getPreDiscountValue().add(stoneDeductionValue));
			if (tepPriceRecalculation.getIsUCPproduct() != null && tepPriceRecalculation.getIsUCPproduct()) {
				tepPriceRecalculation.setFinalValue(goodsExchangeDetails.getCashMemoDetails().getTotalValue());
				tepPriceRecalculation.setUCPValue(goodsExchangeDetails.getCashMemoDetails().getTotalValue());

			} else {
				tepPriceRecalculation
						.setFinalValue((tepPriceRecalculation.getMetalPriceDetails().getPreDiscountValue() != null
								? tepPriceRecalculation.getMetalPriceDetails().getPreDiscountValue()
								: BigDecimal.ZERO)
								.add((tepPriceRecalculation.getStonePriceDetails().getPreDiscountValue()) != null
										? tepPriceRecalculation.getStonePriceDetails().getPreDiscountValue()
										: BigDecimal.ZERO)
								.add((tepPriceRecalculation.getMakingChargeDetails().getPreDiscountValue()) != null
										? tepPriceRecalculation.getMakingChargeDetails().getPreDiscountValue()
										: BigDecimal.ZERO)
								.add((tepPriceRecalculation.getMaterialDetails().getPreDiscountValue()) != null
										? tepPriceRecalculation.getMaterialDetails().getPreDiscountValue()
										: BigDecimal.ZERO)
								.subtract((tepPriceRecalculation.getDiscountRecovered()) != null
										? tepPriceRecalculation.getDiscountRecovered()
										: BigDecimal.ZERO));
			}

			log.info("final Value recovered" + tepPriceRecalculation.getFinalValue());
			hallMarkingCharges = goodsExchangeDetails.getCashMemoDetails().getHallmarkCharges()
					.subtract(goodsExchangeDetails.getCashMemoDetails().getHallmarkDiscount());
			taxDetails = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(goodsExchangeDetails.getCashMemoDetails().getTaxDetails()),
					TaxCalculationResponseDto.class);
			hallmarkGstRequestDto = new HallmarkGstRequestDto(
					goodsExchangeDetails.getCashMemoDetails().getHallmarkCharges(),
					goodsExchangeDetails.getCashMemoDetails().getHallmarkDiscount(),
					cmDetailsPriceDetails.getItemHallmarkDetails().getHallmarkGstPct());
		} else if (SalesConstants.INVOICE_VALUE.equalsIgnoreCase(fullValueTepDetails.getTepValue().get(0))
				&& SalesConstants.PROPOTIONED_VALUE.equalsIgnoreCase(fullValueTepDetails.getPaymentValue().get(0))) {

			PriceDetailsDto cmDetailsPriceDetails = MapperUtil
					.mapObjToClass(goodsExchangeDetails.getCashMemoDetails().getPriceDetails(), PriceDetailsDto.class);
			tepPriceRecalculation.setMakingChargeDetails(cmDetailsPriceDetails.getMakingChargeDetails());

			tepPriceRecalculation.setDiscountRecovered(goodsExchangeDetails.getCashMemoDetails().getTotalDiscount());

			tepPriceRecalculation.setFinalValue(
					tepPriceRecalculation.getFinalValue().subtract(tepPriceRecalculation.getDiscountRecovered()));

			// }
			tepPriceRecalculation.setDeductionAmount(BigDecimal.ZERO);
			tepPriceRecalculation.setFinalValue(
					tepPriceRecalculation.getFinalValue().subtract(tepPriceRecalculation.getDeductionAmount()));

			List<ItemLotStoneDto> stones = new ArrayList<>();
			BigDecimal stoneDeductionValue = BigDecimal.ZERO;
			for (ItemLotStoneDto itemLotStoneDto : tepPriceRecalculation.getStones()) {
				stoneDeductionValue = stoneDeductionValue
						.add(itemLotStoneDto.getDeductionValue() == null ? BigDecimal.ZERO
								: itemLotStoneDto.getDeductionValue());
				itemLotStoneDto.setDeductionValue(BigDecimal.ZERO);
				itemLotStoneDto.setFinalStoneValue(itemLotStoneDto.getMeasuredValue() == null ? BigDecimal.ZERO
						: itemLotStoneDto.getMeasuredValue());
				itemLotStoneDto.setStoneDeductionPercentage(BigDecimal.ZERO);
				stones.add(itemLotStoneDto);
			}

			if (tepPriceRecalculation.getMakingChargeDetails() == null) {
				MakingChargeDetailsDto makingChargeDetails = new MakingChargeDetailsDto();
				makingChargeDetails.setPreDiscountValue(BigDecimal.ZERO);
				tepPriceRecalculation.setMakingChargeDetails(makingChargeDetails);
			}

			tepPriceRecalculation.setStones(stones);
			tepPriceRecalculation.getStonePriceDetails()
					.setPreDiscountValue(cmDetailsPriceDetails.getStonePriceDetails().getPreDiscountValue() != null
							? cmDetailsPriceDetails.getStonePriceDetails().getPreDiscountValue()
							: BigDecimal.ZERO);
			tepPriceRecalculation.getMakingChargeDetails()
					.setPreDiscountValue(cmDetailsPriceDetails.getMakingChargeDetails().getPreDiscountValue() != null
							? cmDetailsPriceDetails.getMakingChargeDetails().getPreDiscountValue()
							: BigDecimal.ZERO);
			tepPriceRecalculation.setMetalPriceDetails(
					cmDetailsPriceDetails.getMetalPriceDetails() != null ? cmDetailsPriceDetails.getMetalPriceDetails()
							: null);
			;
			if (tepPriceRecalculation.getIsUCPproduct() != null && tepPriceRecalculation.getIsUCPproduct()) {
				tepPriceRecalculation.setFinalValue(goodsExchangeDetails.getCashMemoDetails().getTotalValue());
				tepPriceRecalculation.setUCPValue(goodsExchangeDetails.getCashMemoDetails().getTotalValue());

			} else {
				tepPriceRecalculation
						.setFinalValue((tepPriceRecalculation.getMetalPriceDetails().getPreDiscountValue() != null
								? tepPriceRecalculation.getMetalPriceDetails().getPreDiscountValue()
								: BigDecimal.ZERO)
								.add((tepPriceRecalculation.getStonePriceDetails().getPreDiscountValue()) != null
										? tepPriceRecalculation.getStonePriceDetails().getPreDiscountValue()
										: BigDecimal.ZERO)
								.add((tepPriceRecalculation.getMakingChargeDetails().getPreDiscountValue()) != null
										? tepPriceRecalculation.getMakingChargeDetails().getPreDiscountValue()
										: BigDecimal.ZERO)
								.add((tepPriceRecalculation.getMaterialDetails().getPreDiscountValue()) != null
										? tepPriceRecalculation.getMaterialDetails().getPreDiscountValue()
										: BigDecimal.ZERO)
								.subtract((tepPriceRecalculation.getDiscountRecovered()) != null
										? tepPriceRecalculation.getDiscountRecovered()
										: BigDecimal.ZERO));
			}

			log.info("final Value recovered" + tepPriceRecalculation.getFinalValue());
			hallMarkingCharges = goodsExchangeDetails.getCashMemoDetails().getHallmarkCharges()
					.subtract(goodsExchangeDetails.getCashMemoDetails().getHallmarkDiscount());
			taxDetails = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(goodsExchangeDetails.getCashMemoDetails().getTaxDetails()),
					TaxCalculationResponseDto.class);
			hallmarkGstRequestDto = new HallmarkGstRequestDto(
					goodsExchangeDetails.getCashMemoDetails().getHallmarkCharges(),
					goodsExchangeDetails.getCashMemoDetails().getHallmarkDiscount(),
					cmDetailsPriceDetails.getItemHallmarkDetails().getHallmarkGstPct());

		}

//		tepPriceRecalculation.setMeasuredWeight(goodsExchangeDetails.getTotalWeight());
//		BigDecimal itemTotalTax = commonTransactionService.getTaxDetails(tepPriceRecalculation.getFinalValue(), null,
//				taxDetails);
		TotalTaxAndTaxDetailsDto totalTaxAndTaxDetailsDto = commonTransactionService.getTotalTaxDetails(
				goodsExchangeDetails.getGoodsExchange().getSalesTxn().getCustomerId(),
				tepPriceRecalculation.getItemCode(), tepPriceRecalculation.getFinalValue(), BigDecimal.ZERO,
				TxnTaxTypeEnum.TEP_GEP_TANISHQ_EXCHANGE, taxDetails, hallmarkGstRequestDto);
		BigDecimal itemTotalTax = totalTaxAndTaxDetailsDto.getTotalTax();
		goodsExchangeDetails.setTaxDetails(MapperUtil.getStringFromJson(taxDetails));
		goodsExchangeDetails.setTotalTax(itemTotalTax);
		goodsExchangeDetails.setTotalValue(tepPriceRecalculation.getFinalValue());
		BigDecimal unitValue = tepPriceRecalculation.getFinalValue().divide(
				BigDecimal.valueOf(goodsExchangeDetails.getQuantity()), DomainConstants.PRICE_SCALE,
				RoundingMode.HALF_UP);
		BigDecimal unitWeight = tepPriceRecalculation.getStdWeight()
				.divide(BigDecimal.valueOf(goodsExchangeDetails.getQuantity()));
		goodsExchangeDetails.setUnitValue(unitValue);
		goodsExchangeDetails.setFinalValue(tepPriceRecalculation.getFinalValue().add(itemTotalTax));
		goodsExchangeDetails.setUnitWeight(unitWeight);
		goodsExchangeDetails.setFinalValue(goodsExchangeDetails.getFinalValue().add(hallMarkingCharges));
		tepPriceRecalculation.setHallMarkingCharges(hallMarkingCharges);
		if ("REFUND".equalsIgnoreCase(goodsExchangeDetails.getGoodsExchange().getPaymentType())) {
			tepPriceRecalculation.setRefundDeductionAmount(goodsExchangeDetails.getFinalValue()
					.multiply(tepPriceRecalculation.getRefundDeductionPercent().divide(BigDecimal.valueOf(100))));
			BigDecimal roundingVariance = commonTransactionService
					.getRoundingVariance(tepPriceRecalculation.getRefundDeductionAmount());
			
			tepPriceRecalculation.setRefundDeductionAmount(tepPriceRecalculation.getRefundDeductionAmount().add(roundingVariance));			//tepPriceRecalculation.setRefundDeductionAmount(goodsExchangeDetails.getGoodsExchange().getRefundValue());
			//goodsExchangeDetails.setFinalValue(goodsExchangeDetails.getFinalValue().subtract(tepPriceRecalculation.getRefundDeductionAmount()));
		}

		// overriden value
		if (SalesConstants.OVERRIDING_VALUE.equalsIgnoreCase(fullValueTepDetails.getTepValue().get(0))) {
			if (BigDecimal.ZERO.compareTo(fullValueTepDetails.getOverrideValue()) == 0)
				throw new ServiceException("Overriding value should be greater than 0", "ERR-SALE-272",
						"overriding value : " + fullValueTepDetails.getOverrideValue());
			itemTotalTax = BigDecimal.ZERO;
			tepPriceRecalculation.setFinalValue(fullValueTepDetails.getOverrideValue());
			goodsExchangeDetails.setTotalTax(BigDecimal.ZERO);
			goodsExchangeDetails.setFinalValue(fullValueTepDetails.getOverrideValue());
			goodsExchangeDetails.setTotalValue(fullValueTepDetails.getOverrideValue());
			goodsExchangeDetails.setTaxDetails(null);
			goodsExchangeDetails.setUnitValue(fullValueTepDetails.getOverrideValue());
			tepPriceRecalculation.setRefundDeductionAmount(BigDecimal.ZERO);
			tepPriceRecalculation.setDiscountRecovered(BigDecimal.ZERO);
			tepPriceRecalculation.getMetalPriceDetails().setPreDiscountValue(BigDecimal.ZERO);
			List<MetalPriceDto> metalPrices = tepPriceRecalculation.getMetalPriceDetails().getMetalPrices();
			for (MetalPriceDto goldPrice : metalPrices) {
				goldPrice.setMetalValue(BigDecimal.ZERO);
			}
			tepPriceRecalculation.getMetalPriceDetails().setMetalPrices(metalPrices);
			tepPriceRecalculation.getMakingChargeDetails().setPreDiscountValue(BigDecimal.ZERO);
			tepPriceRecalculation.getMakingChargeDetails().setMakingChargePgram(BigDecimal.ZERO);
			tepPriceRecalculation.getStonePriceDetails().setPreDiscountValue(BigDecimal.ZERO);
			// tepPriceRecalculation.setStones(new ArrayList<>());
		}
		goodsExchangeDetails.setPriceDetails(MapperUtil.getStringFromJson(tepPriceRecalculation));
		BigDecimal roundingVariance = commonTransactionService
				.getRoundingVariance(goodsExchangeDetails.getFinalValue());
		goodsExchangeDetails.setFinalValue(goodsExchangeDetails.getFinalValue().add(roundingVariance));
		log.debug("total value ---- {}", goodsExchangeDetails.getTotalValue());
		log.debug("final value ---- {}", goodsExchangeDetails.getFinalValue());
		log.debug("unit value ---- {}", goodsExchangeDetails.getUnitValue());
		log.debug("unit value ---- {}", goodsExchangeDetails.getUnitWeight());
		log.debug("quantity ---- {}", goodsExchangeDetails.getQuantity());

		return tepPriceRecalculation;
	}

	private void validateFullValueTepInput(BigDecimal totalValue, BigDecimal totalWeight,
			TepPriceResponseDto tepPriceResponse, Short measuredQuantity) {
		BigDecimal totalItemWeight = BigDecimal.ZERO;
		if (totalItemWeight.compareTo(tepPriceResponse.getMeasuredWeight()) != 0) {
			totalItemWeight = tepPriceResponse.getMeasuredWeight();
		} else {
			totalItemWeight = tepPriceResponse.getStdWeight().multiply(BigDecimal.valueOf(measuredQuantity));
		}
		log.debug("UI totalValue : " + totalValue + " & pricing API totalValue : " + tepPriceResponse.getFinalValue());
		if (totalValue.compareTo(tepPriceResponse.getFinalValue()) != 0) {
			throw new ServiceException(SalesConstants.PRICE_MISMATCH, SalesConstants.ERR_SALE_044,
					"Total value from UI : " + totalValue + " & final value from price API : "
							+ tepPriceResponse.getFinalValue());
		}
		log.debug("UI totalWeight : " + totalWeight + " & pricing API totalWeight : " + totalItemWeight);
		if (totalWeight.compareTo(totalItemWeight) != 0) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					" UI totalWeight : " + totalWeight + " & pricing API totalWeight : " + totalItemWeight);
		}
	}

	/**
	 * @param workflowProcessGetResponseDto
	 */
	private List<ItemLotStoneDto> getApprovedDetails(WorkflowProcessGetResponseDto workflowProcessGetResponseDto) {
		JsonData approvedData = workflowProcessGetResponseDto.getApprovedData();
		List<ItemLotStoneDto> stonedetails = new ArrayList<>();
		try {
			JsonNode root = MapperUtil.getObjectMapperInstance()
					.readTree(MapperUtil.getStringFromJson(approvedData.getData()));
			JsonNode arrNode = root.path("stones");
			if (arrNode.isArray()) {
				for (final JsonNode objNode : arrNode) {
					ItemLotStoneDto itemStone = MapperUtil.mapObjToClass(objNode, ItemLotStoneDto.class);
					stonedetails.add(itemStone);
				}
			}
			return stonedetails;
		} catch (IOException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}
	}

	private JsonData getTepExceptionApprovedDetails(WorkflowProcessGetResponseDto workflowProcessGetResponseDto) {
		JsonData approvedData = workflowProcessGetResponseDto.getApprovedData();
		return approvedData;
	}

	private WorkflowProcessGetResponseDto validateAndGetWorkflowResponse(String workflowType, String processId,
			Boolean toRecalculate) {
		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, workflowType);
		ApiResponseDto epossApiResponseDtoToGet = salesIntegrationServiceImpl.callIntegration(HttpMethod.GET,
				SalesUtil.WORKFLOW_PROCESS_URL + "/" + processId, reqParams, null);
		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = MapperUtil.getObjectMapperInstance()
				.convertValue(epossApiResponseDtoToGet.getResponse(), WorkflowProcessGetResponseDto.class);
		if (!WorkflowProcessStatusEnum.APPROVED.toString().equals(workflowProcessGetResponseDto.getApprovalStatus())
				&& !toRecalculate) {
			throw new ServiceException("Request is not in approved state", "ERR-SALE-098",
					"Request status should be: " + WorkflowProcessStatusEnum.APPROVED.toString() + ", found: "
							+ workflowProcessGetResponseDto.getApprovalStatus());
		}
		return workflowProcessGetResponseDto;
	}

	public void validateItemPrice(GoodsExchangeDetailsDaoExt goodsExchangeDetails,
			GoodExchangeRequestConfirmDto goodsExchangeRequestConfirmDto, String workFlowType,
			WorkflowProcessGetResponseDto workflowProcessGetResponseDto) {

		JsonData tepExceptionDetails = null;
		TepPriceResponseDto priceData = getPriceDetails(goodsExchangeDetails);
		List<ItemLotStoneDto> stones = priceData.getStones();
		if (workFlowType.equals(SalesUtil.TEP_WORKFLOW_TYPE)) {
			stones = getApprovedDetails(workflowProcessGetResponseDto);
		} else if (workFlowType.equals(SalesUtil.TEP_EXCEPTION_WORKFLOW_TYPE)) {
			tepExceptionDetails = workflowProcessGetResponseDto.getApprovedData();
		}

		CustomerDetailsDto customerDetails = customerService
				.getCustomer(goodsExchangeDetails.getGoodsExchange().getSalesTxn().getCustomerId());
		List<BaseStoneDetails> stoneRequest = new ArrayList<>();
		stones.forEach(stone -> {
			BaseStoneDetails baseStone = new BaseStoneDetails();
			baseStone.setMeasuredNoOfStones(stone.getMeasuredNoOfStones());
			baseStone.setMeasuredStoneWeight(stone.getStoneWeight());
			baseStone.setStoneCode(stone.getStoneCode());
			stoneRequest.add(baseStone);
		});
		TepPriceRequest priceRequest = new TepPriceRequest();
		priceRequest.setCustomerMobileNo(customerDetails.getMobileNumber());

		if (goodsExchangeDetails.getCashMemoDetails() != null) {
			priceRequest.setCashMemoDetailsId(goodsExchangeDetails.getCashMemoDetails().getId());
			priceRequest.setLotNumber(goodsExchangeDetails.getCashMemoDetails().getLotNumber());
		}
		priceRequest.setItemCode(goodsExchangeDetails.getItemCode());

		priceRequest.setMeasuredQuantity(goodsExchangeDetails.getQuantity());
		priceRequest.setMeasuredWeight(goodsExchangeDetails.getTotalWeight());
		priceRequest.setStones(stoneRequest);
		priceRequest.setTepType(goodsExchangeDetails.getGoodsExchange().getSalesTxn().getSubTxnType());
		priceRequest.setStandardPrice(engineService.getStandardMetalRate());
		priceRequest.setTepExceptionDetails(tepExceptionDetails);
		TepPriceResponseDto priceResponseDto = engineService.getTepPriceDetails(priceRequest);
		if (goodsExchangeRequestConfirmDto.getTotalValue().compareTo(priceResponseDto.getFinalValue()) != 0) {
			throw new ServiceException(SalesConstants.PRICE_MISMATCH, SalesConstants.ERR_SALE_044,
					"Total value from UI : " + goodsExchangeRequestConfirmDto.getTotalValue()
							+ " & final value from price API : " + priceResponseDto.getFinalValue());
		}
		goodsExchangeDetails.setTotalValue(priceResponseDto.getFinalValue());
		goodsExchangeDetails.setFinalValue(priceResponseDto.getFinalValue());
		BigDecimal itemUnitValue = priceResponseDto.getFinalValue().divide(
				new BigDecimal(priceResponseDto.getItemQuantity()), DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP);
		goodsExchangeDetails.setUnitValue(itemUnitValue);
		goodsExchangeDetails.setPriceDetails(MapperUtil.getStringFromJson(priceResponseDto));
	}

	@Override
	public GoodExchangeDiscountDetailsDto checkApplicableDiscounts(GoodsExchangeDaoExt goodsExchangeDaoExt,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList) {
		return super.getApplicableDiscounts(goodsExchangeDaoExt, goodsExchangeDetailsList);
	}

	@Override
	public void updateLegacyTepItems(GoodsExchangeDaoExt goodsExchange) {
		List<TepUpdateItemsDto> updateTepDetails = new ArrayList<>();
		List<GrnItemDetials> items = new ArrayList<>();
		TepUpdateItemsDto grnUpdate = new TepUpdateItemsDto();
		TepLegacyUpdateDto tepLegacyUpdateDto = new TepLegacyUpdateDto();
		List<GoodsExchangeDetailsDaoExt> tepItems = super.goodsExchangeDetailsRepository
				.findByGoodsExchange(goodsExchange);
		if (tepItems != null && !tepItems.isEmpty()) {
			for (GoodsExchangeDetailsDaoExt tep : tepItems) {
				if (tep.getCashMemoDetails() != null && tep.getCashMemoDetails().getCashMemoDao().getIsMigrated()) {
					if (tep.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getRefTxnId() != null) {
						grnUpdate.setCmDocNo(
								tep.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getRefTxnId().getDocNo());
					} else {
						grnUpdate.setCmDocNo(tep.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getDocNo());

					}

					grnUpdate.setCmLocationCode(
							tep.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getLocationCode());
					grnUpdate.setCmFiscalYear(
							tep.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getFiscalYear());

					GrnItemDetials grndetail = new GrnItemDetials();
					grndetail.setItemCode(tep.getCashMemoDetails().getItemCode());
					grndetail.setLotNo(tep.getCashMemoDetails().getLotNumber());
					grndetail.setQuantity(tep.getQuantity());
					items.add(grndetail);
					grnUpdate.setItems(items);
					updateTepDetails.add(grnUpdate);
				}
			}
		}
		if (!updateTepDetails.isEmpty()) {
			tepLegacyUpdateDto.setUpdateTEPCM(updateTepDetails);
			log.info(MapperUtil.getJsonString(tepLegacyUpdateDto));
			integrationServiceClient.updateTepItemsLegacy(tepLegacyUpdateDto);
		}
	}

	@Override
	public GoodsExchangeDaoExt updateTepFromLegacytoNap(TepLegacyUpdateDto tepLegacyUpdateDto) {
		GoodsExchangeDaoExt goodsExchangeDao = new GoodsExchangeDaoExt();
		SalesTxnDaoExt existingSalesTxnDao = null;
		List<CashMemoDetailsDao> cashMemoDetailList = new ArrayList<>();

		for (TepUpdateItemsDto tepItems : tepLegacyUpdateDto.getUpdateTEPCM()) {
			existingSalesTxnDao = salesTxnRepositoryExt.getByDocNoFiscalCodeAndLocationCode(
					tepItems.getCmFiscalYear().toString(), tepItems.getCmDocNo().toString(),
					tepItems.getCmLocationCode(), TransactionTypeEnum.CM.name(),
					TransactionStatusEnum.CONFIRMED.name());

			if (existingSalesTxnDao != null) {
				CashMemoDao cashmemoDao = cashMemoRepo.getOne(existingSalesTxnDao.getId());
				List<CashMemoDetailsDao> cashMemoDetailsDaoList = cashMemoDetailsRepo
						.findByCashMemoDaoId(cashmemoDao.getId());
				if (cashMemoDetailsDaoList != null) {
					for (CashMemoDetailsDao cmDetailsDaoExt : cashMemoDetailsDaoList) {
						for (GrnItemDetials grnItem : tepItems.getItems()) {
							if (grnItem.getItemCode().equals(cmDetailsDaoExt.getItemCode())) {

								if (cmDetailsDaoExt != null && cmDetailsDaoExt.getId() != null) {
									short totalTepQuantity = (short) getSumOfTotalQuantityInGoodsExchangeDetailsByCashMemoDetails(
											cmDetailsDaoExt.getId());
									short totalGrnQuantity = (short) getSumOfTotalQuantityInGRNDetailsByCashMemoDetails(
											cmDetailsDaoExt.getId());
									short totalLegacyReturnQty = (cmDetailsDaoExt.getNoOfItemsReturned() == null) ? 0
											: cmDetailsDaoExt.getNoOfItemsReturned();
									if (cmDetailsDaoExt.getTotalQuantity()
											- (totalTepQuantity + totalGrnQuantity + totalLegacyReturnQty) <= 0) {
										throw new ServiceException(GRN_TEP_DONE, ERR_CORE_344,
												Map.of("itemCode", cmDetailsDaoExt.getItemCode()));
									}
								}

								Short returnQty = (short) (cmDetailsDaoExt.getNoOfItemsReturned() == null
										? grnItem.getQuantity()
										: (cmDetailsDaoExt.getTotalQuantity() + grnItem.getQuantity()));
								cmDetailsDaoExt.setNoOfItemsReturned(returnQty);
								cashMemoDetailList.add(cmDetailsDaoExt);
							}
						}
					}

					if (!cashMemoDetailList.isEmpty()) {
						cashMemoDetailsRepo.saveAll(cashMemoDetailList);
					}

				} else {
					throw new ServiceException("CashMemo not found - {docNo} {locationCode} {fiscalYear}",
							"ERR-INT-096",
							Map.of("docNo", "" + tepItems.getCmDocNo().toString(), "locationCode",
									tepItems.getCmLocationCode(), "fiscalYear",
									"" + tepItems.getCmFiscalYear().toString()));
				}

			} else {
				throw new ServiceException("CashMemo not found - {docNo} {locationCode} {fiscalYear}", "ERR-INT-096",
						Map.of("docNo", "" + tepItems.getCmDocNo().toString(), "locationCode",
								tepItems.getCmLocationCode(), "fiscalYear",
								"" + tepItems.getCmFiscalYear().toString()));
			}
		}

		return goodsExchangeDao;

	}

}
