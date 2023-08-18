/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service.impl.documents;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang3.EnumUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.EinvoiceTransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.PurityDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.StoneDetailsLiteDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.NumberToWordsFactory;
import com.titan.poss.sales.constants.DiscountDescriptionEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.PricingTypeEnum;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerTcsDetailsDaoExt;
import com.titan.poss.sales.dao.FocDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.TxnTypeTotalDetailDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.response.CashMemoPrintDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.dto.response.DiscountDetailResponseDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.dto.response.GhsPaymentOtherDetailsDto;
import com.titan.poss.sales.dto.response.ItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.inventory.service.InventoryEngineService;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepository;
import com.titan.poss.sales.repository.CustomerTcsDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.FocDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.DiscountFacadeService;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.PaymentFacadeService;
import com.titan.poss.sales.service.impl.BusinessDayServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service
public class CMDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	public CMDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.CM.name(), PrintFileTypeEnum.INVOICE_PRINT.name(),
				this);
	}

	@Autowired
	private PaymentFacadeService paymentFacadeService;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepo;

	@Autowired
	private CommonCashMemoService cashMemoCommonService;

	@Autowired
	private CustomerTcsDetailsRepositoryExt customerTcsDetailsRepository;

	@Autowired
	NumberToWordsFactory numberToWordsFactory;

	@Autowired
	private EngineService engineService;

	@Autowired
	private BusinessDayServiceImpl businessDayService;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepo;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private CreditNoteService creditNoteService;

	@Autowired
	private DiscountFacadeService discountFacadeService;

	@Autowired
	CreditNoteRepository creditNoteRepository;

	@Autowired
	private FocDetailsRepositoryExt focDetailsRepository;

	@Autowired
	private InventoryEngineService inventoryEngineService;

	@Autowired
	private EngineServiceClient engineClient;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Override
	public PrintableDto getPrintableDto(String txnId, String productCode) {

		return getftlBindingObjectForCM(txnId);
	}

	/**
	 * 
	 * @param txnId
	 * @return CashMemoPrintDto
	 */
	private CashMemoPrintDto getftlBindingObjectForCM(String txnId) {

		CashMemoPrintDto cashMemoPrint = new CashMemoPrintDto();
		SalesTxnDaoExt salesTxn = salesTxnRepo.findByIdAndLocationCode(txnId, CommonUtil.getLocationCode());
		Map<String, List<StandardPriceResponseDto>> metalRates = metalRate(salesTxn.getMetalRateDetails());
		SimpleDateFormat docDate = new SimpleDateFormat("dd/MM/yyyy");
		cashMemoPrint.setStoreDetails(getStoreDetails());
		CashMemoResponseDto cashMemo=getCashMemo(txnId, CommonUtil.getStoreCode());
		//cashMemo.
		cashMemoPrint.setCashMemo(cashMemo);
		cashMemoPrint.setBasicMetalDetails(metalRates);

		List<ItemDetailsResponseDto> itemDetails = getCashMemoDetails(txnId);
		List<String> itemCodes = itemDetails.stream().map(ItemDetailsResponseDto::getItemCode)
				.collect(Collectors.toList());
		cashMemoPrint.setItemDetails(itemDetails);
		cashMemoPrint.setFocItems(focDetailsRepository.findAllBySalesTxnId(txnId));
		Integer focQty =0;
		BigDecimal focTotalWt = BigDecimal.ZERO;
		if(cashMemoPrint.getFocItems()!=null && !CollectionUtil.isEmpty(cashMemoPrint.getFocItems())) {
			 focQty	= cashMemoPrint.getFocItems().stream().map(f->f.getTotalQuantity().intValue()).reduce(0,Integer:: sum);
		   
			//cashMemoPrint.setFocQty( focQty.shortValue());
			 focTotalWt =cashMemoPrint.getFocItems().stream().map(f->f.getTotalWeight()).reduce(BigDecimal.ZERO,BigDecimal ::add);
			 log.info("focTotalwt :{}",focTotalWt);
		}
	
		/*
		 * ListResponse<SalesPaymentDto> listResponsePayment =
		 * paymentFacadeService.getPaymentDetails(txnId, null, null, null);
		 */

		List<SalesPaymentDto> paymentDetails = new ArrayList<>();
		ListResponse<SalesPaymentDto> listResponsePayment = paymentFacadeService.getPaymentDetails(txnId, null, null,
				null);
		List<SalesPaymentDto> paymentDetailsTemp = listResponsePayment.getResults();

		Map<String, SalesPaymentDto> paymentDetailsMap = new HashMap<>();
		for (SalesPaymentDto salesPaymentDto : paymentDetailsTemp) {
			PaymentCodeEnum paymentCode = PaymentCodeEnum
					.valueOfPaymentCode(salesPaymentDto.getPaymentCode().toUpperCase());
			if (null == paymentCode || (!paymentCode.equals(PaymentCodeEnum.CREDIT_NOTE)
					&& !paymentCode.equals(PaymentCodeEnum.GHS_ACCOUNT)
					&& !paymentCode.equals(PaymentCodeEnum.CHEQUE))) {
				salesPaymentDto.setInstrumentNo(null);
				salesPaymentDto.setInstrumentDate(null);
			}
			if (null == paymentCode || (!paymentCode.equals(PaymentCodeEnum.CREDIT_NOTE)
					&& !paymentCode.equals(PaymentCodeEnum.GHS_ACCOUNT)
					&& !paymentCode.equals(PaymentCodeEnum.GHS_EVOUCHER)
					&& !paymentCode.equals(PaymentCodeEnum.CHEQUE))) {
				if (paymentDetailsMap.containsKey(salesPaymentDto.getPaymentCode())) {
					salesPaymentDto.setAmount(salesPaymentDto.getAmount()
							.add(paymentDetailsMap.get(salesPaymentDto.getPaymentCode()).getAmount()));
					paymentDetailsMap.put(salesPaymentDto.getPaymentCode(), salesPaymentDto);
				} else {
					paymentDetailsMap.put(salesPaymentDto.getPaymentCode(), salesPaymentDto);
				}
			} else if (null != paymentCode && (paymentCode.equals(PaymentCodeEnum.GHS_ACCOUNT)
					|| paymentCode.equals(PaymentCodeEnum.GHS_EVOUCHER))) {
				if (paymentDetailsMap.containsKey(salesPaymentDto.getPaymentCode())) {
					if (salesPaymentDto.getInstrumentNo()
							.equals(paymentDetailsMap.get(salesPaymentDto.getPaymentCode()).getInstrumentNo())) {
						salesPaymentDto.setAmount(salesPaymentDto.getAmount()
								.add(paymentDetailsMap.get(salesPaymentDto.getPaymentCode()).getAmount()));
						paymentDetailsMap.put(salesPaymentDto.getPaymentCode(), salesPaymentDto);
					} else {
						paymentDetails.add(salesPaymentDto);
					}
				} else {
					paymentDetailsMap.put(salesPaymentDto.getPaymentCode(), salesPaymentDto);
				}
			} else {
				paymentDetails.add(salesPaymentDto);
			}
		}
		for (String instrumentTypeKey : paymentDetailsMap.keySet()) {
			paymentDetails.add(paymentDetailsMap.get(instrumentTypeKey));
		}

		cashMemoPrint.setPaymentDetails(paymentDetails);
		setCreditNoteInfo(paymentDetails, salesTxn.getCustomerId(), cashMemoPrint);
		if (itemCodes == null || CollectionUtil.isEmpty(itemCodes)) {
			List<FocDetailsDaoExt> focDetails = focDetailsRepository.findBySalesTxnId(txnId);
			itemCodes = focDetails.stream().map(f->f.getItemCode()).collect(Collectors.toList());
		    
			//cashMemoPrint.setFocTotalWt(focTotalWt);
		}
		cashMemoPrint.setDiscountValues(setDiscountDetails(salesTxn));
		cashMemoPrint.setCustomer(getCustomerDetails(txnId, CommonUtil.getLocationCode()));
		cashMemoPrint.setCmTotalDetail(getCMTotalDetail(itemDetails,focTotalWt));
		if(cashMemoPrint.getCmTotalDetail().getTotalGrossWeight().compareTo(BigDecimal.ZERO)==0) {
			;
		}
		cashMemoPrint.setItems(engineService.listItemDetails(itemCodes));
		cashMemoPrint.setPriceInWords(SalesUtil.addHyphen(numberToWordsFactory.getPriceInWords(
				cashMemoPrint.getCashMemo().getFinalValue().longValue(), DomainConstants.ASIAN_PRICE_TYPE)));

		cashMemoPrint.setCustomerMasterId(getCustomerId(cashMemoPrint.getCashMemo().getCustomerId(), null));
		cashMemoPrint.setBusinessDate(businessDayService.getBusinessDay().getBusinessDate());

		// e-invoice set
		cashMemoPrint.setEinvoice(setEinvoiceByTxnId(txnId, EinvoiceTransactionTypeEnum.CASH_MEMO));

		// set customer digital signature
		cashMemoPrint.setCustSignature(setCustDigitalSignature(cashMemoPrint.getCustomer().getMobileNumber(),
				ApplicableTransactionTypes.CASHMEMO, cashMemoPrint.getCustomer().getCustomerType()));

		// set cashier digital signature
		cashMemoPrint.setCashierSignature(setCashierDigitalSignature(cashMemoPrint.getCashMemo().getEmployeeCode()));

		CustomerTcsDetailsDaoExt customerTcsDetailsDao = customerTcsDetailsRepository.findBySalesTxnDaoId(txnId);

		if (customerTcsDetailsDao != null) {
			cashMemoPrint.setTcsAmountPaid(customerTcsDetailsDao.getTcsAmountPaid());
			cashMemoPrint.setTcsPercentage(customerTcsDetailsDao.getTcsPercentage());
		}

		LocationCacheDto locationInfo = getStoreDetails(CommonUtil.getLocationCode());
		cashMemoPrint.setPrintDetails(locationInfo.getPrintDetails());
		cashMemoPrint.setBrandCode(locationInfo.getSubBrandCode());
		cashMemoPrint.setDocDate(docDate.format(cashMemoPrint.getCashMemo().getDocDate()));
		SimpleDateFormat timeStamp = new SimpleDateFormat("h:mm a");
		cashMemoPrint.setTimeStamp(timeStamp.format(cashMemoPrint.getCashMemo().getConfirmedTime()).toLowerCase());
		// increase print count
		// increaseSalesPrintCount(txnId);
		cashMemoPrint.setPrints(getPrints(txnId));
		cashMemoPrint.setProductCategories(inventoryEngineService.getProductCategories());
		cashMemoPrint.setTotalQuantity(cashMemo.getTotalQuantity()+focQty);
		cashMemoPrint.setFocTotalWt(focTotalWt);
		return cashMemoPrint;
	}

	private Map<String, BigDecimal> setDiscountDetails(SalesTxnDaoExt salesTxn) {
		DiscountResponseDto discountResponseDto = discountFacadeService.listTransactionLevelDiscounts(salesTxn.getId(),
				salesTxn.getTxnType(), salesTxn.getSubTxnType(), null, null, salesTxn.getStatus());
		List<DiscountDetailResponseDto> discountDetails = discountResponseDto.getDiscountDetails();
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal itemLevelTotal = BigDecimal.ZERO;
		Map<String, BigDecimal> discountMap = new HashMap<>();

		for (DiscountDetailResponseDto discountDetailResponseDto : discountDetails) {

			String discountDesc = DiscountDescriptionEnum
					.valueOfDiscountDesc(discountDetailResponseDto.getDiscountType().toUpperCase());
			BigDecimal discountValue = discountDetailResponseDto.getDiscountValue();

			if (discountDetailResponseDto.getApplicableLevel().equals(DiscountApplicableLevelEnum.ITEM_LEVEL.name())) {
				String itemLevelDesc = DiscountDescriptionEnum
						.valueOfDiscountDesc(DiscountDescriptionEnum.ITEM_GROUP_LEVEL_DISCOUNT.name().toUpperCase());
				itemLevelTotal = itemLevelTotal.add(discountValue);
				discountMap.put(itemLevelDesc, itemLevelTotal);
			} else {
				if (EnumUtils.isValidEnum(DiscountDescriptionEnum.class,
						discountDetailResponseDto.getDiscountType().toUpperCase())) {
					if (discountMap.containsKey(discountDesc)) {
						totalValue = totalValue.add(discountValue);
						discountMap.put(discountDesc, totalValue);
					} else {
						discountMap.put(discountDesc, discountDetailResponseDto.getDiscountValue());
					}
				}
			}
		}
		return discountMap;
	}

	private void setCreditNoteInfo(List<SalesPaymentDto> results, Integer customerId, CashMemoPrintDto cashMemoPrint) {
		Map<String, CustomerDetailsDto> thirdPartyCNDetails = new HashMap<String, CustomerDetailsDto>();
		List<CreditNoteDaoExt> refundCreditNote = new ArrayList<>();
		for (SalesPaymentDto payment : results) {
			PaymentCodeEnum paymentCode = PaymentCodeEnum.valueOfPaymentCode(payment.getPaymentCode().toUpperCase());
			if (null != paymentCode) {
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
		}
		cashMemoPrint.setRefundCreditNote(refundCreditNote);
		cashMemoPrint.setThirdPartyCNDetails(thirdPartyCNDetails);
	}

	/**
	 * 
	 * @param itemDetails
	 * @return CMTotalDetailDto
	 */
	private TxnTypeTotalDetailDto getCMTotalDetail(List<ItemDetailsResponseDto> itemDetails,BigDecimal focTotalWt ) {

		TxnTypeTotalDetailDto cmTotalDetail = new TxnTypeTotalDetailDto();

		BigDecimal totalGrossWeight = BigDecimal.ZERO;
		BigDecimal totalStoneWeight = BigDecimal.ZERO;
		BigDecimal totalMakingCharges = BigDecimal.ZERO;
		BigDecimal totalProductValue = BigDecimal.ZERO;
		BigDecimal totalPriceValue = BigDecimal.ZERO;
		BigDecimal goldValue = BigDecimal.ZERO;
		BigDecimal stoneValue = BigDecimal.ZERO;
		BigDecimal wastagePercentage = BigDecimal.ZERO;
		BigDecimal makingcharge =BigDecimal.ZERO;
		
		Map<String, BigDecimal> taxCodePercList = new LinkedHashMap<>();

		Map<String, BigDecimal> totalTax = new HashMap<>();

		for (ItemDetailsResponseDto itemDetailResponse : itemDetails) {
			totalProductValue = totalProductValue.add(itemDetailResponse.getFinalValue());
			totalPriceValue = totalPriceValue.add(itemDetailResponse.getTotalValue());

			for (Entry<String, TaxDetailDto> taxCalculation : itemDetailResponse.getTaxDetails().getData().entrySet()) {
				if (totalTax.containsKey(taxCalculation.getValue().getTaxCode())) {
					totalTax.put(taxCalculation.getValue().getTaxCode(), totalTax
							.get(taxCalculation.getValue().getTaxCode()).add(taxCalculation.getValue().getTaxValue()));
				} else {
					taxCodePercList.put(taxCalculation.getValue().getTaxCode(),
							taxCalculation.getValue().getTaxPercentage());
					totalTax.put(taxCalculation.getValue().getTaxCode(), taxCalculation.getValue().getTaxValue());
				}
			}

			if (BooleanUtils.isFalse(itemDetailResponse.getPriceDetails().getIsUcp())
					&& itemDetailResponse.getPriceDetails().getMetalPriceDetails() != null) {
				List<MetalPriceDto> metalPrices = itemDetailResponse.getPriceDetails().getMetalPriceDetails()
						.getMetalPrices();
				if (!CollectionUtil.isEmpty(metalPrices)) {
					for (MetalPriceDto metalPrice : metalPrices) {
						if (metalPrice.getType() != null && metalPrice.getType().equalsIgnoreCase("GOLD")
								&& metalPrice.getMetalValue() != null) {
							goldValue = goldValue.add(metalPrice.getMetalValue());
						}
					}
				}
			}

			if (BooleanUtils.isFalse(itemDetailResponse.getPriceDetails().getIsUcp())
					&& itemDetailResponse.getPriceDetails().getStonePriceDetails().getPreDiscountValue() != null) {
				stoneValue = stoneValue
						.add(itemDetailResponse.getPriceDetails().getStonePriceDetails().getPreDiscountValue());
			}

			if (BooleanUtils.isFalse(itemDetailResponse.getPriceDetails().getIsUcp())
					&& itemDetailResponse.getPriceDetails().getStonePriceDetails().getStoneWeight() != null
					&& itemDetailResponse.getPriceDetails().getStonePriceDetails().getStoneWeightForView() != null) {

				totalStoneWeight = totalStoneWeight.add(itemDetailResponse.getPriceDetails().getStonePriceDetails()
						.getStoneWeightForView().multiply(new BigDecimal(itemDetailResponse.getTotalQuantity())));
				//totalGrossWeight = totalGrossWeight.add(totalStoneWeight);

			} else {
				if (BooleanUtils.isFalse(itemDetailResponse.getPriceDetails().getIsUcp()))
					itemDetailResponse.getPriceDetails().getStonePriceDetails().setStoneWeight(BigDecimal.ZERO);
			}

			if (BooleanUtils.isFalse(itemDetailResponse.getPriceDetails().getIsUcp())
					&& itemDetailResponse.getPricingType()!= null
					&& itemDetailResponse.getPricingType().equals(PricingTypeEnum.PLAIN.toString())) {
				wastagePercentage = wastagePercentage
						.add(itemDetailResponse.getPriceDetails().getMakingChargeDetails().getWastagePct());
					}
			
			
			
			if (BooleanUtils.isFalse(itemDetailResponse.getPriceDetails().getIsUcp()))
				totalMakingCharges = totalMakingCharges
						.add(itemDetailResponse.getPriceDetails().getMakingChargeDetails().getPreDiscountValue());
			

			/*if (null != itemDetailResponse.getPricingType()
					&& itemDetailResponse.getPricingType().equals(PricingTypeEnum.PJWS.toString())) {

				BigDecimal otherStoneWeight = BigDecimal.ZERO;
				try {
					ObjectMapper mapper = new ObjectMapper();
					JsonNode root = mapper.readTree(itemDetailResponse.getMeasuredWeightDetails().toString());
					JsonNode dataNode = root.path("data");

					if (!dataNode.isMissingNode()) {
						if (dataNode.hasNonNull("stoneWeight"))
							otherStoneWeight = otherStoneWeight
									.add(new BigDecimal(dataNode.path("stoneWeight").asText()));
						otherStoneWeight = otherStoneWeight.setScale(3, RoundingMode.HALF_UP);
					}

				} catch (IOException e) {

					e.printStackTrace();
				}

				totalGrossWeight = totalGrossWeight.add(otherStoneWeight);
			}*/
			totalGrossWeight = BooleanUtils.isFalse(itemDetailResponse.getPriceDetails().getIsUcp())
					? totalGrossWeight.add(itemDetailResponse.getPriceDetails().getNetWeight())
					: totalGrossWeight;
			
		}
		
		// For HMGST to be at the 2nd row of last column put HMGST to the end of the
		// list
		if (taxCodePercList.containsKey(CommonConstants.HMGST)) {
			BigDecimal hmgstPerc = taxCodePercList.get(CommonConstants.HMGST);
			taxCodePercList.remove(CommonConstants.HMGST);
			taxCodePercList.put(CommonConstants.HMGST, hmgstPerc);
		}
		//totalGrossWeight = totalGrossWeight.add(focTotalWt);
		log.info("total Gross Wt {}",totalGrossWeight);
		cmTotalDetail.setTotalGrossWeight(totalGrossWeight.setScale(3, RoundingMode.HALF_DOWN));
		cmTotalDetail.setTotalMakingCharges(totalMakingCharges.setScale(2, RoundingMode.UNNECESSARY));
		cmTotalDetail.setTotalPriceValue(totalPriceValue.setScale(3, RoundingMode.UNNECESSARY));
		cmTotalDetail.setTotalProductValue(totalProductValue.setScale(2, RoundingMode.UNNECESSARY));
		cmTotalDetail.setTotalStoneWeight(totalStoneWeight.setScale(3, RoundingMode.UNNECESSARY));
		cmTotalDetail.setTotalTax(totalTax);
		cmTotalDetail.setTaxCodePercList(taxCodePercList);
		cmTotalDetail.setHmGst(CommonConstants.HMGST);
		cmTotalDetail.setStoneValue(stoneValue);
		cmTotalDetail.setTotalNetValue(goldValue);
		cmTotalDetail.setTotalWastagePct(wastagePercentage);

		return cmTotalDetail;

	}

	/**
	 * 
	 * @param <StoneDetailsLiteDto>
	 * @param txnId
	 * @return List<ItemDetailsResponseDto>
	 */
	private List<ItemDetailsResponseDto> getCashMemoDetails(String txnId) {

		List<CashMemoDetailsDaoExt> cashMemoDetailsList = cashMemoDetailsRepo.findByCashMemoDaoId(txnId);
		cashMemoDetailsList.sort(Comparator.comparing(CashMemoDetailsDaoExt::getRowId));
		List<ItemDetailsResponseDto> itemDetailsList = new ArrayList<>();
		for (CashMemoDetailsDaoExt cashMemoDetails : cashMemoDetailsList) {
			BigDecimal otherStoneWeight = BigDecimal.ZERO;
			ItemDetailsResponseDto itemDetails = cashMemoCommonService.mapCashMemoDetailsToItemDto(cashMemoDetails);
			if (null != itemDetails.getPricingType()
					&& itemDetails.getPricingType().equals(PricingTypeEnum.PJWS.toString())) {
				
				try {
					ObjectMapper mapper = new ObjectMapper();
					JsonNode root = mapper.readTree(itemDetails.getMeasuredWeightDetails().toString());
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
			
			if (BooleanUtils.isFalse(itemDetails.getPriceDetails().getIsUcp())
					&& itemDetails.getPriceDetails().getStonePriceDetails().getStoneWeight() != null
					&& itemDetails.getPriceDetails().getStonePriceDetails().getStoneWeightForView() != null) {

				List<StoneDetailsLiteDto> stoneDetails = engineService.getStoneDetails(itemDetails.getItemCode(),
						itemDetails.getLotNumber());
				BigDecimal stoneCaratWt = BigDecimal.ZERO;
				if (stoneDetails != null) {
					for (StoneDetailsLiteDto itemStone : stoneDetails) {
						stoneCaratWt = stoneCaratWt.add(itemStone.getStoneWeight());
					}
				}
				stoneCaratWt = stoneCaratWt.multiply(new BigDecimal(itemDetails.getTotalQuantity()));
				itemDetails.setStoneCaratWt(stoneCaratWt);
				

			}
			
				
			itemDetailsList.add(itemDetails);
		}

		return itemDetailsList;
	}

	private String getPrints(String txnId) {
		SalesTxnDaoExt sales = salesTxnRepo.findByIdAndLocationCodeAndStatus(txnId, CommonUtil.getLocationCode(),
				TransactionStatusEnum.CONFIRMED.name());
		Integer printCount = 0;
		printCount = sales.getPrints() + sales.getEmailPrints();
		// System.out.println("Prints" + printCount);
		if (printCount > 0) {
			return "OFFICE COPY";
		}
		return "CUSTOMER COPY";
	}

	private Map<String, List<StandardPriceResponseDto>> metalRate(String metalRate) {
		Map<String, List<StandardPriceResponseDto>> metalDetailsList = new HashMap<String, List<StandardPriceResponseDto>>();
		MetalRateListDto txnDao = new MetalRateListDto();
		ObjectMapper mapper = new ObjectMapper();
		try {
			JsonNode root = mapper.readTree(metalRate);
			txnDao = MapperUtil.getObjectMapperInstance().convertValue(root, MetalRateListDto.class);
		} catch (IOException e) {
			throw new ServiceException("Error while parsing Json to DAO", "ERR-CORE-003");
		}

		List<PurityDto> allPurities = engineClient.listPurity(true, null, null).getResults();
		List<PurityDto> filteredGoldPurities = allPurities.stream().filter(
				purity -> purity.getIsDisplayed() && purity.getItemTypeCode().equals(MetalTypeCodeEnum.J.getCode()))
				.collect(Collectors.toList());
		filteredGoldPurities.sort(Comparator.comparing(PurityDto::getOffset).reversed());
		for (Map.Entry<String, StandardPriceResponseDto> entry : txnDao.getMetalRates().entrySet()) {
			if (entry.getKey().equals(MetalTypeCodeEnum.J.getCode())) {
				for (PurityDto purity : filteredGoldPurities) {
					StandardPriceResponseDto metalBasicStandard = txnDao.getMetalRates().get(purity.getItemTypeCode());
					if (null != metalBasicStandard) {
						StandardPriceResponseDto standardRate = new StandardPriceResponseDto();
						standardRate.setMetalTypeCode(metalBasicStandard.getMetalTypeCode());
						standardRate.setCurrency(metalBasicStandard.getCurrency());
						standardRate.setKarat(purity.getKarat());
						standardRate.setRatePerUnit(metalBasicStandard.getRatePerUnit().multiply(purity.getOffset()));
						standardRate.setPurity(purity.getPurity());
						if (metalDetailsList.containsKey(metalBasicStandard.getMetalTypeCode())) {
							metalDetailsList.get(metalBasicStandard.getMetalTypeCode()).add(standardRate);
						} else {
							List<StandardPriceResponseDto> standarRateList = new ArrayList<StandardPriceResponseDto>();
							standarRateList.add(standardRate);
							metalDetailsList.put(metalBasicStandard.getMetalTypeCode(), standarRateList);
						}
					}
				}
			} else {
				List<StandardPriceResponseDto> standarRateList = new ArrayList<StandardPriceResponseDto>();
				standarRateList.add(entry.getValue());
				metalDetailsList.put(entry.getKey(), standarRateList);
			}
		}
		return metalDetailsList;
	}

	protected LocationCacheDto getStoreDetails(String locationCode) {
		return engineService.getStoreLocation(locationCode);
	}

	
	@Override
	public PrintableDto getDto() {
		return new CashMemoPrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}

}
