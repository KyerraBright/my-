import React, { useState } from 'react';
import axios from 'axios';
import "../design.css";

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
            formData.append('image', image); // Append the image as a file
        } else {
            setErrorMessage('Please select an image.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Success:', response.data);
            setSuccessMessage('Design added successfully!');
            setDesign('');
            setColor('');
            setSize('');
            setPrice('');
            setImage(null);
            setImagePreview('');
        } catch (error) {
            console.error('Error adding design:', error);
            setErrorMessage('Failed to add design. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);

        // Generate a preview of the image
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <h1>Add or Delete Design</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="design">Design:</label>
                <input
                    type="text"
                    id="design"
                    value={design}
                    onChange={(e) => setDesign(e.target.value)}
                    required
                />

                <label htmlFor="color">Color:</label>
                <input
                    type="text"
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                />

                <label htmlFor="size">Size:</label>
                <input
                    type="text"
                    id="size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                />

                <label htmlFor="price">Price:</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <label htmlFor="image">Image:</label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                />

                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ width: '100px', height: '100px' }}
                    />
                )}

                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </form>

            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        </div>
    );
};

export default DesignForm;
