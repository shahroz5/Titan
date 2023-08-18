/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.documents;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.NumberToWordsFactory;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dao.BankDepositDaoExt;
import com.titan.poss.sales.dao.BankDepositSummaryDao;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.response.CashDepositPrintDto;
import com.titan.poss.sales.dto.response.DepositDetails;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.BankDepositRepositoryExt;
import com.titan.poss.sales.repository.BankDepositsSummaryRepository;
import com.titan.poss.sales.service.DocumentGenerator;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class CashDepositDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	@Autowired
	BankDepositRepositoryExt bankDepositRepository;

	@Autowired
	EngineServiceClient engineClient;

	@Autowired
	NumberToWordsFactory numberToWordsFactory;

	
	@Autowired
	private BankDepositsSummaryRepository bankDepositsSummaryRepo;
	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	public CashDepositDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.DEPOSIT.name(),
				PrintFileTypeEnum.CASH_PRINT.name(), this);
	}

	@Override
	public PrintableDto getPrintableDto(String txnId, String productCode) {
		//return getftlBindingObjectForCashDeposit(txnId);
		return null;
	}

	/**
	 * @param txnId
	 * @return
	 */
	private CashDepositPrintDto getftlBindingObjectForCashDeposit(PrintRequestDto printRequest) {

//		BankDepositDaoExt bankDepositDao = bankDepositRepository.findByIdAndLocationCode(txnId,
//				CommonUtil.getLocationCode());
		List<BankDepositDaoExt> bankDepositDaos = bankDepositRepository.findAllByIdAndLocationCode(printRequest.getTransactionIds(),CommonUtil.getLocationCode());
		
		if(CollectionUtils.isEmpty(bankDepositDaos)) {
			throw new ServiceException("No bank deposit details found", "ERR-SALE-291");
		}
		CashDepositPrintDto cashDepositPrintDto = new CashDepositPrintDto();
		BigDecimal depositAmount = BigDecimal.ZERO;
		//List<CashDepositPrintDto> cashDepositPrintDtos = new ArrayList<>();
		for(BankDepositDaoExt bankDepositDao : bankDepositDaos) {
			if (bankDepositDao == null)
				throw new ServiceException("No bank deposit details found", "ERR-SALE-291");
			if (bankDepositDao.getBankDepositSummaryDao() == null) {
				throw new ServiceException("Cash denomination is not present", "ERR-SALE-251");
			}
			BankDepositSummaryDao bankDepositSummaryDao = bankDepositsSummaryRepo
					.findOneById(bankDepositDao.getBankDepositSummaryDao().getId());
			if (bankDepositDao.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.CASH.name())) {

				if (bankDepositDao.getDepositDate() == null)
					throw new ServiceException("There are some pending bank deposits", "ERR-SALE-120");

				
				cashDepositPrintDto.setStoreDetails(getStoreDetails());
				cashDepositPrintDto.setBankDepositDao(bankDepositDao);
				if (bankDepositSummaryDao.getDenominationDetails() != null) {
					JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(
							MapperUtil.getJsonFromString(bankDepositSummaryDao.getDenominationDetails()), JsonData.class);
					DepositDetails depositDetails = MapperUtil.getObjectMapperInstance().convertValue(
							MapperUtil.getJsonFromString(MapperUtil.getJsonString(jsonData.getData())),
							DepositDetails.class);
					cashDepositPrintDto.setDepositDetail(getDenominationDependents(depositDetails));
					if (depositDetails.getTotalCoinsAmount()==null || depositDetails.getTotalCoinsAmount().equalsIgnoreCase(""))
						cashDepositPrintDto.setCoinAmount("0");
					else
						cashDepositPrintDto.setCoinAmount(depositDetails.getTotalCoinsAmount());
				}
				

				cashDepositPrintDto.setHierarchyCode(getHierarchyCode(bankDepositDao.getLocationCode()));
				depositAmount = depositAmount.add(bankDepositDao.getDepositAmount());
				cashDepositPrintDto.setSlipNo(bankDepositDao.getPifNo());
//				BigInteger slipNo = bankDepositRepository.findLastSlipNumber(bankDepositDao.getLocationCode());
//				if (slipNo == null) {
//					String depositSlipNo = getHierarchyCode(bankDepositDao.getLocationCode())
//							+ ApplicationPropertiesUtil.getProperty("deposit.slip.number");
//					cashDepositPrintDto.setSlipNo(depositSlipNo);
//					bankDepositRepository.updateSlipNumber(depositSlipNo, bankDepositDao.getId());
//				} else {
//					slipNo = slipNo.add(BigInteger.ONE);
//					cashDepositPrintDto.setSlipNo((slipNo).toString());
//					bankDepositRepository.updateSlipNumber(slipNo.toString(), bankDepositDao.getId());
//				}
				//cashDepositPrintDtos.add(cashDepositPrintDto);
	            
			}
			
			else {
				throw new ServiceException("Invalid payment mode", "ERR-SALE-015");
			}

		};
		cashDepositPrintDto.setPriceInWords(numberToWordsFactory
				.getPriceInWords(depositAmount.longValue(), DomainConstants.ASIAN_PRICE_TYPE));
		cashDepositPrintDto.setDepositAmount(depositAmount);
		return cashDepositPrintDto;
//		if(!CollectionUtil.isEmpty(cashDepositPrintDtos)) {
//			return cashDepositPrintDtos;
//		}
//		else {
//			return null;
//		}

	}
	
	/**
	 * @param locationCode
	 * @return
	 */
	private String getHierarchyCode(String locationCode) {

		return engineClient.getGLCode(locationCode).getCostCenter();
	}

	/**
	 * @param depositDetails
	 * @return
	 */
	private Map<String, Integer> getDenominationDependents(DepositDetails depositDetails) {

		Map<String, Integer> denomination = new TreeMap<>();
		if (depositDetails.getNoOfTwoThousandNotes() == null
				|| depositDetails.getNoOfTwoThousandNotes().equalsIgnoreCase(""))
			denomination.put("2000", 0);
		else
			denomination.put("2000", Integer.parseInt(depositDetails.getNoOfTwoThousandNotes()));
		if (depositDetails.getNoOFiveHundredNotes() == null
				|| depositDetails.getNoOFiveHundredNotes().equalsIgnoreCase(""))
			denomination.put("500", 0);
		else {
			denomination.put("500", Integer.parseInt(depositDetails.getNoOFiveHundredNotes()));
		}
		if (depositDetails.getNoOfTwoHundredNotes() == null
				|| depositDetails.getNoOfTwoHundredNotes().equalsIgnoreCase(""))
			denomination.put("200", 0);
		else
			denomination.put("200", Integer.parseInt(depositDetails.getNoOfTwoHundredNotes()));
		if (depositDetails.getNoOfHundredNotes() == null || depositDetails.getNoOfHundredNotes().equalsIgnoreCase(""))
			denomination.put("100", 0);
		else
			denomination.put("100", Integer.parseInt(depositDetails.getNoOfHundredNotes()));
		if (depositDetails.getNoOfFiftyNotes() == null || depositDetails.getNoOfFiftyNotes().equalsIgnoreCase(""))
			denomination.put("50", 0);
		else
			denomination.put("50", Integer.parseInt(depositDetails.getNoOfFiftyNotes()));
		if (depositDetails.getNoOfTwentyNotes()==null || depositDetails.getNoOfTwentyNotes().equalsIgnoreCase(""))
			denomination.put("20", 0);
		else
			denomination.put("20", Integer.parseInt(depositDetails.getNoOfTwentyNotes()));
		if (depositDetails.getNoOfTenNotes() == null || depositDetails.getNoOfTenNotes().equalsIgnoreCase(""))
			denomination.put("10", 0);
		else
			denomination.put("10", Integer.parseInt(depositDetails.getNoOfTenNotes()));
		if (depositDetails.getNoOfFiveNotes() == null || depositDetails.getNoOfFiveNotes().equalsIgnoreCase(""))
			denomination.put("5", 0);
		else
			denomination.put("5", Integer.parseInt(depositDetails.getNoOfFiveNotes()));
		return denomination;
	}

	@Override
	public PrintableDto getDto() {
		return new CashDepositPrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		return  getftlBindingObjectForCashDeposit(printRequest);
	}

}
