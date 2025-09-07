import { ActionFunctionArgs } from "react-router";
import { PetCard } from "~/components/pet-card";
import { convertKeysToCamelCase } from "~/lib/utils";
import type { Pet } from "~/types/pet";
import type { Route } from "../../../.react-router/types/app/routes/pets/+types";
import { config } from "~/lib/config";

// サンプルデータ
export const SAMPLE_PETS: Pet[] = [
  {
    id: "1",
    name: "cute cat",
    breed: "brown cat",
    color: "brown",
    gender: "Male",
    price: 360000,
    imageUrl:
      "https://images.unsplash.com/photo-1583083527882-4bee9aba2eea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=777&q=80",
    likes: 10,
    shop: {
      name: "uma-arai shop 2nd",
      location: "Kanagawa"
    },
    birthDate: "2023-10-14",
    referenceNumber: "0000001",
    // features + flag("new") を合わせて tags に入れる例
    tags: ["cute", "famous", "cool", "new"]
  },
  {
    id: "2",
    name: "サイベリアン",
    // 入力で "salePrice: 400000" なのでそちらを採用
    breed: "Siberian cat",
    color: "brown",
    gender: "Female",
    price: 400000,
    imageUrl:
      "https://images.unsplash.com/photo-1586289883499-f11d28aaf52f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8OHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    likes: 3,
    shop: {
      name: "uma-arai shop 2nd",
      location: "Kanagawa"
    },
    birthDate: "2023-10-14",
    referenceNumber: "0000002",
    tags: ["cute", "famous", "cool", "on-sale"]
  },
  {
    id: "3",
    name: "Red cat",
    // details の "color= red" から
    breed: "red cat",
    color: "red",
    gender: "Male",
    price: 240000,
    imageUrl:
      "https://images.unsplash.com/photo-1606491048802-8342506d6471?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTF8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    likes: 7,
    shop: {
      name: "uma-arai shop 2nd",
      location: "Kanagawa"
    },
    birthDate: "2023-10-14",
    referenceNumber: "0000003",
    tags: ["cute", "famous", "cool"]
  },
  {
    id: "4",
    name: "cute kitten",
    // details の "color= white" から
    breed: "white cat",
    color: "white",
    gender: "Female",
    price: 550000,
    imageUrl:
      "https://images.unsplash.com/photo-1605450648855-63f9161b7ef7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODZ8fGtpdHRlbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    likes: 12,
    shop: {
      name: "uma-arai shop 2nd",
      location: "Kanagawa"
    },
    birthDate: "2023-10-14",
    referenceNumber: "0000004",
    tags: ["cute", "famous", "cool"]
  },
  {
    id: "5",
    name: "Matcha",
    // details には "種別=Minuet" があるので breedを Minuet に
    breed: "Minuet",
    color: "touch of white",
    gender: "Male",
    price: 400000,
    imageUrl:
      "https://pbs.twimg.com/media/FaxOK5HUIAANRYo?format=jpg&name=4096x4096",
    likes: 5,
    shop: {
      name: "uma-arai shop 2nd",
      location: "Kanagawa"
    },
    birthDate: "2023-10-14",
    referenceNumber: "0000005",
    // featuresをそのまま
    tags: ["くりくりの目", "きれいな毛並み", "おてんば"]
  },
  {
    id: "uma-chan",
    name: "uma-chan",
    // details の "color= white" から
    breed: "kage",
    color: "brown",
    gender: "Female",
    // salePrice: 49_800_000
    price: 49800000,
    imageUrl:
      "https://images.unsplash.com/photo-1557413606-2a63a06a1f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    likes: 15,
    shop: {
      name: "uma-arai shop 2nd",
      location: "Kanagawa"
    },
    birthDate: "2023-10-14",
    referenceNumber: "0000006",
    tags: ["cute", "famous", "cool"]
  },
  {
    id: "arai-san",
    name: "arai-san",
    color: "brown",
    breed: "white cat",
    gender: "Male",
    price: 50000,
    imageUrl:
      "https://images.unsplash.com/photo-1601247387326-f8bcb5a234d4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    likes: 9,
    shop: {
      name: "uma-arai shop 2nd",
      location: "Kanagawa"
    },
    birthDate: "2023-10-14",
    referenceNumber: "0000007",
    tags: ["cute", "famous", "cool"]
  },
  {
    id: "6",
    name: "cute kitten",
    breed: "white cat",
    color: "white",
    gender: "Female",
    price: 550000,
    imageUrl:
      "https://images.unsplash.com/photo-1597626133663-53df9633b799?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    likes: 2,
    shop: {
      name: "uma-arai shop 2nd",
      location: "Kanagawa"
    },
    birthDate: "2023-10-14",
    referenceNumber: "0000008",
    tags: ["cute", "famous", "cool"]
  },
  {
    id: "7",
    name: "cute kitten",
    breed: "white cat",
    color: "white",
    gender: "Male",
    price: 550000,
    imageUrl:
      "https://images.unsplash.com/photo-1621238281284-d186cb6813fb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGtpdHRlbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    likes: 11,
    shop: {
      name: "uma-arai shop 2nd",
      location: "Kanagawa"
    },
    birthDate: "2023-10-14",
    referenceNumber: "0000009",
    tags: ["cute", "famous", "cool"]
  },
  {
    id: "8",
    name: "cute kitten",
    breed: "white cat",
    color: "white",
    gender: "Female",
    price: 550000,
    imageUrl:
      "https://images.unsplash.com/photo-1557166984-b00337652c94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fGtpdHRlbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    likes: 4,
    shop: {
      name: "uma-arai shop 2nd",
      location: "Kanagawa"
    },
    birthDate: "2023-10-14",
    referenceNumber: "0000010",
    tags: ["cute", "famous", "cool"]
  },
  {
    id: "9",
    name: "cute kitten",
    breed: "white cat",
    color: "white",
    gender: "Male",
    price: 550000,
    imageUrl:
      "https://images.unsplash.com/flagged/photo-1557427161-4701a0fa2f42?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjh8fGtpdHRlbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    likes: 8,
    shop: {
      name: "uma-arai shop 2nd",
      location: "Kanagawa"
    },
    birthDate: "2023-10-14",
    referenceNumber: "0000011",
    tags: ["cute", "famous", "cool"]
  },
  {
    id: "10",
    name: "cute kitten",
    breed: "white cat",
    color: "white",
    gender: "Female",
    price: 550000,
    imageUrl:
      "https://images.unsplash.com/photo-1582797493098-23d8d0cc6769?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NjZ8fGtpdHRlbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    likes: 6,
    shop: {
      name: "uma-arai shop 2nd",
      location: "Kanagawa"
    },
    birthDate: "2023-10-14",
    referenceNumber: "0000012",
    tags: ["cute", "famous", "cool"]
  }
];

export async function loader() {
  try {
    const response = await fetch(`${config.api.backendUrl}/v1/pets`);
    const data = await response.json();
    if (response.ok) {
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
    }
  } catch (error) {
    console.warn(error);
    console.warn("fallback to sample data");

    // サンプルデータもID順でソート
    const sortedSamplePets = [...SAMPLE_PETS].sort((a, b) => {
      const aId = isNaN(Number(a.id)) ? a.id : Number(a.id);
      const bId = isNaN(Number(b.id)) ? b.id : Number(b.id);

      if (typeof aId === "number" && typeof bId === "number") {
        return aId - bId;
      }
      return String(aId).localeCompare(String(bId));
    });

    return { pets: sortedSamplePets };
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
