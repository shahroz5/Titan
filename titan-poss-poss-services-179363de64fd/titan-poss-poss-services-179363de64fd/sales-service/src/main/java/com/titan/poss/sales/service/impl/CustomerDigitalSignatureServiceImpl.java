package com.titan.poss.sales.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.InvoiceDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerDigitalSignatureDaoExt;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dto.ApplicableTransactionTypesDto;
import com.titan.poss.sales.dto.CustomerDocumentTxnIdDto;
import com.titan.poss.sales.dto.DigitalSignatureResponseDto;
import com.titan.poss.sales.dto.constants.CustomerTypeEnum;
import com.titan.poss.sales.dto.request.CustomerDigitalSignatureRequestDto;
import com.titan.poss.sales.dto.response.CustomerDigitalSignatureResponseDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.repository.CustomerDigitalSignatureRepository;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.CustomerRepository;
import com.titan.poss.sales.repository.CustomerRepositoryExt;
import com.titan.poss.sales.service.CustomerDigitalSignatureService;
import com.titan.poss.sales.service.CustomerDocumentService;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.dto.request.CustomerUpdateDto;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Primary
@Service("CustomerDigitalSignatureService")
public class CustomerDigitalSignatureServiceImpl implements CustomerDigitalSignatureService {

	private static final String MOBILENOULPIDCANNOTBEEMPTY = "Both ulpId and mobileNo can't be empty";
	private static final String ERR_INT_049 = "ERR-INT-049";

	private static final String RECORDNOTFOUND = "Record not found";
	private static final String ERR_SALE_129 = "ERR-SALE-129";

	private static final String MOBILENUMBER = "mobileNumber";
	private static final String EMAIL = "emailId";
	private static final String CUSTOMERNAME = "customerName";

	private static final String ERR_SALE_048 = "ERR-SALE-048";
	private static final String INVALID_INPUTS = "Invalid inputs.";

	private static final String ERR_SALE_080 = "ERR-SALE-080";
	private static final String NO_CUSTOMER_AVAILABLE = "Add customer details before adding/updating an item.";

	@Autowired
	CustomerDigitalSignatureRepository customerDigitalSignatureRepository;

	@Autowired
	CustomerRepository customerRepo;

	@Autowired
	CustomerRepositoryExt customerRepoExt;

	@Value("${app.name}")
	private String appName;

	@Autowired
	private CustomerServiceImpl customerServiceImp;

	private List<CustomerDigitalSignatureResponseDto> customerDigitalSignatureResponseDto;

	@Autowired
	CustomerLocationMappingRepositoryExt customerLocationMappingRepositoryExt;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private PrintServiceImpl printServiceImpl;

	@Autowired
	CustomerDocumentService customerDocumentService;
	
	@Override
	public List<DigitalSignatureResponseDto> getCustomerDigitalSignatureData(String mobileNumber, String ulpNumber,String customerType) {

		if (mobileNumber == null && ulpNumber == null) {
			throw new ServiceException(MOBILENOULPIDCANNOTBEEMPTY, ERR_INT_049);
		}

		if (mobileNumber != null && !Pattern.matches(RegExConstants.MOBILE_REGEX, mobileNumber)) {
			throw new ServiceException(INVALID_INPUTS, ERR_SALE_048, MOBILENUMBER);
		}

		
		CustomerTypeEnum customerTypeEnum = CustomerTypeEnum.valueOf(customerType);
		
		customerDigitalSignatureResponseDto = customerDigitalSignatureRepository
				.getByMobileNumberOrUlpNumberOrLocationCode(CryptoUtil.encrypt(mobileNumber, MOBILENUMBER), ulpNumber,customerType,CommonUtil.getLocationCode());

//		if (customerDigitalSignatureResponseDto == null) {
//			throw new ServiceException(RECORDNOTFOUND, ERR_SALE_129);
//		}

		if (customerDigitalSignatureResponseDto == null) {
			throw new ServiceException(RECORDNOTFOUND, ERR_SALE_129);
		}

		return customerDetails(customerDigitalSignatureResponseDto);
	}

	@Override
	public DigitalSignatureResponseDto uploadFile(String digitalSignature, String mobileNumber,
			String customerTypeStr) {
		try {
			String tepTxnID = "";
			String gepTxnID = "";

			CustomerTypeEnum customerType = CustomerTypeEnum.valueOf(customerTypeStr);
			CustomerDigitalSignatureDaoExt customerSignatureDao = customerDigitalSignatureRepository
					.findByMobileNumberAndCustomerTypeAndLocationCode(CryptoUtil.encrypt(mobileNumber, MOBILENUMBER), customerTypeStr,CommonUtil.getLocationCode());

			if (customerSignatureDao != null && digitalSignature != null) {
				if (digitalSignature.contains("data:")) {
					customerSignatureDao.setDigitalSignature(digitalSignature);
				}
			}
			CustomerDigitalSignatureDaoExt customerSignatureDao1 = customerDigitalSignatureRepository
					.save(customerSignatureDao);

			ApplicableTransactionTypesDto applicableTransactionTypesDto = MapperUtil.mapObjToClass(
					customerSignatureDao.getApplicableTransactionTypes(), ApplicableTransactionTypesDto.class);

			if (applicableTransactionTypesDto != null
					&& applicableTransactionTypesDto.getData().isTEPDeclarationAndExchangeForm) {
				
				CustomerDocumentsDao cd = customerDocumentService.getOldCustomerDocumentByInput(
						customerSignatureDao1.getCustomer().getId(),PrintDocumentTypeEnum.TEP_DIGITAL_SIGNATURE.name(),
						PrintFileTypeEnum.INVOICE_PRINT.name());
				if(cd!=null) {
					cd.setIsActive(false);
					customerDocumentService.save(cd);	
				}
				ResponseEntity<Resource> tepResponse = printServiceImpl.generateDocument(
						PrintDocumentTypeEnum.TEP_DIGITAL_SIGNATURE.name(), "", PrintFileTypeEnum.INVOICE_PRINT.name(),
						customerSignatureDao1.getCustomer().getId(), InvoiceDocumentTypeEnum.PRINT.name(), false,null,false);

				tepTxnID = getTxnIdFromFilePath(tepResponse.getBody().getFile().getPath(), 2);
			}

			if (applicableTransactionTypesDto != null
					&& applicableTransactionTypesDto.getData().isGEPDeclarationAndExchangeForm) {
				CustomerDocumentsDao cd = customerDocumentService.
						getOldCustomerDocumentByInput(customerSignatureDao1.getCustomer().getId(),
								PrintDocumentTypeEnum.GEP_DIGITAL_SIGNATURE.name(), PrintFileTypeEnum.INVOICE_PRINT.name());
				if(cd!=null) {
					cd.setIsActive(false);
					customerDocumentService.save(cd);	
				}
				ResponseEntity<Resource> gepResponse = printServiceImpl.generateDocument(
						PrintDocumentTypeEnum.GEP_DIGITAL_SIGNATURE.name(), "", PrintFileTypeEnum.INVOICE_PRINT.name(),
						customerSignatureDao1.getCustomer().getId(), InvoiceDocumentTypeEnum.PRINT.name(), false,null,false);
				gepTxnID = getTxnIdFromFilePath(gepResponse.getBody().getFile().getPath(), 2);
			}

			CustomerDocumentTxnIdDto customerDocumentTxnIdDto = new CustomerDocumentTxnIdDto();

			if (!tepTxnID.isEmpty())
				customerDocumentTxnIdDto.setTepDeclarationTxnId(tepTxnID);
			if (!gepTxnID.isEmpty())
				customerDocumentTxnIdDto.setGepDeclarationTxnId(gepTxnID);

			customerSignatureDao1.setCustomerDocumentTxnId(
					MapperUtil.getJsonString(new JsonData("CUSTOMER_DOCUMENT_TXN_ID", customerDocumentTxnIdDto)));
			customerSignatureDao1 = customerDigitalSignatureRepository.save(customerSignatureDao);
			log.info("customerSignatureDao1",customerSignatureDao1);
			return savedCustomerDetails(customerSignatureDao1);
		} catch (Exception e) {
			log.info("exception>>>>",e);
// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	private String getTxnIdFromFilePath(String filePath, int index) {
		String[] docfilePath = filePath.split("\\\\");
		String txnId = docfilePath[docfilePath.length - index];
		return txnId;
	}

    @Override
    public DigitalSignatureResponseDto saveCustomerSignature(
            CustomerDigitalSignatureRequestDto customerDigitalSignatureRequestDto) {

       CustomerDigitalSignatureDaoExt customerSignatureDao;



       CustomerDigitalSignatureResponseDto customerDigitalSignatureResponseDao = customerDigitalSignatureRepository
                .fetchByMobileNumberAndCustomerType(
                        CryptoUtil.encrypt(customerDigitalSignatureRequestDto.getMobileNumber(), MOBILENUMBER),
                        customerDigitalSignatureRequestDto.getCustomerType(), CommonUtil.getLocationCode());



       if (customerDigitalSignatureResponseDao == null) {
            customerDigitalSignatureResponseDao = customerDigitalSignatureRepository
                    .searchOneCustomerByMobileNumberOrUlpId(
                            CryptoUtil.encrypt(customerDigitalSignatureRequestDto.getMobileNumber(), MOBILENUMBER),
                            customerDigitalSignatureRequestDto.getUlpNumber(),
                            customerDigitalSignatureRequestDto.getCustomerType(),customerDigitalSignatureRequestDto.getCustomerId());
        }



//       if (customerDigitalSignatureResponseDao == null) {
//            throw new ServiceException(NO_CUSTOMER_AVAILABLE, ERR_SALE_080);
//        }



       CustomerDao customerDao = customerRepo.findById(customerDigitalSignatureResponseDao.getCustomerId()).get();



       CustomerLocationMappingDao customerLocationMappingDao = customerLocationMappingRepositoryExt
                .findOneByCustomerAndCustomerLocationMappingIdLocationCode(customerDao, CommonUtil.getLocationCode());



       if (customerDao != null && customerDigitalSignatureRequestDto.getEmailId() != null) {
            CustomerUpdateDto updateCustomerDto = new CustomerUpdateDto();
            updateCustomerDto.setEmailId(customerDigitalSignatureRequestDto.getEmailId());



           PublishResponse response = customerServiceImp.updateCustomerTransactional(
                    customerLocationMappingDao.getCustomerLocationMappingId().getCustomerId(), updateCustomerDto);
            if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
                salesSyncDataService.publishSalesMessagesToQueue(response.getSyncStagingDto());
            }



       }



       if (customerDigitalSignatureResponseDao.getApplicableTransactionTypes() != null && !customerDigitalSignatureResponseDao.getApplicableTransactionTypes().isEmpty()) {
            customerSignatureDao = customerDigitalSignatureRepository.findByMobileNumberAndCustomerTypeAndLocationCode(
                    CryptoUtil.encrypt(customerDigitalSignatureRequestDto.getMobileNumber(), MOBILENUMBER),
                    customerDigitalSignatureRequestDto.getCustomerType(), CommonUtil.getLocationCode());
            customerSignatureDao.setApplicableTransactionTypes(
                    MapperUtil.getJsonString(customerDigitalSignatureRequestDto.getApplicableTransactionTypes()));
        } else {
            customerSignatureDao = new CustomerDigitalSignatureDaoExt();
            customerSignatureDao.setMobileNumber(customerDigitalSignatureResponseDao.getMobileNumber());
            customerSignatureDao.setUlpNumber(customerDigitalSignatureResponseDao.getUlpNumber());
            customerSignatureDao.setApplicableTransactionTypes(
                    MapperUtil.getJsonString(customerDigitalSignatureRequestDto.getApplicableTransactionTypes()));
            customerSignatureDao.setCustomer(customerDigitalSignatureResponseDao.getCustomer());
            customerSignatureDao.setLocationCode(CommonUtil.getLocationCode());
            customerSignatureDao.setCustomerType(customerDigitalSignatureResponseDao.getCustomerType());
        }



       customerSignatureDao.getCustomer()
                .setEmailId(CryptoUtil.encrypt(customerDigitalSignatureRequestDto.getEmailId(), EMAIL));



       customerDigitalSignatureRepository.saveAndFlush(customerSignatureDao);



       return savedCustomerDetails(customerSignatureDao);



   }

	/**
	 * This method will decrypt customer data.
	 *
	 * @param customerDto
	 * @return CustomerDigitalSignatureResponseDto
	 */
	private List<DigitalSignatureResponseDto> customerDetails(List<CustomerDigitalSignatureResponseDto> customerDto) {
		List<DigitalSignatureResponseDto> data = new ArrayList<>();
		if (customerDigitalSignatureResponseDto == null) {
		throw new ServiceException(RECORDNOTFOUND, ERR_SALE_129);
	}
		for (int i = 0; i < customerDto.size(); i++) {
			customerDto.get(i).setCustomerName(CryptoUtil.decrypt(customerDto.get(i).getCustomerName(), CUSTOMERNAME));
			if (!StringUtils.isEmpty(customerDto.get(i).getMobileNumber()))
				customerDto.get(i)
						.setMobileNumber(CryptoUtil.decrypt(customerDto.get(i).getMobileNumber(), MOBILENUMBER));
			if (!StringUtils.isEmpty(customerDto.get(i).getCustomerEmail()))
				customerDto.get(i).setCustomerEmail(CryptoUtil.decrypt(customerDto.get(i).getCustomerEmail(), EMAIL));
			data.add((DigitalSignatureResponseDto) MapperUtil.getDtoMapping(customerDto.get(i),
					DigitalSignatureResponseDto.class));
		}

		return data;
	}

	private DigitalSignatureResponseDto savedCustomerDetails(CustomerDigitalSignatureDaoExt customerDto) {

		customerDto.getCustomer()
				.setCustomerName(CryptoUtil.decrypt(customerDto.getCustomer().getCustomerName(), CUSTOMERNAME));
		if (!StringUtils.isEmpty(customerDto.getMobileNumber()))
			customerDto.setMobileNumber(CryptoUtil.decrypt(customerDto.getCustomer().getMobileNumber(), MOBILENUMBER));
		if (!StringUtils.isEmpty(customerDto.getCustomer().getEmailId()))
			customerDto.getCustomer().setEmailId(CryptoUtil.decrypt(customerDto.getCustomer().getEmailId(), EMAIL));
		DigitalSignatureResponseDto digitalSignatureResponseDto = new DigitalSignatureResponseDto();
		digitalSignatureResponseDto.setApplicableTransactionTypes(customerDto.getApplicableTransactionTypes());
		digitalSignatureResponseDto.setCustomerAddress(customerDto.getCustomer().getCustomerDetails());
		digitalSignatureResponseDto.setCustomerEmail(customerDto.getCustomer().getEmailId());
		digitalSignatureResponseDto.setCustomerId(customerDto.getCustomer().getId());
		digitalSignatureResponseDto.setCustomerName(customerDto.getCustomer().getCustomerName());
		digitalSignatureResponseDto.setDigitalSignature(customerDto.getDigitalSignature());
		digitalSignatureResponseDto.setCustomerType(customerDto.getCustomer().getCustomerType());
		digitalSignatureResponseDto.setCustomerDocumentTxnId(customerDto.getCustomerDocumentTxnId());
// if(customerDto.getDigitalSignature()!=null) {
// byte[] data = Base64.getDecoder().decode(customerDto.getDigitalSignature());
// digitalSignatureResponseDto.setDigitalSignature(data);
// }
		digitalSignatureResponseDto.setMobileNumber(customerDto.getMobileNumber());
		digitalSignatureResponseDto.setUlpNumber(customerDto.getUlpNumber());
		log.info("digitalSignatureResponseDto>>>",digitalSignatureResponseDto);
		return digitalSignatureResponseDto;
	}

	@Override
	public List<DigitalSignatureResponseDto> getCustomerData(String mobileNumber, String ulpNumber) {
		if (mobileNumber == null && ulpNumber == null) {
			throw new ServiceException(MOBILENOULPIDCANNOTBEEMPTY, ERR_INT_049);
		}

		if (mobileNumber != null && !Pattern.matches(RegExConstants.MOBILE_REGEX, mobileNumber)) {
			throw new ServiceException(INVALID_INPUTS, ERR_SALE_048, MOBILENUMBER);
		}
		
		
		//customerDigitalSignatureResponseDto = customerDigitalSignatureRepository
			//	.getByMobileNumberOrUlpNumberOrLocationCode(CryptoUtil.encrypt(mobileNumber, MOBILENUMBER), ulpNumber,CommonUtil.getLocationCode());

		customerDigitalSignatureResponseDto = customerDigitalSignatureRepository
				.searchCustomerByMobileNumberOrUlpId(CryptoUtil.encrypt(mobileNumber, MOBILENUMBER), ulpNumber);

		if (customerDigitalSignatureResponseDto == null) {
			throw new ServiceException(RECORDNOTFOUND, ERR_SALE_129);
		}

		return customerDetails(customerDigitalSignatureResponseDto);
	}

}