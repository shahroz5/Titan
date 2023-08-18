/**
 * 
 */
package com.titan.poss.integration.service.impl;

import static com.titan.poss.core.utils.FileUtil.FILE_PATH_SEPARATOR;

import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.CertificateTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.integration.dto.request.SignatureDto;
import com.titan.poss.integration.service.CryptoService;
import com.titan.poss.integration.service.SignatureFactory;
import com.titan.poss.integration.service.impl.singature.QZTraySignature;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("CryptoService")
public class CryptoServiceImpl implements CryptoService {

	@Value("${cert.file.source.path}")
	private String certFilePath;

	@Override
	public Map<String, Object> getCertificate(CertificateTypeEnum certificateType) {

		String filePath = certFilePath + FILE_PATH_SEPARATOR + certificateType.toString();
		String keyFileName = certificateType.getPublicKey();

		String content = FileUtil.getFileContentInStringFormat(filePath, keyFileName, true);

		return Map.of("key", content);
	}

	@Override
	public Map<String, Object> getSignature(@Valid SignatureDto signatureDto) {

		CertificateTypeEnum certType = signatureDto.getCertificateType();

		SignatureFactory signatureFactory = null;

		if (certType == CertificateTypeEnum.QZTRAY)
			signatureFactory = new QZTraySignature();
		else
			throw new ServiceException("Type is not registered", "ERR-INT-001");

		String message = signatureFactory.sign(certFilePath, signatureDto.getToSign());

		return Map.of("message", message);

	}

	@Override
	public String encryptString(String input) {
		return CryptoUtil.asymmetricEncrypt(input, null);
	}

	@Override
	public String decryptString(String input) {
		return CryptoUtil.asymmetricDecrypt(input, null, false);
	}

}
