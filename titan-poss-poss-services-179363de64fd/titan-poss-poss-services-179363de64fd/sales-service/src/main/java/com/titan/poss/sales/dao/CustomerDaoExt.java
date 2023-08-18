/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.SQLDelete;

import com.titan.poss.sales.dao.base.BaseCustomer;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>customer_master</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "SalesCustomerMaster")
@Table(name = "customer_master")
@EqualsAndHashCode(callSuper = false)
@SQLDelete(sql = "UPDATE customer_master SET is_active = 0 WHERE id = ?")
public class CustomerDaoExt extends BaseCustomer implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier", updatable = false)
	private String id;

	@Override
	public String toString() {
		return "CustomerDaoExt [id=" + id + ", ulpid=" + getUlpId() + ", mobileno=" + getMobileNumber()
				+ ", customertype=" + getCustomerType() + ", title=" + getTitle() + ", name=" + getCustomerName()
				+ ", emailid=" + getEmailId() + ", customerDetails=" + getCustomerDetails() + ", isEncrypted="
				+ getIsEncrypted() + ", getInstiTaxNo()=" + getInstiTaxNo() + ", getCustTaxNo()=" + getCustTaxNo()
				+ ", getPassportId()=" + getPassportId() + ", getIsActive()=" + getIsActive() + ", getCreatedBy()=" + getCreatedBy() + ", getCreatedDate()=" + getCreatedDate()
				+ ", getLastModifiedBy()=" + getLastModifiedBy() + ", getLastModifiedDate()=" + getLastModifiedDate()
				+ ", getClass()=" + getClass() + "]";
	}

}
