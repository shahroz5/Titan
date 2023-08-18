/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.documents;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.NumberToWordsFactory;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dao.BankDepositDaoExt;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.response.ChequeDepositPrintDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.BankDepositRepositoryExt;
import com.titan.poss.sales.service.DocumentGenerator;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ChequeDepositDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	@Autowired
	BankDepositRepositoryExt bankDepositRepository;

	@Autowired
	NumberToWordsFactory numberToWordsFactory;

	@Autowired
	EngineServiceClient engineClient;

	public ChequeDepositDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.DEPOSIT.name(),
				PrintFileTypeEnum.CHEQUE_PRINT.name(), this);
	}

	@Override
	public PrintableDto getPrintableDto(String txnId, String productCode) {
		//return getftlBindingObjectForChequeDeposit(txnId);
		return null;
	}

	/**
	 * @param txnId
	 * @return
	 */
	private PrintableDto getftlBindingObjectForChequeDeposit(PrintRequestDto printRequest) {
		//BankDepositDaoExt bankDepositDao = getBankDepositDao(txnId);
		List<BankDepositDaoExt> bankDepositDaos =getBankDepositDaos(printRequest.getTransactionIds());
		List<BankDepositDaoExt> bankDepositDaoList = new ArrayList<>();
		ChequeDepositPrintDto chequeDepositPrintDto = new ChequeDepositPrintDto();
		chequeDepositPrintDto.setStoreDetails(getStoreDetails());
//
		if (bankDepositDaos.get(0).getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.CHEQUE.getPaymentcode())
				|| bankDepositDaos.get(0).getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.DD.getPaymentcode())) {
//
//			List<String> paymentCode = new ArrayList<>();
//			paymentCode.add(PaymentCodeEnum.CHEQUE.name());
//			paymentCode.add(PaymentCodeEnum.DD.name());
//			List<BankDepositDaoExt> depositDaoList = bankDepositRepository
//					.findAllByPayeeBankNameAndDepositDateAndIsBankingCompletedAndLocationCodeAndPaymentCodeIn(
//							bankDepositDao.getPayeeBankName(), bankDepositDao.getDepositDate(), Boolean.TRUE,
//							bankDepositDao.getLocationCode(), paymentCode);
//
//			if (!bankDepositDao.getPayerBankName().equalsIgnoreCase(bankDepositDao.getPayeeBankName()))
//				depositDaoList.forEach(bankDeposit -> {
//					if (!bankDeposit.getPayerBankName().equalsIgnoreCase(bankDeposit.getPayeeBankName()))
//						bankDepositDaoList.add(bankDeposit);
//				});
//			else {
//				depositDaoList.forEach(bankDeposit -> {
//					if (bankDeposit.getPayerBankName().equalsIgnoreCase(bankDeposit.getPayeeBankName()))
//						bankDepositDaoList.add(bankDeposit);
//				});
//			}
		
			chequeDepositPrintDto.setBankDepositDaos(bankDepositDaos);
			chequeDepositPrintDto.setTotalAmount(BigDecimal.ZERO);
			chequeDepositPrintDto.getBankDepositDaos().forEach(depositDao -> chequeDepositPrintDto
					.setTotalAmount(chequeDepositPrintDto.getTotalAmount().add(depositDao.getAmount())));
			chequeDepositPrintDto.setInstrumentNo(chequeDepositPrintDto.getBankDepositDaos().size());
			chequeDepositPrintDto.setDepositDate(bankDepositDaos.get(0).getDepositDate());

			chequeDepositPrintDto.setPriceInWords(numberToWordsFactory.getPriceInWords(
					chequeDepositPrintDto.getTotalAmount().longValue(), DomainConstants.ASIAN_PRICE_TYPE));
			chequeDepositPrintDto.setHierarchyCode(getHierarchyCode(bankDepositDaos.get(0).getLocationCode()));
			chequeDepositPrintDto.setSlipNo(bankDepositDaos.get(0).getPifNo());
			//BigInteger slipNo = bankDepositRepository.findLastSlipNumber(bankDepositDao.getLocationCode());
//			if (slipNo == null) {
//				String depositSlipNo = getHierarchyCode(bankDepositDao.getLocationCode())
//						+ ApplicationPropertiesUtil.getProperty("deposit.slip.number");
//				chequeDepositPrintDto.setSlipNo(depositSlipNo);
//				for (BankDepositDaoExt bankDepositDaoExt : bankDepositDaoList) {
//					bankDepositRepository.updateSlipNumber(depositSlipNo, bankDepositDaoExt.getId());
//				}
//			} else {
//				slipNo = slipNo.add(BigInteger.ONE);
//				chequeDepositPrintDto.setSlipNo((slipNo).toString());
//				for (BankDepositDaoExt bankDepositDaoExt : bankDepositDaoList) {
//					bankDepositRepository.updateSlipNumber(slipNo.toString(), bankDepositDaoExt.getId());
//				}
//			}
			chequeDepositPrintDto.setLocationCode(bankDepositDaos.get(0).getLocationCode());
			return chequeDepositPrintDto;
		} else {
			throw new ServiceException("Invalid payment mode", "ERR-SALE-015");
		}

	}

	/**
	 * @param locationCode
	 * @return
	 */
	private String getHierarchyCode(String locationCode) {

		return engineClient.getGLCode(locationCode).getCostCenter();
	}

	/**
	 * @param txnId
	 * @return
	 */
	private List<BankDepositDaoExt> getBankDepositDaos(List<String> ids) {
		List<BankDepositDaoExt> bankDepositDaos = bankDepositRepository.findAllByIdAndLocationCode(ids,CommonUtil.getLocationCode());
		if (bankDepositDaos == null)
			throw new ServiceException("No bank deposit details found", "ERR-SALE-291");

		if (bankDepositDaos.get(0).getDepositDate() == null)
			throw new ServiceException("There are some pending bank deposits", "ERR-SALE-120");
		return bankDepositDaos;
	}

	@Override
	public PrintableDto getDto() {
		return new ChequeDepositPrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		return getftlBindingObjectForChequeDeposit(printRequest);
	}

}
