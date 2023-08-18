
package com.titan.poss.integration.eghs.generated;

import java.math.BigDecimal;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;

/**
 * <p>
 * Java class for POSS_GH_Account_MasterDO complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within
 * this class.
 * 
 * <pre>
 * &lt;complexType name="POSS_GH_Account_MasterDO"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="CFAProductCodes" type="{http://tempuri.org/}ArrayOfPOSS_GH_Account_Master_CFA_ProductCodeDO" minOccurs="0"/&gt;
 *         &lt;element name="PDCDetails" type="{http://tempuri.org/}ArrayOfPOSS_GH_PDC_PaymentDO" minOccurs="0"/&gt;
 *         &lt;element name="EstimatedDiscount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="CustomerDetails" type="{http://tempuri.org/}ArrayOfPOSS_CustomerMaster" minOccurs="0"/&gt;
 *         &lt;element name="PDCInstallmentNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="IsChequeRealisationReq" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="GoldRateeGHS" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="GoldKaratageeGHS" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="IsConsentSubmitted" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Account_Transferable" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Annual_Interest_Percentage" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Can_Extend" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Extend_Count" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="CreatedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="CustomerNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="DocDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="AccountStatusChangeDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="DocNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Duration" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="FiscalYear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Fixed_Installment_Scheme" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="GHSchemeCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Gold_Scheme" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Gold_Karatage" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Grace_Period" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Installment_In_MultipleOf" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Installment_Amount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Interest_Compounded_Yearly" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Interest_Payable" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Interest_Type" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="LastModifiedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="LastModifiedID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Late_Payment_Charge" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="LocationCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="LoginID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Minimum_Gold_Weight" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Minimum_Installment_Amount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="No_Of_Free_Installments" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="No_Of_Installments_Payed" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="NoOfTimesPrinted" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Opening_TotalInstallmentAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Opening_TotalBonusAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Opening_TotalGoldWeight" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Pre_Mature_Penalty_Charge" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Received" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Received_DocNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Received_Date" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="Received_From_Location" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Status" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="TotalInstallmentAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="TotalFreeInstallmentAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Transferred" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Transferred_Date" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="Transferred_To_Location" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="IsActive" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Total_Interest_Payable" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Total_Late_Payment_Charge" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Total_Gold_Weight" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Gold_Rate" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Total_Cheque_Related_Charge" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Total_Pre_Mature_Penalty_Charge" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Maturity_Grace_Period" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Received_Doc_Fiscal_Year" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="IsPre_Mature_Penalty_Percentage" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="IsLate_Payment_Percentage" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Instal_Paid_Src_Loc" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="RSOCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="MinimumInstallmentsForBonus" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="PassBookSerialNo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="IdProofForGHS" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="NarrationForDuplicateSerialNo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="SerialNoMismatchException" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="NomineeName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Address" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="PhoneNo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="DOB" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="Relation" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="PDCUpperLimit" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="PDCLowerLimit" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Can_Redeem_Product_With_Bonus" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="No_MultipleInstallment_Payed" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="NoofDefault" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="NoofLatePayment" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="NoofDefaultUsed" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="NoofLatePaymentUsed" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Opening_NoofDefaultUsed" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Opening_NoofLatePaymentUsed" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Min_Installments_To_Avail_Gift" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Percent_Of_Installment_As_Gift" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Gift_Amount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="IsAutoBonus" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Transferred_Date_ForBonus" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="Opening_Total_Late_Payment_Charge" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Opening_Total_Cheque_Related_Charge" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="no_days_manual_bill_can_be_regularized" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Last_Account_Suspended_Date" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="Last_Account_Activated_Date" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="Locking_Period_For_GrammageAccount" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Installments_To_Be_Paid_For_GrammageAccount" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="IsCancelAccount" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="RequestStatus" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="RefundRequestRemarks" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="RefundStatusChageRemarks" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="MaturedRefDocType" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="MaturedRefDocNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="MaturedRefFiscalYear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Pre_Openning_Installment_Amount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Pre_Openning_Gold_Weight" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="IsReceivedPartialGrammage" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="TotalCashCollected" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="AccountCreatedAt" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="MaturityLocationCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="UtilizationPercentage" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="NoOfMonthsToBlockOrder" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="MinorName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="MinorDOB" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="MinorMobileNo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="MinorRelationShip" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="IsGHSAPIOTPEnable" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="NoOfDaysToBlockinCustomerOrder" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="NoOfDaysToBlockinAdvanceBooking" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="DiscountMC" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="DiscountUCP" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "POSS_GH_Account_MasterDO", propOrder = { "cfaProductCodes", "pdcDetails", "estimatedDiscount",
		"customerDetails", "pdcInstallmentNo", "isChequeRealisationReq", "goldRateeGHS", "goldKaratageeGHS",
		"isConsentSubmitted", "accountTransferable", "annualInterestPercentage", "canExtend", "extendCount",
		"createdDate", "customerNo", "docDate", "accountStatusChangeDate", "docNo", "duration", "fiscalYear",
		"fixedInstallmentScheme", "ghSchemeCode", "goldScheme", "goldKaratage", "gracePeriod",
		"installmentInMultipleOf", "installmentAmount", "interestCompoundedYearly", "interestPayable", "interestType",
		"lastModifiedDate", "lastModifiedID", "latePaymentCharge", "locationCode", "loginID", "minimumGoldWeight",
		"minimumInstallmentAmount", "noOfFreeInstallments", "noOfInstallmentsPayed", "noOfTimesPrinted",
		"openingTotalInstallmentAmount", "openingTotalBonusAmount", "openingTotalGoldWeight", "preMaturePenaltyCharge",
		"received", "receivedDocNo", "receivedDate", "receivedFromLocation", "status", "totalInstallmentAmount",
		"totalFreeInstallmentAmount", "transferred", "transferredDate", "transferredToLocation", "isActive",
		"totalInterestPayable", "totalLatePaymentCharge", "totalGoldWeight", "goldRate", "totalChequeRelatedCharge",
		"totalPreMaturePenaltyCharge", "maturityGracePeriod", "receivedDocFiscalYear", "isPreMaturePenaltyPercentage",
		"isLatePaymentPercentage", "instalPaidSrcLoc", "rsoCode", "minimumInstallmentsForBonus", "passBookSerialNo",
		"idProofForGHS", "narrationForDuplicateSerialNo", "serialNoMismatchException", "nomineeName", "address",
		"phoneNo", "dob", "relation", "pdcUpperLimit", "pdcLowerLimit", "canRedeemProductWithBonus",
		"noMultipleInstallmentPayed", "noofDefault", "noofLatePayment", "noofDefaultUsed", "noofLatePaymentUsed",
		"openingNoofDefaultUsed", "openingNoofLatePaymentUsed", "minInstallmentsToAvailGift",
		"percentOfInstallmentAsGift", "giftAmount", "isAutoBonus", "transferredDateForBonus",
		"openingTotalLatePaymentCharge", "openingTotalChequeRelatedCharge", "noDaysManualBillCanBeRegularized",
		"lastAccountSuspendedDate", "lastAccountActivatedDate", "lockingPeriodForGrammageAccount",
		"installmentsToBePaidForGrammageAccount", "isCancelAccount", "requestStatus", "refundRequestRemarks",
		"refundStatusChageRemarks", "maturedRefDocType", "maturedRefDocNo", "maturedRefFiscalYear",
		"preOpenningInstallmentAmount", "preOpenningGoldWeight", "isReceivedPartialGrammage", "totalCashCollected",
		"accountCreatedAt", "maturityLocationCode", "utilizationPercentage", "noOfMonthsToBlockOrder", "minorName",
		"minorDOB", "minorMobileNo", "minorRelationShip", "isGHSAPIOTPEnable", "noOfDaysToBlockinCustomerOrder",
		"noOfDaysToBlockinAdvanceBooking", "discountMC", "discountUCP" })
public class POSSGHAccountMasterDO {

	@XmlElement(name = "CFAProductCodes")
	protected ArrayOfPOSSGHAccountMasterCFAProductCodeDO cfaProductCodes;
	@XmlElement(name = "PDCDetails")
	protected ArrayOfPOSSGHPDCPaymentDO pdcDetails;
	@XmlElement(name = "EstimatedDiscount", required = true)
	protected BigDecimal estimatedDiscount;
	@XmlElement(name = "CustomerDetails")
	protected ArrayOfPOSSCustomerMaster customerDetails;
	@XmlElement(name = "PDCInstallmentNo")
	protected int pdcInstallmentNo;
	@XmlElement(name = "IsChequeRealisationReq")
	protected boolean isChequeRealisationReq;
	@XmlElement(name = "GoldRateeGHS", required = true)
	protected BigDecimal goldRateeGHS;
	@XmlElement(name = "GoldKaratageeGHS", required = true)
	protected BigDecimal goldKaratageeGHS;
	@XmlElement(name = "IsConsentSubmitted")
	protected boolean isConsentSubmitted;
	@XmlElement(name = "Account_Transferable")
	protected boolean accountTransferable;
	@XmlElement(name = "Annual_Interest_Percentage", required = true)
	protected BigDecimal annualInterestPercentage;
	@XmlElement(name = "Can_Extend")
	protected boolean canExtend;
	@XmlElement(name = "Extend_Count")
	protected int extendCount;
	@XmlElement(name = "CreatedDate", required = true)
	@XmlSchemaType(name = "dateTime")
	protected XMLGregorianCalendar createdDate;
	@XmlElement(name = "CustomerNo")
	protected int customerNo;
	@XmlElement(name = "DocDate", required = true)
	@XmlSchemaType(name = "dateTime")
	protected XMLGregorianCalendar docDate;
	@XmlElement(name = "AccountStatusChangeDate", required = true)
	@XmlSchemaType(name = "dateTime")
	protected XMLGregorianCalendar accountStatusChangeDate;
	@XmlElement(name = "DocNo")
	protected int docNo;
	@XmlElement(name = "Duration")
	protected int duration;
	@XmlElement(name = "FiscalYear")
	protected int fiscalYear;
	@XmlElement(name = "Fixed_Installment_Scheme")
	protected boolean fixedInstallmentScheme;
	@XmlElement(name = "GHSchemeCode")
	protected String ghSchemeCode;
	@XmlElement(name = "Gold_Scheme")
	protected boolean goldScheme;
	@XmlElement(name = "Gold_Karatage", required = true)
	protected BigDecimal goldKaratage;
	@XmlElement(name = "Grace_Period")
	protected int gracePeriod;
	@XmlElement(name = "Installment_In_MultipleOf", required = true)
	protected BigDecimal installmentInMultipleOf;
	@XmlElement(name = "Installment_Amount", required = true)
	protected BigDecimal installmentAmount;
	@XmlElement(name = "Interest_Compounded_Yearly")
	protected boolean interestCompoundedYearly;
	@XmlElement(name = "Interest_Payable")
	protected boolean interestPayable;
	@XmlElement(name = "Interest_Type")
	protected String interestType;
	@XmlElement(name = "LastModifiedDate", required = true)
	@XmlSchemaType(name = "dateTime")
	protected XMLGregorianCalendar lastModifiedDate;
	@XmlElement(name = "LastModifiedID")
	protected String lastModifiedID;
	@XmlElement(name = "Late_Payment_Charge", required = true)
	protected BigDecimal latePaymentCharge;
	@XmlElement(name = "LocationCode")
	protected String locationCode;
	@XmlElement(name = "LoginID")
	protected String loginID;
	@XmlElement(name = "Minimum_Gold_Weight", required = true)
	protected BigDecimal minimumGoldWeight;
	@XmlElement(name = "Minimum_Installment_Amount", required = true)
	protected BigDecimal minimumInstallmentAmount;
	@XmlElement(name = "No_Of_Free_Installments", required = true)
	protected BigDecimal noOfFreeInstallments;
	@XmlElement(name = "No_Of_Installments_Payed")
	protected int noOfInstallmentsPayed;
	@XmlElement(name = "NoOfTimesPrinted")
	protected int noOfTimesPrinted;
	@XmlElement(name = "Opening_TotalInstallmentAmount", required = true)
	protected BigDecimal openingTotalInstallmentAmount;
	@XmlElement(name = "Opening_TotalBonusAmount", required = true)
	protected BigDecimal openingTotalBonusAmount;
	@XmlElement(name = "Opening_TotalGoldWeight", required = true)
	protected BigDecimal openingTotalGoldWeight;
	@XmlElement(name = "Pre_Mature_Penalty_Charge", required = true)
	protected BigDecimal preMaturePenaltyCharge;
	@XmlElement(name = "Received")
	protected boolean received;
	@XmlElement(name = "Received_DocNo")
	protected int receivedDocNo;
	@XmlElement(name = "Received_Date", required = true)
	@XmlSchemaType(name = "dateTime")
	protected XMLGregorianCalendar receivedDate;
	@XmlElement(name = "Received_From_Location")
	protected String receivedFromLocation;
	@XmlElement(name = "Status")
	protected int status;
	@XmlElement(name = "TotalInstallmentAmount", required = true)
	protected BigDecimal totalInstallmentAmount;
	@XmlElement(name = "TotalFreeInstallmentAmount", required = true)
	protected BigDecimal totalFreeInstallmentAmount;
	@XmlElement(name = "Transferred")
	protected boolean transferred;
	@XmlElement(name = "Transferred_Date", required = true)
	@XmlSchemaType(name = "dateTime")
	protected XMLGregorianCalendar transferredDate;
	@XmlElement(name = "Transferred_To_Location")
	protected String transferredToLocation;
	@XmlElement(name = "IsActive")
	protected boolean isActive;
	@XmlElement(name = "Total_Interest_Payable", required = true)
	protected BigDecimal totalInterestPayable;
	@XmlElement(name = "Total_Late_Payment_Charge", required = true)
	protected BigDecimal totalLatePaymentCharge;
	@XmlElement(name = "Total_Gold_Weight", required = true)
	protected BigDecimal totalGoldWeight;
	@XmlElement(name = "Gold_Rate", required = true)
	protected BigDecimal goldRate;
	@XmlElement(name = "Total_Cheque_Related_Charge", required = true)
	protected BigDecimal totalChequeRelatedCharge;
	@XmlElement(name = "Total_Pre_Mature_Penalty_Charge", required = true)
	protected BigDecimal totalPreMaturePenaltyCharge;
	@XmlElement(name = "Maturity_Grace_Period")
	protected int maturityGracePeriod;
	@XmlElement(name = "Received_Doc_Fiscal_Year")
	protected int receivedDocFiscalYear;
	@XmlElement(name = "IsPre_Mature_Penalty_Percentage")
	protected boolean isPreMaturePenaltyPercentage;
	@XmlElement(name = "IsLate_Payment_Percentage")
	protected boolean isLatePaymentPercentage;
	@XmlElement(name = "Instal_Paid_Src_Loc")
	protected int instalPaidSrcLoc;
	@XmlElement(name = "RSOCode")
	protected String rsoCode;
	@XmlElement(name = "MinimumInstallmentsForBonus", required = true)
	protected BigDecimal minimumInstallmentsForBonus;
	@XmlElement(name = "PassBookSerialNo")
	protected String passBookSerialNo;
	@XmlElement(name = "IdProofForGHS")
	protected boolean idProofForGHS;
	@XmlElement(name = "NarrationForDuplicateSerialNo")
	protected String narrationForDuplicateSerialNo;
	@XmlElement(name = "SerialNoMismatchException")
	protected String serialNoMismatchException;
	@XmlElement(name = "NomineeName")
	protected String nomineeName;
	@XmlElement(name = "Address")
	protected String address;
	@XmlElement(name = "PhoneNo")
	protected String phoneNo;
	@XmlElement(name = "DOB", required = true)
	@XmlSchemaType(name = "dateTime")
	protected XMLGregorianCalendar dob;
	@XmlElement(name = "Relation")
	protected String relation;
	@XmlElement(name = "PDCUpperLimit")
	protected int pdcUpperLimit;
	@XmlElement(name = "PDCLowerLimit")
	protected int pdcLowerLimit;
	@XmlElement(name = "Can_Redeem_Product_With_Bonus")
	protected boolean canRedeemProductWithBonus;
	@XmlElement(name = "No_MultipleInstallment_Payed")
	protected int noMultipleInstallmentPayed;
	@XmlElement(name = "NoofDefault")
	protected int noofDefault;
	@XmlElement(name = "NoofLatePayment")
	protected int noofLatePayment;
	@XmlElement(name = "NoofDefaultUsed")
	protected int noofDefaultUsed;
	@XmlElement(name = "NoofLatePaymentUsed")
	protected int noofLatePaymentUsed;
	@XmlElement(name = "Opening_NoofDefaultUsed")
	protected int openingNoofDefaultUsed;
	@XmlElement(name = "Opening_NoofLatePaymentUsed")
	protected int openingNoofLatePaymentUsed;
	@XmlElement(name = "Min_Installments_To_Avail_Gift")
	protected int minInstallmentsToAvailGift;
	@XmlElement(name = "Percent_Of_Installment_As_Gift", required = true)
	protected BigDecimal percentOfInstallmentAsGift;
	@XmlElement(name = "Gift_Amount", required = true)
	protected BigDecimal giftAmount;
	@XmlElement(name = "IsAutoBonus")
	protected boolean isAutoBonus;
	@XmlElement(name = "Transferred_Date_ForBonus", required = true)
	@XmlSchemaType(name = "dateTime")
	protected XMLGregorianCalendar transferredDateForBonus;
	@XmlElement(name = "Opening_Total_Late_Payment_Charge", required = true)
	protected BigDecimal openingTotalLatePaymentCharge;
	@XmlElement(name = "Opening_Total_Cheque_Related_Charge", required = true)
	protected BigDecimal openingTotalChequeRelatedCharge;
	@XmlElement(name = "no_days_manual_bill_can_be_regularized")
	protected int noDaysManualBillCanBeRegularized;
	@XmlElement(name = "Last_Account_Suspended_Date", required = true)
	@XmlSchemaType(name = "dateTime")
	protected XMLGregorianCalendar lastAccountSuspendedDate;
	@XmlElement(name = "Last_Account_Activated_Date", required = true)
	@XmlSchemaType(name = "dateTime")
	protected XMLGregorianCalendar lastAccountActivatedDate;
	@XmlElement(name = "Locking_Period_For_GrammageAccount")
	protected int lockingPeriodForGrammageAccount;
	@XmlElement(name = "Installments_To_Be_Paid_For_GrammageAccount")
	protected int installmentsToBePaidForGrammageAccount;
	@XmlElement(name = "IsCancelAccount")
	protected boolean isCancelAccount;
	@XmlElement(name = "RequestStatus")
	protected int requestStatus;
	@XmlElement(name = "RefundRequestRemarks")
	protected String refundRequestRemarks;
	@XmlElement(name = "RefundStatusChageRemarks")
	protected String refundStatusChageRemarks;
	@XmlElement(name = "MaturedRefDocType")
	protected String maturedRefDocType;
	@XmlElement(name = "MaturedRefDocNo")
	protected int maturedRefDocNo;
	@XmlElement(name = "MaturedRefFiscalYear")
	protected int maturedRefFiscalYear;
	@XmlElement(name = "Pre_Openning_Installment_Amount", required = true)
	protected BigDecimal preOpenningInstallmentAmount;
	@XmlElement(name = "Pre_Openning_Gold_Weight", required = true)
	protected BigDecimal preOpenningGoldWeight;
	@XmlElement(name = "IsReceivedPartialGrammage")
	protected boolean isReceivedPartialGrammage;
	@XmlElement(name = "TotalCashCollected", required = true)
	protected BigDecimal totalCashCollected;
	@XmlElement(name = "AccountCreatedAt")
	protected String accountCreatedAt;
	@XmlElement(name = "MaturityLocationCode")
	protected String maturityLocationCode;
	@XmlElement(name = "UtilizationPercentage", required = true)
	protected BigDecimal utilizationPercentage;
	@XmlElement(name = "NoOfMonthsToBlockOrder")
	protected int noOfMonthsToBlockOrder;
	@XmlElement(name = "MinorName")
	protected String minorName;
	@XmlElement(name = "MinorDOB", required = true)
	@XmlSchemaType(name = "dateTime")
	protected XMLGregorianCalendar minorDOB;
	@XmlElement(name = "MinorMobileNo")
	protected String minorMobileNo;
	@XmlElement(name = "MinorRelationShip")
	protected String minorRelationShip;
	@XmlElement(name = "IsGHSAPIOTPEnable")
	protected boolean isGHSAPIOTPEnable;
	@XmlElement(name = "NoOfDaysToBlockinCustomerOrder")
	protected int noOfDaysToBlockinCustomerOrder;
	@XmlElement(name = "NoOfDaysToBlockinAdvanceBooking")
	protected int noOfDaysToBlockinAdvanceBooking;
	@XmlElement(name = "DiscountMC")
	protected int discountMC;
	@XmlElement(name = "DiscountUCP")
	protected int discountUCP;

	/**
	 * Gets the value of the cfaProductCodes property.
	 * 
	 * @return possible object is {@link ArrayOfPOSSGHAccountMasterCFAProductCodeDO
	 *         }
	 * 
	 */
	public ArrayOfPOSSGHAccountMasterCFAProductCodeDO getCFAProductCodes() {
		return cfaProductCodes;
	}

	/**
	 * Sets the value of the cfaProductCodes property.
	 * 
	 * @param value allowed object is
	 *              {@link ArrayOfPOSSGHAccountMasterCFAProductCodeDO }
	 * 
	 */
	public void setCFAProductCodes(ArrayOfPOSSGHAccountMasterCFAProductCodeDO value) {
		this.cfaProductCodes = value;
	}

	/**
	 * Gets the value of the pdcDetails property.
	 * 
	 * @return possible object is {@link ArrayOfPOSSGHPDCPaymentDO }
	 * 
	 */
	public ArrayOfPOSSGHPDCPaymentDO getPDCDetails() {
		return pdcDetails;
	}

	/**
	 * Sets the value of the pdcDetails property.
	 * 
	 * @param value allowed object is {@link ArrayOfPOSSGHPDCPaymentDO }
	 * 
	 */
	public void setPDCDetails(ArrayOfPOSSGHPDCPaymentDO value) {
		this.pdcDetails = value;
	}

	/**
	 * Gets the value of the estimatedDiscount property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getEstimatedDiscount() {
		return estimatedDiscount;
	}

	/**
	 * Sets the value of the estimatedDiscount property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setEstimatedDiscount(BigDecimal value) {
		this.estimatedDiscount = value;
	}

	/**
	 * Gets the value of the customerDetails property.
	 * 
	 * @return possible object is {@link ArrayOfPOSSCustomerMaster }
	 * 
	 */
	public ArrayOfPOSSCustomerMaster getCustomerDetails() {
		return customerDetails;
	}

	/**
	 * Sets the value of the customerDetails property.
	 * 
	 * @param value allowed object is {@link ArrayOfPOSSCustomerMaster }
	 * 
	 */
	public void setCustomerDetails(ArrayOfPOSSCustomerMaster value) {
		this.customerDetails = value;
	}

	/**
	 * Gets the value of the pdcInstallmentNo property.
	 * 
	 */
	public int getPDCInstallmentNo() {
		return pdcInstallmentNo;
	}

	/**
	 * Sets the value of the pdcInstallmentNo property.
	 * 
	 */
	public void setPDCInstallmentNo(int value) {
		this.pdcInstallmentNo = value;
	}

	/**
	 * Gets the value of the isChequeRealisationReq property.
	 * 
	 */
	public boolean isIsChequeRealisationReq() {
		return isChequeRealisationReq;
	}

	/**
	 * Sets the value of the isChequeRealisationReq property.
	 * 
	 */
	public void setIsChequeRealisationReq(boolean value) {
		this.isChequeRealisationReq = value;
	}

	/**
	 * Gets the value of the goldRateeGHS property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getGoldRateeGHS() {
		return goldRateeGHS;
	}

	/**
	 * Sets the value of the goldRateeGHS property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setGoldRateeGHS(BigDecimal value) {
		this.goldRateeGHS = value;
	}

	/**
	 * Gets the value of the goldKaratageeGHS property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getGoldKaratageeGHS() {
		return goldKaratageeGHS;
	}

	/**
	 * Sets the value of the goldKaratageeGHS property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setGoldKaratageeGHS(BigDecimal value) {
		this.goldKaratageeGHS = value;
	}

	/**
	 * Gets the value of the isConsentSubmitted property.
	 * 
	 */
	public boolean isIsConsentSubmitted() {
		return isConsentSubmitted;
	}

	/**
	 * Sets the value of the isConsentSubmitted property.
	 * 
	 */
	public void setIsConsentSubmitted(boolean value) {
		this.isConsentSubmitted = value;
	}

	/**
	 * Gets the value of the accountTransferable property.
	 * 
	 */
	public boolean isAccountTransferable() {
		return accountTransferable;
	}

	/**
	 * Sets the value of the accountTransferable property.
	 * 
	 */
	public void setAccountTransferable(boolean value) {
		this.accountTransferable = value;
	}

	/**
	 * Gets the value of the annualInterestPercentage property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getAnnualInterestPercentage() {
		return annualInterestPercentage;
	}

	/**
	 * Sets the value of the annualInterestPercentage property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setAnnualInterestPercentage(BigDecimal value) {
		this.annualInterestPercentage = value;
	}

	/**
	 * Gets the value of the canExtend property.
	 * 
	 */
	public boolean isCanExtend() {
		return canExtend;
	}

	/**
	 * Sets the value of the canExtend property.
	 * 
	 */
	public void setCanExtend(boolean value) {
		this.canExtend = value;
	}

	/**
	 * Gets the value of the extendCount property.
	 * 
	 */
	public int getExtendCount() {
		return extendCount;
	}

	/**
	 * Sets the value of the extendCount property.
	 * 
	 */
	public void setExtendCount(int value) {
		this.extendCount = value;
	}

	/**
	 * Gets the value of the createdDate property.
	 * 
	 * @return possible object is {@link XMLGregorianCalendar }
	 * 
	 */
	public XMLGregorianCalendar getCreatedDate() {
		return createdDate;
	}

	/**
	 * Sets the value of the createdDate property.
	 * 
	 * @param value allowed object is {@link XMLGregorianCalendar }
	 * 
	 */
	public void setCreatedDate(XMLGregorianCalendar value) {
		this.createdDate = value;
	}

	/**
	 * Gets the value of the customerNo property.
	 * 
	 */
	public int getCustomerNo() {
		return customerNo;
	}

	/**
	 * Sets the value of the customerNo property.
	 * 
	 */
	public void setCustomerNo(int value) {
		this.customerNo = value;
	}

	/**
	 * Gets the value of the docDate property.
	 * 
	 * @return possible object is {@link XMLGregorianCalendar }
	 * 
	 */
	public XMLGregorianCalendar getDocDate() {
		return docDate;
	}

	/**
	 * Sets the value of the docDate property.
	 * 
	 * @param value allowed object is {@link XMLGregorianCalendar }
	 * 
	 */
	public void setDocDate(XMLGregorianCalendar value) {
		this.docDate = value;
	}

	/**
	 * Gets the value of the accountStatusChangeDate property.
	 * 
	 * @return possible object is {@link XMLGregorianCalendar }
	 * 
	 */
	public XMLGregorianCalendar getAccountStatusChangeDate() {
		return accountStatusChangeDate;
	}

	/**
	 * Sets the value of the accountStatusChangeDate property.
	 * 
	 * @param value allowed object is {@link XMLGregorianCalendar }
	 * 
	 */
	public void setAccountStatusChangeDate(XMLGregorianCalendar value) {
		this.accountStatusChangeDate = value;
	}

	/**
	 * Gets the value of the docNo property.
	 * 
	 */
	public int getDocNo() {
		return docNo;
	}

	/**
	 * Sets the value of the docNo property.
	 * 
	 */
	public void setDocNo(int value) {
		this.docNo = value;
	}

	/**
	 * Gets the value of the duration property.
	 * 
	 */
	public int getDuration() {
		return duration;
	}

	/**
	 * Sets the value of the duration property.
	 * 
	 */
	public void setDuration(int value) {
		this.duration = value;
	}

	/**
	 * Gets the value of the fiscalYear property.
	 * 
	 */
	public int getFiscalYear() {
		return fiscalYear;
	}

	/**
	 * Sets the value of the fiscalYear property.
	 * 
	 */
	public void setFiscalYear(int value) {
		this.fiscalYear = value;
	}

	/**
	 * Gets the value of the fixedInstallmentScheme property.
	 * 
	 */
	public boolean isFixedInstallmentScheme() {
		return fixedInstallmentScheme;
	}

	/**
	 * Sets the value of the fixedInstallmentScheme property.
	 * 
	 */
	public void setFixedInstallmentScheme(boolean value) {
		this.fixedInstallmentScheme = value;
	}

	/**
	 * Gets the value of the ghSchemeCode property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getGHSchemeCode() {
		return ghSchemeCode;
	}

	/**
	 * Sets the value of the ghSchemeCode property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setGHSchemeCode(String value) {
		this.ghSchemeCode = value;
	}

	/**
	 * Gets the value of the goldScheme property.
	 * 
	 */
	public boolean isGoldScheme() {
		return goldScheme;
	}

	/**
	 * Sets the value of the goldScheme property.
	 * 
	 */
	public void setGoldScheme(boolean value) {
		this.goldScheme = value;
	}

	/**
	 * Gets the value of the goldKaratage property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getGoldKaratage() {
		return goldKaratage;
	}

	/**
	 * Sets the value of the goldKaratage property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setGoldKaratage(BigDecimal value) {
		this.goldKaratage = value;
	}

	/**
	 * Gets the value of the gracePeriod property.
	 * 
	 */
	public int getGracePeriod() {
		return gracePeriod;
	}

	/**
	 * Sets the value of the gracePeriod property.
	 * 
	 */
	public void setGracePeriod(int value) {
		this.gracePeriod = value;
	}

	/**
	 * Gets the value of the installmentInMultipleOf property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getInstallmentInMultipleOf() {
		return installmentInMultipleOf;
	}

	/**
	 * Sets the value of the installmentInMultipleOf property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setInstallmentInMultipleOf(BigDecimal value) {
		this.installmentInMultipleOf = value;
	}

	/**
	 * Gets the value of the installmentAmount property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getInstallmentAmount() {
		return installmentAmount;
	}

	/**
	 * Sets the value of the installmentAmount property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setInstallmentAmount(BigDecimal value) {
		this.installmentAmount = value;
	}

	/**
	 * Gets the value of the interestCompoundedYearly property.
	 * 
	 */
	public boolean isInterestCompoundedYearly() {
		return interestCompoundedYearly;
	}

	/**
	 * Sets the value of the interestCompoundedYearly property.
	 * 
	 */
	public void setInterestCompoundedYearly(boolean value) {
		this.interestCompoundedYearly = value;
	}

	/**
	 * Gets the value of the interestPayable property.
	 * 
	 */
	public boolean isInterestPayable() {
		return interestPayable;
	}

	/**
	 * Sets the value of the interestPayable property.
	 * 
	 */
	public void setInterestPayable(boolean value) {
		this.interestPayable = value;
	}

	/**
	 * Gets the value of the interestType property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getInterestType() {
		return interestType;
	}

	/**
	 * Sets the value of the interestType property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setInterestType(String value) {
		this.interestType = value;
	}

	/**
	 * Gets the value of the lastModifiedDate property.
	 * 
	 * @return possible object is {@link XMLGregorianCalendar }
	 * 
	 */
	public XMLGregorianCalendar getLastModifiedDate() {
		return lastModifiedDate;
	}

	/**
	 * Sets the value of the lastModifiedDate property.
	 * 
	 * @param value allowed object is {@link XMLGregorianCalendar }
	 * 
	 */
	public void setLastModifiedDate(XMLGregorianCalendar value) {
		this.lastModifiedDate = value;
	}

	/**
	 * Gets the value of the lastModifiedID property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getLastModifiedID() {
		return lastModifiedID;
	}

	/**
	 * Sets the value of the lastModifiedID property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setLastModifiedID(String value) {
		this.lastModifiedID = value;
	}

	/**
	 * Gets the value of the latePaymentCharge property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getLatePaymentCharge() {
		return latePaymentCharge;
	}

	/**
	 * Sets the value of the latePaymentCharge property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setLatePaymentCharge(BigDecimal value) {
		this.latePaymentCharge = value;
	}

	/**
	 * Gets the value of the locationCode property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getLocationCode() {
		return locationCode;
	}

	/**
	 * Sets the value of the locationCode property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setLocationCode(String value) {
		this.locationCode = value;
	}

	/**
	 * Gets the value of the loginID property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getLoginID() {
		return loginID;
	}

	/**
	 * Sets the value of the loginID property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setLoginID(String value) {
		this.loginID = value;
	}

	/**
	 * Gets the value of the minimumGoldWeight property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getMinimumGoldWeight() {
		return minimumGoldWeight;
	}

	/**
	 * Sets the value of the minimumGoldWeight property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setMinimumGoldWeight(BigDecimal value) {
		this.minimumGoldWeight = value;
	}

	/**
	 * Gets the value of the minimumInstallmentAmount property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getMinimumInstallmentAmount() {
		return minimumInstallmentAmount;
	}

	/**
	 * Sets the value of the minimumInstallmentAmount property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setMinimumInstallmentAmount(BigDecimal value) {
		this.minimumInstallmentAmount = value;
	}

	/**
	 * Gets the value of the noOfFreeInstallments property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getNoOfFreeInstallments() {
		return noOfFreeInstallments;
	}

	/**
	 * Sets the value of the noOfFreeInstallments property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setNoOfFreeInstallments(BigDecimal value) {
		this.noOfFreeInstallments = value;
	}

	/**
	 * Gets the value of the noOfInstallmentsPayed property.
	 * 
	 */
	public int getNoOfInstallmentsPayed() {
		return noOfInstallmentsPayed;
	}

	/**
	 * Sets the value of the noOfInstallmentsPayed property.
	 * 
	 */
	public void setNoOfInstallmentsPayed(int value) {
		this.noOfInstallmentsPayed = value;
	}

	/**
	 * Gets the value of the noOfTimesPrinted property.
	 * 
	 */
	public int getNoOfTimesPrinted() {
		return noOfTimesPrinted;
	}

	/**
	 * Sets the value of the noOfTimesPrinted property.
	 * 
	 */
	public void setNoOfTimesPrinted(int value) {
		this.noOfTimesPrinted = value;
	}

	/**
	 * Gets the value of the openingTotalInstallmentAmount property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getOpeningTotalInstallmentAmount() {
		return openingTotalInstallmentAmount;
	}

	/**
	 * Sets the value of the openingTotalInstallmentAmount property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setOpeningTotalInstallmentAmount(BigDecimal value) {
		this.openingTotalInstallmentAmount = value;
	}

	/**
	 * Gets the value of the openingTotalBonusAmount property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getOpeningTotalBonusAmount() {
		return openingTotalBonusAmount;
	}

	/**
	 * Sets the value of the openingTotalBonusAmount property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setOpeningTotalBonusAmount(BigDecimal value) {
		this.openingTotalBonusAmount = value;
	}

	/**
	 * Gets the value of the openingTotalGoldWeight property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getOpeningTotalGoldWeight() {
		return openingTotalGoldWeight;
	}

	/**
	 * Sets the value of the openingTotalGoldWeight property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setOpeningTotalGoldWeight(BigDecimal value) {
		this.openingTotalGoldWeight = value;
	}

	/**
	 * Gets the value of the preMaturePenaltyCharge property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getPreMaturePenaltyCharge() {
		return preMaturePenaltyCharge;
	}

	/**
	 * Sets the value of the preMaturePenaltyCharge property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setPreMaturePenaltyCharge(BigDecimal value) {
		this.preMaturePenaltyCharge = value;
	}

	/**
	 * Gets the value of the received property.
	 * 
	 */
	public boolean isReceived() {
		return received;
	}

	/**
	 * Sets the value of the received property.
	 * 
	 */
	public void setReceived(boolean value) {
		this.received = value;
	}

	/**
	 * Gets the value of the receivedDocNo property.
	 * 
	 */
	public int getReceivedDocNo() {
		return receivedDocNo;
	}

	/**
	 * Sets the value of the receivedDocNo property.
	 * 
	 */
	public void setReceivedDocNo(int value) {
		this.receivedDocNo = value;
	}

	/**
	 * Gets the value of the receivedDate property.
	 * 
	 * @return possible object is {@link XMLGregorianCalendar }
	 * 
	 */
	public XMLGregorianCalendar getReceivedDate() {
		return receivedDate;
	}

	/**
	 * Sets the value of the receivedDate property.
	 * 
	 * @param value allowed object is {@link XMLGregorianCalendar }
	 * 
	 */
	public void setReceivedDate(XMLGregorianCalendar value) {
		this.receivedDate = value;
	}

	/**
	 * Gets the value of the receivedFromLocation property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getReceivedFromLocation() {
		return receivedFromLocation;
	}

	/**
	 * Sets the value of the receivedFromLocation property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setReceivedFromLocation(String value) {
		this.receivedFromLocation = value;
	}

	/**
	 * Gets the value of the status property.
	 * 
	 */
	public int getStatus() {
		return status;
	}

	/**
	 * Sets the value of the status property.
	 * 
	 */
	public void setStatus(int value) {
		this.status = value;
	}

	/**
	 * Gets the value of the totalInstallmentAmount property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getTotalInstallmentAmount() {
		return totalInstallmentAmount;
	}

	/**
	 * Sets the value of the totalInstallmentAmount property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setTotalInstallmentAmount(BigDecimal value) {
		this.totalInstallmentAmount = value;
	}

	/**
	 * Gets the value of the totalFreeInstallmentAmount property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getTotalFreeInstallmentAmount() {
		return totalFreeInstallmentAmount;
	}

	/**
	 * Sets the value of the totalFreeInstallmentAmount property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setTotalFreeInstallmentAmount(BigDecimal value) {
		this.totalFreeInstallmentAmount = value;
	}

	/**
	 * Gets the value of the transferred property.
	 * 
	 */
	public boolean isTransferred() {
		return transferred;
	}

	/**
	 * Sets the value of the transferred property.
	 * 
	 */
	public void setTransferred(boolean value) {
		this.transferred = value;
	}

	/**
	 * Gets the value of the transferredDate property.
	 * 
	 * @return possible object is {@link XMLGregorianCalendar }
	 * 
	 */
	public XMLGregorianCalendar getTransferredDate() {
		return transferredDate;
	}

	/**
	 * Sets the value of the transferredDate property.
	 * 
	 * @param value allowed object is {@link XMLGregorianCalendar }
	 * 
	 */
	public void setTransferredDate(XMLGregorianCalendar value) {
		this.transferredDate = value;
	}

	/**
	 * Gets the value of the transferredToLocation property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getTransferredToLocation() {
		return transferredToLocation;
	}

	/**
	 * Sets the value of the transferredToLocation property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setTransferredToLocation(String value) {
		this.transferredToLocation = value;
	}

	/**
	 * Gets the value of the isActive property.
	 * 
	 */
	public boolean isIsActive() {
		return isActive;
	}

	/**
	 * Sets the value of the isActive property.
	 * 
	 */
	public void setIsActive(boolean value) {
		this.isActive = value;
	}

	/**
	 * Gets the value of the totalInterestPayable property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getTotalInterestPayable() {
		return totalInterestPayable;
	}

	/**
	 * Sets the value of the totalInterestPayable property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setTotalInterestPayable(BigDecimal value) {
		this.totalInterestPayable = value;
	}

	/**
	 * Gets the value of the totalLatePaymentCharge property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getTotalLatePaymentCharge() {
		return totalLatePaymentCharge;
	}

	/**
	 * Sets the value of the totalLatePaymentCharge property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setTotalLatePaymentCharge(BigDecimal value) {
		this.totalLatePaymentCharge = value;
	}

	/**
	 * Gets the value of the totalGoldWeight property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getTotalGoldWeight() {
		return totalGoldWeight;
	}

	/**
	 * Sets the value of the totalGoldWeight property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setTotalGoldWeight(BigDecimal value) {
		this.totalGoldWeight = value;
	}

	/**
	 * Gets the value of the goldRate property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getGoldRate() {
		return goldRate;
	}

	/**
	 * Sets the value of the goldRate property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setGoldRate(BigDecimal value) {
		this.goldRate = value;
	}

	/**
	 * Gets the value of the totalChequeRelatedCharge property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getTotalChequeRelatedCharge() {
		return totalChequeRelatedCharge;
	}

	/**
	 * Sets the value of the totalChequeRelatedCharge property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setTotalChequeRelatedCharge(BigDecimal value) {
		this.totalChequeRelatedCharge = value;
	}

	/**
	 * Gets the value of the totalPreMaturePenaltyCharge property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getTotalPreMaturePenaltyCharge() {
		return totalPreMaturePenaltyCharge;
	}

	/**
	 * Sets the value of the totalPreMaturePenaltyCharge property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setTotalPreMaturePenaltyCharge(BigDecimal value) {
		this.totalPreMaturePenaltyCharge = value;
	}

	/**
	 * Gets the value of the maturityGracePeriod property.
	 * 
	 */
	public int getMaturityGracePeriod() {
		return maturityGracePeriod;
	}

	/**
	 * Sets the value of the maturityGracePeriod property.
	 * 
	 */
	public void setMaturityGracePeriod(int value) {
		this.maturityGracePeriod = value;
	}

	/**
	 * Gets the value of the receivedDocFiscalYear property.
	 * 
	 */
	public int getReceivedDocFiscalYear() {
		return receivedDocFiscalYear;
	}

	/**
	 * Sets the value of the receivedDocFiscalYear property.
	 * 
	 */
	public void setReceivedDocFiscalYear(int value) {
		this.receivedDocFiscalYear = value;
	}

	/**
	 * Gets the value of the isPreMaturePenaltyPercentage property.
	 * 
	 */
	public boolean isIsPreMaturePenaltyPercentage() {
		return isPreMaturePenaltyPercentage;
	}

	/**
	 * Sets the value of the isPreMaturePenaltyPercentage property.
	 * 
	 */
	public void setIsPreMaturePenaltyPercentage(boolean value) {
		this.isPreMaturePenaltyPercentage = value;
	}

	/**
	 * Gets the value of the isLatePaymentPercentage property.
	 * 
	 */
	public boolean isIsLatePaymentPercentage() {
		return isLatePaymentPercentage;
	}

	/**
	 * Sets the value of the isLatePaymentPercentage property.
	 * 
	 */
	public void setIsLatePaymentPercentage(boolean value) {
		this.isLatePaymentPercentage = value;
	}

	/**
	 * Gets the value of the instalPaidSrcLoc property.
	 * 
	 */
	public int getInstalPaidSrcLoc() {
		return instalPaidSrcLoc;
	}

	/**
	 * Sets the value of the instalPaidSrcLoc property.
	 * 
	 */
	public void setInstalPaidSrcLoc(int value) {
		this.instalPaidSrcLoc = value;
	}

	/**
	 * Gets the value of the rsoCode property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getRSOCode() {
		return rsoCode;
	}

	/**
	 * Sets the value of the rsoCode property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setRSOCode(String value) {
		this.rsoCode = value;
	}

	/**
	 * Gets the value of the minimumInstallmentsForBonus property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getMinimumInstallmentsForBonus() {
		return minimumInstallmentsForBonus;
	}

	/**
	 * Sets the value of the minimumInstallmentsForBonus property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setMinimumInstallmentsForBonus(BigDecimal value) {
		this.minimumInstallmentsForBonus = value;
	}

	/**
	 * Gets the value of the passBookSerialNo property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getPassBookSerialNo() {
		return passBookSerialNo;
	}

	/**
	 * Sets the value of the passBookSerialNo property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setPassBookSerialNo(String value) {
		this.passBookSerialNo = value;
	}

	/**
	 * Gets the value of the idProofForGHS property.
	 * 
	 */
	public boolean isIdProofForGHS() {
		return idProofForGHS;
	}

	/**
	 * Sets the value of the idProofForGHS property.
	 * 
	 */
	public void setIdProofForGHS(boolean value) {
		this.idProofForGHS = value;
	}

	/**
	 * Gets the value of the narrationForDuplicateSerialNo property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getNarrationForDuplicateSerialNo() {
		return narrationForDuplicateSerialNo;
	}

	/**
	 * Sets the value of the narrationForDuplicateSerialNo property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setNarrationForDuplicateSerialNo(String value) {
		this.narrationForDuplicateSerialNo = value;
	}

	/**
	 * Gets the value of the serialNoMismatchException property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getSerialNoMismatchException() {
		return serialNoMismatchException;
	}

	/**
	 * Sets the value of the serialNoMismatchException property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setSerialNoMismatchException(String value) {
		this.serialNoMismatchException = value;
	}

	/**
	 * Gets the value of the nomineeName property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getNomineeName() {
		return nomineeName;
	}

	/**
	 * Sets the value of the nomineeName property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setNomineeName(String value) {
		this.nomineeName = value;
	}

	/**
	 * Gets the value of the address property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getAddress() {
		return address;
	}

	/**
	 * Sets the value of the address property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setAddress(String value) {
		this.address = value;
	}

	/**
	 * Gets the value of the phoneNo property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getPhoneNo() {
		return phoneNo;
	}

	/**
	 * Sets the value of the phoneNo property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setPhoneNo(String value) {
		this.phoneNo = value;
	}

	/**
	 * Gets the value of the dob property.
	 * 
	 * @return possible object is {@link XMLGregorianCalendar }
	 * 
	 */
	public XMLGregorianCalendar getDOB() {
		return dob;
	}

	/**
	 * Sets the value of the dob property.
	 * 
	 * @param value allowed object is {@link XMLGregorianCalendar }
	 * 
	 */
	public void setDOB(XMLGregorianCalendar value) {
		this.dob = value;
	}

	/**
	 * Gets the value of the relation property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getRelation() {
		return relation;
	}

	/**
	 * Sets the value of the relation property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setRelation(String value) {
		this.relation = value;
	}

	/**
	 * Gets the value of the pdcUpperLimit property.
	 * 
	 */
	public int getPDCUpperLimit() {
		return pdcUpperLimit;
	}

	/**
	 * Sets the value of the pdcUpperLimit property.
	 * 
	 */
	public void setPDCUpperLimit(int value) {
		this.pdcUpperLimit = value;
	}

	/**
	 * Gets the value of the pdcLowerLimit property.
	 * 
	 */
	public int getPDCLowerLimit() {
		return pdcLowerLimit;
	}

	/**
	 * Sets the value of the pdcLowerLimit property.
	 * 
	 */
	public void setPDCLowerLimit(int value) {
		this.pdcLowerLimit = value;
	}

	/**
	 * Gets the value of the canRedeemProductWithBonus property.
	 * 
	 */
	public boolean isCanRedeemProductWithBonus() {
		return canRedeemProductWithBonus;
	}

	/**
	 * Sets the value of the canRedeemProductWithBonus property.
	 * 
	 */
	public void setCanRedeemProductWithBonus(boolean value) {
		this.canRedeemProductWithBonus = value;
	}

	/**
	 * Gets the value of the noMultipleInstallmentPayed property.
	 * 
	 */
	public int getNoMultipleInstallmentPayed() {
		return noMultipleInstallmentPayed;
	}

	/**
	 * Sets the value of the noMultipleInstallmentPayed property.
	 * 
	 */
	public void setNoMultipleInstallmentPayed(int value) {
		this.noMultipleInstallmentPayed = value;
	}

	/**
	 * Gets the value of the noofDefault property.
	 * 
	 */
	public int getNoofDefault() {
		return noofDefault;
	}

	/**
	 * Sets the value of the noofDefault property.
	 * 
	 */
	public void setNoofDefault(int value) {
		this.noofDefault = value;
	}

	/**
	 * Gets the value of the noofLatePayment property.
	 * 
	 */
	public int getNoofLatePayment() {
		return noofLatePayment;
	}

	/**
	 * Sets the value of the noofLatePayment property.
	 * 
	 */
	public void setNoofLatePayment(int value) {
		this.noofLatePayment = value;
	}

	/**
	 * Gets the value of the noofDefaultUsed property.
	 * 
	 */
	public int getNoofDefaultUsed() {
		return noofDefaultUsed;
	}

	/**
	 * Sets the value of the noofDefaultUsed property.
	 * 
	 */
	public void setNoofDefaultUsed(int value) {
		this.noofDefaultUsed = value;
	}

	/**
	 * Gets the value of the noofLatePaymentUsed property.
	 * 
	 */
	public int getNoofLatePaymentUsed() {
		return noofLatePaymentUsed;
	}

	/**
	 * Sets the value of the noofLatePaymentUsed property.
	 * 
	 */
	public void setNoofLatePaymentUsed(int value) {
		this.noofLatePaymentUsed = value;
	}

	/**
	 * Gets the value of the openingNoofDefaultUsed property.
	 * 
	 */
	public int getOpeningNoofDefaultUsed() {
		return openingNoofDefaultUsed;
	}

	/**
	 * Sets the value of the openingNoofDefaultUsed property.
	 * 
	 */
	public void setOpeningNoofDefaultUsed(int value) {
		this.openingNoofDefaultUsed = value;
	}

	/**
	 * Gets the value of the openingNoofLatePaymentUsed property.
	 * 
	 */
	public int getOpeningNoofLatePaymentUsed() {
		return openingNoofLatePaymentUsed;
	}

	/**
	 * Sets the value of the openingNoofLatePaymentUsed property.
	 * 
	 */
	public void setOpeningNoofLatePaymentUsed(int value) {
		this.openingNoofLatePaymentUsed = value;
	}

	/**
	 * Gets the value of the minInstallmentsToAvailGift property.
	 * 
	 */
	public int getMinInstallmentsToAvailGift() {
		return minInstallmentsToAvailGift;
	}

	/**
	 * Sets the value of the minInstallmentsToAvailGift property.
	 * 
	 */
	public void setMinInstallmentsToAvailGift(int value) {
		this.minInstallmentsToAvailGift = value;
	}

	/**
	 * Gets the value of the percentOfInstallmentAsGift property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getPercentOfInstallmentAsGift() {
		return percentOfInstallmentAsGift;
	}

	/**
	 * Sets the value of the percentOfInstallmentAsGift property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setPercentOfInstallmentAsGift(BigDecimal value) {
		this.percentOfInstallmentAsGift = value;
	}

	/**
	 * Gets the value of the giftAmount property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getGiftAmount() {
		return giftAmount;
	}

	/**
	 * Sets the value of the giftAmount property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setGiftAmount(BigDecimal value) {
		this.giftAmount = value;
	}

	/**
	 * Gets the value of the isAutoBonus property.
	 * 
	 */
	public boolean isIsAutoBonus() {
		return isAutoBonus;
	}

	/**
	 * Sets the value of the isAutoBonus property.
	 * 
	 */
	public void setIsAutoBonus(boolean value) {
		this.isAutoBonus = value;
	}

	/**
	 * Gets the value of the transferredDateForBonus property.
	 * 
	 * @return possible object is {@link XMLGregorianCalendar }
	 * 
	 */
	public XMLGregorianCalendar getTransferredDateForBonus() {
		return transferredDateForBonus;
	}

	/**
	 * Sets the value of the transferredDateForBonus property.
	 * 
	 * @param value allowed object is {@link XMLGregorianCalendar }
	 * 
	 */
	public void setTransferredDateForBonus(XMLGregorianCalendar value) {
		this.transferredDateForBonus = value;
	}

	/**
	 * Gets the value of the openingTotalLatePaymentCharge property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getOpeningTotalLatePaymentCharge() {
		return openingTotalLatePaymentCharge;
	}

	/**
	 * Sets the value of the openingTotalLatePaymentCharge property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setOpeningTotalLatePaymentCharge(BigDecimal value) {
		this.openingTotalLatePaymentCharge = value;
	}

	/**
	 * Gets the value of the openingTotalChequeRelatedCharge property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getOpeningTotalChequeRelatedCharge() {
		return openingTotalChequeRelatedCharge;
	}

	/**
	 * Sets the value of the openingTotalChequeRelatedCharge property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setOpeningTotalChequeRelatedCharge(BigDecimal value) {
		this.openingTotalChequeRelatedCharge = value;
	}

	/**
	 * Gets the value of the noDaysManualBillCanBeRegularized property.
	 * 
	 */
	public int getNoDaysManualBillCanBeRegularized() {
		return noDaysManualBillCanBeRegularized;
	}

	/**
	 * Sets the value of the noDaysManualBillCanBeRegularized property.
	 * 
	 */
	public void setNoDaysManualBillCanBeRegularized(int value) {
		this.noDaysManualBillCanBeRegularized = value;
	}

	/**
	 * Gets the value of the lastAccountSuspendedDate property.
	 * 
	 * @return possible object is {@link XMLGregorianCalendar }
	 * 
	 */
	public XMLGregorianCalendar getLastAccountSuspendedDate() {
		return lastAccountSuspendedDate;
	}

	/**
	 * Sets the value of the lastAccountSuspendedDate property.
	 * 
	 * @param value allowed object is {@link XMLGregorianCalendar }
	 * 
	 */
	public void setLastAccountSuspendedDate(XMLGregorianCalendar value) {
		this.lastAccountSuspendedDate = value;
	}

	/**
	 * Gets the value of the lastAccountActivatedDate property.
	 * 
	 * @return possible object is {@link XMLGregorianCalendar }
	 * 
	 */
	public XMLGregorianCalendar getLastAccountActivatedDate() {
		return lastAccountActivatedDate;
	}

	/**
	 * Sets the value of the lastAccountActivatedDate property.
	 * 
	 * @param value allowed object is {@link XMLGregorianCalendar }
	 * 
	 */
	public void setLastAccountActivatedDate(XMLGregorianCalendar value) {
		this.lastAccountActivatedDate = value;
	}

	/**
	 * Gets the value of the lockingPeriodForGrammageAccount property.
	 * 
	 */
	public int getLockingPeriodForGrammageAccount() {
		return lockingPeriodForGrammageAccount;
	}

	/**
	 * Sets the value of the lockingPeriodForGrammageAccount property.
	 * 
	 */
	public void setLockingPeriodForGrammageAccount(int value) {
		this.lockingPeriodForGrammageAccount = value;
	}

	/**
	 * Gets the value of the installmentsToBePaidForGrammageAccount property.
	 * 
	 */
	public int getInstallmentsToBePaidForGrammageAccount() {
		return installmentsToBePaidForGrammageAccount;
	}

	/**
	 * Sets the value of the installmentsToBePaidForGrammageAccount property.
	 * 
	 */
	public void setInstallmentsToBePaidForGrammageAccount(int value) {
		this.installmentsToBePaidForGrammageAccount = value;
	}

	/**
	 * Gets the value of the isCancelAccount property.
	 * 
	 */
	public boolean isIsCancelAccount() {
		return isCancelAccount;
	}

	/**
	 * Sets the value of the isCancelAccount property.
	 * 
	 */
	public void setIsCancelAccount(boolean value) {
		this.isCancelAccount = value;
	}

	/**
	 * Gets the value of the requestStatus property.
	 * 
	 */
	public int getRequestStatus() {
		return requestStatus;
	}

	/**
	 * Sets the value of the requestStatus property.
	 * 
	 */
	public void setRequestStatus(int value) {
		this.requestStatus = value;
	}

	/**
	 * Gets the value of the refundRequestRemarks property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getRefundRequestRemarks() {
		return refundRequestRemarks;
	}

	/**
	 * Sets the value of the refundRequestRemarks property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setRefundRequestRemarks(String value) {
		this.refundRequestRemarks = value;
	}

	/**
	 * Gets the value of the refundStatusChageRemarks property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getRefundStatusChageRemarks() {
		return refundStatusChageRemarks;
	}

	/**
	 * Sets the value of the refundStatusChageRemarks property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setRefundStatusChageRemarks(String value) {
		this.refundStatusChageRemarks = value;
	}

	/**
	 * Gets the value of the maturedRefDocType property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getMaturedRefDocType() {
		return maturedRefDocType;
	}

	/**
	 * Sets the value of the maturedRefDocType property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setMaturedRefDocType(String value) {
		this.maturedRefDocType = value;
	}

	/**
	 * Gets the value of the maturedRefDocNo property.
	 * 
	 */
	public int getMaturedRefDocNo() {
		return maturedRefDocNo;
	}

	/**
	 * Sets the value of the maturedRefDocNo property.
	 * 
	 */
	public void setMaturedRefDocNo(int value) {
		this.maturedRefDocNo = value;
	}

	/**
	 * Gets the value of the maturedRefFiscalYear property.
	 * 
	 */
	public int getMaturedRefFiscalYear() {
		return maturedRefFiscalYear;
	}

	/**
	 * Sets the value of the maturedRefFiscalYear property.
	 * 
	 */
	public void setMaturedRefFiscalYear(int value) {
		this.maturedRefFiscalYear = value;
	}

	/**
	 * Gets the value of the preOpenningInstallmentAmount property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getPreOpenningInstallmentAmount() {
		return preOpenningInstallmentAmount;
	}

	/**
	 * Sets the value of the preOpenningInstallmentAmount property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setPreOpenningInstallmentAmount(BigDecimal value) {
		this.preOpenningInstallmentAmount = value;
	}

	/**
	 * Gets the value of the preOpenningGoldWeight property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getPreOpenningGoldWeight() {
		return preOpenningGoldWeight;
	}

	/**
	 * Sets the value of the preOpenningGoldWeight property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setPreOpenningGoldWeight(BigDecimal value) {
		this.preOpenningGoldWeight = value;
	}

	/**
	 * Gets the value of the isReceivedPartialGrammage property.
	 * 
	 */
	public boolean isIsReceivedPartialGrammage() {
		return isReceivedPartialGrammage;
	}

	/**
	 * Sets the value of the isReceivedPartialGrammage property.
	 * 
	 */
	public void setIsReceivedPartialGrammage(boolean value) {
		this.isReceivedPartialGrammage = value;
	}

	/**
	 * Gets the value of the totalCashCollected property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getTotalCashCollected() {
		return totalCashCollected;
	}

	/**
	 * Sets the value of the totalCashCollected property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setTotalCashCollected(BigDecimal value) {
		this.totalCashCollected = value;
	}

	/**
	 * Gets the value of the accountCreatedAt property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getAccountCreatedAt() {
		return accountCreatedAt;
	}

	/**
	 * Sets the value of the accountCreatedAt property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setAccountCreatedAt(String value) {
		this.accountCreatedAt = value;
	}

	/**
	 * Gets the value of the maturityLocationCode property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getMaturityLocationCode() {
		return maturityLocationCode;
	}

	/**
	 * Sets the value of the maturityLocationCode property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setMaturityLocationCode(String value) {
		this.maturityLocationCode = value;
	}

	/**
	 * Gets the value of the utilizationPercentage property.
	 * 
	 * @return possible object is {@link BigDecimal }
	 * 
	 */
	public BigDecimal getUtilizationPercentage() {
		return utilizationPercentage;
	}

	/**
	 * Sets the value of the utilizationPercentage property.
	 * 
	 * @param value allowed object is {@link BigDecimal }
	 * 
	 */
	public void setUtilizationPercentage(BigDecimal value) {
		this.utilizationPercentage = value;
	}

	/**
	 * Gets the value of the noOfMonthsToBlockOrder property.
	 * 
	 */
	public int getNoOfMonthsToBlockOrder() {
		return noOfMonthsToBlockOrder;
	}

	/**
	 * Sets the value of the noOfMonthsToBlockOrder property.
	 * 
	 */
	public void setNoOfMonthsToBlockOrder(int value) {
		this.noOfMonthsToBlockOrder = value;
	}

	/**
	 * Gets the value of the minorName property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getMinorName() {
		return minorName;
	}

	/**
	 * Sets the value of the minorName property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setMinorName(String value) {
		this.minorName = value;
	}

	/**
	 * Gets the value of the minorDOB property.
	 * 
	 * @return possible object is {@link XMLGregorianCalendar }
	 * 
	 */
	public XMLGregorianCalendar getMinorDOB() {
		return minorDOB;
	}

	/**
	 * Sets the value of the minorDOB property.
	 * 
	 * @param value allowed object is {@link XMLGregorianCalendar }
	 * 
	 */
	public void setMinorDOB(XMLGregorianCalendar value) {
		this.minorDOB = value;
	}

	/**
	 * Gets the value of the minorMobileNo property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getMinorMobileNo() {
		return minorMobileNo;
	}

	/**
	 * Sets the value of the minorMobileNo property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setMinorMobileNo(String value) {
		this.minorMobileNo = value;
	}

	/**
	 * Gets the value of the minorRelationShip property.
	 * 
	 * @return possible object is {@link String }
	 * 
	 */
	public String getMinorRelationShip() {
		return minorRelationShip;
	}

	/**
	 * Sets the value of the minorRelationShip property.
	 * 
	 * @param value allowed object is {@link String }
	 * 
	 */
	public void setMinorRelationShip(String value) {
		this.minorRelationShip = value;
	}

	/**
	 * Gets the value of the isGHSAPIOTPEnable property.
	 * 
	 */
	public boolean isIsGHSAPIOTPEnable() {
		return isGHSAPIOTPEnable;
	}

	/**
	 * Sets the value of the isGHSAPIOTPEnable property.
	 * 
	 */
	public void setIsGHSAPIOTPEnable(boolean value) {
		this.isGHSAPIOTPEnable = value;
	}

	/**
	 * Gets the value of the noOfDaysToBlockinCustomerOrder property.
	 * 
	 */
	public int getNoOfDaysToBlockinCustomerOrder() {
		return noOfDaysToBlockinCustomerOrder;
	}

	/**
	 * Sets the value of the noOfDaysToBlockinCustomerOrder property.
	 * 
	 */
	public void setNoOfDaysToBlockinCustomerOrder(int value) {
		this.noOfDaysToBlockinCustomerOrder = value;
	}

	/**
	 * Gets the value of the noOfDaysToBlockinAdvanceBooking property.
	 * 
	 */
	public int getNoOfDaysToBlockinAdvanceBooking() {
		return noOfDaysToBlockinAdvanceBooking;
	}

	/**
	 * Sets the value of the noOfDaysToBlockinAdvanceBooking property.
	 * 
	 */
	public void setNoOfDaysToBlockinAdvanceBooking(int value) {
		this.noOfDaysToBlockinAdvanceBooking = value;
	}

	/**
	 * Gets the value of the discountMC property.
	 * 
	 */
	public int getDiscountMC() {
		return discountMC;
	}

	/**
	 * Sets the value of the discountMC property.
	 * 
	 */
	public void setDiscountMC(int value) {
		this.discountMC = value;
	}

	/**
	 * Gets the value of the discountUCP property.
	 * 
	 */
	public int getDiscountUCP() {
		return discountUCP;
	}

	/**
	 * Sets the value of the discountUCP property.
	 * 
	 */
	public void setDiscountUCP(int value) {
		this.discountUCP = value;
	}

}
