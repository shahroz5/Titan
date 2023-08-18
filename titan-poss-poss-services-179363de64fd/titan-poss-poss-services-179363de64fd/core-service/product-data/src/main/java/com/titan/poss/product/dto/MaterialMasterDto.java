package com.titan.poss.product.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.MaterialDao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialMasterDto {
	private String materialCode;

	private String materialTypeCode;

	private BigDecimal stdValue;

	private BigDecimal stdWeight;

	private BigDecimal ratePerGram;

	private String color;

	private String quality;

	private String shape;

	private String weightUnit;

	private String currencyCode;

	private String configDetails;

	private Boolean isActive;
	
	private String createdBy;
	
	private Date createdDate;
	
	private String lastModifiedBy;
	
	private Date lastModifiedDate;
	
	public MaterialMasterDto(MaterialDao getMaterialMaster) {
		MapperUtil.getObjectMapping(getMaterialMaster, this);
		this.setMaterialTypeCode(getMaterialMaster.getMaterialType().getMaterialTypeCode());	
	}

}
