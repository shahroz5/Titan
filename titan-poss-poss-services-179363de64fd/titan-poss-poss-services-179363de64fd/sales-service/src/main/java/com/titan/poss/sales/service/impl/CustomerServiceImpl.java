/*   Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.domain.constant.enums.IdproofTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.constant.enums.VerificationTypeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.BrandConfigDetails;
import com.titan.poss.core.dto.BrandCustomerDetails;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.CreditNoteRequestDto;
import com.titan.poss.core.dto.CustomerDetails;
import com.titan.poss.core.dto.CustomerDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.KeyValueDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.LoyaltyDetails;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.PanAndForm60ResponseDto;
import com.titan.poss.core.dto.PanDocDetailsResponseDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.UlpBaseResponseDto;
import com.titan.poss.core.dto.VendorDto;
import com.titan.poss.core.enums.PanDocVerificationEnum;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.core.enums.VendorTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.service.clients.StoreServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerDaoExt;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.CustomerUlpDao;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.AddressDetails;
import com.titan.poss.sales.dto.CustomerEpossListSearchDto;
import com.titan.poss.sales.dto.CustomerEpossSearchDto;
import com.titan.poss.sales.dto.CustomerLocationMappingSyncDto;
import com.titan.poss.sales.dto.CustomerSyncDtoExt;
import com.titan.poss.sales.dto.CustomerUlpSyncDto;
import com.titan.poss.sales.dto.EmailValidationDetails;
import com.titan.poss.sales.dto.InternationalCustomerCreateDto;
import com.titan.poss.sales.dto.OneTimeCustomerDto;
import com.titan.poss.sales.dto.RegularCustomerCreateDto;
import com.titan.poss.sales.dto.constants.CustNonUniqSearchTypeEnum;
import com.titan.poss.sales.dto.constants.LovTypeEnum;
import com.titan.poss.sales.dto.request.CustomerAddDto;
import com.titan.poss.sales.dto.request.CustomerPanDetails;
import com.titan.poss.sales.dto.request.CustomerUpdateDto;
import com.titan.poss.sales.dto.request.InstitutionalCustomerUpdateDto;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.dto.response.CustomerResDto;
import com.titan.poss.sales.dto.response.CustomerSearchDto;
import com.titan.poss.sales.dto.response.EmailValidationResponseDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.repository.CashMemoRepository;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.CustomerRepository;
import com.titan.poss.sales.repository.CustomerRepositoryExt;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.CustomerUlpRepositoryExt;
import com.titan.poss.sales.repository.OrderRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.CustomerEpossService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.LocationService;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;
/*import com.titan.poss.store.dao.CatchmentDao;
import com.titan.poss.store.dao.CatchmentId;
import com.titan.poss.store.dto.request.CatchmentAddDto;
import com.titan.poss.store.dto.response.CatchmentDto;*/

import feign.Response;
import lombok.extern.slf4j.Slf4j;

/**
 * Service class for Customer.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("customerService")
public class CustomerServiceImpl implements CustomerService {

	private static final String CUSTOMER_EPOSS_API_URL = SalesUtil.CUST_SERVICE_URL + "/eposs";

	private static final String CUSTOMER = "CUSTOMER-";

	private static final String MOBILE_NO = "MOBILE_NO";


	private static final String SEARCH_FIELD = "searchField";
	private static final String SEARCH_TYPE = "searchType";

	private static final String ERR_SALE_014 = "ERR-SALE-014";
	private static final String INVALID_ID_PROOF = "Invalid Id Proof.";

	private static final String ERR_SALE_048 = "ERR-SALE-048";
	private static final String INVALID_INPUTS = "Invalid inputs.";

	private static final String ERR_SALE_070 = "ERR-SALE-070";
	private static final String RECORD_NOT_FOUND = "Record not found.";

	private static final String ERR_INT_025 = "ERR-INT-025";
	private static final String CALL_TO_EPOSS_FAILED = "Call to EPOSS Failed";

	private static final String ERR_SALE_071 = "ERR-SALE-071";
	private static final String PROVIDED_MOBILE_NO_IS_ALREADY_IN_USE = "Provided mobile no. is already in use.";

	private static final String ERR_SALE_072 = "ERR-SALE-072";
	private static final String PROVIDED_MOBILE_OR_ULP_IS_ALREADY_IN_USE = "Provided mobile no or ULP id is already in use.";

	private static final String ERR_SALE_073 = "ERR-SALE-073";
	private static final String INVALID_TITLE = "Invalid title.";

	private static final String ERR_SALE_074 = "ERR-SALE-074";
	private static final String PROVIDED_INSTIT_OR_CUST_TAX_NUMBER_IS_ALREADY_IN_USE = "Provided institutional/customer tax number is already in use.";

	private static final String ERR_CORE_013 = "ERR-CORE-013";
	private static final String JSON_DATA_FORMAT_ERROR = "JSON data format error";
	
	private static final String ERR_CORE_057 = "ERR-CORE-057";
	private static final String PLEASE_CHECK_MANDATORY_CUSTOMER_INFORMATIONS_BASED_ON_LOCATION_CONFIGURATION = "Please Check Mandatory Customer Informations based on Location Configuration";

	private static final String ERR_CORE_014 = "ERR-CORE-014";
	private static final String JSON_TYPE_MISMATCH_JSON_TYPE = "JSON type mismatch. JSON type : ";

	public static final String ERR_SALE_129 = "ERR-SALE-129";
	public static final String CUSTOMER_NOT_FOUND = "Customer record not found";

	private static final String CUSTOMER_NOT_FOUND_ERR_CODE = ERR_SALE_070;

	private static final String ERR_INT_037 = "ERR-INT-037";

	private static final String CUST_TAX_NO = "custTaxNo";
    private static final String CUST_TAX_NO_OLD = "custTaxNoOld";

	private static final String INSTI_TAX_NO = "instiTaxNo";
	private static final String MOBILE = "mobileNo";
	private static final String EMAIL = "emailId";
	private static final String PASSPORT_ID = "passportId";
	private static final String CUSTOMER_NAME = "customerName";

	private static final String ERR_INT_040 = "ERR-INT-040";
	private static final String MANDATORY_FIELD = "Mandatory field. ";

	private static final String ERR_SALE_0104 = "ERR-INT-0104";
	private static final String INVALID_ID_PROOF_TYPE = "Invalid id proof type. ";
	private static final String ERR_INT_038 = "ERR-INT-038";
	private static final String INVALID_PAN = "Provide valid pancard number";
	private static final String ERR_INT_039 = "ERR-INT-039";
	private static final String SUBMIT_HARDCOPY = "Provide valid pancard number";
	private static final String ERR_INT_041 = "ERR-INT-041";
	private static final String CASH_MEMO_NOT_FOUND = "Cashmemo record not found";
	private static final String ERR_INT_0100 = "ERR-INT-0100";
	private static final String ID_MANDATORY_FIELD = "CM id or AB id not found";
	private static final String ERR_SALE_0101 = "ERR-SALE-0101";
	private static final String CUSTOMER_ID_MANDATORY_FIELD = "Customer id not found";
	private static final String ERR_SALE_0102 = "ERR-SALE-0102";
	private static final String TXN_TYPE_MANDATORY_FIELD = "txn type not found";
	private static final String ERR_SALE_0103 = "ERR-SALE-0103";
	private static final String TXN_ID_NOT_FOUND = "txn id not found";

	@Autowired
	private CustomerRepository customerRepo;

	@Autowired
	private CustomerRepositoryExt customerRepoExt;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationMappingRepo;

	@Autowired
	private CustomerUlpRepositoryExt customerUlpRepo;

	@Autowired
	private EngineService engineService;

	@Autowired
	private IntegrationService intgService;

	@Autowired
	private CustomerEpossService customerEpossService;

	@Autowired
	private CustomerServiceImpl customerServiceImp;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private SalesSyncStagingRepository salesSyncStagingRepository;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private LocationService locationService;

	@Autowired
	private StoreServiceClient storeService;

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Autowired
	CashMemoRepository cashMemoRepository;

	@Autowired
	private OrderRepositoryExt orderRepository;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	@Autowired
	private CustomerTxnRepositoryExt customerTxnRepositoryExt;

	@Value("${app.name}")
	private String appName;

	@Override
	@SuppressWarnings("unchecked")
	public ListResponse<CustomerEpossListSearchDto> searchCustomerList(String searchField, String searchType) {

		Map<String, String> requestParams = new HashMap<>();
		requestParams.put(SEARCH_FIELD, searchField);
		requestParams.put(SEARCH_TYPE, searchType);

		ApiResponseDto epossResponse = intgService.callEpossAPI(HttpMethod.GET, CUSTOMER_EPOSS_API_URL + "/list",
				requestParams, null);

		if (epossResponse.getHttpResponseCode() != HttpStatus.OK.value())
			throw new ServiceException(CALL_TO_EPOSS_FAILED, ERR_INT_025, epossResponse.getResponse());

		return MapperUtil.getObjectMapperInstance().convertValue(epossResponse.getResponse(), ListResponse.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public ListResponse<CustomerEpossListSearchDto> searchCustomerListWithFallBack(String searchField,
			String searchType) {

		log.debug("Searching customer in POSS, type: {}, value: {}", searchType, searchField);

		CustNonUniqSearchTypeEnum nonUniqueSearchType = CustNonUniqSearchTypeEnum.valueOf(searchType);

		if (nonUniqueSearchType == CustNonUniqSearchTypeEnum.NAME)
			searchField = searchField.toUpperCase();
		else if (nonUniqueSearchType == CustNonUniqSearchTypeEnum.EMAIL_ID)
			searchField = searchField.toLowerCase();

		Map<String, String> requestParams = new HashMap<>();
		requestParams.put(SEARCH_FIELD, searchField);
		requestParams.put(SEARCH_TYPE, searchType);
		// pageable page, size, sort (if added in future)

		int epossHTTPStatus = 0;

		Response response = intgService.callEpossAPIWoError(HttpMethod.GET, CUSTOMER_EPOSS_API_URL + "/list",
				requestParams, null);

		epossHTTPStatus = response.status();

		JsonNode jsonNode = convertToJsonNode(response);

		// Successful EPOSS API call (200 as per HTTP client)
		ApiResponseDto epossResponse = new ApiResponseDto();
		epossResponse = mapJsonNodeToEpossAPIResponse(epossHTTPStatus, jsonNode, epossResponse);

		epossHTTPStatus = getHttpStatusFromJsonNodeResponse(jsonNode);

		ListResponse<CustomerEpossListSearchDto> resultList = null;

		if (epossHTTPStatus == HttpStatus.OK.value()) {
			resultList = MapperUtil.getObjectMapperInstance().convertValue(epossResponse.getResponse(),
					ListResponse.class);
		} else {
			resultList = customerEpossService.searchCustomerList(searchField, searchType);
		}

		return resultList;
	}

	/**
	 * This method checks if customer exists in the store based on customerId.
	 * 
	 * @return CustomerLocationMapping
	 */
	@Override
	public CustomerLocationMappingDao checkIfCustomerExists(Integer customerId, String locationCode) {

		Optional<CustomerLocationMappingDao> customerLocationMapping = customerLocationMappingRepo
				.findById(new CustomerLocationMappingIdDao(customerId, locationCode));

		if (!customerLocationMapping.isPresent()) {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST + "Customer details not found. Id: " + customerId
							+ ", locationCode: " + locationCode,
					SalesConstants.ERR_SALE_294, Map.of(SalesConstants.REMARKS,
							"Customer details not found. Id: " + customerId + ", locationCode: " + locationCode));
		}

		return customerLocationMapping.get();
	}

	@Override
	public JsonData getEmailValidationDetails(String email) {

		if (StringUtils.isBlank(email))
			return null;

		EmailValidationDetails emailValidation = new EmailValidationDetails();
		emailValidation.setValidationTime(CalendarUtils.getCurrentDate());

		VendorDto vendor = getVendorByType(VendorTypeEnum.EMAIL_VALIDATION);
		// if vendor not available, return
		if (vendor == null) {
			log.error("Vendor Details not available for email validation. Vendor name: {}",
					VendorTypeEnum.EMAIL_VALIDATION);
			return null;
		}

		StringBuilder url = new StringBuilder();
		HttpMethod httpMethod = HttpMethod.GET;

		if (vendor.getBaseurl() != null)
			url.append(vendor.getBaseurl());
		if (!StringUtil.isBlankJsonData(vendor.getVendorDetails())) {
			JsonData vendorJsonData = MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class);
			String vendorRelativeUrl = JsonUtils.getValueFromJsonString(vendorJsonData.getData(), "relativeUrl");
			String vendorHttpMethod = JsonUtils.getValueFromJsonString(vendorJsonData.getData(), "httpMethod");

			if (vendorRelativeUrl != null)
				url.append("/").append(vendorRelativeUrl);
			if (vendorHttpMethod != null)
				httpMethod = HttpMethod.valueOf(vendorHttpMethod);
		}
		url.append("/").append(email);

		log.debug("API to validate email: " + httpMethod + " : " + url);
		Response response = intgService.runThirdPartyAPI(httpMethod, url.toString(), null, null);

		int epossHTTPStatus = response.status();

		if (epossHTTPStatus == HttpStatus.OK.value()) {

			JsonNode jsonNode = convertToJsonNode(response);
			epossHTTPStatus = getHttpStatusFromJsonNodeResponse(jsonNode);

			if (epossHTTPStatus == HttpStatus.OK.value()) {

				// Successful EPOSS API call (200 as per HTTP client)
				ApiResponseDto apiResponse = new ApiResponseDto();
				apiResponse = mapJsonNodeToEpossAPIResponse(epossHTTPStatus, jsonNode, apiResponse);

				emailValidation.setApiResponse(apiResponse.getResponse());

			} else {
				log.debug("Email validation for {}\nResponse: {}", email, jsonNode);
			}
		} else {
			log.debug("Email validation for {}\nResponse: {}", email, response);
		}

		JsonData jsonData = new JsonData("EMAIL_VALIDATION", null);
		jsonData.setData(emailValidation);
		return jsonData;

	}

	private VendorDto getVendorByType(VendorTypeEnum vendorType) {
		VendorDto vendor = null;
		try {
			vendor = intgService.getVendorByType(vendorType.name());
		} catch (Exception e) {
			log.error("Vendor details not able to fetch while doing email validation.", e);
		}
		return vendor;
	}

	private PublishResponse createOfflineRegularCustomer(CustomerAddDto addCustomerDto) {

		log.info("Inside createOfflineRegularCustomer()................");
		CustomerDao customerDao;

		customerDao = customerRepo.findOneByMobileNumberAndCustomerType(addCustomerDto.getMobileNumber(),
				CustomerTypeEnum.REGULAR.name());
		// if no record search encrypted
		if (customerDao == null)
			customerDao = customerRepo.findOneByMobileNumberAndCustomerType(
					CryptoUtil.encrypt(addCustomerDto.getMobileNumber(), MOBILE_NO), CustomerTypeEnum.REGULAR.name());
		// if no record search if by ULP id if exist
		if (customerDao == null)
			customerDao = customerRepo.findOneByUlpIdAndCustomerType(addCustomerDto.getUlpId(),
					CustomerTypeEnum.REGULAR.name());
		if (customerDao != null) {
			throw new ServiceException(PROVIDED_MOBILE_OR_ULP_IS_ALREADY_IN_USE, ERR_SALE_072);
		}

		// new customer
		customerDao = (CustomerDao) MapperUtil.getDtoMapping(addCustomerDto, CustomerDao.class);//iscustTaxverified is getting set here
		customerDao.setIsEncrypted(true);
		// CREATE ULP record when Internet is available again

		if (StringUtils.isNotBlank(addCustomerDto.getCustomerName()))
			customerDao.setCustomerName(encFieldWithNullCheck(addCustomerDto.getCustomerName()));
		if (StringUtils.isNotBlank(addCustomerDto.getEmailId()))
			customerDao.setEmailId(encFieldWithNullCheck(addCustomerDto.getEmailId()));
		if (StringUtils.isNotBlank(addCustomerDto.getMobileNumber()))
			customerDao.setMobileNumber(encFieldWithNullCheck(addCustomerDto.getMobileNumber()));
		if (StringUtils.isNotBlank(addCustomerDto.getCustTaxNo()))
			customerDao.setCustTaxNo(encFieldWithNullCheck(addCustomerDto.getCustTaxNo()));
		if (StringUtils.isNotBlank(addCustomerDto.getInstiTaxNo()))
			customerDao.setInstiTaxNo(encFieldWithNullCheck(addCustomerDto.getInstiTaxNo()));

		customerDao.setCustomerDetails(MapperUtil.getStringFromJson(addCustomerDto.getCustomerDetails()));

		customerDao = saveCustomerBasedOnUUIDAvailability(customerDao);
		CustomerResDto customerResDto = new CustomerResDto();
		
		//Offline Boutique CustomerULP update
		CustomerUlpDao customerUlpDao = new CustomerUlpDao();
		customerUlpDao.setUlpId(addCustomerDto.getUlpId());
		customerUlpDao.setPointBalance(BigDecimal.ZERO);
		customerUlpDao.setIsMemberBlocked(Boolean.FALSE);
		customerUlpDao.setIsPulseCustomer(Boolean.FALSE);
		customerUlpDao.setEnrollmentDate(CalendarUtils.getCurrentDate());
		LoyaltyDetails loyaltyDetails = new LoyaltyDetails();
		JsonData jsonData = MapperUtil.mapObjToClass(customerDao.getCustomerDetails(), JsonData.class);
		loyaltyDetails.setAnniversary( JsonUtils.getValueFromJson(jsonData.getData(), "anniversary", Date.class));
		loyaltyDetails.setBirthday(JsonUtils.getValueFromJson(jsonData.getData(), "birthday", Date.class));
		loyaltyDetails.setSpouseBirthday(JsonUtils.getValueFromJson(jsonData.getData(), "spouseBirthday", Date.class));
		JsonData json = new JsonData();
		json.setType("LOYALTY");
		json.setData(loyaltyDetails);
		customerUlpDao.setLoyaltyDetails(MapperUtil.getJsonString(json));
		//set loyality details pending
		return customerServiceImp.saveCustomerAndMap(customerResDto, customerDao, customerUlpDao,
				CustomerServiceImpl.CUSTOMER + CustomerTypeEnum.REGULAR.name());
	}

	private void mapToCreateResponse(CustomerDao customerDao, CustomerResDto customerResDto) {

		customerResDto = (CustomerResDto) MapperUtil.getObjectMapping(customerDao, customerResDto);
		customerResDto.setCustomerDetails(JsonUtils.convertStrToJsonData(customerDao.getCustomerDetails()));
		customerResDto
				.setEmailValidationDetails(JsonUtils.convertStrToJsonData(customerDao.getEmailValidationDetails()));

		customerResDto.setCustomerName(decryptString(customerResDto.getCustomerName()));
		customerResDto.setEmailId(decryptString(customerResDto.getEmailId()));
		customerResDto.setMobileNumber(decryptString(customerResDto.getMobileNumber()));
		customerResDto.setCustTaxNo(decryptString(customerResDto.getCustTaxNo()));
		customerResDto.setInstiTaxNo(decryptString(customerResDto.getInstiTaxNo()));
		customerResDto.setPassportId(decryptString(customerResDto.getPassportId()));

		log.debug("\n\nfinal o/p:\n\n{}", customerResDto);
	}

	private void checkFieldLevelValidation(CustomerAddDto addCustomerDto) {

		CustomerTypeEnum customerType = CustomerTypeEnum.valueOf(addCustomerDto.getCustomerType());
		log.debug("check validation of customer type: {}", customerType);

		Map<String, String> messages = new HashMap<>();

		if (customerType != CustomerTypeEnum.INTERNATIONAL) {

			if (StringUtils.isNotBlank(addCustomerDto.getMobileNumber())) {
				if (!Pattern.matches(RegExConstants.NOT_SAME_CHAR_ACROSS, addCustomerDto.getMobileNumber()))
					messages.put("mobilenumber", "All the characters should not be same.");
				if (!Pattern.matches(RegExConstants.MOBILE_REGEX, addCustomerDto.getMobileNumber()))
					messages.put("mobileNumber",
							"Invalid mobile number. Regular expression: " + RegExConstants.MOBILE_REGEX);
			}
			if (customerType == CustomerTypeEnum.INSTITUTIONAL) {
				if (!Pattern.matches(RegExConstants.INSTI_NAME_REGEX, addCustomerDto.getCustomerName())) {
					messages.put("customerName",
							"Invalid name. Regular expression: " + RegExConstants.INSTI_NAME_REGEX);
				}
			} else {
				if (!Pattern.matches(RegExConstants.NAME_REGEX, addCustomerDto.getCustomerName()))
					messages.put("customerName", "Invalid name. Regular expression: " + RegExConstants.NAME_REGEX);
			}
			JsonData jsonDataAddr = addCustomerDto.getCustomerDetails();
			AddressDetails address = MapperUtil.mapObjToClass(jsonDataAddr.getData(), AddressDetails.class);
			if (StringUtils.isNotBlank(address.getPincode())
					&& !Pattern.matches(RegExConstants.PIN_CODE_REGEX, address.getPincode()))
				messages.put("pincode", "Invalid pincode. Regular expression: " + RegExConstants.PIN_CODE_REGEX);
		} else {
			if (!Pattern.matches(RegExConstants.NAME_REGEX, addCustomerDto.getCustomerName()))
				messages.put("customerName", "Invalid name. Regular expression: " + RegExConstants.NAME_REGEX);
		}

		if (!messages.isEmpty()) {

			Set<String> defaulterFieldNames = messages.keySet().stream().map(StringUtil::changeCaseToReadableFormat)
					.collect(Collectors.toSet());

			throw new ServiceException("Request is not valid", "ERR-CORE-001", messages,
					Map.of("FIELD_NAMES", Arrays.toString(defaulterFieldNames.toArray())));

		}
		JsonData customerDetailsJson = addCustomerDto.getCustomerDetails();
		String catchmentName = JsonUtils.getValueFromJsonString(customerDetailsJson.getData(), "catchmentName");

		if (catchmentName != null) {
			storeService.saveCatchmentDescription(catchmentName);
		}

		// mandatory field check by location
		locationWiseFieldValidation(addCustomerDto, customerType);

		// mobile no prefix check
		brandWiseFieldValidation(addCustomerDto, customerType);

	}

	private void brandWiseFieldValidation(CustomerAddDto addCustomerDto, CustomerTypeEnum customerType) {

		String mobNo = addCustomerDto.getMobileNumber();
		// in brand we check mobile prefix, if blank no need to check
		if (StringUtils.isBlank(mobNo))
			return;

		BrandDto brandDto = engineService.getBrand();
		JsonData customerJd = brandDto.getCustomerDetails();

		// if customer field is blank, don't consider checking mandatory
		if (StringUtil.isBlankJsonData(customerJd)) {
			log.info("No brand customerDetails configured. Hence, not checking any constraint.");
			return;
		}

		BrandCustomerDetails cd = MapperUtil.mapObjToClass(customerJd.getData(), BrandCustomerDetails.class);

		JsonData configDetails = brandDto.getConfigDetails();
		BrandConfigDetails configDetailsDto = MapperUtil.mapObjToClass(configDetails.getData(),
				BrandConfigDetails.class);
		String refusedMobileNumber = "";
		if (configDetailsDto != null && configDetailsDto.getRefusedMobileNumber() != null) {
			refusedMobileNumber = configDetailsDto.getRefusedMobileNumber();
		}

		List<Integer> startsWith = new ArrayList<>();

		if (customerType == CustomerTypeEnum.REGULAR) {
			startsWith = cd.getRegularMobileNoStartsWith();
		} else if (customerType == CustomerTypeEnum.INTERNATIONAL) {
			startsWith = cd.getInternationalMobileNoStartsWith();
		} else if (customerType == CustomerTypeEnum.INSTITUTIONAL) {
			startsWith = cd.getInstitutionalMobileNoStartsWith();
		} else if (customerType == CustomerTypeEnum.ONETIME) {
			startsWith = cd.getOneTimeMobileNoStartsWith();
		}

		if (CollectionUtil.isNotEmpty(startsWith)) {

			List<String> startsWithStr = CollectionUtil.convertListIntegerToListStr(startsWith);

			boolean isValid = false;
			for (String prefix : startsWithStr) {
				if (mobNo.startsWith(prefix)) {
					isValid = true;
					break;
				}
			}

			if (!isValid) {
				throw new ServiceException(JSON_DATA_FORMAT_ERROR, ERR_CORE_013,
						Map.of(MOBILE, "Invalid Mobile Number. Allowed start series: " + startsWithStr));

			}

			else if (!addCustomerDto.getMobileNumber().equals(refusedMobileNumber)) {


				boolean isUniqueCheck = (customerRepo.findOneByMobileNumberAndCustomerType(
						CryptoUtil.encrypt(addCustomerDto.getMobileNumber(), MOBILE), "ONETIME") == null);
				if (!isUniqueCheck) {
					throw new ServiceException(PROVIDED_MOBILE_NO_IS_ALREADY_IN_USE, ERR_SALE_071);
				}
			}
		}
	}

	private void locationWiseFieldValidation(CustomerAddDto addCustomerDto, CustomerTypeEnum customerType) {

		boolean isEmailBlank = StringUtils.isBlank(addCustomerDto.getEmailId());
		boolean isMobileBlank = StringUtils.isBlank(addCustomerDto.getMobileNumber());

		if (isEmailBlank || isMobileBlank)
			locationWiseFieldValidationCommon(customerType, isEmailBlank, isMobileBlank);
	}

	private void locationWiseFieldValidationCommon(CustomerTypeEnum customerType, boolean isEmailBlank,
			boolean isMobileBlank) {

		LocationCacheDto locationCacheDto = locationService.getLocationDetails(CommonUtil.getLocationCode());
		CustomerDetails customerDetails = locationCacheDto.getCustomerDetails();
		Map<String, String> messages = new HashMap<>();

		if (customerType == CustomerTypeEnum.REGULAR) {
			regularCustContactCheck(messages, customerDetails, isEmailBlank);
		} else if (customerType == CustomerTypeEnum.INTERNATIONAL) {
			internationalCustContactCheck(messages, customerDetails, isEmailBlank, isMobileBlank);
		} else if (customerType == CustomerTypeEnum.INSTITUTIONAL) {
			instiCustContactCheck(messages, customerDetails, isEmailBlank, isMobileBlank);
		} else if (customerType == CustomerTypeEnum.ONETIME) {
			oneTimeCustContactCheck(messages, customerDetails, isEmailBlank, isMobileBlank);
		}

		if (!messages.isEmpty()) {
			throw new ServiceException(PLEASE_CHECK_MANDATORY_CUSTOMER_INFORMATIONS_BASED_ON_LOCATION_CONFIGURATION, ERR_CORE_057, messages);
		}
	}

	// @formatter:off
	private void regularCustContactCheck(Map<String, String> messages, CustomerDetails cd, boolean isEmailBlank) {
		if (BooleanUtils.isTrue(cd.getIsEmailForEncircleCustomer()) && isEmailBlank)
			messages.put(EMAIL, MANDATORY_FIELD + "isEmailForEncircleCustomer?: " + cd.getIsEmailForEncircleCustomer());
	}

	private void oneTimeCustContactCheck(Map<String, String> messages, CustomerDetails cd, boolean isEmailBlank,
			boolean isMobileBlank) {
		if (BooleanUtils.isTrue(cd.getIsEmailForOneTimeCustomer()) && isEmailBlank)
			messages.put(EMAIL, MANDATORY_FIELD + "isEmailForOneTimeCustomer?: " + cd.getIsEmailForOneTimeCustomer());
		/*
		 * if (BooleanUtils.isTrue(cd.getIsMobileNoForOneTimeCustomer()) &&
		 * isMobileBlank) messages.put(EMAIL, MANDATORY_FIELD +
		 * "isMobileNoForOneTimeCustomer?: " + cd.getIsMobileNoForOneTimeCustomer());
		 */
	}

	private void instiCustContactCheck(Map<String, String> messages, CustomerDetails cd, boolean isEmailBlank,
			boolean isMobileBlank) {
		if (BooleanUtils.isTrue(cd.getIsEmailForInstitutionalCustomer()) && isEmailBlank)
			messages.put(EMAIL,
					MANDATORY_FIELD + "isEmailForInstitutionalCustomer?: " + cd.getIsEmailForInstitutionalCustomer());
		if (BooleanUtils.isTrue(cd.getIsMobileNoForInstitutionalCustomer()) && isMobileBlank)
			messages.put(EMAIL, MANDATORY_FIELD + "isMobileNoForInstitutionalCustomer?: "
					+ cd.getIsMobileNoForInstitutionalCustomer());
	}

	private void internationalCustContactCheck(Map<String, String> messages, CustomerDetails cd, boolean isEmailBlank,
			boolean isMobileBlank) {
		if (BooleanUtils.isTrue(cd.getIsEmailForInternationalCustomer()) && isEmailBlank)
			messages.put(EMAIL,
					MANDATORY_FIELD + "isEmailForInternationalCustomer?: " + cd.getIsEmailForInternationalCustomer());
		if (BooleanUtils.isTrue(cd.getIsMobileNoForInternationalCustomer()) && isMobileBlank)
			messages.put(EMAIL, MANDATORY_FIELD + "isMobileNoForInternationalCustomer?: "
					+ cd.getIsMobileNoForInternationalCustomer());
	}
	// @formatter:on

	@Transactional
	public PublishResponse createCustomerTransactional(CustomerAddDto addCustomerDto) {

		checkFieldLevelValidation(addCustomerDto);

		casingCustomerCreationField(addCustomerDto);

		validateAndEncryptJson(addCustomerDto.getCustomerType(), addCustomerDto.getCustomerDetails());

		checkIfValidLOVValue(addCustomerDto.getTitle(), LovTypeEnum.SALUTATION);

		//checkCustomerUniqueFieldCustomerCreation(addCustomerDto);

//		Offline Loyalty
		if (addCustomerDto.getCustomerType().equals(CustomerTypeEnum.REGULAR.name())
				&& StringUtils.isNotBlank(addCustomerDto.getUlpId())) {
			return createOfflineRegularCustomer(addCustomerDto);
		}

//		CustomerAddDto unencryptedAddCustomerDto = addCustomerDto; // shallow copy
		Gson gson = new Gson();
		CustomerAddDto unencryptedAddCustomerDto = gson.fromJson(gson.toJson(addCustomerDto), CustomerAddDto.class);

		CustomerTypeEnum customerType = CustomerTypeEnum.valueOf(addCustomerDto.getCustomerType());

		CustomerEpossSearchDto custDBData = new CustomerEpossSearchDto();
		CustomerDto customerUlpResonseDto = new CustomerDto();

		int epossHTTPStatus = 0;
		String serviceExErrCode = null;

		// if (customerType != CustomerTypeEnum.ONETIME) {

		String searchInput = null;
		SearchTypeEnum searchType = null;
		switch (customerType) {

		case REGULAR:
			searchInput = addCustomerDto.getMobileNumber();
			searchType = SearchTypeEnum.MOBILE_NO;
			break;

		case INTERNATIONAL:
			searchInput = addCustomerDto.getPassportId();
			searchType = SearchTypeEnum.PASSPORT_ID;
			break;

		case INSTITUTIONAL:

			if (null!=addCustomerDto.getIsInstiTaxNoVerified() && addCustomerDto.getIsInstiTaxNoVerified() && addCustomerDto.getInstiTaxNo() != null) {
				searchInput = addCustomerDto.getInstiTaxNo();
				searchType = SearchTypeEnum.INSTITUTIONAL_TAX_NO;
			}
			break;

		default:
			break;
		}

		if (searchInput != null) {
			Response response = callEPOSSSearchAPI(searchInput, searchType, true);

			epossHTTPStatus = response.status();

			JsonNode jsonNode = convertToJsonNode(response);

			ApiResponseDto epossApiResponseDto = new ApiResponseDto();
			// Successful EPOSS API call (200 as per HTTP client)
			epossApiResponseDto = mapJsonNodeToEpossAPIResponse(epossHTTPStatus, jsonNode, epossApiResponseDto);

			epossHTTPStatus = getHttpStatusFromJsonNodeResponse(jsonNode);
			
			if (epossHTTPStatus == HttpStatus.OK.value()) {
				custDBData = MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
						CustomerEpossSearchDto.class);
			} else if (epossHTTPStatus == HttpStatus.BAD_REQUEST.value()) {
				// 400 one error is there, ERR-SALE-070 (Record not found)
				serviceExErrCode = jsonNode.get("response").get(CommonConstants.CODE).asText();
				log.debug("EPOSS Search API gives Bad Request : {}", serviceExErrCode);
			} else {

				// 500 - EPOSS API call fail like not reachable, timeout error etc.
				// get POSS db customer, & customer ULP record & save it in eposs api response
				log.debug("\n\nEPOSS not reachable. Fetching from POSS.\n\n");
				custDBData = customerEpossService.searchCustomerWoULPWoError(searchInput,
						(searchType == null) ? null : searchType.name());

				// if institutional & data not found for GST No, search for PAN No
				custDBData = queryAlternativeUniqueFieldForInsti(addCustomerDto, customerType, custDBData);

				throwErrorIfCustomerExist(custDBData.getCustomer());
			}
		}

		CustomerResDto customerResDto = new CustomerResDto();
		// encrypt addCustmerDto fields as per requirement before overriding
		encryptAddCustomerDto(addCustomerDto);

		log.debug("\n\nEPOSS data : \n{}", custDBData.getCustomer());
		CustomerDao newCustomerData = (custDBData.getCustomer() == null) ? new CustomerDao()
				: gson.fromJson(gson.toJson(custDBData.getCustomer()), CustomerDao.class);

		log.debug("\n\nnewCustomerData : \n{}", newCustomerData);
		newCustomerData = (CustomerDao) MapperUtil.getObjectMapping(addCustomerDto, newCustomerData);
		
		newCustomerData.setCustomerDetails(MapperUtil.getStringFromJson(addCustomerDto.getCustomerDetails()));
		log.debug("\n\nnewCustomerData JsonData update : \n{}\n{}", newCustomerData.getUlpId(), newCustomerData);
		
		//set it to newCustomerData
		custDBData.setCustomer(newCustomerData);
		if (customerType == CustomerTypeEnum.REGULAR) {

			custDBData = modifyUlp(gson, unencryptedAddCustomerDto, custDBData, customerUlpResonseDto, serviceExErrCode,
//					customerResDto, 
					newCustomerData);
		}

		if (custDBData.getCustomer().getIsActive() == null)
			custDBData.getCustomer().setIsActive(true);

		log.debug("\n\nCustotmer data to update :- \n\n{}", custDBData.getCustomer());
		return customerServiceImp.saveCustomerAndMap(customerResDto, custDBData.getCustomer(),
				custDBData.getCustomerUlp(), CustomerServiceImpl.CUSTOMER + customerType);
	}

	private void checkCustomerUniqueFieldCustomerCreation(CustomerAddDto addCustomerDto) {
		// if (addCustomerDto.getCustTaxNo() != null) {
		// if (addCustomerDto.getIscustTaxNoVerified() == null ||
		// !addCustomerDto.getIscustTaxNoVerified())
		// throw new ServiceException("Customer Tax No is not verified",
		// "ERR-SALE-333");
		// }
		if (addCustomerDto.getInstiTaxNo() != null) {
			if (addCustomerDto.getIsInstiTaxNoVerified() == null || !addCustomerDto.getIsInstiTaxNoVerified())
				throw new ServiceException("Institutional Tax No is not verified", "ERR-SALE-337");
		}
	}

	private void casingCustomerCreationField(CustomerAddDto addCustomerDto) {

		if (StringUtils.isNotBlank(addCustomerDto.getCustTaxNo()))
			addCustomerDto.setCustTaxNo(addCustomerDto.getCustTaxNo().toUpperCase());
		if (StringUtils.isNotBlank(addCustomerDto.getInstiTaxNo()))
			addCustomerDto.setInstiTaxNo(addCustomerDto.getInstiTaxNo().toUpperCase());
		if (StringUtils.isNotBlank(addCustomerDto.getPassportId()))
			addCustomerDto.setPassportId(addCustomerDto.getPassportId().toUpperCase());

		if (StringUtils.isNotBlank(addCustomerDto.getEmailId()))
			addCustomerDto.setEmailId(addCustomerDto.getEmailId().toLowerCase());
		if (StringUtils.isNotBlank(addCustomerDto.getPanHolderName()))
		{
			addCustomerDto.setPanHolderName(addCustomerDto.getPanHolderName());
		}
		addCustomerDto.setCustomerName(addCustomerDto.getCustomerName().toUpperCase());
	}

	private CustomerEpossSearchDto queryAlternativeUniqueFieldForInsti(CustomerAddDto addCustomerDto,
			CustomerTypeEnum customerType, CustomerEpossSearchDto custDBData) {
		String searchInput;
		SearchTypeEnum searchType;
		if (custDBData.getCustomer() == null && customerType == CustomerTypeEnum.INSTITUTIONAL) {

			searchInput = addCustomerDto.getCustTaxNo();
			searchType = SearchTypeEnum.CUSTOMER_TAX_NO;

			custDBData = customerEpossService.searchCustomerWoULPWoError(searchInput,
					(searchType == null) ? null : searchType.name());
		}
		return custDBData;
	}

	@Transactional
	public PublishResponse saveCustomerAndMap(CustomerResDto customerResDto, CustomerDao newCustomerData,
			CustomerUlpDao customerUlpDao, String operation) {

		if (customerUlpDao != null) {
			if (customerUlpDao.getSrcSyncId() != null) {
				customerUlpDao.setSrcSyncId(customerUlpDao.getSrcSyncId() + 1);
			}
			customerUlpDao = customerUlpRepo.save(customerUlpDao);
		}
		CustomerDao customerRes = saveCustomerBasedOnUUIDAvailability(newCustomerData);
		CustomerLocationMappingDao clm = getCustomerLocationId(customerRes);
		customerResDto.setCustomerId(clm.getCustomerLocationMappingId().getCustomerId());
		mapToCreateResponse(customerRes, customerResDto);
		SyncStagingDto syncDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			syncDto = customerSyncStagging(customerRes, customerUlpDao, clm, operation);
		}
		PublishResponse response = new PublishResponse();
		response.setApiResponse(customerResDto);
		response.setSyncStagingDto(syncDto);
		return response;
	}

	@Override
	public int saveCustomerAndGetCustomerId(CustomerDao newCustomerData) {

		CustomerDao customerRes = saveCustomerBasedOnUUIDAvailability(newCustomerData);
		// PENDING, when customerTxn will be encrypted, remove below encrypt()
		encryptCustomerDao(customerRes);
		CustomerLocationMappingDao clm = getCustomerLocationId(customerRes);
		return clm.getCustomerLocationMappingId().getCustomerId();
	}

	public SyncStagingDto customerSyncStagging(CustomerDao customerRes, CustomerUlpDao customerUlpDao,
			CustomerLocationMappingDao clm, String operation) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());
		if (customerRes != null) {
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerSyncDtoExt(customerRes), 0));
		}
		if (customerUlpDao != null) {
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerUlpSyncDto(customerUlpDao), 1));
		}
		if (clm != null) {
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerLocationMappingSyncDto(clm), 2));
		}
		MessageRequest customerMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
		SyncStagingDto customerStagingDto = new SyncStagingDto();
		customerStagingDto.setMessageRequest(customerMsgRequest);
		String customerMsgRqst = MapperUtil.getJsonString(customerMsgRequest);
		SyncStaging customerSyncStaging = new SyncStaging();
		customerSyncStaging.setMessage(customerMsgRqst);
		customerSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		customerSyncStaging = salesSyncStagingRepository.save(customerSyncStaging);
		customerStagingDto.setId(customerSyncStaging.getId());
		return customerStagingDto;
	}

	private void throwErrorIfCustomerExist(CustomerDao customer) {

		if (customer != null) {

			CustomerTypeEnum customerTypeDB = CustomerTypeEnum.valueOf(customer.getCustomerType());

			if (customerTypeDB == CustomerTypeEnum.REGULAR)
				throw new ServiceException(PROVIDED_MOBILE_NO_IS_ALREADY_IN_USE, ERR_SALE_071);
			/*
			 * else if(customerTypeDB == CustomerTypeEnum.ONETIME) throw new
			 * ServiceException(PROVIDED_MOBILE_NO_IS_ALREADY_IN_USE,ERR_SALE_071);
			 */
			else if (customerTypeDB == CustomerTypeEnum.INTERNATIONAL)
				throw new ServiceException("Provided passport id is already in use.", "ERR-SALE-111");
			else if (customerTypeDB == CustomerTypeEnum.INSTITUTIONAL)
				throw new ServiceException(PROVIDED_INSTIT_OR_CUST_TAX_NUMBER_IS_ALREADY_IN_USE, ERR_SALE_074);
		}
	}

	private ApiResponseDto mapJsonNodeToEpossAPIResponse(int httpStatus, JsonNode jsonNode,
			ApiResponseDto apiResponseDto) {

		if (httpStatus == HttpStatus.OK.value()) {
			log.debug("EPOSS Feign Response status: {}", httpStatus);
			try {
				apiResponseDto = MapperUtil.getObjectMapperInstance().convertValue(jsonNode, ApiResponseDto.class);

			} catch (Exception e) {
				throw new ServiceException(JSON_DATA_FORMAT_ERROR, ERR_CORE_013, e);
			}
		}
		return apiResponseDto;
	}

	public CustomerDao saveCustomerBasedOnUUIDAvailability(CustomerDao newCustomerData) {

		JsonData emailValidationDetails = getEmailValidationDetails(decryptString(newCustomerData.getEmailId()));
		newCustomerData.setEmailValidationDetails(MapperUtil.getStringFromJson(emailValidationDetails));

		CustomerDao customerRes = null;
		if (newCustomerData.getId() != null) {
			customerRes = customerRepo.save(newCustomerData);
		} else {
			CustomerDaoExt customerDaoExt = (CustomerDaoExt) MapperUtil.getDtoMapping(newCustomerData,
					CustomerDaoExt.class);
			if (customerDaoExt.getSrcSyncId() != null) {
				customerDaoExt.setSrcSyncId(customerDaoExt.getSrcSyncId() + 1);
			}
			customerDaoExt = customerRepoExt.saveAndFlush(customerDaoExt);
			customerRes = (CustomerDao) MapperUtil.getDtoMapping(customerDaoExt, CustomerDao.class);
		}
		return customerRes;
	}

	private CustomerEpossSearchDto modifyUlp(Gson gson, CustomerAddDto unencryptedAddCustomerDto,
			CustomerEpossSearchDto custDBData, CustomerDto customerUlpResonseDto, String serviceExErrCode,
//			CustomerResDto customerResDto, 
			CustomerDao newCustomerData) {

		CustomerUlpDao customerUlpDao = (custDBData.getCustomerUlp() == null) ? new CustomerUlpDao()
				: gson.fromJson(gson.toJson(custDBData.getCustomerUlp()), CustomerUlpDao.class);

		RegularCustomerCreateDto jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(unencryptedAddCustomerDto.getCustomerDetails().getData(), RegularCustomerCreateDto.class);

		// ULP GET API
		// (200 and not exist) or 500
		// search if available in ULP, else create
		if (custDBData.getCustomerUlp() == null) {

			// if eposs not service exception or else service ex with err code
			customerUlpResonseDto = callSearchULPApi(unencryptedAddCustomerDto, customerUlpResonseDto,
					serviceExErrCode);

			// if eposs search says record not there, or else search API says not there
			if ((serviceExErrCode != null && serviceExErrCode.equals(ERR_SALE_070))
					|| customerUlpResonseDto.getResponseCode().equals(ERR_SALE_070)
					|| customerUlpResonseDto.getResponseCode().equals(ERR_INT_037)) {
				customerUlpResonseDto = callCreateULPApi(unencryptedAddCustomerDto, jsonData);

			} else {
				// TEST if taking or not
				throwErrorIfRequired(customerUlpResonseDto);
			}

			customerUlpDao = (CustomerUlpDao) MapperUtil.getDtoMapping(customerUlpResonseDto, CustomerUlpDao.class);
			LoyaltyDetails details = (LoyaltyDetails) MapperUtil.getDtoMapping(customerUlpResonseDto,
					LoyaltyDetails.class);
			customerUlpDao.setLoyaltyDetails(new JsonData("LOYALTY", details).toString());

		}

		// encrypt name, mobileNo field
		if (StringUtils.isNotBlank(customerUlpResonseDto.getCustomerName()))
			customerUlpResonseDto.setCustomerName(encFieldWithNullCheck(customerUlpResonseDto.getCustomerName()));
		if (StringUtils.isNotBlank(customerUlpResonseDto.getMobileNumber()))
			customerUlpResonseDto.setMobileNumber(encFieldWithNullCheck(customerUlpResonseDto.getMobileNumber()));

		// override fields from search with going to be saved data
		// before this if condition. Don't copy customer name
		newCustomerData = (CustomerDao) MapperUtil.getObjectMapping(customerUlpResonseDto, newCustomerData);
		customerEpossService.updateCustomerDetailsFromULP(newCustomerData, customerUlpResonseDto);

		if (custDBData.getCustomer() != null) {
			log.debug("\n\nprevious set CustomerName  :- \n{}", custDBData.getCustomer().getCustomerName());
			newCustomerData.setCustomerName(custDBData.getCustomer().getCustomerName());
		}

		log.debug("\n\nCustomerName to set :- \n{}", newCustomerData.getCustomerName());

		if (StringUtils.isNotBlank(customerUlpResonseDto.getEmailId())) {
			newCustomerData.setEmailId(encFieldWithNullCheck(customerUlpResonseDto.getEmailId()));
		}

		if (customerUlpDao.getIsPulseCustomer() == null) {
			customerUlpDao.setIsPulseCustomer(false);
		}

		CustomerEpossSearchDto customerDetails = new CustomerEpossSearchDto();
		customerDetails.setCustomer(newCustomerData);
		customerDetails.setCustomerUlp(customerUlpDao);
		return customerDetails;
	}

	private CustomerDto callCreateULPApi(CustomerAddDto unencryptedAddCustomerDto, RegularCustomerCreateDto jsonData) {
		CustomerDto customerUlpResonseDto;

		com.titan.poss.core.dto.CustomerAddDto custUlpAddDto = (com.titan.poss.core.dto.CustomerAddDto) MapperUtil
				.getObjectMapping(unencryptedAddCustomerDto, new com.titan.poss.core.dto.CustomerAddDto());
		custUlpAddDto = (com.titan.poss.core.dto.CustomerAddDto) MapperUtil.getObjectMapping(jsonData, custUlpAddDto);
		JsonData customerData = unencryptedAddCustomerDto.getCustomerDetails();
		RegularCustomerCreateDto regularDetails = MapperUtil.mapObjToClass(customerData.getData(),
				RegularCustomerCreateDto.class);
		if (StringUtils.isNotBlank(regularDetails.getBirthday())) {
			Date birthday = CalendarUtils.convertStringToDate(regularDetails.getBirthday(),
					CalendarUtils.SQL_DATE_FORMAT, "birthday");
			custUlpAddDto.setBirthday(birthday);
		}
		if (StringUtils.isNotBlank(regularDetails.getSpouseBirthday())) {
			Date spouseBirthday = CalendarUtils.convertStringToDate(regularDetails.getSpouseBirthday(),
					CalendarUtils.SQL_DATE_FORMAT, "spouseBirthday");
			custUlpAddDto.setSpouseBirthday(spouseBirthday);
		}
		if (StringUtils.isNotBlank(regularDetails.getAnniversary())) {
			Date anniversary = CalendarUtils.convertStringToDate(regularDetails.getAnniversary(),
					CalendarUtils.SQL_DATE_FORMAT, "anniversary");
			custUlpAddDto.setAnniversary(anniversary);
		}

		log.debug("create customer in ULP: {}", custUlpAddDto);
		customerUlpResonseDto = intgService.createLoyaltyCustomer(VendorCodeEnum.ULP_NETCARROTS.name(), custUlpAddDto);

		log.debug("Request to integration  for create: {}", MapperUtil.getJsonString(custUlpAddDto));
		log.debug("Response to integration for create: {}", MapperUtil.getJsonString(customerUlpResonseDto));

		throwErrorIfRequired(customerUlpResonseDto);
		return customerUlpResonseDto;
	}

	private void throwErrorIfRequired(UlpBaseResponseDto ulpBaseResponseDto) {

		if (!ulpBaseResponseDto.getResponseCode().equals("0")) {
			throw new ServiceException(null, ulpBaseResponseDto.getResponseCode(),
					ulpBaseResponseDto.getResponseMessage());
		}
	}

	private CustomerDto callSearchULPApi(CustomerAddDto unencryptedAddCustomerDto, CustomerDto customerUlpResonseDto,
			String serviceExErrCode) {
		if (serviceExErrCode == null || !serviceExErrCode.equals(ERR_SALE_070)) {

			log.debug("Search customer in ULP, type: {} value: {}", SearchTypeEnum.MOBILE_NO.name(),
					unencryptedAddCustomerDto.getMobileNumber());
			customerUlpResonseDto = intgService.searchLoyaltyCustomer(VendorCodeEnum.ULP_NETCARROTS.name(),
					SearchTypeEnum.MOBILE_NO.name(), unencryptedAddCustomerDto.getMobileNumber());
		}
		return customerUlpResonseDto;
	}

	private void encryptAddCustomerDto(CustomerAddDto addCustomerDto) {
		if (StringUtils.isNotBlank(addCustomerDto.getCustomerName()))
			addCustomerDto.setCustomerName(encFieldWithNullCheck(addCustomerDto.getCustomerName()));
		if (StringUtils.isNotBlank(addCustomerDto.getMobileNumber()))
			addCustomerDto.setMobileNumber(encFieldWithNullCheck(addCustomerDto.getMobileNumber()));
		if (StringUtils.isNotBlank(addCustomerDto.getCustTaxNo()))
			addCustomerDto.setCustTaxNo(encFieldWithNullCheck(addCustomerDto.getCustTaxNo()));
		if (StringUtils.isNotBlank(addCustomerDto.getInstiTaxNo()))
			addCustomerDto.setInstiTaxNo(encFieldWithNullCheck(addCustomerDto.getInstiTaxNo()));
		if (StringUtils.isNotBlank(addCustomerDto.getPassportId()))
			addCustomerDto.setPassportId(encFieldWithNullCheck(addCustomerDto.getPassportId()));
		if (StringUtils.isNotBlank(addCustomerDto.getEmailId()))
			addCustomerDto.setEmailId(encFieldWithNullCheck(addCustomerDto.getEmailId()));
	}

	private int getHttpStatusFromJsonNodeResponse(JsonNode jsonNode) {
		int epossHTTPStatus;
		JsonNode httpStatusCode = jsonNode.get("httpResponseCode");
		if (httpStatusCode == null)
			epossHTTPStatus = 500;
		else
			epossHTTPStatus = jsonNode.get("httpResponseCode").asInt();

		log.debug("EPOSS API Response status: {}, data: {}", epossHTTPStatus, jsonNode);
		return epossHTTPStatus;
	}

	private JsonNode convertToJsonNode(Response response) {

		JsonNode jsonNode = null;
		try {
			jsonNode = new ObjectMapper().readTree(
					IOUtils.toString(response.body().asInputStream(), String.valueOf(StandardCharsets.UTF_8)));
		} catch (IOException e) {
			throw new ServiceException(JSON_DATA_FORMAT_ERROR, ERR_CORE_013, e);
		}
		return jsonNode;
	}

	private Response callEPOSSSearchAPI(String searchInput, SearchTypeEnum searchType, Boolean isUlpUpdateRquire) {
		Map<String, String> reqParams = Map.of(SEARCH_FIELD, searchInput, SEARCH_TYPE,
				(searchType == null) ? null : searchType.name(), "isUlpUpdateRquire", isUlpUpdateRquire.toString());

		return intgService.callEpossAPIWoError(HttpMethod.PATCH, CUSTOMER_EPOSS_API_URL, reqParams, null);
	}

	private String encFieldWithNullCheck(String str) {
		return CryptoUtil.encrypt(str, null);
	}

	/**
	 * This method will validate pattern of searchInput based on regex and throw
	 * error if does not match and give searchType in cause.
	 * 
	 * @param searchType
	 * @param searchInput
	 * @param regex
	 */
	private void searchFieldPatternCheck(SearchTypeEnum searchType, String searchInput, String regex) {

		if (!Pattern.matches(regex, searchInput)) {
			throw new ServiceException(INVALID_INPUTS, ERR_SALE_048, searchType);
		}

	}

	@Override
	@Transactional
	public Integer getCustomerByIdAndLocation(Integer customerId, String locationCode) {

		if (CommonUtil.getStoreCode().equals(locationCode))
			return customerId;

		CustomerEpossSearchDto custData = null;

		if (CommonUtil.isEpossApp()) {
			custData = customerEpossService.getCustomerByIdAndLocationCode(customerId, locationCode);
		} else {
			custData = epossCallService.callEposs(HttpMethod.GET, SalesUtil.SALES_BASE_SERVICE_URL + "/customers/eposs",
					Map.of("customerId", customerId.toString(), "locationCode", locationCode), null,
					CustomerEpossSearchDto.class);
			// Save this data

			saveCustomerAndUp(custData.getCustomer(), custData.getCustomerUlp());
			saveCustomerLocationMapping(customerId, locationCode, custData.getCustomer());

		}
		CustomerLocationMappingDao clmNewStore = getLocationMapping(custData.getCustomer(), CommonUtil.getStoreCode());

		return clmNewStore.getCustomerLocationMappingId().getCustomerId();
	}

	@Override
	@Transactional
	public Integer searchCustomerWithoutUlpUpdate(SearchTypeEnum searchType, String searchInput, Boolean isUlpUpdateRquire) {

		CustomerEpossSearchDto custData = null;

		if (CommonUtil.isEpossApp()) {
			custData = customerEpossService.searchAndUpdateCustomer(searchInput, searchType.name(), isUlpUpdateRquire);
		} else {

			custData = epossCallService.callEposs(HttpMethod.PATCH,
					SalesUtil.SALES_BASE_SERVICE_URL + "/customers/eposs", Map.of(SEARCH_FIELD, searchInput,
							SEARCH_TYPE, searchType.name(), "isUlpUpdateRquire", isUlpUpdateRquire.toString()),
					null, CustomerEpossSearchDto.class);

			// Save this data

			saveCustomerAndUp(custData.getCustomer(), custData.getCustomerUlp());
		}
		CustomerLocationMappingDao clmNewStore = getLocationMapping(custData.getCustomer(), CommonUtil.getStoreCode());

		return clmNewStore.getCustomerLocationMappingId().getCustomerId();
	}

	@Transactional
	public PublishResponse searchCustomerWithFallbackTransactional(SearchTypeEnum searchType, String searchInput) {

		log.debug("Searching customer in POSS, type: {}, value: {}", searchType, searchInput);

		searchInput = upperCaseSearchUniqueField(searchInput, searchType);

		String regex = null;

		switch (searchType) {

		case CUSTOMER_ID:
			regex = RegExConstants.CUSTOMER_ID_REGEX;
			break;

		case MOBILE_NO:
			regex = RegExConstants.MOBILE_REGEX;
			break;

		case ULP_ID:
			regex = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_50;
			break;

		case INSTITUTIONAL_TAX_NO:
			regex = RegExConstants.GST_REGEX;
			break;

		case CUSTOMER_TAX_NO:
			regex = RegExConstants.PAN_REGEX;
			break;

		default:
			break;

		}

		if (StringUtils.isNotBlank(regex))
			searchFieldPatternCheck(searchType, searchInput, regex);

		CustomerEpossSearchDto custDBData = new CustomerEpossSearchDto();

		int epossHTTPStatus = 0;
		String serviceExErrCode = null;

		Response response = callEPOSSSearchAPI(searchInput, searchType, true);
		epossHTTPStatus = response.status();

		JsonNode jsonNode = convertToJsonNode(response);

		// Successful EPOSS API call (200 as per HTTP client)
		ApiResponseDto epossApiResponseDto = new ApiResponseDto();
		epossApiResponseDto = mapJsonNodeToEpossAPIResponse(epossHTTPStatus, jsonNode, epossApiResponseDto);

		epossHTTPStatus = getHttpStatusFromJsonNodeResponse(jsonNode);

		if (epossHTTPStatus == HttpStatus.OK.value()) {
			custDBData = MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
					CustomerEpossSearchDto.class);
		} else if (epossHTTPStatus == HttpStatus.BAD_REQUEST.value()) {
			// 400 one error is there, ERR-SALE-070 (Record not found)
			serviceExErrCode = jsonNode.get("response").get(CommonConstants.CODE).asText();
			log.debug("EPOSS Search API gives Bad Request : {}", serviceExErrCode);
		}
		// if !200 custDB will be blank

//		if (serviceExErrCode != null && serviceExErrCode.equalsIgnoreCase(ERR_SALE_070))
//			throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070);

		CustomerUlpDao ulpData = custDBData.getCustomerUlp();

		CustomerEpossSearchDto custPossDBData = customerEpossService.searchCustomerWoULPWoError(searchInput,
				(searchType == null) ? null : searchType.name());

		log.trace("\n\nCust Eposs customer: {}", custDBData.getCustomer());
		log.trace("\n\nCust Poss customer: {}", custPossDBData.getCustomer());

		CustomerDao custPossDao = null;

		if (custDBData.getCustomer() == null) {

			// if not there in eposs & poss, throw error
			// e.g, totally a new customer
			if (custPossDBData.getCustomer() == null)
				throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070);

			// if not there in eposs, there in poss
			// consider poss data to send in response
			// e.g, eposs not reachable
			custDBData = custPossDBData;

		} else {
			// if there in eposs

			// if eposs there, poss not there, create same data as there in eposs
			// e.g, titan watch scenario
			if (custPossDBData.getCustomer() == null) {
				custPossDao = custDBData.getCustomer();
                Integer temp=custPossDao.getSrcSyncId();
                custPossDao.setSrcSyncId(custPossDao.getDestSyncId());
                custPossDao.setDestSyncId(temp);
			} else {
				// update dao & customer details json too
				custPossDao = updateCustomerBasedOnEpossResponse(custDBData, custPossDBData);
			}
			custPossDao = customerRepo.save(custPossDao);
			log.trace("\n\nFinal Poss customer saved data: {}", custPossDao);

		}

		// if eposs gives ulp response, save it
		updateUlpBasedOnEpossResponse(custDBData.getCustomerUlp());

		CustomerDao cust = (custPossDao != null) ? custPossDao : custDBData.getCustomer();
		CustomerLocationMappingDao clm = getCustomerLocationId(cust);

		SyncStagingDto syncDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			syncDto = customerUpdateSyncStagging(null, clm, SalesOperationCode.CUSTOMER_LOCATION);
		}
		PublishResponse publishResponse = new PublishResponse();
		publishResponse.setSyncStagingDto(syncDto);
		publishResponse.setApiResponse(mapToSearchResponse(clm, cust, ulpData));
		return publishResponse;

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

	private CustomerDao updateCustomerBasedOnEpossResponse(CustomerEpossSearchDto custDBData,
			CustomerEpossSearchDto custPossDBData) {
		CustomerDao custPossDao;
		// if eposs there, poss there, save same data as there in eposs
		// ignore pk, override all other field, this poss data may not have same uuid
		// e.g, there in both place but pk may be different
		custPossDao = (CustomerDao) MapperUtil.getObjectMapping(custDBData.getCustomer(), custPossDBData.getCustomer(),
				"id", "customerDetails");
		log.info("\n\nFinal Poss customer b4 json: {}", custPossDao);

		if (custDBData.getCustomer().getCustomerDetails() != null) {

			custPossDao.setCustomerDetails(custDBData.getCustomer().getCustomerDetails());
            Integer temp=custPossDao.getSrcSyncId();
            custPossDao.setSrcSyncId(custPossDao.getDestSyncId());
            custPossDao.setDestSyncId(temp);
//			if (custPossDBData.getCustomer().getCustomerDetails() == null) {
//			} else {
//				JsonData jsonData = MapperUtil.mapObjToClass(custPossDao.getCustomerDetails(), JsonData.class);
//				log.info("\n\nPoss jsonData: {}", jsonData);
//
//				// if json data format is not there
//				if (StringUtil.isBlankJsonData(jsonData)) {
//					custPossDao.setCustomerDetails(custDBData.getCustomer().getCustomerDetails());
//				} else {
//
//					JsonData jsonDataEposs = MapperUtil.mapObjToClass(custDBData.getCustomer().getCustomerDetails(),
//							JsonData.class);
//					RegularCustomerCreateDto custDetailsEposs = MapperUtil.mapObjToClass(jsonDataEposs.getData(),
//							RegularCustomerCreateDto.class);
//
//					RegularCustomerCreateDto custDetails = MapperUtil.mapObjToClass(jsonData.getData(),
//							RegularCustomerCreateDto.class);
//
//					custDetails = (RegularCustomerCreateDto) MapperUtil.getObjectMapping(custDetailsEposs, custDetails);
//
//					jsonDataEposs.setData(jsonDataEposs.getType());
//					jsonDataEposs.setData(custDetails);
//					custPossDao.setCustomerDetails(MapperUtil.getStringFromJson(jsonDataEposs));
//				}
			log.info("\n\nUpdated json: {}", custPossDao);
//		}

		}
		return custPossDao;

	}

	private String upperCaseSearchUniqueField(String searchInput, SearchTypeEnum searchType) {
		if (searchType == SearchTypeEnum.CUSTOMER_TAX_NO || searchType == SearchTypeEnum.INSTITUTIONAL_TAX_NO
				|| searchType == SearchTypeEnum.PASSPORT_ID || searchType == SearchTypeEnum.ULP_ID
				|| searchType == SearchTypeEnum.CUSTOMER_ID)
			searchInput = searchInput.toUpperCase();
		return searchInput;
	}

	private CustomerSearchDto mapToSearchResponse(CustomerLocationMappingDao clm, CustomerDao cust,
			CustomerUlpDao ulpData) {

		CustomerSearchDto customerSearchResponse = (CustomerSearchDto) MapperUtil
				.getDtoMapping(decryptCustomerDao(cust), CustomerSearchDto.class);
		encryptCustomerDao(cust);
		if (ulpData != null)
			customerSearchResponse = (CustomerSearchDto) MapperUtil.getObjectMapping(ulpData, customerSearchResponse);

		customerSearchResponse.setCustomerId(clm.getCustomerLocationMappingId().getCustomerId());
		customerSearchResponse.setCustomerDetails(JsonUtils.convertStrToJsonData(cust.getCustomerDetails()));
		return customerSearchResponse;
	}

	private CustomerLocationMappingDao getCustomerLocationId(CustomerDao customer) {
		return getLocationMapping(customer, CommonUtil.getStoreCode());
	}

	@Override
	public CustomerLocationMappingDao getLocationMapping(CustomerDao customer, String locationCode) {

		CustomerLocationMappingDao clm = customerLocationMappingRepo
				.findOneByCustomerAndCustomerLocationMappingIdLocationCode(customer, locationCode);

		log.debug("Result of customer: {}, locationCode: {} is {}", customer.getId(), locationCode, clm);

		if (clm == null) {

			// create new customer customer location mapping
			CustomerLocationMappingIdDao customerLocationMappingId = new CustomerLocationMappingIdDao();
			customerLocationMappingId.setLocationCode(CommonUtil.getStoreCode());
			customerLocationMappingId.setCustomerId(
					customerLocationMappingRepo.getNewCustomerIdForLocationMapping(CommonUtil.getLocationCode()));

			CustomerLocationMappingDao customerLocationMapping = new CustomerLocationMappingDao();
			customerLocationMapping.setCustomerLocationMappingId(customerLocationMappingId);
			customerLocationMapping.setCustomer(customer);
			if (customerLocationMapping.getSrcSyncId() != null) {
				customerLocationMapping.setSrcSyncId(customerLocationMapping.getSrcSyncId() + 1);
			}
			clm = customerLocationMappingRepo.save(customerLocationMapping);
			log.debug("Saved clm: {}", clm);
		} else {
			clm.setSrcSyncId(clm.getSrcSyncId() + 1);
			clm = customerLocationMappingRepo.save(clm);
		}
		return clm;
	}

	private String decryptString(String val) {
		return CryptoUtil.decrypt(val, null, true);
	}

	/**
	 * This method will fetch ULP details of the customer based on ULP id.
	 * 
	 * @param customerSearchDto
	 * @param ulpId
	 * @return CustomerSearchDto
	 */
	private CustomerDetailsDto getUlpDetailsOfCustomer(CustomerDetailsDto customerSearchDto, String ulpId) {

		Optional<CustomerUlpDao> customerUlpOptional = null;

		if (StringUtils.isNotBlank(ulpId)) {
			customerUlpOptional = customerUlpRepo.findById(ulpId);

			if (customerUlpOptional.isPresent()) {
				CustomerUlpDao customerUlp = customerUlpOptional.get();
				customerSearchDto = (CustomerDetailsDto) MapperUtil.getObjectMapping(customerUlp, customerSearchDto);
				if (customerUlp.getLoyaltyDetails() != null)
					customerSearchDto.setLoyaltyDetails(
							MapperUtil.mapObjToClass(customerUlp.getLoyaltyDetails(), JsonData.class));
			}
		}
		return customerSearchDto;
	}

	@Override
	public CustomerUlpDao getUlpDetails(String ulpId) {

		Optional<CustomerUlpDao> customerUlpOptional = customerUlpRepo.findById(ulpId);

		CustomerUlpDao customerUlp = null;

		if (customerUlpOptional.isPresent())
			customerUlp = customerUlpOptional.get();

		return customerUlp;
	}

	@Override
	public CustomerUlpDao getUlpData(String ulpId) {

		Optional<CustomerUlpDao> customerUlpOptional = customerUlpRepo.findById(ulpId);
		CustomerUlpDao customerUlp = null;

		if (customerUlpOptional.isPresent())
			customerUlp = customerUlpOptional.get();
		else
			customerUlp = new CustomerUlpDao();

		return customerUlp;

	}

	/**
	 * This method will return customer details based on customerId.
	 * 
	 * @param customerId
	 * @return CustomerSearchDto
	 */
	@Transactional
	@Override
	public CustomerDetailsDto getCustomer(Integer customerId) {

		CustomerLocationMappingDao customerLocationMapping = checkIfCustomerExists(customerId,
				CommonUtil.getLocationCode());

		CustomerResDto customerDto = (CustomerResDto) MapperUtil.getDtoMapping(customerLocationMapping.getCustomer(),
				CustomerResDto.class);
		customerDto.setCustomerId(customerId);

		CustomerDao customer = customerLocationMapping.getCustomer();

		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(customer.getCustomerDetails()), JsonData.class);
		customerDto.setCustomerDetails(jsonData);

		customerDto.setIsForm60Matched(customer.getIsForm60Matched());
		customerDto.setIsCustTaxMatched(customer.getIsCustTaxMatched());
		if(customer.getPanHolderName() != null)
		{
			customerDto.setPanHolderName(customer.getPanHolderName());
		}
		// if not encrypted, then ishardCopySubmitted will be null
		decryptCustomerDto(customerDto);

		return getUlpDetailsOfCustomer(
				(CustomerDetailsDto) MapperUtil.getDtoMapping(customerDto, CustomerDetailsDto.class),
				customerDto.getUlpId());
	}

	private void checkFieldLevelValidation(CustomerUpdateDto updateCustomerDto, CustomerTypeEnum customerType) {

		log.debug("check validation of customer type: {}", customerType);

		Map<String, String> messages = new HashMap<>();

		if (customerType != CustomerTypeEnum.INTERNATIONAL) {
			JsonData jsonDataAddr = updateCustomerDto.getCustomerDetails();
			if (jsonDataAddr != null && jsonDataAddr.getData() != null) {
				AddressDetails address = MapperUtil.mapObjToClass(jsonDataAddr.getData(), AddressDetails.class);
				if (StringUtils.isNotBlank(address.getPincode())
						&& !Pattern.matches(RegExConstants.PIN_CODE_REGEX, address.getPincode()))
					messages.put("pincode", "Invalid pincode. Regular expression: " + RegExConstants.PIN_CODE_REGEX);
			}
		}
		if (!messages.isEmpty()) {
			throw new ServiceException(JSON_DATA_FORMAT_ERROR, ERR_CORE_013, messages);
		}

	}

	@Transactional
	public PublishResponse updateCustomerTransactional(Integer customerId, CustomerUpdateDto updateCustomerDto) {

		if (StringUtils.isNotBlank(updateCustomerDto.getEmailId()))
			updateCustomerDto.setEmailId(updateCustomerDto.getEmailId().toLowerCase());
		String locationCode = CommonUtil.getLocationCode();
		CustomerLocationMappingDao customerLocationMapping = checkIfCustomerExists(customerId, locationCode);

		CustomerDao customer = customerLocationMapping.getCustomer();

		CustomerTypeEnum customerType = CustomerTypeEnum.valueOf(customer.getCustomerType());

		/*
		 * //TODO: NSDL verification check Boolean verified = Boolean.TRUE;
		 * LocationCacheDto locationDoa = engineService .getStoreLocation(locationCode);
		 * 
		 * if(locationDoa.getIsPanCardVerifyIntegration()) { //invoke NSDL API to
		 * validate }
		 */


		if ((updateCustomerDto.getInstiTaxNo() != null
				&& !(CryptoUtil.encrypt(updateCustomerDto.getInstiTaxNo(), INSTI_TAX_NO).equals(customer.getInstiTaxNo())))
				|| (updateCustomerDto.getCustTaxNo() != null
				&& !(CryptoUtil.encrypt(updateCustomerDto.getCustTaxNo(), CUST_TAX_NO).equals(customer.getCustTaxNo())))
				)
			checkCustomerUniqueFieldValidations(updateCustomerDto, customer);

//		if (customerType == CustomerTypeEnum.ONETIME)
//			throw new ServiceException("one-time customer is not editable.", "ERR-SALE-097", customerType);

		// field level validation
		checkFieldLevelValidation(updateCustomerDto, customerType);

		checkIfValidLOVValue(updateCustomerDto.getTitle(), LovTypeEnum.SALUTATION);

		CustomerResDto customerResDto = (CustomerResDto) MapperUtil.getObjectMapping(updateCustomerDto,
				new CustomerResDto());
		customerResDto.setCustomerId(customerId);

		// encrypt DTO if and only if it is encrypted in db
		encryptCustomerDto(customerResDto);

		customer = (CustomerDao) MapperUtil.getObjectMapping(customerResDto, customer);

		// mandatory field check based on location config
		// same mandatory check needs to be done while updating also
		locationWiseFieldValidationCommon(customerType, StringUtils.isBlank(customer.getEmailId()), false);

		JsonData jsonData = MapperUtil.mapObjToClass(customer.getCustomerDetails(), JsonData.class);

		updateCustomerDetailsTemp(customer, updateCustomerDto, jsonData);
		customerResDto.setCustomerDetails(jsonData);
		customer.setCustomerDetails(MapperUtil.getStringFromJson(jsonData));

		if (StringUtils.isNotBlank(updateCustomerDto.getEmailId())) {
			JsonData emailValidationDetails = getEmailValidationDetails(updateCustomerDto.getEmailId());
			customer.setEmailValidationDetails(MapperUtil.getStringFromJson(emailValidationDetails));
			customerResDto.setEmailValidationDetails(emailValidationDetails);
		}
		customer.setSrcSyncId(customer.getSrcSyncId() + 1);
		if (StringUtils.isBlank(customerResDto.getPassportId())) {
			customer.setPassportId(StringUtils.EMPTY);
		}
		
		/*
		 * if (StringUtils.isBlank(customerResDto.getInstiTaxNo())) {
		 * customer.setInstiTaxNo(StringUtils.EMPTY); }
		 */
		if(!StringUtils.isEmpty(updateCustomerDto.getPanHolderName()))
		{
			customer.setPanHolderName(updateCustomerDto.getPanHolderName());
		}
		customer = customerRepo.save(customer);

		JsonData customerDetailsJson = updateCustomerDto.getCustomerDetails();
		if (!StringUtil.isBlankJsonData(customerDetailsJson)) {
			String catchmentName = JsonUtils.getValueFromJsonString(customerDetailsJson.getData(), "catchmentName");
			if (catchmentName != null)
				storeService.saveCatchmentDescription(catchmentName);
		}
		// update ULP details
		if (customer.getCustomerType().equals(CustomerTypeEnum.REGULAR.name()))
			updateInUlpFromUpdateApi(customer);
		SyncStagingDto stagingDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			stagingDto = customerUpdateSyncStagging(customer, null, SalesOperationCode.CUSTOMER_UPDATE);
		}
		customerResDto = decryptCustomerDto((CustomerResDto) MapperUtil.getObjectMapping(customer, customerResDto));
		PublishResponse response = new PublishResponse();
		response.setApiResponse(customerResDto);
		response.setSyncStagingDto(stagingDto);
		return response;
	}

	private void checkCustomerUniqueFieldValidations(CustomerUpdateDto updateCustomerDto, CustomerDao customer) {
		if (updateCustomerDto.getCustTaxNo() != null) {
			// if (updateCustomerDto.getIscustTaxNoVerified() == null ||
			// !updateCustomerDto.getIscustTaxNoVerified())
			// throw new ServiceException("Customer Tax No is not verified",
			// "ERR-SALE-333");
			/*
			 * if(!updateCustomerDto.getCustTaxNo().equals(updateCustomerDto.
			 * getConfirmCustTaxNo())) { throw new
			 * ServiceException("Customer Tax No nd Confirm Customer Tax No does not match",
			 * "ERR-SALE-334"); }
			 */

			Boolean response = isUniqueCheck(SearchTypeEnum.CUSTOMER_TAX_NO.name(), updateCustomerDto.getCustTaxNo());

			if (BooleanUtils.isFalse(response))
				throw new ServiceException("Another Customer is already available with this Customer Tax No",
						"ERR-SALE-334");
			if (BooleanUtils.isTrue(customer.getIscustTaxNoVerified()))
				throw new ServiceException(
						"Customer Tax No can't be updated as it is already verified for the customer", "ERR-SALE-336");
		}
		
		if (null!=updateCustomerDto.getIsInstiTaxNoVerified() && updateCustomerDto.getIsInstiTaxNoVerified() && updateCustomerDto.getInstiTaxNo() != null) {
			if (updateCustomerDto.getIsInstiTaxNoVerified() == null || !updateCustomerDto.getIsInstiTaxNoVerified())
				throw new ServiceException("Institutional Tax No is not verified", "ERR-SALE-337");
			Boolean response = isUniqueCheck(SearchTypeEnum.INSTITUTIONAL_TAX_NO.name(),
					updateCustomerDto.getInstiTaxNo());
			if (BooleanUtils.isFalse(response))
				throw new ServiceException("Another Customer is already available with this Institutional Tax No",
						"ERR-SALE-338");
//			if (CustomerTypeEnum.INTERNATIONAL == customerType || CustomerTypeEnum.REGULAR == customerType)
//				throw new ServiceException("Institutional Tax No can only be updated for Institutional customer",
//						"ERR-SALE-339");
			if (BooleanUtils.isTrue(customer.getIsInstiTaxNoVerified()))
				throw new ServiceException(
						"Institutional Tax No can't be updated as it is already verified for the customer",
						"ERR-SALE-340");
		}
	}

	public SyncStagingDto customerUpdateSyncStagging(CustomerDao customer, CustomerLocationMappingDao clm,
			String operation) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());

		if (customer != null && StringUtils.isNotBlank(customer.getUlpId())) {
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerSyncDtoExt(customer), 0));
		}
		if (clm != null) {
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerLocationMappingSyncDto(clm), 2));
		}
		MessageRequest customerMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
		SyncStagingDto customerStagingDto = new SyncStagingDto();
		customerStagingDto.setMessageRequest(customerMsgRequest);
		String customerMsgRqst = MapperUtil.getJsonString(customerMsgRequest);
		SyncStaging customerSyncStaging = new SyncStaging();
		customerSyncStaging.setMessage(customerMsgRqst);
		customerSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		customerSyncStaging = salesSyncStagingRepository.save(customerSyncStaging);
		customerStagingDto.setId(customerSyncStaging.getId());
		return customerStagingDto;
	}
	public SyncStagingDto customerUpdateForm60SyncStagging(CustomerDao customer, CustomerLocationMappingDao clm,
			String operation) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());

		if (customer != null ) {
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerSyncDtoExt(customer), 0));
		}
		if (clm != null) {
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerLocationMappingSyncDto(clm), 2));
		}
		MessageRequest customerMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
		SyncStagingDto customerStagingDto = new SyncStagingDto();
		customerStagingDto.setMessageRequest(customerMsgRequest);
		String customerMsgRqst = MapperUtil.getJsonString(customerMsgRequest);
		SyncStaging customerSyncStaging = new SyncStaging();
		customerSyncStaging.setMessage(customerMsgRqst);
		customerSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		customerSyncStaging = salesSyncStagingRepository.save(customerSyncStaging);
		customerStagingDto.setId(customerSyncStaging.getId());
		return customerStagingDto;
	}

	private void updateInUlpFromUpdateApi(CustomerDao customer) {

		decryptCustomerDao(customer);
		log.debug("Jsonvalue of customer: \n{}", customer.getCustomerDetails());

		com.titan.poss.core.dto.CustomerUpdateDto custUlpUpdateDto = (com.titan.poss.core.dto.CustomerUpdateDto) MapperUtil
				.getDtoMapping(customer, com.titan.poss.core.dto.CustomerUpdateDto.class);

		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(customer.getCustomerDetails()), JsonData.class);
		RegularCustomerCreateDto jsonDataCust = MapperUtil.getObjectMapperInstance().convertValue(jsonData.getData(),
				RegularCustomerCreateDto.class);
		custUlpUpdateDto = (com.titan.poss.core.dto.CustomerUpdateDto) MapperUtil.getObjectMapping(jsonDataCust,
				custUlpUpdateDto);

		log.debug("ULP Data that needs to be update: {}", custUlpUpdateDto);
		log.debug("Request to integration  for update: {}", MapperUtil.getJsonString(custUlpUpdateDto));
		try {
			UlpBaseResponseDto ulpResDto = intgService.updateLoyaltyCustomer(VendorCodeEnum.ULP_NETCARROTS.name(),
					custUlpUpdateDto);
			log.debug("Response to integration for update: {}", MapperUtil.getJsonString(ulpResDto));

			throwErrorIfRequired(ulpResDto);
		} catch (Exception e) {
			log.error("Error in ULP_NETCARROTS service: {}", e);
		}

		encryptCustomerDao(customer);
	}

	private void updateCustomerDetailsTemp(CustomerDao customer, CustomerUpdateDto updateCustomerDto,
			JsonData jsonData) {

		if (updateCustomerDto.getCustomerDetails() != null
				&& !StringUtils.isEmpty(updateCustomerDto.getCustomerDetails().getType())
				&& !customer.getCustomerType().equals(updateCustomerDto.getCustomerDetails().getType())) {
			throw new ServiceException(JSON_TYPE_MISMATCH_JSON_TYPE + updateCustomerDto.getCustomerDetails().getType(),
					ERR_CORE_014);
		}

		if (!StringUtil.isBlankJsonData(updateCustomerDto.getCustomerDetails())) {
			log.debug("existing json data: {}", jsonData.getData());
			jsonData.setData(updateAndEncryptCustomerDetails(customer.getCustomerType(),
					updateCustomerDto.getCustomerDetails().getData(), jsonData.getData()));
			log.debug("updated json data: {}", jsonData.getData());
		}

	}

	/**
	 * This method will verify if mobile no./email/instiTaxNo/custTaxNo is unique.
	 * 
	 * @param searchTypeStr
	 * @param value
	 * @return Boolean
	 */
	@Override
	public Boolean isUniqueCheck(String searchTypeStr, String value) {
		Boolean isUnique = null;

		SearchTypeEnum searchType = SearchTypeEnum.valueOf(searchTypeStr);

		// POSS app need to call EPOSS app

		if (!CommonUtil.isEpossApp()) {

			Map<String, String> reqParams = Map.of(SEARCH_TYPE, searchType.name(), "value", value);
			Response response = intgService.callEpossAPIWoError(HttpMethod.GET,
					SalesUtil.CUST_SERVICE_URL + "/eposs/unique-checks", reqParams, null);

			int epossHTTPStatus = response.status();

			if (epossHTTPStatus == HttpStatus.OK.value()) {

				JsonNode jsonNode = convertToJsonNode(response);
				ApiResponseDto epossResponse = new ApiResponseDto();
				epossResponse = mapJsonNodeToEpossAPIResponse(epossHTTPStatus, jsonNode, epossResponse);

				epossHTTPStatus = getHttpStatusFromJsonNodeResponse(jsonNode);

				if (epossHTTPStatus == HttpStatus.OK.value()) {
					isUnique = Boolean.valueOf(epossResponse.getResponse().toString());
					log.debug("EPOSS API call success. Response: {}", isUnique);
				}
			}
		}

		// if isUnique is
		// null (EPOSS call didn't happen or EPOSS APP)
		// or true (if data sync didn't happen) or may be properly not there
		if (isUnique == null || isUnique) {

			// @formatter:off
			switch (searchType) {
			case MOBILE_NO:
				isUnique = (customerRepo.findOneByMobileNumberAndCustomerType(CryptoUtil.encrypt(value, MOBILE_NO),
						CustomerTypeEnum.REGULAR.name()) == null);

				break;

			case PASSPORT_ID:
				isUnique = (customerRepo.findOneByPassportIdAndCustomerType(CryptoUtil.encrypt(value, PASSPORT_ID),
						CustomerTypeEnum.INTERNATIONAL.name()) == null);
				break;
			case CUSTOMER_TAX_NO:
				isUnique = (customerRepo.findOneByCustTaxNoAndCustomerType(CryptoUtil.encrypt(value, CUST_TAX_NO),
						CustomerTypeEnum.INSTITUTIONAL.name()) == null);
				break;
			case INSTITUTIONAL_TAX_NO:
				isUnique = (customerRepo.findOneByInstiTaxNoAndCustomerType(CryptoUtil.encrypt(value, INSTI_TAX_NO),
						CustomerTypeEnum.INSTITUTIONAL.name()) == null);
				break;

			default:
				break;
			}

			return isUnique;
			// @formatter:on
		}

		return isUnique;
	}

	/**
	 * This method will encrypt customer data.
	 * 
	 * @param customerDto
	 */
	private void encryptCustomerDto(CustomerResDto customerDto) {

		if (!StringUtils.isEmpty(customerDto.getCustomerName()))
			customerDto.setCustomerName(CryptoUtil.encrypt(customerDto.getCustomerName(), CUSTOMER_NAME));
		if (!StringUtils.isEmpty(customerDto.getEmailId()))
			customerDto.setEmailId(CryptoUtil.encrypt(customerDto.getEmailId(), EMAIL));
		if (!StringUtils.isEmpty(customerDto.getMobileNumber()))
			customerDto.setMobileNumber(CryptoUtil.encrypt(customerDto.getMobileNumber(), MOBILE));
		if (!StringUtils.isEmpty(customerDto.getInstiTaxNo()))
			customerDto.setInstiTaxNo(CryptoUtil.encrypt(customerDto.getInstiTaxNo(), INSTI_TAX_NO));
		if (!StringUtils.isEmpty(customerDto.getCustTaxNo()))
			customerDto.setCustTaxNo(CryptoUtil.encrypt(customerDto.getCustTaxNo(), CUST_TAX_NO));
		if (!StringUtils.isEmpty(customerDto.getPassportId()))
			customerDto.setPassportId(CryptoUtil.encrypt(customerDto.getPassportId(), PASSPORT_ID));

		// encrypt ULP ID

	}

	@Override
	public CustomerDao encryptCustomerDao(CustomerDao customerDao) {

		if (!StringUtils.isEmpty(customerDao.getCustomerName()))
			customerDao.setCustomerName(CryptoUtil.encrypt(customerDao.getCustomerName(), CUSTOMER_NAME));
		if (!StringUtils.isEmpty(customerDao.getEmailId()))
			customerDao.setEmailId(CryptoUtil.encrypt(customerDao.getEmailId(), EMAIL));
		if (!StringUtils.isEmpty(customerDao.getMobileNumber()))
			customerDao.setMobileNumber(CryptoUtil.encrypt(customerDao.getMobileNumber(), MOBILE));
		if (!StringUtils.isEmpty(customerDao.getInstiTaxNo()))
			customerDao.setInstiTaxNo(CryptoUtil.encrypt(customerDao.getInstiTaxNo(), INSTI_TAX_NO));
		if (!StringUtils.isEmpty(customerDao.getCustTaxNo()))
			customerDao.setCustTaxNo(CryptoUtil.encrypt(customerDao.getCustTaxNo(), CUST_TAX_NO));
		if (!StringUtils.isEmpty(customerDao.getPassportId()))
			customerDao.setPassportId(CryptoUtil.encrypt(customerDao.getPassportId(), PASSPORT_ID));

		return customerDao;
	}

	@Override
	public CustomerDao decryptCustomerDao(CustomerDao customerDao) {

		if (!StringUtils.isEmpty(customerDao.getCustomerName()))
			customerDao.setCustomerName(CryptoUtil.decrypt(customerDao.getCustomerName(), CUSTOMER_NAME));
		if (!StringUtils.isEmpty(customerDao.getEmailId()))
			customerDao.setEmailId(CryptoUtil.decrypt(customerDao.getEmailId(), EMAIL));
		if (!StringUtils.isEmpty(customerDao.getMobileNumber()))
			customerDao.setMobileNumber(CryptoUtil.decrypt(customerDao.getMobileNumber(), MOBILE));
		if (!StringUtils.isEmpty(customerDao.getInstiTaxNo()))
			customerDao.setInstiTaxNo(CryptoUtil.decrypt(customerDao.getInstiTaxNo(), INSTI_TAX_NO));
		if (!StringUtils.isEmpty(customerDao.getCustTaxNo()))
			customerDao.setCustTaxNo(CryptoUtil.decrypt(customerDao.getCustTaxNo(), CUST_TAX_NO));
		if (!StringUtils.isEmpty(customerDao.getPassportId()))
			customerDao.setPassportId(CryptoUtil.decrypt(customerDao.getPassportId(), PASSPORT_ID));

		return customerDao;
	}

	/**
	 * This method will decrypt customer data.
	 * 
	 * @param customerDto
	 * @return CustomerDto
	 */
	private CustomerResDto decryptCustomerDto(CustomerResDto customerDto) {

		customerDto.setCustomerName(CryptoUtil.decrypt(customerDto.getCustomerName(), CUSTOMER_NAME));
		if (!StringUtils.isEmpty(customerDto.getMobileNumber()))
			customerDto.setMobileNumber(CryptoUtil.decrypt(customerDto.getMobileNumber(), MOBILE));
		if (!StringUtils.isEmpty(customerDto.getEmailId()))
			customerDto.setEmailId(CryptoUtil.decrypt(customerDto.getEmailId(), EMAIL));
		if (!StringUtils.isEmpty(customerDto.getInstiTaxNo()))
			customerDto.setInstiTaxNo(CryptoUtil.decrypt(customerDto.getInstiTaxNo(), INSTI_TAX_NO));
		if (!StringUtils.isEmpty(customerDto.getCustTaxNo()))
			customerDto.setCustTaxNo(CryptoUtil.decrypt(customerDto.getCustTaxNo(), CUST_TAX_NO));
		if (!StringUtils.isEmpty(customerDto.getPassportId()))
			customerDto.setPassportId(CryptoUtil.decrypt(customerDto.getPassportId(), PASSPORT_ID));

		return customerDto;
	}

	/**
	 * This method will validate customer details based on customer type and encrypt
	 * required fields.
	 * 
	 * @param customerType
	 * @param jsonData
	 * @param isIndividualCustomer
	 */
	public void validateAndEncryptJson(String customerTypeStr, JsonData jsonData) {

		Object newJsonObjectData = null;

		CustomerTypeEnum customerType = CustomerTypeEnum.valueOf(customerTypeStr);

		Class<?> className = getClassNameFromCustomerAddType(customerType);
		newJsonObjectData = JsonUtils.validateDto(jsonData.getData(), className);

		if (customerType == CustomerTypeEnum.REGULAR) {
			validateBdayAnniversaryCheck(newJsonObjectData);
		}

		// LOV id proof check if provided
		String idProof = JsonUtils.getValueFromJsonString(jsonData.getData(), "idProof");
		checkIfValidLOVValue(idProof, LovTypeEnum.ID_PROOF);

		jsonData.setData(newJsonObjectData);

	}

	private void validateBdayAnniversaryCheck(Object newJsonObjectData) {
		RegularCustomerCreateDto custDetails = (RegularCustomerCreateDto) newJsonObjectData;
		Date birthday = null;
		Date spouseBirthday = null;
		Date anniversary = null;
		if (StringUtils.isNotBlank(custDetails.getBirthday())) {
			birthday = CalendarUtils.convertStringToDate(custDetails.getBirthday(), CalendarUtils.SQL_DATE_FORMAT,
					"birthday");
		}
		if (StringUtils.isNotBlank(custDetails.getSpouseBirthday())) {
			spouseBirthday = CalendarUtils.convertStringToDate(custDetails.getSpouseBirthday(),
					CalendarUtils.SQL_DATE_FORMAT, "spouseBirthday");
		}
		if (StringUtils.isNotBlank(custDetails.getAnniversary())) {

			anniversary = CalendarUtils.convertStringToDate(custDetails.getAnniversary(), CalendarUtils.SQL_DATE_FORMAT,
					"anniversary");
		}

		if (CalendarUtils.isBefore(anniversary, birthday) || CalendarUtils.isBefore(anniversary, spouseBirthday))
			throw new ServiceException("Anniversary date must be after birth date and spouse birth date.",
					"ERR-SALE-112");
	}

	private Class<?> getClassNameFromCustomerAddType(CustomerTypeEnum customerType) {
		// load class name from Enum

		Class<?> className = null;
		try {
			className = Class.forName(customerType.getClassNameForCreate());
		} catch (ClassNotFoundException e) {
			throw new ServiceException("No class found for provided json data type: " + customerType.name(),
					"ERR-CORE-010", e);
		}
		return className;
	}

	private Class<?> getClassNameFromCustomerUpdateType(CustomerTypeEnum customerType) {
		// load class name from Enum

		Class<?> className = null;
		try {
			className = Class.forName(customerType.getClassNameForUpdate());
		} catch (ClassNotFoundException e) {
			throw new ServiceException("No class found for provided json data type: " + customerType.name(),
					"ERR-CORE-010", e);
		}
		return className;
	}

	private void checkIfValidLOVValue(String value, LovTypeEnum lovType) {

		if (StringUtils.isBlank(value))
			return;

		List<String> lovValues = getLov(lovType);

		if (!lovValues.contains(value)) {

			String remarks = "Allowed values:- " + lovValues.toString();

			if (lovType == LovTypeEnum.SALUTATION)
				throw new ServiceException(INVALID_TITLE, ERR_SALE_073, remarks);
			else if (lovType == LovTypeEnum.ID_PROOF)
				throw new ServiceException(INVALID_ID_PROOF, ERR_SALE_014, remarks);
		}
	}

	private List<String> getLov(LovTypeEnum lovType) {
		LovDto lovDto = engineService.getLov(lovType.name());
		return lovDto.getResults().stream().map(KeyValueDto::getValue).collect(Collectors.toList());
	}

	/**
	 * This method will update and encrypt customer details.
	 * 
	 * @param customerTypeStr
	 * @param updateCustomerDetails
	 * @param customerDetails
	 * @param isHardCopysubmitted
	 * @return Object
	 */
	private Object updateAndEncryptCustomerDetails(String customerTypeStr, Object updateCustomerDetails,
			Object customerDetails) {

		CustomerTypeEnum customerType = CustomerTypeEnum.valueOf(customerTypeStr);

		Class<?> createClass = getClassNameFromCustomerAddType(customerType);
		Class<?> updateClass = getClassNameFromCustomerUpdateType(customerType);

		Object createObject = MapperUtil.getObjectMapperInstance().convertValue(customerDetails, createClass);
		Object updateObject = MapperUtil.getObjectMapperInstance().convertValue(updateCustomerDetails, updateClass);

		Object obj = MapperUtil.getObjectMapping(updateObject, createObject);

		// obj = JsonUtils.validateDto(obj, createClass);

		log.debug("create class name: {}, update class name: {}", createClass.getName(), updateClass.getName());
		return obj;
	}

	@Override
	public void saveCustomerLocationMapping(Integer customerId, String locationCode, CustomerDao customer) {

		Optional<CustomerLocationMappingDao> customerLocationMappings = customerLocationMappingRepo
				.findById(new CustomerLocationMappingIdDao(customerId, locationCode));

		if (!customerLocationMappings.isPresent()) {

			CustomerLocationMappingIdDao customerLocationMappingId = new CustomerLocationMappingIdDao();
			customerLocationMappingId.setLocationCode(locationCode);
			customerLocationMappingId.setCustomerId(customerId);
			CustomerLocationMappingDao customerLocationMapping = new CustomerLocationMappingDao();
			customerLocationMapping.setCustomerLocationMappingId(customerLocationMappingId);
			customerLocationMapping.setCustomer(customer);
			customerLocationMappingRepo.save(customerLocationMapping);
		}

	}

	@Override
	public void saveCustomerAndUp(CustomerDao customer, CustomerUlpDao customerUlp) {

		customerRepo.save(customer);
		updateUlpBasedOnEpossResponse(customerUlp);
	}

	@Override
	@Transactional
	public Integer getLocationSpecificCustomerId(CustomerTxnDao custTxn) {

		CustomerSearchDto customerSearchDto = null;

		Integer newCustId = null;

		CustomerTypeEnum customerType = CustomerTypeEnum.valueOf(custTxn.getCustomerType());

		if (customerType == CustomerTypeEnum.REGULAR) {

			customerSearchDto = searchRegularCustomer(custTxn, customerSearchDto);

			newCustId = (customerSearchDto == null) ? null : customerSearchDto.getCustomerId();

		} else if (customerType == CustomerTypeEnum.INSTITUTIONAL && StringUtils.isNotBlank(custTxn.getInstiTaxNo())) {

			newCustId = searchInstiCustomer(custTxn, customerSearchDto);

		} else if (customerType == CustomerTypeEnum.INTERNATIONAL) {

			customerSearchDto = searchInternationCustomer(custTxn, customerSearchDto);

			newCustId = (customerSearchDto == null) ? null : customerSearchDto.getCustomerId();

		} else if (customerType == CustomerTypeEnum.ONETIME) {

			// one time create new one directly
			CustomerDao customerDao = (CustomerDao) MapperUtil.getDtoMapping(custTxn, CustomerDao.class);
			newCustId = saveCustomerAndGetCustomerId(customerDao);
		}

		return newCustId;
	}

	private CustomerSearchDto searchRegularCustomer(CustomerTxnDao custTxn, CustomerSearchDto customerSearchDto) {
		String mobileNo = custTxn.getMobileNumber();
		String ulpId = custTxn.getUlpId();

		try {
			customerSearchDto = searchCustomerWithFallback(SearchTypeEnum.MOBILE_NO, mobileNo);
		} catch (ServiceException e1) {

			// RECORD NOT FOUND by mobileNo (may be no changed), try by ULP ID
			if (e1.getErrorCode().equalsIgnoreCase(CUSTOMER_NOT_FOUND_ERR_CODE)) {

				try {
					customerSearchDto = searchCustomerWithFallback(SearchTypeEnum.ULP_ID, ulpId);
				} catch (ServiceException e2) {

					// RECORD NOT FOUND by ULP ID too
					if (e1.getErrorCode().equalsIgnoreCase(CUSTOMER_NOT_FOUND_ERR_CODE))
						throw new ServiceException(CUSTOMER_NOT_FOUND, ERR_SALE_129, mobileNo + " : " + ulpId);
					else
						CommonUtil.rethrowServiceException(e2);
				}
			} else {
				CommonUtil.rethrowServiceException(e1);
			}
		}
		return customerSearchDto;
	}

	private CustomerSearchDto searchInternationCustomer(CustomerTxnDao custTxn, CustomerSearchDto customerSearchDto) {
		try {
			customerSearchDto = searchCustomerWithFallback(SearchTypeEnum.PASSPORT_ID, custTxn.getPassportId());
		} catch (ServiceException e1) {

			if (e1.getErrorCode().equalsIgnoreCase(CUSTOMER_NOT_FOUND_ERR_CODE))
				throw new ServiceException(CUSTOMER_NOT_FOUND, ERR_SALE_129, custTxn.getPassportId());
			else
				CommonUtil.rethrowServiceException(e1);
		}
		return customerSearchDto;
	}

	private Integer searchInstiCustomer(CustomerTxnDao custTxn, CustomerSearchDto customerSearchDto) {
		Integer newCustId;
		try {
			customerSearchDto = searchCustomerWithFallback(SearchTypeEnum.INSTITUTIONAL_TAX_NO,
					custTxn.getInstiTaxNo());
		} catch (ServiceException e1) {

			if (e1.getErrorCode().equalsIgnoreCase(CUSTOMER_NOT_FOUND_ERR_CODE))
				throw new ServiceException(CUSTOMER_NOT_FOUND, ERR_SALE_129, custTxn.getInstiTaxNo());
			else
				CommonUtil.rethrowServiceException(e1);
		}

		newCustId = (customerSearchDto == null) ? null : customerSearchDto.getCustomerId();
		return newCustId;
	}

	@Override
	public CustomerSearchDto searchCustomerWithFallback(SearchTypeEnum searchType, String searchInput) {
		PublishResponse response = customerServiceImp.searchCustomerWithFallbackTransactional(searchType, searchInput);
		log.info("Customer Publish check");
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			log.info("Calling Customer :: publishSalesMessagesToQueue");
			salesSyncDataService.publishSalesMessagesToQueue(response.getSyncStagingDto());
			log.info("Customer Publish completed");
		}
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(response.getApiResponse(), new TypeReference<CustomerSearchDto>() {
		});
	}

	@Override
	public CustomerResDto updateCustomer(Integer customerId, CustomerUpdateDto updateCustomerDto) {
		PublishResponse response = customerServiceImp.updateCustomerTransactional(customerId, updateCustomerDto);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			salesSyncDataService.publishSalesMessagesToQueue(response.getSyncStagingDto());
		}
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(response.getApiResponse(), new TypeReference<CustomerResDto>() {
		});
	}

	@Override
	public CustomerResDto createCustomer(CustomerAddDto addCustomerDto) {
		PublishResponse response = customerServiceImp.createCustomerTransactional(addCustomerDto);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			salesSyncDataService.publishSalesMessagesToQueue(response.getSyncStagingDto());
		}
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(response.getApiResponse(), new TypeReference<CustomerResDto>() {
		});
	}

	@Override
	@Transactional
	public Integer getCustomerByIdAndLocationForLegacy(CreditNoteRequestDto cnRequestDto) {

		CustomerEpossSearchDto custData = null;
		CustomerUlpDao customerUlp = null;
		CustomerDao customer = MapperUtil.getObjectMapperInstance().convertValue(cnRequestDto, CustomerDao.class);
		customer.setId(UUID.randomUUID().toString());
		if (cnRequestDto.getUlpId() != null && cnRequestDto.getEnrollmentDate() != null)
			customerUlp = MapperUtil.getObjectMapperInstance().convertValue(cnRequestDto, CustomerUlpDao.class);

		CustomerEpossSearchDto customerToSearch = new CustomerEpossSearchDto();
		customerToSearch.setCustomer(customer);
		customerToSearch.setCustomerUlp(customerUlp);
		custData = customerEpossService.searchCustomer(customerToSearch, cnRequestDto.getSrcLocationCode());
		CustomerLocationMappingDao locationMapping = getLocationMappingLegacy(custData.getCustomer(),
				cnRequestDto.getSrcLocationCode());
		return locationMapping.getCustomerLocationMappingId().getCustomerId();

	}

	private CustomerLocationMappingDao getLocationMappingLegacy(CustomerDao customer, String locationCode) {
		CustomerLocationMappingDao clm = customerLocationMappingRepo
				.findOneByCustomerAndCustomerLocationMappingIdLocationCode(customer, locationCode);
		if (clm == null) {
			CustomerLocationMappingIdDao customerLocationMappingId = new CustomerLocationMappingIdDao();
			customerLocationMappingId.setLocationCode(locationCode);
			customerLocationMappingId
					.setCustomerId(customerLocationMappingRepo.getNewCustomerIdForLocationMapping(locationCode));
			CustomerLocationMappingDao customerLocationMapping = new CustomerLocationMappingDao();
			customerLocationMapping.setCustomerLocationMappingId(customerLocationMappingId);
			customerLocationMapping.setCustomer(customer);
			if (customerLocationMapping.getSrcSyncId() != null) {
				customerLocationMapping.setSrcSyncId(customerLocationMapping.getSrcSyncId() + 1);
			}
			clm = customerLocationMappingRepo.save(customerLocationMapping);
		} else {
			clm.setSrcSyncId(clm.getSrcSyncId() + 1);
			clm = customerLocationMappingRepo.save(clm);
		}
		return clm;
	}

	@Override
	public CustomerDao updateCustomerData(CustomerDao customer) {
		customer = customerRepo.save(customer);
		return customer;
	}

	@Override
	public CustomerDao getCustomer(String id) {
		CustomerDao customer = null;
		Optional<CustomerDao> customerOptional = customerRepo.findById(id);
		if (customerOptional.isPresent())
			customer = customerOptional.get();
		return customer;
	}

	@Override
	public EmailValidationResponseDto getEmailValidation(String email) {
		JsonData data = getEmailValidationDetails(email);
		EmailValidationResponseDto apiResponse = JsonUtils.getValueFromJson(data.getData(), "apiResponse",
				EmailValidationResponseDto.class);
		return apiResponse;
	}

	@Override
	public PanAndForm60ResponseDto verifyPanCard(String pancardNo, String reEnterPancardNo, String verificationType) {
		PanAndForm60ResponseDto panAndForm60ResponseDto = new PanAndForm60ResponseDto();

		if (VerificationTypeEnum.PAN_CARD.name().equals(verificationType)) {
			if ((pancardNo == null || reEnterPancardNo == null) && !reEnterPancardNo.equalsIgnoreCase(pancardNo)) {
				throw new ServiceException(INVALID_PAN, ERR_INT_038);
			}

			LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
			if (locationCacheDto != null) {
				log.info("before calling store details,{}", locationCacheDto);
				StoreDetails storeDetails = locationCacheDto.getStoreDetails();
				if (!ObjectUtils.isEmpty(storeDetails.getIsPanCardVerifyIntegrationEnabled())) {
					log.info("getting store details from db, {}", storeDetails.getIsPanCardVerifyIntegrationEnabled());
					PanDocDetailsResponseDto panDocDetailsResponseDto = integrationServiceClient.verifyPanDetails(
							VendorCodeEnum.PAN_KHOSLA.name(), PanDocVerificationEnum.NUMBER.name(), pancardNo);
					log.info("pan response,{}", panDocDetailsResponseDto);
					panAndForm60ResponseDto.setPanVerified(panDocDetailsResponseDto.getVerificationStatus());
					panAndForm60ResponseDto.setPanHolderName(panDocDetailsResponseDto.getOwnerName());
					if (panDocDetailsResponseDto.getVerificationStatus()) {
						switch (pancardNo.charAt(3)) {
						case 'P':
							panAndForm60ResponseDto.setPanHolderCategory("Individual");
						case 'C':
							panAndForm60ResponseDto.setPanHolderCategory("Company");
						default:
							panAndForm60ResponseDto.setPanHolderCategory("Others");

						}
					}
				}
			}

		}
		return panAndForm60ResponseDto;

	}

	@Override
	@Transactional
	public void verifyCustomerIdProof(String verificationType, String selectedIdProofType, Boolean isHardcopySubmitted,
			Boolean matched, CustomerPanDetails customerPanDetails) {
		//String[] transactionTypes = { "AB", "CM" };
		
		if (!isHardcopySubmitted) {
			throw new ServiceException(SUBMIT_HARDCOPY, ERR_INT_039);
		}
		if (customerPanDetails == null || (StringUtils.isBlank(customerPanDetails.getId()))) {
			throw new ServiceException(ID_MANDATORY_FIELD, ERR_INT_0100);
		}
		if ((customerPanDetails.getCustomerId() == null)) {
			throw new ServiceException(CUSTOMER_ID_MANDATORY_FIELD, ERR_SALE_0101);
		}
		if (customerPanDetails.getTxnType() == null) {
			throw new ServiceException(TXN_TYPE_MANDATORY_FIELD, ERR_SALE_0102);
		}
		/*
		 * if(!Arrays.stream(transactionTypes).anyMatch(txnType ->
		 * txnType.equals(customerPanDetails.getTxnType().name()))) { throw new
		 * ServiceException(INVALID_INPUTS, ERR_SALE_048); }
		 */
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		StoreDetails storeDetails = locationCacheDto.getStoreDetails();
		if (VerificationTypeEnum.FORM60_IDPROOF.name().equals(verificationType)) {
			if ((selectedIdProofType == null || customerPanDetails.getCollectedIdProofNumber() == null)) {
				throw new ServiceException(MANDATORY_FIELD, ERR_INT_040);
			}
			if (!validateIdProofType(selectedIdProofType)) {
				throw new ServiceException(INVALID_ID_PROOF_TYPE, ERR_SALE_0104);
			}

			CustomerDao customerDao = customerRepo.getCustomerDaoByCustomerIdAndCustomerType(
					customerPanDetails.getCustomerId(), customerPanDetails.getCustomerType().name(),
					CommonUtil.getLocationCode());
			
			Optional.ofNullable(customerDao).ifPresent(dao -> {

				JsonData jsonData = MapperUtil.mapObjToClass(dao.getCustomerDetails(), JsonData.class);
				if (CustomerTypeEnum.REGULAR.equals(customerPanDetails.getCustomerType())) {
					RegularCustomerCreateDto customerDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
							RegularCustomerCreateDto.class);
					customerDetailsDto.setForm60(Boolean.TRUE);
					customerDetailsDto.setIdProof(selectedIdProofType);
					customerDetailsDto.setIdNumber(customerPanDetails.getCollectedIdProofNumber());
					customerDetailsDto.setIsHardCopySubmitted(isHardcopySubmitted);
					// String customerDetails = MapperUtil.getJsonString(customerDetailsDto);
					jsonData.setData(customerDetailsDto);
					String customerDetails = MapperUtil.getStringFromJson(jsonData);
					dao.setCustomerDetails(customerDetails);
				}
				
				if (CustomerTypeEnum.ONETIME.equals(customerPanDetails.getCustomerType())) {
					OneTimeCustomerDto customerDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
							OneTimeCustomerDto.class);
					customerDetailsDto.setForm60(Boolean.TRUE);
					jsonData.setData(customerDetailsDto);
					String customerDetails = MapperUtil.getStringFromJson(jsonData);
					dao.setCustomerDetails(customerDetails);
				}

				if (CustomerTypeEnum.INTERNATIONAL.equals(customerPanDetails.getCustomerType())) {
					InternationalCustomerCreateDto customerDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
							InternationalCustomerCreateDto.class);
					customerDetailsDto.setForm60(Boolean.TRUE);
					customerDetailsDto.setIdProof(selectedIdProofType);
					customerDetailsDto.setIdNumber(customerPanDetails.getCollectedIdProofNumber());
					customerDetailsDto.setIsHardCopySubmitted(isHardcopySubmitted);
					jsonData.setData(customerDetailsDto);
					String customerDetails = MapperUtil.getStringFromJson(jsonData);
					//check if passport already associated with another customer
					CustomerDao validateCustomerDao = customerRepo.findOneByPassportIdAndCustomerType(CryptoUtil.encrypt(customerPanDetails.getCollectedIdProofNumber(),PASSPORT_ID), CustomerTypeEnum.INTERNATIONAL.name());
					if(validateCustomerDao != null && validateCustomerDao.getId() != dao.getId()) {
					//	throw ServiceException(PASSPORT_ID_ALREADY_ASSOCIATED_WITH_ANOTHER_CUSTOMER, CODE);
					}
					dao.setPassportId(CryptoUtil.encrypt(customerPanDetails.getCollectedIdProofNumber().toUpperCase(),PASSPORT_ID));
					dao.setCustomerDetails(customerDetails);
				}
				dao.setIsForm60Matched(matched);
				//by default setting setIscustTaxNoVerified to false
				
				//setting setIscustTaxNoVerified to true incase when verification is enabled from EPOSS and the customer is verified 
				if (locationCacheDto != null) {
					
					if(storeDetails.getIsPanCardVerifyIntegrationEnabled() == Boolean.TRUE && !StringUtils.isEmpty(customerPanDetails.getPanHolderName()))
					{
						dao.setIscustTaxNoVerified(true);
						dao.setPanHolderName(customerPanDetails.getPanHolderName());
					}else 
					{
						dao.setIscustTaxNoVerified(false);
						dao.setPanHolderName(null);
					}
				}
				// customerDetailsDto.setForm60Matched(matched);
				dao.setSrcSyncId(dao.getSrcSyncId() + 1);
				customerRepo.save(dao);
				
				CustomerLocationMappingDao customerLocationMappingDao = customerLocationMappingRepo.findByCustomerMasterIdIdAndLocationCode(dao.getId(),CommonUtil.getLocationCode());
				publishCustomerForm60Details(dao);

			});

		} else if (VerificationTypeEnum.PAN_CARD.name().equals(verificationType)) {
			if ((customerPanDetails.getPancardNo() == null)) {
				throw new ServiceException(MANDATORY_FIELD, ERR_INT_040);
			}

			CustomerDao customerDao = customerRepo.getCustomerDaoByCustomerIdAndCustomerType(
					customerPanDetails.getCustomerId(), customerPanDetails.getCustomerType().name(),
					CommonUtil.getLocationCode());
			Optional.ofNullable(customerDao).ifPresentOrElse(dao -> {
				if (matched) {

					JsonData jsonData = MapperUtil.mapObjToClass(dao.getCustomerDetails(), JsonData.class);
					if (CustomerTypeEnum.REGULAR.equals(customerPanDetails.getCustomerType())) {
						RegularCustomerCreateDto customerDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
								RegularCustomerCreateDto.class);
						customerDetailsDto.setIsHardCopySubmitted(isHardcopySubmitted);
						jsonData.setData(customerDetailsDto);
						String customerDetails = MapperUtil.getStringFromJson(jsonData);
						dao.setCustomerDetails(customerDetails);
					}
					if (CustomerTypeEnum.INSTITUTIONAL.equals(customerPanDetails.getCustomerType())) {
						InstitutionalCustomerUpdateDto customerDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
								InstitutionalCustomerUpdateDto.class);
						customerDetailsDto.setIsHardCopySubmitted(isHardcopySubmitted);
						jsonData.setData(customerDetailsDto);
						String customerDetails = MapperUtil.getStringFromJson(jsonData);
						dao.setCustomerDetails(customerDetails);
					}
					if (CustomerTypeEnum.INTERNATIONAL.equals(customerPanDetails.getCustomerType())) {
						InternationalCustomerCreateDto customerDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
								InternationalCustomerCreateDto.class);
						customerDetailsDto.setIsHardCopySubmitted(isHardcopySubmitted);
						jsonData.setData(customerDetailsDto);
						String customerDetails = MapperUtil.getStringFromJson(jsonData);
						//check if passport already associated with another customer
						CustomerDao validateCustomerDao = customerRepo.findOneByPassportIdAndCustomerType(CryptoUtil.encrypt(customerPanDetails.getCollectedIdProofNumber(),PASSPORT_ID), CustomerTypeEnum.INTERNATIONAL.name());
						if(validateCustomerDao != null && validateCustomerDao.getId() != dao.getId()) {
							//throw ServiceException(PASSPORT_ID_ALREADY_ASSOCIATED_WITH_ANOTHER_CUSTOMER, CODE);
						}
						dao.setPassportId(CryptoUtil.encrypt(customerPanDetails.getCollectedIdProofNumber(),PASSPORT_ID));
						dao.setCustomerDetails(customerDetails);
					}
					dao.setIsCustTaxMatched(matched);
					dao.setCustTaxNoOld(dao.getCustTaxNo());
					dao.setCustTaxNo(CryptoUtil.encrypt(customerPanDetails.getPancardNo(), CUST_TAX_NO));
					if (locationCacheDto != null) {
						
						if(storeDetails.getIsPanCardVerifyIntegrationEnabled() == Boolean.TRUE && !StringUtils.isEmpty(customerPanDetails.getPanHolderName()))
						{
							dao.setIscustTaxNoVerified(true);
							dao.setPanHolderName(customerPanDetails.getPanHolderName());
						}else 
						{
							dao.setIscustTaxNoVerified(false);
							dao.setPanHolderName(null);
						}
					}
					dao.setSrcSyncId(dao.getSrcSyncId() + 1);
					customerRepo.save(dao);
					//Publish to syncData 
					publishCustomerForm60Details(dao);

					Optional<CustomerTxnDaoExt> customerTxnDao = customerTxnRepositoryExt
							.findById(customerPanDetails.getId());
					customerTxnDao.get().setMobileNumber(CryptoUtil.decrypt(customerTxnDao.get().getMobileNumber(),MOBILE_NO,false));
					customerTxnDao.get().setInstiTaxNo(CryptoUtil.decrypt(customerTxnDao.get().getInstiTaxNo(),INSTI_TAX_NO,false));
					customerTxnDao.get().setEmailId(CryptoUtil.decrypt(customerTxnDao.get().getEmailId(),EMAIL,false));
					customerTxnDao.get().setCustomerName(CryptoUtil.decrypt(customerTxnDao.get().getCustomerName(),CUSTOMER_NAME,false));
					customerTxnDao.get().setCustTaxNo(CryptoUtil.decrypt(customerTxnDao.get().getCustTaxNo(),CUST_TAX_NO,false));
					customerTxnDao.get().setCustTaxNoOld(CryptoUtil.decrypt(customerTxnDao.get().getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
					customerTxnDao.get().setPassportId(CryptoUtil.decrypt(customerTxnDao.get().getPassportId(),PASSPORT_ID,false));
					customerTxnDao.ifPresentOrElse(custTxnDao -> {
						custTxnDao.setCustTaxNo(CryptoUtil.encrypt(customerPanDetails.getPancardNo(), CUST_TAX_NO));
						custTxnDao.setCustTaxNoOld(dao.getCustTaxNoOld());
						custTxnDao.setMobileNumber(CryptoUtil.encrypt(custTxnDao.getMobileNumber(),MOBILE_NO));
		                custTxnDao.setInstiTaxNo(CryptoUtil.encrypt(custTxnDao.getInstiTaxNo(),INSTI_TAX_NO));
		                custTxnDao.setEmailId(CryptoUtil.encrypt(custTxnDao.getEmailId(),EMAIL));
		                custTxnDao.setCustomerName(CryptoUtil.encrypt(custTxnDao.getCustomerName(),CUSTOMER_NAME));
		                custTxnDao.setPassportId(CryptoUtil.encrypt(custTxnDao.getPassportId(),PASSPORT_ID));
		                custTxnDao.setIsEncrypted(Boolean.TRUE);
		                customerTxnRepositoryExt.save(custTxnDao);
					}, () -> {
						throw new ServiceException(TXN_ID_NOT_FOUND, ERR_SALE_0103);
					});
				}

			}, () -> {
				throw new ServiceException(CUSTOMER_NOT_FOUND, ERR_SALE_129);
			});
		}

	}

	private boolean validateIdProofType(String idProofType) {
		if (Stream.of(IdproofTypeEnum.values()).filter(proofType -> proofType.getValue().equalsIgnoreCase(idProofType))
				.findFirst().isPresent()) {
			return Boolean.TRUE;
		}
		return Boolean.FALSE;
	}

	public void publishCustomerForm60Details(CustomerDao customer) {
		SyncStagingDto stagingDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			stagingDto = customerUpdateForm60SyncStagging(customer, null, SalesOperationCode.CUSTOMER_UPDATE);
			salesSyncDataService.publishSalesMessagesToQueue(stagingDto);
		}		
	}
	public Integer encryptCustomeDetailsByChunk(Pageable pageable, Boolean isPageable) {
		if (!isPageable.booleanValue()) {
			pageable = PageRequest.of(0, 100, pageable.getSort());
		} else if (BooleanUtils.isTrue(isPageable) && (pageable == null || pageable.getPageSize() == 0)) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"Page details needed", Map.of("remarks", "Pagination details needed"));
		}

		CustomerDao customer = new CustomerDao();
		customer.setIsEncrypted(Boolean.FALSE);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<CustomerDao> criteria = Example.of(customer, matcher);

		Page<CustomerDao> customerList = customerRepo.findAll(criteria, pageable);

		if (customerList == null || CollectionUtil.isEmpty(customerList.getContent())) {
			return 0;
		}
		customerList.getContent().forEach(customerDao -> {
			encryptCustomerDao(customerDao);
			customerDao.setIsEncrypted(Boolean.TRUE);
		});

		customerRepo.saveAll(customerList.getContent());
		return customerList.getContent().size();
	}

	public Integer encryptCustomerTxnDetailsByChunk(Pageable pageable, Boolean isPageable) {
		if (!isPageable.booleanValue()) {
			pageable = PageRequest.of(0, 100, pageable.getSort());
		} else if (BooleanUtils.isTrue(isPageable) && (pageable == null || pageable.getPageSize() == 0)) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"Page details needed", Map.of("remarks", "Pagination details needed"));
		}
		CustomerTxnDaoExt customer = new CustomerTxnDaoExt();
		customer.setIsEncrypted(Boolean.FALSE);
		
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<CustomerTxnDaoExt> criteria = Example.of(customer, matcher);
		
		Page<CustomerTxnDaoExt> customerTxnList = customerTxnRepositoryExt.findAll(criteria, pageable);
//        for(int i=0; i < customerTxnList.getContent().size();i++){
//            try {
//            	customerTxnList.getContent().get(i).setCustomerName(CryptoUtil.decrypt(customerTxnList.getContent().get(i).getCustomerName(),CUSTOMER_NAME,false));
//            	customerTxnList.getContent().get(i).setMobileNumber(CryptoUtil.decrypt(customerTxnList.getContent().get(i).getMobileNumber(),MOBILE_NO,false));
//            	customerTxnList.getContent().get(i).setInstiTaxNo(CryptoUtil.decrypt(customerTxnList.getContent().get(i).getInstiTaxNo(),INSTI_TAX_NO,false));
//            	customerTxnList.getContent().get(i).setEmailId(CryptoUtil.decrypt(customerTxnList.getContent().get(i).getEmailId(),EMAIL,false));
//            	customerTxnList.getContent().get(i).setCustTaxNo(CryptoUtil.decrypt(customerTxnList.getContent().get(i).getCustTaxNo(),CUST_TAX_NO,false));
//            	customerTxnList.getContent().get(i).setCustTaxNoOld(CryptoUtil.decrypt(customerTxnList.getContent().get(i).getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
//            	customerTxnList.getContent().get(i).setPassportId(CryptoUtil.decrypt(customerTxnList.getContent().get(i).getPassportId(),PASSPORT_ID,false));
//          } catch (Exception e) {
//              e.printStackTrace();
//          }   
//        }
		if (customerTxnList == null || CollectionUtil.isEmpty(customerTxnList.getContent())) {
			return 0;
		}
		customerTxnList.getContent().forEach(customerTxnDao -> {
			encryptCustomerTxnDao(customerTxnDao);
			customerTxnDao.setIsEncrypted(Boolean.TRUE);
		});
		customerTxnRepositoryExt.saveAll(customerTxnList.getContent());
		return customerTxnList.getContent().size();		
	}
	
	private CustomerTxnDaoExt encryptCustomerTxnDao(CustomerTxnDaoExt customerTxnDao) {
		// TODO Auto-generated method stub
		if (!StringUtils.isEmpty(customerTxnDao.getCustomerName()))
			customerTxnDao.setCustomerName(CryptoUtil.encrypt(customerTxnDao.getCustomerName(), CUSTOMER_NAME));
		if (!StringUtils.isEmpty(customerTxnDao.getEmailId()))
			customerTxnDao.setEmailId(CryptoUtil.encrypt(customerTxnDao.getEmailId(), EMAIL));
		if (!StringUtils.isEmpty(customerTxnDao.getMobileNumber()))
			customerTxnDao.setMobileNumber(CryptoUtil.encrypt(customerTxnDao.getMobileNumber(), MOBILE));
		if ((!StringUtils.isEmpty(customerTxnDao.getInstiTaxNo()) && (customerTxnDao.getInstiTaxNo().length() <= 15)))
			customerTxnDao.setInstiTaxNo(CryptoUtil.encrypt(customerTxnDao.getInstiTaxNo(), INSTI_TAX_NO));
		if ((!StringUtils.isEmpty(customerTxnDao.getCustTaxNo()) && (customerTxnDao.getCustTaxNo().length() <= 10)))
			customerTxnDao.setCustTaxNo(CryptoUtil.encrypt(customerTxnDao.getCustTaxNo(), CUST_TAX_NO));
		if (!StringUtils.isEmpty(customerTxnDao.getPassportId()))
			customerTxnDao.setPassportId(CryptoUtil.encrypt(customerTxnDao.getPassportId(), PASSPORT_ID));
		if((!StringUtils.isEmpty(customerTxnDao.getCustTaxNoOld()) && (customerTxnDao.getCustTaxNoOld().length() <= 10)))
			customerTxnDao.setCustTaxNoOld(CryptoUtil.encrypt(customerTxnDao.getCustTaxNoOld(), CUST_TAX_NO_OLD));			
		return customerTxnDao;
		
	}
	
	private CustomerTxnDaoExt decryptCustomerTxnDao(CustomerTxnDaoExt customerTxnDao) {
		// TODO Auto-generated method stub
		if (!StringUtils.isEmpty(customerTxnDao.getCustomerName()))
			customerTxnDao.setCustomerName(CryptoUtil.decrypt(customerTxnDao.getCustomerName(), CUSTOMER_NAME,false));
		if (!StringUtils.isEmpty(customerTxnDao.getEmailId()))
			customerTxnDao.setEmailId(CryptoUtil.decrypt(customerTxnDao.getEmailId(), EMAIL,false));
		if (!StringUtils.isEmpty(customerTxnDao.getMobileNumber()))
			customerTxnDao.setMobileNumber(CryptoUtil.decrypt(customerTxnDao.getMobileNumber(), MOBILE,false));
		if ((!StringUtils.isEmpty(customerTxnDao.getInstiTaxNo()) && (customerTxnDao.getInstiTaxNo().length() <= 15)))
			customerTxnDao.setInstiTaxNo(CryptoUtil.decrypt(customerTxnDao.getInstiTaxNo(), INSTI_TAX_NO,false));
		if ((!StringUtils.isEmpty(customerTxnDao.getCustTaxNo()) && (customerTxnDao.getCustTaxNo().length() <= 10)))
			customerTxnDao.setCustTaxNo(CryptoUtil.decrypt(customerTxnDao.getCustTaxNo(), CUST_TAX_NO,false));
		if (!StringUtils.isEmpty(customerTxnDao.getPassportId()))
			customerTxnDao.setPassportId(CryptoUtil.decrypt(customerTxnDao.getPassportId(), PASSPORT_ID,false));
		if((!StringUtils.isEmpty(customerTxnDao.getCustTaxNoOld()) && (customerTxnDao.getCustTaxNoOld().length() <= 10)))
			customerTxnDao.setCustTaxNoOld(CryptoUtil.decrypt(customerTxnDao.getCustTaxNoOld(), CUST_TAX_NO_OLD,false));			
		return customerTxnDao;
		
	}

	@Override
	public Integer decryptCustomeDetailsByChunk(Pageable pageable, Boolean isPageable) {
		if (!isPageable.booleanValue()) {
			pageable = PageRequest.of(0, 100, pageable.getSort());
		} else if (BooleanUtils.isTrue(isPageable) && (pageable == null || pageable.getPageSize() == 0)) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"Page details needed", Map.of("remarks", "Pagination details needed"));
		}
		CustomerDao customer = new CustomerDao();
		customer.setIsEncrypted(Boolean.TRUE);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<CustomerDao> criteria = Example.of(customer, matcher);

		Page<CustomerDao> customerList = customerRepo.findAll(criteria, pageable);

		if (customerList == null || CollectionUtil.isEmpty(customerList.getContent())) {
			return 0;
		}
		customerList.getContent().forEach(customerDao -> {
			decryptCustomerDao(customerDao);
			customerDao.setIsEncrypted(Boolean.FALSE);
		});

		customerRepo.saveAll(customerList.getContent());
		return customerList.getContent().size();
	}

	//API TO DECRYPT THE CUSTOMER TRANSACTION TABLE
	@Override
	public Integer decryptCustomerTxnDetailsByChunk(Pageable pageable, Boolean isPageable) {
		if (!isPageable.booleanValue()) {
			pageable = PageRequest.of(0, 100, pageable.getSort());
		} else if (BooleanUtils.isTrue(isPageable) && (pageable == null || pageable.getPageSize() == 0)) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"Page details needed", Map.of("remarks", "Pagination details needed"));
		}
		CustomerTxnDaoExt customer = new CustomerTxnDaoExt();
		customer.setIsEncrypted(Boolean.TRUE);
		
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<CustomerTxnDaoExt> criteria = Example.of(customer, matcher);
		
		Page<CustomerTxnDaoExt> customerTxnList = customerTxnRepositoryExt.findAll(criteria, pageable);
		if (customerTxnList == null || CollectionUtil.isEmpty(customerTxnList.getContent())) {
			return 0;
		}
		customerTxnList.getContent().forEach(CustomerTxnDaoExt -> {
			decryptCustomerTxnDao(CustomerTxnDaoExt);
			CustomerTxnDaoExt.setIsEncrypted(Boolean.FALSE);
		});

    
		customerTxnRepositoryExt.saveAll(customerTxnList.getContent());
		return customerTxnList.getContent().size();		
		
	}

}
