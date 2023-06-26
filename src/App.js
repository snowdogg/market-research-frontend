import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Style definitions using styled-components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f2f2f2;
`;

const Footer = styled.p`
  position: absolute; 
  bottom: 0;
`

const Div = styled.div`
  font-family: 'work sans', sans-serif;
  font-size: 30px;
  color: black;
  padding: 20px;
  text-align: center;
  max-width: 480px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 20px;
    max-width: 80%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  width: 300px;
  border-radius: 5px;
  border: none;
  outline: none;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  color: white;
  background-color: #007BFF;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ResponseBlock = styled.div`
  margin-top: 20px;
  padding: 20px;
  width: 80%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const KeyValuePair = styled.p`
  margin: 0;
`;

const Key = styled.span`
  font-weight: bold;
`;

function App() {
  const [companyName, setCompanyName] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchCompanyData = async () => {
    setIsLoading(true);
    setIsError(false);

    const auth = {
      username: '',
      password: process.env.REACT_APP_API_KEY,
    };

    const body = {
      text: companyName,
    };
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_PYTHON_BACKEND_URL}`, body, { auth });
      
      setCompanyData(response.data);
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (e) => {
    setCompanyName(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (companyName !== "") {
      fetchCompanyData();
    }
  }
  

  return (
    <Container>
    <Div>
      Enter The Name Of A Company To See More Information About It
    </Div>
      <Form onSubmit={handleSubmit}>
        <Input type="text" placeholder="Enter Company Name" onChange={handleInputChange} />
        <Button type="submit">Submit</Button>
      </Form>

      {isLoading && <div style={{maxWidth: "80%"}}>Loading company data... please wait (this could take a few minutes hang in there while we query our servers)</div>}
      {isError && <div>Error fetching company data</div>}
      {companyData && !isLoading && 
        <ResponseBlock>
          {Object.entries(companyData).map(([key, value]) => (
            <KeyValuePair key={key}><Key>{key}:</Key> {value}</KeyValuePair>
          ))}
        </ResponseBlock>
      }
      <Footer>©Andreas Cary 2023</Footer>
    </Container>
  );
}

export default App;
