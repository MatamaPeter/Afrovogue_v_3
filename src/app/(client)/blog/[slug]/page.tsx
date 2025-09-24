import Container from "@/components/Container";
import { Title } from "@/components/ui/text";
import { SINGLE_BLOG_QUERYResult, Slug } from "../../../../../sanity.types";
import {
  getBlogCategories,
  getOthersBlog,
  getSingleBlog,
} from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Calendar, ChevronLeftIcon, Pencil, ArrowRight } from "lucide-react";
import dayjs from "dayjs";
import { PortableText } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";

const SingleBlogPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const blog: SINGLE_BLOG_QUERYResult = await getSingleBlog(slug);
  if (!blog) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-kitenge-cream/30 to-white py-12">
      <Container className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Hero Image */}
          {blog?.mainImage && (
            <div className="relative rounded-2xl overflow-hidden mb-8">
              <Image
                src={urlFor(blog?.mainImage).url()}
                alt={blog.title || "Blog Image"}
                width={800}
                height={500}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-8 p-4 bg-kitenge-cream/50 rounded-xl">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {blog?.blogcategories?.map(
                (item: { title: string | null }, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-kitenge-red/10 text-kitenge-red text-xs font-semibold rounded-full border border-kitenge-red/20"
                  >
                    {item?.title || "Untitled"}
                  </span>
                )
              )}
            </div>

            {/* Author */}
            <div className="flex items-center gap-2 text-gray-800">
              <Pencil size={16} />
              <span className="text-sm font-medium">{blog?.author?.name}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-kitenge-red">
              <Calendar size={16} />
              <span className="text-sm font-medium">
                {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 leading-tight">
            {blog?.title}
          </h1>

          {/* Content */}
          <article className="prose prose-lg max-w-none">
            <div className="text-gray-800/90">
              {blog.body && (
                <PortableText
                  value={blog.body}
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <p className="my-6 text-base/7 text-gray-800/90 first:mt-0 last:mb-0">
                          {children}
                        </p>
                      ),
                      h2: ({ children }) => (
                        <h2 className="my-8 text-2xl font-bold text-kitenge-green border-l-4 border-kitenge-gold pl-4 first:mt-0 last:mb-0">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="my-6 text-xl font-semibold text-kitenge-green first:mt-0 last:mb-0">
                          {children}
                        </h3>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="my-6 border-l-4 border-kitenge-gold pl-6 bg-kitenge-cream/30 py-4 rounded-r-lg text-gray-800 italic first:mt-0 last:mb-0">
                          {children}
                        </blockquote>
                      ),
                    },
                    types: {
                      image: ({ value }) => (
                        <div className="my-8 rounded-xl overflow-hidden shadow-lg">
                          <Image
                            alt={value.alt || ""}
                            src={urlFor(value).width(2000).url()}
                            className="w-full"
                            width={1400}
                            height={1000}
                          />
                        </div>
                      ),
                      separator: ({ value }) => {
                        switch (value.style) {
                          case "line":
                            return (
                              <hr className="my-8 border-t-2 border-kitenge-gold/30" />
                            );
                          case "space":
                            return <div className="my-8" />;
                          default:
                            return null;
                        }
                      },
                    },
                    list: {
                      bullet: ({ children }) => (
                        <ul className="my-6 space-y-2 list-disc pl-6 marker:text-kitenge-red">
                          {children}
                        </ul>
                      ),
                      number: ({ children }) => (
                        <ol className="my-6 space-y-2 list-decimal pl-6 marker:text-kitenge-red marker:font-bold">
                          {children}
                        </ol>
                      ),
                    },
                    listItem: {
                      bullet: ({ children }) => {
                        return (
                          <li className="pl-2 text-gray-800/90">
                            {children}
                          </li>
                        );
                      },
                      number: ({ children }) => {
                        return (
                          <li className="pl-2 text-gray-800/90">
                            {children}
                          </li>
                        );
                      },
                    },
                    marks: {
                      strong: ({ children }) => (
                        <strong className="font-bold text-kitenge-green">
                          {children}
                        </strong>
                      ),
                      code: ({ children }) => (
                        <code className="px-2 py-1 bg-kitenge-cream text-kitenge-red rounded-md font-mono text-sm">
                          {children}
                        </code>
                      ),
                      link: ({ value, children }) => {
                        return (
                          <Link
                            href={value.href}
                            className="text-kitenge-red hover:text-kitenge-green underline decoration-kitenge-gold underline-offset-4 font-medium"
                          >
                            {children}
                          </Link>
                        );
                      },
                    },
                  }}
                />
              )}
            </div>

            {/* Back to Blog */}
            <div className="mt-12 pt-8 border-t border-kitenge-gold/20">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-gray-800 hover:text-kitenge-red font-semibold group transition-colors duration-200"
              >
                <ChevronLeftIcon className="size-5 transform group-hover:-translate-x-1 transition-transform" />
                <span>Back to all articles</span>
              </Link>
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <BlogSidebar slug={slug} />
        </div>
      </Container>
    </div>
  );
};

const BlogSidebar = async ({ slug }: { slug: string }) => {
  const categories = await getBlogCategories();
  const blogs = await getOthersBlog(slug, 5);

  return (
    <div className="space-y-8 sticky top-8">
      {/* Categories */}
      <div className="bg-white rounded-2xl shadow-sm border border-kitenge-cream p-6">
        <Title className="text-lg font-bold text-kitenge-green mb-4">
          Blog Categories
        </Title>
        <div className="space-y-3">
          {categories?.map(
            (
              cat: {
                title: string | null;
                slug: Slug | null;
                description: string | null;
                blogCount: number;
              },
              index: number
            ) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-kitenge-cream last:border-b-0 group cursor-pointer"
              >
                <span className="text-gray-800 group-hover:text-kitenge-red transition-colors duration-200 font-medium">
                  {cat?.title || "Untitled"}
                </span>
                <span className="bg-kitenge-red text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cat?.blogCount || 0}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Latest Blogs */}
      <div className="bg-white rounded-2xl shadow-sm border border-kitenge-cream p-6">
        <Title className="text-lg font-bold text-kitenge-red mb-4">
          Latest Articles
        </Title>
        <div className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {blogs?.map((blog: any, index: number) => (
            <Link
              href={`/blog/${blog?.slug?.current}`}
              key={index}
              className="flex items-center gap-3 group p-2 rounded-lg hover:bg-kitenge-cream/50 transition-all duration-200"
            >
              {blog?.mainImage && (
                <div className="relative flex-shrink-0">
                  <Image
                    src={urlFor(blog?.mainImage).url()}
                    alt="blogImage"
                    width={60}
                    height={60}
                    className="w-12 h-12 rounded-lg object-cover border-2 border-kitenge-cream group-hover:border-kitenge-gold transition-colors duration-200"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-kitenge-red transition-colors duration-200">
                  {blog?.title}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar size={10} className="text-kitenge-red" />
                  <span className="text-xs text-kitenge-red/80">
                    {dayjs(blog.publishedAt).format("MMM D")}
                  </span>
                </div>
              </div>
              <ArrowRight
                size={14}
                className="text-kitenge-gold opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleBlogPage;
