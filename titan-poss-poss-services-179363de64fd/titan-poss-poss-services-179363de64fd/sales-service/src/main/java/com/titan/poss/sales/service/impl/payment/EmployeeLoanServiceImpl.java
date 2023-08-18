package com.titan.poss.sales.service.impl.payment;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.dto.EmployeeLoanConfigDetailsDto;
import com.titan.poss.core.dto.EmployeeLoanConfirmRequestDto;
import com.titan.poss.core.dto.EmployeePaymentDtoExt;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.controller.CashMemoEpossController;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.SalesOtpTypeEnum;
import com.titan.poss.sales.dto.response.AmountDetailsDto;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.ItemValueAndProductCodeDetailsDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.EmployeeLoanPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.EmployeeLoanService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.OtpService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

@Service("salesEmployeeLoanServiceImpl")
@Slf4j
public class EmployeeLoanServiceImpl implements EmployeeLoanService {

	public EmployeeLoanServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.EMPLOYEE_LOAN.getPaymentcode(), this);
	}

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	CashMemoEpossController cashMemoEpossController;

	@Autowired
	private OtpService otpService;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationMappingRepository;
	
	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepositoryExt;

	/**
	 * This method will validate input fields of payment create DTO.
	 * 
	 * @param paymentCreateDto
	 * @return SalesPaymentDto
	 */

	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {
		EmployeeLoanPaymentFieldsDto cashbackPaymentFieldsDto = (EmployeeLoanPaymentFieldsDto) MapperUtil
				.getDtoMapping(paymentCreateDto, EmployeeLoanPaymentFieldsDto.class);
		// validate fields
		cashbackPaymentFieldsDto.validateFields(cashbackPaymentFieldsDto);
		return SalesUtil.mapDtoWithStatus(paymentCreateDto, PaymentStatusEnum.OPEN.name());
	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {
		// location check?
		return salesPaymentDto;
	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {

		// check if employee code is already added for this payment and throw error.
		BigDecimal totalPaidAmount = paymentDetailsRepository.getPaidAmountByPaymentCodeAndInstrumentNoAndSalesTxnDaoId(
				paymentCode, paymentDetailsDao.getInstrumentNo(), paymentDetailsDao.getSalesTxnDao().getId());
		if (BigDecimal.ZERO.compareTo(totalPaidAmount) != 0) {
			throw new ServiceException(SalesConstants.DYNAMIC_PAYMENT_CODE_IS_ALREADY_ADDED_FOR_PAYMENT,
					SalesConstants.ERR_SALE_034,
					"Employee Code " + paymentDetailsDao.getReference2() + " is already added for the payment.",
					Map.of(SalesConstants.PAYMENT_CODE, paymentCode));
		}

		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();

		// EPOSS call to validate the employee code,location code and cfa code and throw
		// error..
		Map<String, String> requestParams = Map.of("employeeCode", paymentDetailsDao.getInstrumentNo(), "buissnessDate",
				businessDate.toString(), "locationCode", CommonUtil.getLocationCode());
		EmployeePaymentDtoExt employeePaymentDtoExt = null ;
		if(paymentDetailsDao.getReference3().equals(true)) {
			 employeePaymentDtoExt = cashMemoEpossController
					.getEmployeeLoanConfigDetails(paymentDetailsDao.getReference2(), paymentDetailsDao.getInstrumentNo());
			
		}
		
		
		CustomerLocationMappingDao customerMasterId = customerLocationMappingRepository.findByCustomerIdAndLocationCode(
				Integer.parseInt(paymentDetailsDao.getInstrumentNo()), CommonUtil.getLocationCode());

		if (paymentDetailsDao.getReference1() == null) {
			throw new ServiceException(SalesConstants.PLEASE_PROVIDE_OTP, SalesConstants.ERR_SALE_238,
					"Please provide OTP for the Employee Loan payment.");
		}
		// validate OTP
		if(employeePaymentDtoExt != null) {
			otpService.validateOTP(customerMasterId.getCustomer().getId(), SalesOtpTypeEnum.EMPLOYEELOAN.name(),
					paymentDetailsDao.getReference1());	
		}
		

		// subtract loan amount with redeemed amount
		BigDecimal redeemableAmt;
		if(employeePaymentDtoExt != null) {			
			 redeemableAmt = (employeePaymentDtoExt.getEligibleAmount() != null ? employeePaymentDtoExt.getEligibleAmount():BigDecimal.ZERO)
					.subtract(employeePaymentDtoExt.getRedeemedAmount() !=null ? employeePaymentDtoExt.getRedeemedAmount():BigDecimal.ZERO);		
		}else {
			 redeemableAmt = totalTxnAmount;
		}
		
		if(employeePaymentDtoExt != null) {	
			validateEmployeeLoanAmount(paymentDetailsDao, employeePaymentDtoExt, redeemableAmt, totalTxnAmount);		
		}

		// product group code check
		List<String> voucherProductGroupCodeList = null;
		if(employeePaymentDtoExt != null) {	
			voucherProductGroupCodeList = employeePaymentDtoExt.getProductGroupCodes();		
		}else {
			voucherProductGroupCodeList = cashMemoDetailsRepositoryExt.findProductGroups(paymentDetailsDao.getSalesTxnDao().getId());
		}
		

		Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPgcDetails = paymentUtil.getItemProductGroupCodes(
				paymentDetailsDao.getSalesTxnType(), paymentDetailsDao.getSalesTxnDao().getId(),
				voucherProductGroupCodeList, paymentDetailsDao.getPaymentCode(), paymentDetailsDao.getInstrumentNo(),
				false);// isExcludePGC is true for 'GIFT VOUCHER' and is false for many
		// other applicable payments
		// get valid amount
        BigDecimal validAmount = paymentUtil.getValidPaymentForItems(paymentDetailsDao.getPaymentCode(),
                itemValueAndPgcDetails, paymentDetailsDao.getSalesTxnDao().getId());
	
		

		// check the loan amount for partial or full redemption
		List<PaymentItemMappingDaoExt> paymentItemMapList = new ArrayList<>();
		// check redemption amount
		paymentItemMapList = paymentUtil.paymentCheckBasedOnRedemptionType(paymentDetailsDao.getAmount(), redeemableAmt,
				validAmount, "PARTIAL", paymentDetailsDao, itemValueAndPgcDetails);

		// set instrumentType same as paymentCode
		paymentDetailsDao.setInstrumentType(paymentCode); // ENCIRCLE

		return Map.of(paymentDetailsDao, paymentItemMapList);
	}

	private void validateEmployeeLoanAmount(PaymentDetailsDaoExt paymentDetailsDao,
			EmployeePaymentDtoExt employeePaymentDtoExt, BigDecimal redeemableAmt, BigDecimal totalTxnAmount) {
		
		JsonData employeeConfigJson = MapperUtil.mapObjToClass(employeePaymentDtoExt.getLoanConfigDetails(),
				JsonData.class);
		EmployeeLoanConfigDetailsDto employeeLoanConfigDetailsDto = new Gson()
				.fromJson(employeePaymentDtoExt.getLoanConfigDetails(), EmployeeLoanConfigDetailsDto.class);
		BigDecimal marginAmt = totalTxnAmount
				.multiply(new BigDecimal(employeeLoanConfigDetailsDto.getMargin()).divide(new BigDecimal(100)))
				.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

		// validate if loan is already processed
		if (BigDecimal.ZERO.compareTo(employeePaymentDtoExt.getRedeemedAmount()) != 0) {
			throw new ServiceException(SalesConstants.EMPLOYEE_LOAN_ALREADY_GIVEN, SalesConstants.ERR_SALE_384,
					"Employee Loan has been already given to this customer");
		}

		if (paymentDetailsDao.getAmount().compareTo(marginAmt) < 0) {
			throw new ServiceException(SalesConstants.TOTAL_VALUE_LESS_THAN_MARGIN_AMOUNT, SalesConstants.ERR_SALE_385,
					"Input Amount should be greater than minimum margin amount");
		}

		if (paymentDetailsDao.getAmount().compareTo(redeemableAmt) > 0) {
			throw new ServiceException(SalesConstants.TOTAL_VALUE_EXCEEDS_EMPLOYEE_LOAN_AMOUNT,
					SalesConstants.ERR_SALE_383, "Input Amount should be less than approved loan amount");
		}
	}

	@Override
	public PaymentDetailsDaoExt triggerPayment(PaymentDetailsDaoExt paymentDetailsDao,
			SalesPaymentDto salesPaymentDto) {
		return paymentDetailsDao;
	}

	@Override
	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {
		return null;
	}

	@Override
	public SalesPaymentDto validateAndUpdatePaymentDetails(String paymentCode, String status,
			PaymentUpdateDto paymentUpdateDto, PaymentDetailsDaoExt paymentDetailsDao) {
		return null;
	}

	@Override
	public void deletePayment(PaymentDetailsDaoExt paymentDetailsDao) {
		paymentDetailsDao = paymentUtil.deletePaymentOpenDeleteElseReverse(paymentDetailsDao, true);
		// pending: otp to be cleared?
		paymentDetailsDao.setReference1(null);
		paymentDetailsRepository.save(paymentDetailsDao);
	}

	@Override
	public PaymentDetailsDaoExt confirmPayment(PaymentDetailsDaoExt paymentDetailsDao, String status) {
		// if payment status is not OPEN do not allow
		// redemption.
		if (!SalesUtil.paymentStatusCheckForRedemption(paymentDetailsDao.getStatus())) {
			return paymentDetailsDao;
		}

//		EmployeePaymentDtoExt employeePaymentDtoExt = engineService
//				.getEmployeeLoanConfigDetails(paymentDetailsDao.getInstrumentNo());

		EmployeePaymentDtoExt employeePaymentDtoExt = cashMemoEpossController
				.getEmployeeLoanConfigDetails(paymentDetailsDao.getReference2(), paymentDetailsDao.getInstrumentNo());

		// subtract loan amount with redeemed amount
		BigDecimal redeemableAmt = employeePaymentDtoExt.getEligibleAmount()
				.subtract(employeePaymentDtoExt.getRedeemedAmount());

		AmountDetailsDto amountDetailsDto = paymentUtil.getTxnValueAndDueAmount(paymentDetailsDao.getSalesTxnDao(),
				paymentDetailsDao.getIsTcsPayment());

		validateEmployeeLoanAmount(paymentDetailsDao, employeePaymentDtoExt, redeemableAmt,
				amountDetailsDto.getTotalAmount());

		EmployeeLoanConfirmRequestDto employeeLoanConfirmDto = new EmployeeLoanConfirmRequestDto();
		employeeLoanConfirmDto.setId(employeePaymentDtoExt.getId());
		employeeLoanConfirmDto
				.setRedeemedAmount(paymentDetailsDao.getAmount().add(employeePaymentDtoExt.getRedeemedAmount()));
		employeeLoanConfirmDto.setStatus("CLOSED");

		// EPOSS call to redeem Employee Loan.
		try {
			epossCallService.callEposs(HttpMethod.POST, "api/payment/v2/employee-loan/update-loan-details", null,
					employeeLoanConfirmDto, EmployeePaymentDtoExt.class);
			paymentDetailsDao.setStatus(PaymentStatusEnum.COMPLETED.name());
		} catch (ServiceException e) {
			// update payment status on failure
			paymentDetailsDao.setStatus(PaymentStatusEnum.FAILED.name());
			paymentDetailsRepository.save(paymentDetailsDao);
			throw e;
		}

		paymentDetailsRepository.save(paymentDetailsDao);

		return paymentDetailsDao;
	}

	@Override
	public Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate) {
		// TODO:'isSingleCN' in case of 'Cancel with Credit note' or 'Cancel with
		// Return' (with offline scenario)
		// not sure when employee loan with integration will be implemented to implement
		// 'With integration change the status reverse back once again allow to do
		// employee loan' for 'Cancel with Return'(NAP-3838)
		return paymentUtil.createCancelCN(paymentDetails, salesTxn, cancel, cnType, false, docDate);
	}

	@Override
	public InstrumentCashAmountDto getEligibleAmount(Integer customerId, String paymentCode, SalesTxnDaoExt salesTxnDao,
			BigDecimal dueAmount) {

		return new InstrumentCashAmountDto(dueAmount, null, null, null);
	}

	@Override
	public void deleteTempPayment(PaymentDetailsDaoExt paymentDetailsDao) {

		paymentDetailsDao.setStatus(PaymentStatusEnum.DELETED.name());
		paymentDetailsRepository.save(paymentDetailsDao);

	}
}
