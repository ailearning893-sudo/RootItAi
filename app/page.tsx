"use client";

import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { signInWithGoogle } from "@/lib/authService";
import { doesUserMappingExist, doesStudentProfileExist } from "@/lib/firestoreService";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Player from "lottie-react";
import lottieAnimation from "../components/assets/education new color scheme.json";
import LoadingLottie from "@/components/LoadingLottie";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userType, setUserType] = useState<"teacher" | "student" | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (loading) return; // Wait until Firebase auth state is loaded
    if (!user) return; // Wait for a user to be logged in
    if (!userType) return; // Wait for the user to select their role

    const routeUser = async () => {
      if (userType === "teacher") {
        const mappingExists = await doesUserMappingExist(user.uid);
        if (mappingExists) {
          router.push("/teacher/dashboard");
        } else {
          router.push("/teacher/setup");
        }
      } else if (userType === "student") {
        const profileExists = await doesStudentProfileExist(user.uid);
        if (profileExists) {
          router.push("/student/dashboard");
        } else {
          router.push("/student/setup");
        }
      }
    };

    routeUser();

  }, [user, loading, router, userType]);

  const handleSignIn = async (type: "teacher" | "student") => {
    setUserType(type);
    if (!user) {
      await signInWithGoogle();
    }
  };

  // Interactive title effect
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = title.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      title.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    };

    const handleMouseLeave = () => {
      title.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    };

    if (isHovering) {
      title.addEventListener('mousemove', handleMouseMove);
      title.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      title.removeEventListener('mousemove', handleMouseMove);
      title.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovering]);
  if (loading || (user && userType)) {
    return <div className="flex items-center justify-center min-h-screen"><LoadingLottie message="Loading..." /></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lavender-dark via-emerald-green to-lavender-medium relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Glassmorphism Card */}
      <div className="w-full max-w-md mx-auto rounded-3xl shadow-2xl bg-white/20 backdrop-blur-lg border border-white/30 p-6 md:p-10 flex flex-col items-center relative z-10">
        {/* Interactive Brand Title */}
        <div className="relative mb-2">
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight cursor-pointer transition-all duration-300 ease-out select-none"
            style={{
              letterSpacing: '0.04em',
              textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(167,139,250,0.3), 0 0 60px rgba(0,103,79,0.2)'
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Animated letters */}
            {'RootIt'.split('').map((letter, index) => (
              <span
                key={index}
                className="inline-block transition-all duration-300 hover:text-emerald-green hover:scale-110"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'bounce-slow 2s infinite'
                }}
              >
                {letter}
              </span>
            ))}
          </h1>

          {/* Glowing underline effect */}
          <div
            className={`absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-emerald-green via-white to-lavender-medium rounded-full transition-all duration-500 ${isHovering ? 'w-full opacity-100' : 'w-0 opacity-0'
              }`}
          />

          {/* Sparkle effects */}
          {isHovering && (
            <>
              <div className="absolute -top-2 -left-2 w-3 h-3 bg-white rounded-full animate-ping opacity-75" />
              <div className="absolute -top-1 right-4 w-2 h-2 bg-emerald-green rounded-full animate-pulse" />
              <div className="absolute -bottom-3 right-2 w-2 h-2 bg-lavender-medium rounded-full animate-bounce" />
            </>
          )}
        </div>

        {/* Lottie Animation */}
        <div className="w-56 h-56 md:w-64 md:h-64 mx-auto mb-2 animate-fade-in">
          <Player
            autoplay
            loop
            animationData={lottieAnimation}
            style={{ width: '100%', height: '100%' }}
            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
          />
        </div>

        {/* Headline & Subheadline */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 animate-fade-in-up bg-gradient-to-r from-white via-emerald-green to-white bg-clip-text text-transparent">
            AI-Powered Adaptive Learning
          </h2>
          <p className="text-base md:text-lg text-white/90 animate-fade-in-up delay-100 font-medium">
            Empower your journey with personalized, interactive, and engaging education.
          </p>
        </div>

        {/* Login Buttons */}
        <div className="w-full flex flex-col gap-3 animate-fade-in-up delay-200">
          <Button onClick={() => handleSignIn("teacher")}
            className="w-full bg-gradient-to-r from-lavender-medium to-emerald-green text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/20">
            Login as Teacher
          </Button>
          <Button onClick={() => handleSignIn("student")}
            className="w-full bg-gradient-to-r from-emerald-green to-lavender-dark text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/20">
            Login as Student
          </Button>
        </div>
      </div>

      {/* Enhanced animated background shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-green opacity-30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-24 right-0 w-80 h-80 bg-lavender-medium opacity-25 rounded-full blur-2xl animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-lavender-dark opacity-20 rounded-full blur-2xl animate-pulse-slow" style={{ transform: 'translate(-50%, -50%)' }}></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl animate-float"></div>
      </div>
    </div>
  );
}
