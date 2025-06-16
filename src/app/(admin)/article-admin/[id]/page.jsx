"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TextEditor from "@/components/admin/TextEditor";
import {
    PageTitle, SaveButton, DiscardButton, InputField, SelectDropdown,
    ImageUploader, AddLabel, SourcesInput
} from "@/components/layout/InputField";
import { useParams, useRouter } from "next/navigation";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { NotFound, InternalServerError } from "@/components/ui/ErrorPage";
import { toast } from "react-hot-toast";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function EditArticle() {
    const params = useParams();
    const router = useRouter();
    const articleId = params.id;

    const { user } = useAuth();

    // States to manage form fields and UI flow
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(null); // 'notfound' | 'server' | null

    const [sources, setSources] = useState([{ preview_text: "", source_link: "" }]);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(0);
    const [tags, setTags] = useState([]);
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [author, setAuthor] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    // Check if form is ready to submit
    const isFormValid = title.trim() !== "" && content.trim() !== "" && category !== 0;

    // Fetch article details when the page loads
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles/${articleId}`);
                if (res.status === 404) {
                    setHasError("notfound");
                    return;
                }
                if (!res.ok) {
                    setHasError("server");
                    return;
                }

                const data = await res.json();
                const article = data.data;

                if (!article) {
                    setHasError("notfound");
                    return;
                }

                // Populate form fields with article data
                setTitle(article.title);
                setAuthor(article.author || user?.fullname || user?.email);
                setCategory(article.category);
                setContent(article.content_body);
                setTags(article.tags || []);
                setImages(article.images || []);
                setSources(article.sources || []);
            } catch (err) {
                console.error("❌ Error fetching article:", err);
                setHasError("server");
            } finally {
                setIsLoading(false);
            }
        };

        if (articleId) fetchArticle();
    }, [articleId, user]);

    // Handle article update (form submission)
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const cleanImages = images.filter((url) => typeof url === "string" && url.startsWith("http"));

            const payload = {
                title,
                category,
                content_body: content,
                admin_id: user?.user_id,
                author: author || user?.fullname || user?.email,
                tags: tags.filter(tag => tag.trim() !== ""),
                sources: sources.filter(src => src.preview_text && src.source_link),
                images: cleanImages,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles/update/${articleId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to update article");

            setShowSuccess(true);
        } catch (err) {
            console.error("❌ Update error:", err);
            toast.error("Failed to update article.");
        }
    };

    // Handle new image upload
    const handleImageUpload = (imageUrl) => {
        setImages((prevImages) => [...prevImages, imageUrl]);
    };

    // Reset the form fields
    const resetForm = () => {
        setTitle("");
        setAuthor("");
        setCategory(0);
        setTags([]);
        setContent("");
        setImages([]);
        setSources([{ preview_text: "", source_link: "" }]);
    };

    // Discard changes and navigate back
    const handleDiscard = () => {
        resetForm();
        setOpenDialog(false);
        router.push("/article-admin");
    };

    // Render 404 page if article not found
    if (hasError === "notfound") {
        return (
            <NotFound
                message="The article you're trying to edit doesn't exist or the link may be incorrect."
                buttons={[{ text: "Back to Article Admin", href: "/article-admin" }]}
            />
        );
    }

    // Render 500 page if server error occurs
    if (hasError === "server") {
        return <InternalServerError />;
    }

    // Show loading indicator while fetching article
    if (isLoading) {
        return <div className="text-center mt-10"><LoadingSpinner /></div>;
    }

    // Main UI rendering the article editor form
    return (
        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <div className="relative pt-4 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen">
                <div className="flex flex-wrap justify-between items-center w-full max-w-[1440px] mx-auto mb-2 gap-4">
                    <div className="flex flex-wrap justify-between items-center w-full max-w-[1440px] mx-auto mt-6 mb-4 gap-4">
                        <PageTitle title="Edit Article" />
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                            <SaveButton onClick={handleSubmit} disabled={!isFormValid} />
                            <DiscardButton onClick={() => setOpenDialog(true)} />
                        </div>
                    </div>
                </div>

                {/* Confirm discard changes dialog */}
                <ConfirmDialog
                    open={openDialog}
                    onCancel={() => setOpenDialog(false)}
                    onConfirm={handleSubmit}
                    onDiscard={handleDiscard}
                />

                {/* Article form */}
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

                        {/* Upload and display article images */}
                        <ImageUploader
                            maxImages={3}
                            images={images}
                            setImages={setImages}
                            onImageUpload={handleImageUpload}
                            uploadEndpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles/upload-image`}
                        />
                    </div>

                    {/* Rich text editor for article content */}
                    <label className="font-semibold mt-2 block">
                        Content <span className="text-error1">*</span>
                    </label>
                    <TextEditor
                        onChange={(value) => setContent(value)}
                        value={content}
                        className="mt-2"
                    />

                    {/* Input for article sources */}
                    <label className="font-semibold mt-6 block">Sources</label>
                    <SourcesInput sources={sources} setSources={setSources} />
                </div>
            </div>
            <SuccessDialog
                open={showSuccess}
                onOpenChange={(open) => {
                    setShowSuccess(open);
                    if (!open) {
                        resetForm();
                        router.push(`/article-admin`);
                    }
                }}
                title="Article Updated!"
                messages={[
                    "Your changes have been successfully saved.",
                    "Redirecting to article detail..."
                ]}
                buttonText="Continue"
                onButtonClick={() => {
                    router.push(`/article-admin`);
                }}
            />

            <SuccessDialog
                open={showError}
                onOpenChange={(open) => setShowError(open)}
                title="Update Failed"
                messages={[
                    "Something went wrong while updating the article.",
                    "Please try again later or check your form."
                ]}
                buttonText="Close"
            />
        </ProtectedRoute>
    );
}
