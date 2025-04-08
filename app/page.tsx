"use client";
import { useRouter } from "next/navigation";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    githubUsername: "",
    avatar: null as File | null,
  });

  // Add error states
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    githubUsername: "",
    avatar: "",
  });

  // Add preview state
  const [preview, setPreview] = useState<string>("");

  // Validation functions
  const validateFullName = (name: string) => {
    if (name.length < 2) return "Name must be at least 2 characters long";
    if (name.length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s]*$/.test(name))
      return "Name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateGithubUsername = (username: string) => {
    const githubRegex = /^@?[a-zA-Z0-9-]+$/;
    if (!githubRegex.test(username)) return "Invalid GitHub username format";
    if (username.length < 1) return "GitHub username is required";
    return "";
  };

  const validateAvatar = (file: File | null) => {
    if (!file) return "Avatar is required";
    if (file.size > 500 * 1024) return "File size must be less than 500KB";
    if (!["image/jpeg", "image/png"].includes(file.type))
      return "Only JPG and PNG files are allowed";
    return "";
  };

  // Handle input changes with validation
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change
    let error = "";
    switch (name) {
      case "fullName":
        error = validateFullName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "githubUsername":
        error = validateGithubUsername(value);
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle file upload
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, avatar: file }));
    setErrors((prev) => ({ ...prev, avatar: validateAvatar(file) }));
  };

  // Update form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // First validate all fields
    const newErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      githubUsername: validateGithubUsername(formData.githubUsername),
      avatar: validateAvatar(formData.avatar),
    };

    // Update error state
    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return; // Don't proceed if there are validation errors
    }

    // If validation passes, proceed with existing submission logic
    if (formData.avatar) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const dataToStore = {
            ...formData,
            avatar: reader.result,
          };
          localStorage.setItem("ticketData", JSON.stringify(dataToStore));
          router.push("/success");
        }
      };
      reader.readAsDataURL(formData.avatar);
    } else {
      const dataToStore = {
        ...formData,
        avatar: "/assets/images/image-avatar.jpg",
      };
      localStorage.setItem("ticketData", JSON.stringify(dataToStore));
      router.push("/success");
    }
  };

  // Add these handlers after your existing handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0] || null;

    // Add these lines to handle the dropped file
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setErrors((prev) => ({ ...prev, avatar: validateAvatar(file) }));

      // Create preview for dropped file
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add effect to handle preview
  useEffect(() => {
    if (!formData.avatar) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(formData.avatar);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.avatar]);

  return (
    <div className="container px-5 min-h-[107vh] mx-auto md:min-h-[120vh] lg:min-h-[105vh]">
      <h1 className="text-3xl text-white text-center font-bold mb-4 md:text-5xl md:px-0 lg:max-w-2xl lg:mx-auto">
        Your Journey to Coding Conf 2025 Starts Here!
      </h1>
      <p className="text-xl text-gray-300 text-center">
        Secure your spot at next year&apos;s biggest coding conference.
      </p>
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        {/* Avatar upload section */}
        <div className="mt-8">
          <label className="text-xl text-white block mb-2">Upload Avatar</label>
          <div
            className="border-2 border-dashed border-gray-500 rounded-lg bg-white/10 p-8 text-center cursor-pointer hover:border-gray-300"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById("avatar-upload")?.click()}
          >
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              id="avatar-upload"
              onChange={handleFileUpload}
            />
            {!preview ? (
              <>
                <div className="upload-icon p-2 border-1 border-gray-700 bg-white/10 inline-block rounded-xl">
                  <img
                    src="/assets/images/icon-upload.svg"
                    alt="Upload"
                    className="w-8 h-8"
                  />
                </div>
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <p className="text-xl text-gray-300">
                    Drag and drop or click to upload
                  </p>
                </label>
              </>
            ) : (
              <div>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-16 h-16 border-2 border-neutral-500 rounded-2xl object-cover mx-auto"
                />
                <div className="mt-4 flex gap-4 justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent container click
                      setFormData((prev) => ({ ...prev, avatar: null }));
                      setPreview("");
                    }}
                    className="cursor-pointer px-4 py-1 text-sm text-neutral-300 bg-neutral-700 rounded-sm hover:bg-neutral-600"
                  >
                    Remove image
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent container click
                      document.getElementById("avatar-upload")?.click();
                    }}
                    className="cursor-pointer px-4 py-1 text-sm text-neutral-300 bg-neutral-700 rounded-sm hover:bg-neutral-600"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="upload-limit">
            <div className="flex items-center gap-2 mt-2">
              <img
                src="/assets/images/icon-info.svg"
                alt="Info"
                className="w-4 h-4"
              />
              <p className="text-xs text-gray-400">
                Upload your photo (JPG or PNG, max size: 500KB).
              </p>
            </div>
            {errors.avatar && (
              <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
            )}
          </div>
        </div>

        {/* Form fields will go here */}
        <div className="mt-6">
          <label className="text-xl text-white block  mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="e.g. John Doe"
            className="w-full p-4 rounded-lg bg-white/10 border border-gray-500 text-gray-300 focus:outline-none focus:border-blue-500"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
          <label className="text-xl text-white block mt-6 mb-2">
            Email Address
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="example@email.com"
            className="w-full p-4 rounded-lg bg-white/10 border border-gray-500 text-gray-300 focus:outline-none focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
          <label className="text-xl text-white block mt-6 mb-2">
            GitHub Username
          </label>
          <input
            type="text"
            name="githubUsername"
            value={formData.githubUsername}
            onChange={handleInputChange}
            placeholder="@yourusername"
            className="w-full p-4 rounded-lg bg-white/10 border border-gray-500 text-gray-300 focus:outline-none focus:border-blue-500"
          />
          {errors.githubUsername && (
            <p className="text-red-500 text-sm mt-1">{errors.githubUsername}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-custom-orange-500 text-gray-900 text-xl font-bold py-4 rounded-xl hover:bg-custom-orange-700 transition duration-200 cursor-pointer shadow-xl hover:shadow-xl"
        >
          Generate My Ticket
        </button>
      </form>
    </div>
  );
}
