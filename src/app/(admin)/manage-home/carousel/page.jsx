'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

const getYoutubeID = (url) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : '';
};

export default function CarouselUploader() {
  const [mediaType, setMediaType] = useState('image');
  const [file, setFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [carouselData, setCarouselData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  async function fetchCarouselData() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/home`);
      const json = await res.json();
      if (json.data) {
        setCarouselData(json.data);
      }
    } catch (err) {
      console.error('Error fetching carousel data:', err);
    }
  }

  useEffect(() => {
    fetchCarouselData();
  }, []);

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/home/upload-home-content`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const json = await res.json();
    if (json.data?.imageUrl) {
      return json.data.imageUrl;
    } else {
      throw new Error('Upload image failed');
    }
  }

  async function updateContent(content_id, content_link) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/home/${content_id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content_link }),
      }
    );
    if (!res.ok) {
      throw new Error('Update content failed');
    }
  }

  async function handleUpload(content_id) {
    setLoading(true);
    try {
      if (mediaType === 'youtube' && youtubeUrl) {
        await updateContent(content_id, youtubeUrl);
        setYoutubeUrl('');
      } else if (file) {
        const imageUrl = await uploadImage(file);
        await updateContent(content_id, imageUrl);
        setFile(null);
      }

      await fetchCarouselData();
      setEditIndex(null);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Upload/update failed');
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-6">Preview Carousel</h3>
        {carouselData.length === 0 ? (
          <p className="text-sm text-gray-500">Carousel content not found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {carouselData.map((item, index) => (
              <div
                key={item.content_id}
                className="border-2 border-mainBlue rounded-2xl p-4 shadow-sm"
              >
                <div className="flex flex-col gap-2 items-center">
                  {item.content_link.includes('youtube.com') ||
                  item.content_link.includes('youtu.be') ? (
                    <iframe
                      width="100%"
                      height="180"
                      src={`https://www.youtube.com/embed/${getYoutubeID(item.content_link)}`}
                      className="rounded-md"
                      allowFullScreen
                    />
                  ) : (
                    <Image
                      src={item.content_link}
                      alt="Uploaded Image"
                      width={400}
                      height={180}
                      className="object-cover rounded-md w-full h-[180px]"
                    />
                  )}
                  <span className="text-xs text-gray-500 capitalize">
                    {item.content_link.includes('youtube') ? 'youtube' : 'image'}
                  </span>
                  <Button
                    variant="orange"
                    onClick={() =>
                      setEditIndex(editIndex === index ? null : index)
                    }
                    className="mt-2"
                  >
                    {editIndex === index ? 'Cancel' : 'Edit'}
                  </Button>
                </div>

                {/* Form Edit */}
                {editIndex === index && (
                  <div className="mt-4 w-full border-t pt-4">
                    <Label className="block mb-1 font-medium">Select Media Type</Label>
                    <div className="flex gap-4 mb-2">
                      {['image', 'youtube'].map((type) => (
                        <label key={type} className="capitalize">
                          <input
                            type="radio"
                            name={`mediaType-${index}`}
                            value={type}
                            checked={mediaType === type}
                            onChange={() => setMediaType(type)}
                            className="mr-1"
                          />
                          {type === 'youtube' ? 'YouTube Link' : type}
                        </label>
                      ))}
                    </div>

                    {mediaType === 'youtube' ? (
                      <div className="mb-4">
                        <Input
                          type="text"
                          placeholder="https://youtube.com/..."
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="mb-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setFile(e.target.files?.[0] || null)
                          }
                        />
                      </div>
                    )}

                    <Button
                      variant="orange"
                      onClick={() => handleUpload(item.content_id)}
                      disabled={loading}
                    >
                      {loading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
