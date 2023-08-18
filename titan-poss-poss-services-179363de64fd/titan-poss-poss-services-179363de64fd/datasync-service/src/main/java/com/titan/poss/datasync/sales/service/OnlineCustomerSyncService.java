/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.sales.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dao.SyncStaging;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.repository.DataSyncRepository;
import com.titan.poss.datasync.service.DataSyncDataService;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.EpossCallServiceImpl;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerUlpDao;
import com.titan.poss.sales.dto.CustomerDetailsDto;
import com.titan.poss.sales.dto.CustomerLocationMappingSyncDto;
import com.titan.poss.sales.dto.CustomerSyncDto;
import com.titan.poss.sales.dto.CustomerUlpSyncDto;
import com.titan.poss.sales.repository.CustomerLocationMappingRepository;
import com.titan.poss.sales.repository.CustomerRepository;
import com.titan.poss.sales.repository.CustomerUlpRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class OnlineCustomerSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private OnlineCustomerSyncService customerSynService;

	@Autowired
	private CustomerRepository customerRepo;

	@Autowired
	private CustomerLocationMappingRepository customerLocationRepo;

	@Autowired
	private CustomerUlpRepository customerUlpRepo;

	@Autowired
	private EpossCallServiceImpl serviceCall;

	@Autowired
	private DataSyncDataService syncDataService;

	@Autowired
	private DataSyncRepository dataSyncRepo;

	private static final Logger LOGGER = LoggerFactory.getLogger(OnlineCustomerSyncService.class);
	private static final String EXCEPTION = "exception : ";

	private static final String CUSTOMER_NAME = "customerName";

	private static final String EMAIL = "emailId";

	private static final String MOBILE = "mobileNo";

	private static final String INSTI_TAX_NO = "instiTaxNo";

	private static final String CUST_TAX_NO = "custTaxNo";

	private static final String PASSPORT_ID = "passportId";
	private static final String BEARER = "Bearer ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		String locationCode = messageTransfer.getMessageTransferData().getSource();
		String dest = messageTransfer.getMessageTransferData().getDestination();
		try {
			if (!operationCode.equals(SalesOperationCode.CUSTOMER_REVERSE)) {
				syncCustomerData(syncData, operationCode, messageId, locationCode, dest);
			} else {
				//syncCustomerReverseData(syncData, messageId, dest);
			}
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,
					messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,
					messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.FAILED_PERSIST.name(),
					ex.getMessage());
		}

	}

	private void syncCustomerData(List<SyncData> syncData, String operationCode, String messageId, String locationCode,
			String dest) {
		String token = OnlineCustomerSyncService.BEARER
				+ serviceCall.getAuthHeaderToken(VendorCodeEnum.POSS_TITAN.name());
		CustomerDetailsDto customerDetails = new CustomerDetailsDto();
		CustomerLocationMappingDao saveCustomerLocation = null;
		CustomerUlpDao customerUlp = null;
		ObjectMapper mapper = new ObjectMapper();
		for (SyncData data : syncData) {
			if (data.getOrder() == 0) {
				customerDetails = syncCustomer(data, mapper, operationCode);
			} else if (data.getOrder() == 1) {
				customerUlp = syncCustomerUlp(data, mapper);
			} else if (data.getOrder() == 2) {
				saveCustomerLocation = syncCustomerLocation(data, mapper);
			}
		}
		if(customerDetails.getRemoveCustomer() !=null ) 
			customerSynService.customerDelete(customerDetails.getRemoveCustomer());
		SyncStagingDto syncDto = customerSynService.dbOperation(customerDetails.getCustomer(), saveCustomerLocation, customerUlp,
				operationCode, messageId, locationCode, dest,customerDetails.getRemoveCustomer());
		
		if (syncDto != null) {
//			syncDataService.publishDataSyncDataToQueue(token, syncDto);
		}

	}

	private void syncCustomerReverseData(List<SyncData> syncData, String messageId, String dest) {
		CustomerDetailsDto customerDetails = new CustomerDetailsDto();
		CustomerLocationMappingDao saveCustomerLocation = null;
		CustomerUlpDao saveCustomerUlp = null;
		ObjectMapper mapper = new ObjectMapper();
		for (SyncData data : syncData) {
			if (data.getOrder() == 0) {
				saveCustomerUlp = syncCustomerUlp(data, mapper);
			} else if (data.getOrder() == 1) {
				customerDetails = syncCustomerReverse(data, mapper);
			} else if (data.getOrder() == 2) {
				saveCustomerLocation = syncCustomerLocation(data, mapper);
			}
		}
		customerSynService.dbOperation(saveCustomerUlp, customerDetails.getCustomer(),
				customerDetails.getRemoveCustomer(), saveCustomerLocation, messageId, dest);

	}

	private CustomerDetailsDto syncCustomerReverse(SyncData data, ObjectMapper mapper) {
		CustomerSyncDto syncDto = new CustomerSyncDto();
		CustomerDetailsDto customerDetail = new CustomerDetailsDto();
		CustomerDao srcCustomer = syncDto
				.getCustomerDao(mapper.convertValue(data.getData(), new TypeReference<CustomerSyncDto>() {
				}));
		srcCustomer = decryptCustomerDao(srcCustomer);
		CustomerDao destCustomer = null;
		if (CustomerTypeEnum.REGULAR.name().equalsIgnoreCase(srcCustomer.getCustomerType())) {
			destCustomer = customerRepo.findByUlpId(srcCustomer.getUlpId());
		} else if (CustomerTypeEnum.INTERNATIONAL.name().equalsIgnoreCase(srcCustomer.getCustomerType())) {
			destCustomer = customerRepo.findOneByPassportId(srcCustomer.getPassportId());
		} else if (CustomerTypeEnum.INSTITUTIONAL.name().equalsIgnoreCase(srcCustomer.getCustomerType())
				&& srcCustomer.getInstiTaxNo() != null) {
			destCustomer = customerRepo.findOneByInstiTaxNo(srcCustomer.getInstiTaxNo());
		}
		if (destCustomer == null) {
			int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
			srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
			srcCustomer.setDestSyncId(tempSrcDataSyncId);
			customerDetail.setCustomer(srcCustomer);
		} else {
			if (destCustomer.getId().equalsIgnoreCase(srcCustomer.getId())) {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCustomer.getSrcSyncId(),
						srcCustomer.getDestSyncId(), destCustomer.getSrcSyncId(), destCustomer.getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
					srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
					srcCustomer.setDestSyncId(tempSrcDataSyncId);
					customerDetail.setCustomer(srcCustomer);
				}
			} else {
				int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
				srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
				srcCustomer.setDestSyncId(tempSrcDataSyncId);
				customerDetail.setCustomer(srcCustomer);
				customerDetail.setRemoveCustomer(destCustomer);
			}
		}
		return customerDetail;
	}

	private CustomerLocationMappingDao syncCustomerLocation(SyncData data, ObjectMapper mapper) {
		CustomerLocationMappingSyncDto syncDto = new CustomerLocationMappingSyncDto();
		CustomerLocationMappingDao srcDao = syncDto.getCustomerLocationMappingDao(
				mapper.convertValue(data.getData(), new TypeReference<CustomerLocationMappingSyncDto>() {
				}));

		Optional<CustomerLocationMappingDao> destDao = customerLocationRepo
				.findById(srcDao.getCustomerLocationMappingId());
		if (!destDao.isPresent()) {
			int tempSrcDataSyncId = srcDao.getSrcSyncId();
			srcDao.setSrcSyncId(srcDao.getDestSyncId());
			srcDao.setDestSyncId(tempSrcDataSyncId);
			return srcDao;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDao.getSrcSyncId(), srcDao.getDestSyncId(),
					destDao.get().getSrcSyncId(), destDao.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcDao.getSrcSyncId();
				srcDao.setSrcSyncId(srcDao.getDestSyncId());
				srcDao.setDestSyncId(tempSrcDataSyncId);
				return srcDao;
			}
		}
		return null;
	}

	private CustomerUlpDao syncCustomerUlp(SyncData data, ObjectMapper mapper) {
		CustomerUlpSyncDto syncDto = new CustomerUlpSyncDto();
		CustomerUlpDao srcUlp = syncDto
				.getCustomerUlp(mapper.convertValue(data.getData(), new TypeReference<CustomerUlpSyncDto>() {
				}));
		Optional<CustomerUlpDao> destUlp = customerUlpRepo.findById(srcUlp.getUlpId());
		if (!destUlp.isPresent()) {
			int tempSrcDataSyncId = srcUlp.getSrcSyncId();
			srcUlp.setSrcSyncId(srcUlp.getDestSyncId());
			srcUlp.setDestSyncId(tempSrcDataSyncId);
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcUlp.getSrcSyncId(), srcUlp.getDestSyncId(),
					destUlp.get().getSrcSyncId(), destUlp.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcUlp.getSrcSyncId();
				srcUlp.setSrcSyncId(srcUlp.getDestSyncId());
				srcUlp.setDestSyncId(tempSrcDataSyncId);
			}
		}
		return srcUlp;
	}

	private CustomerDetailsDto syncCustomer(SyncData data, ObjectMapper mapper, String operationCode) {
		CustomerSyncDto syncDto = new CustomerSyncDto();
		CustomerDetailsDto customerDetail = new CustomerDetailsDto();
		CustomerDao srcCustomer = syncDto
				.getCustomerDao(mapper.convertValue(data.getData(), new TypeReference<CustomerSyncDto>() {
				}));
		srcCustomer = decryptCustomerDao(srcCustomer);
		CustomerDao destCustomer = null;
		if (SalesOperationCode.CUSTOMER_REGULAR.equals(operationCode)) {
			destCustomer = customerRepo.findByUlpId(srcCustomer.getUlpId());
		} else if (SalesOperationCode.CUSTOMER_INTERNATIONAL.equals(operationCode)) {
			destCustomer = customerRepo.findOneByPassportId(srcCustomer.getPassportId());
		} else if (SalesOperationCode.CUSTOMER_INSTITUTIONAL.equals(operationCode)
				&& srcCustomer.getInstiTaxNo() != null) {
			destCustomer = customerRepo.findOneByInstiTaxNo(srcCustomer.getInstiTaxNo());
		} else if (SalesOperationCode.CUSTOMER_UPDATE.equals(operationCode)
				|| SalesOperationCode.CUSTOMER_ONETIME.equals(operationCode)) {
			
			if(srcCustomer.getCustomerType().equals(CustomerTypeEnum.REGULAR.name()))
				destCustomer = customerRepo.findByUlpId(srcCustomer.getUlpId());
			else if(srcCustomer.getCustomerType().equals(CustomerTypeEnum.INSTITUTIONAL.name()))
					destCustomer = customerRepo.findOneByInstiTaxNo(srcCustomer.getInstiTaxNo());
			else if(srcCustomer.getCustomerType().equals(CustomerTypeEnum.INTERNATIONAL.name()))
				destCustomer = customerRepo.findOneByPassportId(srcCustomer.getPassportId());
			else {
	            Optional<CustomerDao> custDao = customerRepo.findById(srcCustomer.getId());
	            if (custDao.isPresent()) {
	                destCustomer = custDao.get();
	            }
			}
		}
		if (destCustomer == null) {
			int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
			srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
			srcCustomer.setDestSyncId(tempSrcDataSyncId);
			customerDetail.setCustomer(srcCustomer);
		} else {
			if (destCustomer.getId().equalsIgnoreCase(srcCustomer.getId())) {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCustomer.getSrcSyncId(),
						srcCustomer.getDestSyncId(), destCustomer.getSrcSyncId(), destCustomer.getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
					srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
					srcCustomer.setDestSyncId(tempSrcDataSyncId);
					customerDetail.setCustomer(srcCustomer);
				}
			} else {
				int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
				srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
				srcCustomer.setDestSyncId(tempSrcDataSyncId);
				customerDetail.setCustomer(srcCustomer);
				customerDetail.setRemoveCustomer(destCustomer);
			}
		}
		return customerDetail;
	}

	@Transactional(value = "chainedTransaction")
	public SyncStagingDto dbOperation(CustomerDao customer, CustomerLocationMappingDao saveCustomerLocation,
			CustomerUlpDao customerUlp, String operationCode, String messageId, String locationCode, String dest,CustomerDao removeCustomer) {
		boolean flag = false;
		if (customer != null) {
			LOGGER.info("save customer " +customer.toString());
			//customer.setSrcSyncId(customer.getSrcSyncId() + 1);
			customer = customerRepo.save(encryptCustomerDao(customer));
			flag = true;
		}
		
		if (customerUlp != null) {
			//customerUlp.setSrcSyncId(customerUlp.getSrcSyncId() + 1);
			customerUlp = customerUlpRepo.save(customerUlp);
			flag = true;
		}
		if (saveCustomerLocation != null) {
			//saveCustomerLocation.setSrcSyncId(saveCustomerLocation.getSrcSyncId() + 1);
			saveCustomerLocation = customerLocationRepo.save(saveCustomerLocation);
			flag = true;
		}
		if (flag) {
			datasyncAuditService.updateDatasyncAuditStatusById(messageId, dest, DatasyncStatusEnum.SYNCED.name());
		} else {
			datasyncAuditService.updateDatasyncAuditStatusById(messageId, dest, DatasyncStatusEnum.DISCARDED.name());
		}
		SyncStagingDto syncDto = null;
//		if (!(SalesOperationCode.CUSTOMER_UPDATE.equals(operationCode)
//				|| SalesOperationCode.CUSTOMER_LOCATION.equals(operationCode)
//				|| SalesOperationCode.CUSTOMER_ONETIME.equals(operationCode))) {
//			syncDto = customerStagging(customer, customerUlp, saveCustomerLocation, SalesOperationCode.CUSTOMER_REVERSE,
//					locationCode);
//		}
		return syncDto;
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void customerDelete(CustomerDao removeCustomer) {
		LOGGER.info("delete customer " +removeCustomer.toString());
		customerRepo.delete(removeCustomer);
	}

	private SyncStagingDto customerStagging(CustomerDao customer, CustomerUlpDao customerUlp,
			CustomerLocationMappingDao saveCustomerLocation, String operation, String locationCode) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		if (customerUlp != null) {
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerUlpSyncDto(customerUlp), 0));
		}
		if (customer != null) {
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerSyncDto(customer), 1));
		}
		if (saveCustomerLocation != null) {
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerLocationMappingSyncDto(saveCustomerLocation), 2));

		}
		destinations.add(locationCode);
		MessageRequest customerMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
		SyncStagingDto customerStagingDto = new SyncStagingDto();
		customerStagingDto.setMessageRequest(customerMsgRequest);
		String customerMsgRqst = MapperUtil.getJsonString(customerMsgRequest);
		SyncStaging customerSyncStaging = new SyncStaging();
		customerSyncStaging.setMessage(customerMsgRqst);
		customerSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		customerSyncStaging = dataSyncRepo.save(customerSyncStaging);
		customerStagingDto.setId(customerSyncStaging.getId());
		return customerStagingDto;
	}

	@Transactional(value = "chainedTransaction")
	public void dbOperation(CustomerUlpDao saveCustomerUlp, CustomerDao saveCustomer, CustomerDao removeCustomer,
			CustomerLocationMappingDao saveCustomerLocation, String messageId, String dest) {
		boolean flag = false;
		if (removeCustomer != null) {
			customerRepo.delete(removeCustomer);
			customerRepo.flush();
			flag = true;
		}
		if (saveCustomer != null) {
			customerRepo.save(encryptCustomerDao(saveCustomer));
			flag = true;
		}
		if (saveCustomerLocation != null) {
			if (saveCustomer != null)
				saveCustomerLocation.setCustomer(saveCustomer);
			customerLocationRepo.save(saveCustomerLocation);
			flag = true;
		}
		if (saveCustomerUlp != null) {
			customerUlpRepo.save(saveCustomerUlp);
			flag = true;
		}
		if (flag) {
			datasyncAuditService.updateDatasyncAuditStatusById(messageId, dest, DatasyncStatusEnum.SYNCED.name());
		} else {
			datasyncAuditService.updateDatasyncAuditStatusById(messageId, dest, DatasyncStatusEnum.DISCARDED.name());
		}
	}

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

	public CustomerDao decryptCustomerDao(CustomerDao customerDao) {
		if (customerDao != null) {
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
		}
		return customerDao;
	}
}
