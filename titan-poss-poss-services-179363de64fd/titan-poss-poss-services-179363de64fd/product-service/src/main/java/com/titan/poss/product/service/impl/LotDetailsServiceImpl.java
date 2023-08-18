/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.ItemStoneMappingDto;
import com.titan.poss.core.dto.LotDetailsReqDto;
import com.titan.poss.core.dto.LotDto;
import com.titan.poss.core.dto.LotNumberDetailReqDto;
import com.titan.poss.core.dto.LotNumberDetailsDto;
import com.titan.poss.core.dto.MultiMetalDetailsDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ItemStoneMappingDaoExt;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotDetailsIdDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsIdDao;
import com.titan.poss.product.dao.MaterialDao;
import com.titan.poss.product.dao.StoneDao;
import com.titan.poss.product.dto.LotDetailsDto;
import com.titan.poss.product.repository.ItemRepositoryExt;
import com.titan.poss.product.repository.ItemStoneMappingRepositoryExt;
import com.titan.poss.product.repository.LotDetailsRepository;
import com.titan.poss.product.repository.LotMaterialDetailsRepository;
import com.titan.poss.product.repository.MaterialRepositoryExt;
import com.titan.poss.product.repository.StoneRepositoryExt;
import com.titan.poss.product.service.LotDetailsService;

import lombok.extern.slf4j.Slf4j;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
@Slf4j
public class LotDetailsServiceImpl implements LotDetailsService{
	
	@Autowired
	private LotDetailsRepository lotDetailsRepo;
	
	@Autowired
	private LotMaterialDetailsRepository lotMaterialRepo;
	
	@Autowired
	private ItemStoneMappingRepositoryExt itemStoneRepo;
	
	@Autowired
	private ItemRepositoryExt itemMasterRepo;
	
	@Autowired
	private StoneRepositoryExt stoneRepoExt;
	
	@Autowired
	private MaterialRepositoryExt materialRepoExt;
	
	
	@Override
	public LotDetailsDto getLotDetailsService(LotDetailsReqDto lotDetailsReq) {
		LotDetailsDto responseDto=new LotDetailsDto();
		List<LotDetailsDao> stoneDetailsList=new ArrayList<>();
		List<LotMaterialDetailsDao> materialDetailsList=new ArrayList<>();
		List<ItemStoneMappingDaoExt> itemStoneMappingList=new ArrayList<>();
		if(lotDetailsReq.getLotDetailsList()!=null && !lotDetailsReq.getLotDetailsList().isEmpty()) {
			lotDetailsReq.getLotDetailsList().forEach(lot->{
				List<LotDetailsDao> stoneDao=lotDetailsRepo.findByLotDetailsIdItemItemCodeAndLotDetailsIdLotNumber(lot.getItemCode(),lot.getLotNumber());
				if(!stoneDao.isEmpty()) {
					stoneDetailsList.addAll(stoneDao);
				}
				List<LotMaterialDetailsDao> materialDao=lotMaterialRepo.findByLotDetailsIdItemItemCodeAndLotDetailsIdLotNumber(lot.getItemCode(),lot.getLotNumber());
				if(!materialDao.isEmpty()) {
					materialDetailsList.addAll(materialDao);
				}
				List<ItemStoneMappingDaoExt> itemStoneMapping=itemStoneRepo.findByItemItemCode(lot.getItemCode());
				if(!itemStoneMapping.isEmpty()) {
					itemStoneMappingList.addAll(itemStoneMapping);
				}
			});
		}
		if(!materialDetailsList.isEmpty())
			responseDto.setLotMaterialList(materialDetailsList);
		if(!stoneDetailsList.isEmpty())
			responseDto.setLotStoneList(stoneDetailsList);
		if(!itemStoneMappingList.isEmpty()) {
			List<ItemStoneMappingDto> itemStoneDtoList=new ArrayList<>();
			itemStoneMappingList.forEach(itemStone->{
				ItemStoneMappingDto itemStoneDto=(ItemStoneMappingDto)MapperUtil.getObjectMapping(itemStone, new ItemStoneMappingDto());
				itemStoneDto.setStoneCode(itemStone.getStone().getStoneCode());
				itemStoneDto.setItemCode(itemStone.getItem().getItemCode());
				itemStoneDtoList.add(itemStoneDto);
			});
			responseDto.setItemStoneMapping(itemStoneDtoList);
		}
		return responseDto;
	}

	@Override
	@Transactional
	public void updateLotDetailsService(LotNumberDetailReqDto lotNumberDetailReqDto) {
		List<LotNumberDetailsDto> lotnumberDetailsList = lotNumberDetailReqDto.getLotDetails();
		List<MultiMetalDetailsDto> multiMetalDetailsList = lotNumberDetailReqDto.getMultiMetalDetailsList();
		List<ItemStoneMappingDto> itemStoneDetailsList = lotNumberDetailReqDto.getItemStoneMappingList();

		List<LotDetailsDao> templLotnumberDetailsList = new ArrayList<LotDetailsDao>();
		List<LotMaterialDetailsDao> tempMaterialDaoList = new ArrayList<LotMaterialDetailsDao>();
		List<ItemStoneMappingDaoExt> tempItemStoneMappingList = new ArrayList<ItemStoneMappingDaoExt>();
		log.info("start lot details save>>>" + CalendarUtils.getCurrentDate());
		long start = System.currentTimeMillis(); 
		saveLotDetails(lotnumberDetailsList, multiMetalDetailsList, itemStoneDetailsList, templLotnumberDetailsList,
				tempMaterialDaoList, tempItemStoneMappingList);
		log.info("end lot details>>>" + CalendarUtils.getCurrentDate());
		long finish = System.currentTimeMillis();
		long timeElapsed = finish - start;
		log.info("Total Time Taken" + timeElapsed);
	}

	private void saveLotDetails(List<LotNumberDetailsDto> lotnumberDetailsList,
			List<MultiMetalDetailsDto> multiMetalDetailsList, List<ItemStoneMappingDto> itemStoneDetailsList,
			List<LotDetailsDao> templLotnumberDetailsList, List<LotMaterialDetailsDao> tempMaterialDaoList,
			List<ItemStoneMappingDaoExt> tempItemStoneMappingList) {
		long start;
		long finish;
		long timeElapsed;
		if (lotnumberDetailsList != null && !lotnumberDetailsList.isEmpty()) {
		
			List<String> itemCodes = lotnumberDetailsList.stream().map(it->it.getItemCode()).collect(Collectors.toList());
			List<String> lotNumbers = lotnumberDetailsList.stream().map(it->it.getLotNumber()).collect(Collectors.toList());
			List<String> stoneCodes = lotnumberDetailsList.stream().map(it->it.getStoneCode()).collect(Collectors.toList());
			
			start = System.currentTimeMillis(); 
			List<String> dbLotnumberDetailsList = lotDetailsRepo.fetchLotStoneDetails(itemCodes, lotNumbers, stoneCodes);
			 finish = System.currentTimeMillis();
			 timeElapsed = finish - start;
			log.info("Total Time Taken to Fetch" + timeElapsed);
			log.info("dbLotnumberDetailsList" + dbLotnumberDetailsList);
			List<LotNumberDetailsDto> finallotnumberDetailsList = new ArrayList<>();
			
			start = System.currentTimeMillis(); 
			ItemDao itemDao = null;
			StoneDao stoneDao = null;
			for (LotNumberDetailsDto lotNumberDetailsDto : lotnumberDetailsList) {
				if (!dbLotnumberDetailsList.contains(lotNumberDetailsDto.getItemCode())) {	
//					lotDetailsRepo.saveLotStoneDetails(lotNumberDetailsDto.getItemCode(),lotNumberDetailsDto.getLineItemNo(),
//							lotNumberDetailsDto.getLotNumber(),lotNumberDetailsDto.getNoOfStones(),lotNumberDetailsDto.getStoneCode(),
//							lotNumberDetailsDto.getStoneWeight(),"ct",CalendarUtils.getCurrentDate());
//					finallotnumberDetailsList.add(lotNumberDetailsDto);
					
					LotDetailsDao lotDetailsDao = new LotDetailsDao();
					LotDetailsIdDao lotDetailsIdDao = new LotDetailsIdDao();
					itemDao = itemMasterRepo.findOneByItemCode(lotNumberDetailsDto.getItemCode());
					stoneDao = stoneRepoExt.findOneByStoneCode(lotNumberDetailsDto.getStoneCode());
					if (itemDao != null) {
						lotDetailsIdDao.setItem(itemDao);
					} else {
						throw new ServiceException("No Item details found for the requested itemCode", "ERR-PRO-028",
								"itemCode : " + lotNumberDetailsDto.getItemCode());
					}
					if (stoneDao != null) {
						lotDetailsDao.setStone(stoneDao);
					} else {
						throw new ServiceException("No Stone details found for the requested stoneCode", "ERR-PRO-008",
								"stoneCode : " + lotNumberDetailsDto.getStoneCode());
					}
					lotDetailsIdDao.setLotNumber(lotNumberDetailsDto.getLotNumber());
					lotDetailsIdDao.setLineItemNo(lotNumberDetailsDto.getLineItemNo());
					lotDetailsDao.setLotDetailsId(lotDetailsIdDao);
					lotDetailsDao.setNoOfStones(lotNumberDetailsDto.getNoOfStones());
					lotDetailsDao.setStoneWeight(lotNumberDetailsDto.getStoneWeight());
					lotDetailsDao.setWeightUnit("ct");
					lotDetailsDao.setSyncTime(CalendarUtils.getCurrentDate().getTime());
					templLotnumberDetailsList.add(lotDetailsDao);
				}
			}
			
			if (!templLotnumberDetailsList.isEmpty()) {
				templLotnumberDetailsList = lotDetailsRepo.saveAll(templLotnumberDetailsList);
			}
			finish = System.currentTimeMillis();
			timeElapsed = finish - start;
			log.info("Total Time Taken to save" + timeElapsed);
		}

		if (multiMetalDetailsList != null && !multiMetalDetailsList.isEmpty()) {
			List<String> itemCodes = multiMetalDetailsList.stream().map(it -> it.getItemCode())
					.collect(Collectors.toList());
			List<String> lotNumbers = multiMetalDetailsList.stream().map(it -> it.getLotNumber())
					.collect(Collectors.toList());
			List<String> materialCodes = multiMetalDetailsList.stream().map(it -> it.getMultiMetalCode())
					.collect(Collectors.toList());
			start = System.currentTimeMillis();
			List<String> dbLotnumberDetailsList = lotMaterialRepo.fetchLotMaterialDetails(itemCodes, lotNumbers,
					materialCodes);
			
			log.info("dbLotnumberDetailsList" + dbLotnumberDetailsList);
			finish = System.currentTimeMillis();
			timeElapsed = finish - start;
			log.info("Total Time Taken to fetch multi meterial details" + timeElapsed);
			start = System.currentTimeMillis();
			for (MultiMetalDetailsDto multiMetalDetails : multiMetalDetailsList) {
				if (!dbLotnumberDetailsList.contains(multiMetalDetails.getItemCode())) {
//					lotMaterialRepo.saveMaterialsDetails(multiMetalDetails.getItemCode(),
//							multiMetalDetails.getLineItemNo(), multiMetalDetails.getLotNumber(),
//							multiMetalDetails.getMaterialWeight(), multiMetalDetails.getMultiMetalCode(),
//							multiMetalDetails.getNoOfMaterials(), CalendarUtils.getCurrentDate());
					LotMaterialDetailsDao lotMaterialDetailsDao = new LotMaterialDetailsDao();
					LotMaterialDetailsIdDao lotMaterialDetailsIdDao = new LotMaterialDetailsIdDao();
					ItemDao itemDao = itemMasterRepo.findOneByItemCode(multiMetalDetails.getItemCode());
					MaterialDao materialDaoDetails = materialRepoExt
							.findOneByMaterialCode(multiMetalDetails.getMultiMetalCode());
					if (itemDao != null) {
						lotMaterialDetailsIdDao.setItem(itemDao);
					} else {
						throw new ServiceException("No Item details found for the requested itemCode", "ERR-PRO-028",
								"itemCode : " + multiMetalDetails.getItemCode());
					}
					if (materialDaoDetails != null) {
						lotMaterialDetailsDao.setMaterial(materialDaoDetails);
					} else {
						throw new ServiceException(
								"No Material type details found for the requested material Type Code", "ERR-PRO-006",
								"materialCode : " + multiMetalDetails.getMultiMetalCode());
					}

					lotMaterialDetailsIdDao.setLotNumber(multiMetalDetails.getLotNumber());
					lotMaterialDetailsIdDao.setLineItemNo(multiMetalDetails.getLineItemNo());
					lotMaterialDetailsDao.setLotDetailsId(lotMaterialDetailsIdDao);

					lotMaterialDetailsDao.setMaterialWeight(multiMetalDetails.getMaterialWeight());
					lotMaterialDetailsDao.setNoOfMaterials(multiMetalDetails.getNoOfMaterials());
					lotMaterialDetailsDao.setWeightUnit("gms");
					lotMaterialDetailsDao.setSyncTime(CalendarUtils.getCurrentDate().getTime());
					tempMaterialDaoList.add(lotMaterialDetailsDao);
				}
			}
			if (!tempMaterialDaoList.isEmpty())
				lotMaterialRepo.saveAll(tempMaterialDaoList);
			finish = System.currentTimeMillis();
			timeElapsed = finish - start;
			log.info("Total Time Taken to save multi meterial details" + timeElapsed);
		}

		if (itemStoneDetailsList != null && !itemStoneDetailsList.isEmpty()) {
			List<String> itemCodes = itemStoneDetailsList.stream().map(it -> it.getItemCode())
					.collect(Collectors.toList());
			List<String> stoneCodes = itemStoneDetailsList.stream().map(it -> it.getStoneCode())
					.collect(Collectors.toList());
			start = System.currentTimeMillis();
			List<String> dbItemStoneDetailsList = itemStoneRepo.fetchItemStoneMapping(itemCodes, stoneCodes);
			log.info("dbItemStoneDetailsList" + dbItemStoneDetailsList);
			finish = System.currentTimeMillis();
			timeElapsed = finish - start;
			log.info("Total Time Taken to fetch itemStone details" + timeElapsed);
			start = System.currentTimeMillis();
			for (ItemStoneMappingDto itemStoneMappingDto : itemStoneDetailsList) {
				if (!dbItemStoneDetailsList.contains(itemStoneMappingDto.getItemCode())) {
//					itemStoneRepo.saveItemStoneDetails(UUID.randomUUID().toString(), itemStoneMappingDto.getItemCode(),
//							itemStoneMappingDto.getNoOfStones(), itemStoneMappingDto.getStoneCode(),
//							itemStoneMappingDto.getIsActive(), itemStoneMappingDto.getCreatedDate());
					ItemStoneMappingDaoExt itemStoneMappingDaoExt = new ItemStoneMappingDaoExt();
					ItemDao itemDao = itemMasterRepo.findOneByItemCode(itemStoneMappingDto.getItemCode());
					StoneDao stoneDao = stoneRepoExt.findOneByStoneCode(itemStoneMappingDto.getStoneCode());
					if (itemDao != null) {
						itemStoneMappingDaoExt.setItem(itemDao);
					} else {
						throw new ServiceException("No Item details found for the requested itemCode", "ERR-PRO-028",
								"itemCode : " + itemStoneMappingDto.getItemCode());
					}
					if (stoneDao != null) {
						itemStoneMappingDaoExt.setStone(stoneDao);
					} else {
						throw new ServiceException("No Stone details found for the requested stoneCode", "ERR-PRO-008",
								"stoneCode : " + itemStoneMappingDto.getStoneCode());
					}
					itemStoneMappingDaoExt.setId(UUID.randomUUID().toString());
					itemStoneMappingDaoExt.setNoOfStones(itemStoneMappingDto.getNoOfStones());
					itemStoneMappingDaoExt.setIsActive(itemStoneMappingDto.getIsActive());
					itemStoneMappingDaoExt.setSyncTime(CalendarUtils.getCurrentDate().getTime());
					tempItemStoneMappingList.add(itemStoneMappingDaoExt);
				}
			}
			if (!tempItemStoneMappingList.isEmpty())
				itemStoneRepo.saveAll(tempItemStoneMappingList);
			finish = System.currentTimeMillis();
			timeElapsed = finish - start;
			log.info("Total Time Taken to fetch itemStone details" + timeElapsed);
		}
	}
	
	@Override
	public void updateCutPieceLotDetailsService(LotDto lotNumberDetailReqDto) {
		List<LotDetailsDao> lotDetailsDaoList = lotDetailsRepo.findByLotDetailsIdItemItemCodeAndLotDetailsIdLotNumber(
				lotNumberDetailReqDto.getItemCode(), lotNumberDetailReqDto.getLotNumber());
		log.debug("lot stone details--->" + lotDetailsDaoList);
		
		List<LotDetailsDao> templLotnumberDetailsList = new ArrayList<>();
		if (lotDetailsDaoList != null && !lotDetailsDaoList.isEmpty()) {
			for (LotDetailsDao lotDetailsDao : lotDetailsDaoList) {
				LotDetailsDao lotDetailsDao1 = (LotDetailsDao) MapperUtil.getObjectMapping(lotDetailsDao, new LotDetailsDao(),"lotDetailsId");
				LotDetailsIdDao lotDetailsId = new LotDetailsIdDao();
				lotDetailsId.setItem(lotDetailsDao.getLotDetailsId().getItem());
				lotDetailsId.setLineItemNo(lotDetailsDao.getLotDetailsId().getLineItemNo());
				lotDetailsId.setLotNumber(lotDetailsDao.getLotDetailsId().getLotNumber() + "CP");
				lotDetailsDao1.setLotDetailsId(lotDetailsId);
				templLotnumberDetailsList.add(lotDetailsDao1);
			}
		}

		if(!templLotnumberDetailsList.isEmpty()) {
			log.debug("new lot stone details--->" + templLotnumberDetailsList);
			templLotnumberDetailsList = lotDetailsRepo.saveAll(templLotnumberDetailsList);
		}
		
	}

	@Override
	public List<LotDetailsDao> getLotDetailsList(List<LotDto> lotDtoList) {

		List<LotDetailsDao> lotDetailsDao = new ArrayList<>();
		for (LotDto lotDto : lotDtoList) {
			List<LotDetailsDao> lotDetailsList = lotDetailsRepo
					.findByLotDetailsIdItemCodeAndLotDetailsIdLotNumber(lotDto.getItemCode(), lotDto.getLotNumber());
			lotDetailsDao.addAll(lotDetailsList);
		}
		return lotDetailsDao;
	}

}
