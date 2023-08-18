/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.validation.Valid;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.GhsTodayRevenueDto;
import com.titan.poss.core.dto.RevenueDto;
import com.titan.poss.core.dto.ServicePossRequestDto;
import com.titan.poss.core.dto.ServicePossRevenueDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.constants.DayActivityStatusEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.RevenueTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.BusinessDayDao;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentRequestsDao;
import com.titan.poss.sales.dao.PaymentReversalDao;
import com.titan.poss.sales.dao.RevenueSummaryDaoExt;
import com.titan.poss.sales.dto.constants.PaymentRequestEnum;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.request.RevenueDateDto;
import com.titan.poss.sales.dto.response.DayWiseRevenueDto;
import com.titan.poss.sales.dto.response.TodayRevenueDto;
import com.titan.poss.sales.repository.BusinessDayRepository;
import com.titan.poss.sales.repository.CancellationRepository;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentRequestsRepository;
import com.titan.poss.sales.repository.PaymentReversalRepository;
import com.titan.poss.sales.repository.RevenueSummaryRepositoryExt;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.RevenueService;
import com.titan.poss.sales.utils.RevenueUtil;

import io.swagger.annotations.Info;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("RevenueServiceImpl")
public class RevenueServiceImpl implements RevenueService {
	

	private static final String ERR_SALE_092 = "ERR-SALE-092";
	private static final String INVALID_DATE_RANGE = "Difference between given dates must be within 90 days";

	private static final String ERR_SALE_093 = "ERR-SALE-093";
	private static final String INVALID_DATA = "Invalid Json Data";

	private static final String ERR_SALE_095 = "ERR-SALE-093";
	private static final String LOCATION_CODE_MUST_NOT_BE_NULL = "Location code must be null";

	public static final String DATE_FORMAT = "yyyy-MM-dd";
	
	protected static final List<String> dayActivityStatusList = new ArrayList<>();

	static {
		dayActivityStatusList.add(DayActivityStatusEnum.OPEN.name());
		dayActivityStatusList.add(DayActivityStatusEnum.OPEN.name());
		dayActivityStatusList.add(DayActivityStatusEnum.EOD_IN_PROGRESS.name());
		dayActivityStatusList.add(DayActivityStatusEnum.BOD_IN_PROGRESS.name());
	}

	@Autowired
	private RevenueSummaryRepositoryExt revenueSummaryRepository;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	CancellationRepository cancellationRepository;

	@Autowired
	PaymentReversalRepository paymentReversalRepo;

	@Autowired
	BusinessDayServiceImpl businessDayServiceImpl;

	@Autowired
	private PaymentRequestsRepository paymentRequestsRepository;

	@Autowired
	private EngineService engineService;
	
	@Autowired
	private BusinessDayRepository businessDayRepository;
	
	@Autowired
	private IntegrationServiceClient integrationService;
	

	/**
	 * This API will return the day wise revenue.
	 * 
	 * @param dateDto
	 * @param pageable
	 * @return PagedRestResponse<List<DayWiseRevenueDto>>
	 * @throws ParseException
	 */
	@Override
	public PagedRestResponse<List<DayWiseRevenueDto>> getDayWiseRevenue(RevenueDateDto dateDto, Pageable pageable) {

		List<DayWiseRevenueDto> dayWiseRevenueDtoList = new ArrayList<>();

		if (CalendarUtils.getDayDiff(dateDto.getFromDate(), dateDto.getToDate()) > 90) {
			throw new ServiceException(INVALID_DATE_RANGE, ERR_SALE_092);
		}

		Page<RevenueSummaryDaoExt> revenueSummaryDaoList = revenueSummaryRepository.findByBusinessDateAndLocationCode(
				dateDto.getFromDate(), dateDto.getToDate(), pageable, CommonUtil.getLocationCode());

		for (RevenueSummaryDaoExt revenueSummary : revenueSummaryDaoList) {
			List<RevenueDto> btqRevenueDtoList = new ArrayList<>();
			List<RevenueDto> ghsRevenueDtoList = new ArrayList<>();
			List<RevenueDto> serviceRevenueDtoList = new ArrayList<>();
			ObjectMapper mapper = new ObjectMapper();
			try {
				if (revenueSummary.getRevenueDetails() != null
						&& mapper.readTree(revenueSummary.getRevenueDetails()).get(CommonConstants.DATA) != null) {
					JsonNode jsonResponse = mapper.readTree(revenueSummary.getRevenueDetails())
							.get(CommonConstants.DATA);
					btqRevenueDtoList = Arrays
							.asList(new ObjectMapper().readValue(jsonResponse.toString(), RevenueDto[].class));
				}
				if (revenueSummary.getGhsRevenueDetails() != null
						&& mapper.readTree(revenueSummary.getGhsRevenueDetails()).get(CommonConstants.DATA) != null) {
					JsonNode jsonResponse = mapper.readTree(revenueSummary.getGhsRevenueDetails())
							.get(CommonConstants.DATA);
					ghsRevenueDtoList = Arrays
							.asList(new ObjectMapper().readValue(jsonResponse.toString(), RevenueDto[].class));
				}
				if (revenueSummary.getServiceRevenueDetails() != null
						&& mapper.readTree(revenueSummary.getServiceRevenueDetails()).get(CommonConstants.DATA) != null) {
					JsonNode jsonResponse = mapper.readTree(revenueSummary.getServiceRevenueDetails())
							.get(CommonConstants.DATA);	
				serviceRevenueDtoList = Arrays
							.asList(new ObjectMapper().readValue(jsonResponse.toString(), RevenueDto[].class));
					
				}

				if (!ghsRevenueDtoList.isEmpty() && !btqRevenueDtoList.isEmpty() && !serviceRevenueDtoList.isEmpty() ) {
					getDayWiseRevenue(revenueSummary, mergeGHSBoutiqueRevenue(btqRevenueDtoList, ghsRevenueDtoList, serviceRevenueDtoList),
							dayWiseRevenueDtoList);
				} else if (ghsRevenueDtoList.isEmpty()) {
					if(!btqRevenueDtoList.isEmpty() && !serviceRevenueDtoList.isEmpty()) {
						getDayWiseRevenue(revenueSummary,mergeServiceRevenue(btqRevenueDtoList,serviceRevenueDtoList), dayWiseRevenueDtoList);
					}
					else if(serviceRevenueDtoList.isEmpty()) {
						getDayWiseRevenue(revenueSummary, btqRevenueDtoList, dayWiseRevenueDtoList);
					}
					else {
						getDayWiseRevenue(revenueSummary, serviceRevenueDtoList, dayWiseRevenueDtoList);
					}
				} else if (btqRevenueDtoList.isEmpty()) {
					if(!ghsRevenueDtoList.isEmpty() && !serviceRevenueDtoList.isEmpty()) {
						getDayWiseRevenue(revenueSummary,mergeServiceRevenue(ghsRevenueDtoList,serviceRevenueDtoList), dayWiseRevenueDtoList);
					}
					else if(serviceRevenueDtoList.isEmpty()) {
						getDayWiseRevenue(revenueSummary, ghsRevenueDtoList, dayWiseRevenueDtoList);
					}
					else {
						getDayWiseRevenue(revenueSummary, serviceRevenueDtoList, dayWiseRevenueDtoList);
					}
				
				}else if(serviceRevenueDtoList.isEmpty()) {
					
					if(!ghsRevenueDtoList.isEmpty() && !btqRevenueDtoList.isEmpty()) {
						getDayWiseRevenue(revenueSummary,mergeBoutiqueRevenue(btqRevenueDtoList,ghsRevenueDtoList), dayWiseRevenueDtoList);
					}
					else if(btqRevenueDtoList.isEmpty()) {
						getDayWiseRevenue(revenueSummary, ghsRevenueDtoList, dayWiseRevenueDtoList);
					}
					else {
						getDayWiseRevenue(revenueSummary, btqRevenueDtoList, dayWiseRevenueDtoList);
					}
				
					
				}

			} catch (IOException e) {
				throw new ServiceException(ERR_SALE_093, INVALID_DATA);
			}
		}
		return new PagedRestResponse<>(dayWiseRevenueDtoList, revenueSummaryDaoList);
	}

	/**
	 * This method will create the revenue DTO.
	 * 
	 * @param revenueSummary
	 * @param revenueDtoList
	 * @param dayWiseRevenueDtoList
	 */
	public void getDayWiseRevenue(RevenueSummaryDaoExt revenueSummary, List<RevenueDto> revenueDtoList,
			List<DayWiseRevenueDto> dayWiseRevenueDtoList) {
		DayWiseRevenueDto dayWiseRevenue = new DayWiseRevenueDto();
		dayWiseRevenue.setDate(revenueSummary.getBusinessDate());
		dayWiseRevenue.setRevenues(revenueDtoList);
		dayWiseRevenueDtoList.add(dayWiseRevenue);
	}

	/**
	 * This method will merge the BTQ and GHS revenue.
	 * 
	 * @param btqRevenueDtoList
	 * @param ghsRevenueDtoList
	 * @return List<RevenueDto>
	 */
	public List<RevenueDto> mergeGHSBoutiqueRevenue(List<RevenueDto> btqRevenueDtoList,
			List<RevenueDto> ghsRevenueDtoList, List<RevenueDto> serviceRevenueDtoList) {

		List<RevenueDto> revenueDtoList = new ArrayList<>();
		Map<String, RevenueDto> btqRevenue = new HashMap<>();
		Map<String, RevenueDto> ghsRevenue = new HashMap<>();
		Map<String, RevenueDto> serviceRevenue = new HashMap<>();

		convertRevenueToMap(btqRevenueDtoList, btqRevenue);
		convertRevenueToMap(ghsRevenueDtoList, ghsRevenue);
		convertRevenueToMap(serviceRevenueDtoList, serviceRevenue);

		RevenueUtil.getValidPaymentCodesDayWiseRevenue().forEach(paymentCode -> {
			
			if (btqRevenue.containsKey(paymentCode) && ghsRevenue.containsKey(paymentCode) && serviceRevenue.containsKey(paymentCode)) {

				RevenueDto revenueMapping = getRevenueDto(paymentCode,
						btqRevenue.get(paymentCode).getPayments()
						.add(ghsRevenue.get(paymentCode).getPayments())
								.add(serviceRevenue.get(paymentCode).getRevenues()!= null?serviceRevenue.get(paymentCode).getRevenues() : BigDecimal.ZERO ),
						btqRevenue.get(paymentCode).getReturns());
				revenueDtoList.add(revenueMapping);
			} else if (btqRevenue.containsKey(paymentCode)) {
				revenueDtoList.add(btqRevenue.get(paymentCode));
			} else if (ghsRevenue.containsKey(paymentCode)) {
				revenueDtoList.add(ghsRevenue.get(paymentCode));
			}else if(serviceRevenue.containsKey(paymentCode)) {
				revenueDtoList.add(serviceRevenue.get(paymentCode));
				
			}
		});

		return revenueDtoList;
	}

	/**
	 * This method will merge the BTQ and GHS revenue.
	 * 
	 * @param btqRevenueDtoList
	 * @param ghsRevenueDtoList
	 * @return List<RevenueDto>
	 */
	public List<RevenueDto> mergeBoutiqueRevenue(List<RevenueDto> btqRevenueDtoList,
			List<RevenueDto> ghsRevenueDtoList) {

		List<RevenueDto> revenueDtoList = new ArrayList<>();
		Map<String, RevenueDto> btqRevenue = new HashMap<>();
		Map<String, RevenueDto> ghsRevenue = new HashMap<>();

		convertRevenueToMap(btqRevenueDtoList, btqRevenue);
		convertRevenueToMap(ghsRevenueDtoList, ghsRevenue);

		RevenueUtil.getValidPaymentCodesDayWiseRevenue().forEach(paymentCode -> {

			if (btqRevenue.containsKey(paymentCode) && ghsRevenue.containsKey(paymentCode)) {

				RevenueDto revenueMapping = getRevenueDto(paymentCode,
						btqRevenue.get(paymentCode).getPayments().add(ghsRevenue.get(paymentCode).getPayments()),
						btqRevenue.get(paymentCode).getReturns());
				revenueDtoList.add(revenueMapping);
			} else if (btqRevenue.containsKey(paymentCode)) {
				revenueDtoList.add(btqRevenue.get(paymentCode));
			} else if (ghsRevenue.containsKey(paymentCode)) {
				revenueDtoList.add(ghsRevenue.get(paymentCode));
			}
		});

		return revenueDtoList;
	}

	/**
	 * This method will merge the BTQ/GHS and Service revenue.
	 * 
	 * @param btqRevenueDtoList/ghsRevenueDtoList
	 * @param ServiceRevenueDtoList
	 * @return List<RevenueDto>
	 */
	public List<RevenueDto> mergeServiceRevenue(List<RevenueDto> btqRevenueDtoList,
			List<RevenueDto> serviceRevenueDtoList) {

		List<RevenueDto> revenueDtoList = new ArrayList<>();
		Map<String, RevenueDto> btqRevenue = new HashMap<>();
		Map<String, RevenueDto> serviceRevenue = new HashMap<>();

		convertRevenueToMap(btqRevenueDtoList, btqRevenue);
		convertRevenueToMap(serviceRevenueDtoList, serviceRevenue);

		RevenueUtil.getValidPaymentCodesDayWiseRevenue().forEach(paymentCode -> {

			if (btqRevenue.containsKey(paymentCode) && serviceRevenue.containsKey(paymentCode)) {

				RevenueDto revenueMapping = getRevenueDto(paymentCode,
						btqRevenue.get(paymentCode).getPayments().add(serviceRevenue.get(paymentCode).getRevenues()!= null?serviceRevenue.get(paymentCode).getRevenues() : BigDecimal.ZERO),
						BigDecimal.ZERO);
				revenueDtoList.add(revenueMapping);
			} else if (btqRevenue.containsKey(paymentCode)) {
				revenueDtoList.add(btqRevenue.get(paymentCode));
			} else if (serviceRevenue.containsKey(paymentCode)) {
				revenueDtoList.add(serviceRevenue.get(paymentCode));
			}
		});

		return revenueDtoList;
	}

	/**
	 * 
	 * @param revenueDtoList
	 * @param revenue
	 * @return Map<String, RevenueDto>
	 */
	private Map<String, RevenueDto> convertRevenueToMap(List<RevenueDto> revenueDtoList,
			Map<String, RevenueDto> revenue) {

		for (RevenueDto revenueData : revenueDtoList) {
			revenue.put(revenueData.getPaymentCode(), revenueData);
		}

		return revenue;

	}

	/**
	 * API to get today's revenue collected in BTQ & EGHS
	 * 
	 * @param locationCode
	 * @return ListResponse<TodayRevenueDto>
	 * @throws ParseException
	 */
	@Override
	public ListResponse<TodayRevenueDto> getTodayRevenues(String locationCode)  {

		List<TodayRevenueDto> todayRevenueDtoList;

		if (Boolean.TRUE.equals(CommonUtil.isAStoreUser())) {
			locationCode = CommonUtil.getLocationCode();
		} else if (locationCode == null) {
			throw new ServiceException(ERR_SALE_095, LOCATION_CODE_MUST_NOT_BE_NULL);
		}

		Date todayDate = engineService.getBusinessDayInProgress(locationCode).getBusinessDate();
	 
		// get all payments where payment_details date is = business date & status is
		// COMPLETED or REVERSED_WITH_CN or REVERSED

		// for reversal: get all payment_details where reversal date is business date &
		// status is reversed
		// get all payment_reversal where reversal date is
		// business date
	    String paymentCode = PaymentCodeEnum.UNIPAY.getPaymentcode();
	    List<String> paymentMode = List.of(paymentCode,PaymentCodeEnum.AIRPAY.getPaymentcode(),PaymentCodeEnum.RAZOR_PAY.getPaymentcode());
	    List<String> paymentModes = RevenueUtil.getValidPaymentCodes();
	    paymentModes.add(paymentCode);
	    List<String> status = List.of(TransactionStatusEnum.OPEN.name(),TransactionStatusEnum.HOLD.name(),TransactionStatusEnum.APPROVAL_PENDING.name());
	    //paymentModes = RevenueUtil.getValidPaymentCodes();
		List<PaymentDetailsDaoExt> paymentDetailsDaoList = paymentDetailsRepository
				.getPaymentDetailsForRevenueCalculation(locationCode, todayDate, RevenueUtil.getValidTxnTypes(),
						paymentModes, RevenueUtil.getValidStatus(),
						RevenueUtil.getValidPaymentGroups(), RevenueUtil.getValidTxnStatus());
		List<PaymentDetailsDaoExt> paymentDetailsReversalDaoList = paymentDetailsRepository
				.getPaymentDetailsReversalForRevenueCalculation(locationCode, todayDate, RevenueUtil.getValidTxnTypes(),
						paymentModes, RevenueUtil.getReversedStatus(),
						RevenueUtil.getValidPaymentGroups(), RevenueUtil.getValidTxnStatus());
		
		List<String> reversalPaymentModes = RevenueUtil.getValidPaymentCodesReversal();
		reversalPaymentModes.add(paymentCode);
		
		List<PaymentReversalDao> paymentReversalDaoList = paymentReversalRepo.getPaymentReversalForRevenueCollection(
				locationCode, todayDate, reversalPaymentModes, RevenueUtil.getValidPaymentGroups());		

		// This is for Payment request for TEP Refund.

		List<PaymentReversalDao> paymentReversalTepList = paymentReversalRepo.getPaymentReversalForTepRevenueCollection(
				locationCode, todayDate, reversalPaymentModes, RevenueUtil.getValidPaymentGroups());

		// payment request table for 'AIRPAY' payments converted to Credit note
		List<PaymentRequestsDao> paymentRequestList = paymentRequestsRepository
				.findByStatusLocationCodeAndPaymentCodeAndDocDate(locationCode,
						List.of(PaymentRequestEnum.CLOSED.name()), List.of(PaymentCodeEnum.AIRPAY.getPaymentcode()),
						todayDate);
		// payment request table for 'AIRPAY' payments converted to Credit note
		List<PaymentRequestsDao> paymentRequestListRazorPay = paymentRequestsRepository
				.findByStatusLocationCodeAndPaymentCodeAndDocDate(locationCode,
						List.of(PaymentRequestEnum.CLOSED.name()), List.of(PaymentCodeEnum.RAZOR_PAY.getPaymentcode()),
						todayDate);
// added to verify condition if payment is reversed with cn in case of airpay,razorpay and unipay..
		List<PaymentDetailsDaoExt> paymentDetailsDaoListUnipay = paymentDetailsRepository
				.getPaymentDetailsForRevenueCalculation(locationCode, todayDate, RevenueUtil.getValidTxnTypes(),
						paymentMode,List.of(PaymentStatusEnum.REVERSED_WITH_CN.name()),
						RevenueUtil.getValidPaymentGroups(),status);
//		List<PaymentDetailsDaoExt> paymentDetailsReversalDaoListUnipay = paymentDetailsRepository
//				.getPaymentDetailsReversalForRevenueCalculation(locationCode, todayDate, RevenueUtil.getValidTxnTypes(),
//						paymentMode, RevenueUtil.getReversedStatus(),
//						RevenueUtil.getValidPaymentGroups(), RevenueUtil.getValidTxnStatus());

		Map<String, BigDecimal> collectedAmountMap = getCollectedAmount(paymentDetailsDaoList, paymentRequestList,
				paymentRequestListRazorPay,paymentDetailsDaoListUnipay);
		

		Map<String, BigDecimal> returnedAmountMap = getReturnedAmount(paymentReversalDaoList,
				paymentDetailsReversalDaoList, paymentReversalTepList);

		todayRevenueDtoList = getTodaysRevenueResponse(collectedAmountMap, returnedAmountMap);

		return new ListResponse<>(todayRevenueDtoList);
	}

	/**
	 * @param paymentDetailsDaoList
	 * @param paymentRequestListRazorPay
	 * @param paymentRequestListRazorPay
	 * @return
	 */
	private Map<String, BigDecimal> getCollectedAmount(List<PaymentDetailsDaoExt> paymentDetailsDaoList,
			List<PaymentRequestsDao> paymentRequestList, List<PaymentRequestsDao> paymentRequestListRazorPay,List<PaymentDetailsDaoExt> paymentDetailsDaoListUnipay) {

		Map<String, BigDecimal> collectedAmountMap = new HashMap<>();
		for(PaymentDetailsDaoExt paymentDetailsDao :paymentDetailsDaoList)
		{

			if (collectedAmountMap.containsKey(paymentDetailsDao.getPaymentCode())
					|| collectedAmountMap.containsKey(paymentDetailsDao.getPaymentGroup())) {
				if (RevenueUtil.getValidPaymentGroups().contains(paymentDetailsDao.getPaymentGroup())) {
					collectedAmountMap.put(paymentDetailsDao.getPaymentGroup(), collectedAmountMap
							.get(paymentDetailsDao.getPaymentGroup()).add(paymentDetailsDao.getAmount()));
				} else {
					if(paymentDetailsDao.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.UNIPAY.getPaymentcode())) {
						
					
					if(collectedAmountMap.get(PaymentCodeEnum.CARD.getPaymentcode())==null) {
						collectedAmountMap.put(PaymentCodeEnum.CARD.getPaymentcode(), paymentDetailsDao.getAmount());
					}
					else {
						collectedAmountMap.put(PaymentCodeEnum.CARD.getPaymentcode(), collectedAmountMap
								.get(PaymentCodeEnum.CARD.getPaymentcode()).add(paymentDetailsDao.getAmount()));
					}
					}
					else {
						collectedAmountMap.put(paymentDetailsDao.getPaymentCode(), collectedAmountMap
								.get(paymentDetailsDao.getPaymentCode()).add(paymentDetailsDao.getAmount()));
					}
						
					
				}
			} else {
				if (RevenueUtil.getValidPaymentGroups().contains(paymentDetailsDao.getPaymentGroup())) {
					collectedAmountMap.put(paymentDetailsDao.getPaymentGroup(), paymentDetailsDao.getAmount());
				} else {
					if(paymentDetailsDao.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.UNIPAY.getPaymentcode())) {
						
						if(collectedAmountMap.get(PaymentCodeEnum.CARD.getPaymentcode())==null) {
							collectedAmountMap.put(PaymentCodeEnum.CARD.getPaymentcode(), paymentDetailsDao.getAmount());
						}
						else {
							collectedAmountMap.put(PaymentCodeEnum.CARD.getPaymentcode(), collectedAmountMap
									.get(PaymentCodeEnum.CARD.getPaymentcode()).add(paymentDetailsDao.getAmount()));
						}
						
					}
					else {
						collectedAmountMap.put(paymentDetailsDao.getPaymentCode(), paymentDetailsDao.getAmount());
					}
				
				}
			}
		}
		// add payment request CNs to revenue collection

		paymentRequestList.forEach(paymentRequestDao -> {
			for (PaymentDetailsDaoExt paymentDetailsDao : paymentDetailsDaoList) {
				if (paymentDetailsDao.getPaymentCode().equalsIgnoreCase(paymentRequestDao.getPaymentCode())
						&& BooleanUtils.isTrue(paymentRequestDao.getIsCnGenerated())) {
					if (collectedAmountMap.containsKey(paymentRequestDao.getPaymentCode())) {
						collectedAmountMap.put(paymentRequestDao.getPaymentCode(), collectedAmountMap
								.get(paymentRequestDao.getPaymentCode()).add(paymentRequestDao.getAmount()));
					} else {
						collectedAmountMap.put(paymentRequestDao.getPaymentCode(), paymentRequestDao.getAmount());
					}
				}
			}

		});

		// add payment request CNs to revenue collection
		paymentRequestListRazorPay.forEach(paymentRequestDao -> {
			for (PaymentDetailsDaoExt paymentDetailsDao : paymentDetailsDaoList) {
				if (paymentDetailsDao.getPaymentCode().equalsIgnoreCase(paymentRequestDao.getPaymentCode())
						&& BooleanUtils.isTrue(paymentRequestDao.getIsCnGenerated())) {

					if (collectedAmountMap.containsKey(paymentRequestDao.getPaymentCode())) {
						collectedAmountMap.put(paymentRequestDao.getPaymentCode(), collectedAmountMap
								.get(paymentRequestDao.getPaymentCode()).add(paymentRequestDao.getAmount()));
					} else {
						collectedAmountMap.put(paymentRequestDao.getPaymentCode(), paymentRequestDao.getAmount());
					}
				}
			}
		});
		
		for(PaymentDetailsDaoExt paymentDetails :paymentDetailsDaoListUnipay) {
			if (RevenueUtil.getValidPaymentGroups().contains(paymentDetails.getPaymentGroup())) {
				if(collectedAmountMap.get(paymentDetails.getPaymentGroup())==null) {
					collectedAmountMap.put(paymentDetails.getPaymentGroup(),paymentDetails.getAmount());
				}
				else {
					collectedAmountMap.put(paymentDetails.getPaymentGroup(), collectedAmountMap
							.get(paymentDetails.getPaymentGroup()).add(paymentDetails.getAmount()));
				}
				
			}else {
			if(PaymentCodeEnum.UNIPAY.getPaymentcode().equals(paymentDetails.getPaymentCode())) {
				if(collectedAmountMap.get(PaymentCodeEnum.CARD.getPaymentcode())==null) {
					collectedAmountMap.put(PaymentCodeEnum.CARD.getPaymentcode(), paymentDetails.getAmount());
				}
				else {
					collectedAmountMap.put(PaymentCodeEnum.CARD.getPaymentcode(), collectedAmountMap
							.get(PaymentCodeEnum.CARD.getPaymentcode()).add(paymentDetails.getAmount()));
				}
				}
			else {
				if(collectedAmountMap.containsKey(paymentDetails.getPaymentCode())) {
					collectedAmountMap.put(paymentDetails.getPaymentCode(), collectedAmountMap
							.get(paymentDetails.getPaymentCode()).add(paymentDetails.getAmount()));
				}
				else {
					collectedAmountMap.put(paymentDetails.getPaymentCode(), (paymentDetails.getAmount()));
				}
							
				
			}
			}
			
		}
		return collectedAmountMap;
	}

	/**
	 * @param paymentReversalDaoList
	 * @param paymentDetailsReversalDaoList
	 * @return
	 */
	private Map<String, BigDecimal> getReturnedAmount(List<PaymentReversalDao> paymentReversalDaoList,
			List<PaymentDetailsDaoExt> paymentDetailsReversalDaoList, List<PaymentReversalDao> paymentReversalTepList) {
		Map<String, BigDecimal> returnedAmountMap = new HashMap<>();

		paymentReversalDaoList.forEach(paymentReversalDao -> {
			if (returnedAmountMap.containsKey(paymentReversalDao.getPaymentCode())
					|| returnedAmountMap.containsKey(paymentReversalDao.getPaymentGroup())) {
				if (RevenueUtil.getValidPaymentGroups().contains(paymentReversalDao.getPaymentGroup())) {
					returnedAmountMap.put(paymentReversalDao.getPaymentGroup(), returnedAmountMap
							.get(paymentReversalDao.getPaymentGroup()).add(paymentReversalDao.getAmount()));
				} else {
					if (PaymentCodeEnum.UNIPAY.getPaymentcode().equals(paymentReversalDao.getPaymentCode())) {
						if (returnedAmountMap.get(PaymentCodeEnum.CARD.getPaymentcode()) == null) {
							returnedAmountMap.put(PaymentCodeEnum.CARD.getPaymentcode(),
									paymentReversalDao.getAmount());
						} else {
							returnedAmountMap.put(PaymentCodeEnum.CARD.getPaymentcode(), returnedAmountMap
									.get(PaymentCodeEnum.CARD.getPaymentcode()).add(paymentReversalDao.getAmount()));
						}
					} else {
						returnedAmountMap.put(paymentReversalDao.getPaymentCode(), returnedAmountMap
								.get(paymentReversalDao.getPaymentCode()).add(paymentReversalDao.getAmount()));
					}
				}
			} else {
				if (RevenueUtil.getValidPaymentGroups().contains(paymentReversalDao.getPaymentGroup())) {
					returnedAmountMap.put(paymentReversalDao.getPaymentGroup(), paymentReversalDao.getAmount());
				} else {
					if (PaymentCodeEnum.UNIPAY.getPaymentcode().equals(paymentReversalDao.getPaymentCode())) {
						if (returnedAmountMap.get(PaymentCodeEnum.CARD.getPaymentcode()) == null) {
							returnedAmountMap.put(PaymentCodeEnum.CARD.getPaymentcode(),
									paymentReversalDao.getAmount());
						} else {
							returnedAmountMap.put(PaymentCodeEnum.CARD.getPaymentcode(), returnedAmountMap
									.get(PaymentCodeEnum.CARD.getPaymentcode()).add(paymentReversalDao.getAmount()));
						}
					} else {
						returnedAmountMap.put(paymentReversalDao.getPaymentCode(), paymentReversalDao.getAmount());
					}
				}
			}

		});

		paymentDetailsReversalDaoList.forEach(paymentDetailsDao -> {
			if (returnedAmountMap.containsKey(paymentDetailsDao.getPaymentCode())
					|| returnedAmountMap.containsKey(paymentDetailsDao.getPaymentGroup())) {

				if (RevenueUtil.getValidPaymentGroups().contains(paymentDetailsDao.getPaymentGroup())) {
					returnedAmountMap.put(paymentDetailsDao.getPaymentGroup(), returnedAmountMap
							.get(paymentDetailsDao.getPaymentGroup()).add(paymentDetailsDao.getAmount()));
				} else {
					if (PaymentCodeEnum.UNIPAY.getPaymentcode().equals(paymentDetailsDao.getPaymentCode())) {
						if (returnedAmountMap.get(PaymentCodeEnum.CARD.getPaymentcode()) == null) {
							returnedAmountMap.put(PaymentCodeEnum.CARD.getPaymentcode(), paymentDetailsDao.getAmount());
						} else {
							returnedAmountMap.put(PaymentCodeEnum.CARD.getPaymentcode(), returnedAmountMap
									.get(PaymentCodeEnum.CARD.getPaymentcode()).add(paymentDetailsDao.getAmount()));
						}
					} else {
						returnedAmountMap.put(paymentDetailsDao.getPaymentCode(), returnedAmountMap
								.get(paymentDetailsDao.getPaymentCode()).add(paymentDetailsDao.getAmount()));
					}
				}
			} else {
				if (RevenueUtil.getValidPaymentGroups().contains(paymentDetailsDao.getPaymentGroup())) {
					returnedAmountMap.put(paymentDetailsDao.getPaymentGroup(), paymentDetailsDao.getAmount());
				} else {
					if (PaymentCodeEnum.UNIPAY.getPaymentcode().equals(paymentDetailsDao.getPaymentCode())) {
						if (returnedAmountMap.get(PaymentCodeEnum.CARD.getPaymentcode()) == null) {
							returnedAmountMap.put(PaymentCodeEnum.CARD.getPaymentcode(), paymentDetailsDao.getAmount());
						} else {
							returnedAmountMap.put(PaymentCodeEnum.CARD.getPaymentcode(), returnedAmountMap
									.get(PaymentCodeEnum.CARD.getPaymentcode()).add(paymentDetailsDao.getAmount()));
						}
					} else {
						returnedAmountMap.put(paymentDetailsDao.getPaymentCode(), paymentDetailsDao.getAmount());
					}
				}
			}
		});

		paymentReversalTepList.forEach(paymentReversalDao -> {
			if (returnedAmountMap.containsKey(paymentReversalDao.getPaymentCode())
					|| returnedAmountMap.containsKey(paymentReversalDao.getPaymentGroup())) {
				if (RevenueUtil.getValidPaymentGroups().contains(paymentReversalDao.getPaymentGroup())) {
					returnedAmountMap.put(paymentReversalDao.getPaymentGroup(), returnedAmountMap
							.get(paymentReversalDao.getPaymentGroup()).add(paymentReversalDao.getAmount()));
				} else {
//					if (PaymentCodeEnum.RO_CHEQUE.getPaymentcode().equals(paymentReversalDao.getPaymentCode())
//							|| PaymentCodeEnum.RO_RTGS.getPaymentcode().equals(paymentReversalDao.getPaymentCode())) {
//						paymentReversalDao.setPaymentCode(PaymentCodeEnum.RO_PAYMENT.getPaymentcode());
//					}
					returnedAmountMap.put(paymentReversalDao.getPaymentCode(), returnedAmountMap
							.get(paymentReversalDao.getPaymentCode()).add(paymentReversalDao.getAmount()));
				}
			} else {
				if (RevenueUtil.getValidPaymentGroups().contains(paymentReversalDao.getPaymentGroup())) {
					returnedAmountMap.put(paymentReversalDao.getPaymentGroup(), paymentReversalDao.getAmount());
				} else {
//					if (PaymentCodeEnum.RO_CHEQUE.getPaymentcode().equals(paymentReversalDao.getPaymentCode())
//							|| PaymentCodeEnum.RO_RTGS.getPaymentcode().equals(paymentReversalDao.getPaymentCode())) {
//						paymentReversalDao.setPaymentCode(PaymentCodeEnum.RO_PAYMENT.getPaymentcode());
//					}
					returnedAmountMap.put(paymentReversalDao.getPaymentCode(), paymentReversalDao.getAmount());
				}
			}

		});

		return returnedAmountMap;
	}

	/**
	 * @param collectedAmountMap
	 * @param returnedAmountMap
	 * @return
	 */
	private List<TodayRevenueDto> getTodaysRevenueResponse(Map<String, BigDecimal> collectedAmountMap,
			Map<String, BigDecimal> returnedAmountMap) {

		TodayRevenueDto todayRevenueDto = new TodayRevenueDto();
		List<TodayRevenueDto> todayRevenueDtoList = new ArrayList<>();
		List<RevenueDto> revenueDtoList = new ArrayList<>();
		Set<String> validPaymentCode = new HashSet<>(RevenueUtil.getValidPaymentCodes());
		validPaymentCode.add(PaymentCodeEnum.AIRPAY.getPaymentcode());
		validPaymentCode.add(PaymentCodeEnum.RAZOR_PAY.getPaymentcode());
		validPaymentCode.addAll(RevenueUtil.getValidPaymentGroups());

		validPaymentCode.forEach(paymentCode -> {
			if (collectedAmountMap.containsKey(paymentCode) && returnedAmountMap.containsKey(paymentCode)) {
				RevenueDto revenueDto = getRevenueDto(paymentCode, collectedAmountMap.get(paymentCode),
						returnedAmountMap.get(paymentCode));
				revenueDtoList.add(revenueDto);
			} else if (collectedAmountMap.containsKey(paymentCode)) {
				revenueDtoList.add(getRevenueDto(paymentCode, collectedAmountMap.get(paymentCode), BigDecimal.ZERO));
			} else if (returnedAmountMap.containsKey(paymentCode)) {
				revenueDtoList.add(getRevenueDto(paymentCode, BigDecimal.ZERO, returnedAmountMap.get(paymentCode)));
			}
		});

		todayRevenueDto.setRevenueType(RevenueTypeEnum.POSS.name());
		todayRevenueDto.setRevenues(revenueDtoList);
		todayRevenueDtoList.add(todayRevenueDto);

		return todayRevenueDtoList;
	}

	/**
	 *
	 * @param paymentCode
	 * @param collectedAmount
	 * @param reversedAmount
	 * @return RevenueDto
	 */
	private RevenueDto getRevenueDto(String paymentCode, BigDecimal collectedAmount, BigDecimal reversedAmount) {
		RevenueDto revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(paymentCode);
		revenueDto.setPayments(collectedAmount);
		revenueDto.setReturns(reversedAmount);
		revenueDto.setRevenues(BigDecimal.valueOf(Math.floor(collectedAmount.subtract(reversedAmount).doubleValue())));
     //   revenueDto.setRevenues(collectedAmount.subtract(reversedAmount));
		return revenueDto;
	}

	@Override
	public ListResponse<GhsTodayRevenueDto> getGhsRevenue(String locationCode) {
		ListResponse<GhsTodayRevenueDto> ghsRevenue = null;

		if (Boolean.TRUE.equals(CommonUtil.isAStoreUser())) {
			locationCode = CommonUtil.getLocationCode();
		} else if (locationCode == null) {
			throw new ServiceException(ERR_SALE_095, LOCATION_CODE_MUST_NOT_BE_NULL);
		}
		List<BusinessDayDao> businessDayDaoList = businessDayRepository
				.findByStatusInAndLocationCode(dayActivityStatusList, locationCode);

		BusinessDateDto businessDay = new BusinessDateDto();
		if (businessDayDaoList.isEmpty()) {
			// if the list is empty, then checking for max business date for closed state.
			// required if schedulers are needed to run when the business date is in closed
			// state.
			List<BusinessDayDao> businessDayDao = businessDayRepository.getMaxBusinessDayForClosedState(locationCode,
					DayActivityStatusEnum.CLOSED.name());
			if (CollectionUtil.isEmpty(businessDayDao)) {
				throw new ServiceException("No record found in business day master.", "ERR-SALE-143",
						"No record found in business day master. For location: " + locationCode);
			}
			businessDay.setBusinessDate(businessDayDao.get(0).getBusinessDate());
			
		} else {
			// If status is BOD in progress, then taking business date -1
			if (businessDayDaoList.get(0).getStatus().equalsIgnoreCase(DayActivityStatusEnum.BOD_IN_PROGRESS.name())) {
				Calendar cal = Calendar.getInstance();
				cal.setTime(businessDayDaoList.get(0).getBusinessDate());
				cal.add(Calendar.DATE, -1);
				Date businessDateMinusOne = cal.getTime();
				businessDay.setBusinessDate(businessDateMinusOne);
				
			} else {
				businessDay.setBusinessDate(businessDayDaoList.get(0).getBusinessDate());


			}
		}
		 ghsRevenue = integrationService.getGhsTodayRevenue(businessDay, "GHS");
		
		
		return ghsRevenue;
	}

	@Override
	public Map<String, List<ServicePossRevenueDto>> getServiceRevenue(String locationCode) {
		Map<String, List<ServicePossRevenueDto>> serviceRevenue = null;
		if (Boolean.TRUE.equals(CommonUtil.isAStoreUser())) {
			locationCode = CommonUtil.getLocationCode();
		} else if (locationCode == null) {
			throw new ServiceException(ERR_SALE_095, LOCATION_CODE_MUST_NOT_BE_NULL);
		}
		List<BusinessDayDao> businessDayDaoList = businessDayRepository
				.findByStatusInAndLocationCode(dayActivityStatusList, locationCode);

		BusinessDateDto businessDay = new BusinessDateDto();
		if (businessDayDaoList.isEmpty()) {
			// if the list is empty, then checking for max business date for closed state.
			// required if schedulers are needed to run when the business date is in closed
			// state.
			List<BusinessDayDao> businessDayDao = businessDayRepository.getMaxBusinessDayForClosedState(locationCode,
					DayActivityStatusEnum.CLOSED.name());
			if (CollectionUtil.isEmpty(businessDayDao)) {
				throw new ServiceException("No record found in business day master.", "ERR-SALE-143",
						"No record found in business day master. For location: " + locationCode);
			}
			businessDay.setBusinessDate(businessDayDao.get(0).getBusinessDate());
		} else {
			// If status is BOD in progress, then taking business date -1
			if (businessDayDaoList.get(0).getStatus().equalsIgnoreCase(DayActivityStatusEnum.BOD_IN_PROGRESS.name())) {
				Calendar cal = Calendar.getInstance();
				cal.setTime(businessDayDaoList.get(0).getBusinessDate());
				cal.add(Calendar.DATE, -1);
				Date businessDateMinusOne = cal.getTime();
				businessDay.setBusinessDate(businessDateMinusOne);
				
			} else {
				businessDay.setBusinessDate(businessDayDaoList.get(0).getBusinessDate());


			}
		}
		ServicePossRequestDto servicePossRequestDto = new ServicePossRequestDto();
		serviceRevenue = integrationService.getServiceTodayRevenue(servicePossRequestDto);
		return serviceRevenue;
	}
}
