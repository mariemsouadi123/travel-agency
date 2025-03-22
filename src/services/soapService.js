import axios from 'axios';

const SOAP_ENDPOINT = 'http://localhost:8080/ws'; // Remplace par ton endpoint SOAP

export const makeSoapRequest = async (soapAction, soapBody) => {
  const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://travel.com/reservation">
      <soapenv:Header/>
      <soapenv:Body>
        ${soapBody}
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  try {
    const response = await axios.post(SOAP_ENDPOINT, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': soapAction,
      },
    });

    return response.data; // Retourne la réponse XML
  } catch (error) {
    console.error('SOAP Request Error:', error);
    throw error;
  }
};
