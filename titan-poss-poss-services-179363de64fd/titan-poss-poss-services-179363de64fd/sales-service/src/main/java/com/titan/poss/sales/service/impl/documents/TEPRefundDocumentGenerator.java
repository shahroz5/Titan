package com.titan.poss.sales.service.impl.documents;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.dto.ItemDetailsDto;
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
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.print.TEPRefundDto;
import com.titan.poss.sales.dto.print.TepGrandTotal;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.response.GepResponseDto;
import com.titan.poss.sales.dto.response.TepDiscountRecoveryDetailsDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.CustomerTcsDetailsRepository;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.repository.GoodsExchangeDetailsRepositoryExt;
import com.titan.poss.sales.repository.GoodsExchangeRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.impl.BusinessDayServiceImpl;

@Service
public class TEPRefundDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	@Autowired
	private CustomerLocationMappingRepositoryExt customerRepo;
	@Autowired
	private SalesTxnRepositoryExt salesTxnRepo;

	@Autowired
	private BusinessDayServiceImpl businessDayService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private GoodsExchangeDetailsRepositoryExt goodsExchangeDetailsRepository;

	@Autowired
	private GoodsExchangeRepositoryExt goodsExchangeRepository;

	@Autowired
	private NumberToWordsFactory numberToWordsFactory;

	@Autowired
	private CustomerTcsDetailsRepository customerTcsDetailsRepository;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepo;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepo;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepo;

	public TEPRefundDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.TEP_REFUND.name(),
				PrintFileTypeEnum.INVOICE_PRINT.name(), this);
	}

	@Override
	public PrintableDto getPrintableDto(String txnId, String id) {
		return getftlBindingObjectForTEPRefund(txnId);
	}

	private TEPRefundDto getftlBindingObjectForTEPRefund(String txnId) {
		SimpleDateFormat docDate = new SimpleDateFormat("dd-MM-yyyy");
		TEPRefundDto tepRefund = new TEPRefundDto();
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
				if (!credtNotes.isEmpty()) {
					gepResponseDto.setCnDocNo(credtNotes.get(0).getDocNo());
				}
				tepRefund.setTepReponse(gepResponseDto);
				List<TepPriceResponseDto> itemDetails = getTEPDetails(goodsExchangeDao.get());
				List<String> itemCodes = itemDetails.stream().map(TepPriceResponseDto::getItemCode)
						.collect(Collectors.toList());
				tepRefund.setItemDetails(itemDetails);
				tepRefund.setItems(engineService.listItemDetails(itemCodes));
				tepRefund.setTepReponse(gepResponseDto);
				tepRefund.setStoreDetails(getStoreDetails());
				tepRefund.setCustomer(getCustomerDetails(txnId, CommonUtil.getLocationCode()));
				tepRefund.setCustomerMasterId(getCustomerMasterId(txnId));
				tepRefund.setBusinessDate(businessDayService.getBusinessDay().getBusinessDate());
				tepRefund.setCustSignature(setCustDigitalSignature(tepRefund.getCustomer().getMobileNumber(),
						ApplicableTransactionTypes.CNCANCELLATION, tepRefund.getCustomer().getCustomerType()));
				tepRefund.setTepGrandTotal(getTotalDetails(itemDetails));
				tepRefund.setPrints(getPrints(txnId));

				// set cashier digital signature
				tepRefund.setCashierSignature(setCashierDigitalSignature(gepResponseDto.getEmployeeCode()));
				tepRefund.setPriceInWords(numberToWordsFactory.getPriceInWords(
						tepRefund.getTepGrandTotal().getTotalRefundValue().longValue(),
						DomainConstants.ASIAN_PRICE_TYPE));
				if (salesTxn.get().getRefTxnId() != null) {
					List<TepDiscountRecoveryDetailsDto> discountRecoveryDetails = new ArrayList<>();
					itemDetails.forEach(item -> {
						TepDiscountRecoveryDetailsDto detailsDto = new TepDiscountRecoveryDetailsDto();
						DiscountDetailsDaoExt discountDetailsDaoExt = discountDetailsRepo
								.findOneBySalesTxn(salesTxn.get().getRefTxnId());
						if (discountDetailsDaoExt != null) {
							List<DiscountItemDetailsDaoExt> discountItemDetailsDaoExt = discountItemDetailsRepo
									.findAllByDiscountDetailIdAndItemCode(discountDetailsDaoExt.getId(),
											item.getItemCode());
							discountItemDetailsDaoExt.forEach(discountItemDetails -> {
								detailsDto.setDiscountValue(discountDetailsDaoExt.getDiscountValue());
								discountRecoveryDetails.add(detailsDto);
							});
							detailsDto.setDiscountDetails(discountDetailsDaoExt.getDiscountCode());
						}
						detailsDto.setItemCode(item.getItemCode());
						detailsDto.setDiscountRecovered(item.getDiscountRecovered());
					});
				}
			}
		}

		else {
			throw new ServiceException("No Goods Exchange found for requested id in CONFIRMED status", "ERR-SALE-078",
					"No Goods Exchange found for requested id in CONFIRMED status id: " + txnId);
		}
		return tepRefund;
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

	private List<TepPriceResponseDto> getTEPDetails(GoodsExchangeDaoExt tepDao) {
		List<GoodsExchangeDetailsDaoExt> goodExchangeDaoExts = goodsExchangeDetailsRepository
				.findByGoodsExchange(tepDao);

		List<TepPriceResponseDto> itemDetailsList = new ArrayList<>();
		for (GoodsExchangeDetailsDaoExt goodExchangeDetails : goodExchangeDaoExts) {

			TepPriceResponseDto priceResponseDto = getTepPriceReponse(goodExchangeDetails.getPriceDetails());
			priceResponseDto.setRowId(goodExchangeDetails.getRowId());
//			ExchangePriceItemDetailsDto gepResponseDto = (ExchangePriceItemDetailsDto) MapperUtil
//					.getDtoMapping(goodExchangeDetails, ExchangePriceItemDetailsDto.class);
//			gepResponseDto.setTepPriceDetails(getTepPriceReponse(goodExchangeDetails.getPriceDetails()));
			itemDetailsList.add(priceResponseDto);
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

	private TepGrandTotal getTotalDetails(List<TepPriceResponseDto> itemDetails) {
		TepGrandTotal tepGrandTotal = new TepGrandTotal();
		short totalQuantity = 0;

		BigDecimal totalGrossWeight = BigDecimal.ZERO;

		BigDecimal totalMetalWeight = BigDecimal.ZERO;

		BigDecimal totalStoneWeight = BigDecimal.ZERO;

		BigDecimal totalMetalValue = BigDecimal.ZERO;

		BigDecimal totalStoneValue = BigDecimal.ZERO;

		BigDecimal totalDeductionAmount = BigDecimal.ZERO;

		BigDecimal totalRefundDeductionAmount = BigDecimal.ZERO;

		BigDecimal totalRefundValue = BigDecimal.ZERO;

		BigDecimal totalDiscountRecovered = BigDecimal.ZERO;

		for (TepPriceResponseDto items : itemDetails) {
			if (items.getDeductionAmount() != null) {
				totalDeductionAmount = totalDeductionAmount.add(items.getDeductionAmount());
			}

			if (items.getItemQuantity() != null) {
				totalQuantity = (short) (totalQuantity + items.getItemQuantity());
			}

			if (items.getDiscountRecovered() != null) {
				totalDiscountRecovered = totalDiscountRecovered.add(items.getDiscountRecovered());
			}

			if (items.getRefundDeductionAmount() != null) {
				totalRefundDeductionAmount = totalRefundDeductionAmount.add(items.getRefundDeductionAmount());
			}

			if (items.getFinalValue() != null || items.getRefundDeductionAmount() != null) {
				totalRefundValue = totalRefundValue
						.add(items.getFinalValue().subtract(items.getRefundDeductionAmount()));
			}
			if (items.getMetalPriceDetails().getPreDiscountValue() != null) {
				totalMetalValue = totalMetalValue.add(items.getMetalPriceDetails().getPreDiscountValue());
			}

			if (items.getStonePriceDetails().getStoneWeight() != null || items.getNetWeight() != null) {
				BigDecimal value = new BigDecimal("5");
				BigDecimal netWeights = BigDecimal.ZERO;
				if (items.getStonePriceDetails().getStoneWeight() != null) {
					netWeights = netWeights.add(items.getStonePriceDetails().getStoneWeight().divide(value));
				}

				totalGrossWeight = totalGrossWeight.add(netWeights.add(items.getNetWeight()));
			}

			if (items.getNetWeight() != null) {
				totalMetalWeight = totalMetalWeight.add(items.getNetWeight());
			}

			if (items.getStonePriceDetails().getStoneWeight() != null) {
				totalStoneWeight = totalStoneWeight.add(items.getStonePriceDetails().getStoneWeight());
			}

			if (items.getStonePriceDetails().getPreDiscountValue() != null) {
				totalStoneValue = totalStoneValue.add(items.getStonePriceDetails().getPreDiscountValue());
			}

		}
		tepGrandTotal.setTotalDeductionAmount(totalDeductionAmount);
		tepGrandTotal.setTotalDiscountRecovered(totalDiscountRecovered);
		tepGrandTotal.setTotalQuantity(totalQuantity);
		tepGrandTotal.setTotalRefundDeductionAmount(totalRefundDeductionAmount);
		tepGrandTotal.setTotalRefundValue(totalRefundValue);
		tepGrandTotal.setTotalGrossWeight(totalGrossWeight);
		tepGrandTotal.setTotalMetalValue(totalMetalValue);
		tepGrandTotal.setTotalMetalWeight(totalMetalWeight);
		tepGrandTotal.setTotalStoneValue(totalStoneValue);
		tepGrandTotal.setTotalStoneWeight(totalStoneWeight);

		return tepGrandTotal;
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
		// TODO Auto-generated method stub
		return new TEPRefundDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}

}
