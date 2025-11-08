import React from "react";
import { SelectItem } from "@/components/ui/select";
import NIcon from "@/components/NIcon";
import { Label } from "@/components/ui/label";
import { SelectItemType } from "../type";

export interface RenderSelectItemsProps {
  items: (string | SelectItemType)[];
}

const RenderSelectItems: React.FC<RenderSelectItemsProps> = ({ items }) => {
  return (
    <>
      {items.map((item) => {
        const itemValue = typeof item === "string" ? item : item.value;
        const itemLabel = typeof item === "string" ? item : item.label;
        const itemIcon = typeof item === "string" ? null : item.icon;

        return (
          <SelectItem key={itemValue} value={itemValue} className="w-full cursor-pointer">
            {itemIcon ? (
              <div className="relative h-5 flex items-center">
                <NIcon
                  icon={itemIcon}
                  className="absolute h-4 w-4 text-muted-foreground inline-block"
                />
                <Label className="font-normal text-foreground pl-7">{itemLabel}</Label>
              </div>
            ) : (
              itemLabel
            )}
          </SelectItem>
        );
      })}
    </>
  );
};

export default React.memo(RenderSelectItems);