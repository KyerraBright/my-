import React, { useState } from 'react';
import axios from 'axios';
import "../design.css"

const DesignForm = () => {
    const [design, setDesign] = useState('');
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setLoading(true);

        const formData = new FormData();
        formData.append('design', design);
        formData.append('color', color);
        formData.append('size', size);
        formData.append('price', price);

        if (image) {
            formData.append('image', image); // Append the image as a file, not base64
        } else {
            setErrorMessage('Please select an image.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // This is crucial for file upload
                }
            });
            console.log('Success:', response.data);
            setSuccessMessage('Item added successfully!');
            // Clear the form after successful submission
            setDesign('');
            setColor('');
            setSize('');
            setPrice('');
            setImage(null);
            setImagePreview('');
        } catch (error) {
            console.error('Error adding item:', error);
            setErrorMessage('Failed to add item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!design) {
            alert('Please enter a design name to delete.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.delete('http://localhost:3001/delete', {
                data: { design },
            });
            console.log('Delete success:', response.data);
            setSuccessMessage('Design deleted successfully!');
            setDesign('');
        } catch (error) {
            console.error('Error deleting:', error);
            setErrorMessage('Failed to delete item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Set the image preview
            };
            reader.readAsDataURL(file); // Read the file as base64 for preview purposes
        }
    };

    return (
        <div>
            <h1>Add or Delete Design</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="design">Design:</label>
                <input type="text" id="design" value={design} onChange={(e) => setDesign(e.target.value)} required />
                
                <label htmlFor="color">Color:</label>
                <input type="text" id="color" value={color} onChange={(e) => setColor(e.target.value)} required />
                
                <label htmlFor="size">Size:</label>
                <input type="text" id="size" value={size} onChange={(e) => setSize(e.target.value)} required />
                
                <label htmlFor="price">Price:</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                
                <label htmlFor="image">Image:</label>
                <input type="file" id="image" accept="image/*" onChange={handleImageChange} required />
                
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px' }} />}
                
                <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add'}</button>
                <button type="button" onClick={handleDelete} disabled={loading}>Delete</button>
            </form>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        </div>
    );
};

export default DesignForm;