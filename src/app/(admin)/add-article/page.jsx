"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TextEditor from "../../../components/admin/TextEditor";
import {
  PageTitle,
  SaveButton,
  DiscardButton,
  InputField,
  SelectDropdown,
  ImageUploader,
  AddLabel,
  SourcesInput,
} from "@/components/layout/InputField";
import { useParams, useRouter } from "next/navigation";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { SuccessDialog } from "@/components/ui/SuccessDialog";

export default function AddArticle() {
  const params = useParams();
  const router = useRouter();

  const [sources, setSources] = useState([
    { preview_text: "", source_link: "" },
  ]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(0);
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [author, setAuthor] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const isFormValid =
    title.trim() !== "" && content.trim() !== "" && category !== 0;

  const { user } = useAuth();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [articleId, setArticleId] = useState(null);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const cleanImages = images.filter(
        (url) => typeof url === "string" && url.startsWith("https")
      );

      const payload = {
        title,
        category,
        content_body: content,
        admin_id: user?.user_id,
        author: author || user?.fullname || user?.email,
        tags: tags.filter((tag) => tag.trim() !== ""),
        sources: sources.filter((src) => src.preview_text && src.source_link),
        images: cleanImages,
      };

      if (!title || !content || category === 0) {
        alert("Please fill in the required fields!");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to submit article");

      const data = await res.json();
      setArticleId(data.data.article_id);
      setShowSuccess(true);
      resetForm();
    } catch (err) {
      console.error("❌ Submit error:", err);
      setShowError(true);
    }
  };

  const handleImageUpload = (imageUrl) => {
    setImages((prevImages) => [...prevImages, imageUrl]);
  };

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setCategory(0);
    setTags([]);
    setContent("");
    setImages([]);
    setSources([{ preview_text: "", source_link: "" }]);
  };

  const handleDiscard = () => {
    resetForm();
    setOpenDialog(false);
    router.push("/article-admin");
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <div className="relative pt-4 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen">
        <div className="flex flex-wrap justify-between items-center w-full max-w-[1440px] mx-auto mb-2 gap-4">
          <div className="flex flex-wrap justify-between items-center w-full max-w-[1440px] mx-auto mt-6 mb-4 gap-4">
            <PageTitle title="Add New Article" />
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <SaveButton onClick={handleSubmit} disabled={!isFormValid} />
              <DiscardButton onClick={() => setOpenDialog(true)} />
            </div>
          </div>
        </div>

        <ConfirmDialog
          open={openDialog}
          onCancel={() => setOpenDialog(false)}
          onConfirm={handleSubmit}
          onDiscard={handleDiscard}
        />

        <div className="outline outline-3 outline-mainBlue p-6 bg-white shadow-md rounded-lg border w-full">
          <InputField
            label="Title"
            placeholder="Type title here.."
            required
            className="mt-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-wrap md:flex-nowrap gap-8 mt-2">
            <div className="w-full md:w-[40%] flex flex-col space-y-4">
              <InputField
                label="Author"
                placeholder="Author's name.."
                className="mt-4"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
              <SelectDropdown
                label="Category"
                required
                className="mt-2"
                value={category}
                onChange={(e) => setCategory(parseInt(e.target.value))}
              >
                <option value={0}>Choose Category</option>
                <option value={1}>Education</option>
                <option value={2}>Event</option>
                <option value={3}>Success Case</option>
              </SelectDropdown>
              <AddLabel
                onChange={(value) => setTags(value)}
                value={tags}
                className="mt-2"
                label="Tags"
                placeholder="Tags"
              />
            </div>

            <div className="w-full md:w-[60%] flex flex-col space-y-2">
              <ImageUploader
                maxImages={3}
                images={images}
                setImages={setImages}
                onImageUpload={handleImageUpload}
                uploadEndpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles/upload-image`}
              />
            </div>
          </div>

          <label className="font-semibold mt-2 block">
            Content <span className="text-error1">*</span>
          </label>
          <TextEditor
            onChange={(value) => setContent(value)}
            value={content}
            className="mt-2 "
          />

          <label className="font-semibold mt-6 block">Sources</label>
          <SourcesInput sources={sources} setSources={setSources} />
        </div>
      </div>

      <SuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Article Submitted!"
        messages={[
          `ID: ${articleId ?? "-"}`,
          "Your article was successfully submitted.",
        ]}
        buttonText="Back to Article List"
        onButtonClick={() => router.push("/article-admin")}
      />
    </ProtectedRoute>
  );
}
