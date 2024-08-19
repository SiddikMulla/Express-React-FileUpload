import React, { useState } from 'react';
import axios from 'axios';
import { Button, ListGroup } from 'react-bootstrap';

const FileUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showFiles, setShowFiles] = useState(false);

    const fetchUploadedFiles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/files/folder');
            setUploadedFiles(response.data.files);
        } catch (error) {
            console.error('Error fetching uploaded files:', error);
        }
    };


    const uploadFiles = async () => {
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            await axios.post('http://localhost:5000/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Files uploaded successfully!');
            setShowFiles(true);
            fetchUploadedFiles();
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    return (
        <div>

            <Button onClick={uploadFiles}>Upload Files</Button>
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
        </div>
    );
};

export default FileUpload;
