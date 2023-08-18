
package com.titan.poss.integration.eghs.generated;

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
 *         &lt;element name="intGHSDocNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="blnCanPrintCoverPg" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="IsReprint" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="ReprintFrom" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
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
    "intGHSDocNo",
    "blnCanPrintCoverPg",
    "isReprint",
    "reprintFrom"
})
@XmlRootElement(name = "PassBookPrint")
public class PassBookPrint {

    protected int intGHSDocNo;
    protected boolean blnCanPrintCoverPg;
    @XmlElement(name = "IsReprint")
    protected boolean isReprint;
    @XmlElement(name = "ReprintFrom", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar reprintFrom;

    /**
     * Gets the value of the intGHSDocNo property.
     * 
     */
    public int getIntGHSDocNo() {
        return intGHSDocNo;
    }

    /**
     * Sets the value of the intGHSDocNo property.
     * 
     */
    public void setIntGHSDocNo(int value) {
        this.intGHSDocNo = value;
    }

    /**
     * Gets the value of the blnCanPrintCoverPg property.
     * 
     */
    public boolean isBlnCanPrintCoverPg() {
        return blnCanPrintCoverPg;
    }

    /**
     * Sets the value of the blnCanPrintCoverPg property.
     * 
     */
    public void setBlnCanPrintCoverPg(boolean value) {
        this.blnCanPrintCoverPg = value;
    }

    /**
     * Gets the value of the isReprint property.
     * 
     */
    public boolean isIsReprint() {
        return isReprint;
    }

    /**
     * Sets the value of the isReprint property.
     * 
     */
    public void setIsReprint(boolean value) {
        this.isReprint = value;
    }

    /**
     * Gets the value of the reprintFrom property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getReprintFrom() {
        return reprintFrom;
    }

    /**
     * Sets the value of the reprintFrom property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setReprintFrom(XMLGregorianCalendar value) {
        this.reprintFrom = value;
    }

}
