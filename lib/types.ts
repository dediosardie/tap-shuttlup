export type ModeType = "personal" | "corporate" | "driver" | "fleet" | "investor";

export type ProjectVisibility = "public" | "nfc" | "private";

export type ProjectLink = {
  platform: string;
  url: string;
};

export type ProjectInvolvement = {
  id: string;
  name: string;
  role: string;
  description: string;
  logo_url?: string | null;
  active: boolean;
  verified?: boolean;
  visibility: ProjectVisibility;
  website?: string | null;
  social_links: ProjectLink[];
};

export type PublicProfile = {
  id: string;
  username: string;
  full_name: string;
  position: string;
  company: string;
  bio: string;
  avatar_url?: string | null;
  mobile_no?: string | null;
  email?: string | null;
  verified: boolean;
  theme: string;
  mode: string;
  social_links: { platform: string; url: string }[];
  projects?: ProjectInvolvement[];
  fleet_info?: {
    vehicle_type?: string;
    plate_number?: string;
    operator_id?: string;
    verified?: boolean;
  } | null;
  metrics?: {
    taps: number;
    views: number;
    saves: number;
  };
};
