import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { MessageCircle, Facebook, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const socialLinks = [
  {
    title: "Whatsapp",
    href: "https://whatsapp.com",
    icon: <MessageCircle />,
  },
  {
    title: "Instagram",
    href: "https://instagram.com",
    icon: <Instagram />,
  },
  {
    title: "Facebook",
    href: "https://facebook.com/",
    icon: <Facebook />,
  },
];

interface SocialMediaProps {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

const SocialMedia = ({ className, iconClassName, tooltipClassName }: SocialMediaProps) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3.5", className)}>
        {socialLinks.map((item) => (
          <Tooltip key={item.title}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.title}
                className={cn(
                  "p-2 border rounded-full transition-colors hover:text-kitenge-red hover:border-kitenge-gold",
                  iconClassName
                )}
              >
                {item.icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                "text-white px-2 py-1 rounded-md bg-kitenge-red font-semibold text-sm shadow-md",
                tooltipClassName
              )}
              side="top"
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
