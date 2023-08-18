/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.documents;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.NumberToWordsFactory;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.response.AcceptAdvancePrintDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.impl.BusinessDayServiceImpl;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class AcceptAdvanceDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepo;

	@Autowired
	NumberToWordsFactory numberToWordsFactory;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepo;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerRepo;

	@Autowired
	private BusinessDayServiceImpl businessDayService;

	public AcceptAdvanceDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.ACCEPT_ADVANCE.name(),
				PrintFileTypeEnum.INVOICE_PRINT.name(), this);
	}

	@Override
	public PrintableDto getPrintableDto(String txnId, String productCode) {

		return getftlBindingObjectForAcceptAdv(txnId);
	}

	private PrintableDto getftlBindingObjectForAcceptAdv(String txnId) {
		AcceptAdvancePrintDto acceptAdvancePrintDto = new AcceptAdvancePrintDto();
		SalesTxnDao salesTxnDao = getSalesTxnOnSubTxn(txnId, CommonUtil.getLocationCode());
		acceptAdvancePrintDto.setStoreDetails(getStoreDetails());
		acceptAdvancePrintDto.setCustomer(getCustomerDetails(txnId, CommonUtil.getLocationCode()));
		acceptAdvancePrintDto.setCustomerMasterId(getCustomerMasterId(txnId));
		acceptAdvancePrintDto.setSalesTxnDao(salesTxnDao);
		acceptAdvancePrintDto.setPaymentDetails(listConfirmedPayments(txnId, CommonUtil.getLocationCode()));
		acceptAdvancePrintDto.setTotalAmount(BigDecimal.ZERO);
		acceptAdvancePrintDto.getPaymentDetails().forEach(paymentDetail -> acceptAdvancePrintDto
				.setTotalAmount(acceptAdvancePrintDto.getTotalAmount().add(paymentDetail.getAmount())));

		acceptAdvancePrintDto.setPriceInWords(numberToWordsFactory
				.getPriceInWords(acceptAdvancePrintDto.getTotalAmount().longValue(), DomainConstants.ASIAN_PRICE_TYPE));

		List<CreditNoteDaoExt> credtNotes = creditNoteRepo.findBySalesTxnId(txnId);
		if (credtNotes.isEmpty()) {
			throw new ServiceException("Credit-Note not found for the Transaction Id", "",
					"Credit-Note not found for the Transaction Id:" + txnId);
		} else {
			acceptAdvancePrintDto.setCnDocNo(credtNotes.get(0).getDocNo());
		}
		acceptAdvancePrintDto.setLocationCode(credtNotes.get(0).getLocationCode());
		acceptAdvancePrintDto.setFiscalYear(credtNotes.get(0).getFiscalYear());
		SimpleDateFormat docDateFormatter = new SimpleDateFormat("dd/MM/yyyy");
		String docDate = docDateFormatter.format(credtNotes.get(0).getDocDate());
		acceptAdvancePrintDto.setDocDate(docDate);
		acceptAdvancePrintDto.setDocNo(credtNotes.get(0).getDocNo());
		acceptAdvancePrintDto.setBusinessDate(businessDayService.getBusinessDay().getBusinessDate());

		// set customer digital signature
		acceptAdvancePrintDto.setCustSignature(setCustDigitalSignature(
				acceptAdvancePrintDto.getCustomer().getMobileNumber(), ApplicableTransactionTypes.ACCEPTADVANCE,
				acceptAdvancePrintDto.getCustomer().getCustomerType()));

		// set cashier digital signature
		acceptAdvancePrintDto.setCashierSignature(setCashierDigitalSignature(salesTxnDao.getEmployeeCode()));
		acceptAdvancePrintDto.setPrints(getPrints(txnId));
		// increase print count
		//increaseSalesPrintCount(txnId);

		return acceptAdvancePrintDto;
	}

	private String getCustomerMasterId(String txnId) {
		SalesTxnDaoExt sales = salesTxnRepo.findByIdAndLocationCodeAndStatus(txnId, CommonUtil.getLocationCode(),
				TransactionStatusEnum.CONFIRMED.name());
		String customerId = null;
		if (sales != null) {
			CustomerLocationMappingIdDao customerLocationId = new CustomerLocationMappingIdDao();
			customerLocationId.setCustomerId(sales.getCustomerId());
			customerLocationId.setLocationCode(sales.getLocationCode());
			Optional<CustomerLocationMappingDao> customerLocation = customerRepo.findById(customerLocationId);
			if (customerLocation.isPresent())
				customerId = customerLocation.get().getCustomer().getId();
		}
		return customerId;
	}
	
	private String getPrints(String txnId) {
		SalesTxnDaoExt sales = salesTxnRepo.findByIdAndLocationCodeAndStatus(txnId, CommonUtil.getLocationCode(),
				TransactionStatusEnum.CONFIRMED.name());
		Integer printCount = 0;
		printCount = sales.getPrints()+ sales.getEmailPrints();
		System.out.println("Prints"+printCount);
		if(printCount >0) {
			return "OFFICE COPY";
		}
		return "CUSTOMER COPY";
	}


	@Override
	public PrintableDto getDto() {
		return new AcceptAdvancePrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}

}
