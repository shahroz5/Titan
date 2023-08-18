/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.ConfigTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.EinvoiceTransactionTypeEnum;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.constant.enums.WorkflowProcessStatusEnum;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.BrandPanCardDetails;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CashPaidDetailsDto;
import com.titan.poss.core.dto.CashPaymentRuleDetails;
import com.titan.poss.core.dto.CessDetailDto;
import com.titan.poss.core.dto.CoinDetailsDto;
import com.titan.poss.core.dto.ConfigDetailsLocationMappingDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.CustomerTransactionConfigDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsResponseDto;
import com.titan.poss.core.dto.EinvoiceItemDetailsDto;
import com.titan.poss.core.dto.EventCustomerDetailsDto;
import com.titan.poss.core.dto.GhsAccountMasterUpdateDto;
import com.titan.poss.core.dto.HistoryPriceResponse;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.ItemCodeInvWeightDto;
import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.ManualBillDto;
import com.titan.poss.core.dto.ManualBillVerifyDto;
import com.titan.poss.core.dto.MetalPriceRequestDto;
import com.titan.poss.core.dto.MetalRateWithWeightDto;
import com.titan.poss.core.dto.PaymentDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.dto.TaxDetails;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.PasswordHashUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.UpdateInventoryDto;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.sales.constants.AllowedCategoryForCN;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerTcsDetailsDaoExt;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.SalesInvoiceDocumentsDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dao.StockTransactionDaoExt;
import com.titan.poss.sales.dao.StockTransactionDetailsDaoExt;
import com.titan.poss.sales.dto.AddressDetails;
import com.titan.poss.sales.dto.CashMemoPullReasonTxnTypes;
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.ItemInvDetailsDto;
import com.titan.poss.sales.dto.ManualBillResponseDto;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.NomineeDetails;
import com.titan.poss.sales.dto.PaymentCodeAndGroup;
import com.titan.poss.sales.dto.TaxDetailsListDto;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.WeightDetailsDto;
import com.titan.poss.sales.dto.constants.CustomerTypeEnum;
import com.titan.poss.sales.dto.constants.ManualBillValidationTypeEnum;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeCancelEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.constants.TxnSourceType;
import com.titan.poss.sales.dto.constants.TxnTypeCancelEnum;
import com.titan.poss.sales.dto.constants.UploadFileTypeEnum;
import com.titan.poss.sales.dto.request.HallmarkGstRequestDto;
import com.titan.poss.sales.dto.request.SalesItemDto;
import com.titan.poss.sales.dto.request.WeightDetailsAndQtyDto;
import com.titan.poss.sales.dto.response.ConfigAmountAndPANDto;
import com.titan.poss.sales.dto.response.CustomerResDto;
import com.titan.poss.sales.dto.response.GepAndItemIdDetailsResponseDto;
import com.titan.poss.sales.dto.response.GhsPaymentOtherDetailsDto;
import com.titan.poss.sales.dto.response.ReqAndFountQtyDto;
import com.titan.poss.sales.dto.response.TotalTaxAndTaxDetailsDto;
import com.titan.poss.sales.dto.response.UpdateInvItemAndSalesItemDto;
import com.titan.poss.sales.inventory.service.InventoryService;
import com.titan.poss.sales.repository.CashMemoRepositoryExt;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.CustomerPaymentRepositoryExt;
import com.titan.poss.sales.repository.CustomerTcsDetailsRepositoryExt;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentItemMappingRepositoryExt;
import com.titan.poss.sales.repository.SalesInvoiceDocumentsRepository;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.SalesDocService;
import com.titan.poss.sales.service.SalesInvoiceDocService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesCommonTransactionService")
public class CommonTransactionServiceImpl implements CommonTransactionService {

	private static final String RECORD_NOT_FOUND = "Record(s) Not found";

	private static final String ERR_SALE_070 = "ERR-SALE-070";

	private static final String ADDRESS = "addressLines";

	private static final String ERR_CUST_001 = "ERR-CUST-001";
	private static final String MANDATORY_FIELDS_OF_CUSTOMER_DETAILS_ARE_MISSING = "Mandatory fields of customer details are missing. ";
	private static final String COUNTRY = "country";
	private static final String STATE = "state";
	private static final String CITY = "city";
	private static final String PINCODE = "pincode";
	private static final String ZONE = "zone";
	private static final String CATCHMENTNAME = "catchmentName";
	private static final String HOUSENUMBER = "houseNumber";
	private static final String STREET = "street";
	private static final String IDPROOF = "idProof";
	private static final String IDNUMBER = "idNumber";
	private static final String TITLE = "title";
	private static final String MOBILENUMBER = "mobileNumber";
	private static final String EMAIL_ID = "emailId";
    private static final String MOBILE_NO = "mobileNo"; 
    private static final String PASSPORT_ID = "passportId";
    private static final String CUST_TAX_NO_OLD = "custTaxNoOld";

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	@Autowired
	private CashMemoRepositoryExt cashMemoRepository;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private SalesDocService salesDocService;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private CustomerTxnRepositoryExt customerTxnDetailsRepository;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private InventoryService inventoryService;

	@Autowired
	CommonPaymentService paymentUtil;

	@Autowired
	private EpossCallServiceImpl epossCallServiceImpl;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepositoryExt;

	@Autowired
	private PaymentItemMappingRepositoryExt paymentItemMappingRepository;

	@Autowired
	private CreditNoteService creditNoteService;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private CustomerPaymentRepositoryExt customerPaymentRepositoryExt;

	@Autowired
	private CustomerTcsDetailsRepositoryExt customerTcsDetailsRepository;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationMappingRepo;
	
	@Autowired
	private SalesInvoiceDocumentsRepository salesInvoiceDocumentsRepository;
	
	@Autowired
	private SalesInvoiceDocService salesInvoiceDocService;

	private static final String PAYMENT_CODE_CONST = "paymentCodes";

	private static final String CUST_TAX_NO = "custTaxNo";
	private static final String CUSTOMER_NAME = "customerName";
	private static final String INSTI_TAX_NO = "instiTaxNo";

	// temp: Employee loan, TATA loyalty points (pending and will be checked),
	// Employee payment Advance, Interest free loan and CREDIT NOTE
	private static final Set<String> PAYMENTS_RESTRICTED_FOR_CUSTOMER_UPDATE = Set.of(
			PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), PaymentCodeEnum.RO_PAYMENT.getPaymentcode(),
			PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode(), PaymentCodeEnum.ENCIRCLE.getPaymentcode());

	@Override
	public CashMemoDaoExt getCashMemoByIdWithError(String cashMemoId, String transactionType) {
		CashMemoDaoExt cashMemoDao = cashMemoRepository.findOneByIdAndLocationCodeAndTxnType(cashMemoId,
				CommonUtil.getLocationCode(), transactionType);

		if (cashMemoDao == null) {
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					"Invalid cash memo id: " + cashMemoId, Map.of("type", "cash memo"));
		}

		return cashMemoDao;
	}

	@Override
	public void checkTranscationStatusForUpdate(String status) {

		businessDayService.getBusinessDay().getBusinessDate();

		if (BooleanUtils.isFalse(SalesUtil.checkTranscationStatusForUpdate(status))
				|| TransactionStatusEnum.APPROVAL_PENDING.name().equals(status)) {
			throw new ServiceException(SalesConstants.PLEASE_REFRESH_SCREEN_FOR_FURTHER_ACTIONS,
					SalesConstants.ERR_SALE_053, "Transcation is closed.Transaction status: " + status);
		}

	}

	@Override
	public void setFileTypeUploadInSalesTxn(String txnId, UploadFileTypeEnum fileType) {

		SalesTxnDaoExt salesTxn = getSalesTxnByIdWithNullCheck(txnId);
		salesTxn.setCustomerDocDetails(
				StringUtil.appendUniqueString(salesTxn.getCustomerDocDetails(), fileType.name()));
		salesTxnRepositoryExt.save(salesTxn);
	}

	private SalesTxnDaoExt getSalesTxnByIdWithNullCheck(String txnId) {

		Optional<SalesTxnDaoExt> sts = salesTxnRepositoryExt.findById(txnId);

		if (!sts.isPresent())
			throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070, "txn not found.");

		return sts.get();

	}

	/**
	 * This method will check saved, input and system metal rates based on status.
	 * 
	 * if - to add or update item, then isHeaderCheck will be 'false' and status
	 * will be same as salesTxn status. if - to HOLD or CONFIRM, isHeaderCheck will
	 * be 'true' and status will sent as HOLD or CONFIRM.
	 * 
	 * @param salesTxnDao
	 * @param inputMetalRateList
	 * @param status
	 * @param isHeaderCheck
	 * @param isFrozenRate
	 */
	@Override
	public void checkMetalRate(SalesTxnDaoExt salesTxnDao, MetalRateListDto inputMetalRateList,
			TransactionStatusEnum status, boolean isHeaderCheck, BigDecimal holdTime, boolean isAvoidMetalRateCheck,
			Set<String> metalToBeIgnoredForRateCheck) {

		// if manual bill or pre-order of Frozen rate,then no metal rate check.
		if (SubTxnTypeEnum.getManualSubTxnTypes().contains(salesTxnDao.getSubTxnType()) || isAvoidMetalRateCheck) {
			return;
		}

		// if headerCheck, then inputMetalRateList is mandatory
		if (isHeaderCheck && StringUtils.isEmpty(inputMetalRateList)) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Please provide metal rate");
		}

		// get current metal rate
		MetalRateListDto metalRateListDto = getMetalRate();
		// metal rate check without hold time check.
		if ((!isHeaderCheck && TransactionStatusEnum.OPEN.equals(status))
				|| (isHeaderCheck && TransactionStatusEnum.HOLD.equals(status))) {
			metalRateWithoutHoldTimeCheck(inputMetalRateList, metalRateListDto, salesTxnDao,
					metalToBeIgnoredForRateCheck);
		} else if ((!isHeaderCheck && TransactionStatusEnum.HOLD.equals(status))
				|| (isHeaderCheck && TransactionStatusEnum.CONFIRMED.equals(status))) {
			// if the sales_txn status is OPEN previously, then no need of checking HOLD
			// time.
			// In case of Freeze AB , Previous state of CONFIRMED is allowed for metal rate
			// check.
			if (List.of(TransactionStatusEnum.OPEN.name(), TransactionStatusEnum.CONFIRMED.name())
					.contains(salesTxnDao.getStatus())) {
				metalRateWithoutHoldTimeCheck(inputMetalRateList, metalRateListDto, salesTxnDao,
						metalToBeIgnoredForRateCheck);
			} else {
				// metal rate check with hold time check. - as item to be added or transaction
				// to be confirmed should be within hold time, if holdTime is present.
				metalRateWithHoldTimeCheck(inputMetalRateList, metalRateListDto, salesTxnDao, holdTime,
						metalToBeIgnoredForRateCheck);
			}
		}

	}

	@Override
	public MetalRateListDto getMetalRate() {

		Map<String, StandardPriceResponseDto> currentMetalRateList = engineService.getMaterialPrices(null);

		if (CollectionUtils.isEmpty(currentMetalRateList)) {
			throw new ServiceException(SalesConstants.METAL_PRICE_NOT_SET_FOR_THE_DAY, SalesConstants.ERR_SALE_009,
					"Metal price is not set for the day.");
		}
		return new MetalRateListDto(currentMetalRateList);
	}

	/**
	 * This method will check totalWeight and finalValue of transaction matches
	 * manual bill values or not. 'isConfirmTxn' is true when transaction is to be
	 * 'CONFIRM', and finalValue and totalWeight should be equal to manual bill
	 * details. 'isConfirmTxn' is false when item is added or updated, and
	 * finalValue and totalWeight should not be greater than manual bill details.
	 * 
	 * @param totalWeight
	 * @param finalValue
	 * @param salesTxnDao
	 * @param isConfirmTxn
	 * @return ManualBillTxnDetailsDto
	 */
	@Override
	public ManualBillTxnDetailsDto manualBillValuesWithHeader(BigDecimal totalWeight, BigDecimal finalValue,
			SalesTxnDaoExt salesTxnDao, boolean isConfirmTxn, WeightDetailsDto weightDetails) {
		// if not manual bill, then return
		if (!SubTxnTypeEnum.getManualSubTxnTypes().contains(salesTxnDao.getSubTxnType())) {
			return new ManualBillTxnDetailsDto();
		}
		ManualBillTxnDetailsDto manualBillDetails = mapJsonToManualBillDetails(salesTxnDao.getManualBillDetails());
		BigDecimal totalManualBillWeight = BigDecimal.ZERO;

		// get total weight approved for manual bill.
		// if password validation then, only then metal weight check to be done.
		if (ManualBillValidationTypeEnum.PASSWORD_VALIDATION.name().equals(manualBillDetails.getValidationType())) {
			for (Map.Entry<String, MetalRateWithWeightDto> metalRateWithWeightMap : manualBillDetails
					.getManualBillDetails().getMetalRates().entrySet()) {

				totalManualBillWeight = totalManualBillWeight
						.add(metalRateWithWeightMap.getValue().getTotalMetalWeight());
			}
		}

		// if transaction is to be confirmed, manual bill value should not be checked
		// (new requirement by BA)
		if (((isConfirmTxn && !SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.name().equals(salesTxnDao.getSubTxnType()))
				|| (isConfirmTxn && SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.name().equals(salesTxnDao.getSubTxnType())
						&& TransactionStatusEnum.APPROVAL_PENDING.name().equals(salesTxnDao.getStatus())))
				&& (ManualBillValidationTypeEnum.PASSWORD_VALIDATION.name()
						.equals(manualBillDetails.getValidationType()))) {

			paymentUtil.validateMetalWeightInConfirm(weightDetails,
					manualBillDetails.getManualBillDetails().getMetalRates());

		}

		// when each item is added no need to validate as of now - BA

		return manualBillDetails;
	}

	@Override
	public ManualBillTxnDetailsDto mapJsonToManualBillDetails(String manualBillDetails) {
		return MapperUtil.mapObjToClass(manualBillDetails, ManualBillTxnDetailsDto.class);
	}

	private void metalRateWithoutHoldTimeCheck(MetalRateListDto inputMetalRateList,
			MetalRateListDto currentMetalRateListDto, SalesTxnDaoExt salesTxnDao,
			Set<String> metalToBeIgnoredForRateCheck) {
		MetalRateListDto savedMetalRateListDto = mapMetalRateJsonToDto(salesTxnDao.getMetalRateDetails());

		boolean isRateUpdateNeeded = false;
		// input metal rate will be null for item add or update
		if (!StringUtils.isEmpty(inputMetalRateList)) {
			validateMetalRate(inputMetalRateList, currentMetalRateListDto, false, metalToBeIgnoredForRateCheck, false,
					true);
		}
		if (!StringUtils.isEmpty(savedMetalRateListDto)) {
			isRateUpdateNeeded = validateMetalRate(savedMetalRateListDto, currentMetalRateListDto, false,
					metalToBeIgnoredForRateCheck, false, true);
		} else {
			isRateUpdateNeeded = true;
		}

		if (isRateUpdateNeeded) {

			// to handle BGR scenario
			if (!CollectionUtil.isEmpty(metalToBeIgnoredForRateCheck)) {
				metalToBeIgnoredForRateCheck.forEach(metalType -> {
					if (currentMetalRateListDto.getMetalRates().containsKey(metalType)) {
						currentMetalRateListDto.getMetalRates().put(metalType,
								savedMetalRateListDto.getMetalRates().get(metalType));
					}
				});
			}

			salesTxnDao.setMetalRateDetails(MapperUtil.getStringFromJson(currentMetalRateListDto));
			salesTxnRepository.save(salesTxnDao); // pending: check if save not req
		}
	}

	private void metalRateWithHoldTimeCheck(MetalRateListDto inputMetalRateList,
			MetalRateListDto currentMetalRateListDto, SalesTxnDaoExt salesTxnDao, BigDecimal holdTime,
			Set<String> metalToBeIgnoredForRateCheck) {
		MetalRateListDto savedMetalRateListDto = mapMetalRateJsonToDto(salesTxnDao.getMetalRateDetails());
		boolean withInHoldTime = holdTimeCheck(salesTxnDao, holdTime);// hold time check

		// Saved metal rate and input metal rate need to be same irrespective of hold
		// time (will happen for header check).
		if (!StringUtils.isEmpty(inputMetalRateList)) {
			// if holdTime expired then send true, else false (ie, !withInHoldTime)
			validateMetalRate(inputMetalRateList, savedMetalRateListDto, !withInHoldTime, metalToBeIgnoredForRateCheck,
					false, false);
		}
		// if hold time exceeds then need to check saved metal rate & system metal rate
		if (!withInHoldTime) {
			// if holdTime expired then send true, else false (ie, !withInHoldTime)
			boolean isRateUpdateNeeded = validateMetalRate(savedMetalRateListDto, currentMetalRateListDto,
					!withInHoldTime, metalToBeIgnoredForRateCheck, false, true);
			if (isRateUpdateNeeded) {
				salesTxnDao.setMetalRateDetails(MapperUtil.getStringFromJson(currentMetalRateListDto));
				salesTxnRepository.save(salesTxnDao); // pending: check if save not req
			}
		}
	}

	@Override
	public boolean holdTimeCheck(SalesTxnDaoExt salesTxnDao, BigDecimal holdTimeDurationInMin) {
		boolean withInHoldTime = false;
		// config to get HOLD duration -pick from location: holdTimeDurationInMin
		Date holdTime = null;
		if (!StringUtils.isEmpty(salesTxnDao.getLastHoldTime())) {
			holdTime = salesTxnDao.getLastHoldTime();
		} else if (!StringUtils.isEmpty(salesTxnDao.getFirstHoldTime())) {
			holdTime = salesTxnDao.getFirstHoldTime();
		}
		// check duration.
		if (holdTime != null && holdTimeDurationInMin.intValue() > CalendarUtils.getMinutesDifference(holdTime,
				CalendarUtils.getCurrentDate())) {
			withInHoldTime = true;
		}
		return withInHoldTime;
	}

	@Override
	public boolean validateMetalRate(MetalRateListDto firstMetalRateList, MetalRateListDto secondMetalRateList,
			boolean isHoldTimeExpired, Set<String> metalToBeIgnoredForRateCheck, boolean isPriceUpdate,
			boolean isCheckAgainstCurrentRate) {

		// NOTE: when 'isCheckAgainstCurrentRate' is true, make sure
		// 'secondMetalRateList' is always the current rate.
		Set<String> metalTypeKeys;
		metalTypeKeys = getMetalTypes(firstMetalRateList, secondMetalRateList, isCheckAgainstCurrentRate);

		boolean isExtraDataPresent = false;
		boolean isMetalRateChanged = false;
		for (String metaltype : metalTypeKeys) {

			// changed condition due to UAT 1631
			if (isCheckAgainstCurrentRate && !firstMetalRateList.getMetalRates().containsKey(metaltype)
					&& secondMetalRateList.getMetalRates().containsKey(metaltype)) {
				isExtraDataPresent = true;
			} else if ((metalToBeIgnoredForRateCheck == null || !metalToBeIgnoredForRateCheck.contains(metaltype))
					&& (!firstMetalRateList.getMetalRates().containsKey(metaltype)
							|| !secondMetalRateList.getMetalRates().containsKey(metaltype)
							|| !firstMetalRateList.getMetalRates().get(metaltype)
									.equals(secondMetalRateList.getMetalRates().get(metaltype)))) {
				isMetalRateChanged = true;
				break;
			}

		}

		if (isMetalRateChanged && !isPriceUpdate) {

			if (isHoldTimeExpired) {
				throw new ServiceException(SalesConstants.HOLD_TIME_EXPIRED_UPDATE_ITEM_PRICE,
						SalesConstants.ERR_SALE_045, "Hold time expired, update item price.");
			}
//			else if (!isHoldTimeExpired) {
//				return isPriceUpdate || !isCheckAgainstCurrentRate ? isMetalRateChanged : isExtraDataPresent;
//			} 
			else {
				throw new ServiceException(SalesConstants.METAL_PRICE_CHANGED, SalesConstants.ERR_SALE_008,
						"Metal rate changed, please update item price.");
			}

		}

		return isPriceUpdate || !isCheckAgainstCurrentRate ? isMetalRateChanged : isExtraDataPresent;
	}

	private Set<String> getMetalTypes(MetalRateListDto firstMetalRateList, MetalRateListDto secondMetalRateList,
			boolean isCheckAgainstCurrentRate) {
		Set<String> metalTypeKeys;
		if (isCheckAgainstCurrentRate) {
			metalTypeKeys = secondMetalRateList.getMetalRates().keySet();
		} else {
			metalTypeKeys = firstMetalRateList.getMetalRates().size() > secondMetalRateList.getMetalRates().size()
					? firstMetalRateList.getMetalRates().keySet()
					: secondMetalRateList.getMetalRates().keySet();
		}
		return metalTypeKeys;
	}

	@Override
	public void validateLatestMetalRate(MetalRateListDto existingMetalRateList) {
		MetalRateListDto metalRateListLatest = getMetalRate();
		validateMetalRate(existingMetalRateList, metalRateListLatest, false, Set.of(), false, true);
	}

	@Override
	public MetalRateListDto mapMetalRateJsonToDto(String metalRateJson) {
		MetalRateListDto savedMetalRateListDto = null;
		if (!StringUtils.isEmpty(metalRateJson) && !StringUtil.isBlankJsonStr(metalRateJson)) {
			savedMetalRateListDto = MapperUtil.mapObjToClass(metalRateJson, MetalRateListDto.class);
		}
		return savedMetalRateListDto;
	}

	@Override
	public BigDecimal paymentCheck(SalesTxnDaoExt salesTxnDao, List<String> paymentCodeList,
			boolean isAbInvokedCmDelete) {

		BigDecimal paidAmount = BigDecimal.ZERO;
		// separate check to ignore linked CN on CM deletion.
		if (isAbInvokedCmDelete && salesTxnDao.getRefTxnId() != null) {
			paidAmount = ignoreLinkedCnforPayment(salesTxnDao, paidAmount);

		} else {
			// list of payments to restrict any update.
			paidAmount = paidValue(salesTxnDao.getId(), paymentCodeList, null);
		}

		if (paidAmount != null && paidAmount.compareTo(BigDecimal.valueOf(0)) != 0
				&& CollectionUtil.isEmpty(paymentCodeList)) {
			throw new ServiceException(SalesConstants.TRANSACTION_CANNOT_BE_DELETED_REVERSE_ALL_PAYMENTS,
					SalesConstants.ERR_SALE_054, "Current transcation cannot be deleted, please reverse all payments.");
		}

		return paidAmount;

	}

	private BigDecimal ignoreLinkedCnforPayment(SalesTxnDaoExt salesTxnDao, BigDecimal paidAmount) {
		List<PaymentDetailsDaoExt> paymentDetails = paymentDetailsRepository
				.findBySalesTxnDaoIdAndSalesTxnDaoLocationCodeAndStatusIn(salesTxnDao.getId(),
						salesTxnDao.getLocationCode(), PaymentStatusEnum.getPaidPaymentStatus(), null);
		if (CollectionUtils.isEmpty(paymentDetails)) {
			return paidAmount;
		}
		for (PaymentDetailsDaoExt payment : paymentDetails) {
			if (PaymentStatusEnum.COMPLETED.name().equals(payment.getStatus())
					|| !PaymentCodeEnum.CREDIT_NOTE.getPaymentcode().equals(payment.getPaymentCode())) {
				paidAmount = paidAmount.add(payment.getAmount());
			} else {
				JsonData jsonData = MapperUtil.mapObjToClass(payment.getOtherDetails(), JsonData.class);
				if (BooleanUtils
						.isNotTrue(JsonUtils.getValueFromJson(jsonData.getData(), "isLinkedCn", Boolean.class))) {
					paidAmount = paidAmount.add(payment.getAmount());
				}
			}
		}

		return paidAmount;
	}

	@Override
	public BigDecimal paidValue(String transactionId, List<String> paymentCodeList, String paymentStatus) {

		if (CollectionUtils.isEmpty(paymentCodeList)) {
			paymentCodeList = null;
		}

		return paymentDetailsRepository.getPaidAmountByTransactionIdAndPaymentCode(transactionId, paymentCodeList,
				CommonUtil.getLocationCode(), paymentStatus);
	}

	// Note: do not change the format of manualBillId generation as it used to
	// maintain uniqueness of manual bills regularized.
	private String getManualBillId(Integer fiscalYear, String billNo, String txnType) {
		return CommonUtil.getLocationCode() + "_" + fiscalYear + "_" + txnType + "_" + billNo;
	}

	@Override
	public void validateManualBillDetails(TransactionCreateDto transactionCreateDto, SalesTxnDaoExt salesTxnDao) {
		if (StringUtils.isEmpty(transactionCreateDto.getManualBillDetails())) {
			throw new ServiceException(SalesConstants.JSON_DATA_FORMAT_ERROR, SalesConstants.ERR_CORE_013,
					"Provide manual bill details");
		}
		transactionCreateDto.validate(transactionCreateDto);

		// check manual bill validationType
		if (ManualBillValidationTypeEnum.REQUEST_APPROVAL.name().equals(transactionCreateDto.getValidationType())
				&& !SubTxnTypeEnum.allowedTxnForManualbillRequestApproval().contains(salesTxnDao.getSubTxnType())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Manual bill " + ManualBillValidationTypeEnum.REQUEST_APPROVAL.name()
							+ " is not allowed for current transaction.");
		}

		// set manual bill date without time
		transactionCreateDto.getManualBillDetails().setManualBillDate(
				CalendarUtils.getStartOfDay(transactionCreateDto.getManualBillDetails().getManualBillDate()));

		BusinessDayDto businessDayDto = businessDayService.getBusinessDay();

		// manual bill should not be greater than current business date.
		if (transactionCreateDto.getManualBillDetails().getManualBillDate().after(businessDayDto.getBusinessDate())) {
			throw new ServiceException(SalesConstants.MANUAL_BILL_DATE_SHOULD_NOT_EXCEED_CURRENT_BUSINESS_DATE,
					SalesConstants.ERR_SALE_183, "Manual bill date should not exceed current business date.");
		}

		// get manual bill id from fiscal year, bill number and txnType
		String manualBillId = getManualBillId(businessDayDto.getFiscalYear(),
				transactionCreateDto.getManualBillDetails().getManualBillNo(), salesTxnDao.getTxnType());

		// check if manual bill exists in DB.
		SalesTxnDaoExt oldManualBillTxn = salesTxnRepository.findOneByManualBillId(manualBillId);
		if (!StringUtils.isEmpty(oldManualBillTxn)) {
			// if present, then check for status, if pending then do a workflow call to
			// check status, if request is rejected, then allow(iff no payment done), else
			// no.
			boolean isOldTxnValid = checkOldManulBillStatus(oldManualBillTxn);
			if (isOldTxnValid) {
				Map<String, String> errorCause = Map.of("taskNumber", Integer.toString(oldManualBillTxn.getDocNo()));
				throw new ServiceException(SalesConstants.MANUAL_BILL_IS_USED, SalesConstants.ERR_SALE_065, errorCause);
			}

			// else save updated old txn
			salesTxnRepository.saveAndFlush(oldManualBillTxn);
		}

		// if validation type is 'PASSWORD_VALIDATION', then validate password.
		manualBillPasswordCheck(transactionCreateDto, salesTxnDao);

		// if validation type is 'REQUEST_APPROVAL', then validate metal rate.
		// call history API with particular date
		metalRateCheckforReqApprovalManualTxn(transactionCreateDto.getValidationType(),
				transactionCreateDto.getManualBillDetails());

		// set manual bill Id
		salesTxnDao.setManualBillId(manualBillId);
		ManualBillTxnDetailsDto manualBillTxnDetailsDto = new ManualBillTxnDetailsDto();
		manualBillTxnDetailsDto.setValidationType(transactionCreateDto.getValidationType());
		manualBillTxnDetailsDto.setManualBillDetails((ManualBillResponseDto) MapperUtil
				.getDtoMapping(transactionCreateDto.getManualBillDetails(), ManualBillResponseDto.class));
		salesTxnDao.setManualBillDetails(MapperUtil.getStringFromJson(manualBillTxnDetailsDto));
		// get history price in standard format
		MetalRateListDto metalRateList = getStandardHistoryRates(transactionCreateDto.getManualBillDetails());
		salesTxnDao.setMetalRateDetails(MapperUtil.getStringFromJson(metalRateList));
	}

	private void metalRateCheckforReqApprovalManualTxn(String validationType, ManualBillVerifyDto manualBillDetails) {
		if (!ManualBillValidationTypeEnum.REQUEST_APPROVAL.name().equals(validationType)) {
			return;
		}
		MetalPriceRequestDto metalPriceRequest = new MetalPriceRequestDto(null,
				CalendarUtils.addOffSetTimeZone(manualBillDetails.getManualBillDate()), CommonUtil.getStoreCode(),
				null);
		ListResponse<HistoryPriceResponse> historyPriceList = engineService.getStandardHistoryPrice(metalPriceRequest);
		if (CollectionUtil.isEmpty(historyPriceList.getResults())) {
			throw new ServiceException(SalesConstants.RATE_NOT_FOUND_FOR_REQUIRED_METAL, SalesConstants.ERR_SALE_083,
					"Rate not set on bill date for metal(s) - "
							+ manualBillDetails.getMetalRates().keySet().stream().collect(Collectors.toList()));
		}

		Map<String, List<HistoryPriceResponse>> historyPriceMap = historyPriceList.getResults().stream()
				.collect(Collectors.groupingBy(HistoryPriceResponse::getMetalTypeCode));
		List<String> metalWithNoRate = new ArrayList<>();
		for (Map.Entry<String, MetalRateWithWeightDto> inputMetalRate : manualBillDetails.getMetalRates().entrySet()) {
			boolean isRateFound = false;
			if (!CollectionUtil.isEmpty(historyPriceMap.get(inputMetalRate.getKey()))) {
				for (HistoryPriceResponse historyPrice : historyPriceMap.get(inputMetalRate.getKey())) {
					if (inputMetalRate.getValue().getRatePerUnit().compareTo(historyPrice.getRatePerUnit()) == 0) {
						isRateFound = true;
					}
				}
			}

			if (!isRateFound) {
				metalWithNoRate.add(inputMetalRate.getKey());
			}
		}

		if (!CollectionUtil.isEmpty(metalWithNoRate)) {
			throw new ServiceException(SalesConstants.INVALID_METAL_RATE_DETAILS, SalesConstants.ERR_LOC_038,
					"Input rate is incorrect or metal rate is not set on bill date for metal(s) - " + metalWithNoRate);
		}

	}

	private void manualBillPasswordCheck(TransactionCreateDto transactionCreateDto, SalesTxnDaoExt salesTxnDao) {
		if (ManualBillValidationTypeEnum.PASSWORD_VALIDATION.name().equals(transactionCreateDto.getValidationType())) {
			// if password is not present, then throw error
			if (StringUtils.isEmpty(transactionCreateDto.getManualBillDetails().getPassword())) {
				throw new ServiceException(SalesConstants.INCORRECT_PASWORD, SalesConstants.ERR_CORE_031,
						"Entered password is incorrect.");
			}
			ManualBillDto manualBillDto = (ManualBillDto) MapperUtil
					.getDtoMapping(transactionCreateDto.getManualBillDetails(), ManualBillDto.class);
			String generatedPassword = PasswordHashUtil.getPasswordForManualBill(manualBillDto,
					CommonUtil.getLocationCode(), transactionCreateDto.getManualBillDetails().getMetalRates(),
					salesTxnDao.getTxnType(), transactionCreateDto.getManualBillDetails().getIsBimetal());
			log.info("generated password" + generatedPassword);
			if (!generatedPassword.equals(transactionCreateDto.getManualBillDetails().getPassword())) {
				throw new ServiceException(SalesConstants.INCORRECT_PASWORD, SalesConstants.ERR_CORE_031,
						"Entered password is incorrect.");
			}
		}
	}

	private boolean checkOldManulBillStatus(SalesTxnDaoExt oldManualBillTxn) {
		boolean isValidTxn = false;
		log.info("Old txn id: " + oldManualBillTxn.getId() + " old txn manual bill id: "
				+ oldManualBillTxn.getManualBillId());
		// if status in 'OPEN' or 'CONFIRMED' then throw error
		if (List.of(TransactionStatusEnum.OPEN.name(), TransactionStatusEnum.CONFIRMED.name(),
				TransactionStatusEnum.CANCELLED.name()).contains(oldManualBillTxn.getStatus())) {
			isValidTxn = true;// means new manual bill cannot be created for same id.
		} else if (TransactionStatusEnum.APPROVAL_PENDING.name().equals(oldManualBillTxn.getStatus())) {
			ManualBillTxnDetailsDto manualBillDetails = mapJsonToManualBillDetails(
					oldManualBillTxn.getManualBillDetails());
			// call EPOSS to get status:
			String workFlowStatus;
			if (TransactionTypeEnum.CM.name().equals(oldManualBillTxn.getTxnType())) {
				workFlowStatus = epossCallServiceImpl.getProcessStatus(
						manualBillDetails.getManualBillDetails().getProcessId(), WorkflowTypeEnum.MANUAL_BILL);
			} else {
				workFlowStatus = epossCallServiceImpl.getProcessStatus(
						manualBillDetails.getManualBillDetails().getProcessId(),
						WorkflowTypeEnum.ADVANCE_BOOKING_MANUAL_BILL);
			}

			if (WorkflowProcessStatusEnum.APPROVED.name().equals(workFlowStatus)) {
				isValidTxn = true;
			//	paymentSetIsEditableToFalse(oldManualBillTxn.getId());
			} else {
				
				paymentSetIsEditableToTrue(oldManualBillTxn.getId());
				
				// update status to 'REJECTED' and clear manual bill id if no payment is done.
				BigDecimal paidValue = paidValue(oldManualBillTxn.getId(), null, null);
				if (BigDecimal.ZERO.compareTo(paidValue) != 0) {
					throw new ServiceException("Please delete payments in previous manual bill request.",
							"ERR-SALE-187", "Please delete payments in previous manual bill request No: "
									+ manualBillDetails.getManualBillDetails().getRequestNo());
				}
				oldManualBillTxn.setManualBillId(null);
				oldManualBillTxn.setStatus(TransactionStatusEnum.REJECTED.name());
			}

		} else {
			throw new ServiceException(SalesConstants.INCORRECT_DATA_DEFINED_IN_DATABASE, SalesConstants.ERR_CORE_036,
					"Wrong status for the txn id: " + oldManualBillTxn.getId());
		}

		return isValidTxn;
	}

	private MetalRateListDto getStandardHistoryRates(ManualBillVerifyDto manualBillDetails) {
		Map<String, StandardPriceResponseDto> standardMetalRateList = getMetalRate().getMetalRates();
		Map<String, StandardPriceResponseDto> historyMetalRates = new HashMap<>();

		// check if metal price is set for today, for all the metals involved in manual
		// bill
		if (!standardMetalRateList.keySet().containsAll(manualBillDetails.getMetalRates().keySet())) {
			throw new ServiceException(SalesConstants.RATE_NOT_FOUND_FOR_REQUIRED_METAL, SalesConstants.ERR_SALE_083,
					"Rate not set today for metal(s) - " + manualBillDetails.getMetalRates().keySet().stream()
							.filter(metalType -> !standardMetalRateList.keySet().contains(metalType))
							.collect(Collectors.toList()));
		}

		// get history price in standard format
		for (Map.Entry<String, MetalRateWithWeightDto> firstMetalRate : manualBillDetails.getMetalRates().entrySet()) {
			historyMetalRates.put(firstMetalRate.getKey(), standardMetalRateList.get(firstMetalRate.getKey()));
			historyMetalRates.get(firstMetalRate.getKey()).setRatePerUnit(firstMetalRate.getValue().getRatePerUnit());
			historyMetalRates.get(firstMetalRate.getKey()).setApplicableDate(manualBillDetails.getManualBillDate());
		}
		return new MetalRateListDto(historyMetalRates);
	}

	@Override
	public SalesTxnDaoExt getSalesTxnDao(SalesTxnDaoExt salesTxnDao, String txnType, String subTxnType,
			SalesDocTypeEnum salesDocType, TransactionStatusEnum status) {

		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails();

		if (StringUtils.isEmpty(salesTxnDao)) {
			salesTxnDao = new SalesTxnDaoExt();
			salesTxnDao.setCurrencyCode(countryDetailsDto.getCurrencyCode());
			salesTxnDao.setWeightUnit(countryDetailsDto.getWeightUnit());
		}

		salesTxnDao.setTxnType(txnType);
		salesTxnDao.setLocationCode(CommonUtil.getLocationCode());

		Integer docNo = salesDocService.getDocNumber(salesDocType, countryDetailsDto.getFiscalYear().shortValue());
		Short fiscalYear = countryDetailsDto.getFiscalYear().shortValue();

		// check if - txnType, locationCode, fiscalYear, docNo, status exists
		if (salesTxnRepository.existsByDocNoAndFiscalYearAndStatusAndTxnTypeAndLocationCode(docNo, fiscalYear,
				status.name(), txnType, CommonUtil.getStoreCode())) {
			log.info("docNo: {}, fiscalYear: {}, status: {}, txnType:{}, locationCode: {}", docNo, fiscalYear, status,
					txnType, CommonUtil.getStoreCode());
			throw new ServiceException(SalesConstants.DATA_CONSTRAINT_VIOLATION, SalesConstants.ERR_CORE_038,
					"Generated Doc number: " + docNo + ", already exists in DB.");
		}

		// doc No & fiscalYear
		salesTxnDao.setFiscalYear(fiscalYear);
		salesTxnDao.setDocNo(docNo);
		// get from businessDayService
		salesTxnDao.setDocDate(businessDayService.getBusinessDay().getBusinessDate());

		/*
		 * if (StringUtils.isEmpty(salesTxnDao.getEmployeeCode())) {
		 * salesTxnDao.setEmployeeCode(CommonUtil.getAuthUser().getEmployeeCode()); }
		 */
		salesTxnDao.setSubTxnType(subTxnType);
		salesTxnDao.setStatus(status.name());

		return salesTxnDao;
	}

	@Override
	public void txnTypeAndSubTxnTypeValidation(String txnType, String subTxnType) {

		List<String> subTxnTypeList = SubTxnTypeEnum.getByTxnType(TransactionTypeEnum.valueOf(txnType));
		if (CollectionUtil.isEmpty(subTxnTypeList) || !subTxnTypeList.contains(subTxnType)) {
			throw new ServiceException(SalesConstants.INVALID_SUB_TRANSACTION_TYPE, SalesConstants.ERR_SALE_059,
					"Invalid sub transaction type '" + subTxnType + "' for '" + txnType + "' transaction.");
		}

	}

	@Override
	public void validateTxnAndSubTxnType(TransactionTypeEnum allowedTxnType, String txnType, String subTxnType) {

		if (!allowedTxnType.name().equals(txnType))
			throw new ServiceException(SalesConstants.INVALID_TRANSACTION_TYPE, SalesConstants.ERR_SALE_060,
					"Invalid transaction type. Allowed txnTypes: [" + allowedTxnType + "]");

		List<String> subTxnListAllowed = SubTxnTypeEnum.getByTxnType(allowedTxnType);
		if (!subTxnListAllowed.contains(subTxnType))
			throw new ServiceException(SalesConstants.INVALID_SUB_TRANSACTION_TYPE, SalesConstants.ERR_SALE_059,
					"Invalid sub transaction type. Allowed subTxnTypes: "
							+ Arrays.toString(subTxnListAllowed.toArray()));

	}

	@Override
	public void validateTxnAndSubTxnTypeCancel(List<String> allowedTxnType, String txnType, String subTxnType) {
		if (!allowedTxnType.contains(txnType)) {
			throw new ServiceException(SalesConstants.INVALID_TRANSACTION_TYPE, SalesConstants.ERR_SALE_060,
					"Invalid cancel transaction type '" + txnType + "'");
		}
		List<String> subTxnListAllowed = SubTxnTypeCancelEnum.getByTxnType(TxnTypeCancelEnum.valueOf(txnType));
		if (!subTxnListAllowed.contains(subTxnType)) {
			throw new ServiceException(SalesConstants.INVALID_SUB_TRANSACTION_TYPE, SalesConstants.ERR_SALE_059,
					"Invalid cancel sub transaction type '" + subTxnType + "' for '" + txnType + "' transaction.");
		}
	}

	@Override
	public BigDecimal getRoundingVariance(BigDecimal finalValue) {
		// rounding off final amount:
		BigDecimal roundingVariance = finalValue.subtract(new BigDecimal(finalValue.longValue()));
		// if roundingVariance is less than 0.5, then negate it.
		// else roundingVariance = 1 - roundingVariance
		if (roundingVariance.compareTo(BigDecimal.valueOf(0.5)) < 0) {
			roundingVariance = roundingVariance.multiply(BigDecimal.valueOf(-1));
		} else {
			roundingVariance = BigDecimal.valueOf(1).subtract(roundingVariance);
		}
		return roundingVariance;
	}

	// Pending: move -> (with encryption or without)
	private CustomerTxnDaoExt getCustomerData(Integer customerId) {
		CustomerResDto customerDto = null;
		try {
			customerDto = customerService.getCustomer(customerId);
		} catch (ServiceException e) {
			throw new ServiceException(SalesConstants.CUSTOMER_DETAILS_NOT_FOUND_FOR_THE_GIVEN_ID + " :" + customerId,
					SalesConstants.ERR_SALE_011, "Customer details not found for the given id :" + customerId);
		}

		if (StringUtils.isEmpty(customerDto)) {
			throw new ServiceException(SalesConstants.CUSTOMER_DETAILS_NOT_FOUND_FOR_THE_GIVEN_ID + " :" + customerId,
					SalesConstants.ERR_SALE_011, "Customer details not found for the given id :" + customerId);
		}

		customerDto.setCustTaxNo(CryptoUtil.encrypt(customerDto.getCustTaxNo(), CUST_TAX_NO));

		CustomerTxnDaoExt customerTxnDao = (CustomerTxnDaoExt) MapperUtil.getObjectMapping(customerDto,
				new CustomerTxnDaoExt());
		customerTxnDao.setCustomerDetails(MapperUtil.getStringFromJson(customerDto.getCustomerDetails()));
		customerTxnDao.setLocationCode(CommonUtil.getLocationCode());
		return customerTxnDao;
	}

	@Transactional
	@Override
	public void updateCustomerDetails(Integer customerId, SalesTxnDaoExt salesTxnDao) {
		updateCustomerDetails(customerId, salesTxnDao, true, false);
	}

	@Transactional
	@Override
	public SalesTxnDaoExt updateCustomerDetails(Integer customerId, SalesTxnDaoExt salesTxnDao, boolean saveSalesTxn,
			boolean isGHSUpdate) {

		if (StringUtils.isEmpty(customerId)) {
			return salesTxnDao;
		}

		CustomerTxnDaoExt customerTxnDetailsDao = getCustomerData(customerId);

		log.info("Customer Txn details - {}", customerTxnDetailsDao);

		// check if customer(by customer type) is eligible for this transaction (txn
		// type).
		// subTxn types to be checked based on customer type - GIFT_SALE.
		// txnType changed for 'GRF', ie., 'ADV' with 'FROZEN_RATES'
		checkCustomerTypeTxnConfig(salesTxnDao, customerTxnDetailsDao);

		// if assigning customer to a sales txn for 1st time
		if (StringUtils.isEmpty(salesTxnDao.getCustomerId())) {

			customerTxnDetailsDao.setSalesTxnDao(salesTxnDao);
			// update customer id in sales_txn
			salesTxnDao.setCustomerId(customerTxnDetailsDao.getCustomerId());
			log.info("Sales Txn details - {}", salesTxnDao);
			if (saveSalesTxn)
				salesTxnRepository.save(salesTxnDao);

			customerTxnDetailsDao.setSrcSyncId(0);
			customerTxnDetailsDao.setDestSyncId(0);

			log.info("Customer txn details - {}", customerTxnDetailsDao);

			customerTxnDetailsDao
					.setMobileNumber(CryptoUtil.encrypt(customerTxnDetailsDao.getMobileNumber(), MOBILENUMBER));
			customerTxnDetailsDao
					.setInstiTaxNo(CryptoUtil.encrypt(customerTxnDetailsDao.getInstiTaxNo(), INSTI_TAX_NO));
			customerTxnDetailsDao.setEmailId(CryptoUtil.encrypt(customerTxnDetailsDao.getEmailId(), EMAIL_ID));
			customerTxnDetailsDao
					.setCustomerName(CryptoUtil.encrypt(customerTxnDetailsDao.getCustomerName(), CUSTOMER_NAME));
			customerTxnDetailsDao.setPassportId(CryptoUtil.encrypt(customerTxnDetailsDao.getPassportId(), PASSPORT_ID));
			customerTxnDetailsDao.setCustTaxNo(CryptoUtil.encrypt(customerTxnDetailsDao.getCustTaxNo(),  CUST_TAX_NO));
            customerTxnDetailsDao.setCustTaxNoOld(CryptoUtil.encrypt(customerTxnDetailsDao.getCustTaxNoOld(),  CUST_TAX_NO_OLD ));            
            customerTxnDetailsDao.setIsEncrypted(Boolean.TRUE);
            customerTxnDetailsRepository.save(customerTxnDetailsDao);
		} else {
			// if assigning customer to an existing sales txn
			// do payment check for all transactions except -- need to be updated for other
			// transactions.
			log.info("Sales Txn details with mapped customer {} ", salesTxnDao);

			if (!salesTxnDao.getCustomerId().equals(customerId)) {

				customerIdValidation(salesTxnDao, isGHSUpdate);
				// delete discounts and apply 'ENCIRCLE' discount (iff applicable)
				// discount to remove (NAP-7030): Employee, encircle, TATA employee, TSSS
				// discounts, Empowerment should be removed
			}
			CustomerTxnDaoExt customerDetailsExisting = customerTxnDetailsRepository
					.findOneBySalesTxnDaoId(salesTxnDao.getId());
            customerDetailsExisting.setMobileNumber(CryptoUtil.decrypt(customerDetailsExisting.getMobileNumber(),MOBILE_NO,false));
            customerDetailsExisting.setInstiTaxNo(CryptoUtil.decrypt(customerDetailsExisting.getInstiTaxNo(),INSTI_TAX_NO,false));
            customerDetailsExisting.setEmailId(CryptoUtil.decrypt(customerDetailsExisting.getEmailId(),EMAIL_ID,false));
            customerDetailsExisting.setCustomerName(CryptoUtil.decrypt(customerDetailsExisting.getCustomerName(),CUSTOMER_NAME,false));
            customerDetailsExisting.setCustTaxNo(CryptoUtil.decrypt(customerDetailsExisting.getCustTaxNo(),CUST_TAX_NO,false));
            customerDetailsExisting.setCustTaxNoOld(CryptoUtil.decrypt(customerDetailsExisting.getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
            customerDetailsExisting.setPassportId(CryptoUtil.decrypt(customerDetailsExisting.getPassportId(),PASSPORT_ID,false));
			// to make sure all details are newly added, delete existing data
			customerTxnDetailsRepository.delete(customerDetailsExisting);
			customerTxnDetailsDao.setSalesTxnDao(salesTxnDao);
			// update customer id in sales_txn, if customerId is changed
			if (!salesTxnDao.getCustomerId().equals(customerId)) {
				salesTxnDao.setCustomerId(customerId);
				salesTxnRepository.save(salesTxnDao);
			}
			customerTxnDetailsDao
					.setMobileNumber(CryptoUtil.encrypt(customerTxnDetailsDao.getMobileNumber(), MOBILENUMBER));
			customerTxnDetailsDao
					.setInstiTaxNo(CryptoUtil.encrypt(customerTxnDetailsDao.getInstiTaxNo(), INSTI_TAX_NO));
			customerTxnDetailsDao.setEmailId(CryptoUtil.encrypt(customerTxnDetailsDao.getEmailId(), EMAIL_ID));
			customerTxnDetailsDao
					.setCustomerName(CryptoUtil.encrypt(customerTxnDetailsDao.getCustomerName(), CUSTOMER_NAME));
			customerTxnDetailsDao
			.setPassportId(CryptoUtil.encrypt(customerTxnDetailsDao.getPassportId(), PASSPORT_ID));
			customerTxnDetailsDao
			.setCustTaxNo(CryptoUtil.encrypt(customerTxnDetailsDao.getCustTaxNo(), CUST_TAX_NO));
			customerTxnDetailsDao
			.setCustTaxNoOld(CryptoUtil.encrypt(customerTxnDetailsDao.getCustTaxNoOld(), CUST_TAX_NO_OLD));
			customerTxnDetailsDao.setIsEncrypted(Boolean.TRUE);
			customerTxnDetailsRepository.save(customerTxnDetailsDao);
		}
		return salesTxnDao;
	}

	/**
	 * @param salesTxnDao
	 * @param customerTxnDetailsDao
	 */
	private void checkCustomerTypeTxnConfig(SalesTxnDaoExt salesTxnDao, CustomerTxnDaoExt customerTxnDetailsDao) {
		CustomerTransactionConfigDto customerTransactionConfigDto = engineService
				.getCustomerConfig(customerTxnDetailsDao.getCustomerType(), ConfigTypeEnum.CUSTOMER_CONFIG.name());

		if (StringUtils.isEmpty(customerTransactionConfigDto)) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Configuration not present for txn types allowed based on customer type at location: "
							+ CommonUtil.getLocationCode());
		}

		if (CollectionUtil.isEmptyOrEmptyValue(customerTransactionConfigDto.getTransactionType())) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Configuration not present for txn types allowed based on customer type at location: "
							+ CommonUtil.getLocationCode());
		}

		// txnType changed for 'GRF', ie., 'ADV' with 'FROZEN_RATES'
		String txnTypeToConsider = salesTxnDao.getTxnType();
		if (TransactionTypeEnum.ADV.name().equals(txnTypeToConsider)
				&& (SubTxnTypeEnum.FROZEN_RATES.name().equals(salesTxnDao.getSubTxnType())
						|| SubTxnTypeEnum.MANUAL_FROZEN_RATES.name().equals(salesTxnDao.getSubTxnType()))) {
			txnTypeToConsider = TransactionTypeEnum.GRF.name();
		} else if (TransactionTypeEnum.CM.name().equals(txnTypeToConsider)
				&& SubTxnTypeEnum.GIFT_SALE.name().equals(salesTxnDao.getSubTxnType())) {
			txnTypeToConsider = TransactionTypeEnum.GIFT_SALE.name();
		}

		// subTxn types to be checked based on customer type - GIFT_SALE. - removed as
		// 'GIFT_SALE txn type is not there'
		if (!customerTransactionConfigDto.getTransactionType().contains(txnTypeToConsider)) {
			throw new ServiceException(SalesConstants.CUSTOMER_IS_NOT_VALID_FOR_THE_CURRENT_TRANSACTION,
					SalesConstants.ERR_SALE_049,
					"Customer is not valid for the current transaction. Customer type: "
							+ customerTxnDetailsDao.getCustomerType() + ", eligible txn types:"
							+ customerTransactionConfigDto.getTransactionType());
		}
	}

	/**
	 * @param salesTxnDao
	 * @param isGHSUpdate -- for update customer as part of GHS account redemption.
	 *                    NAP- 2319 & NAP-4407
	 */
	private void customerIdValidation(SalesTxnDaoExt salesTxnDao, boolean isGHSUpdate) {

		// check payment - to restrict customer change
		// in case of AB to CM:,
		// i. if GHS payment is added in AB, then customer change not allowed in CM
		// ii.if GHS payment is not added in AB, but trying to add 3rd party GHS account
		// in CM, then should allow (ignoring AB linked CNs added)
		// if TCS amount is added, then customer cannot be changed.
		if (!List.of(TransactionTypeEnum.GEP.name(), TransactionTypeEnum.TEP.name())
				.contains(salesTxnDao.getTxnType())) {
			paymentCheckForItemORCustomerUpdate(salesTxnDao, true, false, isGHSUpdate);
		}

		// if txn is previously put on HOLD, then customer cannot be changed.
		// skip check if customer is changed as part of GHS account redemption.
		if (TransactionStatusEnum.HOLD.name().equals(salesTxnDao.getStatus()) && !isGHSUpdate) {
			throw new ServiceException(SalesConstants.CUSTOMER_CANNOT_BE_CHANGED_FOR_THE_TRANSACTION,
					SalesConstants.ERR_SALE_050, "Customer cannot be changed when transaction is on HOLD.");
		}

		// if manual bill, then customer cannot be changed (after adding for the first
		// time)
		if (SubTxnTypeEnum.getManualSubTxnTypes().contains(salesTxnDao.getSubTxnType())) {
			throw new ServiceException(SalesConstants.CUSTOMER_CANNOT_BE_CHANGED_FOR_THE_TRANSACTION,
					SalesConstants.ERR_SALE_050,
					"Customer cannot be changed ff the transaction is Manual CM/AB/GEP/TEP.");
		}
	}

	@Override
	public void setHoldTime(SalesTxnDaoExt salesTxnDao) {
		if (StringUtils.isEmpty(salesTxnDao.getFirstHoldTime())) {
			salesTxnDao.setFirstHoldTime(CalendarUtils.getCurrentDate());
			salesTxnDao.setLastHoldTime(CalendarUtils.getCurrentDate());
		} else {
			salesTxnDao.setLastHoldTime(CalendarUtils.getCurrentDate());
		}
	}

	@Override
	public void checkInputStatus(String status, String subTxnType) {
		if (!TransactionStatusEnum.allowedInputStatus().contains(status)) {
			throw new ServiceException(SalesConstants.INVALID_INPUT_STATUS, SalesConstants.ERR_SALE_036,
					"Invalid input status: " + status);
		}

		// pending status is allowed for certain subTxn types only (for request
		// approval)
		if (TransactionStatusEnum.APPROVAL_PENDING.name().equals(status)
				&& !SubTxnTypeEnum.allowedTxnForManualbillRequestApproval().contains(subTxnType)) {
			throw new ServiceException(SalesConstants.INVALID_INPUT_STATUS, SalesConstants.ERR_SALE_036,
					"Invalid input status: " + status);
		}

	}

	@Override
	public void customerDetailsCheckForFinalValue(BigDecimal finalValue, SalesTxnDaoExt salesTxnDao) {

		BrandDto brandDto = engineService.getBrand(null);
		JsonData jsonData = MapperUtil.mapObjToClass(brandDto.getPanCardDetails(), JsonData.class);

		if (StringUtil.isBlankJsonData(jsonData)) {
			throw new ServiceException(SalesConstants.PLEASE_UPDATE_PAN_CARD_DETAILS_AT_BRAND_LEVEL,
					SalesConstants.ERR_SALE_179,
					"PanCard Details not present for the brand: " + CommonUtil.getAuthUser().getBrandCode());
		}

		BrandPanCardDetails brandPanCardDetails = MapperUtil.mapObjToClass(jsonData.getData(),
				BrandPanCardDetails.class);

		if (brandPanCardDetails == null) {
			throw new ServiceException(SalesConstants.PLEASE_UPDATE_PAN_CARD_DETAILS_AT_BRAND_LEVEL,
					SalesConstants.ERR_SALE_179,
					"PanCard Details not present for the brand: " + CommonUtil.getAuthUser().getBrandCode());
		}

		ConfigAmountAndPANDto configAmountAndPANDto = null;

		if (TransactionTypeEnum.CM.name().equals(salesTxnDao.getTxnType())) {
			configAmountAndPANDto = checkForCMValue(brandPanCardDetails);
		} else if (TransactionTypeEnum.ADV.name().equals(salesTxnDao.getTxnType())
				|| TransactionTypeEnum.AB.name().equals(salesTxnDao.getTxnType())
				|| TransactionTypeEnum.CO.name().equals(salesTxnDao.getTxnType())
				|| TransactionTypeEnum.TEP.name().equals(salesTxnDao.getTxnType())
		// || TransactionTypeEnum.GEP.name().equals(salesTxnDao.getTxnType())
		) {
			// pending: currently done for ADV, AB, TEP, GEP and CO
			configAmountAndPANDto = checkForOtherTxnValue(brandPanCardDetails);
		} else if (TransactionTypeEnum.GEP.name().equals(salesTxnDao.getTxnType())) {
			configAmountAndPANDto = checkForGEPValue(brandPanCardDetails);
		}

		// if values are present for valid txns, then check final value and later
		// customer details
		if (configAmountAndPANDto != null) {
			// pending - form60 check?
			CustomerTxnDaoExt customerDetailsExisting = customerTxnDetailsRepository
					.findOneBySalesTxnDaoId(salesTxnDao.getId());

			// save latest customer details in customerTxn table.
			CustomerTxnDaoExt customerTxnDetailsDao = getCustomerData(customerDetailsExisting.getCustomerId());
			customerDetailsExisting = (CustomerTxnDaoExt) MapperUtil.getObjectMapping(customerTxnDetailsDao,
					customerDetailsExisting);
			if ((!StringUtils.isEmpty(customerDetailsExisting.getMobileNumber()) && (customerDetailsExisting.getMobileNumber().length() ==10)))
			customerDetailsExisting
					.setMobileNumber(CryptoUtil.encrypt(customerTxnDetailsDao.getMobileNumber(), MOBILENUMBER));
			if ((!StringUtils.isEmpty(customerDetailsExisting.getInstiTaxNo()) && (customerDetailsExisting.getInstiTaxNo().length() <= 15)))
			customerDetailsExisting
					.setInstiTaxNo(CryptoUtil.encrypt(customerTxnDetailsDao.getInstiTaxNo(), INSTI_TAX_NO));
			if (!StringUtils.isEmpty(customerDetailsExisting.getEmailId()))
			customerDetailsExisting.setEmailId(CryptoUtil.encrypt(customerTxnDetailsDao.getEmailId(), EMAIL_ID));
			if (!StringUtils.isEmpty(customerDetailsExisting.getCustomerName()))
			customerDetailsExisting
					.setCustomerName(CryptoUtil.encrypt(customerTxnDetailsDao.getCustomerName(), CUSTOMER_NAME));
			if ((!StringUtils.isEmpty(customerDetailsExisting.getCustTaxNo()) && (customerDetailsExisting.getCustTaxNo().length() <= 10)))
			customerDetailsExisting.setCustTaxNo(CryptoUtil.encrypt(customerDetailsExisting.getCustTaxNo(),CUST_TAX_NO));
			if((!StringUtils.isEmpty(customerDetailsExisting.getCustTaxNoOld()) && (customerDetailsExisting.getCustTaxNoOld().length() <= 10)))
			customerDetailsExisting.setCustTaxNoOld(CryptoUtil.encrypt(customerDetailsExisting.getCustTaxNoOld(),CUST_TAX_NO_OLD));
			customerDetailsExisting.setPassportId(CryptoUtil.encrypt(customerDetailsExisting.getPassportId(),PASSPORT_ID));
			customerDetailsExisting.setIsEncrypted(Boolean.TRUE);
			customerTxnDetailsRepository.save(customerDetailsExisting);

			if (BooleanUtils.isTrue(configAmountAndPANDto.getIsPanMandatory())) {
				if (CustomerTypeEnum.INTERNATIONAL.name().equalsIgnoreCase(customerDetailsExisting.getCustomerType())) {
					JsonData customerDetailsJson = MapperUtil
							.mapObjToClass(customerDetailsExisting.getCustomerDetails(), JsonData.class);

					boolean isForm60NotThere = StringUtil.isBlankJsonData(customerDetailsJson) || (StringUtils
							.isEmpty(JsonUtils.getValueFromJson(customerDetailsJson.getData(), "idProof", String.class))
							|| StringUtils.isEmpty(JsonUtils.getValueFromJson(customerDetailsJson.getData(), "idNumber",
									String.class)));
					if (isForm60NotThere && StringUtils.isEmpty(customerDetailsExisting.getPassportId())
							&& StringUtils.isEmpty(customerDetailsExisting.getPassportId())
							&& finalValue.compareTo(configAmountAndPANDto.getConfigurationAmount()) >= 0) {
						// mobile number check removed from user story - NAP-2604
						throw new ServiceException(
								SalesConstants.PLEASE_PROVIDE_FORM60_DETAILS_AS_PAYMENT_EXCEEDED_ALLOWED_PAYMENT_LIMIT_WITHOUT_FORM60_DETAILS,
								SalesConstants.ERR_SALE_413,
								"Please provide Form60 details as payment amount exceeded allowed payment limit without Form60 details"
										+ configAmountAndPANDto.getConfigurationAmount());
					}
				} else {
					Boolean isPanNotThere = Boolean.FALSE;
					if (StringUtils.isEmpty(customerTxnDetailsDao.getCustTaxNo())
							&& !CustomerTypeEnum.ONETIME.name()
									.equalsIgnoreCase(customerTxnDetailsDao.getCustomerType())
							&& StringUtils
									.isEmpty(JsonUtils
											.getValueFromJson(
													MapperUtil.getObjectMapperInstance()
															.convertValue(
																	MapperUtil.getJsonFromString(
																			customerTxnDetailsDao.getCustomerDetails()),
																	JsonData.class)
															.getData(),
													"idProof", String.class))) {
						isPanNotThere = Boolean.TRUE;

					}
					if (isPanNotThere) {

						if (configAmountAndPANDto.getIsPanMandatory()) {
							if (configAmountAndPANDto.isPanCardOnSingleInvoice()
									&& finalValue.compareTo(configAmountAndPANDto.getConfigurationAmount()) >= 0) {
								// mobile number check removed from user story - NAP-2604
								throw new ServiceException(
										SalesConstants.PAN_MANDATORY_FOR_PURCHASING_ABOVE_CONFIGURED_AMOUNT,
										SalesConstants.ERR_SALE_064, "PAN required if purchasing above(configured) "
												+ configAmountAndPANDto.getConfigurationAmount());

							} else if (configAmountAndPANDto.isPanCardOnCumulativeInvoice()) {
								Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
								CashPaidDetailsDto totalCashPaid = customerPaymentRepositoryExt
										.getPaidAmountBySearchTypeAndsearchValueAndPaymentDateAndLocationCode(
												"MOBILE_NO", customerDetailsExisting.getMobileNumber(), businessDate,
												salesTxnDao.getLocationCode());
								BigDecimal cumulativeTotalCashPaid = finalValue.add(totalCashPaid.getTotalCashPaid());
								if (cumulativeTotalCashPaid
										.compareTo(configAmountAndPANDto.getConfigurationAmount()) >= 0)
									throw new ServiceException(
											SalesConstants.PAN_MANDATORY_FOR_PURCHASING_ABOVE_CONFIGURED_AMOUNT,
											SalesConstants.ERR_SALE_064, "PAN required if purchasing above(configured) "
													+ configAmountAndPANDto.getConfigurationAmount());
							}
						}
					}
				}
			}

		}

	}

	private CashPaymentRuleDetails getCashLimitConfig() {

		RuleRequestListDto ruleRequestListDto = new RuleRequestListDto();
		ruleRequestListDto.setLocationCode(CommonUtil.getLocationCode());

		Object objRespose = engineService.getRuleFieldValues(RuleTypeEnum.CASH_CONFIGURATION, ruleRequestListDto);

		if (StringUtils.isEmpty(objRespose)) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Cash limit configuration is not present for the location " + CommonUtil.getLocationCode());
		}

		return MapperUtil.mapObjToClass(objRespose, CashPaymentRuleDetails.class);
	}

	private ConfigAmountAndPANDto checkForCMValue(BrandPanCardDetails brandPanCardDetails) {
		if ((brandPanCardDetails.getIsPanCardMandatoryforCashMemo() == null
				|| brandPanCardDetails.getConfigurationAmountForCashMemo() == null
				|| brandPanCardDetails.getIsPanCardOnSingleInvoice() == null
				|| brandPanCardDetails.getIsPanCardOnCumulativeInvoice() == null)) {
			throw new ServiceException(SalesConstants.PLEASE_UPDATE_PAN_CARD_DETAILS_AT_BRAND_LEVEL,
					SalesConstants.ERR_SALE_179,
					"PanCard Details: isPanCardMandatoryforCashMemo OR configurationAmountForCashMemo is not present for the brand: "
							+ CommonUtil.getAuthUser().getBrandCode());

		}

		return new ConfigAmountAndPANDto(brandPanCardDetails.getIsPanCardMandatoryforCashMemo(),
				brandPanCardDetails.getConfigurationAmountForCashMemo(),
				brandPanCardDetails.getIsPanCardOnSingleInvoice(),
				brandPanCardDetails.getIsPanCardOnCumulativeInvoice());
	}

	private ConfigAmountAndPANDto checkForGEPValue(BrandPanCardDetails brandPanCardDetails) {
		if ((brandPanCardDetails.getIsPanCardMandatoryforGEP() == null
				|| brandPanCardDetails.getConfigurationAmountForGEP() == null)) {
			throw new ServiceException(SalesConstants.PLEASE_UPDATE_PAN_CARD_DETAILS_AT_BRAND_LEVEL,
					SalesConstants.ERR_SALE_179,
					"PanCard Details: isPanCardMandatoryforGEP OR configurationAmountForGEP is not present for the brand: "
							+ CommonUtil.getAuthUser().getBrandCode());

		}

		return new ConfigAmountAndPANDto(brandPanCardDetails.getIsPanCardMandatoryforGEP(),
				brandPanCardDetails.getConfigurationAmountForGEP(), false, false);
	}

	private ConfigAmountAndPANDto checkForOtherTxnValue(BrandPanCardDetails brandPanCardDetails) {
		if ((brandPanCardDetails.getIsPanCardMandatoryforAdvance() == null
				|| brandPanCardDetails.getConfigurationAmountForAdvance() == null)) {
			throw new ServiceException(SalesConstants.PLEASE_UPDATE_PAN_CARD_DETAILS_AT_BRAND_LEVEL,
					SalesConstants.ERR_SALE_179,
					"PanCard Details: isPanCardMandatoryforAdvance OR configurationAmountForAdvance is not present for the brand: "
							+ CommonUtil.getAuthUser().getBrandCode());

		}

		return new ConfigAmountAndPANDto(brandPanCardDetails.getIsPanCardMandatoryforAdvance(),
				brandPanCardDetails.getConfigurationAmountForAdvance(), false, false);
	}

	@Override
	public SalesTxnDaoExt createSalesTxnObj(Integer customerId, String empCode, TransactionStatusEnum status,
			SalesDocTypeEnum salesDocType, TransactionTypeEnum transactionType, SubTxnTypeEnum subTxnType,
			SalesTxnDaoExt refSalesTxn, String refTxnType) {
		// get fiscal year, currency code, weight unit from engine service
		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails();

		SalesTxnDaoExt salesTxnDao = new SalesTxnDaoExt();
		// set
		salesTxnDao.setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
		salesTxnDao.setCurrencyCode(countryDetailsDto.getCurrencyCode());
		salesTxnDao.setWeightUnit(countryDetailsDto.getWeightUnit());

		salesTxnDao.setCustomerId(customerId);
		salesTxnDao.setStatus(status.name());
		salesTxnDao
				.setDocNo(salesDocService.getDocNumber(salesDocType, countryDetailsDto.getFiscalYear().shortValue()));
		salesTxnDao.setTxnType(transactionType.name());
		salesTxnDao.setSubTxnType(subTxnType.name());
		salesTxnDao.setRefTxnId(refSalesTxn);
		salesTxnDao.setRefTxnType(refTxnType);
		if (org.apache.commons.lang.StringUtils.isBlank(empCode))
			salesTxnDao.setEmployeeCode(CommonUtil.getAuthUser().getUsername());
		else
			salesTxnDao.setEmployeeCode(empCode);
		salesTxnDao.setLocationCode(CommonUtil.getLocationCode());
		// get doc date from businessDayService
		salesTxnDao.setDocDate(businessDayService.getBusinessDay().getBusinessDate());

		salesTxnDao.setSrcSyncId(0);
		salesTxnDao.setDestSyncId(0);

		return salesTxnDao;
	}

	@Override
	public SalesTxnDaoExt setNewDocNoByDocType(SalesDocTypeEnum salesDocType, SalesTxnDaoExt salesTxn) {
		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails();

		salesTxn.setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
		salesTxn.setDocNo(salesDocService.getDocNumber(salesDocType, countryDetailsDto.getFiscalYear().shortValue()));
		// get doc date from businessDayService
		salesTxn.setDocDate(businessDayService.getBusinessDay().getBusinessDate());

		return salesTxn;
	}

	@Override
	public SalesTxnDaoExt saveSalesTxn(SalesTxnDaoExt salesTxn) {
		return salesTxnRepository.save(salesTxn);
	}

	@Override
	public void verifyStatus(String status, TransactionTypeEnum txnTypeAllowed, List<String> allowedStatus) {
		List<String> statusAllowed = null;
		if (!StringUtils.isEmpty(allowedStatus)) {
			statusAllowed = allowedStatus;
		} else {
			statusAllowed = TransactionStatusEnum.getByTxnType(txnTypeAllowed);
		}

		if (!StringUtils.isEmpty(status) && !statusAllowed.contains(status))
			throw new ServiceException("Status is not applicable in this transaction type", "ERR-SALE-067",
					"Status is not applicable in this transaction type. Allowed status for " + txnTypeAllowed
							+ " are :- " + statusAllowed);

	}

	/**
	 * @param salesTxn
	 */
	public void setLatestMetalRate(SalesTxnDaoExt salesTxn) {
		salesTxn.setMetalRateDetails(MapperUtil.getStringFromJson(getMetalRate()));
		salesTxnRepository.save(salesTxn);
	}

	// used in TEP/GEP
	@Override
	public BigDecimal getTaxDetails(BigDecimal totalValue, BigDecimal totalDiscount,
			TaxCalculationResponseDto taxDetails) {
		BigDecimal totalTax = BigDecimal.ZERO;

		// NOTE: tax to be calculated on (totalValue - totalDiscount)
		// pending: if discount amount is updated, then totalTax and finalValue will
		// change.
		BigDecimal amountToCalculateTax = (totalValue
				.subtract((totalDiscount == null ? BigDecimal.ZERO : totalDiscount)));

		if (!taxDetails.getData().isEmpty()) {
			for (Entry<String, TaxDetailDto> taxDetailsDto : taxDetails.getData().entrySet()) {
				taxDetailsDto.getValue()
						.setTaxValue(amountToCalculateTax
								.multiply((taxDetailsDto.getValue().getTaxPercentage().divide(BigDecimal.valueOf(100))))
								.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
				totalTax = totalTax.add(taxDetailsDto.getValue().getTaxValue());
			}
		}
		BigDecimal totalCess = BigDecimal.ZERO;
		if (!taxDetails.getCess().isEmpty()) {
			for (Entry<String, CessDetailDto> cessDetailsDto : taxDetails.getCess().entrySet()) {
				calculateCessValue(cessDetailsDto.getValue(), totalTax, amountToCalculateTax);
				totalCess = totalCess.add(cessDetailsDto.getValue().getCessValue());
			}
		}
		totalTax = totalTax.add(totalCess);
		return totalTax;
	}

	private void calculateCessValue(CessDetailDto cessDetailsDto, BigDecimal totalTax, BigDecimal totalValue) {
		if (BooleanUtils.isTrue(cessDetailsDto.getCessOnTax())) { // calculate cess on tax
			cessDetailsDto.setCessValue(
					totalTax.multiply((cessDetailsDto.getCessPercentage().divide(BigDecimal.valueOf(100))))
							.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
		} else { // calculate cess on total value
			cessDetailsDto.setCessValue(
					totalValue.multiply((cessDetailsDto.getCessPercentage().divide(BigDecimal.valueOf(100))))
							.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
		}
	}

	@Override
	public void paymentCheckForItemORCustomerUpdate(SalesTxnDaoExt salesTxnDao, boolean isCustomerUpdate,
			boolean isPriceUpdate, boolean isGhsUpdate) {

		// if TCS amount is added, then no updates allowed.
		checkIfTcsAmountIsAdded(salesTxnDao, isCustomerUpdate);

		Set<String> paymentCodeList = new HashSet<>();
		// if price update, ignore payment config check.
		if (!isPriceUpdate) {
			ConfigDetailsLocationMappingDto configDetailsLocationMappingDto = engineService
					.getValidPaymentCodes(salesTxnDao.getTxnType(), ConfigTypeEnum.PAYMENT_CONFIG.name());

			List<PaymentDto> pCToRestrictItemAndCustomerUpdate = configDetailsLocationMappingDto.getPaymentCodeDetails()
					.stream()
					.filter(paymentcodeDetails -> BooleanUtils.isTrue(paymentcodeDetails.getCustomerDependent()))
					.collect(Collectors.toList());

			paymentCodeList = pCToRestrictItemAndCustomerUpdate.stream().map(PaymentDto::getPaymentCode)
					.collect(Collectors.toSet());
		}

		// if customer update, then add few more payments to the check
		if (isCustomerUpdate) {
			paymentCodeList.addAll(PAYMENTS_RESTRICTED_FOR_CUSTOMER_UPDATE);
		}

		BigDecimal paidAmount = BigDecimal.ZERO;

		// payment check to be done iff customer dependent payments are present.
		if (!CollectionUtil.isEmpty(paymentCodeList)) {
			Map<BigDecimal, Set<String>> paymentDetails = getPaymentDetails(salesTxnDao,
					paymentCodeList.stream().collect(Collectors.toList()), isGhsUpdate);
			paidAmount = paymentDetails.keySet().stream().collect(Collectors.toList()).get(0);
			paymentCodeList = paymentDetails.get(paidAmount);
		}

		if (BigDecimal.ZERO.compareTo(paidAmount) != 0) {

			if (isCustomerUpdate) {
				throw new ServiceException(SalesConstants.INVALID_ITEM_ID, SalesConstants.ERR_SALE_013,
						"Customer cannot be changed for the transaction. Customer related payments should be deleted.",
						Map.of(PAYMENT_CODE_CONST, paymentCodeList.toString()));
			} else {

				Set<String> paymentSet = new HashSet<>(paymentCodeList);
				// check for payment item mapping also for price update
				checkPaymentItemMapForPriceUpdate(salesTxnDao, isPriceUpdate, paymentSet);

				throw new ServiceException(
						SalesConstants.PLEASE_REVERSE_FOLLOWING_DYNAMIC_PAYMENTS_TO_MAKE_UPDATES_TO_ITEM_LIST,
						SalesConstants.ERR_SALE_084,
						"Delete following customer related payments (if added) to make item updates - " + paymentSet,
						Map.of(PAYMENT_CODE_CONST, paymentSet.toString()));
			}
		} else {
			// helpful to check PaymentItemMapping table on price update
			// check for payments with product group map:
			Set<String> paymentSet = new HashSet<>();
			checkPaymentItemMapForPriceUpdate(salesTxnDao, isPriceUpdate, paymentSet);
			if (!paymentSet.isEmpty()) {
				throw new ServiceException(
						SalesConstants.PLEASE_REVERSE_FOLLOWING_DYNAMIC_PAYMENTS_TO_MAKE_UPDATES_TO_ITEM_LIST,
						SalesConstants.ERR_SALE_084,
						"Delete following customer related payments (if added) to make item updates - " + paymentSet,
						Map.of(PAYMENT_CODE_CONST, paymentSet.toString()));
			}
		}

	}

	private Map<BigDecimal, Set<String>> getPaymentDetails(SalesTxnDaoExt salesTxnDao, List<String> paymentCodeList,
			boolean isGhsUpdate) {

		if (CollectionUtil.isEmpty(paymentCodeList)) {
			paymentCodeList = null;
		}

		List<PaymentDetailsDaoExt> paymentList = paymentDetailsRepository.findPaidAmountByTransactionIdAndPaymentCode(
				salesTxnDao.getId(), paymentCodeList, CommonUtil.getLocationCode(), null);

		List<PaymentDetailsDaoExt> orderLinkedPayments = new ArrayList<>();
		BigDecimal linkedCnAmount = BigDecimal.ZERO;
		if (isGhsUpdate && salesTxnDao.getRefTxnId() != null) {
			// on GHS update need to ignore credit notes linked for order, for customer
			// change.
			linkedCnAmount = checkLinkedCN(salesTxnDao, orderLinkedPayments, linkedCnAmount);
		}

		if (CollectionUtil.isEmpty(paymentList)) {
			Map.of(BigDecimal.ZERO, new HashSet<>());
		}

		BigDecimal totamAmountPaid = paymentList.stream().map(PaymentDetailsDaoExt::getAmount).reduce(BigDecimal.ZERO,
				BigDecimal::add);

		return Map.of(totamAmountPaid.subtract(linkedCnAmount),
				paymentList.stream().filter(payment -> !orderLinkedPayments.contains(payment))
						.map(PaymentDetailsDaoExt::getPaymentCode).collect(Collectors.toSet()));
	}

	private BigDecimal checkLinkedCN(SalesTxnDaoExt salesTxnDao, List<PaymentDetailsDaoExt> orderLinkedPayments,
			BigDecimal linkedCnAmount) {
		// on GHS update need to ignore credit notes linked for order, for customer
		// change.
		List<PaymentDetailsDaoExt> cnPayments = paymentDetailsRepository.getAllPaymentCodePayments(
				PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), salesTxnDao.getId(),
				List.of(PaymentStatusEnum.OPEN.name(), PaymentStatusEnum.COMPLETED.name()),
				CommonUtil.getLocationCode());

		if (!CollectionUtil.isEmpty(cnPayments)) {
			cnPayments.forEach(payment -> {
				Boolean isLinkedCn = null;
				JsonData otherDetails = MapperUtil.mapObjToClass(payment.getOtherDetails(), JsonData.class);
				if (!StringUtil.isBlankJsonData(otherDetails)) {
					// get 'isLinkedCn' if exists in other details and set to main DTO
					// NOTE: if present do not throw error if payment exceeds
					isLinkedCn = JsonUtils.getValueFromJson(otherDetails.getData(), "isLinkedCn", Boolean.class);
				}
				// if payment code in 'CREDIT NOTE' and 'isLinkedCn' is true, then add to linked
				// CN list
				if (BooleanUtils.isTrue(isLinkedCn)) {
					orderLinkedPayments.add(payment);
				}
			});
		}

		if (!CollectionUtil.isEmpty(orderLinkedPayments)) {
			linkedCnAmount = orderLinkedPayments.stream().map(PaymentDetailsDaoExt::getAmount).reduce(BigDecimal.ZERO,
					BigDecimal::add);
		}
		return linkedCnAmount;
	}

	/**
	 * @param salesTxnDao
	 * @param isPriceUpdate
	 * @param paymentSet
	 */
	private void checkPaymentItemMapForPriceUpdate(SalesTxnDaoExt salesTxnDao, boolean isPriceUpdate,
			Set<String> paymentSet) {
		if (isPriceUpdate) {
			List<PaymentItemMappingDaoExt> paymentItemMapList = paymentItemMappingRepository
					.getByTxnIdAndLocationCodeAndStatusIn(salesTxnDao.getId(), salesTxnDao.getLocationCode(),
							PaymentStatusEnum.getPaidPaymentStatus(), null);
			if (!CollectionUtil.isEmpty(paymentItemMapList)) {
				for (PaymentItemMappingDaoExt paymentItemMap : paymentItemMapList) {
					paymentSet.add(paymentItemMap.getPaymentDetailsDao().getPaymentCode());
				}
			}
		}
	}

	@Override
	public TotalTaxAndTaxDetailsDto getTotalTaxDetails(Integer customerId, String itemCode, BigDecimal totalValue,
			BigDecimal totalDiscount, TxnTaxTypeEnum taxTxnType, TaxCalculationResponseDto taxDetails,
			HallmarkGstRequestDto hallmarkGstRequestDto) {
		log.info("Get tax details: customer id:" + customerId + ", item code: " + itemCode + ", txnType: " + taxTxnType
				+ ", location code: " + CommonUtil.getLocationCode());

		// if tax details json is empty then, call tax API.
		if (StringUtils.isEmpty(taxDetails)) {
			taxDetails = engineService.getTaxDetails(null, customerId, taxTxnType.name(), itemCode, false, null);
		}

		// set hallmark GST % to tax details
		hallmarkGstRequestDto = getHallmarkGstDetails(taxDetails, hallmarkGstRequestDto);

		// NOTE: tax to be calculated on (totalValue - totalDiscount)
		BigDecimal amountToCalculateTax = (totalValue
				.subtract((totalDiscount == null ? BigDecimal.ZERO : totalDiscount)));

		BigDecimal totalTax = BigDecimal.ZERO;
		if (!taxDetails.getData().isEmpty()) {

			for (Entry<String, TaxDetailDto> taxDetailsDto : taxDetails.getData().entrySet()) {

				BigDecimal calculateTaxOn = amountToCalculateTax;
				// for HMGST, tax to be calculated on hallmark charges.
				if (CommonConstants.HMGST.equals(taxDetailsDto.getKey())) {
					calculateTaxOn = hallmarkGstRequestDto.getHallmarkCharges();
				}

				taxDetailsDto.getValue().setTaxValue(
						(calculateTaxOn.multiply((taxDetailsDto.getValue().getTaxPercentage() == null ? BigDecimal.ZERO
								: taxDetailsDto.getValue().getTaxPercentage().divide(BigDecimal.valueOf(100)))))
										.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));

				totalTax = totalTax.add(taxDetailsDto.getValue().getTaxValue());
			}
		}

		BigDecimal totalCess = BigDecimal.ZERO;
		if (!taxDetails.getCess().isEmpty()) {
			for (Entry<String, CessDetailDto> cessDetailsDto : taxDetails.getCess().entrySet()) {
				calculateCessValue(cessDetailsDto.getValue(), totalTax, amountToCalculateTax);
				totalCess = totalCess.add(cessDetailsDto.getValue().getCessValue());
			}
		}

		return new TotalTaxAndTaxDetailsDto(totalTax.add(totalCess), taxDetails,
				getItemFinalValue(totalValue, totalDiscount == null ? BigDecimal.ZERO : totalDiscount,
						totalTax.add(totalCess), hallmarkGstRequestDto.getHallmarkCharges(),
						hallmarkGstRequestDto.getHallmarkDiscount()));
	}

	@Override
	public TotalTaxAndTaxDetailsDto getTotalTaxDetails(Integer customerId, String itemCode, BigDecimal totalValue,
			BigDecimal totalDiscount, TxnTaxTypeEnum taxTxnType, TaxCalculationResponseDto taxDetails,
			HallmarkGstRequestDto hallmarkGstRequestDto, Boolean isIGST) {
		log.info("Get tax details: customer id:" + customerId + ", item code: " + itemCode + ", txnType: " + taxTxnType
				+ ", location code: " + CommonUtil.getLocationCode());

		// if tax details json is empty then, call tax API.
		taxDetails = engineService.getTaxDetails(null, customerId, taxTxnType.name(), itemCode, false, isIGST);

		// set hallmark GST % to tax details
		hallmarkGstRequestDto = getHallmarkGstDetails(taxDetails, hallmarkGstRequestDto);

		// NOTE: tax to be calculated on (totalValue - totalDiscount)
		BigDecimal amountToCalculateTax = (totalValue
				.subtract((totalDiscount == null ? BigDecimal.ZERO : totalDiscount)));

		BigDecimal totalTax = BigDecimal.ZERO;
		if (!taxDetails.getData().isEmpty()) {

			for (Entry<String, TaxDetailDto> taxDetailsDto : taxDetails.getData().entrySet()) {

				BigDecimal calculateTaxOn = amountToCalculateTax;
				// for HMGST, tax to be calculated on hallmark charges.
				if (CommonConstants.HMGST.equals(taxDetailsDto.getKey())) {
					calculateTaxOn = hallmarkGstRequestDto.getHallmarkCharges();
				}

				taxDetailsDto.getValue().setTaxValue(
						(calculateTaxOn.multiply((taxDetailsDto.getValue().getTaxPercentage() == null ? BigDecimal.ZERO
								: taxDetailsDto.getValue().getTaxPercentage().divide(BigDecimal.valueOf(100)))))
										.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));

				totalTax = totalTax.add(taxDetailsDto.getValue().getTaxValue());
			}
		}

		BigDecimal totalCess = BigDecimal.ZERO;
		if (!taxDetails.getCess().isEmpty()) {
			for (Entry<String, CessDetailDto> cessDetailsDto : taxDetails.getCess().entrySet()) {
				calculateCessValue(cessDetailsDto.getValue(), totalTax, amountToCalculateTax);
				totalCess = totalCess.add(cessDetailsDto.getValue().getCessValue());
			}
		}

		return new TotalTaxAndTaxDetailsDto(totalTax.add(totalCess), taxDetails,
				getItemFinalValue(totalValue, totalDiscount == null ? BigDecimal.ZERO : totalDiscount,
						totalTax.add(totalCess), hallmarkGstRequestDto.getHallmarkCharges(),
						hallmarkGstRequestDto.getHallmarkDiscount()));
	}

	private HallmarkGstRequestDto getHallmarkGstDetails(TaxCalculationResponseDto taxDetails,
			HallmarkGstRequestDto hallmarkGstRequestDto) {

		if (hallmarkGstRequestDto == null) {
			// need for calculation in calling function.
			return new HallmarkGstRequestDto(BigDecimal.ZERO, BigDecimal.ZERO, null);
		}

		if (hallmarkGstRequestDto.getHallmarkCharges() == null) {
			hallmarkGstRequestDto.setHallmarkCharges(BigDecimal.ZERO);
		}
		if (hallmarkGstRequestDto.getHallmarkDiscount() == null) {
			hallmarkGstRequestDto.setHallmarkDiscount(BigDecimal.ZERO);
		}

		// if hallmark is not applicable, then remove HMGST tax code if present
		if (BigDecimal.ZERO.compareTo(hallmarkGstRequestDto.getHallmarkCharges()) == 0
				|| BigDecimal.ZERO.compareTo(hallmarkGstRequestDto.getHallmarkDiscount()) != 0) {
			// remove HM GST from tax details if exists
			if (!taxDetails.getData().isEmpty()) {
				taxDetails.getData().remove(CommonConstants.HMGST);
			}

			return hallmarkGstRequestDto;
		}
		if (hallmarkGstRequestDto.getHallmarkGstPct() == null) {
			// throw error
			throw new ServiceException(SalesConstants.HALLMARK_GST_PERCENTAGE_IS_NOT_CONFIGURED_FOR_THE_LOCATION,
					SalesConstants.ERR_LOC_086,
					"Hallmark GST % is not present for location " + CommonUtil.getStoreCode());
		}

		if (taxDetails.getData().isEmpty()) {
			taxDetails.setData(new HashMap<>());
		}

		taxDetails.getData().put(CommonConstants.HMGST,
				new TaxDetailDto(CommonConstants.HMGST, hallmarkGstRequestDto.getHallmarkGstPct(), null));

		return hallmarkGstRequestDto;
	}

	@Override
	public InventoryItemDto getInvetoryItemDetails(String invId, BigDecimal invWeight, Short reqQty) {

		// check if item is sale able or not
		InventoryItemDto validInventoryItem = engineService.validateInventoryItem(invId, null);
		// check quantity
		if (reqQty > validInventoryItem.getTotalQuantity()) {
			throw new ServiceException(SalesConstants.ITEM_QUANTITY_EXCEEDS_INVENTORY_QUANTITY,
					SalesConstants.ERR_SALE_055, "Input quantity exceeds inventory quantity.");
		}
		if (invWeight.compareTo(validInventoryItem.getUnitWeight()) != 0) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid input for field: inventoryWeight");
		}

		if (StringUtils.isEmpty(validInventoryItem)) {
			throw new ServiceException(SalesConstants.INVALID_ITEM, SalesConstants.ERR_SALE_051,
					"Item not present in inventory.Hence, item cannot be added to the transaction.");
		}

		if (!StringUtils.isEmpty(validInventoryItem.getRequestType())) {
			if (SalesConstants.ADJ.equals(validInventoryItem.getRequestType())
					&& validInventoryItem.getRequestQuantity() >= reqQty) {
				throw new ServiceException(SalesConstants.STOCK_UNDER_ADJ_REQUEST, SalesConstants.ERR_SALE_443);
			}

			if (SalesConstants.PSV.equals(validInventoryItem.getRequestType())
					&& validInventoryItem.getRequestQuantity() >= reqQty) {
				throw new ServiceException(SalesConstants.STOCK_UNDER_PSV_REQUEST, SalesConstants.ERR_SALE_444);
			}
		}

		return validInventoryItem;

	}

	@Override
	public InventoryItemDto getInvetoryItemDetailsByItemCodeAndLotNumber(String invId, BigDecimal invWeight,
			Short reqQty, String itemCode, String lotNumber) {

		// check if item is sale able or not
//		InventoryItemDto validInventoryItem = engineService.validateInventoryItem(invId, null);

		List<InventoryItemDto> inventoryItemList = new ArrayList<>();
		List<InventoryItemDto> inventoryItems = engineService.getInventoryItemLotDetails(itemCode, lotNumber);

		inventoryItems.forEach(item -> {
			if (item.getBinGroupCode().equalsIgnoreCase("FOC"))
				inventoryItemList.add(item);
		});
		Short totalQuantity = 0;

		InventoryItemDto validInventoryItem = (inventoryItemList != null && !(inventoryItemList.isEmpty()))
				? inventoryItemList.stream().filter(inventoryItem -> inventoryItem.getTotalQuantity() != null)
						.max(Comparator.comparing(InventoryItemDto::getTotalQuantity)).get()
				: new InventoryItemDto();
		for (InventoryItemDto item : inventoryItemList) {
			totalQuantity = (short) (totalQuantity + item.getTotalQuantity());
		}

		validInventoryItem.setTotalQuantity(totalQuantity);

		log.info("totalQuantity--->" + totalQuantity);

		// check quantity
		if (reqQty > validInventoryItem.getTotalQuantity()) {
			throw new ServiceException(SalesConstants.ITEM_QUANTITY_EXCEEDS_INVENTORY_QUANTITY,
					SalesConstants.ERR_SALE_055, "Input quantity exceeds inventory quantity.");
		}
		if (invWeight.compareTo(validInventoryItem.getUnitWeight()) != 0) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid input for field: inventoryWeight");
		}

		if (StringUtils.isEmpty(validInventoryItem)) {
			throw new ServiceException(SalesConstants.INVALID_ITEM, SalesConstants.ERR_SALE_051,
					"Item not present in inventory.Hence, item cannot be added to the transaction.");
		}

		return validInventoryItem;

	}

	@Override
	public CoinDetailsDto getInventoryCoinDetails(String itemCode, BigDecimal invWeight, Short reqQty) {

		ListResponse<CoinDetailsDto> coinDetails = engineService.getCoinDetails(itemCode, true);
		// filter coins by unit_weight
		List<CoinDetailsDto> coinDetailsList = coinDetails.getResults().stream()
				.filter(coin -> (invWeight.compareTo(coin.getUnitWeight()) == 0)).collect(Collectors.toList());

		InventoryItemDto coinInvCheck = engineService.validateInventoryItem(null, itemCode);

		if (CollectionUtils.isEmpty(coinDetailsList)) {

			if (invWeight.compareTo(coinInvCheck.getUnitWeight()) == 0) {
				String binGroupCode = coinInvCheck.getBinGroupCode();
				if (!Pattern.matches(SalesConstants.BIN_CHECK_REGEX, binGroupCode)) {
					binGroupCode = binGroupCode + " BIN";
				}
				throw new ServiceException(SalesConstants.ITEM_FROM_DYNAMIC_BIN_GROUP_CANNOT_BE_SOLD_TO_OTHERS,
						SalesConstants.ERR_SALE_002,
						"Item is in invalid Bin group: " + binGroupCode + ", hence cannot be sold.",
						Map.of(SalesConstants.BIN_GROUP, binGroupCode));
			}

			throw new ServiceException(SalesConstants.INVALID_ITEM, SalesConstants.ERR_SALE_051,
					"Item not present in inventory. Hence, item cannot be added to the transaction.");
		}

		// pending: check if item is saleAble or not

		// get valid coin details based on required quantity
		CoinDetailsDto validCoinDetailsDto = null;
		for (CoinDetailsDto coinDetailsDto : coinDetailsList) {
			if (reqQty <= coinDetailsDto.getTotalQuantity()) {
				validCoinDetailsDto = coinDetailsDto;
			}
		}

		if (validCoinDetailsDto == null) {
			throw new ServiceException(SalesConstants.ITEM_QUANTITY_EXCEEDS_INVENTORY_QUANTITY,
					SalesConstants.ERR_SALE_055, "Input quantity exceeds inventory quantity.");
		}

		return validCoinDetailsDto;

	}

	@Override
	public BigDecimal getItemFinalValue(BigDecimal totalValue, BigDecimal totalDiscount, BigDecimal totalTax,
			BigDecimal hallmarkCharges, BigDecimal hallmarkDiscount) {
		hallmarkCharges = hallmarkCharges == null ? BigDecimal.ZERO : hallmarkCharges;
		hallmarkDiscount = hallmarkDiscount == null ? BigDecimal.ZERO : hallmarkDiscount;

		// NOTE: this function is to be used to calculate finalValue for items ONLY.
		// @formatter:off
		// final value = (total value + hallmark charges - (total discount + hallmark
		// discount)) + total tax(includes hallmark tax also).
		// @formatter:on
		return totalValue.add(hallmarkCharges).subtract(totalDiscount.add(hallmarkDiscount)).add(totalTax);
	}

	@Override
	public UpdateInvItemAndSalesItemDto getInvIdsAndSalesItemsForUpdate(List<SalesItemDto> salesItemDtoList,
			List<String> binGroupCodeList) {

		boolean isReserverdBin = binGroupCodeList.contains(BinGroupEnum.RESERVEBIN.name());
		List<UpdateInventoryDto> updateInventoryDtoList = new ArrayList<>();

		Map<ItemCodeInvWeightDto, SalesItemDto> coinsItemCodeAndSalesItemDetailsMap = new HashMap<>();
		// get item inventory ids
		salesItemDtoList.forEach(salesItemDto -> {
			if (SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(salesItemDto.getProductGroupCode())
					|| SalesConstants.SILVER_COIN_PRODUCT_GROUP_CODE.equals(salesItemDto.getProductGroupCode())) {
				coinsItemCodeAndSalesItemDetailsMap.put(
						new ItemCodeInvWeightDto(salesItemDto.getItemCode(), salesItemDto.getInventoryWeight()),
						salesItemDto);
			} else {
				UpdateInventoryDto updateInventoryDto = new UpdateInventoryDto();
				updateInventoryDto.setId(salesItemDto.getInventoryId());
				updateInventoryDto.setTotalQuantity(salesItemDto.getTotalQuantity());

				updateInventoryDtoList.add(updateInventoryDto);
			}
		});

		if (!CollectionUtils.isEmpty(updateInventoryDtoList)) {
			checkIfItemsAreInRequest(updateInventoryDtoList);
		}

		UpdateInvItemAndSalesItemDto updateInvAndSalesDetails = new UpdateInvItemAndSalesItemDto();

		// get coin inventory ids
		if (!CollectionUtils.isEmpty(coinsItemCodeAndSalesItemDetailsMap)) {

			Map<ItemCodeInvWeightDto, List<InventoryDetailsDao>> itemCodeAndInvCoinsMap = inventoryService
					.getInvCoinDetails(coinsItemCodeAndSalesItemDetailsMap, binGroupCodeList, isReserverdBin);
			updateInvAndSalesDetails = getUpdateInvItemDtoAndSalesItemDetails(coinsItemCodeAndSalesItemDetailsMap,
					itemCodeAndInvCoinsMap);

		}

		// add 'updateInventoryDtoList' list to updateInvAndSalesDetails
		if (!CollectionUtils.isEmpty(updateInventoryDtoList)) {
			if (!CollectionUtils.isEmpty(updateInvAndSalesDetails.getUpdateInventoryDtoList())) {
				updateInvAndSalesDetails.getUpdateInventoryDtoList().addAll(updateInventoryDtoList);
			} else {
				updateInvAndSalesDetails.setUpdateInventoryDtoList(updateInventoryDtoList);
			}
		}

		return updateInvAndSalesDetails;
	}

	@Override
	public void checkIfItemsAreInRequest(List<UpdateInventoryDto> itemDetails) {
		List<String> inventoryIds = new ArrayList<>();
		for (UpdateInventoryDto item : itemDetails) {
			inventoryIds.add(item.getId());
		}
		List<InventoryDetailsDao> inventoryDetailsList = inventoryService.getItemsByIdAndLocationCode(inventoryIds);
		// if list is not empty
		if (!CollectionUtils.isEmpty(inventoryDetailsList)) {
			// check if items are in ADJ/PSV Request, then throw error.
			inventoryDetailsList.forEach(inventoryDetail -> {
				Short qty = 0;
				for (int i = 0; i < itemDetails.size(); i++) {
					if ((itemDetails.get(i).getId()).equals(inventoryDetail.getId())) {
						qty = itemDetails.get(i).getTotalQuantity();
					}
				}
				if (inventoryDetail.getRequestType() != null) {
					if ((SalesConstants.ADJ.equals(inventoryDetail.getRequestType()))
							&& inventoryDetail.getRequestQuantity() >= qty) {
						throw new ServiceException(SalesConstants.STOCK_UNDER_ADJ_REQUEST, SalesConstants.ERR_SALE_443);
					}

					if ((inventoryDetail.getRequestType().equals(SalesConstants.PSV))
							&& inventoryDetail.getRequestQuantity() >= qty) {
						throw new ServiceException(SalesConstants.STOCK_UNDER_PSV_REQUEST, SalesConstants.ERR_SALE_444);
					}
				}
			});
		}
	}

	private UpdateInvItemAndSalesItemDto getUpdateInvItemDtoAndSalesItemDetails(
			Map<ItemCodeInvWeightDto, SalesItemDto> coinsItemCodeAndSalesItemDetailsMap,
			Map<ItemCodeInvWeightDto, List<InventoryDetailsDao>> itemCodeAndInvCoinsMap) {

		if (CollectionUtils.isEmpty(itemCodeAndInvCoinsMap.values())) {
			throw new ServiceException(SalesConstants.ITEM_NOT_AVAILABLE, SalesConstants.ERR_SALE_131,
					"Items not available in inventory for the item codes: "
							+ coinsItemCodeAndSalesItemDetailsMap.keySet());
		}

		List<UpdateInventoryDto> updateInventoryCoinDtoList = new ArrayList<>();
		List<SalesItemDto> salesDetailsListToSave = new ArrayList<>();
		Map<ItemCodeInvWeightDto, ReqAndFountQtyDto> itemCodesWhichLackInvQty = new HashMap<>();

		Set<ItemCodeInvWeightDto> itemCodeAndWeightSet = coinsItemCodeAndSalesItemDetailsMap.keySet();

		itemCodeAndWeightSet.forEach(itemCodeAndWeightDto -> {
			if (itemCodeAndInvCoinsMap.containsKey(itemCodeAndWeightDto)
					&& !CollectionUtils.isEmpty(itemCodeAndInvCoinsMap.get(itemCodeAndWeightDto))) {
				invItemUpdateList(itemCodeAndWeightDto, coinsItemCodeAndSalesItemDetailsMap.get(itemCodeAndWeightDto),
						itemCodeAndInvCoinsMap.get(itemCodeAndWeightDto), itemCodesWhichLackInvQty,
						updateInventoryCoinDtoList, salesDetailsListToSave);
			} else {
				itemCodesWhichLackInvQty.put(itemCodeAndWeightDto, new ReqAndFountQtyDto(
						coinsItemCodeAndSalesItemDetailsMap.get(itemCodeAndWeightDto).getTotalQuantity(), (short) 0));
			}
		});

		// if reqQty is not found
		if (!CollectionUtils.isEmpty(itemCodesWhichLackInvQty)) {
			throw new ServiceException(SalesConstants.ITEM_NOT_AVAILABLE, SalesConstants.ERR_SALE_131,
					"Items with proper quantity are not available in inventory for the item codes: "
							+ itemCodesWhichLackInvQty);
		}

		return new UpdateInvItemAndSalesItemDto(updateInventoryCoinDtoList, salesDetailsListToSave);
	}

	private void invItemUpdateList(ItemCodeInvWeightDto itemCodeAndWeightDto, SalesItemDto salesItemDto,
			List<InventoryDetailsDao> invDaoList, Map<ItemCodeInvWeightDto, ReqAndFountQtyDto> itemCodesWhichLackInvQty,
			List<UpdateInventoryDto> updateInventoryCoinDtoList, List<SalesItemDto> salesDetailsListToSave) {

		// sort result list based on totalQuantity - used to pick invId from record
		// which has min totalQuantity
		Collections.sort(invDaoList, Comparator.comparing(InventoryDetailsDao::getTotalQuantity));

		List<UpdateInventoryDto> updateInvDtoListForEachItemCode = new ArrayList<>();
		Map<String, ItemInvDetailsDto> itemInvDetails = new HashMap<>();

		Short qtyLeftToAdd = salesItemDto.getTotalQuantity();// 2
		List<InventoryDetailsDao> invDaoForSalesDetailsUpdate = new ArrayList<>();
		// remove inve
		for (InventoryDetailsDao invDao : invDaoList) {
			UpdateInventoryDto updateInvDto = new UpdateInventoryDto();
			updateInvDto.setId(invDao.getId());
			// if reqQty is less or equal to invQty
			if (qtyLeftToAdd.compareTo(invDao.getTotalQuantity()) <= 0) {
				updateInvDto.setTotalQuantity(qtyLeftToAdd);
				qtyLeftToAdd = 0;
				invDaoForSalesDetailsUpdate.add(invDao);
			} else {
				updateInvDto.setTotalQuantity(invDao.getTotalQuantity());
				qtyLeftToAdd = (short) (qtyLeftToAdd - invDao.getTotalQuantity());// 2-1 = 1
				invDaoForSalesDetailsUpdate.add(invDao);
			}

			// set item inv details
			getItemInvDetails(salesItemDto, updateInvDto, invDao, itemInvDetails);
			updateInvDtoListForEachItemCode.add(updateInvDto);

			if (qtyLeftToAdd.compareTo((short) 0) == 0) {
				break;
			}

		}

		if (qtyLeftToAdd.compareTo((short) 0) != 0) {
			itemCodesWhichLackInvQty.put(itemCodeAndWeightDto, new ReqAndFountQtyDto(salesItemDto.getTotalQuantity(),
					(short) (salesItemDto.getTotalQuantity() - qtyLeftToAdd)));
		} else {
			updateInventoryCoinDtoList.addAll(updateInvDtoListForEachItemCode);

			Map<String, InventoryDetailsDao> invDetailsMap = invDaoForSalesDetailsUpdate.stream()
					.collect(Collectors.toMap(InventoryDetailsDao::getId, invDetail -> invDetail));

			// if reqQty found in single inv record, then update SalesDetails with lot,
			// binCode, invId and isHallmarked
			if (updateInvDtoListForEachItemCode.size() == 1) {

				InventoryDetailsDao invDao = invDetailsMap.get(updateInvDtoListForEachItemCode.get(0).getId());
				salesItemDto.setLotNumber(invDao.getLotNumber());
				salesItemDto.setBinCode(invDao.getBinCode());
				salesItemDto.setBinGroupCode(invDao.getBinGroupCode());
				salesItemDto.setInventoryId(invDao.getId());
				salesItemDto.setIsHallmarked(invDao.getIsHallmarked());
			}

			salesDetailsListToSave.add(salesItemDto);
		}

	}

	/**
	 * @param salesItemDto
	 * @param updateInvDtoListForEachItemCode
	 * @param invDaoForSalesDetailsUpdate
	 * @param invDetailsMap
	 * @param itemInvDetails
	 */
	private void getItemInvDetails(SalesItemDto salesItemDto, UpdateInventoryDto updateInvDtoForEachItemCode,
			InventoryDetailsDao invDao, Map<String, ItemInvDetailsDto> itemInvDetails) {

		ItemInvDetailsDto itemInvDetailsDto = (ItemInvDetailsDto) MapperUtil.getDtoMapping(invDao,
				ItemInvDetailsDto.class);
		itemInvDetailsDto.setInventoryId(invDao.getId());
		itemInvDetailsDto.setQuantity(updateInvDtoForEachItemCode.getTotalQuantity());

		itemInvDetails.put(invDao.getId(), itemInvDetailsDto);

		// set item details to salesItemDto
		salesItemDto.setItemInvDetails(itemInvDetails);

	}

	@Override
	public void checkRemarksForTxnBasedOnInputStatus(String status, String txnType, String remarks) {
		// current check - if status is not 'CONFIRMED' or 'HOLD', then remarks is
		// mandatory irrespective of txnType.
		if (!List.of(TransactionStatusEnum.CONFIRMED.name(), TransactionStatusEnum.HOLD.name()).contains(status)
				&& StringUtils.isEmpty(remarks)) {
			throw new ServiceException(SalesConstants.PLEASE_PROVIDE_REMARKS, SalesConstants.ERR_SALE_170,
					"Please provide remarks for the transaction.");
		}
	}

	@Override
	public Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> getPaymentMapDetailsByTxnId(SalesTxnDaoExt salesTxn,
			boolean excludeOldPayments, boolean isAllPayments) {

		List<PaymentDetailsDaoExt> payments = paymentDetailsRepository
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(salesTxn.getId(), null, null, null,
						CommonUtil.getLocationCode(), List.of(PaymentStatusEnum.COMPLETED.name()));

		if (BooleanUtils.isFalse(isAllPayments)) {
			// Filters the payments for which Credit Note is already generated
			if (BooleanUtils.isTrue(excludeOldPayments)) {

				payments = payments.stream().filter(payment -> BooleanUtils.isTrue(payment.getIsEditable()))
						.collect(Collectors.toList());

				log.info("New payemnts of sales txn - {} {}", payments, salesTxn.getId());

			}
		}

		// for payment group singularity considered,
		// make payment code same as payment group code
		payments.forEach(paymentDetail -> {
			if (SalesUtil.isPaymentGroupToBeConsidered(paymentDetail.getPaymentGroup()))
				paymentDetail.setPaymentCode(paymentDetail.getPaymentGroup());
		});

		return payments.stream().collect(Collectors.groupingBy(PaymentDetailsDaoExt::getPaymentCodeAndGroup));
	}

	@Override
	public WeightDetailsDto getTotalWeightSplitDetails(
			Map<String, WeightDetailsAndQtyDto> weightDetailsListAndQtyList) {
		BigDecimal initalValue = BigDecimal.ZERO;
		WeightDetailsDto totalWeightDetailsDto = new WeightDetailsDto(initalValue, initalValue, initalValue,
				initalValue, initalValue, initalValue);

		if (weightDetailsListAndQtyList != null && weightDetailsListAndQtyList.size() != 0) {
			for (Map.Entry<String, WeightDetailsAndQtyDto> itemWeightDetails : weightDetailsListAndQtyList.entrySet()) {

				JsonData jsonData = MapperUtil.mapObjToClass(itemWeightDetails.getValue().getWeightDetails(),
						JsonData.class);
				WeightDetailsDto eachItemWeightDetails = MapperUtil.mapObjToClass(jsonData.getData(),
						WeightDetailsDto.class);

				BigDecimal goldWeight = eachItemWeightDetails.getGoldWeight() == null ? BigDecimal.ZERO
						: eachItemWeightDetails.getGoldWeight()
								.multiply(BigDecimal.valueOf(itemWeightDetails.getValue().getQuantity()));

				BigDecimal platinumWeight = eachItemWeightDetails.getPlatinumWeight() == null ? BigDecimal.ZERO
						: eachItemWeightDetails.getPlatinumWeight()
								.multiply(BigDecimal.valueOf(itemWeightDetails.getValue().getQuantity()));

				BigDecimal silverWeight = eachItemWeightDetails.getSilverWeight() == null ? BigDecimal.ZERO
						: eachItemWeightDetails.getSilverWeight()
								.multiply(BigDecimal.valueOf(itemWeightDetails.getValue().getQuantity()));

				// sum weights to total weight
				totalWeightDetailsDto.setGoldWeight(totalWeightDetailsDto.getGoldWeight().add(goldWeight));
				totalWeightDetailsDto.setPlatinumWeight(totalWeightDetailsDto.getPlatinumWeight().add(platinumWeight));
				totalWeightDetailsDto.setSilverWeight(totalWeightDetailsDto.getSilverWeight().add(silverWeight));
			}
		}

		return totalWeightDetailsDto;
	}

	// Method to sum up weight details
	@Override
	public WeightDetailsDto sumUpWeightDetails(List<String> weightDetailsList) {
		BigDecimal initalValue = BigDecimal.ZERO;
		WeightDetailsDto totalWeightDetailsDto = new WeightDetailsDto(initalValue, initalValue, initalValue,
				initalValue, initalValue, initalValue);
		if (!CollectionUtils.isEmpty(weightDetailsList)) {
			weightDetailsList.forEach(weightDetails -> {

				JsonData jsonData = MapperUtil.mapObjToClass(weightDetails, JsonData.class);
				WeightDetailsDto eachWeightDetail = MapperUtil.mapObjToClass(jsonData.getData(),
						WeightDetailsDto.class);

				BigDecimal goldWeight = eachWeightDetail.getGoldWeight() == null ? BigDecimal.ZERO
						: eachWeightDetail.getGoldWeight();
				BigDecimal platinumWeight = eachWeightDetail.getPlatinumWeight() == null ? BigDecimal.ZERO
						: eachWeightDetail.getPlatinumWeight();
				BigDecimal silverWeight = eachWeightDetail.getSilverWeight() == null ? BigDecimal.ZERO
						: eachWeightDetail.getSilverWeight();

				totalWeightDetailsDto.setGoldWeight(totalWeightDetailsDto.getGoldWeight().add(goldWeight));
				totalWeightDetailsDto.setPlatinumWeight(totalWeightDetailsDto.getPlatinumWeight().add(platinumWeight));
				totalWeightDetailsDto.setSilverWeight(totalWeightDetailsDto.getSilverWeight().add(silverWeight));

			});
		}

		return totalWeightDetailsDto;
	}

	@Override
	public GepAndItemIdDetailsResponseDto getGoodsExchangeAndItemIdDetails(GoodsExchangeDaoExt goodsExchangeDao,
			List<GoodsExchangeDetailsDaoExt> goodsDetailsList) {
		List<String> strList = new ArrayList<>();
		GepAndItemIdDetailsResponseDto gepAndItemIdDetailsRespDto = (GepAndItemIdDetailsResponseDto) MapperUtil
				.getDtoMapping(goodsExchangeDao, GepAndItemIdDetailsResponseDto.class);
		if (goodsExchangeDao.getSalesTxn().getRefTxnId() != null) {
			gepAndItemIdDetailsRespDto.setRefDocDate(goodsExchangeDao.getSalesTxn().getRefTxnId().getDocDate());
		}
		if (goodsExchangeDao.getSalesTxn().getCustomerDocDetails() != null)
			gepAndItemIdDetailsRespDto.setApprovalDetails(
					MapperUtil.getJsonFromString(goodsExchangeDao.getSalesTxn().getCustomerDocDetails()));
		goodsDetailsList.forEach(data -> strList.add(data.getId()));
		gepAndItemIdDetailsRespDto.setItemIdList(strList);
		MetalRateListDto metalRateList = mapMetalRateJsonToDto(goodsExchangeDao.getSalesTxn().getMetalRateDetails());
		gepAndItemIdDetailsRespDto.setTaxDetails(MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(goodsExchangeDao.getTaxDetails()), TaxDetailsListDto.class));
		gepAndItemIdDetailsRespDto.setMetalRateList(metalRateList);
		// manual bill details
		if (!StringUtils.isEmpty(goodsExchangeDao.getSalesTxn().getManualBillDetails())) {
			ManualBillTxnDetailsDto manualBillDetails = mapJsonToManualBillDetails(
					goodsExchangeDao.getSalesTxn().getManualBillDetails());
			gepAndItemIdDetailsRespDto.setManualBillDetails(manualBillDetails);
		}
		JsonData exchangeDetailsJson = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(goodsExchangeDao.getExchangeDetails()), JsonData.class);
		gepAndItemIdDetailsRespDto.setExchangeDetails(exchangeDetailsJson);
		MapperUtil.beanMapping(goodsExchangeDao.getSalesTxn(), gepAndItemIdDetailsRespDto);
		List<CreditNoteDaoExt> creditNoteList = creditNoteService
				.getCreditNotesBySalesTxn(goodsExchangeDao.getSalesTxn());
		if (!CollectionUtils.isEmpty(creditNoteList)) {
			CreditNoteDaoExt creditNoteDaoExt = creditNoteList.stream()
					.filter(cn -> ((cn.getOriginalCn() != null) && (cn.getId()).equals(cn.getOriginalCn().getId())))
					.findAny().get();
			gepAndItemIdDetailsRespDto.setCnDocNo(creditNoteDaoExt.getDocNo());
		}
		Optional<CustomerTxnDaoExt> customerTxnDao = customerTxnDetailsRepository.findById(goodsExchangeDao.getId());
		
		customerTxnDao.ifPresent(custTxnDao -> {
			gepAndItemIdDetailsRespDto.setCustTaxNo(CryptoUtil.decrypt(custTxnDao.getCustTaxNo(), CUST_TAX_NO,false));
			gepAndItemIdDetailsRespDto.setCustTaxNoOld(CryptoUtil.decrypt(custTxnDao.getCustTaxNoOld(), CUST_TAX_NO_OLD,false));
			gepAndItemIdDetailsRespDto.setMobileNumber(CryptoUtil.decrypt(custTxnDao.getMobileNumber(),MOBILE_NO,false));
			gepAndItemIdDetailsRespDto.setInstiTaxNo(CryptoUtil.decrypt(custTxnDao.getInstiTaxNo(),INSTI_TAX_NO,false));
			gepAndItemIdDetailsRespDto.setEmailId(CryptoUtil.decrypt(custTxnDao.getEmailId(),EMAIL_ID,false));
			gepAndItemIdDetailsRespDto.setCustomerName(CryptoUtil.decrypt(custTxnDao.getCustomerName(),CUSTOMER_NAME,false));
            gepAndItemIdDetailsRespDto.setPassportId(CryptoUtil.decrypt(custTxnDao.getPassportId(),PASSPORT_ID,false));
		});
		gepAndItemIdDetailsRespDto.setRefundDetails(MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(goodsExchangeDao.getRefundDetails()), JsonData.class));
		return gepAndItemIdDetailsRespDto;
	}

	/**
	 * This method will check if sales transaction exists based on salesTxnId.
	 * 
	 * @param transactionId
	 * @param transactionType
	 * @return SalesTxnDao
	 */
	@Override
	public SalesTxnDaoExt checkIfSalesTxnIdExistsWithTransactionType(String transactionId, String transactionType) {
		SalesTxnDaoExt salesTxnDao = salesTxnRepositoryExt.findByIdAndLocationCodeAndTxnType(transactionId,
				CommonUtil.getLocationCode(), transactionType);

		if (salesTxnDao == null) {
			throw new ServiceException(SalesConstants.INVALID_SALES_TRANSACTION_ID, SalesConstants.ERR_SALE_003);
		}

		return salesTxnDao;
	}

	@Override
	public void checkPaymentItemMapping(String itemId) {

		List<PaymentItemMappingDaoExt> paymentItemMappingList = paymentItemMappingRepository.findByItemId(itemId);
		// if payment exists, then cannot update/delete item
		if (!CollectionUtil.isEmpty(paymentItemMappingList)) {
			List<String> paymentCodeList = paymentItemMappingList.stream()
					.map(paymentItemMap -> paymentItemMap.getPaymentDetailsDao().getPaymentCode())
					.collect(Collectors.toList());
			throw new ServiceException(
					SalesConstants.PLEASE_REVERSE_FOLLOWING_DYNAMIC_PAYMENTS_TO_MAKE_UPDATES_TO_ITEM_LIST,
					SalesConstants.ERR_SALE_084,
					"Delete following customer related payments (if added) to make item updates. - " + paymentCodeList,
					Map.of(PAYMENT_CODE_CONST, paymentCodeList.toString()));
		}

	}

	@Override
	public void checkDiscountDetails(SalesTxnDaoExt salesTxnDao, JsonData discountDetails) {
		DiscountTransactionDetails discountDetailsDto = MapperUtil.mapObjToClass(discountDetails.getData(),
				DiscountTransactionDetails.class);
		discountDetailsDto.validate(discountDetailsDto);

		JsonData jsonData = MapperUtil.mapObjToClass(salesTxnDao.getDiscountTxnDetails(), JsonData.class);

		DiscountTransactionDetails discountDetailsDtoExisting;
		if (jsonData == null || jsonData.getData() == null) {
			discountDetailsDtoExisting = new DiscountTransactionDetails();
		} else {
			discountDetailsDtoExisting = MapperUtil.mapObjToClass(jsonData.getData(), DiscountTransactionDetails.class);
		}

		discountDetailsDtoExisting.setEncircleDetails(discountDetailsDto.getEncircleDetails());
		salesTxnDao.setDiscountTxnDetails(MapperUtil
				.getStringFromJson(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountDetailsDtoExisting)));

	}

	@Override
	public void checkNomineeDetails(OrderDaoExt orderDao, JsonData nomineeDetails) {
		NomineeDetails nomineeDetailsDto = MapperUtil.mapObjToClass(nomineeDetails.getData(), NomineeDetails.class);
		nomineeDetailsDto.validate(nomineeDetailsDto);

		orderDao.setNomineeDetails(
				MapperUtil.getStringFromJson(new JsonData(SalesConstants.NOMINEE_DETAILS, nomineeDetailsDto)));

	}

	@Override
	public void discountValidationsOnConfirmTransaction(SalesTxnDaoExt salesTxn) {
		Set<String> openDiscounts = discountUtilService.checkIfAnyAppliedDiscountsAreInOpenStatus(salesTxn);
		if (!CollectionUtils.isEmpty(openDiscounts)) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST
					+ "Discounts in OPEN status should be CONFIRMED to Proceed further :- " + openDiscounts.toString(),
					"ERR-SALE-311",
					Map.of("errorMessage", "Discounts in OPEN status should be CONFIRMED to Proceed further",
							"errorDetails", openDiscounts.toString()));
		}
	}

	@Override
	public void discountValidationsOnCustomerUpdate(SalesTxnDaoExt salesTxn, Integer newCustomerIdForUpdate) {
		Set<String> customerDependentDiscounts = discountUtilService
				.checkIfAnyCustomerDependentDiscountsApplied(salesTxn, newCustomerIdForUpdate);
		if (!CollectionUtils.isEmpty(customerDependentDiscounts)) {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST
							+ "Customer Dependent discounts should be removed to Update the customer :- "
							+ customerDependentDiscounts.toString(),
					"ERR-SALE-311",
					Map.of("errorMessage", "Customer Dependent discounts should be removed to Update the customer",
							"errorDetails", customerDependentDiscounts.toString()));
		}
	}

	@Override
	public EinvoiceIrnDetailsResponseDto generateInvoice(String txnType,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, SalesTxnDaoExt salesTxn,
			GoodsExchangeDaoExt goodsExchangeDaoExt, CustomerTxnDaoExt customerTxnDaoExt) {
		EinvoiceIrnDetailsResponseDto einvoiceIrnDetailsResponseDto = new EinvoiceIrnDetailsResponseDto();
		if (!StringUtils.isEmpty(customerTxnDaoExt.getInstiTaxNo())) {
			EinvoiceIrnDetailsDto einvoiceIrnDetailsDto = getCustomerDetails(customerTxnDaoExt.getInstiTaxNo(),customerTxnDaoExt.getCustomerName(),
					customerTxnDaoExt.getCustomerDetails(), salesTxn.getDocNo(), salesTxn.getDocDate());
			einvoiceIrnDetailsDto.setTransactionId(salesTxn.getId());
			List<EinvoiceItemDetailsDto> einvoiceItemDetailsDto = new ArrayList<>();
			goodsExchangeDetailsList.forEach(goodsExchangeDetail -> {
				EinvoiceItemDetailsDto einvoiceItemDetails = new EinvoiceItemDetailsDto();
				einvoiceItemDetails.setSerialNo(goodsExchangeDetailsList.indexOf(goodsExchangeDetail) + 1);
				List<String> itemCodes = new ArrayList<>();
				itemCodes.add(goodsExchangeDetail.getItemCode());
				Map<String, ItemDetailsDto> itemsDetailMap = engineService.listItemDetails(itemCodes);
				ItemDetailsDto itemDetailsDto = itemsDetailMap.get(goodsExchangeDetail.getItemCode());
				if (itemDetailsDto.getHsnCode() != null)
					einvoiceItemDetails.setHsnCode(itemDetailsDto.getHsnCode());
				einvoiceItemDetails.setQuantity(goodsExchangeDetail.getQuantity().intValue());
				einvoiceItemDetails.setUnit(salesTxn.getWeightUnit());
				einvoiceItemDetails.setUnitPrice(goodsExchangeDetail.getUnitValue());
				if (!StringUtils.isEmpty(goodsExchangeDetail.getTaxDetails())) {
					TaxCalculationResponseDto taxCalculationResponseDto = MapperUtil.getObjectMapperInstance()
							.convertValue(MapperUtil.getJsonFromString(goodsExchangeDetail.getTaxDetails()),
									TaxCalculationResponseDto.class);
					einvoiceItemDetails = getTaxDetails(taxCalculationResponseDto, einvoiceItemDetails);
				}

				einvoiceItemDetailsDto.add(einvoiceItemDetails);
			});
			einvoiceIrnDetailsDto.setEinvoiceItemDetailsDto(einvoiceItemDetailsDto);
			if (txnType.equalsIgnoreCase(TransactionTypeEnum.TEP.name())) {
				einvoiceIrnDetailsResponseDto = integrationService.generateIrn(VendorCodeEnum.IRN_ASPTAX.name(),
						EinvoiceTransactionTypeEnum.TEP.name(), einvoiceIrnDetailsDto);
			} else {
				einvoiceIrnDetailsResponseDto = integrationService.generateIrn(VendorCodeEnum.IRN_ASPTAX.name(),
						EinvoiceTransactionTypeEnum.GEP.name(), einvoiceIrnDetailsDto);
			}
		}
		return einvoiceIrnDetailsResponseDto;
	}

	@Override
	public EinvoiceIrnDetailsDto getCustomerDetails(String instiTaxNo, String customerName, String customerDetails,
			Integer docNo, Date docDate) {
		EinvoiceIrnDetailsDto einvoiceIrnDetailsDto = new EinvoiceIrnDetailsDto();
		einvoiceIrnDetailsDto.setDocNo(docNo.toString());
		einvoiceIrnDetailsDto.setDocDate(docDate);
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		StoreDetails storeDetails = locationCacheDto.getStoreDetails();
		TaxDetails taxDetails = locationCacheDto.getTaxDetails();
		if (taxDetails.getGstRegisterationNo() != null)
			einvoiceIrnDetailsDto.setSellerGstn(taxDetails.getGstRegisterationNo());
		einvoiceIrnDetailsDto.setSellerName(storeDetails.getCompanyName());
		einvoiceIrnDetailsDto.setSellerPinCode(Integer.parseInt(storeDetails.getPincode()));
		einvoiceIrnDetailsDto.setSellerlocation(CommonUtil.getLocationCode());
		einvoiceIrnDetailsDto.setBuyerGstn(instiTaxNo);
		einvoiceIrnDetailsDto.setBuyerName(customerName);
		List<String> addressDetails = storeDetails.getAddressLines();
		einvoiceIrnDetailsDto = getAddressDetails(addressDetails, einvoiceIrnDetailsDto, customerDetails);
		return einvoiceIrnDetailsDto;
	}

	private EinvoiceIrnDetailsDto getAddressDetails(List<String> addressDetails,
			EinvoiceIrnDetailsDto einvoiceIrnDetailsDto, String customerDetails) {
		if (!CollectionUtils.isEmpty(addressDetails)) {
			String sellerAaddress1 = null;
			String sellerAddress2 = null;
			Integer size = addressDetails.size();
			if (size >= 1 && !StringUtils.isEmpty(addressDetails.get(0)))
				sellerAaddress1 = addressDetails.get(0);
			if (size >= 2 && !StringUtils.isEmpty(addressDetails.get(1)))
				sellerAaddress1 = sellerAaddress1 + ", " + addressDetails.get(1);
			einvoiceIrnDetailsDto.setSellerAddress1(sellerAaddress1);
			if (size >= 3 && !StringUtils.isEmpty(addressDetails.get(2)))
				sellerAddress2 = addressDetails.get(2);
			if (size >= 4 && !StringUtils.isEmpty(addressDetails.get(3)))
				sellerAddress2 = sellerAddress2 + ", " + addressDetails.get(3);
			einvoiceIrnDetailsDto.setSellerAddress2(sellerAddress2);
		}
		JsonObject jsonObject = new JsonParser().parse(customerDetails).getAsJsonObject();
		if (jsonObject.getAsJsonObject("data") != null) {
			JsonObject json = jsonObject.getAsJsonObject("data").getAsJsonObject();
			if (json.get("pincode") != null)
				einvoiceIrnDetailsDto.setBuyerPinCode(json.get("pincode").getAsInt());
			if (json.get("city") != null)
				einvoiceIrnDetailsDto.setBuyerlocation(json.get("city").getAsString());
			if (json.getAsJsonArray(ADDRESS) != null && json.getAsJsonArray(ADDRESS).size() != 0) {
				JsonArray jsonAddress = json.getAsJsonArray(ADDRESS);
				if (jsonAddress != null) {
					String buyerAddress1 = null;
					String buyerAddress2 = null;
					Integer size = jsonAddress.size();
					if (size >= 1 && !StringUtils.isEmpty(jsonAddress.get(0)))
						buyerAddress1 = jsonAddress.get(0).getAsString();
					if (size >= 2 && !StringUtils.isEmpty(jsonAddress.get(1)))
						buyerAddress1 = buyerAddress1 + ", " + jsonAddress.get(1).getAsString();
					einvoiceIrnDetailsDto.setBuyerAddress1(buyerAddress1);
					if (size >= 3 && !StringUtils.isEmpty(jsonAddress.get(2)))
						buyerAddress2 = jsonAddress.get(2).getAsString();
					if (size >= 4 && !StringUtils.isEmpty(jsonAddress.get(3)))
						buyerAddress2 = buyerAddress2 + ", " + jsonAddress.get(3).getAsString();
					einvoiceIrnDetailsDto.setBuyerAddress2(buyerAddress2);
				}
			}
		}
		return einvoiceIrnDetailsDto;
	}

	@Override
	public EinvoiceItemDetailsDto getTaxDetails(TaxCalculationResponseDto taxCalculationResponseDto,
			EinvoiceItemDetailsDto einvoiceItemDetails) {
		if (taxCalculationResponseDto != null) {
			Map<String, TaxDetailDto> data = taxCalculationResponseDto.getData();
			if (!CollectionUtils.isEmpty(data)) {
				if (data.get("SGST") != null) {
					TaxDetailDto sgstDetails = data.get("SGST");
					if (sgstDetails != null) {
						if (sgstDetails.getTaxValue() != null)
							einvoiceItemDetails.setSgstAmount(sgstDetails.getTaxValue());
						if (sgstDetails.getTaxPercentage() != null) {
							einvoiceItemDetails.setSgstRate(sgstDetails.getTaxPercentage());
						}
					}
				}
				if (data.get("UTGST") != null) {
					TaxDetailDto utgstDetails = data.get("UTGST");
					if (utgstDetails != null) {
						if (utgstDetails.getTaxValue() != null)
							einvoiceItemDetails.setSgstAmount(utgstDetails.getTaxValue());
						if (utgstDetails.getTaxPercentage() != null) {
							einvoiceItemDetails.setSgstRate(utgstDetails.getTaxPercentage());
						}
					}
				}
				if (data.get("CGST") != null) {
					TaxDetailDto cgstDetails = data.get("CGST");
					if (cgstDetails != null) {
						if (cgstDetails.getTaxValue() != null)
							einvoiceItemDetails.setCgstAmount(cgstDetails.getTaxValue());
						if (cgstDetails.getTaxPercentage() != null) {
							einvoiceItemDetails.setCgstRate(cgstDetails.getTaxPercentage());
						}
					}
				}
				if (data.get("IGST") != null) {
					TaxDetailDto igstDetails = data.get("IGST");
					if (igstDetails != null) {
						if (igstDetails.getTaxValue() != null) {
							einvoiceItemDetails.setIgstAmount(igstDetails.getTaxValue());
						}
						if (igstDetails.getTaxPercentage() != null) {
							einvoiceItemDetails.setIgstRate(igstDetails.getTaxPercentage());
						}
					}
				}
			}
			Map<String, CessDetailDto> cess = taxCalculationResponseDto.getCess();
			if (!CollectionUtils.isEmpty(cess)) {
				BigDecimal totalCess = BigDecimal.ZERO;
				BigDecimal totalCessRate = BigDecimal.ZERO;
				for (CessDetailDto cessDetailDto : cess.values()) {
					if (cessDetailDto != null && cessDetailDto.getCessValue() != null)
						totalCess = totalCess.add(cessDetailDto.getCessValue());
					if (cessDetailDto != null && cessDetailDto.getCessPercentage() != null)
						totalCessRate = totalCessRate.add(cessDetailDto.getCessPercentage());
				}
				einvoiceItemDetails.setCessAmount(totalCess);
				einvoiceItemDetails.setCessRate(totalCessRate);
			}
		}
		return einvoiceItemDetails;
	}

	@Override
	public EventCustomerDetailsDto getEventCustomer(CustomerTxnDaoExt customer) {
		EventCustomerDetailsDto eventCustomerDetailsDto = new EventCustomerDetailsDto();
		eventCustomerDetailsDto.setCustomerId(customer.getCustomerId());
		eventCustomerDetailsDto.setCustomerName(customer.getCustomerName());
		JsonObject jsonObject = new JsonParser().parse(customer.getCustomerDetails()).getAsJsonObject();
		if (jsonObject.getAsJsonObject("data") != null) {
			JsonObject json = jsonObject.getAsJsonObject("data").getAsJsonObject();
			if (json.getAsJsonArray(ADDRESS) != null && json.getAsJsonArray(ADDRESS).size() != 0) {
				if (!StringUtils.isEmpty(json.getAsJsonArray(ADDRESS).get(0)))
					eventCustomerDetailsDto.setCustomerAddress(json.getAsJsonArray(ADDRESS).get(0).getAsString());
			}
		}
		return eventCustomerDetailsDto;
	}

	@Override
	public void hallmarkValuesValidation(PriceResponseDto priceResponseDto, BigDecimal inputHallmarkCharge,
			BigDecimal inputHallmarkDiscount) {
		BigDecimal hallmarkCharges = priceResponseDto.getPriceDetails().getItemHallmarkDetails()
				.getHallmarkingCharges() == null ? BigDecimal.ZERO
						: priceResponseDto.getPriceDetails().getItemHallmarkDetails().getHallmarkingCharges();
		BigDecimal hallmarkDiscount = BooleanUtils
				.isTrue(priceResponseDto.getPriceDetails().getItemHallmarkDetails().getIsFOCForHallmarkingCharges())
						? priceResponseDto.getPriceDetails().getItemHallmarkDetails().getHallmarkingCharges()
						: BigDecimal.ZERO;

		if (hallmarkCharges.compareTo(inputHallmarkCharge) != 0) {
			log.info("Input hallmark charges: " + inputHallmarkCharge + ", Calculated hallmark charges: "
					+ hallmarkCharges);
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Input hallmark charges: " + inputHallmarkCharge + ", Calculated hallmark charges: "
							+ hallmarkCharges);
		}
		if (hallmarkDiscount.compareTo(inputHallmarkDiscount) != 0) {
			log.info("Input hallmark discount: " + inputHallmarkDiscount + ", Calculated hallmark discount: "
					+ hallmarkDiscount);
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Input hallmark discount: " + inputHallmarkDiscount + ", Calculated hallmark discount: "
							+ hallmarkDiscount);
		}

	}

	@Override
	public void checkIfTcsAmountIsAdded(SalesTxnDaoExt salesTxnDao, boolean isCustomerUpdate) {
		// if TCS amount is added, then no updates allowed.
		if (TransactionTypeEnum.CM.name().equals(salesTxnDao.getTxnType())) {
			CustomerTcsDetailsDaoExt customerTcsDetailsDao = customerTcsDetailsRepository
					.findBySalesTxnDaoId(salesTxnDao.getId());
			Optional.ofNullable(customerTcsDetailsDao).ifPresent(customerTcsDetails -> {
				if (customerTcsDetails.getTcsAmountPaid() != null
						&& BigDecimal.ZERO.compareTo(customerTcsDetails.getTcsAmountPaid()) < 0) {
					String remarks = isCustomerUpdate ? "Clear TCS to change customer."
							: "Clear TCS for further updates.";
					throw new ServiceException(SalesConstants.CLEAR_TCS_AMOUNT_FOR_FURTHER_UPDATES_ON_TRANSACTION,
							SalesConstants.ERR_SALE_360, remarks);
				}
			});
		}

	}

	@Override
	public void checkItemType(String productGroupCode, PaymentDetailsDaoExt rateFreezedCNPayment,
			List<ItemDto> itemMasterDetailsList) {
		if (rateFreezedCNPayment == null) {
			return;
		}

		String metalType = itemMasterDetailsList.get(0).getItemTypeCode();
		JsonData jsonData = MapperUtil.mapObjToClass(rateFreezedCNPayment.getOtherDetails(), JsonData.class);
		CreditNotePaymentOtherDetailsDto cnOtherDetails = MapperUtil.mapObjToClass(jsonData.getData(),
				CreditNotePaymentOtherDetailsDto.class);

		if (!metalType.equals(cnOtherDetails.getFrozenRateDetails().getMetal())) {
			// throw error
			throw new ServiceException(
					SalesConstants.DYNAMIC_METALTYPE_ITEM_DOES_NOT_BELONG_TO_ALLOWED_CATEGORY_DYNAMIC_ALLOWEDCATEGORY,
					SalesConstants.ERR_SALE_362, "Item is not valid in current transaction",
					Map.of("metalType", MetalTypeCodeEnum.valueOf(metalType).getValue(), "allowedCategory",
							cnOtherDetails.getAllowedCategory()));
		}

		// check if pricing type product group code falls under allowed category
		Map<String, String> studdedProductCodes = engineService.getProductGroupList(AllowedCategoryForCN
				.getShortPrcingType(AllowedCategoryForCN.valueOf(cnOtherDetails.getAllowedCategory())), null);
		if (!studdedProductCodes.keySet().contains(productGroupCode)) {
			throw new ServiceException(
					SalesConstants.DYNAMIC_METALTYPE_ITEM_DOES_NOT_BELONG_TO_ALLOWED_CATEGORY_DYNAMIC_ALLOWEDCATEGORY,
					SalesConstants.ERR_SALE_362,
					"Item is not valid in current transaction as item belongs to product group: " + productGroupCode,
					Map.of("metalType", MetalTypeCodeEnum.valueOf(metalType).getValue(), "allowedCategory",
							cnOtherDetails.getAllowedCategory()));
		}

	}

	@Override
	public WeightDetailsDto getTotalWeightSplitDetailsForManualBill(
			Map<String, BigDecimal> weightDetailsListAndQtyList) {

		BigDecimal initalValue = BigDecimal.ZERO;
		WeightDetailsDto totalWeightDetailsDto = new WeightDetailsDto(initalValue, initalValue, initalValue,
				initalValue, initalValue, initalValue);

		if (weightDetailsListAndQtyList != null && weightDetailsListAndQtyList.size() != 0) {
			for (Map.Entry<String, BigDecimal> itemWeightDetails : weightDetailsListAndQtyList.entrySet()) {

				BigDecimal goldWeight = MetalTypeCodeEnum.J.name().equals(itemWeightDetails.getKey())
						? itemWeightDetails.getValue()
						: BigDecimal.ZERO;

				BigDecimal platinumWeight = MetalTypeCodeEnum.L.name().equals(itemWeightDetails.getKey())
						? itemWeightDetails.getValue()
						: BigDecimal.ZERO;

				BigDecimal silverWeight = MetalTypeCodeEnum.P.name().equals(itemWeightDetails.getKey())
						? itemWeightDetails.getValue()
						: BigDecimal.ZERO;

				// sum weights to total weight
				totalWeightDetailsDto.setGoldWeight(totalWeightDetailsDto.getGoldWeight().add(goldWeight));
				totalWeightDetailsDto.setPlatinumWeight(totalWeightDetailsDto.getPlatinumWeight().add(platinumWeight));
				totalWeightDetailsDto.setSilverWeight(totalWeightDetailsDto.getSilverWeight().add(silverWeight));
			}
		}

		return totalWeightDetailsDto;
	}

	@Override
	public TotalTaxAndTaxDetailsDto reverseTotalTaxDetails(Integer customerId, String itemCode, BigDecimal finalValue,
			TxnTaxTypeEnum taxTxnType, TaxCalculationResponseDto taxDetails) {

		log.info("Get tax details: customer id:" + customerId + ", item code: " + itemCode + ", txnType: " + taxTxnType
				+ ", location code: " + CommonUtil.getLocationCode());

		// if tax details json is empty then, call tax API.
		if (StringUtils.isEmpty(taxDetails)) {
			taxDetails = engineService.getTaxDetails(null, customerId, taxTxnType.name(), itemCode, false, null);
		}

		BigDecimal totalDivideComp = BigDecimal.ONE;// one for original price
		if (!taxDetails.getData().isEmpty()) {

			for (Entry<String, TaxDetailDto> taxDetailsDto : taxDetails.getData().entrySet()) {

				// if HMGST found, then ignore.
				if (!CommonConstants.HMGST.equals(taxDetailsDto.getKey())) {
					totalDivideComp = totalDivideComp
							.add(taxDetailsDto.getValue().getTaxPercentage() == null ? BigDecimal.ZERO
									: taxDetailsDto.getValue().getTaxPercentage().divide(BigDecimal.valueOf(100)));
				}
			}
		}

		if (!taxDetails.getCess().isEmpty()) {
			for (Entry<String, CessDetailDto> cessDetailsDto : taxDetails.getCess().entrySet()) {
				// TODO: how to check cess on tax?

				// cess on total value
				totalDivideComp = totalDivideComp
						.add(cessDetailsDto.getValue().getCessPercentage().divide(BigDecimal.valueOf(100)));
			}
		}
		BigDecimal totalValue = finalValue.divide(totalDivideComp, DomainConstants.PRICE_SCALE,
				DomainConstants.ROUNDIND_MODE);
		// for round off correction
		totalValue = totalValue.add(finalValue.subtract(totalValue.multiply(totalDivideComp)
				.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE)));
		// sent value is item value without tax
		return new TotalTaxAndTaxDetailsDto(null, taxDetails, totalValue);

	}

	@Override
	public GepAndItemIdDetailsResponseDto getCutPeiceGoodsExchangeAndItemIdDetails(
			StockTransactionDaoExt stockTransaction, List<StockTransactionDetailsDaoExt> stockTxnList) {
		GepAndItemIdDetailsResponseDto cutpeiceResponse = (GepAndItemIdDetailsResponseDto) MapperUtil
				.getObjectMapping(stockTransaction, new GepAndItemIdDetailsResponseDto());
		cutpeiceResponse.setFinalValue(stockTransaction.getTotalValue());
		if (stockTxnList != null && !stockTxnList.isEmpty()) {
			List<String> itemDetailsIds = stockTxnList.stream().map(std -> std.getId()).collect(Collectors.toList());
			cutpeiceResponse.setItemIdList(itemDetailsIds);
		}
		return cutpeiceResponse;
	}

	@Override
	public SalesTxnDaoExt saveSalesTxnForLegacyPulledCM(SalesTxnDaoExt salesTxnDao, String txnType) {

//		SalesTxnDaoExt salesTxnDao = salesTxnRepository.findByIdAndLocationCodeAndSourceType(txnId,
//				CommonUtil.getLocationCode(), TxnSourceType.LEGACY.name());
		List<String> txnTypes;
		CashMemoPullReasonTxnTypes cashMemoReason = null;
		if (salesTxnDao.getTxnSource() != null && salesTxnDao.getTxnSource().equals(TxnSourceType.LEGACY.name())) {
			JsonData jsonData = MapperUtil.mapObjToClass(salesTxnDao.getCashMemoPullReason(), JsonData.class);
			if (jsonData != null) {
				cashMemoReason = MapperUtil.getObjectMapperInstance().convertValue(jsonData.getData(),
						CashMemoPullReasonTxnTypes.class);
				txnTypes = cashMemoReason.getTxnTypes();
				if (!txnTypes.contains(txnType))
					txnTypes.add(txnType);
			} else {
				txnTypes = new ArrayList<String>();
				txnTypes.add(txnType);
				cashMemoReason = new CashMemoPullReasonTxnTypes();
				cashMemoReason.setTxnTypes(txnTypes);
			}

			salesTxnDao.setCashMemoPullReason(
					MapperUtil.getJsonString(new JsonData("CASH_MEMO_PULL_REASON", cashMemoReason)));
			salesTxnDao = salesTxnRepository.save(salesTxnDao);
		}
		return salesTxnDao;
	}

	@Override
	public boolean validateCustomerFields(Integer customerId) {
		String locationCode = CommonUtil.getLocationCode();
		CustomerDao customer = new CustomerDao();
		boolean flag = true;
		CustomerLocationMappingDao customerLocationMapping = checkIfCustomerExists(customerId, locationCode);
		if (customerLocationMapping != null) {
			customer = customerLocationMapping.getCustomer();
			log.info("customer location, customerId - {} {}", locationCode, customerId);
			flag = checkFieldLevelValidation(customer);
		} else {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST + "Customer details not found. Id: " + customerId
							+ ", locationCode: " + locationCode,
					SalesConstants.ERR_SALE_294, Map.of(SalesConstants.REMARKS,
							"Customer details not found. Id: " + customerId + ", locationCode: " + locationCode));
		}
		return flag;
	}

	private CustomerLocationMappingDao checkIfCustomerExists(Integer customerId, String locationCode) {
		CustomerLocationMappingDao customerLocationMapping = customerLocationMappingRepo
				.findByCustomerIdAndLocationCode(customerId, locationCode);
		return customerLocationMapping;
	}

	private boolean checkFieldLevelValidation(CustomerDao customerDao) {
		Map<String, String> dynamicValues = new HashMap<>();
		String title = customerDao.getTitle();
		customerDao.setMobileNumber(CryptoUtil.decrypt(customerDao.getMobileNumber(), MOBILENUMBER));

		String mobilenumber = customerDao.getMobileNumber();
		customerDao.setMobileNumber(CryptoUtil.encrypt(customerDao.getMobileNumber(), MOBILENUMBER));
		log.info("customerDao CustomerDetails :- " + customerDao.getCustomerDetails());
		JsonData jsonData = MapperUtil.mapObjToClass(customerDao.getCustomerDetails(), JsonData.class);
		log.info("JsonData CustomerDetails :- " + jsonData);
		// String catchmentName = null;
		String idNumber = null;
		String idProof = null;
		AddressDetails address = null;
		if (jsonData != null && jsonData.getType().equals(CustomerTypeEnum.REGULAR.name()) ){
			if (jsonData != null && jsonData.getData() != null) {
				address = MapperUtil.mapObjToClass(jsonData.getData(), AddressDetails.class);
				log.info("address from CustomerDetails :- " + address);

				// catchmentName = JsonUtils.getValueFromJsonString(jsonData.getData(),
				// "catchmentName");
				idNumber = JsonUtils.getValueFromJsonString(jsonData.getData(), "idNumber");
				idProof = JsonUtils.getValueFromJsonString(jsonData.getData(), "idProof");
			}

			if (org.apache.commons.lang.StringUtils.isBlank(title))
				dynamicValues.put(TITLE, title);
			if (org.apache.commons.lang.StringUtils.isBlank(mobilenumber))
				dynamicValues.put(MOBILENUMBER, mobilenumber);
			if (address.getAddressLines()==null || address.getAddressLines().isEmpty()) {
				dynamicValues.put(HOUSENUMBER, "");
				dynamicValues.put(STREET, "");
			}
			if (org.apache.commons.lang.StringUtils.isBlank(address.getCountry()))
				dynamicValues.put(COUNTRY, address.getCountry());
			if (org.apache.commons.lang.StringUtils.isBlank(address.getState()))
				dynamicValues.put(STATE, address.getState());
			if (org.apache.commons.lang.StringUtils.isBlank(address.getCity()))
				dynamicValues.put(CITY, address.getCity());
			if (org.apache.commons.lang.StringUtils.isBlank(address.getPincode()))
				dynamicValues.put(PINCODE, address.getPincode());
			if (org.apache.commons.lang.StringUtils.isBlank(address.getZone()))
				dynamicValues.put(ZONE, address.getZone());
			// if (org.apache.commons.lang.StringUtils.isBlank(catchmentName))
			// dynamicValues.put(CATCHMENTNAME, catchmentName);
			if (org.apache.commons.lang.StringUtils.isBlank(idNumber))
				dynamicValues.put(IDNUMBER, idNumber);
			if (org.apache.commons.lang.StringUtils.isBlank(idProof))
				dynamicValues.put(IDPROOF, idProof);

			if (!dynamicValues.isEmpty()) {
				return false;
			}
		}

		return true;

	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void savePaymentInNewTransaction(Map<String, String> paymentMap) {
		List<PaymentDetailsDaoExt> paymentList = paymentDetailsRepository.findAllById(paymentMap.keySet());
		paymentList.forEach(payment -> payment.setOtherDetails(paymentMap.get(payment.getId())));
		paymentDetailsRepository.saveAll(paymentList);

	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void paymentSetIsEditableToTrue(String txnId) {
		
		List<PaymentDetailsDaoExt> paymentList = paymentDetailsRepository.findBySalesTxnDaoId(txnId);
		paymentList.forEach(payment -> payment.setIsEditable(Boolean.TRUE));
		paymentDetailsRepository.saveAll(paymentList);

	}
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void paymentSetIsEditableToFalse(String txnId) {
		
		List<PaymentDetailsDaoExt> paymentList = paymentDetailsRepository.findBySalesTxnDaoId(txnId);
		paymentList.forEach(payment -> payment.setIsEditable(Boolean.FALSE));
		paymentDetailsRepository.saveAll(paymentList);

	}
	@Override
	public void finalConfirmForGhsPayments(SalesTxnDaoExt salesTxnDaoExt, List<PaymentDetailsDaoExt> ghsPaymentList,
			Map<String, CreditNoteDaoExt> ghsPaymentIdAndCreditNoteMap,
			Map<String, GhsPaymentOtherDetailsDto> ghsPaymentOtherDetalisMap) {

		ghsPaymentList.forEach(ghsPayment -> {

			CreditNoteDaoExt creditNote = ghsPaymentIdAndCreditNoteMap.get(ghsPayment.getId());
			GhsPaymentOtherDetailsDto ghsOtherDetailsDto = ghsPaymentOtherDetalisMap.get(ghsPayment.getId());

			GhsAccountMasterUpdateDto ghsAccountMasterUpdateDto = new GhsAccountMasterUpdateDto();
			ghsAccountMasterUpdateDto.setAccountNo(Integer.valueOf(ghsPayment.getInstrumentNo()));
			ghsAccountMasterUpdateDto.setBusinessDate(salesTxnDaoExt.getDocDate());
			ghsAccountMasterUpdateDto.setMaturedDocNo(salesTxnDaoExt.getDocNo());
			ghsAccountMasterUpdateDto.setMaturedDocType(salesTxnDaoExt.getTxnType());
			ghsAccountMasterUpdateDto.setFiscalYear(salesTxnDaoExt.getFiscalYear().intValue());

			// below fields needs to be sent
			ghsAccountMasterUpdateDto.setRedemptionAmount(ghsOtherDetailsDto.getBalance());
			ghsAccountMasterUpdateDto.setGhsBonus(ghsOtherDetailsDto.getBonus());
			ghsAccountMasterUpdateDto.setIsNewCn(true);
			ghsAccountMasterUpdateDto.setCnDocNo(creditNote.getDocNo());

			ghsOtherDetailsDto.setIsFinalUpdateCompleted(true);
			ghsPayment.setOtherDetails(
					MapperUtil.getStringFromJson(new JsonData(ghsPayment.getPaymentCode(), ghsOtherDetailsDto)));

			creditNote.setRefDocNo(salesTxnDaoExt.getDocNo());
			creditNote.setRefDocType(salesTxnDaoExt.getTxnType());
			creditNote.setRefFiscalYear(salesTxnDaoExt.getFiscalYear());

			ghsPaymentIdAndCreditNoteMap.put(ghsPayment.getId(), creditNote);

			integrationService.updateGhsAccountMaster(VendorCodeEnum.GHS.name(), ghsAccountMasterUpdateDto);
		});

	}

	@Override
	public void manualCmOrAbCheck(SalesTxnDaoExt salesTxnDao, String itemTypeCode) {

		if (!SubTxnTypeEnum.getManualSubTxnTypes().contains(salesTxnDao.getSubTxnType())) {
			return;
		}

		// check if item is biMetal

		ManualBillTxnDetailsDto manualBillTxnDetailsDto = MapperUtil.mapObjToClass(salesTxnDao.getManualBillDetails(),
				ManualBillTxnDetailsDto.class);
		if (BooleanUtils.isTrue(manualBillTxnDetailsDto.getManualBillDetails().getIsBimetal())
				&& !List.of(CommonConstants.LJ, CommonConstants.JL).contains(itemTypeCode)) {
			throw new ServiceException("Only BiMetal products are allowed to add.", "ERR-ENG-038");
		} else if (BooleanUtils.isFalse(manualBillTxnDetailsDto.getManualBillDetails().getIsBimetal())
				&& List.of(CommonConstants.LJ, CommonConstants.JL).contains(itemTypeCode)) {
			throw new ServiceException("BiMetal Products are not allowed.", "ERR-ENG-039 ");
		}

	}

	@Override
	public void copyInvoiceDocuments() {		
		List<SalesInvoiceDocumentsDao> salesInvoiceDocumentsDaos = salesInvoiceDocumentsRepository.findAll();
		salesInvoiceDocService.syncDataInvoiceDocs(salesInvoiceDocumentsDaos);
	}

}
