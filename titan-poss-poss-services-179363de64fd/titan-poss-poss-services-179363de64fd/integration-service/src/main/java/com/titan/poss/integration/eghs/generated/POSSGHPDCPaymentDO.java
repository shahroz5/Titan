
package com.titan.poss.integration.eghs.generated;

import java.math.BigDecimal;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for POSS_GH_PDC_PaymentDO complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="POSS_GH_PDC_PaymentDO"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="InstallmentNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="ECSCycleDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="ECSInstallmentDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="PaymentCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="EmployeeId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="LineItemNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="CreatedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="DocDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="CustomerNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="DocNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="ChequeNo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="FiscalYear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="ChequeUtilizationDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="Amount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="CancellationDocNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="LastModifiedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="LastModifiedID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="LocationCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="LoginID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="NoofPrintsCancellation" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="RefAccountCodeFiscalYear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="RefGHAccountDocNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="ReasonForCancellation" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="NoofPrintsPDCAcknowledgement" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Status" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="CancellationDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="BankName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "POSS_GH_PDC_PaymentDO", propOrder = {
    "installmentNo",
    "ecsCycleDate",
    "ecsInstallmentDate",
    "paymentCode",
    "employeeId",
    "lineItemNo",
    "createdDate",
    "docDate",
    "customerNo",
    "docNo",
    "chequeNo",
    "fiscalYear",
    "chequeUtilizationDate",
    "amount",
    "cancellationDocNo",
    "lastModifiedDate",
    "lastModifiedID",
    "locationCode",
    "loginID",
    "noofPrintsCancellation",
    "refAccountCodeFiscalYear",
    "refGHAccountDocNo",
    "reasonForCancellation",
    "noofPrintsPDCAcknowledgement",
    "status",
    "cancellationDate",
    "bankName"
})
public class POSSGHPDCPaymentDO {

    @XmlElement(name = "InstallmentNo")
    protected int installmentNo;
    @XmlElement(name = "ECSCycleDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar ecsCycleDate;
    @XmlElement(name = "ECSInstallmentDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar ecsInstallmentDate;
    @XmlElement(name = "PaymentCode")
    protected String paymentCode;
    @XmlElement(name = "EmployeeId")
    protected String employeeId;
    @XmlElement(name = "LineItemNo")
    protected int lineItemNo;
    @XmlElement(name = "CreatedDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar createdDate;
    @XmlElement(name = "DocDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar docDate;
    @XmlElement(name = "CustomerNo")
    protected int customerNo;
    @XmlElement(name = "DocNo")
    protected int docNo;
    @XmlElement(name = "ChequeNo")
    protected String chequeNo;
    @XmlElement(name = "FiscalYear")
    protected int fiscalYear;
    @XmlElement(name = "ChequeUtilizationDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar chequeUtilizationDate;
    @XmlElement(name = "Amount", required = true)
    protected BigDecimal amount;
    @XmlElement(name = "CancellationDocNo")
    protected int cancellationDocNo;
    @XmlElement(name = "LastModifiedDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar lastModifiedDate;
    @XmlElement(name = "LastModifiedID")
    protected String lastModifiedID;
    @XmlElement(name = "LocationCode")
    protected String locationCode;
    @XmlElement(name = "LoginID")
    protected String loginID;
    @XmlElement(name = "NoofPrintsCancellation")
    protected int noofPrintsCancellation;
    @XmlElement(name = "RefAccountCodeFiscalYear")
    protected int refAccountCodeFiscalYear;
    @XmlElement(name = "RefGHAccountDocNo")
    protected int refGHAccountDocNo;
    @XmlElement(name = "ReasonForCancellation")
    protected String reasonForCancellation;
    @XmlElement(name = "NoofPrintsPDCAcknowledgement")
    protected int noofPrintsPDCAcknowledgement;
    @XmlElement(name = "Status")
    protected int status;
    @XmlElement(name = "CancellationDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar cancellationDate;
    @XmlElement(name = "BankName")
    protected String bankName;

    /**
     * Gets the value of the installmentNo property.
     * 
     */
    public int getInstallmentNo() {
        return installmentNo;
    }

    /**
     * Sets the value of the installmentNo property.
     * 
     */
    public void setInstallmentNo(int value) {
        this.installmentNo = value;
    }

    /**
     * Gets the value of the ecsCycleDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getECSCycleDate() {
        return ecsCycleDate;
    }

    /**
     * Sets the value of the ecsCycleDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setECSCycleDate(XMLGregorianCalendar value) {
        this.ecsCycleDate = value;
    }

    /**
     * Gets the value of the ecsInstallmentDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getECSInstallmentDate() {
        return ecsInstallmentDate;
    }

    /**
     * Sets the value of the ecsInstallmentDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setECSInstallmentDate(XMLGregorianCalendar value) {
        this.ecsInstallmentDate = value;
    }

    /**
     * Gets the value of the paymentCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPaymentCode() {
        return paymentCode;
    }

    /**
     * Sets the value of the paymentCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPaymentCode(String value) {
        this.paymentCode = value;
    }

    /**
     * Gets the value of the employeeId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEmployeeId() {
        return employeeId;
    }

    /**
     * Sets the value of the employeeId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEmployeeId(String value) {
        this.employeeId = value;
    }

    /**
     * Gets the value of the lineItemNo property.
     * 
     */
    public int getLineItemNo() {
        return lineItemNo;
    }

    /**
     * Sets the value of the lineItemNo property.
     * 
     */
    public void setLineItemNo(int value) {
        this.lineItemNo = value;
    }

    /**
     * Gets the value of the createdDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getCreatedDate() {
        return createdDate;
    }

    /**
     * Sets the value of the createdDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setCreatedDate(XMLGregorianCalendar value) {
        this.createdDate = value;
    }

    /**
     * Gets the value of the docDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getDocDate() {
        return docDate;
    }

    /**
     * Sets the value of the docDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setDocDate(XMLGregorianCalendar value) {
        this.docDate = value;
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
     * Gets the value of the chequeNo property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getChequeNo() {
        return chequeNo;
    }

    /**
     * Sets the value of the chequeNo property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setChequeNo(String value) {
        this.chequeNo = value;
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
     * Gets the value of the chequeUtilizationDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getChequeUtilizationDate() {
        return chequeUtilizationDate;
    }

    /**
     * Sets the value of the chequeUtilizationDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setChequeUtilizationDate(XMLGregorianCalendar value) {
        this.chequeUtilizationDate = value;
    }

    /**
     * Gets the value of the amount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getAmount() {
        return amount;
    }

    /**
     * Sets the value of the amount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setAmount(BigDecimal value) {
        this.amount = value;
    }

    /**
     * Gets the value of the cancellationDocNo property.
     * 
     */
    public int getCancellationDocNo() {
        return cancellationDocNo;
    }

    /**
     * Sets the value of the cancellationDocNo property.
     * 
     */
    public void setCancellationDocNo(int value) {
        this.cancellationDocNo = value;
    }

    /**
     * Gets the value of the lastModifiedDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getLastModifiedDate() {
        return lastModifiedDate;
    }

    /**
     * Sets the value of the lastModifiedDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setLastModifiedDate(XMLGregorianCalendar value) {
        this.lastModifiedDate = value;
    }

    /**
     * Gets the value of the lastModifiedID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLastModifiedID() {
        return lastModifiedID;
    }

    /**
     * Sets the value of the lastModifiedID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLastModifiedID(String value) {
        this.lastModifiedID = value;
    }

    /**
     * Gets the value of the locationCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLocationCode() {
        return locationCode;
    }

    /**
     * Sets the value of the locationCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLocationCode(String value) {
        this.locationCode = value;
    }

    /**
     * Gets the value of the loginID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLoginID() {
        return loginID;
    }

    /**
     * Sets the value of the loginID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLoginID(String value) {
        this.loginID = value;
    }

    /**
     * Gets the value of the noofPrintsCancellation property.
     * 
     */
    public int getNoofPrintsCancellation() {
        return noofPrintsCancellation;
    }

    /**
     * Sets the value of the noofPrintsCancellation property.
     * 
     */
    public void setNoofPrintsCancellation(int value) {
        this.noofPrintsCancellation = value;
    }

    /**
     * Gets the value of the refAccountCodeFiscalYear property.
     * 
     */
    public int getRefAccountCodeFiscalYear() {
        return refAccountCodeFiscalYear;
    }

    /**
     * Sets the value of the refAccountCodeFiscalYear property.
     * 
     */
    public void setRefAccountCodeFiscalYear(int value) {
        this.refAccountCodeFiscalYear = value;
    }

    /**
     * Gets the value of the refGHAccountDocNo property.
     * 
     */
    public int getRefGHAccountDocNo() {
        return refGHAccountDocNo;
    }

    /**
     * Sets the value of the refGHAccountDocNo property.
     * 
     */
    public void setRefGHAccountDocNo(int value) {
        this.refGHAccountDocNo = value;
    }

    /**
     * Gets the value of the reasonForCancellation property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getReasonForCancellation() {
        return reasonForCancellation;
    }

    /**
     * Sets the value of the reasonForCancellation property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReasonForCancellation(String value) {
        this.reasonForCancellation = value;
    }

    /**
     * Gets the value of the noofPrintsPDCAcknowledgement property.
     * 
     */
    public int getNoofPrintsPDCAcknowledgement() {
        return noofPrintsPDCAcknowledgement;
    }

    /**
     * Sets the value of the noofPrintsPDCAcknowledgement property.
     * 
     */
    public void setNoofPrintsPDCAcknowledgement(int value) {
        this.noofPrintsPDCAcknowledgement = value;
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
     * Gets the value of the cancellationDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getCancellationDate() {
        return cancellationDate;
    }

    /**
     * Sets the value of the cancellationDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setCancellationDate(XMLGregorianCalendar value) {
        this.cancellationDate = value;
    }

    /**
     * Gets the value of the bankName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBankName() {
        return bankName;
    }

    /**
     * Sets the value of the bankName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBankName(String value) {
        this.bankName = value;
    }

}
