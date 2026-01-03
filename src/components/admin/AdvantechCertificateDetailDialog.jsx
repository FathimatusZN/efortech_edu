import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FileText, ExternalLink } from "lucide-react";

export const AdvantechCertificateDetailDialog = ({ open, onClose, item }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [selectedPreview, setSelectedPreview] = useState(null);

  useEffect(() => {
    if (open && item?.advantech_cert) {
      // Initialize loading states for all certificates
      const certUrls = Array.isArray(item.advantech_cert)
        ? item.advantech_cert
        : [item.advantech_cert];

      const initialLoadingStates = {};
      certUrls.forEach((_, index) => {
        initialLoadingStates[index] = true;
      });
      setLoadingStates(initialLoadingStates);

      // Auto-select first certificate for preview
      if (certUrls.length > 0) {
        setSelectedPreview(0);
      }
    }
  }, [open, item]);

  if (!item) return null;

  // Normalize advantech_cert to always be an array
  const certUrls = Array.isArray(item.advantech_cert)
    ? item.advantech_cert
    : item.advantech_cert
      ? [item.advantech_cert]
      : [];

  if (certUrls.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-md">
          <DialogHeader>
            <DialogTitle>Advantech Certificate Preview</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-gray-500">
            No certificate files found.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleLoadComplete = (index) => {
    setLoadingStates((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  const getFileName = (url) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      return pathParts[pathParts.length - 1] || `Certificate ${certUrls.indexOf(url) + 1}`;
    } catch {
      return `Certificate ${certUrls.indexOf(url) + 1}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-4xl lg:max-w-5xl max-h-[90vh] p-4 sm:p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            Advantech Certificate Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Certificate List - Horizontal on large screens, vertical on small */}
          {certUrls.length > 1 && (
            <div className="border-b pb-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Files ({certUrls.length}):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {certUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPreview(index)}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left ${selectedPreview === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                  >
                    <FileText
                      className={`w-5 h-5 flex-shrink-0 ${selectedPreview === index ? "text-blue-600" : "text-red-500"
                        }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        File {index + 1}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {getFileName(url)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preview Section */}
          {selectedPreview !== null && certUrls[selectedPreview] && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">
                  {certUrls.length > 1
                    ? `Previewing File ${selectedPreview + 1} of ${certUrls.length}`
                    : "Certificate Preview"}
                </p>
                <a
                  href={certUrls[selectedPreview]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in new tab
                </a>
              </div>

              <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] border border-gray-300 rounded-lg overflow-hidden">
                {loadingStates[selectedPreview] && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                    <LoadingSpinner className="w-10 h-10" />
                  </div>
                )}
                <iframe
                  src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                    certUrls[selectedPreview]
                  )}`}
                  title={`Advantech Certificate File ${selectedPreview + 1}`}
                  className="w-full h-full"
                  onLoad={() => handleLoadComplete(selectedPreview)}
                />
              </div>
            </div>
          )}

          {/* Alternative: Display all certificates in a vertical list */}
          {/* Uncomment this section if you prefer vertical layout with all previews visible */}
          {/* 
          <div className="space-y-6">
            {certUrls.map((url, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-500" />
                    <p className="text-sm font-medium text-gray-700">
                      File {index + 1}
                    </p>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </a>
                </div>
                <div className="relative w-full h-[300px] sm:h-[400px] border rounded overflow-hidden">
                  {loadingStates[index] && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                      <LoadingSpinner className="w-10 h-10" />
                    </div>
                  )}
                  <iframe
                    src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`}
                    title={`Certificate ${index + 1}`}
                    className="w-full h-full"
                    onLoad={() => handleLoadComplete(index)}
                  />
                </div>
              </div>
            ))}
          </div>
          */}
        </div>
      </DialogContent>
    </Dialog>
  );
};