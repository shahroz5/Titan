/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.documents;

import java.io.IOException;
import java.math.BigDecimal;
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
import com.titan.poss.core.dto.ItemLotStoneDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.ExchangePriceItemDetailsDto;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.TxnTypeTotalDetailDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.print.TEPAnnexurePrintDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.response.GepItemDetailsDto;
import com.titan.poss.sales.dto.response.GepResponseDto;
import com.titan.poss.sales.dto.response.TepDiscountRecoveryDetailsDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.repository.GoodsExchangeDetailsRepositoryExt;
import com.titan.poss.sales.repository.GoodsExchangeRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.impl.BusinessDayServiceImpl;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class TEPAnnexureDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	public TEPAnnexureDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.TEP_ANNEXURE.name(),
				PrintFileTypeEnum.INVOICE_PRINT.name(), this);
	}

	@Autowired
	private BusinessDayServiceImpl businessDayService;

	@Autowired
	GoodsExchangeDetailsRepositoryExt goodsExchangeDetailsRepository;

	@Autowired
	GoodsExchangeRepositoryExt goodsExchangeRepository;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepo;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepo;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerRepo;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepo;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepo;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepo;

	@Override
	public PrintableDto getPrintableDto(String txnId, String productCode) {
		return getftlBindingObjectForCM(txnId);
	}

	/**
	 * @param txnId
	 * @return
	 */
	private TEPAnnexurePrintDto getftlBindingObjectForCM(String txnId) {
		SimpleDateFormat docDate = new SimpleDateFormat("dd-MM-yyyy");
		TEPAnnexurePrintDto tepPrintResponse = new TEPAnnexurePrintDto();
		tepPrintResponse.setStoreDetails(getStoreDetails());
		GepResponseDto gepResponseDto = null;
		Optional<GoodsExchangeDaoExt> goodsExchangeDao = goodsExchangeRepository.findById(txnId);
		if (goodsExchangeDao.isPresent() && goodsExchangeDao.get().getSalesTxn().getStatus()
				.equals(TransactionStatusEnum.CONFIRMED.toString())) {
			gepResponseDto = (GepResponseDto) MapperUtil.getDtoMapping(goodsExchangeDao.get(), GepResponseDto.class);
			Optional<SalesTxnDaoExt> salesTxn = salesTxnRepo.findById(txnId);
			if (salesTxn.isPresent()) {
				// gepResponseDto.setMetalRateList(metalRate(salesTxn.get().getMetalRateDetails()));
				gepResponseDto.setLocationCode(salesTxn.get().getLocationCode());
				gepResponseDto.setFiscalYear(salesTxn.get().getFiscalYear());
				gepResponseDto.setDocDate(salesTxn.get().getDocDate());

				gepResponseDto.setDocNo(salesTxn.get().getDocNo());
				gepResponseDto.setEmployeeCode(salesTxn.get().getEmployeeCode());
				// call cn service to get CN doc Number
				List<CreditNoteDaoExt> credtNotes = creditNoteRepo.findBySalesTxnId(txnId);

				if (!credtNotes.isEmpty()) {
					gepResponseDto.setCnDocNo(credtNotes.get(0).getDocNo());
				}

				tepPrintResponse.setTepReponse(gepResponseDto);
				List<ExchangePriceItemDetailsDto> itemDetails = getTEPDetails(goodsExchangeDao.get());
				List<String> itemCodes = itemDetails.stream().map(GepItemDetailsDto::getItemCode)
						.collect(Collectors.toList());
				tepPrintResponse.setItemDetails(itemDetails);
				tepPrintResponse.setOrderTotalDetails(getTepTotalDetail(itemDetails));
				tepPrintResponse.setItems(engineService.listItemDetails(itemCodes));
				tepPrintResponse.setCustomer(getCustomerDetails(txnId, CommonUtil.getLocationCode()));
				tepPrintResponse.setCustomerMasterId(getCustomerMasterId(txnId));
				tepPrintResponse.setBusinessDate(businessDayService.getBusinessDay().getBusinessDate());

				if (salesTxn.get().getRefTxnId() != null) {
					List<TepDiscountRecoveryDetailsDto> discountRecoveryDetails = new ArrayList<>();
					itemDetails.forEach(item -> {
						TepDiscountRecoveryDetailsDto detailsDto = new TepDiscountRecoveryDetailsDto();
						DiscountDetailsDaoExt discountDetailsDaoExt = discountDetailsRepo
								.findOneBySalesTxn(salesTxn.get().getRefTxnId());
						if (discountDetailsDaoExt != null) {
							List<DiscountItemDetailsDaoExt> discountItemDetailsDaoExt = discountItemDetailsRepo
									.findAllByDiscountDetailIdAndItemCode(discountDetailsDaoExt.getId(),
											item.getTepPriceDetails().getItemCode());
							discountItemDetailsDaoExt.forEach(discountItemDetails -> {
								detailsDto.setDiscountValue(discountDetailsDaoExt.getDiscountValue());
								discountRecoveryDetails.add(detailsDto);
							});
							detailsDto.setDiscountDetails(discountDetailsDaoExt.getDiscountCode());
						}

						detailsDto.setItemCode(item.getTepPriceDetails().getItemCode());
						detailsDto.setDiscountRecovered(item.getTepPriceDetails().getDiscountRecovered());

					});
					tepPrintResponse.setDiscountRecoveryDetails(discountRecoveryDetails);
				}

			}
		} else {
			throw new ServiceException("No Goods Exchange found for requested id in CONFIRMED status", "ERR-SALE-078",
					"No Goods Exchange found for requested id in CONFIRMED status id: " + txnId);
		}
//		BigDecimal totalCarat = BigDecimal.ZERO;
//
//		BigDecimal stoneValue = BigDecimal.ZERO;
//
//		BigDecimal totalStoneDeduction = BigDecimal.ZERO;
//
//		BigDecimal totalStoneDeductionValue = BigDecimal.ZERO;
//
//		BigDecimal totalStoneValue = BigDecimal.ZERO;
//
//		BigDecimal grandTotalCarat = BigDecimal.ZERO;
//
//		BigDecimal grandStoneValue = BigDecimal.ZERO;
//
//		BigDecimal grandTotalStoneDeduction = BigDecimal.ZERO;
//
//		BigDecimal grandTotalStoneDeductionValue = BigDecimal.ZERO;
//
//		BigDecimal granTotalStoneValue = BigDecimal.ZERO;
//		for (BigDecimal string : itemCodes) {
//			
//		}
//		itemDetails.forEach(item -> {
//			grandTotalCarat=grandTotalCarat.add(totalCarat);
//			item.getStones().forEach(stone -> {
//				
//				tepPrintResponse.setGrandTotalCarat(grandTotalCarat);
//			});
//		});
		// e-invoice set
//		tepPrintResponse.setEinvoice(setEinvoiceByTxnId(txnId, EinvoiceTransactionTypeEnum.TEP));

		// set customer digital signature
		tepPrintResponse.setCustSignature(setCustDigitalSignature(tepPrintResponse.getCustomer().getMobileNumber(),
				ApplicableTransactionTypes.TEPDECLARATION, tepPrintResponse.getCustomer().getCustomerType()));
		// set cashier digital signature
		tepPrintResponse.setCashierSignature(setCashierDigitalSignature(gepResponseDto.getEmployeeCode()));
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
		BigDecimal deductionPercentage = BigDecimal.ZERO;
		BigDecimal totalCarat = BigDecimal.ZERO;
		BigDecimal totalStoneValue = BigDecimal.ZERO;
		BigDecimal totalStoneDeductionValue = BigDecimal.ZERO;
		BigDecimal stoneValue = BigDecimal.ZERO;
		short numberOfStones = 0;
		BigDecimal totalStoneDeductionPercentage = BigDecimal.ZERO;
		BigDecimal CmUnavailableAmount = BigDecimal.ZERO;

		Map<String, BigDecimal> totalTax = new HashMap<>();

		for (ExchangePriceItemDetailsDto itemDetailResponse : itemDetails) {
			TepPriceResponseDto tepPriceReponse = itemDetailResponse.getTepPriceDetails();

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

			if (tepPriceReponse.getDeductionAmount() != null) {
				totalDeductionValue = totalDeductionValue.add(tepPriceReponse.getDeductionAmount());
			} else {
				totalDeductionValue = BigDecimal.ZERO;
			}

			if (tepPriceReponse.getMetalPriceDetails() != null) {
				totalPriceValue = totalPriceValue.add(tepPriceReponse.getMetalPriceDetails().getPreDiscountValue());
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

			if (tepPriceReponse.getStonePriceDetails().getStoneWeight() != null) {
				totalCarat = totalCarat.add(tepPriceReponse.getStonePriceDetails().getStoneWeight());
			}
			for (ItemLotStoneDto stones : itemDetailResponse.getTepPriceDetails().getStones()) {
				if (stones.getStoneDeductionPercentage() != null) {
					deductionPercentage = deductionPercentage.add(stones.getStoneDeductionPercentage());
				}
			}
			totalStoneDeductionPercentage = totalStoneDeductionPercentage.add(deductionPercentage);
			if (deductionPercentage != null && tepPriceReponse.getStonePriceDetails().getPreDiscountValue() != null) {
				BigDecimal value = new BigDecimal("100");
				totalStoneDeductionValue = totalStoneDeductionValue.add(tepPriceReponse.getStonePriceDetails()
						.getPreDiscountValue().multiply(deductionPercentage).divide(value));
			}
			if (tepPriceReponse.getStonePriceDetails().getPreDiscountValue() != null) {
				totalStoneValue = totalStoneValue.subtract(totalStoneDeductionValue);
			}
			cmTotalDetail.setDeductionPercentage(deductionPercentage);
			deductionPercentage = BigDecimal.ZERO;
			if (tepPriceReponse.getStonePriceDetails().getPreDiscountValue() != null) {
				stoneValue = stoneValue.add(tepPriceReponse.getStonePriceDetails().getPreDiscountValue());
			}
			if (tepPriceReponse.getStonePriceDetails().getNumberOfStones() != null) {
				numberOfStones += tepPriceReponse.getStonePriceDetails().getNumberOfStones();
			}
			if (tepPriceReponse.getCmUnavailableDeductionAmount() != null) {
				CmUnavailableAmount = CmUnavailableAmount.add(tepPriceReponse.getCmUnavailableDeductionAmount());
			}

			if (itemDetailResponse.getTepPriceDetails() != null
					&& itemDetailResponse.getTepPriceDetails().getStones() != null) {
				List<ItemLotStoneDto> stones = itemDetailResponse.getTepPriceDetails().getStones();
				for (ItemLotStoneDto stone : stones) {
					if(stone.getFinalStoneValue() != null) {
						totalStoneValue = totalStoneValue.add(stone.getFinalStoneValue());
					}
				}
			}
		}

		cmTotalDetail.setTotalGrossWeight(totalGrossWeight);
		cmTotalDetail.setTotalPriceValue(totalPriceValue);
		cmTotalDetail.setTotalProductValue(totalProductValue);
		cmTotalDetail.setDeductionAmount(totalDeductionValue);
		cmTotalDetail.setTotalTax(totalTax);
		cmTotalDetail.setTotalNetValue(totalNetValue);
		cmTotalDetail.setNumberOfStones(numberOfStones);
		cmTotalDetail.setTotalStoneDeductionValue(totalStoneDeductionValue);
		cmTotalDetail.setTotalStoneDeductionPercentage(totalStoneDeductionPercentage);
		cmTotalDetail.setTotalStoneValue(totalStoneValue);
		cmTotalDetail.setTotalCarat(totalCarat);
		cmTotalDetail.setStoneValue(stoneValue);
		cmTotalDetail.setCmUnavailableAmount(CmUnavailableAmount);

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

	private List<ExchangePriceItemDetailsDto> getTEPDetails(GoodsExchangeDaoExt tepDao) {
		List<GoodsExchangeDetailsDaoExt> goodExchangeDaoExts = goodsExchangeDetailsRepository
				.findByGoodsExchange(tepDao);

		List<ExchangePriceItemDetailsDto> itemDetailsList = new ArrayList<>();
		for (GoodsExchangeDetailsDaoExt goodExchangeDetails : goodExchangeDaoExts) {

//			TepPriceResponseDto priceResponseDto = getTepPriceReponse(goodExchangeDetails.getPriceDetails());
//			priceResponseDto.setRowId(goodExchangeDetails.getRowId());
			ExchangePriceItemDetailsDto gepResponseDto = (ExchangePriceItemDetailsDto) MapperUtil
					.getDtoMapping(goodExchangeDetails, ExchangePriceItemDetailsDto.class);
			gepResponseDto.setTepPriceDetails(getTepPriceReponse(goodExchangeDetails.getPriceDetails()));
			gepResponseDto.setRowId(goodExchangeDetails.getRowId());
			itemDetailsList.add(gepResponseDto);
		}
		return itemDetailsList;
	}

	private TepPriceResponseDto getTepPriceReponse(Object priceDetails) {

		TepPriceResponseDto txnDao = new TepPriceResponseDto();
		ObjectMapper mapper = new ObjectMapper();

		try {
			JsonNode root = mapper.readTree(priceDetails.toString());
			txnDao = MapperUtil.getObjectMapperInstance().convertValue(root, TepPriceResponseDto.class);
			return txnDao;

		} catch (IOException e) {
			throw new ServiceException("Error while parsing Json to DAO", "ERR-CORE-003");
		}

	}

	@Override
	public PrintableDto getDto() {
		return new TEPAnnexurePrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}

}
