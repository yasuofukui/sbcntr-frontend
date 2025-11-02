import { PetCard } from "~/components/pet-card";
import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { RefreshCw, Home as HomeIcon } from "lucide-react";
import { convertKeysToCamelCase } from "~/lib/utils";
import type { Pet } from "~/types/pet";
import type { Route } from "../../../.react-router/types/app/routes/pets/+types";
import { config } from "~/lib/config";
import { fetchWithRetry } from "~/lib/http";

export async function loader() {
  try {
    const response = await fetchWithRetry(
      new URL(`${config.api.backendUrl}/v1/pets`),
      undefined,
      { timeoutMs: 10_000, retries: 5 }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch pets");
    }

    const data = await response.json();

    // snake_case から camelCase に変換
    const camelCaseResponse = convertKeysToCamelCase<Pet[]>(data.data);

    // ID順でソートして一貫した順序を保つ
    const sortedPets = camelCaseResponse.sort((a, b) => {
      // 数値IDと文字列IDの混在に対応
      const aId = isNaN(Number(a.id)) ? a.id : Number(a.id);
      const bId = isNaN(Number(b.id)) ? b.id : Number(b.id);

      if (typeof aId === "number" && typeof bId === "number") {
        return aId - bId;
      }
      return String(aId).localeCompare(String(bId));
    });

    return { pets: sortedPets };
  } catch (error) {
    console.error("Error fetching /v1/pets:", error);
    throw error;
  }
}

/**
 *
 * @param loaderData
 * @constructor
 */
export default function PetsPage({ loaderData }: Route.ComponentProps) {
  const pets = loaderData?.pets;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {pets?.map(pet => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
}

export function ErrorBoundary(_props: Route.ErrorBoundaryProps) {
  const [availableHeight, setAvailableHeight] = useState<number>();
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // ResizeObserverを使ってヘッダーとフッターの高さを取得し、それをもとにmain要素の高さを計算する
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const headerEl = document.querySelector("header");
    const footerEl = document.querySelector("footer");

    const computeHeight = () => {
      const headerH = headerEl?.getBoundingClientRect().height ?? 0;
      const footerH = footerEl?.getBoundingClientRect().height ?? 0;
      const vh = window.innerHeight;
      const contentH = Math.max(0, vh - headerH - footerH);
      setAvailableHeight(contentH);
    };

    const headerObserver = new ResizeObserver(computeHeight);
    const footerObserver = new ResizeObserver(computeHeight);
    headerEl && headerObserver.observe(headerEl);
    footerEl && footerObserver.observe(footerEl);
    window.addEventListener("resize", computeHeight);

    // 初回計算処理、以降はresizeイベントで計算する
    computeHeight();

    return () => {
      document.documentElement.style.overflow = prevOverflow;
      headerObserver.disconnect();
      footerObserver.disconnect();
      window.removeEventListener("resize", computeHeight);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-orange-50 via-amber-50 to-orange-50" />
      <main
        ref={mainRef as unknown as React.RefObject<any>}
        className="container mx-auto px-6 pt-16 pb-16 flex items-center justify-center overflow-hidden"
        style={availableHeight ? { height: `${availableHeight}px` } : undefined}
      >
        <div className="text-center max-w-xl mx-auto p-8">
          <h2 className="mt-4 text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
            データの取得に失敗しました
          </h2>
          <p className="mt-3 text-gray-700">
            しばらく待ってから、もう一度お試しください。
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              再読み込み
            </Button>
            <Link to="/">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 transition-all duration-300"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                ホームへ
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
