import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const data: ContactItemData[] = [
  {
    title: "Visit Us",
    subtitle: "Nairobi, Kenya",
    icon: (
      <MapPin className="h-7 w-7 text-kitenge-red group-hover:scale-110 transition-all duration-300" />
    ),
  },
  {
    title: "Call Us",
    subtitle: "+254 793 517 987",
    icon: (
      <Phone className="h-7 w-7 text-kitenge-red group-hover:scale-110 transition-all duration-300" />
    ),
  },
  {
    title: "Working Hours",
    subtitle: "Mon - Sat: 10AM - 7PM",
    icon: (
      <Clock className="h-7 w-7 text-kitenge-red group-hover:scale-110 transition-all duration-300" />
    ),
  },
  {
    title: "Email Us",
    subtitle: "info@afrovogue.com",
    icon: (
      <Mail className="h-7 w-7 text-kitenge-red group-hover:scale-110 transition-all duration-300" />
    ),
  },
];

const FooterTop = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-b border-gray-200 pb-10 mt-5">
      {data?.map((item, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 group p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-kitenge-red/10 group-hover:bg-kitenge-red/20 transition-colors duration-300">
            {item?.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1.5">
              {item?.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {item?.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;