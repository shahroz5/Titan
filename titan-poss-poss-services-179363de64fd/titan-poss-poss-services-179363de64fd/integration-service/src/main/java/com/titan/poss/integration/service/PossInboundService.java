package com.titan.poss.integration.service;

import java.util.Date;
import java.util.List;

import com.titan.poss.core.dto.CashMemoFetchDto;
import com.titan.poss.core.dto.CustomerPurchaseHistoryDto;
import com.titan.poss.core.dto.CustomerPurchaseRequestDto;
import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.core.dto.EdcBanksDto;
import com.titan.poss.core.dto.EmployeeMasterDto;
import com.titan.poss.core.dto.LocationServicesDto;
import com.titan.poss.core.dto.MetalApplicableDto;
import com.titan.poss.core.dto.MetalGoldPriceDto;
import com.titan.poss.core.dto.PayerBankDtoRes;
import com.titan.poss.core.dto.UserLoginDto;

public interface PossInboundService {
	
	//List<PayerBankDtoRes>  getBankName (String locationCode);
	
	List<LocationServicesDto>  getLocationDetails(String locationCode);
	
	List<MetalGoldPriceDto> getMarketMetalDetails(String locationCode,MetalApplicableDto applicableDate);
	
	List<EdcBanksDto> getEdcBank(String paymentCode,EdcBankRequestDto edcBankRequestDto);
	
	List<EmployeeMasterDto> getAllEmployeeList(EdcBankRequestDto edcBankRequestDto);
	
	List<UserLoginDto> getAllLoginMasterList(EdcBankRequestDto edcBankRequestDto);
	
	List<CustomerPurchaseHistoryDto> getAllCashMemoPurchase(CustomerPurchaseRequestDto customerPurchaseRequestDto);
	
	CustomerPurchaseHistoryDto getAllCashMemoHistory(CashMemoFetchDto cashMemoFetchDto);
	
	List<String> getLocationCodes(EdcBankRequestDto edcBankRequestDto);
	
	
	

}
