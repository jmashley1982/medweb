import { useGetPageBySlug } from "@/demo-api";
import { PublicLayout } from "@/components/PublicLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "wouter";

export function StandardPage() {
  const { slug } = useParams();
  const { data: page, isLoading, error } = useGetPageBySlug(slug || "");

  if (isLoading) {
    return (
      <PublicLayout>
        <Skeleton className="w-full h-[340px] rounded-none" />
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </PublicLayout>
    );
  }

  if (error || !page) {
    return (
      <PublicLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-muted-foreground">Page not found.</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {page.headerImage && (
        <div className="w-full h-[380px] overflow-hidden relative">
          <img
            src={page.headerImage}
            alt={page.title}
            className="w-full h-full object-cover object-[50%_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />
        </div>
      )}

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        <header className="border-b border-border pb-8">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary">
            {page.title}
          </h1>
        </header>

        {page.videoUrl && (
          <div className="aspect-video rounded-xl overflow-hidden shadow-md border border-border">
            <iframe
              src={page.videoUrl.replace("watch?v=", "embed/")}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {page.content && (
          <div
            className="prose prose-lg prose-headings:font-serif prose-headings:text-primary prose-p:text-slate-600 prose-a:text-primary max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}
      </article>
    </PublicLayout>
  );
}
