/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.report.dao;

import com.titan.poss.core.dao.AuditableEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@Entity
@Table(name = "report_role_mapping")
@EqualsAndHashCode(callSuper = false)
public class ReportRoleMappingDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "role_code")
	private String roleCode;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "report_master_id")
	private ReportMasterDao reportMaster;

	@Column(name = "from_access_time")
	private String fromAccessTime;

	@Column(name = "to_access_time")
	private String toAccessTime;

}
