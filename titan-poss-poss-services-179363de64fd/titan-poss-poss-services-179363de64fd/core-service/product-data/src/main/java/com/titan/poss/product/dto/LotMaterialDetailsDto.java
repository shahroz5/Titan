package com.titan.poss.product.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.LotMaterialDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsIdDao;
import com.titan.poss.product.dao.MaterialDao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LotMaterialDetailsDto {
	
	private String lotNumber;

	private String itemCode;

	private Integer lineItemNo;

	private String materialCode;

	private BigDecimal materialWeight;

	private Integer noOfMaterials;

	private String correlationId;
	
	private String weightUnit;
	
	private String createdBy;
	
	private Date createdDate;
	
	private String lastModifiedBy;
	
	private Date lastModifiedDate;
	
	
	public LotMaterialDetailsDto(MaterialDao material,LotMaterialDetailsIdDao lotMaterialDetailsIdDao) {
		MapperUtil.getObjectMapping(material, this);
		this.setMaterialCode(material.getMaterialCode());
		MapperUtil.getObjectMapping(lotMaterialDetailsIdDao, this);
		this.setLotNumber(lotMaterialDetailsIdDao.getLotNumber());
		this.setItemCode(lotMaterialDetailsIdDao.getItem().getItemCode());
		this.setLineItemNo(lotMaterialDetailsIdDao.getLineItemNo());
		
	}

	public LotMaterialDetailsDto(LotMaterialDetailsDao getLotMaterialDetails) {
		// TODO Auto-generated constructor stub
		MapperUtil.getObjectMapping(getLotMaterialDetails, this);
		this.setMaterialCode(getLotMaterialDetails.getMaterial().getMaterialCode());
		MapperUtil.getObjectMapping(getLotMaterialDetails, this);
		this.setLotNumber(getLotMaterialDetails.getLotDetailsId().getLotNumber());
		this.setItemCode(getLotMaterialDetails.getLotDetailsId().getItem().getItemCode());
		this.setLineItemNo(getLotMaterialDetails.getLotDetailsId().getLineItemNo());
		
	}


}
