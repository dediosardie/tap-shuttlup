export type ModeType = "personal" | "corporate" | "driver" | "fleet" | "investor";

export type PublicProfile = {
  id: string;
  username: string;
  full_name: string;
  position: string;
  company: string;
  bio: string;
  avatar_url?: string | null;
  mobile_no?: string | null;
  verified: boolean;
  theme: string;
  social_links: { platform: string; url: string }[];
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
