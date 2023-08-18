//package com.titan.poss.datasync.sales.service;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//
//import org.apache.commons.lang.StringUtils;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.dao.DataIntegrityViolationException;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.fasterxml.jackson.core.type.TypeReference;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
//import com.titan.poss.core.dto.CustomerAddDto;
//import com.titan.poss.core.dto.CustomerDto;
//import com.titan.poss.core.dto.DestinationType;
//import com.titan.poss.core.dto.MessageRequest;
//import com.titan.poss.core.dto.MessageType;
//import com.titan.poss.core.dto.SyncData;
//import com.titan.poss.core.enums.CustomerSearchTypeEnum;
//import com.titan.poss.core.exception.ServiceException;
//import com.titan.poss.core.service.clients.IntegrationServiceClient;
//import com.titan.poss.core.utils.CryptoUtil;
//import com.titan.poss.core.utils.MapperUtil;
//import com.titan.poss.datasync.constant.DatasyncStatusEnum;
//import com.titan.poss.datasync.constant.SalesOperationCode;
//import com.titan.poss.datasync.dao.SyncStaging;
//import com.titan.poss.datasync.dto.MessageTransfer;
//import com.titan.poss.datasync.dto.SyncStagingDto;
//import com.titan.poss.datasync.repository.DataSyncRepository;
//import com.titan.poss.datasync.service.DataSyncDataService;
//import com.titan.poss.datasync.service.DatasyncAuditService;
//import com.titan.poss.datasync.service.EpossCallServiceImpl;
//import com.titan.poss.datasync.service.SyncOperation;
//import com.titan.poss.datasync.util.DataSyncUtil;
//import com.titan.poss.datasync.util.ReceiverUtil;
//import com.titan.poss.sales.dao.CustomerDao;
//import com.titan.poss.sales.dao.CustomerLocationMappingDao;
//import com.titan.poss.sales.dao.CustomerUlpDao;
//import com.titan.poss.sales.dto.CustomerDetailsDto;
//import com.titan.poss.sales.dto.CustomerLocationMappingSyncDto;
//import com.titan.poss.sales.dto.CustomerSyncDto;
//import com.titan.poss.sales.dto.CustomerUlpSyncDto;
//import com.titan.poss.sales.repository.CustomerLocationMappingRepository;
//import com.titan.poss.sales.repository.CustomerRepository;
//import com.titan.poss.sales.repository.CustomerUlpRepository;
//
//@Service
//public class CustomerSyncService implements SyncOperation {
//
//	@Autowired
//	private DatasyncAuditService datasyncAuditService;
//
//	@Autowired
//	private IntegrationServiceClient integrationService;
//
//	@Autowired
//	CustomerSyncService customerSynService;
//
//	@Autowired
//	CustomerRepository customerRepo;
//
//	@Autowired
//	CustomerLocationMappingRepository customerLocationRepo;
//
//	@Autowired
//	CustomerUlpRepository customerUlpRepo;
//
//	@Autowired
//	EpossCallServiceImpl serviceCall;
//
//	@Autowired
//	DataSyncDataService syncDataService;
//
//	@Autowired
//	DataSyncRepository dataSyncRepo;
//
//	private static final Logger LOGGER = LoggerFactory.getLogger(CustomerSyncService.class);
//	private static final String EXCEPTION = "exception : ";
//
//	private static final String CUSTOMER_NAME = "customerName";
//
//	private static final String EMAIL = "emailId";
//
//	private static final String MOBILE = "mobileNo";
//
//	private static final String INSTI_TAX_NO = "instiTaxNo";
//
//	private static final String CUST_TAX_NO = "custTaxNo";
//
//	private static final String PASSPORT_ID = "passportId";
//	private static final String BEARER = "Bearer ";
//	private String token = null;
//
//	@Override
//	public void operation(MessageTransfer messageTransfer) {
//		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
//		String messageId = messageTransfer.getMessageTransferData().getId();
//		String operationCode = messageTransfer.getMessageTransferData().getOperation();
//		String locationCode = messageTransfer.getMessageTransferData().getSource();
//		try {
//			
//			if (!operationCode.equals(SalesOperationCode.CUSTOMER_REVERSE)) {
//				syncCustomerData(syncData, messageId, operationCode, locationCode);
//			} else {
//				syncCustomerReverseData(syncData, messageId);
//			}
//		} catch (DataIntegrityViolationException ex) {
//			LOGGER.error(EXCEPTION, ex);
//			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
//					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
//		} catch (Exception ex) {
//			LOGGER.error(EXCEPTION, ex);
//			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
//					DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
//		}
//	}
//
//	public void syncCustomerData(List<SyncData> syncData, String messageId, String operationCode, String locationCode) {
//		token = CustomerSyncService.BEARER + serviceCall.getAuthHeaderToken(VendorCodeEnum.POSS_TITAN.name());
//		CustomerDetailsDto customerDetails = new CustomerDetailsDto();
//		CustomerLocationMappingDao saveCustomerLocation = null;
//		ObjectMapper mapper = new ObjectMapper();
//		for (SyncData data : syncData) {
//			if (data.getOrder() == 0) {
//				customerDetails = syncCustomer(data, mapper, operationCode, locationCode);
//			} else if (data.getOrder() == 1) {
//				customerDetails.setCustomerUlp(syncCustomerUlp(data, mapper));
//			} else if (data.getOrder() == 2) {
//				saveCustomerLocation = syncCustomerLocation(data, mapper);
//			}
//		}
//		SyncStagingDto syncDto = customerSynService.dbOperation(customerDetails.getCustomer(), saveCustomerLocation,
//				customerDetails.getCustomerUlp(), messageId, locationCode);
//		syncDataService.publishDataSyncDataToQueue(token, syncDto);
//	}
//
//	public CustomerDetailsDto syncCustomer(SyncData data, ObjectMapper mapper, String operationCode,
//			String locationCode) {
//		CustomerSyncDto syncDto = new CustomerSyncDto();
//		CustomerDao srcCustomer = syncDto
//				.getCustomerDao(mapper.convertValue(data.getData(), new TypeReference<CustomerSyncDto>() {
//				}));
//		srcCustomer = decryptCustomerDao(srcCustomer);
//		CustomerDao destCustomer = null;
//		CustomerDetailsDto customerDetails = new CustomerDetailsDto();
//		if (SalesOperationCode.CUSTOMER_REGULAR.equals(operationCode)) {
//			CustomerDto customerDto = null;
//			CustomerUlpDao ulpDao = null;
//			if (srcCustomer.getUlpId() != null) {
//				destCustomer = customerRepo.findByUlpId(srcCustomer.getUlpId());
//			}
//			destCustomer = decryptCustomerDao(destCustomer);
//			if (destCustomer == null) {
//				try {
//					customerDto = callCreateLoyaltyCustomer(srcCustomer, locationCode);
//					destCustomer = (CustomerDao) MapperUtil.getObjectMapping(customerDto, new CustomerDao());
//					destCustomer = (CustomerDao) MapperUtil.getObjectMapping(srcCustomer, destCustomer);
//					destCustomer = (CustomerDao) MapperUtil.getObjectMapping(srcCustomer.getCustomerDetails(),
//							destCustomer);
//				} catch (ServiceException e) {
//					if (e.getErrorCode().equals("ERR-INT-011")) {
//						customerDto = callSearchLoyaltyCustomer(srcCustomer, locationCode);
//						destCustomer = (CustomerDao) MapperUtil.getObjectMapping(customerDto, new CustomerDao());
//						destCustomer = (CustomerDao) MapperUtil.getObjectMapping(srcCustomer, destCustomer,
//								CUSTOMER_NAME);
//						destCustomer = (CustomerDao) MapperUtil.getObjectMapping(srcCustomer.getCustomerDetails(),
//								destCustomer, CUSTOMER_NAME);
//					} else {
//						throw new ServiceException(e.getMessage(), e.getErrorCode());
//					}
//				}
//				ulpDao = (CustomerUlpDao) MapperUtil.getObjectMapping(customerDto, new CustomerUlpDao());
//				ulpDao.setUlpId(srcCustomer.getUlpId());
//				ulpDao.setSrcSyncId(0);
//				ulpDao.setDestSyncId(0);
//				if (ulpDao.getIsPulseCustomer() == null) {
//					ulpDao.setIsPulseCustomer(false);
//				}
//			} else {
//				customerDto = callSearchLoyaltyCustomer(srcCustomer, locationCode);
//				String id = destCustomer.getId();
//				destCustomer = (CustomerDao) MapperUtil.getObjectMapping(customerDto, destCustomer);
//				destCustomer = (CustomerDao) MapperUtil.getObjectMapping(srcCustomer, destCustomer, CUSTOMER_NAME);
//				destCustomer = (CustomerDao) MapperUtil.getObjectMapping(srcCustomer.getCustomerDetails(), destCustomer,
//						CUSTOMER_NAME);
//				destCustomer.setId(id);
//				Optional<CustomerUlpDao> ulp = customerUlpRepo.findById(destCustomer.getUlpId());
//				if (ulp.isPresent()) {
//					ulpDao = (CustomerUlpDao) MapperUtil.getObjectMapping(customerDto, ulp.get());
//				} else {
//					ulpDao = (CustomerUlpDao) MapperUtil.getObjectMapping(customerDto, new CustomerUlpDao());
//					ulpDao.setSrcSyncId(0);
//					ulpDao.setDestSyncId(0);
//				}
//			}
//			customerDetails.setCustomer(destCustomer);
//			customerDetails.setCustomerUlp(ulpDao);
//			return customerDetails;
//		} else if (SalesOperationCode.CUSTOMER_INTERNATIONAL.equals(operationCode)) {
//			destCustomer = customerRepo.findOneByPassportId(srcCustomer.getPassportId());
//		} else if (SalesOperationCode.CUSTOMER_INSTITUTIONAL.equals(operationCode)) {
//			destCustomer = customerRepo.findOneByInstiTaxNo(srcCustomer.getInstiTaxNo());
//		} else if (SalesOperationCode.CUSTOMER_UPDATE.equals(operationCode)) {
//			Optional<CustomerDao> custDao = customerRepo.findById(srcCustomer.getId());
//			if (custDao.isPresent()) {
//				destCustomer = custDao.get();
//			}
//		}
//		if (destCustomer == null) {
//			int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
//			srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
//			srcCustomer.setDestSyncId(tempSrcDataSyncId);
//			customerDetails.setCustomer(srcCustomer);
//		} else {
//			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCustomer.getSrcSyncId(), srcCustomer.getDestSyncId(),
//					destCustomer.getSrcSyncId(), destCustomer.getDestSyncId());
//			if (status.equals(DatasyncStatusEnum.SYNCED)) {
//				int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
//				srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
//				srcCustomer.setDestSyncId(tempSrcDataSyncId);
//				srcCustomer.setId(destCustomer.getId());
//				customerDetails.setCustomer(srcCustomer);
//			}
//		}
//		return customerDetails;
//	}
//
//	public CustomerLocationMappingDao syncCustomerLocation(SyncData data, ObjectMapper mapper) {
//		CustomerLocationMappingSyncDto syncDto = new CustomerLocationMappingSyncDto();
//		CustomerLocationMappingDao srcDao = syncDto.getCustomerLocationMappingDao(
//				mapper.convertValue(data.getData(), new TypeReference<CustomerLocationMappingSyncDto>() {
//				}));
//
//		Optional<CustomerLocationMappingDao> destDao = customerLocationRepo
//				.findById(srcDao.getCustomerLocationMappingId());
//		if (!destDao.isPresent()) {
//			int tempSrcDataSyncId = srcDao.getSrcSyncId();
//			srcDao.setSrcSyncId(srcDao.getDestSyncId());
//			srcDao.setDestSyncId(tempSrcDataSyncId);
//			return srcDao;
//		} else {
//			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDao.getSrcSyncId(), srcDao.getDestSyncId(),
//					destDao.get().getSrcSyncId(), destDao.get().getDestSyncId());
//			if (status.equals(DatasyncStatusEnum.SYNCED)) {
//				int tempSrcDataSyncId = srcDao.getSrcSyncId();
//				srcDao.setSrcSyncId(srcDao.getDestSyncId());
//				srcDao.setDestSyncId(tempSrcDataSyncId);
//				return srcDao;
//			}
//		}
//		return null;
//	}
//
//	@Transactional(value="chainedTransaction")
//	public SyncStagingDto dbOperation(CustomerDao saveCustomer, CustomerLocationMappingDao saveCustomerLocation,
//			CustomerUlpDao customerUlp, String messageId, String locationCode) {
//		boolean flag = false;
//		if (saveCustomer != null) {
//			saveCustomer.setSrcSyncId(saveCustomer.getSrcSyncId() + 1);
//			saveCustomer = customerRepo.save(encryptCustomerDao(saveCustomer));
//			flag = true;
//		}
//		if (customerUlp != null) {
//			customerUlp.setSrcSyncId(customerUlp.getSrcSyncId() + 1);
//			customerUlp = customerUlpRepo.save(customerUlp);
//			flag = true;
//		}
//		if (saveCustomerLocation != null) {
//			saveCustomerLocation.setSrcSyncId(saveCustomerLocation.getSrcSyncId() + 1);
//			saveCustomerLocation.setCustomer(saveCustomer);
//			saveCustomerLocation = customerLocationRepo.save(saveCustomerLocation);
//			flag = true;
//		}
//		if (flag) {
//			datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.SYNCED.name());
//		} else {
//			datasyncAuditService.updateDatasyncAuditStatusById(messageId, DatasyncStatusEnum.DISCARDED.name());
//		}
//		return customerStagging(saveCustomer, customerUlp, saveCustomerLocation, SalesOperationCode.CUSTOMER_REVERSE,
//				locationCode);
//	}
//
//	public SyncStagingDto customerStagging(CustomerDao saveCustomer, CustomerUlpDao customerUlp,
//			CustomerLocationMappingDao saveCustomerLocation, String operation, String locationCode) {
//		List<SyncData> syncDataList = new ArrayList<>();
//		List<String> destinations = new ArrayList<>();
//		if (customerUlp != null) {
//			syncDataList.add(DataSyncUtil.createSyncData(new CustomerUlpSyncDto(customerUlp), 0));
//		}
//		if (saveCustomer != null) {
//			syncDataList.add(DataSyncUtil.createSyncData(new CustomerSyncDto(saveCustomer), 1));
//		}
//		if (saveCustomerLocation != null) {
//			syncDataList.add(DataSyncUtil.createSyncData(new CustomerLocationMappingSyncDto(saveCustomerLocation), 2));
//
//		}
//		destinations.add(locationCode);
//		MessageRequest customerMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
//				MessageType.GENERAL.toString(), DestinationType.SELECTIVE.toString());
//		SyncStagingDto customerStagingDto = new SyncStagingDto();
//		customerStagingDto.setMessageRequest(customerMsgRequest);
//		String customerMsgRqst = MapperUtil.getJsonString(customerMsgRequest);
//		SyncStaging customerSyncStaging = new SyncStaging();
//		customerSyncStaging.setMessage(customerMsgRqst);
//		customerSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
//		customerSyncStaging = dataSyncRepo.save(customerSyncStaging);
//		customerStagingDto.setId(customerSyncStaging.getId());
//		return customerStagingDto;
//	}
//
//	public CustomerDao encryptCustomerDao(CustomerDao customerDao) {
//		if (!StringUtils.isEmpty(customerDao.getCustomerName()))
//			customerDao.setCustomerName(CryptoUtil.encrypt(customerDao.getCustomerName(), CUSTOMER_NAME));
//		if (!StringUtils.isEmpty(customerDao.getEmailId()))
//			customerDao.setEmailId(CryptoUtil.encrypt(customerDao.getEmailId(), EMAIL));
//		if (!StringUtils.isEmpty(customerDao.getMobileNumber()))
//			customerDao.setMobileNumber(CryptoUtil.encrypt(customerDao.getMobileNumber(), MOBILE));
//		if (!StringUtils.isEmpty(customerDao.getInstiTaxNo()))
//			customerDao.setInstiTaxNo(CryptoUtil.encrypt(customerDao.getInstiTaxNo(), INSTI_TAX_NO));
//		if (!StringUtils.isEmpty(customerDao.getCustTaxNo()))
//			customerDao.setCustTaxNo(CryptoUtil.encrypt(customerDao.getCustTaxNo(), CUST_TAX_NO));
//		if (!StringUtils.isEmpty(customerDao.getPassportId()))
//			customerDao.setCustTaxNo(CryptoUtil.encrypt(customerDao.getPassportId(), PASSPORT_ID));
//		return customerDao;
//	}
//
//	public CustomerDao decryptCustomerDao(CustomerDao customerDao) {
//		if (customerDao != null) {
//			if (!StringUtils.isEmpty(customerDao.getCustomerName()))
//				customerDao.setCustomerName(CryptoUtil.decrypt(customerDao.getCustomerName(), CUSTOMER_NAME));
//			if (!StringUtils.isEmpty(customerDao.getEmailId()))
//				customerDao.setEmailId(CryptoUtil.decrypt(customerDao.getEmailId(), EMAIL));
//			if (!StringUtils.isEmpty(customerDao.getMobileNumber()))
//				customerDao.setMobileNumber(CryptoUtil.decrypt(customerDao.getMobileNumber(), MOBILE));
//			if (!StringUtils.isEmpty(customerDao.getInstiTaxNo()))
//				customerDao.setInstiTaxNo(CryptoUtil.decrypt(customerDao.getInstiTaxNo(), INSTI_TAX_NO));
//			if (!StringUtils.isEmpty(customerDao.getCustTaxNo()))
//				customerDao.setCustTaxNo(CryptoUtil.decrypt(customerDao.getCustTaxNo(), CUST_TAX_NO));
//			if (!StringUtils.isEmpty(customerDao.getPassportId()))
//				customerDao.setCustTaxNo(CryptoUtil.decrypt(customerDao.getPassportId(), PASSPORT_ID));
//			return customerDao;
//		}
//		return null;
//	}
//
//	public void syncCustomerReverseData(List<SyncData> syncData, String messageId) {
//		CustomerDetailsDto customerDetails = new CustomerDetailsDto();
//		CustomerLocationMappingDao saveCustomerLocation = null;
//		CustomerUlpDao saveCustomerUlp = null;
//		ObjectMapper mapper = new ObjectMapper();
//		for (SyncData data : syncData) {
//			if (data.getOrder() == 0) {
//				saveCustomerUlp = syncCustomerUlp(data, mapper);
//			} else if (data.getOrder() == 1) {
//				customerDetails = syncCustomerReverse(data, mapper);
//			} else if (data.getOrder() == 2) {
//				saveCustomerLocation = syncCustomerLocation(data, mapper);
//			}
//		}
//		customerSynService.dbOperation(saveCustomerUlp, customerDetails.getCustomer(),
//				customerDetails.getRemoveCustomer(), saveCustomerLocation, messageId);
//
//	}
//
//	public CustomerUlpDao syncCustomerUlp(SyncData data, ObjectMapper mapper) {
//		CustomerUlpSyncDto syncDto = new CustomerUlpSyncDto();
//		CustomerUlpDao srcUlp = syncDto
//				.getCustomerUlp(mapper.convertValue(data.getData(), new TypeReference<CustomerUlpSyncDto>() {
//				}));
//		Optional<CustomerUlpDao> destUlp = customerUlpRepo.findById(srcUlp.getUlpId());
//		if (!destUlp.isPresent()) {
//			int tempSrcDataSyncId = srcUlp.getSrcSyncId();
//			srcUlp.setSrcSyncId(srcUlp.getDestSyncId());
//			srcUlp.setDestSyncId(tempSrcDataSyncId);
//			return srcUlp;
//		} else {
//			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcUlp.getSrcSyncId(), srcUlp.getDestSyncId(),
//					destUlp.get().getSrcSyncId(), destUlp.get().getDestSyncId());
//			if (status.equals(DatasyncStatusEnum.SYNCED)) {
//				int tempSrcDataSyncId = srcUlp.getSrcSyncId();
//				srcUlp.setSrcSyncId(srcUlp.getDestSyncId());
//				srcUlp.setDestSyncId(tempSrcDataSyncId);
//				return srcUlp;
//			}
//		}
//		return null;
//	}
//
//	public CustomerDetailsDto syncCustomerReverse(SyncData data, ObjectMapper mapper) {
//		CustomerSyncDto syncDto = new CustomerSyncDto();
//		CustomerDao srcCustomer = syncDto
//				.getCustomerDao(mapper.convertValue(data.getData(), new TypeReference<CustomerSyncDto>() {
//				}));
//		CustomerDao destCustomer = customerRepo.findByUlpId(srcCustomer.getUlpId());
//		if (destCustomer == null) {
//			int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
//			srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
//			srcCustomer.setDestSyncId(tempSrcDataSyncId);
//			CustomerDetailsDto customerDetail = new CustomerDetailsDto();
//			customerDetail.setCustomer(srcCustomer);
//			return customerDetail;
//		} else {
//			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCustomer.getSrcSyncId(), srcCustomer.getDestSyncId(),
//					destCustomer.getSrcSyncId(), destCustomer.getDestSyncId());
//			if (status.equals(DatasyncStatusEnum.SYNCED)) {
//				if (destCustomer.getId().equals(srcCustomer.getId())) {
//					int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
//					srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
//					srcCustomer.setDestSyncId(tempSrcDataSyncId);
//					CustomerDetailsDto customerDetail = new CustomerDetailsDto();
//					customerDetail.setCustomer(srcCustomer);
//					return customerDetail;
//				} else {
//					int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
//					srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
//					srcCustomer.setDestSyncId(tempSrcDataSyncId);
//					CustomerDetailsDto customerDetail = new CustomerDetailsDto();
//					customerDetail.setCustomer(srcCustomer);
//					customerDetail.setRemoveCustomer(destCustomer);
//					return customerDetail;
//				}
//
//			}
//		}
//		return null;
//	}
//
//	@Transactional(value="chainedTransaction")
//	public void dbOperation(CustomerUlpDao saveCustomerUlp, CustomerDao saveCustomer, CustomerDao removeCustomer,
//			CustomerLocationMappingDao saveCustomerLocation, String messageId) {
//		boolean flag = false;
//		if (saveCustomer != null) {
//			customerRepo.save(saveCustomer);
//			flag = true;
//		}
//		if (saveCustomerLocation != null) {
//			saveCustomerLocation.setCustomer(saveCustomer);
//			customerLocationRepo.save(saveCustomerLocation);
//			flag = true;
//		}
//		if (saveCustomerUlp != null) {
//			customerUlpRepo.save(saveCustomerUlp);
//			flag = true;
//		}
//		if (removeCustomer != null) {
//			customerRepo.delete(removeCustomer);
//			flag = true;
//		}
//		if (flag) {
//			datasyncAuditService.updateDatasyncAuditStatusById(messageId, DatasyncStatusEnum.SYNCED.name());
//		} else {
//			datasyncAuditService.updateDatasyncAuditStatusById(messageId, DatasyncStatusEnum.DISCARDED.name());
//		}
//	}
//
//	public CustomerDto callCreateLoyaltyCustomer(CustomerDao srcCustomer, String locationCode) {
//		CustomerAddDto customerAddDto = (CustomerAddDto) MapperUtil.getObjectMapping(srcCustomer, new CustomerAddDto());
//		customerAddDto = (CustomerAddDto) MapperUtil.getObjectMapping(srcCustomer.getCustomerDetails(), customerAddDto);
//		return integrationService.createLoyaltyCustomerWithHeader(token, VendorCodeEnum.ULP_NETCARROTS.name(),
//				locationCode, customerAddDto);
//	}
//
//	public CustomerDto callSearchLoyaltyCustomer(CustomerDao srcCustomer, String locationCode) {
//		if (srcCustomer.getUlpId() != null) {
//			return integrationService.searchLoyaltyCustomerWithHeader(token, VendorCodeEnum.ULP_NETCARROTS.name(),
//					CustomerSearchTypeEnum.ULP_ID.name(), locationCode, srcCustomer.getUlpId());
//		} else {
//			return integrationService.searchLoyaltyCustomerWithHeader(token, VendorCodeEnum.ULP_NETCARROTS.name(),
//					CustomerSearchTypeEnum.MOBILE_NO.name(), locationCode, srcCustomer.getMobileNumber());
//		}
//	}
//}
