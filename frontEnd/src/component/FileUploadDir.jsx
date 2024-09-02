import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, ListGroup } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';

const FileUploadDir = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showFiles, setShowFiles] = useState(false);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        fetchUploadedFiles();
    }, []);

    const fetchUploadedFiles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/files/folder', {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });
            setUploadedFiles(response.data.files);
            setShowFiles(true);
        } catch (error) {
            console.error('Error fetching uploaded files:', error);
        }
    };

    const uploadFiles = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.style.display = 'none';

        input.onchange = async (event) => {
            const files = event.target.files;
            if (!files.length) return;

            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });

            try {
                await axios.post('http://localhost:5000/api/files/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${auth.token}`
                    }
                });

                fetchUploadedFiles(); // Refresh file list after upload
            } catch (error) {
                console.error('Error uploading files:', error);
            }
        };

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    };

    return (
        <Container className='d-flex justify-content-center flex-column align-items-center'>
            <Button variant='success' className='mb-5' onClick={uploadFiles}>Upload Files</Button>

            {showFiles && (
                <>
                    <h3>Uploaded Files:</h3>
                    <ListGroup>
                        {uploadedFiles.length > 0 ? (
                            uploadedFiles.map((file, index) => (
                                <ListGroup.Item key={index}>
                                    {file}
                                </ListGroup.Item>
                            ))
                        ) : (
                            <ListGroup.Item>No files uploaded yet.</ListGroup.Item>
                        )}
                    </ListGroup>
                </>
            )}
        </Container>
    );
};

export default FileUploadDir;
