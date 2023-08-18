package com.titan.poss.sales.dao;

import java.io.Serializable;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.AuditableEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bintobin_file_stage")
@EqualsAndHashCode(callSuper = false)
public class BinToBinFileStageDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(name = "file_name")
	private String fileName;
	
	@Column(name = "location_code")
	private String locationCode;
	
	@Column(name = "user_id")
	private String userId;
	
	@Column(name = "status")
	private String status;
}
