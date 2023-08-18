/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.domain.constant.EventTransactionEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.EventCancellationDto;
import com.titan.poss.core.dto.EventCashMemoCancellationAuditDto;
import com.titan.poss.core.dto.EventCashMemoDetailsDto;
import com.titan.poss.core.dto.EventCashMemoDto;
import com.titan.poss.core.dto.EventCashMemoMileStoneAuditDto;
import com.titan.poss.core.dto.EventGRNAuditDto;
import com.titan.poss.core.dto.EventGRNDetailsDto;
import com.titan.poss.core.dto.EventGRNDto;
import com.titan.poss.core.dto.EventGiftSaleDetailsDto;
import com.titan.poss.core.dto.EventResponseDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorConfigDao;
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
import com.titan.poss.integration.dial.cctv.generated.DiscountType;
import com.titan.poss.integration.dial.cctv.generated.EventLineAttribute;
import com.titan.poss.integration.dial.cctv.generated.PaymentLineAttribute;
import com.titan.poss.integration.dial.cctv.generated.SaleLineAttribute;
import com.titan.poss.integration.dial.cctv.generated.ScanAttribute;
import com.titan.poss.integration.dial.cctv.generated.TotalLineAttribute;
import com.titan.poss.integration.dial.cctv.generated.TransactionType;
import com.titan.poss.integration.dial.save.request.generated.TransactionData;
import com.titan.poss.integration.dial.save.request.generated.TransactionData.Transactions;
import com.titan.poss.integration.dial.save.request.generated.TransactionData.Transactions.Transaction;
import com.titan.poss.integration.dial.save.request.generated.TransactionData.Transactions.Transaction.Items;
import com.titan.poss.integration.dial.save.request.generated.TransactionData.Transactions.Transaction.Items.Item;
import com.titan.poss.integration.dial.save.request.generated.TransactionData.Transactions.Transaction.Payments;
import com.titan.poss.integration.dial.save.request.generated.TransactionData.Transactions.Transaction.Payments.Payment;
import com.titan.poss.integration.dial.save.response.generated.SaveTransactionResponse;
import com.titan.poss.integration.dto.DialMileStoneVendorDetailsDto;
import com.titan.poss.integration.dto.DialTridentVendorDetailsDto;
import com.titan.poss.integration.dto.DialVendorDataDto;
import com.titan.poss.integration.dto.EventTridentAuditDto;
import com.titan.poss.integration.dto.request.EventOrderDetailsDto;
import com.titan.poss.integration.intg.dao.DialAuditDao;
import com.titan.poss.integration.intg.repository.DialAuditRepository;
import com.titan.poss.integration.repository.VendorConfigRepository;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.EventService;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SubTxnTypeEum;
import com.titan.poss.sales.constants.TransactionStatusEnum;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Primary
@Service("IntegrationEventService")
public class EventServiceImpl implements EventService {

	@Autowired
	private DialMileStoneClient dialMileStoneClient;

	@Autowired
	private DialTridentClient dialTridentClient;

	@Autowired
	private DialAuditRepository dialAuditRepository;

	@Autowired
	private VendorRepository vendorRepository;

	@Autowired
	private VendorConfigRepository vendorConfigRepository;

	@Autowired
	private EngineServiceClient engineServiceClient;

	private static final String SUCCESS = "SUCCESS";
	private static final String FAILURE = "FAILURE";
	private BigDecimal totalAmountCm = BigDecimal.ZERO;
	private String transactionErrorCm = null;
	private BigDecimal totalAmountBc = BigDecimal.ZERO;
	private String transactionErrorBc = null;
	private BigDecimal totalAmountGrn = BigDecimal.ZERO;
	private String transactionErrorGrn = null;

	@Override
	public EventResponseDto cashMemoDetails(String vendorCode, String refTxnId, String subTxnType, String status,
			Boolean isScheduled, EventCashMemoDto eventCashMemoDto) {
		EventResponseDto eventResponseDto = new EventResponseDto();
		eventResponseDto.setIsSuccessMileStone(Boolean.FALSE);
		eventResponseDto.setMessageMileStone(FAILURE);
		Integer customerId = eventCashMemoDto.getCustomer().getCustomerId();
		EventOrderDetailsDto eventOrderDetailsDto = new EventOrderDetailsDto();
		eventOrderDetailsDto.setCustomer(eventCashMemoDto.getCustomer());
		eventOrderDetailsDto.setCashMemoDetailsList(eventCashMemoDto.getCashMemoDetailsList());
		if (eventCashMemoDto.getGiftSaleDetailsList() != null)
			eventOrderDetailsDto.setGiftSaleList(eventCashMemoDto.getGiftSaleDetailsList());
		eventOrderDetailsDto.setPaymentList(eventCashMemoDto.getPaymentDetailsList());
		eventOrderDetailsDto.setSubTxnType(subTxnType);
		VendorDao vendor = validateVendor(vendorCode);
		EventCashMemoMileStoneAuditDto eventCashMemoMileStoneAuditDto = createEventCashMemoAudit(vendorCode, refTxnId,
				subTxnType, status, eventCashMemoDto);
		String request = MapperUtil.getJsonString(eventCashMemoMileStoneAuditDto);
		DialAuditDao dialAudit = getInitialDialAuditDetails(vendor, refTxnId, EventTransactionEnum.CM_MILESTONE.name());
		if (BooleanUtils.isTrue(isScheduled)) {
			List<DialAuditDao> dialMileStoneAuditCheck = dialAuditRepository
					.findByVendorVendorCodeAndRefTxnIdAndTransactionStatusAndTransactionType(vendorCode, refTxnId,
							Boolean.FALSE, EventTransactionEnum.CM_MILESTONE.name());
			dialMileStoneAuditCheck.forEach(audit -> {
				audit.setRefTxnId(null);
			});
			dialAuditRepository.saveAll(dialMileStoneAuditCheck);
		}
		BeginTransactionWithTillLookupResponse beginTransactionWithTillLookupResponse = new BeginTransactionWithTillLookupResponse();
		try {
			beginTransactionWithTillLookupResponse = beginTransactionWithTillLookup(dialAudit.getTransactionId(),
					vendor, customerId.toString(), refTxnId, EventTransactionEnum.CM_MILESTONE.name());
		} catch (Exception e) {
			saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), refTxnId, eventOrderDetailsDto,
						EventTransactionEnum.CM_MILESTONE.name(), eventResponseDto, isScheduled, status);
			return eventResponseDto;
		}
		if (!beginTransactionWithTillLookupResponse.getBeginTransactionWithTillLookupResult().isSucceeded()) {
			saveAuditForFailedTransactionsMileStone(dialAudit, beginTransactionWithTillLookupResponse
					.getBeginTransactionWithTillLookupResult().getErrorDescription(), request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), refTxnId, eventOrderDetailsDto,
						EventTransactionEnum.CM_MILESTONE.name(), eventResponseDto, isScheduled, status);
			return eventResponseDto;
		}
		if (subTxnType.equalsIgnoreCase(SubTxnTypeEum.GIFT_SALE.name())) {
			if (!CollectionUtils.isEmpty(eventCashMemoDto.getGiftSaleDetailsList())) {
				try {
					giftSaleTransaction(eventCashMemoDto, vendor, beginTransactionWithTillLookupResponse, subTxnType,
							status, dialAudit);
				} catch (Exception e) {
					saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
					if (BooleanUtils.isFalse(isScheduled))
						orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), refTxnId, eventOrderDetailsDto,
								EventTransactionEnum.CM_MILESTONE.name(), eventResponseDto, isScheduled, status);
					return eventResponseDto;
				}
			}
		} else {
			if (!CollectionUtils.isEmpty(eventCashMemoDto.getCashMemoDetailsList())) {
				try {
					cashmemoTransaction(eventCashMemoDto, vendor, beginTransactionWithTillLookupResponse, subTxnType,
							status, dialAudit);
				} catch (Exception e) {
					saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
					if (BooleanUtils.isFalse(isScheduled))
						orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), refTxnId, eventOrderDetailsDto,
								EventTransactionEnum.CM_MILESTONE.name(), eventResponseDto, isScheduled, status);
					return eventResponseDto;
				}
			}
		}
		if (transactionErrorCm != null) {
			saveAuditForFailedTransactionsMileStone(dialAudit, transactionErrorCm, request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), refTxnId, eventOrderDetailsDto,
						EventTransactionEnum.CM_MILESTONE.name(), eventResponseDto, isScheduled, status);
			return eventResponseDto;
		}
		AddTransactionTotalLineResponse addTransactionTotalLineResponse = new AddTransactionTotalLineResponse();
		try {
			addTransactionTotalLineResponse = addTransactionTotalLine(vendor, beginTransactionWithTillLookupResponse
					.getBeginTransactionWithTillLookupResult().getTransactionSessionId(), totalAmountCm);
		} catch (Exception e) {
			saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), refTxnId, eventOrderDetailsDto,
						EventTransactionEnum.CM_MILESTONE.name(), eventResponseDto, isScheduled, status);
			return eventResponseDto;
		}
		if (!addTransactionTotalLineResponse.getAddTransactionTotalLineResult().isSucceeded()) {
			saveAuditForFailedTransactionsMileStone(dialAudit,
					addTransactionTotalLineResponse.getAddTransactionTotalLineResult().getErrorDescription(), request,
					eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), refTxnId, eventOrderDetailsDto,
						EventTransactionEnum.CM_MILESTONE.name(), eventResponseDto, isScheduled, status);
			return eventResponseDto;
		}
		if (!CollectionUtils.isEmpty(eventCashMemoDto.getPaymentDetailsList())) {
			try {
				cashMemoPayment(eventCashMemoDto, vendor, beginTransactionWithTillLookupResponse);
			} catch (Exception e) {
				saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
				if (BooleanUtils.isFalse(isScheduled))
					orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), refTxnId, eventOrderDetailsDto,
							EventTransactionEnum.CM_MILESTONE.name(), eventResponseDto, isScheduled, status);
				return eventResponseDto;
			}
		}
		if (transactionErrorCm != null) {
			saveAuditForFailedTransactionsMileStone(dialAudit, transactionErrorCm, request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), refTxnId, eventOrderDetailsDto,
						EventTransactionEnum.CM_MILESTONE.name(), eventResponseDto, isScheduled, status);
			return eventResponseDto;
		}
		AddTransactionEventResponse addTransactionEventResponse = new AddTransactionEventResponse();
		if (status.equalsIgnoreCase(TransactionStatusEnum.HOLD.name())) {
			try {
				addTransactionEventResponse = addTransactionEvent(vendor, beginTransactionWithTillLookupResponse
						.getBeginTransactionWithTillLookupResult().getTransactionSessionId(), status);
			} catch (Exception e) {
				saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
				if (BooleanUtils.isFalse(isScheduled))
					orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), refTxnId, eventOrderDetailsDto,
							EventTransactionEnum.CM_MILESTONE.name(), eventResponseDto, isScheduled, status);
				return eventResponseDto;
			}
			if (!addTransactionEventResponse.getAddTransactionEventResult().isSucceeded()) {
				saveAuditForFailedTransactionsMileStone(dialAudit,
						addTransactionEventResponse.getAddTransactionEventResult().getErrorDescription(), request,
						eventResponseDto);
				if (BooleanUtils.isFalse(isScheduled))
					orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), refTxnId, eventOrderDetailsDto,
							EventTransactionEnum.CM_MILESTONE.name(), eventResponseDto, isScheduled, status);
				return eventResponseDto;
			}
		}
		CommitTransactionResponse commitTransactionResponse = new CommitTransactionResponse();
		try {
			commitTransactionResponse = commitTransaction(vendor, beginTransactionWithTillLookupResponse
					.getBeginTransactionWithTillLookupResult().getTransactionSessionId());
		} catch (Exception e) {
			saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), refTxnId, eventOrderDetailsDto,
						EventTransactionEnum.CM_MILESTONE.name(), eventResponseDto, isScheduled, status);
			return eventResponseDto;
		}
		if (!commitTransactionResponse.getCommitTransactionResult().isSucceeded()) {
			saveAuditForFailedTransactionsMileStone(dialAudit,
					commitTransactionResponse.getCommitTransactionResult().getErrorDescription(), request,
					eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), refTxnId, eventOrderDetailsDto,
						EventTransactionEnum.CM_MILESTONE.name(), eventResponseDto, isScheduled, status);
			return eventResponseDto;
		}
		setFinalDialAuditDetails(dialAudit, request, new JSONObject()
				.put("transaction_id", commitTransactionResponse.getCommitTransactionResult().getTransactionId())
				.toString());
		eventResponseDto.setIsSuccessMileStone(Boolean.TRUE);
		eventResponseDto.setMessageMileStone(SUCCESS);
		if (BooleanUtils.isFalse(isScheduled))
			orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), refTxnId, eventOrderDetailsDto,
					EventTransactionEnum.CM_MILESTONE.name(), eventResponseDto, isScheduled, status);
		return eventResponseDto;
	}

	private void cashMemoPayment(EventCashMemoDto eventCashMemoDto, VendorDao vendor,
			BeginTransactionWithTillLookupResponse beginTransactionWithTillLookupResponse) {
		eventCashMemoDto.getPaymentDetailsList().forEach(cashMemoPayment -> {
			AddTransactionPaymentLineResponse addTransactionPaymentLineResponse = addTransactionPaymentLine(vendor,
					beginTransactionWithTillLookupResponse.getBeginTransactionWithTillLookupResult()
							.getTransactionSessionId(),
					cashMemoPayment.getPaymentCode(), cashMemoPayment.getAmount(), cashMemoPayment.getInstrumentNo(),
					cashMemoPayment.getBankName());
			if (!addTransactionPaymentLineResponse.getAddTransactionPaymentLineResult().isSucceeded()
					&& transactionErrorCm == null) {
				transactionErrorCm = addTransactionPaymentLineResponse.getAddTransactionPaymentLineResult()
						.getErrorDescription();
			}
		});

	}

	private EventCashMemoMileStoneAuditDto createEventCashMemoAudit(String vendorCode, String txnId, String suTxnType,
			String status, EventCashMemoDto eventCashMemoDto) {
		EventCashMemoMileStoneAuditDto eventCashMemoMileStoneAuditDto = new EventCashMemoMileStoneAuditDto();
		eventCashMemoMileStoneAuditDto.setVendorCode(vendorCode);
		eventCashMemoMileStoneAuditDto.setTxnId(txnId);
		eventCashMemoMileStoneAuditDto.setSuTxnType(suTxnType);
		eventCashMemoMileStoneAuditDto.setStatus(status);
		eventCashMemoMileStoneAuditDto.setEventCashMemoDto(eventCashMemoDto);
		return eventCashMemoMileStoneAuditDto;

	}

	private void cashmemoTransaction(EventCashMemoDto eventCashMemoDto, VendorDao vendor,
			BeginTransactionWithTillLookupResponse beginTransactionWithTillLookupResponse, String suTxnType,
			String status, DialAuditDao dialAudit) {
		eventCashMemoDto.getCashMemoDetailsList().forEach(cashMemoItem -> {
			Map<String, String> productDescriptionMap = engineServiceClient.getProductGroupList(null, null);
			AddTransactionSaleLineWithTillLookupResponse addTransactionSaleLineWithTillLookupResponse = addTransactionSaleLineWithTillLookup(
					vendor,
					beginTransactionWithTillLookupResponse.getBeginTransactionWithTillLookupResult()
							.getTransactionSessionId(),
					suTxnType, status, cashMemoItem.getItemCode(),
					productDescriptionMap.get(cashMemoItem.getProductGroupCode()), cashMemoItem.getTotalQuantity(),
					cashMemoItem.getUnitValue(), cashMemoItem.getTotalDiscount(), cashMemoItem.getTotalValue(),
					dialAudit.getTransactionId());
			if (!addTransactionSaleLineWithTillLookupResponse.getAddTransactionSaleLineWithTillLookupResult()
					.isSucceeded() && transactionErrorCm == null) {
				transactionErrorCm = addTransactionSaleLineWithTillLookupResponse
						.getAddTransactionSaleLineWithTillLookupResult().getErrorDescription();
			}
			totalAmountCm = totalAmountCm.add(cashMemoItem.getTotalValue());
		});

	}

	private void giftSaleTransaction(EventCashMemoDto eventCashMemoDto, VendorDao vendor,
			BeginTransactionWithTillLookupResponse beginTransactionWithTillLookupResponse, String suTxnType,
			String status, DialAuditDao dialAudit) {
		eventCashMemoDto.getGiftSaleDetailsList().forEach(giftSaleItem -> {
			AddTransactionSaleLineWithTillLookupResponse addTransactionSaleLineWithTillLookupResponse = addTransactionSaleLineWithTillLookup(
					vendor,
					beginTransactionWithTillLookupResponse.getBeginTransactionWithTillLookupResult()
							.getTransactionSessionId(),
					suTxnType, status, giftSaleItem.getInstrumentNo(), null, (short) 1, giftSaleItem.getTotalValue(),
					null, giftSaleItem.getTotalValue(), dialAudit.getTransactionId());
			if (!addTransactionSaleLineWithTillLookupResponse.getAddTransactionSaleLineWithTillLookupResult()
					.isSucceeded() && transactionErrorCm == null)
				transactionErrorCm = addTransactionSaleLineWithTillLookupResponse
						.getAddTransactionSaleLineWithTillLookupResult().getErrorDescription();
			totalAmountCm = totalAmountCm.add(giftSaleItem.getTotalValue());
		});

	}

	@Override
	public EventResponseDto cancellationDetails(String vendorCode, String txnId, String cancelType, String status,
			Boolean isScheduled, EventCancellationDto eventCancellationDto) {
		EventResponseDto eventResponseDto = new EventResponseDto();
		eventResponseDto.setIsSuccessMileStone(Boolean.FALSE);
		eventResponseDto.setMessageMileStone(FAILURE);
		Integer customerId = eventCancellationDto.getCustomer().getCustomerId();
		EventOrderDetailsDto eventOrderDetailsDto = new EventOrderDetailsDto();
		eventOrderDetailsDto.setCustomer(eventCancellationDto.getCustomer());
		eventOrderDetailsDto.setCashMemoDetailsList(eventCancellationDto.getCashMemoDetailsList());
		eventOrderDetailsDto.setPaymentList(eventCancellationDto.getPaymentDetailsList());
		eventOrderDetailsDto.setSubTxnType(cancelType);
		EventCashMemoCancellationAuditDto eventCashMemoCancellationAuditDto = createEventCashMemoCancellationAudit(
				vendorCode, txnId, cancelType, status, eventCancellationDto);
		String request = MapperUtil.getJsonString(eventCashMemoCancellationAuditDto);
		VendorDao vendor = validateVendor(vendorCode);
		DialAuditDao dialAudit = getInitialDialAuditDetails(vendor, txnId, EventTransactionEnum.BC_MILESTONE.name());
		if (BooleanUtils.isTrue(isScheduled)) {
			List<DialAuditDao> dialMileStoneAuditCheck = dialAuditRepository
					.findByVendorVendorCodeAndRefTxnIdAndTransactionStatusAndTransactionType(vendorCode, txnId,
							Boolean.FALSE, EventTransactionEnum.BC_MILESTONE.name());
			dialMileStoneAuditCheck.forEach(audit -> {
				audit.setRefTxnId(null);
			});
			dialAuditRepository.saveAll(dialMileStoneAuditCheck);
		}
		BeginTransactionWithTillLookupResponse beginTransactionWithTillLookupResponse = new BeginTransactionWithTillLookupResponse();
		try {
			beginTransactionWithTillLookupResponse = beginTransactionWithTillLookup(dialAudit.getTransactionId(),
					vendor, customerId.toString(), txnId, EventTransactionEnum.BC_MILESTONE.name());
		} catch (Exception e) {
			saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
						EventTransactionEnum.BC_MILESTONE.name(), eventResponseDto, isScheduled, status);
			return eventResponseDto;
		}
		if (!beginTransactionWithTillLookupResponse.getBeginTransactionWithTillLookupResult().isSucceeded()) {
			saveAuditForFailedTransactionsMileStone(dialAudit,
					beginTransactionWithTillLookupResponse.getBeginTransactionWithTillLookupResult()
							.getErrorDescription(),
					MapperUtil.getJsonString(eventCashMemoCancellationAuditDto), eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
						EventTransactionEnum.BC_MILESTONE.name(), eventResponseDto, isScheduled, status);
			return eventResponseDto;
		}
		try {
			eventBillCancellation(eventCancellationDto, vendor, beginTransactionWithTillLookupResponse, cancelType,
					status, dialAudit, txnId);
		} catch (Exception e) {
			saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
						EventTransactionEnum.BC_MILESTONE.name(), eventResponseDto, isScheduled, status);
			return eventResponseDto;
		}
		if (transactionErrorBc != null) {
			saveAuditForFailedTransactionsMileStone(dialAudit, transactionErrorBc, request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
						EventTransactionEnum.BC_MILESTONE.name(), eventResponseDto, isScheduled, status);
			return eventResponseDto;

		}
		if (status.equalsIgnoreCase(TransactionStatusEnum.CANCELLED.name())) {
			AddTransactionTotalLineResponse addTransactionTotalLineResponse = new AddTransactionTotalLineResponse();
			try {
				addTransactionTotalLineResponse = addTransactionTotalLine(vendor, beginTransactionWithTillLookupResponse
						.getBeginTransactionWithTillLookupResult().getTransactionSessionId(), totalAmountBc);
			} catch (Exception e) {
				saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
				if (BooleanUtils.isFalse(isScheduled))
					orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
							EventTransactionEnum.BC_MILESTONE.name(), eventResponseDto, isScheduled, status);
				return eventResponseDto;
			}
			if (!addTransactionTotalLineResponse.getAddTransactionTotalLineResult().isSucceeded()) {
				saveAuditForFailedTransactionsMileStone(dialAudit,
						addTransactionTotalLineResponse.getAddTransactionTotalLineResult().getErrorDescription(),
						request, eventResponseDto);
				if (BooleanUtils.isFalse(isScheduled))
					orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
							EventTransactionEnum.BC_MILESTONE.name(), eventResponseDto, isScheduled, status);
				return eventResponseDto;
			}
			try {
				eventBillCancellationPayment(eventCancellationDto, beginTransactionWithTillLookupResponse, vendor);
			} catch (Exception e) {
				saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
				if (BooleanUtils.isFalse(isScheduled))
					orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
							EventTransactionEnum.BC_MILESTONE.name(), eventResponseDto, isScheduled, status);
				return eventResponseDto;
			}

			if (transactionErrorBc != null) {
				saveAuditForFailedTransactionsMileStone(dialAudit, transactionErrorBc, request, eventResponseDto);
				if (BooleanUtils.isFalse(isScheduled))
					orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
							EventTransactionEnum.BC_MILESTONE.name(), eventResponseDto, isScheduled, status);
				return eventResponseDto;
			}
			AddTransactionEventResponse addTransactionEventResponse = new AddTransactionEventResponse();
			try {
				addTransactionEventResponse = addTransactionEvent(vendor, beginTransactionWithTillLookupResponse
						.getBeginTransactionWithTillLookupResult().getTransactionSessionId(), null);
			} catch (Exception e) {
				saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
				if (BooleanUtils.isFalse(isScheduled))
					orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
							EventTransactionEnum.BC_MILESTONE.name(), eventResponseDto, isScheduled, status);
				return eventResponseDto;
			}
			if (!addTransactionEventResponse.getAddTransactionEventResult().isSucceeded()) {
				saveAuditForFailedTransactionsMileStone(dialAudit,
						addTransactionEventResponse.getAddTransactionEventResult().getErrorDescription(), request,
						eventResponseDto);
				if (BooleanUtils.isFalse(isScheduled))
					orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
							EventTransactionEnum.BC_MILESTONE.name(), eventResponseDto, isScheduled, status);
				return eventResponseDto;
			}
			CommitTransactionResponse commitTransactionResponse = new CommitTransactionResponse();
			try {
				commitTransactionResponse = commitTransaction(vendor, beginTransactionWithTillLookupResponse
						.getBeginTransactionWithTillLookupResult().getTransactionSessionId());
			} catch (Exception e) {
				saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
				if (BooleanUtils.isFalse(isScheduled))
					orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
							EventTransactionEnum.BC_MILESTONE.name(), eventResponseDto, isScheduled, status);
				return eventResponseDto;
			}
			setFinalDialAuditDetails(dialAudit, request,
					new JSONObject()
							.put("transaction_id",
									commitTransactionResponse.getCommitTransactionResult().getTransactionId())
							.toString());
		} else {
			setFinalDialAuditDetails(dialAudit, request, "OPEN_ORDER_CANCELLATION");
		}
		eventResponseDto.setIsSuccessMileStone(Boolean.TRUE);
		eventResponseDto.setMessageMileStone(SUCCESS);
		if (BooleanUtils.isFalse(isScheduled))
			orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
					EventTransactionEnum.BC_MILESTONE.name(), eventResponseDto, isScheduled, status);
		return eventResponseDto;

	}

	private EventCashMemoCancellationAuditDto createEventCashMemoCancellationAudit(String vendorCode, String txnId,
			String cancelType, String status, EventCancellationDto eventCancellationDto) {
		EventCashMemoCancellationAuditDto eventCashMemoCancellationAuditDto = new EventCashMemoCancellationAuditDto();
		eventCashMemoCancellationAuditDto.setVendorCode(vendorCode);
		eventCashMemoCancellationAuditDto.setTxnId(txnId);
		eventCashMemoCancellationAuditDto.setCancelType(cancelType);
		eventCashMemoCancellationAuditDto.setStatus(status);
		eventCashMemoCancellationAuditDto.setEventCancellationDto(eventCancellationDto);
		return eventCashMemoCancellationAuditDto;
	}

	private void eventBillCancellationPayment(EventCancellationDto eventCancellationDto,
			BeginTransactionWithTillLookupResponse beginTransactionWithTillLookupResponse, VendorDao vendor) {
		eventCancellationDto.getPaymentDetailsList().forEach(cashMemoPayment -> {
			AddTransactionPaymentLineResponse addTransactionPaymentLineResponse = addTransactionPaymentLine(vendor,
					beginTransactionWithTillLookupResponse.getBeginTransactionWithTillLookupResult()
							.getTransactionSessionId(),
					cashMemoPayment.getPaymentCode(), cashMemoPayment.getAmount(), cashMemoPayment.getInstrumentNo(),
					cashMemoPayment.getBankName());
			if (!addTransactionPaymentLineResponse.getAddTransactionPaymentLineResult().isSucceeded()
					&& transactionErrorBc == null) {
				transactionErrorBc = addTransactionPaymentLineResponse.getAddTransactionPaymentLineResult()
						.getErrorDescription();
			}
		});

	}

	private void eventBillCancellation(EventCancellationDto eventCancellationDto, VendorDao vendor,
			BeginTransactionWithTillLookupResponse beginTransactionWithTillLookupResponse, String cancelType,
			String status, DialAuditDao dialAudit, String txnId) {
		String transactionReference = null;
		List<DialAuditDao> referenceObject = dialAuditRepository
				.findByVendorVendorCodeAndRefTxnId(vendor.getVendorCode(), txnId);
		if (referenceObject != null && !referenceObject.isEmpty() && referenceObject.get(0).getTransactionId() != null)
			transactionReference = referenceObject.get(0).getTransactionId();
		else
			transactionReference = dialAudit.getTransactionId();
		for (EventCashMemoDetailsDto cashMemoItem : eventCancellationDto.getCashMemoDetailsList()) {
			Map<String, String> productDescriptionMap = engineServiceClient.getProductGroupList(null, null);
			AddTransactionSaleLineWithTillLookupResponse addTransactionSaleLineWithTillLookupResponse = addTransactionSaleLineWithTillLookup(
					vendor,
					beginTransactionWithTillLookupResponse.getBeginTransactionWithTillLookupResult()
							.getTransactionSessionId(),
					cancelType, status, cashMemoItem.getItemCode(),
					productDescriptionMap.get(cashMemoItem.getProductGroupCode()), cashMemoItem.getTotalQuantity(),
					cashMemoItem.getUnitValue(), cashMemoItem.getTotalDiscount(), cashMemoItem.getTotalValue(),
					transactionReference);
			if (!addTransactionSaleLineWithTillLookupResponse.getAddTransactionSaleLineWithTillLookupResult()
					.isSucceeded() && transactionErrorBc == null)
				transactionErrorBc = addTransactionSaleLineWithTillLookupResponse
						.getAddTransactionSaleLineWithTillLookupResult().getErrorDescription();
			totalAmountBc = totalAmountBc.add(cashMemoItem.getTotalValue());
		}
	}

	@Override
	public EventResponseDto goodsReturnDetails(String vendorCode, String txnId, Boolean isScheduled,
			EventGRNDto eventGRNDto) {
		EventResponseDto eventResponseDto = new EventResponseDto();
		eventResponseDto.setIsSuccessMileStone(Boolean.FALSE);
		eventResponseDto.setMessageMileStone(FAILURE);
		Integer customerId = eventGRNDto.getCustomer().getCustomerId();
		EventOrderDetailsDto eventOrderDetailsDto = new EventOrderDetailsDto();
		eventOrderDetailsDto.setCustomer(eventGRNDto.getCustomer());
		eventOrderDetailsDto.setEventGRNList(eventGRNDto.getEventGRNList());
		eventOrderDetailsDto.setPaymentList(eventGRNDto.getPaymentList());
		VendorDao vendor = validateVendor(vendorCode);
		EventGRNAuditDto eventGRNAuditDto = createEventGrnAuditDetails(vendorCode, txnId, eventGRNDto);
		String request = MapperUtil.getJsonString(eventGRNAuditDto);
		DialAuditDao dialAudit = getInitialDialAuditDetails(vendor, txnId, EventTransactionEnum.GRN_MILESTONE.name());
		if (BooleanUtils.isTrue(isScheduled)) {
			List<DialAuditDao> dialMileStoneAuditCheck = dialAuditRepository
					.findByVendorVendorCodeAndRefTxnIdAndTransactionStatusAndTransactionType(vendorCode, txnId,
							Boolean.FALSE, EventTransactionEnum.GRN_MILESTONE.name());
			dialMileStoneAuditCheck.forEach(audit -> {
				audit.setRefTxnId(null);
			});
			dialAuditRepository.saveAll(dialMileStoneAuditCheck);
		}
		BeginTransactionWithTillLookupResponse beginTransactionWithTillLookupResponse = new BeginTransactionWithTillLookupResponse();
		try {
			beginTransactionWithTillLookupResponse = beginTransactionWithTillLookup(dialAudit.getTransactionId(),
					vendor, customerId.toString(), txnId, EventTransactionEnum.GRN_MILESTONE.name());
		} catch (Exception e) {
			saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
						EventTransactionEnum.GRN_MILESTONE.name(), eventResponseDto, isScheduled,
						TransactionTypeEnum.GRN.name());
			return eventResponseDto;
		}
		if (!beginTransactionWithTillLookupResponse.getBeginTransactionWithTillLookupResult().isSucceeded()) {
			saveAuditForFailedTransactionsMileStone(dialAudit, beginTransactionWithTillLookupResponse
					.getBeginTransactionWithTillLookupResult().getErrorDescription(), request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
						EventTransactionEnum.GRN_MILESTONE.name(), eventResponseDto, isScheduled,
						TransactionTypeEnum.GRN.name());
			return eventResponseDto;
		}
		try {
			eventGrnOperation(eventGRNDto, vendor, beginTransactionWithTillLookupResponse, dialAudit, txnId);
		} catch (Exception e) {
			saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
						EventTransactionEnum.GRN_MILESTONE.name(), eventResponseDto, isScheduled,
						TransactionTypeEnum.GRN.name());
			return eventResponseDto;
		}
		if (transactionErrorGrn != null) {
			saveAuditForFailedTransactionsMileStone(dialAudit, transactionErrorGrn, request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
						EventTransactionEnum.GRN_MILESTONE.name(), eventResponseDto, isScheduled,
						TransactionTypeEnum.GRN.name());
			return eventResponseDto;
		}
		try {
			addTransactionTotalLine(vendor, beginTransactionWithTillLookupResponse
					.getBeginTransactionWithTillLookupResult().getTransactionSessionId(), totalAmountGrn);
		} catch (Exception e) {
			saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
						EventTransactionEnum.GRN_MILESTONE.name(), eventResponseDto, isScheduled,
						TransactionTypeEnum.GRN.name());
			return eventResponseDto;
		}
		try {
			eventGrnPayment(eventGRNDto, vendor, beginTransactionWithTillLookupResponse);
		} catch (Exception e) {
			saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
						EventTransactionEnum.GRN_MILESTONE.name(), eventResponseDto, isScheduled,
						TransactionTypeEnum.GRN.name());
			return eventResponseDto;
		}
		AddTransactionEventResponse addTransactionEventResponse = new AddTransactionEventResponse();
		try {
			addTransactionEventResponse = addTransactionEvent(vendor, beginTransactionWithTillLookupResponse
					.getBeginTransactionWithTillLookupResult().getTransactionSessionId(),
					TransactionTypeEnum.GRN.name());
		} catch (Exception e) {
			saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
						EventTransactionEnum.GRN_MILESTONE.name(), eventResponseDto, isScheduled,
						TransactionTypeEnum.GRN.name());
			return eventResponseDto;
		}
		if (!addTransactionEventResponse.getAddTransactionEventResult().isSucceeded()) {
			saveAuditForFailedTransactionsMileStone(dialAudit,
					addTransactionEventResponse.getAddTransactionEventResult().getErrorDescription(), request,
					eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
						EventTransactionEnum.GRN_MILESTONE.name(), eventResponseDto, isScheduled,
						TransactionTypeEnum.GRN.name());
			return eventResponseDto;
		}
		CommitTransactionResponse commitTransactionResponse = new CommitTransactionResponse();
		try {
			commitTransactionResponse = commitTransaction(vendor, beginTransactionWithTillLookupResponse
					.getBeginTransactionWithTillLookupResult().getTransactionSessionId());
		} catch (Exception e) {
			saveAuditForFailedTransactionsMileStone(dialAudit, e.getMessage(), request, eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
						EventTransactionEnum.GRN_MILESTONE.name(), eventResponseDto, isScheduled,
						TransactionTypeEnum.GRN.name());
			return eventResponseDto;
		}
		if (!commitTransactionResponse.getCommitTransactionResult().isSucceeded()) {
			saveAuditForFailedTransactionsMileStone(dialAudit,
					commitTransactionResponse.getCommitTransactionResult().getErrorDescription(), request,
					eventResponseDto);
			if (BooleanUtils.isFalse(isScheduled))
				orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
						EventTransactionEnum.GRN_MILESTONE.name(), eventResponseDto, isScheduled,
						TransactionTypeEnum.GRN.name());
			return eventResponseDto;
		}
		setFinalDialAuditDetails(dialAudit, request, new JSONObject()
				.put("transaction_id", commitTransactionResponse.getCommitTransactionResult().getTransactionId())
				.toString());
		eventResponseDto.setIsSuccessMileStone(Boolean.TRUE);
		eventResponseDto.setMessageMileStone(SUCCESS);
		if (BooleanUtils.isFalse(isScheduled))
			orderDetailsToDialSave(VendorCodeEnum.DIAL_TRIDENT.name(), txnId, eventOrderDetailsDto,
					EventTransactionEnum.GRN_MILESTONE.name(), eventResponseDto, isScheduled,
					TransactionTypeEnum.GRN.name());
		return eventResponseDto;
	}

	private EventGRNAuditDto createEventGrnAuditDetails(String vendorCode, String txnId, EventGRNDto eventGRNDto) {
		EventGRNAuditDto eventGRNAuditDto = new EventGRNAuditDto();
		eventGRNAuditDto.setVendorCode(vendorCode);
		eventGRNAuditDto.setTxnId(txnId);
		eventGRNAuditDto.setEventGRNDto(eventGRNDto);
		return eventGRNAuditDto;

	}

	private void eventGrnPayment(EventGRNDto eventGRNDto, VendorDao vendor,
			BeginTransactionWithTillLookupResponse beginTransactionWithTillLookupResponse) {
		eventGRNDto.getPaymentList()
				.forEach(grnPayment -> addTransactionPaymentLine(vendor,
						beginTransactionWithTillLookupResponse.getBeginTransactionWithTillLookupResult()
								.getTransactionSessionId(),
						grnPayment.getPaymentCode(), grnPayment.getAmount(), grnPayment.getInstrumentNo(),
						grnPayment.getBankName()));
	}

	private void eventGrnOperation(EventGRNDto eventGRNDto, VendorDao vendor,
			BeginTransactionWithTillLookupResponse beginTransactionWithTillLookupResponse, DialAuditDao dialAudit,
			String txnId) {
		String transactionReference = null;
		List<DialAuditDao> referenceObject = dialAuditRepository
				.findByVendorVendorCodeAndRefTxnId(vendor.getVendorCode(), txnId);
		Map<String, String> productDescriptionMap = engineServiceClient.getProductGroupList(null, null);
		if (referenceObject != null && !referenceObject.isEmpty() && referenceObject.get(0).getTransactionId() != null)
			transactionReference = referenceObject.get(0).getTransactionId();
		else
			transactionReference = dialAudit.getTransactionId();
		for (EventGRNDetailsDto grnItem : eventGRNDto.getEventGRNList()) {
			AddTransactionSaleLineWithTillLookupResponse addTransactionSaleLineWithTillLookupResponse = addTransactionSaleLineWithTillLookup(
					vendor,
					beginTransactionWithTillLookupResponse.getBeginTransactionWithTillLookupResult()
							.getTransactionSessionId(),
					EventTransactionEnum.GRN_MILESTONE.name(), null, grnItem.getItemCode(),
					productDescriptionMap.get(grnItem.getProductGroupCode()), grnItem.getTotalQuantity(),
					grnItem.getFinalValue().divide(BigDecimal.valueOf(grnItem.getTotalQuantity())),
					grnItem.getTotalDiscount(), grnItem.getFinalValue(), transactionReference);
			if (!addTransactionSaleLineWithTillLookupResponse.getAddTransactionSaleLineWithTillLookupResult()
					.isSucceeded() && transactionErrorGrn == null)
				transactionErrorGrn = addTransactionSaleLineWithTillLookupResponse
						.getAddTransactionSaleLineWithTillLookupResult().getErrorDescription();
			totalAmountGrn = totalAmountGrn.add(grnItem.getFinalValue());
		}

	}

	private BeginTransactionWithTillLookupResponse beginTransactionWithTillLookup(String transactionId,
			VendorDao vendor, String customerId, String refTxnId, String transactionType) {
		VendorConfigDao vendorConfig = vendorConfigRepository.findByVendorVendorCodeAndLocationCodeAndIsActive(
				vendor.getVendorCode(), CommonUtil.getLocationCode(), true);
		DialMileStoneVendorDetailsDto dialMileStoneVendorDetailsDto = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(vendorConfig.getConfigDetails()), JsonData.class)
						.getData(), DialMileStoneVendorDetailsDto.class);
		BeginTransactionWithTillLookup beginTransactionWithTillLookup = new BeginTransactionWithTillLookup();
		beginTransactionWithTillLookup.setBranch(dialMileStoneVendorDetailsDto.getBranch());
		beginTransactionWithTillLookup.setTillDescription(dialMileStoneVendorDetailsDto.getTillDescription());
		beginTransactionWithTillLookup.setBranchLinkedTo(dialMileStoneVendorDetailsDto.getBranchLinkedTo());
		beginTransactionWithTillLookup
				.setTillDescriptionLinkedTo(dialMileStoneVendorDetailsDto.getTillDescriptionLinkedTo());
		beginTransactionWithTillLookup.setTransactionNumber(transactionId);
		List<DialAuditDao> dialTransactionReference = dialAuditRepository
				.findByVendorVendorCodeAndRefTxnId(vendor.getVendorCode(), refTxnId);
		if (transactionType.equalsIgnoreCase(EventTransactionEnum.CM_MILESTONE.name())) {
			beginTransactionWithTillLookup.setTransactionNumberLinkedTo(transactionId);
		} else {
			if (dialTransactionReference != null && !dialTransactionReference.isEmpty()
					&& dialTransactionReference.get(0).getTransactionId() != null)
				beginTransactionWithTillLookup
						.setTransactionNumberLinkedTo(dialTransactionReference.get(0).getTransactionId());
			else
				beginTransactionWithTillLookup.setTransactionNumberLinkedTo(transactionId);
		}
		beginTransactionWithTillLookup
				.setTransactionTimestamp(getXMLGregorianCalenderDate((CalendarUtils.getCurrentDate())));
		beginTransactionWithTillLookup.setDebitor(customerId);
		beginTransactionWithTillLookup.setCashier(dialMileStoneVendorDetailsDto.getCashier());
		beginTransactionWithTillLookup
				.setCurrencyCode(engineServiceClient.getCountryDetails(CommonUtil.getLocationCode()).getCurrencyCode());
		beginTransactionWithTillLookup.setTransactionType(TransactionType.COMPLETED_NORMALLY);
		return dialMileStoneClient.beginTransactionWithTillLookup(vendor, beginTransactionWithTillLookup);
	}

	private AddTransactionSaleLineWithTillLookupResponse addTransactionSaleLineWithTillLookup(VendorDao vendor,
			Long txnId, String subTxnType, String status, String itemCode, String productDescription, Short quantity,
			BigDecimal unitValue, BigDecimal discountAmount, BigDecimal totalAmount, String transactionNumberLinkedTo) {
		VendorConfigDao vendorConfig = vendorConfigRepository.findByVendorVendorCodeAndLocationCodeAndIsActive(
				vendor.getVendorCode(), CommonUtil.getLocationCode(), true);
		DialMileStoneVendorDetailsDto dialMileStoneVendorDetailsDto = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(vendorConfig.getConfigDetails()), JsonData.class)
						.getData(), DialMileStoneVendorDetailsDto.class);
		AddTransactionSaleLineWithTillLookup addTransactionSaleLineWithTillLookup = new AddTransactionSaleLineWithTillLookup();
		addTransactionSaleLineWithTillLookup.setTransactionSessionId(txnId);
		addTransactionSaleLineWithTillLookup
				.setLineTimeStamp(getXMLGregorianCalenderDate(CalendarUtils.getCurrentDate()));

		if (status != null && (status.equalsIgnoreCase(TransactionStatusEnum.CANCELLED.name())
				|| status.equalsIgnoreCase(TransactionStatusEnum.OPEN.name()))) {
			addTransactionSaleLineWithTillLookup.setItemAttribute(SaleLineAttribute.CANCELLATION_WITHIN_TRANSACTION);
			addTransactionSaleLineWithTillLookup.setItemQuantity(BigDecimal.valueOf(-quantity));
		} else if (subTxnType != null && subTxnType.equalsIgnoreCase(SubTxnTypeEum.GIFT_SALE.name())) {
			addTransactionSaleLineWithTillLookup.setItemAttribute(SaleLineAttribute.GIFT_CARD);
		} else if (subTxnType != null && subTxnType.equalsIgnoreCase(EventTransactionEnum.GRN_MILESTONE.name())) {
			addTransactionSaleLineWithTillLookup.setItemAttribute(SaleLineAttribute.RETURN_ITEM);
			addTransactionSaleLineWithTillLookup.setItemQuantity(BigDecimal.valueOf(-quantity));
		} else {
			addTransactionSaleLineWithTillLookup.setItemAttribute(SaleLineAttribute.NONE);
			if (quantity != null)
				addTransactionSaleLineWithTillLookup.setItemQuantity(BigDecimal.valueOf(quantity));
		}
		addTransactionSaleLineWithTillLookup.setScanAttribute(ScanAttribute.MANUALLY_ENTERED);
		addTransactionSaleLineWithTillLookup.setItemID(itemCode);
		addTransactionSaleLineWithTillLookup.setItemDescription(productDescription);
		addTransactionSaleLineWithTillLookup.setItemUnitMeasure("Grams");
		addTransactionSaleLineWithTillLookup.setItemUnitPrice(unitValue);
		addTransactionSaleLineWithTillLookup.setDiscountType(DiscountType.AUTO_GENERATED_VALUE);
		addTransactionSaleLineWithTillLookup.setDiscount(discountAmount);
		addTransactionSaleLineWithTillLookup.setTotalAmount(totalAmount);
		addTransactionSaleLineWithTillLookup.setBranchLinkedTo(dialMileStoneVendorDetailsDto.getBranchLinkedTo());
		addTransactionSaleLineWithTillLookup
				.setTillDescriptionLinkedTo(dialMileStoneVendorDetailsDto.getTillDescriptionLinkedTo());
		addTransactionSaleLineWithTillLookup.setTransactionNumberLinkedTo(transactionNumberLinkedTo);
		addTransactionSaleLineWithTillLookup.setPrintable(true);
		return dialMileStoneClient.addTransactionSaleLineWithTillLookup(vendor, addTransactionSaleLineWithTillLookup);
	}

	private AddTransactionTotalLineResponse addTransactionTotalLine(VendorDao vendor, Long transactionId,
			BigDecimal totalAmount) {
		AddTransactionTotalLine addTransactionTotalLine = new AddTransactionTotalLine();
		addTransactionTotalLine.setTransactionSessionId(transactionId);
		addTransactionTotalLine.setLineTimeStamp(getXMLGregorianCalenderDate(CalendarUtils.getCurrentDate()));
		addTransactionTotalLine.setLineAttribute(TotalLineAttribute.TOTAL_AMOUNT_TO_BE_PAID);
		if (totalAmount.intValue() < 0)
			addTransactionTotalLine.setTotalDescription("Total Amount to be Return");
		else
			addTransactionTotalLine.setTotalDescription("Total Amount to be Paid");
		addTransactionTotalLine.setAmount(totalAmount);
		addTransactionTotalLine.setPrintable(true);
		return dialMileStoneClient.addTransactionTotalLine(vendor, addTransactionTotalLine);
	}

	private AddTransactionPaymentLineResponse addTransactionPaymentLine(VendorDao vendor, Long transactionId,
			String paymentType, BigDecimal totalAmount, String paymentTypeId, String paymentTypeSource) {
		AddTransactionPaymentLine addTransactionPaymentLine = new AddTransactionPaymentLine();
		addTransactionPaymentLine.setTransactionSessionId(transactionId);
		addTransactionPaymentLine.setLineTimeStamp(getXMLGregorianCalenderDate(CalendarUtils.getCurrentDate()));
		addTransactionPaymentLine.setAmount(totalAmount);
		createPaymentData(addTransactionPaymentLine, paymentType, paymentTypeId, paymentTypeSource);
		addTransactionPaymentLine.setPrintable(true);
		addTransactionPaymentLine.setCurrencyAmount(totalAmount);
		addTransactionPaymentLine.setExchangeRate(BigDecimal.ONE);
		addTransactionPaymentLine
				.setCurrencyCode(engineServiceClient.getCountryDetails(CommonUtil.getLocationCode()).getCurrencyCode());
		return dialMileStoneClient.addTransactionPaymentLine(vendor, addTransactionPaymentLine);
	}

	private void createPaymentData(AddTransactionPaymentLine addTransactionPaymentLine, String paymentType,
			String paymentTypeId, String paymentTypeSource) {
		addTransactionPaymentLine.setLineAtttribute(PaymentLineAttribute.NONE);
		addTransactionPaymentLine.setPaymentDescription("Other Payment");
		if (paymentType.equalsIgnoreCase(PaymentCodeEnum.CASH.name())) {
			addTransactionPaymentLine.setLineAtttribute(PaymentLineAttribute.CASH);
			addTransactionPaymentLine.setPaymentDescription("Cash Payment");
		}
		if (paymentType.equalsIgnoreCase(PaymentCodeEnum.CARD.name())) {
			addTransactionPaymentLine.setLineAtttribute(PaymentLineAttribute.CREDIT_CARD);
			addTransactionPaymentLine.setPaymentDescription("Credit Card Payment");
			addTransactionPaymentLine.setPaymentTypeID(paymentTypeId);
			addTransactionPaymentLine.setCardType(paymentTypeSource);

		}
		if (paymentType.equalsIgnoreCase(PaymentCodeEnum.QCGC.name())) {
			addTransactionPaymentLine.setLineAtttribute(PaymentLineAttribute.GIFT_CARD);
			addTransactionPaymentLine.setPaymentDescription("Gift Card Payment");
			addTransactionPaymentLine.setPaymentTypeID(paymentTypeId);
			addTransactionPaymentLine.setCardType(paymentTypeSource);

		}
		if (paymentType.equalsIgnoreCase(PaymentCodeEnum.ENCIRCLE.name())) {
			addTransactionPaymentLine.setLineAtttribute(PaymentLineAttribute.LOYALTY_CARD);
			addTransactionPaymentLine.setPaymentDescription("Encircle Payment");
			addTransactionPaymentLine.setPaymentTypeID(paymentTypeId);
			addTransactionPaymentLine.setCardType(paymentTypeSource);

		}
		if (paymentType.equalsIgnoreCase(PaymentCodeEnum.CHEQUE.name())) {
			addTransactionPaymentLine.setLineAtttribute(PaymentLineAttribute.RETURN_CASH);
			addTransactionPaymentLine.setPaymentDescription("Cheque Payment");
		}
		if (paymentType.equalsIgnoreCase(PaymentCodeEnum.GIFT_VOUCHER.name())) {
			addTransactionPaymentLine.setLineAtttribute(PaymentLineAttribute.INTERNAL_SHOP_VOUCHER);
			addTransactionPaymentLine.setPaymentDescription("GV payment");
		}
		if (paymentType.equalsIgnoreCase(PaymentCodeEnum.CREDIT_NOTE.name())) {
			addTransactionPaymentLine.setLineAtttribute(PaymentLineAttribute.CREDIT_NOTE_ISSUED);
			addTransactionPaymentLine.setPaymentDescription("Encircle Payment");
		}
		if (paymentType.equalsIgnoreCase(PaymentCodeEnum.RO_PAYMENT.name())) {
			addTransactionPaymentLine.setLineAtttribute(PaymentLineAttribute.NONE);
			addTransactionPaymentLine.setPaymentDescription("RO Payment");
		}
		if (paymentType.equalsIgnoreCase(PaymentCodeEnum.DD.name())) {
			addTransactionPaymentLine.setLineAtttribute(PaymentLineAttribute.ACCOUNT_SALE);
			addTransactionPaymentLine.setPaymentDescription("DD Payment");
		}
	}

	private AddTransactionEventResponse addTransactionEvent(VendorDao vendor, Long transactionId, String status) {
		AddTransactionEvent addTransactionEvent = new AddTransactionEvent();
		addTransactionEvent.setTransactionSessionId(transactionId);
		addTransactionEvent.setLineTimeStamp(getXMLGregorianCalenderDate(CalendarUtils.getCurrentDate()));
		if (status != null && status.equalsIgnoreCase(TransactionStatusEnum.HOLD.name())) {
			addTransactionEvent.setLineAttribute(EventLineAttribute.TRANSACTION_RESUMED);
			addTransactionEvent.setEventDescription("Transaction Resumed");
		} else if (status != null && status.equalsIgnoreCase(TransactionTypeEnum.GRN.name())) {
			addTransactionEvent.setLineAttribute(EventLineAttribute.TRANSACTION_SUSPENDED);
			addTransactionEvent.setEventDescription("Transaction Suspended");
		} else {
			addTransactionEvent.setLineAttribute(EventLineAttribute.TRANSACTION_CANCELLED);
			addTransactionEvent.setEventDescription("Transaction Cancelled For Bill Cancellation");
		}
		addTransactionEvent.setPrintable(true);
		return dialMileStoneClient.addTransactionEventResponse(vendor, addTransactionEvent);
	}

	private CommitTransactionResponse commitTransaction(VendorDao vendor, Long transactionId) {
		CommitTransaction commitTransaction = new CommitTransaction();
		commitTransaction.setTransactionSessionId(transactionId);
		return dialMileStoneClient.commitTransaction(vendor, commitTransaction);
	}

	private VendorDao validateVendor(String vendorCode) {
		VendorDao vendor = vendorRepository.findByVendorCode(vendorCode);
		boolean isActive = vendor.getIsActive();
		if (!isActive) {
			throw new ServiceException("Vendor is not active", "ERR-INT-017");
		}
		checkIfRequiredFieldsAreThere(vendor);
		return vendor;
	}

	private void checkIfRequiredFieldsAreThere(VendorDao vendor) {
		Set<String> missingFields = new HashSet<>();
		addIfMissing(vendor.getBaseurl(), "base url", missingFields);
		if (!CollectionUtils.isEmpty(missingFields))
			throw new ServiceException("Some Required fields are missing", "ERR_INT_055", missingFields);
	}

	private void addIfMissing(String val, String toAdd, Set<String> missingFields) {
		if (StringUtils.isBlank(val))
			missingFields.add(toAdd);
	}

	private XMLGregorianCalendar getXMLGregorianCalenderDate(Date date) {

		XMLGregorianCalendar xmlDate;
		try {
			GregorianCalendar gregorianCalendar = new GregorianCalendar();
			gregorianCalendar.setTime(date);
			xmlDate = DatatypeFactory.newInstance().newXMLGregorianCalendar(gregorianCalendar);
		} catch (DatatypeConfigurationException e) {
			throw new ServiceException("error while parsing date", "ERR_INT_054");
		}
		return xmlDate;
	}

	private DialAuditDao getInitialDialAuditDetails(VendorDao vendor, String refTxnId, String transactionType) {
		DialAuditDao dialAudit = new DialAuditDao();
		Integer maxId = dialAuditRepository.getMaxSeqNo(CommonUtil.getLocationCode());
		Integer seqNo = ++maxId;
		dialAudit.setSequenceNo(seqNo);
		dialAudit.setLocationCode(CommonUtil.getLocationCode());
		dialAudit.setUrl(vendor.getBaseurl());
		dialAudit.setVendor(vendor);
		dialAudit.setRequestTime(CalendarUtils.getCurrentDate());
		dialAudit.setRefTxnId(refTxnId);
		dialAudit.setHttpStatus(200);
		dialAudit.setTransactionId(CommonUtil.getLocationCode() + seqNo.toString());
		dialAudit.setTransactionType(transactionType);
		return dialAudit;
	}

	private void setFinalDialAuditDetails(DialAuditDao dialAudit, String request, String response) {
		dialAudit.setRequest(request);
		dialAudit.setResponse(response);
		dialAudit.setTransactionStatus(Boolean.TRUE);
		dialAudit.setResponseTime(CalendarUtils.getCurrentDate());
		dialAudit.setTotalTime(CalendarUtils.getCurrentDate().getTime() - dialAudit.getRequestTime().getTime());
		dialAuditRepository.save(dialAudit);
	}

	private void saveAuditForFailedTransactionsMileStone(DialAuditDao dialAudit, String errorDescription,
			String request, EventResponseDto eventResponseDto) {
		dialAudit.setRequest(request);
		dialAudit.setResponse(errorDescription);
		eventResponseDto.setMessageMileStone(errorDescription);
		dialAudit.setTransactionStatus(Boolean.FALSE);
		dialAudit.setResponseTime(CalendarUtils.getCurrentDate());
		dialAudit.setTotalTime(CalendarUtils.getCurrentDate().getTime() - dialAudit.getRequestTime().getTime());
		dialAuditRepository.save(dialAudit);

	}

	private void saveAuditForFailedTransactionsTrident(DialAuditDao dialAudit, String errorDescription, String request,
			EventResponseDto eventResponseDto) {
		dialAudit.setRequest(request);
		dialAudit.setResponse(errorDescription);
		eventResponseDto.setMessageTrident(errorDescription);
		dialAudit.setTransactionStatus(Boolean.FALSE);
		dialAudit.setResponseTime(CalendarUtils.getCurrentDate());
		dialAudit.setTotalTime(CalendarUtils.getCurrentDate().getTime() - dialAudit.getRequestTime().getTime());
		dialAuditRepository.save(dialAudit);

	}

	public EventResponseDto orderDetailsToDialSave(String vendorCode, String refTxnId,
			EventOrderDetailsDto eventOrderDetailsDto, String transactionType, EventResponseDto eventResponseDto,
			Boolean isScheduled, String status) {
		if (transactionType.equalsIgnoreCase(EventTransactionEnum.CM_MILESTONE.name())
				&& status.equalsIgnoreCase(TransactionStatusEnum.HOLD.name())) {
			eventResponseDto.setIsSuccessTrident(Boolean.TRUE);
			eventResponseDto.setMessageTrident(SUCCESS);
			return eventResponseDto;
		}
		String tridentTransaction = null;
		if (transactionType.equalsIgnoreCase(EventTransactionEnum.CM_MILESTONE.name()))
			tridentTransaction = EventTransactionEnum.CM_TRIDENT.name();
		else if (transactionType.equalsIgnoreCase(EventTransactionEnum.BC_MILESTONE.name()))
			tridentTransaction = EventTransactionEnum.BC_TRIDENT.name();
		else
			tridentTransaction = EventTransactionEnum.GRN_TRIDENT.name();
		eventResponseDto.setIsSuccessTrident(Boolean.FALSE);
		eventResponseDto.setMessageTrident(FAILURE);
		EventTridentAuditDto eventTrident = getEventTridentAudit(vendorCode, refTxnId, eventOrderDetailsDto,
				transactionType, eventResponseDto, status);
		String request = MapperUtil.getJsonString(eventTrident);
		if (BooleanUtils.isTrue(isScheduled)) {
			List<DialAuditDao> dialTridentAuditCheck = dialAuditRepository
					.findByVendorVendorCodeAndRefTxnIdAndTransactionStatusAndTransactionType(vendorCode, refTxnId,
							Boolean.FALSE, tridentTransaction);
			dialTridentAuditCheck.forEach(audit -> {
				audit.setRefTxnId(null);
			});
			dialAuditRepository.saveAll(dialTridentAuditCheck);
		}
		VendorDao vendor = validateVendor(vendorCode);
		VendorConfigDao vendorConfig = vendorConfigRepository
				.findByVendorVendorCodeAndLocationCodeAndIsActive(vendorCode, CommonUtil.getLocationCode(), true);
		if (vendorConfig == null) {
			throw new ServiceException("Required Vendor config not present for " + vendorCode, "ERR-INT-013",
					"Vendor details not present for " + vendorCode + " at location: " + CommonUtil.getLocationCode(),
					Map.of("vendorCode", vendorCode));
		}
		DialVendorDataDto dialVendorDataDto = (MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
				DialVendorDataDto.class));
		DialTridentVendorDetailsDto dialTridentVendorDetailsDto = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(vendorConfig.getConfigDetails()), JsonData.class)
						.getData(), DialTridentVendorDetailsDto.class);
		DialAuditDao dialAudit = getInitialDialAuditDetails(vendor, refTxnId, tridentTransaction);
		TransactionData transactionData = new TransactionData();
		transactionData.setServicePartnerNo(dialVendorDataDto.getServicePartnerNo());
		transactionData.setPassword(dialVendorDataDto.getPassword());
		Transactions transactions = new Transactions();
		List<Transaction> transactionList = new ArrayList<>();
		Transaction transaction = new Transaction();
		Items items = new Items();
		List<Item> itemList = new ArrayList<>();
		Payments payments = new Payments();
		List<Payment> paymentList = new ArrayList<>();
		Payment payment = new Payment();
		transaction.setStoreNo(dialTridentVendorDetailsDto.getStoreNo());
		transaction.setPOSNo(dialTridentVendorDetailsDto.getPosNo());
		transaction.setStaffID(CommonUtil.getUserName());
		transaction.setStaffName(CommonUtil.getUserName());
		SimpleDateFormat simpleDate = new SimpleDateFormat("dd-MM-yyyy");
		transaction.setTransactionDate(simpleDate.format(CalendarUtils.getCurrentDate()));
		transaction.setTransactionTime("12:00:00");
		transaction.setCustomerName(eventOrderDetailsDto.getCustomer().getCustomerName());
		transaction.setAddress(eventOrderDetailsDto.getCustomer().getCustomerAddress());
		if (transactionType.equalsIgnoreCase(EventTransactionEnum.CM_MILESTONE.name())
				&& eventOrderDetailsDto.getCashMemoDetailsList() != null) {
			getCmDialSaveData(transaction, dialAudit, eventOrderDetailsDto, itemList, transactionList, payment,
					paymentList);
		}
		if (tridentTransaction.equalsIgnoreCase(EventTransactionEnum.CM_TRIDENT.name())
				&& eventOrderDetailsDto.getCashMemoDetailsList() == null
				&& eventOrderDetailsDto.getGiftSaleList() != null) {
			getGiftSaveData(transaction, dialAudit, eventOrderDetailsDto, itemList, transactionList, payment,
					paymentList);
		}
		if (tridentTransaction.equalsIgnoreCase(EventTransactionEnum.BC_TRIDENT.name())
				&& eventOrderDetailsDto.getCashMemoDetailsList() != null) {
			getBcSaveData(transaction, dialAudit, eventOrderDetailsDto, itemList, transactionList, payment, paymentList,
					refTxnId, status);
		}
		if (tridentTransaction.equalsIgnoreCase(EventTransactionEnum.GRN_TRIDENT.name())) {
			getGrnSaveData(transaction, dialAudit, eventOrderDetailsDto, itemList, transactionList, payment,
					paymentList);
		}
		payments.getPayment().addAll(paymentList);
		items.getItem().addAll(itemList);
		transactions.getTransaction().addAll(transactionList);
		transaction.setPayments(payments);
		transaction.setItems(items);
		transactions.getTransaction().add(transaction);
		transactionData.setTransactions(transactions);
		SaveTransactionResponse saveTransactionResponse = new SaveTransactionResponse();
		try {
			saveTransactionResponse = dialTridentClient.orderDetailsToDialSave(vendor, transactionData,
					dialVendorDataDto);
		} catch (Exception e) {
			saveAuditForFailedTransactionsTrident(dialAudit, e.getMessage(), MapperUtil.getJsonString(eventTrident),
					eventResponseDto);
			return eventResponseDto;
		}
		if (!saveTransactionResponse.getSaveTransactionResult().contains("<Status>Success</Status>")) {
			saveAuditForFailedTransactionsTrident(dialAudit, StringUtils
					.substringBetween(saveTransactionResponse.getSaveTransactionResult(), "<ErrorMsg>", "</ErrorMsg>"),
					request, eventResponseDto);
			return eventResponseDto;
		}
		eventResponseDto.setIsSuccessTrident(Boolean.TRUE);
		eventResponseDto.setMessageTrident(SUCCESS);
		setFinalDialAuditDetails(dialAudit, request, saveTransactionResponse.getSaveTransactionResult());
		return eventResponseDto;
	}

	private void getGrnSaveData(Transaction transaction, DialAuditDao dialAudit,
			EventOrderDetailsDto eventOrderDetailsDto, List<Item> itemList, List<Transaction> transactionList,
			Payment payment, List<Payment> paymentList) {
		transaction.setEntryType(3);
		transaction.setServiceChargeAmount(BigDecimal.ZERO);
		transaction.setSequenceNumber(dialAudit.getSequenceNo().toString());
		BigDecimal totalTax = BigDecimal.ZERO;
		BigDecimal amountTotal = BigDecimal.ZERO;
		for (EventGRNDetailsDto grn : eventOrderDetailsDto.getEventGRNList()) {
			Map<String, String> productDescriptionMap = engineServiceClient.getProductGroupList(null, null);
			Item item = new Item();
			item.setItemCode(grn.getItemCode());
			item.setItemDescription(productDescriptionMap.get(grn.getProductGroupCode()));
			item.setProductGroup(grn.getProductGroupCode());
			item.setQuantity(BigDecimal.valueOf(grn.getTotalQuantity()));
			item.setPrice(grn.getFinalValue().divide(BigDecimal.valueOf(grn.getTotalQuantity())));
			item.setNetAmount(grn.getFinalValue());
			item.setLineDiscount(BigDecimal.ZERO);
			item.setTotalDiscount(BigDecimal.ZERO);
			item.setTaxRate(BigDecimal.ZERO);
			item.setTaxAmount(BigDecimal.ZERO);
			amountTotal = amountTotal.add(grn.getFinalValue());
			itemList.add(item);
		}
		transaction.setDiscountAmount("0");
		transaction.setTotalDiscount("0");
		transaction.setGrossTransactionAmount(amountTotal);
		transaction.setNetTransactionAmount(amountTotal.subtract(totalTax));
		transactionList.add(transaction);
		eventOrderDetailsDto.getPaymentList().forEach(cashMemoPayment -> {
			payment.setAmountTendered(cashMemoPayment.getAmount());
			paymentList.add(payment);
		});

	}

	private void getGiftSaveData(Transaction transaction, DialAuditDao dialAudit,
			EventOrderDetailsDto eventOrderDetailsDto, List<Item> itemList, List<Transaction> transactionList,
			Payment payment, List<Payment> paymentList) {
		transaction.setEntryType(1);
		transaction.setServiceChargeAmount(BigDecimal.ZERO);
		BigDecimal totalTax = BigDecimal.ZERO;
		BigDecimal amountTotal = BigDecimal.ZERO;
		transaction.setSequenceNumber(dialAudit.getSequenceNo().toString());
		for (EventGiftSaleDetailsDto gift : eventOrderDetailsDto.getGiftSaleList()) {
			Item item = new Item();
			item.setItemCode(gift.getInstrumentNo());
			item.setItemDescription(gift.getGiftType());
			item.setProductGroup(gift.getGiftCode());
			item.setQuantity(BigDecimal.ONE);
			item.setPrice(gift.getTotalValue());
			item.setNetAmount(gift.getTotalValue());
			item.setLineDiscount(BigDecimal.ZERO);
			item.setTotalDiscount(BigDecimal.ZERO);
			TaxCalculationResponseDto taxCalculationResponseDto = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(gift.getTaxDetails()), TaxCalculationResponseDto.class);
			BigDecimal taXValue = getTotalTax(taxCalculationResponseDto);
			item.setTaxRate(getTaxRate(taxCalculationResponseDto));
			item.setTaxAmount(taXValue);
			totalTax = totalTax.add(taXValue);
			amountTotal = amountTotal.add(gift.getTotalValue());
			itemList.add(item);
		}
		transaction.setDiscountAmount("0");
		transaction.setTotalDiscount("0");
		transaction.setGrossTransactionAmount(amountTotal);
		transaction.setNetTransactionAmount(amountTotal.subtract(totalTax));
		transactionList.add(transaction);
		eventOrderDetailsDto.getPaymentList().forEach(cashMemoPayment -> {
			payment.setAmountTendered(cashMemoPayment.getAmount());
			paymentList.add(payment);
		});
	}

	private void getBcSaveData(Transaction transaction, DialAuditDao dialAudit,
			EventOrderDetailsDto eventOrderDetailsDto, List<Item> itemList, List<Transaction> transactionList,
			Payment payment, List<Payment> paymentList, String refTxnId, String status) {
		List<DialAuditDao> auditForTransaction = dialAuditRepository
				.findByVendorVendorCodeAndRefTxnId(VendorCodeEnum.DIAL_TRIDENT.name(), refTxnId);
		if (auditForTransaction != null && !auditForTransaction.isEmpty()
				&& auditForTransaction.get(0).getTransactionId() != null)
			transaction.setOriginalRefNo(auditForTransaction.get(0).getTransactionId());
		else
			transaction.setOriginalRefNo(dialAudit.getTransactionId());
		transaction.setTransactionNo(dialAudit.getTransactionId());
		transaction.setEntryType(2);
		transaction.setServiceChargeAmount(BigDecimal.ZERO);
		transaction.setSequenceNumber(dialAudit.getSequenceNo().toString());
		BigDecimal totalDiscount = BigDecimal.ZERO;
		BigDecimal totalTax = BigDecimal.ZERO;
		BigDecimal amountTotal = BigDecimal.ZERO;
		for (EventCashMemoDetailsDto cashMemo : eventOrderDetailsDto.getCashMemoDetailsList()) {
			totalDiscount = totalDiscount.add(cashMemo.getTotalDiscount());
			Map<String, String> productDescriptionMap = engineServiceClient.getProductGroupList(null, null);
			Item item = new Item();
			item.setItemCode(cashMemo.getItemCode());
			item.setItemDescription(productDescriptionMap.get(cashMemo.getProductGroupCode()));
			item.setProductGroup(cashMemo.getProductGroupCode());
			item.setQuantity(BigDecimal.valueOf(cashMemo.getTotalQuantity()));
			item.setPrice(cashMemo.getUnitValue());
			item.setNetAmount(cashMemo.getTotalValue());
			if (item.getTotalDiscount() != null) {
				item.setLineDiscount(cashMemo.getTotalDiscount());
				item.setTotalDiscount(cashMemo.getTotalDiscount());
			} else {
				item.setLineDiscount(BigDecimal.ZERO);
				item.setTotalDiscount(BigDecimal.ZERO);
			}
			TaxCalculationResponseDto taxCalculationResponseDto = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(cashMemo.getTaxDetails()), TaxCalculationResponseDto.class);
			BigDecimal taXValue = getTotalTax(taxCalculationResponseDto);
			item.setTaxRate(getTaxRate(taxCalculationResponseDto));
			item.setTaxAmount(taXValue);
			totalTax = totalTax.add(taXValue);
			amountTotal = amountTotal.add(cashMemo.getTotalValue());
			itemList.add(item);
		}
		transaction.setDiscountAmount(totalDiscount.toString());
		transaction.setTotalDiscount(totalDiscount.toString());
		transaction.setGrossTransactionAmount(amountTotal);
		transaction.setNetTransactionAmount(amountTotal.subtract(totalTax));
		transactionList.add(transaction);
		if (status.equalsIgnoreCase(TransactionStatusEnum.CANCELLED.name())) {
			eventOrderDetailsDto.getPaymentList().forEach(cashMemoPayment -> {
				payment.setAmountTendered(cashMemoPayment.getAmount());
				paymentList.add(payment);
			});
		}

	}

	private EventTridentAuditDto getEventTridentAudit(String vendorCode, String txnId,
			EventOrderDetailsDto eventOrderDetailsDto, String transactionType, EventResponseDto eventResponseDto,
			String status) {
		EventTridentAuditDto eventTrident = new EventTridentAuditDto();
		eventTrident.setVendorCode(vendorCode);
		eventTrident.setTxnId(txnId);
		eventTrident.setEventOrderDetailsDto(eventOrderDetailsDto);
		eventTrident.setTransactionType(transactionType);
		eventTrident.setEventResponseDto(eventResponseDto);
		eventTrident.setStatus(status);
		return eventTrident;
	}

	private void getCmDialSaveData(Transaction transaction, DialAuditDao dialAudit,
			EventOrderDetailsDto eventOrderDetailsDto, List<Item> itemList, List<Transaction> transactionList,
			Payment payment, List<Payment> paymentList) {
		transaction.setTransactionNo(dialAudit.getTransactionId());
		transaction.setOriginalRefNo(dialAudit.getTransactionId());
		transaction.setEntryType(1);
		transaction.setServiceChargeAmount(BigDecimal.ZERO);
		transaction.setSequenceNumber(dialAudit.getSequenceNo().toString());
		BigDecimal totalDiscount = BigDecimal.ZERO;
		BigDecimal totalTax = BigDecimal.ZERO;
		BigDecimal amountTotal = BigDecimal.ZERO;
		for (EventCashMemoDetailsDto cashMemo : eventOrderDetailsDto.getCashMemoDetailsList()) {
			totalDiscount = totalDiscount.add(cashMemo.getTotalDiscount());
			Map<String, String> productDescriptionMap = engineServiceClient.getProductGroupList(null, null);
			Item item = new Item();
			item.setItemCode(cashMemo.getItemCode());
			item.setItemDescription(productDescriptionMap.get(cashMemo.getProductGroupCode()));
			item.setProductGroup(cashMemo.getProductGroupCode());
			item.setQuantity(BigDecimal.valueOf(cashMemo.getTotalQuantity()));
			item.setPrice(cashMemo.getUnitValue());
			item.setNetAmount(cashMemo.getTotalValue());
			if (item.getTotalDiscount() != null) {
				item.setLineDiscount(cashMemo.getTotalDiscount());
				item.setTotalDiscount(cashMemo.getTotalDiscount());
			} else {
				item.setLineDiscount(BigDecimal.ZERO);
				item.setTotalDiscount(BigDecimal.ZERO);
			}
			TaxCalculationResponseDto taxCalculationResponseDto = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(cashMemo.getTaxDetails()), TaxCalculationResponseDto.class);
			BigDecimal taXValue = getTotalTax(taxCalculationResponseDto);
			item.setTaxRate(getTaxRate(taxCalculationResponseDto));
			item.setTaxAmount(taXValue);
			totalTax = totalTax.add(taXValue);
			amountTotal = amountTotal.add(cashMemo.getTotalValue());
			itemList.add(item);
		}
		transaction.setDiscountAmount(totalDiscount.toString());
		transaction.setTotalDiscount(totalDiscount.toString());
		transaction.setGrossTransactionAmount(amountTotal);
		transaction.setNetTransactionAmount(amountTotal.subtract(totalTax));
		transactionList.add(transaction);
		eventOrderDetailsDto.getPaymentList().forEach(cashMemoPayment -> {
			payment.setAmountTendered(cashMemoPayment.getAmount());
			paymentList.add(payment);
		});
	}

	private BigDecimal getTaxRate(TaxCalculationResponseDto taxCalculationResponseDto) {
		BigDecimal totalTaxRate = BigDecimal.ZERO;
		if (taxCalculationResponseDto != null) {
			Map<String, TaxDetailDto> data = taxCalculationResponseDto.getData();
			if (!CollectionUtils.isEmpty(data)) {
				for (TaxDetailDto taxDetailDto : data.values()) {
					if (taxDetailDto.getTaxPercentage() != null)
						totalTaxRate = totalTaxRate.add(taxDetailDto.getTaxPercentage());
				}
			}
		}
		return totalTaxRate;
	}

	private BigDecimal getTotalTax(TaxCalculationResponseDto taxCalculationResponseDto) {
		BigDecimal tax = BigDecimal.ZERO;
		if (taxCalculationResponseDto != null) {
			Map<String, TaxDetailDto> data = taxCalculationResponseDto.getData();
			if (!CollectionUtils.isEmpty(data)) {
				for (TaxDetailDto taxDetailDto : data.values()) {
					if (taxDetailDto.getTaxValue() != null)
						tax = tax.add(taxDetailDto.getTaxValue());
				}
			}
		}
		return tax;
	}
}
