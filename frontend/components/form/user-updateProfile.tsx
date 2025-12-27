"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserApi } from "@/hooks/useUserApi";
import { useAuthStore } from "@/state/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, User, AtSign, Home, Users } from "lucide-react";
import { Country, State, City } from "country-state-city";
import { z } from "zod";

// 1. IMPROVED SCHEMA with COERCE for numbers
export const updateProfileSchema = z
  .object({
    name: z.string().min(2, "Name too short").optional(),
    username: z
      .string()
      .min(3, "Username too short")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers, and underscores allowed"
      )
      .optional(),
    location: z
      .object({
        country: z.string().min(1, "Required"),
        state: z.string().min(1, "Required"),
        district: z.string().min(1, "Required"),
        pincode: z.string().length(6, "Must be 6 digits"),
      })
      .optional(),
    // Coerce handles strings coming from HTML inputs and turns them into numbers
    home_size_sqm: z.coerce.number().min(1, "Min 1").optional(),
    household_members: z.coerce.number().min(1, "Min 1").optional(),
    hasOnboarded: z.boolean().optional(),
  })
  .partial();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export function UpdateProfileForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuthStore();
  const { updateProfile, isUserLoading } = useUserApi();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      location: {
        country: user?.location?.country || "IN",
        state: user?.location?.state || "",
        district: user?.location?.district || "",
        pincode: user?.location?.pincode || "",
      },
      home_size_sqm: user?.home_size_sqm || 1,
      household_members: user?.household_members || 1,
    },
  });

  const watchedCountry = watch("location.country");
  const watchedState = watch("location.state");

  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(watchedCountry);
  const cities = City.getCitiesOfState(
    watchedCountry || "IN",
    watchedState || ""
  );

  const onSubmit = async (data: UpdateProfileInput) => {
    console.log("Form Data Submitted:", data); // Debugging log
    const result = await updateProfile(data);
    if (result && onSuccess) onSuccess();
  };

  // Log errors to console so you see why it fails
  if (Object.keys(errors).length > 0) {
    console.log("Validation Errors:", errors);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-h-[70vh] overflow-y-auto px-1 no-scrollbar pb-4"
    >
      {/* PERSONAL INFO */}
      <div className="space-y-4">
        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
          Personal Info
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-[10px] text-zinc-500 uppercase flex gap-2">
              <User className="size-3" /> Name
            </Label>
            <Input
              {...register("name")}
              className="bg-zinc-900 border-zinc-800 rounded-xl text-white"
            />
            {errors.name && (
              <p className="text-[10px] text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-zinc-500 uppercase flex gap-2">
              <AtSign className="size-3" /> Username
            </Label>
            <Input
              {...register("username")}
              className="bg-zinc-900 border-zinc-800 rounded-xl text-white"
            />
            {errors.username && (
              <p className="text-[10px] text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* LOCATION */}
      <div className="space-y-4">
        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
          Location
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-[10px] text-zinc-500 uppercase">
              Country
            </Label>
            <select
              {...register("location.country")}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl h-10 px-3 text-sm text-zinc-200"
            >
              {countries.map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-zinc-500 uppercase">State</Label>
            <select
              {...register("location.state")}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl h-10 px-3 text-sm text-zinc-200"
            >
              <option value="">Pick State</option>
              {states.map((s) => (
                <option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.location?.state && (
              <p className="text-[10px] text-red-500">
                {errors.location.state.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-zinc-500 uppercase">
              District
            </Label>
            <select
              {...register("location.district")}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl h-10 px-3 text-sm text-zinc-200"
            >
              <option value="">Pick District</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.location?.district && (
              <p className="text-[10px] text-red-500">
                {errors.location.district.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-zinc-500 uppercase">
              Pin Code
            </Label>
            <Input
              {...register("location.pincode")}
              className="bg-zinc-900 border-zinc-800 rounded-xl text-white"
            />
            {errors.location?.pincode && (
              <p className="text-[10px] text-red-500">
                {errors.location.pincode.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* HOUSEHOLD */}
      <div className="space-y-4">
        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
          Home Details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-[10px] text-zinc-500 uppercase flex gap-2">
              <Home className="size-3" /> Size (sqm)
            </Label>
            <Input
              type="number"
              {...register("home_size_sqm")}
              className="bg-zinc-900 border-zinc-800 rounded-xl text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-zinc-500 uppercase flex gap-2">
              <Users className="size-3" /> Members
            </Label>
            <Input
              type="number"
              {...register("household_members")}
              className="bg-zinc-900 border-zinc-800 rounded-xl text-white"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit" // Explicitly setting type="submit"
        disabled={isUserLoading}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black rounded-xl h-12 uppercase tracking-widest"
      >
        {isUserLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Save My Profile"
        )}
      </Button>
    </form>
  );
}
