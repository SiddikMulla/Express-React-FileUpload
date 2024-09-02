import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Form } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
    const [folderPath, setFolderPath] = useState('');
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserPath = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user/path', {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                });
                setFolderPath(response.data.directoryPath);
            } catch (error) {
                console.error('Error fetching user path:', error);
            }
        };

        fetchUserPath();
    }, [auth.token]);

    const handlePathChange = (event) => {
        setFolderPath(event.target.value);
    };

    const submitFolderPath = async () => {
        try {
            await axios.post('http://localhost:5000/api/files/set-directory', {
                directoryPath: folderPath,
                dirName: 'SidUpload'
            }, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });
            alert('Folder Created');
            navigate('/uploadDir');
        } catch (error) {
            console.error('Error submitting folder path:', error);
        }
    };

    return (
        <Container className="d-flex justify-content-center flex-column align-items-center mt-5">
            <Form.Group controlId="formFolderPath" className="mb-3">
                <Form.Label>Folder Path</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Folder path"
                    value={folderPath}
                    onChange={handlePathChange}
                />
            </Form.Group>

            <Button
                variant="primary"
                className="mb-5"
                onClick={submitFolderPath}
                disabled={!folderPath.trim()}
            >
                Submit Folder Path
            </Button>
        </Container>
    );
};

export default FileUpload;
