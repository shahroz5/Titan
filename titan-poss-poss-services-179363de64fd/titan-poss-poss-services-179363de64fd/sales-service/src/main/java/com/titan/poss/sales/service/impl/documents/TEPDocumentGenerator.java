/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.documents;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.EinvoiceTransactionTypeEnum;
import com.titan.poss.core.dto.ItemLotStoneDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.NumberToWordsFactory;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.ExchangePriceItemDetailsDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.TxnTypeTotalDetailDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.response.GepItemDetailsDto;
import com.titan.poss.sales.dto.response.GepResponseDto;
import com.titan.poss.sales.dto.response.TEPBookingPrintDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.GoodsExchangeDetailsRepositoryExt;
import com.titan.poss.sales.repository.GoodsExchangeRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.OrderUtilService;
import com.titan.poss.sales.service.impl.BusinessDayServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class TEPDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	@Autowired
	GoodsExchangeDetailsRepositoryExt goodsExchangeDetailsRepository;

	@Autowired
	GoodsExchangeRepositoryExt goodsExchangeRepository;

	@Autowired
	OrderUtilService orderUtilService;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepo;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerRepo;

	@Autowired
	private BusinessDayServiceImpl businessDayService;

	@Autowired
	private EngineService engineService;

	@Autowired
	NumberToWordsFactory numberToWordsFactory;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepo;

	@Autowired
	private CommonTransactionService commonTransactionService;

	public TEPDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.TEP.name(),
				PrintFileTypeEnum.INVOICE_PRINT.name(), this);
	}

	@Override
	public PrintableDto getPrintableDto(String txnId, String productCode) {
		return getftlBindingObjectForTEP(txnId);
	}

	/**
	 * @param txnId
	 * @return
	 */
	private TEPBookingPrintDto getftlBindingObjectForTEP(String txnId) {
		TEPBookingPrintDto tepPrintResponse = new TEPBookingPrintDto();

		tepPrintResponse.setStoreDetails(getStoreDetails());
		GepResponseDto gepResponseDto = null;
		Optional<GoodsExchangeDaoExt> goodsExchangeDao = goodsExchangeRepository.findById(txnId);
		if (goodsExchangeDao.isPresent() && goodsExchangeDao.get().getSalesTxn().getStatus()
				.equals(TransactionStatusEnum.CONFIRMED.toString())) {
			gepResponseDto = (GepResponseDto) MapperUtil.getDtoMapping(goodsExchangeDao.get(), GepResponseDto.class);
			Optional<SalesTxnDaoExt> salesTxn = salesTxnRepo.findById(txnId);
			if (salesTxn.isPresent()) {
				gepResponseDto.setMetalRateList(metalRate(salesTxn.get().getMetalRateDetails()));
				gepResponseDto.setLocationCode(salesTxn.get().getLocationCode());
				gepResponseDto.setFiscalYear(salesTxn.get().getFiscalYear());
				gepResponseDto.setDocDate(salesTxn.get().getDocDate());
				gepResponseDto.setDocNo(salesTxn.get().getDocNo());
				gepResponseDto.setEmployeeCode(salesTxn.get().getEmployeeCode());
				gepResponseDto.setTxnType(salesTxn.get().getTxnType());
				gepResponseDto.setSubTxnType(salesTxn.get().getSubTxnType());
				// call cn service to get CN doc Number
				List<CreditNoteDaoExt> credtNotes = creditNoteRepo.findBySalesTxnId(txnId);
				if (credtNotes.isEmpty()) {
					throw new ServiceException("Credit-Note not found for the Transaction Id {}", "ERR-SALE-458",
							txnId);
				} else {
					gepResponseDto.setCnDocNo(credtNotes.get(0).getDocNo());
				}
			}
		} else {
			throw new ServiceException("No Goods Exchange found for requested id in CONFIRMED status", "ERR-SALE-078",
					"No Goods Exchange found for requested id in CONFIRMED status id: " + txnId);
		}
		tepPrintResponse.setTepReponse(gepResponseDto);
		List<ExchangePriceItemDetailsDto> itemDetails = getTEPDetails(goodsExchangeDao.get());
		List<String> itemCodes = itemDetails.stream().map(GepItemDetailsDto::getItemCode).collect(Collectors.toList());
		tepPrintResponse.setItemDetails(itemDetails);
		tepPrintResponse.setOrderTotalDetails(getTepTotalDetail(itemDetails));
		tepPrintResponse.setItems(engineService.listItemDetails(itemCodes));
		tepPrintResponse.setCustomer(getCustomerDetails(txnId, CommonUtil.getLocationCode()));
		tepPrintResponse.setCustomerMasterId(getCustomerMasterId(txnId));
		tepPrintResponse.setBusinessDate(businessDayService.getBusinessDay().getBusinessDate());
		tepPrintResponse.setPriceInWords(SalesUtil.addHyphen(numberToWordsFactory.getPriceInWords(
				tepPrintResponse.getOrderTotalDetails().getExchangeValue().longValue(),
				DomainConstants.ASIAN_PRICE_TYPE)));
		tepPrintResponse.setFullValuePriceInWords(SalesUtil.addHyphen(numberToWordsFactory.getPriceInWords(
				tepPrintResponse.getOrderTotalDetails().getFullValueExchangeValue().longValue(),
				DomainConstants.ASIAN_PRICE_TYPE)));

		// e-invoice set
		tepPrintResponse.setEinvoice(setEinvoiceByTxnId(txnId, EinvoiceTransactionTypeEnum.TEP));

		// set customer digital signature
		tepPrintResponse.setCustSignature(setCustDigitalSignature(tepPrintResponse.getCustomer().getMobileNumber(),
				ApplicableTransactionTypes.TEPDECLARATION, tepPrintResponse.getCustomer().getCustomerType()));
		// set cashier digital signature
		tepPrintResponse.setCashierSignature(setCashierDigitalSignature(gepResponseDto.getEmployeeCode()));
		tepPrintResponse.setPrints(getPrints(txnId));
		return tepPrintResponse;
	}

	/**
	 * 
	 * @param itemDetails
	 * @return CMTotalDetailDto
	 */
	private TxnTypeTotalDetailDto getTepTotalDetail(List<ExchangePriceItemDetailsDto> itemDetails) {

		TxnTypeTotalDetailDto cmTotalDetail = new TxnTypeTotalDetailDto();

		BigDecimal totalGrossWeight = BigDecimal.ZERO;
		BigDecimal totalProductValue = BigDecimal.ZERO;
		BigDecimal totalPriceValue = BigDecimal.ZERO;
		BigDecimal totalDeductionValue = BigDecimal.ZERO;
		BigDecimal totalNetValue = BigDecimal.ZERO; // metalValue
		BigDecimal totalStoneWeight = BigDecimal.ZERO;
		BigDecimal totalDiscountRecovered = BigDecimal.ZERO;
		BigDecimal StoneValue = BigDecimal.ZERO;
		BigDecimal totalStoneValue = BigDecimal.ZERO;
		BigDecimal exchangeValue = BigDecimal.ZERO;
		BigDecimal fullValueExchangeValue = BigDecimal.ZERO;

		BigDecimal totalMakingCharge = BigDecimal.ZERO;
		BigDecimal totalSgst = BigDecimal.ZERO;
		BigDecimal totalCgst = BigDecimal.ZERO;

		short noOfStones = 0;

		Map<String, BigDecimal> totalTax = new HashMap<>();

		for (ExchangePriceItemDetailsDto itemDetailResponse : itemDetails) {
			BigDecimal itemFinalValue = BigDecimal.ZERO;
			BigDecimal fullvalueItemFinalValue = BigDecimal.ZERO;
			TepPriceResponseDto tepPriceReponse = itemDetailResponse.getTepPriceDetails();
			BigDecimal stoneValue = tepPriceReponse.getStonePriceDetails().getPreDiscountValue();
			BigDecimal metalValue = tepPriceReponse.getMetalPriceDetails().getPreDiscountValue();
			BigDecimal deductionAmount = tepPriceReponse.getDeductionAmount();
			BigDecimal discountRecovered = tepPriceReponse.getDiscountRecovered();

			totalProductValue = totalProductValue.add(itemDetailResponse.getFinalValue());
			totalPriceValue = totalPriceValue.add(itemDetailResponse.getTotalValue());
			if (itemDetailResponse.getTaxDetails() == null) {
				itemDetailResponse.setSgst(BigDecimal.ZERO);
				itemDetailResponse.setCgst(BigDecimal.ZERO);
				itemDetailResponse.setSgstPercentage(BigDecimal.ZERO);
				itemDetailResponse.setCgstPercentage(BigDecimal.ZERO);
				totalTax.put("NoTax", BigDecimal.ZERO);
			} else {
				for (Entry<String, TaxDetailDto> taxCalculation : itemDetailResponse.getTaxDetails().getData()
						.entrySet()) {
					if (totalTax.containsKey(taxCalculation.getValue().getTaxCode())) {
						totalTax.put(taxCalculation.getValue().getTaxCode(),
								totalTax.get(taxCalculation.getValue().getTaxCode())
										.add(taxCalculation.getValue().getTaxValue()));
					} else {
						totalTax.put(taxCalculation.getValue().getTaxCode(), taxCalculation.getValue().getTaxValue());
					}
					if (taxCalculation.getKey().equalsIgnoreCase("sgst")) {
						itemDetailResponse.setSgst(taxCalculation.getValue().getTaxValue()
								.multiply(new BigDecimal(itemDetailResponse.getQuantity())));
						itemDetailResponse.setSgstPercentage(taxCalculation.getValue().getTaxPercentage());
					}
					if (taxCalculation.getKey().equalsIgnoreCase("cgst")) {
						itemDetailResponse.setCgst(taxCalculation.getValue().getTaxValue()
								.multiply(new BigDecimal(itemDetailResponse.getQuantity())));
						itemDetailResponse.setCgstPercentage(taxCalculation.getValue().getTaxPercentage());
					}
				}
			}
			if (tepPriceReponse.getDeductionAmount() != null) {
				totalDeductionValue = totalDeductionValue.add(tepPriceReponse.getDeductionAmount());
			} else {
				totalDeductionValue = BigDecimal.ZERO;
			}

			if (tepPriceReponse.getMetalPriceDetails() != null) {
				totalPriceValue = totalPriceValue.add(tepPriceReponse.getMetalPriceDetails().getPreDiscountValue());
				itemFinalValue = itemFinalValue.add(tepPriceReponse.getMetalPriceDetails().getPreDiscountValue()
						.multiply(new BigDecimal(itemDetailResponse.getQuantity())));
				fullvalueItemFinalValue = fullvalueItemFinalValue.add(tepPriceReponse.getMetalPriceDetails()
						.getPreDiscountValue().multiply(new BigDecimal(itemDetailResponse.getQuantity())));
			} else {
				totalPriceValue = BigDecimal.ZERO;
			}

			if (tepPriceReponse.getFinalValue() != null) {
				totalProductValue = totalProductValue.add(tepPriceReponse.getFinalValue());
			} else {
				totalProductValue = BigDecimal.ZERO;
			}

			if (tepPriceReponse.getNetWeight() != null) {
				totalGrossWeight = totalGrossWeight.add(tepPriceReponse.getNetWeight());
			} else {
				totalGrossWeight = BigDecimal.ZERO;
			}
			if (tepPriceReponse.getMetalPriceDetails() != null) {
				totalNetValue = totalNetValue.add(tepPriceReponse.getMetalPriceDetails().getPreDiscountValue());

			} else {
				totalNetValue = BigDecimal.ZERO;
			}

			if (itemDetailResponse.getTepPriceDetails().getMakingChargeDetails().getPreDiscountValue() != null) {
				totalMakingCharge = totalMakingCharge
						.add(itemDetailResponse.getTepPriceDetails().getMakingChargeDetails().getPreDiscountValue()
								.multiply(new BigDecimal(itemDetailResponse.getQuantity())));
				fullvalueItemFinalValue = fullvalueItemFinalValue
						.add(itemDetailResponse.getTepPriceDetails().getMakingChargeDetails().getPreDiscountValue()
								.multiply(new BigDecimal(itemDetailResponse.getQuantity())));
			}

			if (itemDetailResponse.getCgst() != null) {
				totalCgst = totalCgst.add(itemDetailResponse.getCgst());
				fullvalueItemFinalValue = fullvalueItemFinalValue.add(itemDetailResponse.getCgst());
			}

			if (itemDetailResponse.getSgst() != null) {
				totalSgst = totalSgst.add(itemDetailResponse.getSgst());
				fullvalueItemFinalValue = fullvalueItemFinalValue.add(itemDetailResponse.getSgst());
			}

			if (itemDetailResponse.getTepPriceDetails() != null
					&& itemDetailResponse.getTepPriceDetails().getStonePriceDetails() != null
					&& itemDetailResponse.getTepPriceDetails().getStonePriceDetails().getStoneWeight() != null) {
				totalStoneWeight = totalStoneWeight.add(itemDetailResponse.getTepPriceDetails().getStonePriceDetails()
						.getStoneWeight().multiply(new BigDecimal(itemDetailResponse.getQuantity())));
				itemFinalValue = itemFinalValue.add(itemDetailResponse.getTepPriceDetails().getStonePriceDetails()
						.getPreDiscountValue().multiply(new BigDecimal(itemDetailResponse.getQuantity())));
				fullvalueItemFinalValue = fullvalueItemFinalValue
						.add(itemDetailResponse.getTepPriceDetails().getStonePriceDetails().getPreDiscountValue()
								.multiply(new BigDecimal(itemDetailResponse.getQuantity())));
			}

			if (itemDetailResponse.getTepPriceDetails() != null
					&& itemDetailResponse.getTepPriceDetails().getStones() != null) {
				List<ItemLotStoneDto> stones = itemDetailResponse.getTepPriceDetails().getStones();
				for (ItemLotStoneDto stone : stones) {
					if (stone.getNoOfStones() != null) {
						noOfStones = (short) (noOfStones + stone.getNoOfStones());
					}
					if (stone.getFinalStoneValue() != null) {
						totalStoneValue = totalStoneValue.add(stone.getFinalStoneValue());
						StoneValue = StoneValue.add(stone.getFinalStoneValue());
					}
				}
			}
			if (itemDetailResponse.getTepPriceDetails().getStonePriceDetails().getPreDiscountValue()
					.compareTo(BigDecimal.ZERO) == 0) {
				itemDetailResponse.getTepPriceDetails().getStonePriceDetails().setPreDiscountValue(StoneValue);
			}

			if (itemDetailResponse.getTepPriceDetails().getDeductionAmount() != null) {
				itemFinalValue = itemFinalValue.subtract(itemDetailResponse.getTepPriceDetails().getDeductionAmount());
			}

			if (itemDetailResponse.getTepPriceDetails().getDiscountRecovered() != null) {
				itemFinalValue = itemFinalValue
						.subtract(itemDetailResponse.getTepPriceDetails().getDiscountRecovered());
			}

			itemDetailResponse.getTepPriceDetails().setItemFinalValue(itemFinalValue);
			itemDetailResponse.getTepPriceDetails().setFullvalueItemFinalValue(fullvalueItemFinalValue);
			exchangeValue = exchangeValue.add(itemFinalValue);
			fullValueExchangeValue = fullValueExchangeValue.add(fullvalueItemFinalValue);
		}

		cmTotalDetail.setTotalGrossWeight(totalGrossWeight);
		cmTotalDetail.setTotalPriceValue(totalPriceValue);
		cmTotalDetail.setTotalProductValue(totalProductValue);
		cmTotalDetail.setDeductionAmount(totalDeductionValue);
		cmTotalDetail.setTotalTax(totalTax);
		cmTotalDetail.setTotalNetValue(totalNetValue);
		cmTotalDetail.setTotalStoneWeight(totalStoneWeight);
		cmTotalDetail.setTotalDiscountRecovered(totalDiscountRecovered);
		cmTotalDetail.setTotalStoneValue(totalStoneValue);
		exchangeValue = exchangeValue.setScale(0, RoundingMode.HALF_UP);
		fullValueExchangeValue = fullValueExchangeValue.setScale(0, RoundingMode.HALF_UP);
		cmTotalDetail.setExchangeValue(exchangeValue);
		cmTotalDetail.setFullValueExchangeValue(fullValueExchangeValue);

		cmTotalDetail.setTotalMakingCharge(totalMakingCharge);
		cmTotalDetail.setTotalCgst(totalCgst);
		cmTotalDetail.setTotalSgst(totalSgst);
		cmTotalDetail.setNumberOfStones(noOfStones);
		cmTotalDetail.setTotalStoneValue(totalStoneValue);
		return cmTotalDetail;
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

	/**
	 * @param cnTransferDto
	 * @return
	 */
	private TepPriceResponseDto getTepPriceReponse(Object priceDetails) {

		TepPriceResponseDto txnDao = new TepPriceResponseDto();
		ObjectMapper mapper = new ObjectMapper();

		try {
			JsonNode root = mapper.readTree(priceDetails.toString());
			txnDao = MapperUtil.getObjectMapperInstance().convertValue(root, TepPriceResponseDto.class);
			BigDecimal finalValue = txnDao.getFinalValue();
			BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(finalValue);
			finalValue = finalValue.add(roundingVariance);
			txnDao.setFinalValue(finalValue);

			return txnDao;

		} catch (IOException e) {
			throw new ServiceException("Error while parsing Json to DAO", "ERR-CORE-003");
		}

	}

	/**
	 * @param cnTransferDto
	 * @return
	 */
	private MetalRateListDto metalRate(String metalRate) {

		MetalRateListDto txnDao = new MetalRateListDto();
		ObjectMapper mapper = new ObjectMapper();

		try {
			JsonNode root = mapper.readTree(metalRate);
			txnDao = MapperUtil.getObjectMapperInstance().convertValue(root, MetalRateListDto.class);
			return txnDao;

		} catch (IOException e) {
			throw new ServiceException("Error while parsing Json to DAO", "ERR-CORE-003");
		}

	}

	/**
	 * @param txnId
	 * @return
	 */
	private List<ExchangePriceItemDetailsDto> getTEPDetails(GoodsExchangeDaoExt tepDao) {
		List<GoodsExchangeDetailsDaoExt> goodExchangeDaoExts = goodsExchangeDetailsRepository
				.findByGoodsExchange(tepDao);

		List<ExchangePriceItemDetailsDto> itemDetailsList = new ArrayList<>();
		for (GoodsExchangeDetailsDaoExt goodExchangeDetails : goodExchangeDaoExts) {

			ExchangePriceItemDetailsDto gepResponseDto = (ExchangePriceItemDetailsDto) MapperUtil
					.getDtoMapping(goodExchangeDetails, ExchangePriceItemDetailsDto.class);
			gepResponseDto.setTepPriceDetails(getTepPriceReponse(goodExchangeDetails.getPriceDetails()));

			String taxDetails = goodExchangeDetails.getTaxDetails();
			ObjectMapper mapper = new ObjectMapper();
			TaxCalculationResponseDto taxDetailsDto;
			try {
				if (taxDetails != null) {
					taxDetailsDto = mapper.readValue(taxDetails, TaxCalculationResponseDto.class);
					gepResponseDto.setTaxDetails(taxDetailsDto);
				}
			} catch (JsonParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (JsonMappingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			itemDetailsList.add(gepResponseDto);
		}
		return itemDetailsList;
	}

	private String getPrints(String txnId) {
		SalesTxnDaoExt sales = salesTxnRepo.findByIdAndLocationCodeAndStatus(txnId, CommonUtil.getLocationCode(),
				TransactionStatusEnum.CONFIRMED.name());
		Integer printCount = 0;
		printCount = sales.getPrints() + sales.getEmailPrints();
		if (printCount > 0) {
			return "OFFICE COPY";
		}
		return "CUSTOMER COPY";
	}

	@Override
	public PrintableDto getDto() {
		return new TEPBookingPrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}

}