/**
 * 
 */
package com.titan.poss.integration.service.impl.singature;

import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.CertificateTypeEnum;
import com.titan.poss.integration.service.SignatureFactory;
import com.titan.poss.integration.util.MessageSigner;

/**
 * @author Mindtree
 * @version 1.0
 */
@Service("QZTraySignatureService")
public class QZTraySignature implements SignatureFactory {

	@Override
	public String sign(String certFilePath, String toSign) {
		return MessageSigner.sign(certFilePath, toSign, CertificateTypeEnum.QZTRAY);
	}
}
