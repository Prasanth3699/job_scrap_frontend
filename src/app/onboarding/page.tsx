"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useProfile } from "@/hooks/auth/use-profile";
import { useAuth } from "@/hooks/auth/use-auth";

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, createProfile, uploadResume, isLoading, isProfileComplete } =
    useProfile();
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  useEffect(() => {
    // Redirect if profile is already complete
    if (isProfileComplete) {
      router.push("/dashboard");
    }
  }, [isProfileComplete]);

  const careerStages = [
    "Student",
    "Working Professional",
    "Freelancer",
    "Job Seeker",
  ];

  const domains = [
    "Software Development",
    "Data Science",
    "Product Management",
    "Design",
    "Marketing",
  ];

  const onSubmitPersonalInfo = async (data) => {
    const profileData = {
      career_stage: data.careerStage,
      current_role: data.currentRole,
      domains: data.domains.join(","),
    };

    const success = await createProfile(profileData);
    if (success) {
      setStep(2);
    }
  };

  const onSubmitResume = async (data) => {
    const file = data.resume[0];
    const success = await uploadResume(file);
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Complete Your Profile
        </h1>

        {step === 1 && (
          <form
            onSubmit={handleSubmit(onSubmitPersonalInfo)}
            className="space-y-6"
          >
            {/* Career Stage */}
            <div>
              <label className="block mb-2 font-semibold">
                Select Your Career Stage
              </label>
              <div className="grid grid-cols-2 gap-4">
                {careerStages.map((stage) => (
                  <label
                    key={stage}
                    className="flex items-center space-x-2 bg-gray-900 p-3 rounded-lg"
                  >
                    <input
                      type="radio"
                      value={stage}
                      {...register("careerStage", {
                        required: "Career stage is required",
                      })}
                      className="form-radio text-blue-500"
                    />
                    <span>{stage}</span>
                  </label>
                ))}
              </div>
              {errors.careerStage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.careerStage.message as string}
                </p>
              )}
            </div>

            {/* Current Role */}
            <div>
              <label className="block mb-2 font-semibold">
                Current Role (Optional)
              </label>
              <input
                type="text"
                {...register("currentRole")}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
                placeholder="e.g., Software Engineer"
              />
            </div>

            {/* Domains of Interest */}
            <div>
              <label className="block mb-2 font-semibold">
                Select Domains of Interest
              </label>
              <div className="grid grid-cols-2 gap-4">
                {domains.map((domain) => (
                  <label
                    key={domain}
                    className="flex items-center space-x-2 bg-gray-900 p-3 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      value={domain}
                      {...register("domains")}
                      className="form-checkbox text-blue-500"
                    />
                    <span>{domain}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
            >
              {isLoading ? "Saving..." : "Next: Upload Resume"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit(onSubmitResume)} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold">
                Upload Your Resume
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                {...register("resume", { required: "Resume is required" })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
              />
              {errors.resume && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.resume.message as string}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
            >
              {isLoading ? "Uploading..." : "Complete Profile"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
