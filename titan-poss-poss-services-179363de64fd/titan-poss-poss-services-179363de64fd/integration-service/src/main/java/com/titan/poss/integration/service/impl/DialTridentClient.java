/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.util.List;

import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.ws.client.WebServiceIOException;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.SoapFaultClientException;
import org.springframework.ws.soap.client.core.SoapActionCallback;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dial.save.request.generated.TransactionData;
import com.titan.poss.integration.dial.save.request.generated.TransactionData.Transactions;
import com.titan.poss.integration.dial.save.request.generated.TransactionData.Transactions.Transaction;
import com.titan.poss.integration.dial.save.request.generated.TransactionData.Transactions.Transaction.Items.Item;
import com.titan.poss.integration.dial.save.request.generated.TransactionData.Transactions.Transaction.Payments.Payment;
import com.titan.poss.integration.dial.save.response.generated.SaveTransaction;
import com.titan.poss.integration.dial.save.response.generated.SaveTransactionResponse;
import com.titan.poss.integration.dto.DialVendorDataDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class DialTridentClient extends WebServiceGatewaySupport {

	private static final String COMMIT_TRANSACTION = "SaveTransaction";
	private static final String NA = "NA";
	private static final String ZERO = "0";

	public SaveTransactionResponse orderDetailsToDialSave(VendorDao vendor, TransactionData transactionData,
			DialVendorDataDto dialVendorDataDto) {
		SaveTransactionResponse response;
		SaveTransaction saveTransaction = new SaveTransaction();
		Transactions transactions = transactionData.getTransactions();
		Transaction transaction = transactions.getTransaction().get(0);
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder
				.fromUriString(dialVendorDataDto.getSoapAction() + "/" + COMMIT_TRANSACTION).build().toUriString();

		StringBuilder s = new StringBuilder();
		s.append(
				"<TransactionData xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xsi:noNamespaceSchemaLocation=\"http://localhost/_URL_/Tanishq_new.xsd\">");
		s.append("<ServicePartnerNo>").append(transactionData.getServicePartnerNo()).append("</ServicePartnerNo>");
		s.append("<Password>").append(transactionData.getPassword()).append("</Password>");
		s.append("<Transactions>");
		s.append("<Transaction>");
		s.append("<TransactionNo>").append(transaction.getTransactionNo()).append("</TransactionNo>");
		s.append("<OriginalRefNo>").append(transaction.getOriginalRefNo()).append("</OriginalRefNo>");
		s.append("<EntryType>").append(transaction.getEntryType()).append("</EntryType>");
		s.append("<StoreNo>").append(transaction.getStoreNo()).append("</StoreNo>");
		s.append("<POSNo>").append(transaction.getPOSNo()).append("</POSNo>");
		s.append("<StaffID>").append(transaction.getStaffID()).append("</StaffID>");
		s.append("<StaffName>").append(transaction.getStaffName()).append("</StaffName>");
		s.append("<TransactionDate>").append(transaction.getTransactionDate()).append("</TransactionDate>");
		s.append("<TransactionTime>").append(transaction.getTransactionTime()).append("</TransactionTime>");
		s.append("<DiscountAmount>").append(transaction.getDiscountAmount()).append("</DiscountAmount>");
		s.append("<TotalDiscount>").append(transaction.getTotalDiscount()).append("</TotalDiscount>");
		s.append("<TableNo/>");
		s.append("<NoOfCovers/>");
		s.append("<CustomerName>").append(transaction.getCustomerName()).append("</CustomerName>");
		s.append("<Address>").append(transaction.getAddress()).append("</Address>");
		s.append("<Gender/>");
		s.append("<PassportNo>").append(NA).append("</PassportNo>");
		s.append("<Nationality>").append(NA).append("</Nationality>");
		s.append("<PortofBoarding>").append(NA).append("</PortofBoarding>");
		s.append("<PortofDisembarkation>").append(NA).append("</PortofDisembarkation>");
		s.append("<FlightNo>").append(NA).append("</FlightNo>");
		s.append("<SectorNo>").append(NA).append("</SectorNo>");
		s.append("<BoardingPassNo>").append(ZERO).append("</BoardingPassNo>");
		s.append("<SeatNo/>");
		s.append("<Airlines>").append(NA).append("</Airlines>");
		s.append("<ServiceChargeAmount>").append(transaction.getServiceChargeAmount()).append("</ServiceChargeAmount>");
		s.append("<NetTransactionAmount>").append(transaction.getNetTransactionAmount())
				.append("</NetTransactionAmount>");
		s.append("<GrossTransactionAmount>").append(transaction.getGrossTransactionAmount())
				.append("</GrossTransactionAmount>");
		s.append("<SequenceNumber>").append(transaction.getSequenceNumber()).append("</SequenceNumber>");
		s.append("<Items>");
		List<Item> itemList = transaction.getItems().getItem();
		itemList.forEach(item -> {
			s.append("<Item>");
			s.append("<ItemCode>").append(item.getItemCode()).append("</ItemCode>");
			s.append("<ItemDescription>").append(item.getItemDescription()).append("</ItemDescription>");
			s.append("<ItemCategory>").append(NA).append("</ItemCategory>");
			s.append("<ItemCategoryDescription>").append(NA).append("</ItemCategoryDescription>");
			s.append("<ProductGroup>").append(item.getProductGroup()).append("</ProductGroup>");
			s.append("<ProductGroupDescription>").append(NA).append("</ProductGroupDescription>");
			s.append("<BarcodeNo/>");
			s.append("<Quantity>").append(item.getQuantity()).append("</Quantity>");
			s.append("<Price>").append(item.getPrice()).append("</Price>");
			s.append("<NetAmount>").append(item.getNetAmount()).append("</NetAmount>");
			s.append("<PriceInclusiveTax>").append(0).append("</PriceInclusiveTax>");
			s.append("<ChangedPrice>").append(0).append("</ChangedPrice>");
			s.append("<ScaleItem>").append(1).append("</ScaleItem>");
			s.append("<WeighingItem>").append(0).append("</WeighingItem>");
			s.append("<ItemSerialNo>").append(NA).append("</ItemSerialNo>");
			s.append("<UOM>").append("GRAMS").append("</UOM>");
			s.append("<LineDiscount>").append(item.getLineDiscount()).append("</LineDiscount>");
			s.append("<TotalDiscount>").append(item.getTotalDiscount()).append("</TotalDiscount>");
			s.append("<PeriodicDiscount>").append(ZERO).append("</PeriodicDiscount>");
			s.append("<PromotionNo/>");
			s.append("<TaxAmount>").append(item.getTaxAmount()).append("</TaxAmount>");
			s.append("<TaxRate>").append(item.getTaxRate()).append("</TaxRate>");
			s.append("<ServiceTaxAmount>").append(ZERO).append("</ServiceTaxAmount>");
			s.append("<ServiceTaxRate>").append(ZERO).append("</ServiceTaxRate>");
			s.append("<ServiceTaxeCessRate>").append(ZERO).append("</ServiceTaxeCessRate>");
			s.append("<ServiceTaxeCessAmount>").append(ZERO).append("</ServiceTaxeCessAmount>");
			s.append("<ServiceTaxSHECessRate>").append(ZERO).append("</ServiceTaxSHECessRate>");
			s.append("<ServiceTaxSHECessAmount>").append(ZERO).append("</ServiceTaxSHECessAmount>");
			s.append("</Item>");
		});
		s.append("</Items>");
		s.append("<Payments>");
		List<Payment> paymentList = transaction.getPayments().getPayment();
		paymentList.forEach(payment -> {
			s.append("<Payment>");
			s.append("<TenderType>").append(1).append("</TenderType>");
			s.append("<CardNo/>");
			s.append("<CurrencyCode>").append("INR").append("</CurrencyCode>");
			s.append("<ExchangeRate>").append("1").append("</ExchangeRate>");
			s.append("<AmountTendered>").append(payment.getAmountTendered()).append("</AmountTendered>");
			s.append("<AmountInCurrency>").append(0).append("</AmountInCurrency>");
			s.append("</Payment>");
		});
		s.append("</Payments>");
		s.append("</Transaction>");
		s.append("</Transactions>");
		s.append("</TransactionData>");

		saveTransaction.setStrXML(s.toString());

		try {
			response = (SaveTransactionResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl, saveTransaction,
					new SoapActionCallback(soapActionUrl));

		} catch (SoapFaultClientException | WebServiceIOException e) {
			throw new ServiceException(e.getMessage(), "Error in Dial save response");
		}
		return response;
	}
}
