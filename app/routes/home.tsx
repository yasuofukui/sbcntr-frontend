import React from "react";
import type { Route } from "./+types/home";
import { Link } from "react-router";
import { config } from "~/lib/config";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Heart,
  PawPrint,
  Star,
  ArrowRight,
  CheckCircle,
  Shield,
  Users
} from "lucide-react";
import umaArai from "~/welcome/uma-arai.png";

export function meta() {
  return [
    { title: "sample web app" },
    { name: "description", content: "Welcome to v2" }
  ];
}

export async function loader() {
  let dataBackendUrl = {
    data: { message: "Hello, API response cannot be used" }
  };
  let dataServiceConnect = {
    data: { message: "Hello, API response cannot be used for service connect" }
  };

  // Backend URL fetch with proper error handling
  try {
    const responseBackendUrl = await fetch(
      `${config.api.backendUrl}/v1/helloworld`
    );
    if (responseBackendUrl.ok) {
      dataBackendUrl = await responseBackendUrl.json();
    }
  } catch (error) {
    console.error("Error fetching data from backend:", error);
  }

  // Service Connect URL fetch with proper error handling
  try {
    const responseServiceConnect = await fetch(
      `${config.api.serviceConnectUrl}/v1/helloworld`
    );
    if (responseServiceConnect.ok) {
      dataServiceConnect = await responseServiceConnect.json();
    }
  } catch (error) {
    console.error("Error fetching data for service connect:", error);
  }

  return {
    message: dataBackendUrl.data.message
  };
}

function HeroSection({ message }: { message: string }) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 via-amber-50 to-orange-50 py-10">
      {/* Animated paw prints background */}
      <div className="absolute inset-0">
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-orange-300/10 to-amber-300/10 rounded-full blur-2xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-yellow-300/10 to-orange-300/10 rounded-full blur-2xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-32 left-32 w-28 h-28 bg-gradient-to-br from-amber-300/10 to-yellow-300/10 rounded-full blur-2xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-20 h-20 bg-gradient-to-br from-orange-300/10 to-amber-300/10 rounded-full blur-2xl animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center h-full flex items-center">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left side - Content */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-orange-100 text-orange-800 border-orange-200"
                >
                  <PawPrint className="w-4 h-4" />
                  アライとウマのお店
                </Badge>

                {/* ここにWelcomeメッセージがはいります！！！ */}
                <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent leading-loose">
                  {message}
                </h1>

                <p className="text-lg text-gray-700 max-w-2xl mx-auto lg:mx-0">
                  ショップへようこそ！
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/pets">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    ペットを探す
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Link to="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 transition-all duration-300"
                  >
                    <PawPrint className="w-5 h-5 mr-2" />
                    ショップについて
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side - Mascot Image */}
            <div className="flex-1 max-w-sm">
              <div className="relative">
                {/* Glowing effect around mascot */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full blur-3xl opacity-20 animate-pulse" />

                {/* Floating paw prints around mascot */}
                <div
                  className="absolute -top-4 -left-4 text-orange-300 animate-bounce"
                  style={{ animationDelay: "0s" }}
                >
                  <PawPrint className="w-5 h-5" />
                </div>
                <div
                  className="absolute -top-2 -right-6 text-amber-300 animate-bounce"
                  style={{ animationDelay: "1s" }}
                >
                  <PawPrint className="w-4 h-4" />
                </div>
                <div
                  className="absolute -bottom-4 -left-6 text-yellow-300 animate-bounce"
                  style={{ animationDelay: "2s" }}
                >
                  <PawPrint className="w-3 h-3" />
                </div>
                <div
                  className="absolute -bottom-2 -right-4 text-orange-300 animate-bounce"
                  style={{ animationDelay: "1.5s" }}
                >
                  <PawPrint className="w-4 h-4" />
                </div>

                <div className="relative bg-gradient-to-br from-white to-orange-50 rounded-3xl p-6 shadow-2xl border border-orange-100">
                  <img
                    src={umaArai}
                    alt="uma-arai mascot - ペットショップのマスコット"
                    className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pet Shop Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: "大リニューアル",
                desc: "最新の内容に合わせて全体を刷新",
                color: "text-green-600"
              },
              {
                icon: Users,
                title: "きめ細やかなイラスト",
                desc: "わかりやすいイラストで学びをサポート！",
                color: "text-blue-600"
              },
              {
                icon: Star,
                title: "アフターケア",
                desc: "購入後も安心のサポート体制",
                color: "text-yellow-600"
              }
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:shadow-lg group"
              >
                <CardContent className="p-4 text-center">
                  <div className="relative">
                    <feature.icon
                      className={`w-10 h-10 mx-auto mb-3 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                    />
                    <PawPrint className="w-3 h-3 absolute -top-1 -right-1 text-orange-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { message } = loaderData;

  return <HeroSection message={message} />;
}
