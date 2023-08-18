/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.inventory.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountItemMappingDao;
import com.titan.poss.config.dto.DiscountItemMappingSyncDto;
import com.titan.poss.config.repository.DiscountItemMappingRepository;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.DiscountItemMapiingDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.InventoryOperationCodes;
import com.titan.poss.datasync.dao.SyncStaging;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.facade.PublishFacade;
import com.titan.poss.datasync.repository.DataSyncRepository;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.EpossCallService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.inventory.constant.InventoryDetailsActionEnum;
import com.titan.poss.inventory.constant.ProductGroupCodeEnum;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dao.StockInvoiceDao;
import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.dao.StockRequestDetailsDao;
import com.titan.poss.inventory.dao.StockTransactionDao;
import com.titan.poss.inventory.dao.StockTransactionDetailsDao;
import com.titan.poss.inventory.dao.StockTransferDao;
import com.titan.poss.inventory.dto.InventoryDetailsSyncDto;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;
import com.titan.poss.inventory.repository.StockInvoiceDetailsRepository;
import com.titan.poss.inventory.repository.StockInvoiceRepository;
import com.titan.poss.inventory.repository.StockRequestDetailsRepository;
import com.titan.poss.inventory.repository.StockRequestRepository;
import com.titan.poss.inventory.repository.StockTransactionDetailsRepository;
import com.titan.poss.inventory.repository.StockTransactionRepository;
import com.titan.poss.inventory.repository.StockTransferDetailsRepository;
import com.titan.poss.inventory.repository.StockTransferRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class InventoryDetailsSyncService implements SyncOperation {

	@Autowired
	NamedParameterJdbcTemplate namedparameterjdbctemplate;

	@Autowired
	private InventoryDetailsRepository inventoryDetailsRepository;

	@Autowired
	private PublishFacade publishFacade;

	@Autowired
	private EpossCallService epossCallService;

	@Autowired
	private InventoryDetailsSyncService inventoryDetails;

	@Autowired
	private StockTransferRepository stockTransferRepository;

	@Autowired
	private StockTransferDetailsRepository stockTransferDetailsRepository;

	@Autowired
	private DataSyncRepository dataSyncRepository;

	@Autowired
	StockInvoiceRepository stockInvoiceRepository;

	@Autowired
	StockInvoiceDetailsRepository stockInvoiceDetailsRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	private StockTransactionRepository stockTransactionRepository;

	@Autowired
	private StockTransactionDetailsRepository stockTransactionDetailsRepository;

	@Autowired
	private StockRequestRepository stockRequestRepository;

	@Autowired
	private StockRequestDetailsRepository stockRequestDetailsRepository;

	@Autowired
	DiscountItemMappingRepository discountItemMappingRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(InventoryDetailsSyncService.class);
	private static final String EXCEPTION = "exception : ";
	private static final String RECEIVED = "RECEIVED";
	private static final String CANCELLED = "CANCELLED";
	private static final String ISSUED = "ISSUED";
	private static final String COMPLETED = "COMPLETED";
	private static final String CLOSED = "CLOSED";

	@Override
	public void operation(MessageTransfer messageTransfer) {

		// get stn details from queue
		List<SyncData> syncDatas = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncDatas.forEach(syncData -> {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(InventoryOperationCodes.INV_STN_POSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_CFA_POSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_OTHERRECPT_POSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_RINV_POSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_OTHERISSUE_POSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_OTHERREQUEST_POSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_STNISSUE_POSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_STN_POSS_CANCEL)
					|| operationCode.equals(InventoryOperationCodes.INV_CONV_POSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_CONV_POSS_UPDATE)) {
				String code = updateOperationCode(operationCode);
				String msgId = null;
				try {
					SyncStagingDto syncStagingDto = inventoryDetails.saveInvDetailsAndStagingToPOSSDB(syncData, code);
					datasyncAuditService.updateDatasyncAuditStatusById(messageId,
							messageTransfer.getMessageTransferData().getDestination(),
							DatasyncStatusEnum.SYNCED.name());
					if (syncStagingDto != null) {
						msgId = publishFacade.publishMessage(syncStagingDto.getMessageRequest());
					}
					if (msgId != null)
						dataSyncRepository.deleteById(syncStagingDto.getId());
				} catch (Exception ex) {
					LOGGER.error(EXCEPTION, ex);
					datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,
							messageTransfer.getMessageTransferData().getDestination(),
							DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
				}

			}
			if (operationCode.equals(InventoryOperationCodes.INV_STN_EPOSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_CFA_EPOSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_OTHERRECPT_EPOSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_RINV_EPOSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_OTHERISSUE_EPOSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_STNISSUE_EPOSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_BIN_BIN_EPOSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_STN_EPOSS_CANCEL)
					|| operationCode.equals(InventoryOperationCodes.INV_CONV_EPOSS_ADD)
					|| operationCode.equals(InventoryOperationCodes.INV_CONV_EPOSS_UPDATE)
					|| operationCode.equals(InventoryOperationCodes.INV_OTHERREQUEST_EPOSS_ADD)) {

				inventoryDetails.saveInvDetailsToEPOSSDB(syncData, operationCode, messageId,
						messageTransfer.getMessageTransferData().getDestination());
			}
		});
	}

	/**
	 * @param operationCode
	 * @return String
	 */
	private String updateOperationCode(String operationCode) {
		String code = null;
		if (operationCode.equals(InventoryOperationCodes.INV_STN_POSS_ADD))
			code = InventoryOperationCodes.INV_STN_EPOSS_ADD;
		else if (operationCode.equals(InventoryOperationCodes.INV_CFA_POSS_ADD))
			code = InventoryOperationCodes.INV_CFA_EPOSS_ADD;
		else if (operationCode.equals(InventoryOperationCodes.INV_OTHERRECPT_POSS_ADD))
			code = InventoryOperationCodes.INV_OTHERRECPT_EPOSS_ADD;
		else if (operationCode.equals(InventoryOperationCodes.INV_RINV_POSS_ADD))
			code = InventoryOperationCodes.INV_RINV_EPOSS_ADD;
		else if (operationCode.equals(InventoryOperationCodes.INV_OTHERISSUE_POSS_ADD))
			code = InventoryOperationCodes.INV_OTHERISSUE_EPOSS_ADD;
		else if (operationCode.equals(InventoryOperationCodes.INV_OTHERREQUEST_POSS_ADD))
			code = InventoryOperationCodes.INV_OTHERREQUEST_EPOSS_ADD;
		else if (operationCode.equals(InventoryOperationCodes.INV_STNISSUE_POSS_ADD))
			code = InventoryOperationCodes.INV_STNISSUE_EPOSS_ADD;
		else if (operationCode.equals(InventoryOperationCodes.INV_STN_POSS_CANCEL))
			code = InventoryOperationCodes.INV_STN_EPOSS_CANCEL;
		else if (operationCode.equals(InventoryOperationCodes.INV_CONV_POSS_ADD))
			code = InventoryOperationCodes.INV_CONV_EPOSS_ADD;
		else if (operationCode.equals(InventoryOperationCodes.INV_CONV_POSS_UPDATE))
			code = InventoryOperationCodes.INV_CONV_EPOSS_UPDATE;
		return code;
	}

	/**
	 * @param syncData
	 * @param possSyncDatas
	 * @param operationCode
	 */
	@Transactional
	public SyncStagingDto saveInvDetailsAndStagingToPOSSDB(SyncData syncData, String code) {
		ObjectMapper mapper = new ObjectMapper();
		List<SyncData> possSyncDatas = new ArrayList<>();
		if (syncData.getOrder() == 2 && syncData.getData() != null) {
			// Incase of IBT best deal discount transfer
			List<DiscountItemMapiingDto> syncDtos = mapper.convertValue(syncData.getData(),
					new TypeReference<List<DiscountItemMapiingDto>>() {
					});
			List<DiscountItemMappingDao> discountItemMappingDaos = new ArrayList<DiscountItemMappingDao>();
			for (DiscountItemMapiingDto dto : syncDtos) {
				DiscountItemMappingDao dao = (DiscountItemMappingDao) MapperUtil.getObjectMapping(dto,
						new DiscountItemMappingDao());
				DiscountDao discount = new DiscountDao();
				discount.setId(dto.getDiscount());
				dao.setDiscount(discount);
				discountItemMappingDaos.add(dao);
			}
			discountItemMappingDaos = discountItemMappingRepository.saveAll(discountItemMappingDaos);
			if (discountItemMappingDaos != null && !discountItemMappingDaos.isEmpty()) {
				DiscountItemMappingSyncDto discountItemDtoExt = new DiscountItemMappingSyncDto();
				possSyncDatas
						.add(DataSyncUtil.createSyncData(discountItemDtoExt.getSyncDtos(discountItemMappingDaos), 2));
			}

		} else {
			List<InventoryDetailsSyncDto> syncDtos = mapper.convertValue(syncData.getData(),
					new TypeReference<List<InventoryDetailsSyncDto>>() {
					});
			InventoryDetailsSyncDto syncDto = new InventoryDetailsSyncDto();
			List<InventoryDetailsDao> inventoryDetailsDaoList = syncDto.getDaoList(syncDtos);
			List<InventoryDetailsDao> inventoryDetailsDaoListWoCoin = new ArrayList<>();
			List<InventoryDetailsDao> inventoryDetailsDaoListCoin = new ArrayList<>();

			if (code.equals(InventoryOperationCodes.INV_RINV_EPOSS_ADD)
					|| code.equals(InventoryOperationCodes.INV_OTHERISSUE_EPOSS_ADD)
					|| code.equals(InventoryOperationCodes.INV_STNISSUE_EPOSS_ADD)) {
				LOGGER.info("Ln 218");
				List<String> ids = new ArrayList<>();
				inventoryDetailsDaoList.forEach(inventory -> ids.add(inventory.getId()));
				List<InventoryDetailsDao> possInventoryList = inventoryDetailsRepository.findAllById(ids);
				for (InventoryDetailsDao possInv : possInventoryList) {
					for (InventoryDetailsDao epossInv : inventoryDetailsDaoList) {
						LOGGER.info("Ln 224");
						if (possInv.getId().equals(epossInv.getId())) {
							possInv.setTotalQuantity(
									(short) (possInv.getTotalQuantity() - epossInv.getTotalQuantity()));
							possInv.setTotalWeight(possInv.getTotalWeight().subtract(epossInv.getTotalWeight()));
							possInv.setTotalValue(possInv.getTotalValue().subtract(epossInv.getTotalValue()));
							possInv.setRequestType(epossInv.getRequestType());
							// if (epossInv.getRequestQuantity() == 0 || epossInv.getRequestQuantity() ==
							// null) {
							possInv.setRequestQuantity((short) 0);
							// } else {
							possInv.setRequestQuantity(epossInv.getRequestQuantity());
							// }
							break;
						}
					}
				}
				inventoryDetailsRepository.saveAll(possInventoryList);

				if (!inventoryDetailsDaoList.isEmpty())
					possSyncDatas.add(DataSyncUtil.createSyncData(
							syncDto.getSyncDtoList(inventoryDetailsDaoList, syncDtos.get(0).getStockId()), 1));
			} else if (code.equals(InventoryOperationCodes.INV_OTHERREQUEST_EPOSS_ADD)) {
				List<String> ids = new ArrayList<>();
				inventoryDetailsDaoList.forEach(inventory -> ids.add(inventory.getId()));
				List<InventoryDetailsDao> possInventoryList = inventoryDetailsRepository.findAllById(ids);
				for (InventoryDetailsDao possInv : possInventoryList) {
					for (InventoryDetailsDao epossInv : inventoryDetailsDaoList) {
						if (possInv.getId().equals(epossInv.getId())) {
							possInv.setRequestType(epossInv.getRequestType());
							possInv.setRequestQuantity(epossInv.getRequestQuantity());
							break;
						}
					}
				}
				inventoryDetailsRepository.saveAll(possInventoryList);

				if (!inventoryDetailsDaoList.isEmpty())
					possSyncDatas.add(DataSyncUtil.createSyncData(
							syncDto.getSyncDtoList(inventoryDetailsDaoList, syncDtos.get(0).getStockId()), 1));
			} else if (code.equals(InventoryOperationCodes.INV_CONV_EPOSS_ADD)
					|| code.equals(InventoryOperationCodes.INV_CONV_EPOSS_UPDATE)) {
				if (syncData.getOrder() == 1) {
					inventoryDetailsRepository.deleteAll(inventoryDetailsDaoList);
					if (!inventoryDetailsDaoList.isEmpty())
						possSyncDatas.add(DataSyncUtil.createSyncData(
								syncDto.getSyncDtoList(inventoryDetailsDaoList, syncDtos.get(0).getStockId()), 1));
				} else if (syncData.getOrder() == 0) {
					inventoryDetailsRepository.saveAll(inventoryDetailsDaoList);
					if (!inventoryDetailsDaoList.isEmpty())
						possSyncDatas.add(DataSyncUtil.createSyncData(
								syncDto.getSyncDtoList(inventoryDetailsDaoList, syncDtos.get(0).getStockId()), 0));
				}
			} else {
				for (InventoryDetailsDao inv : inventoryDetailsDaoList) {
					if (inv.getProductGroup().equals("73")) {
						inventoryDetailsDaoListCoin.add(inv);
					} else {
						inventoryDetailsDaoListWoCoin.add(inv);
					}

				}
				String correlationId = inventoryDetailsDaoList.get(0).getCorrelationId();
//				inventoryDetailsDaoList.forEach(inventory -> epossCallService.getInventoryDependencyAndSave(inventory));
				// inventoryDetailsRepository.saveAll(inventoryDetailsDaoList);
				inventoryDetailsRepository.saveAll(inventoryDetailsDaoListWoCoin);
				// non 73 saved
				// save 73 prod with native query
				// it will update existing or insert a new coin row with correlation id update.
				for (InventoryDetailsDao inventoryCoin : inventoryDetailsDaoListCoin) {
					InventoryDetailsDao invs = inventoryDetailsRepository
							.findByLocationCodeAndItemCodeAndLotNumberAndBinCodeAndBinGroupCode(
									inventoryCoin.getLocationCode(), inventoryCoin.getItemCode(),
									inventoryCoin.getLotNumber(), inventoryCoin.getBinCode(),
									inventoryCoin.getBinGroupCode());
					if (invs != null) {
						invs.setTotalWeight(invs.getTotalWeight().add(inventoryCoin.getTotalWeight()));
						invs.setTotalQuantity((short) (invs.getTotalQuantity() + inventoryCoin.getTotalQuantity()));
						invs.setCorrelationId(correlationId);
						invs.setTotalValue(invs.getTotalValue().add(inventoryCoin.getTotalValue()));
						inventoryDetailsRepository.save(invs);
					} else {
						inventoryDetailsRepository.save(inventoryCoin);
					}
				}

				List<InventoryDetailsDao> possInventoryDetailsDaos = inventoryDetailsRepository
						.findAllByCorrelationId(correlationId);
				if (!possInventoryDetailsDaos.isEmpty())
					possSyncDatas.add(DataSyncUtil.createSyncData(
							syncDto.getSyncDtoList(possInventoryDetailsDaos, syncDtos.get(0).getStockId()), 0));
			}
		}
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		if (!possSyncDatas.isEmpty()) {
			List<String> destinations = new ArrayList<>();
			destinations.add("EPOSS");
			MessageRequest messageRequest = DataSyncUtil.createMessageRequest(possSyncDatas, code, destinations,
					MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
			syncStagingDto.setMessageRequest(messageRequest);
			String requestBody = MapperUtil.getJsonString(messageRequest);
			// saving to staging table
			SyncStaging stagingMessage = new SyncStaging();
			stagingMessage.setMessage(requestBody);
			stagingMessage.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			stagingMessage = dataSyncRepository.save(stagingMessage);
			syncStagingDto.setId(stagingMessage.getId());
		}

		return syncStagingDto;
	}

	/**
	 * @param syncData
	 * @param operationCode
	 * @param messageId
	 * @param dest
	 */
	@Transactional
	public void saveInvDetailsToEPOSSDB(SyncData syncData, String operationCode, String messageId, String dest) {
		ObjectMapper mapper = new ObjectMapper();
		if (syncData.getOrder() == 2) {
			DiscountItemMappingSyncDto syncDto = new DiscountItemMappingSyncDto();
			List<DiscountItemMappingSyncDto> srcData = mapper.convertValue(syncData.getData(),
					new TypeReference<List<DiscountItemMappingSyncDto>>() {
					});
			List<DiscountItemMappingDao> discountItemMappingDaos = syncDto.getDaoList(srcData);

			discountItemMappingDaos = discountItemMappingRepository.saveAll(discountItemMappingDaos);
		} else {
			List<InventoryDetailsSyncDto> syncDtos = mapper.convertValue(syncData.getData(),
					new TypeReference<List<InventoryDetailsSyncDto>>() {
					});
			InventoryDetailsSyncDto syncDto = new InventoryDetailsSyncDto();
			List<InventoryDetailsDao> invDetList = syncDto.getDaoList(syncDtos);
			LOGGER.info("Ln 323");
			try {
				if (syncData.getOrder() == 0) {
					LOGGER.info("Sync order Value 0");
					invDetList.forEach(inventory -> {
						int tempSrcDataSyncId = inventory.getSrcSyncId();
						inventory.setSrcSyncId(inventory.getDestSyncId());
						inventory.setDestSyncId(tempSrcDataSyncId);
					});
					inventoryDetailsRepository.saveAll(invDetList);
				} else if (syncData.getOrder() == 1) {
					LOGGER.info("Sync order Value 1");
					List<String> ids = new ArrayList<>();
					invDetList.forEach(inventory -> ids.add(inventory.getId()));
					List<InventoryDetailsDao> epossInventoryList = inventoryDetailsRepository.findAllById(ids);
					for (InventoryDetailsDao epossInv : epossInventoryList) {
						for (InventoryDetailsDao possInv : invDetList) {
							if (possInv.getId().equals(epossInv.getId())) {
								LOGGER.info("check issued qty Eposs : " + epossInv.getIssuedQuantity());
								LOGGER.info("check issued qty poss : " + possInv.getIssuedQuantity());
								LOGGER.info("check total qty poss : " + possInv.getTotalQuantity());
								LOGGER.info("check total qty eposs : " + possInv.getTotalQuantity());
								if (epossInv.getTotalQuantity() != 0) {
									epossInv.setTotalQuantity(
											(short) (epossInv.getTotalQuantity() - possInv.getTotalQuantity()));
									epossInv.setTotalWeight(
											epossInv.getTotalWeight().subtract(possInv.getTotalWeight()));
									epossInv.setTotalValue(epossInv.getTotalValue().subtract(possInv.getTotalValue()));
									epossInv.setIssuedQuantity(
											(short) (epossInv.getIssuedQuantity() - possInv.getIssuedQuantity()));
									// swapping srcSyncId and destSyncID while bin to bin ( Issue observed in prod.)
									epossInv.setSrcSyncId(possInv.getDestSyncId());
									epossInv.setDestSyncId(possInv.getSrcSyncId());
								}
								LOGGER.info("check Final issued qty Eposs : " + epossInv.getIssuedQuantity());
								break;
							}
						}
					}
					inventoryDetailsRepository.saveAll(epossInventoryList);
				}

				if (operationCode.equals(InventoryOperationCodes.INV_STN_EPOSS_ADD)) {
					StockTransferDao stockTransfer = stockTransferRepository.findOneById(syncDtos.get(0).getStockId());
					stockTransfer.setStatus(RECEIVED);
					stockTransferRepository.save(stockTransfer);
					stockTransferDetailsRepository.updateAllStockIssueDetailsByItemIds(stockTransfer, RECEIVED);

				} else if (operationCode.equals(InventoryOperationCodes.INV_STN_EPOSS_CANCEL)) {
					StockTransferDao stockTransfer = stockTransferRepository.findOneById(syncDtos.get(0).getStockId());
					stockTransfer.setStatus(CANCELLED);
					stockTransferRepository.save(stockTransfer);
					stockTransferDetailsRepository.updateAllStockIssueDetailsByItemIds(stockTransfer, CANCELLED);
				} else if (operationCode.equals(InventoryOperationCodes.INV_CFA_EPOSS_ADD)) {
					StockInvoiceDao stockInvoice = stockInvoiceRepository.findOneById(syncDtos.get(0).getStockId());
					stockInvoice.setStatus(RECEIVED);
					stockInvoiceRepository.save(stockInvoice);
					stockInvoiceDetailsRepository.changeItemStatus(RECEIVED, stockInvoice);
				} else if (operationCode.equals(InventoryOperationCodes.INV_OTHERRECPT_EPOSS_ADD)) {
					StockTransactionDao stockTransactionDao = stockTransactionRepository
							.findOneById(syncDtos.get(0).getStockId());
					stockTransactionDao.setStatus(RECEIVED);
					stockTransactionRepository.save(stockTransactionDao);
					stockTransactionDetailsRepository.updateAllStockTransactionItemDetails(stockTransactionDao,
							RECEIVED);
				} else if (operationCode.equals(InventoryOperationCodes.INV_OTHERISSUE_EPOSS_ADD)) {
					StockRequestDao stockRequestDao = stockRequestRepository.findOneById(syncDtos.get(0).getStockId());
					stockRequestDao.setStatus(ISSUED);
					List<StockRequestDetailsDao> stockRequestDetails = stockRequestDetailsRepository
							.findAllByStockRequest(stockRequestDao);
					stockRequestDetails.forEach(stockRqstDts -> stockRqstDts.setStatus(ISSUED));
					stockRequestDetailsRepository.saveAll(stockRequestDetails);
				} else if (operationCode.equals(InventoryOperationCodes.INV_RINV_EPOSS_ADD)) {
					LOGGER.info("INSIDE RINV");
					StockInvoiceDao stockInvoice = stockInvoiceRepository.findOneById(syncDtos.get(0).getStockId());
					LOGGER.info("Stock Invoice " + stockInvoice.getStatus().toString() + " InvoiceId "
							+ stockInvoice.getId());
					stockInvoiceDetailsRepository.changeItemStatus(ISSUED, stockInvoice);
					LOGGER.info("Before StockInvObj " + stockInvoice.toString());
					stockInvoice.setStatus(ISSUED);
					stockInvoiceRepository.save(stockInvoice);
					LOGGER.info("StockInvObj " + stockInvoice.toString());
				} else if (operationCode.equals(InventoryOperationCodes.INV_STNISSUE_EPOSS_ADD)) {
					LOGGER.info("Ln 387");
					StockTransferDao stockTransfer = stockTransferRepository.findOneById(syncDtos.get(0).getStockId());
					stockTransfer.setStatus(ISSUED);
					stockTransferRepository.save(stockTransfer);
					stockTransferDetailsRepository.updateAllStockIssueDetailsByItemIds(stockTransfer, ISSUED);
				} else if (operationCode.equals(InventoryOperationCodes.INV_CONV_EPOSS_ADD)) {
					if (syncData.getOrder() == 0) {
						StockTransferDao stockTransfer = stockTransferRepository
								.findOneById(syncDtos.get(0).getStockId());
						stockTransfer.setStatus(RECEIVED);
						stockTransferRepository.save(stockTransfer);
						stockTransferDetailsRepository.updateAllStockIssueDetailsByItemIds(stockTransfer, RECEIVED);
					} else if (syncData.getOrder() == 1) {
						StockTransferDao stockTransfer = stockTransferRepository
								.findOneById(syncDtos.get(0).getStockId());
						stockTransfer.setStatus(ISSUED);
						stockTransferRepository.save(stockTransfer);
						stockTransferDetailsRepository.updateAllStockIssueDetailsByItemIds(stockTransfer, ISSUED);
					}

				} else if (operationCode.equals(InventoryOperationCodes.INV_CONV_EPOSS_UPDATE)) {
					StockRequestDao stockRequestDao = stockRequestRepository.findOneById(syncDtos.get(0).getStockId());
					if (stockRequestDao != null) {
						stockRequestDao.setStatus(CLOSED);
						List<StockRequestDetailsDao> stockRequestDetails = stockRequestDetailsRepository
								.findAllByStockRequest(stockRequestDao);
						stockRequestDetails.forEach(stockRqstDts -> stockRqstDts.setStatus(CLOSED));
						stockRequestDetailsRepository.saveAll(stockRequestDetails);
					}
				} else if (operationCode.equals(InventoryOperationCodes.INV_BIN_BIN_EPOSS_ADD)) {
					StockTransactionDao stockTransaction = stockTransactionRepository
							.findOneById(syncDtos.get(0).getStockId());
					BigDecimal totalValue = BigDecimal.ZERO;
					BigDecimal totalWeight = BigDecimal.ZERO;
					short totalQuantity = 0;
					List<StockTransactionDetailsDao> stockTransactionDetailsList = new ArrayList<>();
					// iterating the inventory item list and setting stock transaction details
					for (InventoryDetailsDao inventory : invDetList) {
						if (inventory.getActionType() != null) {
							if (inventory.getActionType().equals(InventoryDetailsActionEnum.ADD.name())
									&& inventory.getProductGroup().equals(ProductGroupCodeEnum.GOLD_COIN.getCode())) {
								setStockTransactionDetails(inventory.getBinCode(), stockTransactionDetailsList,
										stockTransaction, inventory);
								totalQuantity = (short) (totalQuantity + inventory.getIssuedQuantity());
								totalValue = totalValue.add(inventory.getStdValue()
										.multiply(new BigDecimal(inventory.getIssuedQuantity())));
								totalWeight = totalWeight.add(inventory.getStdWeight()
										.multiply(new BigDecimal(inventory.getIssuedQuantity())));
								// swapping srcSyncId and destSyncID while bin to bin ( Issue observed in prod.)
								int tempSrcDataSyncId = inventory.getSrcSyncId();
								inventory.setSrcSyncId(inventory.getDestSyncId());
								inventory.setDestSyncId(tempSrcDataSyncId);

							} else if (!inventory.getProductGroup().equals(ProductGroupCodeEnum.GOLD_COIN.getCode())) {
								setStockTransactionDetails(inventory.getBinCode(), stockTransactionDetailsList,
										stockTransaction, inventory);
								totalQuantity = (short) (totalQuantity + inventory.getTotalQuantity());
								totalValue = totalValue.add(inventory.getTotalValue());
								totalWeight = totalWeight.add(inventory.getTotalWeight());
								// swapping srcSyncId and destSyncID while bin to bin ( Issue observed in prod.)
								int tempSrcDataSyncId = inventory.getSrcSyncId();
								inventory.setSrcSyncId(inventory.getDestSyncId());
								inventory.setDestSyncId(tempSrcDataSyncId);
							}
						}
					}
					stockTransaction.setTotalIssuedQuantity(
							(short) (stockTransaction.getTotalIssuedQuantity() + totalQuantity));
					stockTransaction.setTotalReceivedQuantity(
							(short) (stockTransaction.getTotalReceivedQuantity() + totalQuantity));
					stockTransaction.setTotalIssuedValue(stockTransaction.getTotalIssuedValue().add(totalValue));
					stockTransaction.setTotalReceivedValue(stockTransaction.getTotalReceivedValue().add(totalValue));
					stockTransaction.setTotalIssuedWeight(stockTransaction.getTotalIssuedWeight().add(totalWeight));
					stockTransaction.setTotalReceivedWeight(stockTransaction.getTotalReceivedWeight().add(totalWeight));
					stockTransaction.setStatus(COMPLETED);
					stockTransactionRepository.save(stockTransaction);
					stockTransactionDetailsRepository.saveAll(stockTransactionDetailsList);
				}
				datasyncAuditService.updateDatasyncAuditStatusById(messageId, dest, DatasyncStatusEnum.SYNCED.name());
			} catch (DataIntegrityViolationException ex) {
				LOGGER.error(EXCEPTION, ex);
				datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId, dest,
						DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
			} catch (Exception ex) {
				LOGGER.error(EXCEPTION, ex);
				datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId, dest,
						DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
			}
		}

	}

	/**
	 * @param binCode
	 * @param stockTransactionDetailsList
	 * @param stockTransaction
	 * @param invDetList
	 */
	private void setStockTransactionDetails(String destinationBincode,
			List<StockTransactionDetailsDao> stockTransactionDetailsList, StockTransactionDao stockTransaction,
			InventoryDetailsDao inventory) {
		StockTransactionDetailsDao stockTransactionDetails;
		stockTransactionDetails = (StockTransactionDetailsDao) MapperUtil.getDtoMapping(inventory,
				StockTransactionDetailsDao.class);
		stockTransactionDetails.setIssuedBinCode(inventory.getPreviousBinCode());
		stockTransactionDetails.setReceivedBinCode(destinationBincode);
		stockTransactionDetails.setStatus(COMPLETED);
		stockTransactionDetails.setStockTransaction(stockTransaction);
		stockTransactionDetails.setInventoryId(inventory.getId());
		if (inventory.getProductGroup().equals(ProductGroupCodeEnum.GOLD_COIN.getCode())) {
			stockTransactionDetails.setIssuedQuantity(inventory.getIssuedQuantity());
			stockTransactionDetails
					.setIssuedWeight(inventory.getStdWeight().multiply(new BigDecimal(inventory.getIssuedQuantity())));
			stockTransactionDetails
					.setIssuedValue(inventory.getStdValue().multiply(new BigDecimal(inventory.getIssuedQuantity())));
		} else {
			stockTransactionDetails.setIssuedQuantity(inventory.getTotalQuantity());
			stockTransactionDetails
					.setIssuedWeight(inventory.getStdWeight().multiply(new BigDecimal(inventory.getTotalQuantity())));
			stockTransactionDetails
					.setIssuedValue(inventory.getStdValue().multiply(new BigDecimal(inventory.getTotalQuantity())));
		}
		stockTransactionDetails.setReceivedQuantity(inventory.getTotalQuantity());
		stockTransactionDetails.setReceivedWeight(inventory.getTotalWeight());
		stockTransactionDetails.setReceivedValue(inventory.getTotalValue());
		stockTransactionDetailsList.add(stockTransactionDetails);
	}

	@Transactional
	public void removeFromInventoryDetails(List<InventoryDetailsDao> inventoryDetails) {
		List<String> ids = new ArrayList<>();
		inventoryDetails.forEach(inventory -> ids.add(inventory.getId()));
		List<InventoryDetailsDao> possInvList = inventoryDetailsRepository.findAllById(ids);
		for (InventoryDetailsDao epossInv : inventoryDetails) {
			for (InventoryDetailsDao possInv : possInvList) {
				if (possInv.getId().equals(epossInv.getId())
						&& possInv.getLocationCode().equals(epossInv.getLocationCode())) {
					possInv.setTotalQuantity((short) (possInv.getTotalQuantity() - epossInv.getTotalQuantity()));
					possInv.setTotalWeight(possInv.getTotalWeight().subtract(epossInv.getTotalWeight()));
					possInv.setSrcSyncId(possInv.getSrcSyncId() + 1);
					possInv.setTotalValue(possInv.getTotalValue().subtract(epossInv.getTotalValue()));
				}
			}
		}
		inventoryDetailsRepository.saveAll(possInvList);

	}

}
