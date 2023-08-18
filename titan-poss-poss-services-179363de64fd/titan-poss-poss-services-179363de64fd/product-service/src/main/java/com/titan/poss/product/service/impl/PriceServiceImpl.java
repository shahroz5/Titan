/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.PriceDaoExt;
import com.titan.poss.product.dao.PriceGroupDao;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.dao.ProductPriceMappingDao;
import com.titan.poss.product.dao.SyncStaging;
import com.titan.poss.product.dto.PriceDto;
import com.titan.poss.product.dto.PriceSyncDtoExt;
import com.titan.poss.product.dto.response.ProductPriceDto;
import com.titan.poss.product.repository.ItemRepositoryExt;
import com.titan.poss.product.repository.PriceGroupRepositoryExt;
import com.titan.poss.product.repository.PriceRepositoryExt;
import com.titan.poss.product.repository.ProductPriceMappingRepository;
import com.titan.poss.product.repository.ProductSyncStagingRepository;
import com.titan.poss.product.service.PriceService;
import com.titan.poss.product.service.ProductGroupService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("priceService")
public class PriceServiceImpl implements PriceService {

	private static final String ERR_MAS_001 = "ERR-MAS-001";

	private static final String NO_PRICE_DETAILS_FOUND_FOR_THE_REQUESTED_ID = "No Price details found for the requested itemCode or priceGroup";

	@Autowired
	private PriceRepositoryExt priceRepository;

	@Autowired
	private ItemRepositoryExt itemRepository;

	@Autowired
	private PriceGroupRepositoryExt priceGroupRepository;
	
	@Autowired
	private ProductSyncDataServiceImpl syncDataService;
	


	@Autowired
	private ProductSyncStagingRepository productSyncStagingRepository;
	
	@Autowired
	private PriceServiceImpl  priceService;

	@Autowired
	private ProductPriceMappingRepository productPriceRepo;

	@Autowired
	private ProductGroupService productService;
	

	/**
	 * This method will return the list of Price details based on the isActive.
	 * 
	 * @param isActive
	 * @param itemCode
	 * @param priceGroup
	 * @param pageable
	 * @return PagedRestResponse<List<PriceDto>>
	 */
	@Override
	public PagedRestResponse<List<PriceDto>> listPrice(Boolean isActive, String itemCode, String priceGroup,
			Pageable pageable) {
		Page<PriceDaoExt> pricePage;

		PriceDaoExt price = new PriceDaoExt();

		ItemDao item = new ItemDao();
		item.setIsActive(true);
		item.setItemCode(itemCode);

		PriceGroupDao priceGrp = new PriceGroupDao();
		priceGrp.setIsActive(true);
		priceGrp.setPriceGroup(priceGroup);
		price.setIsActive(isActive);
		price.setPriceGroup(priceGrp);
		price.setItem(item);
		// if any null value comes then ignore null values
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<PriceDaoExt> priceExample = Example.of(price, matcher);
		pricePage = priceRepository.findAll(priceExample, pageable);

		List<PriceDto> priceDtoList = new ArrayList<>();
		pricePage.forEach(priceData -> {
			PriceDto priceDto = (PriceDto) MapperUtil.getDtoMapping(priceData, PriceDto.class);
			priceDto.setItemCode(priceData.getItem().getItemCode());
			priceDto.setPriceGroup(priceData.getPriceGroup().getPriceGroup());
			priceDtoList.add(priceDto);
		});
		
		return new PagedRestResponse<>(priceDtoList, pricePage);
	}

	/**
	 * This method will save the Price details.
	 * 
	 * @param priceDto
	 * @return PriceDto
	 */
	@Override
	public PriceDto addPrice(PriceDto priceDto) {
		ItemDao item = itemRepository.findOneByItemCode(priceDto.getItemCode());
		if (item == null)
			throw new ServiceException("No Item details found for requested itemCode", "ERR-PRO-002");
		PriceGroupDao priceGroup = priceGroupRepository.findOneByPriceGroup(priceDto.getPriceGroup());
		if (priceGroup == null)
			throw new ServiceException("No PriceGroup details found for requested priceGroup", "ERR-PRO-011");

		PriceDaoExt price = (PriceDaoExt) MapperUtil.getDtoMapping(priceDto, PriceDaoExt.class);
		priceDepends(price, priceDto.getItemCode(), priceDto.getPriceGroup());
		Optional<PriceDaoExt> priceOptional = priceRepository.findByItemAndPriceGroup(price.getItem(), price.getPriceGroup());

		if (priceOptional.isPresent())
			throw new ServiceException("Duplicate value insertion", "ERR-CORE-012");

		price.setSrcSyncId(0);
		price.setDestSyncId(0);
		SyncStagingDto data = priceService.savePriceToDB(price, ProductOperationCodes.PRICE_ADD);

		// Publishing to data sync queue
		syncDataService.publishProductMessagesToQueue(data);
		return priceDto;
	}

	private void priceDepends(PriceDaoExt price, String itemCode, String priceGroup) {
		ItemDao item = new ItemDao();
		item.setItemCode(itemCode);
		PriceGroupDao pGroup = new PriceGroupDao();
		pGroup.setPriceGroup(priceGroup);
		price.setPriceGroup(pGroup);
		price.setItem(item);
	}

	/**
	 * This method will update the Price details.
	 * 
	 * @param priceDto
	 * @return PriceDto
	 */
	@Override
	public PriceDto updatePrice(PriceDto priceDto) {
		PriceDaoExt price = new PriceDaoExt();
		priceDepends(price, priceDto.getItemCode(), priceDto.getPriceGroup());
		Optional<PriceDaoExt> optionalPrice = priceRepository.findByItemAndPriceGroup(price.getItem(), price.getPriceGroup());
		if (!optionalPrice.isPresent()) {
			throw new ServiceException(NO_PRICE_DETAILS_FOUND_FOR_THE_REQUESTED_ID, ERR_MAS_001);
		}
		price = optionalPrice.get();
		price = (PriceDaoExt) MapperUtil.getObjectMapping(priceDto, price);
		price.setSrcSyncId(price.getSrcSyncId() + 1);
		SyncStagingDto data = priceService.savePriceToDB(price, ProductOperationCodes.PRICE_UPDATE);
		// Publishing to data sync queue
		syncDataService.publishProductMessagesToQueue(data);
		
		return priceDto;
	}
	
	/**
	 * @param priceDao
	 * @return
	 */
	@Transactional
	public SyncStagingDto savePriceToDB(PriceDaoExt priceDao, String operation) {
		priceRepository.save(priceDao);
		List<SyncData> priceSyncData = new ArrayList<>();
		PriceSyncDtoExt priceSyncDto = new PriceSyncDtoExt(priceDao);
		priceSyncData.add(DataSyncUtil.createSyncData(priceSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		MessageRequest priceMsgRequest = DataSyncUtil.createMessageRequest(priceSyncData, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(priceMsgRequest);
		syncStagingDto.setMessageRequest(priceMsgRequest);
		SyncStaging priceStaggingMsg = new SyncStaging();
		priceStaggingMsg.setMessage(requestBody);
		priceStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		priceStaggingMsg = productSyncStagingRepository.save(priceStaggingMsg);
		syncStagingDto.setId(priceStaggingMsg.getId());
		return syncStagingDto;
	}

	@Override
	public PagedRestResponse<List<ProductPriceDto>> listProductPrice(String productGroupCode, Pageable pageable) {

		Page<ProductPriceMappingDao> pricePage;

		ProductPriceMappingDao price = new ProductPriceMappingDao();
		
		ProductGroupDao producutGroupDao = productService.getProductGroupDao(productGroupCode);
		price.setProductGroup(producutGroupDao);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ProductPriceMappingDao> priceExample = Example.of(price, matcher);
		pricePage = productPriceRepo.findAll(priceExample, pageable);

		List<ProductPriceDto> priceDtoList = new ArrayList<>();
		pricePage.forEach(priceData -> {
			ProductPriceDto priceDto = (ProductPriceDto) MapperUtil.getDtoMapping(priceData, ProductPriceDto.class);
			priceDto.setProductGroupCode(priceData.getProductGroup().getProductGroupCode());
			priceDtoList.add(priceDto);
		});

		return new PagedRestResponse<>(priceDtoList, pricePage);
	}


}
