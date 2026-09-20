import { FaEnvelope, FaGlobe, FaLinkedin, FaNewspaper } from "react-icons/fa6";
import {
  LuArrowUpRight,
  LuChevronLeft,
  LuChevronRight,
  LuFileText,
  LuMonitor,
  LuMoon,
  LuSun,
} from "react-icons/lu";
import { SiGithub, SiInstagram, SiX } from "react-icons/si";

import type { SocialIcon } from "@/lib/content";

/**
 * All icons come from react-icons.
 *
 * The social row is deliberately all-solid: Simple Icons for the brand marks,
 * Font Awesome solid for the generic ones, so a row of mixed brand and utility
 * icons keeps one visual weight. LinkedIn comes from Font Awesome because
 * Simple Icons removed it after a trademark request.
 *
 * Interface icons — the theme toggle, the external-link arrow, the résumé
 * mark — are Lucide, which is a stroked set and reads as chrome rather than
 * as a logo.
 */
export const socialIcons: Record<SocialIcon, React.ComponentType<{ className?: string }>> = {
  github: SiGithub,
  linkedin: FaLinkedin,
  twitter: SiX,
  instagram: SiInstagram,
  mail: FaEnvelope,
  globe: FaGlobe,
  blog: FaNewspaper,
};

export const ArrowUpRightIcon = LuArrowUpRight;
export const FileTextIcon = LuFileText;
export const SunIcon = LuSun;
export const MoonIcon = LuMoon;
export const MonitorIcon = LuMonitor;
export const ChevronLeftIcon = LuChevronLeft;
export const ChevronRightIcon = LuChevronRight;
