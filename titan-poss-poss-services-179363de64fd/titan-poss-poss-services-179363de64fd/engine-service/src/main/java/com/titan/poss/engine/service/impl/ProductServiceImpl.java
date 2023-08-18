/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.commons.lang.BooleanUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.CustomLotMasterDto;
import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.core.dto.ItemLiteDto;
import com.titan.poss.core.dto.ItemLotStoneBaseDto;
import com.titan.poss.core.dto.ItemSearchRequestDto;
import com.titan.poss.core.dto.ItemsDto;
import com.titan.poss.core.dto.KeyValueDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.ProductCategoryLiteDto;
import com.titan.poss.core.dto.ProductGroupLiteDto;
import com.titan.poss.core.enums.LotNumberType;
import com.titan.poss.core.enums.PlainStuddedEnum;
import com.titan.poss.core.enums.PricingTypeEnum;
import com.titan.poss.core.enums.ProductDocTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.URLUtil;
import com.titan.poss.engine.constant.EngineConstants;
import com.titan.poss.core.dto.StoneDetailsLiteDto;
import com.titan.poss.engine.dto.request.StoneSearchRequestDto;
import com.titan.poss.engine.dto.response.ItemLotStoneListDto;
import com.titan.poss.engine.dto.response.ItemTypeDto;
import com.titan.poss.engine.product.repository.ComplexityRepositoryExt;
import com.titan.poss.engine.product.repository.CustomLotRepositoryExt;
import com.titan.poss.engine.product.repository.ItemMaterialMappingRepositoryExt;
import com.titan.poss.engine.product.repository.ItemRepositoryExt;
import com.titan.poss.engine.product.repository.ItemStoneMappingRepositoryExt;
import com.titan.poss.engine.product.repository.ItemTypeRepositoryExt;
import com.titan.poss.engine.product.repository.LotDetailRepositoryExt;
import com.titan.poss.engine.product.repository.LotMaterialDetailsRepositoryExt;
import com.titan.poss.engine.product.repository.LovRepositoryExt;
import com.titan.poss.engine.product.repository.MaterialMasterRepositoryExt;
import com.titan.poss.engine.product.repository.ProductCategoryRepositoryExt;
import com.titan.poss.engine.product.repository.ProductGroupRepositoryExt;
import com.titan.poss.engine.product.repository.PurityRepositoryExt;
import com.titan.poss.engine.product.repository.StoneRepositoryExt;
import com.titan.poss.engine.service.IntegrationService;
import com.titan.poss.engine.service.ProductService;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.repository.LocationRepository;
import com.titan.poss.product.dao.ComplexityDao;
import com.titan.poss.product.dao.CustomLotDao;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ItemMaterialMappingDao;
import com.titan.poss.product.dao.ItemStoneMappingDao;
import com.titan.poss.product.dao.ItemTypeDao;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotDetailsIdDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsIdDao;
import com.titan.poss.product.dao.MaterialDao;
import com.titan.poss.product.dao.MaterialTypeDao;
import com.titan.poss.product.dao.ProdLovDao;
import com.titan.poss.product.dao.ProductCategoryDao;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.dao.StoneDao;
import com.titan.poss.product.dao.StoneTypeDao;
import com.titan.poss.product.dto.ComplexityDto;
import com.titan.poss.product.dto.ItemMasterDto;
import com.titan.poss.product.dto.ItemMaterialDto;
import com.titan.poss.product.dto.ItemStoneDetailsDto;
import com.titan.poss.product.dto.ItemStoneDto;
import com.titan.poss.product.dto.ItemStoneMappingDetailsDto;
import com.titan.poss.product.dto.LotMaterialDetailsDto;
import com.titan.poss.product.dto.LotStoneDetailsDto;
import com.titan.poss.product.dto.MaterialMasterDto;
import com.titan.poss.product.dto.PurityDto;
import com.titan.poss.product.dto.StoneDto;
import com.titan.poss.product.dto.StoneMasterDto;







/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("engineProductService")
public class ProductServiceImpl implements ProductService {

	public static final String PRODUCT_CATEGORY_DATA = "productCategoryList";

	@Autowired
	private ItemRepositoryExt itemDaoRepository;

	@Autowired
	private StoneRepositoryExt stoneRepository;

	@Autowired
	private ProductCategoryRepositoryExt productCategoryRepository;

	@Autowired
	private ProductGroupRepositoryExt productGroupRepository;

	@Autowired
	private ItemTypeRepositoryExt itemTypeRepositoryExt;

	@Autowired
	private LovRepositoryExt lovRepositoryExt;

	@Autowired
	private CustomLotRepositoryExt customLotDaoRepository;

	@Autowired
	private PriceUtilServiceImpl priceUtilServiceImpl;

	@Autowired
	private ComplexityRepositoryExt complexityRepository;

	@Autowired
	private PurityRepositoryExt purityRepository;
	
	@Autowired	
	private LocationRepository locationRepository;
	
	@Autowired	
	private  ItemStoneMappingRepositoryExt itemStoneMappingRepository;
	
	@Autowired
	private LotDetailRepositoryExt lotDetailRepositoryExt;
	
	@Autowired
	private ItemMaterialMappingRepositoryExt itemMaterialMappingRepository;
	
	@Autowired
	private MaterialMasterRepositoryExt materialRepository;
	
	@Autowired
	private LotMaterialDetailsRepositoryExt lotMaterialDetailsRepository;
	
	@Autowired
	IntegrationService intgService;

	

	@Value("${app.name}")
	private String appType;

	private static final String ERR_CORE_023 = "ERR-CORE-023";
	private static final String INVALID_REQUEST_FORMAT = "Invalid Request Format";
	private static final String NO_STONE_DETAILS_FOUND = "No stone mapping found for requested itemCode ";
	private static final String ERR_PRO_027 = "ERR-PRO-027";
	/**
	 * This method will add the Item depends to the ItemLiteDto from the Item and
	 * returns ItemLiteDto.
	 * 
	 * @param item
	 * @return ItemLiteDto
	 */
	private ItemLiteDto getItemLiteDepends(ItemDao item) {
		ItemLiteDto itemLiteDto = (ItemLiteDto) MapperUtil.getObjectMapping(item, new ItemLiteDto());
		if (StringUtils.isEmpty(item.getProductGroup())) {
			itemLiteDto.setProductGroupCode("");
		} else {
			itemLiteDto.setProductGroupCode(item.getProductGroup().getProductGroupCode());
			itemLiteDto.setProductGroupDesc(item.getProductGroup().getDescription());
		}

		if (StringUtils.isEmpty(item.getProductCategory())) {
			itemLiteDto.setProductCategoryCode("");
		} else {
			itemLiteDto.setProductCategoryCode(item.getProductCategory().getProductCategoryCode());
			itemLiteDto.setProductCategoryDesc(item.getProductCategory().getDescription());
		}
		if (StringUtils.isEmpty(item.getComplexity())) {
			itemLiteDto.setComplexityCode("");
		} else {
			itemLiteDto.setComplexityCode(item.getComplexity().getComplexityCode());
		}
		if (StringUtils.isEmpty(item.getItemType())) {
			itemLiteDto.setItemTypeCode("");
		} else {
			itemLiteDto.setItemTypeCode(item.getItemType().getItemTypeCode());
		}
		itemLiteDto.setImageURL(new URLUtil().getImageUrlByItemCode(item.getItemCode()));

		return itemLiteDto;
	}

	@Override
	public ListResponse<StoneDetailsLiteDto> listItemStoneLiteMapping(String itemCode, String lotNumber,
			String locationCode) {

		if (BooleanUtils.isTrue(CommonUtil.isAStoreUser())) {
			locationCode = CommonUtil.getStoreCode();
		} else if (locationCode == null) {
			throw new ServiceException(INVALID_REQUEST_FORMAT, ERR_CORE_023,
					"Please provide location code for EPOSS users.");
		}

		ItemDao item = new ItemDao();
		item.setItemCode(itemCode);
		// isActive needs to be added
		//Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE);
		List<Object[]> object = stoneRepository.getStoneDetailsByItem(item, lotNumber);
		//stoneRepository.getStoneDetailsByItemCode(itemCode, pageable);
		if (object == null || object.isEmpty()) {
			throw new ServiceException(NO_STONE_DETAILS_FOUND + itemCode, ERR_PRO_027);
		}
		return getItemStoneDetails(object, locationCode);
	}

	private ListResponse<StoneDetailsLiteDto> getItemStoneDetails(List<Object[]> object, String locationCode) {
		List<StoneDetailsLiteDto> stoneDetailList = new ArrayList<>();
		// marketMaterial.getMarkupFactor()
		BigDecimal markupFactor = priceUtilServiceImpl.getMarketMarkupFactor(locationCode,
				EngineConstants.F1_MATERIAL_TYPE_CODE);
		for (Object[] obj : object) {
			StoneDetailsLiteDto stoneDetail = new StoneDetailsLiteDto();
			stoneDetail.setStoneCode((String) obj[0]);
			stoneDetail.setColor((String) obj[1]);
			stoneDetail.setQuality((String) obj[2]);
			stoneDetail.setNoOfStones((Short) obj[3]);
			stoneDetail.setRatePerCarat((BigDecimal) obj[4]);
			BigDecimal ratePerCarat = markupFactor.multiply((BigDecimal) obj[4]).setScale(EngineConstants.VALUE_SCALE,
					RoundingMode.HALF_UP);
			stoneDetail.setRatePerCarat(ratePerCarat);

			stoneDetail.setStoneWeight((BigDecimal) obj[5]);

			stoneDetail.setPrice(ratePerCarat.multiply(stoneDetail.getStoneWeight())
					.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
			stoneDetail.setDescription((String) obj[6]);
			stoneDetail.setCurrencyCode((String) obj[7]);
			stoneDetail.setWeightUnit((String) obj[8]);
			stoneDetail.setStoneTypeCode((String) obj[9]);
			stoneDetailList.add(stoneDetail);
		}

		return new ListResponse<>(stoneDetailList);
	}
	
//	private ListResponse<ItemStoneDto> getItemStoneDetailsForCO(List<Object[]> objectList, String itemCode) {
//		List<ItemStoneDto> stoneDetailList = new ArrayList<>();
//		
//		// marketMaterial.getMarkupFactor()
//		BigDecimal markupFactor = priceUtilServiceImpl.getMarketMarkupFactor(CommonUtil.getLocationCode(),
//				EngineConstants.F1_MATERIAL_TYPE_CODE);
//		for (Object[] obj : objectList) {
//			ItemStoneDto stoneDetail = new ItemStoneDto();
//			stoneDetail.setItemCode(itemCode);
//			stoneDetail.setStoneCode((String) obj[0]);
//			stoneDetail.setColor((String) obj[1]);
//			stoneDetail.setQuality((String) obj[2]);
//			stoneDetail.setNoOfStones((Short) obj[3]);
//			stoneDetail.setRatePerCarat((BigDecimal) obj[4]);
//			BigDecimal ratePerCarat = markupFactor.multiply((BigDecimal) obj[4]).setScale(EngineConstants.VALUE_SCALE,
//					RoundingMode.HALF_UP);
//			stoneDetail.setRatePerCarat(ratePerCarat);
//			stoneDetail.setStoneWeight((BigDecimal) obj[5]);
//			stoneDetail.setPrice(ratePerCarat.multiply(stoneDetail.getStoneWeight())
//					.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
//			stoneDetail.setDescription((String) obj[6]);
//			stoneDetail.setCurrencyCode((String) obj[7]);
//			stoneDetail.setWeightUnit((String) obj[8]);
//			stoneDetail.setStoneTypeCode((String) obj[9]);
//			stoneDetailList.add(stoneDetail);
//		}
//
//		return new ListResponse<>(stoneDetailList);
//	}

	@Override
	public PagedRestResponse<List<ProductCategoryLiteDto>> listProductCategoryLite(Boolean isPageable,
			Pageable pageable) {
		if (!isPageable) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}

		Page<ProductCategoryDao> productCategoryList = getProductCategoryData(pageable);
		return listProductCategoryLite(productCategoryList);
	}

	private PagedRestResponse<List<ProductCategoryLiteDto>> listProductCategoryLite(
			Page<ProductCategoryDao> productCategoryList) {
		List<ProductCategoryLiteDto> productCategories = new ArrayList<>();
		productCategoryList.forEach(productCategory -> productCategories.add(
				(ProductCategoryLiteDto) MapperUtil.getObjectMapping(productCategory, new ProductCategoryLiteDto())));
		return (new PagedRestResponse<>(productCategories, productCategoryList));
	}

	private Page<ProductCategoryDao> getProductCategoryData(Pageable pageable) {
		ProductCategoryDao productCategoryCriteria = new ProductCategoryDao();
		productCategoryCriteria.setIsActive(true);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ProductCategoryDao> criteria = Example.of(productCategoryCriteria, matcher);

		return productCategoryRepository.findAll(criteria, pageable);
	}

	@Override
	public PagedRestResponse<List<ProductGroupLiteDto>> listProductGroupLite(Boolean isPageable, String plainStudded,
			String transactionType, Pageable pageable) {
		if (!isPageable) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}

		if (PlainStuddedEnum.M.toString().equalsIgnoreCase(plainStudded) && transactionType != null) {
			throw new ServiceException("M is supported only for TransactionType Null", "ERR-ENG-010");
		}
		Page<ProductGroupDao> productGroupList = getProductGroupData(transactionType, plainStudded, pageable);
		return listProductGroupLiteData(productGroupList);
	}

	private PagedRestResponse<List<ProductGroupLiteDto>> listProductGroupLiteData(
			Page<ProductGroupDao> productGroupList) {
		List<ProductGroupLiteDto> productGroups = new ArrayList<>();
		productGroupList.forEach(productGroup -> productGroups
				.add((ProductGroupLiteDto) MapperUtil.getObjectMapping(productGroup, new ProductGroupLiteDto())));
		return (new PagedRestResponse<>(productGroups, productGroupList));
	}

	private Page<ProductGroupDao> getProductGroupData(String transactionType, String plainStudded, Pageable pageable) {
		return productGroupRepository.getProductGroupCode(Boolean.TRUE, plainStudded, transactionType, pageable);
	}

	@Override
	@Cacheable(key = "", value = "productGroupCache")
	public Map<String, String> listProductGroupLite(String plainStudded, String transactionType) {
		Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE);
		pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		if (PlainStuddedEnum.M.toString().equalsIgnoreCase(plainStudded) && transactionType != null) {
			throw new ServiceException("M is supported only for TransactionType Null", "ERR-ENG-010");
		}
		Page<ProductGroupDao> productGroupList = getProductGroupData(transactionType, plainStudded, pageable);
		Map<String, String> productGroupListMap = new HashMap<>();
		productGroupList.forEach(productGroupLiteDto -> productGroupListMap
				.put(productGroupLiteDto.getProductGroupCode(), productGroupLiteDto.getDescription()));
		return productGroupListMap;
	}

	@Override
	@Cacheable(key = "#root.target.PRODUCT_CATEGORY_DATA", value = "productCategoryCache")
	public Map<String, String> listProductCategoryLite() {

		Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE);
		Map<String, String> productCategoryListMap = new HashMap<>();
		PagedRestResponse<List<ProductCategoryLiteDto>> productCategoryLiteDtoList = listProductCategoryLite(false,
				pageable);
		productCategoryLiteDtoList.getResults().forEach(productCategoryLiteDto -> productCategoryListMap
				.put(productCategoryLiteDto.getProductCategoryCode(), productCategoryLiteDto.getDescription()));

		return productCategoryListMap;
	}

	@Override
	public ListResponse<ItemTypeDto> listItemType(List<String> itemGroups) {
		List<ItemTypeDto> materialTypeList = new ArrayList<>();
		List<ItemTypeDao> materialTypeDao = itemTypeRepositoryExt.findByItemGroupIn(itemGroups);
		materialTypeDao.forEach(
				record -> materialTypeList.add((ItemTypeDto) MapperUtil.getObjectMapping(record, new ItemTypeDto())));
		return new ListResponse<>(materialTypeList);
	}

	@Override
	public LovDto getProductLov(String lovType) {
		List<ProdLovDao> provLovList = lovRepositoryExt.findByLovTypeAndIsActiveTrue(lovType);
		LovDto lovDto = new LovDto();
		lovDto.setLovType(lovType);
		if (!provLovList.isEmpty()) {
			List<KeyValueDto> keyValueDtoList = provLovList.stream()
					.map(record -> (KeyValueDto) MapperUtil.getObjectMapping(record, new KeyValueDto()))
					.collect(Collectors.toList());
			lovDto.setResults(keyValueDtoList);
		} else {
			lovDto.setResults(new ArrayList<KeyValueDto>());
		}
		return lovDto;
	}

	@Override
	@Transactional
	public CustomLotMasterDto generateLotNumber(String docType) {
		CustomLotMasterDto customLotMasterDto = new CustomLotMasterDto();
		String locationCode = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();

		getLotNumber(docType, locationCode, customLotMasterDto);

		CustomLotDao customLot = (CustomLotDao) MapperUtil.getObjectMapping(customLotMasterDto, new CustomLotDao());
		customLotDaoRepository.save(customLot);
		return customLotMasterDto;
	}

	private void getLotNumber(String docType, String locationcode, CustomLotMasterDto customLotMasterDto) {

		if (docType.equals(ProductDocTypeEnum.TEP.toString())) {
			customLotMasterDto.setTxnType(ProductDocTypeEnum.TEP.toString());
			populateCustomDto(locationcode, customLotMasterDto, LotNumberType.TEP);
		}

		if (docType.equals(ProductDocTypeEnum.GRN.toString())) {
			customLotMasterDto.setTxnType(ProductDocTypeEnum.GRN.toString());
			populateCustomDto(locationcode, customLotMasterDto, LotNumberType.GRN);
		}
		if (docType.equals(ProductDocTypeEnum.OTHERRECPT.toString())) {
			customLotMasterDto.setTxnType(ProductDocTypeEnum.OTHERRECPT.toString());
			populateCustomDto(locationcode, customLotMasterDto, LotNumberType.OTHERRECPT);
		}
		if (docType.equals(ProductDocTypeEnum.GEP.toString())) {
			customLotMasterDto.setTxnType(ProductDocTypeEnum.GEP.toString());
			populateCustomDto(locationcode, customLotMasterDto, LotNumberType.GEP);
		}
		if (docType.equals(ProductDocTypeEnum.DOCTYPE_REQUEST_SERVICE.toString())) {
			customLotMasterDto.setTxnType(ProductDocTypeEnum.DOCTYPE_REQUEST_SERVICE.toString());
			populateCustomDto(locationcode, customLotMasterDto, LotNumberType.DOCTYPE_REQUEST_SERVICE);

		}
	}

	private void populateCustomDto(String locationCode, CustomLotMasterDto customLotMasterDto, String txnCode) {
		Integer sequenceNo;
		String lotNumber;
		customLotMasterDto.setTxnCode(txnCode);
		customLotMasterDto.setLocationCode(locationCode);
		sequenceNo = getSequnceNo(locationCode, txnCode);
		lotNumber = txnCode + locationCode + sequenceNo;
		customLotMasterDto.setLotNumber(lotNumber);
		customLotMasterDto.setSequenceNo(sequenceNo);
	}

	private Integer getSequnceNo(String locationcode, String txnCode) {
		Integer sequenceNo = 0;
		sequenceNo = customLotDaoRepository.getMaxLotId(locationcode, txnCode);

		if (sequenceNo == null)
			sequenceNo = 0;
		++sequenceNo;
		return sequenceNo;

	}

	@Override
	@Transactional
	public ListResponse<ItemLiteDto> getItemList(List<String> itemCodes) {
		List<ItemLiteDto> itemList = new ArrayList<>();
		List<ItemDao> itemDaoList = itemDaoRepository.findByItemCodeIn(itemCodes);
		itemDaoList.forEach(record -> itemList.add(getItemLiteDepends(record)));
		return new ListResponse<>(itemList);
	}

	@Override
	public PagedRestResponse<List<ItemDto>> getItems(ItemSearchRequestDto itemSearchRequestDto, String searchType,
			Pageable pageable) throws JSONException {
		// check: if from is present, then to value is mandatory & vice versa
		
	
		checkFromAndToValuesForItemSearch(itemSearchRequestDto);

		// if pricing type not valid, then return empty list (added as UI is showing all
		// pricing types)
		if (itemSearchRequestDto.getPricingType() != null
				&& !PricingTypeEnum.getAllValues().contains(itemSearchRequestDto.getPricingType())) {
			return new PagedRestResponse<>(List.of(), Page.empty());
		}
		Page<ItemDao> itemList;
		if (StringUtils.isEmpty(searchType)) {
			itemList = itemDaoRepository.getItems(itemSearchRequestDto.getItemCode(),
					itemSearchRequestDto.getFromStdValue(), itemSearchRequestDto.getToStdValue(),
					itemSearchRequestDto.getFromStoneCharges(), itemSearchRequestDto.getToStoneCharges(),
					itemSearchRequestDto.getProductGroupCode(), itemSearchRequestDto.getProductCategoryCode(),
					itemSearchRequestDto.getPricingType(), itemSearchRequestDto.getFromStdWeight(),
					itemSearchRequestDto.getToStdWeight(), pageable);
		
		
		} else {
			if (pageable.getSort() == Sort.unsorted()) {
				pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
						Sort.by("item_code").ascending());
			}
			if (StringUtils.isEmpty(itemSearchRequestDto.getItemCode())) {
				return new PagedRestResponse<>(List.of(), Page.empty());
			}
			itemList = itemDaoRepository.getItems(itemSearchRequestDto.getItemCode(), pageable);
		}
		
		
		Boolean isTEPAllowedFoc=getTEPallowedforFOCitems(CommonUtil.getLocationCode());
		//Boolean isFocItemSaleable=getFOCitemssaleable(CommonUtil.getLocationCode());
		Boolean isFoc=getIsFOCitemWithItemCode(itemSearchRequestDto.getItemCode());
		if (BooleanUtils.isTrue(isFoc) ) {
			if (isTEPAllowedFoc == false && null != searchType && searchType.equals("TEP")) {
				throw new ServiceException("FOC is not allowed for this item", "ERR-ENG-037");
			}
		}
		return getItemResponse(itemList);
	}
	
	private Boolean getTEPallowedforFOCitems(String locationCode) throws JSONException {
		LocationDao offerDetails = locationRepository.findOneByLocationCode(locationCode);
		if (null != offerDetails && null != offerDetails.getOfferDetails()) {
			JSONObject json = new JSONObject(offerDetails.getOfferDetails());
            if (!"".equals(json.optString("data"))) {
				JSONObject jsonForOffer = new JSONObject(json.getString("data"));
				if(jsonForOffer.get("isTEPallowedforFOCitems") != null && ((Boolean)jsonForOffer.get("isTEPallowedforFOCitems"))) {
					return true;
				}
			}
		}
		return false;
	}
	/*
	 * private Boolean getFOCitemssaleable(String locationCode) throws JSONException
	 * { LocationDao offerDetails =
	 * locationRepository.findOneByLocationCode(locationCode); if (null !=
	 * offerDetails && null != offerDetails.getOfferDetails()) { JSONObject json =
	 * new JSONObject(offerDetails.getOfferDetails()); if
	 * (!"".equals(json.optString("data"))) { JSONObject jsonForOffer = new
	 * JSONObject(json.getString("data")); if(jsonForOffer.get("isFOCitemssaleable")
	 * != null && ((Boolean)jsonForOffer.get("isFOCitemssaleable"))) { return true;
	 * } } } return false;
	 */
	            
	private Boolean getIsFOCitemWithItemCode(String itemCode) throws JSONException {
		ItemDao item=itemDaoRepository.findOneByItemCode(itemCode);
		if(item!=null) {
			return item.getIsFocItem();
		}
		
		else {
			return false;
		}
	}

	private void checkFromAndToValuesForItemSearch(ItemSearchRequestDto itemSearchRequestDto) {
		// std value
		if ((StringUtils.isEmpty(itemSearchRequestDto.getFromStdValue())
				&& !StringUtils.isEmpty(itemSearchRequestDto.getFromStdValue()))
				|| (!StringUtils.isEmpty(itemSearchRequestDto.getFromStdValue())
						&& StringUtils.isEmpty(itemSearchRequestDto.getFromStdValue()))) {
			throw new ServiceException(INVALID_REQUEST_FORMAT, ERR_CORE_023,
					"Please provide both from and to std value");
		} else if ((StringUtils.isEmpty(itemSearchRequestDto.getFromStoneCharges())
				&& !StringUtils.isEmpty(itemSearchRequestDto.getToStoneCharges()))
				|| (!StringUtils.isEmpty(itemSearchRequestDto.getFromStoneCharges())
						&& StringUtils.isEmpty(itemSearchRequestDto.getToStoneCharges()))) {
			// stone charges
			throw new ServiceException(INVALID_REQUEST_FORMAT, ERR_CORE_023,
					"Please provide both from and to stone charges");

		} else if ((StringUtils.isEmpty(itemSearchRequestDto.getFromStdWeight())
				&& !StringUtils.isEmpty(itemSearchRequestDto.getToStdWeight()))
				|| (!StringUtils.isEmpty(itemSearchRequestDto.getFromStdWeight())
						&& StringUtils.isEmpty(itemSearchRequestDto.getToStdWeight()))) {
			// std weight
			throw new ServiceException(INVALID_REQUEST_FORMAT, ERR_CORE_023,
					"Please provide both from and to std weight");
		}
	}

	private PagedRestResponse<List<ItemDto>> getItemResponse(Page<ItemDao> itemList) {
		List<ItemDto> itemDtoList = new ArrayList<>();

		for (ItemDao item : itemList) {
			ItemDto itemDto = (ItemDto) MapperUtil.getDtoMapping(item, ItemDto.class);

			if (item.getComplexity() != null)
				itemDto.setComplexityCode(item.getComplexity().getComplexityCode());

			if (item.getProductGroup() != null)
				itemDto.setProductGroupCode(item.getProductGroup().getProductGroupCode());

			if (item.getProductCategory() != null)
				itemDto.setProductCategoryCode(item.getProductCategory().getProductCategoryCode());

			if (item.getItemType() != null)
				itemDto.setItemTypeCode(item.getItemType().getItemTypeCode());

			if (item.getParentItem() != null)
				itemDto.setParentItemCode(item.getParentItem().getItemCode());

			itemDto.setItemDetails(MapperUtil.getJsonFromString(item.getItemDetails()));
			itemDto.setConfigDetails(MapperUtil.getJsonFromString(item.getConfigDetails()));

			// image url
			itemDto.setImageUrl(new URLUtil().getImageUrlByItemCode(itemDto.getItemCode()));

			itemDtoList.add(itemDto);
		}

		return new PagedRestResponse<>(itemDtoList, itemList);
	}

	@Override
	public PagedRestResponse<List<StoneDto>> getStones(StoneSearchRequestDto stoneSearchRequestDto, Pageable pageable) {
		Page<StoneDao> stoneDaoPage = stoneRepository.getStones(stoneSearchRequestDto.getStoneCode(),
				stoneSearchRequestDto.getFromStdValue(), stoneSearchRequestDto.getToStdValue(),
				stoneSearchRequestDto.getColor(), stoneSearchRequestDto.getStoneTypeCode(),
				stoneSearchRequestDto.getQuality(), stoneSearchRequestDto.getRatePerCarat(), pageable);
		return getStoneResponse(stoneDaoPage);
	}

	private PagedRestResponse<List<StoneDto>> getStoneResponse(Page<StoneDao> stoneDaoPage) {
		List<StoneDto> stoneDtoList = new ArrayList<>();
		stoneDaoPage.forEach(record -> {
			StoneDto stoneDto = (StoneDto) MapperUtil.getDtoMapping(record, StoneDto.class);
			stoneDto.setStoneTypeCode(record.getStoneType().getStoneTypeCode());
			stoneDtoList.add(stoneDto);
		});
		return new PagedRestResponse<>(stoneDtoList, stoneDaoPage);
	}

	@Override
	public ListResponse<ItemStoneDto> getItemStones(String itemCode) {
		List<ItemStoneDto> itemStoneList = new ArrayList<>();
		ItemDao item = itemDaoRepository.findById(itemCode)
				.orElseThrow(() -> new ServiceException("No Item details found for the requested itemCode",
						"ERR-PRO-028", "itemCode : " + itemCode));
		List<ItemStoneMappingDao> itemStoneDao = itemStoneMappingRepository.findByItem(item);
		
		//List<Object[]> object = stoneRepository.getListOfStoneDetailsByItemCode(itemCode);
		   if (itemStoneDao == null || itemStoneDao.isEmpty()) {
				//throw new ServiceException(NO_STONE_DETAILS_FOUND + itemCode, ERR_PRO_027);
			
			return new ListResponse<ItemStoneDto>(new ArrayList<>());
		}
     
		itemStoneDao.forEach(record -> {
			ItemStoneDto itemStoneDto = (ItemStoneDto) MapperUtil.getDtoMapping(record, ItemStoneDto.class);
			itemStoneDto.setItemCode(record.getItem().getItemCode());
			itemStoneDto.setStoneCode(record.getStone().getStoneCode());
			itemStoneDto.setNoOfStones(record.getNoOfStones());
			
			itemStoneList.add(itemStoneDto);
		});
		return new ListResponse<>(itemStoneList);
		//return getItemStoneDetailsForCO(object, itemCode);
	}

	@Override
	public ItemLotStoneListDto getLotItemStonesWithDICheck(String itemCode, String lotNumber, Boolean isOnlyDI, boolean throwException) {

		ItemLotStoneListDto itemResponse = new ItemLotStoneListDto();
		Pageable pageable;
		List<Object[]> objArrayList = null;
		if (itemCode != null && lotNumber != null && (isOnlyDI != null && isOnlyDI)) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE);
			objArrayList = stoneRepository.getDimondStoneDetailsByItemCodeAndLotNumber(itemCode, lotNumber, pageable);
			if ((objArrayList == null || objArrayList.isEmpty()) && throwException) {
				// get it from eposs
				throw new ServiceException(NO_STONE_DETAILS_FOUND + itemCode, ERR_PRO_027);
			}
		}else if (itemCode != null && lotNumber != null) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE);
			objArrayList = stoneRepository.getStoneDetailsByItemCodeAndLotNumber(itemCode, lotNumber, pageable);
			//objArrayList = stoneRepository.getLowestStoneDetailsByItemCodeAndLotNumber(itemCode, lotNumber);
			
			if ((objArrayList == null || objArrayList.isEmpty()) && throwException) {
				// get it from eposs
				throw new ServiceException(NO_STONE_DETAILS_FOUND + itemCode, ERR_PRO_027);
			}
		} else if (itemCode != null) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE);
		
			objArrayList = stoneRepository.getLowestStoneDetailsByItemCode(itemCode);
			if(objArrayList != null && !objArrayList.isEmpty()) {
				Object[] details = objArrayList.get(0);
				lotNumber = (String)details[1];
			   objArrayList = stoneRepository.getStoneDetailsByItemCodeAndLotNumber(itemCode, lotNumber, pageable);
			}
			if((objArrayList == null || objArrayList.isEmpty())) {
				objArrayList = stoneRepository.getStoneDetailsByItemCode(itemCode, pageable);
			}
			if ((objArrayList == null || objArrayList.isEmpty()) && throwException) {
				// get it from eposs
				throw new ServiceException(NO_STONE_DETAILS_FOUND + itemCode, ERR_PRO_027);
			}
		}
		if (objArrayList != null && !objArrayList.isEmpty()) {
			List<ItemLotStoneBaseDto> listResponse = mapStoneDetails(objArrayList);
			itemResponse.setLotStoneDetails(listResponse);
		}
		return itemResponse;
	}

	private List<ItemLotStoneBaseDto> mapStoneDetails(List<Object[]> object) {
		List<ItemLotStoneBaseDto> stoneDetailList = new ArrayList<>();
		// marketMaterial.getMarkupFactor()
		BigDecimal markupFactor = priceUtilServiceImpl.getMarketMarkupFactor(CommonUtil.getLocationCode(),
				EngineConstants.F1_MATERIAL_TYPE_CODE);
		for (Object[] obj : object) {
			ItemLotStoneBaseDto stoneDetail = new ItemLotStoneBaseDto();
			stoneDetail.setStoneCode((String) obj[0]);
			stoneDetail.setNoOfStones((Short) obj[1]);
			BigDecimal ratePerCarat = markupFactor.multiply((BigDecimal) obj[2]).setScale(EngineConstants.VALUE_SCALE,
					RoundingMode.HALF_UP);
			// market level rate per karat to be removed if client says no.
			stoneDetail.setRatePerCarat(ratePerCarat);
			stoneDetail.setStoneWeight((BigDecimal) obj[3]);
			stoneDetail.setCurrencyCode((String) obj[4]);
			stoneDetail.setWeightUnit((String) obj[5]);
			stoneDetail.setStoneTypeCode((String) obj[6]);
			stoneDetail.setStoneQuality((String) obj[7]);
			stoneDetailList.add(stoneDetail);
		}

		return stoneDetailList;
	}

	/**
	 * @param List<String> itemCodes
	 * @return Map<String, ItemDetailsDto>
	 */
	@Override
	public Map<String, ItemDetailsDto> listItemDetails(List<String> itemCodes) {

		List<ItemDao> itemDetails = itemDaoRepository.findByItemCodeIn(itemCodes);

		if (itemDetails.isEmpty())
			throw new ServiceException("No Item details found for the requested itemCode", "ERR-PRO-028",
					"itemCode : " + itemCodes);

		Map<String, ItemDetailsDto> itemDetailsMap = new HashMap<>();

		for (ItemDao item : itemDetails) {
			ItemDetailsDto itemDto = (ItemDetailsDto) MapperUtil.getDtoMapping(item, ItemDetailsDto.class);
			ItemsDto itemtypeDto = (ItemsDto) MapperUtil.getDtoMapping(item.getItemType(), ItemsDto.class);
			itemDto.setItemType(itemtypeDto);
			if (!StringUtils.isEmpty(item.getHsnSacCode()))
				itemDto.setHsnCode(item.getHsnSacCode());
			itemDto.setDescription(item.getDescription());
			;
			itemDetailsMap.put(item.getItemCode(), itemDto);
		}

		return itemDetailsMap;
	}

	/**
	 * This method will return the list of Complexity details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<ComplexityDto>>
	 */
	@Override
	public PagedRestResponse<List<ComplexityDto>> listComplexity(Boolean isActive, Pageable pageable) {

		ComplexityDao complexityCriteria = new ComplexityDao();
		complexityCriteria.setIsActive(isActive);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ComplexityDao> criteria = Example.of(complexityCriteria, matcher);

		Page<ComplexityDao> complexityList = complexityRepository.findAll(criteria, pageable);

		List<ComplexityDto> complexityDtoList = new ArrayList<>();

		complexityList.forEach(complexity -> complexityDtoList
				.add((ComplexityDto) MapperUtil.getObjectMapping(complexity, new ComplexityDto())));

		return (new PagedRestResponse<>(complexityDtoList, complexityList));
	}

	/**
	 * This method will return the list of Purity details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PurityDto>>
	 */
	@Override
	public PagedRestResponse<List<PurityDto>> listPurity(Boolean isActive, BigDecimal purityValue, String itemTypeCode,
			Pageable pageable) {

		Page<PurityDto> purityDtoList = purityRepository.findByItemTypeCodeAndPurityAndIsActive(itemTypeCode,
				purityValue, isActive, pageable);

		return (new PagedRestResponse<>(purityDtoList.getContent(), purityDtoList));
	}

	@Override
	public ItemsDto getItemDetails(String itemCode) {
		ItemDao item = itemDaoRepository.findOneByItemCode(itemCode);
		ItemsDto itemDetails = (ItemsDto)MapperUtil.getDtoMapping(item, ItemsDto.class);
		return itemDetails;
	}

	@Override
	public ListResponse<ItemStoneDto> getItemStonesForCO(String itemCode) {
		List<ItemStoneDto> itemStoneList = new ArrayList<>();
		itemDaoRepository.findById(itemCode).orElseThrow(() -> new ServiceException("No Item details found for the requested itemCode",
						"ERR-PRO-028", "itemCode : " + itemCode));
		List<Object[]> object = stoneRepository.getListOfStoneDetailsByItemCode(itemCode);
		// marketMaterial.getMarkupFactor()
		BigDecimal markupFactor = priceUtilServiceImpl.getMarketMarkupFactor(CommonUtil.getLocationCode(),
				EngineConstants.F1_MATERIAL_TYPE_CODE);
		for (Object[] obj : object) {
			ItemStoneDto stoneDetail = new ItemStoneDto();
			stoneDetail.setItemCode(itemCode);
			stoneDetail.setStoneCode((String) obj[0]);
			stoneDetail.setColor((String) obj[1]);
			stoneDetail.setQuality((String) obj[2]);
			stoneDetail.setNoOfStones((Short) obj[3]);
			stoneDetail.setRatePerCarat((BigDecimal) obj[4]);
			BigDecimal ratePerCarat = markupFactor.multiply((BigDecimal) obj[4]).setScale(EngineConstants.VALUE_SCALE,
					RoundingMode.HALF_UP);
			stoneDetail.setRatePerCarat(ratePerCarat);
			stoneDetail.setStoneWeight((BigDecimal) obj[5]);
			stoneDetail.setPrice(ratePerCarat.multiply(stoneDetail.getStoneWeight())
					.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
			stoneDetail.setDescription((String) obj[6]);
			stoneDetail.setCurrencyCode((String) obj[7]);
			stoneDetail.setWeightUnit((String) obj[8]);
			stoneDetail.setStoneTypeCode((String) obj[9]);
			itemStoneList.add(stoneDetail);
		}

		return new ListResponse<>(itemStoneList);
	}

	@Override
	public ItemStoneDetailsDto getItemAndStoneDetails(String itemCode, String lotNumber) {
		ItemStoneDetailsDto data = new ItemStoneDetailsDto();
		
		ItemDao getItemMaster = itemDaoRepository.findByItemMaster(itemCode);
        ItemMasterDto itemDetails = new ItemMasterDto(getItemMaster);
		data.setItemMasterDetails(itemDetails);

	    List<ItemStoneMappingDetailsDto> itemStoneDetails =  itemStoneMappingRepository.findAllByItemStone(itemCode);
	    data.setItemStoneMappingDetails(itemStoneDetails);
	    
	    if(!CollectionUtil.isEmpty(itemStoneDetails)) {
	    	 List<String> stoneCodes= itemStoneDetails.stream().map(isd-> isd.getStoneCode()).collect(Collectors.toList());     		
	 		List<StoneMasterDto> stoneMasterDetails = stoneRepository.findAllByStone(stoneCodes);		
	 		data.setStoneMasterDetails(stoneMasterDetails);	    	
	    }

		List<LotStoneDetailsDto> lotStoneDetails = lotDetailRepositoryExt.findAllByStoneAndLot(itemCode,lotNumber);
		data.setLotStoneDetails(lotStoneDetails);	
		
		List<ItemMaterialDto> itemMaterialMapping = itemMaterialMappingRepository.findByItemCodes(itemCode);
		data.setItemMaterialMappingDetails(itemMaterialMapping);
		
		if(!CollectionUtil.isEmpty(itemMaterialMapping)) {
			 MaterialDao getMaterialMaster = materialRepository.findOneByMaterialCode(itemMaterialMapping.get(0).getMaterialCode());
			 MaterialMasterDto materialDetails = new MaterialMasterDto(getMaterialMaster);
			 data.setMaterialDetails(materialDetails);
			 List<LotMaterialDetailsDao> getLotMaterialDetails = lotMaterialDetailsRepository.findByMaterialCode(getMaterialMaster.getMaterialCode());
			 List<LotMaterialDetailsDto> lotMaterialDetails = new ArrayList<LotMaterialDetailsDto>(); 
			 getLotMaterialDetails.stream().forEach(lmd-> {
				 LotMaterialDetailsDto lotMaterialDetail = new LotMaterialDetailsDto(lmd);
				 lotMaterialDetails.add(lotMaterialDetail);
			 });
			 data.setLotMaterialDetails(lotMaterialDetails);			
		}  
	   return data;
	}

	@Override
	public ItemStoneDetailsDto saveItemAndLotDetails(String itemCode, String lotNumber) {
		Map<String, String> reqParams = new HashMap<>();
		if (lotNumber == null) {
			reqParams.put("itemCode", String.valueOf(itemCode));
		} else {
			reqParams.put("itemCode", String.valueOf(itemCode));
			reqParams.put("lotNumber", String.valueOf(lotNumber));
		}	
		// calling eposs integration service
		ItemStoneDetailsDto epossApiResponseDto = callIntegration(HttpMethod.GET, EngineConstants.ENGINE_GET_LOT_STONE_API,
				reqParams, null,ItemStoneDetailsDto.class);		
		saveItemMasterdetails(epossApiResponseDto);
		saveItemStoneDetails(epossApiResponseDto);
		saveStoneMasterDetails(epossApiResponseDto);
		saveLotStoneDetails(epossApiResponseDto);
		saveItemMaterialDetails(epossApiResponseDto);
		saveMaterialMasterDetails(epossApiResponseDto);
		saveLotMaterialDetails(epossApiResponseDto);
		return epossApiResponseDto;
	}

	private void saveLotMaterialDetails(ItemStoneDetailsDto epossApiResponseDto) {
		List<LotMaterialDetailsDto> lotMaterialDetails = epossApiResponseDto.getLotMaterialDetails();
		ObjectMapper mapper = new ObjectMapper();
		mapper.setSerializationInclusion(Include.NON_NULL);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        List<LotMaterialDetailsDao> LotMaterialDetailsList = new ArrayList<LotMaterialDetailsDao>();
		if(lotMaterialDetails != null) {
			for(LotMaterialDetailsDto lotMaterialDetailsDto : lotMaterialDetails) {
				LotMaterialDetailsDao lotMaterialDetailsDao = new LotMaterialDetailsDao();
				MaterialDao materialDao = new MaterialDao();
	            materialDao.setMaterialCode(lotMaterialDetailsDto.getMaterialCode());
	            LotMaterialDetailsIdDao lotMaterialDetailsIdDao = new LotMaterialDetailsIdDao();
	            ItemDao itemDao = new ItemDao();
	            itemDao.setItemCode(lotMaterialDetailsDto.getItemCode());
	            lotMaterialDetailsIdDao.setItem(itemDao);
	            lotMaterialDetailsIdDao.setLineItemNo(lotMaterialDetailsDto.getLineItemNo());
	            lotMaterialDetailsIdDao.setLotNumber(lotMaterialDetailsDto.getLotNumber());
	            lotMaterialDetailsDao.setLotDetailsId(lotMaterialDetailsIdDao);
	            BeanUtils.copyProperties(lotMaterialDetailsDto, lotMaterialDetailsDao);
				lotMaterialDetailsDao.setMaterial(materialDao);
				lotMaterialDetailsDao.setSyncTime(System.currentTimeMillis());
				LotMaterialDetailsList.add(lotMaterialDetailsDao);				
			}				
		}
		if(!CollectionUtil.isEmpty(LotMaterialDetailsList)) {
			lotMaterialDetailsRepository.saveAll(LotMaterialDetailsList);	
		}				
	}

	private void saveMaterialMasterDetails(ItemStoneDetailsDto epossApiResponseDto) {
		MaterialDao materialDao = new MaterialDao();
		MaterialMasterDto materialDetails = epossApiResponseDto.getMaterialDetails();
		ObjectMapper mapper = new ObjectMapper();
		mapper.setSerializationInclusion(Include.NON_NULL);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		if(materialDetails != null) {
			MaterialTypeDao materialTypeDao = new MaterialTypeDao();
			materialTypeDao.setMaterialTypeCode(materialDetails.getMaterialTypeCode());
			BeanUtils.copyProperties(materialDetails, materialDao);
			materialDao.setMaterialType(materialTypeDao);
			materialDao.setDestSyncId(0);
			materialDao.setSrcSyncId(0);;
			materialRepository.save(materialDao);			
		}		
	}

	private void saveItemMaterialDetails(ItemStoneDetailsDto epossApiResponseDto) {
		List<ItemMaterialDto> itemMaterialMapping = epossApiResponseDto.getItemMaterialMappingDetails();
		ObjectMapper mapper = new ObjectMapper();
		mapper.setSerializationInclusion(Include.NON_NULL);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		List<ItemMaterialMappingDao> itemMaterialMappingList = new ArrayList<ItemMaterialMappingDao>();
		if(itemMaterialMapping != null) {
			for(ItemMaterialDto itemMaterialDto : itemMaterialMapping) {
				ItemMaterialMappingDao itemMaterialMappingDao = new ItemMaterialMappingDao();
				ItemDao itemDao = new ItemDao();
				itemDao.setItemCode(itemMaterialDto.getItemCode());
				BeanUtils.copyProperties(itemMaterialDto, itemMaterialMappingDao);
				itemMaterialMappingDao.setItem(itemDao);
				itemMaterialMappingDao.setMaterial(itemMaterialDto.getMaterialCode());
				itemMaterialMappingDao.setSyncTime(System.currentTimeMillis());
				itemMaterialMappingList.add(itemMaterialMappingDao);	
			}		
		}
		if(!CollectionUtil.isEmpty(itemMaterialMappingList)) {
			itemMaterialMappingRepository.saveAll(itemMaterialMappingList);	
		}
		
		
	}

	private void saveLotStoneDetails(ItemStoneDetailsDto epossApiResponseDto) {		
		List<LotStoneDetailsDto> lotStoneDetails = epossApiResponseDto.getLotStoneDetails();
		ObjectMapper mapper = new ObjectMapper();
		mapper.setSerializationInclusion(Include.NON_NULL);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		List<LotDetailsDao> lotStoneDetailsList = new ArrayList<LotDetailsDao>();
		if(lotStoneDetails != null) {
			for(LotStoneDetailsDto lotStoneDetailsDto : lotStoneDetails) {
				LotDetailsDao lotDetailsDao = new LotDetailsDao();
				StoneDao stoneDao = new StoneDao();
				stoneDao.setStoneCode(lotStoneDetailsDto.getStoneCode());	
				LotDetailsIdDao lotDetailsIdDao = new LotDetailsIdDao();
				ItemDao itemDao = new ItemDao();
	            itemDao.setItemCode(lotStoneDetailsDto.getItemCode());
				lotDetailsIdDao.setLineItemNo(lotStoneDetailsDto.getLineItemNo());
				lotDetailsIdDao.setLotNumber(lotStoneDetailsDto.getLotNumber());
				lotDetailsIdDao.setItem(itemDao);
				lotDetailsDao.setLotDetailsId(lotDetailsIdDao);		
				BeanUtils.copyProperties(lotStoneDetailsDto, lotDetailsDao);
				lotDetailsDao.setStone(stoneDao);
				lotDetailsDao.setSyncTime(System.currentTimeMillis());
				lotStoneDetailsList.add(lotDetailsDao);			
			}		
		}
		if(!CollectionUtil.isEmpty(lotStoneDetailsList)) {
			lotDetailRepositoryExt.saveAll(lotStoneDetailsList);	
		}
	}

	private void saveStoneMasterDetails(ItemStoneDetailsDto epossApiResponseDto) {
		List<StoneMasterDto> stoneMasterDetails = epossApiResponseDto.getStoneMasterDetails();
		ObjectMapper mapper = new ObjectMapper();
		mapper.setSerializationInclusion(Include.NON_NULL);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		List<StoneDao> stoneMasterList = new ArrayList<StoneDao>();
		if (stoneMasterDetails != null){
			for (StoneMasterDto stone : stoneMasterDetails) {
				StoneDao stoneMaster = new StoneDao();
				StoneTypeDao stoneTypeDao = new StoneTypeDao();
				stoneTypeDao.setStoneTypeCode(stone.getStoneTypeCode());
				BeanUtils.copyProperties(stone, stoneMaster);
				stoneMaster.setStoneType(stoneTypeDao);
				stoneMaster.setDestSyncId(0);
				stoneMaster.setSrcSyncId(0);	
				stoneMasterList.add(stoneMaster);
			}
		}
		if(!CollectionUtil.isEmpty(stoneMasterList)) {
			stoneRepository.saveAll(stoneMasterList);
		}

	}

	private void saveItemStoneDetails(ItemStoneDetailsDto epossApiResponseDto) {	
		List<ItemStoneMappingDetailsDto> itemStoneMappingDetails = epossApiResponseDto.getItemStoneMappingDetails();
		ObjectMapper mapper = new ObjectMapper();
		mapper.setSerializationInclusion(Include.NON_NULL);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		List<ItemStoneMappingDao> itemStoneMappingList = new ArrayList<ItemStoneMappingDao>();
		if(CollectionUtil.isNotEmpty(itemStoneMappingDetails)) {
			for(ItemStoneMappingDetailsDto detail : itemStoneMappingDetails) {
				ItemStoneMappingDao itemStoneMapping = new ItemStoneMappingDao();
				StoneDao stoneDao = new StoneDao();
				stoneDao.setStoneCode(detail.getStoneCode());
				ItemDao itemDao = new ItemDao();
				itemDao.setItemCode(detail.getItemCode());			
				BeanUtils.copyProperties(detail, itemStoneMapping);
				itemStoneMapping.setStone(stoneDao);
				itemStoneMapping.setItem(itemDao);		
				itemStoneMapping.setSyncTime(System.currentTimeMillis());
			    ItemStoneMappingDao checkItemAndStone = itemStoneMappingRepository.findByItemItemCodeAndStoneStoneCode(detail.getItemCode(),detail.getStoneCode());
			    if(checkItemAndStone == null) {
			    	 itemStoneMappingList.add(itemStoneMapping);			    	
			    }
				}			
		}
		if(!CollectionUtil.isEmpty(itemStoneMappingList)) {
            itemStoneMappingRepository.saveAll(itemStoneMappingList);
		}
		
	}

	private void saveItemMasterdetails(ItemStoneDetailsDto epossApiResponseDto) {
		ItemDao item = new ItemDao();
		ItemMasterDto itemMasterDto = epossApiResponseDto.getItemMasterDetails();
		ObjectMapper mapper = new ObjectMapper();
		mapper.setSerializationInclusion(Include.NON_NULL);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		if (itemMasterDto != null) {
			ProductGroupDao productGroup = new ProductGroupDao();
			productGroup.setProductGroupCode(itemMasterDto.getProductGroupCode());
			ProductCategoryDao productCategory = new ProductCategoryDao();
            productCategory.setProductCategoryCode(itemMasterDto.getProductCategoryCode());
            ComplexityDao complexity = new ComplexityDao();
            complexity.setComplexityCode(itemMasterDto.getComplexityCode());
            ItemTypeDao itemType = new ItemTypeDao();
            itemType.setItemTypeCode(itemMasterDto.getItemTypeCode()); 
            if(itemMasterDto.getParentItemCode() != null) {
            	ItemDao parentItem = new ItemDao();
                parentItem.setItemCode(itemMasterDto.getParentItemCode());
            	item.setParentItem(parentItem);
            }
			item.setProductGroup(productGroup);
            item.setProductCategory(productCategory);
            item.setComplexity(complexity);
            item.setItemType(itemType);
            BeanUtils.copyProperties(itemMasterDto, item);
            item.setDestSyncId(0);
            item.setSrcSyncId(0);
            item.setIsActive(Boolean.TRUE);
			itemDaoRepository.save(item);
		}
	}

	private <T> T callIntegration(HttpMethod httpMethod, String relativeUrl,
			Map<String, String> requestParamters, Object requestBody,Class<T> itemStoneDetailsDto) {
		ApiResponseDto epossResponseDto = intgService.callEpossAPI(httpMethod, relativeUrl, requestParamters,
				requestBody);
		// if 200, then return response
		if (epossResponseDto.getHttpResponseCode() == HttpStatus.OK.value()) {
			return MapperUtil.mapObjToClass(epossResponseDto.getResponse(), itemStoneDetailsDto);
		} else if (epossResponseDto.getHttpResponseCode() == HttpStatus.BAD_REQUEST.value()) {
			// if 400, then throw error
			throw new ServiceException(
					JsonUtils.getValueFromJsonString(epossResponseDto.getResponse(), CommonConstants.MESSAGE),
					JsonUtils.getValueFromJsonString(epossResponseDto.getResponse(), CommonConstants.CODE),
					epossResponseDto.getResponse());
		}
		// if not 400, then throw generic error message
		throw new ServiceException("CALL_TO_EPOSS_FAILED", "ERR_INT_025", epossResponseDto.getResponse());
	}
}
