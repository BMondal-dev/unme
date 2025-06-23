import { component$, useSignal, $, noSerialize, type NoSerialize, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city";
import { useNotification } from "~/components/ui/Notification";
import { auth, db } from "~/firebase";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import type { ConfirmationResult } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

enum AuthStep {
  PhoneNumber,
  OTPVerification,
  ProfileSetup,
}

const LOCAL_STORAGE_KEY = "unme-auth-progress";

type AuthProgress = {
  step: AuthStep;
  phoneNumber?: string;
  confirmationResult?: any; // You can't serialize this, so just use for step tracking
};

export default component$(() => {
  const { show } = useNotification();
  const nav = useNavigate();
  const currentStep = useSignal<AuthStep>(AuthStep.PhoneNumber);
  const phoneNumber = useSignal("");
  const otp = useSignal(["", "", "", "", "", ""]);
  const name = useSignal("");
  const isLoading = useSignal(false);
  const previewUrl = useSignal('');
  const fileState = useSignal<{ file: NoSerialize<File> | null }>({ file: null });
  const recaptchaVerifier = useSignal<NoSerialize<RecaptchaVerifier> | null>(null);
  const confirmationResult = useSignal<NoSerialize<ConfirmationResult> | null>(null);

  useVisibleTask$(() => {
    if (typeof window !== "undefined" && auth && !recaptchaVerifier.value) {
      recaptchaVerifier.value = noSerialize(
        new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        )
      );
    }
  });

  const handleFileChange = $((event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      // Store the file with noSerialize to prevent serialization
      fileState.value = { file: noSerialize(file) };
      
      const reader = new FileReader();
      
      reader.onload = () => {
        previewUrl.value = reader.result as string;
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
      };
      
      reader.readAsDataURL(file);
    }
  });

  const triggerFileInput = $(() => {
    // Create a new input element to ensure the change event fires every time
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    const handleChange = (e: Event) => {
      handleFileChange(e);
      document.body.removeChild(fileInput);
    };
    
    fileInput.addEventListener('change', handleChange, { once: true });
    document.body.appendChild(fileInput);
    fileInput.click();
  });

  // Handle phone number submission
  const handlePhoneSubmit = $(async () => {
    if (!phoneNumber.value.match(/^\d{10}$/)) {
      show("Please enter a valid 10-digit phone number", "error");
      return;
    }
    if (!auth) {
      show("Auth is not available.", "error");
      return;
    }
    isLoading.value = true;
    try {
      confirmationResult.value = noSerialize(
        await signInWithPhoneNumber(
          auth,
          "+91" + phoneNumber.value,
          recaptchaVerifier.value!
        )
      );
      isLoading.value = false;
      currentStep.value = AuthStep.OTPVerification;
      show(`OTP sent to +91${phoneNumber.value}`, "success");
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          step: AuthStep.OTPVerification,
          phoneNumber: phoneNumber.value,
        })
      );
    } catch (err) {
      isLoading.value = false;
      show("Failed to send OTP: " + (err as Error).message, "error");
    }
  });

  // Handle OTP submission
  const handleOTPSubmit = $(async () => {
    if (otp.value.some(digit => !digit)) {
      show("Please enter all OTP digits", "error");
      return;
    }
    if (!confirmationResult.value) {
      show("Session expired. Please request a new OTP.", "error");
      currentStep.value = AuthStep.PhoneNumber;
      phoneNumber.value = "";
      otp.value = ["", "", "", "", "", ""];
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      isLoading.value = false;
      return;
    }
    isLoading.value = true;
    try {
      await confirmationResult.value.confirm(otp.value.join(""));
      // Check if user profile exists
      if (!auth || !db) {
        show("Auth or DB not available.", "error");
        isLoading.value = false;
        return;
      }
      const user = auth.currentUser;
      if (!user) {
        show("User not authenticated.", "error");
        isLoading.value = false;
        return;
      }
      const userDoc = await getDoc(doc(db, "users", user.uid));
      isLoading.value = false;
      if (userDoc.exists()) {
        // Profile exists, redirect to home
        show("Welcome back!", "success");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        nav("/");
      } else {
        // No profile, proceed to profile setup
        currentStep.value = AuthStep.ProfileSetup;
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            step: AuthStep.ProfileSetup,
            phoneNumber: phoneNumber.value,
          })
        );
      }
    } catch (err) {
      isLoading.value = false;
      show("Invalid OTP: " + (err as Error).message, "error");
    }
  });

  // Handle profile setup
  const handleProfileSubmit = $(async () => {
    if (!name.value.trim()) {
      show("Please enter your name", "error");
      return;
    }
    if (!auth || !db) {
      show("Auth or DB not available.", "error");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      show("User not authenticated.", "error");
      return;
    }
    isLoading.value = true;
    try {
      // In a real app, you would upload the file here and get a URL
      // For now, just store the name (and optionally a placeholder for the image)
      await setDoc(doc(db, "users", user.uid), {
        name: name.value,
        phone: user.phoneNumber,
        // profileImage: "url-to-image" // Add this if you implement image upload
      });
      isLoading.value = false;
      show("Profile setup complete!", "success");
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      nav("/"); // Redirect to home after successful auth
    } catch (err) {
      isLoading.value = false;
      show("Failed to save profile: " + (err as Error).message, "error");
    }
  });

  // Handle OTP input change
  const handleOTPChange = $((index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOTP = [...otp.value];
    newOTP[index] = value;
    otp.value = newOTP;

    // Auto-focus next input if value entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  });

  // Handle OTP input key down
  const handleOTPKeyDown = $((e: KeyboardEvent, index: number) => {
    const input = e.target as HTMLInputElement;
    if (e.key === 'Backspace') {
      if (input.value === "") {
        if (index > 0) {
          const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
          if (prevInput) prevInput.focus();
        }
      } else {
        // Clear the current input
        const newOTP = [...otp.value];
        newOTP[index] = "";
        otp.value = newOTP;
      }
    }
  });

  useVisibleTask$(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const progress: AuthProgress = JSON.parse(saved);
        if (progress.step === AuthStep.OTPVerification) {
          currentStep.value = AuthStep.OTPVerification;
          phoneNumber.value = progress.phoneNumber || "";
        } else if (progress.step === AuthStep.ProfileSetup) {
          currentStep.value = AuthStep.ProfileSetup;
          phoneNumber.value = progress.phoneNumber || "";
        }
      } catch {
        // ignore
      }
    }
  });

  return (
    <div class="flex min-h-screen items-center justify-center bg-fresh-eggplant-50 p-4">
      <div class="w-full max-w-md">
        <div class="mb-8 text-center">
          <h1 class="mb-2 text-4xl font-black tracking-tight">
            <span class="text-fresh-eggplant-600">U</span>
            <span class="text-fresh-eggplant-500">n</span>
            <span class="text-fresh-eggplant-600">M</span>
            <span class="text-fresh-eggplant-500">e</span>
            <span class="text-gray-400 mx-1">/</span>
            <span class="text-gray-700">You & Me</span>
          </h1>
          <p class="text-gray-600">Connect with your loved ones</p>
        </div>

        <div class="overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[8px_8px_0_0_#000]">
          {/* Progress Steps */}
          <div class="flex border-b-4 border-black">
            {(Object.values(AuthStep).filter(step => typeof step === 'number') as AuthStep[]).map((step, index) => (
              <div 
                key={step}
                class={`flex-1 py-3 text-center font-medium ${currentStep.value >= step ? 'bg-fresh-eggplant-600 text-white' : 'bg-gray-100'}`}
              >
                {index + 1}
              </div>
            ))}
          </div>

          {/* Phone Number Step */}
          {currentStep.value === AuthStep.PhoneNumber && (
            <div class="p-6">
              <h2 class="mb-6 text-xl font-bold">Enter your phone number</h2>
              <div class="mb-6 flex items-center rounded-lg border-2 border-black p-2">
                <span class="px-2 font-medium">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  bind:value={phoneNumber}
                  placeholder="Enter 10-digit number"
                  class="w-full bg-transparent p-2 outline-none"
                />
              </div>
              <button
                onClick$={handlePhoneSubmit}
                disabled={isLoading.value}
                class="w-full rounded-lg border-2 border-black bg-fresh-eggplant-600 py-3 font-bold text-white hover:bg-fresh-eggplant-700 disabled:opacity-50"
              >
                {isLoading.value ? 'Sending OTP...' : 'Next'}
              </button>
            </div>
          )}

          {/* OTP Verification Step */}
          {currentStep.value === AuthStep.OTPVerification && (
            <div class="p-6">
              <h2 class="mb-2 text-xl font-bold">Verify your number</h2>
              <p class="mb-6 text-gray-600">We've sent an SMS with a code to +91{phoneNumber}</p>
              
              <div class="mb-6 flex justify-between gap-2 sm:gap-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="tel"
                    maxLength={1}
                    value={otp.value[index]}
                    onInput$={(_, el) => handleOTPChange(index, el.value)}
                    onKeyDown$={(e) => handleOTPKeyDown(e, index)}
                    class="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border-2 border-black text-center text-xl sm:text-2xl font-bold focus:border-fresh-eggplant-600 focus:outline-none transition-all"
                    style="letter-spacing: 2px;"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                  />
                ))}
              </div>
              
              <button
                onClick$={handleOTPSubmit}
                disabled={isLoading.value}
                class="w-full rounded-lg border-2 border-black bg-fresh-eggplant-600 py-3 font-bold text-white hover:bg-fresh-eggplant-700 disabled:opacity-50"
              >
                {isLoading.value ? 'Verifying...' : 'Verify OTP'}
              </button>
              
              <p class="mt-4 text-center text-sm text-gray-600">
                Didn't receive code? <button class="font-medium text-fresh-eggplant-600">Resend</button>
              </p>
            </div>
          )}

          {/* Profile Setup Step */}
          {currentStep.value === AuthStep.ProfileSetup && (
            <div class="p-6">
              <h2 class="mb-2 text-xl font-bold">Profile information</h2>
              <p class="mb-6 text-gray-600">Enter your name and add a profile picture</p>
              
              <div class="mb-6 flex justify-center">
                <div 
                  class="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-2 border-black bg-gray-200"
                  onClick$={triggerFileInput}
                >
                  {previewUrl.value ? (
                    <img 
                      src={previewUrl.value} 
                      alt="Profile preview" 
                      width={96}
                      height={96}
                      class="h-full w-full object-cover"
                    />
                  ) : (
                    <div class="h-full w-full bg-gray-200" />
                  )}
                  <div class="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-4 w-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                      />
                    </svg>
                  </div>
                </div>

              </div>
              
              <div class="mb-6">
                <label class="mb-1 block font-medium">Your name</label>
                <input
                  type="text"
                  bind:value={name}
                  placeholder="Enter your name"
                  class="w-full rounded-lg border-2 border-black p-3 focus:border-fresh-eggplant-600 focus:outline-none"
                />
              </div>
              
              <button
                onClick$={handleProfileSubmit}
                disabled={isLoading.value}
                class="w-full rounded-lg border-2 border-black bg-fresh-eggplant-600 py-3 font-bold text-white hover:bg-fresh-eggplant-700 disabled:opacity-50"
              >
                {isLoading.value ? 'Setting up...' : 'Continue'}
              </button>
            </div>
          )}
        </div>
        
        <p class="mt-6 text-center text-sm text-gray-600">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Login | Unme",
  meta: [
    {
      name: "description",
      content: "Login to Unme and connect with your friends and family",
    },
  ],
};