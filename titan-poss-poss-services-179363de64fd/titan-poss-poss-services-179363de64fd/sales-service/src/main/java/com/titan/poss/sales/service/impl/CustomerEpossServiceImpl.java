/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.CustomerDto;
import com.titan.poss.core.dto.LoyaltyDetails;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerDaoExt;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;
import com.titan.poss.sales.dao.CustomerUlpDao;
import com.titan.poss.sales.dto.CustomerEpossListSearchDto;
import com.titan.poss.sales.dto.CustomerEpossSearchDto;
import com.titan.poss.sales.dto.EpossCustomerSearchListDto;
import com.titan.poss.sales.dto.RegularCustomerCreateDto;
import com.titan.poss.sales.dto.constants.CustNonUniqSearchTypeEnum;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.CustomerRepository;
import com.titan.poss.sales.repository.CustomerRepositoryExt;
import com.titan.poss.sales.repository.CustomerUlpRepositoryExt;
import com.titan.poss.sales.service.CustomerDocumentService;
import com.titan.poss.sales.service.CustomerEpossService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("SalesCustomerEpossService")
public class CustomerEpossServiceImpl implements CustomerEpossService {

	private static final String ERR_SALE_048 = "ERR-SALE-048";
	private static final String INVALID_INPUTS = "Invalid inputs.";

	private static final String MOBILE_NO = "mobileNo";

	private static final String ERR_SALE_070 = "ERR-SALE-070";
	private static final String RECORD_NOT_FOUND = "Record not found.";

	@Autowired
	private CustomerService customerService;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private CustomerRepository customerRepo;

	@Autowired
	private CustomerRepositoryExt customerRepoExt;

	@Autowired
	private CustomerDocumentService customerDocService;

	@Autowired
	private CustomerUlpRepositoryExt customerUlpRepo;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationMappingRepo;

	private String encFieldWithNullCheck(String str) {
		if (str == null)
			return null;
		return CryptoUtil.encrypt(str, "");
	}

	@Override
	public ListResponse<CustomerEpossListSearchDto> searchCustomerList(String searchInput, String searchTypeStr) {

		CustNonUniqSearchTypeEnum searchType = CustNonUniqSearchTypeEnum.valueOf(searchTypeStr);

		if (searchType == CustNonUniqSearchTypeEnum.NAME)
			searchInput = searchInput.toUpperCase();
		else if (searchType == CustNonUniqSearchTypeEnum.EMAIL_ID)
			searchInput = searchInput.toLowerCase();
		else if (searchType == CustNonUniqSearchTypeEnum.CUSTOMER_NAME)
			searchInput = searchInput.toUpperCase();

		String emailId = null;
		String name = null;
		String custType = null;
		String locationCode = CommonUtil.getLocationCode();

		switch (searchType) {

		case NAME:
			searchFieldPatternCheck(searchTypeStr, searchInput, RegExConstants.NAME_REGEX);
			name = encFieldWithNullCheck(searchInput);
			custType = CustomerTypeEnum.INTERNATIONAL.name();
			break;
			
		case CUSTOMER_NAME:
			searchFieldPatternCheck(searchTypeStr, searchInput, RegExConstants.NAME_REGEX);
			name = encFieldWithNullCheck(searchInput);
			custType = CustomerTypeEnum.ONETIME.name();
			break;

		case EMAIL_ID:
			searchFieldPatternCheck(searchTypeStr, searchInput, RegExConstants.EMAIL_REGEX);
			emailId = encFieldWithNullCheck(searchInput);
			custType = CustomerTypeEnum.INTERNATIONAL.name();
			break;

		default:
			break;

		}

		List<EpossCustomerSearchListDto> searchData = customerRepo.listCustomers(emailId, name, custType,locationCode);

		// decrypt
		return new ListResponse<>(decryptCustomer(searchData));

	}

	/**
	 * @param searchData
	 * @return
	 */
	private List<CustomerEpossListSearchDto> decryptCustomer(List<EpossCustomerSearchListDto> searchData) {

		List<CustomerEpossListSearchDto> customerSearchListDtos = new ArrayList<>();
		
		// decrypt only is isEncrypted true
		// PENDING but db team inserted data for those whose value was blank & now no
		// one has data
		searchData.forEach(cust -> {
			CustomerEpossListSearchDto customerSearchListDto = new CustomerEpossListSearchDto();
			customerSearchListDto.setCustomerId(cust.getCustomerId());
			customerSearchListDto.setCustomerType(cust.getCustomerType());
			customerSearchListDto.setCustomerName(CryptoUtil.decrypt(cust.getCustomerName(), "customerName", false));
			customerSearchListDto.setMobileNumber(CryptoUtil.decrypt(cust.getMobileNumber(), MOBILE_NO, false));
			customerSearchListDto.setUlpId(CryptoUtil.decrypt(cust.getUlpId(), "ulpId", false));
			customerSearchListDto.setEmailId(CryptoUtil.decrypt(cust.getEmailId(), "emailId", false));
			customerSearchListDto.setInstiTaxNo(CryptoUtil.decrypt(cust.getInstiTaxNo(), "instiTaxNo", false));
			customerSearchListDto.setCustTaxNo(CryptoUtil.decrypt(cust.getCustTaxNo(), "custTaxNo", false));
			customerSearchListDto.setPassportId(CryptoUtil.decrypt(cust.getPassportId(), MOBILE_NO, false));
			
		    JsonData customerDetailsJsonData = JsonUtils.convertStrToJsonData(cust.getCustomerDetails());
		   
		    customerSearchListDto.setCustomerDetails(customerDetailsJsonData);
		    customerSearchListDtos.add(customerSearchListDto);
		});

		return customerSearchListDtos;
	}

	private void searchFieldPatternCheck(String searchType, String searchInput, String regex) {

		if (!Pattern.matches(regex, searchInput)) {
			throw new ServiceException(INVALID_INPUTS, ERR_SALE_048, searchType);
		}

	}

	// @formatter:off
	
	// if REGULAR
	//		get integration data, 
	//		get EPOSS data, // if not available,  (ERR-SALE-XYZ Customer exist in ULP, but not in Tanishq Data) 
	//			(check if ULP match, else mobile)	
	// manually override with EPOSS data 
	//		save it
	// else
	//		get the matching data
	// send in response

	// @formatter:on

	private CustomerUlpDao getByULPId(String ulpId) {

		CustomerUlpDao customerUlpDao = null;
		if (StringUtils.isBlank(ulpId))
			return customerUlpDao;

		Optional<CustomerUlpDao> customerUlpDaos = customerUlpRepo.findById(ulpId);
		if (customerUlpDaos.isPresent())
			customerUlpDao = customerUlpDaos.get();

		return customerUlpDao;
	}

	@Override
	public CustomerEpossSearchDto searchCustomerWoULPWoError(String searchFieldValue, String searchTypeStr) {

		CustomerEpossSearchDto custSearchDto = null;

		CustomerDao customerDao;
		CustomerUlpDao customerUlpDao = null;

		SearchTypeEnum searchType = SearchTypeEnum.valueOf(searchTypeStr);
		List<CustomerDocumentsDao> customerDocuments = null;

		if (searchType == SearchTypeEnum.ULP_ID) {

			customerDao = customerRepo.findOneByUlpIdAndCustomerType(searchFieldValue, CustomerTypeEnum.REGULAR.name());
			if (customerDao != null) {
				customerUlpDao = getByULPId(customerDao.getUlpId());
			}

			custSearchDto = new CustomerEpossSearchDto(customerDao, customerUlpDao, null,customerDocuments);

		} else if (searchType == SearchTypeEnum.MOBILE_NO) {

			customerDao = customerRepo.findOneByMobileNumberAndCustomerType(searchFieldValue,
					CustomerTypeEnum.REGULAR.name());
			// if no record search encrypted
			if (customerDao == null)
				customerDao = customerRepo.findOneByMobileNumberAndCustomerType(
						CryptoUtil.encrypt(searchFieldValue, MOBILE_NO), CustomerTypeEnum.REGULAR.name());

			if (customerDao != null) {
				customerUlpDao = getByULPId(customerDao.getUlpId());
			}

			custSearchDto = new CustomerEpossSearchDto(customerDao, customerUlpDao, null,customerDocuments);

		} else {

			custSearchDto = getCustomerDataOtherThanRegDummy(searchFieldValue, searchType);
		}

		// Document set
		if (custSearchDto.getCustomer() != null) {
			custSearchDto.setCustomerDocuments(
					customerDocService.getActiveCustomerDocsByCustomerId(custSearchDto.getCustomer().getId()));
		}
		return custSearchDto;

	}

	@Override
	public CustomerEpossSearchDto getCustomerByIdAndLocationCode(Integer customerId, String locationCode) {

		CustomerEpossSearchDto response = new CustomerEpossSearchDto();

		CustomerLocationMappingDao clm = customerService.checkIfCustomerExists(customerId, locationCode);

		CustomerDao cust = clm.getCustomer();
		response.setCustomer(cust);

		if (StringUtils.isNotBlank(cust.getUlpId())) {
			response.setCustomerUlp(customerService.getUlpDetails(cust.getUlpId()));
		}

		return response;

	}

	@Override
	@Transactional
	public CustomerEpossSearchDto searchAndUpdateCustomer(String searchInput, String searchTypeStr,
			Boolean isUlpUpdateRquire) {

		log.debug("Searching customer in EPOSS, type: {}, value: {} with ulp value update? {}", searchTypeStr,
				searchInput, isUlpUpdateRquire);

		CustomerEpossSearchDto custSearchDto = null;

		CustomerDao customerDao = null;
		CustomerUlpDao customerUlpDao = null;

		SearchTypeEnum searchType = SearchTypeEnum.valueOf(searchTypeStr);

		List<CustomerDocumentsDao> customerDocuments = null;

		if (searchType == SearchTypeEnum.ULP_ID || searchType == SearchTypeEnum.MOBILE_NO) {

			if (BooleanUtils.isTrue(isUlpUpdateRquire)) {

				// get data from ULP, throw error, encrypt name, mobile no
				CustomerDto custUlpData = getCustomerFromUlpEncrypt(searchInput, searchTypeStr);
				// get data from DB, if not exist null
				customerDao = getRegularCustomerDataFromDB(custUlpData);

				// These above 2 calls require, if mobile no or ULP got changed
				// available in ULP, but not in DB, Titan Watch scenario
				if (customerDao == null) {

					log.info("DB no data, netcarrot data :- {}", custUlpData);

					customerDao = (CustomerDao) MapperUtil.getDtoMapping(custUlpData, CustomerDao.class);
					customerDao.setCustomerType(CustomerTypeEnum.REGULAR.name());

					customerUlpDao = (CustomerUlpDao) MapperUtil.getDtoMapping(custUlpData, CustomerUlpDao.class);
					customerUlpDao.setIsPulseCustomer(false);

					LoyaltyDetails details = (LoyaltyDetails) MapperUtil.getDtoMapping(custUlpData,
							LoyaltyDetails.class);
					customerUlpDao.setLoyaltyDetails(new JsonData("LOYALTY", details).toString());

					RegularCustomerCreateDto regularCustomerDetails = (RegularCustomerCreateDto) MapperUtil
							.getDtoMapping(custUlpData, RegularCustomerCreateDto.class, "addressLines");
					updateAddressInList(custUlpData.getAddressLines(), regularCustomerDetails);
					regularCustomerDetails.setCanSendSMS(true);
					regularCustomerDetails.setIsHardCopySubmitted(false);
//					regularCustomerDetails.setPincode(custUlpData.getPincode());
//					regularCustomerDetails.setCity(custUlpData.getCity());
//					regularCustomerDetails.setState(custUlpData.getState());

					JsonData jsonData = new JsonData(CustomerTypeEnum.REGULAR.name(), regularCustomerDetails);

					customerDao.setCustomerDetails(MapperUtil.getStringFromJson(jsonData));

					JsonData emailValidationDetails = customerService
							.getEmailValidationDetails(customerDao.getEmailId());
					customerDao.setEmailValidationDetails(MapperUtil.getStringFromJson(emailValidationDetails));

					log.info("new customerdao :- {}", customerDao);
					log.info("new customerUlpDao :- {}", customerUlpDao);

					CustomerDaoExt customerDaoExt = (CustomerDaoExt) MapperUtil.getDtoMapping(customerDao,
							CustomerDaoExt.class);
					customerRepoExt.save(customerDaoExt);
					customerUlpRepo.save(customerUlpDao);
					customerDao = (CustomerDao) MapperUtil.getDtoMapping(customerDaoExt, CustomerDao.class);

					// null as 3rd parameter as new customer so, no document
					return new CustomerEpossSearchDto(customerDao, customerUlpDao, null,customerDocuments);

				}

				customerUlpDao = customerService.getUlpData(customerDao.getUlpId());
				LoyaltyDetails details = (LoyaltyDetails) MapperUtil.getDtoMapping(custUlpData, LoyaltyDetails.class);
				customerUlpDao.setLoyaltyDetails(new JsonData("LOYALTY", details).toString());

				log.info("old customer data    : \n{}", customerDao);
				log.info("old customer details : \n{}", customerDao.getCustomerDetails());
				log.info("old ulp details : \n{}", customerUlpDao);

				customerDao = (CustomerDao) MapperUtil.getObjectMapping(custUlpData, customerDao);
				customerUlpDao = (CustomerUlpDao) MapperUtil.getObjectMapping(custUlpData, customerUlpDao);

				////////////////////// CUSTOMER DETAILS UPDATE/////////////////////////////////
				updateCustomerDetailsFromULP(customerDao, custUlpData);
				////////////////////// CUSTOMER DETAILS UPDATE/////////////////////////////////

				if (customerUlpDao.getIsPulseCustomer() == null)
					customerUlpDao.setIsPulseCustomer(false);

				log.info("old updated customer data    : \n{}", customerDao);
				log.info("old updated customer details : \n{}", customerDao.getCustomerDetails());
				log.info("old updated customer ulp : \n{}", customerUlpDao);

				customerRepo.save(customerDao);
				customerUlpRepo.save(customerUlpDao);

			} else {

				customerDao = getRegularCustomerFromDB(searchInput, customerDao, searchType);

				if (StringUtils.isNotBlank(customerDao.getUlpId()))
					customerUlpDao = customerService.getUlpData(customerDao.getUlpId());

			}

			// return
			custSearchDto = new CustomerEpossSearchDto(customerDao, customerUlpDao, null,customerDocuments);

		} else {

			custSearchDto = getCustomerDataOtherThanRegDummy(searchInput, searchType);

			if (custSearchDto.getCustomer() == null)
				throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070, searchType + " : " + searchInput);

		}

		// Document set
		custSearchDto.setCustomerDocuments(
				customerDocService.getActiveCustomerDocsByCustomerId(custSearchDto.getCustomer().getId()));

		return custSearchDto;
	}

	private CustomerDao getRegularCustomerFromDB(String searchInput, CustomerDao customerDao,
			SearchTypeEnum searchType) {
		if (searchType == SearchTypeEnum.MOBILE_NO)
			customerDao = customerRepo.findOneByMobileNumberAndCustomerType(CryptoUtil.encrypt(searchInput, MOBILE_NO),
					CustomerTypeEnum.REGULAR.name());
		else if (searchType == SearchTypeEnum.ULP_ID)
			customerDao = customerRepo.findOneByUlpIdAndCustomerType(CryptoUtil.encrypt(searchInput, "ULP Id"),
					CustomerTypeEnum.REGULAR.name());
		if (customerDao == null)
			throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070, searchType + " : " + searchInput);
		return customerDao;
	}

	@Override
	public void updateCustomerDetailsFromULP(CustomerDao customerDao, CustomerDto custUlpData) {

		JsonData jsonData = null;
		RegularCustomerCreateDto custDetails = null;
		if (customerDao.getCustomerDetails() != null) {

			jsonData = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(customerDao.getCustomerDetails()), JsonData.class);
			custDetails = MapperUtil.getObjectMapperInstance().convertValue(jsonData.getData(),
					RegularCustomerCreateDto.class);
			custDetails = (RegularCustomerCreateDto) MapperUtil.getObjectMapping(custUlpData, custDetails);
			setDateFieldFromUlp(custUlpData, custDetails);

		} else {

			jsonData = new JsonData();
			jsonData.setType(CustomerTypeEnum.REGULAR.name());

			custDetails = (RegularCustomerCreateDto) MapperUtil.getDtoMapping(custUlpData,
					RegularCustomerCreateDto.class, "addressLines");
			setDateFieldFromUlp(custUlpData, custDetails);
		}
		updateAddressInList(custUlpData.getAddressLines(), custDetails);

		jsonData.setData(custDetails);
		customerDao.setCustomerDetails(MapperUtil.getJsonString(jsonData));
	}

	private void setDateFieldFromUlp(CustomerDto custUlpData, RegularCustomerCreateDto custDetails) {
		if (custUlpData.getBirthday() != null)
			custDetails.setBirthday(CalendarUtils.formatDateToSql(custUlpData.getBirthday()));
		if (custUlpData.getSpouseBirthday() != null)
			custDetails.setSpouseBirthday(CalendarUtils.formatDateToSql(custUlpData.getSpouseBirthday()));
		if (custUlpData.getAnniversary() != null)
			custDetails.setAnniversary(CalendarUtils.formatDateToSql(custUlpData.getAnniversary()));
	}

	private CustomerDto getCustomerFromUlpEncrypt(String searchFieldValue, String searchTypeStr) {

		CustomerDto custUlpData = integrationService.searchLoyaltyCustomer(VendorCodeEnum.ULP_NETCARROTS.name(),
				searchTypeStr, searchFieldValue);

		log.debug("ULP search response: {}", custUlpData);
		// if not exist in ULP
		if (!"0".equals(custUlpData.getResponseCode())) {
			if ("ERR-INT-037".equals(custUlpData.getResponseCode()))
				throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070, searchTypeStr + " : " + searchFieldValue);
			else
				throw new ServiceException(null, custUlpData.getResponseCode(), custUlpData.getResponseMessage());
		}
		// encrypt field which are required to store in DB
		if (StringUtils.isNotBlank(custUlpData.getCustomerName()))
			custUlpData.setCustomerName(encFieldWithNullCheck(custUlpData.getCustomerName()));
		if (StringUtils.isNotBlank(custUlpData.getMobileNumber()))
			custUlpData.setMobileNumber(encFieldWithNullCheck(custUlpData.getMobileNumber()));
		if (StringUtils.isNotBlank(custUlpData.getEmailId()))
			custUlpData.setEmailId(encFieldWithNullCheck(custUlpData.getEmailId()));
		return custUlpData;
	}

	private CustomerDao getRegularCustomerDataFromDB(CustomerDto custUlpData) {
		CustomerDao customerDao;
		// check if the same record exist in EPOSS DB
		// 1st search by ULP id
		customerDao = customerRepo.findOneByUlpIdAndCustomerType(custUlpData.getUlpId(),
				CustomerTypeEnum.REGULAR.name());

		
		// if still null, get by mobile no
		if (customerDao == null) {
			customerDao = customerRepo.findOneByMobileNumberAndCustomerType(
					CryptoUtil.encrypt(custUlpData.getMobileNumber(), MOBILE_NO), CustomerTypeEnum.REGULAR.name());
		}
		
//		//get pincode, city, state values from EncirclecustData as such even if the values are null
//		JsonData encircleJsonData=null;
//		if(customerDao!=null && customerDao.getCustomerDetails()!=null) {
//			encircleJsonData = MapperUtil.mapObjToClass(customerDao.getCustomerDetails(), JsonData.class);
//		}
//		
//		if(customerDao!=null && customerDao.getCustomerType().equals(CustomerTypeEnum.REGULAR.name()))
//		{
//			RegularCustomerCreateDto REGULARAddress = MapperUtil.mapObjToClass(encircleJsonData.getData(), RegularCustomerCreateDto.class);
//			REGULARAddress.setCity(custUlpData.getCity());
//			REGULARAddress.setState(custUlpData.getState());
//			REGULARAddress.setPincode(custUlpData.getPincode());
//			JsonData jsonData = new JsonData(CustomerTypeEnum.REGULAR.name(), REGULARAddress);
//			customerDao.setCustomerDetails(MapperUtil.getStringFromJson(jsonData));
//		}
		
		return customerDao;
	}

	private CustomerEpossSearchDto getCustomerDataOtherThanRegDummy(String searchFieldValue,
			SearchTypeEnum searchType) {
		CustomerEpossSearchDto custSearchDto;
		CustomerDao customerDao;
		log.debug("get record from eposs");

		switch (searchType) {

		case INSTITUTIONAL_TAX_NO:
			customerDao = customerRepo.findOneByInstiTaxNoAndCustomerType(
					CryptoUtil.encrypt(searchFieldValue, "instiTaxNo"), CustomerTypeEnum.INSTITUTIONAL.name());

			break;

		case CUSTOMER_TAX_NO:
			customerDao = customerRepo.findTopByCustTaxNoAndCustomerType(
					CryptoUtil.encrypt(searchFieldValue, "custTaxNo"), CustomerTypeEnum.INSTITUTIONAL.name());
			break;

		case PASSPORT_ID:
			customerDao = customerRepo.findOneByPassportIdAndCustomerType(
					CryptoUtil.encrypt(searchFieldValue, "passportId"), CustomerTypeEnum.INTERNATIONAL.name());
			break;
			
		case CUSTOMER_ID:
			customerDao = customerRepo.getCustomerDaoByCustomerIdAndCustomerType(
					Integer.valueOf(searchFieldValue), CustomerTypeEnum.ONETIME.name(),CommonUtil.getLocationCode());
			break;

		default:
			customerDao = null;
			break;

		}

		custSearchDto = new CustomerEpossSearchDto(customerDao, null,null, null);
		return custSearchDto;
	}

	private void updateAddressInList(List<String> ulpAddr, RegularCustomerCreateDto custDetails) {

		// if ULP don't have any address value, no need to override
		if (CollectionUtil.isEmptyOrEmptyValue(ulpAddr))
			return;

		List<String> dbAddr = custDetails.getAddressLines();

		// if db is not empty
		if (!CollectionUtil.isEmpty(dbAddr)) {

			updateAddressField(custDetails, ulpAddr, dbAddr);
		} else {
			// if empty just override from ulp
			dbAddr = ulpAddr;
		}
		custDetails.setAddressLines(dbAddr);
	}

	private void updateAddressField(RegularCustomerCreateDto custDetails, List<String> ulpAddr, List<String> dbAddr) {

		int lenUlpAddr = ulpAddr.size();
		int lenDbAddr = custDetails.getAddressLines().size();

		int minAddr = Math.min(lenUlpAddr, lenDbAddr);

		for (int i = 0; i < minAddr; i++) {
			if (StringUtils.isNotBlank(ulpAddr.get(i)))
				dbAddr.set(i, ulpAddr.get(i));
		}
		if (lenUlpAddr > minAddr) {
			for (int i = minAddr; i < lenUlpAddr; i++) {
				if (StringUtils.isNotBlank(ulpAddr.get(i)))
					dbAddr.add(ulpAddr.get(i));
			}
		}
	}

	@Override
	public CustomerEpossSearchDto searchCustomer(CustomerEpossSearchDto legacyCustomerDetails, String locationCode) {

		CustomerEpossSearchDto customerDetails = new CustomerEpossSearchDto();
		if (CommonUtil.isEpossApp()) {
			legacyCustomerDetails.setCustomer(customerService.encryptCustomerDao(legacyCustomerDetails.getCustomer()));
			CustomerDao epossCustomer = null;
			if (!StringUtils.isEmpty(legacyCustomerDetails.getCustomer().getMobileNumber())) {
				epossCustomer = customerRepo.findOneByMobileNumberAndCustomerType(
						legacyCustomerDetails.getCustomer().getMobileNumber(), CustomerTypeEnum.REGULAR.name());
			}
			if (epossCustomer == null && !StringUtils.isEmpty(legacyCustomerDetails.getCustomer().getInstiTaxNo())) {
				epossCustomer = customerRepo.findOneByInstiTaxNoAndCustomerType(
						legacyCustomerDetails.getCustomer().getInstiTaxNo(), CustomerTypeEnum.INSTITUTIONAL.name());
			}
			if (epossCustomer == null && !StringUtils.isEmpty(legacyCustomerDetails.getCustomer().getUlpId())) {
				epossCustomer = customerRepo.findOneByUlpIdAndCustomerType(
						legacyCustomerDetails.getCustomer().getUlpId(), CustomerTypeEnum.REGULAR.name());
			}

			if (epossCustomer == null) {
				CustomerDaoExt legacyCustomerExt = (CustomerDaoExt) MapperUtil
						.getDtoMapping(legacyCustomerDetails.getCustomer(), CustomerDaoExt.class);
				legacyCustomerExt = customerRepoExt.save(legacyCustomerExt);
				customerDetails
						.setCustomer((CustomerDao) MapperUtil.getDtoMapping(legacyCustomerExt, CustomerDao.class));
			} else {
				customerDetails.setCustomer(epossCustomer);
			}

			// pull customer location mapping if exists
			// not setting clm in customerDetails directly to avoid cyclic dependency for
			// CustomerDao inside CustomerLocationMappingDao
			CustomerLocationMappingDao clm = customerLocationMappingRepo
					.findOneByCustomerAndCustomerLocationMappingIdLocationCode(customerDetails.getCustomer(),
							locationCode);

			if (clm == null) {
				// if customer location mapping is not found... create
				CustomerLocationMappingIdDao customerLocationMappingId = new CustomerLocationMappingIdDao();
				customerLocationMappingId.setLocationCode(locationCode);
				customerLocationMappingId
						.setCustomerId(customerLocationMappingRepo.getNewCustomerIdForLocationMapping(locationCode));

				clm = new CustomerLocationMappingDao();
				clm.setCustomerLocationMappingId(customerLocationMappingId);
				clm.setCustomer(customerDetails.getCustomer());
				clm = customerLocationMappingRepo.save(clm);
			}
			customerDetails.setCustomerId(clm.getCustomerLocationMappingId().getCustomerId());
			customerDetails.setLocationCode(locationCode);
			customerDetails.setCustomerLocationSrcSyncId(clm.getSrcSyncId());
			customerDetails.setCustomerLocationDestSyncId(clm.getDestSyncId());

			if (legacyCustomerDetails.getCustomerUlp() != null) {
				Optional<CustomerUlpDao> epossCustomerUlp = customerUlpRepo
						.findById(legacyCustomerDetails.getCustomerUlp().getUlpId());

				epossCustomerUlp.ifPresentOrElse(
						customerUlp -> customerUlpRepo.save((CustomerUlpDao) MapperUtil
								.getObjectMapping(legacyCustomerDetails.getCustomerUlp(), customerUlp)),
						() -> customerUlpRepo.save(legacyCustomerDetails.getCustomerUlp()));
				customerDetails.setCustomerUlp(legacyCustomerDetails.getCustomerUlp());
			} else {
				Optional<CustomerUlpDao> epossCustomerUlpExisting = customerUlpRepo
						.findById(legacyCustomerDetails.getCustomer().getUlpId());
				if (epossCustomerUlpExisting.isPresent()) {
					customerDetails.setCustomerUlp(epossCustomerUlpExisting.get());
				}
			}
		} else {

			customerDetails = epossCallService.callEposs(HttpMethod.PATCH,
					SalesUtil.SALES_BASE_SERVICE_URL + "/customers/eposs/search", Map.of("locationCode", locationCode),
					legacyCustomerDetails, CustomerEpossSearchDto.class);

			// reverse src and dest sync id
			Integer temp = customerDetails.getCustomer().getSrcSyncId();
			customerDetails.getCustomer().setSrcSyncId(customerDetails.getCustomer().getDestSyncId());
			customerDetails.getCustomer().setDestSyncId(temp);

			if (legacyCustomerDetails.getCustomerUlp() != null) {
				Integer tempUlp = customerDetails.getCustomerUlp().getSrcSyncId();
				customerDetails.getCustomerUlp().setSrcSyncId(customerDetails.getCustomerUlp().getDestSyncId());
				customerDetails.getCustomerUlp().setDestSyncId(tempUlp);
			}

			if (legacyCustomerDetails.getCustomerId() != null) {
				Integer tempUlp = customerDetails.getCustomerLocationSrcSyncId();
				customerDetails.setCustomerLocationSrcSyncId(customerDetails.getCustomerLocationDestSyncId());
				customerDetails.setCustomerLocationDestSyncId(tempUlp);
			}

			// Save this data
			saveCustomerAndUlpAndClm(customerDetails.getCustomer(), customerDetails.getCustomerUlp(), customerDetails);
		}

		return customerDetails;
	}

	private void saveCustomerAndUlpAndClm(CustomerDao customer, CustomerUlpDao customerUlp,
			CustomerEpossSearchDto customerDetails) {

		customerRepo.save(customer);
		updateUlpBasedOnEpossResponse(customerUlp);
		updateClmBasedOnEpossResponse(customerDetails);

	}

	private void updateUlpBasedOnEpossResponse(CustomerUlpDao customerUlp) {
		if (customerUlp != null) {

			Optional<CustomerUlpDao> customerUlps = customerUlpRepo.findById(customerUlp.getUlpId());

			if (!customerUlps.isPresent()) {
				customerUlpRepo.save(customerUlp);
				log.info("\n\nULP not There in POSS. Final ULP Data: {}", customerUlp);
			} else {

				customerUlpRepo.updateUlp(customerUlp.getPointBalance(), customerUlp.getCurrentTier(),
						customerUlp.getEnrollmentDate(), customerUlp.getIsMemberBlocked(),
						customerUlp.getIsPulseCustomer(), customerUlp.getLoyaltyDetails(), CommonUtil.getUserName(),
						CalendarUtils.getCurrentDate(), customerUlp.getUlpId());

			}
		}
	}

	private void updateClmBasedOnEpossResponse(CustomerEpossSearchDto customerDetails) {
		if (customerDetails.getCustomerId() == null) {
			return;
		}

		CustomerLocationMappingDao clm = customerLocationMappingRepo
				.findOneByCustomerAndCustomerLocationMappingIdLocationCode(customerDetails.getCustomer(),
						customerDetails.getLocationCode());

		if (clm == null) {
			clm = new CustomerLocationMappingDao();
			clm.setCustomer(customerDetails.getCustomer());
			CustomerLocationMappingIdDao mappingId = new CustomerLocationMappingIdDao();
			mappingId.setCustomerId(customerDetails.getCustomerId());
			mappingId.setLocationCode(customerDetails.getLocationCode());
			clm.setCustomerLocationMappingId(mappingId);

		}

		clm.setSrcSyncId(customerDetails.getCustomerLocationSrcSyncId());
		clm.setDestSyncId(customerDetails.getCustomerLocationDestSyncId());
		customerLocationMappingRepo.save(clm);

	}

}
