import {
  LuStethoscope, LuHeartPulse, LuShieldCheck, LuPawPrint, LuGlobe, LuFlaskConical,
  LuUsers, LuPresentation, LuGraduationCap, LuBadgeCheck, LuAward,
} from 'react-icons/lu'
import { FaLinkedinIn, FaOrcid, FaResearchgate, FaGoogleScholar } from 'react-icons/fa6'

const icons = {
  stethoscope: LuStethoscope,
  heart: LuHeartPulse,
  shield: LuShieldCheck,
  paw: LuPawPrint,
  globe: LuGlobe,
  flask: LuFlaskConical,
  users: LuUsers,
  presentation: LuPresentation,
  graduation: LuGraduationCap,
  badge: LuBadgeCheck,
  award: LuAward,
  linkedin: FaLinkedinIn,
  orcid: FaOrcid,
  researchgate: FaResearchgate,
  scholar: FaGoogleScholar,
}

// Resolves an icon by key so data files stay free of component imports.
export default function Icon({ name, className = 'h-5 w-5', ...rest }) {
  const Component = icons[name] ?? LuGlobe
  return <Component className={className} aria-hidden="true" {...rest} />
}
