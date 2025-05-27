// src/App.jsx

import { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './App.css'; 

function App() {
  const [getResponse, setGetResponse] = useState('');
  const [postResponse, setPostResponse] = useState('');

  // URL de tu API Slim (asegúrate de que coincida con lo que configuraste en Slim)
	const API_URL = 'https://eventos.laprensagrafica.com/gatewayLPG';
	const AES_SECRET_KEY = CryptoJS.enc.Hex.parse('a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2');
	const HMAC_SECRET_KEY = CryptoJS.enc.Hex.parse('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');


	function encryptSensitiveField(valueToEncrypt) {
		// 1. Generar un IV único para cada encriptación (16 bytes = 128 bits para AES)
		const iv = CryptoJS.lib.WordArray.random(16);

		// 2. Encriptar el valor
		const ciphertext = CryptoJS.AES.encrypt(valueToEncrypt, AES_SECRET_KEY, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		}).toString();

		// 3. Calcular el HMAC del texto cifrado
		const hmac = CryptoJS.HmacSHA256(ciphertext, HMAC_SECRET_KEY).toString();

		// 4. Devolver un objeto que contenga el IV, ciphertext y HMAC
		// Convertir IV a una cadena hexadecimal para que sea fácil de transmitir
		const ivHex = CryptoJS.enc.Hex.stringify(iv);

		return {
			iv: ivHex,
			ciphertext: ciphertext,
			hmac: hmac
		};
	}

    const [postData, setFormData] = useState({
        app_transaction_id: '',
        getClientIp: '',
        getClientUsername: '',
        card_holder: '',
        card_number: '',
        card_cvv: '',
        expiration_month: '',
        expiration_year: '',
        getPaymentConcept: '',
        getPaymentAmount: ''
    });

    const handlePostChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
	
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
		 const encryptedCar = encryptSensitiveField(postData.card_number);
		 const encryptedCvv = encryptSensitiveField(postData.card_cvv);

		const formData = {
			app_transaction_id: postData.app_transaction_id,
			getClientIp: postData.getClientIp,
			getClientUsername: postData.getClientUsername,
			card_holder: postData.card_holder,
			card_number: encryptedCar,
			card_cvv: encryptedCvv,
			expiration_month: postData.expiration_month,
			expiration_year: postData.expiration_year,
			getPaymentConcept: postData.getPaymentConcept,
			getPaymentAmount: postData.getPaymentAmount,
		};
		
      const response = await axios.post(`${API_URL}/dev/payment`, formData, {
        headers: {
			Authorization: `Bearer U4OFU3QiRfqcO2AOVsd27W4KBDiJYdgkJPeOA9FLQuHf0v6bPoeSXt3lhT0VBEAh`,
			'Content-Type': 'application/json' 
        }
      });
      setPostResponse(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Error al hacer la solicitud POST:', error);
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        setPostResponse(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        setPostResponse('No se recibió respuesta del servidor.');
      } else {
        // Algo sucedió al configurar la solicitud
        setPostResponse(`Error de Axios: ${error.message}`);
      }
    }
  };

  return (
    <div className="App">
      <h1>Consumo de API REST (Slim + Axios)</h1>
      <section>
        <h2>Solicitud POST a `/dev/payment`</h2>
        <form onSubmit={handlePostSubmit}>
          <label>
            app_transaction_id:
            <input
              type="text"
              name="app_transaction_id"
              value={postData.app_transaction_id}
              onChange={handlePostChange}
              required
            />
          </label>
          <br />
          <label>
            getClientIp:
            <input
              type="text"
              name="getClientIp"
              value={postData.getClientIp}
              onChange={handlePostChange}
              required
            />
          </label>
          <br />
          <label>
            getClientUsername:
            <input
              type="text"
              name="getClientUsername"
              value={postData.getClientUsername}
              onChange={handlePostChange}
              required
            />
          </label>
          <br />
          <label>
            card_holder:
            <input
              type="text"
              name="card_holder"
              value={postData.card_holder}
              onChange={handlePostChange}
              required
            />
          </label>
          <br />
          <label>
            card_number:
            <input
              type="text"
              name="card_number"
              value={postData.card_number}
              onChange={handlePostChange}
              required
            />
          </label>
          <br />
          <label>
            card_cvv:
            <input
              type="text"
              name="card_cvv"
              value={postData.card_cvv}
              onChange={handlePostChange}
              required
            />
          </label>
          <br />
          <label>
            expiration_month:
            <input
              type="text"
              name="expiration_month"
              value={postData.expiration_month}
              onChange={handlePostChange}
              required
            />
          </label>
          <br />
          <label>
            expiration_year:
            <input
              type="text"
              name="expiration_year"
              value={postData.expiration_year}
              onChange={handlePostChange}
              required
            />
          </label>
          <br />
          <label>
            getPaymentConcept:
            <input
              type="text"
              name="getPaymentConcept"
              value={postData.getPaymentConcept}
              onChange={handlePostChange}
              required
            />
          </label>
          <br />
          <label>
            getPaymentAmount:
            <input
              type="text"
              name="getPaymentAmount"
              value={postData.getPaymentAmount}
              onChange={handlePostChange}
              required
            />
          </label>
          <br />
          <button type="submit">Enviar Datos por POST</button>
        </form>
        {postResponse && (
          <div>
            <h3>Respuesta POST:</h3>
            <pre><code>{postResponse}</code></pre>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;