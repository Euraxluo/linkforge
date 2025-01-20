"use client";
import {PreviewData} from "@/lib/utils";
import {useCallback, useRef, useState} from "react";
import Cropper, {Area, Point} from "react-easy-crop";
import * as React from "react";
import EnhancedUploadButton from "@/components/mint/EnhancedUploadButton";
import {WalrusClient} from "tuskscript";

function ProfileForm({data, updateData}: { data: PreviewData, updateData: (data: PreviewData) => void }) {
    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateData({[e.target.name]: e.target.value});
    };

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileUpload = (file: File) => {
        if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            alert('File size should not exceed 10MB');
        }
    };


    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        handleFileUpload(file)
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }
    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: Area
    ): Promise<Blob | null> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return null;
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg');
        });
    };
    const handleUpload = async () => {
        if (!image || !croppedAreaPixels) {
            return;
        }

        const client = new WalrusClient();

        try {
            setUploading(true);
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);

            if (croppedImage) {
                const imageBlob = new Blob([croppedImage], {type: 'image/jpeg'});
                const result = await client.store(imageBlob, {contentType: 'image/jpeg'});
                if ('newlyCreated' in result) {
                    updateData({
                        u: `https://aggregator-devnet.walrus.space/v1/${result.newlyCreated.blobObject.blobId as string}`
                    })
                } else if ('alreadyCertified' in result) {
                    updateData({
                        u: `https://aggregator-devnet.walrus.space/v1/${result.alreadyCertified.blobId as string}`
                    })
                }

            }
        } catch (e) {
            console.error(e);
        } finally {
            setUploading(false);
            setImage(null); // Clear the image after upload
        }
    };

    return (
        <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    type="text"
                    id="name"
                    name="n"
                    value={data.n}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">About yourself</label>
                <textarea
                    id="about"
                    name="b"
                    value={data.b}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                />
            </div>
            <div className="mb-4">
                <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                <input
                    type="text"
                    id="photoUrl"
                    name="u"
                    value={data.u}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div
                className={`relative h-64 w-full mb-4 border-2 border-dashed rounded-lg ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDoubleClick={handleClick}
            >
                {image ? (
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                ) : (
                    <div className="flex cursor-pointer items-center justify-center h-full">
                        <p className="text-gray-500">
                            Drag and drop an image here, or double click to select a file
                        </p>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                    }}
                    accept="image/*"
                    className="hidden  cursor-pointer"
                />
            </div>
            {image && (
                <EnhancedUploadButton
                    onClick={handleUpload}
                    uploading={uploading}
                />
            )}
        </div>
    );
}


export default ProfileForm;