import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import type { Pet } from "~/types/pet";

interface PetDetailsModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
}

export function PetDetailsModal({
  pet,
  isOpen,
  onClose,
}: PetDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{pet.name} の詳細情報</DialogTitle>
          <DialogDescription>
            {pet.breed} ({pet.gender})
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <img
            src={pet.imageUrl || "/placeholder.svg"}
            alt={pet.name}
            className="w-full h-64 object-cover rounded-md"
          />
          <div>
            <h3 className="font-semibold mb-2">基本情報</h3>
            <p>生年月日: {pet.birthDate}</p>
            <p>価格: ¥{pet.price.toLocaleString()}</p>
            <p>お問い合わせ番号: {pet.referenceNumber}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">ショップ情報</h3>
            {/*<p>{pet.shop.name}</p>*/}
            {/*<p>{pet.shop.location}</p>*/}
          </div>
          <div>
            <h3 className="font-semibold mb-2">特徴</h3>
            <div className="flex flex-wrap gap-2">
              {pet.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
