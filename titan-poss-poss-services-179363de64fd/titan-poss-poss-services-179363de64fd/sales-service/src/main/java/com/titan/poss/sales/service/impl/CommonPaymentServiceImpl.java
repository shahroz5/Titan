/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import static com.titan.poss.sales.constants.PaymentCodeEnum.AIRPAY;
import static com.titan.poss.sales.constants.PaymentCodeEnum.RAZOR_PAY;
import static com.titan.poss.sales.constants.PaymentCodeEnum.UNIPAY;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dto.request.json.AdvanceCNRuleDetails;
import com.titan.poss.config.dto.request.json.CNRuleDetails;
import com.titan.poss.config.dto.request.json.GrfConfigDetails;
import com.titan.poss.config.dto.request.json.ValueBasedTolerance;
import com.titan.poss.config.dto.request.json.WeightBasedTolerance;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.GhsSchemeTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.dto.GhsDetails;
import com.titan.poss.core.dto.GiftCardBaseRedeemRequestDto;
import com.titan.poss.core.dto.GiftCardBaseReverseRedeemRequestDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationPaymentDetails;
import com.titan.poss.core.dto.MetalRateWithWeightDto;
import com.titan.poss.core.dto.PaymentProductGroupDto;
import com.titan.poss.core.dto.PaymentVerifyResponseDto;
import com.titan.poss.core.dto.ProductGroupDtoDigiGold;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.GiftCardTypeEnum;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.constants.AllowedCategoryForCN;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.AdvanceDaoExt;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.PaymentRequestsDao;
import com.titan.poss.sales.dao.PaymentReversalDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.CashPaymentDetailsDto;
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.PaymentDetailsForUnipayDto;
import com.titan.poss.sales.dto.QwickcilverGCOtherDetailsDto;
import com.titan.poss.sales.dto.WeightDetailsDto;
import com.titan.poss.sales.dto.constants.PaymentRequestEnum;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.TxnTypeCancelEnum;
import com.titan.poss.sales.dto.request.CNPaymentDetailsDto;
import com.titan.poss.sales.dto.request.CreditNoteCreateDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.response.AmountDetailsDto;
import com.titan.poss.sales.dto.response.CreditNoteDiscountDetailsDto;
import com.titan.poss.sales.dto.response.CreditNoteResponse;
import com.titan.poss.sales.dto.response.GhsPaymentOtherDetailsDto;
import com.titan.poss.sales.dto.response.ItemValueAndProductCodeDetailsDto;
import com.titan.poss.sales.dto.response.RedeemTypeAndProductGroupListDto;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.CashMemoRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.OrderDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentItemMappingRepositoryExt;
import com.titan.poss.sales.repository.PaymentRequestsRepository;
import com.titan.poss.sales.repository.PaymentReversalRepositoryExt;
import com.titan.poss.sales.service.AdvanceService;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.IntegrationService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("SalesPaymentUtil")
public class CommonPaymentServiceImpl implements CommonPaymentService {

	@Autowired
	CreditNoteService creditNoteService;

	@Autowired
	private PaymentReversalRepositoryExt paymentReversalRepo;

	@Autowired
	private CashMemoRepositoryExt cashMemoRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private OrderRepositoryExt orderRepository;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepository;

	@Autowired
	private OrderDetailsRepositoryExt orderDetailsRepository;

	@Autowired
	private PaymentItemMappingRepositoryExt paymentItemMappingRepository;

	@Autowired
	private AdvanceService advanceService;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepository;

	@Autowired
	private PaymentRequestsRepository paymentRequestsRepository;

	private static final String ACCOUNT_STRING = " account - ";
	private static final String GHS_STRING = "GHS ";
	private static final String CANNOT_BE_CLUBBED_WITH_OTHER_ACCOUNTS_ADDED_STING = ", cannot be clubbed with other accounts added.";
	private static final String ACCOUNT_CANNOT_BE_CLUBBED_WITH_OTHER_PAYMENTS_ADDED_STRING = " account cannot be clubbed with other payments added.";
	private static final List<String> PAYMENT_CODE_OTHER_MODE_IN_CN = List.of(UNIPAY.getPaymentcode(),
			AIRPAY.getPaymentcode(), RAZOR_PAY.getPaymentcode());

	@Override
	public Map<String, Integer> createCN(CNType cnType, List<CreditNoteIndvCreateDto> indvCNList,
			SalesTxnDaoExt salesTxn, CancelDaoExt cancelTxn, Date docDate, String paymentId) {

		Map<String, Integer> docnos = new HashMap<>();
		//skip digiGold discount check in case of GRN  
			for (int i = 0; i < indvCNList.size(); i++) {
				indvCNList.get(i).setCreditNoteType(cnType.toString());
				if(!CNType.GRN.equals(cnType) ||!CNType.GRN.toString().equals(cancelTxn.getTxnType())) {
					checkIfDigiGoldCn(cnType, salesTxn, indvCNList, i);
				}
					
			}
		CreditNoteCreateDto cnDto = new CreditNoteCreateDto();
		cnDto.setSalesTxn(salesTxn);
		cnDto.setCancelTxn(cancelTxn);
		cnDto.setCNIndividual(indvCNList);
		
		if (cancelTxn!=null && TxnTypeCancelEnum.GRN.name().equals(cancelTxn.getTxnType())) {

			cnDto.setRefDocNo(cancelTxn.getDocNo());
			cnDto.setRefDocType(cancelTxn.getTxnType());
			cnDto.setRefFiscalYear(cancelTxn.getFiscalYear());
			
		} else {
			
			cnDto.setRefDocNo(salesTxn.getDocNo());
			cnDto.setRefDocType(salesTxn.getTxnType());
			cnDto.setRefFiscalYear(salesTxn.getFiscalYear());
		}

		// set docDate for EOD purpose
		cnDto.setDocDate(docDate);

		if (cancelTxn != null) {
			cnDto.setCustomerId(cancelTxn.getCustomerId());
		} else if (salesTxn != null) {
			cnDto.setCustomerId(salesTxn.getCustomerId());
		}

		List<CreditNoteResponse> creditnotes = creditNoteService.createNewCreditNote(cnDto);
		creditnotes.forEach(cn -> docnos.put(cn.getId(), cn.getDocNo()));
		return docnos;
	}

	private void checkIfDigiGoldCn(CNType cnType, SalesTxnDaoExt salesTxn, List<CreditNoteIndvCreateDto> indvCNList,
			Integer index) {
		DiscountTransactionDetails discountDetails = discountUtilService.getDiscountTxnDetails(salesTxn);
		if (discountDetails != null) {
			if (cnType == CNType.DIGI_GOLD_TANISHQ) {
				CreditNoteDiscountDetailsDto cnDetails = new CreditNoteDiscountDetailsDto();
				if (discountDetails.getDigiGoldDetails() != null) {
					cnDetails.setDigiGoldDiscount(discountDetails.getDigiGoldDetails());
					indvCNList.get(index).setDiscountDetails(new JsonData("CN_DISCOUNT_DETAILS", cnDetails));
				}
			}
			if (cnType == CNType.GRN) {
				CreditNoteDiscountDetailsDto cnDetails = new CreditNoteDiscountDetailsDto();
				if (discountDetails.getDigiGoldDetails() != null) {
					cnDetails.setDigiGoldDiscount(discountDetails.getDigiGoldDetails());
					indvCNList.get(index).setDiscountDetails(new JsonData("CN_DISCOUNT_DETAILS", cnDetails));
				}
			}
		}
	}

	@Override
	public Map<String, Integer> createCancelCN(List<PaymentDetailsDaoExt> paymentDetails, SalesTxnDaoExt salesTxn,
			CancelDaoExt cancelDao, CNType cnType, boolean isSingle, Date docDate) {

		if (paymentDetails == null || CollectionUtils.isEmpty(paymentDetails))
			return new HashMap<>();

		List<CreditNoteIndvCreateDto> totalCNAmts = null;
		if (paymentDetails == null || CollectionUtils.isEmpty(paymentDetails))
			return new HashMap<>();
		if (isSingle) {
			BigDecimal totalAmt = getTotalAmtFromPaymentDetails(paymentDetails);
			BigDecimal totalCashCollected = getTotalCashCollectedFromPaymentDetails(paymentDetails);

			totalCNAmts = new ArrayList<>(Arrays.asList(new CreditNoteIndvCreateDto(totalAmt, totalCashCollected,
					new JsonData("CN_PAYMENT_DETAILS", getPaymentDetailsForCNGeneration(paymentDetails, null)))));

		} else {
			totalCNAmts = paymentDetails.stream()
					.map(payment -> new CreditNoteIndvCreateDto(payment.getAmount(), payment.getCashCollected(),
							new JsonData("CN_PAYMENT_DETAILS",
									getPaymentDetailsForCNGeneration(List.of(payment), null))))
					.collect(Collectors.toList());
		}

		return createCN(cnType, totalCNAmts, salesTxn, cancelDao, docDate, null);
	}

	@Override
	public BigDecimal getTotalAmtFromPaymentDetails(List<PaymentDetailsDaoExt> payments) {

		return payments.stream().map(PaymentDetailsDaoExt::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

	}

	@Override
	public void createPaymentReversal(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel) {



		List<PaymentReversalDaoExt> paymentReversals = new ArrayList<>();
		// copy paymentcode, paymentgroup, instrumenttype, instrumentno etc

			for(PaymentDetailsDaoExt paymentDetailsDao : paymentDetails) {
				PaymentReversalDaoExt paymentReversal = new PaymentReversalDaoExt();
				MapperUtil.beanMapping(paymentDetailsDao, paymentReversal, "id");
				paymentReversal.setAmount(paymentDetailsDao.getAmount());
				paymentReversal.setCancel(cancel);
				paymentReversal.setReversalDate(businessDayService.getBusinessDay().getBusinessDate());
				paymentReversal.setHostName(CommonUtil.getAuthUser().getHostName());
				if(paymentDetailsDao.getPaymentCode().equals(PaymentCodeEnum.UNIPAY.name()))
				{
					log.info("Payment Id from paymentDetail is.........................{}",paymentDetailsDao.getId());
					paymentReversal.setPaymentId(paymentDetailsDao.getId());
					paymentReversal.setSalesTxn(paymentDetailsDao.getSalesTxnDao());
				}
				paymentReversals.add(paymentReversal);
			}
		
		//}
		//log.info("Payment Reversal DAO is ...........................{}",paymentReversal.toString());
		if(!CollectionUtil.isEmpty(paymentReversals)) {
			paymentReversalRepo.saveAll(paymentReversals);
		}

		
	}

	@Override
	public GiftCardBaseRedeemRequestDto setCardRedeemRequest(PaymentDetailsDaoExt paymentDetailsDao) {

		GiftCardBaseRedeemRequestDto giftCardRedeemRequestDto = new GiftCardBaseRedeemRequestDto();

		// if trackData is presentO
		if (paymentDetailsDao.getReference1().length() == 26) {
			giftCardRedeemRequestDto.setTrackData(paymentDetailsDao.getReference1());
		} else {
			// card no & pin
			giftCardRedeemRequestDto.setCardNumber(paymentDetailsDao.getInstrumentNo());
			giftCardRedeemRequestDto.setCardPin(paymentDetailsDao.getReference1());
		}

		giftCardRedeemRequestDto.setInvoiceNumber(paymentDetailsDao.getId());
		giftCardRedeemRequestDto.setAmount(paymentDetailsDao.getAmount().doubleValue());

		// bill amount
		if (TransactionTypeEnum.CM.name().equals(paymentDetailsDao.getSalesTxnDao().getTxnType())) {

			CashMemoDaoExt cashMemoDao = cashMemoRepository.findOneByIdAndSalesTxnDaoLocationCode(
					paymentDetailsDao.getSalesTxnDao().getId(), CommonUtil.getLocationCode());

			giftCardRedeemRequestDto.setBillAmount(cashMemoDao.getFinalValue().doubleValue());
		} else if (TransactionTypeEnum.AB.name().equals(paymentDetailsDao.getSalesTxnDao().getTxnType())
				|| TransactionTypeEnum.CO.name().equals(paymentDetailsDao.getSalesTxnDao().getTxnType())) {
			OrderDaoExt orderDao = orderRepository.findOneByIdAndSalesTxnLocationCode(
					paymentDetailsDao.getSalesTxnDao().getId(), CommonUtil.getLocationCode());

			giftCardRedeemRequestDto.setBillAmount(orderDao.getFinalValue().doubleValue());
		}

		return giftCardRedeemRequestDto;
	}

	@Override
	public LocationCacheDto getPaymentDetailsFromLocation() {
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		LocationPaymentDetails locationPaymentDetails = locationCacheDto.getPaymentDetails();

		if (locationPaymentDetails == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Payment details is not present for the location " + CommonUtil.getLocationCode());
		}

		return locationCacheDto;
	}

	@Transactional
	@Override
	public PaymentDetailsDaoExt deletePaymentOpenDeleteElseReverse(PaymentDetailsDaoExt paymentDetailsDao,
			boolean withCN) {
		log.info("payment details...................{}", paymentDetailsDao);
		if (PaymentStatusEnum.OPEN.name().equals(paymentDetailsDao.getStatus())
				|| PaymentStatusEnum.FAILED.name().equals(paymentDetailsDao.getStatus())) {
			paymentDetailsDao.setStatus(PaymentStatusEnum.DELETED.name());
		} else if (PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())) {
			// voiding flow?
			if (withCN) {
				CreditNoteIndvCreateDto creditNoteIndvCreateDto = new CreditNoteIndvCreateDto();

				// if Unipay payment, then CN type to be 'UNIPAY' - NAP-2321?
				creditNoteIndvCreateDto.setCreditNoteType(CNType.ADV.toString());
				if(paymentDetailsDao.getPaymentCode().equals(PaymentCodeEnum.UNIPAY.name()))
				{
					creditNoteIndvCreateDto.setIsUnipay(true);
				}
				creditNoteIndvCreateDto.setAmount(paymentDetailsDao.getAmount());
				creditNoteIndvCreateDto.setRemarks(paymentDetailsDao.getPaymentCode() + " payment reversed.");
				// set payment details
				CNPaymentDetailsDto cNPaymentDetailsDto = setPaymentDetailsforCN(paymentDetailsDao,
						paymentDetailsDao.getInstrumentType());
				creditNoteIndvCreateDto.setPaymentDetails(new JsonData("CN_PAYMENT_DETAILS", cNPaymentDetailsDto));

				CreditNoteCreateDto cnDto = new CreditNoteCreateDto();
				cnDto.setSalesTxn(paymentDetailsDao.getSalesTxnDao());
				cnDto.setCNIndividual(List.of(creditNoteIndvCreateDto));
				cnDto.setCustomerId(paymentDetailsDao.getSalesTxnDao().getCustomerId());
				cnDto.setDocDate(paymentDetailsDao.getSalesTxnDao().getDocDate());
				
				List<CreditNoteResponse> cnDocNoList = creditNoteService.createNewCreditNote(cnDto);

				paymentDetailsDao.setStatus(PaymentStatusEnum.REVERSED_WITH_CN.name());
				paymentDetailsDao.setRemarks("CN Doc No: " + cnDocNoList.get(0).getDocNo()); // CN number to be stored?

				Map<String, Object> otherDetailsMap = getOtherDetailsIfExists(paymentDetailsDao);
				// add generated Cn no. to other details
				otherDetailsMap.put("creditNoteNo", cnDocNoList.get(0).getDocNo());
				paymentDetailsDao.setOtherDetails(MapperUtil
						.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), otherDetailsMap)));

			} else {
				paymentDetailsDao.setStatus(PaymentStatusEnum.REVERSED.name());
			}

		}

		return paymentDetailsDao;
	}

	@SuppressWarnings("unchecked")
	private Map<String, Object> getOtherDetailsIfExists(PaymentDetailsDaoExt paymentDetailsDao) {
		Map<String, Object> otherDetailsMap;
		if (!StringUtil.isBlankJsonStr(paymentDetailsDao.getOtherDetails())) {
			Object otherDetails = MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class)
					.getData();
			try {
				otherDetailsMap = new ObjectMapper().readValue(MapperUtil.getStringFromJson(otherDetails),
						HashMap.class);

			} catch (Exception e) {
				otherDetailsMap = new HashMap<>();
			}
		} else {
			otherDetailsMap = new HashMap<>();
		}
		return otherDetailsMap;
	}

	/**
	 * This method is for CHEQUE or DD date validation.
	 * 
	 * @param instrumentDate
	 */
	@Override
	public void chequeorDdDateValidation(Date instrumentDate) {

		LocationPaymentDetails locationPaymentDetails = getPaymentDetailsFromLocation().getPaymentDetails();

		int validatityDays;

		if (StringUtils.isEmpty(locationPaymentDetails.getRtgs())) {
			throw new ServiceException(SalesConstants.VALIDITY_DAYS_OR_REALISATION_DAYS_DETAILS_NOT_PRESENT,
					SalesConstants.ERR_SALE_020, "Validity Days or Realisation Days details not present for location: "
							+ CommonUtil.getLocationCode());
		}

		if (!StringUtils.isEmpty(locationPaymentDetails.getRtgs().getNoOfDaysForChequeOrDDAcceptance())) {
			validatityDays = locationPaymentDetails.getRtgs().getNoOfDaysForChequeOrDDAcceptance();
		} else {
			throw new ServiceException(SalesConstants.VALIDITY_DAYS_OR_REALISATION_DAYS_DETAILS_NOT_PRESENT,
					SalesConstants.ERR_SALE_020, "Validity Days or Realisation Days details not present for location: "
							+ CommonUtil.getLocationCode());
		}

		// validate w.r.t current date in instrument date
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
		Date chequeDate = CalendarUtils.getStartOfDay(instrumentDate);

		if (Math.abs(CalendarUtils.getDayDiff(businessDate, chequeDate)) > validatityDays) {
			throw new ServiceException(SalesConstants.CHEQUE_OR_DD_VALIDITY_IS_EXPIRED, SalesConstants.ERR_SALE_021,
					"Cheque or DD validity is expired.");
		}

	}

	@Override
	public void getAirpayOrRazorPayPaymentStatus(PaymentDetailsDaoExt paymentDetailsDao, Date businessDate) {

		VendorCodeEnum vendorCode;
		if (PaymentCodeEnum.AIRPAY.getPaymentcode().equals(paymentDetailsDao.getPaymentCode())) {
			vendorCode = VendorCodeEnum.PAYMENT_AIRPAY;
		} else if (PaymentCodeEnum.RAZOR_PAY.getPaymentcode().equals(paymentDetailsDao.getPaymentCode())) {
			vendorCode = VendorCodeEnum.PAYMENT_RAZORPAY;
		} else {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Status check allowed for 'AIRPAY' and 'RAZOR PAY' only.");
		}

		PaymentVerifyResponseDto paymentVerifyResponseDto = integrationService.verifyPaymentStatus(vendorCode.name(),
				paymentDetailsDao.getReference2());

		// reference id from Airpay/Razor Pay
		if (!StringUtils.isEmpty(paymentVerifyResponseDto.getVendorPaymentId())) {
			paymentDetailsDao.setReference1(paymentVerifyResponseDto.getVendorPaymentId());
			paymentDetailsDao.setInstrumentNo(paymentVerifyResponseDto.getVendorPaymentId());
		}

		// status change required? link expired?
		switch (paymentVerifyResponseDto.getTransacionStatus()) {
		case "COMPLETED":
			paymentDetailsDao.setStatus(PaymentStatusEnum.COMPLETED.name());
			paymentDetailsDao.setPaymentDate(businessDate);
			break;

		case "IN_PROGRESS":
			paymentDetailsDao.setStatus(PaymentStatusEnum.IN_PROGRESS.name());
			break;

		case "CREATED":
			paymentDetailsDao.setStatus(PaymentStatusEnum.OPEN.name());
			break;

		default:
			paymentDetailsDao.setStatus(PaymentStatusEnum.FAILED.name());
			break;
		}

		paymentDetailsRepository.save(paymentDetailsDao);
	}

	@Override
	public void setBankNameForAirpayOrRazorPay(PaymentDetailsDaoExt paymentDetailsDao, Boolean isOnlinePayment) {
		// concatenate 'reference1, reference2 and reference3' with '-' and paymentCode
		// & add to bankName (based on online and offline scenarios)
		String bankName;
		if (BooleanUtils.isTrue(isOnlinePayment)) {
			bankName = paymentDetailsDao.getReference2() != null
					? paymentDetailsDao.getPaymentCode() + " - " + paymentDetailsDao.getReference2()
					: null;
		} else {

			String reference1 = paymentDetailsDao.getReference1() != null ? " - " + paymentDetailsDao.getReference1()
					: "";
			String reference2 = paymentDetailsDao.getReference2() != null ? " - " + paymentDetailsDao.getReference2()
					: "";
			String reference3 = paymentDetailsDao.getReference3() != null ? " - " + paymentDetailsDao.getReference3()
					: "";
			// @formatter:off
			// if at least one of the references is not empty, then set bankName
			bankName = !(StringUtils.isEmpty(reference1) && StringUtils.isEmpty(reference2)
					&& StringUtils.isEmpty(reference3))
							? (paymentDetailsDao.getPaymentCode() + reference1 + reference2 + reference3)
							: null;
			// @formatter:on
		}
		// set bankName
		paymentDetailsDao.setBankName(bankName);

	}

	private CNPaymentDetailsDto setPaymentDetailsforCN(PaymentDetailsDaoExt paymentDetailsDao, String instrumentType) {
		CNPaymentDetailsDto cNPaymentDetailsDto = new CNPaymentDetailsDto();
		if (PaymentCodeEnum.UNIPAY.getPaymentcode().equals(paymentDetailsDao.getPaymentCode())) {
			cNPaymentDetailsDto.setIsGeneratedForUnipayDeletion(true);
			cNPaymentDetailsDto.setRTGS(false);
			cNPaymentDetailsDto.setCheque(false);
			cNPaymentDetailsDto.setUPI(false);
			if (!StringUtil.isBlankJsonStr(paymentDetailsDao.getOtherDetails())) {
				JsonData jsonData = MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class);
				Object response = JsonUtils.getValueFromJson(jsonData.getData(), "response", Object.class);
				cNPaymentDetailsDto.setUnipayID(JsonUtils.getValueFromJson(response, "utid", String.class));
				cNPaymentDetailsDto.setPaymentId(paymentDetailsDao.getId());
				cNPaymentDetailsDto.setBankInvoiceNo(JsonUtils.getValueFromJson(response, "bankInvoiceNumber", String.class));
				cNPaymentDetailsDto.setTxnDate(JsonUtils.getValueFromJson(response, "txnDate", String.class));
				cNPaymentDetailsDto.setBankName(JsonUtils.getValueFromJson(response, "acquirerBank", String.class));
			}
			cNPaymentDetailsDto.setHostname(paymentDetailsDao.getHostName());

		} else if (PaymentCodeEnum.RTGS.getPaymentcode().equals(paymentDetailsDao.getPaymentCode())) {
			cNPaymentDetailsDto.setRTGS(true);
			cNPaymentDetailsDto.setCheque(false);
			cNPaymentDetailsDto.setUPI(false);
			cNPaymentDetailsDto.setIsGeneratedForUnipayDeletion(false);

		} else if (PaymentCodeEnum.CHEQUE.getPaymentcode().equals(paymentDetailsDao.getPaymentCode())) {
			cNPaymentDetailsDto.setCheque(true);
			cNPaymentDetailsDto.setRTGS(false);
			cNPaymentDetailsDto.setUPI(false);
			cNPaymentDetailsDto.setIsGeneratedForUnipayDeletion(false);
			cNPaymentDetailsDto.setChequeDate(paymentDetailsDao.getInstrumentDate());
		} else if (PaymentCodeEnum.UPI.getPaymentcode().equals(paymentDetailsDao.getPaymentCode())) {
			cNPaymentDetailsDto.setCheque(true);
			cNPaymentDetailsDto.setRTGS(false);
			cNPaymentDetailsDto.setUPI(true);
			cNPaymentDetailsDto.setIsGeneratedForUnipayDeletion(false);
			cNPaymentDetailsDto.setChequeDate(paymentDetailsDao.getInstrumentDate());
		} else {
			cNPaymentDetailsDto.setIsGeneratedForUnipayDeletion(false);
			cNPaymentDetailsDto.setRTGS(false);
			cNPaymentDetailsDto.setCheque(false);
			cNPaymentDetailsDto.setUPI(false);
		}
		Map<String, String> payments = new HashMap<>();
		payments.put(paymentDetailsDao.getPaymentCode(), instrumentType);
		cNPaymentDetailsDto.setPaymentCodes(payments);

		return cNPaymentDetailsDto;
	}

	@Override
	public void validateMetalWeightInConfirm(WeightDetailsDto totalWeightDetailsDto,
			Map<String, MetalRateWithWeightDto> metalRateWithWeightMap) {
		String metalType = "metalType";
		String expected = "allowedWeight";
		String found = "foundWeight";

		if (metalRateWithWeightMap.containsKey(MetalTypeCodeEnum.J.name()) && totalWeightDetailsDto.getGoldWeight()
				.compareTo(metalRateWithWeightMap.get(MetalTypeCodeEnum.J.name()).getTotalMetalWeight()) != 0) {
			throw new ServiceException(
					SalesConstants.TOTAL_WEIGHT_OF_ADDED_PRODUCTS_SHOULD_MATCH_WITH_MANUAL_BILL_WEIGHT,
					SalesConstants.ERR_SALE_100,
					Map.of(metalType, MetalTypeCodeEnum.J.getValue(), expected,
							metalRateWithWeightMap.get(MetalTypeCodeEnum.J.name()).getTotalMetalWeight(), found,
							totalWeightDetailsDto.getGoldWeight()));
		}
		if (metalRateWithWeightMap.containsKey(MetalTypeCodeEnum.L.name()) && totalWeightDetailsDto.getPlatinumWeight()
				.compareTo(metalRateWithWeightMap.get(MetalTypeCodeEnum.L.name()).getTotalMetalWeight()) != 0) {
			throw new ServiceException(
					SalesConstants.TOTAL_WEIGHT_OF_ADDED_PRODUCTS_SHOULD_MATCH_WITH_MANUAL_BILL_WEIGHT,
					SalesConstants.ERR_SALE_100,
					Map.of(metalType, MetalTypeCodeEnum.L.getValue(), expected,
							metalRateWithWeightMap.get(MetalTypeCodeEnum.L.name()).getTotalMetalWeight(), found,
							totalWeightDetailsDto.getPlatinumWeight()));
		}
		if (metalRateWithWeightMap.containsKey(MetalTypeCodeEnum.P.name()) && totalWeightDetailsDto.getSilverWeight()
				.compareTo(metalRateWithWeightMap.get(MetalTypeCodeEnum.P.name()).getTotalMetalWeight()) != 0) {
			throw new ServiceException(
					SalesConstants.TOTAL_WEIGHT_OF_ADDED_PRODUCTS_SHOULD_MATCH_WITH_MANUAL_BILL_WEIGHT,
					SalesConstants.ERR_SALE_100,
					Map.of(metalType, MetalTypeCodeEnum.P.getValue(), expected,
							metalRateWithWeightMap.get(MetalTypeCodeEnum.P.name()).getTotalMetalWeight(), found,
							totalWeightDetailsDto.getSilverWeight()));
		}

	}

	@Override
	public void validateMetalWeightForEdit(WeightDetailsDto totalWeightDetailsDto,
			Map<String, MetalRateWithWeightDto> metalRateWithWeightMap) {
		String metalType = "metalType";
		String expected = "allowedWeight";
		String found = "foundWeight";

		if (metalRateWithWeightMap.containsKey(MetalTypeCodeEnum.J.name()) && totalWeightDetailsDto.getGoldWeight()
				.compareTo(metalRateWithWeightMap.get(MetalTypeCodeEnum.J.name()).getTotalMetalWeight()) > 0) {
			throw new ServiceException(SalesConstants.TOTAL_WEIGHT_OF_ADDED_PRODUCTS_EXCEEDING_MANUAL_BILL_WEIGHT,
					SalesConstants.ERR_SALE_099,
					Map.of(metalType, MetalTypeCodeEnum.J.getValue(), expected,
							metalRateWithWeightMap.get(MetalTypeCodeEnum.J.name()).getTotalMetalWeight(), found,
							totalWeightDetailsDto.getGoldWeight()));
		}
		if (metalRateWithWeightMap.containsKey(MetalTypeCodeEnum.L.name()) && totalWeightDetailsDto.getPlatinumWeight()
				.compareTo(metalRateWithWeightMap.get(MetalTypeCodeEnum.L.name()).getTotalMetalWeight()) > 0) {
			throw new ServiceException(SalesConstants.TOTAL_WEIGHT_OF_ADDED_PRODUCTS_EXCEEDING_MANUAL_BILL_WEIGHT,
					SalesConstants.ERR_SALE_099,
					Map.of(metalType, MetalTypeCodeEnum.L.getValue(), expected,
							metalRateWithWeightMap.get(MetalTypeCodeEnum.L.name()).getTotalMetalWeight(), found,
							totalWeightDetailsDto.getPlatinumWeight()));
		}
		if (metalRateWithWeightMap.containsKey(MetalTypeCodeEnum.P.name()) && totalWeightDetailsDto.getSilverWeight()
				.compareTo(metalRateWithWeightMap.get(MetalTypeCodeEnum.P.name()).getTotalMetalWeight()) > 0) {
			throw new ServiceException(SalesConstants.TOTAL_WEIGHT_OF_ADDED_PRODUCTS_EXCEEDING_MANUAL_BILL_WEIGHT,
					SalesConstants.ERR_SALE_099,
					Map.of(metalType, MetalTypeCodeEnum.P.getValue(), expected,
							metalRateWithWeightMap.get(MetalTypeCodeEnum.P.name()).getTotalMetalWeight(), found,
							totalWeightDetailsDto.getSilverWeight()));
		}

	}

	@Override
	public Map<String, ItemValueAndProductCodeDetailsDto> getItemProductGroupCodes(String transactionType,
			String transactionId, List<String> validProductGroupCodeList, String paymentCode, String cardNumber,
			boolean isExcludePGC) {
		// 'isExcludePGC' is false for applicable payments
		// 'isExcludePGC' is currently true only for 'GIFT VOUCHER' & 'GHS ACCOUNT'
		// payment.

		// if valid product group code list is empty,then & !isExcludePGC return
		if (CollectionUtil.isEmpty(validProductGroupCodeList) && !isExcludePGC) {
			return new HashMap<>();
		}
        if(TransactionTypeEnum.ADV.name().equals(transactionType)) {
        	return new HashMap<>();	
        }
		// pending - get item codes based on transactionType from different tables

		// get (item,<finalAmount, productGroup>) for amount check.
		// can get due amount.// can get final amount also.
		Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPGCList = getItemCodeProductGroups(transactionType,
				transactionId);

		List<String> invalidItemIdList = new ArrayList<>();// to remove invalid items for the payment.
		for (Map.Entry<String, ItemValueAndProductCodeDetailsDto> itemValueAndPCG : itemValueAndPGCList.entrySet()) {
			// this condition differs based on 'isExcludePGC', as 'GIFT VOUCHER' requires
			// disjoint check

			if ((validProductGroupCodeList.contains(itemValueAndPCG.getValue().getProductGroupCode()) && isExcludePGC)
					|| (!validProductGroupCodeList.contains(itemValueAndPCG.getValue().getProductGroupCode())
							&& !isExcludePGC)) {
				invalidItemIdList.add(itemValueAndPCG.getKey());
			}
		}

		// remove invalid items for payment from the Map(based on product group code).
		itemValueAndPGCList.keySet().removeAll(invalidItemIdList);

		// 1. if none of the product group code matches(ie, Map is empty), then throw
		// error (for applicable payments)
		// 2. if product group code matches(ie, Map is empty), then throw error (for
		// 'GIFT VOUCHER')
		// in both cases 'itemValueAndPGCList' is checked.
		if (CollectionUtils.isEmpty(itemValueAndPGCList)) {
			throw new ServiceException(
					SalesConstants.DYNAMIC_PAYMENTCODE_DYNAMIC_CARDNO_CANNOT_BE_REDEEMED_ON_ITEMS_ADDED,
					SalesConstants.ERR_SALE_326,
					"No valid product group mapping found for the items present in transaction.",
					Map.of(SalesConstants.PAYMENT_CODE, paymentCode, "cardNo",
							cardNumber == null ? "payment" : cardNumber));
		}

		return itemValueAndPGCList;
	}

	private Map<String, ItemValueAndProductCodeDetailsDto> getItemCodeProductGroups(String transactionType,
			String transactionId) {
		Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPGCList = new HashMap<>();

		if (TransactionTypeEnum.CM.name().equals(transactionType)) {
			List<CashMemoDetailsDaoExt> cashMemoDetailsList = cashMemoDetailsRepository
					.findByCashMemoDaoId(transactionId);
			itemValueAndPGCList = cashMemoDetailsList.stream().collect(Collectors.toMap(CashMemoDetailsDaoExt::getId,
					cashMemoDetails -> new ItemValueAndProductCodeDetailsDto(cashMemoDetails.getProductGroupCode(),
							cashMemoDetails.getFinalValue(),cashMemoDetails.getTotalValue())));

		} else if (TransactionTypeEnum.AB.name().equals(transactionType)
				|| TransactionTypeEnum.CO.name().equals(transactionType)) {
			List<OrderDetailsDaoExt> orderDetailsList = orderDetailsRepository.findAllByOrderId(transactionId);

			itemValueAndPGCList = orderDetailsList.stream()
					.collect(Collectors.toMap(OrderDetailsDaoExt::getId,
							abDetails -> new ItemValueAndProductCodeDetailsDto(abDetails.getProductGroupCode(),
									abDetails.getFinalValue(),abDetails.getTotalValue())));
		}
		return itemValueAndPGCList;
	}

	@Override
	public RedeemTypeAndProductGroupListDto productGroupCodeCheckForPayement(String transactionId,
			String transactionType, String paymentCode, String cardNumber, String offerId) {

		List<String> productGroupCodeMappingList;
		String redemptionType = null;
		String cpgName = null;
		String errorCause = "No valid product group mapping found for ";

		if (PaymentCodeEnum.CASHBACK.getPaymentcode().equals(paymentCode)) {
			ListResponse<String> productGroupCodeforOffer = engineService.getCashBackProductGroups(offerId);
			// get product group codes
			productGroupCodeMappingList = StringUtils.isEmpty(productGroupCodeforOffer) ? null
					: productGroupCodeforOffer.getResults();

			// error cause
			errorCause = errorCause + "offer Id: " + offerId;
		} else {
			PaymentProductGroupDto productGroupCodeMappingResponse = new PaymentProductGroupDto();
			if (paymentCode.equalsIgnoreCase(PaymentCodeEnum.DIGI_GOLD_TANISHQ.getPaymentcode())
					|| paymentCode.equalsIgnoreCase(PaymentCodeEnum.DIGI_GOLD_NON_TANISHQ.getPaymentcode())) {
				Map<String, ItemValueAndProductCodeDetailsDto> itemCodeProductGroups = getItemCodeProductGroups(
						transactionType, transactionId);
				List<String> productGroupCodes = new ArrayList<>();
				itemCodeProductGroups
						.forEach((key, itemProduct) -> productGroupCodes.add(itemProduct.getProductGroupCode()));
				ProductGroupDtoDigiGold productGroupsItems = new ProductGroupDtoDigiGold();
				productGroupsItems.setProductGroupCodes(productGroupCodes);
				ProductGroupDtoDigiGold productGroupsValid = engineService
						.getProductGroupsForDigiGold(productGroupsItems);
				productGroupCodeMappingResponse.setProductGroupCode(productGroupsValid.getProductGroupCodes());

			} else {
				// note: paymentCode is send as GHS_EVOUCHER
				productGroupCodeMappingResponse = engineService
						.getProductGroups(paymentCode.equals(PaymentCodeEnum.GHS_EVOUCHER.getPaymentcode())
								? PaymentCodeEnum.QCGC.getPaymentcode()
								: paymentCode, cardNumber);
				// if payment code = qcgc and ghs voucher boolen is true then throw error
				// if payment code = ghs voucher and ghs voucher boolean is false throw error
				if (paymentCode.equalsIgnoreCase(PaymentCodeEnum.QCGC.getPaymentcode())
						&& BooleanUtils.isTrue(productGroupCodeMappingResponse.getIsGhsVoucherEnabled())) {
					String errorMsg = "GHS Voucher Card can't be added as QCGC Payment";
					throw new ServiceException(SalesConstants.GHS_EVOUCHER_CARD_CANT_BE_ADDED_AS_QCGC_PAYMENT,
							SalesConstants.ERR_SALE_417, errorMsg);
				} else if (paymentCode.equalsIgnoreCase(PaymentCodeEnum.GHS_EVOUCHER.getPaymentcode())
						&& BooleanUtils.isFalse(productGroupCodeMappingResponse.getIsGhsVoucherEnabled())) {
					String errorMsg = "QCGC Card can't be added as GHS E Voucher Payment";
					throw new ServiceException(SalesConstants.QCGC_CARD_CANT_BE_ADDED_AS_GHS_EVOUCHER_PAYMENT,
							SalesConstants.ERR_SALE_418, errorMsg);
				}

			}
			// get product group codes
			productGroupCodeMappingList = productGroupCodeMappingResponse.getProductGroupCode();
			redemptionType = productGroupCodeMappingResponse.getRedemptionType();
			cpgName = productGroupCodeMappingResponse.getPaymentCategoryName();

			// error cause
			errorCause = errorCause
					+ (StringUtils.isEmpty(cardNumber) ? " for: " + paymentCode : " for: " + cardNumber);
		}

		// if product group mapping is empty for paymentCode
		if (CollectionUtil.isEmpty(productGroupCodeMappingList)) {
			throw new ServiceException(SalesConstants.NO_PRODUCT_GROUP_MAPPING_FOUND, SalesConstants.ERR_SALE_042,
					errorCause);
		}

		// get item codes based on transactionType from different tables
		// isExcludePGC is false for all applicable payments and is true for 'GIFT
		// VOUCHER' payment.
		Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPgcDetails = getItemProductGroupCodes(
				transactionType, transactionId, productGroupCodeMappingList, paymentCode, cardNumber, false);
		// get valid check.
		BigDecimal validAmount = getValidPaymentForItems(paymentCode, itemValueAndPgcDetails, transactionId);

		// return redemption type and productGroup codes mapped for the payment.
		return new RedeemTypeAndProductGroupListDto(redemptionType, productGroupCodeMappingList, cpgName, validAmount,
				itemValueAndPgcDetails);
	}

	@Override
	public BigDecimal getValidPaymentForItems(String paymentCode,
			Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPgcDetails, String transactionId) {
        
		List<PaymentItemMappingDaoExt> paymentItemMappingList = paymentItemMappingRepository
				.findByItemIdInAndPaymentDetailsDaoStatusIn(itemValueAndPgcDetails.keySet(),
						PaymentStatusEnum.getPaidPaymentStatus());

		BigDecimal validAmount = BigDecimal.ZERO;
		// if no payment done, then match valid product group and send validAmount
		if (CollectionUtil.isEmpty(paymentItemMappingList)) {
			// return valid amount
			return computeValidAmount(itemValueAndPgcDetails, validAmount);

		}
   
		// deduct payment done to get valid valid amount
		Set<String> chekcedItemList = new HashSet<>();
		for (PaymentItemMappingDaoExt paymentItemDao : paymentItemMappingList) {

			ItemValueAndProductCodeDetailsDto itemValueDateils = itemValueAndPgcDetails.get(paymentItemDao.getItemId());

			// subtract already paid amount from item value, then add the balance to
			// valid amount.
			validAmount = validAmount.add((itemValueDateils.getFinalValue().subtract(paymentItemDao.getAmount())));
			// paid amount for each item
			itemValueDateils.setPaidAmount(itemValueDateils.getPaidAmount() == null ? paymentItemDao.getAmount()
					: itemValueDateils.getPaidAmount().add(paymentItemDao.getAmount()));

			// to remove already checked item
			chekcedItemList.add(paymentItemDao.getItemId());
		}

		// pick the items that are not checked yet.
		Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPgcDetailsThatAreNotChecked = new HashMap<>();
		if (!CollectionUtil.isEmpty(chekcedItemList)) {

			itemValueAndPgcDetails.forEach((itemId, value) -> {
				if (!chekcedItemList.contains(itemId)) {
					itemValueAndPgcDetailsThatAreNotChecked.put(itemId, value);
				}
			});
		}

		// check again for the remaining items which do not have any payments.
		validAmount = computeValidAmount(itemValueAndPgcDetailsThatAreNotChecked, validAmount);

		return validAmount;
	}

	/**
	 * Compute valid amount.
	 * 
	 * @param itemValueAndPgcDetails
	 * @param validProductGroupCodes
	 * @param validAmount
	 * @return BigDecimal
	 */
	private BigDecimal computeValidAmount(Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPgcDetails,
			BigDecimal validAmount) {

		// if map is empty , then return
		if (CollectionUtils.isEmpty(itemValueAndPgcDetails)) {
			return validAmount;
		}

		for (Map.Entry<String, ItemValueAndProductCodeDetailsDto> itemValueAndPCG : itemValueAndPgcDetails.entrySet()) {
			validAmount = validAmount.add(itemValueAndPCG.getValue().getFinalValue());
		}

		return validAmount;
	}

	@Override
	public List<PaymentItemMappingDaoExt> amountCheckForPayment(BigDecimal validAmount, BigDecimal inputAmount,
			PaymentDetailsDaoExt paymentDetailsDao,
			Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPgcDetails) {

		// check if inputAmount exceeds validAmount amount and avoid problem due to
		// roundOff
		BigDecimal inputAmountToConsider = checkInputAndValidAmount(validAmount, inputAmount, paymentDetailsDao);

		// sort itemPCG details by (finalValue-paidValue)
		// Sort the list
		List<Entry<String, ItemValueAndProductCodeDetailsDto>> list = new LinkedList<>(
				itemValueAndPgcDetails.entrySet());
		// sort
		Collections.sort(list,
				(item1, item2) -> (item1.getValue().getPaidAmount() == null ? item1.getValue().getFinalValue()
						: item1.getValue().getFinalValue().subtract(item1.getValue().getPaidAmount()))
								.compareTo(item2.getValue().getPaidAmount() == null ? item2.getValue().getFinalValue()
										: item2.getValue().getFinalValue().subtract(item2.getValue().getPaidAmount())));

		itemValueAndPgcDetails = list.stream().collect(
				Collectors.toMap(Entry::getKey, Entry::getValue, (itemKey, itemValue) -> itemKey, LinkedHashMap::new));

		// as per UAT 3732, apportion to be done on price per unit/totalValue
		BigDecimal totalAmount = itemValueAndPgcDetails.values().stream()
				.map(ItemValueAndProductCodeDetailsDto::getTotalValue).reduce(BigDecimal.ZERO, BigDecimal::add);

		// make DAO for payment_item_mapping and return it.
		List<PaymentItemMappingDaoExt> paymentItemMapList = new ArrayList<>();
		BigDecimal amountLeft = inputAmountToConsider;
		BigDecimal totalApportionPct = BigDecimal.ZERO;
		int count = 0;

		for (Map.Entry<String, ItemValueAndProductCodeDetailsDto> itemValueAndPgc : itemValueAndPgcDetails.entrySet()) {
			count += 1;

			PaymentItemMappingDaoExt paymentItemMap = new PaymentItemMappingDaoExt();
			paymentItemMap.setPaymentDetailsDao(paymentDetailsDao);
			paymentItemMap.setItemId(itemValueAndPgc.getKey());
			paymentItemMap.setProductGroupCode(itemValueAndPgc.getValue().getProductGroupCode());

			// balance
			BigDecimal validItemValue = itemValueAndPgc.getValue().getPaidAmount() == null
					? itemValueAndPgc.getValue().getFinalValue()
					: itemValueAndPgc.getValue().getFinalValue().subtract(itemValueAndPgc.getValue().getPaidAmount());

			// if balance is <= ZERO, continue with next item.
			if (validItemValue.compareTo(BigDecimal.ZERO) <= 0) {
				continue;
			}

			// calculate apportion pct.
			BigDecimal itemValueApportionPercentage = itemValueAndPgc.getValue().getTotalValue()
					.divide(totalAmount, MathContext.DECIMAL128).multiply(BigDecimal.valueOf(100))
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			totalApportionPct = totalApportionPct.add(itemValueApportionPercentage);

			// done to make sure overall % comes to 100.
			itemValueApportionPercentage = getValidApportionPct(itemValueAndPgcDetails, totalApportionPct, count,
					itemValueApportionPercentage);

			// for encircle apportion should be without decimal values.(helps in encircle
			// point reversal at GRN)
			int priceScale = PaymentCodeEnum.ENCIRCLE.name().equals(paymentDetailsDao.getPaymentCode()) ? 0
					: DomainConstants.PRICE_SCALE;

			// apportioned amount
			BigDecimal apportionedAmount = inputAmountToConsider
					.multiply(itemValueApportionPercentage.divide(BigDecimal.valueOf(100)))
					.setScale(priceScale, DomainConstants.ROUNDIND_MODE);// done to make sure overall
            if(apportionedAmount.compareTo(BigDecimal.ZERO) <= 0) {
            	 apportionedAmount = BigDecimal.ONE;
            	
            }
			// set apportioned amount
			if (amountLeft.compareTo(apportionedAmount) < 0) {
				paymentItemMap.setAmount(amountLeft);
			} else {
				paymentItemMap.setAmount(apportionedAmount);
			}

			// amount left = amountLeft - apportioned amount
			amountLeft = amountLeft.subtract(paymentItemMap.getAmount());

			if (BigDecimal.ZERO.compareTo(paymentItemMap.getAmount()) < 0) {
				paymentItemMapList.add(paymentItemMap);
			}
		}

		// if amountLeft is not 0, then calculation is wrong
		if (BigDecimal.ZERO.compareTo(amountLeft) != 0) {
			throw new ServiceException(
					SalesConstants.AMOUNT_IS_INVALID_FOR_THE_DYNAMIC_PAYMENTCODE_PAYMENT_VALID_AMOUNT_IS_DYNAMIC_VALIDAMOUNT,
					SalesConstants.ERR_SALE_262,

					"Amount is invalid for the " + paymentDetailsDao.getPaymentCode() + " payment. Valid amount is: "
							+ validAmount + ". Balance is coming as " + amountLeft
							+ " after approtioning payment to all items. Input amount is: "
							+ paymentDetailsDao.getAmount(),
					Map.of(SalesConstants.PAYMENT_CODE, paymentDetailsDao.getPaymentCode(), "validAmount",
							paymentDetailsDao.getAmount().toString()));

		}

		return paymentItemMapList;
	}

	private BigDecimal getValidApportionPct(Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPgcDetails,
			BigDecimal totalApportionPct, int count, BigDecimal itemValueApportionPercentage) {
		if (count == itemValueAndPgcDetails.size() && totalApportionPct.compareTo(new BigDecimal(100)) != 0) {
			itemValueApportionPercentage = itemValueApportionPercentage
					.add(new BigDecimal(100).subtract(totalApportionPct));
		}
		return itemValueApportionPercentage;
	}

	private BigDecimal checkInputAndValidAmount(BigDecimal validAmount, BigDecimal inputAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {
		// to avoid problem due to roundOff
		BigDecimal inputAmountToConsider = (validAmount.compareTo(inputAmount) < 0
				&& ((inputAmount.subtract(validAmount)).compareTo(new BigDecimal(1)) < 0)) ? validAmount : inputAmount;

		// check if inputAmount exceeds validAmount amount and avoid problem due to
		// roundOff
		if (inputAmount.compareTo(validAmount) > 0 && inputAmountToConsider.compareTo(validAmount) != 0) {
			log.info("Input amount: {}, Actual valid amount: {}, Valid amount considered: {}", inputAmount, validAmount,
					inputAmountToConsider);
			// throw error
			throw new ServiceException(
					SalesConstants.AMOUNT_IS_INVALID_FOR_THE_DYNAMIC_PAYMENTCODE_PAYMENT_VALID_AMOUNT_IS_DYNAMIC_VALIDAMOUNT,
					SalesConstants.ERR_SALE_262,
					"Amount is invalid for the " + paymentDetailsDao.getPaymentCode() + " payment. Valid amount is:  "
							+ inputAmountToConsider,
					Map.of(SalesConstants.PAYMENT_CODE, paymentDetailsDao.getPaymentCode(), "validAmount",
							inputAmountToConsider.toString()));
		}
		return inputAmountToConsider;
	}

	@Override
	public List<PaymentItemMappingDaoExt> paymentCheckBasedOnRedemptionType(BigDecimal inputAmount, BigDecimal giftBalance,
			BigDecimal validAmount, String redemptionType, PaymentDetailsDaoExt paymentDetailsDao,
			Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPgcDetails) {		
		// check redemption amount
		if (redemptionType != null && "FULL".equalsIgnoreCase(redemptionType)
				&& inputAmount.compareTo(giftBalance) != 0) {
		
			// if full redemption, then payment amount and gift card amount should be equal
			throw new ServiceException(SalesConstants.DYNAMIC_PAYMENT_CODE_AMOUNT_AND_INPUT_AMOUNT_DO_NOT_MATCH,
					SalesConstants.ERR_SALE_032,
					"Gift card/voucher or credit note amount and input amount do not match.",
					Map.of(SalesConstants.PAYMENT_CODE, paymentDetailsDao.getPaymentCode()));
		} else if (inputAmount.compareTo(giftBalance) > 0) {
			// if partial redemption, then payment amount should not exceed gift card amount
			throw new ServiceException(SalesConstants.AMOUNT_IS_NOT_IN_RANGE, SalesConstants.ERR_SALE_026,
					"Input amount exceeds balance.");
		}

		return amountCheckForPayment(validAmount, inputAmount, paymentDetailsDao, itemValueAndPgcDetails);

	}

	@Override
	public BigDecimal getTotalCashCollectedFromPaymentDetails(List<PaymentDetailsDaoExt> payments) {
		return payments.stream().filter(paymnetDetialsDao -> paymnetDetialsDao.getCashCollected() != null)
				.map(PaymentDetailsDaoExt::getCashCollected).reduce(BigDecimal.ZERO, BigDecimal::add);
	}

	@Override
	public BigDecimal getTotalOtherModeFromPaymentDetails(List<PaymentDetailsDaoExt> payments) {
		return payments.stream()
				.filter(paymnetDetialsDao -> paymnetDetialsDao.getCashCollected() == null
						&& PAYMENT_CODE_OTHER_MODE_IN_CN.contains(paymnetDetialsDao.getPaymentCode()))
				.map(PaymentDetailsDaoExt::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
	}

	@Override
	public List<PaymentDetailsForUnipayDto> getPaymentsByPaymentCode(List<PaymentDetailsDaoExt> payments) {
		log.info("payments...................{}", payments);
//		log.info("payments...................{}", payments);
//		List<BigDecimal> result = payments.stream()
//				.filter(paymnetDetialsDao -> paymnetDetialsDao.getCashCollected() == null
//						&& PAYMENT_CODE_OTHER_MODE_IN_CN.contains(paymnetDetialsDao.getPaymentCode()))
//				.map(PaymentDetailsDaoExt::getAmount).collect(Collectors.toList());
//		log.info("payments...................{}", result);
//
//		return result;

		List<PaymentDetailsDaoExt> resultPaymentDetails = payments.stream()
				.filter(paymnetDetialsDao -> paymnetDetialsDao.getCashCollected() == null
						&& PAYMENT_CODE_OTHER_MODE_IN_CN.contains(paymnetDetialsDao.getPaymentCode()))
				.collect(Collectors.toList());
		log.info("resultPaymentDetails after filter...................{}", resultPaymentDetails);

		List<PaymentDetailsForUnipayDto> result = new ArrayList<>();

		resultPaymentDetails.forEach((paymentDetails) -> {
			PaymentDetailsForUnipayDto paymentDetailsForUnipayDto = new PaymentDetailsForUnipayDto();
			paymentDetailsForUnipayDto.setPaymentId(paymentDetails.getId());
			paymentDetailsForUnipayDto.setAmount(paymentDetails.getAmount());
			result.add(paymentDetailsForUnipayDto);
		});
		log.info("resultPaymentDetails after for loop...................{}", result);
		return result;
	}

	@Override
	public AmountDetailsDto getTxnValueAndDueAmount(SalesTxnDaoExt salesTxnDao, Boolean isTcsPayment) {

		List<PaymentDetailsDaoExt> paymentDetailsDaoList = paymentDetailsRepository
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(salesTxnDao.getId(), null, null, null,
						CommonUtil.getLocationCode(), PaymentStatusEnum.getPaidPaymentStatus());

		// filter based on TCS payment or regular payment
		if (isTcsPayment != null) {
			paymentDetailsDaoList = paymentDetailsDaoList.stream()
					.filter(paymentDao -> isTcsPayment.equals(paymentDao.getIsTcsPayment()))
					.collect(Collectors.toList());
		}

		// get amount from different transactions
		AmountDetailsDto amountDetailsDto = getTxnFinalValue(salesTxnDao);
		// set total amount
		amountDetailsDto.setTotalAmount(
				amountDetailsDto.getTotalAmount() == null ? BigDecimal.ZERO : amountDetailsDto.getTotalAmount());

		BigDecimal amountPaid = BigDecimal.ZERO;
		if (!paymentDetailsDaoList.isEmpty()) {
			for (PaymentDetailsDaoExt p : paymentDetailsDaoList) {
				amountPaid = amountPaid.add(p.getAmount());
			}
		}

		if (BooleanUtils.isTrue(isTcsPayment)) {
			// for TCS payment, check due amount against TCS amount.
			amountDetailsDto.setAmountDue(amountDetailsDto.getTcsAmount().subtract(amountPaid));
		} else if (BooleanUtils.isFalse(isTcsPayment)) {
			amountDetailsDto.setAmountDue(
					amountDetailsDto.getTotalAmount().subtract(amountDetailsDto.getTcsAmount()).subtract(amountPaid));
		} else {
			amountDetailsDto.setAmountDue(amountDetailsDto.getTotalAmount().subtract(amountPaid));
		}

		return amountDetailsDto;

	}

	@Override
	public AmountDetailsDto getTxnFinalValue(SalesTxnDaoExt salesTxnDao) {

		BigDecimal totalAmt = BigDecimal.ZERO;
		BigDecimal tcsAmount = BigDecimal.ZERO;
		BigDecimal totalWeight = BigDecimal.ZERO;
		BigDecimal totalGoldWeight = BigDecimal.ZERO;
		if (TransactionTypeEnum.CM.name().equals(salesTxnDao.getTxnType())) {
			CashMemoDaoExt cashMemoDao = cashMemoRepository.findOneByIdAndSalesTxnDaoLocationCode(salesTxnDao.getId(),
					CommonUtil.getLocationCode());
			totalAmt = cashMemoDao.getFinalValue();
			totalWeight = cashMemoDao.getTotalWeight();
			List<CashMemoDetailsDaoExt> detailsDaoExtList=cashMemoDetailsRepository.findByCashMemoDaoId(cashMemoDao.getId());
			for (CashMemoDetailsDaoExt cashMemoDetailsDaoExt : detailsDaoExtList) {
				totalGoldWeight = getGoldWeightFromTxn(totalGoldWeight, cashMemoDetailsDaoExt.getMeasuredWeightDetails());
			}
			if (cashMemoDao.getTcsAmount() != null)
				tcsAmount = cashMemoDao.getTcsAmount();
		} else if (TransactionTypeEnum.ADV.name().equals(salesTxnDao.getTxnType())) {
			AdvanceDaoExt adv = advanceService.getById(salesTxnDao.getId());
			totalAmt = adv.getFinalValue();
		} else if (TransactionTypeEnum.AB.name().equals(salesTxnDao.getTxnType())
				|| TransactionTypeEnum.CO.name().equals(salesTxnDao.getTxnType())) {
			OrderDaoExt orderDao = orderRepository.findOneByIdAndSalesTxnLocationCodeAndTxnTypeAndSubTxnType(
					salesTxnDao.getId(), CommonUtil.getLocationCode(), salesTxnDao.getTxnType(),
					salesTxnDao.getSubTxnType());
			totalAmt = orderDao.getFinalValue();
			totalWeight = orderDao.getTotalWeight();
			List<OrderDetailsDaoExt> detailsDaoExtList=orderDetailsRepository.findAllByOrderId(orderDao.getId());
			for (OrderDetailsDaoExt DetailsDaoExt : detailsDaoExtList) {
				totalGoldWeight = getGoldWeightFromTxn(totalGoldWeight, DetailsDaoExt.getInventoryWeightDetails());
			}
		}
		AmountDetailsDto amountDetailsDto = new AmountDetailsDto();
		amountDetailsDto.setTotalAmount(totalAmt);
		amountDetailsDto.setTcsAmount(tcsAmount);
		amountDetailsDto.setTotalWeight(totalWeight);
		amountDetailsDto.setTotalGoldWeight(totalGoldWeight);
		return amountDetailsDto;

	}

	private BigDecimal getGoldWeightFromTxn(BigDecimal totalGoldWeight, String weightSplitDetails) {
		JsonData jsonData = MapperUtil.mapObjToClass(weightSplitDetails, JsonData.class);
		if (StringUtil.isBlankJsonData(jsonData)) {
			return totalGoldWeight;
		}
		WeightDetailsDto weightDetails = MapperUtil.mapObjToClass(jsonData.getData(), WeightDetailsDto.class);
		if (weightDetails.getGoldWeight() != null)
			totalGoldWeight = totalGoldWeight.add(weightDetails.getGoldWeight());
		return totalGoldWeight;
	}

	@Override
	public void reverseQCGC(PaymentDetailsDaoExt paymentDetailsDao) {

		GiftCardBaseReverseRedeemRequestDto reverseRedeemDto = new GiftCardBaseReverseRedeemRequestDto();
		JsonData jsonData = MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class);
		QwickcilverGCOtherDetailsDto qwickcilverGCOtherDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
				QwickcilverGCOtherDetailsDto.class);

		reverseRedeemDto.setCardNumber(paymentDetailsDao.getInstrumentNo());
		reverseRedeemDto.setInvoiceNumber(paymentDetailsDao.getId());
		reverseRedeemDto.setAmount(paymentDetailsDao.getAmount().doubleValue());
		reverseRedeemDto.setBillAmount(qwickcilverGCOtherDetailsDto.getBillAmount().doubleValue());
		reverseRedeemDto.setTransactionId(qwickcilverGCOtherDetailsDto.getTransactionId());

		GcResponseDto gcResponseDto = integrationService.reverseRedeemGiftCardBalance(VendorCodeEnum.QC_GC.name(),
				reverseRedeemDto, GiftCardTypeEnum.GIFTCARD_CODE);

		if (!"0".equals(gcResponseDto.getResponseCode())) {
			paymentDetailsDao.setStatus(PaymentStatusEnum.FAILED.name());
			paymentDetailsRepository.save(paymentDetailsDao);

			Map<String, String> errorCause = Map.of("cardNo", paymentDetailsDao.getInstrumentNo(), "errorMessage",
					gcResponseDto.getResponseMessage());

			throw new ServiceException(null, gcResponseDto.getResponseCode(), errorCause);
		}

		// set status to 'REVERSED'
		paymentDetailsDao.setStatus(PaymentStatusEnum.REVERSED.name());

	}

	@Override
	public boolean hostNameMappingCheck(String paymentCode, Boolean ignoreError) {

		if (StringUtils.isEmpty(CommonUtil.getAuthUser().getHostName())) {
			throw new ServiceException(SalesConstants.HOST_NAME_IS_NOT_MAPPED_TO_PAYMENT_CODE,
					SalesConstants.ERR_SALE_058, "Host name is not mapped for " + paymentCode);
		}

		boolean isHostnameMapped = true;
		List<String> paymentCodeList = engineService.getDevices().getResults();

		if (!paymentCodeList.contains(paymentCode)) {
			if (!BooleanUtils.isTrue(ignoreError)) {
				throw new ServiceException(SalesConstants.HOST_NAME_IS_NOT_MAPPED_TO_PAYMENT_CODE,
						SalesConstants.ERR_SALE_058, "Host name is not mapped for " + paymentCode);
			}
			isHostnameMapped = false;
		}

		return isHostnameMapped;
	}

	@Override
	public PaymentDetailsDaoExt getMetalRateProtectedCNIfExists(SalesTxnDaoExt salesTxnDao) {
		List<PaymentDetailsDaoExt> paymentDetailsDaoList = paymentDetailsRepository
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(salesTxnDao.getId(),
						PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), null, null, salesTxnDao.getLocationCode(),
						PaymentStatusEnum.getPaidPaymentStatus());
		PaymentDetailsDaoExt rateProtectedPayment = null;
		if (CollectionUtil.isEmpty(paymentDetailsDaoList)) {
			return rateProtectedPayment;
		}

		for (PaymentDetailsDaoExt paymentDetailsDao : paymentDetailsDaoList) {
			if (!StringUtil.isBlankJsonStr(paymentDetailsDao.getOtherDetails())) {
				JsonData cnOtherDetails = MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class);
				Boolean isRateProtectedCN = JsonUtils.getValueFromJson(cnOtherDetails.getData(),
						SalesConstants.IS_RATE_PROTECTED_CN, Boolean.class);
				if (BooleanUtils.isTrue(isRateProtectedCN)) {
					rateProtectedPayment = paymentDetailsDao;
					break;
				}
			}

		}

		return rateProtectedPayment;
	}

	@Override
	public void validTxnForRateFreezedCN(SalesTxnDaoExt salesTxnDao, PaymentDetailsDaoExt paymentDetailsDao) {

		if (paymentDetailsDao == null) {
			return;
		}

		CreditNoteDaoExt creditNoteDaoExt = creditNoteRepository
				.findByIdAndLocationCode(paymentDetailsDao.getReference3(), CommonUtil.getStoreCode());
		JsonData jsonData = MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class);
		CreditNotePaymentOtherDetailsDto cnOtherDetails = MapperUtil.mapObjToClass(jsonData.getData(),
				CreditNotePaymentOtherDetailsDto.class);

		validPaymentForRateFreezedCN(paymentDetailsDao, creditNoteDaoExt, cnOtherDetails, false);

	}

	@Override
	public AmountDetailsDto validPaymentForRateFreezedCN(PaymentDetailsDaoExt paymentDetailsDao,
			CreditNoteDaoExt creditNoteDaoExt, CreditNotePaymentOtherDetailsDto cnOtherDetails, boolean isRedeemCN) {

		BigDecimal amountToRedeem = paymentDetailsDao.getAmount();
		LocationCacheDto locationCacheDto = engineService
				.getStoreLocation(paymentDetailsDao.getSalesTxnDao().getLocationCode());
		AmountDetailsDto amountDetailsDto = getTxnValueAndDueAmount(paymentDetailsDao.getSalesTxnDao(), null);

		// get amount to redeem.
		// if due amount is less than zero, then CN to be redeemed partially
		if (BigDecimal.ZERO.compareTo(amountDetailsDto.getAmountDue()) > 0) {

			BigDecimal minUtilzPct = getMinUtlizPctForRateProtectedCn(paymentDetailsDao, creditNoteDaoExt,
					locationCacheDto);

			// check for GRF min utilization
			amountToRedeem = amountDetailsDto.getTotalAmount().subtract(amountDetailsDto.getTcsAmount());
			BigDecimal minUtlzAmount = creditNoteDaoExt.getAmount().multiply(minUtilzPct.divide(new BigDecimal(100)))
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);
			if (amountToRedeem.compareTo(minUtlzAmount) < 0) {
				throw new ServiceException(SalesConstants.INVOICE_AMOUNT_LESS_THAN_MINIMUM_WEIGHT_AND_VALUE_TOLERANCE,
						SalesConstants.ERR_SALE_363,
						"Transaction amount is: " + amountToRedeem + ", Minimum utlization amount: " + minUtlzAmount);
			}

		} else {
			// check if CM weight and value is within range
			RuleRequestListDto ruleRequestListDto = new RuleRequestListDto();
			ruleRequestListDto.setLocationCode(locationCacheDto.getLocationCode());
			RuleTypeEnum ruleType = CNType.ADV.name().equals(paymentDetailsDao.getInstrumentType())
					? RuleTypeEnum.GRF_CONFIGURATION
					: RuleTypeEnum.GRN_TOLERANCE_CONFIG;
			Object response = engineService.getRuleFieldValues(ruleType, ruleRequestListDto);
			GrfConfigDetails grfConfigDetails = MapperUtil.mapObjToClass(response, GrfConfigDetails.class);
			// if allowed category is 'PLAIN' then check weight config
			if (AllowedCategoryForCN.PLAIN.name().equals(cnOtherDetails.getAllowedCategory())) {
				validateRateFreezeToleranceByWeight(cnOtherDetails, locationCacheDto, amountDetailsDto,
						grfConfigDetails);
			}
			// if allowed category is 'STUDDED' then check weight config
			else if (AllowedCategoryForCN.STUDDED.name().equals(cnOtherDetails.getAllowedCategory())) {
				validateRateFreezeToleranceByValue(creditNoteDaoExt, locationCacheDto, amountDetailsDto,
						grfConfigDetails);
			}
		}

		if (isRedeemCN) {
			paymentDetailsDao.setAmount(amountToRedeem);
		}

		return amountDetailsDto;
	}

	private BigDecimal getMinUtlizPctForRateProtectedCn(PaymentDetailsDaoExt paymentDetailsDao,
			CreditNoteDaoExt creditNoteDaoExt, LocationCacheDto locationCacheDto) {
		BigDecimal minUtilzPct = null;
		if (CNType.ADV.name().equals(paymentDetailsDao.getInstrumentType()) && locationCacheDto.getGrfDetails() != null
				&& locationCacheDto.getGrfDetails().getMinimumUtilization() != null) {

			// if partial redemption, check for 'GRF Residual Forced Closure' and 'GRF
			// Residual Amount' and Update frozen weight with proper weight used.
			checkGrfResidualConfig(creditNoteDaoExt, locationCacheDto);

			minUtilzPct = new BigDecimal(locationCacheDto.getGrfDetails().getMinimumUtilization());
		} else if (CNType.GRN.name().equals(paymentDetailsDao.getInstrumentType())
				&& locationCacheDto.getGrnDetails() != null
				|| locationCacheDto.getGrnDetails().getMinUtilizationPercentForGRN() != null) {
			minUtilzPct = locationCacheDto.getGrnDetails().getMinUtilizationPercentForGRN();
		}
		if (minUtilzPct == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					paymentDetailsDao.getInstrumentType() + " minimum utilization details is not present for location "
							+ locationCacheDto.getLocationCode());
		}
		return minUtilzPct;
	}

	private void checkGrfResidualConfig(CreditNoteDaoExt creditNoteDaoExt, LocationCacheDto locationCacheDto) {
		RuleRequestListDto ruleRequestListDto = new RuleRequestListDto();
		ruleRequestListDto.setLocationCode(locationCacheDto.getLocationCode());
		Object response = engineService.getRuleFieldValues(
				RuleTypeEnum.valueOf(creditNoteDaoExt.getCreditNoteType().toUpperCase()), ruleRequestListDto);
		// call in redemption for child CN generation.
		// pending: to handle in GRN CN
		AdvanceCNRuleDetails advanceCNRuleDetails = MapperUtil.mapObjToClass(response, AdvanceCNRuleDetails.class);
		if (StringUtils.isEmpty(advanceCNRuleDetails.getGrfResidentialClosure())
				|| advanceCNRuleDetails.getIsPercent() == null
				|| StringUtils.isEmpty(advanceCNRuleDetails.getGrfResidualValueAmount())) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"'GRF residual closure' or 'GRF residual value amount' or 'Is Percentage?' details is not present for location "
							+ locationCacheDto.getLocationCode());
		}
	}

	private void validateRateFreezeToleranceByWeight(CreditNotePaymentOtherDetailsDto cnOtherDetails,
			LocationCacheDto locationCacheDto, AmountDetailsDto amountDetailsDto, GrfConfigDetails grfConfigDetails) {
		WeightBasedTolerance weightToleranceToCheck = null;
		// if CN weight falls within range, then transaction weight(total weight) should
		// not exceed (CN weight + tolerance weight)
		if (!CollectionUtil.isEmpty(grfConfigDetails.getWeightBased())) {
			for (WeightBasedTolerance weightBasedTolerance : grfConfigDetails.getWeightBased()) {
				if (cnOtherDetails.getFrozenRateDetails().getWeight()
						.compareTo(weightBasedTolerance.getFromRange()) >= 0
						&& cnOtherDetails.getFrozenRateDetails().getWeight()
								.compareTo(weightBasedTolerance.getToRange()) <= 0) {
					weightToleranceToCheck = weightBasedTolerance;
					break;
				}
			}
		}
		// if range not found, throw error
		if (weightToleranceToCheck == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"GRF weight tolerance details is not present for location " + locationCacheDto.getLocationCode());
		}
		BigDecimal maxWeightAllowed = cnOtherDetails.getFrozenRateDetails().getWeight()
				.add(weightToleranceToCheck.getToleranceValue())
				.setScale(DomainConstants.WEIGHT_SCALE, DomainConstants.ROUNDIND_MODE);
		if (amountDetailsDto.getTotalGoldWeight().compareTo(maxWeightAllowed) > 0) {
			throw new ServiceException(SalesConstants.TOTAL_WEIGHT_EXCEEDS_MAXIMUM_WEIGHT, SalesConstants.ERR_SALE_364,
					"Max weight allowed: " + maxWeightAllowed + ", transaction weight: "
							+ amountDetailsDto.getTotalGoldWeight());
		}
	}

	private void validateRateFreezeToleranceByValue(CreditNoteDaoExt creditNoteDaoExt,
			LocationCacheDto locationCacheDto, AmountDetailsDto amountDetailsDto, GrfConfigDetails grfConfigDetails) {
		ValueBasedTolerance valueToleranceToCheck = null;
		// if CN weight falls within range, then transaction weight(total weight) should
		// not exceed (CN weight + tolerance weight)
		if (!CollectionUtil.isEmpty(grfConfigDetails.getValueBased())) {
			for (ValueBasedTolerance valueBasedTolerance : grfConfigDetails.getValueBased()) {
				if (creditNoteDaoExt.getAmount().compareTo(valueBasedTolerance.getFromRange()) >= 0
						&& creditNoteDaoExt.getAmount().compareTo(valueBasedTolerance.getToRange()) <= 0) {
					valueToleranceToCheck = valueBasedTolerance;
					break;
				}
			}
		}
		// if range not found, throw error
		if (valueToleranceToCheck == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					creditNoteDaoExt.getCreditNoteType() + " value tolerance details is not present for location "
							+ locationCacheDto.getLocationCode());
		}
		BigDecimal maxValueAllowed = creditNoteDaoExt.getAmount()
				.add(creditNoteDaoExt.getAmount()
						.multiply(valueToleranceToCheck.getTolerancePercent().divide(new BigDecimal(100)))
						.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));
		if (amountDetailsDto.getTotalAmount().compareTo(maxValueAllowed) > 0) {
			throw new ServiceException(SalesConstants.TOTAL_VALUE_EXCEEDS_MAXIMUM_VALUE, SalesConstants.ERR_SALE_365,
					"Max value allowed: " + maxValueAllowed + ", transaction value: "
							+ amountDetailsDto.getTotalAmount());
		}
	}

	@Override
	public BigDecimal checkMinUtilization(PaymentDetailsDaoExt paymentDetailsDao, BigDecimal balance,
			BigDecimal minUtilizationPct, BigDecimal remainingOrPaymentAmount) {
		BigDecimal minUtilizationAmount = balance.multiply((minUtilizationPct.divide(new BigDecimal(100))));
		BigDecimal refundAmount = BigDecimal.ZERO;
		if (remainingOrPaymentAmount.compareTo(minUtilizationAmount) < 0) {

			// throw error without considering residual config, when utilization % is not
			// 100.
			if ((new BigDecimal(100)).compareTo(minUtilizationPct) != 0) {
				throw new ServiceException(SalesConstants.PAID_AMOUNT_SHOULD_NOT_BE_LESS_THAN_MINIMUM_UTILIZATION,
						SalesConstants.ERR_SALE_213, "Amount paid is less than minimum utilization for the GHS account "
								+ paymentDetailsDao.getInstrumentNo());

			} else {

				// get residualAsmount for GHS.
				CNRuleDetails cNRuleDetails = getGhsCNConfig();
				BigDecimal residualAmount = new BigDecimal(cNRuleDetails.getResidentialValueAmount());
				// amount should not be less than minimum utilization. Also payment allowed if
				// (balance - input amount) is less than residualAmount only for 100%
				// utilization. If not throw error without considering residual config.
				if ((balance.subtract(remainingOrPaymentAmount).compareTo(residualAmount) >= 0)) {
					throw new ServiceException(
							SalesConstants.DYNAMIC_MINIMUMUTILIZATIONPCT_OF_DYNAMIC_PAYMENTCODE_AMOUNT_TO_BE_UTILIZED,
							SalesConstants.ERR_SALE_392,
							"Amount paid is less than minimum utilization for the GHS account "
									+ paymentDetailsDao.getInstrumentNo(),
							Map.of("minimumUtilizationPct", "100 %", SalesConstants.PAYMENT_CODE,
									paymentDetailsDao.getPaymentCode()));
				}

				// save residualAmount to other details.
				// pending: set based on residual amount config
				refundAmount = balance.subtract(remainingOrPaymentAmount);
			}
		}

		return refundAmount;
	}

	private CNRuleDetails getGhsCNConfig() {

		RuleRequestListDto ruleRequestListDto = new RuleRequestListDto();
		ruleRequestListDto.setLocationCode(CommonUtil.getLocationCode());

		Object objRespose = engineService.getRuleFieldValues(RuleTypeEnum.GHS, ruleRequestListDto);

		if (StringUtils.isEmpty(objRespose)) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"GHS CN rule details is not present for the location " + CommonUtil.getLocationCode());
		}

		CNRuleDetails cNRuleDetails = MapperUtil.mapObjToClass(objRespose, CNRuleDetails.class);
		if (cNRuleDetails == null || StringUtils.isEmpty(cNRuleDetails.getResidentialValueAmount())) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"GHS CN 'residual value' details is not present for the location " + CommonUtil.getLocationCode());
		}

		return cNRuleDetails;
	}

	@Override
	public PaymentRequestsDao checkPaymentRequest(PaymentDetailsDaoExt paymentDetailsDao, String paymentRequestId) {

		Integer customerId = paymentDetailsDao.getSalesTxnDao().getCustomerId();
		PaymentRequestsDao paymentRequestDao = paymentRequestsRepository.findOneByIdAndLocationCode(paymentRequestId,
				CommonUtil.getStoreCode());

		if (paymentRequestDao == null) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid reference id: " + paymentDetailsDao.getReference2());
		}

		if (!paymentDetailsDao.getPaymentCode().equals(paymentRequestDao.getPaymentCode())) {
			throw new ServiceException(SalesConstants.INVALID_PAYMENT_CODE, SalesConstants.ERR_SALE_015,
					"Expected payment for: " + paymentDetailsDao.getPaymentCode() + " found: "
							+ paymentRequestDao.getPaymentCode());
		}

		// check status
		if (!PaymentRequestEnum.COMPLETED.name().equals(paymentRequestDao.getStatus())) {
			throw new ServiceException(SalesConstants.DYNAMIC_PAYMENTCODE_CANNOT_BE_USED_AS_PAYMENT,
					SalesConstants.ERR_SALE_088,
					"Payment request status should be: " + PaymentRequestEnum.COMPLETED.name() + ", found: "
							+ paymentRequestDao.getStatus(),
					Map.of(SalesConstants.PAYMENT_CODE, paymentDetailsDao.getPaymentCode()));
		}

		// check customer
		if (!paymentRequestDao.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId()
				.equals(customerId)) {
			throw new ServiceException(SalesConstants.PAYMENT_CANNOT_BE_USED_FOR_OTHER_CUSTOMER,
					SalesConstants.ERR_SALE_091,
					paymentDetailsDao.getPaymentCode() + " payment cannot be used for other customers");
		}

		if (paymentDetailsDao.getAmount().compareTo(paymentRequestDao.getAmount()) != 0) {
			throw new ServiceException(SalesConstants.AMOUNT_IS_NOT_IN_RANGE, SalesConstants.ERR_SALE_026,
					"Amount is not in range for the payment.");
		}

		return paymentRequestDao;
	}

	@Override
	public boolean isRivaahDiscountPresent(Integer discountMcPct, Integer discountUcpPct) {
		return ((discountMcPct != null && discountMcPct > 0) || (discountUcpPct != null && discountUcpPct > 0));
	}

	@Override
	public boolean isGhsDiscountPresent(BigDecimal bonus, Integer discountMcPct, Integer discountUcpPct) {

		return ((bonus != null && bonus.signum() > 0) || (isRivaahDiscountPresent(discountMcPct, discountUcpPct)));
	}

	@Override
	public void checkGhsAndCNClubbing(PaymentDetailsDaoExt paymentDetailsDao,
			List<PaymentDetailsDaoExt> paymentDetailsList, boolean isRivaahGhsExists, Set<String> isRivaahDetailsExists,
			String schemeType, String schemeCode) {
		String locationCode = paymentDetailsDao.getSalesTxnDao().getLocationCode();
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(locationCode);
		Set<String> schemeTypes = new HashSet<>();
		Set<String> schemeCodes = new HashSet<>();// to check shemeCode club/plan

		// check if GHS account is already added.
		isRivaahGhsExists = getDetailsOfExistingGhsAccounts(paymentDetailsList, schemeTypes, schemeCodes,
				isRivaahDetailsExists, isRivaahGhsExists);

		// check if GRAMMAGE and FIXED scheme can be clubbed
		// This is whether GRAMMAGE and fixed can be clubbed in single invoice or not.
		if (!isRivaahDetailsExists.contains(SalesConstants.NEW_PAYMENT_IS_RIVAAH_GHS) && schemeType != null) {
			// add current scheme type also
			schemeTypes.add(schemeType);
		} else if (schemeCode != null) {
			// add current scheme code to Rivaah scheme codes
			schemeCodes.add(schemeCode);
		}

		// if scheme type is greater than 1, then check isClibbing allowed to know if
		// account merge is restricted or not.
		if (schemeTypes.size() > 1) {
			if (locationCacheDto.getGhsDetails().getIsClubbingGHSAccRestricted() == null) {
				throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
						SalesConstants.ERR_SALE_023,
						"GHS clubbing details is not present for location: " + locationCode);
			} else if (BooleanUtils.isTrue(locationCacheDto.getGhsDetails().getIsClubbingGHSAccRestricted())) {
				throw new ServiceException(SalesConstants.ACCOUNT_CANNOT_BE_USED_AS_PAYMENT_DYNAMIC_REASON,
						SalesConstants.ERR_SALE_212,
						GHS_STRING + paymentDetailsDao.getReference3().toUpperCase() + ACCOUNT_STRING
								+ paymentDetailsDao.getInstrumentNo()
								+ CANNOT_BE_CLUBBED_WITH_OTHER_ACCOUNTS_ADDED_STING + " " + locationCode,
						Map.of(SalesConstants.REASON, GHS_STRING + paymentDetailsDao.getReference3().toUpperCase()
								+ ACCOUNT_CANNOT_BE_CLUBBED_WITH_OTHER_PAYMENTS_ADDED_STRING));
			}
		}

		// check RIVAAH configurations
		if (isRivaahGhsExists) {
			checkRivaahPaymentConfig(paymentDetailsDao, locationCode, locationCacheDto.getGhsDetails(), schemeTypes,
					schemeCodes, isRivaahDetailsExists, schemeType);
		}
	}

	private boolean getDetailsOfExistingGhsAccounts(List<PaymentDetailsDaoExt> paymentDetailsList,
			Set<String> schemeTypes, Set<String> schemeCodes, Set<String> isRivaahDetailsExists,
			boolean isRivaahGhsExists) {
		for (PaymentDetailsDaoExt paymentDao : paymentDetailsList) {
			JsonData jsonData = MapperUtil.mapObjToClass(paymentDao.getOtherDetails(), JsonData.class);
			String schemeType;
			String schemeCode;
			BigDecimal bonus;
			Integer discountMcPct;
			Integer discountUcpPct;
			if (PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(paymentDao.getPaymentCode())) {
				schemeType = paymentDao.getReference3();
				GhsPaymentOtherDetailsDto oldGhsOtherDetails = MapperUtil.mapObjToClass(jsonData.getData(),
						GhsPaymentOtherDetailsDto.class);
				schemeCode = oldGhsOtherDetails.getSchemeCode();
				bonus = oldGhsOtherDetails.getBonus();
				discountMcPct = oldGhsOtherDetails.getDiscountMcPct();
				discountUcpPct = oldGhsOtherDetails.getDiscountUcpPct();
			} else {
				CreditNotePaymentOtherDetailsDto cnOtherDetails = MapperUtil.mapObjToClass(jsonData.getData(),
						CreditNotePaymentOtherDetailsDto.class);
				schemeType = cnOtherDetails.getSchemeType();
				schemeCode = cnOtherDetails.getSchemeCode();
				bonus = cnOtherDetails.getBonus();
				discountMcPct = cnOtherDetails.getDiscountMcPct();
				discountUcpPct = cnOtherDetails.getDiscountUcpPct();
			}

			if (GhsSchemeTypeEnum.RIVAAH_SCHEME.name().equals(schemeType)) {
				isRivaahGhsExists = true;
				isRivaahDetailsExists.add("ghsRivaahExists");
				if (schemeCode != null)
					schemeCodes.add(schemeCode);
				if (isRivaahDiscountPresent(discountMcPct, discountUcpPct)) {
					// older Rivaah GHS account has discount %
					isRivaahDetailsExists.add("oldPaymentHasRivaahGhsDiscount");
				}
			} else if (schemeType != null) {
				schemeTypes.add(schemeType);// ignore RIVAAH_SCHEME at first
				if (bonus != null && bonus.signum() > 0) {
					// older GHS account has bonus
					isRivaahDetailsExists.add("oldPaymentHasGhsBonus");
				}
			}
			
			if (GhsSchemeTypeEnum.GRAMMAGE_SCHEME.name().equals(schemeType)) {
				isRivaahGhsExists = true;
				isRivaahDetailsExists.add("ghsGrammageExists");
				if (schemeCode != null)
					schemeCodes.add(schemeCode);
				if (isRivaahDiscountPresent(discountMcPct, discountUcpPct)) {
					isRivaahDetailsExists.add("oldPaymentHasGrammageDiscount");
				}
			} else if (schemeType != null) {
				schemeTypes.add(schemeType);// ignore GRAMMAGE_SCHEME at first
				if (bonus != null && bonus.signum() > 0) {
					// older GHS account has bonus
					isRivaahDetailsExists.add("oldPaymentHasRivaahBonus");
				}
			}

		}
		return isRivaahGhsExists;
	}

	private void checkRivaahPaymentConfig(PaymentDetailsDaoExt paymentDetailsDao, String locationCode,
			GhsDetails ghsLocationDetails, Set<String> schemeTypes, Set<String> schemeCodes,
			Set<String> isRivaahDetailsExists, String schemeType) {
		// 1. check if RIVAAH can be clubbed with others GHS(this is to be done if the
		// accounts have bonus/discount component, to be ignored for accounts which
		// don't have bonus/discount)
		if (!schemeTypes.isEmpty()) {
			if (ghsLocationDetails.getIsAllowedToClubRivahGhsAndGhs() == null) {
				throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
						SalesConstants.ERR_SALE_023,
						"Rivaah GHS clubbing details with other GHS is not present for location: " + locationCode);

			}
			if (ghsLocationDetails.getIsAllowedToClubRivahGhsAndGrammage() == null) {
				throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
						SalesConstants.ERR_SALE_023,
						"Rivaah GHS clubbing details with other Grammage is not present for location: " + locationCode);

			}
			// if regular GHS is present and either new or existing payment is RIVAAH but
			// club is not allowed, then throw error
			else if (BooleanUtils.isFalse(ghsLocationDetails.getIsAllowedToClubRivahGhsAndGhs())
					&& ((isRivaahDetailsExists.contains("oldPaymentHasGhsBonus")
							&& isRivaahDetailsExists.contains("newPaymentHasRivaahGhsDiscount"))
							|| (isRivaahDetailsExists.contains("oldPaymentHasRivaahGhsDiscount")
									&& isRivaahDetailsExists.contains("newPaymentHasGhsBonus")))) {
				throw new ServiceException(SalesConstants.ACCOUNT_CANNOT_BE_USED_AS_PAYMENT_DYNAMIC_REASON,
						SalesConstants.ERR_SALE_212,
						GHS_STRING + schemeType + ACCOUNT_STRING + paymentDetailsDao.getInstrumentNo()
								+ CANNOT_BE_CLUBBED_WITH_OTHER_ACCOUNTS_ADDED_STING + locationCode,
						Map.of(SalesConstants.REASON, GHS_STRING + schemeType.toUpperCase()
								+ ACCOUNT_CANNOT_BE_CLUBBED_WITH_OTHER_PAYMENTS_ADDED_STRING));
			}
			// if regular Rivaah is present and either new or existing payment is grammage but
			// club is not allowed, then throw error
			else if (BooleanUtils.isFalse(ghsLocationDetails.getIsAllowedToClubRivahGhsAndGrammage())
					&& ((isRivaahDetailsExists.contains("newPaymentIsRivaahGhs")
							&& isRivaahDetailsExists.contains("newPaymentHasRivaahGhsDiscount"))
							|| (isRivaahDetailsExists.contains("oldPaymentHasRivaahGhsDiscount")
									&& isRivaahDetailsExists.contains("newPaymentIsGrammageGhs")))) {
				throw new ServiceException(SalesConstants.ACCOUNT_CANNOT_BE_USED_AS_PAYMENT_DYNAMIC_REASON,
						SalesConstants.ERR_SALE_212,
						GHS_STRING + schemeType + ACCOUNT_STRING + paymentDetailsDao.getInstrumentNo()
								+ CANNOT_BE_CLUBBED_WITH_OTHER_ACCOUNTS_ADDED_STING + locationCode,
						Map.of(SalesConstants.REASON, GHS_STRING + schemeType.toUpperCase()
								+ ACCOUNT_CANNOT_BE_CLUBBED_WITH_OTHER_PAYMENTS_ADDED_STRING));
			}
		}

		// 2. check if same or different scheme is allowed.
		checkSchemeCodeforRivaah(paymentDetailsDao, locationCode, ghsLocationDetails, schemeCodes,
				isRivaahDetailsExists, schemeType);

	}

	private void checkSchemeCodeforRivaah(PaymentDetailsDaoExt paymentDetailsDao, String locationCode,
			GhsDetails ghsLocationDetails, Set<String> schemeCodes, Set<String> isRivaahDetailsExists,
			String schemeType) {
		// if both do not have GHS Rivaah then return
		if (!(isRivaahDetailsExists.contains(SalesConstants.NEW_PAYMENT_IS_RIVAAH_GHS)
				&& isRivaahDetailsExists.contains("ghsRivaahExists"))) {
			return;
		}

		// check if same or different scheme is allowed.
		// for same scheme code
		if (schemeCodes.size() == 1) {
			if (ghsLocationDetails.getIsAllowedToClubAccountsOfSameScheme() == null) {

				throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
						SalesConstants.ERR_SALE_023,
						"Rivaah GHS same scheme clubbing details is not present for location: " + locationCode);
			} else if (BooleanUtils.isFalse(ghsLocationDetails.getIsAllowedToClubAccountsOfSameScheme())) {

				throw new ServiceException(SalesConstants.ACCOUNT_CANNOT_BE_USED_AS_PAYMENT_DYNAMIC_REASON,
						SalesConstants.ERR_SALE_212,
						GHS_STRING + schemeType.toUpperCase() + ACCOUNT_STRING + paymentDetailsDao.getInstrumentNo()
								+ CANNOT_BE_CLUBBED_WITH_OTHER_ACCOUNTS_ADDED_STING + locationCode,
						Map.of(SalesConstants.REASON, GHS_STRING + schemeType.toUpperCase()
								+ ACCOUNT_CANNOT_BE_CLUBBED_WITH_OTHER_PAYMENTS_ADDED_STRING));
			}
		} // for different scheme code
		else {
			if (ghsLocationDetails.getIsAlowedToClubAccountsOfDiffCategory() == null) {

				throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
						SalesConstants.ERR_SALE_023,
						"Rivaah GHS different scheme clubbing details is not present for location: " + locationCode);
			} else if (BooleanUtils.isFalse(ghsLocationDetails.getIsAlowedToClubAccountsOfDiffCategory())) {

				throw new ServiceException(SalesConstants.ACCOUNT_CANNOT_BE_USED_AS_PAYMENT_DYNAMIC_REASON,
						SalesConstants.ERR_SALE_212,
						GHS_STRING + schemeType.toUpperCase() + ACCOUNT_STRING + paymentDetailsDao.getInstrumentNo()
								+ CANNOT_BE_CLUBBED_WITH_OTHER_ACCOUNTS_ADDED_STING + locationCode,
						Map.of(SalesConstants.REASON, GHS_STRING + schemeType.toUpperCase()
								+ ACCOUNT_CANNOT_BE_CLUBBED_WITH_OTHER_PAYMENTS_ADDED_STRING));
			}
		}
	}

	@Override
	public CNPaymentDetailsDto getPaymentDetailsForCNGeneration(List<PaymentDetailsDaoExt> paymentDetails,
						CNPaymentDetailsDto cnPaymentDetails) {
			
					if (CollectionUtils.isEmpty(paymentDetails)) {
						return cnPaymentDetails;
					}
			
					if (cnPaymentDetails == null)
						cnPaymentDetails = new CNPaymentDetailsDto();
					for (PaymentDetailsDaoExt payment : paymentDetails) {
						if (payment.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.CHEQUE.getPaymentcode())) {
							cnPaymentDetails.setCheque(true);
							cnPaymentDetails.setBankName(payment.getBankName());							
						} else if (payment.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.RTGS.getPaymentcode())) {
							cnPaymentDetails.setRTGS(true);
						} else if (payment.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.UNIPAY.getPaymentcode())) {
							cnPaymentDetails.setIsGeneratedForUnipayDeletion(true);
						} else if (payment.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.UPI.getPaymentcode())) {
							cnPaymentDetails.setUPI(true);
						}
						else if (payment.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.DD.getPaymentcode())) {
							cnPaymentDetails.setBankName(payment.getBankName());
						}
						if(cnPaymentDetails.getPaymentCodes()==null) {
							cnPaymentDetails.setPaymentCodes(new HashMap<>());
						}
						cnPaymentDetails.getPaymentCodes().put(payment.getPaymentCode(), payment.getInstrumentType());
						if(payment.getInstrumentNo()!=null) {
							cnPaymentDetails.setInstrumentNumber(payment.getInstrumentNo());
							
						}
					}
			
					return cnPaymentDetails;
				}

	@Override
	public CashPaymentDetailsDto getPaymentDetailsAndCheckCNAndQCGCPayment(List<PaymentDetailsDaoExt> paymentDetails) {

		Calendar cal1 = Calendar.getInstance();
		cal1.setTime(businessDayService.getBusinessDay().getBusinessDate());
		Calendar cal3 = Calendar.getInstance();
		CashPaymentDetailsDto cashPaymentDetailsDto = new CashPaymentDetailsDto();
		BigDecimal totalCashPaid = BigDecimal.ZERO;
		BigDecimal totalPmlaCashAmount = BigDecimal.ZERO;

		for (PaymentDetailsDaoExt paymentDetail : paymentDetails) {

			if (PaymentCodeEnum.CREDIT_NOTE.getPaymentcode().equals(paymentDetail.getPaymentCode())) {
				JsonData jsonData = MapperUtil.mapObjToClass(paymentDetail.getOtherDetails(), JsonData.class);

				Boolean isLinkedCn = JsonUtils.getValueFromJson(jsonData.getData(), "isLinkedCn", Boolean.class);
				Integer cnOwnerId = JsonUtils.getValueFromJson(jsonData.getData(), "cnOwnerId", Integer.class);
				Date originalDocDate = JsonUtils.getValueFromJson(jsonData.getData(), "originalDocDate", Date.class);
				cal3.setTime(originalDocDate);
				if (BooleanUtils.isNotTrue(isLinkedCn)) {
					if (cal3.before(cal1) || paymentDetail.getSalesTxnDao().getCustomerId().compareTo(cnOwnerId) != 0) {
						totalCashPaid = totalCashPaid.add(paymentDetail.getCashCollected());
					}
					if ((cal3.get(Calendar.MONTH) < cal1.get(Calendar.MONTH) || cal3.get(Calendar.YEAR) < cal1.get(Calendar.YEAR) )
							|| paymentDetail.getSalesTxnDao().getCustomerId().compareTo(cnOwnerId) != 0) {
						totalPmlaCashAmount = totalPmlaCashAmount.add(paymentDetail.getCashCollected());
					}
				}else {
					   log.info("isLinkedCn {}",isLinkedCn);
					   Date abDocDate = paymentDetail.getSalesTxnDao().getRefTxnId().getDocDate();
					   log.info("abDocDate {}",abDocDate);
					   Calendar cal4 = Calendar.getInstance();
					   cal4.setTime(abDocDate);
					   if(cal4.before(cal1)) {
						  totalCashPaid = totalCashPaid.add(paymentDetail.getCashCollected());
						  log.info("for AB cash limit   {}",totalCashPaid);
					   }
					   if((cal4.get(Calendar.MONTH) < cal1.get(Calendar.MONTH) || cal4.get(Calendar.YEAR) < cal1.get(Calendar.YEAR) )) {
						   totalPmlaCashAmount = totalPmlaCashAmount.add(paymentDetail.getCashCollected());
						   log.info("for AB cash pmla limit  {}",totalPmlaCashAmount);
					   }
				}
				
			} else if (PaymentCodeEnum.QCGC.getPaymentcode().equals(paymentDetail.getPaymentCode())
					&& paymentDetail.getInstrumentDate() != null) {
				
				JsonData jsonData = MapperUtil.mapObjToClass(paymentDetail.getOtherDetails(), JsonData.class);
				Integer qcgcOwnerId = JsonUtils.getValueFromJson(jsonData.getData(), "qcgcOwnerId", Integer.class);
				cal3.setTime(paymentDetail.getInstrumentDate());
                log.info("inside qcgcOwnerId",qcgcOwnerId);
                log.info("inside instrumentDate",paymentDetail.getInstrumentDate());
				if (cal3.before(cal1) || (qcgcOwnerId !=null && paymentDetail.getSalesTxnDao().getCustomerId().compareTo(qcgcOwnerId) != 0)) {
					totalCashPaid = totalCashPaid.add(paymentDetail.getCashCollected());
				}
				if ((cal3.get(Calendar.MONTH) < cal1.get(Calendar.MONTH) || cal3.get(Calendar.YEAR) < cal1.get(Calendar.YEAR)) || 
						(qcgcOwnerId !=null && paymentDetail.getSalesTxnDao().getCustomerId().compareTo(qcgcOwnerId) != 0)) {
					totalPmlaCashAmount = totalPmlaCashAmount.add(paymentDetail.getCashCollected());
				}

			} else {
				totalCashPaid = totalCashPaid.add(paymentDetail.getCashCollected());
				totalPmlaCashAmount = totalPmlaCashAmount.add(paymentDetail.getCashCollected());
			}
		}
		cashPaymentDetailsDto.setTotalCashPaid(totalCashPaid);
		cashPaymentDetailsDto.setTotalPmlaCashAmount(totalPmlaCashAmount);
		return cashPaymentDetailsDto;
	}

			

}
