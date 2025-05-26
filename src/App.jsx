// src/App.jsx

import { useState } from 'react';
import axios from 'axios';
import './App.css'; // Si tienes estilos, si no, puedes quitarlo

function App() {
  const [getResponse, setGetResponse] = useState('');
  const [postResponse, setPostResponse] = useState('');
  const [postData, setPostData] = useState({ app_transaction_id: '', getClientIp: '', getClientUsername: '', card_holder: '', card_number: '', card_cvv: '', expiration_month: '', expiration_year: '', getPaymentConcept: '', getPaymentAmount: '' });

  // URL de tu API Slim (asegúrate de que coincida con lo que configuraste en Slim)
  const API_URL = 'https://eventos.laprensagrafica.com/gatewayLPG';

  const handleGetRequest = async () => {
    try {
      const response = await axios.get(`${API_URL}/getResponseDevExample`); // Consumiendo la ruta GET raíz
      setGetResponse(response.data);
    } catch (error) {
      console.error('Error al hacer la solicitud GET:', error);
      setGetResponse('Error al obtener los datos.');
    }
  };

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setPostData(prevData => ({ ...prevData, [name]: value }));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/dev/payment`, postData, {
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