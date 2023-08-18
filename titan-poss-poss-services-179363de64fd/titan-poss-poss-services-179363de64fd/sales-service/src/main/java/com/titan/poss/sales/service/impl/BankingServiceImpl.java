/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.ContentTypesEnum;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.dto.BankingDetails;
import com.titan.poss.core.dto.BrandConfigDetails;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.DepositPasswordDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.FileUploadResponseData;
import com.titan.poss.core.dto.GlCodeDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.PayeeBankLocationDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.PasswordHashUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.sales.constants.DayActivityStatusEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.BankDepositDaoExt;
import com.titan.poss.sales.dao.BankDepositSummaryDaoExt;
import com.titan.poss.sales.dao.BusinessDayDaoExt;
import com.titan.poss.sales.dao.GhsBankDepositDaoExt;
import com.titan.poss.sales.dao.PIFSeriesDaoExt;
import com.titan.poss.sales.dao.RevenueSummaryDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.BankDepositSummarySyncDtoExt;
import com.titan.poss.sales.dto.BankDepositSyncDtoExt;
import com.titan.poss.sales.dto.BankDepositUpdate;
import com.titan.poss.sales.dto.DepositDateDto;
import com.titan.poss.sales.dto.DepositDto;
import com.titan.poss.sales.dto.DepositSummaryRequestDto;
import com.titan.poss.sales.dto.DepositSummaryResponseDto;
import com.titan.poss.sales.dto.FileUploadResponseDtoExt;
import com.titan.poss.sales.dto.GhsBankDepositDto;
import com.titan.poss.sales.dto.PaymentDepositDto;
import com.titan.poss.sales.dto.ServiceBankDepositDto;
import com.titan.poss.sales.dto.request.BankDepositUpdateRequestDto;
import com.titan.poss.sales.dto.request.BankingRequestDto;
import com.titan.poss.sales.dto.request.CNPaymentDetailsDto;
import com.titan.poss.sales.dto.request.DepositAmountRequestDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.request.RevenueDateDto;
import com.titan.poss.sales.dto.response.BankDepositResponseDto;
import com.titan.poss.sales.dto.response.DepositAmountResponseDto;
import com.titan.poss.sales.dto.response.DepositResponseDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.repository.BankDepositRepositoryExt;
import com.titan.poss.sales.repository.BankDepositeStagingRepositoryExt;
import com.titan.poss.sales.repository.BankDepositeSummaryRepositoryExt;
import com.titan.poss.sales.repository.BusinessDayRepositoryExt;
import com.titan.poss.sales.repository.PIFSeriesRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.RevenueSummaryRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.service.BankingService;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.utils.RevenueUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("BankingServiceImpl")
public class BankingServiceImpl implements BankingService {

	private static final String ERR_SALE_092 = "ERR-SALE-092";
	private static final String INVALID_DATE_RANGE = "Difference between given dates must be within 90 days";

	private static final String ERR_SALE_093 = "ERR-SALE-093";
	private static final String INVALID_DATA = "Invalid Json Data";

	private static final String ERR_CORE_031 = "ERR-CORE-031";
	private static final String INCORRECT_PASS = "Incorrect password.";

	private static final String ERR_SALE_250 = "ERR-SALE-250";
	private static final String VALIDATION_MANDATORY = "Password is mandatory for this location";

	private static final String ERR_SALE_243 = "ERR-SALE-243";
	private static final String BANKING_MANDATORY = "Banking is not enabled for the location";

	private static final String ERR_SALE_247 = "ERR-SALE-247";
	private static final String GHS_MANDATORY = "GHS is not enabled for the location";

	private static final String PIPE = "|";

	private static final Pattern NUMBER = Pattern.compile("\\d+");

	private static final String DATE_FORMAT1 = "MM/dd/yyyy hh:mm:ss aa";
	private static final String DATE_FORMAT2 = "dd-MMM-yyyy";

	private static final String ERR_SALE_283 = "ERR-SALE-283";
	private static final String INVALID_FILE = "Invalid File Format. Please contact your administrator.";
	
	private static final String ERR_SALE_469 = "ERR-SALE-469";
	private static final String SERVICE_POSS_MANDATORY = "Service poss is not enabled for the location";
	
	private static final String ERR_SALE_421 = "ERR-SALE-421";
	private static final String ERR_SALE_422 = "ERR-SALE-422";
	
	@Autowired
	private RevenueSummaryRepositoryExt revenueSummaryRepository;

	@Autowired
	private EngineServiceImpl engineService;

	@Autowired
	private BankDepositRepositoryExt bankDepositRepository;

	@Autowired
	private PIFSeriesRepositoryExt pifSeriesRepository;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private BankingServiceImpl bnkingServiceImpl;

	@Autowired
	private BusinessDayServiceImpl businessDayServiceImpl;

	@Autowired
	private BankDepositeStagingRepositoryExt bankDepositStagingRepository;

	@Autowired
	private BusinessDayRepositoryExt businessDayRepository;

	@Autowired
	private BankDepositeSummaryRepositoryExt bankDepositsSummaryRepository;

	@Autowired
	private EngineServiceClient engineServiceClient;
	
	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Value("${app.name}")
	private String appName;

	/**
	 * API to get day wise bank deposit for BTQ & EGHS
	 *
	 * @param revenueDateDto
	 * @param pageable
	 * @return PagedRestResponse<List < DepositResponseDto>>
	 */
	@Override
	public PagedRestResponse<List<DepositResponseDto>> getBankDeposits(RevenueDateDto revenueDateDto,
			Pageable pageable) {
		List<String> paymentCodes = List.of(PaymentCodeEnum.CASH.name(),PaymentCodeEnum.CHEQUE.name(),PaymentCodeEnum.DD.name(),PaymentCodeEnum.CARD.name());
		List<DepositResponseDto> depositResponseDtoList = new ArrayList<>();
		Date businessDay =businessDayServiceImpl.getBusinessDay().getBusinessDate();
		if (!businessDayServiceImpl.getBankingDetails().getIsBankingMandatory()) {
			throw new ServiceException(BANKING_MANDATORY, ERR_SALE_243);
		}

		if (CalendarUtils.getDayDiff(revenueDateDto.getFromDate(), revenueDateDto.getToDate()) > 90) {
			throw new ServiceException(INVALID_DATE_RANGE, ERR_SALE_092);
		}
		if(revenueDateDto.getFromDate().equals(businessDay) || revenueDateDto.getToDate().equals(businessDay)) {
			DepositResponseDto dayWiseDeposit = new DepositResponseDto();
			PaymentDepositDto cashDepositDto = new PaymentDepositDto(PaymentCodeEnum.CASH.getPaymentcode(),
					BigDecimal.ZERO, null);
			PaymentDepositDto cardDepositDto = new PaymentDepositDto(PaymentCodeEnum.CARD.getPaymentcode(),
					BigDecimal.ZERO, null);
			PaymentDepositDto chequeDepositDto = new PaymentDepositDto(PaymentCodeEnum.CHEQUE.getPaymentcode(),
					BigDecimal.ZERO, null);
			
			List<DepositDto> depositResponseDtos = bankDepositRepository.findByBusinessDateAndLocationCode(paymentCodes,businessDay,CommonUtil.getLocationCode());
			for(DepositDto depositResponseDto:depositResponseDtos ) {
			if (PaymentCodeEnum.CASH.getPaymentcode().equals(depositResponseDto.getPaymentCode())) {
				cashDepositDto.setDeposit(cashDepositDto.getDeposit().add(depositResponseDto.getDepositAmount()));
			} else if (PaymentCodeEnum.CARD.getPaymentcode().equals(depositResponseDto.getPaymentCode())) {
				cardDepositDto.setDeposit(cardDepositDto.getDeposit().add(depositResponseDto.getDepositAmount()));

			} else if (PaymentCodeEnum.CHEQUE.getPaymentcode().equals(depositResponseDto.getPaymentCode())
					|| PaymentCodeEnum.DD.getPaymentcode().equals(depositResponseDto.getPaymentCode())) {
				chequeDepositDto.setDeposit(chequeDepositDto.getDeposit().add(depositResponseDto.getDepositAmount()));

			}
			}
			
			List<PaymentDepositDto> paymentDepositDtoList = new ArrayList<PaymentDepositDto>();
			paymentDepositDtoList.add(cashDepositDto);
			paymentDepositDtoList.add(cardDepositDto);
			paymentDepositDtoList.add(chequeDepositDto);

			
			dayWiseDeposit.setDate(businessDay);
			dayWiseDeposit.setDeposits(paymentDepositDtoList);
			depositResponseDtoList.add(dayWiseDeposit);

		}
        Page<RevenueSummaryDaoExt> revenueSummaryDaoList = revenueSummaryRepository.findByBusinessDateAndLocationCode(
                revenueDateDto.getFromDate(), revenueDateDto.getToDate(), pageable, CommonUtil.getLocationCode());
    
		
		for (RevenueSummaryDaoExt revenueSummary : revenueSummaryDaoList) {
			List<PaymentDepositDto> depositDtoList;
			DepositResponseDto dayWiseDeposit = new DepositResponseDto();
			ObjectMapper mapper = new ObjectMapper();
			try {
				if (revenueSummary.getDepositDetails() != null
						&& mapper.readTree(revenueSummary.getDepositDetails()).get(CommonConstants.DATA) != null) {
					JsonNode jsonResponse = mapper.readTree(revenueSummary.getDepositDetails())
							.get(CommonConstants.DATA);
					depositDtoList = Arrays
							.asList(new ObjectMapper().readValue(jsonResponse.toString(), PaymentDepositDto[].class));

					PaymentDepositDto cashDepositDto = new PaymentDepositDto(PaymentCodeEnum.CASH.getPaymentcode(),
							BigDecimal.ZERO, null);
					PaymentDepositDto cardDepositDto = new PaymentDepositDto(PaymentCodeEnum.CARD.getPaymentcode(),
							BigDecimal.ZERO, null);
					PaymentDepositDto chequeDepositDto = new PaymentDepositDto(PaymentCodeEnum.CHEQUE.getPaymentcode(),
							BigDecimal.ZERO, null);

					for (PaymentDepositDto depositDto : depositDtoList) {

						if (PaymentCodeEnum.CASH.getPaymentcode().equals(depositDto.getPaymentCode())) {
							cashDepositDto.setDeposit(cashDepositDto.getDeposit().add(depositDto.getDeposit()));
						} else if (PaymentCodeEnum.CARD.getPaymentcode().equals(depositDto.getPaymentCode())) {
							cardDepositDto.setDeposit(cardDepositDto.getDeposit().add(depositDto.getDeposit()));

						} else if (PaymentCodeEnum.CHEQUE.getPaymentcode().equals(depositDto.getPaymentCode())
								|| PaymentCodeEnum.DD.getPaymentcode().equals(depositDto.getPaymentCode())) {
							chequeDepositDto.setDeposit(chequeDepositDto.getDeposit().add(depositDto.getDeposit()));

						}

					}
					List<PaymentDepositDto> paymentDepositDtoList = new ArrayList<PaymentDepositDto>();
					paymentDepositDtoList.add(cashDepositDto);
					paymentDepositDtoList.add(cardDepositDto);
					paymentDepositDtoList.add(chequeDepositDto);

					
					dayWiseDeposit.setDate(revenueSummary.getBusinessDate());
					dayWiseDeposit.setDeposits(paymentDepositDtoList);
					depositResponseDtoList.add(dayWiseDeposit);
				}

			} catch (IOException e) {
				throw new ServiceException(ERR_SALE_093, INVALID_DATA);
			}
		}
		
        return new PagedRestResponse<>(depositResponseDtoList,revenueSummaryDaoList);
		
	}
	
	

	/**
	 * This method will return the list of bank deposit details.
	 *
	 * @param pageable
	 * @return PagedRestResponse<List < PaymentDto>>
	 */
	@Override
	public PagedRestResponse<List<BankDepositResponseDto>> listBankDeposit(List<String> paymentCode,
			Pageable pageable) {
		List<BankDepositDaoExt> bankDepositList;
		Page<BankDepositDaoExt> bakDepositPageList;
		BankingDetails bankingDetails = businessDayServiceImpl.getBankingDetails();

		if (!bankingDetails.getIsBankingMandatory()) {
			throw new ServiceException(BANKING_MANDATORY, ERR_SALE_243);
		}
		BankDepositDaoExt bankDeposit = new BankDepositDaoExt();
		bankDeposit.setIsBankingCompleted(Boolean.FALSE);
		bankDeposit.setLocationCode(CommonUtil.getLocationCode());

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<BankDepositDaoExt> criteria = Example.of(bankDeposit, matcher);

		if (paymentCode == null || paymentCode.isEmpty()) {
			bakDepositPageList = bankDepositRepository.findAll(criteria, pageable);
		} else {
			bakDepositPageList = bankDepositRepository.findByIsBankingCompletedAndLocationCodeAndPaymentCodeIn(
					Boolean.FALSE, CommonUtil.getLocationCode(), paymentCode, pageable);
		}
		bankDepositList = bakDepositPageList.getContent();

		List<BankDepositResponseDto> bankDepositDtoList = bankDepositList.stream().map(bankDepositDetails -> {
			if (bankDepositDetails.getPifNo() == null && bankDepositDetails.getPaymentCode().equals(PaymentCodeEnum.CARD.getPaymentcode())) {
				bankDepositDetails.setPifNo(getPifNo(bankDepositDetails));
				bankDepositRepository.save(bankDepositDetails);
			}
			BankDepositResponseDto bankDepositResponse = (BankDepositResponseDto) MapperUtil
					.getObjectMapping(bankDepositDetails, new BankDepositResponseDto());
			return bankDepositResponse;
		}).collect(Collectors.toList());
	
		return new PagedRestResponse<>(bankDepositDtoList, bakDepositPageList);
	}
	

	/**
	 * This will validate the input.
	 * 
	 * @param bankDepositUpdate
	 */
	private void validateBankDepositDetails(BankDepositUpdate bankDepositUpdate) {

		if ((bankDepositUpdate.getAmount().subtract(bankDepositUpdate.getDepositAmount()).abs()
				.compareTo(getBrandDetails().getPasswordConfigForCashDeposit()) > 0)
				&& businessDayServiceImpl.getBankingDetails().getIsPasswordMandatory()) {
			if (bankDepositUpdate.getApprovalDetails() == null
					|| bankDepositUpdate.getApprovalDetails().getData() == null) {
				throw new ServiceException(VALIDATION_MANDATORY, ERR_SALE_250);
			}
			String password = null;
			try {
				password = new ObjectMapper()
						.readTree(MapperUtil.getJsonString(bankDepositUpdate.getApprovalDetails().getData()))
						.path("password").asText();
				if (password == null)
					throw new ServiceException(VALIDATION_MANDATORY, ERR_SALE_250);
			} catch (Exception e) {
				throw new ServiceException(VALIDATION_MANDATORY, ERR_SALE_250);
			}
			DepositPasswordDto depositPassword = new DepositPasswordDto(bankDepositUpdate.getBusinessDate(),
					bankDepositUpdate.getCollectionDate(), bankDepositUpdate.getDepositAmount());
			String generatedPassword = PasswordHashUtil.getPasswordForBanking(depositPassword,
					CommonUtil.getLocationCode());

			if (!generatedPassword.equals(password))
				throw new ServiceException(INCORRECT_PASS, ERR_CORE_031);
		}
	}

	private BrandConfigDetails getBrandDetails() {
		BrandDto brandDto = engineService.getBrand();
		return MapperUtil.getObjectMapperInstance().convertValue(brandDto.getConfigDetails().getData(),
				BrandConfigDetails.class);
	}

	public String getPifNo(BankDepositDaoExt bankDeposit) {

		PIFSeriesDaoExt pifSeriesDao;
		String pifRes = null;
		if (bankDeposit.getPaymentCode().equals(PaymentCodeEnum.CARD.getPaymentcode())) {
			pifSeriesDao = pifSeriesRepository.findByLocationCodeAndBankNameAndPaymentCode(
					CommonUtil.getLocationCode(), bankDeposit.getPayeeBankName(),
					bankDeposit.getPaymentCode());
	//nap_11352
//				Boolean isActive = engineServiceClient.getIsActive(bankDeposit.getPayeeBankName());
//				if(!BooleanUtils.isTrue(isActive)) {
//					throw new ServiceException("{bankName} is inactive","ERR-SALE-426",Map.of("bankName",bankDeposit.getPayeeBankName()));
//					
//				}

			Integer pifNo = 0;
			Map<String, String> errormap = new HashMap<>();
			if (pifSeriesDao != null) {
				pifNo = pifSeriesDao.getCurrentSeqNo() == 0 ? pifSeriesDao.getFromNo()
						: pifSeriesDao.getCurrentSeqNo() + 1;
				if (pifNo >= pifSeriesDao.getFromNo() && pifNo <= pifSeriesDao.getToNo()) {
					pifSeriesDao.setCurrentSeqNo(pifNo);
					pifSeriesRepository.save(pifSeriesDao);
				} else {
					errormap.put(bankDeposit.getPaymentCode(), bankDeposit.getPayeeBankName());
					throw new ServiceException("PIF NO is not in range", "ERR-SALE-240", errormap);
				}
		}
				//else {
//				throw new ServiceException(
//						"{bankName} bank is inactive",
//						"ERR-SALE-426 ");
//			}
			pifRes = Integer.toString(pifNo);
		} else {
			GlCodeDto glCode = engineServiceClient.getGLCode(CommonUtil.getLocationCode());
			String pifCash = increament(glCode.getPifSeriesNo());
			pifRes = glCode.getCostCenter() + pifCash;
			engineServiceClient.updateGlCode(CommonUtil.getLocationCode());
		}
		return pifRes;
	}

	private String increament(String pifSeriesNo) {
		return NUMBER.matcher(pifSeriesNo)
				.replaceFirst(s -> String.format("%0" + s.group().length() + "d", Integer.parseInt(s.group()) + 1));
	}

	/**
	 * This method will update the cash denomination for bank deposit details.
	 *
	 * @param bankDepositUpdate
	 * @return BankDepositDto
	 */
	@Transactional
	public PublishResponse updateBankDepositTransactional(BankDepositUpdateRequestDto bankDepositUpdate) {
		BankingDetails bankingDetails = businessDayServiceImpl.getBankingDetails();
		if (!bankingDetails.getIsBankingMandatory()) {
			throw new ServiceException(BANKING_MANDATORY, ERR_SALE_243);
		}
		//if(bankDepositUpdate)
		String cashPifNo = null;
		String homeBankchequePifNo = null;
		String nonHomeBankchequePifNo = null;
		List<BankDepositDaoExt> bankDepositList = new ArrayList<>();

		List<String> idList = bankDepositUpdate.getBankDeposit().stream().map(BankDepositUpdate::getId)
				.collect(Collectors.toList());

		List<BankDepositDaoExt> bankDepositDao = bankDepositRepository.findByIdInAndLocationCode(idList,
				CommonUtil.getLocationCode());

		Map<String, BankDepositUpdate> bankDepositDtoMap = new HashMap<>();
		bankDepositUpdate.getBankDeposit()
				.forEach(bankDeposit -> bankDepositDtoMap.put(bankDeposit.getId(), bankDeposit));

		//bankDepositDao.forEach(bankDeposit -> {
			for(BankDepositDaoExt bankDeposit:bankDepositDao) {
			validateBankDepositDetails(bankDepositDtoMap.get(bankDeposit.getId()));
			if (bankDepositDtoMap.get(bankDeposit.getId()).getApprovalDetails() != null) {
				bankDeposit.setApprovalDetails(
						MapperUtil.getJsonString(bankDepositDtoMap.get(bankDeposit.getId()).getApprovalDetails()));
			}
			bankDeposit.setAmount(bankDepositDtoMap.get(bankDeposit.getId()).getAmount());
			bankDeposit.setDepositAmount(bankDepositDtoMap.get(bankDeposit.getId()).getDepositAmount());
			if (bankingDetails.getEnableCashDeposit()
					&& bankDeposit.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.CASH.name()))
			{
				if(cashPifNo==null) {
					cashPifNo = getPifNo(bankDeposit);
				}
				bankDeposit.setPifNo(cashPifNo);
				if(bankDeposit.getAmount().compareTo(bankDeposit.getDepositAmount())!=0 && bankDeposit.getAmount().compareTo(bankDeposit.getDepositAmount())>0) {
					BusinessDayDaoExt businessDayDao = businessDayServiceImpl.validateBusinessDay(engineService.getBusinessDayInProgress().getBusinessDate());
					bankDeposit.setIsBankingCompleted(Boolean.FALSE);
					BankDepositDaoExt bankDeposits = new BankDepositDaoExt();
					bankDeposits.setCollectionDate(bankDeposit.getCollectionDate());
					bankDeposits.setPaymentCode(bankDeposit.getPaymentCode());
					bankDeposits.setAmount(bankDeposit.getAmount().subtract(bankDeposit.getDepositAmount()));
					bankDeposits.setDepositAmount(bankDeposits.getAmount());
					bankDeposits.setLocationCode(bankDeposit.getLocationCode());
					bankDeposits.setBusinessDate(bankDeposit.getBusinessDate());
					bankDeposits.setPayeeBankName(bankDeposit.getPayeeBankName());
					bankDeposits.setIsBankingCompleted(Boolean.FALSE);
					bankDeposits.setBusinessDayDao(businessDayDao);
					bankDeposits.setDepositDate(null);
					bankDeposits.setSrcSyncId(bankDeposit.getSrcSyncId() + 1);
					bankDeposits.setDestSyncId(0);
					bankDepositList.add(bankDeposits);
				}
				bankDeposit.setIsBankingCompleted(Boolean.FALSE);
			}
				
			 else if (bankingDetails.getEnableChequeDeposit()
					&& (bankDeposit.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.CHEQUE.name())
							|| bankDeposit.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.DD.name()))) {
				 if(homeBankchequePifNo == null && bankDeposit.getPayeeBankName().equals(bankDeposit.getPayerBankName())) {
					 homeBankchequePifNo = getPifNo(bankDeposit);
				 }
				 else if (nonHomeBankchequePifNo == null && !bankDeposit.getPayeeBankName().equals(bankDeposit.getPayerBankName())) {
					 nonHomeBankchequePifNo = getPifNo(bankDeposit);
				 }
				 if(bankDeposit.getPayeeBankName().equals(bankDeposit.getPayerBankName())) {
					 bankDeposit.setPifNo(homeBankchequePifNo);
				 }
				 else if(!bankDeposit.getPayeeBankName().equals(bankDeposit.getPayerBankName())) {
					 bankDeposit.setPifNo(nonHomeBankchequePifNo);				 
					 }
				bankDeposit.setIsBankingCompleted(Boolean.FALSE);
			} else {
				bankDeposit.setIsBankingCompleted(Boolean.TRUE);
			
			}
			bankDeposit.setDepositDate(engineService.getBusinessDayInProgress().getBusinessDate());
			bankDeposit.setSrcSyncId(bankDeposit.getSrcSyncId() + 1);
			bankDepositList.add(bankDeposit);

		};
		SyncStagingDto syncStagingDto = syncStagging(bankDepositList, SalesOperationCode.BANK_DEPOSIT);
		PublishResponse response = new PublishResponse();
		response.setApiResponse(new ListResponse<>(getDtoMappingForBankDeposit(bankDepositList)));
		response.setSyncStagingDto(syncStagingDto);
		return response;
	}

	public SyncStagingDto syncStagging(List<BankDepositDaoExt> bankDepositList, String operation) {
		bankDepositList = bankDepositRepository.saveAll(bankDepositList);
		SyncStagingDto salesStagingDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			List<SyncData> syncDataList = new ArrayList<>();
			List<String> destinations = new ArrayList<>();
			destinations.add(AppTypeEnum.EPOSS.name());
			if (!bankDepositList.isEmpty()) {
				List<BankDepositSyncDtoExt> syncDto = new ArrayList<>();
				bankDepositList.forEach(bankDao -> syncDto.add(new BankDepositSyncDtoExt(bankDao)));
				syncDataList.add(DataSyncUtil.createSyncData(syncDto, 0));
			}
			MessageRequest salesMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
					MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
			salesStagingDto = new SyncStagingDto();
			salesStagingDto.setMessageRequest(salesMsgRequest);
			String salesMsgRqst = MapperUtil.getJsonString(salesMsgRequest);
			SyncStaging salesSyncStaging = new SyncStaging();
			salesSyncStaging.setMessage(salesMsgRqst);
			salesSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			salesSyncStaging = saleSyncStagingRepository.save(salesSyncStaging);
			salesStagingDto.setId(salesSyncStaging.getId());
		}
		return salesStagingDto;
	}

	/**
	 * 
	 * @param list
	 * @return BankDepositResponseDto
	 */
	private List<BankDepositResponseDto> getDtoMappingForBankDeposit(List<BankDepositDaoExt> list) {
		List<BankDepositResponseDto> bankDepositDtoList = new ArrayList<>();
		list.forEach(bankDeposit -> {
			BankDepositResponseDto bankDepositDto = (BankDepositResponseDto) MapperUtil.getObjectMapping(bankDeposit,
					new BankDepositResponseDto());
			bankDepositDto.setLocationCode(CommonUtil.getLocationCode());
			bankDepositDtoList.add(bankDepositDto);
		});
		return bankDepositDtoList;
	}

	@Override
	public BooleanResponse getBankDeposit(BankingRequestDto bankingRequest) {

		List<BankDepositDaoExt> bankDepositList;

		if (!businessDayServiceImpl.getBankingDetails().getIsBankingMandatory()) {
			throw new ServiceException(BANKING_MANDATORY, ERR_SALE_243);
		}
		BusinessDayDaoExt businessDayDao = businessDayServiceImpl.validateBusinessDay(bankingRequest.getBusinessDate());

		// use BooleanUtil...
		if (businessDayDao.getSkipBanking() == null || !businessDayDao.getSkipBanking()) {

			if (bankingRequest.getSkipBanking() == null || bankingRequest.getSkipBanking().equals(Boolean.FALSE)) {
				BankDepositDaoExt bankDeposit = new BankDepositDaoExt();
				bankDeposit.setIsBankingCompleted(Boolean.FALSE);
				bankDeposit.setLocationCode(CommonUtil.getLocationCode());

				ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
				Example<BankDepositDaoExt> criteria = Example.of(bankDeposit, matcher);
				bankDepositList = bankDepositRepository.findAll(criteria);

				if (!bankDepositList.isEmpty()) {
					throw new ServiceException("Bank Deposit is not done for all payment code for business date",
							"ERR-SALE-138");
				}
			} else {

				businessDayServiceImpl.saveSkipBankDeposit(businessDayDao, bankingRequest);
			}
		}

		return new BooleanResponse(Boolean.TRUE);
	}

	@Override
	public GhsBankDepositDto getGHSBankDeposit() {

		if (!businessDayServiceImpl.getBankingDetails().getIsBankingMandatory()) {
			throw new ServiceException(BANKING_MANDATORY, ERR_SALE_243);
		}
		if (!businessDayServiceImpl.getGhsDetails().getIsEghsMandatory()) {
			throw new ServiceException(GHS_MANDATORY, ERR_SALE_247);
		}
		List<Date> dateList = new ArrayList<>();
		List<BusinessDayDaoExt> businessDateList = businessDayRepository
				.findByIsGHSFileUploadedAndLocationCode(Boolean.FALSE, CommonUtil.getLocationCode());
		BusinessDayDaoExt businessDayDao = businessDayRepository.findByLocationCodeAndBusinessDate(
				CommonUtil.getLocationCode(), engineService.getBusinessDayInProgress().getBusinessDate());
		if (!businessDateList.isEmpty()) {
			businessDateList.remove(businessDayDao);
			businessDateList.forEach(businessDate -> {
				if (businessDate.getBusinessDate().before(businessDayDao.getBusinessDate()))
					dateList.add(businessDate.getBusinessDate());

			});
		}
		GhsBankDepositDto ghsBankDepositDto = new GhsBankDepositDto();
		Collections.sort(dateList);
		ghsBankDepositDto.setGhsPendingUploadDates(dateList);
		return new GhsBankDepositDto(dateList);
	}

	/**
	 * This method will upload bank deposit file.
	 *
	 * @param reqFile
	 * @return FileUploadResponseDto
	 */
	@Override
	@Transactional
	public FileUploadResponseDtoExt addGhsBankDeposit(MultipartFile reqFile) {

		if (!businessDayServiceImpl.getGhsDetails().getIsEghsMandatory()) {
			throw new ServiceException(GHS_MANDATORY, ERR_SALE_247);
		}

		if (!businessDayServiceImpl.getBankingDetails().getIsBankingMandatory()) {
			throw new ServiceException(BANKING_MANDATORY, ERR_SALE_243);
		}

		String[] fileDetails = reqFile.getOriginalFilename().split("_");
		if (fileDetails == null || fileDetails.length != 5) {
			throw new ServiceException(INVALID_FILE, ERR_SALE_283);
		}
		if (!fileDetails[1].trim().equals(FileUtil.generateCheckSum(reqFile))) {
			throw new ServiceException("File is not in a proper format or it is Corrupted", "ERR-SALE-191");
		}
		BusinessDayDaoExt businessDayDaoExt = businessDayRepository.findByLocationCodeAndBusinessDate(
				CommonUtil.getLocationCode(), CalendarUtils.convertStringToDate(fileDetails[3].trim(), "yyyy-MM-dd"));
		if (!fileDetails[2].trim().equals(CommonUtil.getLocationCode())) {
			throw new ServiceException("Uploaded file is not for this Location.Please upload valid file",
					"ERR-SALE-298");
		}
		if (!businessDayDaoExt.getStatus().equals(DayActivityStatusEnum.CLOSED.name())) {
			throw new ServiceException(
					"EGHS banking can not be uploded for business date greater than or equal to poss business date",
					"ERR-SALE-284");
		}
		if (businessDayDaoExt.getIsGHSFileUploaded()) {
			throw new ServiceException("EGHS Banking already imported for the Business Date", "ERR-SALE-299");
		}
		List<Date> dateList = new ArrayList<>();
		List<BusinessDayDaoExt> businessDateList = businessDayRepository
				.findByIsGHSFileUploadedAndLocationCode(Boolean.FALSE, CommonUtil.getLocationCode());

		if (!businessDateList.isEmpty()) {
			businessDateList.remove(businessDayDaoExt);
			businessDateList.forEach(businessDate -> {
				if (businessDate.getBusinessDate().before(businessDayDaoExt.getBusinessDate()))
					dateList.add(businessDate.getBusinessDate());

			});
		}
		if (businessDayRepository.findByLocationCodeAndBusinessDate(CommonUtil.getLocationCode(),
				CalendarUtils.addDate(businessDayDaoExt.getBusinessDate(), -1)) != null
				&& !businessDayRepository
						.findByLocationCodeAndBusinessDate(CommonUtil.getLocationCode(),
								CalendarUtils.addDate(businessDayDaoExt.getBusinessDate(), -1))
						.getIsGHSFileUploaded()) {
			throw new ServiceException("EGHS Banking not uploaded for previous Days", "ERR-SALE-300", dateList);

		}
		Map<String, String> fileStatus = FileUtil.validateReqFile(reqFile, FileGroupEnum.GHS_BANK_DEPOSIT.name(),
				FileExtensionEnum.TXT.name(), ContentTypesEnum.TXT.getValue(), 20);
		if (fileStatus.get(SalesConstants.FAILED) != null) {
			throw new ServiceException(fileStatus.get(SalesConstants.FAILED), SalesConstants.ERR_SALE_140);
		}
		FileUploadResponseDtoExt fileUploadResponseDto = readRequestFile(reqFile, businessDayDaoExt);
		log.info("File Upload status - {},{}", reqFile.getOriginalFilename(), fileUploadResponseDto);
		return fileUploadResponseDto;
	}

	/**
	 * Method is used to read data and create and Object and insert data into DB
	 * from the file.
	 *
	 * @param reqFile
	 * @param businessDayDaoExt
	 * @return FileUploadResponseData
	 * @throws IOException
	 */
	@Transactional
	public FileUploadResponseDtoExt readRequestFile(MultipartFile reqFile, BusinessDayDaoExt businessDayDaoExt) {
		List<String[]> ghsBankDepositList = new ArrayList<>();
		try {
			ghsBankDepositList = FileUtil.readCSVFile(reqFile, DelimiterEnum.CSV.getValue().charAt(0));
		} catch (Exception e) {
			throw new ServiceException(INVALID_FILE, ERR_SALE_283);
		}
		if (ghsBankDepositList.isEmpty()) {
			businessDayDaoExt.setIsGHSFileUploaded(true);
			businessDayRepository.save(businessDayDaoExt);
			return createFileUploadResponseDto(reqFile.getOriginalFilename(), Boolean.FALSE, SalesConstants.SUCCESS,
					ghsBankDepositList);
		}
		List<GhsBankDepositDaoExt> ghsBankDepositDaoList = new ArrayList<>();
		FileUploadResponseDtoExt fileUploadResponseDtoExt;
		for (String[] record : ghsBankDepositList) {
			GhsBankDepositDaoExt ghsBankDepositStageDao;
			try {
				ghsBankDepositStageDao = createReqFileDetails(record, businessDayDaoExt);
			} catch (Exception e) {
				throw new ServiceException(INVALID_FILE, ERR_SALE_283);
			}
			ghsBankDepositDaoList.add(ghsBankDepositStageDao);
		}
		List<GhsBankDepositDaoExt> ghsBankDeposit = bankDepositStagingRepository.saveAll(ghsBankDepositDaoList);
		mergeToBoutiqueBankDeposit(ghsBankDeposit, businessDayDaoExt);
		fileUploadResponseDtoExt = createFileUploadResponseDto(reqFile.getOriginalFilename(), Boolean.FALSE,
				SalesConstants.SUCCESS, ghsBankDepositList);

		return fileUploadResponseDtoExt;
	}

	/**
	 * @param ghsBankDepositDaoList
	 * @param businessDayDaoExt
	 */
	public void mergeToBoutiqueBankDeposit(List<GhsBankDepositDaoExt> ghsBankDepositDaoList,
			BusinessDayDaoExt businessDayDaoExt) {

		List<BankDepositDaoExt> businessDayDaoList = new ArrayList<>();
		Map<String, BankDepositDaoExt> cashMergeGhsDeposit = new HashMap<>();
		Map<String, BankDepositDaoExt> cardMergeGhsDeposit = new HashMap<>();
		List<BankDepositDaoExt> businessDayDao = bankDepositRepository
				.findByIsBankingCompletedAndBusinessDateAndLocationCode(Boolean.FALSE,
						businessDayDaoExt.getBusinessDate(), CommonUtil.getLocationCode());
		for (BankDepositDaoExt businessDayDeposit : businessDayDao) {
			if (businessDayDeposit.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.CASH.getPaymentcode())) {
				cashMergeGhsDeposit.put(PaymentCodeEnum.CASH.getPaymentcode(), businessDayDeposit);
			} else if (businessDayDeposit.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.CARD.getPaymentcode())) {
				cardMergeGhsDeposit.put(getKey(businessDayDeposit), businessDayDeposit);
			} else {
				businessDayDaoList.add(businessDayDeposit);
			}
		}
		for (GhsBankDepositDaoExt ghsBank : ghsBankDepositDaoList) {
			createBoutiqueBankDepositDao(ghsBank, businessDayDaoList, businessDayDaoExt, cashMergeGhsDeposit,
					cardMergeGhsDeposit);
		}
		bankDepositRepository.saveAll(businessDayDaoList);
		businessDayDaoExt.setIsGHSFileUploaded(true);
		businessDayRepository.save(businessDayDaoExt);

	}

	private String getKey(BankDepositDaoExt businessDayDeposit) {
		if (businessDayDeposit.getPayerBankName() != null) {
			return businessDayDeposit.getLocationCode().concat(PIPE).concat(businessDayDeposit.getPayeeBankName())
					.concat(PIPE).concat(businessDayDeposit.getBusinessDate().toString()).concat(PIPE)
					.concat(businessDayDeposit.getPayerBankName());
		} else {
			return businessDayDeposit.getLocationCode().concat(PIPE).concat(businessDayDeposit.getPayeeBankName())
					.concat(PIPE).concat(businessDayDeposit.getBusinessDate().toString());
		}

	}

	private void createBoutiqueBankDepositDao(GhsBankDepositDaoExt ghsBank, List<BankDepositDaoExt> businessDayDaoList,
			BusinessDayDaoExt businessDay, Map<String, BankDepositDaoExt> cashMergeGhsDeposit,
			Map<String, BankDepositDaoExt> cardMergeGhsDeposit) {
		BigDecimal amount = BigDecimal.ZERO;
		BankDepositDaoExt bankDepositDao = new BankDepositDaoExt();
		if (ghsBank.getType().equalsIgnoreCase(PaymentCodeEnum.CASH.getPaymentcode())
				&& cashMergeGhsDeposit.get(PaymentCodeEnum.CASH.getPaymentcode()) != null) {
			bankDepositDao = cashMergeGhsDeposit.get(PaymentCodeEnum.CASH.getPaymentcode());
			bankDepositDao.setAmount(bankDepositDao.getAmount().add(ghsBank.getGrossAmount()));
			bankDepositDao.setDepositAmount(bankDepositDao.getDepositAmount().add(ghsBank.getGrossAmount()));
		} else if (ghsBank.getType().equalsIgnoreCase("CC") && cardMergeGhsDeposit.get(getKey(ghsBank)) != null) {
			bankDepositDao = cardMergeGhsDeposit.get(getKey(ghsBank));
			bankDepositDao.setAmount(bankDepositDao.getAmount().add(ghsBank.getGrossAmount()));
			bankDepositDao.setDepositAmount(bankDepositDao.getAmount().add(ghsBank.getGrossAmount()));
		} else {
			bankDepositDao.setBusinessDayDao(businessDay);
			bankDepositDao.setCollectionDate(ghsBank.getCollectionDate());
			if (ghsBank.getType().equalsIgnoreCase(PaymentCodeEnum.CASH.getPaymentcode())) {
				List<Object[]> cashAmountDepositDetails = paymentDetailsRepository.getAmountForCashDeposit(
						PaymentCodeEnum.CASH.getPaymentcode(), CommonUtil.getLocationCode(), businessDay.getBusinessDate(), RevenueUtil.getValidTxnTypes(),
						RevenueUtil.getValidStatus(), RevenueUtil.getReversedStatus(), RevenueUtil.getValidTxnStatus());
				if (!cashAmountDepositDetails.isEmpty()) {
					amount = amount.add((BigDecimal) cashAmountDepositDetails.get(0)[0]);
				}
//				PIFSeriesDaoExt pifSeries = pifSeriesRepository.findByLocationCodeAndPaymentCodeAndIsActive(
//						ghsBank.getLocationCode(), PaymentCodeEnum.CASH.getPaymentcode(), Boolean.TRUE);
//				if (pifSeries == null) {
//					throw new ServiceException("PIF series is not defined for the paymentCode {paymentCode}",
//							"ERR-SALE-188", Map.of(SalesConstants.PAYMENT_CODE, PaymentCodeEnum.CASH.getPaymentcode()));
//				}
				PayeeBankLocationDto payeeBank = engineServiceClient.getPayeeBank(PaymentCodeEnum.CASH.name());
				if(payeeBank.getBankName()!=null) {
					Boolean isActive = engineServiceClient.getIsActive(payeeBank.getBankName());
					if(!BooleanUtils.isTrue(isActive)) {
						throw new ServiceException("{bankName} is inactive","ERR-SALE-426",Map.of("bankName",payeeBank.getBankName()));
						
					}
				}
				else {
					throw new ServiceException("PIF series is not defined for the paymentCode {paymentCode}", "ERR-SALE-188", Map.of(SalesConstants.PAYMENT_CODE,PaymentCodeEnum.CASH.getPaymentcode()));
				}
				bankDepositDao.setPaymentCode(PaymentCodeEnum.CASH.getPaymentcode());
				bankDepositDao.setPayeeBankName(payeeBank.getBankName());
			} else if (ghsBank.getType().equalsIgnoreCase("CC")) {
				bankDepositDao.setPaymentCode(PaymentCodeEnum.CARD.getPaymentcode());
				bankDepositDao.setPayeeBankName(ghsBank.getBankName());
			} else if (ghsBank.getType().equalsIgnoreCase(PaymentCodeEnum.CHEQUE.getPaymentcode())
					|| ghsBank.getType().equalsIgnoreCase(PaymentCodeEnum.DD.getPaymentcode())) {
//				PIFSeriesDaoExt pifSeries = pifSeriesRepository
//						.findByLocationCodeAndPaymentCodeAndIsActiveAndIsHomeBank(ghsBank.getLocationCode(),
//								ghsBank.getType(), Boolean.TRUE, Boolean.TRUE);
//				if (pifSeries == null) {
//					throw new ServiceException(
//							"PIF series is not defined for the paymentCode {paymentCode} where payeeBank and payerBank are same",
//							"ERR-SALE-380", Map.of(SalesConstants.PAYMENT_CODE, ghsBank.getType()));
//				}
				PayeeBankLocationDto payeeBank = engineServiceClient.getPayeeBank(PaymentCodeEnum.CHEQUE.name());
				if(payeeBank.getBankName()!=null) {
					Boolean isActive = engineServiceClient.getIsActive(payeeBank.getBankName());
					if(!BooleanUtils.isTrue(isActive)) {
						throw new ServiceException("{bankName} is inactive","ERR-SALE-426",Map.of("bankName",payeeBank.getBankName()));
						
					}
				}
				else {
						throw new ServiceException("PIF series is not defined for the paymentCode {paymentCode}", "ERR-SALE-188", Map.of(SalesConstants.PAYMENT_CODE,PaymentCodeEnum.CHEQUE.getPaymentcode()));
					}
				if (ghsBank.getType().equalsIgnoreCase(PaymentCodeEnum.CHEQUE.getPaymentcode())) {
					bankDepositDao.setPaymentCode(PaymentCodeEnum.CHEQUE.getPaymentcode());
					bankDepositDao.setInstrumentDate(ghsBank.getChequeDate());
					bankDepositDao.setInstrumentNo(ghsBank.getChequeNo());
				} else {
					bankDepositDao.setPaymentCode(PaymentCodeEnum.DD.getPaymentcode());
					bankDepositDao.setInstrumentDate(ghsBank.getChequeDate());
					bankDepositDao.setInstrumentNo(ghsBank.getChequeNo());
				}
				bankDepositDao.setPayeeBankName(payeeBank.getBankName());
				bankDepositDao.setPayerBankName(ghsBank.getBankName());
			}
			bankDepositDao.setLocationCode(ghsBank.getLocationCode());
			bankDepositDao.setBusinessDate(businessDay.getBusinessDate());
			if(ghsBank.getGrossAmount().add(amount).compareTo(amount)>0) {
			bankDepositDao.setAmount(ghsBank.getGrossAmount().add(amount));
			bankDepositDao.setDepositAmount(ghsBank.getGrossAmount().add(amount));
			}
			else {
				bankDepositDao.setAmount(ghsBank.getGrossAmount());
				bankDepositDao.setDepositAmount(ghsBank.getGrossAmount());
			}
			bankDepositDao.setPifNo(ghsBank.getPifNo());
			bankDepositDao.setMidCode(ghsBank.getMidCode());
		}

		bankDepositDao.setIsBankingCompleted(Boolean.FALSE);
		if(bankDepositDao.getAmount().compareTo(BigDecimal.ZERO)>0) {
			businessDayDaoList.add(bankDepositDao);
		}
		

	}

	private String getKey(GhsBankDepositDaoExt ghsBank) {
		LocalDate ld = Instant.ofEpochMilli(ghsBank.getCollectionDate().getTime()).atZone(ZoneId.systemDefault())
				.toLocalDate();
		return ghsBank.getLocationCode().concat(PIPE).concat(ghsBank.getBankName()).concat(PIPE).concat(ld.toString())
				.concat(PIPE).concat(ghsBank.getBankName());
	}

	/**
	 * @param originalFilename
	 * @param validationError
	 * @param message
	 * @param ghsBankDepositList
	 * @param errorDetails
	 */

	private FileUploadResponseDtoExt createFileUploadResponseDto(String originalFilename, Boolean validationError,
			String message, List<String[]> ghsBankDepositList) {
		FileUploadResponseDtoExt fileUploadResponseDtoFailure = new FileUploadResponseDtoExt();
		fileUploadResponseDtoFailure.setFileId(originalFilename);
		fileUploadResponseDtoFailure.setFileValidationError(validationError);
		fileUploadResponseDtoFailure.setMessage(message);
		FileUploadResponseData fileUploadResponseData = new FileUploadResponseData();
		fileUploadResponseData.setTotalCount(ghsBankDepositList.size());
		fileUploadResponseData.setSuccessCount(ghsBankDepositList.size());
		fileUploadResponseData.setFailureCount(0);
		fileUploadResponseDtoFailure.setRecords(fileUploadResponseData);
		fileUploadResponseDtoFailure.setErrors(null);
		fileUploadResponseDtoFailure.setUploadType("sync");
		return fileUploadResponseDtoFailure;
	}

	/**
	 * @param string
	 * @return
	 */
	private boolean checkForNull(String record) {

		return record.equalsIgnoreCase("null") ? Boolean.TRUE : Boolean.FALSE;

	}

	/**
	 * @param values
	 * @param businessDayDaoExt
	 * @return GhsBankDepositStageDto
	 */
	private GhsBankDepositDaoExt createReqFileDetails(String[] values, BusinessDayDaoExt businessDayDaoExt) {
		GhsBankDepositDaoExt ghsBankDepositDao = new GhsBankDepositDaoExt();
		ghsBankDepositDao.setType(values[0]);
		ghsBankDepositDao.setGrossAmount(new BigDecimal(values[4]));
		ghsBankDepositDao.setCollectionDate(parseDate(values[8], DATE_FORMAT1));
		ghsBankDepositDao.setLocationCode(values[9]);
		ghsBankDepositDao.setBankName(checkIfNull(values[1]));
		ghsBankDepositDao.setChequeNo(checkIfNull(values[2]));
		ghsBankDepositDao.setLoginId(checkIfNull(values[11]));
		ghsBankDepositDao.setTranId(checkIfNull(values[15]));
		ghsBankDepositDao.setMidCode(checkIfNull(values[16]));
		ghsBankDepositDao.setPayeeBankName(checkIfNull(values[17]));
		ghsBankDepositDao.setLastModifiedId(checkIfNull(values[13]));
		ghsBankDepositDao.setChequeDate((checkIfNull(values[3]) != null) ? parseDate(values[3], DATE_FORMAT1) : null);
		ghsBankDepositDao
				.setDepositSlipDate((checkIfNull(values[7]) != null) ? parseDate(values[7], DATE_FORMAT1) : null);
		ghsBankDepositDao.setBusinessDate(businessDayDaoExt.getBusinessDate());
		ghsBankDepositDao
				.setCreatedDate((checkIfNull(values[12]) != null) ? parseDate(values[12], DATE_FORMAT1) : null);
		ghsBankDepositDao
				.setLastModifiedDate((checkIfNull(values[14]) != null) ? parseDate(values[14], DATE_FORMAT1) : null);

		if (values[5] != null && !checkForNull(values[5]))
			ghsBankDepositDao.setCommision(new BigDecimal(values[5]));
		if (values[6] != null && !checkForNull(values[6]))
			ghsBankDepositDao.setPifNo(values[6]);
		if (values[18] != null && !checkForNull(values[18]))
			ghsBankDepositDao.setCollectedAmount(new BigDecimal(values[18]));
		if (values[19] != null && !checkForNull(values[19]))
			ghsBankDepositDao.setTotalCollectedAmount(new BigDecimal(values[19]));
		GhsBankDepositDaoExt checkGhsAndService = new GhsBankDepositDaoExt();
		checkGhsAndService = bankDepositStagingRepository.findByUnique(ghsBankDepositDao.getType(),ghsBankDepositDao.getBankName(),ghsBankDepositDao.getChequeNo(),ghsBankDepositDao.getCollectionDate(),ghsBankDepositDao.getLocationCode());	
		if(checkGhsAndService != null) {
			BigDecimal checkGhs = checkGhsAndService.getGrossAmount().add(ghsBankDepositDao.getGrossAmount());
			checkGhsAndService.setGrossAmount(checkGhs);
			return checkGhsAndService;
		}else {
			return ghsBankDepositDao;
		}

	}

	/**
	 * @param value
	 * @param format
	 * @return
	 */
	private Date parseDate(String value, String format) {
		return CalendarUtils.convertStringToDate(value, format);
	}

	/**
	 * @param value
	 * @return
	 */
	private String checkIfNull(String value) {
		return (value == null || checkForNull(value)) ? null : value;
	}

	@Override
	public ListResponse<BankDepositResponseDto> updateBankDeposit(BankDepositUpdateRequestDto bankDepositUpdate) {
		PublishResponse bankResponse = bnkingServiceImpl.updateBankDepositTransactional(bankDepositUpdate);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			salesSyncDataService.publishSalesMessagesToQueue(bankResponse.getSyncStagingDto());
		}
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(bankResponse.getApiResponse(),
				new TypeReference<ListResponse<BankDepositResponseDto>>() {
				});
	}

	@Transactional(value = "chainedTransaction")
	public PublishResponse addCashDenominationTransactional(DepositSummaryRequestDto depositSummaryRequestDto) {
		BankDepositSummaryDaoExt bankDepositSummaryDao = new BankDepositSummaryDaoExt();
		Optional<BankDepositDaoExt> bankDepositDao = bankDepositRepository
				.findById(depositSummaryRequestDto.getBankDepositIds().get(0));
		if (bankDepositDao.isPresent() && bankDepositDao.get().getBankDepositSummaryDao() != null) {
//			Optional<BankDepositSummaryDaoExt> bankDepositSummaryDaoUpdate = bankDepositsSummaryRepository
//					.findById(bankDepositDao.get().getBankDepositSummaryDao().getId());
//			if (bankDepositSummaryDaoUpdate.isPresent()) {
//				bankDepositSummaryDaoUpdate.get().setDenominationDetails(
//						MapperUtil.getJsonString(depositSummaryRequestDto.getDenominationDetails()));
//				bankDepositSummaryDao = bankDepositsSummaryRepository.save(bankDepositSummaryDaoUpdate.get());
//			}
// once denomination is done, it cannot be done again for the same PIF no
			throw new ServiceException("Denomination is already done for the selected PIF Number {pifNo}","ERR-SALE-456",Map.of("pifNo",bankDepositDao.get().getPifNo()));
		} else {
			BankDepositSummaryDaoExt bankDepositSummaryDaoSave = new BankDepositSummaryDaoExt();
			bankDepositSummaryDaoSave.setDenominationDetails(
					MapperUtil.getJsonString(depositSummaryRequestDto.getDenominationDetails()));
			bankDepositSummaryDao = bankDepositsSummaryRepository.save(bankDepositSummaryDaoSave);
			List<BankDepositDaoExt> bankDepositUpdateList = bankDepositRepository
					.findAllById(depositSummaryRequestDto.getBankDepositIds());
			for (BankDepositDaoExt bank : bankDepositUpdateList) {
				bank.setBankDepositSummaryDao(bankDepositSummaryDaoSave);
				bank.setSrcSyncId(bank.getSrcSyncId() + 1);
			}
			bankDepositRepository.saveAll(bankDepositUpdateList);
		}
		List<BankDepositDaoExt> bankDespositList = bankDepositRepository
				.findAllById(depositSummaryRequestDto.getBankDepositIds());
		SyncStagingDto syncDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			syncDto = syncStaggingDepositeSummary(bankDepositSummaryDao, bankDespositList,
					SalesOperationCode.DEPOSITE_SUMMARY);
		}
		DepositSummaryResponseDto depSummaryResponseDto = (DepositSummaryResponseDto) MapperUtil
				.getObjectMapping(depositSummaryRequestDto, new DepositSummaryResponseDto());
		depSummaryResponseDto.setDepositSummaryId(bankDepositSummaryDao.getId());
		PublishResponse response = new PublishResponse();
		response.setSyncStagingDto(syncDto);
		response.setApiResponse(depSummaryResponseDto);
		return response;
	}

	public SyncStagingDto syncStaggingDepositeSummary(BankDepositSummaryDaoExt depositSummaryDao,
			List<BankDepositDaoExt> bankDespositList, String operation) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());
		if (!bankDespositList.isEmpty()) {
			List<BankDepositSyncDtoExt> syncDto = new ArrayList<>();
			bankDespositList.forEach(bankDao -> syncDto.add(new BankDepositSyncDtoExt(bankDao)));
			syncDataList.add(DataSyncUtil.createSyncData(syncDto, 0));
		}
		if (depositSummaryDao != null) {
			syncDataList.add(DataSyncUtil.createSyncData(new BankDepositSummarySyncDtoExt(depositSummaryDao), 1));
		}
		MessageRequest salesMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
		SyncStagingDto salesStagingDto = new SyncStagingDto();
		salesStagingDto.setMessageRequest(salesMsgRequest);
		String salesMsgRqst = MapperUtil.getJsonString(salesMsgRequest);
		SyncStaging salesSyncStaging = new SyncStaging();
		salesSyncStaging.setMessage(salesMsgRqst);
		salesSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		salesSyncStaging = saleSyncStagingRepository.save(salesSyncStaging);
		salesStagingDto.setId(salesSyncStaging.getId());
		return salesStagingDto;
	}

	@Override
	public DepositSummaryResponseDto addCashDenomination(DepositSummaryRequestDto depositSummaryRequestDto) {
		PublishResponse response = bnkingServiceImpl.addCashDenominationTransactional(depositSummaryRequestDto);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName) && response.getSyncStagingDto() != null) {
			salesSyncDataService.publishSalesMessagesToQueue(response.getSyncStagingDto());
		}
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(response.getApiResponse(), new TypeReference<DepositSummaryResponseDto>() {
		});
	}
	
	@Override	
	public Map<String,List<PrintRequestDto>> getTransactionIds(DepositDateDto depositDto) {
		//SimpleDateFormat docDate = new SimpleDateFormat("yyyy-MM-dd");
		Map<String,List<PrintRequestDto>> printRequestMap= new HashMap<>();
		List<String> paymentCodes = new ArrayList<>();
		if(depositDto.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.CASH.getPaymentcode())) {
			paymentCodes = List.of(PaymentCodeEnum.CASH.getPaymentcode());
			List<BankDepositDaoExt> bankDepositsforCash = bankDepositRepository.getDepositDateAndPaymentCode(depositDto.getDepositDate(),paymentCodes,CommonUtil.getLocationCode(),true);
			List<PrintRequestDto> printRequestsForCash = new ArrayList<>();
			Map<String,List<String>> pifMapforCash = new HashMap<>();
			for(BankDepositDaoExt bankDeposits: bankDepositsforCash) {
				if(pifMapforCash.containsKey(bankDeposits.getPifNo())) {
					List<String> txnIds =pifMapforCash.get(bankDeposits.getPifNo());
					txnIds.add(bankDeposits.getId());
					pifMapforCash.put(bankDeposits.getPifNo(),txnIds);
				}
				else {
					List<String> txnIds = new ArrayList<>();
					txnIds.add(bankDeposits.getId());
					pifMapforCash.put(bankDeposits.getPifNo(),txnIds);
				}
				
			}
			for(List<String> id : pifMapforCash.values()) {
				
				printRequestsForCash.add(new PrintRequestDto(id));
				
			}
			 printRequestMap.put("result", printRequestsForCash);
			
		}
		else if(depositDto.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.CHEQUE.getPaymentcode()) ){
			paymentCodes = List.of(PaymentCodeEnum.CHEQUE.getPaymentcode(),PaymentCodeEnum.DD.getPaymentcode());
			List<BankDepositDaoExt> bankDepositsforChequeAndDD = bankDepositRepository.getDepositDateAndPaymentCode(depositDto.getDepositDate(),paymentCodes,CommonUtil.getLocationCode(),true);
			Map<String,List<String>> pifMapforChequeAndDd = new HashMap<>();
			
			List<PrintRequestDto> printRequestForChequeAndDd = new ArrayList<>();
			
			for(BankDepositDaoExt bankDeposits: bankDepositsforChequeAndDD) {
				if(pifMapforChequeAndDd.containsKey(bankDeposits.getPifNo())) {
					List<String> txnIds =pifMapforChequeAndDd.get(bankDeposits.getPifNo());
					txnIds.add(bankDeposits.getId());
					pifMapforChequeAndDd.put(bankDeposits.getPifNo(),txnIds);
				}
				else {
					List<String> txnIds = new ArrayList<>();
					txnIds.add(bankDeposits.getId());
					pifMapforChequeAndDd.put(bankDeposits.getPifNo(),txnIds);
				}
				
			}
			for(List<String> id : pifMapforChequeAndDd.values()) {
				
				printRequestForChequeAndDd.add(new PrintRequestDto(id));
				
			}
			printRequestMap.put("result", printRequestForChequeAndDd);
		}		
		return printRequestMap;
	}



	@Override
	public DepositAmountResponseDto getDepositAmount(DepositAmountRequestDto depositAmountRequest) {
		List<String> pifNos = depositAmountRequest.getPifNo();
		Set<String> pif = new HashSet<>(pifNos);
		BigDecimal amount = BigDecimal.ZERO;
		DepositAmountResponseDto depositAmountResponse = new DepositAmountResponseDto();
		if(pif.size()>1) {
			throw new ServiceException("Different PIF Numbers cannot be selected for denomination","ERR-SALE-455");
		}
		List<BankDepositDaoExt> bankDeposits = bankDepositRepository.getByDepositIdAndAmount(pifNos.get(0));
		if(bankDeposits.get(0).getBankDepositSummaryDao()!=null) {
			BankDepositSummaryDaoExt bankDepositSummary = bankDepositsSummaryRepository.findOneById(bankDeposits.get(0).getBankDepositSummaryDao().getId());
			

			DepositSummaryRequestDto denominationDetails = new DepositSummaryRequestDto();
			 
			denominationDetails.setDenominationDetails(MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(bankDepositSummary.getDenominationDetails()),JsonData.class));
		    depositAmountResponse.setDenominationDetails(
					denominationDetails);
		}
		
		List<String> ids= new ArrayList<>();
		ids = bankDeposits.stream().map(id-> id.getId()).collect(Collectors.toList());
		depositAmountResponse.setTransactionIds(ids);
		for(BankDepositDaoExt bankDeposit : bankDeposits) {
			amount = amount.add(bankDeposit.getDepositAmount());
		}
		depositAmountResponse.setAmount(amount);		
		return depositAmountResponse; 
	}

	/**
	 * This method will upload bank deposit file.
	 *
	 * @param reqFile
	 * @return FileUploadResponseDto
	 */
	@Override
	@Transactional
	public FileUploadResponseDtoExt addServicePossBankDeposit(MultipartFile reqFile) {
		if (!businessDayServiceImpl.getServiceDetails().getIsServiceMandatory()) {
			throw new ServiceException(SERVICE_POSS_MANDATORY, ERR_SALE_469);
		}

		if (!businessDayServiceImpl.getBankingDetails().getIsBankingMandatory()) {
			throw new ServiceException(BANKING_MANDATORY, ERR_SALE_243);
		}
		String[] fileDetails = reqFile.getOriginalFilename().split("_");
		if (fileDetails == null || fileDetails.length != 5) {
			throw new ServiceException(INVALID_FILE, ERR_SALE_283);
		}
		if (!fileDetails[1].trim().equalsIgnoreCase(FileUtil.generateCheckSumService(reqFile))) {
			throw new ServiceException("File is not in a proper format or it is Corrupted", "ERR-SALE-191");
		}
		BusinessDayDaoExt businessDayDaoExt = businessDayRepository.findByLocationCodeAndBusinessDate(
				CommonUtil.getLocationCode(), CalendarUtils.convertStringToDate(fileDetails[3].trim(), "yyyy-MM-dd"));
		if (!fileDetails[2].trim().equals(CommonUtil.getLocationCode())) {
			throw new ServiceException("Uploaded file is not for this Location.Please upload valid file",
					"ERR-SALE-298");
		}
		if (!businessDayDaoExt.getStatus().equals(DayActivityStatusEnum.CLOSED.name())) {
			throw new ServiceException(
					"Service Poss banking can not be uploded for business date greater than or equal to poss business date",
					"ERR-SALE-473");
		}
		if (businessDayDaoExt.getIsServiceFileUploaded()){
			throw new ServiceException("Service Poss Banking already imported for the Business Date", "ERR-SALE-474");
		}
		List<Date> dateList = new ArrayList<>();
		List<BusinessDayDaoExt> businessDateList = businessDayRepository
				.findByIsServiceFileUploadedAndLocationCode(Boolean.FALSE, CommonUtil.getLocationCode());

		if (!businessDateList.isEmpty()) {
			businessDateList.remove(businessDayDaoExt);
			businessDateList.forEach(businessDate -> {
				if (businessDate.getBusinessDate().before(businessDayDaoExt.getBusinessDate()))
					dateList.add(businessDate.getBusinessDate());

			});
		}
		if (businessDayRepository.findByLocationCodeAndBusinessDate(CommonUtil.getLocationCode(),
				CalendarUtils.addDate(businessDayDaoExt.getBusinessDate(), -1)) != null
				&& !businessDayRepository
						.findByLocationCodeAndBusinessDate(CommonUtil.getLocationCode(),
								CalendarUtils.addDate(businessDayDaoExt.getBusinessDate(), -1))
						.getIsServiceFileUploaded()) {
			throw new ServiceException("Service Poss Banking not uploaded for previous Days", "ERR-SALE-476", dateList);

		}
		Map<String, String> fileStatus = FileUtil.validateReqFile(reqFile, FileGroupEnum.SERVICE_POSS_BANK_DEPOSIT.name(),
				FileExtensionEnum.CSV.name(), ContentTypesEnum.CSV.getValue(), 20);
		if (fileStatus.get(SalesConstants.FAILED) != null) {
			throw new ServiceException(fileStatus.get(SalesConstants.FAILED), SalesConstants.ERR_SALE_140);
		}
		FileUploadResponseDtoExt fileUploadResponseDto = readRequestServicePossFile(reqFile, businessDayDaoExt);
		log.info("File Upload status - {},{}", reqFile.getOriginalFilename(), fileUploadResponseDto);
		return fileUploadResponseDto;
		
	}
	
	/**
	 * Method is used to read data and create and Object and insert data into DB
	 * from the file.
	 *
	 * @param reqFile
	 * @param businessDayDaoExt
	 * @return FileUploadResponseData
	 * @throws IOException
	 */
	@Transactional
	public FileUploadResponseDtoExt readRequestServicePossFile(MultipartFile reqFile, BusinessDayDaoExt businessDayDaoExt) {
		List<String[]> servicePossBankDepositList = new ArrayList<>();
		try {
			servicePossBankDepositList = FileUtil.readCSVFile(reqFile, DelimiterEnum.CSV.getValue().charAt(0));
		} catch (Exception e) {
			throw new ServiceException(INVALID_FILE, ERR_SALE_283);
		}
		if (servicePossBankDepositList.isEmpty()) {
			businessDayDaoExt.setIsServiceFileUploaded(true);
			businessDayRepository.save(businessDayDaoExt);
			return createServicePossFileUploadResponseDto(reqFile.getOriginalFilename(), Boolean.FALSE, SalesConstants.SUCCESS,
					servicePossBankDepositList);
		}
		List<GhsBankDepositDaoExt> ghsBankDepositDaoList = new ArrayList<>();
		FileUploadResponseDtoExt fileUploadResponseDtoExt;
		for (String[] record : servicePossBankDepositList) {
			GhsBankDepositDaoExt ghsBankDepositStageDao;
			try {
				ghsBankDepositStageDao = createReqFileDetailsService(record, businessDayDaoExt);
			} catch (Exception e) {
				throw new ServiceException(INVALID_FILE, ERR_SALE_283);
			}
			ghsBankDepositDaoList.add(ghsBankDepositStageDao);
		}
		List<GhsBankDepositDaoExt> servicePossBankDeposit = bankDepositStagingRepository.saveAll(ghsBankDepositDaoList);
		mergeToBoutiqueBankDeposits(servicePossBankDeposit, businessDayDaoExt);
		fileUploadResponseDtoExt = createServicePossFileUploadResponseDto(reqFile.getOriginalFilename(), Boolean.FALSE,
				SalesConstants.SUCCESS, servicePossBankDepositList);

		return fileUploadResponseDtoExt;
	}
	
	/**
	 * @param originalFilename
	 * @param validationError
	 * @param message
	 * @param ghsBankDepositList
	 * @param errorDetails
	 */

	private FileUploadResponseDtoExt createServicePossFileUploadResponseDto(String originalFilename, Boolean validationError,
			String message, List<String[]> servicePossBankDepositList) {
		FileUploadResponseDtoExt fileUploadResponseDtoFailure = new FileUploadResponseDtoExt();
		fileUploadResponseDtoFailure.setFileId(originalFilename);
		fileUploadResponseDtoFailure.setFileValidationError(validationError);
		fileUploadResponseDtoFailure.setMessage(message);
		FileUploadResponseData fileUploadResponseData = new FileUploadResponseData();
		fileUploadResponseData.setTotalCount(servicePossBankDepositList.size());
		fileUploadResponseData.setSuccessCount(servicePossBankDepositList.size());
		fileUploadResponseData.setFailureCount(0);
		fileUploadResponseDtoFailure.setRecords(fileUploadResponseData);
		fileUploadResponseDtoFailure.setErrors(null);
		fileUploadResponseDtoFailure.setUploadType("sync");
		return fileUploadResponseDtoFailure;
	}
	
	public void mergeToBoutiqueBankDeposits(List<GhsBankDepositDaoExt> ghsBankDepositDaoList,
			BusinessDayDaoExt businessDayDaoExt) {

		List<BankDepositDaoExt> businessDayDaoList = new ArrayList<>();
		Map<String, BankDepositDaoExt> cashMergeServicePossDeposit = new HashMap<>();
		Map<String, BankDepositDaoExt> cardMergeServicePossDeposit = new HashMap<>();
		List<BankDepositDaoExt> businessDayDao = bankDepositRepository
				.findByIsBankingCompletedAndBusinessDateAndLocationCode(Boolean.FALSE,
						businessDayDaoExt.getBusinessDate(), CommonUtil.getLocationCode());
		for (BankDepositDaoExt businessDayDeposit : businessDayDao) {
			if (businessDayDeposit.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.CASH.getPaymentcode())) {
				cashMergeServicePossDeposit.put(PaymentCodeEnum.CASH.getPaymentcode(), businessDayDeposit);
			} else if (businessDayDeposit.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.CARD.getPaymentcode())) {
				cardMergeServicePossDeposit.put(getKey(businessDayDeposit), businessDayDeposit);
			} else {
				businessDayDaoList.add(businessDayDeposit);
			}
		}
		for (GhsBankDepositDaoExt ghsBank : ghsBankDepositDaoList) {
			createBoutiqueBankDepositDao(ghsBank, businessDayDaoList, businessDayDaoExt, cashMergeServicePossDeposit,
					cardMergeServicePossDeposit);
		}
		bankDepositRepository.saveAll(businessDayDaoList);
		businessDayDaoExt.setIsServiceFileUploaded(true);
		businessDayRepository.save(businessDayDaoExt);

	}
	
	/**
	 * @param values
	 * @param businessDayDaoExt
	 * @return GhsBankDepositStageDto
	 */
	private GhsBankDepositDaoExt createReqFileDetailsService(String[] values, BusinessDayDaoExt businessDayDaoExt) {
		GhsBankDepositDaoExt ghsBankDepositDao = new GhsBankDepositDaoExt();
		ghsBankDepositDao.setType(values[0]);
		ghsBankDepositDao.setGrossAmount(new BigDecimal(values[4]));
		ghsBankDepositDao.setCollectionDate(parseDate(values[8], DATE_FORMAT2));
		ghsBankDepositDao.setLocationCode(values[9]);
		ghsBankDepositDao.setBankName(checkIfNull(values[1]));
		ghsBankDepositDao.setChequeNo(checkIfNull(values[2]));
		ghsBankDepositDao.setLoginId(checkIfNull(values[11]));
		ghsBankDepositDao.setTranId(checkIfNull(values[15]));
		ghsBankDepositDao.setMidCode(checkIfNull(values[16]));
		ghsBankDepositDao.setPayeeBankName(checkIfNull(values[17]));
		ghsBankDepositDao.setLastModifiedId(checkIfNull(values[13]));
		ghsBankDepositDao.setChequeDate((checkIfNull(values[3]) != null) ? parseDate(values[3], DATE_FORMAT2) : null);
		ghsBankDepositDao
				.setDepositSlipDate((checkIfNull(values[7]) != null) ? parseDate(values[7], DATE_FORMAT2) : null);
		ghsBankDepositDao.setBusinessDate(businessDayDaoExt.getBusinessDate());
		ghsBankDepositDao
				.setCreatedDate((checkIfNull(values[12]) != null) ? parseDate(values[12], DATE_FORMAT2) : null);
		ghsBankDepositDao
				.setLastModifiedDate((checkIfNull(values[14]) != null) ? parseDate(values[14], DATE_FORMAT2) : null);

		if (values[5] != null && !checkForNull(values[5]))
			ghsBankDepositDao.setCommision(new BigDecimal(values[5]));
		if (values[6] != null && !checkForNull(values[6]))
			ghsBankDepositDao.setPifNo(values[6]);
		if (values[18] != null && !checkForNull(values[18]))
			ghsBankDepositDao.setCollectedAmount(new BigDecimal(values[18]));
		if (values[19] != null && !checkForNull(values[19]))
			ghsBankDepositDao.setTotalCollectedAmount(new BigDecimal(values[19]));
		ghsBankDepositDao.setIsService(Boolean.TRUE);
		GhsBankDepositDaoExt checkGhsAndService = new GhsBankDepositDaoExt();
		checkGhsAndService = bankDepositStagingRepository.findByUnique(ghsBankDepositDao.getType(),ghsBankDepositDao.getBankName(),ghsBankDepositDao.getChequeNo(),ghsBankDepositDao.getCollectionDate(),ghsBankDepositDao.getLocationCode());	
		if(checkGhsAndService != null) {
			BigDecimal checkGhs = checkGhsAndService.getGrossAmount().add(ghsBankDepositDao.getGrossAmount());
			checkGhsAndService.setGrossAmount(checkGhs);
			return checkGhsAndService;
		}else {
			return ghsBankDepositDao;
		}
	}



	@Override
	public ServiceBankDepositDto getServiceBankDeposit() {
		if (!businessDayServiceImpl.getBankingDetails().getIsBankingMandatory()) {
			throw new ServiceException(BANKING_MANDATORY, ERR_SALE_243);
		}
		if (!businessDayServiceImpl.getServiceDetails().getIsServiceMandatory()) {		
			throw new ServiceException(SERVICE_POSS_MANDATORY, "ERR-SALE-469");
		}
		List<Date> dateList = new ArrayList<>();
		List<BusinessDayDaoExt> businessDateList = businessDayRepository
				.findByIsServiceFileUploadedAndLocationCode(Boolean.FALSE, CommonUtil.getLocationCode());
		BusinessDayDaoExt businessDayDao = businessDayRepository.findByLocationCodeAndBusinessDate(
				CommonUtil.getLocationCode(), engineService.getBusinessDayInProgress().getBusinessDate());
		if (!businessDateList.isEmpty()) {
			businessDateList.remove(businessDayDao);
			businessDateList.forEach(businessDate -> {
				if (businessDate.getBusinessDate().before(businessDayDao.getBusinessDate()))
					dateList.add(businessDate.getBusinessDate());

			});
		}
		ServiceBankDepositDto serviceBankDepositDto = new ServiceBankDepositDto();
		Collections.sort(dateList);
		serviceBankDepositDto.setServicePendingUploadDates(dateList);
		return new ServiceBankDepositDto(dateList);
	}



}
