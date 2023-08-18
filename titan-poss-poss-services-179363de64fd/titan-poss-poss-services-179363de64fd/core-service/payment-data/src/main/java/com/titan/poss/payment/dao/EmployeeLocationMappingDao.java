package com.titan.poss.payment.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Table(name="employee_location_mapping")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
@NoArgsConstructor
@Entity
public class EmployeeLocationMappingDao extends AuditableEntity  implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee_id", referencedColumnName = "id")
	 EmployeePaymentConfigDao employeePaymentConfig;
	
	@NotNull
	@Column(name = "location_code", columnDefinition = "NVARCHAR")
	String locationCode;
	
	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;
	
	@Column(name = "loan_config_details", columnDefinition = "NVARCHAR")
	String loanConfigDetails;
}
