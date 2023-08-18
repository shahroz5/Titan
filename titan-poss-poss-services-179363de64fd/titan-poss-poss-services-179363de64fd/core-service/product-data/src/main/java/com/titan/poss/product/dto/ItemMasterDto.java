package com.titan.poss.product.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ItemDao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemMasterDto {
	
	private String itemCode;
	
	private String description;

	private BigDecimal stdWeight;

	private BigDecimal stdValue;

	private String complexityCode;
	
	private String productGroupCode;
	
	private String productCategoryCode;
	
	private String brandCode;
	
	private String itemTypeCode;
	
	private Integer leadTime;
	
	private String orgCode;
	
	private String parentItemCode;
	
	private String itemDetails;
	
	private String configDetails;
	
	private Boolean isEditable;
	
	private String taxClassCode;
	
	private String pricingType;
	
	private String pricingGroupType;
	
	private BigDecimal purity;
	
	private BigDecimal karat;
	
	private BigDecimal stoneCharges;
	
	private String currencyCode;
	
	private String weightUnit;
	
	private BigDecimal priceFactor;
	
	private Boolean isFocItem;
	
	private String correlationId;
	
	private Boolean isSaleable;
	
	private Boolean isReturnable;
	
	private String hsnSacCode;
	
	private BigDecimal stoneWeight;
	
	private BigDecimal diamondCaratage;
	
	private String diamondColor;
	
	private String diamondClarity;
	
	private String stoneCombination;
	
	private String productType;
	
	private String totCategory;
	
	private String createdBy;
	
	private Date createdDate;
	
	private String lastModifiedBy;
	
	private Date lastModifiedDate;
	
	private Integer destSyncId;
	
	private Integer srcSyncId;
	
	public Boolean isActive;
	
	public Boolean isDummyCode; 

   public ItemMasterDto(ItemDao item) {
	   MapperUtil.getObjectMapping(item, this);
	   this.setProductGroupCode(item.getProductGroup().getProductGroupCode());
	   this.setProductCategoryCode(item.getProductCategory().getProductCategoryCode());
	   this.setComplexityCode(item.getComplexity().getComplexityCode());
	   this.setItemTypeCode(item.getItemType().getItemTypeCode());
	   if(item.getParentItem() != null) {
		   this.setParentItemCode(item.getParentItem().getItemCode());		   
	   }
	   
   }
	

}
