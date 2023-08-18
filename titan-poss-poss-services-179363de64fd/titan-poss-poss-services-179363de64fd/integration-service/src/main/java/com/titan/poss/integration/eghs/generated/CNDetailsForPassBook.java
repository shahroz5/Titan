
package com.titan.poss.integration.eghs.generated;

import java.math.BigDecimal;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="maturedRefDocNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="maturedRefFiscalYear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="maturedRefDocType" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="isNewCN" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="ghsBonus" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="CNdocNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="CNfiscalYear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="amount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="ghsAccNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="ghsFiscalYear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="ghsLocationCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="maturedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "maturedRefDocNo",
    "maturedRefFiscalYear",
    "maturedRefDocType",
    "isNewCN",
    "ghsBonus",
    "cNdocNo",
    "cNfiscalYear",
    "amount",
    "ghsAccNo",
    "ghsFiscalYear",
    "ghsLocationCode",
    "maturedDate"
})
@XmlRootElement(name = "CNDetailsForPassBook")
public class CNDetailsForPassBook {

    protected int maturedRefDocNo;
    protected int maturedRefFiscalYear;
    protected String maturedRefDocType;
    protected boolean isNewCN;
    @XmlElement(required = true)
    protected BigDecimal ghsBonus;
    @XmlElement(name = "CNdocNo")
    protected int cNdocNo;
    @XmlElement(name = "CNfiscalYear")
    protected int cNfiscalYear;
    @XmlElement(required = true)
    protected BigDecimal amount;
    protected int ghsAccNo;
    protected int ghsFiscalYear;
    protected String ghsLocationCode;
    @XmlElement(required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar maturedDate;

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
     * Gets the value of the maturedRefDocType property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMaturedRefDocType() {
        return maturedRefDocType;
    }

    /**
     * Sets the value of the maturedRefDocType property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMaturedRefDocType(String value) {
        this.maturedRefDocType = value;
    }

    /**
     * Gets the value of the isNewCN property.
     * 
     */
    public boolean isIsNewCN() {
        return isNewCN;
    }

    /**
     * Sets the value of the isNewCN property.
     * 
     */
    public void setIsNewCN(boolean value) {
        this.isNewCN = value;
    }

    /**
     * Gets the value of the ghsBonus property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getGhsBonus() {
        return ghsBonus;
    }

    /**
     * Sets the value of the ghsBonus property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setGhsBonus(BigDecimal value) {
        this.ghsBonus = value;
    }

    /**
     * Gets the value of the cNdocNo property.
     * 
     */
    public int getCNdocNo() {
        return cNdocNo;
    }

    /**
     * Sets the value of the cNdocNo property.
     * 
     */
    public void setCNdocNo(int value) {
        this.cNdocNo = value;
    }

    /**
     * Gets the value of the cNfiscalYear property.
     * 
     */
    public int getCNfiscalYear() {
        return cNfiscalYear;
    }

    /**
     * Sets the value of the cNfiscalYear property.
     * 
     */
    public void setCNfiscalYear(int value) {
        this.cNfiscalYear = value;
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
     * Gets the value of the ghsAccNo property.
     * 
     */
    public int getGhsAccNo() {
        return ghsAccNo;
    }

    /**
     * Sets the value of the ghsAccNo property.
     * 
     */
    public void setGhsAccNo(int value) {
        this.ghsAccNo = value;
    }

    /**
     * Gets the value of the ghsFiscalYear property.
     * 
     */
    public int getGhsFiscalYear() {
        return ghsFiscalYear;
    }

    /**
     * Sets the value of the ghsFiscalYear property.
     * 
     */
    public void setGhsFiscalYear(int value) {
        this.ghsFiscalYear = value;
    }

    /**
     * Gets the value of the ghsLocationCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGhsLocationCode() {
        return ghsLocationCode;
    }

    /**
     * Sets the value of the ghsLocationCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGhsLocationCode(String value) {
        this.ghsLocationCode = value;
    }

    /**
     * Gets the value of the maturedDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getMaturedDate() {
        return maturedDate;
    }

    /**
     * Sets the value of the maturedDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setMaturedDate(XMLGregorianCalendar value) {
        this.maturedDate = value;
    }

}
