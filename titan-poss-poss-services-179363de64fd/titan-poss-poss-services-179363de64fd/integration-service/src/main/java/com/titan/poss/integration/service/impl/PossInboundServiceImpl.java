package com.titan.poss.integration.service.impl;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.dto.CashMemoFetchDto;
import com.titan.poss.core.dto.CustomerPurchaseHistoryDto;
import com.titan.poss.core.dto.CustomerPurchaseRequestDto;
import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.core.dto.EdcBanksDto;
import com.titan.poss.core.dto.EmployeeMasterDto;
import com.titan.poss.core.dto.ItemsDto;
import com.titan.poss.core.dto.LocationServicesDto;
import com.titan.poss.core.dto.MetalApplicableDto;
import com.titan.poss.core.dto.MetalGoldPriceDto;
import com.titan.poss.core.dto.UserLoginDto;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.service.clients.SalesServiceClient;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.integration.service.PossInboundService;
import com.titan.poss.sales.dto.CashMemoEntities;

@Service
public class PossInboundServiceImpl implements PossInboundService {
	
	@Autowired
	private EngineServiceClient engineServiceClient;
	
	@Autowired
	private SalesServiceClient salesService;
	
	private static final String MOBILE_NO = "mobileNumber";
	
//	@Override
//	public List<PayerBankDtoRes> getBankName(String locationCode) {
//		
//		List<PayerBankDtoRes> bankDetails = engineServiceClient.getBankName(locationCode);	
//		return bankDetails;
//	}

	@Override
	public List<LocationServicesDto> getLocationDetails(String locationCode) {
		
		List<LocationServicesDto>  locationDetails = engineServiceClient.getLocationDetails(locationCode);
		
		return locationDetails;
	}

	@Override
	public List<MetalGoldPriceDto> getMarketMetalDetails(String locationCode,MetalApplicableDto applicableDate) {
		
		List<MetalGoldPriceDto> metalDetails = engineServiceClient.getMarketMetalDetails(applicableDate,locationCode);
		return metalDetails;
	}

	@Override
	public List<EdcBanksDto> getEdcBank(String paymentCode,EdcBankRequestDto edcBankRequestDto) {
		
		List<EdcBanksDto> edcBanks = engineServiceClient.getEdcBank(paymentCode,edcBankRequestDto);
		
		return edcBanks;
	}

	@Override
	public List<EmployeeMasterDto> getAllEmployeeList(EdcBankRequestDto edcBankRequestDto) {
		
		List<EmployeeMasterDto> employeeMaster = engineServiceClient.getAllEmployeeList(edcBankRequestDto);
		
		return employeeMaster;
	}

	@Override
	public List<UserLoginDto> getAllLoginMasterList(EdcBankRequestDto edcBankRequestDto) {
		
		List<UserLoginDto> userLogin = engineServiceClient.getAllLoginMasterList(edcBankRequestDto);
		
		return userLogin;
	}

	@Override
	public List<CustomerPurchaseHistoryDto> getAllCashMemoPurchase(
			CustomerPurchaseRequestDto customerPurchaseRequestDto) {
		
		 List<CustomerPurchaseHistoryDto> customerPurchase = engineServiceClient.getAllCashMemoPurchase(customerPurchaseRequestDto);
		
		return customerPurchase;
	}

	@Override
	public CustomerPurchaseHistoryDto getAllCashMemoHistory(CashMemoFetchDto cashMemoFetchDto) {
		CashMemoEntities cashMemoEntities = new CashMemoEntities();
		String locationCode = cashMemoFetchDto.getLocationCode();
		Integer refDocNo = cashMemoFetchDto.getCashMemoNo();
		Short fiscalYear = cashMemoFetchDto.getFiscalYear();
		Object responseObject = salesService.getEpossCashMemoDetails(locationCode, refDocNo, fiscalYear);
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		if (responseObject != null) {
			cashMemoEntities = mapper.convertValue(responseObject, new TypeReference<CashMemoEntities>() {
			});
		}
		List<CustomerPurchaseHistoryDto> cashMemoList = new ArrayList<CustomerPurchaseHistoryDto>();
		CustomerPurchaseHistoryDto cashDto = new CustomerPurchaseHistoryDto();
		if (cashMemoEntities.getOriginalTxn() != null) {
			String priceDetails = cashMemoEntities.getOriginalTxn().getCashMemoDetails().get(0).getPriceDetails();
			JsonObject jsonObject = new JsonParser().parse(priceDetails).getAsJsonObject();
			JsonObject stoneJsonObj = jsonObject.getAsJsonObject("stonePriceDetails");
			String noOfStones = stoneJsonObj.get("numberOfStones").isJsonNull()
					? "0"
					: stoneJsonObj.get("numberOfStones").getAsString();
			String stoneValue = stoneJsonObj.get("preDiscountValue").isJsonNull()
					? "0"
					:stoneJsonObj.get("preDiscountValue").getAsString();
			cashDto.setItemCode(cashMemoEntities.getOriginalTxn().getCashMemoDetails().get(0).getItemCode());
			cashDto.setLotNo(cashMemoEntities.getOriginalTxn().getCashMemoDetails().get(0).getLotNumber());
			cashDto.setProductCategory(
					cashMemoEntities.getOriginalTxn().getCashMemoDetails().get(0).getProductCategoryCode());
			cashDto.setQty(cashMemoEntities.getOriginalTxn().getCashMemo().getTotalQuantity());
			cashDto.setWt(cashMemoEntities.getOriginalTxn().getCashMemo().getTotalWeight());
			cashDto.setBTQ(cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao().getLocationCode());
			cashDto.setDocno(cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao().getDocNo());
			cashDto.setDocdate(cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao().getDocDate());
			cashDto.setPrediscountTotalValue(
					cashMemoEntities.getOriginalTxn().getCashMemoDetails().get(0).getTotalValue());
			cashDto.setTotalStones(noOfStones);
			cashDto.setCfaproductcode(
					cashMemoEntities.getOriginalTxn().getCashMemoDetails().get(0).getProductGroupCode());
			cashDto.setProductType(cashMemoEntities.getOriginalTxn().getCashMemoDetails().get(0).getPricingType());
			cashDto.setStoneValue(stoneValue);
			cashDto.setFiscalYear(cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao().getFiscalYear());
			ItemsDto itemDetails = engineServiceClient
					.getItemDetails(cashMemoEntities.getOriginalTxn().getCashMemoDetails().get(0).getItemCode());
			cashDto.setHSN_Code(itemDetails.getHsnSacCode());
			Boolean checkIsGrn = engineServiceClient
					.getRefundId(cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao().getId());
			if (checkIsGrn) {
				cashDto.setIsGRN("YES");
			} else {
				cashDto.setIsGRN("NO");
			}
			cashDto.setMobileno(CryptoUtil.decrypt(cashMemoEntities.getOriginalTxn().getCustomerTxn().getMobileNumber(),
					MOBILE_NO, false));
		}
		cashMemoList.add(cashDto);
		return cashMemoList.get(0);
	}

	@Override
	public List<String> getLocationCodes(EdcBankRequestDto edcBankRequestDto) {
		List<String> locationCode = engineServiceClient.getLocationCodes(edcBankRequestDto);
		// TODO Auto-generated method stub
		return locationCode;
	}

}
