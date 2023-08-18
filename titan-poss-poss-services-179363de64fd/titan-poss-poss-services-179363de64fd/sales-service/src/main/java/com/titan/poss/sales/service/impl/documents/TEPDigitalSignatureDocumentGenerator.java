package com.titan.poss.sales.service.impl.documents;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dto.AddressDetails;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.response.CustomerPrintDto;
import com.titan.poss.sales.dto.response.TEPDigitalSignaturePrintDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.impl.BusinessDayServiceImpl;

@Service
public class TEPDigitalSignatureDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	@Autowired
	private BusinessDayServiceImpl businessDayService;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationMappingRepositoryExt;

	public TEPDigitalSignatureDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.TEP_DIGITAL_SIGNATURE.name(),
				PrintFileTypeEnum.INVOICE_PRINT.name(), this);
	}

	@Override
	public PrintableDto getPrintableDto(String txnId, String custId) {
		// TODO Auto-generated method stub
		return getftlBindingObjectForTEP(txnId);
	}

	private TEPDigitalSignaturePrintDto getftlBindingObjectForTEP(String custId) {
		TEPDigitalSignaturePrintDto tepDigitalSignaturePrintDto = new TEPDigitalSignaturePrintDto();
		tepDigitalSignaturePrintDto.setBusinessDate(businessDayService.getBusinessDay().getBusinessDate());
		tepDigitalSignaturePrintDto.setStoreDetails(getStoreDetails());
		tepDigitalSignaturePrintDto.setCustomerMasterId(custId); // customer UUID
		tepDigitalSignaturePrintDto.setCustomer(getCustomerDetails(custId, CommonUtil.getLocationCode()));
		tepDigitalSignaturePrintDto.setCustomerId(getCustomerId(custId, CommonUtil.getLocationCode()));
		// set customer digital signature
		tepDigitalSignaturePrintDto.setCustSignature(setCustDigitalSignature(
				tepDigitalSignaturePrintDto.getCustomer().getMobileNumber(), ApplicableTransactionTypes.TEPDECLARATION,
				tepDigitalSignaturePrintDto.getCustomer().getCustomerType()));
		// set cashier digital signature
		tepDigitalSignaturePrintDto.setCashierSignature(setCashierDigitalSignature(CommonUtil.getEmployeeCode()));
		tepDigitalSignaturePrintDto
				.setBusinessDateStr(CalendarUtils.formatToPrintableDate(tepDigitalSignaturePrintDto.getBusinessDate()));
		return tepDigitalSignaturePrintDto;
	}

	protected Integer getCustomerId(String customerMasterId, String locationCode) {
		// @formatter:off
		CustomerLocationMappingDao customerTxnDao = customerLocationMappingRepositoryExt
				.findByCustomerMasterIdIdAndLocationCode(customerMasterId, locationCode);
		return customerTxnDao.getCustomerLocationMappingId().getCustomerId();
	}

	protected CustomerPrintDto getCustomerDetails(String customerMasterId, String locationCode) {
		// @formatter:off
		CustomerLocationMappingDao customerTxnDao = customerLocationMappingRepositoryExt
				.findByCustomerMasterIdIdAndLocationCode(customerMasterId, locationCode);
		CustomerPrintDto customerPrint = (CustomerPrintDto) MapperUtil.getObjectMapping(customerTxnDao.getCustomer(),
				new CustomerPrintDto());
		// @formatter:on
		customerPrint
				.setCustomerName(CryptoUtil.decrypt(customerTxnDao.getCustomer().getCustomerName(), "CUSTOMERNAME"));
		customerPrint
				.setMobileNumber(CryptoUtil.decrypt(customerTxnDao.getCustomer().getMobileNumber(), "MOBILENUMBER"));
		customerPrint.setTitle(customerTxnDao.getCustomer().getTitle());
		customerPrint.setUlpId(customerTxnDao.getCustomer().getUlpId());
		JsonData jsonData = MapperUtil.mapObjToClass(customerTxnDao.getCustomer().getCustomerDetails(), JsonData.class);
		customerPrint.setAddress(MapperUtil.mapObjToClass(jsonData.getData(), AddressDetails.class));
		customerPrint.setCustomerType(customerTxnDao.getCustomer().getCustomerType());
		if (customerTxnDao.getCustomer().getInstiTaxNo() != null)
			customerPrint.setInstiTaxNo(customerTxnDao.getCustomer().getInstiTaxNo());
		return customerPrint;
	}

	@Override
	public PrintableDto getDto() {
		// TODO Auto-generated method stub
		return new TEPDigitalSignaturePrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}
}
