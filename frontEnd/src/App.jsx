import React from 'react';
import FileUpload from './component/FileUpload';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <>
      <Container
        className='d-flex 
      justify-content-center 
      flex-column 
      align-items-center 
      mt-5'>
        <h3>File Upload to database</h3>
        <FileUpload />
      </Container>
    </>

  );
}

export default App;
