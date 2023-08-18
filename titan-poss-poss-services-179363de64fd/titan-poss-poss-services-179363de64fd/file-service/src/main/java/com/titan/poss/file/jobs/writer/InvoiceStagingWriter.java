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
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.InvoiceIsacDetailsDto;
import com.titan.poss.file.dto.InvoiceStageDto;
import com.titan.poss.file.dto.StnStageDto;
import com.titan.poss.file.service.FileAuditService;
import com.titan.poss.file.service.InvoiceValidationService;
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
public class InvoiceStagingWriter implements ItemWriter<InvoiceStageDto> {

	@Autowired
	private InvoiceJobWriter invoiceJobWriter;

	@Autowired
	private InvoiceValidationService invoiceValidationService;

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private LocationRepository locationRepository;

	@Autowired
	private ProductGroupRepository productGroupRepository;

	@Autowired
	private ItemRepository itemRepository;
	private static final Logger LOGGER = LoggerFactory.getLogger(InvoiceStagingWriter.class);

	private static final String INCORRECT_FILE_FORMAT = "file is not in proper format";

	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends InvoiceStageDto> list) throws Exception {

		List<InvoiceStageDto> items = (List<InvoiceStageDto>) list;

		List<InvoiceStageDto> invoiceIhdrList = new ArrayList<>();
		List<InvoiceStageDto> invoiceIdtlList = new ArrayList<>();
		List<InvoiceStageDto> invoiceIldtlList = new ArrayList<>();
		List<InvoiceStageDto> invoiceImdtlList = new ArrayList<>();

		// validating file format
		if (validateFileFormat(items))
			for (int i = 0; i < items.size(); i++) {
				if (items.get(i).getType().equalsIgnoreCase("IHDR")) {
					processIhdrData(items.get(i), invoiceIhdrList);
				} else if (items.get(i).getType().equalsIgnoreCase("IDTL")) {
					List<InvoiceStageDto> subList = items.subList(i + 1, items.size());
					processIdtlData(items.get(i), invoiceIdtlList, subList);
				} else if (items.get(i).getType().equalsIgnoreCase("LDTL")) {
					List<InvoiceStageDto> subList = items.subList(0, i + 1);
					processIldtlData(items.get(i), invoiceIldtlList, subList);
				} else if (items.get(i).getType().equalsIgnoreCase("MDTL")) {
					List<InvoiceStageDto> subList = items.subList(0, i + 1);
					processIMdtlData(items.get(i), invoiceImdtlList, subList);
				}
			}
		writeDataToStagingTable(invoiceIhdrList, invoiceIdtlList, invoiceIldtlList, invoiceImdtlList);
	}

	private boolean validateFileFormat(List<? extends InvoiceStageDto> items) {
		boolean idtlFlag = false;
		boolean isacFlag = false;
		boolean ldtlFlag = false;
		boolean mdtlFlag = false;
		boolean valid = false;
		if (checkIhdrAndIctrl(items)) {
			for (int i = 0; i < items.size() - 1; i++) {
				if (items.get(0).getType().equalsIgnoreCase("IHDR")) {
					idtlFlag = true;
					valid = true;
				} else if (items.get(i).getType().equalsIgnoreCase("IDTL") && idtlFlag) {
					isacFlag = true;
					ldtlFlag = true;
				} else if (items.get(i).getType().equalsIgnoreCase("ISAC") && isacFlag) {
					mdtlFlag = true;
				} else if (!((items.get(i).getType().equalsIgnoreCase("LDTL") && ldtlFlag)
						|| (items.get(i).getType().equalsIgnoreCase("MDTL") && mdtlFlag))) {
					setIncorrectFileFormat(items.get(i).getFileId());
					return false;
				} else {
					setIncorrectFileFormat(items.get(i).getFileId());
					valid = false;
					break;
				}
			}
		}
		return valid;
	}

	private boolean checkIhdrAndIctrl(List<? extends InvoiceStageDto> items) {
		boolean check = true;
		if ((!items.get(0).getType().equalsIgnoreCase("IHDR"))
				|| (!items.get(items.size() - 1).getType().equalsIgnoreCase("CTRL"))) {
			setIncorrectFileFormat(items.get(0).getFileId());
			check = false;
		}
		return check;
	}

	private void setIncorrectFileFormat(String fileId) {
		fileAuditService.updateFileAudit(fileId, JobProcessStatusEnum.FAILED.toString(),
				FileGroupEnum.INVOICE.toString(), INCORRECT_FILE_FORMAT, FileGroupEnum.ORACLE.toString(), true, null,
				null);
	}

	private void processIhdrData(InvoiceStageDto invoice, List<InvoiceStageDto> invoiceIhdrList) {
		if (invoiceValidationService.validateIhdrService(invoice)) {
			invoiceIhdrList.add(invoice);
		}
	}

	private void processIdtlData(InvoiceStageDto invoice, List<InvoiceStageDto> invoiceIdtlList,
			List<InvoiceStageDto> subList) {
		try {
			ProductGroupDao productDtls = null;
			ItemDao itemDao = null;
			LOGGER.info("Invoice data: " + invoice);
			if (invoiceValidationService.validateIdtlService(invoice)) {
				invoice.setIdtlIsacDetails(getIsacDetails(invoice, subList));
				// if it is not hallmarked, then moving it hall mark dispute bin
				LOGGER.info("Item deails Json   ------------- : " + invoice.getItemDetails());
				LOGGER.info("Item deails Json   ------------- : " + invoice.getItemDetails().toString());
				JsonObject jsonObjStnDtl = new JsonParser().parse(invoice.getItemDetails()).getAsJsonObject();
				if (BooleanUtils.isNotTrue(invoice.isHallMarking())) {
					// use source location here
					// LocationDao locationDao =
					// locationRepository.findOneByLocationCode(invoice.getIhdrDestLocationCode());
					LocationDao locationDao = locationRepository.findOneByLocationCode(invoice.getSrcLocation());
					LOGGER.info("Location Dao  ------------- : " + locationDao);
					JsonObject jsonObj = new JsonParser().parse(locationDao.getStoreDetails()).getAsJsonObject();
					LOGGER.info("jsonObj Invoice staging writer ------------- : " + jsonObj);
					Boolean isHallMarkEnabled = jsonObj.getAsJsonObject("data").get("isHallmarkingEnabled")
							.getAsBoolean();
					LOGGER.info("Location hallmark config dtl :" + isHallMarkEnabled);
					if (isHallMarkEnabled) { // First location check hallmarking{
						LOGGER.info("inside Location hallmark config dtl ");
						productDtls = productGroupRepository
								.findByProductGroupCodeAndIsActive(invoice.getCfaProductCode(), true);
						LOGGER.info("Product Dtls :" + productDtls);
						JsonObject jsonObjProDtl = new JsonParser().parse(productDtls.getConfigDetails())
								.getAsJsonObject();
						Boolean isHallMarked = jsonObjProDtl.getAsJsonObject("data").get("isHallmarked").getAsBoolean();
						BigDecimal hallmarkingExcludeGrams = jsonObjProDtl.getAsJsonObject("data")
								.get("hallmarkingExcludeGrams").getAsBigDecimal();
						List<BigDecimal> listHallMarkdataExKarat = new ArrayList<>();
						if (!jsonObjProDtl.getAsJsonObject("data").get("hallmarkingExcludeKarat").isJsonArray()) {
							JsonArray hallmarkingExcludeKarat = jsonObjProDtl.getAsJsonObject("data")
									.get("hallmarkingExcludeKarat").getAsJsonArray();

							if (hallmarkingExcludeKarat != null) {
								for (int i = 0; i < hallmarkingExcludeKarat.size(); i++) {
									listHallMarkdataExKarat.add(hallmarkingExcludeKarat.get(i).getAsBigDecimal());
								}
							}
						}
						LOGGER.info("Product hallmark config dtl :" + isHallMarked + " : HallmarkExGram "
								+ hallmarkingExcludeGrams);
						if (isHallMarked && hallmarkingExcludeGrams.compareTo(invoice.getIdtlStnNetWt()) < 0) {
							LOGGER.info("Inside exclude gram & isHallmarking enabled");
							itemDao = itemRepository.findByItemCodeAndIsActive(invoice.getItemCode(), true);
							LOGGER.info("Item Karat :" + itemDao.getKarat());
							LOGGER.info("List hallMarkEx Karat :" + listHallMarkdataExKarat);
							if (!listHallMarkdataExKarat.contains(itemDao.getKarat())) {
								LOGGER.info("inside exclude Karat");
								invoice.setIdtlBinCode("HALLMARKDISPUTEBIN");
								invoice.setIdtlBinGroupCode("HALLMARKDISPUTEBIN");
							} else {
								LOGGER.info("ItemKarat " + itemDao.getKarat());
								invoice.setItemDetails(getItemDetailsHallMarkEligibleJson(jsonObjStnDtl));
							}

						} else {
							LOGGER.info("Ishallmarked (location) " + isHallMarked + "HallmarkExGram "
									+ hallmarkingExcludeGrams);
							invoice.setItemDetails(getItemDetailsHallMarkEligibleJson(jsonObjStnDtl));
						}
					} else {
						LOGGER.info("Ishallmarked Based on location " + isHallMarkEnabled);
						invoice.setItemDetails(getItemDetailsHallMarkEligibleJson(jsonObjStnDtl));

					}
				}
				LOGGER.info("invoice Ishallmarking " + invoice.isHallMarking());
				invoiceIdtlList.add(invoice);
			}
		} catch (Exception e) {
			LOGGER.info("Exception Msg: "+e.getMessage());
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
		itemDetails.put("isHallMarking", jsonObjStnDtl.getAsJsonObject("data").get("isHallMarking").getAsString());
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

	private String getIsacDetails(InvoiceStageDto invoiceStageDto, List<InvoiceStageDto> subList) {

		List<InvoiceIsacDetailsDto> isacList = new ArrayList<>();
		for (int i = 0; i < subList.size(); i++) {
			if (subList.get(i).getType().equalsIgnoreCase("ISAC")
					&& subList.get(i).getIsacLineCount().equals(invoiceStageDto.getIdtlLineCount())) {
				InvoiceIsacDetailsDto isacDto = new InvoiceIsacDetailsDto();
				isacDto.setLineDtlCount(subList.get(i).getIsacLineDtlCount());
				isacDto.setGlKey(subList.get(i).getIsacGlKey());
				isacDto.setDcInd(subList.get(i).getIsacDcInd());
				isacDto.setPercentage(subList.get(i).getIsacDiscPerc());
				isacDto.setAmount(subList.get(i).getIsacDiscAmt());
				isacList.add(isacDto);
			} else if (subList.get(i).getType().equalsIgnoreCase("LDTL")) {
				break;
			}
		}

		Map<String, String> isacDetails = new HashMap<>();
		isacDetails.put("IsacDetails", MapperUtil.getJsonString(isacList));

		Map<String, Object> isac = new LinkedHashMap<>();
		isac.put("type", "ISAC_DETAILS");
		isac.put("data", isacDetails);
		return MapperUtil.getStringFromJson(isac).replace("\\", "").replace("\"[", "[").replace("]\"", "]");
	}

	private void processIldtlData(InvoiceStageDto invoice, List<InvoiceStageDto> invoiceIldtlList,
			List<InvoiceStageDto> subList) {
		setItemCodeAndLotNumber(invoice, subList, invoice.getIldtlLineCount());
		if (invoiceValidationService.validateLdtlService(invoice)) {
			invoiceIldtlList.add(invoice);
		}
	}

	private void processIMdtlData(InvoiceStageDto invoice, List<InvoiceStageDto> invoiceImdtlList,
			List<InvoiceStageDto> subList) {
		setItemCodeAndLotNumber(invoice, subList, invoice.getImdtlLineCount());
		if (invoiceValidationService.validateMdtlService(invoice)) {
			invoiceImdtlList.add(invoice);
		}
	}

	private void setItemCodeAndLotNumber(InvoiceStageDto invoice, List<InvoiceStageDto> invoiceList,
			Integer dtlLineCount) {
		for (int i = invoiceList.size() - 1; i >= 0; i--) {
			if (invoiceList.get(i).getType().equalsIgnoreCase("IDTL")
					&& invoiceList.get(i).getIdtlLineCount().equals(dtlLineCount)) {
				invoice.setItemCode(invoiceList.get(i).getIdtlItemNo2());
				invoice.setLotNumber(invoiceList.get(i).getIdtlLotNumber());
				break;
			}
		}
	}

	private void writeDataToStagingTable(List<InvoiceStageDto> invoiceIhdrList, List<InvoiceStageDto> invoiceIdtlList,
			List<InvoiceStageDto> invoiceIldtlList, List<InvoiceStageDto> invoiceImdtlList) throws Exception {
		if (!invoiceIhdrList.isEmpty()) {
			invoiceJobWriter.invoiceIhdrStagingWriter().write(invoiceIhdrList);
		}
		if (!invoiceIdtlList.isEmpty()) {
			invoiceJobWriter.invoiceIdtlStagingWriter().write(invoiceIdtlList);
		}
		if (!invoiceIldtlList.isEmpty()) {
			invoiceJobWriter.invoiceIldtlStagingWriter().write(invoiceIldtlList);
		}
		if (!invoiceImdtlList.isEmpty()) {
			invoiceJobWriter.invoiceImdtlStagingWriter().write(invoiceImdtlList);
		}
	}
}
