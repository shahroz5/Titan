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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.EinvoiceTransactionTypeEnum;
import com.titan.poss.core.dto.GepPriceResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
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
import com.titan.poss.sales.dto.response.GEPBookingPrintDto;
import com.titan.poss.sales.dto.response.GepItemDetailsDto;
import com.titan.poss.sales.dto.response.GepResponseDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.GoodsExchangeDetailsRepositoryExt;
import com.titan.poss.sales.repository.GoodsExchangeRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
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
public class GEPDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

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

	public GEPDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.GEP.name(),
				PrintFileTypeEnum.INVOICE_PRINT.name(), this);
	}

	@Override
	public PrintableDto getPrintableDto(String txnId, String productCode) {
		return getftlBindingObjectForGEP(txnId);
	}

	/**
	 * @param txnId
	 * @return
	 */
	private GEPBookingPrintDto getftlBindingObjectForGEP(String txnId) {
		SimpleDateFormat docDate = new SimpleDateFormat("dd-MM-yyyy");
		GEPBookingPrintDto gepPrintResponse = new GEPBookingPrintDto();

		gepPrintResponse.setStoreDetails(getStoreDetails());
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
				// call cn service to get CN doc Number
				List<CreditNoteDaoExt> credtNotes = creditNoteRepo.findBySalesTxnId(txnId);
				if (credtNotes.isEmpty()) {
					throw new ServiceException("Credit-Note not found for the Transaction Id", "",
							"Credit-Note not found for the Transaction Id:" + txnId);
				} else {
					gepResponseDto.setCnDocNo(credtNotes.get(0).getDocNo());
				}

			}
		} else {
			throw new ServiceException("No Goods Exchange found for requested id", "ERR-SALE-078",
					"No Goods Exchange found for requested id in CONFIRMED status id: " + txnId);
		}
		gepPrintResponse.setGepReponse(gepResponseDto);
		List<ExchangePriceItemDetailsDto> itemDetails = getGEPDetails(goodsExchangeDao.get());
		List<String> itemCodes = itemDetails.stream().map(GepItemDetailsDto::getItemCode).collect(Collectors.toList());
		gepPrintResponse.setItemDetails(itemDetails);
		gepPrintResponse.setOrderTotalDetails(getGepTotalDetail(itemDetails));
		gepPrintResponse.setItems(engineService.listItemDetails(itemCodes));
		gepPrintResponse.setCustomer(getCustomerDetails(txnId, CommonUtil.getLocationCode()));
		gepPrintResponse.setCustomerMasterId(getCustomerMasterId(txnId));
		gepPrintResponse.setBusinessDate(businessDayService.getBusinessDay().getBusinessDate());

		gepPrintResponse.getGepReponse()
				.setTotalValue(gepPrintResponse.getGepReponse().getTotalValue().setScale(0, RoundingMode.HALF_UP));
		
		gepPrintResponse.setPriceInWords(SalesUtil.addHyphen(numberToWordsFactory.getPriceInWords(
				gepPrintResponse.getGepReponse().getTotalValue().longValue(), DomainConstants.ASIAN_PRICE_TYPE)));

		// e-invoice set
		gepPrintResponse.setEinvoice(setEinvoiceByTxnId(txnId, EinvoiceTransactionTypeEnum.GEP));

		// set customer digital signature
		gepPrintResponse.setCustSignature(setCustDigitalSignature(gepPrintResponse.getCustomer().getMobileNumber(),
				ApplicableTransactionTypes.GEPDECLARATION, gepPrintResponse.getCustomer().getCustomerType()));

		// set cashier digital signature
		gepPrintResponse.setCashierSignature(setCashierDigitalSignature(gepResponseDto.getEmployeeCode()));
		gepPrintResponse.setPrints(getPrints(txnId));

		return gepPrintResponse;
	}

	/**
	 * 
	 * @param itemDetails
	 * @return CMTotalDetailDto
	 */
	private TxnTypeTotalDetailDto getGepTotalDetail(List<ExchangePriceItemDetailsDto> itemDetails) {

		TxnTypeTotalDetailDto cmTotalDetail = new TxnTypeTotalDetailDto();

		BigDecimal totalGrossWeight = BigDecimal.ZERO;
		BigDecimal totalProductValue = BigDecimal.ZERO;
		BigDecimal totalPriceValue = BigDecimal.ZERO;
		BigDecimal totalDeductionValue = BigDecimal.ZERO;
		BigDecimal totalNetValue = BigDecimal.ZERO; // metalValue

		Map<String, BigDecimal> totalTax = new HashMap<>();

		for (ExchangePriceItemDetailsDto itemDetailResponse : itemDetails) {
			GepPriceResponseDto gepPriceReponse = itemDetailResponse.getGepPriceDetails();

			totalProductValue = totalProductValue.add(itemDetailResponse.getFinalValue());
			totalPriceValue = totalPriceValue.add(itemDetailResponse.getTotalValue());
			if (itemDetailResponse.getTaxDetails() == null) {
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
				}
			}

			if (gepPriceReponse.getDeductionValue() != null) {
				totalDeductionValue = totalDeductionValue.add(gepPriceReponse.getDeductionValue());
			}

			if (gepPriceReponse.getNetValue() != null) {
				totalPriceValue = totalPriceValue.add(gepPriceReponse.getNetValue());
			}

			if (gepPriceReponse.getFinalValue() != null) {
				totalProductValue = totalProductValue.add(gepPriceReponse.getFinalValue());
			}

			if (gepPriceReponse.getMeasuredWeight() != null) {
				totalGrossWeight = totalGrossWeight.add(gepPriceReponse.getMeasuredWeight());
			}

			if (gepPriceReponse.getNetValue() != null) {
				totalNetValue = totalNetValue.add(gepPriceReponse.getNetValue());
			}
		}

		cmTotalDetail.setTotalGrossWeight(totalGrossWeight);
		cmTotalDetail.setTotalPriceValue(totalPriceValue);
		cmTotalDetail.setTotalProductValue(totalProductValue);
		cmTotalDetail.setDeductionAmount(totalDeductionValue);
		cmTotalDetail.setTotalTax(totalTax);
		cmTotalDetail.setTotalNetValue(totalNetValue);

		return cmTotalDetail;
	}

	private String getPrints(String txnId) {
		SalesTxnDaoExt sales = salesTxnRepo.findByIdAndLocationCodeAndStatus(txnId, CommonUtil.getLocationCode(),
				TransactionStatusEnum.CONFIRMED.name());
		Integer printCount = 0;
		printCount = sales.getPrints() + sales.getEmailPrints();
		System.out.println("Prints" + printCount);
		if (printCount > 0) {
			return "OFFICE COPY";
		}
		return "CUSTOMER COPY";
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
	private GepPriceResponseDto getGepPriceReponse(Object priceDetails) {

		GepPriceResponseDto txnDao = new GepPriceResponseDto();
		ObjectMapper mapper = new ObjectMapper();

		try {
			JsonNode root = mapper.readTree(priceDetails.toString());
			txnDao = MapperUtil.getObjectMapperInstance().convertValue(root, GepPriceResponseDto.class);
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
	private List<ExchangePriceItemDetailsDto> getGEPDetails(GoodsExchangeDaoExt gepDao) {
		List<GoodsExchangeDetailsDaoExt> gepDetailsDaoExts = goodsExchangeDetailsRepository.findByGoodsExchange(gepDao);

		List<ExchangePriceItemDetailsDto> itemDetailsList = new ArrayList<>();
		for (GoodsExchangeDetailsDaoExt advanceOrderDetails : gepDetailsDaoExts) {

			ExchangePriceItemDetailsDto gepResponseDto = (ExchangePriceItemDetailsDto) MapperUtil
					.getDtoMapping(advanceOrderDetails, ExchangePriceItemDetailsDto.class);
			gepResponseDto.setGepPriceDetails(getGepPriceReponse(advanceOrderDetails.getPriceDetails()));
			itemDetailsList.add(gepResponseDto);
		}
		return itemDetailsList;
	}

	@Override
	public PrintableDto getDto() {
		return new GEPBookingPrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}

}
