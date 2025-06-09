"use client";

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import toast from 'react-hot-toast';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const getYoutubeID = (url) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : "";
};

export default function CarouselUploader() {
  const [mediaType, setMediaType] = useState("image");
  const [file, setFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [carouselData, setCarouselData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  async function fetchCarouselData() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/home`
      );
      const json = await res.json();
      if (json.data) {
        setCarouselData(json.data);
      }
    } catch (err) {
      console.error('Error fetching carousel data:', err);
      toast.error('Failed to fetch carousel data');
    }
  }

  useEffect(() => {
    fetchCarouselData();
  }, []);

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append('images', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/home/upload-home-content`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Image upload failed: ${errorText}`);
      }

      const json = await res.json();
      if (json.data?.imageUrl) {
        return json.data.imageUrl;
      } else {
        throw new Error('Image upload failed: No imageUrl received');
      }
    } catch (err) {
      console.error('Upload error:', err);
      throw err;
    }
  }

  async function updateContent(content_id, content_link) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/home/${content_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content_link }),
      }
    );
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update content: ${errorText}`);
    }
  }

  async function handleUpload(content_id) {
    setLoading(true);
    try {
      if (mediaType === "youtube" && youtubeUrl) {
        await updateContent(content_id, youtubeUrl);
        setYoutubeUrl("");
      } else if (file) {
        const imageUrl = await uploadImage(file);
        await updateContent(content_id, imageUrl);
        setFile(null);
      }

      await fetchCarouselData();
      setEditIndex(null);

      toast.success('Carousel content updated successfully');
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to upload or update content");
    }
    setLoading(false);
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-6">Carousel Preview</h3>
          {carouselData.length === 0 ? (
            <p className="text-sm text-gray-500">No carousel content found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {carouselData.map((item, index) => {
                const isYoutube = item.content_link.includes('youtube.com') || item.content_link.includes('youtu.be');

                return (
                  <div
                    key={item.content_id}
                    className="border-2 border-mainBlue rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-2 items-center">
                      {isYoutube ? (
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
                        {isYoutube ? 'YouTube' : 'Image'}
                      </span>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="orange"
                            onClick={() => {
                              setEditIndex(index);
                              setFile(null);
                              const isYT = item.content_link.includes('youtube.com') || item.content_link.includes('youtu.be');
                              setMediaType(isYT ? 'youtube' : 'image');
                              setYoutubeUrl(isYT ? item.content_link : '');
                            }}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Carousel Content</DialogTitle>
                          </DialogHeader>
                          <Label className="mb-1">Choose Media Type</Label>
                          <div className="flex gap-4 mb-2">
                            {['image', 'youtube'].map((type) => (
                              <label key={type} className="capitalize">
                                <input
                                  type="radio"
                                  name={`mediaType-${item.content_id}`}
                                  value={type}
                                  checked={mediaType === type}
                                  onChange={() => setMediaType(type)}
                                  className="mr-1"
                                />
                                {type === 'youtube' ? 'YouTube Link' : 'Image'}
                              </label>
                            ))}
                          </div>

                          {mediaType === 'youtube' ? (
                            <Input
                              key="youtube"
                              type="text"
                              placeholder="https://youtube.com/..."
                              value={youtubeUrl}
                              onChange={(e) => setYoutubeUrl(e.target.value)}
                            />
                          ) : (
                            <Input
                              key="image"
                              type="file"
                              accept="image/*"
                              onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                          )}
                          <Button
                            variant="orange"
                            onClick={() => handleUpload(item.content_id)}
                            disabled={loading}
                          >
                            {loading ? 'Uploading...' : 'Upload'}
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}