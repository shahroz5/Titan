package com.titan.poss.payment.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@Table(name = "employee_payment_config")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
@Entity
public class EmployeePaymentConfigDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier", updatable = false)
	String id;

	@Column(name = "approval_date")
	@Temporal(TemporalType.TIMESTAMP)
	Date approvalDate;

	@Column(name = "employee_code", columnDefinition = "NVARCHAR")
	String employeeCode;

	@Column(name = "eligible_amount", columnDefinition = "DECIMAL")
	BigDecimal eligibleAmount;

	@Column(name = "expiry_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date validityDate;

	@Column(name = "document_details", columnDefinition = "NVARCHAR")
	String documentDetails;

	@Column(name = "employee_details", columnDefinition = "NVARCHAR")
	String employeeDetails;

	@Column(name = "status", columnDefinition = "NVARCHAR")
	String status;

	@Column(name = "config_type", columnDefinition = "NVARCHAR")
	String config_type;

	@Column(name = "redeemed_amount", columnDefinition = "DECIMAL")
	BigDecimal redeemedAmount;

	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

}
