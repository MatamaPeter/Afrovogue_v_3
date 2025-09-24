import { getLatestBlogs } from "@/sanity/queries";
import { Title } from "./ui/text";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Calendar, ArrowUpRight } from "lucide-react";
import dayjs from "dayjs";

const LatestBlog = async () => {
  const blogs = await getLatestBlogs();

  return (
    <div className="mb-16 lg:mb-28">
      <div className="flex justify-between items-end mb-10">
        <Title className="mb-0">Latest Articles</Title>
        <Link
          href="/blog"
          className="hidden md:flex items-center text-sm font-medium text-kitenge-red hover:text-kitenge-red/80 transition-colors duration-200 group"
        >
          View all articles
          <ArrowUpRight
            size={16}
            className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {blogs?.map((blog) => (
          <article
            key={blog?._id}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100/70 relative"
          >
            {/* Image Section */}
            <div className="relative overflow-hidden aspect-[4/3]">
              {blog?.mainImage ? (
                <Link href={`/blog/${blog?.slug?.current}`}>
                  <Image
                    src={urlFor(blog?.mainImage).url()}
                    alt={blog?.title || "Blog image"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-kitenge-red/10 to-kitenge-red/5 flex items-center justify-center">
                  <span className="text-kitenge-red/30 text-sm font-medium">
                    No Image
                  </span>
                </div>
              )}

              {/* Floating Date Badge */}
              {blog?.publishedAt && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                  <time
                    dateTime={blog.publishedAt}
                    className="text-xs font-medium text-gray-700 flex items-center"
                  >
                    <Calendar size={12} className="mr-1.5" />
                    {dayjs(blog.publishedAt).format("MMM D, YYYY")}
                  </time>
                </div>
              )}

              {/* Floating Read More Button */}
              <Link
                href={`/blog/${blog?.slug?.current}`}
                className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-2.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:scale-105"
                aria-label={`Read more about ${blog?.title}`}
              >
                <ArrowUpRight size={16} className="text-kitenge-red" />
              </Link>
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Categories */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {blog?.blogcategories?.slice(0, 2).map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-kitenge-red/10 text-kitenge-red"
                    >
                      {item?.title}
                    </span>
                  ))}
                  {blog?.blogcategories?.length > 2 && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      +{blog.blogcategories.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <Link
                href={`/blog/${blog?.slug?.current}`}
                className="block group/title"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover/title:text-kitenge-red transition-colors duration-300 line-clamp-2">
                  {blog?.title}
                </h3>
              </Link>

              {/* Excerpt from body content */}
              {blog?.body?.[0]?.children?.[0]?.text && (
                <p className="text-gray-600 text-sm line-clamp-3 mb-5 leading-relaxed">
                  {blog.body[0].children[0].text}
                </p>
              )}

              {/* Read More Link */}
              <Link
                href={`/blog/${blog?.slug?.current}`}
                className="inline-flex items-center text-sm font-medium text-kitenge-red hover:text-kitenge-red/80 transition-colors duration-200 group/link"
              >
                Read more
                <ArrowUpRight
                  size={16}
                  className="ml-1.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200"
                />
              </Link>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-2xl ring-1.5 ring-transparent group-hover:ring-kitenge-red/10 transition-all duration-500 pointer-events-none" />
          </article>
        ))}
      </div>

      {/* Mobile View All Blogs Link */}
      <div className="text-center mt-12 md:hidden">
        <Link
          href="/blog"
          className="inline-flex items-center px-6 py-3.5 bg-kitenge-red text-white font-medium rounded-xl hover:bg-kitenge-red/90 transition-all duration-200 group"
        >
          View All Articles
          <ArrowUpRight
            size={18}
            className="ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
          />
        </Link>
      </div>
    </div>
  );
};

export default LatestBlog;
