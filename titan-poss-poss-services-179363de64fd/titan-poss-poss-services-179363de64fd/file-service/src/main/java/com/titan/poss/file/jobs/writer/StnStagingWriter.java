/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.apache.commons.lang3.StringUtils;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.StnStageDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.FileAuditService;
import com.titan.poss.file.service.StnValidationService;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.repository.LocationRepository;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.repository.ItemRepository;
import com.titan.poss.product.repository.ProductGroupRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class StnStagingWriter implements ItemWriter<StnStageDto> {

	@Autowired
	private StnJobWriter stnJobWriter;

	@Autowired
	private StnValidationService stnValidationService;

	@Autowired
	private DataAuditService dataAuditService;

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private LocationRepository locationRepository;

	@Autowired
	private ProductGroupRepository productGroupRepository;

	@Autowired
	private ItemRepository itemRepository;
	private static final Logger LOGGER = LoggerFactory.getLogger(StnStagingWriter.class);
	private static final String INCORRECT_FILE_FORMAT = "file is not in proper format";

	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends StnStageDto> list) throws Exception {

		List<StnStageDto> items = (List<StnStageDto>) list;

		List<StnStageDto> stnHdrList = new ArrayList<>();
		List<StnStageDto> stnDtlList = new ArrayList<>();
		List<StnStageDto> stnLdtlList = new ArrayList<>();
		List<StnStageDto> stnMdtlList = new ArrayList<>();

		// validating file format
		if (validateFileFormat(items)) {
			for (int index = 0; index < items.size(); index++) {
				if (items.get(index).getType().equalsIgnoreCase("HDR")) {
					processHdrData(items.get(index), stnHdrList, items, index);
				} else if (items.get(index).getType().equalsIgnoreCase("DTL")) {
					processDtlData(items.get(index), stnDtlList, items, index);
				} else if (items.get(index).getType().equalsIgnoreCase("LDTL")) {
					processLdtlData(items.get(index), stnLdtlList, items, index);
				} else if (items.get(index).getType().equalsIgnoreCase("MDTL")) {
					processMdtlData(items.get(index), stnMdtlList, items, index);
				}
			}
			writeDataToStagingTable(stnHdrList, stnDtlList, stnLdtlList, stnMdtlList);
		}
	}

	private void processHdrData(StnStageDto stn, List<StnStageDto> stnHdrList, List<StnStageDto> items, int index) {
		List<StnStageDto> subList = items.subList(0, index + 1);
		if (stnValidationService.validateHdrService(stn)) {
			stn.setHdrCreatedDate(getCreatedDate(subList));
			stnHdrList.add(stn);
		}
	}

	private void processDtlData(StnStageDto stn, List<StnStageDto> stnDtlList, List<StnStageDto> items, int index) {
		List<StnStageDto> subList = items.subList(0, index + 1);
		ProductGroupDao productDtls = null;
		ItemDao itemDao = null;
//		LOGGER.info("STN data: " + stn);
//		LOGGER.info("Hallmark is set in method processDtlData() ------------------------------------------------");
		if (stnValidationService.validateDtlService(stn)) {
			stn.setDtlCreatedBy(getCrtdByFromHdr(subList));
			stn.setDtlCreatedDate(getCreatedDate(subList));
			if (validateDtlData(items.get(index), items.subList(index, items.size()))) {
				// LocationDao locationDao =
				// locationRepository.findOneByLocationCode(stn.getLocation())
				// if it is not hallmarked, then moving it hall mark dispute bin
//
//				LOGGER.info("Item deails Json   ------------- : " + stn.getDtlItemDetails());
//				LOGGER.info("Item deails Json   ------------- : " + stn.getDtlItemDetails().toString());
				JsonObject jsonObjStnDtl = new JsonParser().parse(stn.getDtlItemDetails()).getAsJsonObject();
				// Map<String, Object> itemDetails = new HashMap<>();

				if (BooleanUtils.isNotTrue(stn.isDtlIsHallMarking())) {
					LocationDao locationDao = locationRepository.findOneByLocationCode(stn.getLocation());
					JsonObject jsonObj = new JsonParser().parse(locationDao.getStoreDetails()).getAsJsonObject();
					Boolean isHallMarkEnabled = jsonObj.getAsJsonObject("data").get("isHallmarkingEnabled")
							.getAsBoolean();
			//		LOGGER.info("Location hallmark config dtl :" + isHallMarkEnabled);
					if (isHallMarkEnabled) { // First location check hallmarking{
						//LOGGER.info("inside Location hallmark config dtl ");
						productDtls = productGroupRepository.findByProductGroupCodeAndIsActive(stn.getProductGroup(),
								true);
						//LOGGER.info("Product Dtls :" + productDtls);
						JsonObject jsonObjProDtl = new JsonParser().parse(productDtls.getConfigDetails())
								.getAsJsonObject();
						Boolean isHallMarked = jsonObjProDtl.getAsJsonObject("data").get("isHallmarked").getAsBoolean();
						BigDecimal hallmarkingExcludeGrams = jsonObjProDtl.getAsJsonObject("data")
								.get("hallmarkingExcludeGrams").getAsBigDecimal();
						List<BigDecimal> listHallMarkdataExKarat = new ArrayList<>();
						if (jsonObjProDtl.getAsJsonObject("data").get("hallmarkingExcludeKarat").isJsonArray()) {
							JsonArray hallmarkingExcludeKarat = jsonObjProDtl.getAsJsonObject("data")
									.get("hallmarkingExcludeKarat").getAsJsonArray();

							if (hallmarkingExcludeKarat != null) {
								for (int i = 0; i < hallmarkingExcludeKarat.size(); i++) {
									listHallMarkdataExKarat.add(hallmarkingExcludeKarat.get(i).getAsBigDecimal());
								}
							}
						}
						//LOGGER.info("Product hallmark config dtl :" + isHallMarked + " : HallmarkExGram "
						//	+ hallmarkingExcludeGrams);
						//LOGGER.info("StnDtlWt : " + new BigDecimal(stn.getDtlProductQty())
						//		.divide(new BigDecimal(stn.getDtlProductQty())));
						
						if (isHallMarked && hallmarkingExcludeGrams.compareTo(new BigDecimal(stn.getDtlProductWt())
								.divide(new BigDecimal(stn.getDtlProductQty()))) < 0) {
//							LOGGER.info("Inside exclude gram & isHallmarking enabled");
//							LOGGER.info("ITEM CODE : "+stn.getDtlProductCode());
							itemDao = itemRepository.findByItemCodeAndIsActive(stn.getDtlProductCode(), true);
//							LOGGER.info("ItemDao : "+itemDao);
//							LOGGER.info("Item Karat :" + itemDao.getKarat());
//							LOGGER.info("List hallMarkEx Karat :" + listHallMarkdataExKarat);
							if (!listHallMarkdataExKarat.contains(itemDao.getKarat().setScale(0,BigDecimal.ROUND_DOWN))) {
							//	LOGGER.info("inside exclude Karat");
								stn.setDtlBinCode("HALLMARKDISPUTEBIN");
								stn.setDtlBinGroupCode("HALLMARKDISPUTEBIN");
							} else {
								//LOGGER.info("ItemKarat " + itemDao.getKarat());
								stn.setDtlItemDetails(getItemDetailsHallMarkEligibleJson(jsonObjStnDtl));
							}

						} else {
							//LOGGER.info("Ishallmarked (location) " + isHallMarked + "HallmarkExGram "
							//		+ hallmarkingExcludeGrams);
							stn.setDtlItemDetails(getItemDetailsHallMarkEligibleJson(jsonObjStnDtl));
						}
					} else {
//						LOGGER.info("Ishallmarked Based on location " + isHallMarkEnabled);
//						stn.setDtlItemDetails(getItemDetailsHallMarkEligibleJson(jsonObjStnDtl));

					}
				}
			//	LOGGER.info("Stn Ishallmarking " + stn.isDtlIsHallMarking());
				// stn.setDtlItemDetails(getItemDetailsHallMarkEligibleJson(jsonObjStnDtl));
				// //setting
				stnDtlList.add(stn);
			}
		}
	}

	public String getItemDetailsHallMarkEligibleJson(JsonObject jsonObjStnDtl) {

		String hallmarkingDate = null;
		if (!jsonObjStnDtl.getAsJsonObject("data").get("hallMarkedDate").isJsonNull()) {
			hallmarkingDate = jsonObjStnDtl.getAsJsonObject("data").get("hallMarkedDate").getAsString();
		}
		Date hallMarkDate = StringUtils.isEmpty(hallmarkingDate) ? null
				: CalendarUtils.convertStringToDate(hallmarkingDate, "yyyyMMdd");
		String hallMarkDateString = hallMarkDate == null ? null
				: CalendarUtils.formatDateToString(hallMarkDate, "yyyy-MM-dd");
		Map<String, Object> itemDetails = new HashMap<>();
		itemDetails.put("stoneValue", jsonObjStnDtl.getAsJsonObject("data").get("stoneValue").getAsString());
		itemDetails.put("isHallMarking", jsonObjStnDtl.getAsJsonObject("data").get("isHallMarking").getAsBoolean());
		itemDetails.put("hallMarkingCode", jsonObjStnDtl.getAsJsonObject("data").get("hallMarkingCode").getAsString());
		itemDetails.put("hallMarkingCentreName",
				jsonObjStnDtl.getAsJsonObject("data").get("hallMarkingCentreName").getAsString());
		itemDetails.put("hallMarkedDate", hallMarkDateString);
		itemDetails.put("hallMarkRemarks", jsonObjStnDtl.getAsJsonObject("data").get("hallMarkRemarks").getAsString());
		itemDetails.put("hallMarkRemarks1",
				jsonObjStnDtl.getAsJsonObject("data").get("hallMarkRemarks1").getAsString());
		itemDetails.put("isHallmarkEligible", false);

		Map<String, Object> itemDetailsHallmarkEligible = new LinkedHashMap<>();
		itemDetailsHallmarkEligible.put("type", "ITEM_DETAILS");
		itemDetailsHallmarkEligible.put("data", itemDetails);
		return MapperUtil.getStringFromJson(itemDetailsHallmarkEligible);
	}

	private void processLdtlData(StnStageDto stn, List<StnStageDto> stnLdtlList, List<StnStageDto> items, int index) {
		List<StnStageDto> subList = items.subList(0, index + 1);
		setItemCodeAndLotNumber(stn, subList, stn.getLdtlLineCount().toString());
		stn.setLdtlCreatedBy(getCrtdByFromHdr(subList));
		stn.setLdtlCreatedDate(getCreatedDate(subList));
		if (stnValidationService.validateLdtlService(stn)) {
			stnLdtlList.add(stn);
		}
	}

	private void processMdtlData(StnStageDto stn, List<StnStageDto> stnMdtlList, List<StnStageDto> items, int index) {
		List<StnStageDto> subList = items.subList(0, index + 1);
		setItemCodeAndLotNumber(stn, subList, stn.getMdtlLineCount().toString());
		stn.setMdtlCreatedBy(getCrtdByFromHdr(subList));
		stn.setMdtlCreatedDate(getCreatedDate(subList));
		if (stnValidationService.validateMdtlService(stn) && validateMdtlData(items.get(index), subList)) {
			stnMdtlList.add(stn);
		}
	}

	private boolean validateFileFormat(List<? extends StnStageDto> items) {

		boolean dtlFlag = false;
		boolean ldtlFlag = false;
		boolean mdtlFlag = false;
		if ((!items.get(0).getType().equalsIgnoreCase("HDR"))
				|| (!items.get(items.size() - 1).getType().equalsIgnoreCase("CTRL"))) {
			setIncorrectFileFormat(items.get(0).getFileId());
		} else {
			for (int i = 0; i < items.size() - 1; i++) {
				if (items.get(i).getType().equalsIgnoreCase("HDR")) {
					dtlFlag = true;
					ldtlFlag = false;
					mdtlFlag = false;
				} else if (items.get(i).getType().equalsIgnoreCase("DTL") && dtlFlag) {
					ldtlFlag = true;
					mdtlFlag = true;
				} else if ((items.get(i).getType().equalsIgnoreCase("LDTL") && ldtlFlag)
						|| (items.get(i).getType().equalsIgnoreCase("MDTL") && mdtlFlag)) {
					dtlFlag = false;
				} else {
					setIncorrectFileFormat(items.get(i).getFileId());
					return false;
				}
			}
		}
		return true;
	}

	private void setIncorrectFileFormat(String fileId) {
		fileAuditService.updateFileAudit(fileId, JobProcessStatusEnum.FAILED.toString(), FileGroupEnum.STN.toString(),
				INCORRECT_FILE_FORMAT, FileGroupEnum.ORACLE.toString(), true, null, null);
	}

	/**
	 * checking if the dtl has other net wt else logging a warning when mdtl is
	 * present.
	 * 
	 * @param stnDto
	 * @param stnList
	 */
	private boolean validateMdtlData(StnStageDto stnDto, List<StnStageDto> stnList) {
		for (int i = stnList.size() - 1; i >= 0; i--) {
			if (stnList.get(i).getType().equalsIgnoreCase("DTL")
					&& stnList.get(i).getDtlSlNo().equalsIgnoreCase(stnDto.getMdtlLineCount().toString())) {
				if (stnList.get(i).getDtlOtherNetWt().equalsIgnoreCase("0")) {
					dataAuditService.saveDataAuditData(stnList.get(i).getDeliveryNo().toString(),
							MapperUtil.getJsonString(stnList.get(i)),
							"MDTL section present but OtherMaterialWeight = 0 for Itemcode: "
									+ stnDto.getDtlProductCode() + " and Lotnumber: " + stnDto.getDtlLotNumber(),
							stnList.get(i).getFileId(), ErrorTypeEnum.WARNING.toString());
					return false;
				}
				break;
			}
		}
		return true;
	}

	/**
	 * checking if mdtl is present when dtl has other net wt else logging a warning
	 * .
	 * 
	 * @param stnDto
	 * @param stnList
	 */
	private boolean validateDtlData(StnStageDto stnDto, List<StnStageDto> stnList) {
		if (!(stnDto.getDtlOtherNetWt().equalsIgnoreCase("0") || stnDto.getDtlOtherNetWt().equalsIgnoreCase("0.000"))) {
			boolean mdtlFound = false;
			for (int i = 0; i < stnList.size(); i++) {

				if (stnList.get(i).getType().equalsIgnoreCase("MDTL")
						|| stnList.get(i).getType().equalsIgnoreCase("HDR")) {
					if (stnList.get(i).getType().equalsIgnoreCase("MDTL")) {
						mdtlFound = true;
					}
					break;
				}
			}
			if (!mdtlFound) {
				dataAuditService.saveDataAuditData(stnDto.getDeliveryNo().toString(), MapperUtil.getJsonString(stnDto),
						"MDTL details is not available for Itemcode: " + stnDto.getDtlProductCode()
								+ "and  Lotnumber - " + stnDto.getDtlLotNumber() + "  but OtherMaterialWeight > 0 ",
						stnDto.getFileId(), ErrorTypeEnum.WARNING.toString());
				return false;
			}
		}
		return true;
	}

	/**
	 * Sets the item code and lot number of the dtl based on the item count of ldtl
	 * or mdtl.
	 *
	 * @param stnDto  the stn dto
	 * @param stnList the stn list
	 */
	private void setItemCodeAndLotNumber(StnStageDto stnDto, List<StnStageDto> stnList, String lineCount) {
		for (int i = stnList.size() - 1; i >= 0; i--) {
			if (stnList.get(i).getType().equalsIgnoreCase("DTL")
					&& stnList.get(i).getDtlSlNo().equalsIgnoreCase(lineCount)) {
				stnDto.setItemCode(stnList.get(i).getDtlProductCode());
				stnDto.setLotNumber(stnList.get(i).getDtlLotNumber());
				break;
			}
		}
	}

	private String getCrtdByFromHdr(List<StnStageDto> stnList) {
		String crtdBy = "";
		for (int i = stnList.size() - 1; i >= 0; i--) {
			if (stnList.get(i).getType().equalsIgnoreCase("HDR")) {
				crtdBy = stnList.get(i).getHdrCreatedBy();
				break;
			}
		}
		return crtdBy;
	}

	private Date getCreatedDate(List<StnStageDto> stnList) {
		String date = null;
		String time = null;
		String dateFormat = "yyyyMMdd HH:mm:ss";
		for (int i = stnList.size() - 1; i >= 0; i--) {
			if (stnList.get(i).getType().equalsIgnoreCase("HDR")) {
				date = stnList.get(i).getHdrStmCreatedDate();
				time = stnList.get(i).getHdrStmCreatedTime();
				//LOGGER.info("-------------date and time -----------"+date + " " + time);
				if (stnList.get(i).isStnIbt()) {
					//LOGGER.info("-----------is file ibt"+stnList.get(i).isStnIbt());
					//dateFormat = "yyyyMMdd hh:mm a";
					dateFormat =  getDateFormat(date + " " + time); 
				//	LOGGER.info("date format -----"+dateFormat);
				}
				
				break;
			}
		}
		//LOGGER.info("date is ----------"+CalendarUtils.convertStringToDate(date + " " + time, dateFormat));
		return CalendarUtils.convertStringToDate(date + " " + time, dateFormat);
	}

	private static final Map<String, String> DATE_FORMAT_REGEXPS = new HashMap<String, String>() {
        {
        	put("^\\d{8}\\s\\d{1,2}:\\d{2}:\\d{2}$","yyyyMMdd HH:mm:ss");
        	put("^\\d{8}\\s\\d{1,2}:\\d{2}$","yyyyMMdd HH:mm");
        	put("^\\d{4}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])\\s(1[0-2]|0?[1-9]):[0-5][0-9] [APap][mM]$","yyyyMMdd hh:mm a"); 
        	put("^\\d{4}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])\\s(1[0-2]|0?[1-9]):[0-5][0-9]:[0-5][0-9] [APap][mM]$","yyyyMMdd hh:mm:ss a");
        	        
        }
    };

	private String getDateFormat(String value) {
		for (String regexp : DATE_FORMAT_REGEXPS.keySet()) {
            if (value.matches(regexp) || value.toLowerCase().matches(regexp)) {
                return DATE_FORMAT_REGEXPS.get(regexp);
            }
        }
		return null;
	}
	private void writeDataToStagingTable(List<StnStageDto> stnHdrList, List<StnStageDto> stnDtlList,
			List<StnStageDto> stnLdtlList, List<StnStageDto> stnMdtlList) throws Exception {
		if (!stnHdrList.isEmpty()) {
			stnJobWriter.stnHdrStagingWriter().write(stnHdrList);
		}
		if (!stnDtlList.isEmpty()) {
			stnJobWriter.stnDtlStagingWriter().write(stnDtlList);
		}
		if (!stnLdtlList.isEmpty()) {
			stnJobWriter.stnLdtlStagingWriter().write(stnLdtlList);
		}
		if (!stnMdtlList.isEmpty()) {
			stnJobWriter.stnMdtlStagingWriter().write(stnMdtlList);
		}
	}

}
