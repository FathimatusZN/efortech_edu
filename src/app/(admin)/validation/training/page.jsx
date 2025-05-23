import { Suspense } from "react";
import ValidationTrainingClient from "./ValidationTrainingClient";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ValidationTrainingPage() {
    return (
        <Suspense fallback={<div className="items-center justify-center"><LoadingSpinner /></div>}>
            <ValidationTrainingClient />
        </Suspense>
    );
}
