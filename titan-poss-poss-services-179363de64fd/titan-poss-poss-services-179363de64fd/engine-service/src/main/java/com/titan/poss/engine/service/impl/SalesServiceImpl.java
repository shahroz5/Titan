/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.BusinessDayWithPreviousDateDto;
import com.titan.poss.core.dto.CustomerPurchaseHistoryDto;
import com.titan.poss.core.dto.CustomerPurchaseRequestDto;
import com.titan.poss.core.dto.EdcBanksDto;
import com.titan.poss.core.dto.EmployeeMasterDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.engine.dto.response.CustomerDto;
import com.titan.poss.engine.dto.response.PaymentRedemptionDetailsDto;
import com.titan.poss.engine.sales.repository.BusinessDayRepositoryExt;
import com.titan.poss.engine.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.engine.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.engine.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.engine.sales.repository.RefundTransactionRepository;
import com.titan.poss.engine.service.SalesService;
import com.titan.poss.sales.constants.DayActivityStatusEnum;
import com.titan.poss.sales.dao.BusinessDayDao;
import com.titan.poss.sales.dao.CancelDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;
import com.titan.poss.sales.util.BusinessDayUtil;

/**
 * Service class for sales in engine.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("engineSalesService")
public class SalesServiceImpl implements SalesService {

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationMappingRepository;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	BusinessDayRepositoryExt businessDayRepository;

	@Autowired
	LocationServiceImpl locationServiceImpl;
	
	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepository;
	
	@Autowired
	private RefundTransactionRepository refundTransactionRepository;
	

	protected static final List<String> openStatusList = new ArrayList<>();

	protected static final List<String> dayActivityStatusList = new ArrayList<>();

	static {
		openStatusList.add(DayActivityStatusEnum.OPEN.name());
		dayActivityStatusList.add(DayActivityStatusEnum.OPEN.name());
		dayActivityStatusList.add(DayActivityStatusEnum.EOD_IN_PROGRESS.name());
		dayActivityStatusList.add(DayActivityStatusEnum.BOD_IN_PROGRESS.name());
	}

	private static final String ERR_SALE_070 = "ERR-SALE-070";

	private static final String RECORD_NOT_FOUND = "Record not found.";

	public static final String BOD_BUSINESS_DAY = "No Business Day is Open Please Do BOD";
	
	private static final String MOBILE_NO = "mobileNumber";

	/**
	 * It will get the customer details based on customerId.
	 * 
	 * @param customerId
	 * @return CustomerDto
	 */
	@Override
	public CustomerDto getCustomer(Integer customerId) {
		CustomerLocationMappingDao customerLocationMappingDao = getCustomerById(customerId);
		CustomerDto customerDto = (CustomerDto) MapperUtil.getObjectMapping(customerLocationMappingDao.getCustomer(),
				new CustomerDto());
		String customerDetails = customerLocationMappingDao.getCustomer().getCustomerDetails();
		customerDto.setCustomerDetails(JsonUtils.convertStrToJsonData(customerDetails));
		
		if (customerDto.getInstiTaxNo() != null)
			customerDto.setInstiTaxNo(CryptoUtil.decrypt(customerDto.getInstiTaxNo(), "instiTaxNo"));
		return customerDto;
	}

	/**
	 * This method checks if customer exists in the store based on customerId.
	 * 
	 * @param customerId
	 * @return CustomerLocationMapping
	 */
	private CustomerLocationMappingDao getCustomerById(Integer customerId) {
		if (customerId == null) {
			throw new ServiceException("Please select customer details.", "ERR-SALE-110");
		}
		Optional<CustomerLocationMappingDao> customerLocationMappingDao = customerLocationMappingRepository
				.findById(new CustomerLocationMappingIdDao(customerId, CommonUtil.getLocationCode()));
		if (!customerLocationMappingDao.isPresent()) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070);
		}
		return customerLocationMappingDao.get();
	}

	@Override
	public ListResponse<PaymentRedemptionDetailsDto> getRedemptionDetails(String paymentCode, String paymentGroup,
			String instrumentNo) {
		List<PaymentRedemptionDetailsDto> paymentRedemptionDtoList = paymentDetailsRepository
				.findClosedPaymentsByPaymentCodeAndPaymentGroupAndInstrumentNo(paymentCode, paymentGroup, instrumentNo);
		if (paymentRedemptionDtoList == null) {
			paymentRedemptionDtoList = new ArrayList<>();
		}
		return new ListResponse<>(paymentRedemptionDtoList);
	}

	@Override
	public BusinessDayDto getBusinessDay(String locationCode) {

		if (CommonUtil.isAStoreUser())
			locationCode = CommonUtil.getLocationCode();

		List<BusinessDayDao> businessDayDaoList = businessDayRepository.findByStatusInAndLocationCode(openStatusList,
				locationCode);

		BusinessDayDto businessDay = new BusinessDayDto();
		BusinessDayDto business = BusinessDayUtil.getBusinessDays(businessDayDaoList);
		businessDay.setBusinessDate(business.getBusinessDate());
		businessDay.setFiscalYear(locationServiceImpl.getCountryDetails(locationCode).getFiscalYear());

		return businessDay;
	}

	@Override
	public BusinessDayDto getBusinessDayInProgress(String locationCode) {
		if (CommonUtil.isAStoreUser())
			locationCode = CommonUtil.getLocationCode();

		List<BusinessDayDao> businessDayDaoList = businessDayRepository
				.findByStatusInAndLocationCode(dayActivityStatusList, locationCode);

		BusinessDayDto businessDay = new BusinessDayDto();
		if (businessDayDaoList.isEmpty()) {
			// if the list is empty, then checking for max business date for closed state.
			// required if schedulers are needed to run when the business date is in closed
			// state.
			List<BusinessDayDao> businessDayDao = businessDayRepository.getMaxBusinessDayForClosedState(locationCode,
					DayActivityStatusEnum.CLOSED.name());
			if (CollectionUtil.isEmpty(businessDayDao)) {
				throw new ServiceException("No record found in business day master.", "ERR-SALE-143",
						"No record found in business day master. For location: " + locationCode);
			}
			businessDay.setBusinessDate(businessDayDao.get(0).getBusinessDate());
			businessDay.setStatus(businessDayDao.get(0).getStatus());
		} else {
			// If status is BOD in progress, then taking business date -1
			if (businessDayDaoList.get(0).getStatus().equalsIgnoreCase(DayActivityStatusEnum.BOD_IN_PROGRESS.name())) {
				Calendar cal = Calendar.getInstance();
				cal.setTime(businessDayDaoList.get(0).getBusinessDate());
				cal.add(Calendar.DATE, -1);
				Date businessDateMinusOne = cal.getTime();
				businessDay.setBusinessDate(businessDateMinusOne);
				businessDay.setStatus(DayActivityStatusEnum.CLOSED.name());
			} else {
				businessDay.setBusinessDate(businessDayDaoList.get(0).getBusinessDate());
				businessDay.setStatus(businessDayDaoList.get(0).getStatus());

			}
		}
		return businessDay;
	}

	@Override
	public BusinessDayWithPreviousDateDto getLatestBusinessDay() {

		String locationCode = CommonUtil.getLocationCode();

		BusinessDayDao businessDayDao = businessDayRepository.findTopByLocationCodeAndStatusInOrderByBusinessDateDesc(
				locationCode, DayActivityStatusEnum.getAllBusinessDayStatus());

		if (businessDayDao == null) {
			throw new ServiceException("No record found in business day master.", "ERR-SALE-143",
					"No record found in business day master. For location: " + locationCode);
		}

		BusinessDayWithPreviousDateDto businessDayDto = new BusinessDayWithPreviousDateDto(
				businessDayDao.getBusinessDate(), businessDayDao.getFiscalYear(), businessDayDao.getStatus());

		// give previous business date also
		BusinessDayDao previousBusinessDayDao = businessDayRepository
				.findTopByLocationCodeAndStatusInOrderByBusinessDateDesc(locationCode,
						List.of(DayActivityStatusEnum.CLOSED.name()));

		// set previous business date
		businessDayDto.setPreviousBusinessDate(
				previousBusinessDayDao != null ? previousBusinessDayDao.getBusinessDate() : null);

		return businessDayDto;
	}

	@Override
	public List<CustomerPurchaseHistoryDto> getAllCashMemoPurchase(
			CustomerPurchaseRequestDto customerPurchaseRequestDto) {
		String mobileNumber = CryptoUtil.encrypt(customerPurchaseRequestDto.getMobileNumber(), MOBILE_NO);
		String productType = customerPurchaseRequestDto.getProductType();
		Date fromDate = customerPurchaseRequestDto.getFromDocDate();
		Date toDate = customerPurchaseRequestDto.getToDocDate();
		String productCategory = customerPurchaseRequestDto.getProductCategory();
		if(mobileNumber != null && mobileNumber.isEmpty()) {			
			mobileNumber = null;
		}
		if(productType != null && productType.isEmpty()) {
			productType = null;
		}
		if(productCategory != null && productCategory.isEmpty()) {
			productCategory = null;			
		}
		if(fromDate != null && fromDate.toString().isEmpty()) {
			fromDate = null;			
		}
		if(toDate != null && toDate.toString().isEmpty()) {
			toDate = null;			
		}
		
		 List<Object[]> cashMemos = cashMemoDetailsRepository.getCashMemohistory(mobileNumber,productType,productCategory,fromDate,toDate);
		 List<CustomerPurchaseHistoryDto> cashMemosList = new ArrayList<CustomerPurchaseHistoryDto>();
		 if(cashMemos != null && !cashMemos.isEmpty()){
			 for (Object[] obj : cashMemos) {
				 CustomerPurchaseHistoryDto cashmemo = new CustomerPurchaseHistoryDto();
				cashmemo.setItemCode((String) obj[0]);
				cashmemo.setLotNo((String) obj[1]);	
				cashmemo.setProductCategory((String) obj[2]);
				cashmemo.setQty((Short) obj[3]);
				cashmemo.setWt((BigDecimal) obj[4]);
				cashmemo.setBTQ((String) obj[5]);
				cashmemo.setDocno((Integer) obj[6]);
				cashmemo.setDocdate((Date) obj[7]);
				String totValue = (String) obj[8];
				cashmemo.setPrediscountTotalValue(new BigDecimal(totValue));
				cashmemo.setProductType((String) obj[9]);
				String stoneValues = (String) obj[10];
				cashmemo.setStoneValue(stoneValues);
				cashmemo.setKaratage((BigDecimal) obj[11]);
				cashmemo.setMobileno(customerPurchaseRequestDto.getMobileNumber());
				cashmemo.setTotalStones((String) obj[13]);
				cashmemo.setCfaproductcode((String) obj[14]);
				cashmemo.setHSN_Code((String) obj[15]);
				cashmemo.setFiscalYear((Short) obj[16]);
				cashMemosList.add(cashmemo);
			 }
			 
		 }
		
	
		return cashMemosList;
	}

	@Override
	public Boolean getRefundId(String id) {
		Boolean checkGrn = refundTransactionRepository.findByIds(id);
		if(checkGrn == true) {
			return(Boolean.TRUE);			
		}else {
			return  (Boolean.FALSE);			
		}
		
	}

}
