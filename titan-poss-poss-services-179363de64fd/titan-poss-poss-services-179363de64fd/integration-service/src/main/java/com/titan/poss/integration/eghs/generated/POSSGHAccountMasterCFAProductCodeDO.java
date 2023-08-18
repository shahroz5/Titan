
package com.titan.poss.integration.eghs.generated;

import java.math.BigDecimal;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for POSS_GH_Account_Master_CFA_ProductCodeDO complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="POSS_GH_Account_Master_CFA_ProductCodeDO"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="DocNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="FiscalYear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="LocationCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="CFA_ProductCodeDescription" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="CFA_ProductCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Bonus_percentage" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="CFA_ProductCode_Selected" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="IsActive" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "POSS_GH_Account_Master_CFA_ProductCodeDO", propOrder = {
    "docNo",
    "fiscalYear",
    "locationCode",
    "cfaProductCodeDescription",
    "cfaProductCode",
    "bonusPercentage",
    "cfaProductCodeSelected",
    "isActive"
})
public class POSSGHAccountMasterCFAProductCodeDO {

    @XmlElement(name = "DocNo")
    protected int docNo;
    @XmlElement(name = "FiscalYear")
    protected int fiscalYear;
    @XmlElement(name = "LocationCode")
    protected String locationCode;
    @XmlElement(name = "CFA_ProductCodeDescription")
    protected String cfaProductCodeDescription;
    @XmlElement(name = "CFA_ProductCode")
    protected String cfaProductCode;
    @XmlElement(name = "Bonus_percentage", required = true)
    protected BigDecimal bonusPercentage;
    @XmlElement(name = "CFA_ProductCode_Selected")
    protected boolean cfaProductCodeSelected;
    @XmlElement(name = "IsActive")
    protected boolean isActive;

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
     * Gets the value of the cfaProductCodeDescription property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCFAProductCodeDescription() {
        return cfaProductCodeDescription;
    }

    /**
     * Sets the value of the cfaProductCodeDescription property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCFAProductCodeDescription(String value) {
        this.cfaProductCodeDescription = value;
    }

    /**
     * Gets the value of the cfaProductCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCFAProductCode() {
        return cfaProductCode;
    }

    /**
     * Sets the value of the cfaProductCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCFAProductCode(String value) {
        this.cfaProductCode = value;
    }

    /**
     * Gets the value of the bonusPercentage property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getBonusPercentage() {
        return bonusPercentage;
    }

    /**
     * Sets the value of the bonusPercentage property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setBonusPercentage(BigDecimal value) {
        this.bonusPercentage = value;
    }

    /**
     * Gets the value of the cfaProductCodeSelected property.
     * 
     */
    public boolean isCFAProductCodeSelected() {
        return cfaProductCodeSelected;
    }

    /**
     * Sets the value of the cfaProductCodeSelected property.
     * 
     */
    public void setCFAProductCodeSelected(boolean value) {
        this.cfaProductCodeSelected = value;
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

}
