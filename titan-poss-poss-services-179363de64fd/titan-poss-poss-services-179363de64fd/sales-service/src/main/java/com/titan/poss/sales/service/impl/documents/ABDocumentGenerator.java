/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service.impl.documents;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.dto.LiteEmployeeListDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.FtlTemplateName;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.PricingTypeEnum;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.TxnTypeTotalDetailDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.response.AdvanceBookingPrintDto;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.dto.response.GhsPaymentOtherDetailsDto;
import com.titan.poss.sales.dto.response.OrderItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.OrderResponseDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.AdvanceRepositoryExt;
import com.titan.poss.sales.repository.CashMemoRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepository;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.OrderDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.OrderUtilService;
import com.titan.poss.sales.service.PaymentFacadeService;
import com.titan.poss.sales.service.impl.BusinessDayServiceImpl;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ABDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	@Autowired
	AdvanceRepositoryExt advanceRepository;

	@Autowired
	OrderUtilService orderUtilService;

	@Autowired
	private OrderDetailsRepositoryExt orderDetailsRepositoryExt;

	@Autowired
	private OrderRepositoryExt orderRepository;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepo;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerRepo;

	@Autowired
	private BusinessDayServiceImpl businessDayService;

	@Autowired
	private PaymentFacadeService paymentFacadeService;

	@Autowired
	private EngineService engineService;

	@Autowired
	CreditNoteRepository creditNoteRepository;

	@Autowired
	private CustomerService customerService;
	
	@Autowired
	private CashMemoRepositoryExt cashMemoRepository;

	@Autowired
	private CreditNoteService creditNoteService;

	private static final String RECORD_NOT_FOUND = "Record(s) Not found";
	private static final String ERR_CORE_039 = "ERR-CORE-039";

	public ABDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.AB.name(), PrintFileTypeEnum.INVOICE_PRINT.name(),
				this);
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.CO.name(), PrintFileTypeEnum.INVOICE_PRINT.name(),
				this);
	}

	@Override
	public PrintableDto getPrintableDto(String txnId, String productCode) {
		return getftlBindingObjectForAB(txnId);
	}

	/**
	 * @param txnId
	 * @return
	 */
	private AdvanceBookingPrintDto getftlBindingObjectForAB(String txnId) {
		OrderResponseDto order = orderUtilService.orderResponse(getAdvanceBooking(txnId), null);
		AdvanceBookingPrintDto advanceBookingPrintDto = new AdvanceBookingPrintDto(order.getTxnType());

		String metal = "";
		String metalRates = "";
		String locationCode = CommonUtil.getLocationCode();
		LocationCacheDto locationInfo = getStoreDetails(CommonUtil.getLocationCode());
		advanceBookingPrintDto.setStoreDetails(locationInfo.getStoreDetails());
		List<OrderItemDetailsResponseDto> itemDetails = getAdvanceBookingDetails(txnId);
		List<String> employeeCodes = itemDetails.stream().map(OrderItemDetailsResponseDto::getEmployeeCode)
				.collect(Collectors.toList());
		Set<String> empCodes = employeeCodes.stream().collect(Collectors.toSet());
		PagedRestResponse<List<LiteEmployeeListDto>> userlist = engineService.getUserList(null, null, empCodes);
		if (userlist != null && !CollectionUtils.isEmpty(userlist.getResults())) {
			List<String> employeeNames = userlist.getResults().stream().map(LiteEmployeeListDto::getEmpName)
					.collect(Collectors.toList());
			advanceBookingPrintDto.setEmployeeNames(employeeNames);
		}
		List<String> itemCodes = itemDetails.stream().map(OrderItemDetailsResponseDto::getItemCode)
				.collect(Collectors.toList());
		advanceBookingPrintDto.setItemDetails(itemDetails);
		advanceBookingPrintDto.setOrder(order);
		// advanceBookingPrintDto.setDocDate(SalesDateUtil.convertDateFormat(order.getDocDate()));

		if (order.getMetalRateList().getMetalRates().containsKey("J")) {
			advanceBookingPrintDto.setCustInfoIsGoldRateFrozen(
					order.getIsFrozenRate() ? "Gold rate is frozen" : "Gold rate is not frozen");
			metal = metal + "Base Gold Rate("
					+ order.getMetalRateList().getMetalRates().get("J").getKarat().stripTrailingZeros().toString()
					+ " Karat) /";
			metalRates = metalRates + order.getMetalRateList().getMetalRates().get("J").getRatePerUnit().toString()
					+ " Rs / ";
		}
		if (order.getMetalRateList().getMetalRates().containsKey("L")) {
			metal = metal + "Base Platinum Rate("
					+ order.getMetalRateList().getMetalRates().get("L").getPurity().stripTrailingZeros().toString()
					+ "%) /";
			metalRates = metalRates + order.getMetalRateList().getMetalRates().get("L").getRatePerUnit().toString()
					+ " Rs / ";
		}
		if (order.getMetalRateList().getMetalRates().containsKey("P")) {
			metal = metal + "Base Silver Rate("
					+ order.getMetalRateList().getMetalRates().get("P").getPurity().stripTrailingZeros().toString()
					+ "%) /";
			metalRates = metalRates + order.getMetalRateList().getMetalRates().get("P").getRatePerUnit().toString()
					+ " Rs /";
		}
		advanceBookingPrintDto.setMetalRates(metalRates);
		advanceBookingPrintDto.setMetals(metal);

		List<SalesPaymentDto> paymentDetails = new ArrayList<>();
		ListResponse<SalesPaymentDto> listResponsePayment = paymentFacadeService.getPaymentDetails(txnId, null, null,
				null);
		List<SalesPaymentDto> paymentDetailsTemp = listResponsePayment.getResults();

		Map<String, SalesPaymentDto> paymentDetailsMap = new HashMap<>();
		for (SalesPaymentDto salesPaymentDto : paymentDetailsTemp) {
			String creditNoteId = salesPaymentDto.getCreditNoteId();
			String paymentDetailsMapKey = creditNoteId + salesPaymentDto.getInstrumentType();
			if (paymentDetailsMap.containsKey(paymentDetailsMapKey)) {
				salesPaymentDto.setAmount(
						salesPaymentDto.getAmount().add(paymentDetailsMap.get(paymentDetailsMapKey).getAmount()));
			}
			if (creditNoteId != null) {
				CreditNoteDao creditNoteDao = creditNoteRepository.getOne(salesPaymentDto.getCreditNoteId());
				salesPaymentDto.setInstrumentNo(creditNoteDao.getDocNo() + "");
				salesPaymentDto.setInstrumentDate(creditNoteDao.getDocDate());
				salesPaymentDto.setInstrumentType(creditNoteDao.getCreditNoteType());
			}
			paymentDetailsMap.put(paymentDetailsMapKey, salesPaymentDto);
			/*
			 * if(!paymentCode.equals(PaymentCodeEnum.CREDIT_NOTE)) { String creditNoteId =
			 * salesPaymentDto.getCreditNoteId(); String paymentDetailsMapKey = creditNoteId
			 * + salesPaymentDto.getInstrumentType();
			 * if(paymentDetailsMap.containsKey(paymentDetailsMapKey)) {
			 * salesPaymentDto.setAmount(salesPaymentDto.getAmount().add(paymentDetailsMap.
			 * get(paymentDetailsMapKey).getAmount())); } if(creditNoteId != null) {
			 * CreditNoteDao creditNoteDao =
			 * creditNoteRepository.getOne(salesPaymentDto.getCreditNoteId());
			 * salesPaymentDto.setInstrumentNo(creditNoteDao.getDocNo() + "");
			 * salesPaymentDto.setInstrumentDate(creditNoteDao.getDocDate()); }
			 * paymentDetailsMap.put(paymentDetailsMapKey, salesPaymentDto); } else {
			 * getCNPaymentDetails(paymentDetails, salesPaymentDto); }
			 */
		}
		for (String instrumentTypeKey : paymentDetailsMap.keySet()) {
			paymentDetails.add(paymentDetailsMap.get(instrumentTypeKey));
		}

		advanceBookingPrintDto.setPaymentDetails(paymentDetails);
		SalesTxnDaoExt salesTxn = salesTxnRepo.findByIdAndLocationCode(txnId, locationCode);
		if(TransactionStatusEnum.PARTIAL_INVOICE.name().equalsIgnoreCase(salesTxn.getStatus())) 
			advanceBookingPrintDto.setBilledWeights(getBilledWeights(txnId, locationCode));
		setCreditNoteInfo(paymentDetails, salesTxn.getCustomerId(), advanceBookingPrintDto);
		
		advanceBookingPrintDto.setCreditNotes(creditNoteRepository.findAllByLinkedTxn(txnId));
		advanceBookingPrintDto.setOrderTotalDetails(getABTotalDetail(itemDetails));
		advanceBookingPrintDto.setItems(engineService.listItemDetails(itemCodes));
		advanceBookingPrintDto.setCustomer(getCustomerDetails(txnId, locationCode));
		advanceBookingPrintDto.setCustomerMasterId(getCustomerMasterId(txnId));
		advanceBookingPrintDto.setBusinessDate(businessDayService.getBusinessDay().getBusinessDate());

		// set customer digital signature
		advanceBookingPrintDto
				.setCustSignature(setCustDigitalSignature(advanceBookingPrintDto.getCustomer().getMobileNumber(),
						ApplicableTransactionTypes.ADVANCEORDERORBOOKING,
						advanceBookingPrintDto.getCustomer().getCustomerType()));

		// set cashier digital signature
		advanceBookingPrintDto.setCashierSignature(setCashierDigitalSignature(order.getEmployeeCode()));

		advanceBookingPrintDto.setPrints(getPrints(txnId));
		advanceBookingPrintDto.setBrandCode(locationInfo.getSubBrandCode());

		// increase print count
		// increaseSalesPrintCount(txnId);
		return advanceBookingPrintDto;
	}

	private Map<Integer, BigDecimal> getBilledWeights(String txnId, String locationCode) {
		Map<Integer, BigDecimal> billedWeights =  new HashMap<>();
		List<SalesTxnDaoExt> partialSalesTxn = salesTxnRepo.findCmHaveOrder(txnId, List.of(TransactionStatusEnum.CONFIRMED.name()));
		Map<String, Integer> partialTxnIds = new HashMap<String, Integer>();
		partialSalesTxn.forEach(txn -> partialTxnIds.put(txn.getId(), txn.getDocNo()));
		if(null!=partialTxnIds)
			partialTxnIds.entrySet().stream().forEach(entry -> {
				CashMemoDaoExt cashMemo = cashMemoRepository.findOneByIdAndSalesTxnDaoLocationCode(entry.getKey(), locationCode);
				billedWeights.put(entry.getValue(), cashMemo.getTotalWeight());
			});
		return billedWeights;
	}

	private void setCreditNoteInfo(List<SalesPaymentDto> paymentDetails, Integer customerId,
			AdvanceBookingPrintDto advanceBookingPrintDto) {
		Map<String, CustomerDetailsDto> thirdPartyCNDetails = new HashMap<String, CustomerDetailsDto>();
		List<CreditNoteDaoExt> refundCreditNote = new ArrayList<>();
		for (SalesPaymentDto payment : paymentDetails) {
			PaymentCodeEnum paymentCode = PaymentCodeEnum.valueOfPaymentCode(payment.getPaymentCode().toUpperCase());
			int customer = 0;
			String cnId = null;
			if (paymentCode.equals(PaymentCodeEnum.CREDIT_NOTE)) {
				CreditNotePaymentOtherDetailsDto cnDetails = MapperUtil.getObjectMapperInstance()
						.convertValue(payment.getOtherDetails().getData(), CreditNotePaymentOtherDetailsDto.class);
				customer = cnDetails.getCnOwnerId();
				cnId = cnDetails.getNewCnId();
			} else if (paymentCode.equals(PaymentCodeEnum.GHS_ACCOUNT)) {
				GhsPaymentOtherDetailsDto ghsDetails = MapperUtil.getObjectMapperInstance()
						.convertValue(payment.getOtherDetails().getData(), GhsPaymentOtherDetailsDto.class);
				customer = ghsDetails.getCustomerId();
				cnId = ghsDetails.getCreditNoteId();
			}

			if (customer != 0 && customer != customerId) {
				CustomerDetailsDto customerDetails = customerService.getCustomer(customer);
				thirdPartyCNDetails.put(payment.getInstrumentNo(), customerDetails);
			}

			if (null != cnId && null != payment.getRefundAmount()
					&& payment.getRefundAmount().compareTo(BigDecimal.ZERO) != 0) {
				refundCreditNote.add(creditNoteService.findByIdAndLocationCode(cnId, CommonUtil.getLocationCode()));
			}
		}
		advanceBookingPrintDto.setRefundCreditNote(refundCreditNote);
		advanceBookingPrintDto.setThirdPartyCNDetails(thirdPartyCNDetails);
	}

	private void getCNPaymentDetails(List<SalesPaymentDto> paymentDetails, SalesPaymentDto salesPaymentDto) {
		String creditNoteId = salesPaymentDto.getCreditNoteId();
		CreditNoteDao creditNoteDao = creditNoteRepository.getOne(creditNoteId);
		ListResponse<SalesPaymentDto> listResponsePaymentCN = paymentFacadeService
				.getPaymentDetails(creditNoteDao.getSalesTxn().getId(), null, null, null);
		List<SalesPaymentDto> paymentDetailsTempCN = listResponsePaymentCN.getResults();
		Map<String, SalesPaymentDto> paymentDetailsMapCN = new HashMap<>();
		for (SalesPaymentDto salesPaymentDtoCN : paymentDetailsTempCN) {
			String paymentDetailsMapKey = salesPaymentDtoCN.getCreditNoteId() + salesPaymentDtoCN.getInstrumentType()
					+ salesPaymentDtoCN.getInstrumentNo();
			if (paymentDetailsMapCN.containsKey(paymentDetailsMapKey)) {
				salesPaymentDtoCN.setAmount(
						salesPaymentDtoCN.getAmount().add(paymentDetailsMapCN.get(paymentDetailsMapKey).getAmount()));
			}
			salesPaymentDtoCN.setInstrumentNo(creditNoteDao.getDocNo() + "");
			salesPaymentDtoCN.setInstrumentDate(creditNoteDao.getDocDate());
			paymentDetailsMapCN.put(paymentDetailsMapKey, salesPaymentDtoCN);
		}
		for (String instrumentTypeKey : paymentDetailsMapCN.keySet()) {
			paymentDetails.add(paymentDetailsMapCN.get(instrumentTypeKey));
		}
	}

	/**
	 * 
	 * @param itemDetails
	 * @return CMTotalDetailDto
	 */
	private TxnTypeTotalDetailDto getABTotalDetail(List<OrderItemDetailsResponseDto> itemDetails) {

		TxnTypeTotalDetailDto cmTotalDetail = new TxnTypeTotalDetailDto();

		BigDecimal totalGrossWeight = BigDecimal.ZERO;
		BigDecimal totalStoneWeight = BigDecimal.ZERO;
		BigDecimal totalMakingCharges = BigDecimal.ZERO;
		BigDecimal totalProductValue = BigDecimal.ZERO;
		BigDecimal totalPriceValue = BigDecimal.ZERO;
		List<String> taxCodeList = new ArrayList<>();

		Map<String, BigDecimal> totalTax = new HashMap<>();

		for (OrderItemDetailsResponseDto itemDetailResponse : itemDetails) {
			totalProductValue = totalProductValue.add(itemDetailResponse.getFinalValue());
			totalPriceValue = totalPriceValue.add(itemDetailResponse.getTotalValue());
			for (Entry<String, TaxDetailDto> taxCalculation : itemDetailResponse.getTaxDetails().getData().entrySet()) {
				if (totalTax.containsKey(taxCalculation.getValue().getTaxCode())) {
					totalTax.put(taxCalculation.getValue().getTaxCode(), totalTax
							.get(taxCalculation.getValue().getTaxCode()).add(taxCalculation.getValue().getTaxValue()));
				} else {
					taxCodeList.add(taxCalculation.getValue().getTaxCode());
					totalTax.put(taxCalculation.getValue().getTaxCode(), taxCalculation.getValue().getTaxValue());
				}

				if (itemDetailResponse.getPriceDetails() != null
						&& itemDetailResponse.getPriceDetails().getStonePriceDetails() != null
						&& itemDetailResponse.getPriceDetails().getStonePriceDetails().getStoneWeight() != null) {
					totalStoneWeight = totalStoneWeight
							.add(itemDetailResponse.getPriceDetails().getStonePriceDetails().getStoneWeight());
				} else if (itemDetailResponse.getPriceDetails() != null
						&& itemDetailResponse.getPriceDetails().getStonePriceDetails() != null) {
					itemDetailResponse.getPriceDetails().getStonePriceDetails().setStoneWeight(BigDecimal.ZERO);
				}
				

				if (itemDetailResponse.getPriceDetails() != null
						&& itemDetailResponse.getPriceDetails().getMakingChargeDetails() != null && itemDetailResponse
								.getPriceDetails().getMakingChargeDetails().getPreDiscountValue() != null) {
					totalMakingCharges = totalMakingCharges
							.add(itemDetailResponse.getPriceDetails().getMakingChargeDetails().getPreDiscountValue());
				}
				
				
			/*	if(itemDetailResponse.getPricingType().equals(PricingTypeEnum.PJWS.toString())){
					
					BigDecimal otherStoneWeight = BigDecimal.ZERO;
					try {
						ObjectMapper mapper = new ObjectMapper();
						 JsonNode root = mapper.readTree(itemDetailResponse.getMeasuredWeightDetails().toString());
							JsonNode dataNode = root.path("data");
						

						if (!dataNode.isMissingNode()) {
							if (dataNode.hasNonNull("stoneWeight"))
								otherStoneWeight = otherStoneWeight
										.add(new BigDecimal(dataNode.path("stoneWeight").asText()));
							otherStoneWeight =otherStoneWeight.setScale(3, RoundingMode.HALF_UP);
						}

					} catch (IOException e) {

						e.printStackTrace();
					}
					
					totalGrossWeight = totalGrossWeight.add(otherStoneWeight);
				}*/
			
			}

			if (itemDetailResponse.getPriceDetails() != null
					&& itemDetailResponse.getPriceDetails().getMetalPriceDetails() != null
					&& itemDetailResponse.getPriceDetails().getMetalPriceDetails().getMetalPrices() != null) {
				for (MetalPriceDto metalPrice : itemDetailResponse.getPriceDetails().getMetalPriceDetails()
						.getMetalPrices()) {
					totalGrossWeight = totalGrossWeight.add(metalPrice.getNetWeight());

				}
			}
		}

		// For HMGST to be at the 2nd row of last column put HMGST to the end of the
		// list
		if (taxCodeList.contains(CommonConstants.HMGST)) {
			taxCodeList.remove(CommonConstants.HMGST);
			taxCodeList.add(CommonConstants.HMGST);
		}

		cmTotalDetail.setTotalGrossWeight(totalGrossWeight);
		cmTotalDetail.setTotalMakingCharges(totalMakingCharges);
		cmTotalDetail.setTotalPriceValue(totalPriceValue);
		cmTotalDetail.setTotalProductValue(totalProductValue);
		cmTotalDetail.setTotalStoneWeight(totalStoneWeight);
		cmTotalDetail.setTotalTax(totalTax);
		cmTotalDetail.setTaxCodeList(taxCodeList);
		cmTotalDetail.setHmGst(CommonConstants.HMGST);

		return cmTotalDetail;

	}

	private String getCustomerMasterId(String txnId) {
		SalesTxnDaoExt sales = salesTxnRepo.findByIdAndLocationCode(txnId, CommonUtil.getLocationCode());
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

	/**
	 * @param txnId
	 * @return
	 */
	private OrderDaoExt getAdvanceBooking(String txnId) {

		OrderDaoExt orderDaoExt = orderRepository.findOneByIdAndSalesTxnLocationCode(txnId,
				CommonUtil.getLocationCode());
		if (orderDaoExt == null)
			throw new ServiceException(RECORD_NOT_FOUND, ERR_CORE_039, "Requested Order doesn't exist");

		return orderDaoExt;
	}

	/**
	 * @param txnId
	 * @return
	 */
	private List<OrderItemDetailsResponseDto> getAdvanceBookingDetails(String txnId) {
		List<OrderDetailsDaoExt> orderDetailsDaoExts = orderDetailsRepositoryExt.findAllByOrderId(txnId);

		List<OrderItemDetailsResponseDto> itemDetailsList = new ArrayList<>();
		for (OrderDetailsDaoExt advanceOrderDetails : orderDetailsDaoExts) {
			BigDecimal otherStoneWeight = BigDecimal.ZERO;
			OrderItemDetailsResponseDto itemDetails = orderUtilService.mapOrderDetailsToItemDto(advanceOrderDetails);
			
			if (null != itemDetails.getPricingType()
					&& itemDetails.getPricingType().equals(PricingTypeEnum.PJWS.toString())) {
				
				try {
					ObjectMapper mapper = new ObjectMapper();
					JsonNode root = mapper.readTree(itemDetails.getInventoryWeightDetails().toString());
					JsonNode dataNode = root.path("data");

					if (!dataNode.isMissingNode()) {
						if (dataNode.hasNonNull("stoneWeight"))
							otherStoneWeight = otherStoneWeight
									.add(new BigDecimal(dataNode.path("stoneWeight").asText()));
						otherStoneWeight = otherStoneWeight.setScale(3, RoundingMode.HALF_UP);
						otherStoneWeight=otherStoneWeight.multiply(new BigDecimal(itemDetails.getTotalQuantity()));
						
					}
				} catch (IOException e) {
					e.printStackTrace();
				}
				
				
			}
			itemDetails.setOtherStoneWt(otherStoneWeight);
			
			itemDetailsList.add(itemDetails);	
		}
		return itemDetailsList;
	}

	private String getPrints(String txnId) {
		SalesTxnDaoExt sales = salesTxnRepo.findByIdAndLocationCode(txnId, CommonUtil.getLocationCode());
		Integer printCount = 0;
		printCount = sales.getPrints() + sales.getEmailPrints();
		System.out.println("Prints" + printCount);
		if (printCount > 0) {
			return "OFFICE COPY";
		}
		return "CUSTOMER COPY";
	}

	@Override
	public PrintableDto getDto() {
		return new AdvanceBookingPrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}
	
	protected LocationCacheDto getStoreDetails(String locationCode) {
		return engineService.getStoreLocation(locationCode);
	}

}
