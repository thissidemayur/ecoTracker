export interface IUserLocation {
  country: string;
  state: string;
  district: string;
  pincode: string;
}

export interface IUser {
  id: string;
  name?: string;
  username?: string;
  email: string;
  role: "user" | "admin";
  isVerified: boolean;

  // New Onboarding & Location Fields
  location?: IUserLocation;
  home_size_sqm?: number;
  household_members?: number;
  hasOnboarded?: boolean;

  // Metadata
  createdAt: string;
  updatedAt: string;
  image?: string;
}

export interface AuthData {
  user: IUser;
  accessToken: string;
  accessTokenExpire: string;
}

export interface RefreshTokenData extends AuthData {
  refreshToken: string;
}
