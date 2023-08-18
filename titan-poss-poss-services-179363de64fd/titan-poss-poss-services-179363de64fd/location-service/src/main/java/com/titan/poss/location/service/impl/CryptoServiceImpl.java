/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.ContextTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.dto.BoutiqueMetalRateDto;
import com.titan.poss.core.dto.DepositPasswordCreateDto;
import com.titan.poss.core.dto.DepositPasswordDto;
import com.titan.poss.core.dto.HistoryPriceResponse;
import com.titan.poss.core.dto.ManualBillCreateDto;
import com.titan.poss.core.dto.MetalPriceRequestDto;
import com.titan.poss.core.dto.MetalRateRequestDto;
import com.titan.poss.core.dto.MetalRateWithWeightDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.PasswordHashUtil;
import com.titan.poss.location.dao.StorePasswordsDao;
import com.titan.poss.location.dto.response.BankDepositResponseDto;
import com.titan.poss.location.dto.response.ManualBillPasswordDetailsDto;
import com.titan.poss.location.dto.response.ManualBillResponseDto;
import com.titan.poss.location.dto.response.MetalRateResponseDto;
import com.titan.poss.location.repository.LocationRepositoryExt;
import com.titan.poss.location.repository.StorePasswordsRepository;
import com.titan.poss.location.service.CryptoService;
import com.titan.poss.location.service.EngineService;

/**
 * Service class to generate password for manual bill or metal rate.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("locationCryptoService")
public class CryptoServiceImpl implements CryptoService {

	private static final Logger LOGGER = LoggerFactory.getLogger(CryptoServiceImpl.class);

	@Autowired
	private LocationRepositoryExt locationRepositoryExt;

	@Autowired
	private StorePasswordsRepository storePasswordsRepository;

	@Autowired
	private EngineService engineService;

	private static final String ERR_LOC_001 = "ERR-LOC-001";
	private static final String NO_LOCATION_DETAILS_FOUND_FOR_THE_REQUESTED_LOCATIONCODE = "No Location details found for the requested locationCode";

	private static final String ERR_LOC_038 = "ERR-LOC-038";
	private static final String INVALID_METAL_RATE_DETAILS = "Invalid Metal Rate details";

	private static final String ERR_LOC_069 = "ERR-LOC-069";
	private static final String MANUAL_BILL_NOT_ALLOWED = "Manual bill not allowed";

	private static final String ERR_LOC_087 = "ERR-LOC-087";
	private static final String PW_ALREADY_GENERATED_FOR_THE_BILL_NUMBER = "Password already generated for the bill number.";

	/**
	 * This method will generate password for manual bill
	 * 
	 * @param manualBillCreateDto
	 * @return ManualBillResponseDto
	 */
	@Override
	public ManualBillResponseDto generatePasswordForManualBill(ManualBillCreateDto manualBillCreateDto) {

		// check if txnType is allowed for manual bill
		if (!TransactionTypeEnum.allowedTxnForManualbill().contains(manualBillCreateDto.getTxnType())) {
			throw new ServiceException(MANUAL_BILL_NOT_ALLOWED, ERR_LOC_069,
					"Allowed txnTypes for manual bill:" + TransactionTypeEnum.allowedTxnForManualbill());
		}
		if (manualBillCreateDto.getTxnType().equals(TransactionTypeEnum.GRF.name()))
			manualBillCreateDto.setTxnType(TransactionTypeEnum.ADV.name());

		// set manual bill date without time
		manualBillCreateDto.setManualBillDate(CalendarUtils.getStartOfDay(manualBillCreateDto.getManualBillDate()));

		// business date and bill date validation.
		// pending - where to get business date.

		// location check: locationType must be 'BTQ'
		locationCheck(manualBillCreateDto.getLocationCode());

		Short fiscalYear = engineService.getCountryDetails(manualBillCreateDto.getLocationCode()).getFiscalYear()
				.shortValue();

		// validate metal rates
		Map<String, StandardPriceResponseDto> choosedMetalRates = getHistoryPrice(null,
				manualBillCreateDto.getManualBillDate(), manualBillCreateDto.getLocationCode(),
				manualBillCreateDto.getMetalRates());

		// (context_type, location_code, fiscal_year, txn_type, doc_no) combination
		// should not exists
		StorePasswordsDao storePasswordsDaoOld = storePasswordsRepository
				.findOneByContextTypeAndLocationCodeAndFiscalYearAndTxnTypeAndDocNo(ContextTypeEnum.MANUAL_BILL.name(),
						manualBillCreateDto.getLocationCode(), fiscalYear, manualBillCreateDto.getTxnType(),
						manualBillCreateDto.getManualBillNo());
		if (storePasswordsDaoOld != null) {

			String passwordToCheck = getPasswordforManualBill(manualBillCreateDto);

			// if same password is not generated, then wrong details are provided.
			if (!passwordToCheck.equals(storePasswordsDaoOld.getPassword())) {
				throw new ServiceException(PW_ALREADY_GENERATED_FOR_THE_BILL_NUMBER, ERR_LOC_087,
						"Password generated for the entered details.");
			}
			// map old details and return
			ManualBillResponseDto manualBillOldResponseDto = (ManualBillResponseDto) MapperUtil
					.getDtoMapping(manualBillCreateDto, ManualBillResponseDto.class);
			manualBillOldResponseDto.setId(storePasswordsDaoOld.getId());
			manualBillOldResponseDto.setPassword(storePasswordsDaoOld.getPassword());
			manualBillOldResponseDto.setIsOld(true);

			return manualBillOldResponseDto;
		}

		String password = getPasswordforManualBill(manualBillCreateDto);

		// manual bill details json
		ManualBillPasswordDetailsDto manualBillPasswordDetailsDto = new ManualBillPasswordDetailsDto(
				manualBillCreateDto, choosedMetalRates);

		// insert everything to DB. and map it to response
		StorePasswordsDao storePasswordsDao = mapCommonDetailsToStoreDetailsDao(manualBillCreateDto.getLocationCode(),
				password, ContextTypeEnum.MANUAL_BILL, manualBillCreateDto.getRemarks(),
				new JsonData(ContextTypeEnum.MANUAL_BILL.name(), manualBillPasswordDetailsDto), fiscalYear);
		storePasswordsDao.setTxnType(manualBillCreateDto.getTxnType());
		storePasswordsDao.setDocNo(manualBillCreateDto.getManualBillNo());

		storePasswordsDao = storePasswordsRepository.save(storePasswordsDao);

		ManualBillResponseDto manualBillResponseDto = (ManualBillResponseDto) MapperUtil
				.getDtoMapping(manualBillCreateDto, ManualBillResponseDto.class);
		manualBillResponseDto.setId(storePasswordsDao.getId());
		manualBillResponseDto.setPassword(password);
		manualBillResponseDto.setIsOld(false);

		return manualBillResponseDto;
	}

	private StorePasswordsDao mapCommonDetailsToStoreDetailsDao(String locationCode, String password,
			ContextTypeEnum contextType, String remarks, JsonData jsonData, Short fiscalYear) {
		StorePasswordsDao storePasswordsDao = new StorePasswordsDao();
		storePasswordsDao.setLocationCode(locationCode);
		storePasswordsDao.setFiscalYear(fiscalYear);
		storePasswordsDao.setPasswordDate(CalendarUtils.getCurrentDate());
		storePasswordsDao.setContextType(contextType.name());
		storePasswordsDao.setPassword(password);
		storePasswordsDao.setRemarks(remarks);
		storePasswordsDao.setPasswordDetails(MapperUtil.getStringFromJson(jsonData));
		return storePasswordsDao;
	}

	private void locationCheck(String locationCode) {
		// location check: locationType must be 'BTQ'
		if (BooleanUtils.isFalse(
				locationRepositoryExt.existsByLocationCodeAndLocationTypeCodeAndIsActiveTrue(locationCode, "BTQ"))) {
			throw new ServiceException(ERR_LOC_001, NO_LOCATION_DETAILS_FOUND_FOR_THE_REQUESTED_LOCATIONCODE,
					NO_LOCATION_DETAILS_FOUND_FOR_THE_REQUESTED_LOCATIONCODE + "-" + locationCode);
		}
	}

	private String getPasswordforManualBill(ManualBillCreateDto manualBillCreateDto) {

		return PasswordHashUtil.getPasswordForManualBill(manualBillCreateDto, manualBillCreateDto.getLocationCode(),
				manualBillCreateDto.getMetalRates(), manualBillCreateDto.getTxnType(),manualBillCreateDto.getIsBimetal());

	}

	/**
	 * This method will get history price and validate it w.r.t input price.
	 * 
	 * @param metalTypeCode
	 * @param date
	 * @param locationCode
	 * @param inputMetalRatesWithWeight
	 * @return Map<String, StandardPriceResponseDto>
	 */
	private Map<String, StandardPriceResponseDto> getHistoryPrice(String metalTypeCode, Date date, String locationCode,
			Map<String, MetalRateWithWeightDto> inputMetalRatesWithWeight) {

		MetalPriceRequestDto metalPriceRequestDto = new MetalPriceRequestDto();
		metalPriceRequestDto.setMetalType(metalTypeCode);
		metalPriceRequestDto.setApplicableDate(CalendarUtils.addOffSetTimeZone(date));
		metalPriceRequestDto.setLocationCode(locationCode);

		ListResponse<HistoryPriceResponse> historyPriceResponseList = engineService
				.getStandardHistoryPrice(metalPriceRequestDto);
		Map<String, StandardPriceResponseDto> choosedMetalRates = new HashMap<>();

		for (Map.Entry<String, MetalRateWithWeightDto> firstMetalRate : inputMetalRatesWithWeight.entrySet()) {

			if (!firstMetalRate.getKey().equals(firstMetalRate.getValue().getMetalTypeCode())) {
				throw new ServiceException(INVALID_METAL_RATE_DETAILS, ERR_LOC_038);
			}

			for (HistoryPriceResponse historyPriceDto : historyPriceResponseList.getResults()) {
				if (firstMetalRate.getKey().equals(historyPriceDto.getMetalTypeCode()) && firstMetalRate.getValue()
						.getRatePerUnit().compareTo(historyPriceDto.getRatePerUnit()) == 0) {
					choosedMetalRates.put(firstMetalRate.getKey(), (StandardPriceResponseDto) MapperUtil
							.getDtoMapping(historyPriceDto, StandardPriceResponseDto.class));
				}
			}
		}

		if (inputMetalRatesWithWeight.size() != choosedMetalRates.size()) {
			throw new ServiceException(INVALID_METAL_RATE_DETAILS, ERR_LOC_038);
		}

		return choosedMetalRates;
	}

	@Override
	@Transactional
	public MetalRateResponseDto generatePasswordMetalRates(MetalRateRequestDto metalRateRequestDto) {
		// location check: locationType must be 'BTQ'
		locationCheck(metalRateRequestDto.getLocationCode());
		validateMetalRates(metalRateRequestDto);
		// get password based on input
		String passwordForMetalRates = PasswordHashUtil.getPasswordForMetalRate(metalRateRequestDto.getMetalRates(),
				metalRateRequestDto.getLocationCode(), metalRateRequestDto.getApplicableDate());
		Short fiscalYear = engineService.getCountryDetails(metalRateRequestDto.getLocationCode()).getFiscalYear()
				.shortValue();
		StorePasswordsDao storePasswordsDao = mapCommonDetailsToStoreDetailsDao(metalRateRequestDto.getLocationCode(),
				passwordForMetalRates, ContextTypeEnum.METAL_RATE, metalRateRequestDto.getRemarks(),
				new JsonData(ContextTypeEnum.METAL_RATE.name(), metalRateRequestDto.getMetalRates()), fiscalYear);
		storePasswordsDao = storePasswordsRepository.save(storePasswordsDao);
		MetalRateResponseDto metalRateResponse = (MetalRateResponseDto) MapperUtil.getDtoMapping(metalRateRequestDto,
				MetalRateResponseDto.class);
		MapperUtil.beanMapping(storePasswordsDao, metalRateResponse);
		return metalRateResponse;
	}

	private void validateMetalRates(MetalRateRequestDto metalRateRequestDto) {
		MetalPriceRequestDto metalPriceRequestDto = new MetalPriceRequestDto();
		metalPriceRequestDto.setMetalType(null);
		metalPriceRequestDto.setApplicableDate(metalRateRequestDto.getApplicableDate());
		metalPriceRequestDto.setLocationCode(metalRateRequestDto.getLocationCode());
		ListResponse<HistoryPriceResponse> historyPriceResponseList = engineService
				.getStandardHistoryPrice(metalPriceRequestDto);
		int count = 0;
		for (HistoryPriceResponse record : historyPriceResponseList.getResults()) {
			LOGGER.debug("rate per unit {}", record.getRatePerUnit());
			BoutiqueMetalRateDto metalRate = metalRateRequestDto.getMetalRates().get(record.getMetalTypeCode());
			if (metalRate != null && metalRate.getRatePerUnit().compareTo(record.getRatePerUnit()) == 0
					&& metalRate.getMetalTypeCode().equals(record.getMetalTypeCode())) {
				count++;
				break;
			}
		}
		LOGGER.debug("count {}", count);
		if (count == 0) {
			throw new ServiceException(INVALID_METAL_RATE_DETAILS, ERR_LOC_038);
		}
	}

	/**
	 * This method will generate password for Bank Deposit
	 * 
	 * @param depositPasswordCreateDto
	 * @return BankDepositResponseDto
	 */
	@Override
	@Transactional
	public BankDepositResponseDto generatePasswordBankDeposits(DepositPasswordCreateDto depositPasswordCreateDto) {

		// location check: locationType must be 'BTQ'
		locationCheck(depositPasswordCreateDto.getLocationCode());

		DepositPasswordDto depositPassword = (DepositPasswordDto) MapperUtil.getDtoMapping(depositPasswordCreateDto,
				DepositPasswordDto.class);

		String password = PasswordHashUtil.getPasswordForBanking(depositPassword,
				depositPasswordCreateDto.getLocationCode());
		Short fiscalYear = engineService.getCountryDetails(depositPasswordCreateDto.getLocationCode()).getFiscalYear()
				.shortValue();
		StorePasswordsDao storePasswordsDao = mapCommonDetailsToStoreDetailsDao(
				depositPasswordCreateDto.getLocationCode(), password, ContextTypeEnum.BANK_DEPOSIT,
				depositPasswordCreateDto.getRemarks(),
				new JsonData(ContextTypeEnum.BANK_DEPOSIT.name(), depositPassword), fiscalYear);

		storePasswordsDao = storePasswordsRepository.save(storePasswordsDao);

		BankDepositResponseDto bankDepositResponseDto = (BankDepositResponseDto) MapperUtil
				.getDtoMapping(depositPasswordCreateDto, BankDepositResponseDto.class);
		bankDepositResponseDto.setId(storePasswordsDao.getId());
		bankDepositResponseDto.setPassword(password);

		return bankDepositResponseDto;
	}

}
