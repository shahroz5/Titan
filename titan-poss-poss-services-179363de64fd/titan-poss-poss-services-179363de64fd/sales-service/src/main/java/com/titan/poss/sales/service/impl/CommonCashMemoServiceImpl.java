/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.config.dto.constants.BGRApplicableDateEnum;
import com.titan.poss.config.dto.constants.BGRApplicableRateEnum;
import com.titan.poss.config.dto.constants.RangeTypeEnum;
import com.titan.poss.config.dto.request.json.BGRConfigDetails;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.ApplicableTcsRates;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.BrandTcsDetails;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CashPaidDetailsDto;
import com.titan.poss.core.dto.CustomerTcsDetailsDto;
import com.titan.poss.core.dto.HistoryPriceResponse;
import com.titan.poss.core.dto.ItemCodeInvWeightDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationCashMemoDetailsDto;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.MetalPriceRequestDto;
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.enums.PricingTypeEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.core.utils.WeightCalculatorUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.product.repository.ComplexityRepository;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerDaoExt;
import com.titan.poss.sales.dao.CustomerTcsDetailsDaoExt;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.FocSchemesDaoExt;
import com.titan.poss.sales.dao.GiftDetailsDaoExt;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.OrderDetailsConfigDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.ItemInvDetailsDto;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.OtherChargeDetailsDto;
import com.titan.poss.sales.dto.TaxDetailsListDto;
import com.titan.poss.sales.dto.WeightDetailsDto;
import com.titan.poss.sales.dto.constants.CustomerTypeEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.constants.TxnSourceType;
import com.titan.poss.sales.dto.print.ReturnSalesTxnDto;
import com.titan.poss.sales.dto.request.HallmarkGstRequestDto;
import com.titan.poss.sales.dto.request.SalesItemDto;
import com.titan.poss.sales.dto.request.WeightDetailsAndQtyDto;
import com.titan.poss.sales.dto.response.CashMemoAndDetialsIdResponseDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
import com.titan.poss.sales.dto.response.ExistingItemDetailsDto;
import com.titan.poss.sales.dto.response.ItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.TotalTaxAndTaxDetailsDto;
import com.titan.poss.sales.inventory.service.InventoryService;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.CashMemoRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerRepositoryExt;
import com.titan.poss.sales.repository.CustomerTcsDetailsRepositoryExt;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.FocSchemesRepositoryExt;
import com.titan.poss.sales.repository.GiftDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.DiscountFacadeService;
import com.titan.poss.sales.service.DiscountItemFacadeService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.OrderPriceUtilService;
import com.titan.poss.sales.utils.OrderPriceFactory;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * Service Implementation class for Common services related to cash memo
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesCommonCashMemoServiceImpl")
public class CommonCashMemoServiceImpl implements CommonCashMemoService {

	@Autowired
	private CashMemoRepositoryExt cashMemoRepository;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepository;

	@Autowired
	private GiftDetailsRepositoryExt giftDetailsRepository;

	@Autowired
	private FocSchemesRepositoryExt focSchemesRepository;

	@Autowired
	private OrderRepositoryExt orderRepositoryExt;

	@Autowired
	private OrderDetailsRepositoryExt orderDetailsRepository;

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private OrderUtilServiceImpl orderUtilServiceImpl;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepo;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepo;

	@Autowired
	private DiscountItemFacadeService discountItemFacadeService;

	@Autowired
	private DiscountFacadeService discountFacadeService;

	@Autowired
	private CustomerTxnRepositoryExt customerTxnRepositoryExt;

	@Autowired
	private CustomerTcsDetailsRepositoryExt customerTcsDetailsRepository;

	@Autowired
	private SalesIntegrationServiceImpl salesIntegrationServiceImpl;

	@Autowired
	private InventoryService inventoryService;

	@Autowired
	private OrderPriceFactory orderPriceFactory;

	@Autowired
	private OrderPriceUtilService orderPriceUtilService;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepositoryExt;

	@Autowired
	private CustomerRepositoryExt customerRepositoryExt;
	
	@Autowired
	private ComplexityRepository complexityRepository;


	@Autowired
	private DiscountUtilService discountUtilService;

	private static final String CASH_MEMO = "cash memo";

	private static final String INVALID_CM_ID = "Invalid cash memo id: ";

	private static final String ERR_SALE_012 = "ERR-SALE-012";
	private static final String REMOVE_FOC_ITEM_TO_PUT_THE_CM_ON_HOLD = "Remove FOC item to put the CM on Hold";

	private static final String MOBILENUMBER = "mobileNumber";

	private static final String INSTI_TAX_NO = "instiTaxNo";
    private static final String MOBILE_NO = "mobileNo";
    private static final String CUST_TAX_NO = "custTaxNo";
    private static final String EMAIL_ID =  "emailId";
    private static final String CUSTOMER_NAME ="customerName";
    private static final String PASSPORT_ID = "passportId";
    private static final String CUST_TAX_NO_OLD = "custTaxNoOld";

	
	@Override
	public CashMemoDaoExt checkIfCashMemoExistsByCashMemoId(String cashMemoId, String transactionType,
			String subTxnType) {
		CashMemoDaoExt cashMemoDao = cashMemoRepository.findOneByIdAndLocationCodeAndTxnTypeAndSubTxnType(cashMemoId,
				CommonUtil.getLocationCode(), transactionType, subTxnType);

		if (StringUtils.isEmpty(cashMemoDao)) {
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					INVALID_CM_ID + cashMemoId, Map.of("type", CASH_MEMO));
		}

		return cashMemoDao;
	}

	@Override
	public CashMemoResponseDto cashMemoResponse(CashMemoDaoExt cashMemoDao) {
		CashMemoResponseDto cashMemoResponseDto = (CashMemoResponseDto) MapperUtil.getObjectMapping(cashMemoDao,
				new CashMemoResponseDto());

		// map sales txn table fields to response
		mapSalesTxnFieldsToResponse(cashMemoDao, cashMemoResponseDto);

		if (!StringUtil.isBlankJsonStr(cashMemoDao.getTaxDetails())) {
			cashMemoResponseDto.setTaxDetails(MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(cashMemoDao.getTaxDetails()), TaxDetailsListDto.class));
		}
		if (!StringUtil.isBlankJsonStr(cashMemoDao.getOtherCharges())) {
			cashMemoResponseDto.setOtherCharges(MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(cashMemoDao.getOtherCharges()), OtherChargeDetailsDto.class));
		}
		if (!ObjectUtils.isEmpty(cashMemoDao.getTcsAmount())) {
			cashMemoResponseDto.setTcsToBeCollected(cashMemoDao.getTcsAmount());
		}

		// set CN doc numbers generated.
		List<CreditNoteDaoExt> cnList = creditNoteRepo.findBySalesTxnId(cashMemoDao.getId());
		if (!CollectionUtil.isEmpty(cnList)) {
			List<Integer> cnDocNos = new ArrayList<>();
			List<String> cnIds = new ArrayList<>();
			Map<String, Integer> cnDocNoMap = new HashMap<>();
			cnList.forEach(cnDao -> {
				if (CNStatus.OPEN.name().equals(cnDao.getStatus())) {
					cnDocNos.add(cnDao.getDocNo());
					cnIds.add(cnDao.getId());
					cnDocNoMap.put(cnDao.getId(), cnDao.getDocNo());
				}
			});
			cashMemoResponseDto.setCreditNotes(cnDocNos);
			cashMemoResponseDto.setCndocNos(cnIds);
			cashMemoResponseDto.setCnDocNoMap(cnDocNoMap);
		}

		// PENDING: discount
		return cashMemoResponseDto;
	}

	private void mapSalesTxnFieldsToResponse(CashMemoDaoExt cashMemoDao, CashMemoResponseDto cashMemoResponseDto) {

		cashMemoResponseDto = (CashMemoResponseDto) MapperUtil.getObjectMapping(cashMemoDao.getSalesTxnDao(),
				cashMemoResponseDto);

		if (!StringUtils.isEmpty(cashMemoDao.getSalesTxnDao().getManualBillDetails())) {
			cashMemoResponseDto.setManualBillDetails(commonTransactionService
					.mapJsonToManualBillDetails(cashMemoDao.getSalesTxnDao().getManualBillDetails()));
		}
		if (!StringUtils.isEmpty(cashMemoDao.getSalesTxnDao().getRefTxnId())) {
			cashMemoResponseDto.setRefTxnId(cashMemoDao.getSalesTxnDao().getRefTxnId().getId());
			cashMemoResponseDto.setRefDocNo(cashMemoDao.getSalesTxnDao().getRefTxnId().getDocNo());
			cashMemoResponseDto.setRefFiscalYear(cashMemoDao.getSalesTxnDao().getRefTxnId().getFiscalYear());
		}
		if (!StringUtils.isEmpty(cashMemoDao.getSalesTxnDao().getMetalRateDetails())) {
			cashMemoResponseDto.setMetalRateList(
					commonTransactionService.mapMetalRateJsonToDto(cashMemoDao.getSalesTxnDao().getMetalRateDetails()));
		}

		if (!StringUtil.isBlankJsonStr(cashMemoDao.getSalesTxnDao().getDiscountTxnDetails())) {
			cashMemoResponseDto.setDiscountTxnDetails(
					MapperUtil.mapObjToClass(cashMemoDao.getSalesTxnDao().getDiscountTxnDetails(), JsonData.class));
		}
            cashMemoResponseDto.setTxnSource(cashMemoDao.getSalesTxnDao().getTxnSource());
		if (!StringUtils.isEmpty(cashMemoDao.getSalesTxnDao().getIsManualFoc())) {
			if (cashMemoDao.getSalesTxnDao().getIsManualFoc() == 1)
				cashMemoResponseDto.setManualFoc(true);
		}
	}

	/**
	 * This method will list all cash memo details based on cashMemoId.
	 * 
	 * @param cashMemoId
	 * @return List<CashMemoDetailsDao>
	 */
	@Override
	public List<CashMemoDetailsDaoExt> getCashMemoDetails(String cashMemoId) {
		return cashMemoDetailsRepository.findByCashMemoDaoId(cashMemoId);
	}

	@Override
	public CashMemoAndDetialsIdResponseDto cashMemoAndDetailsIdResponse(CashMemoDaoExt cashMemoDao,
			BigDecimal tcsCollected) {
		CashMemoAndDetialsIdResponseDto cashMemoAndDetailsResponseDto = (CashMemoAndDetialsIdResponseDto) MapperUtil
				.getObjectMapping(cashMemoResponse(cashMemoDao), new CashMemoAndDetialsIdResponseDto());
		List<String> itemIdList = new ArrayList<>();
		// get Cash Memo details items if subTxnType is not GIFT_SALE
		if (!SubTxnTypeEnum.GIFT_SALE.name().equals(cashMemoDao.getSalesTxnDao().getSubTxnType())) {
			List<CashMemoDetailsDaoExt> cashMemoDetailsList = getCashMemoDetails(cashMemoDao.getId());
			cashMemoDetailsList.forEach(cashMemoDetailsDao -> itemIdList.add(cashMemoDetailsDao.getId()));
		} else {
			List<GiftDetailsDaoExt> giftDetailsDaoList = giftDetailsRepository.findByCashMemoDaoId(cashMemoDao.getId());
			giftDetailsDaoList.forEach(giftDetailsDao -> itemIdList.add(giftDetailsDao.getItemId()));
		}
		// TCS CummulativeCheck
		if (ObjectUtils.isEmpty(tcsCollected) || tcsCollected.compareTo(BigDecimal.ZERO) != 0) {
			/*
			 * List<PaymentDetailsDaoExt> paymentDetailsDaoExts =
			 * paymentDetailsRepositoryExt
			 * .findBySalesTxnDaoId(cashMemoDao.getSalesTxnDao().getId()); AtomicBoolean
			 * currentTxnPayment = new AtomicBoolean();
			 * currentTxnPayment.set(Boolean.FALSE); AtomicBoolean tcsPaymentDone = new
			 * AtomicBoolean(); tcsPaymentDone.set(Boolean.FALSE); // Check payment done for
			 * current transaction, if yes then set true paymentDetailsDaoExts.stream()
			 * .filter(paymentDetailsDao -> PaymentStatusEnum.COMPLETED.name()
			 * .equalsIgnoreCase(paymentDetailsDao.getStatus()) ||
			 * PaymentStatusEnum.OPEN.name().equalsIgnoreCase(paymentDetailsDao.getStatus())
			 * || PaymentStatusEnum.IN_PROGRESS.name().equalsIgnoreCase(paymentDetailsDao.
			 * getStatus())) .findAny().ifPresent(paymentDetails -> {
			 * currentTxnPayment.set(Boolean.TRUE); });
			 * 
			 * if(currentTxnPayment.get()) { CustomerTcsDetailsDto customerTcsDetailsDto =
			 * cumulativeTcsValueCheck(cashMemoDao);
			 * cashMemoAndDetailsResponseDto.setTcsToBeCollected(
			 * ObjectUtils.isEmpty(customerTcsDetailsDto.getTcsToBeCollected()) ?
			 * BigDecimal.ZERO : customerTcsDetailsDto.getTcsToBeCollected()); }
			 */
			Optional.ofNullable(cashMemoDao.getTcsAmount()).ifPresentOrElse(tcsAmount -> {
				if (tcsAmount.compareTo(BigDecimal.ZERO) > 0) {
					cashMemoAndDetailsResponseDto.setTcsCollected(tcsAmount);
				}
			}, () -> {
				cashMemoAndDetailsResponseDto.setTcsCollected(BigDecimal.ZERO);
			});
		}
		// setting tcsToBeCollected to ZERO only if patch api passes not null for
		// tcsToBeCollected and value as 0
		/*
		 * if(!ObjectUtils.isEmpty(tcsCollected) &&
		 * tcsCollected.compareTo(BigDecimal.ZERO) == 0) {
		 * cashMemoAndDetailsResponseDto.setTcsToBeCollected(BigDecimal.ZERO); }
		 */

		cashMemoAndDetailsResponseDto.setIsIGST(cashMemoDao.getIsIGST());

		cashMemoAndDetailsResponseDto.setItemIdList(itemIdList);
		return cashMemoAndDetailsResponseDto;
	}

	public CustomerTcsDetailsDto cumulativeTcsValueCheck(CashMemoDaoExt cashMemoDao) {
		CustomerTcsDetailsDto customerTcsDetailsDto = new CustomerTcsDetailsDto();
		BusinessDayDto businessDateDto = engineService.getBusinessDay(cashMemoDao.getSalesTxnDao().getLocationCode());
		Optional<CustomerTxnDaoExt> customertTxnDao = customerTxnRepositoryExt.findById(cashMemoDao.getId());
		customertTxnDao.get().setMobileNumber(CryptoUtil.decrypt(customertTxnDao.get().getMobileNumber(),MOBILE_NO,false));
		customertTxnDao.get().setEmailId(CryptoUtil.decrypt(customertTxnDao.get().getEmailId(),EMAIL_ID,false));
		customertTxnDao.get().setCustomerName(CryptoUtil.decrypt(customertTxnDao.get().getCustomerName(),CUSTOMER_NAME,false));
		customertTxnDao.get().setCustTaxNo(CryptoUtil.decrypt(customertTxnDao.get().getCustTaxNo(),CUST_TAX_NO,false));
		customertTxnDao.get().setCustTaxNoOld(CryptoUtil.decrypt(customertTxnDao.get().getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
		customertTxnDao.get().setInstiTaxNo(CryptoUtil.decrypt(customertTxnDao.get().getInstiTaxNo(),INSTI_TAX_NO,false));
		customertTxnDao.get().setPassportId(CryptoUtil.decrypt(customertTxnDao.get().getPassportId(),PASSPORT_ID,false));
		log.info("customertTxnDao details......................"+customertTxnDao);
		if (customertTxnDao.isPresent()) {

			LocationCacheDto locationDoa = engineService
					.getStoreLocation(cashMemoDao.getSalesTxnDao().getLocationCode());
			Optional.ofNullable(locationDoa.getTcsDetails()).ifPresent(tcsDetails -> {
				if (!ObjectUtils.isEmpty(tcsDetails.getIsTcsApplicable()) && tcsDetails.getIsTcsApplicable()
						&& !ObjectUtils.isEmpty(tcsDetails.getLocationPanNumber())
						&& !ObjectUtils.isEmpty(tcsDetails.getTcsApplicableDate())) {

					JsonData jsonData = MapperUtil.mapObjToClass(customertTxnDao.get().getCustomerDetails(),
							JsonData.class);

					Optional<CustomerDaoExt> custmerDaoExt = null;

					BrandDto brandDto = engineService.getBrand(locationDoa.getBrandCode());
					BrandTcsDetails brandTcs = MapperUtil.mapJsonDataToClass(brandDto.getBrandTcsDetails(),
							BrandTcsDetails.class);

					CashPaidDetailsDto cashPaidDetailsDto = new CashPaidDetailsDto(BigDecimal.ZERO);
					// Ignore tcs previous transactions if ONETIME customer Type
					if (!CustomerTypeEnum.ONETIME.name().equalsIgnoreCase(customertTxnDao.get().getCustomerType())) {
						List<String> ownerTypeCode = new ArrayList<String>();
						if ("L1".equalsIgnoreCase(locationDoa.getOwnerTypeCode())
								|| "L2".equalsIgnoreCase(locationDoa.getOwnerTypeCode()))
							ownerTypeCode = Arrays.asList("L1", "L2");
						if ("L3".equalsIgnoreCase(locationDoa.getOwnerTypeCode()))
							ownerTypeCode = Arrays.asList("L3");
						String mobileNo = null;
						String instiTaxNo = null;
						if (CustomerTypeEnum.INSTITUTIONAL.name()
								.equalsIgnoreCase(customertTxnDao.get().getCustomerType())) {
							instiTaxNo = customertTxnDao.get().getInstiTaxNo();
						} else {
							mobileNo = customertTxnDao.get().getMobileNumber();
						}
						
							BigDecimal	cashPaidDetail= customerTcsDetailsRepository.cmCummulativeTcsValue(mobileNo,
								businessDateDto.getFiscalYear().shortValue(), tcsDetails.getTcsApplicableDate(),
								ownerTypeCode, tcsDetails.getLocationPanNumber(), instiTaxNo,
								customertTxnDao.get().getCustomerType());
						
							log.info("cashPaidDetail..................{}",cashPaidDetail);
							cashPaidDetailsDto.setTotalCashPaid(cashPaidDetail);
					}

					// adding current transaction amount to calculate tcs
					log.info("cashPaidDetailsDto total paid amt before adding final value...{}",cashPaidDetailsDto.getTotalCashPaid());
					if (cashMemoDao.getFinalValue() != null) {
						BigDecimal finalValue = cashMemoDao.getTcsAmount().compareTo(BigDecimal.ZERO) == 0
								? cashMemoDao.getFinalValue()
								: cashMemoDao.getFinalValue().subtract(cashMemoDao.getTcsAmount());
					
						cashPaidDetailsDto.setTotalCashPaid(cashPaidDetailsDto.getTotalCashPaid().add(finalValue));
						log.info("finalValue.............{}",finalValue);
						log.info("cashPaidDetailsDto total paid amt after adding final value......{}",cashPaidDetailsDto.getTotalCashPaid());

						if (StringUtils.isEmpty(customertTxnDao.get().getCustTaxNo())
								&& !CustomerTypeEnum.ONETIME.name()
										.equalsIgnoreCase(customertTxnDao.get().getCustomerType())
								&& (StringUtil.isBlankJsonData(jsonData) || (BooleanUtils
										.isNotTrue(JsonUtils.getValueFromJson(jsonData.getData(), "isHardCopySubmitted",
												Boolean.class))
										&& StringUtils.isEmpty(JsonUtils.getValueFromJson(jsonData.getData(),
												"idNumber", String.class))))) {

							String searchType = null;
							String searchValue = null;

							if (!StringUtils.isEmpty(customertTxnDao.get().getMobileNumber())) {
								searchType = "MOBILE_NO";
								searchValue = CryptoUtil.encrypt(customertTxnDao.get().getMobileNumber(), MOBILENUMBER);
							} else {
								searchType = "ULP_ID";
								searchValue = customertTxnDao.get().getUlpId();
							}
							if (CustomerTypeEnum.INSTITUTIONAL.name()
									.equalsIgnoreCase(customertTxnDao.get().getCustomerType())
									&& !StringUtils.isEmpty(customertTxnDao.get().getInstiTaxNo())) {
								searchType = "INSTITUTIONAL";
								searchValue = CryptoUtil.encrypt(customertTxnDao.get().getInstiTaxNo(), INSTI_TAX_NO);
							}
							if(CustomerTypeEnum.INTERNATIONAL.name()
									.equalsIgnoreCase(customertTxnDao.get().getCustomerType())
									&& !StringUtils.isEmpty(customertTxnDao.get().getPassportId())) {
								searchType = "PASSPORT_ID";
								searchValue = CryptoUtil.encrypt(customertTxnDao.get().getPassportId(), PASSPORT_ID);
							}
									
							custmerDaoExt = customerRepositoryExt
									.getCustomerByCustomerTypeAndUlpIdOrMobileNumberOrInstiTaxNoOrPassPortId(
											customertTxnDao.get().getCustomerType(), searchType, searchValue);
							log.info("CustomerDaoExt details............................."+custmerDaoExt);							
							if (!ObjectUtils.isEmpty(brandTcs) && !ObjectUtils.isEmpty(brandTcs.getB2c())
									&& !StringUtils.isEmpty(brandTcs.getB2c()) && custmerDaoExt.isPresent()
									&& StringUtils.isEmpty(custmerDaoExt.get().getCustTaxNo())
									&& !CustomerTypeEnum.INSTITUTIONAL.name()
											.equals(customertTxnDao.get().getCustomerType())
									&& cashPaidDetailsDto.getTotalCashPaid()
											.compareTo(brandTcs.getB2c().getTcsApplicableAmount()) >= 0) {
								JsonData customerMasterJsonData = MapperUtil
										.mapObjToClass(custmerDaoExt.get().getCustomerDetails(), JsonData.class);
								if ((CustomerTypeEnum.INTERNATIONAL.name()
										.equals(customertTxnDao.get().getCustomerType())
										&& StringUtils.isEmpty(custmerDaoExt.get().getPassportId()))
										|| StringUtil.isBlankJsonData(customerMasterJsonData)
										|| (CustomerTypeEnum.REGULAR.name()
												.equals(customertTxnDao.get().getCustomerType())
												&& StringUtils.isEmpty(JsonUtils.getValueFromJson(
														customerMasterJsonData.getData(), "idNumber", String.class)))) {
									// throw error
									throw new ServiceException(
											SalesConstants.CUSTOMER_IS_ELIGIBLE_TO_PAY_TCS_EITHER_PAN_OR_FORM60_IS_MANDATORY,
											SalesConstants.ERR_SALE_391,
											"Customer is eligible to pay TCS, either PAN or form60 is mandatory ");
								}
							} else if (!custmerDaoExt.isPresent() || CustomerTypeEnum.INSTITUTIONAL.name()
									.equals(customertTxnDao.get().getCustomerType())
									&& StringUtils.isEmpty(custmerDaoExt.get().getInstiTaxNo())) {
								// throw error
								throw new ServiceException(
										SalesConstants.CUSTOMER_IS_ELIGIBLE_TO_PAY_TCS_EITHER_PAN_OR_FORM60_IS_MANDATORY,
										SalesConstants.ERR_SALE_391,
										"Customer is eligible to pay TCS, either PAN or form60 is mandatory ");
							}
						}

						if (StringUtils.isEmpty(customertTxnDao.get().getCustTaxNo())
								&& !ObjectUtils.isEmpty(custmerDaoExt) && !custmerDaoExt.isPresent()
								|| (!StringUtils.isEmpty(
										JsonUtils.getValueFromJson(jsonData.getData(), "idNumber", String.class))
										&& !CustomerTypeEnum.ONETIME.name()
												.equals(customertTxnDao.get().getCustomerType())
												&& StringUtils.isEmpty(customertTxnDao.get().getCustTaxNo()))
								|| !ObjectUtils.isEmpty(custmerDaoExt)
										&& StringUtils.isEmpty(custmerDaoExt.get().getCustTaxNo())
										&& !CustomerTypeEnum.ONETIME.name()
												.equals(customertTxnDao.get().getCustomerType())) {
							Optional.ofNullable(brandTcs)
									.ifPresent(brand -> Optional.ofNullable(brand.getB2c())
											.ifPresent(tcs -> tcs.getTcsApplicableRates().stream()
													.filter(applicableTcsRate -> applicableTcsRate.getType()
															.equalsIgnoreCase(customertTxnDao.get().getCustomerType())
															&& applicableTcsRate.getIsPanAvailable() == Boolean.FALSE)
													.findFirst().ifPresent(applicableTcsRate -> {
														populateCalculatedTcsDetails(customerTcsDetailsDto, brandTcs,
																cashPaidDetailsDto, applicableTcsRate, finalValue);
														})));
						

						} else if (!StringUtils.isEmpty(customertTxnDao.get().getCustTaxNo())
								|| !ObjectUtils.isEmpty(custmerDaoExt) && custmerDaoExt.isPresent()
										&& !StringUtils.isEmpty(custmerDaoExt.get().getCustTaxNo())
										&& !"ONETIME".equalsIgnoreCase(customertTxnDao.get().getCustomerType())) {
							Optional.ofNullable(brandTcs)
									.ifPresent(brand -> Optional.ofNullable(brand.getB2c())
											.ifPresent(tcs -> tcs.getTcsApplicableRates().stream()
													.filter(applicableTcsRate -> applicableTcsRate.getType()
															.equalsIgnoreCase(customertTxnDao.get().getCustomerType())
															&& applicableTcsRate.getIsPanAvailable() == Boolean.TRUE)
													.findFirst().ifPresent(applicableTcsRate -> {
														populateCalculatedTcsDetails(customerTcsDetailsDto, brandTcs,
																cashPaidDetailsDto, applicableTcsRate, finalValue);
													})));

						} else if (CustomerTypeEnum.ONETIME.name().equals(customertTxnDao.get().getCustomerType())) {
							if (StringUtils.isEmpty(customertTxnDao.get().getCustTaxNo())
									&& !ObjectUtils.isEmpty(custmerDaoExt) && !custmerDaoExt.isPresent()
									|| !ObjectUtils.isEmpty(custmerDaoExt)
											&& StringUtils.isEmpty(custmerDaoExt.get().getCustTaxNo())) {
								Optional.ofNullable(brandTcs).ifPresent(brand -> Optional.ofNullable(brand.getB2c())
										.ifPresent(tcs -> tcs.getTcsApplicableRates().stream()
												.filter(applicableTcsRate -> applicableTcsRate.getType()
														.equalsIgnoreCase(customertTxnDao.get().getCustomerType()))
												.findFirst().ifPresent(applicableTcsRate -> {
													populateCalculatedTcsDetails(customerTcsDetailsDto, brandTcs,
															cashPaidDetailsDto, applicableTcsRate, finalValue);
												})));

							} else {
								Optional.ofNullable(brandTcs).ifPresent(brand -> Optional.ofNullable(brand.getB2c())
										.ifPresent(tcs -> tcs.getTcsApplicableRates().stream()
												.filter(applicableTcsRate -> applicableTcsRate.getType()
														.equalsIgnoreCase(customertTxnDao.get().getCustomerType())
														&& applicableTcsRate.getIsPanAvailable() == Boolean.FALSE)
												.findFirst().ifPresent(applicableTcsRate -> {
													populateCalculatedTcsDetails(customerTcsDetailsDto, brandTcs,
															cashPaidDetailsDto, applicableTcsRate, finalValue);
												})));
								Optional.ofNullable(brandTcs).ifPresent(brand -> Optional.ofNullable(brand.getB2c())
										.ifPresent(tcs -> tcs.getTcsApplicableRates().stream()
												.filter(applicableTcsRate -> applicableTcsRate.getType()
														.equalsIgnoreCase(customertTxnDao.get().getCustomerType())
														&& applicableTcsRate.getIsPanAvailable() == Boolean.TRUE)
												.findFirst().ifPresent(applicableTcsRate -> {
													for (ApplicableTcsRates rate : tcs.getTcsApplicableRates()) {
														if (CustomerTypeEnum.REGULAR.name().equals(rate.getType())) {
															populateCalculatedTcsDetails(customerTcsDetailsDto,
																	brandTcs, cashPaidDetailsDto, rate, finalValue);
															break;
														}
													}

												})));

							}
						} else {
							Optional.ofNullable(brandTcs)
									.ifPresent(brand -> Optional.ofNullable(brand.getB2c())
											.ifPresent(tcs -> tcs.getTcsApplicableRates().stream()
													.filter(applicableTcsRate -> applicableTcsRate.getType()
															.equalsIgnoreCase(customertTxnDao.get().getCustomerType())
															&& applicableTcsRate.getIsPanAvailable() == Boolean.TRUE)
													.findFirst().ifPresent(applicableTcsRate -> {
														populateCalculatedTcsDetails(customerTcsDetailsDto, brandTcs,
																cashPaidDetailsDto, applicableTcsRate, finalValue);
													})));

						}
						
						if(CustomerTypeEnum.INSTITUTIONAL.name().equals(customertTxnDao.get().getCustomerType())
								&& !StringUtils.isEmpty(customertTxnDao.get().getInstiTaxNo())){
							if(!StringUtils.isEmpty(customertTxnDao.get().getCustTaxNo())) {
							Optional.ofNullable(brandTcs)
							.ifPresent(brand -> Optional.ofNullable(brand.getB2c())
									.ifPresent(tcs -> tcs.getTcsApplicableRates().stream()
											.filter(applicableTcsRate -> applicableTcsRate.getType()
													.equalsIgnoreCase(customertTxnDao.get().getCustomerType())
													&& (applicableTcsRate.getIsPanAvailable() == Boolean.TRUE || applicableTcsRate.getIsPanAvailable() == Boolean.FALSE ))
											.findFirst().ifPresent(applicableTcsRate -> {
												populateCalculatedTcsDetails(customerTcsDetailsDto, brandTcs,
														cashPaidDetailsDto, applicableTcsRate, finalValue);
											})));
							}
							else {
								Optional.ofNullable(brandTcs)
								.ifPresent(brand -> Optional.ofNullable(brand.getB2c())
										.ifPresent(tcs -> tcs.getTcsApplicableRates().stream()
												.filter(applicableTcsRate -> applicableTcsRate.getType()
														.equalsIgnoreCase(customertTxnDao.get().getCustomerType())
														&& applicableTcsRate.getIsPanAvailable() == Boolean.FALSE)
												.findFirst().ifPresent(applicableTcsRate -> {
													populateCalculatedTcsDetails(customerTcsDetailsDto, brandTcs,
															cashPaidDetailsDto, applicableTcsRate, finalValue);
												})));
							}
							
						}
					}
				}
			});

		}

		log.info("customerTcsDetailsDto in cumulativeTcsValueCheck method is...............{}",customerTcsDetailsDto.toString());
		return customerTcsDetailsDto;
	}

	private void populateCalculatedTcsDetails(CustomerTcsDetailsDto customerTcsDetailsDto, BrandTcsDetails brandTcs,
			CashPaidDetailsDto cashPaidDetailsDto, ApplicableTcsRates applicableTcsRate,
			BigDecimal currentTxnFinalValue) {
		BigDecimal tcsApplicableAmt = cashPaidDetailsDto.getTotalCashPaid()
				.subtract(brandTcs.getB2c().getTcsApplicableAmount());
		if (tcsApplicableAmt.compareTo(BigDecimal.ZERO) > 0) {
			Optional.ofNullable(applicableTcsRate.getPercent()).ifPresent(applicableTcsPercent -> {
				customerTcsDetailsDto.setTcsPercentage(applicableTcsRate.getPercent());
				customerTcsDetailsDto.setTcsApplicableAmount(calculateTcsApplicableValue(brandTcs, cashPaidDetailsDto,
						applicableTcsRate.getPercent(), currentTxnFinalValue));
				customerTcsDetailsDto.setTcsToBeCollected(calculateTcsAmount(brandTcs, cashPaidDetailsDto,
						applicableTcsRate.getPercent(), currentTxnFinalValue));
			});
			Optional.ofNullable(brandTcs.getB2c()).ifPresent(brandB2c -> {
				customerTcsDetailsDto.setTcsEligibleAmount(brandB2c.getTcsApplicableAmount());
			});

		} else {
			customerTcsDetailsDto.setTcsPercentage(BigDecimal.ZERO);
			customerTcsDetailsDto.setTcsApplicableAmount(BigDecimal.ZERO);
		}
	}

	private BigDecimal calculateTcsAmount(BrandTcsDetails brandTcs, CashPaidDetailsDto cashPaidDetailsDto,
			BigDecimal applicableTcsRate, BigDecimal currentTxnFinalValue) {
		BigDecimal applicableTcsAmount = cashPaidDetailsDto.getTotalCashPaid()
				.subtract(brandTcs.getB2c().getTcsApplicableAmount());
		if (applicableTcsAmount.compareTo(BigDecimal.ZERO) > 0 && currentTxnFinalValue != null) {

			applicableTcsAmount = applicableTcsAmount.subtract(currentTxnFinalValue).compareTo(BigDecimal.ZERO) > 0
					? currentTxnFinalValue
					: applicableTcsAmount;
			applicableTcsAmount = applicableTcsAmount.multiply(applicableTcsRate).divide(new BigDecimal(100));
			final BigDecimal roundOfVariance = commonTransactionService.getRoundingVariance(applicableTcsAmount);
			log.info("round of varience is........................{}",roundOfVariance);
			log.info("applicableTcsAmount.add(roundOfVariance)......................{}",applicableTcsAmount.add(roundOfVariance));
			return applicableTcsAmount.add(roundOfVariance);
		}
		return BigDecimal.ZERO;
	}

	private BigDecimal calculateTcsApplicableValue(BrandTcsDetails brandTcs, CashPaidDetailsDto cashPaidDetailsDto,
			BigDecimal applicableTcsRate, BigDecimal currentTxnFinalValue) {
		BigDecimal applicableTcsAmount = cashPaidDetailsDto.getTotalCashPaid()
				.subtract(brandTcs.getB2c().getTcsApplicableAmount());
		if (applicableTcsAmount.compareTo(BigDecimal.ZERO) > 0 && currentTxnFinalValue != null) {

			applicableTcsAmount = applicableTcsAmount.subtract(currentTxnFinalValue).compareTo(BigDecimal.ZERO) > 0
					? currentTxnFinalValue
					: applicableTcsAmount;

			return applicableTcsAmount;
		}
		return BigDecimal.ZERO;
	}


	/**
	 *
	 */

	public CustomerTcsDetailsDto mapCustomerTcsDetailsDaoToDto(CustomerTcsDetailsDaoExt customerTcsDetailsDao,
			AtomicReference<BigDecimal> cummulativeCashAmount, boolean cancelled) {
		CustomerTcsDetailsDto customerTcsDetailsDto = new CustomerTcsDetailsDto();
		customerTcsDetailsDto.setSalesTxnId(customerTcsDetailsDao.getSalesTxnDao().getId());
		customerTcsDetailsDto.setLocationCode(customerTcsDetailsDao.getLocationCode());
		customerTcsDetailsDto.setCustomerMasterId(customerTcsDetailsDao.getCustomer().getId());
		customerTcsDetailsDto.setMobileNumber(customerTcsDetailsDao.getMobileNumber());
		customerTcsDetailsDto.setUlpId(customerTcsDetailsDao.getUlpId());
		customerTcsDetailsDto.setStorePan(customerTcsDetailsDao.getStorePan());
		customerTcsDetailsDto.setDocNo(customerTcsDetailsDao.getDocNo());
		customerTcsDetailsDto.setFiscalYear(customerTcsDetailsDao.getFiscalYear());
		customerTcsDetailsDto.setTransactionDate(customerTcsDetailsDao.getTransactionDate());
		Optional.ofNullable(cummulativeCashAmount.get()).ifPresent(
				amount -> cummulativeCashAmount.set(amount.add(customerTcsDetailsDao.getNetInvoiceAmount())));
		CashPaidDetailsDto cashPaidDetailsDto = new CashPaidDetailsDto();
		cashPaidDetailsDto.setTotalCashPaid(cummulativeCashAmount.get());
		customerTcsDetailsDto.setBrandCode(customerTcsDetailsDao.getBrandCode());
		customerTcsDetailsDto.setOwnerType(customerTcsDetailsDao.getOwnerType());
		customerTcsDetailsDto.setTcsApplicableAmount(customerTcsDetailsDao.getTcsApplicableAmount());
		customerTcsDetailsDto.setTcsEligibleAmount(customerTcsDetailsDao.getTcsEligibleAmount());
		customerTcsDetailsDto.setTcsPercentage(customerTcsDetailsDao.getTcsPercentage());
		customerTcsDetailsDto.setTcsCollected(customerTcsDetailsDao.getTcsAmountPaid());
		customerTcsDetailsDto.setTcsToBeCollected(customerTcsDetailsDao.getTcsAmountPaid());
		BigDecimal netInvoiceAmount = customerTcsDetailsDao.getNetInvoiceAmount();
		if (cancelled) {
			netInvoiceAmount = netInvoiceAmount.negate();
		}
		customerTcsDetailsDto.setNetInvoiceAmount(netInvoiceAmount);
		return customerTcsDetailsDto;
	}

	@Override
	public List<CashMemoDetailsDaoExt> getCashMemoDetailsIfExists(String cashMemoId,
			Boolean isPaymentForRateProtectedCNOrFromAb) {
		List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList = getCashMemoDetails(cashMemoId);

		if (cashMemoDetailsDaoList.isEmpty() && !BooleanUtils.isTrue(isPaymentForRateProtectedCNOrFromAb)) {
			throw new ServiceException(SalesConstants.NO_ITEM_FOUND_IN_THE_TRANSACTION, SalesConstants.ERR_SALE_046,
					SalesConstants.NO_ITEM_FOUND_IN_THE_TRANSACTION);
		}
		return cashMemoDetailsDaoList;
	}

	@Override
	public List<GiftDetailsDaoExt> getGiftDetailsIfExists(String cashMemoId) {
		List<GiftDetailsDaoExt> giftDetailsDaoList = giftDetailsRepository.findByCashMemoDaoId(cashMemoId);

		if (giftDetailsDaoList.isEmpty()) {
			throw new ServiceException(SalesConstants.NO_ITEM_FOUND_IN_THE_TRANSACTION, SalesConstants.ERR_SALE_046,
					SalesConstants.NO_ITEM_FOUND_IN_THE_TRANSACTION);
		}

		return giftDetailsDaoList;
	}

	/**
	 * This method will update price for all items in cash memo based on cash memo
	 * id.
	 *
	 * @param cashMemoDetailsDaoList
	 * @param salesTxnDaoExt
	 * @return CashMemoAndDetialsIdResponseDto
	 */
	@Override
	public void updateItemPriceDetails(List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList,
			SalesTxnDaoExt salesTxnDaoExt, boolean isMetalRateFreezedCN) {

		for (CashMemoDetailsDaoExt cashMemoDetailsDao : cashMemoDetailsDaoList) {

			// unit value, net value and price details
			validateItemPrice(salesTxnDaoExt, cashMemoDetailsDao, true, isMetalRateFreezedCN);
			// total tax and tax details.
			validateTaxDetails(cashMemoDetailsDao, true, false);

			// @formatter:off
			// final value = (total value + hallmark charges - (total discount + hallmark
			// discount)) + total tax(includes hallmark tax also).
			// @formatter:on
			cashMemoDetailsDao
					.setFinalValue(commonTransactionService.getItemFinalValue(cashMemoDetailsDao.getTotalValue(),
							cashMemoDetailsDao.getTotalDiscount(), cashMemoDetailsDao.getTotalTax(),
							cashMemoDetailsDao.getHallmarkCharges(), cashMemoDetailsDao.getHallmarkDiscount()));

			cashMemoDetailsDao.setSrcSyncId(cashMemoDetailsDao.getDestSyncId() + 1);

		}
		cashMemoDetailsRepository.saveAll(cashMemoDetailsDaoList);

		// for cumulative discount discount
		Map<String, List<DiscountItemDetailsDaoExt>> applicableCumulativeItemsMap = new HashMap<>();
		// Update discount details at item level
		cashMemoDetailsDaoList
				.forEach(cashMemoDetailsDao -> discountItemFacadeService.updateItemDiscounts(salesTxnDaoExt.getId(),
						salesTxnDaoExt.getTxnType(), salesTxnDaoExt.getSubTxnType(), cashMemoDetailsDao.getId(), true,
						applicableCumulativeItemsMap));
		if (!CollectionUtils.isEmpty(applicableCumulativeItemsMap)) {

			applicableCumulativeItemsMap.forEach(
					(cumulativeId, itemDiscountList) -> discountUtilService.recalculateCumulateDiscount(new HashSet<>(),
							itemDiscountList, salesTxnDaoExt, new HashSet<>(), null, true));
		}

		// update or re apportionate discount details at bill level like system
		// discounts(GHS,DV),bill level discount types
		discountFacadeService.updateTransactionLevelDiscount(salesTxnDaoExt.getId(), salesTxnDaoExt.getTxnType(),
				salesTxnDaoExt.getSubTxnType(), null, true, null, null);

	}

	@Override
	public CashMemoDaoExt updatedCashMemoHeader(CashMemoDaoExt cashMemoDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList) {

		// OC - otherCharge
		OtherChargeDetailsDto otherChargeDetailsDto = MapperUtil.mapObjToClass(cashMemoDao.getOtherCharges(),
				OtherChargeDetailsDto.class);

		BigDecimal otherCharge = BigDecimal.ZERO;
		BigDecimal otherChargeTax = BigDecimal.ZERO;

		if (!StringUtils.isEmpty(otherChargeDetailsDto) && !StringUtils.isEmpty(otherChargeDetailsDto.getData())) {
			otherCharge = otherChargeDetailsDto.getData().getValue() != null
					? otherChargeDetailsDto.getData().getValue()
					: BigDecimal.ZERO;
			otherChargeTax = otherChargeDetailsDto.getData().getTaxValue() != null
					? otherChargeDetailsDto.getData().getTaxValue()
					: BigDecimal.ZERO;
		}

		updateTotalsOfCashMemoHeader(cashMemoDao, cashMemoDetailsDaoList, otherChargeTax);

		// handle null value for tcs amount
		if (cashMemoDao.getTcsAmount() == null) {
			cashMemoDao.setTcsAmount(BigDecimal.ZERO);
		}

		// @formatter:off
		// final value = (total value + hallmark charges - (total discount + hallmark
		// discount)) + total tax(includes hallmark tax also) + OC
		// @formatter:on
		BigDecimal finalValue = cashMemoDao.getTotalValue().add(cashMemoDao.getHallmarkCharges())
				.subtract(cashMemoDao.getTotalDiscount().add(cashMemoDao.getHallmarkDiscount()))
				.add(cashMemoDao.getTotalTax()).add(otherCharge).add(cashMemoDao.getTcsAmount());
		cashMemoDao.setFinalValue(finalValue);

		// rounding off CM final value:
		BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(cashMemoDao.getFinalValue());

		// rounding variance
		cashMemoDao.setRoundingVariance(roundingVariance);
		cashMemoDao.setFinalValue(cashMemoDao.getFinalValue().add(roundingVariance));

		// if manual bill, then check if total weight and final value of CM exceeds
		// manual bill values. - check removed

		return cashMemoDao;
	}

	@Override
	public ManualBillTxnDetailsDto validateManualBillValues(CashMemoDaoExt cashMemoDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList, boolean isConfirmTxn) {

		if (!SubTxnTypeEnum.MANUAL_CM.name().equals(cashMemoDao.getSalesTxnDao().getSubTxnType())) {
			return new ManualBillTxnDetailsDto();
		}

		if (cashMemoDetailsDaoList == null) {
			cashMemoDetailsDaoList = getCashMemoDetailsByItemIdIfExists(cashMemoDao.getId(), null);
		}

		if (CollectionUtils.isEmpty(cashMemoDetailsDaoList)) {
			return new ManualBillTxnDetailsDto();
		}

		Map<String, BigDecimal> weightDetailsList = new HashMap<>();
		ManualBillTxnDetailsDto manualBillTxnDetailsDto =  MapperUtil.mapObjToClass(cashMemoDao.getSalesTxnDao().getManualBillDetails(),ManualBillTxnDetailsDto.class);
		
		BigDecimal goldWeight = BigDecimal.ZERO.setScale(DomainConstants.WEIGHT_SCALE);
		BigDecimal platinumWeight = BigDecimal.ZERO.setScale(DomainConstants.WEIGHT_SCALE);
		BigDecimal silverWeight = BigDecimal.ZERO.setScale(DomainConstants.WEIGHT_SCALE);
		
		if(BooleanUtils.isTrue(manualBillTxnDetailsDto.getManualBillDetails().getIsBimetal())) {
		for(CashMemoDetailsDaoExt record:cashMemoDetailsDaoList) {
			PriceDetailsDto priceDetails=MapperUtil.mapObjToClass(record.getPriceDetails(), PriceDetailsDto.class);
		
		
			if(priceDetails!=null && priceDetails.getMetalPriceDetails()!=null) {
				List<MetalPriceDto> metalPrices=priceDetails.getMetalPriceDetails().getMetalPrices();
				
					for(MetalPriceDto metalPrice:metalPrices){ 
						if(MetalTypeCodeEnum.J.name().equals(metalPrice.getMetalTypeCode()) && metalPrice.getNetWeight()!=null)
					{
						goldWeight=goldWeight.add(metalPrice.getNetWeight());
					}
					else if(MetalTypeCodeEnum.P.name().equals(metalPrice.getMetalTypeCode()) && metalPrice.getNetWeight()!=null)
					{
						silverWeight=silverWeight.add(metalPrice.getNetWeight());
					}
					else if(MetalTypeCodeEnum.L.name().equals(metalPrice.getMetalTypeCode()) && metalPrice.getNetWeight()!=null)
					{
						platinumWeight=platinumWeight.add(metalPrice.getNetWeight());
					}
					}
				}
		
			}
		log.debug("goldWeight : {}", goldWeight);
		log.debug("silverWeight : {}", silverWeight);
		log.debug("silverWeight : {}", silverWeight);
		weightDetailsList.put(MetalTypeCodeEnum.J.name(), goldWeight);	
		weightDetailsList.put(MetalTypeCodeEnum.P.name(), silverWeight);	
		weightDetailsList.put(MetalTypeCodeEnum.L.name(), platinumWeight);	
		
		}
		else
		{
			for (CashMemoDetailsDaoExt cMDetails : cashMemoDetailsDaoList) {
			String itemTypecode = MapperUtil.mapObjToClass(cMDetails.getPriceDetails(), PriceDetailsDto.class)
					.getItemTypeCode();
			if (weightDetailsList.containsKey(itemTypecode)) {
				weightDetailsList.put(itemTypecode,
						weightDetailsList.get(itemTypecode).add(cMDetails.getTotalWeight()));
			} else {
				weightDetailsList.put(itemTypecode, cMDetails.getTotalWeight());
			}
		
		}
		
		}
			WeightDetailsDto weightDetails = commonTransactionService
				.getTotalWeightSplitDetailsForManualBill(weightDetailsList);
		// to check total weight and final value for manual bill.
		return commonTransactionService.manualBillValuesWithHeader(cashMemoDao.getTotalWeight(),
				cashMemoDao.getFinalValue(), cashMemoDao.getSalesTxnDao(), isConfirmTxn, weightDetails);
		
	}

	private CashMemoDaoExt updateTotalsOfCashMemoHeader(CashMemoDaoExt cashMemoDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsList, BigDecimal otherChargeTax) {

		// pick other charges tax details (OC)
		TaxDetailsListDto taxDetailsListDto = new TaxDetailsListDto();

		// tax details json
		if (!StringUtil.isBlankJsonStr(cashMemoDao.getTaxDetails())) {
			taxDetailsListDto = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(cashMemoDao.getTaxDetails()), TaxDetailsListDto.class);
		}

		List<TaxCalculationResponseDto> otherChargesTaxDetails = new ArrayList<>();
		// filter to get only other charges tax jsons
		if (!CollectionUtils.isEmpty(taxDetailsListDto.getTaxes())) {
			otherChargesTaxDetails = taxDetailsListDto.getTaxes().stream()
					.filter(taxDetails -> SalesConstants.OTHER_CHARGE.equals(taxDetails.getTaxType()))
					.collect(Collectors.toList());
		}

		taxDetailsListDto
				.setTaxes(CollectionUtils.isEmpty(otherChargesTaxDetails) ? List.of() : otherChargesTaxDetails);

		// get cash memo items if not picked already.
		if (CollectionUtils.isEmpty(cashMemoDetailsList)) {
			cashMemoDetailsList = getCashMemoDetails(cashMemoDao.getId());
		}

		cashMemoDao.setTotalValue(BigDecimal.ZERO);
		cashMemoDao.setFinalValue(BigDecimal.ZERO);
		cashMemoDao.setTotalWeight(BigDecimal.ZERO);
		cashMemoDao.setTotalQuantity((short) 0);
		cashMemoDao.setTotalTax(BigDecimal.ZERO);
		cashMemoDao.setTotalDiscount(BigDecimal.ZERO);
		cashMemoDao.setHallmarkCharges(BigDecimal.ZERO);
		cashMemoDao.setHallmarkDiscount(BigDecimal.ZERO);

		List<TaxCalculationResponseDto> taxes = new ArrayList<>();
		if (!cashMemoDetailsList.isEmpty()) {
			cashMemoDetailsList.forEach(cashMemoDetails -> {

				cashMemoDao.setFinalValue(cashMemoDao.getFinalValue().add(cashMemoDetails.getFinalValue()));
				cashMemoDao.setTotalValue(cashMemoDao.getTotalValue().add(cashMemoDetails.getTotalValue()));
				cashMemoDao.setTotalWeight(cashMemoDao.getTotalWeight().add(cashMemoDetails.getTotalWeight()));
				cashMemoDao.setTotalQuantity(
						(short) (cashMemoDao.getTotalQuantity() + cashMemoDetails.getTotalQuantity()));
				cashMemoDao.setTotalTax(cashMemoDao.getTotalTax().add(cashMemoDetails.getTotalTax()));
				cashMemoDao.setTotalDiscount(cashMemoDao.getTotalDiscount().add(cashMemoDetails.getTotalDiscount()));
				// combine tax details to update header
				if (cashMemoDetails.getTaxDetails() != null && !"{}".equals(cashMemoDetails.getTaxDetails())) {
					taxes.add(MapperUtil.getObjectMapperInstance().convertValue(
							MapperUtil.getJsonFromString(cashMemoDetails.getTaxDetails()),
							TaxCalculationResponseDto.class));
				}

				// hallmark changes
				cashMemoDao
						.setHallmarkCharges(cashMemoDao.getHallmarkCharges().add(cashMemoDetails.getHallmarkCharges()));
				cashMemoDao.setHallmarkDiscount(
						cashMemoDao.getHallmarkDiscount().add(cashMemoDetails.getHallmarkDiscount()));

			});
		}

		// total tax = total item tax + other charge tax
		cashMemoDao.setTotalTax(cashMemoDao.getTotalTax().add(otherChargeTax));

		// combined tax details at header
		if (CollectionUtils.isEmpty(taxDetailsListDto.getTaxes())) {
			taxDetailsListDto.setTaxes(taxes);
		} else {
			taxDetailsListDto.getTaxes().addAll(taxes);
		}

		if (!CollectionUtils.isEmpty(taxDetailsListDto.getTaxes())) {
			cashMemoDao.setTaxDetails(MapperUtil.getStringFromJson(taxDetailsListDto));

		} else {
			cashMemoDao.setTaxDetails(null);
		}

		return cashMemoDao;
	}

	@Override
	public ItemDetailsResponseDto mapCashMemoDetailsToItemDto(CashMemoDetailsDaoExt cashMemoDetailsDao) {

		ItemDetailsResponseDto itemDetailsDto = (ItemDetailsResponseDto) MapperUtil.getObjectMapping(cashMemoDetailsDao,
				new ItemDetailsResponseDto());

		itemDetailsDto.setItemId(cashMemoDetailsDao.getId());
		itemDetailsDto.setPricingType(cashMemoDetailsDao.getPricingType());
		if (cashMemoDetailsDao.getInventoryWeightDetails() != null
				&& !"{}".equals(cashMemoDetailsDao.getInventoryWeightDetails())) {
			itemDetailsDto.setInventoryWeightDetails(
					MapperUtil.mapObjToClass(cashMemoDetailsDao.getInventoryWeightDetails(), JsonData.class));
		}
		if (cashMemoDetailsDao.getMeasuredWeightDetails() != null
				&& !"{}".equals(cashMemoDetailsDao.getMeasuredWeightDetails())) {
			itemDetailsDto.setMeasuredWeightDetails(
					MapperUtil.mapObjToClass(cashMemoDetailsDao.getMeasuredWeightDetails(), JsonData.class));
		}
		if (cashMemoDetailsDao.getTaxDetails() != null && !"{}".equals(cashMemoDetailsDao.getTaxDetails())) {
			itemDetailsDto.setTaxDetails(
					MapperUtil.mapObjToClass(cashMemoDetailsDao.getTaxDetails(), TaxCalculationResponseDto.class));
		}
		if (!StringUtil.isBlankJsonStr(cashMemoDetailsDao.getDiscountDetails())) {
			itemDetailsDto.setDiscountDetails(
					MapperUtil.mapObjToClass(cashMemoDetailsDao.getDiscountDetails(), JsonData.class));
		}
		if (!StringUtil.isBlankJsonStr(cashMemoDetailsDao.getItemDetails())) {
			JsonData jsonData = MapperUtil.mapObjToClass(cashMemoDetailsDao.getItemDetails(), JsonData.class);
			ItemInvDetailsDto inventoryDetail = JsonUtils.getValueFromJson(jsonData.getData(),
					itemDetailsDto.getInventoryId(), ItemInvDetailsDto.class);
			// ItemInvDetailsDto inventoryDetail =
			// MapperUtil.mapJsonDataToClass(cashMemoDetailsDao.getItemDetails(),ItemInvDetailsDto.class);
			Date businessDate = engineService.getBusinessDay(CommonUtil.getLocationCode()).getBusinessDate();
			if (businessDate != null && null!=inventoryDetail && inventoryDetail.getMfgDate() != null) {
				try {
					long age = ChronoUnit.DAYS.between(inventoryDetail.getMfgDate().toInstant(),
							businessDate.toInstant());
					inventoryDetail.setAge(age);
				} catch (Exception e) {
					// TODO : Need to add logger
				}
			}

			String inventoryItemDetails = MapperUtil.getJsonString(inventoryDetail);
			jsonData.setData(MapperUtil.getJsonFromString(inventoryItemDetails));

			itemDetailsDto.setItemDetails(jsonData);

		}
		if (!StringUtils.isEmpty(cashMemoDetailsDao.getOrderItem())) {
			itemDetailsDto.setOrderItemId(cashMemoDetailsDao.getOrderItem().getId());
		}

		itemDetailsDto
				.setPriceDetails(MapperUtil.mapObjToClass(cashMemoDetailsDao.getPriceDetails(), PriceDetailsDto.class));

		// PENDING: discount and foc mapping

		return itemDetailsDto;

	}

	@Override
	public void validateItemPrice(SalesTxnDaoExt salesTxnDaoExt, CashMemoDetailsDaoExt cashMemoDetailsDao,
			boolean isPriceUpdate, boolean isMetalRateFreezedCN) {

		// If Pre-order is of Frozen rate, Item price should be calculated as per Frozen
		// rate
		Boolean isFrozenRate = checkIfFrozenRatePreOrder(salesTxnDaoExt);
		OrderDaoExt orderDao = checkIfPreOrderExistsByRefTxn(salesTxnDaoExt.getRefTxnId());
		Set<String> metalToBeIgnoredForRateCheck = new HashSet<>();
		
		// ignore best metal rate for price update
		if (!isPriceUpdate) {
			metalToBeIgnoredForRateCheck = getBestRate(salesTxnDaoExt, orderDao, isPriceUpdate, false);

		}

		// hold time - pick from location
		commonTransactionService.checkMetalRate(salesTxnDaoExt, null,
				TransactionStatusEnum.valueOf(salesTxnDaoExt.getStatus()), false, getHoldTimeInMinutesForCm(),
				(isFrozenRate || (isPriceUpdate && !"82".equals(cashMemoDetailsDao.getProductGroupCode()))|| isMetalRateFreezedCN), metalToBeIgnoredForRateCheck);

		OrdersPriceRequest ordersPriceRequest = new OrdersPriceRequest();
		ordersPriceRequest.setCheckInventory(true);
		ordersPriceRequest.setItemCode(cashMemoDetailsDao.getItemCode());
		ordersPriceRequest.setLotNumber(cashMemoDetailsDao.getLotNumber());
		ordersPriceRequest.setInventoryId(cashMemoDetailsDao.getInventoryId());
		ordersPriceRequest.setMeasuredQuantity(cashMemoDetailsDao.getTotalQuantity());
		ordersPriceRequest.setMeasuredWeight(cashMemoDetailsDao.getTotalWeight());
		ordersPriceRequest.setStandardPrice(commonTransactionService
				.mapMetalRateJsonToDto(cashMemoDetailsDao.getCashMemoDao().getSalesTxnDao().getMetalRateDetails())
				.getMetalRates());

		PriceResponseDto priceResponseDto = null;
		boolean isProductFound = true;
		try {
			// if AB converted to CM and bin is 'RESERVEBIN'
			if (salesTxnDaoExt.getRefTxnId() != null
					&& CommonConstants.BIN_GROUP_RESERVE_BIN.equals(cashMemoDetailsDao.getBinGroupCode()) ) {
				priceResponseDto = getOrderItemPriceDetails(salesTxnDaoExt, ordersPriceRequest,
						cashMemoDetailsDao.getBinGroupCode(), null, cashMemoDetailsDao.getProductGroupCode());
			} else {
				priceResponseDto = engineService.getPriceDetails(ordersPriceRequest);
			}
			// if UCP item, then get tax % and reverse calculate to get original price
			checkUcpItemToGetOriginalPrice(salesTxnDaoExt, cashMemoDetailsDao, priceResponseDto);

		} catch (ServiceException e) {
			isProductFound = handleProductNotfoundException(isPriceUpdate, e);
		}
		commonTransactionService.manualCmOrAbCheck(salesTxnDaoExt, priceResponseDto.getPriceDetails().getItemTypeCode());
		// set item in stock
		cashMemoDetailsDao.setItemInStock(isProductFound);
		cashMemoDetailsDao.setPricingType(priceResponseDto.getPricingType());

		if (isPriceUpdate && isProductFound) {
			// set unit value on price update
			// unit value = (final value from Price engine) / total quantity
			cashMemoDetailsDao.setUnitValue(
					priceResponseDto.getFinalValue().divide(BigDecimal.valueOf(cashMemoDetailsDao.getTotalQuantity()),
							DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
			// total value = final value from price engine
			cashMemoDetailsDao.setTotalValue(priceResponseDto.getFinalValue());
			cashMemoDetailsDao.setFinalValue(priceResponseDto.getFinalValue().add(cashMemoDetailsDao.getTotalTax()));

			// if price update/AB to CM/CO to CM - then explicitly set 'hallmarkCharges' &
			// 'hallmarkDiscount'.
			cashMemoDetailsDao.setHallmarkCharges(
					priceResponseDto.getPriceDetails().getItemHallmarkDetails().getHallmarkingCharges() == null
							? BigDecimal.ZERO
							: priceResponseDto.getPriceDetails().getItemHallmarkDetails().getHallmarkingCharges());
			cashMemoDetailsDao.setHallmarkDiscount(BooleanUtils
					.isTrue(priceResponseDto.getPriceDetails().getItemHallmarkDetails().getIsFOCForHallmarkingCharges())
							? priceResponseDto.getPriceDetails().getItemHallmarkDetails().getHallmarkingCharges()
							: BigDecimal.ZERO);
		} else if (checkForPrice(cashMemoDetailsDao, isPriceUpdate, priceResponseDto)) {
			// total value must match finalValue from price engine. or
			// check: unit value = total value / total quantity
			log.info("Input val: " + cashMemoDetailsDao.getTotalValue() + ", Cal val: "
					+ priceResponseDto.getFinalValue());
			throw new ServiceException(SalesConstants.PRICE_MISMATCH, SalesConstants.ERR_SALE_044,
					"Price miss match for field: unitValue or totalValue");

		}

		if (isProductFound) {

			commonTransactionService.hallmarkValuesValidation(priceResponseDto, cashMemoDetailsDao.getHallmarkCharges(),
					cashMemoDetailsDao.getHallmarkDiscount());
			cashMemoDetailsDao.setPriceDetails(MapperUtil.getStringFromJson(priceResponseDto.getPriceDetails()));
		}
	}

	private boolean checkForPrice(CashMemoDetailsDaoExt cashMemoDetailsDao, boolean isPriceUpdate,
			PriceResponseDto priceResponseDto) {
		return !isPriceUpdate
				&& ((cashMemoDetailsDao.getTotalValue().compareTo(priceResponseDto.getFinalValue()) != 0)
						|| (cashMemoDetailsDao.getUnitValue()
								.compareTo(priceResponseDto.getFinalValue().divide(
										BigDecimal.valueOf(cashMemoDetailsDao.getTotalQuantity()),
										DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP)) != 0));
	}

	private void checkUcpItemToGetOriginalPrice(SalesTxnDaoExt salesTxnDaoExt, CashMemoDetailsDaoExt cashMemoDetailsDao,
			PriceResponseDto priceResponseDto) {

		if (BooleanUtils.isNotTrue(priceResponseDto.getPriceDetails().getIsUcp())) {
			return;
		}
		// if UCP item, then get tax % and reverse calculate to get original price
		TotalTaxAndTaxDetailsDto reverseTaxDetails = commonTransactionService.reverseTotalTaxDetails(
				salesTxnDaoExt.getCustomerId(), cashMemoDetailsDao.getItemCode(), priceResponseDto.getFinalValue(),
				TxnTaxTypeEnum.CUST_TRANSACTION_CM,
				!StringUtils.isEmpty(cashMemoDetailsDao.getTaxDetails())
						? MapperUtil.mapObjToClass(cashMemoDetailsDao.getTaxDetails(), TaxCalculationResponseDto.class)
						: null);
		// recalculated totalValue
		priceResponseDto.setFinalValue(reverseTaxDetails.getFinalValue());
		cashMemoDetailsDao.setTaxDetails(MapperUtil.getStringFromJson(reverseTaxDetails.getTaxDetails()));

	}

	/**
	 * @param isPriceUpdate
	 * @param isProductFound
	 * @param e
	 * @return
	 */
	private boolean handleProductNotfoundException(boolean isPriceUpdate, ServiceException e) {
		// product not found in inventory - ERR-PRO-002
		// OR
		// Item is out of stock in inventory - ERR-INV-030
		// both errors tells that item is out of stock in inventory
		boolean isProductFound = true;
		if ("ERR-PRO-002".equals(e.getErrorCode()) || "ERR-INV-030".equals(e.getErrorCode())) {
			isProductFound = false;
			// ignore error iff it's price update.
			if (!isPriceUpdate) {
				throw e;
			}
		} else {
			// if error is not 'product not found in inventory', then throw error.
			throw e;
		}
		return isProductFound;
	}

	// Method to verify, if pre-order is of Frozen rate
	@Override
	public Boolean checkIfFrozenRatePreOrder(SalesTxnDaoExt salesTxnDaoExt) {
		Boolean isFrozenRate = false;
		OrderDaoExt orderDao = checkIfPreOrderExistsByRefTxn(salesTxnDaoExt.getRefTxnId());
		if (!StringUtils.isEmpty(orderDao) && BooleanUtils.isTrue(orderDao.getIsFrozenRate()))
			isFrozenRate = true;

		return isFrozenRate;
	}

	@Override
	public void validateTaxDetails(CashMemoDetailsDaoExt cashMemoDetailsDao, boolean isPriceUpdate,
			boolean isTaxUpdate) {

		// ignore if customer is not selected - not to be ignored, as tax API will get
		// tax based on location's state code

		// NOTE: tax to be calculated on (totalValue - totalDiscount) and tax on
		// hallmark will be calculated on hallmark charges
		PriceDetailsDto priceDetails = MapperUtil.mapObjToClass(cashMemoDetailsDao.getPriceDetails(),
				PriceDetailsDto.class);
		HallmarkGstRequestDto hallmarkGstRequestDto = new HallmarkGstRequestDto(cashMemoDetailsDao.getHallmarkCharges(),
				cashMemoDetailsDao.getHallmarkDiscount(),
				priceDetails.getItemHallmarkDetails() != null
						? priceDetails.getItemHallmarkDetails().getHallmarkGstPct()
						: null);
		TotalTaxAndTaxDetailsDto totalTaxAndTaxDetailsDto = null;
		if (!ObjectUtils.isEmpty(cashMemoDetailsDao.getCashMemoDao().getIsIGST())) {
			// if only tax update, then not to pass tax details.
//			totalTaxAndTaxDetailsDto = commonTransactionService.getTotalTaxDetails(
//					cashMemoDetailsDao.getCashMemoDao().getSalesTxnDao().getCustomerId(),
//					cashMemoDetailsDao.getItemCode(), cashMemoDetailsDao.getTotalValue(),
//					cashMemoDetailsDao.getTotalDiscount(), TxnTaxTypeEnum.CUST_TRANSACTION_CM,
//					((isTaxUpdate) || !StringUtils.isEmpty(cashMemoDetailsDao.getTaxDetails())) ? MapperUtil
//							.mapObjToClass(cashMemoDetailsDao.getTaxDetails(), TaxCalculationResponseDto.class) : null,
//					hallmarkGstRequestDto, cashMemoDetailsDao.getCashMemoDao().getIsIGST());
//				cashMemoDetailsDao.getHallmarkDiscount(), priceDetails.getItemHallmarkDetails().getHallmarkGstPct());
//
//		// if only tax update, then not to pass tax details.
		totalTaxAndTaxDetailsDto = commonTransactionService.getTotalTaxDetails(
				cashMemoDetailsDao.getCashMemoDao().getSalesTxnDao().getCustomerId(), cashMemoDetailsDao.getItemCode(),
				cashMemoDetailsDao.getTotalValue(), cashMemoDetailsDao.getTotalDiscount(),
				TxnTaxTypeEnum.CUST_TRANSACTION_CM,
				((isTaxUpdate) || StringUtils.isEmpty(cashMemoDetailsDao.getTaxDetails()))
						? null
						: MapperUtil.mapObjToClass(cashMemoDetailsDao.getTaxDetails(), TaxCalculationResponseDto.class),
				hallmarkGstRequestDto, cashMemoDetailsDao.getCashMemoDao().getIsIGST());

		} else {
			// if only tax update, then not to pass tax details.
			totalTaxAndTaxDetailsDto = commonTransactionService.getTotalTaxDetails(
					cashMemoDetailsDao.getCashMemoDao().getSalesTxnDao().getCustomerId(),
					cashMemoDetailsDao.getItemCode(), cashMemoDetailsDao.getTotalValue(),
					cashMemoDetailsDao.getTotalDiscount(), TxnTaxTypeEnum.CUST_TRANSACTION_CM,
					((isTaxUpdate) || StringUtils.isEmpty(cashMemoDetailsDao.getTaxDetails())) ? null:MapperUtil
							.mapObjToClass(cashMemoDetailsDao.getTaxDetails(), TaxCalculationResponseDto.class),
					hallmarkGstRequestDto);
		}
		if (totalTaxAndTaxDetailsDto.getTotalTax().compareTo(cashMemoDetailsDao.getTotalTax()) != 0) {
			if (isPriceUpdate) {
				cashMemoDetailsDao.setTotalTax(totalTaxAndTaxDetailsDto.getTotalTax());
			} else {
				throw new ServiceException(SalesConstants.INVALID_TAX_VALUE, SalesConstants.ERR_SALE_005,
						"Invaid tax value. Expected value :" + totalTaxAndTaxDetailsDto.getTotalTax() + ", Found: "
								+ cashMemoDetailsDao.getTotalTax());
			}
		}

		// map tax details to json.
		cashMemoDetailsDao.setTaxDetails(MapperUtil.getStringFromJson(totalTaxAndTaxDetailsDto.getTaxDetails()));

	}

	@Override
	public void updateTaxDetails(List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList) {

		for (CashMemoDetailsDaoExt cashMemoDetailsDao : cashMemoDetailsDaoList) {
			// total tax and tax details.
			validateTaxDetails(cashMemoDetailsDao, true, true);

			// @formatter:off
			// final value = (total value + hallmark charges - (total discount + hallmark
			// discount)) + total tax(includes hallmark tax also).
			// @formatter:on
			cashMemoDetailsDao
					.setFinalValue(commonTransactionService.getItemFinalValue(cashMemoDetailsDao.getTotalValue(),
							cashMemoDetailsDao.getTotalDiscount(), cashMemoDetailsDao.getTotalTax(),
							cashMemoDetailsDao.getHallmarkCharges(), cashMemoDetailsDao.getHallmarkDiscount()));

		}

	}

	@Override
	public CashMemoDaoExt checkIfCashMemoExistsById(String id) {
		Optional<CashMemoDaoExt> cashMemoDao = cashMemoRepository.findById(id);

		if (!cashMemoDao.isPresent()) {
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					INVALID_CM_ID + id, Map.of("type", CASH_MEMO));
		}

		return cashMemoDao.get();

	}

	@Override
	public OrderDaoExt checkIfPreOrderExistsByRefTxn(SalesTxnDaoExt refTxn) {

		if (StringUtils.isEmpty(refTxn) || (!StringUtils.isEmpty(refTxn.getTxnType())
				&& !refTxn.getTxnType().equalsIgnoreCase(TransactionTypeEnum.AB.name()))) {
			return null;
		}
		Optional<OrderDaoExt> orderDao = orderRepositoryExt.findById(refTxn.getId());

		if (!orderDao.isPresent()) {
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					"Pre order data not found for id: " + refTxn.getId(), Map.of("type", "order"));
		}

		return orderDao.get();
	}

	// If billing against pre-order, Update item price or Add new item should be
	// restricted for Frozen orders

	@Override
	public void validatePreOrderDetailsIfExists(CashMemoDaoExt cashMemoDao) {

		if (!StringUtils.isEmpty(cashMemoDao.getSalesTxnDao().getRefTxnId())
				&& !StringUtils.isEmpty(cashMemoDao.getSalesTxnDao().getRefTxnId().getId())) {
			Optional<OrderDaoExt> orderDao = orderRepositoryExt
					.findById(cashMemoDao.getSalesTxnDao().getRefTxnId().getId());

			if (!orderDao.isPresent()) {
				throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
						"Pre Order data not found for id: " + cashMemoDao.getSalesTxnDao().getRefTxnId().getId(),
						Map.of("type", "order"));
			}

			// Validate tolerance of ordered item weight w.r.t delivered item weight for
			// Frozen & Best gold rate orders
			validateOrderToCMWeightTolerance(cashMemoDao, orderDao.get());

		}
	}

	// Method to validate weight tolerance of ordered items
	private void validateOrderToCMWeightTolerance(CashMemoDaoExt cashMemoDao, OrderDaoExt orderDao) {
		// get cash memo items if exists.
		List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList = getCashMemoDetails(cashMemoDao.getId());

		// Sum up all the Billed items splitted weight details
		Map<String, WeightDetailsAndQtyDto> cmWeightDetailsList = cashMemoDetailsDaoList.stream()
				.collect(Collectors.toMap(CashMemoDetailsDaoExt::getId,
						cMDetails -> new WeightDetailsAndQtyDto(cMDetails.getMeasuredWeightDetails(),
								cMDetails.getTotalQuantity())));

		// Total delivered weight details of current Cash memo
		WeightDetailsDto totalDeliveredWeightDetails = commonTransactionService
				.getTotalWeightSplitDetails(cmWeightDetailsList);

		// If any items previously delivered , In case of partial invoice
		if (!StringUtil.isBlankJsonStr(orderDao.getDeliveredWeightDetails())) {

			List<String> totalDeliveredWeightList = new ArrayList<>();
			totalDeliveredWeightList
					.add(MapperUtil.getStringFromJson(new JsonData("WEIGHT_DETAILS", totalDeliveredWeightDetails)));

			// Sum up the previously delivered weights with the current item weights
			totalDeliveredWeightList.add(orderDao.getDeliveredWeightDetails());

			// Sum up previously delivered weight with current delivered weight
			totalDeliveredWeightDetails = commonTransactionService.sumUpWeightDetails(totalDeliveredWeightList);

		}

		log.info("Order Weight Details: {}", orderDao.getOrderWeightDetails());
		log.info("Total delivered weight details - {}", totalDeliveredWeightDetails);
		JsonData jsonData = MapperUtil.mapObjToClass(orderDao.getOrderWeightDetails(), JsonData.class);
		WeightDetailsDto totalOrderedWeightDetails = MapperUtil.mapObjToClass(jsonData.getData(),
				WeightDetailsDto.class);

		if (BooleanUtils.isTrue(orderDao.getIsFrozenRate())) {

			log.info("Frozen weight tolerance validation: - {}", orderDao);
			orderUtilServiceImpl.validateToleranceConfig(totalDeliveredWeightDetails, totalOrderedWeightDetails,
					RuleTypeEnum.ORDER_AB_FROZEN_TOLERANCE.name(), RangeTypeEnum.ORDER_TOTAL_WEIGHT.name());
		} else if (BooleanUtils.isTrue(orderDao.getIsBestRate())) {

			log.info("Best rate weight tolerance validation: - {}", orderDao);
			orderUtilServiceImpl.validateToleranceConfig(totalDeliveredWeightDetails, totalOrderedWeightDetails,
					RuleTypeEnum.BGR_TOLERANCE_CONFIG.name(), RangeTypeEnum.BGR_WEIGHT_TOLERANCE.name());
		}
	}

	@Override
	public void checkIfItemIsAlreadyAdded(Short totalInventoryQuantity, CashMemoDetailsDaoExt cashMemoDetailsDao) {

		// check if item is already added in any transaction where status is HOLD or if
		// item is already added to current CM.
		List<CashMemoDetailsDaoExt> cashMemoDetailsList = cashMemoDetailsRepository
				.listByIdNotInAndItemCodeAndDocDateAndInventoryIdAndStatusandLocationCode(cashMemoDetailsDao.getId(),
						businessDayService.getBusinessDay().getBusinessDate(), cashMemoDetailsDao.getItemCode(),
						cashMemoDetailsDao.getInventoryId(), List.of(TransactionStatusEnum.HOLD.name()),
						CommonUtil.getLocationCode(), cashMemoDetailsDao.getCashMemoDao().getId());

		// if not found, then return
		if (cashMemoDetailsList.isEmpty()) {
			return;
		}

		// if found check for total quantity
		int totalQuantityInAdded = cashMemoDetailsDao.getTotalQuantity();
		for (CashMemoDetailsDaoExt cashMemoDetail : cashMemoDetailsList) {
			totalQuantityInAdded = totalQuantityInAdded + cashMemoDetail.getTotalQuantity();
		}

		// if total quantity is more than quantity available in inventory, then throw
		// error.
		if (totalQuantityInAdded > totalInventoryQuantity) {
			List<ExistingItemDetailsDto> existingItemDetailsDtoList = new ArrayList<>();

			cashMemoDetailsList.forEach(cashMemoDetail -> {
				ExistingItemDetailsDto existingItemDetailsDto = new ExistingItemDetailsDto();

				existingItemDetailsDto.setItemId(cashMemoDetail.getId());
				existingItemDetailsDto.setItemCode(cashMemoDetail.getItemCode());
				existingItemDetailsDto.setLotNumber(cashMemoDetail.getLotNumber());
				existingItemDetailsDto.setInventoryId(cashMemoDetail.getInventoryId());
				existingItemDetailsDto.setDocNo(cashMemoDetail.getCashMemoDao().getSalesTxnDao().getDocNo());
				existingItemDetailsDto.setTxnType(cashMemoDetail.getCashMemoDao().getSalesTxnDao().getTxnType());
				existingItemDetailsDto.setSubTxnType(cashMemoDetail.getCashMemoDao().getSalesTxnDao().getSubTxnType());
				existingItemDetailsDto.setId(cashMemoDetail.getCashMemoDao().getId());
				existingItemDetailsDto.setStatus(cashMemoDetail.getCashMemoDao().getSalesTxnDao().getStatus());

				existingItemDetailsDtoList.add(existingItemDetailsDto);
			});

			throw new ServiceException(
					SalesConstants.ITEM_IS_ALREADY_ADDED_IN_DYNAMIC_TRANSACTIONTYPE_DYNAMIC_TASKTYPE_TASK_NUMBER_DYNAMIC_DOCNO,
					SalesConstants.ERR_SALE_089, "Item is already added in: " + existingItemDetailsDtoList,
					Map.of("transactionType", existingItemDetailsDtoList.get(0).getTxnType(), "taskType",
							existingItemDetailsDtoList.get(0).getStatus(), "docNo",
							existingItemDetailsDtoList.get(0).getDocNo().toString()));
		}

	}

	@Override
	public void validateQuantityAndWeight(CashMemoDetailsDaoExt cashMemoDetailsDao, String pricingType) {
		String measuredWeightDetails = "";

		if (cashMemoDetailsDao.getTotalQuantity() > 1) {
			BigDecimal weight = cashMemoDetailsDao.getTotalWeight().divide(
					BigDecimal.valueOf(cashMemoDetailsDao.getTotalQuantity()), DomainConstants.WEIGHT_SCALE,
					RoundingMode.HALF_UP);

			// compare inventory unit weight with totalWeight/totalQuantity
			if (cashMemoDetailsDao.getInventoryWeight().compareTo(weight) != 0) {
				throw new ServiceException(SalesConstants.WEIGHT_CANNOT_BE_CHANGED_IF_QUANTITY_IS_MORE_THAN_1,
						SalesConstants.ERR_SALE_007, "Weight cannot be edited if quantity is more than 1.");
			}

		} else if (cashMemoDetailsDao.getInventoryWeight().compareTo(cashMemoDetailsDao.getTotalWeight()) != 0) {

			// for UCP products or coins weight edit is not allowed
			if (pricingType != null && "UCP".equals(pricingType)
					|| SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(cashMemoDetailsDao.getProductGroupCode())) {
				throw new ServiceException(SalesConstants.WEIGHT_CANNOT_BE_EDITED, SalesConstants.ERR_SALE_127,
						"Weight cannot be edited for UCP products/coins. Product group: "
								+ cashMemoDetailsDao.getProductGroupCode());
			}
			// check inv std weight to know if weight can be changed in CM.
			if (cashMemoDetailsDao.getInventoryStdWeight().compareTo(cashMemoDetailsDao.getInventoryWeight()) != 0) {
				LocationCashMemoDetailsDto locationCashMemoDetailsDto = getCmDetailsFromLocation();

				if (!BooleanUtils.isTrue(locationCashMemoDetailsDto.getIsEditWeightAllowed())) {
					throw new ServiceException(SalesConstants.WEIGHT_CANNOT_BE_EDITED, SalesConstants.ERR_SALE_127,
							"Weight cannot be edited if as it is already edited in inventory.");
				}
			}

			// if weight is edited, then check reason and remarks mandatory.
			checkWeightEditReason(cashMemoDetailsDao);

			// check weight tolerance. - not required, as price details API does it.
			// get measured weight details if present.
			measuredWeightDetails = WeightCalculatorUtil.calculateWeightDetails(cashMemoDetailsDao.getInventoryWeight(),
					cashMemoDetailsDao.getInventoryWeightDetails(), cashMemoDetailsDao.getTotalWeight());
		}

		// set measured weight details
		cashMemoDetailsDao.setMeasuredWeightDetails(
				StringUtils.isEmpty(measuredWeightDetails) ? cashMemoDetailsDao.getInventoryWeightDetails()
						: measuredWeightDetails);

	}

	/**
	 * @param cashMemoDetailsDao
	 */
	private void checkWeightEditReason(CashMemoDetailsDaoExt cashMemoDetailsDao) {
		// if weight is edited, then check reason and remarks mandatory.
		// UAT defect 1359 : defect not mandatory, hence removing the check

		if (StringUtils.isEmpty(cashMemoDetailsDao.getReason())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Reason is mandatory for weight edit.");
		}
	}

	@Override
	public LocationCashMemoDetailsDto getCmDetailsFromLocation() {
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		LocationCashMemoDetailsDto locationCashMemoDetailsDto;

		if (!StringUtils.isEmpty(locationCacheDto.getCmDetails())) {

			locationCashMemoDetailsDto = locationCacheDto.getCmDetails();
			if (StringUtils.isEmpty(locationCashMemoDetailsDto)) {
				throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
						SalesConstants.ERR_SALE_023,
						"CM details not found for location: " + CommonUtil.getLocationCode());
			}
		} else {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023, "CM details not found for location: " + CommonUtil.getLocationCode());
		}

		return locationCashMemoDetailsDto;
	}

	@Override
	public void checkIfFocAdded(SalesTxnDaoExt salesTxnDao, boolean isHoldCheck, String errorMessage) {
		FocSchemesDaoExt focSchemesDao = new FocSchemesDaoExt();
		focSchemesDao.setSalesTxn(salesTxnDao);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<FocSchemesDaoExt> example = Example.of(focSchemesDao, matcher);
		if (focSchemesRepository.exists(example)) {
			if (isHoldCheck) {
				throw new ServiceException(REMOVE_FOC_ITEM_TO_PUT_THE_CM_ON_HOLD, ERR_SALE_012,
						"Remove FOC items to put Cash Memo on HOLD.");
			} else {
				throw new ServiceException(SalesConstants.INVALID_REQUEST + errorMessage, SalesConstants.ERR_SALE_294,
						Map.of(SalesConstants.REMARKS, errorMessage));
			}
		}

	}

	@Override
	public void checkIfItemsInStock(List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList) {
		// if list is not empty
		if (!CollectionUtils.isEmpty(cashMemoDetailsDaoList)) {
			List<String> cmDetailsIdList = new ArrayList<>();
			// check if items are in stock. If not collect the items which are not in stock.
			cashMemoDetailsDaoList.forEach(cashMemoDetailsDao -> {
				if (BooleanUtils.isFalse(cashMemoDetailsDao.getItemInStock())) {
					cmDetailsIdList.add(cashMemoDetailsDao.getId());
				}
			});

			if (!CollectionUtils.isEmpty(cmDetailsIdList)) {
				throw new ServiceException(
						SalesConstants.SOME_ITEMS_IN_THE_TRANSACTION_ARE_OUT_OF_STOCK_KINDLY_DELETE_THEM,
						SalesConstants.ERR_SALE_103, cmDetailsIdList);// do not comment, as list is used by UI
			}
		}

	}

	@Override
	public BigDecimal getHoldTimeInMinutesForCm() {

		LocationCashMemoDetailsDto locationCmDetails = getCmDetailsFromLocation();

		if (StringUtils.isEmpty(locationCmDetails.getCmHoldTimeInMinutes())) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Configuration not present for 'cmHoldTimeInMinutes' field under CM details for location: "
							+ CommonUtil.getLocationCode());
		}
		return new BigDecimal(locationCmDetails.getCmHoldTimeInMinutes());
	}

	private SalesTxnDaoExt getSalesTxnByIdWithNullCheck(String txnId) {

		Optional<SalesTxnDaoExt> sts = salesTxnRepo.findById(txnId);

		if (!sts.isPresent())
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					INVALID_CM_ID + txnId, Map.of("type", CASH_MEMO));

		return sts.get();

	}

	@Override
	public ReturnSalesTxnDto getSalesPrintInfo(String txnId) {

		SalesTxnDaoExt salesTxn = getSalesTxnByIdWithNullCheck(txnId);

		ReturnSalesTxnDto st = (ReturnSalesTxnDto) MapperUtil.getDtoMapping(salesTxn, ReturnSalesTxnDto.class);
		st.setDocDateStr(CalendarUtils.formatToPrintableDate(st.getDocDate()));

		List<CreditNoteDaoExt> cnList = creditNoteRepo.findBySalesTxnId(salesTxn.getId());
		if (CollectionUtil.isNotEmpty(cnList)) {
			st.setCnDocNo(cnList.get(0).getDocNo());
		} else {

			// TEMP as GEP not creating CN TODO
			st.setCnDocNo(0);
		}
		return st;
	}

	private BGRConfigDetails getBGRConfig(OrderDaoExt orderDao, String locationCode) {

		// BGR offer date configuration validations
		RuleRequestListDto ruleRequestDto = new RuleRequestListDto();
		ruleRequestDto.setLocationCode(locationCode);

		BGRConfigDetails bGRConfigDetails = null;

		// temp: for old ABs. Later remove if part
		if (StringUtil.isBlankJsonStr(orderDao.getBestRateConfigDetails())) {
			// Call to engine api to get Configured values
			Object ruleFieldValues = engineService.getRuleFieldValues(RuleTypeEnum.ORDER_AB_BGR_CONFIG, ruleRequestDto);
			bGRConfigDetails = MapperUtil.mapObjToClass(ruleFieldValues, BGRConfigDetails.class);
		} else {
			JsonData jsonData = MapperUtil.mapObjToClass(orderDao.getBestRateConfigDetails(), JsonData.class);
			bGRConfigDetails = MapperUtil.mapObjToClass(jsonData.getData(), BGRConfigDetails.class);
		}

		return bGRConfigDetails;
	}

	@Override
	public Set<String> getBestRate(SalesTxnDaoExt salesTxnDaoExt, OrderDaoExt orderDao, boolean isPriceUpdate,
			boolean isHeaderCheck) {

		Set<String> metalsToBeIgnoredForRateCheck = new HashSet<>();
		boolean isDownSizeCheck = false;
		String metalType = MetalTypeCodeEnum.J.name();
		String locationCode = CommonUtil.getLocationCode();

		// if not AB to CM conversion or not isBestRate, then return
		if (StringUtils.isEmpty(orderDao) || !BooleanUtils.isTrue(orderDao.getIsBestRate())) {
			return metalsToBeIgnoredForRateCheck;
		}

		// get metal rate
		MetalRateListDto savedMetalRate = commonTransactionService
				.mapMetalRateJsonToDto(salesTxnDaoExt.getMetalRateDetails());
		MetalRateListDto currentMetalRate;
		// if within hold time and transaction is on 'HOLD',
		// then consider saved metal rate(return all metal types if ignoring).
		// if not in hold time then consider current metal rate.
		if (TransactionStatusEnum.HOLD.name().equals(salesTxnDaoExt.getStatus())
				&& commonTransactionService.holdTimeCheck(salesTxnDaoExt, getHoldTimeInMinutesForCm())) {
			// if within hold time, then previous BGR would be valid, hence return.
			return savedMetalRate.getMetalRates().keySet();
		} else {
			currentMetalRate = commonTransactionService.getMetalRate();
		}
		// currently checked only for metal type = 'J' (Gold)
		BGRConfigDetails bGRConfigDetails = getBGRConfig(orderDao, locationCode);

		MetalRateListDto metalRateToBeConsidered = new MetalRateListDto(Map.of());
		MetalRateListDto orderMetalRate = commonTransactionService
				.mapMetalRateJsonToDto(orderDao.getSalesTxn().getMetalRateDetails());

		// ignore time component from current date
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();

		if (businessDate.compareTo(bGRConfigDetails.getRedemptionPeriodFromDate()) >= 0
				&& businessDate.compareTo(bGRConfigDetails.getRedemptionPeriodToDate()) <= 0) {

			metalRateToBeConsidered = getBGRWithInOffer(orderMetalRate, currentMetalRate, metalType);
			// downSizeAmount check
			isDownSizeCheck = true;

		} else {
			metalRateToBeConsidered = getBestRateByApplicableDate(orderMetalRate, bGRConfigDetails,
					metalRateToBeConsidered, metalType, locationCode);
		}
		// check if gold rate is present
		if (metalRateToBeConsidered.getMetalRates().get(metalType) == null) {
			throw new ServiceException(SalesConstants.RATE_NOT_FOUND_FOR_REQUIRED_METAL, SalesConstants.ERR_SALE_083,
					"Rate not set today for metal(s) - " + metalType);
		} else {
			// set metal that should be ignored for metal rate check.
			metalsToBeIgnoredForRateCheck.add(metalType);
		}

		// if order metal rate - metal rate is less than downSideRate, then
		// order metal rate - downSizeRate to be considered for calculation.
		if (isDownSizeCheck && (bGRConfigDetails.getDownSideAmount()
				.compareTo(orderMetalRate.getMetalRates().get(metalType).getRatePerUnit()
						.subtract(metalRateToBeConsidered.getMetalRates().get(metalType).getRatePerUnit())) < 0)) {

			metalRateToBeConsidered.getMetalRates().get(metalType).setRatePerUnit(orderMetalRate.getMetalRates()
					.get(metalType).getRatePerUnit().subtract(bGRConfigDetails.getDownSideAmount()));
		}

		validateBGR(salesTxnDaoExt, isPriceUpdate, savedMetalRate, currentMetalRate, metalRateToBeConsidered,
				metalType);

		return metalsToBeIgnoredForRateCheck;
	}

	/**
	 * This method will validate the best gold rate picked.
	 * 
	 * @param salesTxnDaoExt
	 * @param isPriceUpdate
	 * @param savedMetalRate
	 * @param currentMetalRate
	 * @param metalRateToBeConsidered
	 */
	private void validateBGR(SalesTxnDaoExt salesTxnDaoExt, boolean isPriceUpdate, MetalRateListDto savedMetalRate,
			MetalRateListDto currentMetalRate, MetalRateListDto metalRateToBeConsidered, String metalType) {

		if (isPriceUpdate) {
			// update saved rates for other metals.
			savedMetalRate = currentMetalRate;

			// set best gold rate
			savedMetalRate.getMetalRates().put(metalType, metalRateToBeConsidered.getMetalRates().get(metalType));

			// update metal rate for current transaction
			salesTxnDaoExt.setMetalRateDetails(MapperUtil.getStringFromJson(savedMetalRate));

		} else if (!savedMetalRate.getMetalRates().get(metalType)
				.equals(metalRateToBeConsidered.getMetalRates().get(metalType))) {
			// if metal rates are different, then throw error
			throw new ServiceException(SalesConstants.METAL_PRICE_CHANGED, SalesConstants.ERR_SALE_008,
					"Metal rate changed, please update item price.");
		}

	}

	/**
	 * @param orderMetalRate
	 * @param currentMetalRate
	 * @return
	 */
	private MetalRateListDto getBGRWithInOffer(MetalRateListDto orderMetalRate, MetalRateListDto currentMetalRate,
			String metalType) {
		MetalRateListDto metalRateToBeConsidered;

		// pick the rate which is less
		StandardPriceResponseDto stdGoldPrice = (currentMetalRate.getMetalRates().containsKey(metalType)
				&& orderMetalRate.getMetalRates().containsKey(metalType))
				&& (currentMetalRate.getMetalRates().get(metalType).getRatePerUnit()
						.compareTo(orderMetalRate.getMetalRates().get(metalType).getRatePerUnit()) < 0)
								? currentMetalRate.getMetalRates().get(metalType)
								: orderMetalRate.getMetalRates().get(metalType);

		metalRateToBeConsidered = new MetalRateListDto(Map.of(metalType, stdGoldPrice));
		return metalRateToBeConsidered;
	}

	/**
	 * @param orderMetalRate
	 * @param bGRConfigDetails
	 * @param metalRateToBeConsidered
	 * @return
	 */
	private MetalRateListDto getBestRateByApplicableDate(MetalRateListDto orderMetalRate,
			BGRConfigDetails bGRConfigDetails, MetalRateListDto metalRateToBeConsidered, String metalType,
			String locationCode) {
		if (BGRApplicableDateEnum.BOOKING_DATE.equals(bGRConfigDetails.getApplicableRateDate())) {
			// doubt: again comparison to be done?
			// set AB metal rate to current metal rate
			metalRateToBeConsidered = orderMetalRate;

		} else if (BGRApplicableDateEnum.CURRENT_DATE.equals(bGRConfigDetails.getApplicableRateDate())) {
			// doubt: again comparison to be done?

			// set current metal rate
			metalRateToBeConsidered = commonTransactionService.getMetalRate();

		} else if (BGRApplicableDateEnum.PARTICULAR_DATE.equals(bGRConfigDetails.getApplicableRateDate())) {
			// doubt: again comparison to be done?

			if (bGRConfigDetails.getOtherDetails() == null
					|| bGRConfigDetails.getOtherDetails().getApplicableDate() == null
					|| bGRConfigDetails.getOtherDetails().getApplicableRate() == null) {
				throw new ServiceException(SalesConstants.BEST_GOLD_RATE_CONFIGURATION_IS_INVALID,
						SalesConstants.ERR_SALE_254,
						"Best Gold Rate configuration (rule type: 'ORDER_AB_BGR_CONFIG') for 'other details' is invalid for location - "
								+ locationCode);
			}

			// call history API with particular date
			MetalPriceRequestDto metalPriceRequest = new MetalPriceRequestDto(metalType,
					bGRConfigDetails.getOtherDetails().getApplicableDate(), locationCode,
					BGRApplicableRateEnum.FIRST_RATE.equals(bGRConfigDetails.getOtherDetails().getApplicableRate())
							? "FIRST"
							: "LAST");
			ListResponse<HistoryPriceResponse> historyPrice = engineService.getStandardHistoryPrice(metalPriceRequest);

			if (CollectionUtil.isEmpty(historyPrice.getResults())) {
				throw new ServiceException(SalesConstants.RATE_NOT_FOUND_FOR_REQUIRED_METAL,
						SalesConstants.ERR_SALE_083,
						"Rate not set today for metal(s) - " + metalType + " for date - "
								+ bGRConfigDetails.getOtherDetails().getApplicableDate() + " at location - "
								+ locationCode);
			}

			StandardPriceResponseDto validGoldPrice = (StandardPriceResponseDto) MapperUtil
					.getDtoMapping(historyPrice.getResults().get(0), StandardPriceResponseDto.class);

			metalRateToBeConsidered.setMetalRates(Map.of(metalType, validGoldPrice));

		} else {
			throw new ServiceException(SalesConstants.BEST_GOLD_RATE_CONFIGURATION_IS_INVALID,
					SalesConstants.ERR_SALE_254,
					"Best Gold Rate configuration (rule type: 'ORDER_AB_BGR_CONFIG') for 'applicable date type' is invalid for location - "
							+ locationCode);
		}

		return metalRateToBeConsidered;
	}

	@Override
	public List<CashMemoDetailsDaoExt> getCashMemoDetailsByItemIdIfExists(String cashMemoId, List<String> itemIdList) {

		List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList = cashMemoDetailsRepository
				.listItemDetailsByCashMemoIdAndItemIds(cashMemoId,
						!CollectionUtils.isEmpty(itemIdList) ? itemIdList : null);
		if (cashMemoDetailsDaoList.isEmpty()) {
			throw new ServiceException(SalesConstants.NO_ITEM_FOUND_IN_THE_TRANSACTION, SalesConstants.ERR_SALE_046,
					"No items found in current transaction.");
		}
		return cashMemoDetailsDaoList;
	}

	@Override
	public List<CashMemoDetailsDaoExt> findCashMemoDetailsByItemIdIfExists(String cashMemoId, List<String> itemIdList) {
		List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList = cashMemoDetailsRepository
				.findAllByCashMemoDaoIdAndIdIn(cashMemoId, itemIdList);
		if (cashMemoDetailsDaoList.isEmpty()) {
			throw new ServiceException(SalesConstants.NO_ITEM_FOUND_IN_THE_TRANSACTION, SalesConstants.ERR_SALE_046,
					"No items found in current transaction.");
		}
		return cashMemoDetailsDaoList;
	}

	@Override
	public void updateTotalAmountPaid(SalesTxnDaoExt salesTxnDao, BigDecimal amountToDeduct, String locationCode) {

		CashMemoDaoExt cashMemoDao = cashMemoRepository.findOneByIdAndSalesTxnDaoLocationCode(salesTxnDao.getId(),
				locationCode);
		cashMemoDao.setPaidValue(cashMemoDao.getPaidValue().subtract(amountToDeduct));
		cashMemoRepository.save(cashMemoDao);

	}

	@Override
	public void checkIfCoinIsAddedAlready(CashMemoDetailsDaoExt cashMemoDetailsDao) {

		// if item is to be updated, then ignore check
		if (!StringUtils.isEmpty(cashMemoDetailsDao.getId())) {
			return;
		}

		if (SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(cashMemoDetailsDao.getProductGroupCode())
				&& cashMemoDetailsRepository
						.existsByItemCodeAndCashMemoDaoIdAndCashMemoDaoSalesTxnDaoLocationCodeAndInventoryWeight(
								cashMemoDetailsDao.getItemCode(), cashMemoDetailsDao.getCashMemoDao().getId(),
								cashMemoDetailsDao.getCashMemoDao().getSalesTxnDao().getLocationCode(),
								cashMemoDetailsDao.getInventoryWeight())) {
			throw new ServiceException(
					SalesConstants.ITEM_IS_ALREADY_ADDED_IN_DYNAMIC_TRANSACTIONTYPE_DYNAMIC_TASKTYPE_TASK_NUMBER_DYNAMIC_DOCNO,
					SalesConstants.ERR_SALE_089, "Item is already added. Update quantity for existing item.",
					Map.of("transactionType", cashMemoDetailsDao.getCashMemoDao().getSalesTxnDao().getTxnType(),
							"taskType", cashMemoDetailsDao.getCashMemoDao().getSalesTxnDao().getStatus(), "docNo",
							cashMemoDetailsDao.getCashMemoDao().getSalesTxnDao().getDocNo().toString()));
		}

	}

	@Override
	public String getInvWeightDetails(Object weightDetails) {

		JsonData jsonData = MapperUtil.mapObjToClass(weightDetails, JsonData.class);
		// temp check
		Object weightJson = StringUtil.isBlankJsonData(jsonData) ? null : jsonData.getData();

		if (StringUtil.isBlankJsonStr(MapperUtil.getStringFromJson(weightJson))) {
			weightJson = weightDetails;
		}

		return MapperUtil.getStringFromJson(new JsonData(CommonConstants.WEIGHT_DETAILS,
				MapperUtil.mapObjToClass(weightJson, WeightDetailsDto.class)));

	}

	@Override
	public ApiResponseDto callEpossCustomerCoupon(String customerMasterId, String couponCode, String status,
			String transactionId) {
		Map<String, String> reqParams = new HashMap<>();
		if (customerMasterId != null)
			reqParams.put("id", customerMasterId);
		if (couponCode != null)
			reqParams.put("couponCode", couponCode);
		if (status != null)
			reqParams.put("status", status);
		if (transactionId != null)
			reqParams.put("transactionId", transactionId);
		return salesIntegrationServiceImpl.callIntegration(HttpMethod.GET, SalesUtil.CASHMEMO_EPOSS_URL + "/coupon",
				reqParams, null);
	}

	@Override
	public PriceResponseDto getOrderItemPriceDetails(SalesTxnDaoExt salesTxnDao, OrdersPriceRequest orderPriceRequest,
			String binGroup, InventoryDetailsDao inventoryDetailsDao, String productGroupCode) {

		log.info(
				"Calculate price at location: {} for item: {}, lot: {}, invId: {}, measured weight: {}, measured quantity: {}",
				salesTxnDao.getLocationCode(), orderPriceRequest.getItemCode(), orderPriceRequest.getLotNumber(),
				orderPriceRequest.getInventoryId(), orderPriceRequest.getMeasuredWeight(),
				orderPriceRequest.getMeasuredQuantity());

		validateItemAndTxnDetailsForPriceCalculation(salesTxnDao, binGroup);

		// check for freeze AB, if not call validate item & call normal price API(engine
		// API)
		OrderDaoExt orderdao = orderUtilServiceImpl.checkIfOrderExistsById(salesTxnDao.getRefTxnId().getId());
		// if AB is migrated from legacy, then we will not have price configs saved.
		// Hence call price API directly.
		if (checkForDirectPriceCall(orderdao)) {
			return engineService.getPriceDetails(orderPriceRequest);
		}

		List<OrderDetailsDaoExt> orderDetailsList = orderDetailsRepository
				.findAllByOrderIdAndStatus(salesTxnDao.getRefTxnId().getId(), TransactionStatusEnum.CONFIRMED.name());

		OrderDetailsDaoExt validOrderItem = null;
		for (OrderDetailsDaoExt orderdetails : orderDetailsList) {
			if (checkIfCoin(orderPriceRequest, productGroupCode, orderdetails)
					|| (!SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(productGroupCode)
							&& orderPriceRequest.getInventoryId().equals(orderdetails.getInventoryId()))) {
				validOrderItem = orderdetails;
				break;
			}
		}

		if (validOrderItem == null) {
			// throw error
			throw new ServiceException(SalesConstants.INVALID_ITEM, SalesConstants.ERR_SALE_051,
					"Item not present in inventory.Hence, item cannot be added to the transaction.");
		}

		if (inventoryDetailsDao == null) {
			inventoryDetailsDao = getInvDetails(orderPriceRequest, productGroupCode).get(0);
		}
		PriceDetailsDto priceDetailsOld = MapperUtil.mapObjToClass(validOrderItem.getPriceDetails(),
				PriceDetailsDto.class);
		// if item is 'UCP', then return same response
		if (BooleanUtils.isTrue(priceDetailsOld.getIsUcp())) {

			// map details to response and return
			PriceResponseDto price = calculateUcpPrice(validOrderItem, priceDetailsOld, inventoryDetailsDao);
			price.setCurrencyCode(salesTxnDao.getCurrencyCode());
			// for UI, to ignore UCP totalValue recalculation when item details are picked
			// from frozen/BGR transaction
			price.setIgnoreUcpRecalculate(true);
			return price;
		}

		updateMetalDetailsForBgr(orderPriceRequest, orderdao, priceDetailsOld);

		// get order config
		OrderDetailsConfigDaoExt orderDetailConfig = orderUtilServiceImpl.getItemConfigByItem(validOrderItem);
		if (orderDetailConfig == null) {
			// in case of migrated AB, config will not be present. Hence call price API
			// directly.
			return engineService.getPriceDetails(orderPriceRequest);
		}

		PriceResponseDto priceResponseDto = orderPriceFactory.getPriceCalculator(inventoryDetailsDao,
				orderPriceRequest.getMeasuredWeight(), orderPriceRequest.getMeasuredQuantity(),
				orderPriceRequest.getStandardPrice(), validOrderItem, orderDetailConfig, priceDetailsOld)
				.price(orderPriceUtilService);

		if (priceResponseDto != null && priceResponseDto.getPriceDetails() != null) {
			priceResponseDto.setCurrencyCode(salesTxnDao.getCurrencyCode());
			// set hallmark details
			priceResponseDto.getPriceDetails().setItemHallmarkDetails(priceDetailsOld.getItemHallmarkDetails());

			priceResponseDto.getPriceDetails().setPrintGuranteeCard(priceDetailsOld.getPrintGuranteeCard());
			// set item type code
			priceResponseDto.getPriceDetails().setItemTypeCode(priceDetailsOld.getItemTypeCode());

			// if isDynamic field in making charge details is null, then set it as false.
			if (priceResponseDto.getPriceDetails().getMakingChargeDetails() != null
					&& priceResponseDto.getPriceDetails().getMakingChargeDetails().getIsDynamic() == null) {
				priceResponseDto.getPriceDetails().getMakingChargeDetails().setIsDynamic(false);
			}
		}
		
		return priceResponseDto;
	}

	private boolean checkForDirectPriceCall(OrderDaoExt orderdao) {
		return (BooleanUtils.isNotTrue(orderdao.getIsFrozenRate()) && BooleanUtils.isNotTrue(orderdao.getIsBestRate()))
				|| TxnSourceType.LEGACY.name().equals(orderdao.getSalesTxn().getTxnSource());
	}

	private void updateMetalDetailsForBgr(OrdersPriceRequest orderPriceRequest, OrderDaoExt orderdao,
			PriceDetailsDto priceDetailsOld) {
		MetalRateListDto orderMetalRateDetails = commonTransactionService
				.mapMetalRateJsonToDto(orderdao.getSalesTxn().getMetalRateDetails());
		// if BGR, then take gold rate accordingly
		if (BooleanUtils.isTrue(orderdao.getIsBestRate())
				&& !orderPriceRequest.getStandardPrice().equals(orderMetalRateDetails.getMetalRates())) {
			priceDetailsOld.getMetalPriceDetails().getMetalPrices().forEach(metalDetail -> {
				if (metalDetail.getOffset() != null) {
					metalDetail.setRatePerUnit(orderPriceRequest.getStandardPrice().get(metalDetail.getMetalTypeCode())
							.getRatePerUnit().multiply(metalDetail.getOffset())
							.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
				}
			});
		}
	}

	private void validateItemAndTxnDetailsForPriceCalculation(SalesTxnDaoExt salesTxnDao, String binGroup) {
		// check if bin is in RESERVED
		if (binGroup == null || !CommonConstants.BIN_GROUP_RESERVE_BIN.equals(binGroup)) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"Invalid API call for pirce calculation.",
					Map.of(SalesConstants.REMARKS, "Invalid API call for pirce calculation."));
		}

		if (salesTxnDao.getRefTxnId() == null) {
			// throw error
			throw new ServiceException(SalesConstants.ITEM_FROM_DYNAMIC_BIN_GROUP_CANNOT_BE_SOLD_TO_OTHERS,
					SalesConstants.ERR_SALE_002,
					"Item in " + CommonConstants.BIN_GROUP_RESERVE_BIN + " cannot be sold to others.",
					Map.of(SalesConstants.BIN_GROUP, CommonConstants.BIN_GROUP_RESERVE_BIN));
		}
	}

	private boolean checkIfCoin(OrdersPriceRequest orderPriceRequest, String productGroupCode,
			OrderDetailsDaoExt orderdetails) {
		return SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(productGroupCode)
				&& orderPriceRequest.getItemCode().equals(orderdetails.getItemCode())
				&& orderPriceRequest.getMeasuredWeight().equals(orderdetails.getTotalWeight())
				&& orderPriceRequest.getMeasuredQuantity().equals(orderdetails.getTotalQuantity());
	}

	private PriceResponseDto calculateUcpPrice(OrderDetailsDaoExt orderDetails, PriceDetailsDto priceDetailsOld,
			InventoryDetailsDao inventoryDetail) {

		PriceResponseDto priceResponseDto = new PriceResponseDto();
		priceResponseDto.setBinCode(inventoryDetail.getBinCode());
		priceResponseDto.setInventoryId(inventoryDetail.getId());
		priceResponseDto.setItemCode(inventoryDetail.getItemCode());
		priceResponseDto.setLotNumber(inventoryDetail.getLotNumber());
		priceResponseDto.setStdWeight(inventoryDetail.getStdWeight());
		priceResponseDto.setItemQuantity((short) 1);
		priceResponseDto.setProductGroupCode(orderDetails.getProductGroupCode());
		priceResponseDto.setProductCategoryCode(orderDetails.getProductCategoryCode());
		priceResponseDto.setItemTypeCode(priceDetailsOld.getItemTypeCode());

		priceResponseDto.setPriceDetails(priceDetailsOld);

		priceResponseDto.setFinalValue(orderDetails.getTotalValue());

		return priceResponseDto;
	}

	private List<InventoryDetailsDao> getInvDetails(OrdersPriceRequest orderPriceRequest, String productGroupCode) {
		List<InventoryDetailsDao> invList;
		if (SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(productGroupCode)) {
			ItemCodeInvWeightDto itemCodeInvWeightDto = new ItemCodeInvWeightDto(orderPriceRequest.getItemCode(),
					orderPriceRequest.getMeasuredWeight().divide(
							new BigDecimal(orderPriceRequest.getMeasuredQuantity()), DomainConstants.WEIGHT_SCALE,
							DomainConstants.ROUNDIND_MODE));
			// Fetch Inventory coins for a bin Group
			Map<ItemCodeInvWeightDto, List<InventoryDetailsDao>> itemCodeAndInvCoinsMap = inventoryService
					.getInvCoinDetails(Map.of(itemCodeInvWeightDto, new SalesItemDto()),
							List.of(CommonConstants.BIN_GROUP_RESERVE_BIN), true);

			invList = itemCodeAndInvCoinsMap.get(itemCodeInvWeightDto);

		} else {
			invList = inventoryService.getItemsByIdAndLocationCode(List.of(orderPriceRequest.getInventoryId()));
		}

		return invList;
	}
}
