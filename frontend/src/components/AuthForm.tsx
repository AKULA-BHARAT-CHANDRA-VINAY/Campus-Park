import React, { useState, useEffect } from 'react';
import GradientBorderBox from './GradientBorderBox';
import Spinner from './Spinner';
import UserIcon from './icons/UserIcon';
import MailIcon from './icons/MailIcon';
import LockIcon from './icons/LockIcon';
import EyeIcon from './icons/EyeIcon';
import EyeOffIcon from './icons/EyeOffIcon';
import PhoneIcon from './icons/PhoneIcon';
import CalendarIcon from './icons/CalendarIcon';
import IdCardIcon from './icons/IdCardIcon';
import { useToggle } from '../hooks/useToggle';
import ToastContainer, { ToastMessage } from './ToastContainer';

import api from "../services/api";


type ViewType = 'login' | 'signup' | 'otp-verification' | 'forget-password' | 'reset-password';

interface AuthFormProps {
  onBack?: () => void;
  onLoginSuccess?: () => void;
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  id: string;
  label?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps & { isSignup?: boolean }> = ({ icon, id, label, required, isSignup = false, ...props }) => {
  return (
    <div className="relative w-full group">
      {label && (
        <label htmlFor={id} className="block text-white text-sm mb-1 font-normal">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-[var(--color-cyan-light)] pointer-events-none pl-1">
          {icon}
        </div>
        <input
          id={id}
          {...props}
          className="relative w-full py-2 pl-8 pr-4 text-white placeholder-gray-500 bg-transparent border-b-2 border-gray-500 focus:border-[var(--color-cyan-light)] focus:outline-none transition-all duration-300"
          style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
        />
      </div>
    </div>
  );
};

const AuthForm: React.FC<AuthFormProps> = ({ onBack, onLoginSuccess }) => {
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, togglePasswordVisibility] = useToggle(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Signup form data
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    regNo: '',
    phone: '',
    birthDate: '',
    password: '',
    profilePhoto: null as File | null,
  });

  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");

  // Login form data
  const [loginData, setLoginData] = useState({
    regNo: '',
    password: '',
  });

  // Forget password form data
  const [forgetPasswordData, setForgetPasswordData] = useState({
    email: '',
  });

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // OTP Timer
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const startOtpTimer = () => {
    setOtpTimer(60);
  };


  const validateField = (name: string, value: string, isSignup: boolean = false): string => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required.';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email address is invalid.';
        return '';
      case 'password':
        if (!value) return 'Password is required.';
        if (isSignup) {
          if (value.length < 8) return 'Password must be at least 8 characters long.';
          if (!/(?=.*[a-z])/.test(value)) return 'Must contain a lowercase letter.';
          if (!/(?=.*[A-Z])/.test(value)) return 'Must contain an uppercase letter.';
          if (!/(?=.*\d)/.test(value)) return 'Must contain a number.';
          if (!/(?=.*[!@#$%^&*()])/.test(value)) return 'Must contain a special character (!@#$%^&*()).';
        }
        return '';
      case 'fullName':
        if (!value) return 'Full Name is required.';
        if (value.length < 2) return 'Full Name must be at least 2 characters.';
        return '';
      case 'regNo':
        if (!value) return 'Registration Number is required.';
        if (value.length < 3) return 'Registration Number must be at least 3 characters.';
        return '';
      case 'phone':
        if (!value) return 'Phone number is required.';
        if (!/^[0-9]{10}$/.test(value.replace(/\D/g, ''))) return 'Phone number must be 10 digits.';
        return '';
      case 'birthDate':
        if (!value) return 'Birth date is required.';
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13) return 'You must be at least 13 years old.';
        if (age > 120) return 'Please enter a valid birth date.';
        return '';
      default:
        return '';
    }
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'profilePhoto' && files && files[0]) {
      const file = files[0];
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, profilePhoto: 'Please upload an image file.' }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profilePhoto: 'Image size must be less than 5MB.' }));
        return;
      }
      setSignupData((prev) => ({ ...prev, profilePhoto: file }));
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePhotoPreview(result);
        // Store temporarily, will be saved with regNo after signup
        if (signupData.regNo) {
          localStorage.setItem(`profilePhoto_${signupData.regNo}`, result);
        }
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, profilePhoto: '' }));
    } else {
      setSignupData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        const error = validateField(name, value, true);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleForgetPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForgetPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, isSignup: boolean = false) => {
    const { name, value } = e.target;
    const error = validateField(name, value, isSignup);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    Object.keys(signupData).forEach((key) => {
      if (key !== "profilePhoto") {
        const error = validateField(
          key,
          signupData[key as keyof typeof signupData] as string,
          true
        );
        if (error) newErrors[key] = error;
      }
    });

    if (!signupData.profilePhoto) {
      newErrors.profilePhoto = "Profile photo is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast("Please fix the errors in the form.", "error");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("fullname", signupData.fullName);
      formData.append("email", signupData.email);
      formData.append("regNo", signupData.regNo);
      formData.append("phone", signupData.phone);
      formData.append("birthDate", signupData.birthDate);
      formData.append("password", signupData.password);

      if (signupData.profilePhoto) {
        formData.append("profileImage", signupData.profilePhoto);
      }

      await api.post("/auth/register", formData);
      setUserEmail(signupData.email);
      setOtpCode(["", "", "", "", "", ""]);
      startOtpTimer();
      setCurrentView("otp-verification");
      addToast("OTP sent to your email", "success");


    } catch (err: any) {
      addToast(
        err.response?.data?.message || "Signup failed",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      setIsLoading(true);

      const res = await api.post("/auth/login", {
        regNo: loginData.regNo,
        password: loginData.password,
      });

      // FIRST-TIME LOGIN OTP
      if (res.data.message?.toLowerCase().includes("otp")) {
        setIsFirstTimeLogin(true);
        setUserEmail(res.data.email); // ✅ EMAIL FROM BACKEND
        setOtpCode(["", "", "", "", "", ""]);
        startOtpTimer();
        setCurrentView("otp-verification");

        addToast("OTP sent for first-time login", "info");
        return;
      }

      // NORMAL LOGIN
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.regNo);

      addToast("Login successful!", "success");
      onLoginSuccess?.();

    } catch (err: any) {
      addToast(err.response?.data?.message || "Login failed", "error");
    } finally {
      setIsLoading(false);
    }
  };


  const handleForgetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const emailError = validateField('email', forgetPasswordData.email);
    if (emailError) {
      setErrors({ email: emailError });
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/forgot-password", {
        email: forgetPasswordData.email
      });

      setUserEmail(forgetPasswordData.email);
      startOtpTimer();
      setCurrentView("reset-password");
      addToast("OTP sent to your email!", "success");

    } catch (err: any) {
      addToast(err.response?.data?.message || "Failed to send OTP", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (resetPassword.length < 8) {
      addToast("Password must be at least 8 characters", "error");
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/auth/reset-password", {
        email: userEmail,
        newPassword: resetPassword
      });

      addToast("Password reset successful. Please login.", "success");

      // cleanup
      setResetPassword("");
      setOtpCode(["", "", "", "", "", ""]);
      setCurrentView("login");

    } catch (err: any) {
      addToast(err.response?.data?.message || "Password reset failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
      setOtpCode(newOtp);
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      const nextInput = document.getElementById(`otp-${lastFilledIndex}`);
      nextInput?.focus();
    }
  };

  const verifyOTP = async () => {
    const enteredOtp = otpCode.join("");

    if (enteredOtp.length !== 6) {
      addToast("Please enter complete OTP", "error");
      return;
    }

    try {
      setIsLoading(true);

      // 🔐 FIRST TIME LOGIN OTP
      if (isFirstTimeLogin) {
        const res = await api.post("/auth/login/verify", {
          email: userEmail,
          otp: enteredOtp,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.user.regNo);

        addToast("Login successful!", "success");
        onLoginSuccess?.();
        return;
      }
      //  RESET PASSWORD OTP
      if (currentView === "reset-password") {
        await api.post("/auth/verify-reset-otp", {
          email: userEmail,
          otp: enteredOtp
        });

        addToast("OTP verified. Set new password.", "success");
        setOtpCode(["", "", "", "", "", ""]);
        return;
      }
      //  SIGNUP OTP
      await api.post("/auth/register/verify", {
        email: userEmail,
        otp: enteredOtp,
      });

      addToast("Registration successful! Please login.", "success");
      setCurrentView("login");

    } catch (err: any) {
      addToast(err.response?.data?.message || "Invalid OTP", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (otpTimer > 0) {
      addToast(`Please wait ${otpTimer}s before resending OTP`, "warning");
      return;
    }

    try {
      setIsLoading(true);

      // FORGOT PASSWORD FLOW
      if (currentView === "reset-password") {
        await api.post("/auth/forgot-password", {
          email: userEmail
        });
      }

      // FIRST TIME LOGIN
      else if (isFirstTimeLogin) {
        await api.post("/auth/login", {
          regNo: loginData.regNo,
          password: loginData.password
        });
      }

      // SIGNUP FLOW
      else {
        await api.post("/auth/register", {
          email: userEmail
        });
      }

      startOtpTimer();
      addToast("OTP resent successfully", "success");

    } catch (err: any) {
      addToast(err.response?.data?.message || "Failed to resend OTP", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSignupForm = () => (
    <form onSubmit={handleSignup} className="flex flex-col gap-5">
      <div>
        <InputField
          id="fullName"
          icon={<UserIcon className="w-5 h-5" />}
          type="text"
          name="fullName"
          label="Full name"
          placeholder=""
          value={signupData.fullName}
          onChange={handleSignupChange}
          onBlur={(e) => handleBlur(e, true)}
          aria-invalid={!!errors.fullName}
          required
          isSignup={true}
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1 ml-2 animate-slide-down-sm">{errors.fullName}</p>
        )}
      </div>

      <div>
        <InputField
          id="email"
          icon={<MailIcon className="w-5 h-5" />}
          type="email"
          name="email"
          label="Email"
          placeholder=""
          value={signupData.email}
          onChange={handleSignupChange}
          onBlur={(e) => handleBlur(e, true)}
          aria-invalid={!!errors.email}
          required
          isSignup={true}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 ml-2 animate-slide-down-sm">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="profilePhoto" className="block text-white text-sm mb-1 font-normal">
          Profile Photo <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="profilePhoto"
            type="file"
            name="profilePhoto"
            accept="image/*"
            onChange={handleSignupChange}
            className="hidden"
          />
          <div className="flex items-center gap-4">
            <label
              htmlFor="profilePhoto"
              className="cursor-pointer flex items-center justify-center w-24 h-24 rounded-full border-2 border-dashed border-gray-500 hover:border-[var(--color-cyan-light)] transition-colors bg-gray-800/30 overflow-hidden"
            >
              {profilePhotoPreview ? (
                <img src={profilePhotoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-gray-400">
                  <UserIcon className="w-8 h-8 mx-auto mb-1" />
                  <span className="text-xs">Upload</span>
                </div>
              )}
            </label>
            <div className="flex-1">
              <button
                type="button"
                onClick={() => document.getElementById('profilePhoto')?.click()}
                className="text-sm text-[var(--color-cyan-light)] hover:underline"
              >
                {profilePhotoPreview ? 'Change Photo' : 'Choose Photo'}
              </button>
              <p className="text-xs text-gray-400 mt-1">Max 5MB, JPG/PNG</p>
            </div>
          </div>
        </div>
        {errors.profilePhoto && (
          <p className="text-red-500 text-xs mt-1 ml-2 animate-slide-down-sm">{errors.profilePhoto}</p>
        )}
      </div>

      <div>
        <InputField
          id="regNo"
          icon={<IdCardIcon className="w-5 h-5" />}
          type="text"
          name="regNo"
          label="Registration Number"
          placeholder=""
          value={signupData.regNo}
          onChange={handleSignupChange}
          onBlur={(e) => handleBlur(e, true)}
          aria-invalid={!!errors.regNo}
          required
          isSignup={true}
        />
        {errors.regNo && (
          <p className="text-red-500 text-xs mt-1 ml-2 animate-slide-down-sm">{errors.regNo}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputField
            id="phone"
            icon={<PhoneIcon className="w-5 h-5" />}
            type="tel"
            name="phone"
            label="Phone"
            placeholder=""
            value={signupData.phone}
            onChange={handleSignupChange}
            onBlur={(e) => handleBlur(e, true)}
            aria-invalid={!!errors.phone}
            required
            isSignup={true}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1 ml-2 animate-slide-down-sm">{errors.phone}</p>
          )}
        </div>

        <div>
          <InputField
            id="birthDate"
            icon={<CalendarIcon className="w-5 h-5" />}
            type="date"
            name="birthDate"
            label="Birth date"
            placeholder=""
            value={signupData.birthDate}
            onChange={handleSignupChange}
            onBlur={(e) => handleBlur(e, true)}
            aria-invalid={!!errors.birthDate}
            required
            isSignup={true}
          />
          {errors.birthDate && (
            <p className="text-red-500 text-xs mt-1 ml-2 animate-slide-down-sm">{errors.birthDate}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-white text-sm mb-1 font-normal">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative w-full group">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-[var(--color-cyan-light)] pointer-events-none pl-1">
            <LockIcon className="w-5 h-5" />
          </div>
          <input
            id="password"
            type={passwordVisible ? 'text' : 'password'}
            name="password"
            placeholder=""
            value={signupData.password}
            onChange={handleSignupChange}
            onBlur={(e) => handleBlur(e, true)}
            aria-invalid={!!errors.password}
            required
            className="relative w-full bg-transparent border-b-2 border-gray-500 py-2 pl-8 pr-10 text-white placeholder-gray-500 focus:border-[var(--color-cyan-light)] focus:outline-none transition-all duration-300"
            style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
          >
            {passwordVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1 ml-2 whitespace-pre-line animate-slide-down-sm">
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[var(--color-teal-dark)] to-[var(--color-cyan-light)] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-2 active:scale-[0.98] shadow-md"
      >
        {isLoading ? <Spinner /> : 'Sign Up'}
      </button>
    </form>
  );

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <div>
        <InputField
          id="loginRegNo"
          icon={<IdCardIcon className="w-5 h-5" />}
          type="text"
          name="regNo"
          label="Registration Number"
          placeholder=""
          value={loginData.regNo}
          onChange={handleLoginChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.regNo}
          required
        />
        {errors.regNo && (
          <p className="text-red-500 text-xs mt-1 ml-2 animate-slide-down-sm">{errors.regNo}</p>
        )}
      </div>

      <div>
        <label htmlFor="loginPassword" className="block text-white text-sm mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative w-full group">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-[var(--color-cyan-light)] pointer-events-none pl-1">
            <LockIcon className="w-5 h-5" />
          </div>
          <input
            id="loginPassword"
            type={passwordVisible ? 'text' : 'password'}
            name="password"
            placeholder=""
            value={loginData.password}
            onChange={handleLoginChange}
            onBlur={handleBlur}
            aria-invalid={!!errors.password}
            required
            className="relative w-full bg-transparent border-b-2 border-gray-500 py-2 pl-8 pr-10 text-white placeholder-gray-500 focus:border-[var(--color-cyan-light)] focus:outline-none transition-all duration-300"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
          >
            {passwordVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1 ml-2 animate-slide-down-sm">{errors.password}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setCurrentView('forget-password')}
        className="text-right text-sm text-[var(--color-cyan-light)] hover:underline self-end"
      >
        Forgot Password?
      </button>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[var(--color-teal-dark)] to-[var(--color-cyan-light)] text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-2 active:scale-[0.98]"
      >
        {isLoading ? <Spinner /> : 'Login'}
      </button>
    </form>
  );

  const renderOtpVerification = () => (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-gray-300 mb-2">Enter the OTP sent to</p>
        <p className="text-[var(--color-cyan-light)] font-semibold">{userEmail}</p>
      </div>

      <div className="flex justify-center gap-2">
        {otpCode.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            onPaste={handleOtpPaste}
            className="w-12 h-12 text-center text-xl font-bold bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-[var(--color-cyan-light)] focus:shadow-[0_0_12px_2px_rgba(6,182,212,0.5)] focus:outline-none transition-all duration-300"
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={verifyOTP}
          disabled={isLoading || otpCode.join('').length !== 6}
          className="w-full bg-gradient-to-r from-[var(--color-teal-dark)] to-[var(--color-cyan-light)] text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isLoading ? <Spinner /> : 'Verify OTP'}
        </button>

        <div className="text-center">
          <button
            onClick={resendOTP}
            disabled={otpTimer > 0}
            className="text-sm text-[var(--color-cyan-light)] hover:underline disabled:text-gray-500 disabled:no-underline"
          >
            {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Resend OTP'}
          </button>
        </div>

        <button
          onClick={() => {
            setCurrentView(isFirstTimeLogin ? 'login' : 'signup');
            setOtpCode(['', '', '', '', '', '']);
            setIsFirstTimeLogin(false);
          }}
          className="text-sm text-gray-400 hover:text-white text-center"
        >
          ← Back
        </button>
      </div>
    </div>
  );

  const renderForgetPassword = () => (
    <form onSubmit={handleForgetPassword} className="flex flex-col gap-4">
      <p className="text-gray-300 text-sm text-center mb-2">
        Enter your email address and we'll send you an OTP to reset your password.
      </p>

      <div>
        <InputField
          id="forgetEmail"
          icon={<MailIcon className="w-5 h-5" />}
          type="email"
          name="email"
          label="Email"
          placeholder=""
          value={forgetPasswordData.email}
          onChange={handleForgetPasswordChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.email}
          required
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 ml-2 animate-slide-down-sm">{errors.email}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[var(--color-teal-dark)] to-[var(--color-cyan-light)] text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-2 active:scale-[0.98]"
      >
        {isLoading ? <Spinner /> : 'Send OTP'}
      </button>

      <button
        type="button"
        onClick={() => setCurrentView('login')}
        className="text-sm text-gray-400 hover:text-white text-center"
      >
        ← Back to Login
      </button>
    </form>
  );

  const getTitle = () => {
    switch (currentView) {
      case 'signup':
        return 'Create Account';
      case 'otp-verification':
        return 'Verify OTP';
      case 'forget-password':
        return 'Forgot Password';
      case 'reset-password':
        return 'Reset Password';
      default:
        return 'Welcome Back';
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {currentView === 'signup' ? (
        <div className="relative w-full max-w-2xl p-10 bg-black rounded-xl">
          {onBack && (
            <button
              onClick={onBack}
              className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
            >
              ←
            </button>
          )}
          <h2 className="text-3xl font-bold text-center text-white mb-2">{getTitle()}</h2>
          <p className="text-center text-gray-300 mb-8">
            Create your account to get started
          </p>

          {renderSignupForm()}

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <button
              onClick={() => {
                setCurrentView('login');
                setErrors({});
              }}
              className="font-semibold text-[var(--color-cyan-light)] hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-[-25px] bg-[var(--color-glow-cyan)] rounded-full blur-3xl opacity-25 -z-10 animate-color-cycle"></div>
          <GradientBorderBox className="from-[var(--color-cyan-light)] to-[var(--color-teal-dark)]">
            <div className="relative w-80 md:w-96 p-8 bg-black/90 backdrop-blur-xl rounded-lg">
              {onBack && currentView === 'login' && (
                <button
                  onClick={onBack}
                  className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
                >
                  ←
                </button>
              )}
              <h2 className="text-3xl font-bold text-center text-white mb-2">{getTitle()}</h2>
              <p className="text-center text-gray-300 mb-6">
                {currentView === 'login' && 'Sign in to continue'}
                {currentView === 'otp-verification' && 'Enter the verification code'}
                {currentView === 'forget-password' && 'Reset your password'}
                {currentView === 'reset-password' && 'Set a new password'}
              </p>

              {currentView === 'login' && renderLoginForm()}
              {currentView === 'otp-verification' && renderOtpVerification()}
              {currentView === 'forget-password' && renderForgetPassword()}
              {currentView === "reset-password" && (
                <div className="flex flex-col gap-4">
                  {renderOtpVerification()}

                  <div>
                    <label className="block text-white text-sm mb-1">
                      New Password <span className="text-red-500">*</span>
                    </label>

                    <div className="relative w-full group">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pl-1">
                        <LockIcon className="w-5 h-5" />
                      </div>

                      <input
                        type={passwordVisible ? "text" : "password"}
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-gray-500 py-2 pl-8 pr-10 text-white focus:border-[var(--color-cyan-light)] focus:outline-none"
                        placeholder=""
                      />

                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleResetPassword}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[var(--color-teal-dark)] to-[var(--color-cyan-light)] text-white font-bold py-2.5 rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? <Spinner /> : "Reset Password"}
                  </button>
                </div>
              )}
              {currentView === 'login' && (
                <p className="text-center text-gray-400 text-sm mt-6">
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setCurrentView('signup');
                      setErrors({});
                    }}
                    className="font-semibold text-[var(--color-cyan-light)] hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              )}
            </div>
          </GradientBorderBox>
        </div>
      )}
    </>
  );
};

export default AuthForm;
