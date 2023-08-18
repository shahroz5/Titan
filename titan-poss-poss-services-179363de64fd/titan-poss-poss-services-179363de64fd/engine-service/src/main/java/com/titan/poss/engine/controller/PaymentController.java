/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.controller;

import static com.titan.poss.engine.constant.EngineConstants.PAYMENT_ENGINE_CONTROLLER;

import java.util.List;
import java.util.Map;

import javax.validation.constraints.NotBlank;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.ConfigTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.CashbackOfferRequestDto;
import com.titan.poss.core.dto.CashbackValueResponseDto;
import com.titan.poss.core.dto.ConfigDetailsLocationMappingDto;
import com.titan.poss.core.dto.CustomerTransactionConfigDto;
import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.core.dto.EdcBanksDto;
import com.titan.poss.core.dto.GlCodeDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.PayerBankDto;
import com.titan.poss.core.dto.PayerBankDtoRes;
import com.titan.poss.core.dto.PaymentProductGroupDto;
import com.titan.poss.core.dto.ProductGroupDtoDigiGold;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.engine.constant.CustomerTypeEnum;
import com.titan.poss.engine.dto.response.CashbackOfferDetailsResponseDto;
import com.titan.poss.engine.dto.PayeeBankLocationDto;
import com.titan.poss.engine.service.CashbackService;
import com.titan.poss.engine.service.PaymentService;
import com.titan.poss.payment.dao.PayeeBankLocationMappingDao;
import com.titan.poss.payment.dto.CashbackDto;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController(PAYMENT_ENGINE_CONTROLLER)
@RequestMapping(value = "engine/v2/payments")
public class PaymentController {

	@Autowired
	PaymentService paymentService;

	@Autowired
	CashbackService cashbackService;

	/**
	 * This method will return the Payment Configuration details based on the
	 * transactionType.
	 *
	 * @param transactionType
	 * @return ConfigDetailsLocationMappingDto
	 */
	@ApiOperation(value = "View the Payment Modes and Payment Groups based on the transactionType and location code", notes = "This API returns all Payment Modes and Payment Groups applicable for particular locations based on the **transactionType**")
	@GetMapping(value = "/transactions/{transactionType}")
	public ConfigDetailsLocationMappingDto getConfig(
			@PathVariable("transactionType") @ApiParam(required = true, value = "Transaction Type", allowableValues = "CM,AB,ADV,GRF") @ValueOfEnum(enumClass = TransactionTypeEnum.class) String transactionType,
			@RequestParam("config-type") @ApiParam(required = true, value = "Config Type", allowableValues = "PAYMENT_CONFIG") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType) {
		return paymentService.getConfigLocationMapping(transactionType, configType);
	}

	/**
	 * This method will return the Lov details based on lovType.
	 *
	 * @param lovType
	 * @return LovDto
	 */

	// @formatter:off
    @ApiOperation(value = "View Lov details", notes = "This API will give the Lov details based on **lovType**.<br><br>"
            + "<span style=\"font-weight: bold;font-size:14px;\">Lov types:</span>" 
   		    + "<ul>"
            + "		<li>CUSTOMER_TYPE</li>"
            + "		<li>ID_PROOF</li>" 
            + "		<li>OCCASION_TYPE</li>"
            + "		<li>OTHER_CHARGES_REASONS</li>" 
            + "		<li>SALUTATION</li>" 
            + "		<li>GRN_TYPE</li>" 
            + "		<li>REASON_FOR_CANCELLATION</li>" 
            + "     <li>PRINT_DOC_TYPE</li>"
            + "     <li>GRN_REASON_TYPE</li>"
            + "     <li>FULL_VALUE_TEP_REASON</li>"
            + "     <li>TATA_COMPANY</li>"
            + "     <li>REFUND_PAYMENT_MODE</li>"
            + "     <li>INVOICE_TYPE</li>"
            + "     <li>RELATIONSHIP_TYPE</li>"
            + "</ul>"
            + "Please note that if lovType is wrong then empty resopne will be returned.")
    // @formatter:on	
	@GetMapping(value = "lovs/{lovType}")
	public LovDto getPaymentLov(
			@ApiParam(name = "lovType", value = "'lovType' to get details", required = true) @PathVariable("lovType") @NotBlank @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, nullCheck = true, caseInsensitive = false) String lovType) {

		return paymentService.getPaymentLov(lovType);
	}

	/**
	 * This method will return list of payee bank names based on paymentCode and
	 * transactionType and location code.
	 *
	 * @param paymentCode
	 * @return ListResponse<String>
	 */
	@GetMapping(value = "/payee-banks")
	@ApiOperation(value = "View the Payee Bank based on payment code", notes = "This API returns Payee Bank List according to payment code")
	public ListResponse<String> getPayeeBankNames(
			@ApiParam(name = "paymentCode", value = "Provide 'payment mode' for the payment", allowableValues = "", required = false) @RequestParam(name = "paymentCode", required = false) @PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX) String paymentCode) {
		return paymentService.getPayeeBankNames(paymentCode);
	}

	/**
	 * This method will return list of product groups names based on paymentCode and
	 * cardNumber.
	 *
	 * @param paymentCode
	 * @param cardNumber
	 * @return ListResponse<String>
	 */
	@GetMapping(value = "/{paymentCode}/product-groups")
	@ApiOperation(value = "View the Product Groups Bank based on payment mode and cardNumber", notes = "This API returns Product Group List according to payment mode and card number.</br>"
			+ " if payment mode is QC then cardNumber is mandatory otherwise it will be null ")
	public PaymentProductGroupDto getProductGroups(
			@PathVariable("paymentCode") @PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX) String paymentCode,
			@RequestParam(name = "cardNumber", required = false) String cardNumber) {
		return paymentService.getProductGroups(paymentCode, cardNumber);
	}

	/**
	 * This method will return list of payee bank names based on paymentCode and
	 * locationCode.
	 * 
	 * @param paymentCode
	 * @return ListResponse<PayerBankDetails>
	 */
	@GetMapping(value = "/payer-banks")
	@ApiOperation(value = "This API will return the list of payer Bank", notes = "This API will return the list of payer bank based on location code and payment mode ")
	public PayerBankDto getPayerBankDetails(
			@RequestParam(name = "paymentCode", required = true) @PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX) String paymentCode) {

		return paymentService.getPayerBankDetails(CommonUtil.getLocationCode(), paymentCode);
	}

	@ApiOperation(value = "This API will return the list of payment code", notes = "This API will return the list of payment code and **hostName** and **locationCode** will"
			+ " be taken from token.")
	@GetMapping(value = "/hostnames")
	public ListResponse<String> getDevices() {
		return paymentService.getDevices();
	}

	/**
	 * This method will return the Transactions Allowed for a customer.
	 *
	 * @param customer
	 * @return ConfigDetailsLocationMappingDto
	 */
	@ApiOperation(value = "View the transactionTypes Allowed for a Customer at a particular Location", notes = "This API returns all transaction types applicable for particular location based on the **customerType**")
	@GetMapping(value = "/customers/{customerType}")
	public CustomerTransactionConfigDto getCustomerConfig(
			@PathVariable("customerType") @ApiParam(required = true, value = "Customer Type", allowableValues = "REGULAR, INTERNATIONAL, INSTITUTIONAL, ONETIME") @ValueOfEnum(enumClass = CustomerTypeEnum.class) String customerType,
			@RequestParam("config-type") @ApiParam(required = true, value = "Config Type", allowableValues = "CUSTOMER_CONFIG") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType) {
		return paymentService.getCustomerConfig(customerType, configType);
	}

	/**
	 * This method will return the list of CreditNoteTypes .
	 * 
	 * @param isPageable
	 * @param pageable
	 * @return
	 */
	@ApiOperation(value = "View the list of creditnoteTypess ", notes = "This api will return the list of CreditNoteTypes ")
	@GetMapping("/credit-note-types")
	public Map<String, String> listCreditNoteTypes() {
		return paymentService.listCreditNoteTypes();
	}

	/**
	 * This method will return list of product groups names based on cardNumber.
	 * 
	 * @param cardNumber
	 * @return ListResponse<String>
	 */
	@GetMapping(value = "/cash-back-offers/{offerId}/product-groups")
	@ApiOperation(value = "View the list of Product Mapped to offerId", notes = "This API returns the list of Product Mapped to a cashbackOffer")
	public ListResponse<String> getProductGroups(
			@PathVariable("offerId") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String offerId) {

		return cashbackService.getProductGroups(offerId);

	}

	/**
	 * This method will return active cashback offers .
	 * 
	 * @return ListResponse<String>
	 */
	@GetMapping(value = "/cash-back-offers")
	@ApiOperation(value = "View the Active Cashback Offers that are available for Current Business Day", notes = "This API returns the Active Cashback Offers that are available for Current Business Day")
	public ListResponse<CashbackDto> getActiveCashbackOffers() {
		return cashbackService.getActiveCashbackOffers();

	}

	/**
	 * This method will return details of cashback offers based on OfferId.
	 * 
	 * @return CashbackOfferDetailsResponseDto
	 */
	@GetMapping(value = "/cash-back-offers/{offerId}/details")
	@ApiOperation(value = "View the Cashback Details based on OfferId", notes = "This API returns the Cashback Offers Details based on OfferId")
	public CashbackOfferDetailsResponseDto getCashbackDetails(
			@PathVariable("offerId") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String offerId) {
		return cashbackService.getCashbackDetails(offerId);

	}

	/**
	 * This method will return cashbackValue present for a given OfferId,CardNo,
	 * SwipeAmount and InvoiceAmount.
	 * 
	 * @return CashbackValueResponseDto
	 */
	@PostMapping(value = "/cash-back-offers/{offerId}/discounts")
	@ApiOperation(value = "API returns the Cashback Value based on OfferId, CardNo, SwipeAmount and InvoiceAmount", notes = "This API returns Cashback Value based on OfferId, CardNo, SwipeAmount and InvoiceAmount")
	public CashbackValueResponseDto getCashbackValue(
			@PathVariable("offerId") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String offerId,
			@RequestBody CashbackOfferRequestDto cbOfferDto) {
		return cashbackService.getCashbackValue(offerId, cbOfferDto);

	}

	/**
	 * This method will return the GL Code based on the locationCode.
	 * 
	 * @param locationCode
	 * @return GLCodeDto
	 */
	@ApiOperation(value = "This method will return the GL Code based on the locationCode", notes = "This method will return the GL Code based on the locationCode")
	@GetMapping(value = "/{locationCode}")
	public GlCodeDto getGLCode(
			@PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode) {
		return cashbackService.getGLCode(locationCode);
	}

	/**
	 * This method will update the pif series in GL code master
	 * 
	 * @param locationCode
	 */
	@ApiOperation(value = "This method will update the pif series in GL Code Master", notes = "This method will update the pif series in GL Code Master based on the locationCode")
	@PutMapping(value = "/{locationCode}")
	public void updateGlCode(
			@PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode) {
		cashbackService.updateGlCode(locationCode);
	}
	
	/**
	 * This method will return list of product groups names for payment code DIGI
	 * GOLD TANISHQ and DIGI GOLD NON TANISHQ.
	 *
	 * @param ProductGroupDtoDigiGold
	 * @return ProductGroupDtoDigiGold
	 */
	@PostMapping(value = "digi-gold/product-groups")
	@ApiOperation(value = "View the Product Groups valid based on product group codes of the items", notes = "This API returns Product Group valid list for payment code 'DIGI GOLD TANISHQ' and 'DIGI GOLD NON TANISHQ'")
	public ProductGroupDtoDigiGold getProductGroupsForDigiGold(@RequestBody ProductGroupDtoDigiGold productGroupCodeDigiGold) {
		return paymentService.getProductGroupsForDigiGold(productGroupCodeDigiGold);

	}
	
	@ApiOperation(value = "View the CreditNote config details for  based on the creditNoteType", notes = "This API returns the CreditNote config details based on the **creditNoteType**")
	@GetMapping("/creditNote/{creditNoteType}")
	public Object getCreditNote(@PathVariable("creditNoteType") String creditNoteType) {
		return paymentService.getCreditNote(creditNoteType);
	} 
	
	/**
	 * This method will return list of payee bank names based on paymentCode and
	 * transactionType and location code.
	 *
	 * @param paymentCode
	 * @return ListResponse<String>
	 */
	@GetMapping(value = "/payee-banks-default")
	@ApiOperation(value = "View the Payee Bank based on payment code", notes = "This API returns Payee Bank Default List")
	public Object getPayeeBankLocationDetails(  
		@ApiIgnore Pageable pageable){
		return paymentService.getPayeeBankDefaultList(pageable);	
	}
	
	@GetMapping(value = "/payee-bank")
	@ApiOperation(value= "View payee_bank name for the given location_code and payment_code")
	public PayeeBankLocationDto getPayeeBank(
			@RequestParam(name = "paymentCode", required = true) @PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX) String paymentCode
			) {
		return paymentService.getPayeeBank(paymentCode);
	}

	@GetMapping(value = "/payee-bank/isActive")
	@ApiOperation(value = "view isActive status for the given payee-bank")
	public Boolean getIsActive(@RequestParam(name = "bankName", required = true) String bankName
			) {
		return paymentService.getIsActive(bankName);
	}
	
//	/**
//	 * This method will return the bank name based on the locationCode.
//	 * 
//	 * @param locationCode
//	 * @return GLCodeDto
//	 */
//	@ApiOperation(value = "This method will return the  bank name based on the locationCode", notes = "This method will return the  bank name based on the locationCode")
//	@GetMapping(value = "/payer-banks/{locationCode}")
//	public List<PayerBankDtoRes>  getBankName(
//			@PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode) {
//		return paymentService.getBankName(locationCode);
//	}
	
	@PostMapping(value = "/edc-bank")
	@ApiOperation(value= "View edc bank names for the given location code and payment code")
	public List<EdcBanksDto> getEdcBank(
			@RequestParam(name = "paymentCode", required = true) @PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX) String paymentCode,
			@RequestBody(required = false) @Validated EdcBankRequestDto edcBankRequestDto) {
		return paymentService.getEdcBank(paymentCode,edcBankRequestDto);
	}
}

