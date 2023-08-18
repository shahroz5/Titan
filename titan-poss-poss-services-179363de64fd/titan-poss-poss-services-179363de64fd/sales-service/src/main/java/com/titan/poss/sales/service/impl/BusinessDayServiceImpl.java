/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.BankingDetails;
import com.titan.poss.core.dto.BoutiqueGoldPriceMasterDto;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.BusinessDayActivityDto;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.GhsDetails;
import com.titan.poss.core.dto.GhsOfflineEODRequestDto;
import com.titan.poss.core.dto.GhsTodayRevenueDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.PayeeBankLocationDto;
import com.titan.poss.core.dto.RevenueDto;
import com.titan.poss.core.dto.ServiceDetails;
import com.titan.poss.core.dto.ServiceDetails;
import com.titan.poss.core.dto.ServicePossRequestDto;
import com.titan.poss.core.dto.ServicePossRevenueDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.PasswordHashUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.sales.constants.DayActivityStatusEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.PaymentCodeRevenueEnum;
import com.titan.poss.sales.constants.RevenueTypeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.BankDepositDaoExt;
import com.titan.poss.sales.dao.BusinessDayDaoExt;
import com.titan.poss.sales.dao.RevenueSummaryDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.BusinessDaySyncDtoExt;
import com.titan.poss.sales.dto.PaymentDepositDto;
import com.titan.poss.sales.dto.RevenueSummarySyncDtoExt;
import com.titan.poss.sales.dto.request.BankingRequestDto;
import com.titan.poss.sales.dto.response.DayMasterDto;
import com.titan.poss.sales.dto.response.TodayRevenueDto;
import com.titan.poss.sales.repository.BankDepositRepositoryExt;
import com.titan.poss.sales.repository.BusinessDayRepositoryExt;
import com.titan.poss.sales.repository.CancellationRepositoryExt;
import com.titan.poss.sales.repository.CustomerVisitRepositoryExt;
import com.titan.poss.sales.repository.PIFSeriesRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.RevenueSummaryRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.util.BusinessDayUtil;
import com.titan.poss.sales.util.SchedulerStepUtil;
import com.titan.poss.sales.utils.RevenueUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("businessDayServiceImpl")
public class BusinessDayServiceImpl implements BusinessDayService {

	// Note: do not call CommonTransactionService, CreditNoteService &
	// CancellationService here as
	// BusinessDayService is
	// called in CommonTransactionServiceImpl, CreditNoteServiceImpl &
	// CancellationServiceImpl

	@Autowired
	SalesTxnRepositoryExt salesTxnRepository;

	@Autowired
	CancellationRepositoryExt cancellationRepository;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	BankDepositRepositoryExt bankDepositRepository;

	@Autowired
	PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	PIFSeriesRepositoryExt pifSeriesRepository;

	@Autowired
	BusinessDayRepositoryExt businessDayRepository;

	@Autowired
	CustomerVisitRepositoryExt customerVisitRepository;

	@Autowired
	RevenueSummaryRepositoryExt revenueSummaryRepository;

	@Autowired
	RevenueServiceImpl revenueServiceImpl;

	@Autowired
	EngineServiceImpl engineService;

	@Autowired
	BankingServiceImpl bankingServiceImpl;

	@Autowired
	CustomerVisitServiceImpl customerVisitService;

	@Autowired
	IntegrationServiceImpl integrationService;

	@Autowired
	StorePasswordServiceImpl storePasswordService;
	
	@Autowired
	EngineServiceClient engineServiceClient;

	@Value("${app.name}")
	private String appName;

	protected static final List<String> dayActivityStatusList = new ArrayList<>();

	protected static final List<String> closedStatusList = new ArrayList<>();

	protected static final List<String> openStatusList = new ArrayList<>();

	protected static final List<String> performEODStatusList = new ArrayList<>();

	protected static final List<String> performBODStatusList = new ArrayList<>();

	static {
		/**
		 * 
		 */
		dayActivityStatusList.add(DayActivityStatusEnum.OPEN.name());
		dayActivityStatusList.add(DayActivityStatusEnum.EOD_IN_PROGRESS.name());
		/**
		 * 
		 */
		closedStatusList.add(DayActivityStatusEnum.CLOSED.name());
		/**
		 * 
		 */
		openStatusList.add(DayActivityStatusEnum.OPEN.name());
		/**
		 * 
		 */
		performEODStatusList.add(DayActivityStatusEnum.EOD_IN_PROGRESS.name());
		/**
		 * 
		 */
		performBODStatusList.add(DayActivityStatusEnum.BOD_IN_PROGRESS.name());
	}

	public static final String BANK_DEPOSIT = "bankDeposit";

	public static final String MULTIPLE_BUSINESS_DAY = "Multiple Business Day is open or Eod is in progress Please contact adminstration";

	public static final String BOD_BUSINESS_DAY = "No business day is open, Please do BOD";

	public static final String EOD_BUSINESS_DAY = "No business day is open, Please do EOD";

	private static final String ERR_SALE_247 = "ERR-SALE-247";
	private static final String GHS_MANDATORY = "GHS is not enabled for the location";
	private static final String SERVICE_MANDATORY = "SERVICE is not enabled for the location";
	private static final String ERR_SALE_469 = "ERR-SALE-469";

	/**
	 * This method will return the business date.
	 */
	@Override
	public BusinessDayDto getBusinessDay() {

		return getBusinessDayForBoutique(CommonUtil.getLocationCode());
	}

	/**
	 * 
	 * @param locationCode
	 * @return BusinessDayDto
	 */
	public BusinessDayDto getBusinessDayForBoutique(String locationCode) {

		List<BusinessDayDaoExt> businessDayDaoList = businessDayRepository.findByStatusInAndLocationCode(openStatusList,
				locationCode);

		return BusinessDayUtil.getBusinessDay(businessDayDaoList);

	}

	/**
	 * 
	 */
	@Override
	public BusinessDayDaoExt getBusinessDayInProgress(String locationCode) {
		List<BusinessDayDaoExt> businessDayDao = businessDayRepository
				.findByStatusInAndLocationCode(dayActivityStatusList, locationCode);

		if (CollectionUtil.isEmpty(businessDayDao)) {
			throw new ServiceException("Business Day is not Open", "ERR-SALE-192");
		}

		return businessDayDao.get(0);
	}

	/**
	 * This method will be called to get the business day for which BOD needs to be
	 * done. If there are any pending EOD in the System this API will throw error.
	 *
	 */
	@Override
	public DayMasterDto getBodBusinessDay() {

		DayMasterDto businessDay = new DayMasterDto();
		String locationCode = CommonUtil.getLocationCode();

		// multiple open -> 1 error code
		// open -> 1 error for business day
		// previous day eod in progress -> 1 error code
		List<BusinessDayDaoExt> businessDayDaoList = businessDayRepository
				.findByStatusInAndLocationCode(dayActivityStatusList, locationCode);
		if (businessDayDaoList.size() == 1
				&& businessDayDaoList.get(0).getStatus().equalsIgnoreCase(DayActivityStatusEnum.OPEN.name())) {
			throw new ServiceException("Current day Bod is completed", "ERR-SALE-189");
		} else if (businessDayDaoList.size() == 1 && businessDayDaoList.get(0).getStatus()
				.equalsIgnoreCase(DayActivityStatusEnum.EOD_IN_PROGRESS.name())) {
			throw new ServiceException("Previous day EOD is not completed", "ERR-SALE-190");
		} else if (!businessDayDaoList.isEmpty() && businessDayDaoList.size() > 1) {
			BusinessDayUtil.getPendingDayActivityDetails(businessDayDaoList, MULTIPLE_BUSINESS_DAY);
		}
		Date maxBusinessDate = businessDayRepository.getMaximumBusinessDate(locationCode,
				DayActivityStatusEnum.CLOSED.name());

		if (maxBusinessDate == null) {
			maxBusinessDate = CalendarUtils.getTodayDate();
		} else {
			maxBusinessDate = CalendarUtils.addDate(maxBusinessDate, 1);
		}

		if (maxBusinessDate.after(CalendarUtils.getTodayDate())) {
			throw new ServiceException("We Cannot perform BOD for future date", "ERR-SALE-242");
		}

		BusinessDayDaoExt businessDayDao = businessDayRepository.findByStatusAndLocationCodeAndBusinessDate(
				DayActivityStatusEnum.BOD_IN_PROGRESS.name(), locationCode, maxBusinessDate);

		if (businessDayDao == null) {

			businessDay.setBusinessDate(maxBusinessDate);
			// get country() - engine service call -> different API
			// if month of business day is same as fiscalYearStart, then pick fiscalYear
			// from country master.
			// else take fiscal year of latest closed business day.-> util closed order by
			businessDay.setFiscalYear(getFiscalYear(locationCode));
			businessDay.setLocationCode(locationCode);
			businessDay.setStatus(DayActivityStatusEnum.BOD_IN_PROGRESS.name());
			businessDay.setSkipBanking(Boolean.FALSE);
			businessDay.setIsGHSBODDone(Boolean.FALSE);
			businessDay.setIsGHSEODDone(Boolean.FALSE);

		} else {
			businessDay = (DayMasterDto) MapperUtil.getObjectMapping(businessDayDao, new DayMasterDto());
		}

		return businessDay;
	}

	@Override
	@Transactional
	public DayMasterDto startBodActivity() {
		BusinessDayDaoExt businessDay = new BusinessDayDaoExt();
		String locationCode = CommonUtil.getLocationCode();

		// multiple open -> 1 error code
		// open -> 1 error for business day
		// previous day eod in progress -> 1 error code
		List<BusinessDayDaoExt> businessDayDaoList = businessDayRepository
				.findByStatusInAndLocationCode(dayActivityStatusList, locationCode);

		if (businessDayDaoList.size() == 1
				&& businessDayDaoList.get(0).getStatus().equalsIgnoreCase(DayActivityStatusEnum.OPEN.name())) {
			throw new ServiceException("Current day Bod is completed", "ERR-SALE-189");
		} else if (businessDayDaoList.size() == 1 && businessDayDaoList.get(0).getStatus()
				.equalsIgnoreCase(DayActivityStatusEnum.EOD_IN_PROGRESS.name())) {
			throw new ServiceException("Previous day EOD is not completed", "ERR-SALE-190");
		} else if (!businessDayDaoList.isEmpty() && businessDayDaoList.size() > 1) {
			BusinessDayUtil.getPendingDayActivityDetails(businessDayDaoList, MULTIPLE_BUSINESS_DAY);
		}

		Date maxBusinessDate = businessDayRepository.getMaximumBusinessDate(locationCode,
				DayActivityStatusEnum.CLOSED.name());

		if (maxBusinessDate == null) {
			maxBusinessDate = CalendarUtils.getTodayDate();
		} else {
			maxBusinessDate = CalendarUtils.addDate(maxBusinessDate, 1);
		}

		if (maxBusinessDate.after(CalendarUtils.getTodayDate())) {
			throw new ServiceException("We Cannot perform BOD for future date", "ERR-SALE-242");
		}

		BusinessDayDaoExt businessDayDao = businessDayRepository.findByStatusAndLocationCodeAndBusinessDate(
				DayActivityStatusEnum.BOD_IN_PROGRESS.name(), locationCode, maxBusinessDate);

		if (businessDayDao == null) {

			businessDay.setBusinessDate(maxBusinessDate);
			// get country() - engine service call -> different API
			// if month of business day is same as fiscalYearStart, then pick fiscalYear
			// from country master.
			// else take fiscal year of latest closed business day.-> util closed order by
			businessDay.setFiscalYear(getFiscalYear(locationCode));
			businessDay.setLocationCode(locationCode);
			businessDay.setStatus(DayActivityStatusEnum.BOD_IN_PROGRESS.name());
			businessDay.setSkipBanking(Boolean.FALSE);
			businessDay.setIsGHSBODDone(Boolean.FALSE);
			businessDay.setIsGHSEODDone(Boolean.FALSE);
			businessDay.setRateFetchAttempts((short) 0);
			businessDay.setIsGHSFileUploaded(Boolean.FALSE);
			businessDay.setIsServiceFileUploaded(Boolean.FALSE);

			businessDayDao = businessDayRepository.save(businessDay);
		}

		return (DayMasterDto) MapperUtil.getObjectMapping(businessDayDao, new DayMasterDto());
	}

	public Integer getFiscalYear(String locationCode) {

		return engineService.getCountryDetails(locationCode).getFiscalYear();

	}

	/**
	 * This method will perform the BOD (Beginning of the day) activity.
	 *
	 * @param businessDateDto
	 */
	@Override
	@Transactional
	public DayMasterDto performBODActivity(BusinessDateDto businessDateDto) {

		Date businessDate = businessDateDto.getBusinessDate();
		String locationCode = CommonUtil.getLocationCode();

		// make common method
		BusinessDayDaoExt businessDayDao = businessDayRepository
				.findByBusinessDateAndStatusInAndLocationCode(businessDate, performBODStatusList, locationCode);

		if (businessDayDao == null)
			throw new ServiceException("Please get the business day for doing BOD", "ERR-SALE-117");
		businessDayDao.setStatus(DayActivityStatusEnum.OPEN.name());
		runSchedulersSync(SchedulerStepUtil.getBodschedulersteps());
		SyncStagingDto syncStagingDto = businessDayStaging(businessDayDao, null, SalesOperationCode.BOD_BUSINESS_DAY);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			salesSyncDataService.publishSalesMessagesToQueue(syncStagingDto);
		return (DayMasterDto) MapperUtil.getObjectMapping(businessDayDao, new DayMasterDto());

	}

	@Transactional
	public SyncStagingDto businessDayStaging(BusinessDayDaoExt businessDayDao, RevenueSummaryDaoExt revenueSummaryDao,
			String operation) {
		if (businessDayDao.getSrcSyncId() != null)
			businessDayDao.setSrcSyncId(businessDayDao.getSrcSyncId() + 1);
		BusinessDayDaoExt businessDayDaoSaved = businessDayRepository.save(businessDayDao);
		SyncStagingDto businessDayStagingDto = new SyncStagingDto();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			List<SyncData> syncDataList = new ArrayList<>();
			List<String> destinations = new ArrayList<>();
			destinations.add("EPOSS");
			syncDataList.add(DataSyncUtil.createSyncData(new BusinessDaySyncDtoExt(businessDayDaoSaved), 0));
			if (revenueSummaryDao != null) {
				syncDataList.add(DataSyncUtil.createSyncData(new RevenueSummarySyncDtoExt(revenueSummaryDao), 1));
			}
			MessageRequest businessDayMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation,
					destinations, MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());

			businessDayStagingDto.setMessageRequest(businessDayMsgRequest);
			String businessDayMsgRqst = MapperUtil.getJsonString(businessDayMsgRequest);
			SyncStaging businessDaySyncStaging = new SyncStaging();
			businessDaySyncStaging.setMessage(businessDayMsgRqst);
			businessDaySyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			businessDaySyncStaging = saleSyncStagingRepository.save(businessDaySyncStaging);
			businessDayStagingDto.setId(businessDaySyncStaging.getId());
		}
		return businessDayStagingDto;
	}

	/**
	 * This method will perform the BOD (Beginning of the day) activity for GHS.
	 * 
	 * @param businessDateDto
	 */
	@Override
	@Transactional
	public DayMasterDto performGHSBODActivity(BusinessDateDto businessDateDto) {

		if (!getGhsDetails().getIsEghsMandatory()) {
			throw new ServiceException(GHS_MANDATORY, ERR_SALE_247);
		}
		BusinessDayDaoExt businessDayDao = businessDayRepository.findByBusinessDateAndStatusInAndLocationCode(
				businessDateDto.getBusinessDate(), openStatusList, CommonUtil.getLocationCode());

		if (businessDayDao == null) {
			throw new ServiceException("Please complete the boutique BOD", "ERR-SALE-141");
		}

		if (!BooleanUtils.isTrue(businessDayDao.getIsGHSBODDone())) {
		   BusinessDayActivityDto ghsBOD = integrationService.bodAtGhs("GHS", businessDateDto);
			
			BoutiqueGoldPriceMasterDto boutiqueGoldPriceMasterDto=getBoutiqueGoldPriceMasterDto(businessDateDto);
			BoutiqueGoldPriceMasterDto boutiqueGoldPriceMasterDto1=integrationService.updateGR("GHS", boutiqueGoldPriceMasterDto);
			log.info(MapperUtil.getJsonString(boutiqueGoldPriceMasterDto1));
			if (ghsBOD == null)
				throw new ServiceException("Unable to do GHS BOD", "ERR-SALE-142");

			businessDayDao.setIsGHSBODDone(Boolean.TRUE);
			businessDayDao = businessDayRepository.save(businessDayDao);
		}

		return (DayMasterDto) MapperUtil.getObjectMapping(businessDayDao, new DayMasterDto());
	}

	private BoutiqueGoldPriceMasterDto getBoutiqueGoldPriceMasterDto(BusinessDateDto businessDatedto) {
		BoutiqueGoldPriceMasterDto boutiqueGoldPriceMasterDto=new BoutiqueGoldPriceMasterDto();
		BigDecimal metalRate = engineService
				.getTodaysMaterialPrice(CommonUtil.getLocationCode(), MetalTypeCodeEnum.J.name(), businessDatedto);
		boutiqueGoldPriceMasterDto.setApplicableDate(businessDatedto.getBusinessDate());
		boutiqueGoldPriceMasterDto.setBtqPrice(metalRate);
        boutiqueGoldPriceMasterDto.setBTQEffective(true);
		boutiqueGoldPriceMasterDto.setCreatedDate(businessDatedto.getBusinessDate());
		boutiqueGoldPriceMasterDto.setLastModifiedDate(businessDatedto.getBusinessDate());
		boutiqueGoldPriceMasterDto.setLastModifiedID("admin");
		boutiqueGoldPriceMasterDto.setLoginID("admin");
		boutiqueGoldPriceMasterDto.setRemarks("system");
		return boutiqueGoldPriceMasterDto;

	}
	/**
	 * This method will be called to get the business day for which EOD needs to be
	 * done. If there are any pending BOD in the System this API will throw error.
	 *
	 */
	@Override
	public DayMasterDto getEodBusinessDay() {

		List<BusinessDayDaoExt> businessDayDaoList = businessDayRepository
				.findByStatusInAndLocationCode(dayActivityStatusList, CommonUtil.getLocationCode());

		if (businessDayDaoList.isEmpty()) {
			throw new ServiceException(BOD_BUSINESS_DAY, "ERR-SALE-113");
		} else if (businessDayDaoList.size() > 1) {
			BusinessDayUtil.getPendingDayActivityDetails(businessDayDaoList, MULTIPLE_BUSINESS_DAY);
		}
		return (DayMasterDto) MapperUtil.getObjectMapping(businessDayDaoList.get(0), new DayMasterDto());
	}

	/**
	 * This method will be called to start the EOD activity for the business day. If
	 * there are any pending BOD in the System this API will throw error.
	 *
	 */
	@Override
	@Transactional
	public DayMasterDto startEodActivity() {

		List<BusinessDayDaoExt> businessDayDaoList = businessDayRepository
				.findByStatusInAndLocationCode(dayActivityStatusList, CommonUtil.getLocationCode());

		if (businessDayDaoList.isEmpty()) {
			throw new ServiceException(BOD_BUSINESS_DAY, "ERR-SALE-113");
		} else if (businessDayDaoList.size() > 1) {
			BusinessDayUtil.getPendingDayActivityDetails(businessDayDaoList, MULTIPLE_BUSINESS_DAY);
		}

		if (businessDayDaoList.get(0).getStatus().equalsIgnoreCase(DayActivityStatusEnum.OPEN.name())) {
			updateStatus(businessDayDaoList.get(0));
		}
		return (DayMasterDto) MapperUtil.getObjectMapping(businessDayDaoList.get(0), new DayMasterDto());

	}

	/**
	 * This method will perform the EOD (End of the day) activity GHS.
	 * 
	 * @param eodRequest
	 */
	@Override
	public DayMasterDto performGHSEODActivity(BusinessDateDto businessDate) {

		if (!getGhsDetails().getIsEghsMandatory()) {
			throw new ServiceException(GHS_MANDATORY, ERR_SALE_247);
		}

		BusinessDayDaoExt businessDayDao = validateBusinessDayEOD(businessDate.getBusinessDate());

		if (!Boolean.TRUE.equals(businessDayDao.getIsGHSEODDone())) {

			BusinessDayActivityDto ghsEOD = integrationService.eodAtGhs("GHS", businessDate);

			if (ghsEOD == null)
				throw new ServiceException("Unable to do GHS EOD", "ERR-SALE-237");

			businessDayDao.setIsGHSEODDone(Boolean.TRUE);
			businessDayDao = businessDayRepository.save(businessDayDao);

		}
		return (DayMasterDto) MapperUtil.getObjectMapping(businessDayDao, new DayMasterDto());
	}

	/**
	 * 
	 * @param businessDate
	 * @return BusinessDayDao
	 */
	public BusinessDayDaoExt validateBusinessDay(Date businessDate) {

		BusinessDayDaoExt businessDayDao = businessDayRepository.findByBusinessDateAndStatusInAndLocationCode(
				businessDate, dayActivityStatusList, CommonUtil.getLocationCode());

		if (businessDayDao == null) {
			throw new ServiceException("Please complete the boutique BOD", "ERR-SALE-141");
		}

		return businessDayDao;
	}

	/**
	 * This method will perform the EOD (End of the day) activity.
	 *
	 * @param eodRequest
	 */
	@Override
	@Transactional
	public DayMasterDto performEODActivity(BusinessDateDto businessDateDto) {

		// step 1 :- check Current day BOD is completed.
		BusinessDayDaoExt businessDayDao = validateBusinessDayEOD(businessDateDto.getBusinessDate());

		// step 2:- Walk-ins details completed.
		StoreDetails storeDetails = getStoreDetails();

		if (storeDetails.getIsWalkInsDetailsMandatory() != null
				&& Boolean.TRUE.equals(storeDetails.getIsWalkInsDetailsMandatory())) {

			customerVisitService.getCustomerVisitDetails(businessDateDto);
		}

		// step 3:- Previous day GHS bank deposit file uploaded.
		// step 4:- Previous day bank deposit completed.
		BankingDetails bankingDetails = getBankingDetails();
		GhsDetails ghsDetails = getGhsDetails();
		if (bankingDetails.getIsBankingMandatory() && !businessDayDao.getSkipBanking()) {
			validateBankDeposit(businessDateDto);
		}
		// step 5 :- Business day boutique revenue consolidation completed
		// step 6 :- Business day GHS revenue download completed.
		validateRevenueForBusinessDay(businessDateDto.getBusinessDate(), bankingDetails, ghsDetails, businessDayDao);

		// step 7 :- GHS EOD is completed
		if (ghsDetails.getIsEghsMandatory()) {
			validateGHSEODCompleted(businessDayDao);
		}
		businessDayDao.setStatus(DayActivityStatusEnum.CLOSED.name());
		RevenueSummaryDaoExt revenueSummary = revenueSummaryRepository
				.findByBusinessDateAndLocationCode(businessDayDao.getBusinessDate(), CommonUtil.getLocationCode());
		runSchedulersSync(SchedulerStepUtil.getEodschedulersteps());
		SyncStagingDto syncStagingDto = businessDayStaging(businessDayDao, revenueSummary,
				SalesOperationCode.EOD_BUSINESS_DAY);
//		runSchedulersSync(SchedulerStepUtil.getEodschedulersteps());
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			salesSyncDataService.publishSalesMessagesToQueue(syncStagingDto);
		return (DayMasterDto) MapperUtil.getObjectMapping(businessDayDao, new DayMasterDto());

	}

	/**
	 * Run schedulers async as part of eod and bod.
	 *
	 * @param schedulerCodes the scheduler codes
	 */
	private void runSchedulersSync(List<String> schedulerCodes) {
		for (String schedulerCode : schedulerCodes) {
			integrationService.runScheduler(schedulerCode, getBearerToken());
		}
	}

	private BusinessDayDaoExt validateBusinessDayEOD(Date businessDate) {

		BusinessDayDaoExt businessDayDao = businessDayRepository.findByBusinessDateAndStatusInAndLocationCode(
				businessDate, performEODStatusList, CommonUtil.getLocationCode());

		if (businessDayDao == null) {
			throw new ServiceException("Please get the business day to perform the EOD", "ERR-SALE-185");
		}

		return businessDayDao;
	}

	/**
	 * This method will be used to validate bank Deposit
	 * 
	 * @param businessDateDto
	 */
	public void validateBankDeposit(BusinessDateDto businessDateDto) {

		List<BankDepositDaoExt> bankDeposit = bankDepositRepository
				.findByIsBankingCompletedAndBusinessDateAndLocationCode(Boolean.FALSE,
						CalendarUtils.addDate(businessDateDto.getBusinessDate(), -1), CommonUtil.getLocationCode());
		if (!bankDeposit.isEmpty()) {
			throw new ServiceException("Bank Deposit is not done for all payment code for business date",
					"ERR-SALE-146");
		}

	}

	/**
	 * This method will be used to check GHS EOD is done or not.
	 * 
	 * @param businessDayDao
	 */
	public void validateGHSEODCompleted(BusinessDayDaoExt businessDayDao) {

		if (!Boolean.TRUE.equals(businessDayDao.getIsGHSEODDone())) {
			throw new ServiceException("GHS EOD is not done", "ERR-SALE-147");
		}

	}

	/**
	 * To validate the revenue summary.
	 * 
	 * @param businessDate
	 * @param bankLocationDetails
	 * @param businessDayDao
	 */
	public void validateRevenueForBusinessDay(Date businessDate, BankingDetails bankingDetails, GhsDetails ghsDetails,
			BusinessDayDaoExt businessDayDao) {

		RevenueSummaryDaoExt revenueSummary = revenueSummaryRepository.findByBusinessDateAndLocationCode(businessDate,
				CommonUtil.getLocationCode());

		if (revenueSummary == null) {
			throw new ServiceException("Revenue details is not available for the business day", "ERR-SALE-171");
		}
		if (revenueSummary.getRevenueDetails() == null) {
			throw new ServiceException("Revenue is not calculated for the business day", "ERR-SALE-148");
		}
		if (Boolean.TRUE.equals(bankingDetails.getIsBankingMandatory())
				&& !Boolean.TRUE.equals(businessDayDao.getSkipBanking())
				&& revenueSummary.getDepositDetails() == null) {

			throw new ServiceException("Bank Deposit is not done for the business day", "ERR-SALE-149");
		}
		if (ghsDetails.getIsEghsMandatory() && revenueSummary.getGhsRevenueDetails() == null) {

			throw new ServiceException("GHS Revenue is not calculated for the business day", "ERR-SALE-150");
		}

	}

	/**
	 * To get the banking details for the location
	 * 
	 * @return BankingDetails
	 */
	public BankingDetails getBankingDetails() {
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());

		if (locationCacheDto.getBankingDetails() == null) {

			throw new ServiceException("Location Banking details is not configured", "ERR-SALE-173");
		}
		return MapperUtil.getObjectMapperInstance().convertValue(locationCacheDto.getBankingDetails(),
				BankingDetails.class);
	}

	/**
	 * To get the GHS details for the location
	 * 
	 * @return GhsDetails
	 */
	public GhsDetails getGhsDetails() {
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());

		if (locationCacheDto.getGhsDetails() == null) {

			throw new ServiceException("Location GHS details is not configured", "ERR-SALE-246");
		}
		return MapperUtil.getObjectMapperInstance().convertValue(locationCacheDto.getGhsDetails(), GhsDetails.class);
	}

	/**
	 * To get the store details from location details
	 * 
	 * @param locationDetails
	 * @return StoreDetails
	 */
	public StoreDetails getStoreDetails() {

		LocationCacheDto locationDetails = engineService.getStoreLocation(CommonUtil.getLocationCode());

		if (locationDetails == null)
			throw new ServiceException("No Location Details for requested location", "ERR-SALE-151");

		if (locationDetails.getStoreDetails() == null) {

			throw new ServiceException("Location Store details configuration is null", "ERR-SALE-172");
		}

		return MapperUtil.getObjectMapperInstance().convertValue(locationDetails.getStoreDetails(), StoreDetails.class);
	}

	/**
	 * This method will save revenue summary details.
	 * 
	 * @param businessDate
	 * @param businessDayDao
	 * @param locationCode
	 */
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void insertDataInRevenueSummary(BusinessDayDaoExt businessDayDao, String locationCode) {

		RevenueSummaryDaoExt revenueSummary = revenueSummaryRepository
				.findByBusinessDateAndLocationCode(businessDayDao.getBusinessDate(), locationCode);
		RevenueSummaryDaoExt revenueSummaryDao = new RevenueSummaryDaoExt();
		if (revenueSummary == null) {
			revenueSummaryDao.setBusinessDate(businessDayDao.getBusinessDate());
			revenueSummaryDao.setBusinessDayDao(businessDayDao);
			revenueSummaryDao.setLocationCode(locationCode);

			revenueSummaryDao = getRevenueForBusinessDate(locationCode, revenueSummaryDao);

			revenueSummaryDao = getBankDepositDetailsForBusinessDate(locationCode, businessDayDao.getBusinessDate(),
					revenueSummaryDao);

			revenueSummaryRepository.save(revenueSummaryDao);
		}
	}

	/**
	 * This method will save the revenue for the business date.
	 * 
	 * @param locationCode
	 * @param revenueSummaryDao
	 * @return RevenueSummaryDao
	 */
	public RevenueSummaryDaoExt getRevenueForBusinessDate(String locationCode, RevenueSummaryDaoExt revenueSummaryDao) {
		ListResponse<TodayRevenueDto> todayRevenue = revenueServiceImpl.getTodayRevenues(locationCode);
		if (!todayRevenue.getResults().isEmpty()) {
			JsonData revenueJson = new JsonData();
			revenueJson.setType(RevenueTypeEnum.POSS.name());
			revenueJson.setData(todayRevenue.getResults().get(0).getRevenues());
			revenueSummaryDao.setRevenueDetails(MapperUtil.getJsonString(revenueJson));
		}
		return revenueSummaryDao;
	}

	/**
	 * This method will save the bank deposit for the business date.
	 * 
	 * @param locationCode
	 * @param businessDate
	 * @param revenueSummaryDao
	 * @return RevenueSummaryDao
	 */
	public RevenueSummaryDaoExt getBankDepositDetailsForBusinessDate(String locationCode, Date businessDate,
			RevenueSummaryDaoExt revenueSummaryDao) {

		List<PaymentDepositDto> bankDepositDtoList = new ArrayList<>();

		List<BankDepositDaoExt> bankDepositDaoList = bankDepositRepository
				.findByLocationCodeAndDepositDateAndIsBankingCompleted(locationCode, businessDate, Boolean.TRUE);

		if (!bankDepositDaoList.isEmpty()) {
			for (BankDepositDaoExt bankDeposit : bankDepositDaoList) {
				PaymentDepositDto paymentDeposit = new PaymentDepositDto();
				paymentDeposit.setDeposit(bankDeposit.getDepositAmount());
				paymentDeposit.setPaymentCode(bankDeposit.getPaymentCode());
				paymentDeposit.setTxnId(bankDeposit.getId());
				bankDepositDtoList.add(paymentDeposit);
			}
			JsonData depositJson = new JsonData();
			depositJson.setType(BANK_DEPOSIT);
			depositJson.setData(bankDepositDtoList);
			revenueSummaryDao.setDepositDetails(MapperUtil.getJsonString(depositJson));
		} else {
			PaymentDepositDto paymentDeposit = new PaymentDepositDto();
			paymentDeposit.setDeposit(BigDecimal.ZERO);
			bankDepositDtoList.add(paymentDeposit);
			JsonData depositJson = new JsonData();
			depositJson.setType(BANK_DEPOSIT);
			depositJson.setData(bankDepositDtoList);
			revenueSummaryDao.setDepositDetails(MapperUtil.getJsonString(depositJson));

		}

		return revenueSummaryDao;
	}

	/**
	 * This method will be used to update the status.
	 * 
	 * @param businessDayDaoExt
	 */
	@Transactional
	public void updateStatus(BusinessDayDaoExt businessDayDaoExt) {

		businessDayDaoExt.setStatus(DayActivityStatusEnum.EOD_IN_PROGRESS.name());
		businessDayRepository.save(businessDayDaoExt);
	}

	/**
	 * This Method will get the data eligible for bank deposit and save into db.
	 * 
	 * @param businessDate
	 * @param businessDayDao
	 * @param locationCode
	 * @return
	 * 
	 */
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void insertDataForBankDeposit(BusinessDayDaoExt businessDayDao, String locationCode) {
		Date businessDate = businessDayDao.getBusinessDate();
		List<BankDepositDaoExt> bankDeposit = bankDepositRepository.findByLocationCodeAndBusinessDate(locationCode,
				businessDate);
		List<BankDepositDaoExt> bankDepositList = new ArrayList<>();

		if (bankDeposit.isEmpty()) {

			List<Object[]> cashAmountDepositDetails = paymentDetailsRepository.getAmountForCashDeposit(
					PaymentCodeEnum.CASH.getPaymentcode(), locationCode, businessDate, RevenueUtil.getValidTxnTypes(),
					RevenueUtil.getValidStatus(), RevenueUtil.getReversedStatus(), RevenueUtil.getValidTxnStatus());

			List<Object[]> cardAmountDepositDetails = paymentDetailsRepository.getAmountForCardDeposit(
					PaymentCodeEnum.CARD.getPaymentcode(), locationCode, businessDate, RevenueUtil.getValidTxnTypes(),
					RevenueUtil.getValidStatus(), RevenueUtil.getReversedStatus(), RevenueUtil.getValidTxnStatus());

			List<Object[]> cardAmountDepositExceptDetails = paymentDetailsRepository.getAmountForCardDepositExcept(
					PaymentCodeEnum.CARD.getPaymentcode(), locationCode, businessDate, RevenueUtil.getValidTxnTypes(),
					RevenueUtil.getValidStatus(), RevenueUtil.getReversedStatus(), RevenueUtil.getValidTxnStatus());
			List<String> paymentCodeList = Arrays.asList(PaymentCodeEnum.CHEQUE.getPaymentcode(),
					PaymentCodeEnum.DD.getPaymentcode());

			List<Object[]> chequeDDAmountDepositDetails = paymentDetailsRepository.getAmountForChequeDDDeposit(
					paymentCodeList, locationCode, businessDate, RevenueUtil.getValidTxnTypes(),
					RevenueUtil.getValidStatus(), RevenueUtil.getReversedStatus(), RevenueUtil.getValidTxnStatus());

			if (!cashAmountDepositDetails.isEmpty()
                    && ((BigDecimal) cashAmountDepositDetails.get(0)[0]).compareTo(BigDecimal.ZERO) > 0) {
				getBankDepositDetailsForCash((BigDecimal) cashAmountDepositDetails.get(0)[0], bankDepositList,
						locationCode, businessDayDao);
			}
// comparing the paymentDetails and paymentRefunds in case of credit note cancellation.
			if (!cardAmountDepositDetails.isEmpty() ) {
				if(!cardAmountDepositExceptDetails.isEmpty()) {
					List<Object[]> removeList = new ArrayList<>();
					for (Object[] obj : cardAmountDepositExceptDetails) {
						for(Object[] obj1 : cardAmountDepositDetails) {
							if(obj1[1].equals(obj[1])) {
								removeList.add(obj1);
							}
						}
					}
					if(!CollectionUtil.isEmpty(removeList)) {
						cardAmountDepositDetails.removeAll(removeList);
						//cardAmountDepositExceptDetails.removeAll(removeList);
						
					}
				}
				//if(!CollectionUtil.isEmpty(cardAmountDepositExceptDetails)) {
//					for (Object[] obj : cardAmountDepositExceptDetails) {
//						BankDepositDaoExt bankDeposits = getBankDepositDao(locationCode, PaymentCodeEnum.CARD.getPaymentcode(),
//								(BigDecimal) obj[0], (String) obj[1], businessDayDao);
//						
//						bankDepositList.add(bankDeposits);
//					
//				}
				//}
				
				getBankDepositDetailsForCard(cardAmountDepositExceptDetails, bankDepositList, locationCode, businessDayDao);
				getBankDepositDetailsForCard(cardAmountDepositDetails, bankDepositList, locationCode, businessDayDao);
			}

			if (!chequeDDAmountDepositDetails.isEmpty()) {
				getBankDepositDetailsForChequeAndDD(chequeDDAmountDepositDetails, bankDepositList, locationCode,
						businessDayDao);
			}

			bankDepositRepository.saveAll(bankDepositList);
		}
	}

	/**
	 * This method will get the bank deposit details for Cheque and DD.
	 * 
	 * @param chequeDDDepositDetails
	 * @param bankDepositList
	 * @param todayDate
	 * @param locationCode
	 * @param businessDayDao
	 */
	public void getBankDepositDetailsForChequeAndDD(List<Object[]> chequeDDDepositDetails,
			List<BankDepositDaoExt> bankDepositList, String locationCode, BusinessDayDaoExt businessDayDao) {

		Boolean isValid = false;
		String bankName = null;
		
			PayeeBankLocationDto payeeBank = engineServiceClient.getPayeeBank(PaymentCodeEnum.CHEQUE.name());
			if(payeeBank.getBankName()!=null) {
				Boolean isActive = engineServiceClient.getIsActive(payeeBank.getBankName());
				if(!BooleanUtils.isTrue(isActive)) {
					isValid = true;
					bankName = payeeBank.getBankName();
					throw new ServiceException("{bankName} is inactive","ERR-SALE-426",Map.of("bankName",bankName));
					
				}
				for (Object[] obj : chequeDDDepositDetails) {
					if (((BigDecimal) obj[0]).compareTo(BigDecimal.ZERO) > 0) {
						
					
						BankDepositDaoExt bankDeposit = getBankDepositDao(locationCode, (String) obj[3], (BigDecimal) obj[0],
								payeeBank.getBankName(), businessDayDao);
						bankDeposit.setPayerBankName((String) obj[2]);
						bankDeposit.setInstrumentNo((String) obj[1]);
						bankDepositList.add(bankDeposit);
					}
				}
			}
			else {
				throw new ServiceException("PIF series is not defined for the paymentCode {paymentCode}", "ERR-SALE-188", Map.of(SalesConstants.PAYMENT_CODE,PaymentCodeEnum.CHEQUE.getPaymentcode()));
			}
			
		
		}

	

	/**
	 * This method will get the bank deposit details for Card.
	 * 
	 * @param cardDepositDetails
	 * @param bankDepositList
	 * @param todayDate
	 * @param locationCode
	 * @param businessDayDao
	 */
	public void getBankDepositDetailsForCard(List<Object[]> cardDepositDetails, List<BankDepositDaoExt> bankDepositList,
			String locationCode, BusinessDayDaoExt businessDayDao) {
		for (Object[] obj : cardDepositDetails) {
			if (((BigDecimal) obj[0]).compareTo(BigDecimal.ZERO) > 0) {
				BankDepositDaoExt bankDeposit = getBankDepositDao(locationCode, PaymentCodeEnum.CARD.getPaymentcode(),
						(BigDecimal) obj[0], (String) obj[1], businessDayDao);
			
				bankDepositList.add(bankDeposit);
			}
		}	
	}

	/**
	 * This method will get the bank deposit details for cash.
	 * 
	 * @param amount
	 * @param bankDepositList
	 * @param bankDepositList
	 * @param todayDate
	 * @param locationCode
	 * @param businessDayDao
	 */
	public void getBankDepositDetailsForCash(BigDecimal amount, List<BankDepositDaoExt> bankDepositList,
			String locationCode, BusinessDayDaoExt businessDayDao) {
   
		Boolean isValid = false;
		String bankName = null;
		//try{
			PayeeBankLocationDto payeeBank = engineServiceClient.getPayeeBank(PaymentCodeEnum.CASH.name());
			if(payeeBank.getBankName()!=null) {
				Boolean isActive = engineServiceClient.getIsActive(payeeBank.getBankName());
				if(!BooleanUtils.isTrue(isActive)) {
					isValid = true;
					bankName = payeeBank.getBankName();
					throw new ServiceException("{bankName} is inactive","ERR-SALE-426",Map.of("bankName",bankName));
					
				}
				bankDepositList.add(getBankDepositDao(locationCode, PaymentCodeEnum.CASH.getPaymentcode(), amount,
						payeeBank.getBankName(), businessDayDao));
			}
			else {
				throw new ServiceException("PIF series is not defined for the paymentCode {paymentCode}", "ERR-SALE-188", Map.of(SalesConstants.PAYMENT_CODE,PaymentCodeEnum.CASH.getPaymentcode()));
			}
				
			//}
			
			
		
//    catch( ServiceException e) {
//    	if(BooleanUtils.isTrue(isValid)) {
//            throw new ServiceException("{bankName} is inactive","ERR-SALE-426",Map.of("bankName",bankName));
//    	}
//    	else {
//    		 throw new ServiceException("PIF series is not defined for the paymentCode {paymentCode}", "ERR-SALE-188", Map.of(SalesConstants.PAYMENT_CODE,PaymentCodeEnum.CASH.getPaymentcode()));
//    	}
//       
//    }
		

		
	}
	



	/**
	 * This Method will create bank deposit dao
	 * 
	 * @param todayDate
	 * @param locationCode
	 * @param paymentCode
	 * @param amount
	 * @param businessDayDao
	 * @return BankDepositDao
	 */
	public BankDepositDaoExt getBankDepositDao(String locationCode, String paymentCode, BigDecimal amount,
			String payeeBankName, BusinessDayDaoExt businessDayDao) {
		BankDepositDaoExt bankDeposit = new BankDepositDaoExt();
		bankDeposit.setCollectionDate(businessDayDao.getBusinessDate());
		bankDeposit.setPaymentCode(paymentCode);
		bankDeposit.setAmount(amount);
		bankDeposit.setDepositAmount(amount);
		if (paymentCode.equalsIgnoreCase(PaymentCodeEnum.CHEQUE.getPaymentcode())
				|| paymentCode.equalsIgnoreCase(PaymentCodeEnum.DD.getPaymentcode())) {
			bankDeposit.setInstrumentDate(businessDayDao.getBusinessDate());
		}
		bankDeposit.setLocationCode(locationCode);
		bankDeposit.setBusinessDate(businessDayDao.getBusinessDate());
		bankDeposit.setPayeeBankName(payeeBankName);
		bankDeposit.setIsBankingCompleted(Boolean.FALSE);
		bankDeposit.setBusinessDayDao(businessDayDao);
		return bankDeposit;
	}

	/**
	 * 
	 * @param businessDayDao
	 * @param bankingRequest
	 */
	public void saveSkipBankDeposit(BusinessDayDaoExt businessDayDao, BankingRequestDto bankingRequest) {

		businessDayDao.setSkipBanking(bankingRequest.getSkipBanking());
		if (bankingRequest.getRemarks() != null) {
			businessDayDao.setRemarks(bankingRequest.getRemarks());
		}
		businessDayRepository.save(businessDayDao);
	}

	@Override
	@Transactional
	public BooleanResponse performRevenueCollection(BusinessDateDto businessDate) {
		runSchedulersSync(SchedulerStepUtil.getEodschedulerstepsRevenue());
		BusinessDayDaoExt businessDayDao = validateBusinessDay(businessDate.getBusinessDate());
		String locationCode = CommonUtil.getLocationCode();
		BankingDetails bankingDetails = getBankingDetails();
		if (bankingDetails.getIsBankingMandatory())
			insertDataForBankDeposit(businessDayDao, locationCode);
		if (Boolean.TRUE.equals(validateRevenueSummary(businessDayDao, locationCode)))
			insertDataInRevenueSummary(businessDayDao, locationCode);

		return new BooleanResponse(Boolean.TRUE);
	}

	private Boolean validateRevenueSummary(BusinessDayDaoExt businessDayDao, String locationCode) {

		RevenueSummaryDaoExt revenueSummary = revenueSummaryRepository
				.findByBusinessDateAndLocationCode(businessDayDao.getBusinessDate(), locationCode);

		if (revenueSummary != null) {
			return Boolean.FALSE;
		}

		return Boolean.TRUE;
	}

	@Override
	@Transactional
	public BooleanResponse performGHSRevenueCollection(BusinessDateDto businessDate) {

		if (!getGhsDetails().getIsEghsMandatory()) {
			throw new ServiceException(GHS_MANDATORY, ERR_SALE_247);
		}
		RevenueSummaryDaoExt revenueSummary = revenueSummaryRepository
				.findByBusinessDateAndLocationCode(businessDate.getBusinessDate(), CommonUtil.getLocationCode());

		if (revenueSummary == null) {
			throw new ServiceException("Please do the Boutique Revenue Collection", "ERR-SALE-152");
		}
		ListResponse<GhsTodayRevenueDto> ghsRevenue = null;
		if (revenueSummary.getGhsRevenueDetails() == null) {
			try {
				ghsRevenue = integrationService.getGhsTodayRevenueEod(businessDate, "GHS");
			} catch (Exception e) {
				throw new ServiceException(
						"Could not connect to GHS server. Please proceed with offline GHS EOD process", "ERR-SALE-270");
			}
			if (ghsRevenue == null || ghsRevenue.getResults().isEmpty()) {
				throw new ServiceException("Not able to get the GHS Revenue", "ERR-SALE-153");
			}

			JsonData ghsRevenueJson = new JsonData();
			ghsRevenueJson.setType(RevenueTypeEnum.GHS.name());
			ghsRevenueJson.setData(ghsRevenue.getResults().get(0).getRevenues());
			revenueSummary.setGhsRevenueDetails(MapperUtil.getJsonString(ghsRevenueJson));
			revenueSummaryRepository.save(revenueSummary);
		}
		return new BooleanResponse(Boolean.TRUE);
	}

	@Override
	@Transactional
	public BooleanResponse performOfflineGHSRevenueCollection(GhsOfflineEODRequestDto ghsOfflineEOD) {

		if (!getGhsDetails().getIsEghsMandatory()) {
			throw new ServiceException(GHS_MANDATORY, ERR_SALE_247);
		}

		BusinessDayDaoExt businessDayDao = validateBusinessDayEOD(ghsOfflineEOD.getBusinessDate());

		RevenueSummaryDaoExt revenueSummary = revenueSummaryRepository
				.findByBusinessDateAndLocationCode(ghsOfflineEOD.getBusinessDate(), CommonUtil.getLocationCode());

		if (revenueSummary == null) {
			throw new ServiceException("Please do the Boutique Revenue Collection", "ERR-SALE-152");
		}

		String password = validatePasswordForOfflineEOD(ghsOfflineEOD);

		if (!Boolean.TRUE.equals(businessDayDao.getIsGHSEODDone())) {

			JsonData ghsRevenueJson = new JsonData();
			ghsRevenueJson.setType(RevenueTypeEnum.GHS.name());
			ghsRevenueJson.setData(getRevenueResponseDetails(ghsOfflineEOD));
			revenueSummary.setGhsRevenueDetails(MapperUtil.getJsonString(ghsRevenueJson));
			revenueSummaryRepository.save(revenueSummary);

			businessDayDao.setIsGHSEODDone(Boolean.TRUE);
			businessDayRepository.save(businessDayDao);

		}
		storePasswordService.savePasswordForGHSOfflineEOD(password, ghsOfflineEOD);

		return new BooleanResponse(Boolean.TRUE);
	}

	private String validatePasswordForOfflineEOD(GhsOfflineEODRequestDto ghsOfflineEOD) {

		String password = PasswordHashUtil.getGhsOfflinePasswordEod(ghsOfflineEOD);

		if (!password.equalsIgnoreCase(ghsOfflineEOD.getPassword())) {
			throw new ServiceException("Password is wrong please validate input", "ERR-SALE-216");
		}

		return password;
	}

	/**
	 * 
	 * @param businessDate
	 */
	public void updateGHSFlag(Date businessDate) {

		BusinessDayDaoExt businessDay = validateBODBusinessDay(businessDate);

		businessDay.setIsGHSBODDone(Boolean.TRUE);

		businessDayRepository.save(businessDay);
	}

	/**
	 * 
	 * @param businessDate
	 * @return
	 */
	public BusinessDayDaoExt validateBODBusinessDay(Date businessDate) {

		BusinessDayDaoExt businessDay = businessDayRepository.findByBusinessDateAndStatusInAndLocationCode(businessDate,
				dayActivityStatusList, CommonUtil.getLocationCode());

		if (businessDay == null)
			throw new ServiceException("Please Do Boutiqe BOD", "ERR-SALE-217");

		return businessDay;
	}

	private GhsTodayRevenueDto getRevenueResponseDetails(GhsOfflineEODRequestDto ghsOfflineEOD) {

		GhsTodayRevenueDto ghsTodayRevenueDto = new GhsTodayRevenueDto();

		ghsTodayRevenueDto.setRevenueType(RevenueTypeEnum.GHS.name());
		List<RevenueDto> revenueDtos = new ArrayList<>();

		RevenueDto revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.CASH.name());
		revenueDto.setPayments(ghsOfflineEOD.getCashAmount());
		revenueDto.setReturns(ghsOfflineEOD.getCashReversal());
		revenueDto.setRevenues(
				revenueDto.getPayments().subtract(revenueDto.getReturns()).subtract(ghsOfflineEOD.getCashRefund()));
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.CARD.name());
		revenueDto.setPayments(ghsOfflineEOD.getCCRevenue());
		revenueDto.setReturns(ghsOfflineEOD.getCCReversal());
		revenueDto.setRevenues(revenueDto.getPayments().subtract(revenueDto.getReturns()));
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.AIRPAY.name());
		revenueDto.setPayments(ghsOfflineEOD.getAirPayAmount());
		revenueDto.setReturns(ghsOfflineEOD.getAirPayReversal());
		revenueDto.setRevenues(revenueDto.getPayments().subtract(revenueDto.getReturns()));
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.DD.name());
		revenueDto.setPayments(ghsOfflineEOD.getDDAmount());
		revenueDto.setReturns(ghsOfflineEOD.getDDReversal());
		revenueDto.setRevenues(revenueDto.getPayments().subtract(revenueDto.getReturns()));
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.CHEQUE.name());
		revenueDto.setPayments(ghsOfflineEOD.getChequeAmount());
		revenueDto.setReturns(ghsOfflineEOD.getChequeReversal());
		revenueDto.setRevenues(revenueDto.getPayments().subtract(revenueDto.getReturns()));
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.RTGS.name());
		revenueDto.setPayments(ghsOfflineEOD.getAchAmount());
		revenueDto.setReturns(ghsOfflineEOD.getAchReversal());
		revenueDto.setRevenues(revenueDto.getPayments().subtract(revenueDto.getReturns()));
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.EMPLOYEE_LOAN.name());
		revenueDto.setPayments(ghsOfflineEOD.getEmplSalaryDeductionAmount());
		revenueDto.setReturns(ghsOfflineEOD.getEmplSalaryDeductionAmountReversal());
		revenueDto.setRevenues(revenueDto.getPayments().subtract(revenueDto.getReturns()));
		revenueDtos.add(revenueDto);
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.ROPAYMENT.getPaymentcode());
		revenueDto.setPayments(ghsOfflineEOD.getRoRefund());
		//revenueDto.setReturns(ghsOfflineEOD.getRoReversal());
		revenueDto.setRevenues(new BigDecimal(-1).multiply(revenueDto.getPayments()));
		revenueDtos.add(revenueDto);

		ghsTodayRevenueDto.setRevenues(revenueDtos);

		return ghsTodayRevenueDto;
	}

	private String getBearerToken() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		HttpServletRequest request = null;
		if (authentication != null) {
			request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
		}
		if (request != null) {
			return request.getHeader(CommonConstants.AUTH_HEADER);
		} else {
			return null;
		}
	}

	@Override
	@Transactional
	public BooleanResponse performServiceRevenueCollection(BusinessDateDto businessDate) {
		if (!getServiceDetails().getIsServiceMandatory()) {
			throw new ServiceException(SERVICE_MANDATORY, ERR_SALE_469);
		}
		RevenueSummaryDaoExt revenueSummary = revenueSummaryRepository
				.findByBusinessDateAndLocationCode(businessDate.getBusinessDate(), CommonUtil.getLocationCode());

		if (revenueSummary == null) {
			throw new ServiceException("Please do the Boutique Revenue Collection", "ERR-SALE-152");
		}
		ServicePossRequestDto servicePossRequestDto = new ServicePossRequestDto();
		servicePossRequestDto.setBusinessDate(businessDate.getBusinessDate().getTime());
		servicePossRequestDto.setLocationCode(CommonUtil.getLocationCode());
		Map<String, List<ServicePossRevenueDto>> results = new HashMap();
		if (revenueSummary.getServiceRevenueDetails() == null) {
			try {
				results = integrationService.getServiceTodayRevenueForEod(servicePossRequestDto);
			} catch (Exception e) {
				throw new ServiceException(
						"Could not connect to SERVICE server. Please proceed with offline SERVICE EOD process", "ERR-SALE-470");
			}
			if (results == null || results.isEmpty()) {
				throw new ServiceException("Not able to get the SERVICE Revenue", "ERR-SALE-471");
			}

			JsonData serviceRevenueJson = new JsonData();
			serviceRevenueJson.setType(RevenueTypeEnum.SERVICE.name());
			serviceRevenueJson.setData(results.get("results").get(0).getRevenues());
			revenueSummary.setServiceRevenueDetails(MapperUtil.getJsonString(serviceRevenueJson));
			revenueSummaryRepository.save(revenueSummary);
		}
		return new BooleanResponse(Boolean.TRUE);
	}
	
	/**
	 * To get the service poss details for the location
	 * 
	 * @return servicePossDetails
	 */
	public ServiceDetails getServiceDetails() {
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());

		if (locationCacheDto.getServiceDetails() == null) {

			throw new ServiceException("Location Service Poss details is not configured", "ERR-SALE-475");
		}
		return MapperUtil.getObjectMapperInstance().convertValue(locationCacheDto.getServiceDetails(), ServiceDetails.class);
	}
	



}
