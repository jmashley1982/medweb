import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useParams } from "wouter";
import { 
  useAdminCreatePage, 
  useAdminUpdatePage, 
  useAdminGetPage,
  getAdminGetPageQueryKey,
  PageInputTemplate
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ArrowLeft, Image as ImageIcon, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function AdminPageForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPage = useAdminCreatePage();
  const updatePage = useAdminUpdatePage();
  
  const { data: pageToEdit, isLoading: isLoadingPage } = useAdminGetPage(Number(id), {
    query: { enabled: isEdit, queryKey: getAdminGetPageQueryKey(Number(id)) }
  });

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState<PageInputTemplate>("standard");
  const [content, setContent] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit && pageToEdit) {
      setTitle(pageToEdit.title);
      setSlug(pageToEdit.slug);
      setTemplate(pageToEdit.template as PageInputTemplate);
      setContent(pageToEdit.content || "");
      setHeaderImage(pageToEdit.headerImage || "");
      setVideoUrl(pageToEdit.videoUrl || "");
    }
  }, [isEdit, pageToEdit]);

  const handleTitleBlur = () => {
    if (!slug && title) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      if (data.success && data.url) {
        setHeaderImage(data.url);
        toast({ title: "Image uploaded successfully" });
      } else {
        toast({ title: data.error || "Upload failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const pageData = {
      title,
      slug,
      template,
      content,
      headerImage,
      videoUrl,
    };

    if (isEdit) {
      updatePage.mutate(
        { id: Number(id), data: pageData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getAdminGetPageQueryKey(Number(id)) });
            toast({ title: "Page updated successfully" });
            setLocation("/admin");
          },
          onError: () => {
            toast({ title: "Failed to update page", variant: "destructive" });
          }
        }
      );
    } else {
      createPage.mutate(
        { data: pageData },
        {
          onSuccess: () => {
            toast({ title: "Page created successfully" });
            setLocation("/admin");
          },
          onError: () => {
            toast({ title: "Failed to create page", variant: "destructive" });
          }
        }
      );
    }
  };

  if (isEdit && isLoadingPage) {
    return <AdminLayout><div className="flex justify-center p-12">Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setLocation("/admin")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-primary">
            {isEdit ? "Edit Page" : "Add New Page"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-lg border border-border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                required
                placeholder="e.g., About Us"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., about-us"
              />
              <p className="text-xs text-muted-foreground">Leave blank to auto-generate from title</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select value={template} onValueChange={(v) => setTemplate(v as PageInputTemplate)}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="home">Home (Hero layout)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headerImage">Header Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="headerImage"
                value={headerImage}
                onChange={(e) => setHeaderImage(e.target.value)}
                placeholder="https://..."
              />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                {isUploading ? <Upload className="w-4 h-4 animate-bounce" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>
            {headerImage && (
              <div className="mt-4 w-48 h-32 rounded-md overflow-hidden border border-border bg-gray-50 flex items-center justify-center">
                <img src={headerImage} alt="Header preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="e.g., YouTube embed URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write the page content here..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setLocation("/admin")}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPage.isPending || updatePage.isPending}>
              {(createPage.isPending || updatePage.isPending) ? "Saving..." : "Save Page"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
