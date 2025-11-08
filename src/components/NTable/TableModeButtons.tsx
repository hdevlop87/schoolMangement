"use client";

import { List, LayoutGrid } from "lucide-react";
import { useTableContext } from "./TableContext";

export function TableModeButtons() {
    const {  setViewMode, showViewToggle } = useTableContext();

    if (!showViewToggle) return null;

    return (
        <div className=" items-center gap-2 hidden lg:flex">
            <div onClick={() => setViewMode('table')} className='flex justify-center items-center cursor-pointer bg-primary h-10  w-10 p-2 rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200'>
                <List className="h-6 w-5 text-white" size={24} />
            </div>

            <div onClick={() => setViewMode('cards')} className='flex justify-center items-center cursor-pointer bg-primary h-10 w-10 p-2 rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200'>
                <LayoutGrid className="h-6 w-5 text-white " size={24} />
            </div>
        </div>
    );
}