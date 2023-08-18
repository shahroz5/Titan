/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.product.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.product.dao.ComplexityDao;
import com.titan.poss.product.dao.ComplexityPriceGroupDaoExt;
import com.titan.poss.product.dao.PriceGroupDao;
import com.titan.poss.product.dao.SyncStaging;
import com.titan.poss.product.dto.ComplexityPriceGroupMappingDto;
import com.titan.poss.product.dto.ComplexityPriceGroupSyncDtoExt;
import com.titan.poss.product.dto.request.CompPriceGrpCreateDto;
import com.titan.poss.product.dto.request.CompPriceGrpUpdateDto;
import com.titan.poss.product.dto.request.ComplexityPriceGroupMappingUploadDto;
import com.titan.poss.product.dto.response.BinToBinComplexityPriceGroupFileUploadDto;
import com.titan.poss.product.dto.response.ComplexitityPriceGroupDTOList;
import com.titan.poss.product.repository.ComplexityPriceGroupRepositoryExt;
import com.titan.poss.product.repository.ComplexityRepositoryExt;
import com.titan.poss.product.repository.PriceGroupRepositoryExt;
import com.titan.poss.product.repository.ProductSyncStagingRepository;
import com.titan.poss.product.service.ComplexityPriceGroupService;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("complexityPriceGroup")
@Slf4j
public class ComplexityPriceGroupServiceImpl implements ComplexityPriceGroupService {

	@Autowired
	private ComplexityPriceGroupRepositoryExt complexityPriceGroupRepository;

	@Autowired
	private PriceGroupRepositoryExt priceGroupRepository;

	@Autowired
	private ComplexityRepositoryExt complexityRepository;
	
	@Autowired
	private ProductSyncDataServiceImpl syncDataService;
	
	@Autowired
	private ProductSyncStagingRepository productSyncStagingRepository;
	
	@Autowired
	private ComplexityPriceGroupServiceImpl complexityPriceGroupService;

	public static final String FILE_TYPE = "text/csv";

	/**
	 * This API returns the list of Complexity price group mapping.
	 * 
	 * @param complexityCode
	 * @return PagedRestResponse<List<ComplexityPriceGroupMappingDto>>
	 */
	@Override
	public PagedRestResponse<List<ComplexityPriceGroupMappingDto>> listComplexityPriceGroup(String complexityCode,
			String priceGroup, Pageable pageable, Boolean isActive) {
		List<ComplexityPriceGroupMappingDto> complexityPriceGroupMappingDtoList = new ArrayList<>();

		ComplexityPriceGroupDaoExt complexityPriceGroup = new ComplexityPriceGroupDaoExt();
		complexityPriceGroupDepends(complexityPriceGroup, complexityCode, priceGroup);
		complexityPriceGroup.setIsActive(isActive);

		// if any null value comes then ignore null values
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ComplexityPriceGroupDaoExt> compExample = Example.of(complexityPriceGroup, matcher);

		Page<ComplexityPriceGroupDaoExt> complexityPriceGroupPage = complexityPriceGroupRepository.findAll(compExample,
				pageable);
		complexityPriceGroupPage.forEach(compPage -> {
			ComplexityPriceGroupMappingDto complexityPriceGroupMappingDto = (ComplexityPriceGroupMappingDto) MapperUtil
					.getObjectMapping(compPage, new ComplexityPriceGroupMappingDto());
			complexityPriceGroupMappingDto.setComplexityCode(compPage.getComplexity().getComplexityCode());
			complexityPriceGroupMappingDto.setPriceGroup(compPage.getPriceGroup().getPriceGroup());
			complexityPriceGroupMappingDtoList.add(complexityPriceGroupMappingDto);
		});
		return new PagedRestResponse<>(complexityPriceGroupMappingDtoList, complexityPriceGroupPage);
	}

	private ComplexityPriceGroupDaoExt complexityPriceGroupDepends(ComplexityPriceGroupDaoExt complexityPriceGroup,
			String complexityCode, String priceGroup) {
		ComplexityDao complexity = new ComplexityDao();
		complexity.setComplexityCode(complexityCode);
		PriceGroupDao pGroup = new PriceGroupDao();
		pGroup.setPriceGroup(priceGroup);
		complexityPriceGroup.setPriceGroup(pGroup);
		complexityPriceGroup.setComplexity(complexity);
		return complexityPriceGroup;
	}

	/**
	 * This method will return the particular data of Complexity price group mapping
	 * details.
	 * 
	 * @param id
	 * @param priceGroup
	 */
	@Override
	public ComplexityPriceGroupMappingDto getComplexityPriceGroup(String id) {

		// get ComplexityPriceGroup based on complexityCode & priceGroup
		Optional<ComplexityPriceGroupDaoExt> complexityPriceGrpOptional = complexityPriceGroupRepository.findById(id);

		// if no data is available then throw exception
		if (!complexityPriceGrpOptional.isPresent())
			throw new ServiceException(
					"No ComplexityProductGroupMapping details found for the requested complexityCode and productGroup",
					"ERR-PRO-026");
		ComplexityPriceGroupMappingDto complexityPriceGroupMappingDto = (ComplexityPriceGroupMappingDto) MapperUtil
				.getObjectMapping(complexityPriceGrpOptional.get(), new ComplexityPriceGroupMappingDto());
		complexityPriceGroupMappingDto
				.setComplexityCode(complexityPriceGrpOptional.get().getComplexity().getComplexityCode());
		complexityPriceGroupMappingDto.setPriceGroup(complexityPriceGrpOptional.get().getPriceGroup().getPriceGroup());
		return complexityPriceGroupMappingDto;
	}

	/**
	 * This method will save new Complexity price group mapping details.
	 * 
	 * @param CompPriceGrpCreateDto
	 * @return ComplexityPriceGroupMappingDto
	 */
	@Override
	public ComplexityPriceGroupMappingDto addComplexityPriceGroup(CompPriceGrpCreateDto compPriceGrpCreateDto) {
		// get complexity based on complexityCode
		ComplexityDao complexity = complexityRepository.findOneByComplexityCode(compPriceGrpCreateDto.getComplexityCode());
		if (complexity == null)
			throw new ServiceException("No Complexity details found for the requested complexityCode", "ERR-PRO-003");

		// get priceGroup based on priceGroup
		PriceGroupDao priceGroup = priceGroupRepository.findOneByPriceGroup(compPriceGrpCreateDto.getPriceGroup());
		if (priceGroup == null)
			throw new ServiceException("No PriceGroup details found for the requested priceGroup", "ERR-PRO-011");

		ComplexityPriceGroupDaoExt complexityPriceGroup1 = new ComplexityPriceGroupDaoExt();
		complexityPriceGroupDepends(complexityPriceGroup1, compPriceGrpCreateDto.getComplexityCode(),
				compPriceGrpCreateDto.getPriceGroup());
		Optional<ComplexityPriceGroupDaoExt> complexityPriceGrpOptional = complexityPriceGroupRepository
				.findByComplexityAndPriceGroup(complexityPriceGroup1.getComplexity(),
						complexityPriceGroup1.getPriceGroup());

		if (complexityPriceGrpOptional.isPresent())
			throw new ServiceException("Duplicate value insertion", "ERR-CORE-012");

		ComplexityPriceGroupDaoExt complexityPriceGroup = new ComplexityPriceGroupDaoExt();
		if (compPriceGrpCreateDto.getMakingChargePct() != null)
			complexityPriceGroup.setMakingChargePct(compPriceGrpCreateDto.getMakingChargePct());
		else {
			complexityPriceGroup.setMakingChargePct(BigDecimal.ZERO);
		}
		if (compPriceGrpCreateDto.getMakingChargePgram() != null)
			complexityPriceGroup.setMakingChargePgram(compPriceGrpCreateDto.getMakingChargePgram());
		else {
			complexityPriceGroup.setMakingChargePgram(BigDecimal.ZERO);
		}
		if (compPriceGrpCreateDto.getMakingChargePunit() != null)
			complexityPriceGroup.setMakingChargePunit(compPriceGrpCreateDto.getMakingChargePunit());
		else {
			complexityPriceGroup.setMakingChargePunit(BigDecimal.ZERO);
		}
		complexityPriceGroup.setPriceGroup(priceGroup);
		complexityPriceGroup.setComplexity(complexity);
		complexityPriceGroup.setWastagePct(compPriceGrpCreateDto.getWastagePct());

		complexityPriceGroup.setSrcSyncId(0);
		complexityPriceGroup.setDestSyncId(0);
		SyncStagingDto data = complexityPriceGroupService.complexityPriceGroup(complexityPriceGroup,
				ProductOperationCodes.COMPLEXITY_PRICEGROUP_ADD);

		// Publishing to data sync queue
		syncDataService.publishProductMessagesToQueue(data);

		ComplexityPriceGroupMappingDto complexityPriceGroupMappingDto = (ComplexityPriceGroupMappingDto) MapperUtil
				.getObjectMapping(complexityPriceGroup, new ComplexityPriceGroupMappingDto());
		complexityPriceGroupMappingDto.setComplexityCode(complexityPriceGroup.getComplexity().getComplexityCode());
		complexityPriceGroupMappingDto.setPriceGroup(complexityPriceGroup.getPriceGroup().getPriceGroup());
		return complexityPriceGroupMappingDto;
	}

	/**
	 * This method will update existing Complexity price group mapping details.
	 * 
	 * @param id
	 * @param CompPriceGrpUpdateDto
	 * @return ComplexityPriceGroupMappingDto
	 */
	@Override
	public ComplexityPriceGroupMappingDto updateComplexityPriceGroup(String id,
			CompPriceGrpUpdateDto compPriceGrpUpdateDto) {
		ComplexityPriceGroupDaoExt complexityPriceGroup;

		Optional<ComplexityPriceGroupDaoExt> complexityPriceGrpOptional = complexityPriceGroupRepository.findById(id);
		if (!complexityPriceGrpOptional.isPresent())
			throw new ServiceException(
					"No ComplexityProductGroupMapping details found for the requested complexityCode and productGroup",
					"ERR-PRO-026");
		complexityPriceGroup = complexityPriceGrpOptional.get();
		complexityPriceGroup = (ComplexityPriceGroupDaoExt) MapperUtil.getObjectMapping(compPriceGrpUpdateDto,
				complexityPriceGroup);
		complexityPriceGroup.setSrcSyncId(complexityPriceGroup.getSrcSyncId() + 1);
		SyncStagingDto data = complexityPriceGroupService.complexityPriceGroup(complexityPriceGroup,
				ProductOperationCodes.COMPLEXITY_PRICEGROUP_UPDATE);

		// Publishing to data sync queue
		syncDataService.publishProductMessagesToQueue(data);
		ComplexityPriceGroupMappingDto complexityPriceGroupMappingDto = (ComplexityPriceGroupMappingDto) MapperUtil
				.getObjectMapping(complexityPriceGroup, new ComplexityPriceGroupMappingDto());
		complexityPriceGroupMappingDto.setComplexityCode(complexityPriceGroup.getComplexity().getComplexityCode());
		complexityPriceGroupMappingDto.setPriceGroup(complexityPriceGroup.getPriceGroup().getPriceGroup());
		return complexityPriceGroupMappingDto;
	}
	
	/**
	 * @param ComplexityPriceGroupDaoExt
	 * @return
	 */
	@Transactional
	public SyncStagingDto complexityPriceGroup(ComplexityPriceGroupDaoExt complexityPriceGroupDaoExt,
			String operation) {
		complexityPriceGroupDaoExt = complexityPriceGroupRepository.save(complexityPriceGroupDaoExt);
		List<SyncData> compPrcGroupSyncData = new ArrayList<>();
		ComplexityPriceGroupSyncDtoExt complexityPriceGroupSyncDto = new ComplexityPriceGroupSyncDtoExt(complexityPriceGroupDaoExt);
		compPrcGroupSyncData.add(DataSyncUtil.createSyncData(complexityPriceGroupSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest msgRequest = DataSyncUtil.createMessageRequest(compPrcGroupSyncData, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		SyncStagingDto stagingDto = new SyncStagingDto();
		stagingDto.setMessageRequest(msgRequest);
		String requestBody = MapperUtil.getJsonString(msgRequest);
		SyncStaging staggingMsg = new SyncStaging();
		staggingMsg.setMessage(requestBody);
		staggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		staggingMsg = productSyncStagingRepository.save(staggingMsg);
		stagingDto.setId(staggingMsg.getId());
		return stagingDto;
	}
	
//	@Override
//	public ComplexitityPriceGroupDTOList uploadFile(MultipartFile reqFile) {
//		// TODO Auto-generated method stub
//		ComplexitityPriceGroupDTOList itemsList = new ComplexitityPriceGroupDTOList();
//		
//		List<ComplexityPriceGroupMappingDto> coList = new ArrayList<>();
//
//		
//		//log.info("Till here reaching...");
//		if (hasExcelFormat(reqFile)) {
//			try {
//				List<BinToBinComplexityPriceGroupFileUploadDto> binValues = new ArrayList<>();
//				List<String[]> getCsvData = new ArrayList<>();
//				getCsvData = FileUtil.readCSVFile(reqFile, ' ');
//				for (String[] a : getCsvData) {
//					BinToBinComplexityPriceGroupFileUploadDto uploadedItems = new BinToBinComplexityPriceGroupFileUploadDto();
//					for (String ab : a) {
//						String[] values = ab.split(",");
//						uploadedItems.setComplexityCode(values[0]);
//						uploadedItems.setPriceGroup(values[1]);
//						uploadedItems.setMakingChargePunit(new BigDecimal(values[2]));
//						uploadedItems.setMakingChargePgram(new BigDecimal(values[3]));
//						//uploadedItems.setIs(values[8]);
//						uploadedItems.setMakingChargePct(new BigDecimal(values[10]));
//						uploadedItems.setWastagePct(new BigDecimal(values[9]));
//						binValues.add(uploadedItems);
//					}
//				}
//				
//				for (BinToBinComplexityPriceGroupFileUploadDto compPriceGrpCreateDto : binValues) {
//					ComplexityDao complexity = complexityRepository.findOneByComplexityCode(compPriceGrpCreateDto.getComplexityCode());
//					if (complexity == null)
//						throw new ServiceException("No Complexity details found for the requested complexityCode", "ERR-PRO-003");
//
//					// get priceGroup based on priceGroup
//					PriceGroupDao priceGroup = priceGroupRepository.findOneByPriceGroup(compPriceGrpCreateDto.getPriceGroup());
//					if (priceGroup == null)
//						throw new ServiceException("No PriceGroup details found for the requested priceGroup", "ERR-PRO-011");
//
//					ComplexityPriceGroupDaoExt complexityPriceGroup1 = new ComplexityPriceGroupDaoExt();
//					complexityPriceGroupDepends(complexityPriceGroup1, compPriceGrpCreateDto.getComplexityCode(),
//							compPriceGrpCreateDto.getPriceGroup());
//					Optional<ComplexityPriceGroupDaoExt> complexityPriceGrpOptional = complexityPriceGroupRepository
//							.findByComplexityAndPriceGroup(complexityPriceGroup1.getComplexity(),
//									complexityPriceGroup1.getPriceGroup());
//
//					if (complexityPriceGrpOptional.isPresent())
//						throw new ServiceException("Duplicate value insertion", "ERR-CORE-012");
//
//					ComplexityPriceGroupDaoExt complexityPriceGroup = new ComplexityPriceGroupDaoExt();
//					if (compPriceGrpCreateDto.getMakingChargePct() != null)
//						complexityPriceGroup.setMakingChargePct(compPriceGrpCreateDto.getMakingChargePct());
//					else {
//						complexityPriceGroup.setMakingChargePct(BigDecimal.ZERO);
//					}
//					if (compPriceGrpCreateDto.getMakingChargePgram() != null)
//						complexityPriceGroup.setMakingChargePgram(compPriceGrpCreateDto.getMakingChargePgram());
//					else {
//						complexityPriceGroup.setMakingChargePgram(BigDecimal.ZERO);
//					}
//					if (compPriceGrpCreateDto.getMakingChargePunit() != null)
//						complexityPriceGroup.setMakingChargePunit(compPriceGrpCreateDto.getMakingChargePunit());
//					else {
//						complexityPriceGroup.setMakingChargePunit(BigDecimal.ZERO);
//					}
//					/*
//					 * if (compPriceGrpCreateDto.getIs() != null)
//					 * complexityPriceGroup.setMakingChargePunit(compPriceGrpCreateDto.
//					 * getMakingChargePunit()); else {
//					 * complexityPriceGroup.setMakingChargePunit(BigDecimal.ZERO); }
//					 */
//
//					complexityPriceGroup.setPriceGroup(priceGroup);
//					complexityPriceGroup.setComplexity(complexity);
//					complexityPriceGroup.setWastagePct(compPriceGrpCreateDto.getWastagePct());
//
//					complexityPriceGroup.setSrcSyncId(0);
//					complexityPriceGroup.setDestSyncId(0);
//					SyncStagingDto data = complexityPriceGroupService.complexityPriceGroup(complexityPriceGroup,
//							ProductOperationCodes.COMPLEXITY_PRICEGROUP_ADD);
//
//					// Publishing to data sync queue
//					syncDataService.publishProductMessagesToQueue(data);
//
//					ComplexityPriceGroupMappingDto complexityPriceGroupMappingDto = (ComplexityPriceGroupMappingDto) MapperUtil
//							.getObjectMapping(complexityPriceGroup, new ComplexityPriceGroupMappingDto());
//					complexityPriceGroupMappingDto.setComplexityCode(complexityPriceGroup.getComplexity().getComplexityCode());
//					complexityPriceGroupMappingDto.setPriceGroup(complexityPriceGroup.getPriceGroup().getPriceGroup());
//					coList.add(complexityPriceGroupMappingDto);
//							//}
//						}
//
//			} catch (Exception e) {
//				throw new RuntimeException("fail to parse Excel file ");
//			}
//		} else {
//			throw new RuntimeException("Invalid file type");
//		}
//		itemsList.setItems(coList);
//		return itemsList;
//	}
//	public static boolean hasExcelFormat(MultipartFile file) {
//	    if (!FILE_TYPE.equals(file.getContentType())) {
//	      return false;
//	    }
//	    return true;
//	  }

	@Override
	@Transactional
	public ComplexitityPriceGroupDTOList uploadFile(MultipartFile reqFile) {
		// TODO Auto-generated method stub
		ComplexitityPriceGroupDTOList itemsList = new ComplexitityPriceGroupDTOList();
		HashMap<String, String> err = new HashMap<>();
		List<ComplexityPriceGroupMappingUploadDto> coList = new ArrayList<>();
		
		if (hasExcelFormat(reqFile)) {
			List<String[]> getCsvDataHeader = FileUtil.readCSVFileHeader(reqFile, ' ');
			ArrayList<String> alHeader = new ArrayList<>(Arrays.asList(getCsvDataHeader.get(0)));
			
			String validHeaders = new String("Complexitycode,Pricegroup,MakingChargesPerUnit,Makingchargespergram,IsActive,Wastagepercentage,MakingChargePercentage");
			if (!(alHeader.get(0).toString().trim().equals(validHeaders.trim()))) {
				throw new ServiceException("Wrong file format! Please use Download Format button for correct format", "ERR-PRO-049");
			}
			
			
				List<BinToBinComplexityPriceGroupFileUploadDto> binValues = new ArrayList<>();
				List<String[]> getCsvData = new ArrayList<>();
				getCsvData = FileUtil.readCSVFile(reqFile, ' ');
				for (String[] a : getCsvData) {
					BinToBinComplexityPriceGroupFileUploadDto uploadedItems = new BinToBinComplexityPriceGroupFileUploadDto();
					for (String ab : a) {
						String[] values = ab.split(",");
						if (values.length > 0 ) {
							if (values[0] == null || values[0].toString().isEmpty()) {
								throw new ServiceException("Complexity column is blank", "ERR-PRO-042");
							}else {
								uploadedItems.setComplexityCode(values[0]);
							}
							if (values[1] == null || values[1].toString().isEmpty()) {
								throw new ServiceException("Price group column is blank", "ERR-PRO-039");
							}else {
								uploadedItems.setPriceGroup(values[1]);
							}
							if (values.length == 2 || values[2] == null || values[2].toString().isEmpty()) {	
								throw new ServiceException("Making charge per unit column is blank", "ERR-PRO-045");
							}else {
								if(new BigDecimal(values[2]).compareTo(BigDecimal.ZERO) == 0)
								{
									uploadedItems.setMakingChargePunit(BigDecimal.ZERO);
								}
								else {
									uploadedItems.setMakingChargePunit(new BigDecimal(values[2]));
								}
							}
							if (values.length == 3 || values[3] == null || values[3].toString().isEmpty()) {  	
								throw new ServiceException("Making charge per gram column is blank", "ERR-PRO-046");
							}else {

								if(new BigDecimal(values[3]).compareTo(BigDecimal.ZERO) == 0)
								{
									uploadedItems.setMakingChargePgram(BigDecimal.ZERO);
								}
								else {
									uploadedItems.setMakingChargePgram(new BigDecimal(values[3]));
								}
							}
							Boolean b = values[4].equals("1") ? true : false;
							uploadedItems.setIsActive(b);

							if(values.length == 5 || StringUtils.isEmpty(values[5]) || values[5] == null || values[5] == "") 
							{
								throw new ServiceException("Missing mandatory input parameter wastage percentage", "ERR-PRO-035");
							}
							else 
							{
								//uploadedItems.setWastagePct(new BigDecimal(values[9]));
								// Pattern p = Pattern.compile("[^0-9]");
								Pattern p = Pattern.compile("^[\\d]*[\\.]?[\\d]*$");
								Matcher m = p.matcher(values[5]);
								boolean isSpecialCharacter = m.find();
								if(isSpecialCharacter) {
									uploadedItems.setWastagePct(new BigDecimal(values[5]));
								}
								else {
									throw new ServiceException("WastagePercentage has special characters","ERR-PRO-038");
								}
							}
							binValues.add(uploadedItems);
						}

							
							if (values.length == 6 ||  values[6] == null || values[6].toString().isEmpty()) {	
								throw new ServiceException("Making charge percent column is blank", "ERR-PRO-047");
							}else {
								if(new BigDecimal(values[6]).compareTo(BigDecimal.ZERO) == 0) 
								{
									uploadedItems.setMakingChargePct(BigDecimal.ZERO);
								}
								else 
								{
									uploadedItems.setMakingChargePct(new BigDecimal(values[6]));
								}
							}

					}
				}
				
				List<String> complexityList = new ArrayList<>();
				List<String> priceGroupList = new ArrayList<>();
				for (BinToBinComplexityPriceGroupFileUploadDto compPriceGrpCreateDto : binValues) {
					complexityList.add(compPriceGrpCreateDto.getComplexityCode());
					priceGroupList.add(compPriceGrpCreateDto.getPriceGroup());
				}
				
				List<ComplexityDao> comList = complexityRepository.findAllById(complexityList);
				List<PriceGroupDao> prList = priceGroupRepository.findAllById(priceGroupList);
				//List<ComplexityDao> compListInActive = complexityRepository.findAllComplexityCode(complexityList);
				//log.debug("compListInActive "+compListInActive);
		        List<String> availableComplexityList = comList.stream().map(c -> c.getComplexityCode()).collect(Collectors.toList());
		        List<String> availablePriceGroupList = prList.stream().map(p -> p.getPriceGroup()).collect(Collectors.toList());
		        List<String> inActiveComplexityList = comList.stream().filter(c-> c.getIsActive().equals(false)).map(c -> c.getComplexityCode()).collect(Collectors.toList());
		        List<String> inActivePriceGroupList = prList.stream().filter(c-> c.getIsActive().equals(false)).map(p -> p.getPriceGroup()).collect(Collectors.toList());
		       
		        
		        List<String> notAvailableComplexityList = new ArrayList<>(complexityList);
				notAvailableComplexityList.removeAll(availableComplexityList);
				
				List<String> notAvailablePriceGroupList = new ArrayList<>(priceGroupList);
				notAvailablePriceGroupList.removeAll(availablePriceGroupList);

				//availablePriceGroupList.remove(String.valueOf(inActivePriceGroupList));
				for (BinToBinComplexityPriceGroupFileUploadDto compPriceGrpCreateDto : binValues) {
					SyncStagingDto data = null;
					if((!availableComplexityList.isEmpty() && availableComplexityList.contains(compPriceGrpCreateDto.getComplexityCode())) &&(!availablePriceGroupList.isEmpty() && availablePriceGroupList.contains(compPriceGrpCreateDto.getPriceGroup())) ) {
						
					ComplexityPriceGroupDaoExt complexityPriceGroup;
					ComplexityPriceGroupDaoExt complexityPriceGroup1 = new ComplexityPriceGroupDaoExt();
					
					complexityPriceGroupDepends(complexityPriceGroup1, compPriceGrpCreateDto.getComplexityCode(),
							compPriceGrpCreateDto.getPriceGroup());
					
					Optional<ComplexityPriceGroupDaoExt> complexityPriceGrpOptional = complexityPriceGroupRepository
							.findByComplexityAndPriceGroup(complexityPriceGroup1.getComplexity(),
									complexityPriceGroup1.getPriceGroup());
					
					if (!complexityPriceGrpOptional.isPresent()) {
						complexityPriceGroup = new ComplexityPriceGroupDaoExt();
						complexityPriceGroup.setComplexity(complexityPriceGroup1.getComplexity());
						complexityPriceGroup.setPriceGroup(complexityPriceGroup1.getPriceGroup());
						complexityPriceGroup.setMakingChargePct(compPriceGrpCreateDto.getMakingChargePct());
						complexityPriceGroup.setMakingChargePgram(compPriceGrpCreateDto.getMakingChargePgram());
						complexityPriceGroup.setMakingChargePunit(compPriceGrpCreateDto.getMakingChargePunit());
						complexityPriceGroup.setIsActive(compPriceGrpCreateDto.getIsActive());
						complexityPriceGroup.setWastagePct(compPriceGrpCreateDto.getWastagePct());
						complexityPriceGroup.setSrcSyncId(0);
						complexityPriceGroup.setDestSyncId(0);
						data = complexityPriceGroupService.complexityPriceGroup(complexityPriceGroup,
								ProductOperationCodes.COMPLEXITY_PRICEGROUP_ADD);
						
					} 
					else {
						complexityPriceGroup = complexityPriceGrpOptional.get();

					if (compPriceGrpCreateDto.getMakingChargePct() != null)
						complexityPriceGroup.setMakingChargePct(compPriceGrpCreateDto.getMakingChargePct());
					else {
						complexityPriceGroup.setMakingChargePct(BigDecimal.ZERO);
					}
					if (compPriceGrpCreateDto.getMakingChargePgram() != null)
						complexityPriceGroup.setMakingChargePgram(compPriceGrpCreateDto.getMakingChargePgram());
					else {
						complexityPriceGroup.setMakingChargePgram(BigDecimal.ZERO);
					}
					if (compPriceGrpCreateDto.getMakingChargePunit() != null)
						complexityPriceGroup.setMakingChargePunit(compPriceGrpCreateDto.getMakingChargePunit());
					else {
						complexityPriceGroup.setMakingChargePunit(BigDecimal.ZERO);
					}
					
					if (compPriceGrpCreateDto.getIsActive() != null)
					    complexityPriceGroup.setIsActive(compPriceGrpCreateDto.getIsActive()); 
					else {
					    complexityPriceGroup.setIsActive(false); 
					}

					complexityPriceGroup.setPriceGroup(complexityPriceGroup1.getPriceGroup());
					complexityPriceGroup.setComplexity(complexityPriceGroup1.getComplexity());
					complexityPriceGroup.setWastagePct(compPriceGrpCreateDto.getWastagePct());

					complexityPriceGroup.setSrcSyncId(complexityPriceGroup.getSrcSyncId() + 1);
					data = complexityPriceGroupService.complexityPriceGroup(complexityPriceGroup,
							ProductOperationCodes.COMPLEXITY_PRICEGROUP_UPDATE);
					}
					// Publishing to data sync queue
					syncDataService.publishProductMessagesToQueue(data);

					ComplexityPriceGroupMappingUploadDto complexityPriceGroupMappingUploadDto = (ComplexityPriceGroupMappingUploadDto) MapperUtil
							.getObjectMapping(complexityPriceGroup, new ComplexityPriceGroupMappingUploadDto());
					complexityPriceGroupMappingUploadDto.setComplexityCode(complexityPriceGroup.getComplexity().getComplexityCode());
					complexityPriceGroupMappingUploadDto.setPriceGroup(complexityPriceGroup.getPriceGroup().getPriceGroup());
					complexityPriceGroupMappingUploadDto.setIsActive(complexityPriceGroup.getIsActive());
					coList.add(complexityPriceGroupMappingUploadDto);
					}
				}
				if(!notAvailableComplexityList.isEmpty() || !notAvailablePriceGroupList.isEmpty()) {
					itemsList.setNotAvailableComplexityList(notAvailableComplexityList);
					itemsList.setNotAvailablePriceGroupList(notAvailablePriceGroupList);
					
						if(!notAvailableComplexityList.isEmpty()) {
						String s = notAvailableComplexityList.toString()+" complexity code is not available ";
						err.put("errorCodeNotAvailablecomplexitycode","ERR-PRO-042");
						err.put("messageNotAvailablecomplexitycode",s);
						
					}
						if(!notAvailablePriceGroupList.isEmpty()) {
							String s = notAvailablePriceGroupList.toString()+" price group is not available in price group master ";
							err.put("errorCodeNotAvailablePriceGroup","ERR-PRO-041");
							err.put("messageNotAvailablePriceGroup",s);
						}
				} else {
					itemsList.setNotAvailableComplexityList(notAvailableComplexityList);
					itemsList.setNotAvailablePriceGroupList(notAvailablePriceGroupList);

				}
				
				if (!inActiveComplexityList.isEmpty()) {
					String s = inActiveComplexityList.toString()+" complexitycode is inActive";
					err.put("errorCodeInActivecomplexitycode","ERR-PRO-043");
					err.put("messageInActivecomplexitycode",s);
					throw new ServiceException("Complexity code is Inactive", "ERR-PRO-043");
				}
				
				if (!inActivePriceGroupList.isEmpty()) {
					String s = inActivePriceGroupList.toString()+" price group is inActive";
					err.put("errorCodeInActivePriceGroupList","ERR-PRO-040");
					err.put("messageInActivePriceGroupList",s);
				}
		} else {
			throw new ServiceException("Invalid file type", "ERR-PRO-036");
		}
		itemsList.setItems(coList);
		itemsList.setErr(err);
		return itemsList;
	}
	public static boolean hasExcelFormat(MultipartFile file) {
	    if (!FILE_TYPE.equals(file.getContentType())) {
	      return false;
	    }
	    return true;
	  }
}
