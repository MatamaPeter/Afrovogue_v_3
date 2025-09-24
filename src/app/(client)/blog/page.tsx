import Container from "@/components/Container";
import { Title } from "@/components/ui/text";
import { urlFor } from "@/sanity/lib/image";
import { getAllBlogs } from "@/sanity/queries";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogPage = async () => {
  const blogs = await getAllBlogs();

  return (
    <div>
      <Container>
        <Title className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Blog
        </Title>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 md:mt-12">
          {blogs?.map((blog) => (
            <div
              key={blog?._id}
              className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300 group border border-gray-100"
            >
              {/* Blog Image */}
              {blog?.mainImage && (
                <div className="overflow-hidden relative">
                  <Image
                    src={urlFor(blog?.mainImage).url()}
                    alt="blogImage"
                    width={500}
                    height={400}
                    className="w-full h-60 object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                </div>
              )}

              {/* Blog Content */}
              <div className="p-5 space-y-3">
                {/* Category + Date */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex flex-wrap gap-2">
                    {blog?.blogcategories?.map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-kitenge-red/10 text-kitenge-red text-[11px] font-semibold rounded-full"
                      >
                        {item?.title}
                      </span>
                    ))}
                  </div>
                  <p className="flex items-center gap-1 text-gray-500 text-[11px]">
                    <Calendar size={13} />{" "}
                    {dayjs(blog.publishedAt).format("MMM D, YYYY")}
                  </p>
                </div>

                {/* Title */}
                <Link
                  href={`/blog/${blog?.slug?.current}`}
                  className="block text-lg font-bold tracking-wide line-clamp-2 text-gray-800 hover:text-shop_dark_green transition-colors duration-300"
                >
                  {blog?.title}
                </Link>
                <div className="text-sm text-gray-600 line-clamp-3">
                  {blog?.body &&
                    blog.body[0]?._type === "block" &&
                    blog.body[0].children
                      ?.map((child: { text?: string }) => child.text)
                      .join(" ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default BlogPage;
