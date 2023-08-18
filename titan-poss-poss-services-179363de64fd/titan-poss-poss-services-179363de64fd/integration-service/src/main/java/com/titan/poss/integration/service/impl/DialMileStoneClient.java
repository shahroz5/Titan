/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.ws.client.WebServiceIOException;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.SoapFaultClientException;
import org.springframework.ws.soap.client.core.SoapActionCallback;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dial.cctv.generated.AddTransactionEvent;
import com.titan.poss.integration.dial.cctv.generated.AddTransactionEventResponse;
import com.titan.poss.integration.dial.cctv.generated.AddTransactionPaymentLine;
import com.titan.poss.integration.dial.cctv.generated.AddTransactionPaymentLineResponse;
import com.titan.poss.integration.dial.cctv.generated.AddTransactionSaleLineWithTillLookup;
import com.titan.poss.integration.dial.cctv.generated.AddTransactionSaleLineWithTillLookupResponse;
import com.titan.poss.integration.dial.cctv.generated.AddTransactionTotalLine;
import com.titan.poss.integration.dial.cctv.generated.AddTransactionTotalLineResponse;
import com.titan.poss.integration.dial.cctv.generated.BeginTransactionWithTillLookup;
import com.titan.poss.integration.dial.cctv.generated.BeginTransactionWithTillLookupResponse;
import com.titan.poss.integration.dial.cctv.generated.CommitTransaction;
import com.titan.poss.integration.dial.cctv.generated.CommitTransactionResponse;
import com.titan.poss.integration.dto.DialVendorDataDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class DialMileStoneClient extends WebServiceGatewaySupport {

	private static final String BEGIN_TRANSACTION_WITH_TILL_LOOKUP = "BeginTransactionWithTillLookup";
	private static final String ADD_TRANSACTION_SALE_LINE_WITH_TILL_LOOKUP = "AddTransactionSaleLineWithTillLookup";
	private static final String ADD_TRANSACTION_TOTAL_LINE = "AddTransactionTotalLine";
	private static final String ADD_TRANSACTION_PAYMENT_LINE = "AddTransactionPaymentLine";
	private static final String ADD_TRANSACTION_EVENT = "AddTransactionEvent";
	private static final String COMMIT_TRANSACTION = "CommitTransaction";

	public BeginTransactionWithTillLookupResponse beginTransactionWithTillLookup(VendorDao vendor,
			BeginTransactionWithTillLookup beginTransactionWithTillLookup) {
		BeginTransactionWithTillLookupResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder
				.fromUriString(
						MapperUtil.getObjectMapperInstance()
								.convertValue(MapperUtil.getObjectMapperInstance()
										.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()),
												JsonData.class)
										.getData(), DialVendorDataDto.class)
								.getSoapAction() + "/" + BEGIN_TRANSACTION_WITH_TILL_LOOKUP)
				.build().toUriString();
		try {
			response = (BeginTransactionWithTillLookupResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					beginTransactionWithTillLookup, new SoapActionCallback(soapActionUrl));
		} catch (SoapFaultClientException | WebServiceIOException e) {
			throw new ServiceException(e.getMessage(), "Error in CCTV API beginTransactionWithTillLookup response");
		}
		return response;
	}

	public AddTransactionSaleLineWithTillLookupResponse addTransactionSaleLineWithTillLookup(VendorDao vendor,
			AddTransactionSaleLineWithTillLookup addTransactionSaleLineWithTillLookup) {
		AddTransactionSaleLineWithTillLookupResponse response;

		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder
				.fromUriString(
						MapperUtil.getObjectMapperInstance()
								.convertValue(MapperUtil.getObjectMapperInstance()
										.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()),
												JsonData.class)
										.getData(), DialVendorDataDto.class)
								.getSoapAction() + "/" + ADD_TRANSACTION_SALE_LINE_WITH_TILL_LOOKUP)
				.build().toUriString();

		try {
			response = (AddTransactionSaleLineWithTillLookupResponse) getWebServiceTemplate().marshalSendAndReceive(
					baseUrl, addTransactionSaleLineWithTillLookup, new SoapActionCallback(soapActionUrl));
		} catch (SoapFaultClientException | WebServiceIOException e) {
			throw new ServiceException(e.getMessage(),
					"Error in CCTV API addTransactionSaleLineWithTillLookup response");
		}
		return response;
	}

	public AddTransactionTotalLineResponse addTransactionTotalLine(VendorDao vendor,
			AddTransactionTotalLine addTransactionTotalLine) {
		AddTransactionTotalLineResponse response;

		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder
				.fromUriString(
						MapperUtil.getObjectMapperInstance()
								.convertValue(MapperUtil.getObjectMapperInstance()
										.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()),
												JsonData.class)
										.getData(), DialVendorDataDto.class)
								.getSoapAction() + "/" + ADD_TRANSACTION_TOTAL_LINE)
				.build().toUriString();
		try {
			response = (AddTransactionTotalLineResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					addTransactionTotalLine, new SoapActionCallback(soapActionUrl));
		} catch (SoapFaultClientException | WebServiceIOException e) {
			throw new ServiceException(e.getMessage(), "Error in CCTV API addTransactionTotalLine response");
		}
		return response;
	}

	public AddTransactionPaymentLineResponse addTransactionPaymentLine(VendorDao vendor,
			AddTransactionPaymentLine addTransactionPaymentLine) {
		AddTransactionPaymentLineResponse response;

		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder
				.fromUriString(
						MapperUtil.getObjectMapperInstance()
								.convertValue(MapperUtil.getObjectMapperInstance()
										.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()),
												JsonData.class)
										.getData(), DialVendorDataDto.class)
								.getSoapAction() + "/" + ADD_TRANSACTION_PAYMENT_LINE)
				.build().toUriString();
		try {
			response = (AddTransactionPaymentLineResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					addTransactionPaymentLine, new SoapActionCallback(soapActionUrl));
		} catch (SoapFaultClientException | WebServiceIOException e) {
			throw new ServiceException(e.getMessage(), "Error in CCTV API addTransactionPaymentLine response");
		}
		return response;
	}

	public AddTransactionEventResponse addTransactionEventResponse(VendorDao vendor,
			AddTransactionEvent addTransactionEvent) {
		AddTransactionEventResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder
				.fromUriString(
						MapperUtil.getObjectMapperInstance()
								.convertValue(MapperUtil.getObjectMapperInstance()
										.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()),
												JsonData.class)
										.getData(), DialVendorDataDto.class)
								.getSoapAction() + "/" + ADD_TRANSACTION_EVENT)
				.build().toUriString();
		try {
			response = (AddTransactionEventResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					addTransactionEvent, new SoapActionCallback(soapActionUrl));
		} catch (SoapFaultClientException | WebServiceIOException e) {
			throw new ServiceException(e.getMessage(), "Error in CCTV API commitTransaction response");
		}
		return response;
	}

	public CommitTransactionResponse commitTransaction(VendorDao vendor, CommitTransaction commitTransaction) {
		CommitTransactionResponse response;

		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder
				.fromUriString(
						MapperUtil.getObjectMapperInstance()
								.convertValue(MapperUtil.getObjectMapperInstance()
										.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()),
												JsonData.class)
										.getData(), DialVendorDataDto.class)
								.getSoapAction() + "/" + COMMIT_TRANSACTION)
				.build().toUriString();
		try {
			response = (CommitTransactionResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					commitTransaction, new SoapActionCallback(soapActionUrl));
		} catch (SoapFaultClientException | WebServiceIOException e) {
			throw new ServiceException(e.getMessage(), "Error in CCTV API commitTransaction response");
		}
		return response;
	}

}
