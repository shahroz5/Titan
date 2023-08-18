/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.payment;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.dto.GVDetailsReqDto;
import com.titan.poss.core.dto.GVRequestDto;
import com.titan.poss.core.dto.GiftDetailsResponseDto;
import com.titan.poss.core.dto.GiftStatusDto;
import com.titan.poss.core.dto.GiftStatusRequestDto;
import com.titan.poss.core.dto.GiftVoucherRedeemDetailsDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.GiftVoucherStatusEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.LegacyGVResponse;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.GiftVoucherOtherDetailsDto;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.request.CNPaymentDetailsDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.response.CreditNoteResponse;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.ItemValueAndProductCodeDetailsDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.GiftVoucherPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.GiftVoucherPaymentService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * Service class for Gift Voucher.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesGiftVoucherPaymentService")
public class GiftVoucherPaymentServiceImpl implements GiftVoucherPaymentService {

	public GiftVoucherPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.GIFT_VOUCHER.getPaymentcode(), this);
	}

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private IntegrationService integrationService;

	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {
		GiftVoucherPaymentFieldsDto giftVoucherPaymentFieldsDto = (GiftVoucherPaymentFieldsDto) MapperUtil
				.getDtoMapping(paymentCreateDto, GiftVoucherPaymentFieldsDto.class);
		// validate payment fields.
		giftVoucherPaymentFieldsDto.validateFields(giftVoucherPaymentFieldsDto);

		return SalesUtil.mapDtoWithStatus(paymentCreateDto, PaymentStatusEnum.OPEN.name());
	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {
		// location check for GV is not there.
		return salesPaymentDto;
	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {

		// check total count of GV done for the current transaction.
		List<PaymentDetailsDaoExt> paymentDetailsDaoList = paymentDetailsRepository
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(
						paymentDetailsDao.getSalesTxnDao().getId(), paymentCode, null, null,
						CommonUtil.getLocationCode(), PaymentStatusEnum.getPaidPaymentStatus());

		// GV payment count restriction not necessary as per NAP-2327

		// check if card is already added
		paymentDetailsDaoList.forEach(paymentDetails -> {
			if (paymentDetailsDao.getInstrumentNo().equals(paymentDetails.getInstrumentNo())) {
				throw new ServiceException(SalesConstants.DYNAMIC_PAYMENT_CODE_IS_ALREADY_ADDED_FOR_PAYMENT,
						SalesConstants.ERR_SALE_034,
						PaymentCodeEnum.GIFT_VOUCHER.getPaymentcode() + " '" + paymentDetails.getInstrumentNo()
								+ "' is used already used as payment.",
						Map.of(SalesConstants.PAYMENT_CODE, paymentCode));
			}
		});

		// EPOSS call to get Gift Voucher details.
		GiftDetailsResponseDto giftResponseDto = checkGVDetails(paymentDetailsDao.getInstrumentNo());
		// Validate Gift Voucher details.
		List<PaymentItemMappingDaoExt> paymentItemMapList = validateGVDetails(giftResponseDto, paymentDetailsDao);

		// set instrumentType same as paymentCode
		paymentDetailsDao.setInstrumentType(paymentCode); // GIFT VOUCHER

		return Map.of(paymentDetailsDao, paymentItemMapList);
	}

	@Override
	public PaymentDetailsDaoExt triggerPayment(PaymentDetailsDaoExt paymentDetailsDao,
			SalesPaymentDto salesPaymentDto) {
		// no trigger payment
		return paymentDetailsDao;
	}

	@Override
	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {
		// no validate payment
		return null;
	}

	@Override
	public SalesPaymentDto validateAndUpdatePaymentDetails(String paymentCode, String status,
			PaymentUpdateDto paymentUpdateDto, PaymentDetailsDaoExt paymentDetailsDao) {
		// no update payment
		return null;
	}

	@Transactional
	@Override
	public void deletePayment(PaymentDetailsDaoExt paymentDetailsDao) {

		// if status is 'OPEN'. Direct delete
		if (PaymentStatusEnum.OPEN.name().equals(paymentDetailsDao.getStatus())) {
			paymentDetailsDao = paymentUtil.deletePaymentOpenDeleteElseReverse(paymentDetailsDao, false);
		}
		// else:
		else {
			// i. if not redeemed at legacy then reverse status at EPOSS
			// ii. else, CN generation
			List<LegacyGVResponse> giftVoucherStatus = getLegacyGVStatus(paymentDetailsDao);
			// NOTE: legacy GV status '2' means 'REDEEMABLE' in NAP.
			if (CollectionUtil.isEmpty(giftVoucherStatus) || giftVoucherStatus.get(0).getStatus() == 2) {
				GiftStatusDto giftStatusDto = new GiftStatusDto();
				giftStatusDto.setSerialNo(new BigInteger(paymentDetailsDao.getInstrumentNo()));
				giftStatusDto.setStatus(GiftVoucherStatusEnum.REDEEMABLE.name());

				// EPOSS call to redeem Gift voucher.
				epossCallService.callEposs(HttpMethod.PUT, "api/payment/v2/gift-vouchers/status", null,
						new GiftStatusRequestDto("Gift Voucher deleted", List.of(giftStatusDto), null),
						ListResponse.class);
				paymentDetailsDao.setStatus(PaymentStatusEnum.REVERSED.name());
			} else {
				paymentDetailsDao = paymentUtil.deletePaymentOpenDeleteElseReverse(paymentDetailsDao, true);
			}
		}

		// pending: otp to be cleared?
		paymentDetailsDao.setReference1(null);

		paymentDetailsRepository.save(paymentDetailsDao);

	}

	private List<LegacyGVResponse> getLegacyGVStatus(PaymentDetailsDaoExt paymentDetailsDao) {
		GVRequestDto gvRequest = new GVRequestDto();
		List<GVDetailsReqDto> reqGiftVoucherStatus = new ArrayList<>();
		GVDetailsReqDto gvStatus = new GVDetailsReqDto();
		gvStatus.setItemCode(paymentDetailsDao.getReference2());
		gvStatus.setSerialNo(new BigInteger(paymentDetailsDao.getInstrumentNo()));
		reqGiftVoucherStatus.add(gvStatus);
		gvRequest.setGvDetails(reqGiftVoucherStatus);
		Object obj = integrationService.getGiftVoucher(gvRequest);
		ObjectMapper mapper = new ObjectMapper();
		return mapper.convertValue(obj, new TypeReference<List<LegacyGVResponse>>() {
		});

	}

	@Override
	public PaymentDetailsDaoExt confirmPayment(PaymentDetailsDaoExt paymentDetailsDao, String status) {

		// if payment status is not OPEN do not allow
		// redemption.
		if (!SalesUtil.paymentStatusCheckForRedemption(paymentDetailsDao.getStatus())) {
			return paymentDetailsDao;
		}

		GiftStatusDto giftStatusDto = new GiftStatusDto();
		giftStatusDto.setSerialNo(new BigInteger(paymentDetailsDao.getInstrumentNo()));
		giftStatusDto.setStatus(GiftVoucherStatusEnum.REDEEMED.name());

		// pending: status based on redemption type and

		// set redemption details
		GiftVoucherRedeemDetailsDto giftVoucherRedeemDetailsDto = new GiftVoucherRedeemDetailsDto();

		giftVoucherRedeemDetailsDto.setRedeemedDate(CalendarUtils.getCurrentDate());
		giftVoucherRedeemDetailsDto.setLocationCode(CommonUtil.getLocationCode());
		giftVoucherRedeemDetailsDto.setDocType(paymentDetailsDao.getSalesTxnType());
		giftVoucherRedeemDetailsDto.setId(paymentDetailsDao.getSalesTxnDao().getId());

		// EPOSS call to redeem Gift voucher.
		try {
			epossCallService.callEposs(HttpMethod.PUT, "api/payment/v2/gift-vouchers/status", null,
					new GiftStatusRequestDto("Gift Voucher redeemed - check", List.of(giftStatusDto),
							giftVoucherRedeemDetailsDto),
					ListResponse.class);
		} catch (ServiceException e) {
			// update payment status on failure
			paymentDetailsDao.setStatus(PaymentStatusEnum.FAILED.name());
			paymentDetailsRepository.save(paymentDetailsDao);
			throw e;
		}

		paymentDetailsDao.setStatus(PaymentStatusEnum.COMPLETED.name());
		paymentDetailsRepository.save(paymentDetailsDao);

		return paymentDetailsDao;
	}

	@Override
	public Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate) {
		Map<String, Integer> cnDocs = new HashMap<>();
		if (!CollectionUtil.isEmpty(paymentDetails)) {
			Map<Boolean, CreditNoteIndvCreateDto> gvProductGrps = new HashMap<>();
			Map<Boolean, List<PaymentDetailsDaoExt>> gvProductPayments = new HashMap<>();
			// run a loop through 'gvList' to check ProductGroup combo and frame a new map based on it
			paymentDetails.forEach(payment -> { 
				JsonData jsonData = MapperUtil.mapObjToClass(payment.getOtherDetails(), JsonData.class);
				GiftVoucherOtherDetailsDto giftVoucherOtherDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(), GiftVoucherOtherDetailsDto .class);
				Boolean isEmptyProductGroupList = CollectionUtil.isEmpty(giftVoucherOtherDetailsDto.getProductGroupDetails());
				

				CreditNoteIndvCreateDto cnDto = gvProductGrps.get(isEmptyProductGroupList);
				// if null, new group set, else add to existing
				cnDto = cnDto == null ? new CreditNoteIndvCreateDto(BigDecimal.ZERO, BigDecimal.ZERO) : cnDto;

				cnDto.setAmount(cnDto.getAmount().add(payment.getAmount()));
				if (payment.getCashCollected() != null) {
					cnDto.setCashCollected(cnDto.getCashCollected().add(payment.getCashCollected()));
				}
				gvProductGrps.put(isEmptyProductGroupList, cnDto);
				// for payment combination
				List<PaymentDetailsDaoExt> paymentList;
				if (gvProductPayments.containsKey(isEmptyProductGroupList)) {
					paymentList = gvProductPayments.get(isEmptyProductGroupList);

				} else {
					paymentList = new ArrayList<>();
				}
				paymentList.add(payment);
				gvProductPayments.put(isEmptyProductGroupList, paymentList);

			});

			for(Map.Entry<Boolean, List<PaymentDetailsDaoExt>> productGroupPayments : gvProductPayments.entrySet())
			{
				cnDocs.putAll(paymentUtil.createCancelCN(productGroupPayments.getValue(), salesTxn, cancel, cnType, false, docDate));
				
			}
			
		}
		return cnDocs;
	}

	private GiftDetailsResponseDto checkGVDetails(String instrumentNo) {

		// EPOSS call to get Gift Voucher details and validate.
		Map<String, String> requestParams = Map.of("serialNo", instrumentNo);

		@SuppressWarnings("unchecked")
		PagedRestResponse<List<GiftDetailsResponseDto>> giftDetailsResponsePageList = epossCallService.callEposs(
				HttpMethod.GET, "api/payment/v2/gift-vouchers", requestParams, null, PagedRestResponse.class);

		List<GiftDetailsResponseDto> giftDetailsResponseDtoList = new ArrayList<>();

		for (Object giftResponseObj : giftDetailsResponsePageList.getResults()) {

			GiftDetailsResponseDto giftDetailsResponseDto = MapperUtil.mapObjToClass(giftResponseObj,
					GiftDetailsResponseDto.class);
			giftDetailsResponseDtoList.add(giftDetailsResponseDto);

		}

		if (giftDetailsResponseDtoList.isEmpty()) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Serial number " + instrumentNo + " is invalid.");
		}

		return giftDetailsResponseDtoList.get(0);

	}

	private List<PaymentItemMappingDaoExt> validateGVDetails(GiftDetailsResponseDto giftResponseDto,
			PaymentDetailsDaoExt paymentDetailsDao) {

		// status to be REDEEMABLE only
		if (!"REDEEMABLE".equals(giftResponseDto.getStatus())) {
			throw new ServiceException(SalesConstants.DYNAMIC_PAYMENTCODE_CANNOT_BE_USED_AS_PAYMENT,
					SalesConstants.ERR_SALE_088,
					"Status of voucher " + paymentDetailsDao.getInstrumentNo() + " is: " + giftResponseDto.getStatus(),
					Map.of(SalesConstants.PAYMENT_CODE, paymentDetailsDao.getPaymentCode()));
		}

		// validity - ignore time
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
		if (!(businessDate.compareTo(CalendarUtils.getStartOfDay(giftResponseDto.getValidFrom())) >= 0
				&& businessDate.compareTo(CalendarUtils.getStartOfDay(giftResponseDto.getValidTill())) <= 0)) {
			throw new ServiceException(SalesConstants.GIFT_CARD_OR_VOUCHER_HAS_EXPIRED, SalesConstants.ERR_SALE_027,
					"Gift Voucher " + giftResponseDto.getSerialNo() + " has expired.");
		}
		
		//if voucherProductGroupCodeListis not empty, 

		// product group code check
		List<String> voucherProductGroupCodeList = giftResponseDto.getExcludes() == null ? new ArrayList<>()
				: giftResponseDto.getExcludes();
		Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPgcDetails = paymentUtil.getItemProductGroupCodes(
				paymentDetailsDao.getSalesTxnType(), paymentDetailsDao.getSalesTxnDao().getId(),
				voucherProductGroupCodeList, paymentDetailsDao.getPaymentCode(), paymentDetailsDao.getInstrumentNo(),
				true);// isExcludePGC is true for 'GIFT VOUCHER' and is false for many
		// other applicable payments
		// get valid amount
		List<PaymentItemMappingDaoExt> paymentItemMapList = new ArrayList<>();
		if(!TransactionTypeEnum.ADV.name().equals(paymentDetailsDao.getSalesTxnDao().getTxnType())) {
		BigDecimal validAmount = paymentUtil.getValidPaymentForItems(paymentDetailsDao.getPaymentCode(),
				itemValueAndPgcDetails, paymentDetailsDao.getSalesTxnDao().getId());

		// check redemption amount
		 paymentItemMapList = paymentUtil.paymentCheckBasedOnRedemptionType(
				paymentDetailsDao.getAmount(), giftResponseDto.getTotalValue(), validAmount, "FULL", paymentDetailsDao,
				itemValueAndPgcDetails);
		}
		GiftVoucherOtherDetailsDto giftVoucherOtherDetailsDto = new GiftVoucherOtherDetailsDto();
		giftVoucherOtherDetailsDto.setRedemptionType("FULL"); // pending - partial redemption, will come later
		giftVoucherOtherDetailsDto.setGiftVoucherValue(giftResponseDto.getTotalValue());
		if(!voucherProductGroupCodeList.isEmpty())
		giftVoucherOtherDetailsDto.setProductGroupDetails(voucherProductGroupCodeList);
		
		
		paymentDetailsDao.setOtherDetails(MapperUtil
				.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), giftVoucherOtherDetailsDto)));

		// set other details to salesPaymentDto - will be required for redemption
		paymentDetailsDao.setOtherDetails(MapperUtil
				.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), giftVoucherOtherDetailsDto)));
		
		
	
		// set giftCode to reference2 and gv type to reference3
		paymentDetailsDao.setReference2(giftResponseDto.getGiftCode());

		return paymentItemMapList;
	}

	@Override
	public InstrumentCashAmountDto getEligibleAmount(Integer customerId, String paymentCode, SalesTxnDaoExt salesTxnDao,
			BigDecimal dueAmount) {

		return new InstrumentCashAmountDto(dueAmount, null, null, null);
	}

	@Override
	public void deleteTempPayment(PaymentDetailsDaoExt paymentDetailsDao) {

		paymentDetailsDao.setStatus(PaymentStatusEnum.DELETED.name());
		paymentDetailsRepository.save(paymentDetailsDao);

	}
}
